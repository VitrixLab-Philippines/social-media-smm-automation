// src/lib/crm.ts

export type Platform =
  | "meta"
  | "linkedin"
  | "twitter"
  | "x"
  | "facebook"
  | "instagram"
  | "tiktok"
  | "youtube"
  | (string & {}); // allows custom strings while still giving autocomplete

export type DraftStatus =
  | "draft"
  | "pending"
  | "approved"
  | "rejected"
  | "scheduled"
  | "published";

export interface BrandProfile {
  name: string;
  audience: string;
  voice: string;
  prohibitedTopics: string[];
  requiredDisclosures: string[];
}

export interface ContentDraft {
  id: string;
  topic: string;
  platform: Platform;
  text: string;
  hashtags: string[];
  status: DraftStatus;
  metadata?: Record<string, unknown>;
  createdAt: string | Date;
  // Optional fields used by the UI
  engagementScore?: number;
  author?: string;
  scheduledAt?: string | Date;
  publishedAt?: string | Date;
}

export interface AnalyticsMetric {
  platform: string;
  impressions: number;
  engagements: number;
  clicks: number;
  followersGained: number;
  // Optional extras used by AnalyticsCards
  change?: number;
  rate?: number;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  approved: boolean;
  posts: { count: number; lastPost: Date | string };
  revenue: number;
  lastActivity: string;
}

export const initialBrandProfile: BrandProfile = {
  name: "",
  audience: "",
  voice: "",
  prohibitedTopics: [],
  requiredDisclosures: [],
};

export const initialClients: Client[] = [
  {
    id: "1",
    name: "Acme Corp",
    email: "contact@acme.com",
    approved: true,
    posts: { count: 42, lastPost: new Date() },
    revenue: 12500,
    lastActivity: "2024-01-15",
  },
];

export const initialAnalytics: AnalyticsMetric[] = [
  {
    platform: "meta",
    impressions: 100,
    engagements: 12,
    clicks: 5,
    followersGained: 3,
    change: 0,
    rate: 0,
  },
];

export type DashboardViewSection =
  | "approval"
  | "graph"
  | "analytics"
  | "guardrails"
  | "crm";

export const initialDrafts: ContentDraft[] = [
  {
    id: "1",
    topic: "Welcome to SMMAI",
    platform: "meta",
    text: "Get started with social media management automation.",
    hashtags: ["#content", "#automation"],
    status: "published",
    metadata: {},
    createdAt: new Date().toISOString(),
  },
];