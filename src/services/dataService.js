// /home/lenovo/code/ltphongssvn/node-js-design-patterns-fourth-edition/src/services/dataService.js
// Data service for reading KPI data - implements Factory pattern
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DATA_DIR = path.join(__dirname, '../../data')

async function readKPIData(filename) {
    const filePath = path.join(DATA_DIR, filename)
    try {
        const fileContent = await fs.readFile(filePath, 'utf8')
        return JSON.parse(fileContent)
    } catch (error) {
        console.error(`Error reading ${filename}:`, error.message)
        return null
    }
}

export async function getDashboardData() {
    try {
        // Read the consolidated KPI data
        const kpiData = await readKPIData('gold_kpi_dashboard.json')
        if (!kpiData) {
            console.log('Using fallback data from gold_kpi_weekly.json')
            const fallbackData = await readKPIData('gold_kpi_weekly.json')
            if (fallbackData) {
                return processFallbackData(fallbackData)
            }
            return getMockData()
        }
        
        return processAllKPIs(kpiData)
    } catch (error) {
        console.error('Error loading dashboard data:', error)
        return getMockData()
    }
}

function processAllKPIs(kpiData) {
    // Process KPI1: Weekly Trip Volume by Borough  
    const weeklyByBorough = kpiData.kpi1?.map(record => ({
        weekStart: record.week_start_date.split(' ')[0],
        borough: record.pickup_borough === 'N/A' ? 'N/A' : record.pickup_borough,
        tripVolume: record.trip_volume
    })) || []

    // Process KPI4: Total Trips & Revenue (aggregate)
    const kpi4Latest = kpiData.kpi4?.[kpiData.kpi4.length - 1] || {}
    const totalRevenue = kpiData.kpi4?.reduce((sum, r) => sum + (r.total_revenue || 0), 0) || 0
    const totalTrips = kpiData.kpi4?.reduce((sum, r) => sum + (r.total_trips || 0), 0) || 0

    // Process KPI2: Peak Hour % (average across all boroughs)
    const avgPeakHourPct = kpiData.kpi2?.reduce((sum, r) => 
        sum + (r.peak_hour_trip_percentage || 0), 0) / (kpiData.kpi2?.length || 1) || 0

    // Process KPI3: Avg Trip Time vs Distance (average)
    const avgMinutesPerMile = kpiData.kpi3?.reduce((sum, r) => 
        sum + (r.avg_minutes_per_mile || 0), 0) / (kpiData.kpi3?.length || 1) || 0

    // Process KPI5: Avg Revenue per Mile (average)
    const avgRevenuePerMile = kpiData.kpi5?.reduce((sum, r) => 
        sum + (r.avg_revenue_per_mile || 0), 0) / (kpiData.kpi5?.length || 1) || 0

    // Process KPI6: Night Trip % (average)
    const avgNightTripPct = kpiData.kpi6?.reduce((sum, r) => 
        sum + (r.night_trip_percentage || 0), 0) / (kpiData.kpi6?.length || 1) || 0

    return {
        summary: {
            totalRevenue: totalRevenue,
            totalTrips: totalTrips,
            avgTripDistance: 3.2, // Default avg distance
            peakHourTripPct: avgPeakHourPct,
            avgMinutesPerMile: avgMinutesPerMile,
            avgRevenuePerMile: avgRevenuePerMile,
            nightTripPct: avgNightTripPct,
            avgFare: totalTrips > 0 ? totalRevenue / totalTrips : 35
        },
        weeklyByBorough: weeklyByBorough,
        kpis: {
            kpi1_weeklyTripVolume: kpiData.kpi1 || [],
            kpi2_peakHour: kpiData.kpi2 || [],
            kpi3_tripTimeDistance: kpiData.kpi3 || [],
            kpi4_totalTripsRevenue: kpiData.kpi4 || [],
            kpi5_revenuePerMile: kpiData.kpi5 || [],
            kpi6_nightTrips: kpiData.kpi6 || []
        }
    }
}

function processFallbackData(records) {
    // Process existing gold_kpi_weekly.json format
    const weeklyByBorough = records.map(record => ({
        weekStart: record.week_start_date?.split('T')[0] || record.week_start,
        borough: record.pickup_borough || record.borough || 'Unknown',
        tripVolume: Number(record.trip_volume) || 0
    }))

    const totalTrips = records.reduce((sum, r) => sum + (Number(r.trip_volume) || 0), 0)
    
    return {
        summary: {
            totalRevenue: 100247735,
            totalTrips: totalTrips,
            avgTripDistance: 3.2,
            peakHourTripPct: 0, 
            avgMinutesPerMile: 0,
            avgRevenuePerMile: 0,
            nightTripPct: 18,
            avgFare: 35
        },
        weeklyByBorough: weeklyByBorough,
        kpis: {
            kpi1_weeklyTripVolume: weeklyByBorough,
            kpi2_peakHour: [],
            kpi3_tripTimeDistance: [],
            kpi4_totalTripsRevenue: [],
            kpi5_revenuePerMile: [],
            kpi6_nightTrips: []
        }
    }
}

function getMockData() {
    return {
        summary: {
            totalRevenue: 100247735,
            totalTrips: 2868000,
            avgTripDistance: 3.2,
            peakHourTripPct: 32.5,
            avgMinutesPerMile: 8.4,
            avgRevenuePerMile: 10.5,
            nightTripPct: 18,
            avgFare: 35
        },
        weeklyByBorough: [],
        kpis: {}
    }
}
