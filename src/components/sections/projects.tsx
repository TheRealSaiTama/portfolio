"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, GitFork, ExternalLink, Github, FileCode, Folder, GitBranch } from "lucide-react";
import { cn } from "@/lib/utils";
import { SectionHeader } from "./section-header";
import SectionWrapper from "../ui/section-wrapper";
import { useGitHubRepos, GitHubRepo, LANGUAGE_COLORS } from "@/hooks/use-github-repos";

const REPOS_PER_PAGE = 6;

// Generate a unique code snippet pattern based on repo
const generateCodeSnippet = (repo: GitHubRepo) => {
  const lang = repo.language?.toLowerCase() || "text";
  const name = repo.name;
  
  const snippets: Record<string, string[]> = {
    typescript: [
      `export const ${toCamelCase(name)} = () => {`,
      `  return <Component {...props} />`,
      `}`
    ],
    javascript: [
      `const ${toCamelCase(name)} = async () => {`,
      `  const data = await fetch(API)`,
      `  return data.json()`,
      `}`
    ],
    python: [
      `class ${toPascalCase(name)}:`,
      `    def __init__(self):`,
      `        self.config = load()`,
      `        self.run()`
    ],
    go: [
      `func ${toPascalCase(name)}() error {`,
      `    ctx := context.Background()`,
      `    return srv.Start(ctx)`,
      `}`
    ],
    rust: [
      `impl ${toPascalCase(name)} {`,
      `    pub fn new() -> Self {`,
      `        Self { initialized: true }`,
      `    }`,
      `}`
    ],
    "c++": [
      `class ${toPascalCase(name)} {`,
      `public:`,
      `    void init() { /* ... */ }`,
      `};`
    ],
    shell: [
      `#!/bin/bash`,
      `${name.toLowerCase().replace(/-/g, "_")}() {`,
      `    echo "Running..."`,
      `}`
    ],
    default: [
      `// ${name}`,
      `// ${repo.description?.slice(0, 30) || "Project"}...`,
      `export default ${toCamelCase(name)}`
    ]
  };

  return snippets[lang] || snippets.default;
};

const toCamelCase = (str: string) => 
  str.replace(/-([a-z])/g, (_, c) => c.toUpperCase()).replace(/^[A-Z]/, c => c.toLowerCase()).replace(/[^a-zA-Z0-9]/g, '');

const toPascalCase = (str: string) => 
  str.split(/[-_]/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('').replace(/[^a-zA-Z0-9]/g, '');

const ProjectsSection = () => {
  const { repos, loading, error } = useGitHubRepos();
  const [currentPage, setCurrentPage] = useState(0);

  const totalPages = Math.ceil(repos.length / REPOS_PER_PAGE);
  const startIndex = currentPage * REPOS_PER_PAGE;
  const currentRepos = repos.slice(startIndex, startIndex + REPOS_PER_PAGE);

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  return (
    <SectionWrapper id="projects" className="max-w-7xl mx-auto min-h-[100vh] py-16 md:py-20">
      <SectionHeader id="projects" title="Projects" desc={`${repos.length} public repositories`} />

      {loading ? (
        <ProjectsLoading />
      ) : error && repos.length === 0 ? (
        <div className="text-center py-20 text-[#8b949e]">
          <p>Failed to load projects. Please try again later.</p>
        </div>
      ) : (
        <div className="relative">
          {/* Navigation */}
          {totalPages > 1 && (
            <>
              <button
                onClick={prevPage}
                className="absolute -left-2 md:-left-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center hover:bg-[#30363d] hover:border-[#8b949e] transition-all"
              >
                <ChevronLeft className="w-5 h-5 text-[#8b949e]" />
              </button>
              <button
                onClick={nextPage}
                className="absolute -right-2 md:-right-14 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-11 md:h-11 rounded-full bg-[#21262d] border border-[#30363d] flex items-center justify-center hover:bg-[#30363d] hover:border-[#8b949e] transition-all"
              >
                <ChevronRight className="w-5 h-5 text-[#8b949e]" />
              </button>
            </>
          )}

          {/* Page dots */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-1.5 mb-6">
              {Array.from({ length: Math.min(totalPages, 10) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={cn(
                    "rounded-full transition-all duration-200",
                    i === currentPage
                      ? "w-6 h-2 bg-[#238636]"
                      : "w-2 h-2 bg-[#30363d] hover:bg-[#484f58]"
                  )}
                />
              ))}
              {totalPages > 10 && <span className="text-[10px] text-[#484f58] ml-1">+{totalPages - 10}</span>}
            </div>
          )}

          {/* Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {currentRepos.map((repo, index) => (
                <ProjectCard key={repo.id} repo={repo} index={index} />
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Page counter */}
          {totalPages > 1 && (
            <div className="text-center mt-5 text-xs text-[#484f58] font-mono">
              {currentPage + 1} / {totalPages}
            </div>
          )}
      </div>
      )}
    </SectionWrapper>
  );
};

const ProjectCard = ({ repo, index }: { repo: GitHubRepo; index: number }) => {
  const langColor = repo.language ? LANGUAGE_COLORS[repo.language] || "#8b949e" : "#8b949e";
  const hasLive = !!repo.homepage;
  const codeSnippet = useMemo(() => generateCodeSnippet(repo), [repo]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className="group"
    >
      <div className="h-full rounded-md bg-[#0d1117] border border-[#30363d] overflow-hidden hover:border-[#8b949e] transition-colors">
        {/* Code snippet header */}
        <div className="relative bg-[#161b22] border-b border-[#30363d] p-3 font-mono text-[10px] leading-relaxed overflow-hidden">
          {/* File tab */}
          <div className="absolute top-0 left-0 flex items-center gap-1.5 px-3 py-1.5 bg-[#0d1117] border-r border-b border-[#30363d] rounded-br-md">
            <FileCode className="w-3 h-3" style={{ color: langColor }} />
            <span className="text-[#e6edf3] text-[10px]">
              {repo.name.toLowerCase()}.{getFileExtension(repo.language)}
            </span>
                </div>
          
          {/* Code lines */}
          <div className="pt-6 space-y-0.5">
            {codeSnippet.map((line, i) => (
              <div key={i} className="flex">
                <span className="w-5 text-right mr-3 text-[#484f58] select-none">{i + 1}</span>
                <span className="text-[#8b949e]">
                  <CodeHighlight code={line} language={repo.language} />
                </span>
              </div>
            ))}
          </div>

          {/* Gradient fade */}
          <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-t from-[#161b22] to-transparent" />
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Header row */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <a
              href={repo.html_url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#58a6ff] hover:underline truncate"
            >
              {repo.name}
            </a>
            <div className="flex items-center gap-2 flex-shrink-0">
              {repo.stargazers_count > 0 && (
                <span className="flex items-center gap-1 text-xs text-[#8b949e]">
                  <Star className="w-3.5 h-3.5" fill="#8b949e" />
                  {repo.stargazers_count}
                </span>
              )}
              {repo.forks_count > 0 && (
                <span className="flex items-center gap-1 text-xs text-[#8b949e]">
                  <GitFork className="w-3.5 h-3.5" />
                  {repo.forks_count}
                </span>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-[#8b949e] line-clamp-2 mb-3 min-h-[40px]">
            {repo.description || "No description provided"}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-3 border-t border-[#21262d]">
            {/* Language */}
            <div className="flex items-center gap-2">
              {repo.language && (
                <>
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: langColor }} />
                  <span className="text-xs text-[#8b949e]">{repo.language}</span>
                </>
          )}
        </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              {hasLive && (
                <a
                  href={repo.homepage!}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#238636] hover:bg-[#2ea043] text-white text-xs font-medium transition-colors"
                >
                  <ExternalLink className="w-3 h-3" />
                  Live
                </a>
              )}
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#21262d] hover:bg-[#30363d] border border-[#30363d] text-[#c9d1d9] text-xs font-medium transition-colors"
              >
                <Github className="w-3 h-3" />
                Code
              </a>
            </div>
          </div>
        </div>
      </div>
          </motion.div>
  );
};

// Simple syntax highlighting
const CodeHighlight = ({ code, language }: { code: string; language: string | null }) => {
  const keywords = ['const', 'let', 'var', 'function', 'async', 'await', 'return', 'export', 'import', 'from', 'class', 'def', 'self', 'pub', 'fn', 'impl', 'func', 'package', 'public', 'private', 'void', 'int', 'string', 'if', 'else', 'for', 'while', 'new', 'echo'];
  const types = ['Self', 'String', 'bool', 'true', 'false', 'null', 'None', 'nil', 'error'];
  
  const parts = code.split(/(\s+|[{}()[\]<>.,;:=])/);
  
  return (
    <>
      {parts.map((part, i) => {
        if (keywords.includes(part)) {
          return <span key={i} className="text-[#ff7b72]">{part}</span>;
        }
        if (types.includes(part)) {
          return <span key={i} className="text-[#79c0ff]">{part}</span>;
        }
        if (part.startsWith('"') || part.startsWith("'") || part.startsWith('`')) {
          return <span key={i} className="text-[#a5d6ff]">{part}</span>;
        }
        if (part.startsWith('//') || part.startsWith('#')) {
          return <span key={i} className="text-[#8b949e] italic">{part}</span>;
        }
        if (/^[A-Z][a-zA-Z]*$/.test(part)) {
          return <span key={i} className="text-[#ffa657]">{part}</span>;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
};

const getFileExtension = (language: string | null): string => {
  const extensions: Record<string, string> = {
    TypeScript: "ts",
    JavaScript: "js",
    Python: "py",
    Go: "go",
    Rust: "rs",
    "C++": "cpp",
    C: "c",
    Java: "java",
    Ruby: "rb",
    PHP: "php",
    Swift: "swift",
    Kotlin: "kt",
    Shell: "sh",
    HTML: "html",
    CSS: "css",
  };
  return extensions[language || ""] || "txt";
};

const ProjectsLoading = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="rounded-md bg-[#0d1117] border border-[#30363d] overflow-hidden animate-pulse">
          <div className="h-24 bg-[#161b22]" />
          <div className="p-4 space-y-3">
            <div className="h-5 w-2/3 bg-[#21262d] rounded" />
            <div className="h-4 w-full bg-[#21262d] rounded" />
            <div className="h-4 w-4/5 bg-[#21262d] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProjectsSection;
