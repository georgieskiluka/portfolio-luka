export default function About() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-8 bg-[#152238] px-6 py-24 text-center text-[#F5EFE0]">
      <div className="flex max-w-2xl flex-col gap-4">
        <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
          Luka Georgieski
        </h2>
        <p className="text-lg font-light sm:text-xl">
          CS student from Macedonia, studying in Slovenia
        </p>
      </div>
      <p className="max-w-[65ch] font-sans text-base leading-relaxed">
        I like whiskey, Formula 1, and League of Legends — but if you want my
        professional passions, feel free to scroll down. It&apos;s nice to
        meet you!
      </p>
    </section>
  );
}
