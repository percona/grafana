import React from 'react';
import { asyncAct } from 'app/percona/shared/helpers/testUtils';
import { render, screen } from '@testing-library/react';
import { BackupLogs } from '../../Backup.types';
import { ChunkedLogsViewer } from './ChunkedLogsViewer';
import { Messages } from './ChunkedLogsViewer.messages';
import userEvent from '@testing-library/user-event';

describe('ChunkedLogsViewer', () => {
  const getMockedLogsGetter = (logs: BackupLogs, timeout = 10): jest.Mock => {
    return jest.fn().mockReturnValue(new Promise((resolve) => setTimeout(() => resolve(logs), timeout)));
  };
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should show processing state in the beginning', () => {
    const getLogs = getMockedLogsGetter({ logs: [], end: true });
    render(<ChunkedLogsViewer getLogChunks={getLogs} />);
    expect(screen.getByText(Messages.pleaseRefresh)).toBeInTheDocument();
  });

  it('should show "no logs" message after loading is done', async () => {
    const getLogs = getMockedLogsGetter({ logs: [], end: true });
    await asyncAct(() => {
      render(<ChunkedLogsViewer getLogChunks={getLogs} />);
      jest.advanceTimersByTime(10);
    });
    expect(screen.getByText(Messages.noLogs)).toBeInTheDocument();
  });

  it('should show logs', async () => {
    const getLogs = getMockedLogsGetter({
      logs: [
        { id: 0, data: 'Log 1', time: '' },
        { id: 1, data: 'Log 2', time: '' },
      ],
      end: true,
    });
    await asyncAct(() => {
      render(<ChunkedLogsViewer getLogChunks={getLogs} />);
      jest.advanceTimersByTime(10);
    });
    expect(screen.getByText((content) => content.includes('Log 1') && content.includes('Log 2'))).toBeInTheDocument();
  });

  it('should show the "older logs" button when the first visible log has not ID = 0', async () => {
    const getLogs = getMockedLogsGetter({
      logs: [
        { id: 1, data: 'Log 1', time: '' },
        { id: 2, data: 'Log 2', time: '' },
      ],
      end: true,
    });
    await asyncAct(() => {
      render(<ChunkedLogsViewer getLogChunks={getLogs} />);
      jest.advanceTimersByTime(10);
    });

    expect(screen.getByText(Messages.loadOlderLogs)).toBeInTheDocument();
  });

  it('should show the "newer logs" button when the logs haven\'t reached the end', async () => {
    const getLogs = getMockedLogsGetter({
      logs: [
        { id: 1, data: 'Log 1', time: '' },
        { id: 2, data: 'Log 2', time: '' },
      ],
      end: false,
    });
    await asyncAct(() => {
      render(<ChunkedLogsViewer getLogChunks={getLogs} />);
      jest.advanceTimersByTime(10);
    });

    expect(screen.getByText(Messages.loadNewerLogs)).toBeInTheDocument();
  });

  it('should show a loading message when retrieving logs', async () => {
    const getLogs = getMockedLogsGetter({
      logs: [
        { id: 1, data: 'Log 1', time: '' },
        { id: 2, data: 'Log 2', time: '' },
      ],
      end: false,
    });
    await asyncAct(() => {
      render(<ChunkedLogsViewer getLogChunks={getLogs} />);
      jest.advanceTimersByTime(10);
    });

    await asyncAct(() => {
      getLogs.mockReturnValueOnce(new Promise((resolve) => setTimeout(() => resolve({}), 20)));
      userEvent.click(screen.getAllByRole('button')[0]);
    });

    expect(screen.getAllByText(Messages.loading)).toHaveLength(2);
  });
});
