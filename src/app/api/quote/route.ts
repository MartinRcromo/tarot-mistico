import { NextResponse } from 'next/server';
import { getDailyQuote } from '@/data/quotes';

export async function GET() {
  try {
    const quote = getDailyQuote();
    
    return NextResponse.json({
      quote: quote.quote,
      author: quote.author,
      date: quote.date
    });

  } catch (error) {
    console.error('Quote error:', error);
    return NextResponse.json(
      { error: 'Failed to get daily quote' },
      { status: 500 }
    );
  }
}
