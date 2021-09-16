import { concatenateNewerLogs, concatenateOlderLogs } from './ChunkedLogsViewer.utils';

describe('ChunkedLogsViewer::utils', () => {
  it('should correctly concatenate newer logs', () => {
    expect(concatenateNewerLogs([{ id: 0, message: '', time: '' }], [], 3, 0)).toEqual([
      { id: 0, message: '', time: '' },
    ]);

    expect(
      concatenateNewerLogs(
        [{ id: 2, message: '', time: '' }],
        [
          { id: 3, message: '', time: '' },
          { id: 4, message: '', time: '' },
          { id: 5, message: '', time: '' },
        ],
        2,
        1
      )
    ).toEqual([
      { id: 2, message: '', time: '' },
      { id: 3, message: '', time: '' },
    ]);

    expect(
      concatenateNewerLogs(
        [{ id: 2, message: '', time: '' }],
        [
          { id: 3, message: '', time: '' },
          { id: 4, message: '', time: '' },
          { id: 5, message: '', time: '' },
        ],
        4,
        2
      )
    ).toEqual([
      { id: 2, message: '', time: '' },
      { id: 3, message: '', time: '' },
      { id: 4, message: '', time: '' },
    ]);

    expect(
      concatenateNewerLogs(
        [{ id: 2, message: '', time: '' }],
        [
          { id: 3, message: '', time: '' },
          { id: 4, message: '', time: '' },
          { id: 5, message: '', time: '' },
          { id: 6, message: '', time: '' },
          { id: 7, message: '', time: '' },
          { id: 8, message: '', time: '' },
          { id: 9, message: '', time: '' },
        ],
        1,
        5
      )
    ).toEqual([
      { id: 2, message: '', time: '' },
      { id: 3, message: '', time: '' },
      { id: 4, message: '', time: '' },
      { id: 5, message: '', time: '' },
      { id: 6, message: '', time: '' },
      { id: 7, message: '', time: '' },
    ]);

    expect(
      concatenateNewerLogs(
        [
          { id: 2, message: '', time: '' },
          { id: 3, message: '', time: '' },
          { id: 4, message: '', time: '' },
          { id: 5, message: '', time: '' },
        ],
        [
          { id: 6, message: '', time: '' },
          { id: 7, message: '', time: '' },
          { id: 8, message: '', time: '' },
          { id: 9, message: '', time: '' },
        ],
        4,
        2
      )
    ).toEqual([
      { id: 2, message: '', time: '' },
      { id: 3, message: '', time: '' },
      { id: 4, message: '', time: '' },
      { id: 5, message: '', time: '' },
      { id: 6, message: '', time: '' },
      { id: 7, message: '', time: '' },
    ]);

    expect(
      concatenateNewerLogs(
        [
          { id: 0, message: '', time: '' },
          { id: 1, message: '', time: '' },
          { id: 2, message: '', time: '' },
          { id: 3, message: '', time: '' },
          { id: 4, message: '', time: '' },
          { id: 5, message: '', time: '' },
        ],
        [
          { id: 6, message: '', time: '' },
          { id: 7, message: '', time: '' },
        ],
        4,
        2
      )
    ).toEqual([
      { id: 2, message: '', time: '' },
      { id: 3, message: '', time: '' },
      { id: 4, message: '', time: '' },
      { id: 5, message: '', time: '' },
      { id: 6, message: '', time: '' },
      { id: 7, message: '', time: '' },
    ]);

    expect(
      concatenateNewerLogs(
        [
          { id: 0, message: '', time: '' },
          { id: 1, message: '', time: '' },
          { id: 2, message: '', time: '' },
          { id: 3, message: '', time: '' },
          { id: 4, message: '', time: '' },
          { id: 5, message: '', time: '' },
        ],
        [
          { id: 6, message: '', time: '' },
          { id: 7, message: '', time: '' },
        ],
        2,
        2
      )
    ).toEqual([
      { id: 4, message: '', time: '' },
      { id: 5, message: '', time: '' },
      { id: 6, message: '', time: '' },
      { id: 7, message: '', time: '' },
    ]);
  });
  it('should correctly concatenate older logs', () => {
    expect(concatenateOlderLogs([{ id: 0, message: '', time: '' }], [], 3, 1)).toEqual([
      { id: 0, message: '', time: '' },
    ]);

    expect(
      concatenateOlderLogs(
        [{ id: 3, message: '', time: '' }],
        [
          { id: 0, message: '', time: '' },
          { id: 1, message: '', time: '' },
          { id: 2, message: '', time: '' },
        ],
        2,
        1
      )
    ).toEqual([
      { id: 2, message: '', time: '' },
      { id: 3, message: '', time: '' },
    ]);

    expect(
      concatenateOlderLogs(
        [{ id: 3, message: '', time: '' }],
        [
          { id: 0, message: '', time: '' },
          { id: 1, message: '', time: '' },
          { id: 2, message: '', time: '' },
        ],
        4,
        2
      )
    ).toEqual([
      { id: 1, message: '', time: '' },
      { id: 2, message: '', time: '' },
      { id: 3, message: '', time: '' },
    ]);

    expect(
      concatenateOlderLogs(
        [{ id: 7, message: '', time: '' }],
        [
          { id: 0, message: '', time: '' },
          { id: 1, message: '', time: '' },
          { id: 2, message: '', time: '' },
          { id: 3, message: '', time: '' },
          { id: 4, message: '', time: '' },
          { id: 5, message: '', time: '' },
          { id: 6, message: '', time: '' },
        ],
        1,
        5
      )
    ).toEqual([
      { id: 2, message: '', time: '' },
      { id: 3, message: '', time: '' },
      { id: 4, message: '', time: '' },
      { id: 5, message: '', time: '' },
      { id: 6, message: '', time: '' },
      { id: 7, message: '', time: '' },
    ]);

    expect(
      concatenateOlderLogs(
        [
          { id: 4, message: '', time: '' },
          { id: 5, message: '', time: '' },
          { id: 6, message: '', time: '' },
          { id: 7, message: '', time: '' },
        ],
        [
          { id: 0, message: '', time: '' },
          { id: 1, message: '', time: '' },
          { id: 2, message: '', time: '' },
          { id: 3, message: '', time: '' },
        ],
        4,
        2
      )
    ).toEqual([
      { id: 2, message: '', time: '' },
      { id: 3, message: '', time: '' },
      { id: 4, message: '', time: '' },
      { id: 5, message: '', time: '' },
      { id: 6, message: '', time: '' },
      { id: 7, message: '', time: '' },
    ]);

    expect(
      concatenateOlderLogs(
        [
          { id: 2, message: '', time: '' },
          { id: 3, message: '', time: '' },
          { id: 4, message: '', time: '' },
          { id: 5, message: '', time: '' },
          { id: 6, message: '', time: '' },
          { id: 7, message: '', time: '' },
        ],
        [
          { id: 0, message: '', time: '' },
          { id: 1, message: '', time: '' },
        ],
        4,
        2
      )
    ).toEqual([
      { id: 0, message: '', time: '' },
      { id: 1, message: '', time: '' },
      { id: 2, message: '', time: '' },
      { id: 3, message: '', time: '' },
      { id: 4, message: '', time: '' },
      { id: 5, message: '', time: '' },
    ]);

    expect(
      concatenateOlderLogs(
        [
          { id: 2, message: '', time: '' },
          { id: 3, message: '', time: '' },
          { id: 4, message: '', time: '' },
          { id: 5, message: '', time: '' },
          { id: 6, message: '', time: '' },
          { id: 7, message: '', time: '' },
        ],
        [
          { id: 0, message: '', time: '' },
          { id: 1, message: '', time: '' },
        ],
        2,
        2
      )
    ).toEqual([
      { id: 0, message: '', time: '' },
      { id: 1, message: '', time: '' },
      { id: 2, message: '', time: '' },
      { id: 3, message: '', time: '' },
    ]);
  });
});
