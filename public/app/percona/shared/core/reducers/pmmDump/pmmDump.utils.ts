import { PMMDumpServices, ExportDatasetService } from 'app/percona/pmm-dump/PmmDump.types';
import { PmmDump, ExportDatasetProps } from 'app/percona/shared/core/reducers/pmmDump/pmmDump.types';

export const mapDumps = (dumps: PmmDump[]): PMMDumpServices[] =>
  dumps.map((dump) => ({
    dumpId: dump.dump_id,
    status: dump.status,
    serviceNames: dump.service_names,
    startTime: dump.start_time,
    endTime: dump.end_time,
    createdAt: dump.created_at,
    encrypted: dump.encrypted,
  }));

export const mapDumpServices = (dumps: PMMDumpServices[]): PmmDump[] =>
  dumps.map((dump) => ({
    dump_id: dump.dumpId,
    status: dump.status,
    service_names: dump.serviceNames,
    start_time: dump.startTime,
    end_time: dump.endTime,
    created_at: dump.createdAt,
    encrypted: dump.encrypted ?? false,
  }));

export const mapExportData = (data: ExportDatasetService): ExportDatasetProps => ({
  service_names: data.serviceNames,
  start_time: data.startTime,
  end_time: data.endTime,
  ignore_load: data.ignoreLoad,
  export_qan: data.exportQan,
  enable_encryption: data.enableEncryption,
  encryption_password: data.encryptionPassword,
});
