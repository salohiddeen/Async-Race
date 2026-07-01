import { useRef, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from './index';
import * as api from '../api';
import {
  setCarStatus,
  setCarProgress,
  setRacing,
  setResetting,
  setWinner,
  resetAll,
  initCars,
} from '../store/slices/raceSlice';
import type { Car } from '../types';

const runAnimation = (
  id: number,
  duration: number,
  onProgress: (id: number, progress: number) => void,
  frames: React.MutableRefObject<Record<number, number>>,
): Promise<void> => new Promise((resolve) => {
  const start = performance.now();
  const step = (now: number) => {
    const progress = Math.min((now - start) / duration, 1);
    onProgress(id, progress);
    if (progress < 1) {
      // eslint-disable-next-line no-param-reassign
      frames.current[id] = requestAnimationFrame(step);
    } else {
      resolve();
    }
  };
    // eslint-disable-next-line no-param-reassign
  frames.current[id] = requestAnimationFrame(step);
});

const cancelAnim = (
  id: number,
  frames: React.MutableRefObject<Record<number, number>>,
) => {
  if (frames.current[id]) {
    cancelAnimationFrame(frames.current[id]);
    // eslint-disable-next-line no-param-reassign
    delete frames.current[id];
  }
};

export const useRace = () => {
  const dispatch = useAppDispatch();
  const animFrames = useRef<Record<number, number>>({});
  const winnerSet = useRef(false);
  const { isRacing } = useAppSelector((s) => s.race);

  const onProgress = useCallback(
    (id: number, progress: number) => dispatch(setCarProgress({ id, progress })),
    [dispatch],
  );

  const startSingleCar = useCallback(
    async (car: Car): Promise<number | null> => {
      const { id } = car;
      dispatch(setCarStatus({ id, status: 'starting' }));
      try {
        const { velocity, distance } = await api.startEngine(id);
        const duration = distance / velocity;
        dispatch(setCarStatus({ id, status: 'driving' }));
        const startTime = performance.now();
        const [driveResult] = await Promise.allSettled([
          api.driveMode(id),
          runAnimation(id, duration, onProgress, animFrames),
        ]);
        if (driveResult.status === 'fulfilled' && driveResult.value.success) {
          dispatch(setCarProgress({ id, progress: 1 }));
          dispatch(setCarStatus({ id, status: 'finished' }));
          return performance.now() - startTime;
        }
        cancelAnim(id, animFrames);
        dispatch(setCarStatus({ id, status: 'broken' }));
        return null;
      } catch {
        cancelAnim(id, animFrames);
        dispatch(setCarStatus({ id, status: 'broken' }));
        return null;
      }
    },
    [dispatch, onProgress],
  );

  const stopSingleCar = useCallback(
    async (id: number) => {
      cancelAnim(id, animFrames);
      dispatch(setCarStatus({ id, status: 'stopping' }));
      await api.stopEngine(id);
      dispatch(setCarProgress({ id, progress: 0 }));
      dispatch(setCarStatus({ id, status: 'idle' }));
    },
    [dispatch],
  );

  const startRace = useCallback(
    async (cars: Car[]) => {
      winnerSet.current = false;
      dispatch(initCars(cars.map((c) => c.id)));
      dispatch(setRacing(true));
      await Promise.allSettled(
        cars.map(async (car) => {
          const elapsed = await startSingleCar(car);
          if (elapsed !== null && !winnerSet.current) {
            winnerSet.current = true;
            const time = parseFloat((elapsed / 1000).toFixed(2));
            dispatch(setWinner({ id: car.id, name: car.name, time }));
            await api.saveWinner(car.id, time);
          }
        }),
      );
      dispatch(setRacing(false));
    },
    [dispatch, startSingleCar],
  );

  const resetRace = useCallback(
    async (cars: Car[]) => {
      dispatch(setResetting(true));
      Object.keys(animFrames.current).forEach((k) => {
        cancelAnimationFrame(animFrames.current[Number(k)]);
      });
      animFrames.current = {};
      await Promise.allSettled(cars.map((car) => api.stopEngine(car.id)));
      dispatch(resetAll());
    },
    [dispatch],
  );

  return {
    startSingleCar, stopSingleCar, startRace, resetRace, isRacing,
  };
};
