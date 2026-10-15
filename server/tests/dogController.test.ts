import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Request, Response } from 'express';
import { getDogImage } from '../controllers/dogController';
import { getRandomDogImage } from '../services/dogService';

vi.mock('../services/dogService', () => ({
  getRandomDogImage: vi.fn()
}));

describe('dogController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test 3 - positive
  it('responds with success true and the data returned by the service', async () => {
    const mockedDog = {
      imageUrl: 'https://images.dog.ceo/breeds/hound-basset/n02088238_9449.jpg',
      status: 'success'
    };
    vi.mocked(getRandomDogImage).mockResolvedValue(mockedDog);

    const res = {
      json: vi.fn(),
      status: vi.fn().mockReturnThis()
    } as unknown as Response;

    await getDogImage({} as Request, res);

    expect(res.json).toHaveBeenCalledWith({
      success: true,
      data: mockedDog
    });
  });
});
