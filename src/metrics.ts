import * as client from 'prom-client';

export const register = new client.Registry();
client.collectDefaultMetrics({ register });

export const httpRequestCounter = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers: [register]
});

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_millis',
  help: 'HTTP request durations in milliseconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [100, 500, 1000, 2000, 5000],
  registers: [register]
});

export const dbConnectionsGauge = new client.Gauge({
  name: 'db_connections_active',
  help: 'Active DB connections',
  labelNames: ['database'],
  registers: [register]
});
