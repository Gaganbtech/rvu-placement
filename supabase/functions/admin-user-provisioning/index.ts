// supabase/functions/admin-user-provisioning/index.ts
// Secure Placement Cell Provisioning Edge Function for RVU Career Hub
// Enforces server-side authorization, institutional email domain rules, and privileged role assignment.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ProvisionUserPayload {
  email: string;
  fullName: string;
  role: 'student' | 'recruiter' | 'placement';
  studentId?: string;
  school?: string;
  programme?: string;
  companyName?: string;
  department?: string;
  temporaryPassword?: string;
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Missing authorization header.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    const publishableKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(JSON.stringify({ error: 'Server configuration error.' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // 1. Verify Caller Identity & Role using caller's JWT
    const userClient = createClient(supabaseUrl, publishableKey, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user: callerUser }, error: callerError } = await userClient.auth.getUser();
    if (callerError || !callerUser) {
      return new Response(JSON.stringify({ error: 'Invalid or expired session.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Check caller profile in database
    const { data: callerProfile, error: profileError } = await userClient
      .from('profiles')
      .select('role, is_active')
      .eq('auth_user_id', callerUser.id)
      .single();

    if (profileError || !callerProfile || callerProfile.role !== 'placement' || !callerProfile.is_active) {
      return new Response(
        JSON.stringify({ error: 'Access Denied: Only authorized Placement Cell administrators can provision users.' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 2. Parse & Validate Payload
    const body: ProvisionUserPayload = await req.json();
    const email = (body.email || '').trim().toLowerCase();
    const fullName = (body.fullName || '').trim();
    const role = body.role;

    if (!email || !fullName || !role) {
      return new Response(
        JSON.stringify({ error: 'Email, full name, and role are required.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!['student', 'recruiter', 'placement'].includes(role)) {
      return new Response(
        JSON.stringify({ error: 'Invalid role specified.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Enforce Institutional Email Domain for Students & Placement Staff
    const institutionalDomain = Deno.env.get('AUTH_INSTITUTIONAL_EMAIL_DOMAIN') || 'rvu.edu.in';
    if ((role === 'student' || role === 'placement') && !email.endsWith(`@${institutionalDomain}`)) {
      return new Response(
        JSON.stringify({ error: `Institutional policy requirement: ${role} accounts must use an @${institutionalDomain} email address.` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (role === 'recruiter' && !body.companyName) {
      return new Response(
        JSON.stringify({ error: 'Corporate recruiter accounts require a verified company name.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // 3. Privileged Admin Execution (Service Role)
    const adminClient = createClient(supabaseUrl, supabaseServiceKey);

    // Create user in Supabase Auth with authoritative app_metadata
    const { data: newUserAuth, error: createAuthError } = await adminClient.auth.admin.createUser({
      email,
      password: body.temporaryPassword || crypto.randomUUID() + '!Aa1',
      email_confirm: true,
      app_metadata: { role },
      user_metadata: {
        full_name: fullName,
        role,
        student_id: body.studentId || null,
        company_name: body.companyName || null,
        department: body.department || null,
      },
    });

    if (createAuthError) {
      return new Response(
        JSON.stringify({ error: createAuthError.message }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Log the administrative action in audit_logs
    await adminClient.from('audit_logs').insert({
      actor_user_id: callerUser.id,
      actor_role: 'placement',
      action: 'PROVISION_USER',
      entity_type: 'user',
      entity_id: newUserAuth.user.id,
      metadata: {
        provisioned_email: email,
        assigned_role: role,
        provisioned_at: new Date().toISOString(),
      },
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: `Successfully provisioned ${role} account for ${email}.`,
        userId: newUserAuth.user.id,
      }),
      { status: 201, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal provisioning error';
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
