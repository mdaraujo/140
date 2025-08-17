# Associação 140 🎭

Interactive website for **Associação 140**, an artistic and sociocultural movement that organizes diverse cultural events, workshops, and community initiatives.

## 🎨 About Associação 140

Associação 140 is a collective dedicated to celebrating improvisation, craftsmanship, and community creation through various artistic and cultural expressions. The association organizes events that combine music, education, visual arts, and community engagement.

### Current Platform: "E Agora?" (And Now?)

The homepage displays **current and upcoming events** organized by the association, featuring an interactive experience where users can explore different activities and performances through dynamic visual elements.

### Future Development Plans

- **📅 Past Events Archive** - Detailed pages showcasing previous events with photos, records, and documentation
- **👥 About Page** - Information about association members, vision, and mission
- **🛍️ Showroom/Shop** - Merchandise and products from the artistic movement

## ✨ Features

### Interactive Experience

- **Dynamic moving elements** that represent different festival aspects
- **Collision detection system** for smooth object movement
- **Responsive animations** that adapt to different screen sizes
- **Weighted random selection** algorithm for object behavior
- **Click interactions** to reveal detailed event information
- **Modal popups** with rich content about performances and artists

### Technical Highlights

- **Advanced animation system** with customizable parameters
- **Context-based state management** for moving objects and UI state
- **Responsive design** with mobile-first approach
- **Performance optimized** rendering and collision detection
- **Accessible interactions** with keyboard navigation support

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript
- **Bundler**: Vite
- **Routing**: React Router DOM
- **Styling**: CSS with modern features
- **Code Quality**: ESLint + Prettier
- **Deployment**: GitHub Pages

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd 140
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reloading
- `npm run build` - Build production version
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality
- `npm run format` - Format code with Prettier
- `npm run deploy` - Deploy to GitHub Pages

## 🏗️ Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer components
│   ├── moving/          # Interactive moving elements
│   └── ui/              # Modal and UI components
├── contexts/            # React contexts for state management
├── data/                # Festival data and configurations
├── hooks/               # Custom React hooks
├── pages/               # Application pages
├── providers/           # Context providers
├── types/               # TypeScript type definitions
└── utils/               # Helper utilities and algorithms
```

## 🎨 Key Components

### Moving Elements System

- **MovingElement**: Individual animated objects with collision detection
- **MovingObjectsContext**: Global state management for all moving objects
- **useMovingObjectsManager**: Business logic hook for object management
- **Collision Detection**: Sophisticated algorithm preventing object overlap

### Interactive Features

- **PopupModal**: Displays detailed information about events and performances
- **QuestionHeader**: Interactive header with association information
- **ResponsiveConfig**: Adaptive layout for different screen sizes

## 🌐 Deployment

This project is configured for deployment on GitHub Pages:

```bash
npm run predeploy  # Build with correct base path
npm run deploy     # Deploy to gh-pages branch
```

## 🎭 Event Examples

The platform showcases various events organized by Associação 140:

**Current/Upcoming Events**

- **GumaJazz Festival** (August 17, 2025) - Jazz performances, workshops, and installations featuring Clara Lacerda Trio, Miguel Meirinhos, Barananu, and more

**Past Events**

- **Ohme Sessions** - Regular artistic sessions and performances
- **25 de Abril** - Cultural events commemorating Portuguese history
- **Beernissage** - Art exhibition openings and cultural gatherings
- **Various Workshops** - Educational sessions and community activities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is created for Associação 140.

---

_"Celebrating improvisation, craftsmanship, and community creation through artistic and cultural expression."_
