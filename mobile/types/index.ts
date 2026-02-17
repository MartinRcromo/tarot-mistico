export interface User {
  id: string;
  email: string;
  full_name?: string;
}

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_at?: number;
}

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  subscription_status: 'free' | 'premium' | 'pro';
  subscription_type: 'none' | 'monthly' | 'annual';
  credits_remaining: number;
  credits_reset_at: string;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
  trial_ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DrawnCard {
  cardId: number;
  position: number;
  isReversed: boolean;
}

export interface Reading {
  id: string;
  user_id: string;
  spread_type: string;
  cards: DrawnCard[];
  interpretation: string | null;
  question: string | null;
  created_at: string;
}

export interface CreditsInfo {
  credits_remaining: number;
  subscription_status: 'free' | 'premium' | 'pro';
  is_premium: boolean;
}

export interface SpreadOption {
  id: string;
  name: string;
  description: string;
  cardCount: number;
  icon: string;
}

export interface DailyQuote {
  quote: string;
  author: string;
  date: string;
}

export interface ApiError {
  error: string;
  upgradeUrl?: string;
}
