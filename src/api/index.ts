import type {
  Car,
  Winner,
  EngineResponse,
  DriveResponse,
  SortField,
  SortOrder,
} from '../types';

const BASE_URL = 'https://async-race-server-okt8.onrender.com';
const GARAGE_LIMIT = 7;
const WINNERS_LIMIT = 10;
const FETCH_TIMEOUT = 60000; // 60 sec — Render free tier cold start can take 30-60s

// Fetch with timeout to avoid hanging forever
const fetchWithTimeout = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    return res;
  } finally {
    clearTimeout(timer);
  }
};

export interface CarsResponse {
  cars: Car[];
  total: number;
}

export interface WinnersResponse {
  winners: Winner[];
  total: number;
}

export const getCars = async (page: number): Promise<CarsResponse> => {
  const res = await fetchWithTimeout(
    `${BASE_URL}/garage?_page=${page}&_limit=${GARAGE_LIMIT}`
  );
  const total = Number(res.headers.get('X-Total-Count') ?? 0);
  const cars: Car[] = await res.json();
  return { cars, total };
};

export const getCar = async (id: number): Promise<Car> => {
  const res = await fetchWithTimeout(`${BASE_URL}/garage/${id}`);
  return res.json();
};

export const createCar = async (name: string, color: string): Promise<Car> => {
  const res = await fetchWithTimeout(`${BASE_URL}/garage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
  return res.json();
};

export const updateCar = async (
  id: number,
  name: string,
  color: string
): Promise<Car> => {
  const res = await fetchWithTimeout(`${BASE_URL}/garage/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });
  return res.json();
};

export const deleteCar = async (id: number): Promise<void> => {
  await fetchWithTimeout(`${BASE_URL}/garage/${id}`, { method: 'DELETE' });
};

export const startEngine = async (id: number): Promise<EngineResponse> => {
  const res = await fetchWithTimeout(
    `${BASE_URL}/engine?id=${id}&status=started`,
    { method: 'PATCH' }
  );
  return res.json();
};

export const stopEngine = async (id: number): Promise<EngineResponse> => {
  const res = await fetchWithTimeout(
    `${BASE_URL}/engine?id=${id}&status=stopped`,
    { method: 'PATCH' }
  );
  return res.json();
};

export const driveMode = async (id: number): Promise<DriveResponse> => {
  const res = await fetchWithTimeout(
    `${BASE_URL}/engine?id=${id}&status=drive`,
    { method: 'PATCH' }
  );
  if (res.status === 500) return { success: false };
  if (!res.ok) throw new Error(`Drive error: ${res.status}`);
  return res.json();
};

export const getWinners = async (
  page: number,
  sort: SortField,
  order: SortOrder
): Promise<WinnersResponse> => {
  const res = await fetchWithTimeout(
    `${BASE_URL}/winners?_page=${page}&_limit=${WINNERS_LIMIT}&_sort=${sort}&_order=${order}`
  );
  const total = Number(res.headers.get('X-Total-Count') ?? 0);
  const winners: Winner[] = await res.json();
  return { winners, total };
};

export const getWinner = async (id: number): Promise<Winner | null> => {
  const res = await fetchWithTimeout(`${BASE_URL}/winners/${id}`);
  if (res.status === 404) return null;
  return res.json();
};

export const createWinner = async (winner: Winner): Promise<Winner> => {
  const res = await fetchWithTimeout(`${BASE_URL}/winners`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(winner),
  });
  return res.json();
};

export const updateWinner = async (
  id: number,
  wins: number,
  time: number
): Promise<Winner> => {
  const res = await fetchWithTimeout(`${BASE_URL}/winners/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ wins, time }),
  });
  return res.json();
};

export const deleteWinner = async (id: number): Promise<void> => {
  await fetchWithTimeout(`${BASE_URL}/winners/${id}`, { method: 'DELETE' });
};

export const saveWinner = async (id: number, time: number): Promise<void> => {
  const existing = await getWinner(id);
  if (!existing) {
    await createWinner({ id, wins: 1, time });
  } else {
    await updateWinner(id, existing.wins + 1, Math.min(existing.time, time));
  }
};
