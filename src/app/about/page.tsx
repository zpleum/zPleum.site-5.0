"use client";

import { Github, Facebook, MessageCircle, Mail, Code, Briefcase, Award, MapPin, Languages, Sparkles, Zap, Heart, Rocket, Coffee, Music, Gamepad2, BookOpen, Target, TrendingUp } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

const skills = [
  { name: "TypeScript", level: 90, color: "from-blue-500 to-cyan-500" },
  { name: "React", level: 85, color: "from-cyan-500 to-blue-500" },
  { name: "Next.js", level: 88, color: "from-purple-500 to-pink-500" },
  { name: "Node.js", level: 82, color: "from-green-500 to-emerald-500" },
  { name: "Tailwind CSS", level: 90, color: "from-pink-500 to-rose-500" },
  { name: "MySQL", level: 75, color: "from-orange-500 to-amber-500" },
  { name: "JavaScript", level: 92, color: "from-yellow-500 to-orange-500" },
  { name: "Java", level: 64, color: "from-red-500 to-pink-500" },
  { name: "Python", level: 59, color: "from-indigo-500 to-purple-500" },
  { name: "C++", level: 54, color: "from-teal-500 to-cyan-500" }
];

const experiences = [
  {
    title: "zPleumCORE",
    role: "Minecraft Server Security",
    period: "2023 - Present",
    description: "Advanced OP-hack protection & access control system with real-time monitoring and detection.",
    highlights: [
      "Real-time threat detection and blocking",
      "Advanced access control system",
      "Comprehensive security analytics"
    ],
    icon: "🛡️",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    title: "Bonniecraft",
    role: "E-Commerce Platform",
    period: "2023 - Present",
    description: "Full-stack e-commerce solution for Minecraft servers with integrated payments.",
    highlights: [
      "Secure payment processing with Stripe",
      "Automated item delivery system",
      "Mobile-responsive design"
    ],
    icon: "🛒",
    gradient: "from-blue-500 to-cyan-500"
  },
  {
    title: "zPleumVerify",
    role: "Verification System",
    period: "2023 - Present",
    description: "Smart team verification system with Discord API integration.",
    highlights: [
      "Discord API integration",
      "Role-based access control",
      "Automated verification workflows"
    ],
    icon: "✅",
    gradient: "from-green-500 to-emerald-500"
  }
];

const stats = [
  {
    icon: Zap,
    label: "Years Experience",
    value: "5+",
    color: "from-yellow-500 to-orange-500",
    description: "Building web applications",
    subtitle: "Since 2019"
  },
  {
    icon: Code,
    label: "Projects Completed",
    value: "50+",
    color: "from-blue-500 to-cyan-500",
    description: "Successful deliveries",
    subtitle: "Full-stack solutions"
  },
  {
    icon: Heart,
    label: "Client Satisfaction",
    value: "100%",
    color: "from-pink-500 to-rose-500",
    description: "Happy clients",
    subtitle: "Quality guaranteed"
  },
];

const interests = [
  { name: "Gaming", icon: Gamepad2, color: "from-purple-500 to-pink-500" },
  { name: "Music", icon: Music, color: "from-blue-500 to-cyan-500" },
  { name: "Reading", icon: BookOpen, color: "from-green-500 to-emerald-500" },
  { name: "Coffee", icon: Coffee, color: "from-orange-500 to-amber-500" },
];

const journey = [
  {
    year: "2019",
    title: "Started Coding Journey",
    description: "Began learning programming with Python and web development basics.",
    icon: Rocket,
    color: "from-blue-500 to-cyan-500"
  },
  {
    year: "2021",
    title: "First Major Project",
    description: "Developed first full-stack application using React and Node.js.",
    icon: Code,
    color: "from-purple-500 to-pink-500"
  },
  {
    year: "2023",
    title: "Professional Growth",
    description: "Launched multiple successful projects including Bonniecraft and zPleumCORE.",
    icon: TrendingUp,
    color: "from-green-500 to-emerald-500"
  },
  {
    year: "2024",
    title: "Expanding Horizons",
    description: "Focusing on advanced web technologies and building scalable applications.",
    icon: Target,
    color: "from-orange-500 to-amber-500"
  }
];

export default function About() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--gradient-from)] via-[var(--gradient-via)] to-[var(--gradient-to)]">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
      </div>

      {/* Floating Orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute top-1/4 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 rounded-full blur-3xl"
        />
      </div>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 lg:px-24 py-24">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col md:flex-row items-center gap-12 mb-20"
        >
          {/* Profile Image */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-1000 animate-pulse"></div>
            <div className="relative w-64 h-64 rounded-full overflow-hidden border-4 border-[var(--card-bg)] shadow-2xl">
              <Image
                src="/profile.png"
                alt="Profile"
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2">
              <Sparkles size={18} />
              <span className="font-bold">Available for Work</span>
            </div>
          </motion.div>

          {/* Profile Info */}
          <div className="flex-1 text-center md:text-left">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-5xl md:text-6xl font-bold text-[var(--foreground)] mb-4"
            >
              Wiraphat Makwong
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 font-semibold"
            >
              Full Stack Developer & Creative Problem Solver
            </motion.p>
            <motion.p
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg text-[var(--foreground-muted)] mb-8 leading-relaxed max-w-2xl"
            >
              Passionate about creating elegant solutions to complex problems.
              I specialize in building modern web applications with cutting-edge technologies,
              focusing on performance, scalability, and user experience.
            </motion.p>

            {/* Quick Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4 justify-center md:justify-start mb-6"
            >
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full shadow-md border border-[var(--border)]">
                <MapPin size={18} className="text-[var(--accent-blue)]" />
                <span className="text-[var(--foreground)]">Thailand</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full shadow-md border border-[var(--border)]">
                <Briefcase size={18} className="text-[var(--accent-purple)]" />
                <span className="text-[var(--foreground)]">5+ Years Experience</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-full shadow-md border border-[var(--border)]">
                <Languages size={18} className="text-[var(--accent-pink)]" />
                <span className="text-[var(--foreground)]">Thai, English</span>
              </div>
            </motion.div>

            {/* Social Links */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="flex gap-3 justify-center md:justify-start"
            >
              <a
                href="https://github.com/zPleum"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-xl hover:bg-[var(--foreground)] hover:text-[var(--background)] transition-all hover:scale-110 shadow-md border border-[var(--border)]"
              >
                <Github size={20} />
              </a>
              <a
                href="https://www.facebook.com/wiraphat.makwong"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-xl hover:bg-[#1877F2] hover:text-white transition-all hover:scale-110 shadow-md border border-[var(--border)]"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://discord.com/users/837918998242656267"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-xl hover:bg-[#5865F2] hover:text-white transition-all hover:scale-110 shadow-md border border-[var(--border)]"
              >
                <MessageCircle size={20} />
              </a>
              <a
                href="mailto:wiraphat.makwong@gmail.com"
                className="p-3 bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-xl hover:bg-[var(--accent-blue)] hover:text-white transition-all hover:scale-110 shadow-md border border-[var(--border)]"
              >
                <Mail size={20} />
              </a>
            </motion.div>
          </div>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.6,
                delay: 0.9 + index * 0.15,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ scale: 1.08, y: -10 }}
              className="relative group cursor-pointer"
            >
              {/* Animated gradient background */}
              <div className={`absolute -inset-1 bg-gradient-to-r ${stat.color} rounded-3xl opacity-75 group-hover:opacity-100 transition-all duration-500 animate-pulse`}></div>

              {/* Card content */}
              <div className="relative bg-[var(--card-bg)] rounded-3xl p-10 shadow-2xl border-2 border-[var(--border)] group-hover:border-transparent transition-all duration-300 overflow-hidden">
                {/* Background decoration */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${stat.color} opacity-10 rounded-full blur-2xl`}></div>

                {/* Icon */}
                <div className="relative mb-6 flex justify-center">
                  <motion.div
                    className={`p-5 rounded-2xl bg-gradient-to-br ${stat.color} shadow-2xl`}
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    <stat.icon className="text-white" size={40} />
                  </motion.div>
                </div>

                {/* Value */}
                <motion.div
                  className={`text-6xl font-black mb-3 bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, delay: 1.2 + index * 0.15, type: "spring" }}
                >
                  {stat.value}
                </motion.div>

                {/* Label */}
                <div className="text-lg font-semibold text-[var(--foreground)] mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                  {stat.label}
                </div>

                {/* Description */}
                <div className="text-sm text-[var(--foreground-muted)] mb-1">
                  {stat.description}
                </div>

                {/* Subtitle */}
                <div className={`text-xs font-medium bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                  {stat.subtitle}
                </div>

                {/* Shine effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* About Me Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
          className="mb-20"
        >
          <div className="bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-2xl border border-[var(--border)]">
            <h2 className="text-4xl font-bold text-[var(--foreground)] mb-6">About Me</h2>
            <div className="space-y-4 text-lg text-[var(--foreground-muted)] leading-relaxed">
              <p>
                Hello! I&apos;m Wiraphat, a passionate full-stack developer based in Thailand. My journey into the world of programming began in 2019, and since then, I&apos;ve been captivated by the endless possibilities that code can create.
              </p>
              <p>
                I specialize in building modern, scalable web applications using cutting-edge technologies. My expertise spans across frontend frameworks like React and Next.js, backend development with Node.js, and database management with MySQL. I&apos;m particularly passionate about creating intuitive user experiences and writing clean, maintainable code.
              </p>
              <p>
                When I&apos;m not coding, you&apos;ll find me exploring new technologies, contributing to open-source projects, or enjoying a good cup of coffee while reading tech blogs. I believe in continuous learning and always strive to stay updated with the latest industry trends and best practices.
              </p>
            </div>
          </div>
        </motion.section>

        {/* My Journey Timeline */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-amber-500">
              <Rocket className="text-white" size={32} />
            </div>
            <h2 className="text-4xl font-bold text-[var(--foreground)]">My Journey</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {journey.map((item, index) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
                whileHover={{ scale: 1.03 }}
                className="relative group"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${item.color} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300`}></div>
                <div className="relative bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[var(--border)]">
                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-br ${item.color}`}>
                      <item.icon className="text-white" size={24} />
                    </div>
                    <div>
                      <div className={`text-2xl font-bold bg-gradient-to-r ${item.color} bg-clip-text text-transparent`}>{item.year}</div>
                      <h3 className="text-xl font-semibold text-[var(--foreground)]">{item.title}</h3>
                    </div>
                  </div>
                  <p className="text-[var(--foreground-muted)]">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Skills Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.3 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
              <Code className="text-white" size={32} />
            </div>
            <h2 className="text-4xl font-bold text-[var(--foreground)]">Technical Skills</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.4 + index * 0.05 }}
                whileHover={{ scale: 1.02 }}
                className="bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all border border-[var(--border)]"
              >
                <div className="flex justify-between items-center mb-3">
                  <span className="font-semibold text-[var(--foreground)]">{skill.name}</span>
                  <span className="text-sm font-bold text-[var(--accent-blue)]">{skill.level}%</span>
                </div>
                <div className="w-full bg-[var(--muted)] rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 1.5 + index * 0.05 }}
                    className={`h-full bg-gradient-to-r ${skill.color} rounded-full shadow-lg`}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Interests Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.6 }}
          className="mb-20"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-500">
              <Heart className="text-white" size={32} />
            </div>
            <h2 className="text-4xl font-bold text-[var(--foreground)]">Interests & Hobbies</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {interests.map((interest, index) => (
              <motion.div
                key={interest.name}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1.7 + index * 0.1 }}
                whileHover={{ scale: 1.1, rotate: 5 }}
                className="relative group"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${interest.color} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300`}></div>
                <div className="relative bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-[var(--border)] text-center">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${interest.color} mb-3`}>
                    <interest.icon className="text-white" size={32} />
                  </div>
                  <div className="font-semibold text-[var(--foreground)]">{interest.name}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Experience Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.9 }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
              <Briefcase className="text-white" size={32} />
            </div>
            <h2 className="text-4xl font-bold text-[var(--foreground)]">Featured Projects</h2>
          </div>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <motion.div
                key={exp.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 2.0 + index * 0.1 }}
                whileHover={{ scale: 1.02, y: -5 }}
                className="relative group"
              >
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${exp.gradient} rounded-2xl opacity-0 group-hover:opacity-100 blur transition-opacity duration-300`}></div>
                <div className="relative bg-[var(--card-bg)]/80 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-[var(--border)]">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <span className="text-4xl">{exp.icon}</span>
                      <div>
                        <h3 className="text-2xl font-bold text-[var(--foreground)] mb-1">{exp.title}</h3>
                        <p className={`text-lg font-semibold bg-gradient-to-r ${exp.gradient} bg-clip-text text-transparent`}>{exp.role}</p>
                      </div>
                    </div>
                    <span className="text-sm font-medium text-[var(--foreground-muted)] bg-[var(--muted)] px-4 py-2 rounded-full mt-2 md:mt-0">
                      {exp.period}
                    </span>
                  </div>
                  <p className="text-[var(--foreground-muted)] mb-4 leading-relaxed">{exp.description}</p>
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, i) => (
                      <li key={i} className="flex items-start gap-2 text-[var(--foreground)]">
                        <Award size={18} className="text-green-500 mt-0.5 flex-shrink-0" />
                        <span>{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}