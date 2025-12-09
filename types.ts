export interface Field {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface FieldDetailData {
  id: string;
  name: string;
  icon: string;
  overview: string; // Markdown
  ideologicalPoint: string; // 思政融合点
  history: string; // 发展简史 Markdown
  future: string; // 技术前沿 Markdown
}

export interface CaseStudy {
  id: string;
  title: string;
  category: 'red_engineering' | 'model_engineer';
  summary: string;
  date?: string;
  tags: string[];
}

export interface CaseDetailData extends CaseStudy {
  fullContent: string; // Markdown detailed story
  quote: string; // 名言/精神语录
  images: string[]; // Image placeholders
  relatedTech: string[]; // Related technology keywords
  sourceUrl?: string; // Authoritative source URL
}

export interface Company {
  name: string;
  logoInitial: string;
  url: string;
}

export interface ExternalLink {
  name: string;
  url: string;
  description: string;
}

export interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  url?: string;
}

export enum ChatSender {
  USER = 'user',
  AI = 'ai',
}

export interface ChatMessage {
  id: string;
  sender: ChatSender;
  text: string;
  timestamp: Date;
}

// New types for Spirit Data
export interface Spirit {
  name: string;
  note?: string;
  details: string; // Markdown content for the modal
}

export interface SpiritCategory {
  period: string;
  spirits: Spirit[][]; // Array of arrays for table layout (rows of spirits)
}