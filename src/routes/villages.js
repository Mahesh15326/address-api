const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
const authenticateApiKey = require('../middleware/apiKeyAuth')
const { validateRequest, schemas } = require('../middleware/validation')

router.get('/', validateRequest(schemas.villages), authenticateApiKey, async (req, res) => {
  try {
    const { subDistrictId, search } = req.query
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 50
    const skip = (page - 1) * limit

    // Search mode
    if (search) {
      const [villages, total] = await Promise.all([
        prisma.village.findMany({
          where: { name: { contains: search.toUpperCase() } },
          select: {
            id: true, name: true, code: true,
            subDistrict: {
              select: {
                name: true,
                district: {
                  select: {
                    name: true,
                    state: { select: { name: true } }
                  }
                }
              }
            }
          },
          skip,
          take: limit
        }),
        prisma.village.count({ where: { name: { contains: search.toUpperCase() } } })
      ])
      return res.json({
        success: true,
        data: villages,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: page * limit < total }
      })
    }

    // By subDistrictId mode
    if (!subDistrictId) return res.status(400).json({ success: false, error: 'subDistrictId or search is required' })

    const where = { subDistrictId: parseInt(subDistrictId) }

    const [villages, total] = await Promise.all([
      prisma.village.findMany({
        where,
        select: { id: true, name: true, code: true },
        orderBy: { name: 'asc' },
        skip,
        take: limit
      }),
      prisma.village.count({ where })
    ])

    res.json({
      success: true,
      data: villages,
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