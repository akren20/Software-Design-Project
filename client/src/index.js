import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import HomePage from './components/home';
import Navbar from './components/nav';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <HomePage/>
  </React.StrictMode>
);

