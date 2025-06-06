import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import DashboardLayout from '../layouts/DashboardLayout';
import App from '../App';
import * as AuthContext from '../contexts/AuthContext';

type UseAuthReturn = ReturnType<typeof AuthContext.useAuth>;

const baseAuth = {
  isAuthenticated: true,
  isLoading: false,
  login: vi.fn(),
  logout: vi.fn(),
  register: vi.fn(),
};

describe('Admin access', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('shows Admin link for users in admin group', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      ...baseAuth,
      user: {
        id: '1',
        name: 'Admin',
        email: 'admin@example.com',
        company: 'WFG',
        groups: ['admin'],
      },
    } as UseAuthReturn);

    render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /admin/i })).toBeInTheDocument();
  });

  it('hides Admin link for users without admin group', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      ...baseAuth,
      user: {
        id: '1',
        name: 'User',
        email: 'user@example.com',
        company: 'WFG',
        groups: [],
      },
    } as UseAuthReturn);

    render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>
    );

    expect(screen.queryByRole('link', { name: /admin/i })).not.toBeInTheDocument();
  });

  it('restricts /dashboard/admin route when user lacks admin group', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      ...baseAuth,
      user: {
        id: '1',
        name: 'User',
        email: 'user@example.com',
        company: 'WFG',
        groups: [],
      },
    } as UseAuthReturn);

    render(
      <MemoryRouter initialEntries={["/dashboard/admin"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.queryByText(/admin dashboard/i)).not.toBeInTheDocument();
    expect(screen.getByText(/your business dashboard/i)).toBeInTheDocument();
  });

  it('allows admins to view the admin dashboard', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      ...baseAuth,
      user: {
        id: '1',
        name: 'Admin',
        email: 'admin@example.com',
        company: 'WFG',
        groups: ['admin'],
      },
    } as UseAuthReturn);

    render(
      <MemoryRouter initialEntries={["/dashboard/admin"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/admin dashboard/i)).toBeInTheDocument();
  });
});
