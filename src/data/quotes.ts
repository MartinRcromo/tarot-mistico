import { DailyQuote } from '@/types';

export const dailyQuotes: DailyQuote[] = [
  {
    id: 1,
    quote: "El tarot no predice el futuro, revela los caminos posibles que yacen ante ti.",
    author: "Anónimo",
    date: "2024-01-01"
  },
  {
    id: 2,
    quote: "La intuición es la voz del alma; el tarot es su megáfono.",
    author: "Anónimo",
    date: "2024-01-02"
  },
  {
    id: 3,
    quote: "Cada carta es un espejo que refleja lo que ya sabes en tu corazón.",
    author: "Anónimo",
    date: "2024-01-03"
  },
  {
    id: 4,
    quote: "El verdadero mago no está en las cartas, sino en quien las interpreta.",
    author: "Anónimo",
    date: "2024-01-04"
  },
  {
    id: 5,
    quote: "Las cartas muestran el camino, pero tú debes caminarlo.",
    author: "Anónimo",
    date: "2024-01-05"
  },
  {
    id: 6,
    quote: "En el silencio de la tirada, escucha lo que tu alma susurra.",
    author: "Anónimo",
    date: "2024-01-06"
  },
  {
    id: 7,
    quote: "El tarot es un lenguaje simbólico que habla directamente al inconsciente.",
    author: "Carl Jung",
    date: "2024-01-07"
  },
  {
    id: 8,
    quote: "No temas a la carta de la Muerte; en cada final hay un nuevo comienzo.",
    author: "Anónimo",
    date: "2024-01-08"
  },
  {
    id: 9,
    quote: "La Torre destruye lo falso para revelar la verdad que hay debajo.",
    author: "Anónimo",
    date: "2024-01-09"
  },
  {
    id: 10,
    quote: "La Estrella brilla más brillante en la noche más oscura.",
    author: "Anónimo",
    date: "2024-01-10"
  },
  {
    id: 11,
    quote: "El Loco da el primer paso hacia el abismo y encuentra el puente.",
    author: "Anónimo",
    date: "2024-01-11"
  },
  {
    id: 12,
    quote: "La Luna ilumina lo oculto; no temas mirar tus sombras.",
    author: "Anónimo",
    date: "2024-01-12"
  },
  {
    id: 13,
    quote: "El Sol sale para todos, sin importar lo que la noche haya traído.",
    author: "Anónimo",
    date: "2024-01-13"
  },
  {
    id: 14,
    quote: "El Mago tiene todas las herramientas; solo debe recordar usarlas.",
    author: "Anónimo",
    date: "2024-01-14"
  },
  {
    id: 15,
    quote: "La Sacerdotisa guarda los secretos que estás listo para escuchar.",
    author: "Anónimo",
    date: "2024-01-15"
  },
  {
    id: 16,
    quote: "La Emperatriz florece donde pone su atención; cultiva tu jardín interior.",
    author: "Anónimo",
    date: "2024-01-16"
  },
  {
    id: 17,
    quote: "El Emperador construye su reino un ladrillo a la vez; la paciencia es poder.",
    author: "Anónimo",
    date: "2024-01-17"
  },
  {
    id: 18,
    quote: "Los Enamorados eligen con el corazón, pero sabios son los que escuchan también la mente.",
    author: "Anónimo",
    date: "2024-01-18"
  },
  {
    id: 19,
    quote: "El Carro avanza cuando los opuestos se unen en dirección común.",
    author: "Anónimo",
    date: "2024-01-19"
  },
  {
    id: 20,
    quote: "La Fuerza no domina con violencia, sino con la suavidad de la compasión.",
    author: "Anónimo",
    date: "2024-01-20"
  },
  {
    id: 21,
    quote: "El Ermitaño encuentra la verdad que busca solo cuando deja de buscar afuera.",
    author: "Anónimo",
    date: "2024-01-21"
  },
  {
    id: 22,
    quote: "La Rueda gira para todos; en la cima, recuerda el valle; en el valle, espera la cima.",
    author: "Anónimo",
    date: "2024-01-22"
  },
  {
    id: 23,
    quote: "La Justicia pesa tus acciones con la balanza del karma.",
    author: "Anónimo",
    date: "2024-01-23"
  },
  {
    id: 24,
    quote: "El Colgado ve el mundo de cabeza y descubre verdades ocultas.",
    author: "Anónimo",
    date: "2024-01-24"
  },
  {
    id: 25,
    quote: "La Templanza mezcla lo opuesto en la copa de la armonía.",
    author: "Anónimo",
    date: "2024-01-25"
  },
  {
    id: 26,
    quote: "El Diablo te muestra las cadenas que tú mismo has forjado.",
    author: "Anónimo",
    date: "2024-01-26"
  },
  {
    id: 27,
    quote: "El Juicio te llama a despertar a tu verdadero propósito.",
    author: "Anónimo",
    date: "2024-01-27"
  },
  {
    id: 28,
    quote: "El Mundo es tuyo cuando completas el ciclo que comenzaste.",
    author: "Anónimo",
    date: "2024-01-28"
  },
  {
    id: 29,
    quote: "Cada día es una nueva tirada; cada momento, una carta por descubrir.",
    author: "Anónimo",
    date: "2024-01-29"
  },
  {
    id: 30,
    quote: "Confía en el viaje, incluso cuando no veas el destino.",
    author: "Anónimo",
    date: "2024-01-30"
  },
  {
    id: 31,
    quote: "La sabiduría del tarot no está en las cartas, sino en el espacio entre ellas.",
    author: "Anónimo",
    date: "2024-01-31"
  }
];

export const getDailyQuote = (): DailyQuote => {
  // Get quote based on current date for consistency
  const today = new Date();
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
  const index = dayOfYear % dailyQuotes.length;
  return dailyQuotes[index];
};

export const getRandomQuote = (): DailyQuote => {
  const randomIndex = Math.floor(Math.random() * dailyQuotes.length);
  return dailyQuotes[randomIndex];
};
