import React from 'react';
import { Icon } from '@grafana/ui';
import { DBClusterName } from './DBClusterName';
import { dbClustersStub } from '../__mocks__/dbClustersStubs';
import { render, screen } from '@testing-library/react';

jest.mock('@grafana/ui', () => ({
  ...jest.requireActual('@grafana/ui'),
  Icon: jest.fn(() => <div data-testd="icon" />),
}));

describe('DBClusterName::', () => {
  it('renders correctly with name and icon', () => {
    const cluster = dbClustersStub[0];
    const { container } = render(<DBClusterName dbCluster={cluster} />);

    expect(container).toHaveTextContent(cluster.clusterName);
    expect(Icon).toHaveBeenCalled();
  });
  it('renders correctly MySQL cluster URL', () => {
    const cluster = dbClustersStub[0];
    render(<DBClusterName dbCluster={cluster} />);

    expect(screen.getByRole('link').getAttribute('href')).toContain('pxc');
    expect(screen.getByRole('link').getAttribute('href')).toContain(cluster.clusterName);
  });
  it('renders correctly MongoDB cluster URL', () => {
    const cluster = dbClustersStub[2];
    render(<DBClusterName dbCluster={cluster} />);

    expect(screen.getByRole('link').getAttribute('href')).toContain('mongodb');
    expect(screen.getByRole('link').getAttribute('href')).toContain(cluster.clusterName);
  });
});
