import { psmdbComponentOptionsStubs, versionsStubs as versions } from './__mocks__/componentsVersionsStubs';
import {
  buildVersionsFieldName,
  componentsToOptions,
  findRecommendedVersions,
  requiredVersions,
  versionsToOptions,
} from './ManageComponentsVersions.utils';
import { psmdbComponentsVersionsStubs, versionsStub as versionsAPI } from '../../DBCluster/__mocks__/dbClustersStubs';
import { ManageComponentVersionsFields } from './ManageComponentsVersionsModal.types';

describe('ManageComponentsVersions.utils::', () => {
  it('checks that at least one version is checked', () => {
    expect(requiredVersions(versions)).toBeUndefined();
    expect(requiredVersions(versions.map(v => ({ ...v, value: false })))).not.toBeUndefined();
  });
  it('converts components to options', () => {
    const components = psmdbComponentsVersionsStubs.versions[0].matrix;

    expect(componentsToOptions(components)).toEqual(psmdbComponentOptionsStubs);
  });
  it('converts versions to options', () => {
    expect(versionsToOptions(versionsAPI)).toEqual(versions);
  });
  it('builds versions field name', () => {
    const values = {
      [ManageComponentVersionsFields.operator]: { value: 'test_operator' },
      [ManageComponentVersionsFields.component]: { value: 'test_component' },
    };

    expect(buildVersionsFieldName(values)).toEqual('test_operatortest_component');
  });
  it('finds recommended versions', () => {
    expect(findRecommendedVersions(versions).length).toBe(1);
    expect(findRecommendedVersions([versions[0]]).length).toBe(0);
  });
});
