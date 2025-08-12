"use client";

import { loadServices } from "@/app/server/services";
import { cn } from "@/lib/util";
import { tService } from "@/lib/prisma-types";
import { JSX, useEffect, useRef, useState } from "react";

/**
 * EXAMPLE
 * 
      <ServiceSelect
        label="Service"
        addAllItem
        asFieldSet
        size="sm"
        changeServiceHandler={handleChangeService}
      />
 */
export interface ServiceSelectProps {
  id?: number;
  label?: string;
  asFieldSet?: boolean;
  defaultService?: number | undefined;
  addAllItem?: boolean;
  className?: string;
  initialFeedback?: boolean;
  size?: string;
  changeServiceHandler?: (_data: number | undefined) => void;
  services?: tService[];
}

/**
 * For the selection of a service
 *
 * @params
 * label: the label to display
 * asFieldSet: display the label above the select (when defined)
 * defaultService: the service to select by default
 * addAllItem: add 'All' to the list (becomes undefined in callback)
 * className: not used at the moment
 * initialFeedback: when the callback needs to be called when the select box is finished in initialise
 * size: the size of the combo box (xs, md, lg, ...)
 */

const ServiceSelect = (props: ServiceSelectProps) => {
  const [serviceNames, setServiceNames] = useState<string[]>([]);

  const [selectedService, setSelectedService] = useState<string>("");

  const services = useRef<tService[]>([]);

  const processServices = (
    _serviceId: number | undefined,
    _services: tService[]
  ): void => {
    services.current = _services;

    const names: string[] = _services.map(
      (value: tService) => value.servicename
    );

    if (props.addAllItem) {
      setServiceNames(["All", ...names]);
    } else {
      setServiceNames(names);
    }

    let servicename: string | undefined = undefined;
    if (_serviceId) {
      servicename = _services.find(
        (_service: tService) => _service.id === _serviceId
      )?.servicename;
    }

    if (servicename) {
      setSelectedService(servicename);
    } else if (props.addAllItem) {
      setSelectedService("All");
    } else {
      if (services.current && services.current.length > 0) {
        setSelectedService(
          services.current ? services.current[0].servicename : "Select service"
        );
      }
    }

    if (props.initialFeedback && props.changeServiceHandler) {
      props.changeServiceHandler(_serviceId);
    }
  };

  const loadTheServices = async (
    _serviceId: number | undefined
  ): Promise<void> => {
    await loadServices().then((values: tService[]) =>
      processServices(_serviceId, values)
    );
  };

  useEffect(() => {
    if (props.services) {
      processServices(props.defaultService, props.services);
    } else {
      loadTheServices(props.defaultService);
    }
  }, []);

  useEffect(() => {
    processServices(props.defaultService, services.current);
  }, [props]);

  const handleChangeService = (_service: string): void => {
    if (props.changeServiceHandler) {
      if (_service === "All") {
        setSelectedService("All");
        props.changeServiceHandler(undefined);
      } else {
        const service: tService | undefined = services.current.find(
          (service: tService) => service.servicename === _service
        );
        if (service) {
          setSelectedService(service.servicename);
          props.changeServiceHandler(service.id);
        }
      }
    }
  };

  const ServiceSelector = (): JSX.Element => {
    return (
      <select
        defaultValue={selectedService}
        className={cn(
          "select select-xs select-neutral border-1 border-base-content/30",
          props.size ? `select-${props.size}` : "",
          props.className
        )}
        onChange={(_e) => handleChangeService(_e.target.value)}
      >
        <option disabled={true}>Select service</option>
        {serviceNames.map((value: string) => (
          <option key={value}>{value}</option>
        ))}
      </select>
    );
  };

  if (props.asFieldSet) {
    return (
      <fieldset className="fieldset">
        <legend className="fieldset-legend">{props.label}</legend>
        <ServiceSelector />
      </fieldset>
    );
  } else {
    return (
      <div className="flex items-center">
        <label className="ml-1 mr-2">{props.label}</label>
        <ServiceSelector />
      </div>
    );
  }
};

export default ServiceSelect;
