export interface TarotCard {
  id: number;
  name: string;
  nameEs: string;
  arcana: 'major' | 'minor';
  suit: 'cups' | 'pentacles' | 'swords' | 'wands' | null;
  number: number | null;
  image: string;
  keywords: string[];
  meaningUpright: string;
  meaningReversed: string;
}

export interface SpreadPosition {
  position: number;
  name: string;
  description: string;
}

export interface SpreadType {
  id: string;
  name: string;
  nameEs: string;
  description: string;
  cardCount: number;
  positions: SpreadPosition[];
}

export interface ReadingResult {
  id: string;
  spreadType: string;
  cards: {
    card: TarotCard;
    position: number;
    isReversed: boolean;
  }[];
  interpretation: string;
  question?: string;
  createdAt: string;
}

export interface DailyQuote {
  id: number;
  quote: string;
  author: string;
  date: string;
}
