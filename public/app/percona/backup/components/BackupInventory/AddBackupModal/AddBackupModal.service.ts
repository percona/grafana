import { SelectableValue } from '@grafana/data';
import { InventoryService } from 'app/percona/inventory/Inventory.service';
import { StorageLocationsService } from '../../StorageLocations/StorageLocations.service';

export const loadServiceOptions = async (): Promise<Array<SelectableValue<string>>> => {
  let result: Array<SelectableValue<string>> = [];
  const services = await InventoryService.getServices();

  // TODO remove this constraint when more DB types are supported
  if (services.mysql) {
    result = services.mysql.map(({ id, name }): SelectableValue<string> => ({ label: name, value: id }));
  }

  return result;
};

export const loadLocationOptions = async (): Promise<Array<SelectableValue<string>>> => {
  const { locations = [] } = await StorageLocationsService.list();

  return locations.map(({ location_id, name }): SelectableValue<string> => ({ label: name, value: location_id }));
};
