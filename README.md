# 🧠 MathRL Agent – AI/ML Mathematics Tutor with Reinforcement Learning

> An interactive, gamified learning platform powered by Reinforcement Learning that teaches core AI & Machine Learning Mathematics (Linear Algebra, Multivariable Calculus, Probability & Statistics, and MDPs) with real-time dynamic visualizations.

---

## 🌟 Key Features

- 🤖 **Adaptive RL Tutoring Agent**: Incorporates a Q-learning agent with an ε-greedy policy that adapts curriculum difficulty dynamically based on student mastery and quiz performance.
- 📐 **Interactive Visualizations**:
  - **Vector Spaces & Matrix Transformations** (2D/3D transformations)
  - **Gradient Descent & Loss Landscapes** (Interactive optimization dynamics)
  - **Probability Distributions & Bayesian Inference** (Gaussian & Bayes theorem visualizers)
  - **Markov Decision Process (MDP) Graph** (States, transitions, and reward feedback)
- 📝 **KaTeX Math Notation**: Clear, beautiful mathematical expressions rendered seamlessly.
- 🏆 **Gamified Learning**: Level up through ranks (Beginner $\to$ Novice $\to$ Scholar $\to$ Master $\to$ Grandmaster), earn XP, track streaks, and test understanding with interactive quizzes.
- 💬 **Interactive AI Math Tutor Chat**: Built-in conversational guidance tailored to concepts and formulas.

---

## 🛠️ Tech Stack

- **Frontend**: [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Visuals & Graphics**: [Three.js](https://threejs.org/), [Chart.js](https://www.chartjs.org/), HTML5 Canvas
- **Math Rendering**: [KaTeX](https://katex.org/)
- **Icons & Effects**: [Lucide React](https://lucide.dev/), [canvas-confetti](https://www.npmjs.com/package/canvas-confetti)
- **Styling**: Modern dark mode with Glassmorphism and CSS variables

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/<your-username>/math-rl-agent.git
cd math-rl-agent
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```

Visit `http://localhost:5173` in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 📂 Project Structure

```text
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── Components.jsx  # UI components (cards, XP bar, quizzes, chat)
│   │   └── Visuals.jsx     # Canvas / Three.js / Chart visualizers
│   ├── data/
│   │   ├── curriculum.js   # Topics, lessons, formulas, and quiz questions
│   │   └── rlAgent.js      # Q-learning adaptive agent implementation
│   ├── App.jsx             # Main dashboard, navigation, and state
│   ├── App.css             # Component-level styling
│   ├── index.css           # Global design system & theme tokens
│   └── main.jsx            # Application entry point
├── package.json
└── vite.config.js
```

---

## 🤝 Contributing & License

Contributions are welcome! Feel free to open issues or submit pull requests.
Released under the [MIT License](LICENSE).
