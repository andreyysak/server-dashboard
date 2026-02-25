import { Injectable } from '@nestjs/common';
import * as ExcelJS from 'exceljs';

@Injectable()
export class ExportExcelService {
  async generateExcel(
    sheetName: string,
    columns: Partial<ExcelJS.Column>[],
    data: any[],
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(sheetName);

    worksheet.columns = columns;

    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFE0E0E0' },
    };

    worksheet.addRows(data);

    worksheet.columns.forEach((column) => {
      const headerLength = column.header?.toString().length ?? 10;
      column.width = headerLength < 15 ? 20 : headerLength + 5;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer as ArrayBuffer);
  }
}
