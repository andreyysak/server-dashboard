import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';
import {
  ApiExcludeEndpoint,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('System')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Header('Content-Type', 'text/html')
  @ApiExcludeEndpoint()
  getStart(): string {
    return this.appService.getStartHtml();
  }

  @Get('health')
  @ApiOperation({
    summary: 'Детальний стан системи (Health Check)',
    description: 'Повертає статус БД, використання пам’яті та uptime',
  })
  @ApiResponse({ status: 200, description: 'Система працює стабільно' })
  async getHealth() {
    return await this.appService.getHealth();
  }

  @Get('info')
  @ApiOperation({ summary: 'Метадані та конфігурація API' })
  @ApiResponse({ status: 200, description: 'Конфігурація успішно отримана' })
  getInfo() {
    return {
      metadata: this.appService.getMetadata(),
      config: this.appService.getConfig(),
    };
  }

  @Get('version')
  @ApiOperation({ summary: 'Тільки версія застосунку' })
  getVersion() {
    return { version: '1.0.0' };
  }
}
