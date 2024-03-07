const request = require('supertest');
const app = require('../app');
const axios = require('axios');

// Mocking axios to simulate API responses
jest.mock('axios');

describe('GET /v1/api/forms/:formId/filteredResponses', () => {
  // Sample reponse data
  const responseData = {
    responses: [
      {
        id: 1,
        questions: [
          { id: 'nameId', value: 'Timmy' }, // Match filter condition
          { id: 'birthdayId', value: '2024-02-22' }
        ]
      },
      {
        id: 2,
        questions: [
          { id: 'nameId', value: 'Jason' }, 
          { id: 'birthdayId', value: '2019-02-22' }
        ]
      },
      {
        id: 3,
        questions: [
          { id: 'nameId', value: 'Joe' }, 
          { id: 'birthdayId', value: '2023-02-22' }
        ]
      }
    ],
    totalResponses: 3
  };

  beforeEach(() => {
    axios.get.mockResolvedValue({ data: responseData });
  });

  it('should return correct filtered responses when filter is provided', async () => {
    // Send request to endpoint with filter query parameter
    const response = await request(app)
      .get('/v1/api/forms/cLZojxk94ous/filteredResponses')
      .query({
        filters: JSON.stringify([
          { id: 'birthdayId', condition: 'greater_than', value: '2023-01-01' }
        ])
      });

    // Assertions
    expect(response.status).toBe(200);
    expect(response.body.responses).toEqual([responseData.responses[0], responseData.responses[2]]);
    expect(response.body.totalResponses).toBe(2);
    expect(response.body.pageCount).toBe(1);
  });
});


