import { getResourcesWidth } from './ResourcesBar.utils';

describe('ResourcesBar.utils::', () => {
  it('returns correct width', () => {
    expect(getResourcesWidth(1.5, 6)).toEqual(25);
    expect(getResourcesWidth(1.6, 6)).toEqual(26.7);
    expect(getResourcesWidth(5.6, 64)).toEqual(8.8);
    expect(getResourcesWidth(63.8, 64)).toEqual(99.7);
    expect(getResourcesWidth(10, 80)).toEqual(12.5);
    expect(getResourcesWidth(20, 80)).toEqual(25);
  });
});
