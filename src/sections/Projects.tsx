type Project = {
  title: string;
  subtitle?: string;
  blurb: string;
  stack: string[];
  bullets: string[];
  links: { label: string; href: string }[];
};

const projects: Project[] = [
  {
    title: "Java Web Crawler",
    subtitle: "Sequential vs. Multithreaded vs. Distributed",
    blurb:
      "A Java web crawler built in three versions to demonstrate the real-world performance gains of parallel and distributed computing.",
    stack: ["Java", "MPJ (MPI for Java)"],
    bullets: [
      "Sequential version: single-threaded baseline for comparison",
      "Multithreaded version: configurable thread count using a master-worker task distribution model",
      "Distributed version: uses Java MPJ (MPI for Java) to simulate multiple machines coordinating as workers under a single master",
    ],
    links: [
      {
        label: "Multithreaded",
        href: "https://github.com/georgieskiluka/Web-Crawler-Multithreaded",
      },
      {
        label: "Distributed",
        href: "https://github.com/georgieskiluka/Web-Crawler-Distributed",
      },
    ],
  },
  {
    title: "LetoCroatia",
    subtitle: "Seasonal Job Platform",
    blurb:
      "A CRUD platform connecting seasonal employers in Croatia with job seekers, pairing every listing with housing and the legal documentation required to work.",
    stack: ["JavaScript", "HTML", "CSS", "MySQL (phpMyAdmin)"],
    bullets: [
      "Employers can only publish a listing once it has all three required pieces: the job offer, an apartment for the employee, and the legal documentation required for that role",
      "Employees must supply matching documentation to apply; employers then select among qualified applicants",
      "Developed and deployed remotely to the university's server, accessed via SSH",
    ],
    links: [
      { label: "Repo", href: "https://github.com/georgieskiluka/Leto-Croatia" },
    ],
  },
  {
    title: "Sea Oasis Visibility Forecast",
    subtitle: "FAMNIT Hackathon 2026, 2nd Place",
    blurb:
      "Built for YouSea, a marine-conservation organization, to predict underwater visibility before their reef-monitoring expeditions — each of which costs real time and money when visibility turns out too poor to record.",
    stack: ["React", "FastAPI", "Python", "Node.js"],
    bullets: [
      "ML model predicts water clarity at a given location and time using weather, tide, wind, and moon data",
      "Built a custom solar-powered sensor prototype (turbidity sensor, wave and weather sensors) to validate the model's predictions against real conditions",
      "React frontend, FastAPI backend",
    ],
    links: [
      { label: "Repo", href: "https://github.com/VukIG/famnit_hackathon2026" },
    ],
  },
  {
    title: "Formula 1 AR Race Simulator",
    blurb:
      "An iOS augmented-reality app that lets you pick an F1 team and driver and follow a simulated race overlaid on the real world.",
    stack: ["Unity", "C#", "ARKit (via AR Foundation)"],
    bullets: [
      "Race simulation driven by real per-driver stat fields: speed, cornering, reliability",
      "Owned the UI, data, and audio layers within a team codebase",
    ],
    links: [{ label: "Repo", href: "https://gitlab.com/ilijachrchev-group/f1-ar" }],
  },
];

export default function Projects() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-16 bg-[#152238] px-6 py-24 text-[#F5EFE0]">
      <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        Projects
      </h2>
      <div className="grid w-full max-w-5xl grid-cols-1 gap-8 md:grid-cols-2">
        {projects.map((project) => (
          <article
            key={project.title}
            className="flex flex-col gap-4 rounded-lg border border-[#F5EFE0]/15 bg-[#F5EFE0]/[0.03] p-6"
          >
            <div>
              <h3 className="font-serif text-2xl font-semibold">
                {project.title}
              </h3>
              {project.subtitle && (
                <p className="mt-1 font-sans text-sm text-[#F5EFE0]/60">
                  {project.subtitle}
                </p>
              )}
            </div>

            <p className="font-sans text-sm leading-relaxed text-[#F5EFE0]/90">
              {project.blurb}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.stack.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-[#C6A15B]/60 px-3 py-1 font-sans text-xs text-[#C6A15B]"
                >
                  {tag}
                </span>
              ))}
            </div>

            <ul className="flex flex-col gap-2 font-sans text-sm leading-relaxed text-[#F5EFE0]/80">
              {project.bullets.map((bullet) => (
                <li key={bullet} className="flex gap-2">
                  <span aria-hidden className="text-[#C6A15B]">
                    —
                  </span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>

            <div className="mt-auto flex flex-wrap gap-4 pt-2">
              {project.links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-sans text-sm font-medium text-[#C6A15B] underline underline-offset-4 hover:text-[#F5EFE0]"
                >
                  {link.label} ↗
                </a>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
