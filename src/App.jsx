import React, { useState, useEffect, useCallback } from 'react';
import { TOPICS, INITIAL_STATE, getRank, getNextRank, RANKS } from './data/curriculum';
import { TopicCard, LessonPanel, XPBar, TutorChat, AgentStatsPanel } from './components/Components';
import { NeuralNetVisual, GradientDescentVisual, VectorVisual, MatrixVisual, NormalDistVisual, BayesVisual, MDPVisual } from './components/Visuals';
import { rlAgent } from './data/rlAgent';

// === Notification Toast ===
function Toast({ msg, onDone }) {
  useEffect(() => { const t = setTimeout(onDone, 3500); return () => clearTimeout(t); }, [onDone]);
  return (
    <div style={{ position: 'fixed', top: 24, right: 24, zIndex: 9999, maxWidth: 340, padding: '14px 20px',
      background: 'rgba(15,22,45,0.97)', border: '1px solid rgba(79,142,247,0.4)', borderRadius: 14,
      backdropFilter: 'blur(20px)', boxShadow: '0 8px 32px rgba(79,142,247,0.3)',
      animation: 'fadeInUp 0.4s ease', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <span style={{ fontSize: 22, flexShrink: 0 }}>🎉</span>
      <div>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 3 }}>{msg.title}</div>
        <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{msg.body}</div>
      </div>
    </div>
  );
}

// === Dashboard View ===
function DashboardView({ state, topics, onSelectTopic }) {
  const rank = getRank(state.xp);
  const totalLessons = topics.reduce((s, t) => s + t.lessons.length, 0);
  const completedTotal = state.completedLessons.length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24, animation: 'fadeInUp 0.5s ease' }}>
      {/* Hero */}
      <div className="glass-card" style={{ padding: '28px 32px',
        background: 'linear-gradient(135deg, rgba(79,142,247,0.1) 0%, rgba(124,58,237,0.1) 100%)',
        border: '1px solid rgba(79,142,247,0.2)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: -40, top: -40, width: 220, height: 220, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>Your AI/ML Math Tutor</div>
            <h1 style={{ fontSize: 30, fontWeight: 900, marginBottom: 8 }}>
              <span className="gradient-text">MathRL Agent</span>
            </h1>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', maxWidth: 480, lineHeight: 1.7 }}>
              A Reinforcement Learning–powered math tutor for AI & ML students. Master Linear Algebra, Calculus, Statistics, and Probability through adaptive lessons and visual learning.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, flexWrap: 'wrap' }}>
              <span className="badge badge-blue">RL-Adaptive</span>
              <span className="badge badge-purple">Visual Learning</span>
              <span className="badge badge-cyan">AI/ML Math</span>
              <span className="badge badge-green">{completedTotal}/{totalLessons} Lessons Done</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: 52, marginBottom: 4 }}>{rank.icon}</div>
            <div style={{ fontSize: 16, fontWeight: 800, color: rank.color }}>{rank.name}</div>
            <div style={{ fontSize: 22, fontWeight: 900, color: 'var(--cyan)', fontFamily: 'var(--font-mono)' }}>{state.xp.toLocaleString()} XP</div>
          </div>
        </div>
        <div style={{ marginTop: 20 }}><XPBar xp={state.xp} /></div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 14 }}>
        {[
          { label: 'Total XP', val: state.xp.toLocaleString(), icon: '⭐', color: '#f97316' },
          { label: 'Lessons Done', val: `${completedTotal}/${totalLessons}`, icon: '📚', color: '#4f8ef7' },
          { label: 'Accuracy', val: state.totalAnswered ? `${Math.round(state.totalCorrect / state.totalAnswered * 100)}%` : '—', icon: '🎯', color: '#10b981' },
          { label: 'RL Episodes', val: state.agentEpisodes, icon: '🔄', color: '#7c3aed' },
        ].map(({ label, val, icon, color }) => (
          <div key={label} className="glass-card" style={{ padding: 18, textAlign: 'center', border: `1px solid ${color}22` }}>
            <div style={{ fontSize: 24, marginBottom: 8 }}>{icon}</div>
            <div style={{ fontSize: 22, fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>{val}</div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Topic Cards */}
      <div>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16 }}>📐 Math Tracks</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(270px, 1fr))', gap: 16 }}>
          {topics.map(topic => (
            <TopicCard key={topic.id} topic={topic} completedLessons={state.completedLessons} onClick={onSelectTopic} />
          ))}
        </div>
      </div>
    </div>
  );
}

// === Learn View ===
function LearnView({ state, topics, onComplete }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);

  if (selectedLesson && selectedTopic) {
    return (
      <div style={{ height: '100%' }}>
        <LessonPanel
          lesson={selectedLesson}
          topic={selectedTopic}
          onComplete={(result) => { onComplete(result); setSelectedLesson(null); }}
          onClose={() => setSelectedLesson(null)}
        />
      </div>
    );
  }

  const diffColor = { Beginner: '#10b981', Intermediate: '#4f8ef7', Advanced: '#ec4899' };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>📚 All Lessons</h2>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>
        Select a lesson. The RL agent adapts difficulty based on your performance using Q-learning.
      </p>

      {topics.map(topic => (
        <div key={topic.id} style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: topic.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 800, color: 'white', boxShadow: `0 4px 14px ${topic.color}44` }}>
              {topic.icon}
            </div>
            <div>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>{topic.name}</h3>
              <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                {topic.lessons.filter(l => state.completedLessons.includes(l.id)).length}/{topic.lessons.length} completed
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {topic.lessons.map(lesson => {
              const done = state.completedLessons.includes(lesson.id);
              const score = state.quizScores[lesson.id];
              return (
                <div key={lesson.id} className="glass-card"
                  style={{ padding: '14px 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 14,
                    border: `1px solid ${done ? topic.color + '33' : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.2s' }}
                  onClick={() => { setSelectedTopic(topic); setSelectedLesson(lesson); }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = topic.color + '55'; e.currentTarget.style.transform = 'translateX(4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = done ? topic.color + '33' : 'rgba(255,255,255,0.06)'; e.currentTarget.style.transform = ''; }}>
                  <div style={{ width: 38, height: 38, borderRadius: 10, background: done ? `${topic.color}22` : 'rgba(255,255,255,0.04)', border: `1px solid ${done ? topic.color : 'rgba(255,255,255,0.08)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {done ? '✅' : '📖'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{lesson.title}</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <span style={{ fontSize: 11, color: diffColor[lesson.difficulty], background: `${diffColor[lesson.difficulty]}15`, padding: '2px 8px', borderRadius: 999, border: `1px solid ${diffColor[lesson.difficulty]}33` }}>{lesson.difficulty}</span>
                      {score !== undefined && <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>Score: {Math.round(score * 100)}%</span>}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: topic.color }}>+{lesson.xp} XP</div>
                    {done && <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Done</div>}
                  </div>
                  <span style={{ color: 'var(--text-muted)', fontSize: 18 }}>›</span>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

// === Visualizer View ===
function VisualizerView() {
  const [activeViz, setActiveViz] = useState('gradient');

  const vizOptions = [
    { id: 'gradient', label: '📉 Gradient Descent', color: '#22d3ee' },
    { id: 'vector', label: '↗ Vector Addition', color: '#4f8ef7' },
    { id: 'matrix', label: '⊠ Matrix Multiply', color: '#7c3aed' },
    { id: 'normal', label: '🔔 Normal Dist.', color: '#10b981' },
    { id: 'bayes', label: "🎲 Bayes' Theorem", color: '#f97316' },
    { id: 'mdp', label: '🤖 MDP States', color: '#ec4899' },
  ];

  const vizDescriptions = {
    gradient: 'Watch the agent (orange ball) descend the loss surface J(θ). Adjust learning rate η to see slow/fast convergence or divergence!',
    vector: 'Animated vector addition in 2D. Vectors a (blue) and b (purple) combine into a+b (cyan). Dot product computed live.',
    matrix: 'Interactive 2×2 matrix multiplication C=AB. Click cells to see which row/column pairs produce each result element.',
    normal: 'The Gaussian bell curve. Adjust μ (mean, shifts curve) and σ (spread) interactively. Colored regions show 68-95-99.7% rule.',
    bayes: "Visualize Bayes' theorem for medical diagnosis. Adjust prior, sensitivity, and false positive rate to see how posterior changes.",
    mdp: 'Markov Decision Process with 4 states and stochastic transitions. Terminal state S₃ has +10 reward. Click states to highlight.',
  };

  const renderViz = () => {
    switch (activeViz) {
      case 'gradient': return <GradientDescentVisual />;
      case 'vector': return <VectorVisual />;
      case 'matrix': return <MatrixVisual />;
      case 'normal': return <NormalDistVisual />;
      case 'bayes': return <BayesVisual />;
      case 'mdp': return <MDPVisual />;
      default: return null;
    }
  };

  return (
    <div style={{ animation: 'fadeInUp 0.4s ease' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 6 }}>🎨 Visual Learning Lab</h2>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 24 }}>Interact with mathematical concepts through live animations and sliders.</p>

      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {vizOptions.map(v => (
          <button key={v.id} onClick={() => setActiveViz(v.id)}
            style={{ padding: '8px 14px', borderRadius: 10, border: `1px solid ${activeViz === v.id ? v.color : 'rgba(255,255,255,0.08)'}`, background: activeViz === v.id ? `${v.color}18` : 'rgba(255,255,255,0.03)', color: activeViz === v.id ? v.color : 'var(--text-secondary)', cursor: 'pointer', fontSize: 13, fontWeight: activeViz === v.id ? 700 : 400, transition: 'all 0.2s' }}>
            {v.label}
          </button>
        ))}
      </div>

      <div className="glass-card" style={{ padding: 24, marginBottom: 20 }}>
        <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 16, lineHeight: 1.6, background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: 8 }}>
          💡 {vizDescriptions[activeViz]}
        </div>
        {renderViz()}
      </div>

      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>🧠 Neural Network — Live Forward Pass</div>
        <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14 }}>Pulses show signal propagation through layers. Brightness = activation strength.</p>
        <NeuralNetVisual topicColor="#4f8ef7" />
      </div>
    </div>
  );
}

// === Progress View ===
function ProgressView({ state, topics }) {
  const rank = getRank(state.xp);
  return (
    <div style={{ animation: 'fadeInUp 0.4s ease', display: 'flex', flexDirection: 'column', gap: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700 }}>📈 Your Learning Progress</h2>

      {/* Rank Journey */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18 }}>🏆 Rank Journey</div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {RANKS.map(r => {
            const reached = state.xp >= r.minXP;
            const current = rank.name === r.name;
            return (
              <div key={r.name} style={{ flex: '1 1 100px', textAlign: 'center', padding: '14px 8px', borderRadius: 12, background: reached ? `${r.color}12` : 'rgba(255,255,255,0.03)', border: `1px solid ${current ? r.color : reached ? r.color + '44' : 'rgba(255,255,255,0.06)'}`, opacity: reached ? 1 : 0.45, boxShadow: current ? `0 0 20px ${r.color}33` : 'none', transition: 'all 0.3s' }}>
                <div style={{ fontSize: 26, marginBottom: 6 }}>{r.icon}</div>
                <div style={{ fontSize: 12, fontWeight: 700, color: reached ? r.color : 'var(--text-muted)' }}>{r.name}</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{r.minXP.toLocaleString()} XP</div>
                {current && <div style={{ fontSize: 9, color: r.color, marginTop: 3, fontWeight: 800, letterSpacing: '0.5px' }}>● CURRENT</div>}
              </div>
            );
          })}
        </div>
      </div>

      {/* Topic Progress */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 18 }}>📐 Topic Progress</div>
        {topics.map(topic => {
          const completed = topic.lessons.filter(l => state.completedLessons.includes(l.id)).length;
          const progress = completed / topic.lessons.length;
          return (
            <div key={topic.id} style={{ marginBottom: 22 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 30, height: 30, borderRadius: 8, background: topic.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800, color: 'white' }}>{topic.icon}</div>
                  <span style={{ fontSize: 14, fontWeight: 600 }}>{topic.name}</span>
                </div>
                <span style={{ fontSize: 13, color: topic.color, fontWeight: 700 }}>{completed}/{topic.lessons.length} ({Math.round(progress * 100)}%)</span>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${progress * 100}%`, background: topic.gradient }} />
              </div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8, flexWrap: 'wrap' }}>
                {topic.lessons.map(l => {
                  const done = state.completedLessons.includes(l.id);
                  const score = state.quizScores[l.id];
                  return (
                    <div key={l.id} title={`${l.title}${done ? ` — ${Math.round((score||0)*100)}%` : ''}`}
                      style={{ width: 30, height: 30, borderRadius: 6, background: done ? topic.color + '30' : 'rgba(255,255,255,0.04)', border: `1px solid ${done ? topic.color : 'rgba(255,255,255,0.07)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, color: done ? topic.color : 'var(--text-muted)', fontWeight: 700 }}>
                      {done ? '✓' : '·'}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* RL Agent Panel */}
      <div className="glass-card" style={{ padding: 24 }}>
        <AgentStatsPanel state={state} />
      </div>
    </div>
  );
}

// === APP ROOT ===
export default function App() {
  const [view, setView] = useState('Dashboard');
  const [state, setState] = useState(() => {
    try {
      const saved = localStorage.getItem('mathrl-state');
      return saved ? JSON.parse(saved) : INITIAL_STATE;
    } catch { return INITIAL_STATE; }
  });
  const [toast, setToast] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    localStorage.setItem('mathrl-state', JSON.stringify(state));
  }, [state]);

  const handleComplete = useCallback((result) => {
    const { lesson, accuracy, xpEarned, recommendation } = result;
    setState(prev => ({
      ...prev,
      xp: prev.xp + xpEarned,
      completedLessons: prev.completedLessons.includes(lesson.id) ? prev.completedLessons : [...prev.completedLessons, lesson.id],
      quizScores: { ...prev.quizScores, [lesson.id]: accuracy },
      totalCorrect: prev.totalCorrect + Math.round(accuracy * (lesson.quiz?.length || 1)),
      totalAnswered: prev.totalAnswered + (lesson.quiz?.length || 1),
      agentEpisodes: prev.agentEpisodes + 1,
      agentReward: prev.agentReward + result.reward,
    }));
    setToast({
      title: `+${xpEarned} XP Earned! 🎉`,
      body: `"${lesson.title}" — ${Math.round(accuracy * 100)}% accuracy. ${recommendation?.reason || ''}`,
    });
  }, []);

  const navItems = [
    { id: 'Dashboard', icon: '⊞', label: 'Dashboard' },
    { id: 'Learn', icon: '📚', label: 'Learn' },
    { id: 'Visualizer', icon: '🎨', label: 'Visualizer' },
    { id: 'Progress', icon: '📈', label: 'Progress' },
  ];

  const rank = getRank(state.xp);

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)', position: 'relative' }}>
      {/* BG glows */}
      <div style={{ position: 'fixed', top: '8%', left: '4%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(79,142,247,0.06) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', bottom: '10%', right: '8%', width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(124,58,237,0.07) 0%, transparent 60%)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'fixed', top: '50%', left: '40%', width: 200, height: 200, borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,211,238,0.04) 0%, transparent 70%)', pointerEvents: 'none', zIndex: 0 }} />

      {/* Sidebar */}
      <aside style={{ width: sidebarOpen ? 230 : 60, background: 'rgba(8,12,24,0.97)', borderRight: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', padding: '18px 0', zIndex: 10, flexShrink: 0, transition: 'width 0.3s ease', overflow: 'hidden' }}>
        {/* Logo */}
        <div style={{ padding: sidebarOpen ? '0 18px 22px' : '0 12px 22px', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: 14 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0, boxShadow: '0 0 20px rgba(79,142,247,0.35)' }}>∑</div>
            {sidebarOpen && (
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, background: 'linear-gradient(135deg,#4f8ef7,#a78bfa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>MathRL</div>
                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>Agent Tutor</div>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '0 8px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {navItems.map(item => (
            <button key={item.id} onClick={() => setView(item.id)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, padding: sidebarOpen ? '10px 12px' : '10px', borderRadius: 10, border: 'none', background: view === item.id ? 'rgba(79,142,247,0.14)' : 'transparent', color: view === item.id ? 'var(--blue-light)' : 'var(--text-secondary)', cursor: 'pointer', width: '100%', fontSize: 13, fontWeight: view === item.id ? 600 : 400, transition: 'all 0.2s', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', boxShadow: view === item.id ? 'inset 0 0 0 1px rgba(79,142,247,0.3)' : 'none' }}>
              <span style={{ fontSize: 16, flexShrink: 0 }}>{item.icon}</span>
              {sidebarOpen && item.label}
            </button>
          ))}
        </nav>

        {/* Rank panel */}
        {sidebarOpen && (
          <div style={{ margin: '0 10px 14px', padding: '12px', background: `${rank.color}10`, border: `1px solid ${rank.color}30`, borderRadius: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 20 }}>{rank.icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: rank.color }}>{rank.name}</div>
                <div style={{ fontSize: 11, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>{state.xp} XP</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', display: 'flex', gap: 6 }}>
              <span>📚 {state.completedLessons.length} done</span>
              <span>·</span>
              <span>🔄 {state.agentEpisodes} ep.</span>
            </div>
          </div>
        )}

        {/* Toggle */}
        <button onClick={() => setSidebarOpen(p => !p)}
          style={{ margin: '0 8px', padding: '8px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: 14, transition: 'all 0.2s' }}>
          {sidebarOpen ? '◀' : '▶'}
        </button>
      </aside>

      {/* Main + Right */}
      <div style={{ flex: 1, display: 'flex', minWidth: 0, position: 'relative', zIndex: 1 }}>
        {/* Main */}
        <main style={{ flex: 1, overflow: 'auto', padding: '24px 22px' }}>
          {/* Topbar */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
            <div>
              <h2 style={{ fontSize: 20, fontWeight: 800 }}>{view}</h2>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>AI/ML Math • Reinforcement Learning Tutor</p>
            </div>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
              <span className="badge badge-blue" style={{ fontFamily: 'var(--font-mono)', fontSize: 12 }}>⭐ {state.xp.toLocaleString()} XP</span>
              <button onClick={() => { localStorage.removeItem('mathrl-state'); setState(INITIAL_STATE); }}
                style={{ padding: '6px 12px', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)', background: 'rgba(239,68,68,0.07)', color: '#fca5a5', cursor: 'pointer', fontSize: 11 }}>
                ↺ Reset
              </button>
            </div>
          </div>

          {view === 'Dashboard' && <DashboardView state={state} topics={TOPICS} onSelectTopic={() => setView('Learn')} />}
          {view === 'Learn' && <LearnView state={state} topics={TOPICS} onComplete={handleComplete} />}
          {view === 'Visualizer' && <VisualizerView />}
          {view === 'Progress' && <ProgressView state={state} topics={TOPICS} />}
        </main>

        {/* Right: AI Tutor */}
        <aside style={{ width: 290, background: 'rgba(8,12,24,0.8)', borderLeft: '1px solid rgba(255,255,255,0.06)', padding: '22px 16px', display: 'flex', flexDirection: 'column', gap: 20, flexShrink: 0, overflow: 'auto' }}>
          <TutorChat topicName={view} />
          <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 18 }}>
            <AgentStatsPanel state={state} />
          </div>
        </aside>
      </div>

      {toast && <Toast msg={toast} onDone={() => setToast(null)} />}
    </div>
  );
}
