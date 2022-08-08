import { Severity } from '../core';

export interface CheckStreamData {
  error?: {
    code: number;
    message: string;
    details: [
      {
        type: string;
      }
    ];
  };
  result: {
    topic: string;
    results: [
      {
        summary: string;
        description: string;
        severity: keyof typeof Severity;
        labels: {
          [key: string]: string;
        };
        read_more_url: string;
        service_name: string;
        service_id?: string;
        check_name: string;
        alert_id?: string;
        silenced?: boolean;
        alert_message: string;
      }
    ];
  };
}
