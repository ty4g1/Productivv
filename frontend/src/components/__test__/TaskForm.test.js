import { render, screen, fireEvent } from '@testing-library/react';
import TaskForm from '../TaskForm';
import { AuthContextProvider } from '../../context/AuthContext';
import TasksContextProvider from '../../context/TasksContext';
import { BrowserRouter } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';


jest.mock('../../hooks/useAuthContext')

const MockTaskForm = () => {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <TasksContextProvider>
                    <TaskForm />
                </TasksContextProvider>
            </AuthContextProvider>
        </BrowserRouter>
    );
};


describe('<TaskForm />', () => {
  test('renders the form with all input fields', () => {
    useAuthContext.mockReturnValue({
        user: { id: 'mockID', email: 'mockEmail', token: 'mocktoken', verified: true, google: false },
        dispatch: jest.fn(),
    });
    render(<MockTaskForm />);
    
    expect(screen.getByTestId('title')).toBeInTheDocument();
    expect(screen.getByTestId('start-time')).toBeInTheDocument();
    expect(screen.getByTestId('end-time')).toBeInTheDocument();
    expect(screen.getByTestId('color')).toBeInTheDocument();
    expect(screen.getByTestId('tags')).toBeInTheDocument();
    expect(screen.getByTestId('priority')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Add Task' })).toBeInTheDocument();
  });

  test('displays error message if title is empty', () => {
    useAuthContext.mockReturnValue({
        user: { id: 'mockID', email: 'mockEmail', token: 'mocktoken', verified: true, google: false },
        dispatch: jest.fn(),
    });

    render(<MockTaskForm />);
    
    fireEvent.change(screen.getByTestId('title'), { target: { value: '' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Add Task' }));

    expect(screen.getByText('Title cannot be empty')).toBeInTheDocument();
  });

  test('check if form inputs work', async () => {
    useAuthContext.mockReturnValue({
        user: { id: 'mockID', email: 'mockEmail', token: 'mocktoken', verified: true, google: false },
        dispatch: jest.fn(),
    });

    render(<MockTaskForm />);
    
    fireEvent.change(screen.getByTestId('title'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByTestId('start-time'), { target: { value: '2023-07-09T12:00' } });
    fireEvent.change(screen.getByTestId('end-time'), { target: { value: '2023-07-09T13:00' } });

    //check if fields are filled
    expect(screen.getByTestId('title').value).toBe('New Task');
    expect(screen.getByTestId('start-time').value).toBe('2023-07-09T12:00');
    expect(screen.getByTestId('end-time').value).toBe('2023-07-09T13:00');
  });

  test('displays error message if start time is after end time', () => {
    useAuthContext.mockReturnValue({
        user: { id: 'mockID', email: 'mockEmail', token: 'mocktoken', verified: true, google: false },
        dispatch: jest.fn(),
    });

    render(<MockTaskForm />);

    fireEvent.change(screen.getByTestId('title'), { target: { value: 'New Task' } });
    fireEvent.change(screen.getByTestId('start-time'), { target: { value: '2023-07-09T12:00' } });
    fireEvent.change(screen.getByTestId('end-time'), { target: { value: '2022-07-09T13:00' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Add Task' }));

    expect(screen.getByText('Start time cannot be after end time')).toBeInTheDocument();

    }
    );

    test('displays error message if user is not logged in', () => {
        useAuthContext.mockReturnValue({
            user: null,
            dispatch: jest.fn(),
        });

        render(<MockTaskForm />);

        fireEvent.change(screen.getByTestId('title'), { target: { value: 'New Task' } });
        fireEvent.change(screen.getByTestId('start-time'), { target: { value: '2023-07-09T12:00' } });
        fireEvent.change(screen.getByTestId('end-time'), { target: { value: '2023-07-09T13:00' } });
        fireEvent.submit(screen.getByRole('button', { name: 'Add Task' }));

        expect(screen.getByText('You must be logged in')).toBeInTheDocument();
    });
});
