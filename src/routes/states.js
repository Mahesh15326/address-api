const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const authenticateApiKey = require('../middleware/apiKeyAuth')

router.get('/', authenticateApiKey, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    const [states, total] = await Promise.all([
      prisma.state.findMany({
        select: { id: true, name: true, code: true },
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      prisma.state.count()
    ])

    res.json({
      success: true,
      data: states,
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