const items: { title: string; date?: string }[] = [
  { title: "IAESTE LC Koper — President", date: "2025–Present" },
  {
    title: "Google Developer Group, University of Primorska — Event Coordinator",
    date: "2025–Present",
  },
  { title: "FAMNIT Hackathon 2026 — 2nd Place" },
  { title: "FAMNIT Hackathon 2025 — Participant" },
];

export default function Experience() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-16 bg-[#152238] px-6 py-24 text-[#F5EFE0]">
      <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        Experience
      </h2>
      <ol className="relative flex w-full max-w-xl flex-col gap-16">
        <div
          aria-hidden
          className="absolute inset-y-0 left-0 w-px bg-[#C6A15B]/50"
        />
        {items.map((item) => (
          <li key={item.title} className="relative pl-8">
            <span
              aria-hidden
              className="absolute left-0 top-1.5 h-2.5 w-2.5 -translate-x-1/2 rounded-full bg-[#C6A15B]"
            />
            <p className="font-serif text-xl font-medium sm:text-2xl">
              {item.title}
            </p>
            {item.date && (
              <p className="mt-1 font-sans text-sm text-[#F5EFE0]/60">
                {item.date}
              </p>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
