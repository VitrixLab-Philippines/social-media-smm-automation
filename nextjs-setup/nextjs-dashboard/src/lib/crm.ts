export type Platform = "meta" | "linkedin" | "twitter" | "x" | "facebook" | "instagram" | "tiktok" | "youtube" | (string & {});

export type DraftStatus = "draft" | "pending" | "approved" | "rejected" | "scheduled" | "published";
export type ClientStatus = "PROSPECT" | "ACTIVE" | "PAUSED" | "CHURNED";

export const CLIENT_STATUSES: ClientStatus[] = ["PROSPECT", "ACTIVE", "PAUSED", "CHURNED"];

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

export interface ClientStats {
  id: string;
  name: string;
  revenue: number;
  postCount: number;
  lastActivity: Date | string;
  status: ClientStatus;
}

export const initialBrandProfile: BrandProfile = {
  name: "",
  audience: "",
  voice: "",
  prohibitedTopics: [],
  requiredDisclosures: [],
};

export const initialClients: Client[] = [];

export const initialAnalytics: AnalyticsMetric[] = [];

export type DashboardViewSection =
  | "overview"
  | "approval"
  | "drafts"
  | "analytics"
  | "guardrails"
  | "clients"
  | "settings"
  | "graph";

export const initialDrafts: ContentDraft[] = [];
