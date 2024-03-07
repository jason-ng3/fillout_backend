function validateFormId(req, res, next) {
  const { formId } = req.params;
  if (typeof formId !== 'string' || formId.trim() === '') {
    return res.status(400).send({ error: 'Invalid formId parameter' });
  }
  next();
}

function validateLimit(req, res, next) {
  const { limit } = req.query;
  if (typeof limit !== 'undefined' && (isNaN(limit) || limit < 1 || limit > 150)) {
    return res.status(400).send({ error: 'Invalid limit parameter' });
  }
  next();
}

function validateDate(req, res, next) {
  const { afterDate, beforeDate } = req.query;
  if (afterDate && !isValidDate(afterDate)) {
    return res.status(400).send({ error: 'Invalid afterDate parameter' });
  }
  if (beforeDate && !isValidDate(beforeDate)) {
    return res.status(400).send({ error: 'Invalid beforeDate parameter' });
  }
  next();
}

function validateOffset(req, res, next) {
  const { offset } = req.query;
  if (typeof offset !== 'undefined' && (isNaN(offset) || offset < 0)) {
    return res.status(400).send({ error: 'Invalid offset parameter' });
  }
  next();
}

function validateStatus(req, res, next) {
  const { status } = req.query;
  if (status && status !== 'in_progress' && status !== 'finished') {
    return res.status(400).send({ error: 'Status must be either "in_progress" or "finished"' });
  }
  next();
}

function validateIncludeEditLink(req, res, next) {
  const { includeEditLink } = req.query;
  if (includeEditLink && typeof includeEditLink !== 'boolean') {
    return res.status(400).send({ error: 'includeEditLink must be a boolean' });
  }
  next();
}

function validateSort(req, res, next) {
  const { sort } = req.query;
  if (sort && sort !== 'asc' && sort !== 'desc') {
    return res.status(400).send({ error: 'Sort must be either "asc" or "desc"' });
  }
  next();
}

function validateFilters(req, res, next) {
  const { filters } = req.query;

  // Validate filters parameter must be an Array if it's defined
  // If it's not defined, I define it as an empty Array in the filterResponses function
  if (filters) {
    const filtersArray = JSON.parse(filters);
    if (!Array.isArray(filtersArray)) {
      return res.status(400).send({ error: 'Filters must be an array' });
    }

    // Validate each filter clause
    for (const filter of filtersArray) {
      if (!validateFilterClause(filter)) {
        return res.status(400).send({ error: 'Invalid filter clause' });
      }
    }
  }

  next();
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

// Helper function to validate content of a date string
function isValidDate(date) {
  const regex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
  return regex.test(date);
}

// Helper function to validate an individual filter clause
function validateFilterClause(filter) {
  const { id, condition, value } = filter;

  // Validate id
  if (typeof id !== 'string' || id.trim() === '') {
    return false;
  }

  // Validate condition
  const validConditions = ['equals', 'does_not_equal', 'greater_than', 'less_than'];
  if (!validConditions.includes(condition)) {
    return false;
  }

  // Validate value
  if (typeof value !== 'string' && typeof value !== 'number') {
    return false;
  }

  return true;
}

module.exports = {
  validateFormId, 
  validateLimit,
  validateDate, 
  validateOffset,
  validateStatus,
  validateIncludeEditLink,
  validateSort,
  validateFilters,
  unknownEndpoint
}