const BRANDS = [
  'Tesla', 'Ford', 'BMW', 'Audi', 'Mercedes',
  'Toyota', 'Honda', 'Ferrari', 'Lamborghini', 'Porsche',
  'Chevrolet', 'Dodge', 'Bugatti', 'McLaren', 'Volvo',
];

const MODELS = [
  'Model S', 'Mustang', 'M3', 'R8', 'AMG GT',
  'Supra', 'Civic', 'F40', 'Huracan', '911',
  'Camaro', 'Charger', 'Chiron', '720S', 'XC90',
];

export const randomCarName = (): string => {
  const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];
  const model = MODELS[Math.floor(Math.random() * MODELS.length)];
  return `${brand} ${model}`;
};

export const randomColor = (): string => {
  const hex = Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, '0');
  return `#${hex}`;
};

export const formatTime = (ms: number): string => (ms / 1000).toFixed(2);
