import { IconName } from '@grafana/data';

import { Messages } from '../Inventory.messages';

import { QuickInstallTech } from './NodesInstallCommand.utils';

export const QUICK_INSTALL_ICON_MAP: Record<QuickInstallTech, IconName> = {
  mysql: 'percona-database-mysql',
  postgresql: 'percona-database-postgresql',
  mongodb: 'percona-database-mongodb',
  valkey: 'percona-database-valkey',
};

export const QUICK_INSTALL_OPTIONS: Array<{ tech: QuickInstallTech; label: string; icon: IconName }> = [
  { tech: 'mysql', label: Messages.nodes.addNodeMySQL, icon: QUICK_INSTALL_ICON_MAP.mysql },
  { tech: 'postgresql', label: Messages.nodes.addNodePostgreSQL, icon: QUICK_INSTALL_ICON_MAP.postgresql },
  { tech: 'mongodb', label: Messages.nodes.addNodeMongoDB, icon: QUICK_INSTALL_ICON_MAP.mongodb },
  { tech: 'valkey', label: Messages.nodes.addNodeValkey, icon: QUICK_INSTALL_ICON_MAP.valkey },
];
