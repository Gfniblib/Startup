export const weatherEffects = [
  {
    weather: 'Rainy',
    effects: [
      'Rainfall intensity: placeholder',
      'Water abilities: placeholder effect',
      'Fire abilities: placeholder effect',
    ],
  },
  {
    weather: 'Windy',
    effects: [
      'Wind speed: placeholder',
      'Ranged attacks: placeholder effect',
      'Flying creatures: placeholder effect',
    ],
  },
  {
    weather: 'Sunny',
    effects: [
      'Sunlight level: placeholder',
      'Fire abilities: placeholder effect',
      'Healing abilities: placeholder effect',
    ],
  },
  {
    weather: 'Cloudy',
    effects: [
      'Cloud cover: placeholder',
      'Light abilities: placeholder effect',
      'Shadow abilities: placeholder effect',
    ],
  },
];

export const leaderboardData = [
  { hero: 'Aria Dawn', heroClass: 'Rogue Archivist', score: 14800 },
  { hero: 'Kael Frost', heroClass: 'Frostblade', score: 13250 },
  { hero: 'Nyra Bloom', heroClass: 'Wild Sage', score: 12600 },
  { hero: 'Orin Vale', heroClass: 'Guardian', score: 11920 },
];

export function getRandomWeather() {
  const randomIndex = Math.floor(Math.random() * weatherEffects.length);
  return weatherEffects[randomIndex];
}

export function testDelayedPlayerHelpMessage() {
  const delay = Math.floor(Math.random() * (60000 - 30000 + 1)) + 30000;

  return new Promise((resolve) => {
    setTimeout(() => resolve('+30 XP for helping another player!'), delay);
  });
}