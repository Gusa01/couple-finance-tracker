export interface DefaultCategory {
  name: string;
  color: string;
  icon: string;
}

export const DEFAULT_CATEGORIES: DefaultCategory[] = [
  { name: 'Supermercado',  color: '#4CAF50', icon: '🛒' },
  { name: 'Restaurantes',  color: '#FF9800', icon: '🍽️' },
  { name: 'Servicios',     color: '#2196F3', icon: '💡' },
  { name: 'Transporte',    color: '#9C27B0', icon: '🚗' },
  { name: 'Salud',         color: '#F44336', icon: '❤️' },
  { name: 'Entretenimiento', color: '#FF5722', icon: '🎬' },
  { name: 'Otros',         color: '#607D8B', icon: '📦' },
];
