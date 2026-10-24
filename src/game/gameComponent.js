export class Character {

  // Create Character from ancestor option TODO
  constructor(name, heroClass, race, ancestor) {
    this.name = name;
    this.heroClass = heroClass;
    this.race = race;
    this.level = 1;
    this.xp = 0;
    this.xpToNextLevel = 100 * this.level ** 1.2;


    this.str = 3;
    this.con = 3;
    this.dex = 3;
    this.int = 3;
    this.wil = 3;
    this.spd = 3;
    this.hp = 50;
    this.currentHp = this.hp;
    this.mp = 15;
    this.currentMp = this.mp;
    this.initiative = 0;
    this.initiativeTieBreaker = Math.random();
    this.isDefending = false;
    this.skills = getClassSkills(heroClass);

    this.strChance = 50; // TODO
    this.conChance = 50;
    this.dexChance = 50;
    this.intChance = 50;
    this.wilChance = 50;
    this.spdChance = 50;
    this.hpChance = 50;
    this.mpChance = 50;
  }
}

function getClassSkills(heroClass) {
  const skillByClass = {
    Warrior: {
      id: 'power-strike',
      name: 'Power Strike',
      description: 'Deal 50% more physical damage. Costs 5 MP.',
      target: 'enemy',
      mpCost: 5,
    },
    Cleric: {
      id: 'mend',
      name: 'Mend',
      description: 'Restore 10 HP plus healing based on INT. Costs 5 MP.',
      target: 'ally',
      mpCost: 5,
    },
    Mage: {
      id: 'arcane-blast',
      name: 'Arcane Blast',
      description: 'Deal magic damage based on INT and the enemy WIL. Costs 5 MP.',
      target: 'enemy',
      mpCost: 5,
    },
    Ranger: {
      id: 'volley',
      name: 'Volley',
      description: 'Deal damage to all enemies based on STR. Costs 5 MP.',
      target: 'allEnemies',
      mpCost: 5,
    },
  };

  return skillByClass[heroClass] ? [{ ...skillByClass[heroClass] }] : [];
}

const samplePartyTemplates = [
  {
    name: 'Borin Stoneguard',
    heroClass: 'Warrior',
    race: 'Dwarf',
    stats: { str: 5, con: 5, dex: 2, int: 2, wil: 3, spd: 3, hp: 70, mp: 10 },
  },
  {
    name: 'Lyra Moonweaver',
    heroClass: 'Mage',
    race: 'Elf',
    stats: { str: 2, con: 2, dex: 3, int: 5, wil: 5, spd: 3, hp: 40, mp: 35 },
  },
  {
    name: 'Tarin Quickstep',
    heroClass: 'Ranger',
    race: 'Human',
    stats: { str: 4, con: 3, dex: 5, int: 3, wil: 3, spd: 5, hp: 50, mp: 15 },
  },
];

export function createSamplePartyMembers() {
  return samplePartyTemplates.map(({ name, heroClass, race, stats }) => {
    const character = new Character(name, heroClass, race);
    Object.assign(character, stats, {
      currentHp: stats.hp,
      currentMp: stats.mp,
    });
    return character;
  });
}

export class Enemy {
  constructor(name, enemyType) {
    this.name = name;
    this.enemyType = enemyType;

    this.str = 1;
    this.con = 1;
    this.dex = 1;
    this.int = 1;
    this.wil = 1;
    this.spd = 1;
    this.hp = 1;
    this.currentHp = this.hp;
    this.mp = 1;
    this.currentMp = this.mp;
    this.initiative = 0;
    this.initiativeTieBreaker = Math.random();
    this.isDefending = false;

    this.xpValue = 10;
  }
}

export class Goblin extends Enemy {
  constructor(name) {
    super(name, 'goblin');
  }

  // Override default stats for Goblin
  str = 1;
  con = 5;
  dex = 1;
  int = 1;
  wil = 3;
  spd = 2;
  hp = 20;
  currentHp = this.hp;
  mp = 10;
  currentMp = this.mp;
}

export class Skeleton extends Enemy {
  constructor(name) {
    super(name, 'skeleton');
  }

  // Override default stats for Skeleton
  str = 1;
  con = 1;
  dex = 1;
  int = 1;
  wil = 1;
  spd = 1;
  hp = 35;
  currentHp = this.hp;
  mp = 10;
  currentMp = this.mp;
}

export class Slime extends Enemy {
  constructor(name) {
    super(name, 'slime');
  }

  // Override default stats for Slime
  str = 3;
  con = 6;
  dex = 1;
  int = 1;
  wil = 1;
  spd = 1;
  hp = 50;
  currentHp = this.hp;
  mp = 20;
  currentMp = this.mp;
}

export class Battle {
  constructor({
    environment = 'stub',
    weather = 'stub',
    playerCharacters = [],
    enemies = [],
  } = {}) {
    if (!Array.isArray(playerCharacters) || playerCharacters.length > 4) {
      throw new RangeError('A battle can have up to 4 player characters.');
    }

    if (!Array.isArray(enemies) || enemies.length > 4) {
      throw new RangeError('A battle can have up to 4 enemies.');
    }

    if (!enemies.every((enemy) => enemy instanceof Enemy)) {
      throw new TypeError('Battle enemies must be Enemy instances.');
    }

    this.environment = environment;
    this.weather = weather;
    this.playerCharacters = [...playerCharacters];
    this.enemies = [...enemies];
    this.currentTurn = null;
  }

  getTurnOrder() {
    return [...this.playerCharacters, ...this.enemies]
      .filter((entity) => entity.currentHp > 0)
      .sort((a, b) => {
        const aTicksRemaining = a.initiative >= 1000
          ? 0
          : a.spd > 0
            ? (1000 - a.initiative) / a.spd
            : Infinity;
        const bTicksRemaining = b.initiative >= 1000
          ? 0
          : b.spd > 0
            ? (1000 - b.initiative) / b.spd
            : Infinity;

        return aTicksRemaining - bTicksRemaining
          || a.initiativeTieBreaker - b.initiativeTieBreaker;
      });
  }

  tick() {
    if (this.currentTurn) {
      return null;
    }

    const aliveEntities = this.getTurnOrder();
    const nextActors = aliveEntities
      .map((entity) => ({
        entity,
        ticksUntilReady: entity.initiative >= 1000
          ? 0
          : entity.spd > 0
            ? (1000 - entity.initiative) / entity.spd
            : Infinity,
      }))
      .filter((candidate) => Number.isFinite(candidate.ticksUntilReady))
      .sort((a, b) => a.ticksUntilReady - b.ticksUntilReady
        || a.entity.initiativeTieBreaker - b.entity.initiativeTieBreaker);

    if (nextActors.length === 0) {
      return null;
    }

    const { entity: actor, ticksUntilReady } = nextActors[0];
    aliveEntities.forEach((entity) => {
      entity.initiative += entity.spd * ticksUntilReady;
    });
    actor.initiative = Math.max(1000, actor.initiative);
    actor.isDefending = false;
    this.currentTurn = actor;
    return actor;
  }

  finishTurn() {
    if (!this.currentTurn) {
      throw new Error('There is no active turn to finish.');
    }

    this.currentTurn.initiative -= 1000;
    this.currentTurn = null;

    return this.tick();
  }

  attack(attacker, defender, damageMultiplier = 1) {
    if (attacker.currentHp <= 0 || defender.currentHp <= 0) {
      throw new Error('Attacker and defender must be alive.');
    }

    const attack = attacker.atk ?? attacker.str;
    const defense = defender.def ?? defender.con;
    const baseDamage = Math.max(1, 5 * (attack - defense * 0.5)) * damageMultiplier;
    const variation = 0.9 + Math.random() * 0.2;
    const damage = Math.round(baseDamage * variation * 100) / 100
      * (defender.isDefending ? 0.5 : 1);

    defender.currentHp = Math.max(
      0,
      Math.round((defender.currentHp - damage) * 100) / 100
    );
    return damage;
  }

  useSkill(actor, skillId, target = null) {
    const skill = actor.skills?.find((candidate) => candidate.id === skillId);
    if (!skill) {
      throw new Error('This character does not know that skill.');
    }

    if (actor.currentHp <= 0 || actor.currentMp < skill.mpCost) {
      throw new Error('This character cannot use that skill right now.');
    }

    if (skill.target === 'enemy' && (!this.enemies.includes(target) || target.currentHp <= 0)) {
      throw new Error('Choose a living enemy for this skill.');
    }

    if (
      skill.target === 'ally'
      && (!this.playerCharacters.includes(target) || target.currentHp <= 0)
    ) {
      throw new Error('Choose a living teammate for this skill.');
    }

    actor.currentMp -= skill.mpCost;

    if (skill.id === 'power-strike') {
      const damage = this.attack(actor, target, 1.5);
      return `${actor.name} used Power Strike on ${target.name} for ${damage.toFixed(2)} damage.`;
    }

    if (skill.id === 'mend') {
      const healing = Math.round(10 + target.hp * actor.int / 100);
      const restored = Math.max(0, Math.min(healing, target.hp - target.currentHp));
      target.currentHp += restored;
      return `${actor.name} used Mend on ${target.name}, restoring ${restored} HP.`;
    }

    if (skill.id === 'arcane-blast') {
      const damage = Math.max(1, 10 + (actor.int - target.wil) * 5);
      target.currentHp = Math.max(0, target.currentHp - damage);
      return `${actor.name} used Arcane Blast on ${target.name} for ${damage} damage.`;
    }

    if (skill.id === 'volley') {
      const damage = Math.max(1, Math.round(actor.str * 2));
      const targets = this.enemies.filter((enemy) => enemy.currentHp > 0);
      targets.forEach((enemy) => {
        enemy.currentHp = Math.max(0, enemy.currentHp - damage);
      });
      return `${actor.name} used Volley, dealing ${damage} damage to ${targets.length} enemies.`;
    }

    throw new Error('This skill has no battle effect.');
  }

  addPlayerCharacter(character) {
    if (this.playerCharacters.length >= 4) {
      throw new RangeError('A battle can have up to 4 player characters.');
    }

    this.playerCharacters.push(character);
  }

  addEnemy(enemy) {
    if (!(enemy instanceof Enemy)) {
      throw new TypeError('Battle enemies must be Enemy instances.');
    }

    if (this.enemies.length >= 4) {
      throw new RangeError('A battle can have up to 4 enemies.');
    }

    this.enemies.push(enemy);
  }
}

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

export function addCharacterToLeaderboard(character) {
  leaderboardData.push({
    hero: character.name,
    heroClass: character.heroClass,
    score: character.xp ?? 0,
  });
}

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

export function drawBattleScene(context, battle, scene = {}) {
  const { width, height } = context.canvas;
  const playerOffset = scene.playerOffset ?? 0;

  if (!sand.complete) {
    redrawWhenImageSettles(sand, context, battle, scene);
    return;
  }

  if (!sandSmall.complete) {
    redrawWhenImageSettles(sandSmall, context, battle, scene);
  }

   if (!rock.complete) {
    redrawWhenImageSettles(rock, context, battle, scene);
  }

  // Reset the canvas
  context.clearRect(0, 0, width, height);

  // Fill in skybox
  context.fillStyle = '#97b2e0';
  context.fillRect(0, 0, width, height);

  //Scene floor
  render(context, battle);
  drawActorStats(context, battle.currentTurn);

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

function redrawWhenImageSettles(image, context, battle, scene) {
  const redraw = () => {
    image.removeEventListener('load', redraw);
    image.removeEventListener('error', redraw);
    drawBattleScene(context, battle, scene);
  };

  image.addEventListener('load', redraw);
  image.addEventListener('error', redraw);
}
 
// ---------------------------------------


const sand = new Image();
const sandSmall = new Image();
const rock = new Image();
rock.src = '/rock.png';
sandSmall.src = '/lorebound_sand_super_small.jpg';
sand.src = '/lorebound_sand.jpg';
const angle = -2 * Math.PI / 180;
const cosA = Math.cos(angle);
const sinA = Math.sin(angle);
const rows = 15;
const cols = 35;
const size = 45;
const focalLength = 250;

function render(context, battle) {
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  const vpX = context.canvas.width * 0.3;
  const vpY = context.canvas.height * 0.5;

  if (sand.naturalWidth === 0) {
    return;
  }

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p0 = projectPoint(c, r, 0, 0, vpX, vpY);
      const p1 = projectPoint(c, r, 1, 0, vpX, vpY);
      const p2 = projectPoint(c, r, 1, 1, vpX, vpY);
      const p3 = projectPoint(c, r, 0, 1, vpX, vpY);

      const useSmallTexture = (r > 10 || c > 25) && sandSmall.naturalWidth > 0;
      const img = useSmallTexture ? sandSmall : sand;
      const w = img.width;
      const h = img.height;

      drawTexturedTriangle(context, img,
        p0.x, p0.y, p1.x, p1.y, p3.x, p3.y,
        0, 0, w, 0, 0, h
      );

      drawTexturedTriangle(context, img,
        p1.x, p1.y, p2.x, p2.y, p3.x, p3.y,
        w, 0, w, h, 0, h
      );
    }
  }
 
  // Draw some extra rocks
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const p0 = projectPoint(c, r, 0, 0, vpX, vpY);
      const p1 = projectPoint(c, r, 1, 0, vpX, vpY);
      const p2 = projectPoint(c, r, 1, 1, vpX, vpY);
      const p3 = projectPoint(c, r, 0, 1, vpX, vpY);

      if ((r > 10 || c > 25) && rock.naturalWidth > 0) {
        if (Math.random() < 0.05) {
          const centerX = (p0.x + p1.x + p2.x + p3.x) / 4;
          const centerY = (p0.y + p1.y + p2.y + p3.y) / 4;
          const tileWidth = Math.hypot(p1.x - p0.x, p1.y - p0.y);
          const rockWidth = tileWidth * 0.8;
          const rockHeight = rockWidth * (rock.naturalHeight / rock.naturalWidth);

          context.drawImage(
            rock,
            centerX - rockWidth / 2,
            centerY - rockHeight / 2,
            rockWidth,
            rockHeight
          );
        }
      }
    }
  }

  drawBattleFormation(context, battle.enemies, '#2e9e48', 'right', 60);
  drawBattleFormation(context, battle.playerCharacters, '#315fca', 'left', 40);
  drawStats(context, battle.enemies, 'right');
  drawStats(context, battle.playerCharacters, 'left');
}

function drawBattleFormation(context, characters, color, side, anchorY) {
  const rectangleWidth = 40;
  const rectangleHeight = 80;
  const gap = 13;
  const margin = 20;
  const columnCount = Math.min(characters.length, 2);

  context.fillStyle = color;
  characters.forEach((_, index) => {
    const x = context.canvas.width * (side === 'left' ? 0.1 : 0.55)
    + index * (rectangleWidth + margin);
    const y = context.canvas.height * (side === 'left' ? 0.75 : .6) + (index * gap);

    context.fillRect(x, y, rectangleWidth, rectangleHeight);
  });
}

function drawStats(context, characters, side) {
  const { width, height } = context.canvas;
  const panelWidth = width * 0.24;
  const panelHeight = height * 0.1;
  const marginX = width * 0.02;
  const marginY = height * 0.02;
  const gap = height * 0.012;
  const textPadding = panelWidth * 0.06;
  const fontSize = Math.max(10, height * 0.026);
  const x = side === 'left' ? marginX : width - panelWidth - marginX;
  const backgroundColor = side === 'left' ? '#172c54' : '#173e24';
  const borderColor = side === 'left' ? '#79a7ff' : '#75d48c';

  context.save();
  context.font = `${fontSize}px sans-serif`;
  context.textAlign = 'left';
  context.textBaseline = 'middle';

  characters.forEach((character, index) => {
    const y = marginY + index * (panelHeight + gap);

    context.fillStyle = backgroundColor;
    context.fillRect(x, y, panelWidth, panelHeight);
    context.strokeStyle = borderColor;
    context.strokeRect(x, y, panelWidth, panelHeight);

    context.fillStyle = '#ffffff';
    context.fillText(character.name, x + textPadding, y + panelHeight * 0.32, panelWidth - textPadding * 2);
    context.fillText(
      `HP: ${character.currentHp}/${character.hp}  MP: ${character.currentMp}/${character.mp}`,
      x + textPadding,
      y + panelHeight * 0.72,
      panelWidth - textPadding * 2
    );
  });

  context.restore();
}

function drawActorStats(context, actor) {
  if (!actor) {
    return;
  }

  const { width, height } = context.canvas;
  const panelWidth = Math.min(width * 0.34, 280);
  const panelHeight = Math.min(height * 0.31, 168);
  const padding = 12;
  const x = width - panelWidth - 16;
  const y = height - panelHeight - 16;
  const fontSize = Math.max(12, height * 0.026);
  const stats = [
    ['STR', actor.str],
    ['CON', actor.con],
    ['DEX', actor.dex],
    ['INT', actor.int],
    ['WIL', actor.wil],
    ['SPD', actor.spd],
    ['HP', `${actor.currentHp}/${actor.hp}`],
    ['MP', `${actor.currentMp}/${actor.mp}`],
  ];

  context.save();
  context.fillStyle = 'rgba(23, 35, 52, 0.94)';
  context.fillRect(x, y, panelWidth, panelHeight);
  context.strokeStyle = '#ffffff';
  context.strokeRect(x, y, panelWidth, panelHeight);
  context.fillStyle = '#ffffff';
  context.textAlign = 'left';
  context.textBaseline = 'middle';
  context.font = `bold ${fontSize}px sans-serif`;
  context.fillText(actor.name, x + padding, y + padding + fontSize / 2, panelWidth - padding * 2);

  context.font = `${fontSize}px sans-serif`;
  stats.forEach(([label, value], index) => {
    const column = Math.floor(index / 4);
    const row = index % 4;
    const columnWidth = (panelWidth - padding * 2) / 2;
    const statX = x + padding + column * columnWidth;
    const statY = y + padding + fontSize * 1.6 + row * fontSize * 1.35;
    context.fillText(`${label}: ${value}`, statX, statY, columnWidth - 4);
  });
  context.restore();
}

function drawTexturedTriangle(context, img, x0, y0, x1, y1, x2, y2, u0, v0, u1, v1, u2, v2) {
  context.save();

  // 1. Calculate the center point of the triangle
  const cx = (x0 + x1 + x2) / 3;
  const cy = (y0 + y1 + y2) / 3;

  // 2. Slightly push the 2D corners outward from the center (by ~0.5 pixels)
  // This inflates the texture just enough to cover the subpixel rendering gaps
  const padding = 1;

  let len0 = Math.hypot(x0 - cx, y0 - cy);
  let len1 = Math.hypot(x1 - cx, y1 - cy);
  let len2 = Math.hypot(x2 - cx, y2 - cy);

  if (len0 > 0) { x0 += ((x0 - cx) / len0) * padding; y0 += ((y0 - cy) / len0) * padding; }
  if (len1 > 0) { x1 += ((x1 - cx) / len1) * padding; y1 += ((y1 - cy) / len1) * padding; }
  if (len2 > 0) { x2 += ((x2 - cx) / len2) * padding; y2 += ((y2 - cy) / len2) * padding; }

  // 3. Create a clipping region for the inflated half-square triangle
  context.beginPath();
  context.moveTo(x0, y0);
  context.lineTo(x1, y1);
  context.lineTo(x2, y2);
  context.closePath();
  context.clip();

  // 4. Calculate the linear matrix coefficients to stretch/skew the image texture
  const delta = u0 * v1 + v0 * u2 + u1 * v2 - v1 * u2 - v0 * u1 - u0 * v2;
  if (Math.abs(delta) < 0.001) { context.restore(); return; }

  const a = (x0 * v1 + v0 * x2 + x1 * v2 - v1 * x2 - v0 * x1 - x0 * v2) / delta;
  const b = (y0 * v1 + v0 * y2 + y1 * v2 - v1 * y2 - v0 * y1 - y0 * v2) / delta;
  const c = (u0 * x1 + x0 * u2 + u1 * x2 - x1 * u2 - x0 * u1 - u0 * x2) / delta;
  const d = (u0 * y1 + y0 * u2 + u1 * y2 - y1 * u2 - y0 * u1 - u0 * y2) / delta;
  const e = (x0 * u1 * v2 + v0 * u2 * x1 + u0 * v1 * x2 - v0 * u1 * x2 - u0 * v2 * x1 - x0 * u2 * v1) / delta;
  const f = (y0 * u1 * v2 + v0 * u2 * y1 + u0 * v1 * y2 - v0 * u1 * y2 - u0 * v2 * y1 - y0 * u2 * v1) / delta;

  // Apply transformation matrix to the canvas context
  context.transform(a, b, c, d, e, f);

  // Render image
  context.drawImage(img, 0, 0);
  context.restore();
}

function projectPoint(c, r, offsetC, offsetR, vpX, vpY) {
  const X = (c + offsetC - cols / 2) * size;
  const Y = 120;
  const Z = (r + offsetR) * size + 80;

  // Perspective projection
  const screenX = (X * focalLength) / Z;
  const screenY = (Y * focalLength) / Z;

  // Apply the -2 degree tilt around the Vanishing Point
  const tiltedX = screenX * cosA - screenY * sinA;
  const tiltedY = screenX * sinA + screenY * cosA;

  return { x: tiltedX + vpX, y: tiltedY + vpY };
}
