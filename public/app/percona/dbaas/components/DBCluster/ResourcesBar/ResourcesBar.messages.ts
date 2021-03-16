import { ResourcesWithUnits } from '../DBCluster.types';

export const Messages = {
  buildResourcesLabel: (allocated: ResourcesWithUnits, allocatedWidth: number, total: ResourcesWithUnits) =>
    `${allocated.value} ${allocated.units} (${allocatedWidth}%) of ${total.value} ${total.units} used`,
  buildExpectedLabel: (expected: ResourcesWithUnits, resourceLabel: string) =>
    `Required ${resourceLabel} (${expected.value} ${expected.units})`,
  buildAllocatedLabel: (resourceLabel: string) => `Consumed ${resourceLabel}`,
  buildInsufficientLabel: (resourceLabel: string) => `Insufficient ${resourceLabel}`,
};
