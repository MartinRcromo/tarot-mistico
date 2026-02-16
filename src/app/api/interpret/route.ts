import { NextRequest, NextResponse } from 'next/server';
import { tarotCards } from '@/data/tarotCards';
import { spreads } from '@/data/spreads';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cards, spreadType, question } = body;

    if (!OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API not configured' },
        { status: 503 }
      );
    }

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return NextResponse.json(
        { error: 'Invalid cards data' },
        { status: 400 }
      );
    }

    const spread = spreads.find(s => s.id === spreadType);
    const spreadName = spread?.nameEs || 'Tirada personalizada';

    const cardsDescription: string[] = [];
    
    for (const c of cards) {
      const card = tarotCards.find(tc => tc.id === c.cardId);
      if (!card) {
        return NextResponse.json(
          { error: `Invalid card ID: ${c.cardId}` },
          { status: 400 }
        );
      }
      
      const position = spread?.positions.find(p => p.position === c.position);
      const positionName = c.positionName || position?.name || `Posición ${c.position}`;
      const orientation = c.isReversed ? 'invertida' : 'derecha';
      
      cardsDescription.push(
        `Carta: ${card.nameEs} (${card.name}) - Posición: ${positionName}\n` +
        `Orientación: ${orientation}\n` +
        `Palabras clave: ${card.keywords.join(', ')}\n` +
        `Significado: ${c.isReversed ? card.meaningReversed : card.meaningUpright}`
      );
    }

    const prompt = `Eres un tarotista experto y empático.

TIPO DE TIRADA: ${spreadName}
${question ? `PREGUNTA: ${question}` : 'LECTURA GENERAL'}

CARTAS:
${cardsDescription.join('\n\n')}

Interpreta en español (300-500 palabras) con markdown, títulos claros, y consejos prácticos.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Eres un tarotista experto, empático y místico. Das interpretaciones profundas en español.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to generate interpretation' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const interpretation = data.choices[0].message.content;

    return NextResponse.json({ interpretation });

  } catch (error) {
    console.error('Interpretation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate interpretation' },
      { status: 500 }
    );
  }
}
