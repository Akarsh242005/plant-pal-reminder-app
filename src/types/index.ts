
export interface User {
  id: string;
  email: string;
  name?: string;
}

export interface Plant {
  id: string;
  name: string;
  species: string;
  lastWatered: string; // ISO date string
  waterFrequency: number; // days
  image?: string;
  notes?: string;
  location?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}
