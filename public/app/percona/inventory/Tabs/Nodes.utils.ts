export const stripNodeId = (serviceId: string) => {
  const regex = /\/node_id\/(.*)/gm;
  const match = regex.exec(serviceId);

  if (match && match.length > 0) {
    return match[1] || '';
  }

  return '';
};

export const formatNodeId = (nodeId: string) => `/node_id/${nodeId}`;
