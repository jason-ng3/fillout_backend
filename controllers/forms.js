const formsRouter = require('express').Router();
const middleware = require('../utils/middleware');
const { fetchAllResponses, filterResponses } = require('../utils/formService');

const validations = [
  middleware.validateFormId,
  middleware.validateLimit,
  middleware.validateOffset,
  middleware.validateDate,
  middleware.validateStatus,
  middleware.validateIncludeEditLink,
  middleware.validateSort,
  middleware.validateFilters,
];

// Fetch filtered form responses 
formsRouter.get('/:formId/filteredResponses', ...validations, async (request, response) => {
  try {
    // Extract formId and filters parameter
    const { formId } = request.params;
    const { limit = 150, offset = 0, filters } = request.query;

    // Fetch all form responses for a given formId
    const allResponses = await fetchAllResponses(formId, request.query);

    // Filter form's responses based on filters parameter
    const filteredResponses = filterResponses(allResponses, filters);

    // Calculate correct values for totalResponses & pageCount
    const startIndex = offset;
    const endIndex = Math.min(startIndex + limit, filteredResponses.length);
    const paginatedResponses = filteredResponses.slice(startIndex, endIndex);
    
    // Construct response object
    const responseObj = {
        responses: paginatedResponses,
        totalResponses: filteredResponses.length,
        pageCount: Math.ceil(filteredResponses.length / limit)
    };
    
    response.send(responseObj);
  } catch (error) {
    console.error('An error occurred:', error);
    response.status(500).send({ error: 'Internal Server Error' });
  }
});


module.exports = formsRouter