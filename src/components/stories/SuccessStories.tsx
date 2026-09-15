import React, { useState } from 'react';
import { STUDENT_SUCCESS_STORIES } from '../../data/stories';
import { ArrowRight, Award, User, ChevronLeft, ChevronRight } from 'lucide-react';

export const SuccessStories: React.FC = () => {
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);

  const nextStory = () => {
    setActiveStoryIndex((prev) => (prev + 1) % STUDENT_SUCCESS_STORIES.length);
  };

  const prevStory = () => {
    setActiveStoryIndex((prev) => (prev - 1 + STUDENT_SUCCESS_STORIES.length) % STUDENT_SUCCESS_STORIES.length);
  };

  return (
    <section id="stories" className="relative py-24 bg-navy overflow-hidden border-b border-gold-border/40">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-tech-circuit opacity-30 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-14">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-faint border border-gold/30 mb-4">
              <Award className="w-3.5 h-3.5 text-gold" />
              <span className="text-xs font-semibold tracking-wider uppercase text-gold">
                ALUMNI & CANDIDATE EXCELLENCE
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-rvu-text font-display tracking-tight">
              FROM RVU TO THE WORLD
            </h2>
            <p className="text-base text-rvu-muted mt-2 max-w-xl">
              Hear from graduates who transformed their academic foundations into competitive industry careers.
            </p>
          </div>

          {/* Slider navigation controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={prevStory}
              className="p-2.5 rounded-xl bg-navy-surface border border-gold/30 text-rvu-muted hover:text-gold hover:border-gold transition-colors"
              aria-label="Previous story"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={nextStory}
              className="p-2.5 rounded-xl bg-navy-surface border border-gold/30 text-rvu-muted hover:text-gold hover:border-gold transition-colors"
              aria-label="Next story"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Stories Cards Grid (Desktop & Tablet) / Scrollable on Mobile */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {STUDENT_SUCCESS_STORIES.map((story, index) => {
            const isFeatured = index === activeStoryIndex;
            return (
              <div
                key={story.id}
                onClick={() => setActiveStoryIndex(index)}
                className={`group card-glass rounded-2xl p-6 transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                  isFeatured 
                    ? 'border-gold shadow-gold-glow -translate-y-2' 
                    : 'hover:border-gold/50 hover:-translate-y-1'
                }`}
              >
                <div>
                  {/* Student Photo Placeholder Avatar with RVU crest motif */}
                  <div className="flex items-center gap-3.5 mb-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gold/30 to-navy-dark border border-gold/40 flex items-center justify-center text-gold shrink-0">
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-rvu-text group-hover:text-gold transition-colors">
                        {story.studentName}
                      </h4>
                      <p className="text-[11px] text-gold font-mono">
                        {story.year}
                      </p>
                    </div>
                  </div>

                  {/* Program & School */}
                  <div className="mb-4">
                    <span className="text-xs font-semibold text-rvu-text block">
                      {story.program}
                    </span>
                    <span className="text-[11px] text-rvu-muted truncate block">
                      {story.school}
                    </span>
                  </div>

                  {/* Quote */}
                  <div className="relative pl-3 border-l-2 border-gold/40 mb-5">
                    <p className="text-xs text-rvu-muted italic leading-relaxed">
                      "{story.quote}"
                    </p>
                  </div>
                </div>

                {/* Card Bottom: Placement Outcome Slot */}
                <div className="pt-3 border-t border-gold-border/40">
                  <span className="text-[10px] text-rvu-subtle uppercase block tracking-wider">Secured Role</span>
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-rvu-text font-mono truncate">{story.role}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gold-faint text-gold border border-gold/20 shrink-0 font-mono">
                      {story.packageTier}
                    </span>
                  </div>
                  <span className="text-[11px] text-rvu-muted block mt-0.5">
                    {story.company}
                  </span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom CTA Row */}
        <div className="mt-12 text-center">
          <a
            href="#opportunities"
            className="inline-flex items-center gap-2 text-sm font-semibold text-gold hover:text-gold-highlight hover:underline"
          >
            <span>Explore Opportunities for Current Students</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </div>
    </section>
  );
};
