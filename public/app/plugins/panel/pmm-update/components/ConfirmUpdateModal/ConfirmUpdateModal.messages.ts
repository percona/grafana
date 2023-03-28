export const Messages = {
  title: 'PMM Upgrade',
  version: (oldVersion: string, newVersion: string) =>
    `Your PMM is currently in the version is ${oldVersion} and you’re about to upgrade to the version ${newVersion}. `,
  checkWhatsNew: "Check what's new in this version",
  dot: '.',
  instanceStop:
    'Your PMM instance will stop during the upgrade process. Once stopped, depending on your system, it may take more than a few minutes to get back up.',
  learnMore: 'If you need to learn more what will happen and how to prepare your upgrade, ',
  checkDocs: 'check our documentation',
  cancel: 'Cancel',
  upgrade: 'Upgrade now',
};
