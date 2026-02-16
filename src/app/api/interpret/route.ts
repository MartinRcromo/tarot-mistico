import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { tarotCards } from '@/data/tarotCards';
import { spreads } from '@/data/spreads';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { cards, spreadType, question } = body;

    if (!genAI) {
      return NextResponse.json(
        { error: 'Gemini API not configured' },
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

Interpreta en español (300-500 palabras) con markdown.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const result = await model.generateContent(prompt);
    const interpretation = result.response.text();

    return NextResponse.json({ interpretation });

  } catch (error) {
    console.error('Interpretation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate interpretation' },
      { status: 500 }
    );
  }
}
