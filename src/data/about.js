import { ALL_TOOLS } from "../data/tools";

const icons = {
  Speed: { path: "M13 2L3 14h9l-1 8 10-12h-9l1-8z", color: "var(--accent)" },
  Privacy: { path: "M12 2L4 6v6c0 5 3.5 9.7 8 11 4.5-1.3 8-6 8-11V6L12 2z", color: "var(--accent3)" },
  Simplicity: { path: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z", color: "var(--accent5)" },
  Power: { path: "M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z", color: "var(--accent4)" },
};

const techStack = [
  { name: "React 19", color: "#61dafb" },
  { name: "Vite 8", color: "#646cff" },
  { name: "Pollinations.ai", color: "#3fe8a0" },
  { name: "Web Crypto API", color: "#ffba3b" },
  { name: "PWA / Workbox", color: "#ff5f7e" },
  { name: "GitHub Pages", color: "#8888a8" },
];

const goals = [
  ["Speed", "Speed", "Every tool responds instantly — no loading, no waiting."],
  ["Privacy", "Privacy", "Your data never leaves your browser. Nothing stored on servers."],
  ["Simplicity", "Simplicity", "Clean, distraction-free UI that gets out of your way."],
  ["Power", "Power", "Deep functionality for developers, designers, and creators."],
];

const roadmap = [
  { s: "done", l: "Dark & Light theme + custom palettes" },
  { s: "done", l: "Favourites & sidebar personalisation" },
  { s: "done", l: "AI Text Enhancer (Pollinations.ai — free)" },
  { s: "done", l: "PWA — install & use offline" },
  { s: "done", l: "Tool usage history" },
  { s: "done", l: "Import/Export settings presets" },
  { s: "done", l: "Keyboard shortcut navigator" },
  { s: "plan", l: "Browser extension" },
  { s: "plan", l: "More AI modes (image, code review)" },
];

const tags = [`${ALL_TOOLS.length} Tools`, "100% Local", "Open Source", "Privacy First", "PWA Ready", "Free AI"];

const personal = {
  name: "André Matias",
  role: "Full Stack Developer",
  location: "Moita, Setúbal, Portugal 🇵🇹",
  description: "Software Engineer at INSTICC and co-founder of Code Lusitan. Passionate about building fast, privacy-first developer tools. Currently expanding into AI development and Cybersecurity.",
  links: [
    { label: "GitHub", url: "https://github.com/Amatias13" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/andre-matias-dev/" },
    { label: "Portfolio", url: "https://amatias13.github.io/Portfolio/" },
    { label: "ConvertLab repo", url: "https://github.com/Amatias13/ConvertLab" },
  ],
};

export { icons, techStack, goals, roadmap, tags, personal };
