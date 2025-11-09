// /home/lenovo/code/ltphongssvn/node-js-design-patterns-fourth-edition/index.js
// Main server file for NYC Taxi Company KPI Dashboard

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import dashboardRoutes from './src/routes/dashboard.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// View engine setup - FIXED: views are in ./views not ./src/views
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Static files
app.use(express.static(path.join(__dirname, 'public')))

// Routes
app.use('/', dashboardRoutes)

// Error handler
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).send('Something broke!')
})

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
})