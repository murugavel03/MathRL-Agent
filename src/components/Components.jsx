import React, { useState, useEffect, useRef } from 'react';
import { Formula, getVisualComponent, NeuralNetVisual } from './Visuals';
import { rlAgent } from '../data/rlAgent';
import { getRank, getNextRank, TOPICS } from '../data/curriculum';

// === Lesson Panel ===
export function LessonPanel({ lesson, topic, onComplete, onClose }) {
  const [phase, setPhase] = useState('learn'); // 'learn' | 'quiz' | 'result'
  const [qIdx, setQIdx] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [showExpl, setShowExpl] = useState(false);
  const startTime = useRef(Date.now());

  const quiz = lesson.quiz || [];
  const currentQ = quiz[qIdx];

  const handleAnswer = (idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExpl(true);
  };

  const nextQuestion = () => {
    setAnswers(prev => [...prev, { correct: selected === currentQ.correct }]);
    setSelected(null);
    setShowExpl(false);
    if (qIdx < quiz.length - 1) {
      setQIdx(qIdx + 1);
    } else {
      setPhase('result');
    }
  };

  const calcResult = () => {
    const totalCorrect = answers.filter(a => a.correct).length + (selected === currentQ?.correct ? 1 : 0);
    return { correct: totalCorrect, total: quiz.length, accuracy: totalCorrect / quiz.length };
  };

  const handleDone = () => {
    const { accuracy } = calcResult();
    const timeMs = Date.now() - startTime.current;
    const reward = rlAgent.computeReward(accuracy, timeMs);
    const rec = rlAgent.recommendNext(topic.id, lesson.difficulty, accuracy);
    rlAgent.update(topic.id, lesson.difficulty, 'present', reward, rec.difficulty);
    onComplete({ lesson, accuracy, reward, recommendation: rec, xpEarned: Math.round(lesson.xp * (0.5 + accuracy * 0.5)) });
  };

  const diffColor = { Beginner: '#10b981', Intermediate: '#4f8ef7', Advanced: '#ec4899' };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'auto', gap: 20 }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 6 }}>
            <span className="badge" style={{ background: `${topic.color}22`, color: topic.color, border: `1px solid ${topic.color}44` }}>
              {topic.name}
            </span>
            <span className="badge" style={{ background: `${diffColor[lesson.difficulty]}22`, color: diffColor[lesson.difficulty], border: `1px solid ${diffColor[lesson.difficulty]}44` }}>
              {lesson.difficulty}
            </span>
            <span className="badge badge-purple">+{lesson.xp} XP</span>
          </div>
          <h2 style={{ fontSize: 20, fontWeight: 700 }}>{lesson.title}</h2>
        </div>
        <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8, color: 'var(--text-secondary)', cursor: 'pointer', padding: '6px 12px', fontSize: 13 }}>✕ Close</button>
      </div>

      {phase === 'learn' && (
        <>
          {/* Formula */}
          <div style={{ background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 12, padding: '20px', textAlign: 'center' }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>Key Formula</div>
            <div style={{ fontSize: 20 }}>
              <Formula formula={lesson.formula} displayMode={true} />
            </div>
          </div>

          {/* Concept */}
          <div style={{ background: 'rgba(124,58,237,0.06)', border: '1px solid rgba(124,58,237,0.15)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '1px' }}>💡 Concept</div>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: 14 }}>{lesson.concept}</p>
          </div>

          {/* Visual */}
          <div style={{ background: 'rgba(10,15,30,0.5)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: 12, padding: 16 }}>
            <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 12, textTransform: 'uppercase', letterSpacing: '1px' }}>🎨 Visual Learning</div>
            {getVisualComponent(lesson.visual, topic.color)}
          </div>

          <button className="btn btn-primary" onClick={() => setPhase('quiz')} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
            🧠 Take Quiz ({quiz.length} questions)
          </button>
        </>
      )}

      {phase === 'quiz' && currentQ && (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div className="progress-bar-track" style={{ flex: 1 }}>
              <div className="progress-bar-fill" style={{ width: `${((qIdx) / quiz.length) * 100}%` }} />
            </div>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>Q {qIdx + 1}/{quiz.length}</span>
          </div>

          <div style={{ background: 'rgba(79,142,247,0.06)', borderRadius: 12, padding: 20, border: '1px solid rgba(79,142,247,0.15)' }}>
            <p style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.5 }}>{currentQ.q}</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {currentQ.options.map((opt, i) => {
              let bg = 'rgba(255,255,255,0.04)', border = 'rgba(255,255,255,0.08)', color = 'var(--text-secondary)';
              if (selected !== null) {
                if (i === currentQ.correct) { bg = 'rgba(16,185,129,0.12)'; border = '#10b981'; color = '#34d399'; }
                else if (i === selected) { bg = 'rgba(239,68,68,0.1)'; border = '#ef4444'; color = '#fca5a5'; }
              }
              return (
                <button key={i} onClick={() => handleAnswer(i)}
                  style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '14px 16px', borderRadius: 10, border: `1px solid ${border}`, background: bg, color, cursor: selected !== null ? 'default' : 'pointer', textAlign: 'left', transition: 'all 0.2s', fontSize: 14 }}>
                  <span style={{ width: 26, height: 26, borderRadius: '50%', border: `1px solid ${border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>
                    {['A', 'B', 'C', 'D'][i]}
                  </span>
                  {opt}
                  {selected !== null && i === currentQ.correct && <span style={{ marginLeft: 'auto', fontSize: 16 }}>✅</span>}
                  {selected !== null && i === selected && i !== currentQ.correct && <span style={{ marginLeft: 'auto', fontSize: 16 }}>❌</span>}
                </button>
              );
            })}
          </div>

          {showExpl && (
            <div style={{ background: 'rgba(34,211,238,0.06)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 11, color: 'var(--cyan)', fontWeight: 700, marginBottom: 6 }}>💬 Explanation</div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>{currentQ.explanation}</p>
            </div>
          )}

          {selected !== null && (
            <button className="btn btn-primary" onClick={nextQuestion} style={{ width: '100%', justifyContent: 'center', padding: 14 }}>
              {qIdx < quiz.length - 1 ? 'Next Question →' : 'See Results 🎯'}
            </button>
          )}
        </>
      )}

      {phase === 'result' && (() => {
        const { correct, total, accuracy } = calcResult();
        const xpEarned = Math.round(lesson.xp * (0.5 + accuracy * 0.5));
        const rec = rlAgent.recommendNext(topic.id, lesson.difficulty, accuracy);
        return (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div style={{ fontSize: 64, marginBottom: 12 }}>{accuracy >= 0.8 ? '🎉' : accuracy >= 0.5 ? '👍' : '📚'}</div>
            <h3 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>
              {accuracy >= 0.8 ? 'Excellent!' : accuracy >= 0.5 ? 'Good Job!' : 'Keep Practicing!'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 20 }}>
              You answered <strong style={{ color: 'var(--cyan)' }}>{correct}/{total}</strong> correctly ({Math.round(accuracy * 100)}%)
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 20 }}>
              {[
                { label: 'XP Earned', val: `+${xpEarned}`, color: '#a78bfa' },
                { label: 'Accuracy', val: `${Math.round(accuracy * 100)}%`, color: '#22d3ee' },
                { label: 'RL Reward', val: `+${rlAgent.computeReward(accuracy, 30000).toFixed(1)}`, color: '#10b981' },
                { label: 'Agent Episodes', val: rlAgent.getStats().episodes, color: '#f97316' },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: `${color}12`, border: `1px solid ${color}33`, borderRadius: 10, padding: '14px 10px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, fontWeight: 800, color }}>{val}</div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(79,142,247,0.06)', border: '1px solid rgba(79,142,247,0.15)', borderRadius: 10, padding: 14, marginBottom: 20, textAlign: 'left' }}>
              <div style={{ fontSize: 12, color: 'var(--blue-light)', fontWeight: 700, marginBottom: 4 }}>🤖 RL Agent Recommendation</div>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>{rec.reason}</p>
              <p style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>Next difficulty: <strong style={{ color: 'var(--cyan)' }}>{rec.difficulty}</strong></p>
            </div>
            <button className="btn btn-primary" onClick={handleDone} style={{ width: '100%', justifyContent: 'center', padding: 14, fontSize: 15 }}>
              ✅ Complete & Earn XP
            </button>
          </div>
        );
      })()}
    </div>
  );
}

// === Topic Card ===
export function TopicCard({ topic, completedLessons, onClick }) {
  const completed = topic.lessons.filter(l => completedLessons.includes(l.id)).length;
  const progress = completed / topic.lessons.length;

  return (
    <div onClick={() => onClick(topic)} className="glass-card"
      style={{ padding: 20, cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative', overflow: 'hidden',
        borderColor: `${topic.color}22`, ':hover': { transform: 'translateY(-4px)' } }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 12px 40px ${topic.color}33`; e.currentTarget.style.borderColor = `${topic.color}55`; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; e.currentTarget.style.borderColor = `${topic.color}22`; }}>
      {/* Glow bg */}
      <div style={{ position: 'absolute', top: -30, right: -30, width: 100, height: 100, borderRadius: '50%', background: `radial-gradient(circle, ${topic.color}18 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <div style={{ width: 48, height: 48, borderRadius: 12, background: topic.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, fontWeight: 800, color: 'white', flexShrink: 0, boxShadow: `0 4px 16px ${topic.color}44` }}>
          {topic.icon}
        </div>
        <div>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 3 }}>{topic.name}</h3>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{topic.lessons.length} lessons</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: topic.color }}>{completed}/{topic.lessons.length}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>done</div>
        </div>
      </div>

      <p style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 14, lineHeight: 1.5 }}>{topic.description}</p>

      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${progress * 100}%`, background: topic.gradient }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{Math.round(progress * 100)}% complete</span>
        <span style={{ fontSize: 11, color: topic.color }}>+{topic.xpReward} XP total</span>
      </div>
    </div>
  );
}

// === XP & Rank Bar ===
export function XPBar({ xp }) {
  const rank = getRank(xp);
  const nextRank = getNextRank(xp);
  const progress = nextRank ? (xp - rank.minXP) / (nextRank.minXP - rank.minXP) : 1;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      <div style={{ fontSize: 24 }}>{rank.icon}</div>
      <div style={{ flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 5 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: rank.color }}>{rank.name}</span>
          <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--text-secondary)' }}>
            {xp.toLocaleString()} XP {nextRank ? `→ ${nextRank.minXP.toLocaleString()}` : '(MAX)'}
          </span>
        </div>
        <div className="progress-bar-track">
          <div className="progress-bar-fill" style={{ width: `${progress * 100}%` }} />
        </div>
        {nextRank && <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{nextRank.minXP - xp} XP to {nextRank.icon} {nextRank.name}</div>}
      </div>
    </div>
  );
}

// === AI Tutor Chat ===
const BOT_TIPS = [
  "💡 In gradient descent, a small learning rate converges slowly but surely. A large one risks overshooting!",
  "🔢 Eigenvalues tell you how much a linear transformation stretches space. Essential for PCA!",
  "📊 Bayes' theorem is everywhere: spam filters, medical diagnosis, and even AI reasoning!",
  "⚡ The chain rule in calculus IS backpropagation. Master it and neural nets become clear!",
  "🎲 Expected value is the foundation of Q-learning. The agent maximizes E[cumulative reward].",
  "📐 Matrix multiplication in a neural network = computing weighted sums of neuron activations.",
  "🧮 Standard deviation measures spread. Batch normalization uses it to keep training stable.",
  "🔑 The Bellman equation lets us break complex RL problems into simpler subproblems!",
];

export function TutorChat({ topicName }) {
  const [messages, setMessages] = useState([
    { from: 'bot', text: `👋 Hi! I'm your MathRL Agent tutor. I'll guide you through the math that powers AI & ML. Start a lesson and I'll give you personalized tips!\n\nToday's tip: ${BOT_TIPS[0]}` },
  ]);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = input.trim();
    setMessages(prev => [...prev, { from: 'user', text: userMsg }]);
    setInput('');

    setTimeout(() => {
      let response = BOT_TIPS[Math.floor(Math.random() * BOT_TIPS.length)];
      const lower = userMsg.toLowerCase();
      if (lower.includes('gradient') || lower.includes('descent')) response = "🎯 Gradient descent: θ = θ - η∇J(θ). We move opposite to the gradient to minimize loss. Try adjusting the learning rate slider in the Calculus lesson!";
      else if (lower.includes('matrix')) response = "📐 Matrix multiplication: C[i,j] = Σ A[i,k]·B[k,j]. Think of it as dot products between rows and columns. Check the interactive matrix in Linear Algebra!";
      else if (lower.includes('bayes')) response = "🎲 Bayes: P(A|B) = P(B|A)·P(A)/P(B). Prior belief × evidence likelihood = posterior. The interactive Bayes visual shows how posterior changes with evidence!";
      else if (lower.includes('eigen')) response = "🔢 Eigenvector: Av = λv. The matrix A only scales v by λ — direction unchanged. This is how PCA finds the directions of maximum variance!";
      else if (lower.includes('rl') || lower.includes('reinforcement') || lower.includes('reward')) response = "🤖 RL uses the Bellman equation: V*(s) = max_a [R(s,a) + γ·Σ P(s'|s,a)·V*(s')]. Discount factor γ balances immediate vs future rewards!";
      setMessages(prev => [...prev, { from: 'bot', text: response }]);
    }, 700);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, paddingBottom: 14, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, boxShadow: '0 0 16px rgba(79,142,247,0.4)' }}>🤖</div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700 }}>MathRL Tutor</div>
          <div style={{ fontSize: 11, color: 'var(--green)' }}>● Online — Adaptive AI Tutor</div>
        </div>
      </div>

      <div ref={chatRef} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14, maxHeight: 320 }}>
        {messages.map((msg, i) => (
          <div key={i} style={{ display: 'flex', justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start' }}>
            <div style={{ maxWidth: '85%', padding: '10px 14px', borderRadius: msg.from === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
              background: msg.from === 'user' ? 'linear-gradient(135deg,#4f8ef7,#7c3aed)' : 'rgba(255,255,255,0.05)',
              border: msg.from === 'bot' ? '1px solid rgba(255,255,255,0.07)' : 'none',
              fontSize: 13, lineHeight: 1.6, color: 'var(--text-primary)', whiteSpace: 'pre-wrap' }}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about any math concept..."
          style={{ flex: 1, background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '10px 14px', color: 'var(--text-primary)', fontSize: 13, outline: 'none', fontFamily: 'var(--font-sans)' }} />
        <button onClick={sendMessage} style={{ padding: '10px 16px', borderRadius: 10, background: 'linear-gradient(135deg,#4f8ef7,#7c3aed)', border: 'none', color: 'white', cursor: 'pointer', fontSize: 16 }}>↑</button>
      </div>
    </div>
  );
}

// === Agent Stats Panel ===
export function AgentStatsPanel({ state }) {
  const stats = rlAgent.getStats();
  const items = [
    { label: 'Q-Learning Episodes', val: stats.episodes, color: '#4f8ef7', icon: '🔄' },
    { label: 'Total Reward', val: stats.totalReward, color: '#10b981', icon: '⭐' },
    { label: 'Exploration Rate ε', val: stats.explorationRate, color: '#f97316', icon: '🔍' },
    { label: 'Accuracy', val: state.totalAnswered ? `${Math.round(state.totalCorrect / state.totalAnswered * 100)}%` : '—', color: '#22d3ee', icon: '🎯' },
  ];

  return (
    <div>
      <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 14 }}>🤖 RL Agent Status</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {items.map(({ label, val, color, icon }) => (
          <div key={label} style={{ background: `${color}0d`, border: `1px solid ${color}22`, borderRadius: 10, padding: '12px 10px', textAlign: 'center' }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>{icon}</div>
            <div style={{ fontSize: 17, fontWeight: 800, color, fontFamily: 'var(--font-mono)' }}>{val}</div>
            <div style={{ fontSize: 10, color: 'var(--text-muted)', marginTop: 2 }}>{label}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, padding: '10px 14px', background: 'rgba(79,142,247,0.06)', borderRadius: 10, border: '1px solid rgba(79,142,247,0.12)' }}>
        <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Q-Learning Algorithm</div>
        <code style={{ fontSize: 11, color: 'var(--cyan)', fontFamily: 'var(--font-mono)', lineHeight: 1.7, display: 'block' }}>
          Q(s,a) ← Q(s,a) + α[r + γ·max Q(s',a') - Q(s,a)]<br/>
          ε-greedy: explore {stats.explorationRate}
        </code>
      </div>
    </div>
  );
}
