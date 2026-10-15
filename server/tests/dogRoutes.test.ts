import { describe, it, expect, vi, beforeEach } from 'vitest';
import express from 'express';
import request from 'supertest';
import { getDogImage } from '../controllers/dogController';
import dogRoutes from '../routes/dogRoutes';

vi.mock('../controllers/dogController', () => ({
  getDogImage: vi.fn()
}));

const app = express();
app.use('/api/dogs', dogRoutes);

describe('dogRoutes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Test 4 - positive
  it('returns 200 and the dog image for GET /api/dogs/random', async () => {
    const mockedJson = {
      success: true,
      data: {
        imageUrl: 'https://images.dog.ceo/breeds/hound-basset/n02088238_9449.jpg',
        status: 'success'
      }
    };
    vi.mocked(getDogImage).mockImplementation(async (_req, res) => {
      res.json(mockedJson);
    });

    const response = await request(app).get('/api/dogs/random');

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.imageUrl).toContain(mockedJson.data.imageUrl);
  });

  // Test 5 - negative
  it('returns 500 and an error for GET /api/dogs/random when the controller fails', async () => {
    const mockedJson = {
      success: false,
      error: 'Failed to fetch dog image: Network error'
    };
    vi.mocked(getDogImage).mockImplementation(async (_req, res) => {
      res.status(500).json(mockedJson);
    });

    const response = await request(app).get('/api/dogs/random');

    expect(response.status).toBe(500);
    expect(response.body.success).toBe(false);
    expect(response.body.error).toBe(mockedJson.error);
  });
});
