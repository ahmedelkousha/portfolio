// Portfolio Data - Professional LinkedIn Profile

export const personalInfo = {
  name: "Ahmed Maher",
  role: "Full-Stack MERN Developer | Next.js Developer | SEO Specialist",
  tagline: "Building SEO-Optimized & High-Performance Web Applications",
  bio: `I'm a Full Stack Developer (MERN & Next.js) with a strong background in SEO and web performance, focused on building scalable, fast, and search-engine friendly applications. I specialize in developing modern web applications where code quality, performance, and discoverability work together as core architectural principles. I help businesses launch web applications that load fast, scale smoothly, and rank effectively.`,
  email: "elkoushaservice@gmail.com",
  phone: "+201011788540",
  location: "Alexandria, Egypt",
  github: "https://github.com/ahmedelkousha",
  linkedin: "https://linkedin.com/in/ahmedelkousha",
  skype: "ahmedmayo54",
  cvUrl: "/cv/Ahmed_Maher_CV.pdf",
};

export const stats = [
  { label: "Years Experience", value: "4+" },
  { label: "Projects Completed", value: "25+" },
  { label: "Happy Clients", value: "20+" },
  { label: "Technologies", value: "15+" },
];

export const skills = {
  frontend: [
    { name: "React.js", level: 95 },
    { name: "Next.js", level: 90 },
    { name: "TypeScript", level: 88 },
    { name: "JavaScript (ES6+)", level: 95 },
    { name: "HTML5", level: 95 },
    { name: "CSS3", level: 90 },
    { name: "Tailwind CSS", level: 92 },
  ],
  backend: [
    { name: "Node.js", level: 90 },
    { name: "Express.js", level: 88 },
    { name: "MongoDB", level: 85 },
    { name: "REST APIs", level: 90 },
    { name: "Auth & Security", level: 85 },
  ],
  tools: [
    { name: "Technical SEO", level: 92 },
    { name: "Core Web Vitals", level: 90 },
    { name: "Schema.org", level: 88 },
    { name: "Page Speed", level: 90 },
    { name: "Site Architecture", level: 85 },
    { name: "Git & GitHub", level: 88 },
  ],
};

export const projects = [
  {
    id: 1,
    title: "Aura Marketing SA",
    description:
      "Full-service digital marketing agency website with modern design, optimized for SEO and high performance. Built with responsive layouts and engaging user experience.",
    image: "/placeholder.svg",
    technologies: ["Next.js", "React", "Tailwind CSS", "SEO", "Performance"],
    github: "https://github.com/ahmedelkousha",
    liveDemo: "https://auramarketingsa.com",
    featured: true,
  },
  {
    id: 2,
    title: "Pure Touch US",
    description:
      "Premium beauty and wellness e-commerce platform with seamless shopping experience, optimized product pages, and structured data for enhanced search visibility.",
    image: "/placeholder.svg",
    technologies: ["React", "Node.js", "E-commerce", "SEO", "Schema.org"],
    github: "https://github.com/ahmedelkousha",
    liveDemo: "https://puretouchus.com",
    featured: true,
  },
  {
    id: 3,
    title: "SEO Dashboard Analytics",
    description:
      "Comprehensive SEO analytics dashboard featuring Core Web Vitals monitoring, keyword tracking, and technical SEO audit tools with real-time performance metrics.",
    image: "/placeholder.svg",
    technologies: ["React", "Node.js", "Express", "MongoDB", "Chart.js"],
    github: "https://github.com/ahmedelkousha",
    liveDemo: "#",
    featured: true,
  },
  {
    id: 4,
    title: "Real Estate Listing App",
    description:
      "Property listing platform with advanced search, filtering, map integration, and SEO-optimized property pages with Schema.org structured data.",
    image: "/placeholder.svg",
    technologies: ["React", "Node.js", "MongoDB", "Google Maps API", "REST API"],
    github: "https://github.com/ahmedelkousha",
    liveDemo: "#",
    featured: false,
  },
  {
    id: 5,
    title: "Task Management System",
    description:
      "Collaborative project management tool with real-time updates, team workspaces, and performance-optimized frontend architecture.",
    image: "/placeholder.svg",
    technologies: ["MERN Stack", "Socket.io", "JWT Auth", "Tailwind CSS"],
    github: "https://github.com/ahmedelkousha",
    liveDemo: "#",
    featured: false,
  },
];

export const seoExpertise = [
  {
    id: 1,
    title: "Technical SEO",
    description: "Site architecture, crawlability, indexability, XML sitemaps, robots.txt optimization, and server-side rendering for search engines.",
    icon: "Settings",
  },
  {
    id: 2,
    title: "Core Web Vitals",
    description: "Optimizing LCP, CLS, and INP for better user experience and higher search rankings through performance audits and fixes.",
    icon: "Gauge",
  },
  {
    id: 3,
    title: "Schema.org Markup",
    description: "Implementing structured data for rich snippets, knowledge panels, and enhanced search visibility across all content types.",
    icon: "Code",
  },
  {
    id: 4,
    title: "Page Speed",
    description: "Image optimization, code splitting, lazy loading, and caching strategies to achieve fast load times across all devices.",
    icon: "Zap",
  },
  {
    id: 5,
    title: "Site Architecture",
    description: "URL structure, internal linking, navigation hierarchy, and content organization for optimal crawl efficiency.",
    icon: "Network",
  },
  {
    id: 6,
    title: "Mobile Optimization",
    description: "Responsive design, mobile-first indexing compliance, and touch-friendly interfaces for seamless mobile experiences.",
    icon: "Smartphone",
  },
];

export const experience = [
  {
    id: 1,
    role: "Full Stack MERN & Next.js Developer",
    company: "Freelance",
    location: "Remote",
    period: "2022 - Present",
    description: [
      "Developed full-stack web applications using MongoDB, Express, React, Node.js, and Next.js",
      "Built SEO-optimized applications using Server-Side Rendering (SSR) and Static Site Generation (SSG)",
      "Designed and maintained RESTful APIs with secure authentication and authorization",
      "Improved application performance and Core Web Vitals (LCP, CLS, INP)",
      "Implemented clean, scalable component architecture",
      "Integrated third-party APIs and analytics tools",
      "Collaborated with designers and stakeholders to deliver production-ready solutions",
    ],
  },
  {
    id: 2,
    role: "SEO Specialist (Technical & On-Page)",
    company: "Freelance",
    location: "Remote",
    period: "2021 - Present",
    description: [
      "Performed technical SEO audits for websites and web applications",
      "Optimized site structure, internal linking, and URL architecture",
      "Implemented Schema.org structured data to improve search visibility",
      "Enhanced page speed and mobile usability",
      "Worked closely with developers to ensure SEO best practices at code level",
      "Improved organic performance through technical and on-page optimizations",
    ],
  },
];

export const education = [
  {
    id: 1,
    degree: "B.Sc. Communication & Electronics Engineering",
    institution: "Misr University for Science & Technology",
    location: "Egypt",
    period: "2014 - 2019",
    description:
      "Focused on digital systems, signal processing, and embedded systems. Developed strong analytical and problem-solving skills applicable to software development.",
  },
];

export const navLinks = [
  { name: "Home", href: "#home" },
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Contact", href: "#contact" },
];

export const openToRoles = [
  "Full Stack MERN Developer",
  "Frontend Developer (React/Next.js)",
  "Backend Developer (Node.js)",
  "Technical SEO / Web Performance Specialist",
];
