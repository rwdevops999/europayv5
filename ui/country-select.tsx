"use client";

import { cn } from "@/lib/functions";
import { tCountry } from "@/lib/prisma-types";
import React, { useEffect, useState } from "react";
import { UseFormRegister, UseFormRegisterReturn } from "react-hook-form";

const CountrySelect = ({
  countries,
  selected,
  className,
  register,
  handleSetCountry,
}: {
  countries: tCountry[];
  selected?: string;
  className?: string;
  register?: UseFormRegisterReturn;
  // register?: UseFormRegister<any>;
  handleSetCountry: (_country: tCountry) => void;
}) => {
  const [selectedCountry, setSelectedCountry] = useState<string>();

  const handleCountrySelect = (
    e: React.ChangeEvent<HTMLSelectElement>
  ): void => {
    const country: tCountry = countries.find(
      (_country: tCountry) => _country.name === e.target.value
    )!;

    handleSetCountry(country);
  };

  useEffect(() => {
    setSelectedCountry(selected);
  }, [selected]);

  return (
    <select
      className={cn(
        "select h-8 block text-sm rounded-lg bg-base text-base-content",
        className
      )}
      value={selectedCountry}
      onChange={(e) => handleCountrySelect(e)}
      // {...register}
    >
      <option disabled={true}>Pick a country</option>
      {countries.map((_country: tCountry) => (
        <option key={_country.id}>{_country.name}</option>
      ))}
    </select>
  );
};

export default CountrySelect;
