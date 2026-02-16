import { NextRequest, NextResponse } from 'next/server';
import { tarotCards } from '@/data/tarotCards';
import { spreads } from '@/data/spreads';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { spreadType, count } = body;

    let cardCount = count;
    
    // If spreadType is provided, use its card count
    if (spreadType) {
      const spread = spreads.find(s => s.id === spreadType);
      if (spread) {
        cardCount = spread.cardCount;
      }
    }

    if (!cardCount || cardCount < 1 || cardCount > 78) {
      return NextResponse.json(
        { error: 'Invalid card count' },
        { status: 400 }
      );
    }

    // Create a copy of cards array and shuffle
    const shuffledCards = [...tarotCards].sort(() => Math.random() - 0.5);
    
    // Draw the requested number of cards
    const drawnCards = shuffledCards.slice(0, cardCount).map((card, index) => ({
      cardId: card.id,
      position: index + 1,
      isReversed: Math.random() < 0.15 // 15% chance of reversed card
    }));

    return NextResponse.json({
      cards: drawnCards,
      spreadType: spreadType || 'custom'
    });

  } catch (error) {
    console.error('Draw error:', error);
    return NextResponse.json(
      { error: 'Failed to draw cards' },
      { status: 500 }
    );
  }
}

// Also support GET for simple random card
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const count = parseInt(searchParams.get('count') || '1');
    const spreadType = searchParams.get('spreadType');

    let cardCount = count;
    
    if (spreadType) {
      const spread = spreads.find(s => s.id === spreadType);
      if (spread) {
        cardCount = spread.cardCount;
      }
    }

    if (cardCount < 1 || cardCount > 78) {
      return NextResponse.json(
        { error: 'Invalid card count' },
        { status: 400 }
      );
    }

    const shuffledCards = [...tarotCards].sort(() => Math.random() - 0.5);
    const drawnCards = shuffledCards.slice(0, cardCount).map((card, index) => ({
      cardId: card.id,
      position: index + 1,
      isReversed: Math.random() < 0.15
    }));

    return NextResponse.json({
      cards: drawnCards,
      spreadType: spreadType || 'custom'
    });

  } catch (error) {
    console.error('Draw error:', error);
    return NextResponse.json(
      { error: 'Failed to draw cards' },
      { status: 500 }
    );
  }
}
