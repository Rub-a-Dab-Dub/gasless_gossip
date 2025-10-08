import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateAnalyticsViews1696723200000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create materialized view for quick health check metrics
    await queryRunner.query(`
      CREATE MATERIALIZED VIEW analytics_health_check AS
      WITH latest_metrics AS (
        SELECT DISTINCT ON (metric_type) *
        FROM analytics_snapshots
        ORDER BY metric_type, timestamp DESC
      )
      SELECT 
        jsonb_build_object(
          'dau', (SELECT metrics FROM latest_metrics WHERE metric_type = 'dau'),
          'token_volume', (SELECT metrics FROM latest_metrics WHERE metric_type = 'token_volume')
        ) as current_metrics,
        MAX(timestamp) as last_updated
      FROM latest_metrics;

      CREATE UNIQUE INDEX analytics_health_check_idx ON analytics_health_check (last_updated);
    `);

    // Create materialized view for user level segmentation
    await queryRunner.query(`
      CREATE MATERIALIZED VIEW analytics_user_segments AS
      SELECT 
        date_trunc('hour', timestamp) as hour,
        metric_type,
        metrics->>'currentValue' as current_value,
        metrics->'userLevelDistribution' as level_distribution
      FROM analytics_snapshots
      WHERE timestamp >= NOW() - INTERVAL '24 hours'
      GROUP BY date_trunc('hour', timestamp), metric_type, metrics->>'currentValue', metrics->'userLevelDistribution';

      CREATE UNIQUE INDEX analytics_segments_idx ON analytics_user_segments (hour, metric_type);
    `);

    // Create hypertable for time-series optimization
    await queryRunner.query(`
      CREATE EXTENSION IF NOT EXISTS timescaledb;
      
      SELECT create_hypertable('analytics_snapshots', 'timestamp',
        chunk_time_interval => INTERVAL '1 day');
      
      CREATE INDEX ON analytics_snapshots (metric_type, timestamp DESC);
    `);

    // Create function to refresh views with minimal lock time
    await queryRunner.query(`
      CREATE OR REPLACE FUNCTION refresh_analytics_views()
      RETURNS void AS $$
      BEGIN
        REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_health_check;
        REFRESH MATERIALIZED VIEW CONCURRENTLY analytics_user_segments;
      END;
      $$ LANGUAGE plpgsql;

      -- Create trigger to auto-refresh views on data change
      CREATE TRIGGER refresh_analytics_views_trigger
      AFTER INSERT OR UPDATE ON analytics_snapshots
      FOR EACH STATEMENT
      EXECUTE FUNCTION refresh_analytics_views();
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS analytics_daily_metrics;`);
    await queryRunner.query(`DROP MATERIALIZED VIEW IF EXISTS analytics_level_distribution;`);
    await queryRunner.query(`DROP FUNCTION IF EXISTS refresh_analytics_views;`);
  }
}