import { createObjectCsvStringifier } from 'csv-writer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExportCsvService {
  async convertToCsv(
    data: any[],
    headers: { id: string; title: string }[],
  ): Promise<string> {
    const csvStringifier = createObjectCsvStringifier({
      header: headers,
    });

    const headerString = csvStringifier.getHeaderString();
    const recordString = csvStringifier.stringifyRecords(data);

    return headerString + recordString;
  }
}
