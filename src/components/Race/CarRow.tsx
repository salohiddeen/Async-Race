import React from 'react';
import { Button, Tag, Tooltip } from 'antd';
import {
  EditOutlined,
  DeleteOutlined,
  ThunderboltOutlined,
  StopOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useRace } from '../../hooks/useRace';
import {
  selectCar,
  deleteCar,
  setPage,
  fetchCars,
} from '../../store/slices/garageSlice';
import { removeCar } from '../../store/slices/raceSlice';
import CarIcon from '../UI/CarIcon';
import type { Car } from '../../types';
import type { CarStatus } from '../../store/slices/raceSlice';
import './CarRow.css';

const STATUS_TAG: Partial<Record<CarStatus, { label: string; color: string }>> = {
  starting: { label: 'Starting...', color: 'processing' },
  driving: { label: 'Driving', color: 'processing' },
  stopping: { label: 'Stopping...', color: 'warning' },
  finished: { label: 'Finished!', color: 'success' },
  broken: { label: 'Broken', color: 'error' },
};

interface CarRowProps {
  car: Car;
}

const CarTrack: React.FC<{
  car: Car;
  progress: number;
  status: CarStatus;
}> = ({ car, progress, status }) => (
  <div className="car-row__road">
    <div className="car-row__line" />
    <div
      className={`car-row__car${status === 'broken' ? ' car-row__car--broken' : ''}`}
      style={{ left: `calc((100% - 36px) * ${progress})` }}
    >
      <CarIcon color={car.color} size={50} />
      {status === 'broken' && <span className="car-row__boom">💥</span>}
    </div>
    <div className="car-row__finish">🏁</div>
  </div>
);

const CarRow: React.FC<CarRowProps> = ({ car }) => {
  const dispatch = useAppDispatch();
  const { startSingleCar, stopSingleCar } = useRace();
  const carRace = useAppSelector((s) => s.race.cars[car.id]);
  const { page, cars } = useAppSelector((s) => s.garage);
  const isRacing = useAppSelector((s) => s.race.isRacing);

  const status: CarStatus = carRace?.status ?? 'idle';
  const progress = carRace?.progress ?? 0;
  const isDriving = status === 'driving' || status === 'starting';
  const isIdle = status === 'idle' || status === 'stopped' || status === 'stopping';

  const handleDelete = async () => {
    dispatch(removeCar(car.id));
    await dispatch(deleteCar({ id: car.id, page }));
    const newPage = cars.length === 1 && page > 1 ? page - 1 : page;
    if (newPage !== page) dispatch(setPage(newPage));
    dispatch(fetchCars(newPage));
  };

  const tag = STATUS_TAG[status];

  return (
    <div className="car-row">
      <div className="car-row__actions">
        <Tooltip title="Edit car">
          <Button
            size="small"
            icon={<EditOutlined />}
            onClick={() => dispatch(selectCar(car))}
            disabled={isRacing}
          />
        </Tooltip>
        <Tooltip title="Delete car">
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            onClick={handleDelete}
            disabled={isRacing}
          />
        </Tooltip>
      </div>
      <div className="car-row__engine">
        <Tooltip title="Start engine (A)">
          <Button
            size="small"
            type="primary"
            icon={<ThunderboltOutlined />}
            onClick={() => startSingleCar(car)}
            disabled={isDriving || status === 'finished'}
            className="car-row__btn-a"
          >
            A
          </Button>
        </Tooltip>
        <Tooltip title="Stop engine (B)">
          <Button
            size="small"
            danger
            icon={<StopOutlined />}
            onClick={() => stopSingleCar(car.id)}
            disabled={isIdle}
          >
            B
          </Button>
        </Tooltip>
      </div>
      <div className="car-row__track">
        <div className="car-row__track-header">
          <span className="car-row__name">{car.name}</span>
          {tag && <Tag color={tag.color} style={{ marginLeft: 8, fontSize: 10 }}>{tag.label}</Tag>}
        </div>
        <CarTrack car={car} progress={progress} status={status} />
      </div>
    </div>
  );
};

export default CarRow;
