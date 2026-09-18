import type { IconType } from "react-icons";
import { FiAward } from "react-icons/fi";

type Certification = {
  title: string;
  issuer: string;
  completed: string;
  detail?: string;
  credentialId?: string;
  credentialUrl?: string;
  icon: IconType;
};

// Neither MathWorks nor Santander have a logo in the installed Simple
// Icons set, so both cards fall back to a generic award icon.
const certifications: Certification[] = [
  {
    title: "MATLAB Onramp",
    issuer: "MathWorks (Training Services)",
    completed: "September 17, 2026",
    credentialUrl:
      "https://matlabacademy.mathworks.com/progress/share/certificate.html?id=60a66a55-da92-4bb4-b0a4-d3337030227f&",
    icon: FiAward,
  },
  {
    title: "High-Performance Leadership: Lessons from Formula 1",
    issuer: "Santander (Open Academy)",
    completed: "September 11, 2025",
    detail: "8 Hours · 2 Modules",
    credentialId: "OA-2025-0911001703391",
    icon: FiAward,
  },
];

export default function Certifications() {
  return (
    <section className="flex min-h-screen w-full flex-col items-center justify-center gap-16 bg-[#152238] px-6 py-24 text-[#F5EFE0]">
      <h2 className="font-serif text-4xl font-semibold tracking-tight sm:text-5xl">
        Certifications
      </h2>
      <div className="grid w-full max-w-4xl grid-cols-1 gap-8 md:grid-cols-2">
        {certifications.map(
          ({
            title,
            issuer,
            completed,
            detail,
            credentialId,
            credentialUrl,
            icon: Icon,
          }) => (
            <article
              key={title}
              className="flex flex-col gap-3 rounded-lg border border-[#C6A15B]/60 p-6"
            >
              <Icon className="text-3xl text-[#C6A15B]" />
              <h3 className="font-serif text-xl font-semibold sm:text-2xl">
                {title}
              </h3>
              <p className="font-sans text-sm text-[#F5EFE0]/90">{issuer}</p>
              <p className="font-sans text-sm text-[#F5EFE0]/70">
                Completed {completed}
              </p>
              {detail && (
                <p className="font-sans text-sm text-[#F5EFE0]/70">
                  {detail}
                </p>
              )}
              {credentialId && (
                <p className="mt-1 font-sans text-xs text-[#F5EFE0]/50">
                  Credential ID: {credentialId}
                </p>
              )}
              {credentialUrl && (
                <a
                  href={credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 font-sans text-xs text-[#C6A15B] underline underline-offset-4 hover:text-[#F5EFE0]"
                >
                  View Credential
                </a>
              )}
            </article>
          ),
        )}
      </div>
    </section>
  );
}
