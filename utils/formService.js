const axios = require('axios');
const config = require('./config');

// Fetch all form responses for a given formId
async function fetchAllResponses(formId, queryParams) {
  const { afterDate, beforeDate, status = 'finished', includeEditLink, sort } = queryParams;

  let allResponses = [];
  let totalResponses = 0;
  let currentOffset = 0;

  while (true) {
    const filloutApiUrl = `https://api.fillout.com/v1/api/forms/${formId}/submissions`;

    const responseData = await axios.get(filloutApiUrl, {
      headers: {
        Authorization: `Bearer ${config.API_KEY}`,
      },
      params: {
        offset: currentOffset,
        afterDate,
        beforeDate,
        status,
        includeEditLink,
        sort,
      }
    });

    const formResponses = responseData.data.responses;
    allResponses = allResponses.concat(formResponses);

    // Save totalResponses after fetching the first page
    if (currentOffset === 0) {
      totalResponses = responseData.data.totalResponses;
    }

    // Break the loop if all responses collected
    // Otherwise, increment currentOffset by 150 (# of responses processed in current iteration)
    if (allResponses.length >= totalResponses) {
      break;
    } else {
      currentOffset += 150;
    }
  }

  return allResponses;
}

// Filter form responses based on provided filters parameter
function filterResponses(responses, filters) {
  const responseFilters = filters ? JSON.parse(filters) : [];

  return responses.filter(response => {
    return responseFilters.every(filter => {
      const question = response.questions.find(q => q.id === filter.id);
      if (!question) return false;

      switch (filter.condition) {
        case 'equals':
          return question.value === filter.value;
        case 'does_not_equal':
          return question.value !== filter.value;
        case 'greater_than':
          return question.value > filter.value;
        case 'less_than':
          return question.value < filter.value;
        default:
          return false;
      }
    });
  });
}


module.exports = { fetchAllResponses, filterResponses };