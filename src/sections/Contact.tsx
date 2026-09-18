import type { IconType } from "react-icons";
import { FaLinkedin } from "react-icons/fa6";
import { FiMail } from "react-icons/fi";
import { SiGithub, SiInstagram } from "react-icons/si";

type ContactLink = {
  label: string;
  href: string;
  icon: IconType;
};

const links: ContactLink[] = [
  {
    label: "Email",
    href: "mailto:luka.georgieski@gmail.com",
    icon: FiMail,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/luka-georgieski-077582365/",
    icon: FaLinkedin,
  },
  {
    label: "GitHub",
    href: "https://github.com/georgieskiluka",
    icon: SiGithub,
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/lukageorgieski/",
    icon: SiInstagram,
  },
];

export default function Contact() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-16 bg-[#152238] px-6 py-24 text-[#F5EFE0]">
      <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        Get in Touch
      </h2>
      <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-10">
        {links.map(({ label, href, icon: Icon }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("mailto:") ? undefined : "_blank"}
            rel={href.startsWith("mailto:") ? undefined : "noopener noreferrer"}
            className="group flex flex-col items-center gap-3 text-[#F5EFE0] transition-colors hover:text-[#C6A15B]"
          >
            <Icon className="text-4xl" />
            <span className="font-sans text-sm">{label}</span>
          </a>
        ))}
      </div>
    </section>
  );
}
