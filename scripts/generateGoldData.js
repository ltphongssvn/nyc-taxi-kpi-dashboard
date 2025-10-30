// /scripts/generateGoldData.js
// Generates mock Gold layer KPI parquet files

import parquet from 'parquetjs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function generateGoldLayerData() {
  const schema = new parquet.ParquetSchema({
    week_start: { type: 'UTF8' },
    borough: { type: 'UTF8' },
    trip_count: { type: 'INT64' },
    total_revenue: { type: 'DOUBLE' },
    trip_distance: { type: 'DOUBLE' },
    night_trips: { type: 'INT64' },
    fare_amount: { type: 'DOUBLE' }
  })

  const writer = await parquet.ParquetWriter.openFile(
    schema, 
    path.join(__dirname, '../data/gold_kpi_weekly.parquet')
  )

  // Generate 4 weeks of data across boroughs
  const weeks = ['2024-12-30', '2025-01-06', '2025-01-13', '2025-01-20']
  const boroughs = ['Bronx', 'Brooklyn', 'Manhattan', 'Queens', 'Staten Island', 'EWR']

  for (const week of weeks) {
    for (const borough of boroughs) {
      const tripCount = borough === 'Manhattan' 
        ? Math.floor(500000 + Math.random() * 200000)
        : Math.floor(1000 + Math.random() * 50000)
      
      await writer.appendRow({
        week_start: week,
        borough: borough,
        trip_count: tripCount,
        total_revenue: tripCount * (35 + Math.random() * 15),
        trip_distance: tripCount * (2.5 + Math.random() * 1.5),
        night_trips: Math.floor(tripCount * (0.2 + Math.random() * 0.15)),
        fare_amount: 35 + Math.random() * 15
      })
    }
  }

  await writer.close()
  console.log('✓ Generated gold_kpi_weekly.parquet')
}

generateGoldLayerData().catch(console.error)
