import React, { useEffect } from 'react';
import {
  Typography, Empty, Spin, Pagination, Alert, Button,
} from 'antd';
import { CarOutlined, ReloadOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchCars, setPage } from '../../store/slices/garageSlice';
import { initCars } from '../../store/slices/raceSlice';
import ControlPanel from './ControlPanel';
import RacePanel from './RacePanel';
import CarRow from '../Race/CarRow';
import WinnerBanner from '../UI/WinnerBanner';
import './Garage.css';

const CARS_PER_PAGE = 7;

const Garage: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    cars, total, page, loading, error,
  } = useAppSelector((s) => s.garage);

  useEffect(() => {
    dispatch(fetchCars(page));
  }, [dispatch, page]);

  const carIds = cars.map((c) => c.id).join(',');
  useEffect(() => {
    if (cars.length > 0) {
      dispatch(initCars(cars.map((c) => c.id)));
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, carIds]);

  return (
    <div className="garage">
      <Typography.Title level={2} style={{ color: 'var(--text)', marginBottom: 16 }}>
        <CarOutlined style={{ color: '#f5a623', marginRight: 10 }} />
        Garage
        <Typography.Text style={{ fontSize: 16, color: 'var(--text-secondary)', marginLeft: 10 }}>
          (
          {total}
          {' '}
          cars)
        </Typography.Text>
      </Typography.Title>

      <ControlPanel />
      <RacePanel />

      {error && (
        <Alert
          type="warning"
          showIcon
          message="Couldn't reach the server"
          description={error}
          style={{ marginBottom: 16 }}
          action={(
            <Button
              size="small"
              icon={<ReloadOutlined />}
              onClick={() => dispatch(fetchCars(page))}
            >
              Retry
            </Button>
          )}
        />
      )}

      <Spin spinning={loading} tip="Loading cars — server may be waking up (can take up to a minute)...">
        {!loading && !error && cars.length === 0 ? (
          <Empty
            description={<span style={{ color: 'var(--text-secondary)' }}>No Cars — create some!</span>}
            image={<CarOutlined style={{ fontSize: 48, color: '#444' }} />}
            style={{ padding: '60px 0' }}
          />
        ) : (
          <div className="garage__list">
            {cars.map((car) => <CarRow key={car.id} car={car} />)}
          </div>
        )}
      </Spin>

      <div className="garage__pagination">
        <Pagination
          current={page}
          total={total}
          pageSize={CARS_PER_PAGE}
          onChange={(p) => dispatch(setPage(p))}
          showSizeChanger={false}
          showTotal={(t) => `Total ${t} cars`}
        />
      </div>

      <WinnerBanner />
    </div>
  );
};

export default Garage;
