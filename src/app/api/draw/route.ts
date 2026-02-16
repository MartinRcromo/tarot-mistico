import { NextRequest, NextResponse } from 'next/server';
import { tarotCards } from '@/data/tarotCards';
import { spreads } from '@/data/spreads';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spreadType, count } = body;

    let cardCount = count;
    
    if (spreadType) {
      const spread = spreads.find(s => s.id === spreadType);
      if (spread) cardCount = spread.cardCount;
    }

    if (!cardCount || cardCount < 1 || cardCount > 78) {
      return NextResponse.json({ error: 'Invalid card count' }, { status: 400 });
    }

    const shuffledCards = [...tarotCards].sort(() => Math.random() - 0.5);
    const drawnCards = shuffledCards.slice(0, cardCount).map((card, index) => ({
      cardId: card.id,
      position: index + 1,
      isReversed: Math.random() < 0.15
    }));

    return NextResponse.json({ cards: drawnCards, spreadType: spreadType || 'custom' });
  } catch (error) {
    console.error('Draw error:', error);
    return NextResponse.json({ error: 'Failed to draw cards' }, { status: 500 });
  }
}
