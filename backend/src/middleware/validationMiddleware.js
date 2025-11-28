import * as z from 'zod'

// Generic validation middleware
export const validate = (schema) => {
  return async (req, res, next) => {
    try {
      // Validate request body
      const validatedData = await schema.parseAsync(req.body)
      
      // Replace req.body with validated data
      req.body = validatedData
      
      next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Format Zod validation errors
        const formattedErrors = error.errors.map(err => ({
          field: err.path.join('.'),
          message: err.message
        }))
        
        return res.status(400).json({
          message: 'Validation failed',
          errors: formattedErrors
        })
      }
      
      // Handle other errors
      return res.status(500).json({
        message: 'Validation error',
        error: error.message
      })
    }
  }
}