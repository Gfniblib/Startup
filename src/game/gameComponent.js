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

export function getRandomWeather() {
  const randomIndex = Math.floor(Math.random() * weatherEffects.length);
  return weatherEffects[randomIndex];
}