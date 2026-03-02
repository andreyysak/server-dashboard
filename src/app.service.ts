import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import * as os from 'os';

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  getStart(): string {
    return 'Dashboard API v1.0 is running...';
  }

  async getHealth() {
    const dbStatus = this.dataSource.isInitialized ? 'up' : 'down';
    const memoryUsage = process.memoryUsage();

    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      system: {
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        memory: {
          rss: `${Math.round(memoryUsage.rss / 1024 / 1024)}MB`,
          heapTotal: `${Math.round(memoryUsage.heapTotal / 1024 / 1024)}MB`,
          heapUsed: `${Math.round(memoryUsage.heapUsed / 1024 / 1024)}MB`,
        },
        cpuLoad: os.loadavg(),
        freeMem: `${Math.round(os.freemem() / 1024 / 1024)}MB`,
      },
      database: {
        status: dbStatus,
        type: this.dataSource.options.type,
        databaseName: this.dataSource.options.database,
      },
      version: '1.0.0',
      uptime: this.formatUptime(process.uptime()),
    };
  }

  private formatUptime(seconds: number): string {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    return `${d}d ${h}h ${m}m ${s}s`;
  }

  getMetadata() {
    return {
      environment: process.env.NODE_ENV || 'development',
      swagger: '/api',
      totalModules: 12,
      activeStrategies: ['jwt', 'google'],
    };
  }

  getConfig() {
    return {
      authMethods: ['google', 'telegram'],
      maxUploadSize: '5MB',
      supportedCurrencies: ['UAH', 'USD', 'EUR'],
      apiPrefix: '/api/v1',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  getStartHtml(): string {
    const health = {
      uptime: this.formatUptime(process.uptime()),
      db: this.dataSource.isInitialized ? 'Connected' : 'Disconnected',
      memory: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
      load: os.loadavg()[0].toFixed(2),
    };

    return `
    <!DOCTYPE html>
    <html lang="uk">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard API Status</title>
        <style>
            body { font-family: 'Inter', -apple-system, sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; min-height: 100vh; margin: 0; }
            .container { background: #1e293b; padding: 2.5rem; border-radius: 20px; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.5); text-align: center; border: 1px solid #334155; max-width: 500px; width: 100%; }
            h1 { color: #38bdf8; margin-bottom: 0.5rem; font-size: 2rem; letter-spacing: -0.025em; }
            .status-badge { background: #064e3b; color: #4ade80; padding: 0.5rem 1.2rem; border-radius: 9999px; font-size: 0.875rem; font-weight: 600; display: inline-flex; align-items: center; gap: 8px; margin-bottom: 2rem; }
            .dot { width: 8px; height: 8px; background: #4ade80; border-radius: 50%; animation: pulse 2s infinite; }
            @keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; text-align: left; margin-bottom: 2rem; border-top: 1px solid #334155; padding-top: 1.5rem; }
            .info-item label { color: #94a3b8; font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 0.25rem; }
            .info-item span { font-weight: 600; font-size: 1rem; color: #f1f5f9; }
            .btn-group { display: flex; gap: 10px; }
            .btn { flex: 1; background: #38bdf8; color: #0f172a; text-decoration: none; padding: 0.875rem; border-radius: 12px; font-weight: 700; transition: all 0.2s; }
            .btn:hover { background: #7dd3fc; transform: translateY(-2px); }
            .btn-secondary { background: #334155; color: #f8fafc; }
            .btn-secondary:hover { background: #475569; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Dashboard API</h1>
            <div class="status-badge"><span class="dot"></span> System Operational</div>
            
            <div class="info-grid">
                <div class="info-item">
                    <label>Node.js Version</label>
                    <span>${process.version}</span>
                </div>
                <div class="info-item">
                    <label>Database</label>
                    <span style="color: ${health.db === 'Connected' ? '#4ade80' : '#ef4444'}">${health.db}</span>
                </div>
                <div class="info-item">
                    <label>Memory Usage</label>
                    <span>${health.memory}</span>
                </div>
                <div class="info-item">
                    <label>System Load</label>
                    <span>${health.load}</span>
                </div>
                <div class="info-item">
                    <label>Uptime</label>
                    <span>${health.uptime}</span>
                </div>
                <div class="info-item">
                    <label>Environment</label>
                    <span style="text-transform: capitalize;">${process.env.NODE_ENV || 'development'}</span>
                </div>
            </div>

            <div class="btn-group">
                <a href="/api" class="btn">Swagger UI</a>
                <a href="/api/health" class="btn btn-secondary">JSON Health</a>
            </div>
        </div>
    </body>
    </html>
    `;
  }
}
