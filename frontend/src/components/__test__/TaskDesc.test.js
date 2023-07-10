import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskDesc from '../TaskDesc';
import { AuthContextProvider } from '../../context/AuthContext';
import TasksContextProvider from '../../context/TasksContext';
import { BrowserRouter as Router } from 'react-router-dom';
import fetchMock from 'jest-fetch-mock';

const MockTaskDesc = ({ task }) => {
    return (
        <Router>
            <AuthContextProvider>
                <TasksContextProvider>
                    <TaskDesc task={task} />
                </TasksContextProvider>
            </AuthContextProvider>
        </Router>
    );
};



describe('<TaskDesc />', () => {
  const task = {
    // Provide sample task data for testing
    title: 'Sample Task',
    startTime: new Date(),
    endTime: new Date(),
    tags: ['tag1', 'tag2'],
    priority: 50,
    completed: false,
    recurr_id: 'recurring-task-id',
    color: '#ffffff',
  };

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test('renders task details correctly', () => {
    render(<MockTaskDesc task={task} />);

    // Assert that task details are displayed correctly
    expect(screen.getByText(task.title)).toBeInTheDocument();
    expect(screen.getByText(/from/i)).toBeInTheDocument();
    expect(screen.getByText(/to/i)).toBeInTheDocument();
    expect(screen.getByText(/Tags:/i)).toBeInTheDocument();
    expect(screen.getByText(/Priority Score:/i)).toBeInTheDocument();
    expect(screen.getByText(/delete/i)).toBeInTheDocument();
    expect(screen.getByText(/Mark as complete/i)).toBeInTheDocument();
    expect(screen.getByText(/edit/i)).toBeInTheDocument();
  });
});




