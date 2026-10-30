export interface TrackItem {
  id: string;
  slug: string;
  title: string;
  details: string;
  audioUrl: string;
  bpm?: number | string;
  key?: string;
  stems?: string[];
  notes?: string;
}

export interface FeaturedRelease {
  labelTitle: string;
  catalogNumber: string;
  title: string;
  subtitle: string;
  audioUrl: string;
  releaseYear: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: 'Audio Tech' | 'Web Systems' | 'Creative Coding' | 'Open Source Tools';
  year: string;
  status: 'Production' | 'Active Beta' | 'Open Source' | 'Prototype';
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  highlights: string[];
}

export interface ArticleItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  readTime: string;
  category: 'Audio DSP & Web Audio' | 'Architecture & Systems' | 'Frontend & Canvas' | 'Sound Design';
  summary: string;
  tags: string[];
  content: string;
}

export interface GearGroup {
  category: string;
  items: { name: string; role: string }[];
}

export interface SiteContent {
  brand: string;
  domain: string;
  tagline: string;
  hero: {
    eyebrow: string;
    headline: string;
    description: string;
    secondary: string;
  };
  featuredRelease: FeaturedRelease;
  catalog: {
    heading: string;
    subheading: string;
    tracks: TrackItem[];
  };
  projects: {
    heading: string;
    subheading: string;
    items: ProjectItem[];
  };
  articles: {
    heading: string;
    subheading: string;
    items: ArticleItem[];
  };
  about: {
    eyebrow: string;
    heading: string;
    body: string[];
    tags: string;
    gear: GearGroup[];
  };
  footer: {
    copyright: string;
    tagline: string;
    links: { label: string; url: string }[];
  };
}
