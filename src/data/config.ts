const config = {
  title: "Keshav Kumar Jha | Full-Stack & AIML Developer",
  description: {
    long: "Explore the portfolio of Keshav Kumar Jha, a Full-Stack and AIML Developer specializing in building scalable web applications and intelligent systems. delivering high-quality solutions.",
    short:
      "Discover the portfolio of Keshav Kumar Jha, a Full-Stack and AIML Developer creating innovative web and AI solutions.",
  },
  keywords: [
    "Keshav Kumar Jha",
    "portfolio",
    "full-stack developer",
    "AIML developer",
    "web development",
    "AI solutions",
    "interactive websites",
    "React",
    "Next.js",
    "Machine Learning",
  ],
  author: "Keshav Kumar Jha",
  email: "keshavsde@gmail.com",
  site: "https://therealsaitama.github.io",

  // for github stars button
  githubUsername: "TheRealSaiTama",
  githubRepo: "portfolio",

  get ogImg() {
    return this.site + "/assets/seo/og-image.png";
  },
  social: {
    twitter: "https://x.com/CodesPasta",
    linkedin: "https://www.linkedin.com/in/therealsaitama/",
    instagram: "https://www.instagram.com/stillhatetrigo/",
    facebook: "",
    github: "https://github.com/TheRealSaiTama",
  },
};
export { config };
