// /test/dataService.test.js
// Unit tests for data service using Mocha and Chai

import { expect } from 'chai'
import { getDashboardData } from '../src/services/dataService.js'

describe('Data Service', () => {
  describe('getDashboardData', () => {
    it('should return mock data when no parquet files exist', async () => {
      const data = await getDashboardData()
      
      expect(data).to.be.an('object')
      expect(data).to.have.property('summary')
      expect(data).to.have.property('weeklyByBorough')
    })
    
    it('should return summary with required KPI fields', async () => {
      const data = await getDashboardData()
      
      expect(data.summary).to.have.property('totalRevenue')
      expect(data.summary).to.have.property('avgTripDistance')
      expect(data.summary).to.have.property('pctNightTrips')
      expect(data.summary).to.have.property('avgFare')
      expect(data.summary).to.have.property('totalTrips')
    })
    
    it('should return array of weekly borough data', async () => {
      const data = await getDashboardData()
      
      expect(data.weeklyByBorough).to.be.an('array')
      expect(data.weeklyByBorough.length).to.be.greaterThan(0)
      
      const firstRecord = data.weeklyByBorough[0]
      expect(firstRecord).to.have.property('weekStart')
      expect(firstRecord).to.have.property('borough')
      expect(firstRecord).to.have.property('tripVolume')
    })
    
    it('should return numeric values for KPIs', async () => {
      const data = await getDashboardData()
      
      expect(data.summary.totalRevenue).to.be.a('number')
      expect(data.summary.avgTripDistance).to.be.a('number')
      expect(data.summary.pctNightTrips).to.be.a('number')
      expect(data.summary.avgFare).to.be.a('number')
    })
  })
})
