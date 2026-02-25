import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ExportCsvService } from './csv.service';
import { ExportPdfService } from './pdf.service';
import { ExportExcelService } from './excel.service';

@Module({
  imports: [HttpModule],
  providers: [ExportCsvService, ExportPdfService, ExportExcelService],
  exports: [ExportCsvService, ExportPdfService, ExportExcelService],
})
export class ExportModule {}
