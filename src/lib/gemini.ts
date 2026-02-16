import { GoogleGenerativeAI } from '@google/generative-ai';
import { TarotCard } from '@/types';

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.warn('GEMINI_API_KEY not set. AI interpretations will not work.');
}

const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

interface CardInReading {
  card: TarotCard;
  position: number;
  positionName: string;
  positionDescription: string;
  isReversed: boolean;
}

export async function generateInterpretation(
  cards: CardInReading[],
  spreadName: string,
  question?: string
): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const cardsDescription = cards.map((c, i) => {
    const orientation = c.isReversed ? 'invertida' : 'derecha';
    return `
Carta ${i + 1}: ${c.card.nameEs} (${c.card.name}) - Posición: ${c.positionName}
Orientación: ${orientation}
Palabras clave: ${c.card.keywords.join(', ')}
Significado ${c.isReversed ? 'invertido' : 'upright'}: ${c.isReversed ? c.card.meaningReversed : c.card.meaningUpright}
`;
  }).join('\n');

  const prompt = `Eres un tarotista experto y empático. Realiza una lectura de tarot profunda y significativa basada en las siguientes cartas.

TIPO DE TIRADA: ${spreadName}
${question ? `PREGUNTA DEL CONSULTANTE: ${question}` : 'Sin pregunta específica - lectura general'}

CARTAS TIRADAS:
${cardsDescription}

Por favor, proporciona una interpretación en español que:
1. Explique el significado de cada carta en su posición específica
2. Analice las conexiones y patrones entre las cartas
3. Ofrezca consejos prácticos y accionables
4. Sea empática pero honesta
5. Mantenga un tono místico pero accesible
6. Tenga entre 300-500 palabras

Estructura tu respuesta con markdown, usando títulos claros y párrafos bien organizados.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating interpretation:', error);
    throw new Error('Failed to generate interpretation');
  }
}

export async function generateSingleCardInterpretation(
  card: TarotCard,
  isReversed: boolean,
  question?: string
): Promise<string> {
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

  const orientation = isReversed ? 'invertida' : 'derecha';
  const prompt = `Eres un tarotista experto. Interpreta esta carta única para una lectura de tarot.

CARTA: ${card.nameEs} (${card.name})
ORIENTACIÓN: ${orientation}
PALABRAS CLAVE: ${card.keywords.join(', ')}
${question ? `PREGUNTA: ${question}` : 'LECTURA GENERAL'}

Significado: ${isReversed ? card.meaningReversed : card.meaningUpright}

Proporciona una interpretación en español de 150-200 palabras que sea:
- Personal y empática
- Práctica y accionable
- Mística pero accesible

Usa formato markdown simple.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error generating single card interpretation:', error);
    throw new Error('Failed to generate interpretation');
  }
}
