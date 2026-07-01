import React from 'react';
import {
  Input, Button, Space, Tooltip, ColorPicker,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  CloseOutlined,
  ThunderboltOutlined,
} from '@ant-design/icons';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  setCreateName,
  setCreateColor,
  setEditName,
  setEditColor,
  clearSelected,
  createCar,
  updateCar,
  createRandomCars,
  fetchCars,
} from '../../store/slices/garageSlice';
import './ControlPanel.css';

const MAX_NAME_LENGTH = 40;

const ControlPanel: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    createName, createColor,
    editName, editColor,
    selectedCar, page,
  } = useAppSelector((s) => s.garage);
  const isRacing = useAppSelector((s) => s.race.isRacing);

  const handleCreate = async () => {
    const name = createName.trim();
    if (!name) return;
    await dispatch(createCar({ name, color: createColor }));
    dispatch(fetchCars(page));
  };

  const handleUpdate = async () => {
    if (!selectedCar) return;
    const name = editName.trim();
    if (!name) return;
    await dispatch(updateCar({ id: selectedCar.id, name, color: editColor }));
    dispatch(fetchCars(page));
  };

  const handleRandom = async () => {
    await dispatch(createRandomCars());
    dispatch(fetchCars(page));
  };

  return (
    <div className="control-panel">
      {/* Create row */}
      <Space.Compact className="control-panel__row">
        <Input
          placeholder="New car name"
          value={createName}
          onChange={(e) => dispatch(setCreateName(e.target.value))}
          disabled={isRacing}
          maxLength={MAX_NAME_LENGTH}
          onPressEnter={handleCreate}
          style={{ flex: 1 }}
        />
        <Tooltip title="Pick color">
          <ColorPicker
            value={createColor}
            onChange={(c) => dispatch(setCreateColor(c.toHexString()))}
            disabled={isRacing}
            size="middle"
          />
        </Tooltip>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleCreate}
          disabled={!createName.trim() || isRacing}
        >
          Create
        </Button>
      </Space.Compact>

      {/* Edit row */}
      <Space.Compact className="control-panel__row">
        <Input
          placeholder={selectedCar ? `Editing: ${selectedCar.name}` : 'Select a car to edit'}
          value={editName}
          onChange={(e) => dispatch(setEditName(e.target.value))}
          disabled={!selectedCar || isRacing}
          maxLength={MAX_NAME_LENGTH}
          onPressEnter={handleUpdate}
          style={{ flex: 1 }}
        />
        <Tooltip title="Pick color">
          <ColorPicker
            value={editColor}
            onChange={(c) => dispatch(setEditColor(c.toHexString()))}
            disabled={!selectedCar || isRacing}
            size="middle"
          />
        </Tooltip>
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={handleUpdate}
          disabled={!selectedCar || !editName.trim() || isRacing}
          style={{ background: '#595959', borderColor: '#595959' }}
        >
          Update
        </Button>
        {selectedCar && (
          <Button
            icon={<CloseOutlined />}
            onClick={() => dispatch(clearSelected())}
            title="Cancel edit"
          />
        )}
      </Space.Compact>

      {/* Random cars */}
      <Button
        icon={<ThunderboltOutlined />}
        onClick={handleRandom}
        disabled={isRacing}
        style={{ alignSelf: 'flex-start' }}
      >
        🎲 Generate 100 Random Cars
      </Button>
    </div>
  );
};

export default ControlPanel;
