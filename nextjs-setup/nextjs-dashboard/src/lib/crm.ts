export type DraftStatus = "draft" | "approved" | "rejected" | "published";

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
  platform: string;
  text: string;
  hashtags: string[];
  status: DraftStatus;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export const initialBrandProfile: BrandProfile = {
  name: "",
  audience: "",
  voice: "",
  prohibitedTopics: [],
  requiredDisclosures: [],
};

export const initialClients = [
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

export const initialAnalytics = [
  {
    platform: "meta",
    impressions: 100,
    engagements: 12,
    clicks: 5,
    followersGained: 3,
  },
];

export const initialDrafts: ContentDraft[] = [
  {
    id: "1",
    topic: "Welcome to SMMAI",
    platform: "meta",
    text: "Get started with social media management automation.",
    hashtags: ["#content", "#automation"],
    status: "published" as DraftStatus,
    metadata: {},
    createdAt: new Date().toISOString(),
  },
];