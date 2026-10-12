// === MathRL Agent – Curriculum Data ===
// All topics, lessons, quizzes, and RL state

export const TOPICS = [
  {
    id: 'linear-algebra',
    name: 'Linear Algebra',
    icon: '⊕',
    color: '#4f8ef7',
    gradient: 'linear-gradient(135deg,#4f8ef7,#7c3aed)',
    description: 'Vectors, matrices, eigenvalues — the backbone of ML',
    xpReward: 150,
    lessons: [
      {
        id: 'la-1',
        title: 'Vectors & Vector Spaces',
        difficulty: 'Beginner',
        xp: 30,
        formula: '\\vec{v} = \\begin{bmatrix} v_1 \\\\ v_2 \\\\ v_3 \\end{bmatrix}',
        concept: 'A vector is an ordered list of numbers representing magnitude and direction in n-dimensional space.',
        visual: 'vector',
        quiz: [
          { q: 'What is the dimension of a vector [3, 4, 5]?', options: ['2', '3', '4', '5'], correct: 1, explanation: 'The vector has 3 components, so it lives in 3D space (dimension = 3).' },
          { q: 'Which operation adds two vectors?', options: ['Dot product', 'Component-wise addition', 'Cross product', 'Matrix multiply'], correct: 1, explanation: 'Vectors are added component-wise: [a,b]+[c,d]=[a+c,b+d].' },
          { q: 'What is the zero vector?', options: ['A vector of length 1', 'All components are 0', 'A vector with no direction', 'The identity matrix'], correct: 1, explanation: 'The zero vector has all components equal to 0 and has no direction.' },
        ],
      },
      {
        id: 'la-2',
        title: 'Matrix Operations',
        difficulty: 'Beginner',
        xp: 40,
        formula: 'C_{ij} = \\sum_{k=1}^{n} A_{ik} B_{kj}',
        concept: 'Matrix multiplication combines rows of A with columns of B — crucial for neural network forward passes.',
        visual: 'matrix',
        quiz: [
          { q: 'For matrix multiplication AB, what must be true?', options: ['A and B must be square', 'Cols(A) = Rows(B)', 'Rows(A) = Rows(B)', 'A = B'], correct: 1, explanation: 'The number of columns in A must equal the number of rows in B for the product to be defined.' },
          { q: 'What is the identity matrix?', options: ['A matrix of all ones', 'A diagonal matrix of ones', 'A zero matrix', 'A random matrix'], correct: 1, explanation: 'The identity matrix I has ones on the diagonal and zeros elsewhere. AI = IA = A.' },
          { q: 'Is matrix multiplication commutative?', options: ['Yes, always', 'No, AB ≠ BA in general', 'Only for square matrices', 'Only for symmetric matrices'], correct: 1, explanation: 'Matrix multiplication is NOT commutative in general. AB ≠ BA.' },
        ],
      },
      {
        id: 'la-3',
        title: 'Eigenvalues & Eigenvectors',
        difficulty: 'Intermediate',
        xp: 50,
        formula: 'A\\vec{v} = \\lambda \\vec{v}',
        concept: 'Eigenvectors remain in the same direction when transformed by A. Eigenvalues λ tell how much they scale. PCA relies on this!',
        visual: 'eigen',
        quiz: [
          { q: 'What does Av = λv mean?', options: ['A scales v by λ', 'v is orthogonal to A', 'A and v are equal', 'λ is the trace'], correct: 0, explanation: 'When A acts on eigenvector v, it simply scales it by the scalar λ (eigenvalue).' },
          { q: 'PCA uses eigenvalues to...', options: ['Sort features', 'Find principal components', 'Normalize data', 'Compute gradients'], correct: 1, explanation: 'PCA finds eigenvectors of the covariance matrix — these are the principal components.' },
          { q: 'An n×n matrix has at most how many eigenvalues?', options: ['1', 'n/2', 'n', '2n'], correct: 2, explanation: 'An n×n matrix has exactly n eigenvalues (counting multiplicity, possibly complex).' },
        ],
      },
      {
        id: 'la-4',
        title: 'Dot Product & Cosine Similarity',
        difficulty: 'Beginner',
        xp: 30,
        formula: '\\cos(\\theta) = \\frac{\\vec{a} \\cdot \\vec{b}}{|\\vec{a}||\\vec{b}|}',
        concept: 'Cosine similarity measures the angle between two vectors — used in NLP, recommendation systems, and attention mechanisms.',
        visual: 'dot',
        quiz: [
          { q: 'What does a dot product of 0 mean?', options: ['Vectors are parallel', 'Vectors are orthogonal', 'Vectors are identical', 'Vectors are negative'], correct: 1, explanation: 'A dot product of 0 means the vectors are perpendicular (orthogonal) to each other.' },
          { q: 'Cosine similarity of 1 means...', options: ['Vectors are opposite', 'Vectors are identical direction', 'Vectors are orthogonal', 'No relation'], correct: 1, explanation: 'cos(0°) = 1, meaning the vectors point in exactly the same direction.' },
          { q: 'The dot product a·b equals...', options: ['|a||b|cos(θ)', '|a|+|b|', '|a-b|', '|a|×|b|sin(θ)'], correct: 0, explanation: 'The dot product equals the product of magnitudes times the cosine of the angle between them.' },
        ],
      },
    ],
  },
  {
    id: 'calculus',
    name: 'Calculus',
    icon: '∂',
    color: '#22d3ee',
    gradient: 'linear-gradient(135deg,#22d3ee,#4f8ef7)',
    description: 'Derivatives, gradients, chain rule — how ML models learn',
    xpReward: 200,
    lessons: [
      {
        id: 'calc-1',
        title: 'Derivatives & Rates of Change',
        difficulty: 'Beginner',
        xp: 30,
        formula: "f'(x) = \\lim_{h \\to 0} \\frac{f(x+h) - f(x)}{h}",
        concept: 'The derivative measures how fast a function changes. In ML, it tells us how changing a weight affects the loss.',
        visual: 'derivative',
        quiz: [
          { q: "What is the derivative of f(x) = x²?", options: ['x', '2x', 'x²', '2'], correct: 1, explanation: "Using the power rule: d/dx(xⁿ) = nxⁿ⁻¹, so d/dx(x²) = 2x." },
          { q: 'What does a zero derivative at a point mean?', options: ['Maximum slope', 'Critical point (min/max/saddle)', 'Undefined', 'Linear region'], correct: 1, explanation: "f'(x) = 0 means the function is flat at that point — it's a critical point (could be min, max, or saddle)." },
          { q: "Derivative of sin(x) is?", options: ['cos(x)', '-cos(x)', 'sin(x)', '-sin(x)'], correct: 0, explanation: "d/dx[sin(x)] = cos(x). This is a fundamental trigonometric derivative." },
        ],
      },
      {
        id: 'calc-2',
        title: 'Gradient Descent',
        difficulty: 'Intermediate',
        xp: 60,
        formula: '\\theta_{t+1} = \\theta_t - \\eta \\nabla_{\\theta} J(\\theta)',
        concept: 'Gradient descent updates parameters by moving opposite to the gradient of the loss. η (eta) is the learning rate. This IS how neural networks learn.',
        visual: 'gradient',
        quiz: [
          { q: 'What does ∇J(θ) represent?', options: ['The loss value', 'The gradient of loss w.r.t. θ', 'The learning rate', 'The parameter update'], correct: 1, explanation: '∇J(θ) is the gradient — a vector of partial derivatives showing the steepest ascent direction of J.' },
          { q: 'A very large learning rate η causes...', options: ['Slow convergence', 'Overshooting / divergence', 'Better generalization', 'Exact convergence'], correct: 1, explanation: 'Too large η causes the optimizer to overshoot the minimum and potentially diverge.' },
          { q: 'In gradient descent, we move...', options: ['Along the gradient', 'Opposite to the gradient', 'Perpendicular to gradient', 'Randomly'], correct: 1, explanation: 'We subtract the gradient to move toward the minimum (steepest descent).' },
        ],
      },
      {
        id: 'calc-3',
        title: 'Chain Rule & Backpropagation',
        difficulty: 'Advanced',
        xp: 70,
        formula: '\\frac{\\partial L}{\\partial w} = \\frac{\\partial L}{\\partial a} \\cdot \\frac{\\partial a}{\\partial z} \\cdot \\frac{\\partial z}{\\partial w}',
        concept: 'Backpropagation IS the chain rule applied to neural networks. It computes gradients layer by layer from output to input.',
        visual: 'backprop',
        quiz: [
          { q: 'The chain rule is used in neural networks for...', options: ['Forward pass', 'Backpropagation', 'Data normalization', 'Activation functions'], correct: 1, explanation: 'Backpropagation uses the chain rule to compute gradients through each layer of the network.' },
          { q: "d/dx[f(g(x))] equals?", options: ["f'(x)g'(x)", "f'(g(x))·g'(x)", "f(g'(x))", "f'(x)+g'(x)"], correct: 1, explanation: "The chain rule: the derivative of a composite function is f'(g(x)) times g'(x)." },
          { q: 'Vanishing gradients occur when...', options: ['Learning rate is high', 'Gradients become very small in deep nets', 'Loss is zero', 'Weights are large'], correct: 1, explanation: 'In deep networks, chain-rule multiplication of small gradients makes early layer gradients vanishingly small.' },
        ],
      },
    ],
  },
  {
    id: 'statistics',
    name: 'Statistics',
    icon: 'σ',
    color: '#10b981',
    gradient: 'linear-gradient(135deg,#10b981,#22d3ee)',
    description: 'Mean, variance, distributions — the language of uncertainty',
    xpReward: 175,
    lessons: [
      {
        id: 'stat-1',
        title: 'Mean, Variance & Standard Deviation',
        difficulty: 'Beginner',
        xp: 25,
        formula: '\\sigma^2 = \\frac{1}{n}\\sum_{i=1}^{n}(x_i - \\mu)^2',
        concept: 'Variance measures the spread of data. Standard deviation σ is its square root. Batch normalization in deep learning uses these!',
        visual: 'distribution',
        quiz: [
          { q: 'Mean of [2, 4, 6, 8] is?', options: ['4', '5', '6', '20'], correct: 1, explanation: 'Mean = (2+4+6+8)/4 = 20/4 = 5.' },
          { q: 'Standard deviation is...', options: ['The maximum value', 'Square root of variance', 'Variance squared', 'The median'], correct: 1, explanation: 'Standard deviation σ = √variance. It measures spread in the same units as the data.' },
          { q: 'Batch normalization uses...', options: ['Min and max', 'Mean and std dev', 'Median and range', 'Mode and variance'], correct: 1, explanation: 'Batch norm normalizes using batch mean μ and standard deviation σ to stabilize training.' },
        ],
      },
      {
        id: 'stat-2',
        title: 'Normal Distribution',
        difficulty: 'Intermediate',
        xp: 45,
        formula: 'f(x) = \\frac{1}{\\sigma\\sqrt{2\\pi}} e^{-\\frac{(x-\\mu)^2}{2\\sigma^2}}',
        concept: 'The bell curve. Most natural phenomena follow this. Weight initialization and noise in ML often uses the normal distribution.',
        visual: 'normal',
        quiz: [
          { q: 'A standard normal has mean μ = ? and σ = ?', options: ['0 and 1', '1 and 0', '0.5 and 1', '1 and 1'], correct: 0, explanation: 'Standard normal N(0,1) has mean 0 and standard deviation 1.' },
          { q: '68% of data falls within...', options: ['μ ± 0.5σ', 'μ ± 1σ', 'μ ± 2σ', 'μ ± 3σ'], correct: 1, explanation: 'The 68-95-99.7 rule: ~68% within ±1σ, ~95% within ±2σ, ~99.7% within ±3σ.' },
          { q: 'Xavier weight initialization uses which distribution?', options: ['Uniform only', 'Normal or Uniform', 'Exponential', 'Poisson'], correct: 1, explanation: 'Xavier init samples from uniform or normal distribution scaled by layer size to keep variance stable.' },
        ],
      },
      {
        id: 'stat-3',
        title: 'Maximum Likelihood Estimation',
        difficulty: 'Advanced',
        xp: 55,
        formula: '\\hat{\\theta}_{MLE} = \\arg\\max_{\\theta} \\prod_{i=1}^{n} p(x_i | \\theta)',
        concept: 'MLE finds parameters that make observed data most probable. Training a neural network with cross-entropy loss IS maximum likelihood estimation!',
        visual: 'mle',
        quiz: [
          { q: 'MLE maximizes...', options: ['The posterior', 'The likelihood of observed data', 'The prior', 'The regularizer'], correct: 1, explanation: 'MLE finds θ that maximizes the probability of seeing the observed data under model p(x|θ).' },
          { q: 'We use log-likelihood because...', options: ['It is simpler', 'Products become sums, more numerically stable', 'It changes the maximum', 'It adds regularization'], correct: 1, explanation: 'log turns the product into a sum, making optimization easier and preventing numerical underflow.' },
          { q: 'Cross-entropy loss is equivalent to...', options: ['MSE maximization', 'Negative log-likelihood minimization', 'L2 regularization', 'KL divergence maximization'], correct: 1, explanation: 'Minimizing cross-entropy = minimizing negative log-likelihood = MLE for classification!' },
        ],
      },
    ],
  },
  {
    id: 'probability',
    name: 'Probability',
    icon: 'P',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg,#7c3aed,#ec4899)',
    description: "Bayes' theorem, distributions, expectation — reasoning under uncertainty",
    xpReward: 175,
    lessons: [
      {
        id: 'prob-1',
        title: "Bayes' Theorem",
        difficulty: 'Intermediate',
        xp: 50,
        formula: "P(A|B) = \\frac{P(B|A) \\cdot P(A)}{P(B)}",
        concept: "Bayes' theorem updates our belief given evidence. It underlies Bayesian neural networks, naive Bayes classifiers, and probabilistic inference.",
        visual: 'bayes',
        quiz: [
          { q: 'P(A|B) is called...', options: ['Prior', 'Likelihood', 'Posterior', 'Evidence'], correct: 2, explanation: 'P(A|B) is the posterior — our updated belief about A after observing evidence B.' },
          { q: 'P(A) before seeing any evidence is called...', options: ['Posterior', 'Likelihood', 'Prior', 'Marginal'], correct: 2, explanation: 'P(A) is the prior — our belief about A before any evidence is observed.' },
          { q: 'Bayesian inference updates...', options: ['The data', 'Our prior belief using evidence', 'The model architecture', 'The loss function'], correct: 1, explanation: "Bayesian inference uses Bayes' theorem to update prior beliefs with observed data to get the posterior." },
        ],
      },
      {
        id: 'prob-2',
        title: 'Expected Value & Variance',
        difficulty: 'Beginner',
        xp: 35,
        formula: 'E[X] = \\sum_{x} x \\cdot P(X=x)',
        concept: 'Expected value is the weighted average of outcomes. In RL, the agent maximizes expected cumulative reward!',
        visual: 'expectation',
        quiz: [
          { q: 'Expected value of a fair die is?', options: ['3', '3.5', '4', '7'], correct: 1, explanation: 'E[X] = (1+2+3+4+5+6)/6 = 21/6 = 3.5.' },
          { q: 'In RL, the agent maximizes...', options: ['Immediate reward', 'Expected cumulative reward', 'Random reward', 'Minimum reward'], correct: 1, explanation: 'The RL agent maximizes E[Σ γᵗ rₜ], the expected discounted sum of future rewards.' },
          { q: 'Var(X) = E[X²] - (E[X])² is...', options: ['False', 'True', 'Only for discrete X', 'Only for normal X'], correct: 1, explanation: 'This is the computational formula for variance, valid for both discrete and continuous random variables.' },
        ],
      },
      {
        id: 'prob-3',
        title: 'Markov Decision Processes',
        difficulty: 'Advanced',
        xp: 60,
        formula: 'V^*(s) = \\max_a \\left[ R(s,a) + \\gamma \\sum_{s\'} P(s\'|s,a) V^*(s\') \\right]',
        concept: "MDPs formalize the RL problem: states, actions, rewards, transitions. The Bellman equation gives the optimal value function — the heart of Q-learning and policy gradient methods.",
        visual: 'mdp',
        quiz: [
          { q: 'In an MDP, γ (gamma) is...', options: ['Learning rate', 'Discount factor for future rewards', 'Reward signal', 'State transition'], correct: 1, explanation: 'γ ∈ [0,1] discounts future rewards. γ=0: myopic; γ→1: far-sighted agent.' },
          { q: 'The Bellman equation gives...', options: ['Policy gradient', 'Optimal value function', 'Transition probabilities', 'Reward function'], correct: 1, explanation: "The Bellman optimality equation defines V*(s) recursively — key to dynamic programming and Q-learning." },
          { q: 'Q(s,a) represents...', options: ['State value', 'Action-value (quality) for (state, action) pair', 'Policy probability', 'Transition reward'], correct: 1, explanation: 'Q(s,a) is the expected return starting from state s, taking action a, then following the optimal policy.' },
        ],
      },
    ],
  },
];

export const RANKS = [
  { name: 'Novice', minXP: 0, color: '#94a3b8', icon: '🌱' },
  { name: 'Apprentice', minXP: 200, color: '#10b981', icon: '📐' },
  { name: 'Scholar', minXP: 500, color: '#4f8ef7', icon: '🔢' },
  { name: 'Expert', minXP: 1000, color: '#7c3aed', icon: '🧠' },
  { name: 'Master', minXP: 2000, color: '#f97316', icon: '⭐' },
  { name: 'Grandmaster', minXP: 3500, color: '#ec4899', icon: '🏆' },
];

export function getRank(xp) {
  for (let i = RANKS.length - 1; i >= 0; i--) {
    if (xp >= RANKS[i].minXP) return RANKS[i];
  }
  return RANKS[0];
}

export function getNextRank(xp) {
  for (let i = 0; i < RANKS.length; i++) {
    if (xp < RANKS[i].minXP) return RANKS[i];
  }
  return null;
}

// Initial RL agent state
export const INITIAL_STATE = {
  xp: 0,
  completedLessons: [],
  quizScores: {},
  streakDays: 0,
  totalCorrect: 0,
  totalAnswered: 0,
  lastActivity: null,
  agentEpisodes: 0,
  agentReward: 0,
};
