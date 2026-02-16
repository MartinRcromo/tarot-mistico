import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { tarotCards } from '@/data/tarotCards';
import { spreads } from '@/data/spreads';

// Initialize Gemini
const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

interface CardData {
  cardId: number;
  position: number;
  isReversed: boolean;
  positionName?: string;
}

interface ValidatedCard {
  card: typeof tarotCards[0];
  position: number;
  positionName: string;
  isReversed: boolean;
}

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

    // Validate and enrich cards
    const validatedCards: ValidatedCard[] = [];
    
    for (const c of cards as CardData[]) {
      const card = tarotCards.find(tc => tc.id === c.cardId);
      if (!card) {
        return NextResponse.json(
          { error: `Invalid card ID: ${c.cardId}` },
          { status: 400 }
        );
      }
      
      const spread = spreads.find(s => s.id === spreadType);
      const position = spread?.positions.find(p => p.position === c.position);
      
      validatedCards.push({
        card,
        position: c.position,
        positionName: c.positionName || position?.name || `Posición ${c.position}`,
        isReversed: c.isReversed || false
      });
    }

    const spread = spreads.find(s => s.id === spreadType);
    const spreadName = spread?.nameEs || 'Tirada personalizada';

    // Build prompt
    const cardsDescription = validatedCards.map((c, i) => {
      const orientation = c.isReversed ? 'invertida' : 'derecha';
      return `Carta ${i + 1}: ${c.card.nameEs} (${c.card.name}) - Posición: ${c.positionName}
Orientación: ${orientation}
Palabras clave: ${c.card.keywords.join(', ')}
Significado: ${c.isReversed ? c.card.meaningReversed : c.card.meaningUpright}`;
    }).join('\n\n');

    const prompt = `Eres un tarotista experto y empático. Realiza una lectura de tarot profunda y significativa.

TIPO DE TIRADA: ${spreadName}
${question ? `PREGUNTA DEL CONSULTANTE: ${question}` : 'Sin pregunta específica - lectura general'}

CARTAS TIRADAS:
${cardsDescription}

Proporciona una interpretación en español que:
1. Explique el significado de cada carta en su posición específica
2. Analice las conexiones y patrones entre las cartas
3. Ofrezca consejos prácticos y accionables
4. Sea empática pero honesta
5. Mantenga un tono místico pero accesible
6. Tenga entre 300-500 palabras

Estructura tu respuesta con markdown, usando títulos claros y párrafos bien organizados.`;

    // Generate interpretation
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const interpretation = result.response.text();

    return NextResponse.json({
      interpretation,
    });

  } catch (error) {
    console.error('Interpretation error:', error);
    
    return NextResponse.json(
      { error: 'Failed to generate interpretation' },
      { status: 500 }
    );
  }
}
