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
      return NextResponse.json({ error: 'Gemini API not configured' }, { status: 503 });
    }

    if (!cards || !Array.isArray(cards) || cards.length === 0) {
      return NextResponse.json({ error: 'Invalid cards data' }, { status: 400 });
    }

    const validatedCards = cards.map((c: any) => {
      const card = tarotCards.find(tc => tc.id === c.cardId);
      return {
        card,
        position: c.position,
        positionName: c.positionName,
        isReversed: c.isReversed || false
      };
    });

    const spread = spreads.find(s => s.id === spreadType);
    const spreadName = spread?.nameEs || 'Tirada personalizada';

    const cardsDescription = validatedCards.map((c, i) => {
      const orientation = c.isReversed ? 'invertida' : 'derecha';
      return `Carta ${i + 1}: ${c.card.nameEs} - Posición: ${c.positionName}
Orientación: ${orientation}
Palabras clave: ${c.card.keywords.join(', ')}
Significado: ${c.isReversed ? c.card.meaningReversed : c.card.meaningUpright}`;
    }).join('\n\n');

    const prompt = `Eres un tarotista experto. Interpreta esta tirada de tarot.

TIPO DE TIRADA: ${spreadName}
${question ? `PREGUNTA: ${question}` : 'LECTURA GENERAL'}

CARTAS:
${cardsDescription}

Proporciona una interpretación en español de 300-500 palabras, con markdown, títulos claros, y consejos prácticos.`;

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const interpretation = result.response.text();

    return NextResponse.json({ interpretation });
  } catch (error) {
    console.error('Interpretation error:', error);
    return NextResponse.json({ error: 'Failed to generate interpretation' }, { status: 500 });
  }
}
