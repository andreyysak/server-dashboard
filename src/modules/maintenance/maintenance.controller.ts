import {ApiBearerAuth, ApiTags} from "@nestjs/swagger";
import {Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, Req, UseGuards} from "@nestjs/common";
import {AuthGuard} from "@nestjs/passport";
import {MaintenanceService} from "./maintenance.service";
import {CreateMaintenanceDto} from "./dto/create-maintenance.dto";
import {UpdateMaintenanceDto} from "./dto/update-maintenance.dto";
import {MaintenanceSeeder} from "./seeders/maintenance.seeder";

@ApiTags('Maintenance')
@ApiBearerAuth()
@UseGuards(AuthGuard('jwt'))
@Controller('maintenance')
export class MaintenanceController {
  constructor(
      private readonly maintenanceService: MaintenanceService,
      private readonly maintenanceSeeder: MaintenanceSeeder,
  ) {}

  @Post()
  create(@Req() req, @Body() dto: CreateMaintenanceDto) {
    return this.maintenanceService.create(req.user.user_id, dto);
  }

  @Get()
  findAll(@Req() req, @Query('carId') carId?: string) {
    return this.maintenanceService.findAll(req.user.user_id, carId ? +carId : undefined);
  }

  @Get(':id')
  findOne(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.maintenanceService.findOne(req.user.user_id, id);
  }

  @Patch(':id')
  update(
      @Req() req,
      @Param('id', ParseIntPipe) id: number,
      @Body() dto: UpdateMaintenanceDto
  ) {
    return this.maintenanceService.update(req.user.user_id, id, dto);
  }

  @Delete(':id')
  remove(@Req() req, @Param('id', ParseIntPipe) id: number) {
    return this.maintenanceService.remove(req.user.user_id, id);
  }

  @Post('seed')
  async seed(@Req() req) {
    return await this.maintenanceSeeder.seed(req.user.user_id);
  }
}