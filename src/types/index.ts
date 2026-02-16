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
