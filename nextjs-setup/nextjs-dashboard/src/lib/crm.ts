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
  company: string;
  email: string;
  phone?: string | null;
  website?: string | null;
  industry?: string | null;
  status: ClientStatus;
  approved: boolean;
  revenue: number;
  accountManager?: string | null;
  tags: string[];
  notes?: string | null;
  posts: { count: number; lastPost: Date | string };
  lastActivity: Date | string;
}

export interface ClientStats {
  total: number;
  active: number;
  prospects: number;
  churned: number;
  totalRevenue: number;
  totalPosts: number;
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
  | "graph"
  | "inbox"
  | "calendar"
  | "pipeline"
  | "accounts"
  | "automation"
  | "audit";

export const initialDrafts: ContentDraft[] = [];
