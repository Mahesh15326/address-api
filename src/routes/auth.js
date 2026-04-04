const express = require('express')
const router = express.Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.user.create({
      data: { 
        email: email, 
        password: hashedPassword 
      }
    })

    res.json({ 
      success: true, 
      message: 'User registered successfully!', 
      userId: user.id 
    })

  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' })
    }

    const user = await prisma.user.findUnique({ 
      where: { email: email } 
    })

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' })
    }

    const valid = await bcrypt.compare(password, user.password)

    if (!valid) {
      return res.status(401).json({ success: false, error: 'Wrong password' })
    }

    const token = jwt.sign(
      { userId: user.id }, 
      process.env.JWT_SECRET || 'mysupersecretkey123', 
      { expiresIn: '7d' }
    )

    res.json({ success: true, token: token })

  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

module.exports = router