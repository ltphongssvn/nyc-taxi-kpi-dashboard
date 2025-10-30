// /src/routes/dashboard.js
// Dashboard routes using Router pattern

import express from 'express'
import { getDashboardData } from '../services/dataService.js'

const router = express.Router()

// Main dashboard route
router.get('/', async (req, res, next) => {
  try {
    const dashboardData = await getDashboardData()
    res.render('dashboard', { data: dashboardData })
  } catch (error) {
    next(error)
  }
})

// API endpoint for raw JSON data
router.get('/api/data', async (req, res, next) => {
  try {
    const data = await getDashboardData()
    res.json(data)
  } catch (error) {
    next(error)
  }
})

export default router
