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

  // Reset the canvas
  context.clearRect(0, 0, width, height);

  // Fill in skybox
  context.fillStyle = '#7f94b8';
  context.fillRect(0, 0, width, height);

  //Scene floor
  drawRotatedCheckerboard(context);

  // Draw the player character (placeholder)

  context.save();
  context.restore();
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

function drawRotatedCheckerboard(ctx) {
  // Loop through grid cells
  const rows = 24;
  const cols = 40;
  const size = 45;
  const focalLength = 250;
  const vpX = ctx.canvas.width * .30;
  const vpY = ctx.canvas.height * .5;
  const angle = -2 * Math.PI / 180;
  const cosA = Math.cos(angle);
  const sinA = Math.sin(angle);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {

      // Define the 4 corners of a single grid square in 3D Space
      // (Y is the vertical drop below the horizon line)
      const points3D = [
        { X: (c - cols / 2) * size,     Y: 120, Z: (r) * size + 80 },
        { X: (c + 1 - cols / 2) * size, Y: 120, Z: (r) * size + 80 },
        { X: (c + 1 - cols / 2) * size, Y: 120, Z: (r + 1) * size + 80 },
        { X: (c - cols / 2) * size,     Y: 120, Z: (r + 1) * size + 80 }
      ];

      // Map 3D coordinates to 2D screen positions relative to the VP
      const points2D = points3D.map(p => {
        // Standard perspective division
        const screenX = (p.X * focalLength) / p.Z;
        const screenY = (p.Y * focalLength) / p.Z;

        // Apply a 2D rotation matrix around the Vanishing Point (0,0 abstraction)
        // This tilts the horizon line by exactly -2 degrees
        const tiltedX = screenX * cosA - screenY * sinA;
        const tiltedY = screenX * sinA + screenY * cosA;

        // Shift coordinates relative to the real anchor point on the canvas
        return {
          x: tiltedX + vpX,
          y: tiltedY + vpY
        };
      });

      // Draw the warped 3D checkerboard quad
      ctx.beginPath();
      ctx.moveTo(points2D[0].x, points2D[0].y);
      ctx.lineTo(points2D[1].x, points2D[1].y);
      ctx.lineTo(points2D[2].x, points2D[2].y);
      ctx.lineTo(points2D[3].x, points2D[3].y);
      ctx.closePath();

      // Checkerboard color swapping logic
      ctx.fillStyle = (r + c) % 2 === 0 ? '#9c90df' : '#111111';
      ctx.fill();

      // Clear edge bleeding artifact lines
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
  }
}