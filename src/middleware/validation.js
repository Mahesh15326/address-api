// Request Validation Middleware
const validateRequest = (schema) => {
  return (req, res, next) => {
    const errors = []

    for (const [field, rules] of Object.entries(schema)) {
      const value = req.query[field] || req.body[field]

      // Required check
      if (rules.required && (value === undefined || value === '' || value === null)) {
        errors.push(`${field} is required`)
        continue
      }

      // Type check for query params
      if (value !== undefined && rules.type) {
        if (rules.type === 'number') {
          const num = parseInt(value)
          if (isNaN(num)) {
            errors.push(`${field} must be a valid number`)
          } else if (rules.min !== undefined && num < rules.min) {
            errors.push(`${field} must be at least ${rules.min}`)
          } else if (rules.max !== undefined && num > rules.max) {
            errors.push(`${field} must be at most ${rules.max}`)
          }
        }

        if (rules.type === 'string') {
          if (typeof value !== 'string') {
            errors.push(`${field} must be a string`)
          } else if (rules.minLength && value.length < rules.minLength) {
            errors.push(`${field} must be at least ${rules.minLength} characters`)
          } else if (rules.maxLength && value.length > rules.maxLength) {
            errors.push(`${field} must be at most ${rules.maxLength} characters`)
          }
        }

        if (rules.type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          errors.push(`${field} must be a valid email`)
        }
      }
    }

    if (errors.length > 0) {
      return res.status(400).json({ success: false, error: errors.join(', ') })
    }

    next()
  }
}

// Pre-defined validation schemas
const schemas = {
  states: {
    page: { type: 'number', min: 1 },
    limit: { type: 'number', min: 1, max: 100 }
  },
  districts: {
    stateId: { required: true, type: 'number' },
    page: { type: 'number', min: 1 },
    limit: { type: 'number', min: 1, max: 100 }
  },
  subdistricts: {
    districtId: { required: true, type: 'number' },
    page: { type: 'number', min: 1 },
    limit: { type: 'number', min: 1, max: 100 }
  },
  villages: {
    subDistrictId: { type: 'number' },
    search: { type: 'string', minLength: 2, maxLength: 100 },
    page: { type: 'number', min: 1 },
    limit: { type: 'number', min: 1, max: 100 }
  },
  register: {
    email: { required: true, type: 'email' },
    password: { required: true, type: 'string', minLength: 6 }
  },
  login: {
    email: { required: true, type: 'email' },
    password: { required: true, type: 'string' }
  }
}

module.exports = { validateRequest, schemas }