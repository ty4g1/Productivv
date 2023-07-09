import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';
import { AuthContextProvider } from '../../context/AuthContext';
import TasksContextProvider from '../../context/TasksContext';
import FilterContextProvider from '../../context/FilterContext';
import { BrowserRouter as Router } from 'react-router-dom';

const MockSearchBar = () => {
    return (
        <Router>
            <AuthContextProvider>
              <TasksContextProvider>
                <FilterContextProvider>
                  <SearchBar />
                </FilterContextProvider>
              </TasksContextProvider>
            </AuthContextProvider>
          </Router>
    );
};

//mock react-select
jest.mock("react-select", () => ({ options, value, onChange }) => {
    function handleChange(event) {
      const option = options.find(
        (option) => option.value === event.currentTarget.value
      );
      onChange(option);
    }
  
    return (
      <select data-testid="sortby" value={value} onChange={handleChange}>
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    );
  });

//mock creatable react-select
jest.mock("react-select/creatable", () => ({ options, value, onChange }) => {
    function handleChange(event) {
        const option = options.find(
        (option) => option.value === event.currentTarget.value
        );
        onChange(option);
    }

    return (
        <select data-testid="filterby" value={value} onChange={handleChange}>
        {options.map(({ label, value }) => (
            <option key={value} value={value}>
            {label}
            </option>
        ))}
        </select>
    );
});

describe('<SearchBar />', () => {
    test('renders search input', () => {
        render(<MockSearchBar />);
        const searchInput = screen.getByPlaceholderText('Search tasks');
        expect(searchInput).toBeInTheDocument();
      });

  test('updates search state on input', () => {
    render(<MockSearchBar />);
    const searchInput = screen.getByPlaceholderText('Search tasks');
    userEvent.type(searchInput, 'example search');
    expect(searchInput.value).toBe('example search');
  });

  test('renders sort select', () => {
    render(<MockSearchBar />);
    const sortSelect = screen.getByTestId('sortby');
    expect(sortSelect).toBeInTheDocument();
  });

  test('updates sort state on select change', () => {
    render(<MockSearchBar />);
    const sortSelect = screen.getByTestId('sortby');
    fireEvent.change(sortSelect, { target: { value: 'priority' } });
    expect(sortSelect.value).toBe('priority');
  });

  test('renders filter select', () => {
    render(<MockSearchBar />);
    const filterSelect = screen.getByTestId('filterby');
    expect(filterSelect).toBeInTheDocument();
  });

  test('updates filter state on select change', () => {
    render(<MockSearchBar />);
    const filterSelect = screen.getByTestId('filterby');
    fireEvent.change(filterSelect, { target: { value: 'Recreation' } });
    expect(filterSelect.value).toBe('Recreation');
  });

  test('renders toggle buttons', () => {
    render(<MockSearchBar />);
    const toggleButtons = screen.getAllByRole('button');
    expect(toggleButtons).toHaveLength(2);
  });

  test('updates order state on toggle button change', () => {
    render(<MockSearchBar />);
    const toggleButtons = screen.getAllByRole('button');
    userEvent.click(toggleButtons[0]);
    expect(toggleButtons[0]).toHaveAttribute('aria-pressed', 'true');
    expect(toggleButtons[1]).toHaveAttribute('aria-pressed', 'false');
    
  });

  // Add more tests as needed

});