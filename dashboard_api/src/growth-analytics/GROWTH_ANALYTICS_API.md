# Growth Analytics API Documentation

## Overview

The Growth Analytics module provides comprehensive tracking and analysis of user progression, including average levels, unlock rates, drop-off points, and cohort analysis over time.

## Features

- **Time-series tracking**: Track user metrics over time with daily granularity
- **Cohort analysis**: Group users into cohorts and analyze their behavior
- **Plateau prediction**: Use trend analysis to predict when users will plateau
- **Drop-off analysis**: Identify at which levels users tend to drop off
- **Chart-ready JSON**: Get data formatted for frontend visualization

## API Endpoints

### Metrics Management

#### Create Growth Metric
\`\`\`
POST /growth-analytics/metrics
\`\`\`

**Request Body:**
\`\`\`json
{
  "userId": "123e4567-e89b-12d3-a456-426614174000",
  "cohortId": "Q1-2025-Users",
  "metricDate": "2025-10-06",
  "userLevel": 15,
  "unlocksCount": 3,
  "dropOffPoint": null,
  "sessionDuration": 3600,
  "isActive": true
}
\`\`\`

#### Bulk Create Metrics
\`\`\`
POST /growth-analytics/metrics/bulk
\`\`\`

**Request Body:** Array of metric objects

#### Get Metrics (with filters)
\`\`\`
GET /growth-analytics/metrics?userId={uuid}&cohortId={id}&startDate={date}&endDate={date}&page=1&limit=50
\`\`\`

#### Update Metric (Drop-off points)
\`\`\`
PUT /growth-analytics/metrics/:id
\`\`\`

### Analytics Endpoints

#### Get Average Levels
\`\`\`
GET /growth-analytics/average-levels?startDate=2025-01-01&endDate=2025-10-06&cohortId=Q1-2025-Users
\`\`\`

**Response:**
\`\`\`json
[
  {
    "date": "2025-01-01",
    "averageLevel": 12.5,
    "totalUsers": 150,
    "cohortId": "Q1-2025-Users"
  }
]
\`\`\`

#### Get Unlock Rates
\`\`\`
GET /growth-analytics/unlock-rates?startDate=2025-01-01&endDate=2025-10-06&cohortId=Q1-2025-Users
\`\`\`

**Response:**
\`\`\`json
[
  {
    "date": "2025-01-01",
    "totalUnlocks": 450,
    "uniqueUsers": 150,
    "unlockRate": 3.0,
    "cohortId": "Q1-2025-Users"
  }
]
\`\`\`

#### Get Drop-off Analysis
\`\`\`
GET /growth-analytics/drop-off-analysis?startDate=2025-01-01&endDate=2025-10-06&cohortId=Q1-2025-Users
\`\`\`

**Response:**
\`\`\`json
[
  {
    "level": 10,
    "dropOffCount": 25,
    "dropOffPercentage": 16.67
  }
]
\`\`\`

#### Get Chart Data (Combined)
\`\`\`
GET /growth-analytics/chart-data?startDate=2025-01-01&endDate=2025-10-06&cohortId=Q1-2025-Users
\`\`\`

**Response:**
\`\`\`json
{
  "averageLevels": {
    "type": "line",
    "data": [...],
    "xAxis": "date",
    "yAxis": "averageLevel",
    "title": "Average User Levels Over Time"
  },
  "unlockRates": {...},
  "dropOffAnalysis": {...}
}
\`\`\`

#### Predict Plateaus
\`\`\`
GET /growth-analytics/predict-plateaus?cohortId=Q1-2025-Users
\`\`\`

**Response:**
\`\`\`json
{
  "plateauLevel": 45,
  "confidence": 0.85,
  "daysToPlateauEstimate": 15,
  "trend": "increasing"
}
\`\`\`

#### Get Segmented Levels
\`\`\`
GET /growth-analytics/segmented-levels?startDate=2025-01-01&endDate=2025-10-06
\`\`\`

**Response:**
\`\`\`json
[
  {
    "range": "0-9",
    "userCount": 50
  },
  {
    "range": "10-19",
    "userCount": 75
  }
]
\`\`\`

### Cohort Management

#### Create Cohort
\`\`\`
POST /growth-analytics/cohorts
\`\`\`

**Request Body:**
\`\`\`json
{
  "cohortName": "Q1-2025-Users",
  "startDate": "2025-01-01",
  "endDate": "2025-03-31",
  "description": "Users who joined in Q1 2025",
  "userCount": 150
}
\`\`\`

#### Get All Cohorts
\`\`\`
GET /growth-analytics/cohorts
\`\`\`

#### Get Cohort by ID
\`\`\`
GET /growth-analytics/cohorts/:id
\`\`\`

#### Delete Cohort
\`\`\`
DELETE /growth-analytics/cohorts/:id
\`\`\`

#### Get Cohort Analysis
\`\`\`
GET /growth-analytics/cohorts/:id/analysis
\`\`\`

**Response:**
\`\`\`json
{
  "cohortId": "123e4567-e89b-12d3-a456-426614174000",
  "cohortName": "Q1-2025-Users",
  "totalUsers": 150,
  "averageLevel": 18.5,
  "totalUnlocks": 2250,
  "retentionRate": 78.5
}
\`\`\`

## Database Schema

### growth_metrics Table
- `id`: UUID (Primary Key)
- `user_id`: UUID (Indexed)
- `cohort_id`: VARCHAR (Indexed)
- `metric_date`: DATE (Indexed)
- `user_level`: INTEGER
- `unlocks_count`: INTEGER
- `drop_off_point`: INTEGER (Nullable)
- `is_active`: BOOLEAN
- `session_duration`: INTEGER (seconds)
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

### cohorts Table
- `id`: UUID (Primary Key)
- `cohort_name`: VARCHAR (Unique, Indexed)
- `start_date`: DATE
- `end_date`: DATE (Nullable)
- `description`: TEXT
- `user_count`: INTEGER
- `created_at`: TIMESTAMP
- `updated_at`: TIMESTAMP

## Setup Instructions

1. **Add the module to your app.module.ts:**
\`\`\`typescript
import { GrowthAnalyticsModule } from './growth-analytics/growth-analytics.module';

@Module({
  imports: [
    // ... other imports
    GrowthAnalyticsModule,
  ],
})
export class AppModule {}
\`\`\`

2. **Run the database migration:**
\`\`\`bash
# Execute the SQL script to create tables
psql -U your_user -d your_database -f scripts/create-growth-analytics-tables.sql

# Optional: Seed sample data
psql -U your_user -d your_database -f scripts/seed-growth-analytics-sample-data.sql
\`\`\`

3. **Enable authentication (optional):**
Uncomment the `@UseGuards(JwtAuthGuard)` and `@ApiBearerAuth()` decorators in the controller.

## Usage Examples

### Tracking Daily User Progress
\`\`\`typescript
// Create a daily metric for a user
await fetch('/growth-analytics/metrics', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    userId: 'user-uuid',
    cohortId: 'Q1-2025-Users',
    metricDate: new Date().toISOString().split('T')[0],
    userLevel: 15,
    unlocksCount: 2,
    isActive: true,
    sessionDuration: 1800
  })
});
\`\`\`

### Analyzing Growth Trends
\`\`\`typescript
// Get average levels for the last 30 days
const thirtyDaysAgo = new Date();
thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

const avgLevels = await fetch(
  `/growth-analytics/average-levels?startDate=${thirtyDaysAgo.toISOString().split('T')[0]}&endDate=${new Date().toISOString().split('T')[0]}`
);
\`\`\`

### Cohort Comparison
\`\`\`typescript
// Compare two cohorts
const cohort1Analysis = await fetch('/growth-analytics/cohorts/cohort-1-id/analysis');
const cohort2Analysis = await fetch('/growth-analytics/cohorts/cohort-2-id/analysis');
\`\`\`

## Performance Considerations

- All date-based queries use indexes for optimal performance
- Composite indexes on `(user_id, metric_date)` and `(cohort_id, metric_date)` for common query patterns
- Pagination is implemented for large result sets
- Aggregation queries use database-level GROUP BY for efficiency

## Future Enhancements

- Real-time streaming analytics
- Machine learning-based plateau prediction
- A/B testing integration
- Custom metric definitions
- Automated alerting for anomalies
