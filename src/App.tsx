import React from 'react';
import {
  HashRouter, Routes, Route, NavLink,
} from 'react-router-dom';
import { ConfigProvider, theme } from 'antd';
import { CarOutlined, TrophyOutlined } from '@ant-design/icons';
import Garage from './components/Garage/Garage';
import Winners from './components/Winners/Winners';
import './App.css';

const App: React.FC = () => (
  <ConfigProvider
    theme={{
      algorithm: theme.darkAlgorithm,
      token: {
        colorPrimary: '#f5a623',
        borderRadius: 6,
        colorBgContainer: '#12122a',
        colorBgElevated: '#1a1a35',
        colorBorder: '#2a2a4a',
        colorText: '#e8e8f0',
        colorTextSecondary: '#8888aa',
      },
      components: {
        Button: {
          defaultShadow: 'none',
          primaryShadow: 'none',
          dangerShadow: 'none',
        },
      },
    }}
  >
    <HashRouter
      future={{ v7_startTransition: true, v7_relativeSplatPath: true }}
    >
      <div className="app">
        <header className="header">
          <div className="header__brand">
            <span className="header__logo">🏁</span>
            <span className="header__name">Async Race</span>
          </div>
          <nav className="header__nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) => `header__link${isActive ? ' header__link--active' : ''}`}
            >
              <CarOutlined />
              {' '}
              Garage
            </NavLink>
            <NavLink
              to="/winners"
              className={({ isActive }) => `header__link${isActive ? ' header__link--active' : ''}`}
            >
              <TrophyOutlined />
              {' '}
              Winners
            </NavLink>
          </nav>
        </header>
        <main className="main">
          <Routes>
            <Route path="/" element={<Garage />} />
            <Route path="/winners" element={<Winners />} />
          </Routes>
        </main>
      </div>
    </HashRouter>
  </ConfigProvider>
);

export default App;
