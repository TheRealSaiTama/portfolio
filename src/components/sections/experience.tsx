"use client";

import { EXPERIENCE, SkillNames, SKILLS } from "@/data/constants";
import { SectionHeader } from "./section-header";
import { cn } from "@/lib/utils";
import SectionWrapper from "../ui/section-wrapper";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ExperienceSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % EXPERIENCE.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + EXPERIENCE.length) % EXPERIENCE.length);
  };

  return (
    <SectionWrapper className="flex flex-col items-center justify-center min-h-[100vh] py-16 md:py-20 z-10">
      <div className="w-full max-w-5xl px-4 md:px-8 mx-auto">
        <SectionHeader
          id="experience"
          title="Experience"
          desc="My professional journey."
          className="mb-10 md:mb-16 mt-0"
        />

        <div className="relative">
          {/* Navigation Arrows */}
          <div className="absolute -left-4 md:-left-16 top-1/2 -translate-y-1/2 z-20">
            <button
              onClick={prevSlide}
              className={cn(
                "group p-2 md:p-3 rounded-full",
                "bg-white/5 hover:bg-white/10 backdrop-blur-sm",
                "border border-white/10 hover:border-cyan-500/50",
                "transition-all duration-300",
                "hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20"
              )}
              aria-label="Previous experience"
            >
              <ChevronLeft className="w-5 h-5 md:w-6 md:h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </button>
          </div>

          <div className="absolute -right-4 md:-right-16 top-1/2 -translate-y-1/2 z-20">
            <button
              onClick={nextSlide}
              className={cn(
                "group p-2 md:p-3 rounded-full",
                "bg-white/5 hover:bg-white/10 backdrop-blur-sm",
                "border border-white/10 hover:border-cyan-500/50",
                "transition-all duration-300",
                "hover:scale-110 hover:shadow-lg hover:shadow-cyan-500/20"
              )}
              aria-label="Next experience"
            >
              <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-400 group-hover:text-cyan-400 transition-colors" />
            </button>
            </div>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-2 mb-6">
            {EXPERIENCE.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  index === currentIndex
                    ? "w-8 bg-gradient-to-r from-cyan-500 to-purple-500"
                    : "w-1.5 bg-white/20 hover:bg-white/40"
                )}
                aria-label={`Go to experience ${index + 1}`}
              />
            ))}
          </div>

          {/* Cards Container */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="wait">
              <ExperienceCard
                key={EXPERIENCE[currentIndex].id}
                experience={EXPERIENCE[currentIndex]}
                index={currentIndex}
              />
            </AnimatePresence>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
};

const ExperienceCard = ({
  experience,
  index,
}: {
  experience: (typeof EXPERIENCE)[0];
  index: number;
}) => {
  const isPresent = experience.endDate === "Present";

  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -50 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="relative"
    >
      {/* Animated gradient background blob */}
      <div className="absolute -inset-4 md:-inset-8 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10 rounded-3xl blur-3xl opacity-50 animate-pulse" />

      <div className="relative">
        {/* Main card */}
        <div
        className={cn(
            "relative overflow-hidden rounded-2xl md:rounded-3xl",
            "bg-gradient-to-br from-slate-900/90 via-slate-800/90 to-slate-900/90",
            "dark:from-slate-900/80 dark:via-slate-800/80 dark:to-slate-900/80",
            "backdrop-blur-xl border border-white/10",
            "shadow-2xl shadow-black/20"
        )}
      >
          {/* Inner content container */}
          <div className="relative p-6 md:p-10">
            {/* Header section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div className="space-y-2">
                {/* Status indicator */}
                {isPresent && (
                  <div className="flex items-center gap-2 mb-3">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                    </span>
                    <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                      Currently Active
                    </span>
                  </div>
                )}

                <h3 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                {experience.title}
                </h3>
                <p className="text-lg text-cyan-400 font-medium">{experience.company}</p>
              </div>

              {/* Date badge */}
              <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
                <svg
                  className="w-4 h-4 text-purple-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-sm font-mono text-slate-300">
                  {experience.startDate} — {experience.endDate}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 mb-8">
            {experience.description.map((point, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 + i * 0.1 }}
                  className="flex items-start gap-3 p-3 md:p-4 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <div className="flex-shrink-0 w-2 h-2 rounded-full bg-gradient-to-br from-cyan-500 to-purple-500 mt-2" />
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed group-hover:text-white transition-colors">
                    {point}
                  </p>
                </motion.div>
            ))}
            </div>

            {/* Tech stack with glow effect */}
            <div className="space-y-4">
              <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Tech Stack
              </h4>
              <div className="flex flex-wrap gap-2 md:gap-3">
                {experience.skills.map((skillName, i) => {
              const skill = SKILLS[skillName as SkillNames];
              return (
                    <motion.div
                  key={skillName}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{
                        duration: 0.3,
                        delay: 0.2 + i * 0.05,
                        type: "spring",
                        stiffness: 200,
                      }}
                      className="group relative"
                    >
                      {/* Lightning glow effect on hover */}
                      <div 
                        className="absolute -inset-1 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-md"
                        style={{
                          background: `linear-gradient(135deg, ${skill.color}80, ${skill.color}40)`,
                          boxShadow: `0 0 20px ${skill.color}60, 0 0 40px ${skill.color}40`,
                        }}
                      />
                      <div 
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                        style={{
                          boxShadow: `inset 0 0 15px ${skill.color}30`,
                        }}
                      />
                      <div 
                        className={cn(
                          "relative flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 rounded-xl",
                          "bg-white/10 border border-white/10",
                          "transition-all duration-300 cursor-default",
                          "group-hover:border-transparent group-hover:bg-white/20"
                        )}
                        style={{
                          // Add subtle border glow on hover
                        }}
                >
                  <img
                    src={skill.icon}
                    alt={skill.label}
                          className="w-4 h-4 md:w-5 md:h-5 object-contain transition-transform duration-300 group-hover:scale-110"
                  />
                        <span 
                          className="text-xs md:text-sm font-medium text-white transition-all duration-300"
                          style={{
                            textShadow: 'none',
                          }}
                        >
                  {skill.label}
                        </span>
                        {/* Lightning spark effect */}
                        <div className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none">
                            <path
                              d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
                              fill={skill.color}
                              className="animate-pulse"
                            />
                          </svg>
                        </div>
                      </div>
                    </motion.div>
              );
            })}
              </div>
            </div>
          </div>

          {/* Decorative corner accents */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-cyan-500/20 to-transparent rounded-bl-full" />
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-500/20 to-transparent rounded-tr-full" />
        </div>
      </div>
    </motion.div>
  );
};

export default ExperienceSection;
