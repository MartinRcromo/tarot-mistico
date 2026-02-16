import { NextRequest, NextResponse } from 'next/server';
import { generateInterpretation, generateSingleCardInterpretation } from '@/lib/gemini';
import { checkRateLimit } from '@/lib/rateLimiter';
import { tarotCards } from '@/data/tarotCards';
import { spreads } from '@/data/spreads';

export async function POST(request: NextRequest) {
  try {
    // Check rate limit
    const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0] || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    
    const rateLimitResult = checkRateLimit(clientIp);
    
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        { 
          error: 'Rate limit exceeded',
          message: rateLimitResult.message,
          remainingTime: rateLimitResult.remainingTime,
          remainingMinutes: rateLimitResult.remainingMinutes,
          remainingSeconds: rateLimitResult.remainingSeconds
        },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { cards, spreadType, question } = body;

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return NextResponse.json(
        { error: 'Invalid cards data' },
        { status: 400 }
      );
    }

    // Validate cards
    const validatedCards = cards.map((c: any) => {
      const card = tarotCards.find(tc => tc.id === c.cardId);
      if (!card) {
        throw new Error(`Invalid card ID: ${c.cardId}`);
      }
      
      const spread = spreads.find(s => s.id === spreadType);
      const position = spread?.positions.find(p => p.position === c.position);
      
      return {
        card,
        position: c.position,
        positionName: position?.name || `Posición ${c.position}`,
        positionDescription: position?.description || '',
        isReversed: c.isReversed || false
      };
    });

    const spread = spreads.find(s => s.id === spreadType);
    const spreadName = spread?.nameEs || 'Tirada personalizada';

    // Generate interpretation
    let interpretation: string;
    
    if (validatedCards.length === 1) {
      interpretation = await generateSingleCardInterpretation(
        validatedCards[0].card,
        validatedCards[0].isReversed,
        question
      );
    } else {
      interpretation = await generateInterpretation(
        validatedCards,
        spreadName,
        question
      );
    }

    return NextResponse.json({
      interpretation,
      rateLimit: {
        remaining: 3 - (rateLimitResult as any).count || 0
      }
    });

  } catch (error) {
    console.error('Interpretation error:', error);
    
    if (error instanceof Error && error.message === 'Gemini API not configured') {
      return NextResponse.json(
        { error: 'AI service not configured' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to generate interpretation' },
      { status: 500 }
    );
  }
}
