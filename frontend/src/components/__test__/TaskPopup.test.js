import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import TaskPopup from '../TaskPopup';
import { AuthContextProvider } from '../../context/AuthContext';
import TasksContextProvider from '../../context/TasksContext';
import { BrowserRouter } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

const MockTaskPopup = ({ task, state }) => {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <TasksContextProvider>
                    <TaskPopup task={task} state={state} />
                </TasksContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    );
};



jest.mock('../TaskDesc', () => {
  return () => <div data-testid="task-desc-mock" />;
});

jest.mock('../../hooks/useAuthContext', () => {
  return {
    useAuthContext: () => ({
      user: {
        token: 'mockToken',
      },
    }),
  };
});

describe('<TaskPopup />', () => {
  test('renders the TaskPopup component', () => {
    render(<MockTaskPopup task={{ _id: '1' }} state={() => {}} />);
    const taskPopup = screen.getByTestId('task-popup');
    expect(taskPopup).toBeInTheDocument();
  });

  test('calls the state function when clicking outside the task popup', () => {
    const stateMock = jest.fn();
    render(<MockTaskPopup task={{ _id: '1' }} state={stateMock} />);
    const taskPopupWrapper = screen.getByTestId('task-popup-wrapper');
    fireEvent.click(taskPopupWrapper);
    expect(stateMock).toHaveBeenCalledTimes(1);
  });
});
