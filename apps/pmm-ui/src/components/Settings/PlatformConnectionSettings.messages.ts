export const Messages = {
  title: 'PMM details',

  connected: {
    section1: {
      main: 'Congratulations, you\'re all set! Your PMM instance is correctly connected to Percona Platform which gives you have access to advanced Advisors.',
      subsection1: 'Read access to your PMM Server Name',
      subsection2: 'Read access to your PMM Server ID',
    },
    section2: {
      main: 'This connection is active because you authorized Percona Platform to access the following data in accordance to Percona\'s Terms of Service and Privacy Policy.'
    },
  },

  disconnected: {
    section1: {
      main: 'By simply connecting PMM to Percona Platform to get more Advisors and have insights on:',
      subsection1: 'How to configure your databases in the best way',
      subsection2: 'What performance enhancements are available for your unique setup',
      subsection3: 'How to tighten your database security',
      subsection4: 'How to tune your database performance',
    },
  },

  button: {
    save: 'Save changes',
    disconnectPlatform: 'Disconnect Platform',
    openPerconaPlatform: 'Open Percona Platform',
    connectToPlatform: 'Connect to platform',
  },

  connectionStatusTitle: 'Platform connection status',
  badge: {
    connected: 'Connected',
    disconnected: 'Disconnected',
  },

  formLabel: {
    serverName: 'Server Name',
    serverId: 'Server ID',
  },
};
