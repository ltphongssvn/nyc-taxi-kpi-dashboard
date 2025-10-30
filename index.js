// /index.js
// Main application entry point - follows Factory and Dependency Injection patterns

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import dashboardRoutes from './src/routes/dashboard.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 3000

// Configure EJS template engine
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

// Serve static files
app.use(express.static(path.join(__dirname, 'public')))
app.use('/node_modules', express.static(path.join(__dirname, 'node_modules')))

// Routes
app.use('/', dashboardRoutes)

// Error handling middleware (Middleware pattern)
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
