import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import MenuBar from '../MenuBar';

describe('<MenuBar />', () => {
    test('should render all menu links', () => {
      render(
        <Router>
          <MenuBar />
        </Router>
      );
  
      const homeLink = screen.getByText(/receipt_long/i);
      const calendarLink = screen.getByText(/calendar_month/i);
      const recurringTasksLink = screen.getByText(/create recurring tasks/i);
      const completedTasksLink = screen.getByText(/completed tasks/i);
      const pastDueTasksLink = screen.getByText(/past due tasks/i);
  
      expect(homeLink).toBeInTheDocument();
      expect(calendarLink).toBeInTheDocument();
      expect(recurringTasksLink).toBeInTheDocument();
      expect(completedTasksLink).toBeInTheDocument();
      expect(pastDueTasksLink).toBeInTheDocument();
    });
  
    test('should have correct URLs for each menu link', () => {
      render(
        <Router>
          <MenuBar />
        </Router>
      );
  
      const homeLink = screen.getByText(/receipt_long/i);
      const calendarLink = screen.getByText(/calendar_month/i);
      const recurringTasksLink = screen.getByText(/create recurring tasks/i);
      const completedTasksLink = screen.getByText(/completed tasks/i);
      const pastDueTasksLink = screen.getByText(/past due tasks/i);
  
      expect(homeLink.closest('a')).toHaveAttribute('href', '/');
      expect(calendarLink.closest('a')).toHaveAttribute('href', '/calendar');
      expect(recurringTasksLink.closest('a')).toHaveAttribute('href', '/form-recurring');
      expect(completedTasksLink.closest('a')).toHaveAttribute('href', '/completed');
      expect(pastDueTasksLink.closest('a')).toHaveAttribute('href', '/past-due');
    });
  });

