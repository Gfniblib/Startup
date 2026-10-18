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

export function drawBattleScene(context, scene) {
  const { width, height } = context.canvas;
  const playerOffset = scene.playerOffset ?? 0;

  context.clearRect(0, 0, width, height);

  const sky = context.createLinearGradient(0, 0, 0, height);
  sky.addColorStop(0, '#202938');
  sky.addColorStop(1, '#58677a');
  context.fillStyle = sky;
  context.fillRect(0, 0, width, height);

  context.fillStyle = '#354536';
  context.fillRect(0, height * 0.72, width, height * 0.28);

  context.fillStyle = '#4b6b4b';
  context.fillRect(0, height * 0.72, width, height * 0.04);

  context.fillStyle = '#7bb7e0';
  context.fillRect(width * 0.28, height * 0.42 + playerOffset, 48, 96);
  context.fillStyle = '#d89055';
  context.fillRect(width * 0.68, height * 0.42 - playerOffset, 48, 96);
}

export function drawWaitingScreen(context) {
  const { width, height } = context.canvas;

  context.clearRect(0, 0, width, height);
  context.fillStyle = '#202938';
  context.fillRect(0, 0, width, height);

  context.fillStyle = '#ffffff';
  context.font = 'bold 36px sans-serif';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText('Waiting for battle...', width / 2, height / 2);
}

export function updateBattleScene(scene, deltaTime) {
  const elapsedTime = (scene.elapsedTime ?? 0) + deltaTime;

  return {
    ...scene,
    elapsedTime,
    playerOffset: Math.sin(elapsedTime * 2) * 4,
  };
}