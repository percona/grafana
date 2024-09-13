import { css } from '@emotion/css';

import { GrafanaTheme2 } from '@grafana/data';
import { MonitoringStatus } from "app/percona/inventory/Inventory.types";

export const getStyles = ({ visualization }: GrafanaTheme2, status: string | undefined) => ({
  link: css`
    text-decoration: underline;
    color: ${status === MonitoringStatus.OK ? visualization.getColorByName('green') : status === MonitoringStatus.FAILED ? visualization.getColorByName('red') : visualization.getColorByName('gray')};
  `,
});
