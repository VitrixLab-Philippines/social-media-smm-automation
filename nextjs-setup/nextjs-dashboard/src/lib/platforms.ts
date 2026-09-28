export type SocialPlatform = "meta" | "facebook" | "instagram" | "linkedin" | "x" | "twitter" | "tiktok" | "youtube";

export interface PlatformCapabilities {
  platform: SocialPlatform;
  displayName: string;
  oauth: "oauth2";
  publish: boolean;
  media: boolean;
  scheduling: boolean;
  analytics: boolean;
  webhooks: boolean;
  phase: 1 | 2 | 3;
}

export const PLATFORM_CAPABILITIES: readonly PlatformCapabilities[] = [
  { platform: "meta", displayName: "Meta", oauth: "oauth2", publish: true, media: true, scheduling: true, analytics: true, webhooks: true, phase: 1 },
  { platform: "facebook", displayName: "Facebook Pages", oauth: "oauth2", publish: true, media: true, scheduling: true, analytics: true, webhooks: true, phase: 1 },
  { platform: "instagram", displayName: "Instagram", oauth: "oauth2", publish: true, media: true, scheduling: true, analytics: true, webhooks: true, phase: 1 },
  { platform: "linkedin", displayName: "LinkedIn", oauth: "oauth2", publish: true, media: true, scheduling: true, analytics: true, webhooks: true, phase: 2 },
  { platform: "x", displayName: "X", oauth: "oauth2", publish: true, media: true, scheduling: true, analytics: true, webhooks: true, phase: 2 },
  { platform: "twitter", displayName: "X (legacy alias)", oauth: "oauth2", publish: true, media: true, scheduling: true, analytics: true, webhooks: true, phase: 2 },
  { platform: "tiktok", displayName: "TikTok", oauth: "oauth2", publish: true, media: true, scheduling: true, analytics: true, webhooks: true, phase: 3 },
  { platform: "youtube", displayName: "YouTube", oauth: "oauth2", publish: true, media: true, scheduling: true, analytics: true, webhooks: true, phase: 3 },
];

export function getPlatformCapabilities(platform: string) {
  return PLATFORM_CAPABILITIES.find((item) => item.platform === platform.toLowerCase());
}
