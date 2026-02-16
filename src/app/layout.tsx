import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Tarot Místico - Lecturas de Tarot con IA',
  description: 'Descubre los secretos del tarot con lecturas personalizadas impulsadas por inteligencia artificial. Explora las 78 cartas del tarot y recibe interpretaciones profundas.',
  keywords: 'tarot, lectura de tarot, cartas del tarot, arcanos mayores, arcanos menores, tirada de tarot, interpretación de tarot',
  openGraph: {
    title: 'Tarot Místico - Lecturas de Tarot con IA',
    description: 'Descubre los secretos del tarot con lecturas personalizadas impulsadas por inteligencia artificial.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="antialiased">
        <StarBackground />
        {children}
      </body>
    </html>
  );
}

function StarBackground() {
  // Generate static stars for the background
  const stars = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    size: Math.random() * 2 + 1,
    delay: Math.random() * 2,
    duration: Math.random() * 2 + 1,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            left: star.left,
            top: star.top,
            width: `${star.size}px`,
            height: `${star.size}px`,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
