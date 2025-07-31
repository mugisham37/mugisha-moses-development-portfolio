// Brutalist theme constants
export const BRUTALIST_COLORS = {
  black: "#000000",
  white: "#ffffff",
  yellow: "#ffff00",
  gray: "#808080",
} as const;

// Animation constants
export const ANIMATION_DURATION = {
  fast: 0.2,
  normal: 0.3,
  slow: 0.5,
} as const;

// Breakpoints
export const BREAKPOINTS = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
  xl: "1280px",
} as const;

// Sample featured projects data
export const FEATURED_PROJECTS = [
  {
    id: "ecommerce-platform",
    title: "E-commerce Platform",
    description:
      "Modern e-commerce solution with advanced filtering and payment integration",
    longDescription:
      "A comprehensive e-commerce platform built with React and Node.js, featuring advanced product filtering, secure payment processing, and real-time inventory management.",
    technologies: ["React", "Node.js", "MongoDB", "Stripe", "Tailwind CSS"],
    category: "ecommerce" as const,
    images: {
      thumbnail:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop",
      mockup:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      screenshots: [
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&h=600&fit=crop",
      ],
    },
    links: {
      live: "https://demo-ecommerce.example.com",
      github: "https://github.com/example/ecommerce-platform",
      case_study: "/portfolio/ecommerce-platform",
    },
    metrics: {
      performance: "95% Lighthouse Score",
      conversion: "23% increase in sales",
      users: "10K+ active users",
    },
    featured: true,
  },
  {
    id: "saas-dashboard",
    title: "SaaS Analytics Dashboard",
    description:
      "Real-time analytics dashboard with interactive charts and data visualization",
    longDescription:
      "A comprehensive SaaS analytics dashboard featuring real-time data visualization, interactive charts, and advanced filtering capabilities for business intelligence.",
    technologies: ["Next.js", "TypeScript", "D3.js", "PostgreSQL", "Prisma"],
    category: "saas" as const,
    images: {
      thumbnail:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
      mockup:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      screenshots: [
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop",
      ],
    },
    links: {
      live: "https://demo-dashboard.example.com",
      github: "https://github.com/example/saas-dashboard",
      case_study: "/portfolio/saas-dashboard",
    },
    metrics: {
      performance: "98% Lighthouse Score",
      conversion: "40% faster data processing",
      users: "5K+ business users",
    },
    featured: true,
  },
  {
    id: "react-app",
    title: "Task Management App",
    description:
      "Collaborative task management application with real-time updates",
    longDescription:
      "A modern task management application built with React, featuring real-time collaboration, drag-and-drop functionality, and team productivity tracking.",
    technologies: ["React", "Firebase", "Material-UI", "Socket.io", "Redux"],
    category: "react" as const,
    images: {
      thumbnail:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=600&h=400&fit=crop",
      mockup:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
      screenshots: [
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=800&h=600&fit=crop",
      ],
    },
    links: {
      live: "https://demo-tasks.example.com",
      github: "https://github.com/example/task-management",
      case_study: "/portfolio/task-management",
    },
    metrics: {
      performance: "92% Lighthouse Score",
      conversion: "60% increase in team productivity",
      users: "2K+ teams",
    },
    featured: true,
  },
  {
    id: "mobile-app",
    title: "React Native Fitness App",
    description:
      "Cross-platform fitness tracking app with workout plans and progress monitoring",
    longDescription:
      "A comprehensive fitness tracking application built with React Native, featuring personalized workout plans, progress tracking, and social features for motivation.",
    technologies: ["React Native", "Expo", "Firebase", "Redux", "Native Base"],
    category: "mobile" as const,
    images: {
      thumbnail:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=400&fit=crop",
      mockup:
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      screenshots: [
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
        "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop",
      ],
    },
    links: {
      live: "https://apps.apple.com/fitness-tracker",
      github: "https://github.com/example/fitness-app",
      case_study: "/portfolio/fitness-app",
    },
    metrics: {
      performance: "4.8★ App Store Rating",
      conversion: "85% user retention",
      users: "50K+ downloads",
    },
    featured: true,
  },
  // Additional projects for the filterable grid
  {
    id: "vue-portfolio",
    title: "Vue.js Portfolio Site",
    description: "Modern portfolio website built with Vue 3 and Nuxt.js",
    longDescription:
      "A sleek portfolio website showcasing Vue.js capabilities with server-side rendering, dynamic content management, and smooth animations.",
    technologies: ["Vue.js", "Nuxt.js", "Vuetify", "Sass", "Netlify"],
    category: "vue" as const,
    images: {
      thumbnail:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=600&h=400&fit=crop",
      mockup:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
      screenshots: [
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=800&h=600&fit=crop",
      ],
    },
    links: {
      live: "https://vue-portfolio.example.com",
      github: "https://github.com/example/vue-portfolio",
    },
    featured: false,
  },
  {
    id: "react-blog",
    title: "React Blog Platform",
    description:
      "Content management system with markdown support and SEO optimization",
    longDescription:
      "A full-featured blog platform built with React, featuring markdown editing, SEO optimization, and content management capabilities.",
    technologies: [
      "React",
      "Gatsby",
      "GraphQL",
      "Contentful",
      "Styled Components",
    ],
    category: "react" as const,
    images: {
      thumbnail:
        "https://images.unsplash.com/photo-1486312338219-ce68e2c6b7d3?w=600&h=400&fit=crop",
      mockup:
        "https://images.unsplash.com/photo-1486312338219-ce68e2c6b7d3?w=800&h=600&fit=crop",
      screenshots: [
        "https://images.unsplash.com/photo-1486312338219-ce68e2c6b7d3?w=800&h=600&fit=crop",
      ],
    },
    links: {
      live: "https://react-blog.example.com",
      github: "https://github.com/example/react-blog",
    },
    featured: false,
  },
  {
    id: "ecommerce-mobile",
    title: "Mobile E-commerce App",
    description: "Native shopping experience with offline capabilities",
    longDescription:
      "A mobile-first e-commerce application with offline support, push notifications, and seamless checkout experience.",
    technologies: [
      "React Native",
      "Redux",
      "AsyncStorage",
      "Stripe",
      "Firebase",
    ],
    category: "ecommerce" as const,
    images: {
      thumbnail:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop",
      mockup:
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
      screenshots: [
        "https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=800&h=600&fit=crop",
      ],
    },
    links: {
      live: "https://play.google.com/store/apps/mobile-shop",
      github: "https://github.com/example/mobile-ecommerce",
    },
    featured: false,
  },
  {
    id: "saas-crm",
    title: "Customer Relationship Management",
    description: "Enterprise CRM solution with automation and analytics",
    longDescription:
      "A comprehensive CRM platform featuring lead management, sales automation, and advanced analytics for enterprise clients.",
    technologies: [
      "Next.js",
      "PostgreSQL",
      "Prisma",
      "Tailwind CSS",
      "Chart.js",
    ],
    category: "saas" as const,
    images: {
      thumbnail:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
      mockup:
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      screenshots: [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
      ],
    },
    links: {
      live: "https://crm-demo.example.com",
      github: "https://github.com/example/saas-crm",
    },
    featured: false,
  },
  {
    id: "vue-ecommerce",
    title: "Vue E-commerce Store",
    description: "Fashion e-commerce platform with advanced filtering",
    longDescription:
      "A modern fashion e-commerce store built with Vue.js, featuring advanced product filtering, wishlist functionality, and responsive design.",
    technologies: ["Vue.js", "Vuex", "Vue Router", "Axios", "Bootstrap Vue"],
    category: "vue" as const,
    images: {
      thumbnail:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop",
      mockup:
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      screenshots: [
        "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
      ],
    },
    links: {
      live: "https://vue-fashion.example.com",
      github: "https://github.com/example/vue-ecommerce",
    },
    featured: false,
  },
  {
    id: "react-social",
    title: "Social Media Dashboard",
    description: "Multi-platform social media management tool",
    longDescription:
      "A comprehensive social media management platform for scheduling posts, analyzing engagement, and managing multiple accounts.",
    technologies: ["React", "Node.js", "MongoDB", "Socket.io", "Chart.js"],
    category: "react" as const,
    images: {
      thumbnail:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=600&h=400&fit=crop",
      mockup:
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
      screenshots: [
        "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&h=600&fit=crop",
      ],
    },
    links: {
      live: "https://social-dashboard.example.com",
      github: "https://github.com/example/social-dashboard",
    },
    featured: false,
  },
];

// Pricing tiers data
export const PRICING_TIERS = [
  {
    id: "starter",
    name: "Starter",
    price: "$2,500",
    description: "Perfect for small businesses and personal projects",
    features: [
      "Responsive Design",
      "5 Pages Maximum",
      "Basic SEO Setup",
      "Contact Form",
      "Mobile Optimization",
      "2 Rounds of Revisions",
      "30 Days Support",
    ],
    cta: "Get Started",
    delivery: "2-3 weeks",
  },
  {
    id: "professional",
    name: "Professional",
    price: "$5,000",
    description: "Ideal for growing businesses with advanced needs",
    features: [
      "Everything in Starter",
      "Up to 10 Pages",
      "Advanced SEO & Analytics",
      "CMS Integration",
      "E-commerce Ready",
      "Performance Optimization",
      "5 Rounds of Revisions",
      "90 Days Support",
    ],
    popular: true,
    cta: "Most Popular",
    delivery: "3-4 weeks",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: "$10,000+",
    description: "Custom solutions for large-scale applications",
    features: [
      "Everything in Professional",
      "Unlimited Pages",
      "Custom Integrations",
      "Advanced Analytics",
      "Multi-language Support",
      "Priority Support",
      "Unlimited Revisions",
      "6 Months Support",
    ],
    cta: "Contact Us",
    delivery: "4-8 weeks",
  },
];

// Sample testimonials data
export const TESTIMONIALS = [
  {
    id: "testimonial-1",
    client_name: "Sarah Johnson",
    client_title: "CEO",
    company: "TechStart Inc",
    company_logo:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    content:
      "The e-commerce platform exceeded our expectations. The performance improvements and user experience enhancements led to a significant increase in our conversion rates.",
    rating: 5,
    project_type: "ecommerce",
    results: "23% increase in sales",
  },
  {
    id: "testimonial-2",
    client_name: "Michael Chen",
    client_title: "CTO",
    company: "DataFlow Solutions",
    company_logo:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    content:
      "The SaaS dashboard transformed how we visualize our data. The real-time analytics and intuitive interface have made our decision-making process much more efficient.",
    rating: 5,
    project_type: "saas",
    results: "40% faster data processing",
  },
  {
    id: "testimonial-3",
    client_name: "Emily Rodriguez",
    client_title: "Product Manager",
    company: "Productivity Plus",
    company_logo:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    content:
      "The task management app has revolutionized our team's workflow. The real-time collaboration features and intuitive design have significantly boosted our productivity.",
    rating: 5,
    project_type: "react",
    results: "60% increase in team productivity",
  },
  {
    id: "testimonial-4",
    client_name: "David Kim",
    client_title: "Founder",
    company: "FitLife Mobile",
    company_logo:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    content:
      "The fitness app delivered exactly what we envisioned. The cross-platform compatibility and engaging user interface have resulted in excellent user retention rates.",
    rating: 5,
    project_type: "mobile",
    results: "85% user retention",
  },
  {
    id: "testimonial-5",
    client_name: "Lisa Thompson",
    client_title: "Marketing Director",
    company: "Vue Innovations",
    company_logo:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop",
    content:
      "The Vue.js portfolio site perfectly captured our brand identity. The performance optimization and SEO improvements have significantly increased our online visibility.",
    rating: 5,
    project_type: "vue",
    results: "150% increase in organic traffic",
  },
];
