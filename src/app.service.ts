import { Injectable } from '@nestjs/common';
import {DataSource} from "typeorm";

@Injectable()
export class AppService {
  constructor(private readonly dataSource: DataSource) {}

  getStart(): string {
    return 'Dashboard API v1.0 is running...'
  }

  async getHealth() {
    const dbStatus = this.dataSource.isInitialized ? 'up' : 'down';
    return {
      status: 'ok',
      timestamp: new Date().toISOString(),
      database: dbStatus,
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
      docs: 'https://github.com/your-repo#readme',
    }
  }

  getConfig() {
    return {
      authMethods: ['google', 'telegram'],
      maxUploadSize: '5MB',
      supportedCurrencies: ['UAH', 'USD', 'EUR']
    };
  }

  getStartHtml(): string {
    const health = {
      uptime: this.formatUptime(process.uptime()),
      db: this.dataSource.isInitialized ? 'Connected' : 'Disconnected',
    };

    return `
    <!DOCTYPE html>
    <html lang="uk">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard API</title>
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #0f172a; color: #f8fafc; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
            .container { background: #1e293b; padding: 2.5rem; border-radius: 16px; box-shadow: 0 10px 25px rgba(0,0,0,0.3); text-align: center; border: 1px solid #334155; max-width: 400px; width: 100%; }
            h1 { color: #38bdf8; margin-bottom: 0.5rem; font-size: 1.8rem; }
            .status-badge { background: #064e3b; color: #4ade80; padding: 0.4rem 1rem; border-radius: 20px; font-size: 0.9rem; font-weight: 600; display: inline-block; margin-bottom: 1.5rem; }
            .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; text-align: left; margin-bottom: 1.5rem; border-top: 1px solid #334155; padding-top: 1.5rem; }
            .info-item label { color: #94a3b8; font-size: 0.8rem; display: block; }
            .info-item span { font-weight: 500; font-size: 0.95rem; }
            .btn { display: block; background: #38bdf8; color: #0f172a; text-decoration: none; padding: 0.8rem; border-radius: 8px; font-weight: bold; transition: background 0.2s; }
            .btn:hover { background: #7dd3fc; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Dashboard API</h1>
            <div class="status-badge">● System Online</div>
            
            <div class="info-grid">
                <div class="info-item">
                    <label>Версія</label>
                    <span>1.0.0</span>
                </div>
                <div class="info-item">
                    <label>База даних</label>
                    <span style="color: ${health.db === 'Connected' ? '#4ade80' : '#ef4444'}">${health.db}</span>
                </div>
                <div class="info-item">
                    <label>Uptime</label>
                    <span>${health.uptime}</span>
                </div>
                <div class="info-item">
                    <label>Environment</label>
                    <span>${process.env.NODE_ENV || 'development'}</span>
                </div>
            </div>

            <a href="/api" class="btn">Відкрити Swagger Документацію</a>
        </div>
    </body>
    </html>
    `;
  }
}
