import type { IconType } from "react-icons";
import { DiJava } from "react-icons/di";
import {
  SiClaudecode,
  SiCss,
  SiFastapi,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiPython,
  SiReact,
  SiTailwindcss,
  SiTypescript,
  SiUnity,
} from "react-icons/si";

type Tool = {
  name: string;
  icons?: IconType[];
};

const categories: { title: string; items: Tool[] }[] = [
  {
    title: "Languages",
    items: [
      { name: "Java", icons: [DiJava] },
      { name: "JavaScript", icons: [SiJavascript] },
      { name: "TypeScript", icons: [SiTypescript] },
      { name: "Python", icons: [SiPython] },
      { name: "C#" },
      { name: "HTML/CSS", icons: [SiHtml5, SiCss] },
    ],
  },
  {
    title: "Frameworks & Libraries",
    items: [
      { name: "React", icons: [SiReact] },
      { name: "Next.js", icons: [SiNextdotjs] },
      { name: "Tailwind CSS", icons: [SiTailwindcss] },
      { name: "FastAPI", icons: [SiFastapi] },
      { name: "Node.js", icons: [SiNodedotjs] },
      { name: "Unity", icons: [SiUnity] },
    ],
  },
  {
    title: "Tools & Platforms",
    items: [
      { name: "Git/GitHub", icons: [SiGit, SiGithub] },
      { name: "MySQL", icons: [SiMysql] },
      { name: "ARKit (AR Foundation)" },
      { name: "MPJ (MPI for Java)" },
      { name: "Claude Code", icons: [SiClaudecode] },
    ],
  },
];

export default function Tools() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-16 bg-[#152238] px-6 py-24 text-[#F5EFE0]">
      <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        Tools
      </h2>
      <div className="flex w-full max-w-4xl flex-col items-center gap-16">
        {categories.map((category, index) => (
          <div key={category.title} className="flex w-full flex-col items-center">
            {index > 0 && (
              <div className="mb-16 h-px w-full max-w-xs bg-[#C6A15B]/50" />
            )}
            <h3 className="font-serif text-xl font-semibold tracking-tight sm:text-2xl">
              {category.title}
            </h3>
            <div className="mt-10 grid w-full grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 md:grid-cols-4">
              {category.items.map((item) => (
                <div
                  key={item.name}
                  className="flex flex-col items-center gap-3 text-center"
                >
                  <div className="flex h-9 items-center justify-center gap-2 text-3xl">
                    {item.icons?.map((Icon, i) => <Icon key={i} />)}
                  </div>
                  <span className="font-sans text-sm text-[#F5EFE0]/90">
                    {item.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
