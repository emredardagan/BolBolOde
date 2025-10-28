export const APP_CONFIG = {
  version: '1.0.0',
  appName: 'BölBölÖde',
  supportEmail: 'support@bolbolode.com',
  maxGroupMembers: 100,
  maxExpenseParticipants: 100,
  maxAttachments: 5,
  maxAttachmentSize: 5 * 1024 * 1024, // 5 MB
  inviteTokenExpiry: 7 * 24 * 60 * 60 * 1000, // 7 days
  inviteMaxUsage: 50,
  settlementMinimumAmount: 100, // 1 TL in kuruş
  softDeleteRetention: 30 * 24 * 60 * 60 * 1000, // 30 days
} as const;

