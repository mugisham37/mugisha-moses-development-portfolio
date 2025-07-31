// Project interface
export interface Project {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  technologies: string[];
  category: "react" | "vue" | "ecommerce" | "saas" | "mobile";
  images: {
    thumbnail: string;
    mockup: string;
    screenshots: string[];
  };
  links: {
    live?: string;
    github?: string;
    case_study?: string;
  };
  metrics?: {
    performance: string;
    conversion: string;
    users: string;
  };
  featured: boolean;
}

// Testimonial interface
export interface Testimonial {
  id: string;
  client_name: string;
  client_title: string;
  company: string;
  company_logo: string;
  content: string;
  rating: number;
  project_type: string;
  results?: string;
}

// Service interface
export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  starting_price: string;
  delivery_time: string;
}
