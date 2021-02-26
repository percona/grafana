export const Messages = {
  buildResourcesLabel: (allocated: number, total: number) => `${allocated} GB (${allocated}%) of ${total} GB used`,
  buildExpectedLabel: (expected: number, resourceLabel: string) => `Required ${resourceLabel} (${expected} GB)`,
  buildAllocatedLabel: (allocated: number, resourceLabel: string) => `Consumed ${resourceLabel} (${allocated} GB)`,
  buildInsufficientLabel: (resourceLabel: string) => `Insufficient ${resourceLabel}`,
};
