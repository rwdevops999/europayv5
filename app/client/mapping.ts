import { tService, tServiceAction } from "@/lib/prisma-types";
import { Data } from "@/lib/types";

/**
 * map serviceactions to Data
 *
 * @param _serviceactions the serviceactions (tServiceAction[])
 *
 * @returns Data[] the mapped data
 */
const mapServiceActions = (_serviceactions: tServiceAction[]): Data[] => {
  let result: Data[] = _serviceactions.map((_serviceaction: tServiceAction) => {
    let item: Data = {
      id: _serviceaction.id,
      name: _serviceaction.serviceactionname,
      description: "",
      children: [],
    };

    return item;
  });

  return result;
};

/**
 * map services to Data
 *
 * @param _services the services (tService[])
 *
 * @returns Data[] the mapped data (with serviceactions as children)
 */
export const mapServices = (_services: tService[]): Data[] => {
  let result: Data[] = _services.map((_service: tService) => {
    let item: Data = {
      id: _service.id,
      name: _service.servicename,
      description: "",
      children: mapServiceActions(_service.serviceactions),
    };

    return item;
  });

  return result;
};
