// /src/services/dataService.js
// Data service for reading Parquet files - implements Factory pattern

import parquet from 'parquetjs'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname, '../../data')

/**
 * Reads Parquet file and returns data as array of objects
 */
async function readParquetFile(filename) {
  const filePath = path.join(DATA_DIR, filename)
  
  try {
    const reader = await parquet.ParquetReader.openFile(filePath)
    const cursor = reader.getCursor()
    const records = []
    
    let record = null
    while (record = await cursor.next()) {
      records.push(record)
    }
    
    await reader.close()
    return records
  } catch (error) {
    console.error(`Error reading ${filename}:`, error.message)
    return []
  }
}

/**
 * Main function to aggregate dashboard data from Gold layer
 */
export async function getDashboardData() {
  try {
    // Check if data directory exists
    const files = await fs.readdir(DATA_DIR)
    const parquetFiles = files.filter(f => f.endsWith('.parquet'))
    
    if (parquetFiles.length === 0) {
      return getMockData()
    }
    
    // Read KPI data from Gold layer
    const kpiData = await readParquetFile(parquetFiles[0])
    
    return processKPIData(kpiData)
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    return getMockData()
  }
}

/**
 * Process raw KPI data into dashboard format
 */
function processKPIData(records) {
  // Aggregate metrics
  const summary = {
    totalRevenue: 0,
    avgTripDistance: 0,
    pctNightTrips: 0,
    avgFare: 0,
    totalTrips: records.length
  }
  
  const weeklyByBorough = {}
  
  records.forEach(record => {
    if (record.total_revenue) summary.totalRevenue += record.total_revenue
    if (record.trip_distance) summary.avgTripDistance += record.trip_distance
    
    // Group by week and borough
    const key = `${record.week_start}-${record.borough}`
    if (!weeklyByBorough[key]) {
      weeklyByBorough[key] = {
        weekStart: record.week_start,
        borough: record.borough,
        tripVolume: 0
      }
    }
    weeklyByBorough[key].tripVolume += record.trip_count || 1
  })
  
  summary.avgTripDistance = summary.avgTripDistance / records.length
  
  return {
    summary,
    weeklyByBorough: Object.values(weeklyByBorough)
  }
}

/**
 * Returns mock data for development/testing
 */
function getMockData() {
  return {
    summary: {
      totalRevenue: 88102290.0,
      avgTripDistance: 27.8,
      pctNightTrips: 26.1,
      avgFare: 39,
      totalTrips: 2500000
    },
    weeklyByBorough: [
      { weekStart: '2024-12-30', borough: 'Bronx', tripVolume: 1193 },
      { weekStart: '2024-12-30', borough: 'Brooklyn', tripVolume: 6287 },
      { weekStart: '2024-12-30', borough: 'EWR', tripVolume: 28 },
      { weekStart: '2024-12-30', borough: 'Manhattan', tripVolume: 364697 },
      { weekStart: '2024-12-30', borough: 'Queens', tripVolume: 45178 },
      { weekStart: '2024-12-30', borough: 'Staten Island', tripVolume: 18 },
      { weekStart: '2025-01-06', borough: 'Manhattan', tripVolume: 620000 },
      { weekStart: '2025-01-13', borough: 'Manhattan', tripVolume: 680000 },
      { weekStart: '2025-01-20', borough: 'Manhattan', tripVolume: 520000 }
    ]
  }
}
