// /src/services/dataService.js
// Data service for reading Parquet files - implements Factory pattern

import parquet from 'parquetjs'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname, '../../data')

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

export async function getDashboardData() {
  try {
    const files = await fs.readdir(DATA_DIR)
    const goldFiles = files.filter(f => f.includes('gold') && f.endsWith('.parquet'))
    
    if (goldFiles.length === 0) {
      return getMockData()
    }
    
    const kpiData = await readParquetFile(goldFiles[0])
    
    if (kpiData.length === 0) {
      return getMockData()
    }
    
    return processKPIData(kpiData)
  } catch (error) {
    console.error('Error loading dashboard data:', error)
    return getMockData()
  }
}

function processKPIData(records) {
  let totalRevenue = 0
  let totalDistance = 0
  let totalNightTrips = 0
  let totalTrips = 0
  let totalFares = 0
  
  const weeklyByBorough = []
  
  records.forEach(record => {
    totalRevenue += Number(record.total_revenue) || 0
    totalDistance += Number(record.trip_distance) || 0
    totalNightTrips += Number(record.night_trips) || 0
    totalTrips += Number(record.trip_count) || 0
    totalFares += Number(record.fare_amount) || 0
    
    weeklyByBorough.push({
      weekStart: record.week_start,
      borough: record.borough,
      tripVolume: Number(record.trip_count) || 0
    })
  })
  
  return {
    summary: {
      totalRevenue: totalRevenue,
      avgTripDistance: totalTrips > 0 ? totalDistance / totalTrips : 0,
      pctNightTrips: totalTrips > 0 ? (totalNightTrips / totalTrips) * 100 : 0,
      avgFare: records.length > 0 ? totalFares / records.length : 0,
      totalTrips: totalTrips
    },
    weeklyByBorough: weeklyByBorough
  }
}

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
