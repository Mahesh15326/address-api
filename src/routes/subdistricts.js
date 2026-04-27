const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const authenticateApiKey = require('../middleware/apiKeyAuth')
const { validateRequest, schemas } = require('../middleware/validation')

router.get('/', validateRequest(schemas.subdistricts), authenticateApiKey, async (req, res) => {
  try {
    const { districtId } = req.query
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    if (!districtId) return res.status(400).json({ success: false, error: 'districtId is required' })

    const where = { districtId: parseInt(districtId) }

    const [subdistricts, total] = await Promise.all([
      prisma.subDistrict.findMany({
        where,
        select: { id: true, name: true, code: true },
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      prisma.subDistrict.count({ where })
    ])

    res.json({
      success: true,
      data: subdistricts,
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