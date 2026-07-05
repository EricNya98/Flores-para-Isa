export interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  color: string;
  type: 'sparkle' | 'star' | 'petal';
  rotation?: number;
  rotationSpeed?: number;
}

export interface FlowerInfo {
  id: string;
  name: string;
  scientificName: string;
  meaning: string;
  description: string;
  color: string; // Tailwind text/bg colors
  borderColor: string;
}

export interface LetterMessage {
  recipient: string;
  text: string;
  sender: string;
}
