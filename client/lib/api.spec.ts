import { describe, it, expect, vi, beforeEach } from 'vitest';
import { apiFetch } from './api';

describe('apiFetch', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn());
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      removeItem: vi.fn(),
    });
    vi.stubGlobal('window', {
      location: { href: '' }
    });
  });

  it('should include Authorization header if token exists', async () => {
    vi.mocked(localStorage.getItem).mockReturnValue('fake-token');
    vi.mocked(fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ data: 'success' }),
    } as Response);

    await apiFetch('/test');

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer fake-token',
        }),
      })
    );
  });

  it('should throw error if response is not ok', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 400,
      json: () => Promise.resolve({ message: 'Bad Request' }),
    } as Response);

    await expect(apiFetch('/test')).rejects.toThrow('Bad Request');
  });

  it('should redirect to login on 401', async () => {
    vi.mocked(fetch).mockResolvedValue({
      ok: false,
      status: 401,
    } as Response);

    await expect(apiFetch('/test')).rejects.toThrow('Não autorizado');
    expect(localStorage.removeItem).toHaveBeenCalledWith('token');
  });
});
