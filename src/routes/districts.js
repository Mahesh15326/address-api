const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const authenticateApiKey = require('../middleware/apiKeyAuth')
const { validateRequest, schemas } = require('../middleware/validation')

router.get('/', validateRequest(schemas.districts), authenticateApiKey, async (req, res) => {
  try {
    const { stateId } = req.query
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    if (!stateId) return res.status(400).json({ success: false, error: 'stateId is required' })

    const where = { stateId: parseInt(stateId) }

    const [districts, total] = await Promise.all([
      prisma.district.findMany({
        where,
        select: { id: true, name: true, code: true },
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      prisma.district.count({ where })
    ])

    res.json({
      success: true,
      data: districts,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: page * limit < total
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router