import React from 'react';
import { Button, Space } from 'antd';
import { CarOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { useRace } from '../../hooks/useRace';
import { fetchCars } from '../../store/slices/garageSlice';
import { initCars } from '../../store/slices/raceSlice';
import './RacePanel.css';

const RacePanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const { cars, page } = useAppSelector((s) => s.garage);
  const { isRacing, isResetting } = useAppSelector((s) => s.race);
  const { startRace, resetRace } = useRace();

  const handleStart = async () => {
    dispatch(initCars(cars.map((c) => c.id)));
    await startRace(cars);
  };

  const handleReset = async () => {
    await resetRace(cars);
    dispatch(fetchCars(page));
  };

  return (
    <Space className="race-panel" size="small">
      <Button
        type="primary"
        size="large"
        icon={<CarOutlined />}
        onClick={handleStart}
        disabled={isRacing || isResetting || cars.length === 0}
        style={{
          background: 'linear-gradient(135deg,#00c853,#1b5e20)',
          borderColor: '#00c853',
          fontWeight: 700,
        }}
      >
        ▶ Start Race
      </Button>
      <Button
        size="large"
        icon={<ReloadOutlined />}
        onClick={handleReset}
        disabled={isResetting}
        style={{
          background: 'linear-gradient(135deg,#f57c00,#bf360c)',
          borderColor: '#f57c00',
          color: '#fff',
          fontWeight: 700,
        }}
      >
        ↺ Reset
      </Button>
    </Space>
  );
};

export default RacePanel;
