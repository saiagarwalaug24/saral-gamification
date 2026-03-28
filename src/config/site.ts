/**
 * Site-wide configuration
 * Centralized place for app constants and settings
 */
export const siteConfig = {
  name: "SARAL",
  description: "Campaign gamification and reward management platform",
  url: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  links: {
    github: "https://github.com",
    twitter: "https://twitter.com",
  },
  creator: "SARAL",
};

export type SiteConfig = typeof siteConfig;
