'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import ReadingPage from '@/components/ReadingPage';
import CardLibrary from '@/components/CardLibrary';
import DailyQuote from '@/components/DailyQuote';

interface QuoteData {
  quote: string;
  author: string;
}

export default function Home() {
  const [activeTab, setActiveTab] = useState('reading');
  const [dailyQuote, setDailyQuote] = useState<QuoteData | null>(null);

  useEffect(() => {
    // Fetch daily quote
    fetch('/api/quote')
      .then(res => res.json())
      .then(data => setDailyQuote(data))
      .catch(console.error);
  }, []);

  return (
    <main className="min-h-screen relative z-10">
      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />

      <div className="max-w-7xl mx-auto px-4">
        {/* Daily Quote */}
        {dailyQuote && activeTab === 'reading' && (
          <DailyQuote quote={dailyQuote.quote} author={dailyQuote.author} />
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'reading' && <ReadingPage />}
            {activeTab === 'library' && <CardLibrary />}
            {activeTab === 'about' && <AboutPage />}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-gray-500 text-sm">
        <p>
          ✦ Tarot Místico ✦
        </p>
        <p className="mt-2">
          Las lecturas de tarot son para fines de entretenimiento y reflexión personal.
        </p>
        <p className="mt-1">
          © {new Date().getFullYear()} - Desarrollado con {' '}
          <span className="text-purple-400">♥</span> y Next.js
        </p>
      </footer>
    </main>
  );
}

function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 pb-12">
      <motion.div
        className="glass rounded-xl p-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="heading-2 text-center mb-8 gold-accent">
          Acerca de Tarot Místico
        </h2>

        <div className="space-y-6 text-gray-300">
          <section>
            <h3 className="text-xl font-medium text-purple-300 mb-3">
              🔮 ¿Qué es el Tarot?
            </h3>
            <p className="leading-relaxed">
              El tarot es un sistema de cartas con una rica historia que se remonta al siglo XV. 
              Originalmente utilizado para juegos de cartas, evolucionó hasta convertirse en una 
              herramienta poderosa para la introspección, la reflexión personal y la exploración 
              del subconsciente.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-medium text-purple-300 mb-3">
              ✨ Nuestra Aplicación
            </h3>
            <p className="leading-relaxed">
              Tarot Místico combina la sabiduría ancestral del tarot con la inteligencia artificial 
              moderna. Utilizamos el modelo Gemini de Google para ofrecer interpretaciones 
              personalizadas y profundas basadas en tu tirada específica.
            </p>
            <ul className="mt-4 space-y-2 list-disc list-inside">
              <li>78 cartas completas del tarot Rider-Waite-Smith</li>
              <li>4 tipos de tiradas diferentes</li>
              <li>Interpretaciones con IA en español</li>
              <li>Biblioteca completa con significados</li>
              <li>Experiencia mística y envolvente</li>
            </ul>
          </section>

          <section>
            <h3 className="text-xl font-medium text-purple-300 mb-3">
              🌟 Cómo Funciona
            </h3>
            <ol className="space-y-2 list-decimal list-inside">
              <li>Elige el tipo de tirada que prefieras</li>
              <li>Escribe una pregunta (opcional) o pide una lectura general</li>
              <li>Haz clic en &ldquo;Realizar Tirada&rdquo;</li>
              <li>Revela las cartas una por una</li>
              <li>Obtén tu interpretación personalizada con IA</li>
            </ol>
          </section>

          <section>
            <h3 className="text-xl font-medium text-purple-300 mb-3">
              ⚠️ Nota Importante
            </h3>
            <p className="leading-relaxed">
              Las lecturas de tarot son herramientas de reflexión y entretenimiento. 
              No reemplazan el consejo profesional médico, legal, financiero o psicológico. 
              Las decisiones importantes de la vida deben tomarse con criterio propio y, 
              cuando sea necesario, con la ayuda de profesionales calificados.
            </p>
          </section>

          <section>
            <h3 className="text-xl font-medium text-purple-300 mb-3">
              🛠️ Tecnología
            </h3>
            <p className="leading-relaxed">
              Esta aplicación está construida con:
            </p>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>Next.js 14 - Framework de React</li>
              <li>TypeScript - Tipado seguro</li>
              <li>Tailwind CSS - Estilos modernos</li>
              <li>Framer Motion - Animaciones fluidas</li>
              <li>Google Gemini - Inteligencia Artificial</li>
            </ul>
          </section>
        </div>
      </motion.div>
    </div>
  );
}
