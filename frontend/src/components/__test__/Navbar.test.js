import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../Navbar';
import { useAuthContext } from '../../hooks/useAuthContext';
import { AuthContextProvider } from '../../context/AuthContext';


// Mock useLogout and useAuthContext hooks
jest.mock('../../hooks/useLogout', () => ({
  useLogout: () => ({
    logout: jest.fn(),
  }),
}));

jest.mock('../../hooks/useAuthContext');



describe('<Navbar />', () => {
    
  it('renders the navbar with user links when user is verified', async () => {
    // Mock useAuthContext hook
    useAuthContext.mockReturnValue({
        user: { id: 'mockID', email: 'mockEmail', token: 'mocktoken', verified: true, google: false },
        dispatch: jest.fn(),
    });
    render(
      <Router>
        <AuthContextProvider>
            <Navbar />
        </AuthContextProvider>
      </Router>
    );

    // Assert that the user links are rendered
    expect(await screen.findByText('User Profile')).toBeInTheDocument();
    expect(await screen.findByText('Log out')).toBeInTheDocument();
  });
  

  it('renders the navbar with cancel button when user is not verified', async () => {
    // Mock useAuthContext hook
    useAuthContext.mockReturnValue({
        user: { id: 'mockID', email: 'mockEmail', token: 'mocktoken', verified: false, google: false },
        dispatch: jest.fn(),
    });
    
    render(
    <Router>
        <AuthContextProvider>
            <Navbar />
        </AuthContextProvider>
    </Router>
    );
  
    // Assert that the cancel button is rendered
    const cancelButton = await screen.findByText('Cancel');
    expect(cancelButton).toBeInTheDocument();
  });

  it('renders the navbar with login and signup links when user is not logged in', () => {
    // Mock useAuthContext hook
    useAuthContext.mockReturnValue({
        user: null,
        dispatch: jest.fn(),
    });

    render(
      <Router>
        <AuthContextProvider>
            <Navbar />
        </AuthContextProvider>
      </Router>
    );

    // Assert that the login and signup links are rendered
    expect(screen.getByText('Log in')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });
});
