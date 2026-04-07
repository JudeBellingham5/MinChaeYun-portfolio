export interface Project {
  id: string;
  title: string;
  category: string;
  description: string;
  oneLiner: string;
  period?: string;
  tools?: string[];
  personnel?: string;
  tasks: string[];
  highlights: string[];
  resultType: "PPT" | "Report" | "Site" | "GitHub";
  links?: {
    ppt?: string;
    report?: string;
    site?: string;
    site2?: string;
    github?: string;
  };
  image: string;
}

export interface Skill {
  category: string;
  items: string[];
}

export interface PortfolioData {
  name: string;
  englishName: string;
  email: string;
  profileImage: string;
  birthDate: string;
  education: string[];
  certifications: string[];
  bioTitle: string;
  bioDescription: string;
  mainProjects: Project[];
  additionalWork: Project[];
  skills: Skill[];
}
