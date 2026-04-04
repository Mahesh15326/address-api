const express = require('express')
const router = express.Router()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

router.get('/', async (req, res) => {
  try {
    const { subDistrictId, search } = req.query

    if (search) {
      const villages = await prisma.village.findMany({
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
        take: 50
      })
      return res.json({ success: true, count: villages.length, data: villages })
    }

    if (!subDistrictId) return res.status(400).json({ success: false, error: 'subDistrictId or search is required' })

    const villages = await prisma.village.findMany({
      where: { subDistrictId: parseInt(subDistrictId) },
      select: { id: true, name: true, code: true },
      orderBy: { name: 'asc' }
    })
    res.json({ success: true, count: villages.length, data: villages })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router