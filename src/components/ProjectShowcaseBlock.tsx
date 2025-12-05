"use client";

import Image from 'next/image'

type Project = {
  title: string;
  description: string;
  caseStudyUrl: string;
  projectUrl: string;
  image: string;
};

const projects: Project[] = [
    {
      title: "Bonniecraft Minecraft Store",
      description:
        "A full-stack e-commerce platform tailored for Minecraft servers, delivering secure payments, robust user authentication, and seamless automated in-game item delivery.",
      caseStudyUrl: "/project/bonniecraft",
      projectUrl: "https://bonniecraft.zpleum.site/",
      image: "/projects/bonniecraft.png",
    },
    {
      title: "zPleumVerify Minecraft Team Verification",
      description:
        "zPleumVerify — The Smart & Secure Minecraft Team Verification System with Discord API.",
      caseStudyUrl: "/project/zpleumverify",
      projectUrl: "https://zpleumverify.zpleum.site/",
      image: "/projects/zpleumverify.png",
    },
    {
      title: "zPleumCORE Minecraft Team Verification",
      description:
        "zPleumCORE — The Ultimate OP Hacker Shield & Advanced Security for Minecraft Servers The core system built to protect your Minecraft server from OP hackers with real-time detection and blocking, delivering top-tier security so your server stays safe 24/7.",
      caseStudyUrl: "/project/zpleumcore",
      projectUrl: "https://zpleumcore.zpleum.site/",
      image: "/projects/zpleumcore.png",
    },
];

export default function ProjectShowcase() {
  return (
    <div className="flex flex-col gap-24 w-full py-12">
      {projects.map((project) => (
        <div 
          key={project.title}
          className="flex flex-col gap-8 w-full reveal-animation hover:transform hover:scale-[1.02] transition-transform duration-300"
        >
          {/* Image Container */}
          <div className="relative w-full h-[320px] sm:h-[400px] md:h-[500px] overflow-hidden rounded-2xl">
            <Image
              src={project.image}
              alt={project.title}
              width={500}
              height={500}
              className="absolute inset-0 w-full h-full object-cover shadow-lg transition-transform duration-300 hover:scale-105"
            />
          </div>

          {/* Project Content */}
          <div className="flex pt-6 px-4 gap-12 flex-col lg:flex-row w-full">
            <div className="flex flex-1 flex-col items-start">
              <h2
                className="font-semibold text-2xl lg:text-3xl leading-tight"
                style={{
                  color: "var(--neutral-on-background-strong)",
                }}
              >
                {project.title}
              </h2>
            </div>

            <div className="flex gap-6 flex-col flex-1">
              <p
                className="text-base leading-relaxed"
                style={{
                  color: "var(--neutral-on-background-weak)",
                }}
              >
                {project.description}
              </p>

              <div className="flex gap-8 flex-wrap">
                <a
                  href={project.caseStudyUrl}
                  className="text-sm font-medium hover:underline underline-offset-4 transition-all duration-200 hover:text-[var(--neutral-on-background-strong)]"
                  style={{
                    color: "var(--neutral-on-background-weak)",
                  }}
                >
                  Read case study
                </a>

                <a
                  href={project.projectUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm font-medium hover:underline underline-offset-4 transition-all duration-200 hover:text-[var(--neutral-on-background-strong)]"
                  style={{
                    color: "var(--neutral-on-background-weak)",
                  }}
                >
                  View project
                </a>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}