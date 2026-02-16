# 🔮 Tarot Místico

Aplicación web moderna de lecturas de tarot con interpretaciones impulsadas por Inteligencia Artificial (Google Gemini). Desarrollada con Next.js 14, TypeScript y Tailwind CSS.

![Tarot Místico](https://img.shields.io/badge/Tarot-M%C3%ADstico-purple)
![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Características

- **🃏 78 Cartas Completas**: Arcanos Mayores y Menores del tarot Rider-Waite-Smith
- **🔮 4 Tipos de Tiradas**: Una carta, Tres cartas, Cruz Celta (10 cartas), Herradura (7 cartas)
- **🤖 Interpretación con IA**: Integración con Google Gemini para lecturas personalizadas
- **📚 Biblioteca de Cartas**: Explora todas las cartas con sus significados
- **🎨 Diseño Místico**: Interfaz dark-themed con animaciones fluidas
- **📱 100% Responsive**: Optimizado para móvil, tablet y desktop
- **⚡ Rate Limiting**: Protección contra abuso (3 lecturas cada 5 minutos)
- **🌍 En Español**: Toda la interfaz y las interpretaciones en español

## 🚀 Demo

[Ver demo en vivo](https://your-app.netlify.app) *(actualizar con tu URL)*

## 🛠️ Tecnologías

- **Framework**: [Next.js 14](https://nextjs.org/) con App Router
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org/)
- **Estilos**: [Tailwind CSS](https://tailwindcss.com/)
- **Animaciones**: [Framer Motion](https://www.framer.com/motion/)
- **IA**: [Google Gemini](https://deepmind.google/technologies/gemini/)
- **Hosting**: [Netlify](https://netlify.com)

## 📦 Instalación

### Prerrequisitos

- Node.js 18+ 
- npm o yarn
- API Key de Google Gemini (opcional, para interpretaciones con IA)

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/yourusername/tarot-mistico.git
cd tarot-mistico
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
cp .env.example .env.local
```
Edita `.env.local` y agrega tu API key de Google Gemini:
```
GEMINI_API_KEY=tu_api_key_aqui
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

5. **Abrir en el navegador**
Visita [http://localhost:3000](http://localhost:3000)

## 🚀 Deploy en Netlify

### Opción 1: Deploy desde GitHub (Recomendado)

1. Sube tu código a GitHub
2. Conecta tu repositorio en [Netlify](https://app.netlify.com/)
3. Configura las variables de entorno en Netlify:
   - Ve a Site settings → Environment variables
   - Agrega `GEMINI_API_KEY`
4. Netlify detectará automáticamente el `netlify.toml` y hará el deploy

### Opción 2: Deploy manual

```bash
# Build del proyecto
npm run build

# Deploy a Netlify (requiere Netlify CLI)
npx netlify deploy --prod --dir=dist
```

## 📁 Estructura del Proyecto

```
tarot-app/
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── api/               # API Routes
│   │   │   ├── draw/         # Endpoint para sacar cartas
│   │   │   ├── interpret/    # Endpoint para interpretación con IA
│   │   │   └── quote/        # Endpoint para frase del día
│   │   ├── globals.css       # Estilos globales
│   │   ├── layout.tsx        # Layout principal
│   │   └── page.tsx          # Página principal
│   ├── components/            # Componentes React
│   │   ├── CardLibrary.tsx   # Biblioteca de cartas
│   │   ├── DailyQuote.tsx    # Frase del día
│   │   ├── Interpretation.tsx # Componente de interpretación
│   │   ├── Navigation.tsx    # Navegación
│   │   ├── ReadingArea.tsx   # Área de lectura
│   │   ├── ReadingPage.tsx   # Página de lectura
│   │   ├── SpreadSelector.tsx # Selector de tiradas
│   │   └── TarotCard.tsx     # Componente de carta
│   ├── data/                  # Datos estáticos
│   │   ├── quotes.ts         # Frases del día
│   │   ├── spreads.ts        # Tipos de tiradas
│   │   └── tarotCards.ts     # Datos de las 78 cartas
│   ├── lib/                   # Utilidades
│   │   ├── gemini.ts         # Integración con Gemini
│   │   └── rateLimiter.ts    # Rate limiting
│   └── types/                 # Tipos TypeScript
│       └── index.ts          # Definiciones de tipos
├── public/                    # Archivos estáticos
├── .env.example              # Ejemplo de variables de entorno
├── netlify.toml              # Configuración de Netlify
├── next.config.js            # Configuración de Next.js
├── package.json              # Dependencias
├── postcss.config.js         # Configuración de PostCSS
├── tailwind.config.js        # Configuración de Tailwind
└── tsconfig.json             # Configuración de TypeScript
```

## 🔌 API Endpoints

### `GET /api/draw`
Saca cartas aleatorias del mazo.

**Query Parameters:**
- `count` (number): Cantidad de cartas a sacar (1-78)
- `spreadType` (string): Tipo de tirada ('single', 'three-card', 'celtic-cross', 'horseshoe')

**Response:**
```json
{
  "cards": [
    { "cardId": 5, "position": 1, "isReversed": false },
    { "cardId": 23, "position": 2, "isReversed": true }
  ],
  "spreadType": "three-card"
}
```

### `POST /api/interpret`
Genera una interpretación con IA para una tirada.

**Body:**
```json
{
  "cards": [
    { "cardId": 5, "position": 1, "isReversed": false }
  ],
  "spreadType": "single",
  "question": "¿Debería aceptar esa oferta de trabajo?"
}
```

**Response:**
```json
{
  "interpretation": "# Interpretación de tu tirada..."
}
```

### `GET /api/quote`
Obtiene la frase del día.

**Response:**
```json
{
  "quote": "El tarot no predice el futuro...",
  "author": "Anónimo",
  "date": "2024-01-01"
}
```

## 💰 Costos

| Servicio | Plan Gratuito | Costo Extra |
|----------|---------------|-------------|
| **Netlify** | 100GB bandwidth/mes | $0 |
| **Google Gemini** | 1,500 requests/día | $0.075/1K requests |

**Estimación mensual**: $0 (hasta ~45,000 lecturas/mes)

## ⚙️ Configuración

### Variables de Entorno

| Variable | Descripción | Requerido |
|----------|-------------|-----------|
| `GEMINI_API_KEY` | API key de Google Gemini | Sí (para IA) |
| `ALLOWED_ORIGINS` | Orígenes permitidos para API | No |
| `NODE_ENV` | Entorno de Node.js | No |

### Personalización

#### Agregar nuevas cartas
Edita `src/data/tarotCards.ts` y agrega nuevas cartas siguiendo el formato:

```typescript
{
  id: 78,
  name: "Card Name",
  nameEs: "Nombre en Español",
  arcana: "major" | "minor",
  suit: "cups" | "pentacles" | "swords" | "wands" | null,
  number: 1-14 | null,
  image: "url_de_la_imagen",
  keywords: ["keyword1", "keyword2"],
  meaningUpright: "Significado derecho...",
  meaningReversed: "Significado invertido..."
}
```

#### Agregar nuevas tiradas
Edita `src/data/spreads.ts` y define nuevas tiradas:

```typescript
{
  id: 'nueva-tirada',
  name: 'Nueva Tirada',
  nameEs: 'Nueva Tirada',
  description: 'Descripción...',
  cardCount: 5,
  positions: [
    { position: 1, name: 'Posición 1', description: '...' }
  ]
}
```

## 🎨 Personalización de Estilos

Los estilos principales están en `src/app/globals.css` y `tailwind.config.js`.

Colores principales:
- **Fondo**: `#0a0a0f` (mystic-900)
- **Acento dorado**: `#d4af37` (gold-400)
- **Acento púrpura**: `#9d4edd` (purple-400)

## 📝 Notas

- Las imágenes de las cartas se cargan desde [tarotcardapi](https://github.com/krates98/tarotcardapi)
- El rate limiting es en memoria (se reinicia con cada deploy)
- Para producción con alto tráfico, considera usar Redis para rate limiting

## 🤝 Contribuir

1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agrega nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

## 🙏 Agradecimientos

- Imágenes de cartas: [tarotcardapi](https://github.com/krates98/tarotcardapi) por [@krates98](https://github.com/krates98)
- Inspiración de diseño: [tarot-reader](https://github.com/yunkhngn/tarot-reader) por [@yunkhngn](https://github.com/yunkhngn)
- Google Gemini por las interpretaciones con IA

---

<p align="center">
  ✨ Desarrollado con amor y un poco de magia ✨
</p>
