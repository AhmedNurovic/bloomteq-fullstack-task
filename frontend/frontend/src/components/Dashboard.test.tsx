import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import Dashboard from './Dashboard';
import '@testing-library/jest-dom';

describe('Dashboard', () => {
  it('renders the Dashboard component', () => {
    render(
      <MemoryRouter>
        <AuthProvider>
          <Dashboard />
        </AuthProvider>
      </MemoryRouter>
    );
    expect(screen.getByText(/add new work/i)).toBeInTheDocument();
  });
}); 