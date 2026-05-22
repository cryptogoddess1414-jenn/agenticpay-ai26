import { useState, useEffect, useCallback } from 'react';

function randomBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateHourlyData(hours = 24) {
  const now = new Date();
  return Array.from({ length: hours }, (_, i) => {
    const t = new Date(now - (hours - 1 - i) * 3600 * 1000);
    return {
      time: t.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      requests: randomBetween(1200, 8500),
      errors: randomBetween(5, 120),
      latency: randomBetween(40, 280),
    };
  });
}

function generateDailyRevenue(days = 30) {
  let cumulative = 42000;
  return Array.from({ length: days }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (days - 1 - i));
    const daily = randomBetween(800, 4200);
    cumulative += daily;
    return {
      date: d.toLocaleDateString([], { month: 'short', day: 'numeric' }),
      daily,
      cumulative,
      mrr: randomBetween(12000, 18000),
    };
  });
}

const ENDPOINTS = [
  { path: '/v1/charges', method: 'POST' },
  { path: '/v1/customers', method: 'GET' },
  { path: '/v1/subscriptions', method: 'GET' },
  { path: '/v1/payment_intents', method: 'POST' },
  { path: '/v1/refunds', method: 'POST' },
  { path: '/v1/webhooks', method: 'GET' },
];

function generateEndpoints() {
  return ENDPOINTS.map(e => ({
    ...e,
    calls: randomBetween(200, 12000),
    p99: randomBetween(60, 400),
    errorRate: (Math.random() * 3).toFixed(2),
  })).sort((a, b) => b.calls - a.calls);
}

export function useDashboardData() {
  const [hourly, setHourly] = useState(() => generateHourlyData());
  const [revenue, setRevenue] = useState(() => generateDailyRevenue());
  const [endpoints, setEndpoints] = useState(() => generateEndpoints());
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refresh = useCallback(() => {
    setHourly(prev => {
      const next = [...prev.slice(1)];
      const last = new Date();
      next.push({
        time: last.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        requests: randomBetween(1200, 8500),
        errors: randomBetween(5, 120),
        latency: randomBetween(40, 280),
      });
      return next;
    });
    setEndpoints(generateEndpoints());
    setLastUpdated(new Date());
  }, []);

  useEffect(() => {
    const id = setInterval(refresh, 5000);
    return () => clearInterval(id);
  }, [refresh]);

  const totals = {
    requests: hourly.reduce((s, d) => s + d.requests, 0),
    errors: hourly.reduce((s, d) => s + d.errors, 0),
    avgLatency: Math.round(hourly.reduce((s, d) => s + d.latency, 0) / hourly.length),
    revenue: revenue[revenue.length - 1]?.cumulative ?? 0,
  };

  return { hourly, revenue, endpoints, totals, lastUpdated, refresh };
}