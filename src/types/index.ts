export interface Car {
  id: number;
  name: string;
  color: string;
}

export interface Winner {
  id: number;
  wins: number;
  time: number;
}

export interface WinnerWithCar extends Winner {
  car: Car;
}

export interface EngineResponse {
  velocity: number;
  distance: number;
}

export interface DriveResponse {
  success: boolean;
}

export type SortField = 'wins' | 'time';
export type SortOrder = 'ASC' | 'DESC';

export interface CarRaceState {
  id: number;
  status: 'idle' | 'started' | 'driving' | 'stopped' | 'broken';
  position: number;
  animationId?: number;
}

export interface PaginationState {
  page: number;
  limit: number;
  total: number;
}
