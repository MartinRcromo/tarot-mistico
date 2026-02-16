import { SpreadType } from '@/types';

export const spreads: SpreadType[] = [
  {
    id: 'single',
    name: 'Single Card',
    nameEs: 'Una Carta',
    description: 'Una sola carta para obtener orientación rápida y clara sobre una situación específica.',
    cardCount: 1,
    positions: [
      {
        position: 1,
        name: 'La Respuesta',
        description: 'La energía principal o mensaje para tu pregunta'
      }
    ]
  },
  {
    id: 'three-card',
    name: 'Three Cards',
    nameEs: 'Tres Cartas',
    description: 'La tirada clásica de tres cartas que representa pasado, presente y futuro.',
    cardCount: 3,
    positions: [
      {
        position: 1,
        name: 'Pasado',
        description: 'Influencias pasadas que afectan la situación actual'
      },
      {
        position: 2,
        name: 'Presente',
        description: 'La energía actual y el estado de la situación'
      },
      {
        position: 3,
        name: 'Futuro',
        description: 'El probable resultado si continúas en el camino actual'
      }
    ]
  },
  {
    id: 'celtic-cross',
    name: 'Celtic Cross',
    nameEs: 'Cruz Celta',
    description: 'La tirada más completa de 10 cartas que ofrece una visión profunda de la situación.',
    cardCount: 10,
    positions: [
      {
        position: 1,
        name: 'Situación Actual',
        description: 'La energía central que rodea tu pregunta'
      },
      {
        position: 2,
        name: 'Desafío',
        description: 'El obstáculo o desafío que enfrentas'
      },
      {
        position: 3,
        name: 'Base',
        description: 'La base o fundamento de la situación'
      },
      {
        position: 4,
        name: 'Pasado Reciente',
        description: 'Influencias del pasado reciente'
      },
      {
        position: 5,
        name: 'Mejor Resultado',
        description: 'El mejor resultado posible que puedes esperar'
      },
      {
        position: 6,
        name: 'Futuro Inmediato',
        description: 'Lo que viene en el corto plazo'
      },
      {
        position: 7,
        name: 'Tu Influencia',
        description: 'Tu actitud e influencia en la situación'
      },
      {
        position: 8,
        name: 'Influencia Externa',
        description: 'Personas o circunstancias externas que influyen'
      },
      {
        position: 9,
        name: 'Esperanzas/Miedos',
        description: 'Tus esperanzas o miedos sobre la situación'
      },
      {
        position: 10,
        name: 'Resultado Final',
        description: 'El resultado probable si continúas así'
      }
    ]
  },
  {
    id: 'horseshoe',
    name: 'Horseshoe',
    nameEs: 'Herradura',
    description: 'Una tirada de 7 cartas en forma de herradura para ver diferentes aspectos de tu situación.',
    cardCount: 7,
    positions: [
      {
        position: 1,
        name: 'Pasado',
        description: 'Influencias pasadas relevantes'
      },
      {
        position: 2,
        name: 'Presente',
        description: 'Tu situación actual'
      },
      {
        position: 3,
        name: 'Futuro Oculto',
        description: 'Influencias ocultas en el futuro cercano'
      },
      {
        position: 4,
        name: 'Consejo',
        description: 'Consejo para tu situación'
      },
      {
        position: 5,
        name: 'Personas Involucradas',
        description: 'Personas que influyen en la situación'
      },
      {
        position: 6,
        name: 'Obstáculos',
        description: 'Desafíos que debes superar'
      },
      {
        position: 7,
        name: 'Resultado Probable',
        description: 'El resultado más probable'
      }
    ]
  }
];

export const getSpreadById = (id: string): SpreadType | undefined => {
  return spreads.find(spread => spread.id === id);
};
