// All of the site's text, links and photos live in this file.
// To add a photo, put the image in /public and set the matching `photo` field,
// for example: photo: "/photos/portrait.jpg". Empty slots show a placeholder.
import type { IconType } from "react-icons";
import {
  PiEnvelopeSimpleDuotone,
  PiGithubLogoDuotone,
  PiInstagramLogoDuotone,
  PiLinkedinLogoDuotone,
} from "react-icons/pi";
import {
  SiClaude,
  SiCss,
  SiFastapi,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiOpenjdk,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiUnity,
} from "react-icons/si";

export const heroTagline = "SO NE TI E JASNO??";

export const about: {
  name: string;
  subtitle: string;
  bio: string;
  photo?: string;
} = {
  name: "Luka Georgieski",
  subtitle: "CS student from Macedonia, studying in Slovenia",
  bio: "I like whiskey, Formula 1, and League of Legends — but if you want my professional passions, feel free to scroll down. It's nice to meet you!",
};

export type ExperienceItem = {
  /** Position on the timeline, as a decimal year (2025.5 is mid-2025). */
  date: number;
  label: string;
  sub: string;
  title: string;
  meta: string;
  peek: string;
  detail: string;
  photo?: string;
};

export const experience: ExperienceItem[] = [
  {
    date: 2025.5,
    label: "IAESTE LC Koper",
    sub: "President · 2025–Present",
    title: "IAESTE LC Koper — President",
    meta: "2025–Present",
    peek: "Leading the IAESTE Local Committee in Koper.",
    detail:
      "IAESTE places students in paid technical internships abroad. As president of the Koper local committee I run the committee itself — its people, partners and events at the University of Primorska.",
  },
  {
    date: 2025.78,
    label: "Google Developer Group",
    sub: "Event Coordinator · 2025–Present",
    title:
      "Google Developer Group, University of Primorska — Event Coordinator",
    meta: "2025–Present",
    peek: "Coordinating events for the university GDG chapter.",
    detail:
      "Planning and running the chapter’s developer events on campus — talks, workshops and community nights for students at the University of Primorska.",
  },
  {
    date: 2026.3,
    label: "FAMNIT Hackathon 2026",
    sub: "2nd Place · Sea Oasis",
    title: "FAMNIT Hackathon 2026 — 2nd Place",
    meta: "Sea Oasis Visibility Forecast",
    peek: "Second place with an underwater-visibility forecast.",
    detail:
      "Built for YouSea, a marine-conservation organisation: an ML model predicting water clarity from weather, tide, wind and moon data, validated against a custom solar-powered turbidity and wave sensor prototype.",
  },
  {
    date: 2025.25,
    label: "FAMNIT Hackathon 2025",
    sub: "Participant · First hackathon",
    title: "FAMNIT Hackathon 2025 — Participant",
    meta: "First hackathon",
    peek: "My first hackathon at FAMNIT.",
    detail:
      "A weekend of building under time pressure with a student team — the entry point to the hackathon habit that produced Sea Oasis a year later.",
  },
];

export type Project = {
  title: string;
  sub: string;
  desc: string;
  tags: string[];
  points: string[];
  links: { label: string; href: string }[];
  photo?: string;
};

export const projects: Project[] = [
  {
    title: "Java Web Crawler",
    sub: "Sequential vs. Multithreaded vs. Distributed",
    desc: "A Java web crawler built in three versions to demonstrate the real-world performance gains of parallel and distributed computing.",
    tags: ["Java", "MPJ (MPI for Java)"],
    points: [
      "Sequential version: single-threaded baseline for comparison",
      "Multithreaded version: configurable thread count using a master-worker task distribution model",
      "Distributed version: uses Java MPJ (MPI for Java) to simulate multiple machines coordinating as workers under a single master",
    ],
    links: [
      {
        label: "Multithreaded ↗",
        href: "https://github.com/georgieskiluka/Web-Crawler-Multithreaded",
      },
      {
        label: "Distributed ↗",
        href: "https://github.com/georgieskiluka/Web-Crawler-Distributed",
      },
    ],
  },
  {
    title: "LetoCroatia",
    sub: "Seasonal Job Platform",
    desc: "A CRUD platform connecting seasonal employers in Croatia with job seekers, pairing every listing with housing and the legal documentation required to work.",
    tags: ["JavaScript", "HTML", "CSS", "MySQL (phpMyAdmin)"],
    points: [
      "Employers can only publish a listing once it has all three required pieces: the job offer, an apartment for the employee, and the legal documentation required for that role",
      "Employees must supply matching documentation to apply; employers then select among qualified applicants",
      "Developed and deployed remotely to the university's server, accessed via SSH",
    ],
    links: [
      {
        label: "Repo ↗",
        href: "https://github.com/georgieskiluka/Leto-Croatia",
      },
    ],
  },
  {
    title: "Sea Oasis Visibility Forecast",
    sub: "FAMNIT Hackathon 2026, 2nd Place",
    desc: "Built for YouSea, a marine-conservation organization, to predict underwater visibility before their reef-monitoring expeditions — each of which costs real time and money when visibility turns out too poor to record.",
    tags: ["React", "FastAPI", "Python", "Node.js"],
    points: [
      "ML model predicts water clarity at a given location and time using weather, tide, wind, and moon data",
      "Built a custom solar-powered sensor prototype (turbidity sensor, wave and weather sensors) to validate the model's predictions against real conditions",
      "React frontend, FastAPI backend",
    ],
    links: [
      {
        label: "Repo ↗",
        href: "https://github.com/VukIG/famnit_hackathon2026",
      },
    ],
  },
  {
    title: "Formula 1 AR Race Simulator",
    sub: "",
    desc: "An iOS augmented-reality app that lets you pick an F1 team and driver and follow a simulated race overlaid on the real world.",
    tags: ["Unity", "C#", "ARKit (via AR Foundation)"],
    points: [
      "Race simulation driven by real per-driver stat fields: speed, cornering, reliability",
      "Owned the UI, data, and audio layers within a team codebase",
    ],
    links: [
      { label: "Repo ↗", href: "https://gitlab.com/ilijachrchev-group/f1-ar" },
    ],
  },
];

/** Use `{ ph: true }` for a "Coming soon" card. */
export type Certification = {
  ph?: boolean;
  title?: string;
  issuer?: string;
  date?: string;
  extra?: string;
  href?: string;
};

export const certifications: Certification[] = [
  {
    title: "MATLAB Onramp",
    issuer: "MathWorks (Training Services)",
    date: "Completed September 17, 2026",
    href: "https://matlabacademy.mathworks.com/progress/share/certificate.html?id=60a66a55-da92-4bb4-b0a4-d3337030227f&",
  },
  {
    title: "High-Performance Leadership: Lessons from Formula 1",
    issuer: "Santander (Open Academy)",
    date: "Completed September 11, 2025",
    extra: "8 Hours · 2 Modules · Credential ID: OA-2025-0911001703391",
  },
  { ph: true },
  { ph: true },
  { ph: true },
];

export const tools: { name: string; icons: IconType[] }[] = [
  { name: "Java", icons: [SiOpenjdk] },
  { name: "JavaScript", icons: [SiJavascript] },
  { name: "TypeScript", icons: [SiTypescript] },
  { name: "Python", icons: [SiPython] },
  { name: "C#", icons: [] },
  { name: "HTML/CSS", icons: [SiHtml5, SiCss] },
  { name: "React", icons: [SiReact] },
  { name: "Next.js", icons: [SiNextdotjs] },
  { name: "Tailwind CSS", icons: [SiTailwindcss] },
  { name: "FastAPI", icons: [SiFastapi] },
  { name: "Node.js", icons: [SiNodedotjs] },
  { name: "Unity", icons: [SiUnity] },
  { name: "Git/GitHub", icons: [SiGit, SiGithub] },
  { name: "MySQL", icons: [SiMysql] },
  { name: "ARKit (AR Foundation)", icons: [] },
  { name: "MPJ (MPI for Java)", icons: [] },
  { name: "Claude Code", icons: [SiClaude] },
];

/** A card stays blank until it has a quote. */
export type Endorsement = {
  quote?: string;
  name?: string;
  role?: string;
  rating?: number;
};

export const endorsements: Endorsement[] = [{}, {}, {}, {}, {}];

export const contactLinks: { label: string; href: string; icon: IconType }[] = [
  {
    label: "Email",
    href: "mailto:luka.georgieski@gmail.com",
    icon: PiEnvelopeSimpleDuotone,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/luka-georgieski-077582365/",
    icon: PiLinkedinLogoDuotone,
  },
  {
    label: "GitHub",
    href: "https://github.com/georgieskiluka",
    icon: PiGithubLogoDuotone,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/lukageorgieski/",
    icon: PiInstagramLogoDuotone,
  },
];
