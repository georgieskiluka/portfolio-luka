import Hero from "@/components/Hero";
import About from "@/sections/About";
import Experience from "@/sections/Experience";
import Certifications from "@/sections/Certifications";
import Projects from "@/sections/Projects";
import Tools from "@/sections/Tools";
import Endorsements from "@/sections/Endorsements";
import Contact from "@/sections/Contact";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Experience />
      <Certifications />
      <Projects />
      <Tools />
      <Endorsements />
      <Contact />
    </>
  );
}
