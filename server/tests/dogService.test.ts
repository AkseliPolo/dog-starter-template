import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getRandomDogImage } from '../services/dogService';

describe('dogService', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  // Test 1 - positive
  it('returns the image url and success status from the API', async () => {
    const mockedData = {
      message: 'https://images.dog.ceo/breeds/hound-basset/n02088238_9449.jpg',
      status: 'success'
    };

    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => mockedData
    });
    vi.stubGlobal('fetch', fetchMock);

    const result = await getRandomDogImage();

    expect(result.imageUrl).toBe(mockedData.message);
    expect(result.status).toBe('success');
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  // Test 2 - negative
  it('throws when the API responds with an error status', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 500
    });
    vi.stubGlobal('fetch', fetchMock);

    await expect(getRandomDogImage()).rejects.toThrow(
      'Failed to fetch dog image: Dog API returned status 500'
    );
  });
});
