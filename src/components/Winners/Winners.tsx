import React, { useEffect } from 'react';
import { Table, Typography, Tag } from 'antd';
import type { ColumnsType, SorterResult, TablePaginationConfig } from 'antd/es/table/interface';
import { TrophyOutlined } from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { fetchWinners, setPage, setSort } from '../../store/slices/winnersSlice';
import CarIcon from '../UI/CarIcon';
import type { WinnerWithCar, SortField } from '../../types';
import './Winners.css';

const WINNERS_PER_PAGE = 10;

const getWinsColor = (wins: number): string => {
  if (wins >= 5) return 'gold';
  if (wins >= 2) return 'blue';
  return 'default';
};

const buildColumns = (
  sort: SortField,
  order: 'ASC' | 'DESC',
  page: number,
): ColumnsType<WinnerWithCar> => [
  {
    title: '#',
    key: 'index',
    width: 50,
    render: (_: unknown, __: WinnerWithCar, idx: number) => (page - 1) * WINNERS_PER_PAGE + idx + 1,
  },
  {
    title: 'Car',
    key: 'car',
    width: 80,
    render: (_: unknown, r: WinnerWithCar) => <CarIcon color={r.car.color} size={48} />,
  },
  {
    title: 'Name',
    key: 'name',
    render: (_: unknown, r: WinnerWithCar) => (
      <span style={{ fontWeight: 600 }}>{r.car.name}</span>
    ),
  },
  {
    title: 'Wins',
    dataIndex: 'wins',
    key: 'wins',
    sorter: true,
    sortOrder: sort === 'wins' ? (order === 'ASC' ? 'ascend' : 'descend') : undefined,
    render: (wins: number) => <Tag color={getWinsColor(wins)}>{wins}</Tag>,
  },
  {
    title: 'Best Time (s)',
    dataIndex: 'time',
    key: 'time',
    sorter: true,
    sortOrder: sort === 'time' ? (order === 'ASC' ? 'ascend' : 'descend') : undefined,
    render: (time: number) => `${time.toFixed(2)}s`,
  },
];

const Winners: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    winners, total, page, sort, order, loading,
  } = useAppSelector((s) => s.winners);

  useEffect(() => {
    dispatch(fetchWinners({ page, sort, order }));
  }, [dispatch, page, sort, order]);

  const handleTableChange = (
    pagination: TablePaginationConfig,
    _: unknown,
    sorter: SorterResult<WinnerWithCar> | SorterResult<WinnerWithCar>[],
  ) => {
    if (pagination.current) dispatch(setPage(pagination.current));
    const s = Array.isArray(sorter) ? sorter[0] : sorter;
    if (s.field && s.order) {
      dispatch(setSort({
        sort: s.field as SortField,
        order: s.order === 'ascend' ? 'ASC' : 'DESC',
      }));
    }
  };

  return (
    <div className="winners">
      <Typography.Title level={2} style={{ color: 'var(--text)', marginBottom: 20 }}>
        <TrophyOutlined style={{ color: '#f5a623', marginRight: 10 }} />
        Winners
        <Typography.Text style={{ fontSize: 16, color: 'var(--text-secondary)', marginLeft: 10 }}>
          (
          {total}
          )
        </Typography.Text>
      </Typography.Title>
      <Table<WinnerWithCar>
        columns={buildColumns(sort, order, page)}
        dataSource={winners}
        rowKey="id"
        loading={loading}
        onChange={handleTableChange}
        className="winners__table"
        pagination={{
          current: page,
          pageSize: WINNERS_PER_PAGE,
          total,
          showSizeChanger: false,
          showTotal: (t) => `Total ${t} winners`,
        }}
        locale={{ emptyText: '🏁 No winners yet — start a race!' }}
      />
    </div>
  );
};

export default Winners;
