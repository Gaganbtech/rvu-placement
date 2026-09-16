# RVU CAREER HUB — Supabase Authentication & Dashboard Setup Guide

This guide details the step-by-step configuration required in the **Supabase Dashboard** to enable **Real Passwordless Email Magic Link Authentication** for RVU Career Hub.

---

## 1. Prerequisites: Project Credentials

1. Go to your [Supabase Dashboard](https://supabase.com/dashboard).
2. Open your project or create a new project.
3. In the left navigation, go to **Project Settings** (gear icon) $\rightarrow$ **API**.
4. Copy the following values:
   - **Project URL** (e.g., `https://abcdefghijklm.supabase.co`)
   - **anon / public** API Key (e.g., `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

5. Open your local `.env` file (at the root of `rvu-placement`):
   ```env
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-actual-anon-public-key
   VITE_AUTH_MODE=development
   VITE_ALLOW_ANY_EMAIL=true
   VITE_AUTH_INSTITUTIONAL_EMAIL_DOMAIN=rvu.edu.in
   ```

> [!WARNING]
> **Never** place `service_role` keys, database passwords, or SMTP secrets into `.env` or any `VITE_*` variable. Only public anon keys belong in the client application.

---

## 2. Supabase Dashboard URL Configuration

Because security requires verifying callback origins, Supabase will reject redirects that are not explicitly whitelisted.

1. In Supabase Dashboard, navigate to:
   **Authentication** $\rightarrow$ **URL Configuration**
2. Configure the following:
   - **Site URL**:
     ```
     http://localhost:5173
     ```
   - **Redirect URLs** (click "Add URL"):
     ```
     http://localhost:5173/auth/callback
     ```
3. Click **Save**.

### Production Deployment Note:
When you deploy RVU Career Hub to production:
- Update **Site URL** to your production domain (e.g., `https://careers.rvu.edu.in`).
- Add your production callback URL to **Redirect URLs**:
  `https://careers.rvu.edu.in/auth/callback`

---

## 3. Enable Email Authentication & Magic Links

1. In Supabase Dashboard, navigate to:
   **Authentication** $\rightarrow$ **Providers** $\rightarrow$ **Email**
2. Ensure the following settings:
   - **Enable Email provider**: **ON**
   - **Confirm email**: Recommended **ON** (or default)
   - **Secure email change**: Enabled
   - **Allow passwordless (magic link / OTP) sign-ins**: **ON**
3. Save changes.

---

## 4. Email Template Configuration

To ensure the email matches the RVU Career Hub brand and clearly provides the confirmation link:

1. In Supabase Dashboard, navigate to:
   **Authentication** $\rightarrow$ **Email Templates** $\rightarrow$ **Magic Link**
2. Configure:

### Subject:
```
Confirm your RVU Career Hub sign-in
```

### HTML Body:
```html
<div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 540px; margin: 0 auto; padding: 32px 24px; background-color: #101A22; color: #FFFFFF; border-radius: 16px; border: 1px solid #CCAA68;">
  <div style="text-align: center; margin-bottom: 24px;">
    <h1 style="color: #CCAA68; font-size: 22px; margin: 0 0 6px; letter-spacing: 1px;">RVU CAREER HUB</h1>
    <p style="color: #D8B978; font-size: 13px; margin: 0; font-style: italic;">Where Talent Meets Opportunity</p>
  </div>
  
  <div style="background-color: #19252F; padding: 24px; border-radius: 12px; border: 1px solid rgba(204, 170, 104, 0.2); margin-bottom: 24px;">
    <h2 style="color: #FFFFFF; font-size: 18px; margin: 0 0 12px;">Confirm your sign-in</h2>
    <p style="color: #AEB7BC; font-size: 14px; line-height: 1.6; margin: 0 0 20px;">
      A sign-in request was made for RVU Career Hub. Click the button below to securely continue to your portal.
    </p>
    
    <div style="text-align: center; margin: 28px 0;">
      <a href="{{ .ConfirmationURL }}" 
         style="background: linear-gradient(135deg, #CCAA68, #D8B978); color: #101A22; font-weight: bold; font-size: 14px; text-decoration: none; padding: 14px 32px; border-radius: 10px; display: inline-block; letter-spacing: 0.5px;">
        CONFIRM LOGIN
      </a>
    </div>
    
    <p style="color: #AEB7BC; font-size: 12px; line-height: 1.5; margin: 0;">
      If you did not request this login, you can safely ignore this email.
    </p>
  </div>
  
  <p style="color: #718096; font-size: 11px; text-align: center; margin: 0;">
    RV University Placement & Career Advisory Services • Bengaluru, India
  </p>
</div>
```

3. Click **Save**.

---

## 5. Email Deliverability & Custom SMTP (Important for Gmail)

### How It Works:
The RVU Career Hub React frontend does **not** send emails directly. Instead, it calls:
```typescript
supabase.auth.signInWithOtp({
  email,
  options: {
    emailRedirectTo: 'http://localhost:5173/auth/callback'
  }
})
```
Supabase's auth service creates a secure one-time cryptographic token and dispatches the email to Gmail.

### Free Tier Rate Limits:
- Supabase's built-in email service is rate-limited to approximately **3 to 4 emails per hour** for development projects.
- In addition, emails sent via the default sender may land in the user's **Spam / Junk** folder in Gmail.

### Recommended Custom SMTP Setup:
For production or frequent testing without rate-limit constraints, configure a custom SMTP provider (e.g. **Resend**, **SendGrid**, **Amazon SES**, or **Google Workspace**):
1. In Supabase Dashboard, go to **Project Settings** $\rightarrow$ **Authentication** $\rightarrow$ **SMTP Settings**.
2. Enable **Custom SMTP**.
3. Fill in:
   - **Sender Email**: `careers@rvu.edu.in` (or your verified sender address)
   - **Sender Name**: `RVU Career Hub`
   - **Host**, **Port** (usually `587` or `465`)
   - **Username** and **Password** (your SMTP provider's API key)
4. Save and send a test email.

---

## 6. End-to-End Verification Checklist

Once you enter your credentials into `.env`:

1. Start the Vite development server:
   ```bash
   npm run dev
   ```
2. Navigate to: `http://localhost:5173`
3. Click **Student Portal** (or Recruiter / Placement Cell).
4. Enter your email (e.g. `gagan@gmail.com`).
5. Click **SEND LOGIN LINK**.
6. Open your email inbox (and spam folder) $\rightarrow$ Find email: **Confirm your RVU Career Hub sign-in**.
7. Click **CONFIRM LOGIN**.
8. Browser will open `http://localhost:5173/auth/callback`, complete code exchange via PKCE, and route you directly to `/student`.
