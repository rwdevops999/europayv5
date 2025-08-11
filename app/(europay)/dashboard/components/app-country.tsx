"use client";

import { loadCountries } from "@/app/server/country";
import { DEFAULT_COUNTRY } from "@/lib/constants";
import { stringToBoolean } from "@/lib/functions";
import { tCountry } from "@/lib/prisma-types";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/ui/cmdk/command";
import { ScrollArea, ScrollBar } from "@/ui/radix/scroll-area";
import { JSX, useEffect, useState } from "react";
import ReactHtmlParser from "react-html-parser";

const AppCountry = () => {
  const [countries, setCountries] = useState<tCountry[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<tCountry>();

  const loadTheCountries = async (): Promise<void> => {
    await loadCountries().then((_countries: tCountry[]) => {
      // setSelectedCountry(
      //   _countries.find((country: tCountry) => country.id === 760)
      // );
      setCountries(_countries);

      const apiKeyEnabled: string | undefined =
        process.env.NEXT_PUBLIC_IPREGISTRY_ENABLED;
      const keyEnabled: boolean = stringToBoolean(apiKeyEnabled);

      if (keyEnabled) {
        console.log("RETRIEVE COUNTRY FROM REGISTRY");
        const apiKey: string | undefined = process.env.NEXT_PUBLIC_IPREGISTRY;

        if (apiKey) {
          fetch(`https://api.ipregistry.co/?key=${apiKey}`)
            .then(function (response) {
              return response.json();
            })
            .then(function (payload) {
              setSelectedCountry(
                _countries.find(
                  (country: tCountry) =>
                    country.name === payload.location.country.name
                )
              );
            });
        }
      } else {
        console.log("SET HARCODED COUNTRY");
        setSelectedCountry(
          _countries.find(
            (country: tCountry) => country.name === DEFAULT_COUNTRY
          )
        );
      }
    });
  };

  useEffect(() => {
    loadTheCountries();
  }, []);

  const renderCountry = (_country: tCountry): JSX.Element => {
    const handleSelect = (_value: string): void => {
      const country: tCountry = countries.find(
        (_country: tCountry) => _country.name === _value
      )!;
      setSelectedCountry(country);
      const elem: HTMLButtonElement = document.getElementById(
        "btn-country"
      ) as HTMLButtonElement;

      if (elem) {
        elem.click();
      }
    };

    return (
      <CommandItem key={_country.id} onSelect={handleSelect}>
        <span>{_country.name}</span>
      </CommandItem>
    );
  };

  const CountryInfo = ({
    country,
  }: {
    country: tCountry | undefined;
  }): JSX.Element => {
    return (
      <div className="grid grid-cols-[65%_35%] text-sm">
        <div className="grid grid-cols-[30%_70%] text-sm">
          <label className="mr-2">country:</label>
          <div>{country?.name}</div>
        </div>
        <div className="grid grid-cols-[30%_70%] text-sm">
          <label>dial:</label>
          <div>({country?.dialCode})</div>
        </div>
        <div className="col-span-2">
          <div className="grid grid-cols-[19%_81%] text-sm">
            <label>currency:</label>
            <div className="ml-[2px]">{country?.currency}</div>
          </div>
        </div>
        <div className="col-span-2 flex justify-center mt-1">
          <div className="text-green-400 italic font-extrabold">
            {country?.currencycode}
          </div>
        </div>
        <div className="flex items-center justify-center col-span-2 mt-1">
          <div className="flex items-center justify-center w-20 h-10 border-2 p-5 border-blue-400 text-3xl">
            {ReactHtmlParser(country?.symbol!)}{" "}
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="flex justify-center">
        <button
          id="btn-country"
          className="btn btn-sm border-1 border-base-content/30"
          popoverTarget="popover-1"
          style={{ anchorName: "--anchor-1" } as React.CSSProperties}
        >
          Select country
        </button>
      </div>
      <div
        data-testid="test-country"
        className="p-1 flex text-4xl font-bold items-center justify-center"
      >
        <Command
          className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm border border-base-content/30 overflow-auto"
          popover="auto"
          id="popover-1"
          style={{ positionAnchor: "--anchor-1" } as React.CSSProperties}
        >
          <CommandInput placeholder="country..." />
          <CommandList>
            <CommandEmpty>No countries.</CommandEmpty>
            <CommandGroup>
              <ScrollArea className="overflow-auto h-[200px] min-h-[200px] max-h-[400px]">
                {countries.map((_country: tCountry) => renderCountry(_country))}
                <ScrollBar className="bg-content" />
              </ScrollArea>
            </CommandGroup>
          </CommandList>
        </Command>
      </div>
      <CountryInfo country={selectedCountry} />
    </>
  );
};

export default AppCountry;
