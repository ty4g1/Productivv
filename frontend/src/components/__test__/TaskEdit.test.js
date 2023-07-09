import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import TaskEdit from '../TaskEdit';
import { AuthContextProvider } from '../../context/AuthContext';
import TasksContextProvider from '../../context/TasksContext';
import { BrowserRouter as Router } from 'react-router-dom';

const MockTaskEdit = ({ task, state }) => {
    return (
        <Router>
            <AuthContextProvider>
                <TasksContextProvider>
                    <TaskEdit task={task} state={state} />
                </TasksContextProvider>
            </AuthContextProvider>
        </Router>
    );
};

describe('<TaskEdit />', () => {
  const mockTask = {
    _id: '123',
    title: 'Sample Task',
    startTime: '2023-07-09T09:00',
    endTime: '2023-07-09T10:00',
    tags: ['Work'],
    priority: 50,
    color: '#FFFFFF'
  };

  test('renders the task edit form', () => {
    render(<MockTaskEdit task={mockTask} state={{ setEdit: jest.fn() }} />);
    
    // Verify that the form elements are rendered
    expect(screen.getByTestId('title')).toBeInTheDocument();
    expect(screen.getByTestId('start-time')).toBeInTheDocument();
    expect(screen.getByTestId('end-time')).toBeInTheDocument();
    expect(screen.getByTestId('tags')).toBeInTheDocument();
    expect(screen.getByTestId('priority')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'done' })).toBeInTheDocument();
  });

  test('renders the task edit form with correct values', () => {
    render(<MockTaskEdit task={mockTask} state={{ setEdit: jest.fn() }} />);
    
    // Verify that the form elements are rendered with the correct values
    expect(screen.getByTestId('title')).toHaveValue(mockTask.title);
    expect(screen.getByTestId('start-time')).toHaveValue(mockTask.startTime);
    expect(screen.getByTestId('end-time')).toHaveValue(mockTask.endTime);
    expect(screen.getByTestId('priority')).toHaveValue(mockTask.priority);
  });

  test('updates values when form is edited', () => {
    render(<MockTaskEdit task={mockTask} state={{ setEdit: jest.fn() }} />);

    fireEvent.change(screen.getByTestId('title'), {
        target: { value: 'New Title' },
    });
    fireEvent.change(screen.getByTestId('start-time'), {
        target: { value: '2023-07-09T10:00' },
    });
    fireEvent.change(screen.getByTestId('end-time'), {
        target: { value: '2023-07-09T11:00' },
    });
    fireEvent.change(screen.getByTestId('priority'), {
        target: { value: 100 },
    });

    // Verify that the form elements are rendered with the correct values
    expect(screen.getByTestId('title')).toHaveValue('New Title');
    expect(screen.getByTestId('start-time')).toHaveValue('2023-07-09T10:00');
    expect(screen.getByTestId('end-time')).toHaveValue('2023-07-09T11:00');
    expect(screen.getByTestId('priority')).toHaveValue(100);
    }
    );
});
