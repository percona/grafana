import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BackupLogs } from '../../Backup.types';
import { ChunkedLogsViewer } from './ChunkedLogsViewer';
import { Messages } from './ChunkedLogsViewer.messages';
import { fireEvent } from '@testing-library/dom';

describe('ChunkedLogsViewer', () => {
  const getMockedLogsGetter = (logs: BackupLogs, timeout = 10): jest.Mock => {
    return jest.fn().mockReturnValue(new Promise((resolve) => setTimeout(() => resolve(logs), timeout)));
  };

  it('should show processing state in the beginning', () => {
    const getLogs = getMockedLogsGetter({ logs: [], end: true });
    render(<ChunkedLogsViewer getLogChunks={getLogs} />);
    expect(screen.getByText(Messages.pleaseRefresh)).toBeInTheDocument();
  });

  it('should show "no logs" message after loading is done', async () => {
    const getLogs = getMockedLogsGetter({ logs: [], end: true });
    render(<ChunkedLogsViewer getLogChunks={getLogs} />);
    await waitFor(() => {
      expect(screen.getByText(Messages.noLogs)).toBeInTheDocument();
    });
  });

  it('should show logs', async () => {
    const getLogs = getMockedLogsGetter({
      logs: [
        { id: 0, data: 'Log 1', time: '' },
        { id: 1, data: 'Log 2', time: '' },
      ],
      end: true,
    });
    render(<ChunkedLogsViewer getLogChunks={getLogs} />);
    await waitFor(() => {
      expect(screen.getByText((content) => content.includes('Log 1') && content.includes('Log 2'))).toBeInTheDocument();
    });
  });

  it('should show the "older logs" button when the first visible log has not ID = 0', async () => {
    const getLogs = getMockedLogsGetter({
      logs: [
        { id: 1, data: 'Log 1', time: '' },
        { id: 2, data: 'Log 2', time: '' },
      ],
      end: true,
    });
    render(<ChunkedLogsViewer getLogChunks={getLogs} />);
    await waitFor(() => {
      expect(screen.getByText(Messages.loadOlderLogs)).toBeInTheDocument();
    });
  });

  it('should show the "newer logs" button when the logs haven\'t reached the end', async () => {
    const getLogs = getMockedLogsGetter({
      logs: [
        { id: 1, data: 'Log 1', time: '' },
        { id: 2, data: 'Log 2', time: '' },
      ],
      end: false,
    });
    render(<ChunkedLogsViewer getLogChunks={getLogs} />);
    await waitFor(() => {
      expect(screen.getByText(Messages.loadNewerLogs)).toBeInTheDocument();
    });
  });

  it('should show a loading message when retrieving logs', async () => {
    const getLogs = getMockedLogsGetter({
      logs: [
        { id: 1, data: 'Log 1', time: '' },
        { id: 2, data: 'Log 2', time: '' },
      ],
      end: false,
    });
    const { getByText, getAllByText, getAllByRole } = render(<ChunkedLogsViewer getLogChunks={getLogs} />);
    await waitFor(() => {
      expect(getByText(Messages.loadNewerLogs)).toBeInTheDocument();
    });
    const [btn] = getAllByRole('button');
    getLogs.mockReturnValueOnce(new Promise((resolve) => setTimeout(() => resolve({}), 20)));
    fireEvent.click(btn);
    expect(getAllByText(Messages.loading)).toHaveLength(2);
  });
});
