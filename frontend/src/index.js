import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import TaskContextProvider from './context/TasksContext';
import {AuthContextProvider} from './context/AuthContext';
import FilterContextProvider from './context/FilterContext';
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AuthContextProvider>
      <TaskContextProvider>
        <FilterContextProvider>
          <App />
        </FilterContextProvider>
      </TaskContextProvider>
    </AuthContextProvider>
  </React.StrictMode>
);


