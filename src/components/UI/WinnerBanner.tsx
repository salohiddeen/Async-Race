import React from 'react';
import { Modal, Button } from 'antd';
import { TrophyOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { hideWinner } from '../../store/slices/raceSlice';
import CarIcon from './CarIcon';

const WinnerBanner: React.FC = () => {
  const dispatch = useAppDispatch();
  const { winner, showWinner } = useAppSelector((s) => s.race);
  const cars = useAppSelector((s) => s.garage.cars);
  const winnerCar = cars.find((c) => c.id === winner?.id);

  return (
    <Modal
      open={showWinner}
      onCancel={() => dispatch(hideWinner())}
      footer={(
        <Button type="primary" onClick={() => dispatch(hideWinner())}>
          Close
        </Button>
      )}
      centered
      closable
      width={360}
      className="winner-modal"
    >
      <div style={{ textAlign: 'center', padding: '10px 0' }}>
        <TrophyOutlined style={{
          fontSize: 56, color: '#f5a623', display: 'block', marginBottom: 10,
        }}
        />
        <div style={{
          fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 4,
        }}
        >
          🏆 Race Winner!
        </div>
        {winnerCar && (
          <div style={{ margin: '10px 0' }}>
            <CarIcon color={winnerCar.color} size={80} />
          </div>
        )}
        <div style={{
          fontSize: 18, fontWeight: 700, color: '#e8e8f0', marginBottom: 4,
        }}
        >
          {winner?.name}
        </div>
        <div style={{ color: '#8888aa', fontSize: 14 }}>
          Time:
          {' '}
          <strong style={{ color: '#f5a623' }}>
            {winner?.time}
            s
          </strong>
        </div>
      </div>
    </Modal>
  );
};

export default WinnerBanner;
