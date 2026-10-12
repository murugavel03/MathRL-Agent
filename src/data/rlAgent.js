// === MathRL Agent – RL Agent Logic ===
// Simulates a reinforcement learning agent that adapts lesson difficulty

import { TOPICS } from './curriculum';

// Q-table: maps (topic, difficulty) to action probabilities
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

class RLAgent {
  constructor() {
    this.qTable = {};
    this.epsilon = 0.3; // exploration rate
    this.alpha = 0.2;   // learning rate
    this.gamma = 0.9;   // discount factor
    this.episodes = 0;
    this.totalReward = 0;
    this._initQTable();
  }

  _initQTable() {
    TOPICS.forEach(topic => {
      DIFFICULTIES.forEach(diff => {
        this.qTable[`${topic.id}-${diff}`] = {
          present: Math.random() * 0.5 + 0.5,
          skip: Math.random() * 0.3,
          repeat: Math.random() * 0.4,
        };
      });
    });
  }

  // ε-greedy action selection
  selectAction(topicId, difficulty, studentPerformance) {
    const state = `${topicId}-${difficulty}`;
    if (Math.random() < this.epsilon) {
      const actions = ['present', 'skip', 'repeat'];
      return actions[Math.floor(Math.random() * actions.length)];
    }
    const q = this.qTable[state] || { present: 0.5, skip: 0.2, repeat: 0.3 };
    return Object.entries(q).sort(([,a],[,b]) => b - a)[0][0];
  }

  // Update Q-value based on quiz reward
  update(topicId, difficulty, action, reward, nextDifficulty) {
    const state = `${topicId}-${difficulty}`;
    const nextState = `${topicId}-${nextDifficulty}`;
    if (!this.qTable[state]) return;

    const currentQ = this.qTable[state][action] || 0;
    const nextQ = this.qTable[nextState]
      ? Math.max(...Object.values(this.qTable[nextState]))
      : 0;

    this.qTable[state][action] = currentQ + this.alpha * (reward + this.gamma * nextQ - currentQ);
    this.episodes++;
    this.totalReward += reward;

    // Decay exploration
    this.epsilon = Math.max(0.05, this.epsilon * 0.995);
  }

  // Compute reward from quiz score (0-1 accuracy)
  computeReward(accuracy, timeMs) {
    const accuracyReward = accuracy * 10;
    const timeBonus = timeMs < 30000 ? 2 : timeMs < 60000 ? 1 : 0;
    return accuracyReward + timeBonus;
  }

  // Recommend next lesson based on performance
  recommendNext(topicId, currentDifficulty, accuracy) {
    const diffIndex = DIFFICULTIES.indexOf(currentDifficulty);
    if (accuracy >= 0.8 && diffIndex < DIFFICULTIES.length - 1) {
      return { difficulty: DIFFICULTIES[diffIndex + 1], reason: '🚀 Great job! Ready for the next level.' };
    } else if (accuracy < 0.5 && diffIndex > 0) {
      return { difficulty: DIFFICULTIES[diffIndex - 1], reason: '📚 Let\'s reinforce the fundamentals first.' };
    }
    return { difficulty: currentDifficulty, reason: '✅ Good pace! Keep going with this level.' };
  }

  getStats() {
    return {
      episodes: this.episodes,
      totalReward: Math.round(this.totalReward * 10) / 10,
      epsilon: Math.round(this.epsilon * 100) / 100,
      explorationRate: `${Math.round(this.epsilon * 100)}%`,
    };
  }
}

export const rlAgent = new RLAgent();
