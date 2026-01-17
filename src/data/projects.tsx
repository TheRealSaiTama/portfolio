import AceTernityLogo from "@/components/logos/aceternity";
import SlideShow from "@/components/slide-show";
import { Button } from "@/components/ui/button";
import { TypographyH3, TypographyP } from "@/components/ui/typography";
import { ArrowUpRight, ExternalLink, Link2, MoveUpRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { ReactNode } from "react";
import { RiNextjsFill, RiNodejsFill, RiReactjsFill, RiSettings4Fill } from "react-icons/ri";
import {
  SiChakraui,
  SiDocker,
  SiExpress,
  SiFirebase,
  SiJavascript,
  SiMongodb,
  SiPostgresql,
  SiPrisma,
  SiPython,
  SiPytorch,
  SiReactquery,
  SiSanity,
  SiShadcnui,
  SiSocketdotio,
  SiSupabase,
  SiTailwindcss,
  SiThreedotjs,
  SiTypescript,
  SiVuedotjs,
} from "react-icons/si";
import { TbBrandFramerMotion } from "react-icons/tb";

const BASE_PATH = "/assets/projects-screenshots";

const ProjectsLinks = ({ live, repo }: { live: string; repo?: string }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-start gap-3 my-3 mb-8">
      {live && <Link
        className="font-mono underline flex gap-2"
        rel="noopener"
        target="_new"
        href={live}
      >
        <Button variant={"default"} size={"sm"}>
          Visit Website
          <ArrowUpRight className="ml-3 w-5 h-5" />
        </Button>
      </Link>}
      {repo && (
        <Link
          className="font-mono underline flex gap-2"
          rel="noopener"
          target="_new"
          href={repo}
        >
          <Button variant={"default"} size={"sm"}>
            Github
            <ArrowUpRight className="ml-3 w-5 h-5" />
          </Button>
        </Link>
      )}
    </div>
  );
};

export type Skill = {
  title: string;
  bg: string;
  fg: string;
  icon: ReactNode;
};

const PROJECT_SKILLS = {
  next: {
    title: "Next.js",
    bg: "black",
    fg: "white",
    icon: <RiNextjsFill />,
  },
  chakra: {
    title: "Chakra UI",
    bg: "black",
    fg: "white",
    icon: <SiChakraui />,
  },
  node: {
    title: "Node.js",
    bg: "black",
    fg: "white",
    icon: <RiNodejsFill />,
  },
  python: {
    title: "Python",
    bg: "black",
    fg: "white",
    icon: <SiPython />,
  },
  pytorch: {
    title: "PyTorch",
    bg: "black",
    fg: "white",
    icon: <SiPytorch />,
  },
  automation: {
    title: "Automation",
    bg: "black",
    fg: "white",
    icon: <RiSettings4Fill />,
  },
  prisma: {
    title: "prisma",
    bg: "black",
    fg: "white",
    icon: <SiPrisma />,
  },
  postgres: {
    title: "PostgreSQL",
    bg: "black",
    fg: "white",
    icon: <SiPostgresql />,
  },
  mongo: {
    title: "MongoDB",
    bg: "black",
    fg: "white",
    icon: <SiMongodb />,
  },
  express: {
    title: "Express",
    bg: "black",
    fg: "white",
    icon: <SiExpress />,
  },
  reactQuery: {
    title: "React Query",
    bg: "black",
    fg: "white",
    icon: <SiReactquery />,
  },
  shadcn: {
    title: "ShanCN UI",
    bg: "black",
    fg: "white",
    icon: <SiShadcnui />,
  },
  aceternity: {
    title: "Aceternity",
    bg: "black",
    fg: "white",
    icon: <AceTernityLogo />,
  },
  tailwind: {
    title: "Tailwind",
    bg: "black",
    fg: "white",
    icon: <SiTailwindcss />,
  },
  docker: {
    title: "Docker",
    bg: "black",
    fg: "white",
    icon: <SiDocker />,
  },
  yjs: {
    title: "Y.js",
    bg: "black",
    fg: "white",
    icon: (
      <span>
        <strong>Y</strong>js
      </span>
    ),
  },
  firebase: {
    title: "Firebase",
    bg: "black",
    fg: "white",
    icon: <SiFirebase />,
  },
  sockerio: {
    title: "Socket.io",
    bg: "black",
    fg: "white",
    icon: <SiSocketdotio />,
  },
  js: {
    title: "JavaScript",
    bg: "black",
    fg: "white",
    icon: <SiJavascript />,
  },
  ts: {
    title: "TypeScript",
    bg: "black",
    fg: "white",
    icon: <SiTypescript />,
  },
  vue: {
    title: "Vue.js",
    bg: "black",
    fg: "white",
    icon: <SiVuedotjs />,
  },
  react: {
    title: "React.js",
    bg: "black",
    fg: "white",
    icon: <RiReactjsFill />,
  },
  sanity: {
    title: "Sanity",
    bg: "black",
    fg: "white",
    icon: <SiSanity />,
  },
  spline: {
    title: "Spline",
    bg: "black",
    fg: "white",
    icon: <SiThreedotjs />,
  },
  gsap: {
    title: "GSAP",
    bg: "black",
    fg: "white",
    icon: "",
  },
  framerMotion: {
    title: "Framer Motion",
    bg: "black",
    fg: "white",
    icon: <TbBrandFramerMotion />,
  },
  supabase: {
    title: "Supabase",
    bg: "black",
    fg: "white",
    icon: <SiSupabase />,
  },
};

export type Project = {
  id: string;
  category: string;
  title: string;
  src: string;
  screenshots: string[];
  skills: { frontend: Skill[]; backend: Skill[] };
  content: React.ReactNode | any;
  github?: string;
  live: string;
};

const projects: Project[] = [
  {
    id: "bananas-bot",
    category: "AI Bot",
    title: "Bananas Bot",
    src: "/assets/projects-screenshots/portfolio/projects.png", // Placeholder
    screenshots: ["landing.png"], // Placeholder keys
    skills: {
      frontend: [
        PROJECT_SKILLS.ts,
        PROJECT_SKILLS.node,
      ],
      backend: [
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.automation,
      ],
    },
    live: "", // No live link found
    github: "https://github.com/TheRealSaiTama/bananas-bot",
    get content() {
      return (
        <div>
          <TypographyP className="font-mono text-2xl text-center">
            Summon @bananas and let the magic happen.
          </TypographyP>
          <TypographyP className="font-mono ">
            A fun and interactive bot that processes images with banana-themed powered edits. 
            Built with TypeScript, it demonstrates efficient image manipulation and bot interaction flows.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Features</TypographyH3>
           <ul className="list-disc ml-6">
            <li className="font-mono">
              <strong>Image Edits:</strong> Automated image processing triggered by user mentions.
            </li>
            <li className="font-mono">
              <strong>Interactive:</strong> Reacts to specific commands in real-time.
            </li>
          </ul>
          <SlideShow
            images={[
              `${BASE_PATH}/portfolio/projects.png`, // Placeholder
            ]}
          />
        </div>
      );
    },
  },
  {
    id: "primetrade",
    category: "FinTech / Data Analysis",
    title: "PrimeTrade Analysis",
    src: "/assets/projects-screenshots/portfolio/projects.png", // Placeholder
    screenshots: ["1.png"],
    live: "",
    github: "https://github.com/TheRealSaiTama/primetrade",
    skills: {
      frontend: [
        PROJECT_SKILLS.python,
      ],
      backend: [
        PROJECT_SKILLS.python,
        PROJECT_SKILLS.postgres, 
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            An advanced analytical tool correlating Trader performance with Bitcoin Fear & Greed sentiment.
            Uses Hyperliquid historical data to uncover hidden patterns, win-rates, and order-level PnL.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <TypographyH3 className="my-4 mt-8">Key Metrics</TypographyH3>
          <ul className="list-disc ml-6">
            <li className="font-mono">
              <strong>Sentiment Analysis:</strong> Correlates market mood with trading outcomes.
            </li>
            <li className="font-mono">
              <strong>Performance Tracking:</strong> Detailed breakdown of PnL and returns.
            </li>
          </ul>
          <SlideShow images={[`${BASE_PATH}/portfolio/projects.png`]} />
        </div>
      );
    },
  },
  {
    id: "upwork-automation",
    category: "Automation",
    title: "Upwork Automation",
    src: "/assets/projects-screenshots/portfolio/projects.png", // Placeholder
    screenshots: ["1.png"],
    live: "",
    github: "https://github.com/TheRealSaiTama/Upwork-Automation",
    skills: {
      frontend: [
        PROJECT_SKILLS.automation,
      ],
      backend: [
        PROJECT_SKILLS.node,
        PROJECT_SKILLS.python, 
      ],
    },
    get content() {
      return (
        <div>
          <TypographyP className="font-mono ">
            Production-grade automation workflow designed to streamline Upwork processes. 
            Leverages n8n and custom scripts to handle repetitive tasks efficiently.
          </TypographyP>
          <ProjectsLinks live={this.live} repo={this.github} />
          <SlideShow images={[`${BASE_PATH}/portfolio/projects.png`]} />
        </div>
      );
    },
  },
];
export default projects;
