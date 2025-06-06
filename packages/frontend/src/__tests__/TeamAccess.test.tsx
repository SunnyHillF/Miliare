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

describe('Team access', () => {
  afterEach(() => {
    vi.resetAllMocks();
  });

  it('shows Team link for users in teamLead group', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      ...baseAuth,
      user: {
        id: '1',
        name: 'Lead',
        email: 'lead@example.com',
        company: 'WFG',
        groups: ['teamLead'],
      },
    } as UseAuthReturn);

    render(
      <MemoryRouter>
        <DashboardLayout />
      </MemoryRouter>
    );

    expect(screen.getByRole('link', { name: /team/i })).toBeInTheDocument();
  });

  it('shows Team link for users in admin group', () => {
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

    expect(screen.getByRole('link', { name: /team/i })).toBeInTheDocument();
  });

  it('hides Team link for users without teamLead group', () => {
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

    expect(screen.queryByRole('link', { name: /team/i })).not.toBeInTheDocument();
  });

  it('restricts /dashboard/team route when user lacks required groups', () => {
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
      <MemoryRouter initialEntries={["/dashboard/team"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.queryByText(/your team dashboard/i)).not.toBeInTheDocument();
    expect(screen.getByText(/your business dashboard/i)).toBeInTheDocument();
  });

  it('allows team leads to view the team dashboard', () => {
    vi.spyOn(AuthContext, 'useAuth').mockReturnValue({
      ...baseAuth,
      user: {
        id: '1',
        name: 'Lead',
        email: 'lead@example.com',
        company: 'WFG',
        groups: ['teamLead'],
      },
    } as UseAuthReturn);

    render(
      <MemoryRouter initialEntries={["/dashboard/team"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/your team dashboard/i)).toBeInTheDocument();
  });

  it('allows admins to view the team dashboard', () => {
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
      <MemoryRouter initialEntries={["/dashboard/team"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByText(/your team dashboard/i)).toBeInTheDocument();
  });
});
