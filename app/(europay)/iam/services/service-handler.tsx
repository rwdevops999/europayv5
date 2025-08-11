"use client";

import { mapServices } from "@/app/client/mapping";
import { tService } from "@/lib/prisma-types";
import { Data } from "@/lib/types";
import { DataTable } from "@/ui/datatable/data-table";
import PageItemContainer from "@/ui/page-item-container";
import ServiceSelect from "@/ui/service-select";
import { useEffect, useState } from "react";
import { columns } from "./table/columns";
import { DataTableToolbar } from "./table/data-table-toolbar";

const ServiceHandler = ({
  serviceId,
  services,
}: {
  serviceId: number | undefined;
  services: tService[];
}) => {
  const [tableData, setTableData] = useState<Data[]>([]);
  const [sid, setSid] = useState<number | undefined>();

  useEffect(() => {
    if (serviceId) {
      const service: tService = services.find(
        (service: tService) => service.id === serviceId
      )!;
      if (service) {
        setTableData(mapServices([service]));
      } else {
        setTableData(mapServices(services));
        serviceId = undefined;
      }
    } else {
      setTableData(mapServices(services));
    }

    setSid(serviceId);
  }, []);

  const handleChangeService = (_serviceId: number | undefined): void => {
    let _services: tService[] = [];
    if (_serviceId) {
      const service: tService = services.find(
        (service: tService) => service.id === _serviceId
      )!;
      _services = [service];
    } else {
      _services = services;
    }

    setTableData(mapServices(_services));
    setSid(_serviceId);
  };

  const renderComponent = () => {
    return (
      <div
        data-testid="services"
        id="services"
        className="w-[99vw] h-[83vh] rounded-sm grid items-start gap-2 grid-cols-1 grid-rows-10 overflow-y-scroll"
      >
        <PageItemContainer
          data-testid="services-service-select"
          title="service select"
        >
          <div className="flex items-center space-x-2">
            <ServiceSelect
              defaultService={sid}
              addAllItem
              changeServiceHandler={handleChangeService}
              services={services}
            />
          </div>
        </PageItemContainer>
        <PageItemContainer
          data-testid="services-service-actions"
          title="service actions"
        >
          <DataTable
            data={tableData}
            columns={columns}
            Toolbar={DataTableToolbar}
            expandAll={serviceId === undefined ? false : true}
          />
        </PageItemContainer>
      </div>
    );
  };

  return <>{renderComponent()}</>;
};

export default ServiceHandler;
