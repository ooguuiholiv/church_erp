import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import DashboardHome from './page';
import { api } from '@/lib/api';

// Mock the API module
vi.mock('@/lib/api', () => ({
  api: {
    get: vi.fn(),
  },
}));

// Mock window.location
const mockHref = vi.fn();
vi.stubGlobal('location', {
  set href(url: string) { mockHref(url); },
  get href() { return ''; }
});

// Mock localStorage
const mockStorage: Record<string, string | null> = {};
vi.stubGlobal('localStorage', {
  getItem: vi.fn((key) => mockStorage[key] || null),
  setItem: vi.fn((key, val) => { mockStorage[key] = val }),
  removeItem: vi.fn((key) => { delete mockStorage[key] }),
});

describe('DashboardHome', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders loading state initially', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue('fake-token');
    // Mock profile response
    vi.mocked(api.get).mockImplementation((url) => {
        if (url === '/auth/profile') return Promise.resolve({ name: 'Franco' });
        return new Promise(() => {}); // Never resolve to stay in loading
    });

    render(<DashboardHome />);
    expect(screen.getByText(/Carregando métricas/i)).toBeInTheDocument();
  });

  it('renders dashboard content after loading', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue('fake-token');
    
    vi.mocked(api.get).mockImplementation((url) => {
      if (url === '/auth/profile') return Promise.resolve({ name: 'Franco Admin', role: 'ADMIN' });
      if (url === '/people') return Promise.resolve([{ id: '1', name: 'João', status: 'MEMBRO', createdAt: new Date().toISOString() }]);
      if (url === '/finance/summary') return Promise.resolve({ totalRevenue: 1000, totalExpense: 500, balance: 500 });
      if (url === '/finance') return Promise.resolve([]);
      return Promise.resolve([]);
    });

    render(<DashboardHome />);

    await waitFor(() => {
      expect(screen.getByText(/Bem-vindo, Franco/i)).toBeInTheDocument();
    });

    expect(screen.getByText('Total de Membros')).toBeInTheDocument();
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/R\$ 1.000,00/)).toBeInTheDocument();
  });

  it('redirects to login if no token', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    
    render(<DashboardHome />);
    
    await waitFor(() => {
      expect(mockHref).toHaveBeenCalledWith('/login');
    });
  });
});
