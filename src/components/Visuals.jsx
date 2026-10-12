import React, { useState, useEffect, useRef } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

// === KaTeX Formula Renderer ===
export function Formula({ formula, displayMode = false, className = '' }) {
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current && formula) {
      try {
        katex.render(formula, ref.current, {
          throwOnError: false,
          displayMode,
          trust: true,
        });
      } catch (e) {
        ref.current.textContent = formula;
      }
    }
  }, [formula, displayMode]);
  return <span ref={ref} className={className} />;
}

// === Vector Visualizer ===
export function VectorVisual() {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrame;
    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2, cy = canvas.height / 2;

      // Grid
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      for (let x = 0; x <= canvas.width; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke(); }
      for (let y = 0; y <= canvas.height; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke(); }

      // Axes
      ctx.strokeStyle = 'rgba(255,255,255,0.2)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, cy); ctx.lineTo(canvas.width, cy); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(cx, 0); ctx.lineTo(cx, canvas.height); ctx.stroke();

      const drawVector = (vx, vy, color, label) => {
        const ex = cx + vx, ey = cy - vy;
        const grad = ctx.createLinearGradient(cx, cy, ex, ey);
        grad.addColorStop(0, color + '88'); grad.addColorStop(1, color);
        ctx.strokeStyle = grad; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.moveTo(cx, cy); ctx.lineTo(ex, ey); ctx.stroke();
        // Arrow
        const angle = Math.atan2(cy - ey, ex - cx);
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - 12 * Math.cos(angle - 0.4), ey + 12 * Math.sin(angle - 0.4));
        ctx.lineTo(ex - 12 * Math.cos(angle + 0.4), ey + 12 * Math.sin(angle + 0.4));
        ctx.closePath(); ctx.fill();
        // Label
        ctx.fillStyle = color; ctx.font = 'bold 13px Inter, sans-serif';
        ctx.fillText(label, ex + 8, ey - 8);
      };

      const a = [80 + 20 * Math.sin(t), 100 + 15 * Math.cos(t * 0.7)];
      const b = [-60 + 10 * Math.cos(t * 1.2), 80 + 20 * Math.sin(t * 0.9)];
      const s = [a[0] + b[0], a[1] + b[1]];

      drawVector(a[0], a[1], '#4f8ef7', 'a');
      drawVector(b[0], b[1], '#7c3aed', 'b');
      drawVector(s[0], s[1], '#22d3ee', 'a+b');

      // Dot product display
      const dot = a[0] * b[0] / 1000 + a[1] * b[1] / 1000;
      ctx.fillStyle = 'rgba(255,255,255,0.7)'; ctx.font = '12px JetBrains Mono, monospace';
      ctx.fillText(`a·b = ${dot.toFixed(2)}`, 10, 20);

      t += 0.015;
      animFrame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animFrame);
  }, []);

  return (
    <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', border: '1px solid rgba(79,142,247,0.2)' }}>
      <canvas ref={canvasRef} width={400} height={260} style={{ display: 'block', width: '100%' }} />
      <div style={{ position: 'absolute', bottom: 10, left: 10, fontSize: 11, color: 'rgba(255,255,255,0.5)' }}>
        Live: a (blue) + b (purple) = a+b (cyan)
      </div>
    </div>
  );
}

// === Gradient Descent Visualizer ===
export function GradientDescentVisual() {
  const canvasRef = useRef(null);
  const [lr, setLr] = useState(0.15);
  const posRef = useRef(3.5);
  const velRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrame, t = 0;

    const f = x => 0.3 * (x - 1) * (x - 1) + 0.5;
    const df = x => 0.6 * (x - 1);

    const toScreen = (x, y) => ({
      sx: 40 + ((x + 4) / 9) * (canvas.width - 60),
      sy: canvas.height - 30 - (y / 5) * (canvas.height - 60),
    });

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = 'rgba(10,15,30,0.0)';

      // Draw curve
      ctx.beginPath();
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
      grad.addColorStop(0, '#7c3aed'); grad.addColorStop(0.5, '#4f8ef7'); grad.addColorStop(1, '#22d3ee');
      ctx.strokeStyle = grad; ctx.lineWidth = 3;
      for (let xi = -4; xi <= 5; xi += 0.05) {
        const { sx, sy } = toScreen(xi, f(xi));
        if (xi === -4) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
      }
      ctx.stroke();

      // Minimum indicator
      const { sx: mx, sy: my } = toScreen(1, f(1));
      ctx.beginPath();
      ctx.setLineDash([4, 4]);
      ctx.strokeStyle = 'rgba(16,185,129,0.4)'; ctx.lineWidth = 1;
      ctx.moveTo(mx, my); ctx.lineTo(mx, canvas.height - 30); ctx.stroke();
      ctx.setLineDash([]);
      ctx.fillStyle = '#10b981'; ctx.font = '11px Inter'; ctx.fillText('minimum', mx - 25, canvas.height - 10);

      // Ball (agent)
      const x = posRef.current;
      const { sx: bx, sy: by } = toScreen(x, f(x));
      const ballGrad = ctx.createRadialGradient(bx, by, 0, bx, by, 12);
      ballGrad.addColorStop(0, '#fff'); ballGrad.addColorStop(0.4, '#f97316'); ballGrad.addColorStop(1, 'rgba(249,115,22,0)');
      ctx.fillStyle = ballGrad;
      ctx.beginPath(); ctx.arc(bx, by, 12, 0, Math.PI * 2); ctx.fill();

      // Gradient arrow
      const g = df(x);
      ctx.strokeStyle = '#ec4899'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx - g * 40, by); ctx.stroke();
      ctx.fillStyle = '#ec4899'; ctx.font = '11px JetBrains Mono'; ctx.fillText(`η=${lr}`, 10, 20);
      ctx.fillText(`x=${x.toFixed(3)}`, 10, 36);
      ctx.fillText(`J(x)=${f(x).toFixed(3)}`, 10, 52);

      // Axes labels
      ctx.fillStyle = 'rgba(255,255,255,0.4)'; ctx.font = '11px Inter';
      ctx.fillText('J(θ)', 10, canvas.height - 10);
      ctx.fillText('θ', canvas.width - 20, canvas.height - 30);

      // Update position (gradient descent step)
      if (t % 8 === 0) {
        posRef.current = posRef.current - lr * df(posRef.current);
        if (Math.abs(posRef.current - 1) < 0.001) posRef.current = 3.5; // reset
      }

      t++;
      animFrame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animFrame);
  }, [lr]);

  return (
    <div>
      <canvas ref={canvasRef} width={400} height={220} style={{ display: 'block', width: '100%', borderRadius: 10, border: '1px solid rgba(79,142,247,0.2)' }} />
      <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 12 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Learning Rate η:</span>
        <input type="range" min={0.02} max={0.4} step={0.01} value={lr} onChange={e => { posRef.current = 3.5; setLr(+e.target.value); }}
          style={{ flex: 1, accentColor: 'var(--blue)' }} />
        <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color: 'var(--cyan)', minWidth: 40 }}>{lr}</span>
      </div>
    </div>
  );
}

// === Neural Network Visualizer ===
export function NeuralNetVisual({ topicColor = '#4f8ef7' }) {
  const canvasRef = useRef(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animFrame, t = 0;
    const layers = [3, 5, 4, 2];
    const layerX = [60, 170, 280, 370];
    const maxNodes = Math.max(...layers);
    const nodeH = canvas.height / (maxNodes + 1);

    const nodePos = layers.map((n, li) =>
      Array.from({ length: n }, (_, ni) => ({
        x: layerX[li],
        y: (maxNodes - n) / 2 * nodeH + (ni + 1) * nodeH,
      }))
    );

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Edges
      for (let li = 0; li < nodePos.length - 1; li++) {
        for (const src of nodePos[li]) {
          for (const dst of nodePos[li + 1]) {
            const activity = (Math.sin(t * 0.04 + src.x * 0.01 + src.y * 0.01) + 1) / 2;
            ctx.strokeStyle = `rgba(124,58,237,${0.08 + activity * 0.35})`;
            ctx.lineWidth = 0.8 + activity * 1.2;
            ctx.beginPath(); ctx.moveTo(src.x, src.y); ctx.lineTo(dst.x, dst.y); ctx.stroke();
          }
        }
      }

      // Nodes
      nodePos.forEach((layer, li) => {
        layer.forEach((node, ni) => {
          const pulse = (Math.sin(t * 0.06 + li * 1.2 + ni * 0.8) + 1) / 2;
          const r = 10 + pulse * 4;
          const grd = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, r * 2);
          grd.addColorStop(0, '#fff');
          grd.addColorStop(0.3, topicColor);
          grd.addColorStop(1, topicColor + '00');
          ctx.fillStyle = grd;
          ctx.beginPath(); ctx.arc(node.x, node.y, r, 0, Math.PI * 2); ctx.fill();
        });
      });

      // Layer labels
      const labels = ['Input', 'Hidden 1', 'Hidden 2', 'Output'];
      ctx.font = '10px Inter'; ctx.textAlign = 'center'; ctx.fillStyle = 'rgba(255,255,255,0.35)';
      layerX.forEach((x, i) => ctx.fillText(labels[i], x, canvas.height - 5));

      t++;
      animFrame = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(animFrame);
  }, [topicColor]);

  return (
    <canvas ref={canvasRef} width={420} height={220}
      style={{ display: 'block', width: '100%', borderRadius: 10, border: '1px solid rgba(124,58,237,0.2)' }} />
  );
}

// === Matrix Visual ===
export function MatrixVisual() {
  const [highlight, setHighlight] = useState(null);
  const A = [[1, 2], [3, 4]], B = [[5, 6], [7, 8]];
  const C = A.map((row, i) => B[0].map((_, j) => row.reduce((sum, _, k) => sum + A[i][k] * B[k][j], 0)));

  const MatCell = ({ val, row, col, active, color = '#4f8ef7' }) => (
    <div onClick={() => setHighlight({ row, col })}
      style={{ width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: active ? `${color}22` : 'rgba(255,255,255,0.04)',
        border: `1px solid ${active ? color : 'rgba(255,255,255,0.08)'}`,
        borderRadius: 8, fontSize: 15, fontFamily: 'var(--font-mono)', fontWeight: 600,
        color: active ? color : 'var(--text-secondary)',
        cursor: 'pointer', transition: 'all 0.2s', boxShadow: active ? `0 0 12px ${color}44` : 'none' }}>
      {val}
    </div>
  );

  const MatGrid = ({ mat, label, color }) => (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>{label}</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${mat[0].length}, 48px)`, gap: 4 }}>
        {mat.map((row, i) => row.map((v, j) => (
          <MatCell key={`${i}-${j}`} val={v} row={i} col={j}
            active={highlight && (highlight.row === i || highlight.col === j)} color={color} />
        )))}
      </div>
    </div>
  );

  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', justifyContent: 'center' }}>
      <MatGrid mat={A} label="Matrix A (2×2)" color="#4f8ef7" />
      <div style={{ fontSize: 24, color: 'var(--text-muted)' }}>×</div>
      <MatGrid mat={B} label="Matrix B (2×2)" color="#7c3aed" />
      <div style={{ fontSize: 24, color: 'var(--text-muted)' }}>=</div>
      <MatGrid mat={C} label="Result C = AB" color="#22d3ee" />
      <div style={{ width: '100%', fontSize: 11, color: 'var(--text-muted)', textAlign: 'center', marginTop: 4 }}>
        Click cells to highlight row/column relationships
      </div>
    </div>
  );
}

// === Normal Distribution Visual ===
export function NormalDistVisual() {
  const canvasRef = useRef(null);
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const W = canvas.width, H = canvas.height;
    const pad = 30;

    const norm = x => (1 / (sigma * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
    const toSX = x => pad + ((x + 4) / 8) * (W - 2 * pad);
    const toSY = y => H - pad - (y / 0.5) * (H - 2 * pad);

    // Fill areas (68%, 95%, 99.7%)
    const fills = [
      { range: [mu - sigma, mu + sigma], color: 'rgba(79,142,247,0.25)' },
      { range: [mu - 2 * sigma, mu + 2 * sigma], color: 'rgba(79,142,247,0.1)' },
      { range: [mu - 3 * sigma, mu + 3 * sigma], color: 'rgba(79,142,247,0.05)' },
    ];
    fills.reverse().forEach(({ range, color }) => {
      ctx.beginPath();
      ctx.moveTo(toSX(range[0]), H - pad);
      for (let x = range[0]; x <= range[1]; x += 0.05) {
        ctx.lineTo(toSX(x), toSY(norm(x)));
      }
      ctx.lineTo(toSX(range[1]), H - pad);
      ctx.closePath();
      ctx.fillStyle = color; ctx.fill();
    });

    // Curve
    const grad = ctx.createLinearGradient(0, 0, W, 0);
    grad.addColorStop(0, '#7c3aed'); grad.addColorStop(0.5, '#4f8ef7'); grad.addColorStop(1, '#22d3ee');
    ctx.strokeStyle = grad; ctx.lineWidth = 3; ctx.beginPath();
    for (let x = -4; x <= 4; x += 0.05) {
      const sx = toSX(x), sy = toSY(norm(x));
      if (x === -4) ctx.moveTo(sx, sy); else ctx.lineTo(sx, sy);
    }
    ctx.stroke();

    // Mean line
    ctx.strokeStyle = 'rgba(255,255,255,0.4)'; ctx.lineWidth = 1; ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(toSX(mu), pad); ctx.lineTo(toSX(mu), H - pad); ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = 'rgba(255,255,255,0.6)'; ctx.font = '11px Inter';
    ctx.fillText(`μ=${mu}`, toSX(mu) + 5, pad + 15);

    // Sigma labels
    [-1, 1].forEach(s => {
      ctx.fillStyle = 'rgba(79,142,247,0.7)'; ctx.font = '10px Inter';
      ctx.fillText(`${s > 0 ? '+' : ''}${s}σ`, toSX(mu + s * sigma) - 8, H - 8);
    });

    // Axis
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(pad, H - pad); ctx.lineTo(W - pad, H - pad); ctx.stroke();
  }, [mu, sigma]);

  return (
    <div>
      <canvas ref={canvasRef} width={400} height={200}
        style={{ display: 'block', width: '100%', borderRadius: 10, border: '1px solid rgba(79,142,247,0.2)' }} />
      <div style={{ display: 'flex', gap: 16, marginTop: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Mean μ: {mu}</div>
          <input type="range" min={-2} max={2} step={0.1} value={mu} onChange={e => setMu(+e.target.value)} style={{ width: '100%', accentColor: 'var(--blue)' }} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Std Dev σ: {sigma}</div>
          <input type="range" min={0.3} max={2.5} step={0.1} value={sigma} onChange={e => setSigma(+e.target.value)} style={{ width: '100%', accentColor: 'var(--purple)' }} />
        </div>
      </div>
    </div>
  );
}

// === Bayes Visual ===
export function BayesVisual() {
  const [prior, setPrior] = useState(0.3);
  const [likelihood, setLikelihood] = useState(0.9);
  const [falsePos, setFalsePos] = useState(0.1);

  const evidence = prior * likelihood + (1 - prior) * falsePos;
  const posterior = (likelihood * prior) / evidence;

  const Bar = ({ val, color, label }) => (
    <div style={{ marginBottom: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{label}</span>
        <span style={{ fontSize: 12, fontFamily: 'var(--font-mono)', color }}>{(val * 100).toFixed(1)}%</span>
      </div>
      <div className="progress-bar-track">
        <div className="progress-bar-fill" style={{ width: `${val * 100}%`, background: color }} />
      </div>
    </div>
  );

  return (
    <div style={{ padding: '4px 0' }}>
      <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Adjust Parameters</div>
          {[{ label: 'P(Disease) — Prior', val: prior, set: setPrior, color: '#7c3aed' },
            { label: 'P(+|Disease) — Sensitivity', val: likelihood, set: setLikelihood, color: '#4f8ef7' },
            { label: 'P(+|No Disease) — False Pos', val: falsePos, set: setFalsePos, color: '#f97316' }
          ].map(({ label, val, set, color }) => (
            <div key={label} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, color: 'var(--text-secondary)', marginBottom: 4 }}>{label}: {(val * 100).toFixed(0)}%</div>
              <input type="range" min={0.01} max={0.99} step={0.01} value={val}
                onChange={e => set(+e.target.value)}
                style={{ width: '100%', accentColor: color }} />
            </div>
          ))}
        </div>
        <div style={{ flex: 1, minWidth: 160 }}>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Results (Bayes' Theorem)</div>
          <Bar val={prior} color="#7c3aed" label="Prior P(A)" />
          <Bar val={evidence} color="#f97316" label="Evidence P(B)" />
          <Bar val={posterior} color="#22d3ee" label="Posterior P(A|B)" />
          <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 8, lineHeight: 1.5 }}>
            Positive test → {(posterior * 100).toFixed(1)}% chance of disease
          </div>
        </div>
      </div>
    </div>
  );
}

// === MDP Visual (Reinforcement Learning) ===
export function MDPVisual() {
  const canvasRef = useRef(null);
  const [activeState, setActiveState] = useState(0);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = canvas.width, H = canvas.height;

    const states = [
      { id: 0, x: 80, y: H / 2, label: 'S₀', reward: 0, color: '#4f8ef7' },
      { id: 1, x: 210, y: H / 3, label: 'S₁', reward: +1, color: '#22d3ee' },
      { id: 2, x: 210, y: 2 * H / 3, label: 'S₂', reward: -1, color: '#f97316' },
      { id: 3, x: 360, y: H / 2, label: 'S₃★', reward: +10, color: '#10b981' },
    ];
    const transitions = [
      { from: 0, to: 1, action: 'a₁', prob: 0.7 },
      { from: 0, to: 2, action: 'a₂', prob: 0.3 },
      { from: 1, to: 3, action: 'a₁', prob: 0.8 },
      { from: 1, to: 2, action: 'a₂', prob: 0.4 },
      { from: 2, to: 1, action: 'a₁', prob: 0.5 },
      { from: 2, to: 3, action: 'a₂', prob: 0.3 },
    ];

    ctx.clearRect(0, 0, W, H);

    // Draw transitions
    transitions.forEach(tr => {
      const s = states[tr.from], d = states[tr.to];
      const isActive = tr.from === activeState || tr.to === activeState;
      ctx.strokeStyle = isActive ? '#4f8ef7' : 'rgba(255,255,255,0.15)';
      ctx.lineWidth = isActive ? 2 : 1;
      ctx.setLineDash(isActive ? [] : [4, 4]);
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(d.x, d.y); ctx.stroke();
      ctx.setLineDash([]);

      // Arrow
      const angle = Math.atan2(d.y - s.y, d.x - s.x);
      const ex = d.x - 22 * Math.cos(angle), ey = d.y - 22 * Math.sin(angle);
      ctx.fillStyle = isActive ? '#4f8ef7' : 'rgba(255,255,255,0.2)';
      ctx.beginPath();
      ctx.moveTo(ex, ey);
      ctx.lineTo(ex - 10 * Math.cos(angle - 0.4), ey - 10 * Math.sin(angle - 0.4));
      ctx.lineTo(ex - 10 * Math.cos(angle + 0.4), ey - 10 * Math.sin(angle + 0.4));
      ctx.closePath(); ctx.fill();

      // Label
      const mx = (s.x + d.x) / 2, my = (s.y + d.y) / 2;
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '10px Inter'; ctx.textAlign = 'center';
      ctx.fillText(`${tr.action}:${tr.prob}`, mx, my - 6);
    });

    // Draw states
    states.forEach(state => {
      const isActive = state.id === activeState;
      const r = isActive ? 22 : 18;
      const grd = ctx.createRadialGradient(state.x, state.y, 0, state.x, state.y, r * 2);
      grd.addColorStop(0, state.color); grd.addColorStop(1, state.color + '00');
      ctx.fillStyle = grd; ctx.beginPath(); ctx.arc(state.x, state.y, r * 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = state.color + '33';
      ctx.strokeStyle = state.color; ctx.lineWidth = isActive ? 3 : 1.5;
      ctx.beginPath(); ctx.arc(state.x, state.y, r, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0f1e'; ctx.fill(); ctx.stroke();
      ctx.fillStyle = state.color; ctx.font = `bold ${isActive ? 13 : 11}px Inter`; ctx.textAlign = 'center';
      ctx.fillText(state.label, state.x, state.y + 4);
      ctx.fillStyle = 'rgba(255,255,255,0.5)'; ctx.font = '10px Inter';
      ctx.fillText(`R=${state.reward > 0 ? '+' : ''}${state.reward}`, state.x, state.y + r + 14);
    });
  }, [activeState]);

  return (
    <div>
      <canvas ref={canvasRef} width={440} height={220}
        style={{ display: 'block', width: '100%', borderRadius: 10, border: '1px solid rgba(124,58,237,0.2)' }} />
      <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
        {['S₀', 'S₁', 'S₂', 'S₃★'].map((s, i) => (
          <button key={i} onClick={() => setActiveState(i)}
            style={{ padding: '4px 12px', borderRadius: 8, border: `1px solid ${activeState === i ? '#4f8ef7' : 'rgba(255,255,255,0.1)'}`,
              background: activeState === i ? 'rgba(79,142,247,0.15)' : 'transparent',
              color: activeState === i ? '#4f8ef7' : 'var(--text-secondary)', cursor: 'pointer', fontSize: 12 }}>
            {s}
          </button>
        ))}
        <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 4, alignSelf: 'center' }}>Click state to highlight</span>
      </div>
    </div>
  );
}

export function getVisualComponent(type, topicColor) {
  switch (type) {
    case 'vector': return <VectorVisual />;
    case 'gradient': return <GradientDescentVisual />;
    case 'matrix': return <MatrixVisual />;
    case 'normal': return <NormalDistVisual />;
    case 'bayes': return <BayesVisual />;
    case 'mdp': return <MDPVisual />;
    case 'eigen':
    case 'dot':
    case 'derivative':
    case 'backprop':
    case 'distribution':
    case 'mle':
    case 'expectation':
      return <NeuralNetVisual topicColor={topicColor} />;
    default: return <NeuralNetVisual topicColor={topicColor} />;
  }
}
