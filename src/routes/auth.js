const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { validateRequest, schemas } = require('../middleware/validation');

// ====================== REGISTER ======================
router.post('/register', validateRequest(schemas.register), async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ 
        success: false, 
        error: 'User with this email already exists' 
      });
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      }
    });
    res.status(201).json({
      success: true,
      message: 'User registered successfully!',
      userId: user.id
    });
  } catch (error) {
    console.error('REGISTER ERROR:', error.message);
    res.status(500).json({ success: false, error: 'Registration failed' });
  }
});

// ====================== LOGIN ======================
router.post('/login', validateRequest(schemas.login), async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      });
    }
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET || 'mysupersecretkey123',
      { expiresIn: '7d' }
    );
    res.json({ 
      success: true, 
      message: 'Login successful', 
      token 
    });
  } catch (error) {
    console.error('LOGIN ERROR:', error.message);
    res.status(500).json({ success: false, error: 'Login failed' });
  }
});

// ====================== JWT MIDDLEWARE ======================
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ 
      success: false, 
      error: 'Authorization token required (Bearer token)' 
    });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'mysupersecretkey123');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      success: false, 
      error: 'Invalid or expired token' 
    });
  }
};

module.exports = { 
  router,
  authenticateJWT
};