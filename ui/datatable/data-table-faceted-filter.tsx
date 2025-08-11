"use client";

import { Column } from "@tanstack/react-table";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../cmdk/command";
import { JSX } from "react";
import clsx from "clsx";
import { FaCheck } from "react-icons/fa";
import { IoAddCircleOutline, IoCloseOutline } from "react-icons/io5";
import Button from "../button";
import { Separator } from "../radix/separator";

interface DataTableFacetedFilterProps<TData, TValue> {
  column?: Column<TData, TValue>;
  title?: string;
  options: any[];
}

export function DataTableFacetedFilter<TData, TValue>({
  column,
  title,
  options,
}: DataTableFacetedFilterProps<TData, TValue>) {
  const facets = column?.getFacetedUniqueValues();
  const selectedValues = new Set(column?.getFilterValue() as string[]);

  const renderOption = (_option: string): JSX.Element => {
    const isSelected = selectedValues.has(_option);

    return (
      <CommandItem
        key={_option}
        onSelect={() => {
          if (isSelected) {
            selectedValues.delete(_option);
          } else {
            selectedValues.add(_option);
          }
          const filterValues = Array.from(selectedValues);
          column?.setFilterValue(
            filterValues.length ? filterValues : undefined
          );
        }}
      >
        <div
          className={clsx(
            "flex items-center w-4 h-4 justify-center rounded-sm border border-base-content/50",
            { "text-primary": isSelected },
            { "opacity-50 [&_svg]:invisible": !isSelected }
          )}
        >
          <FaCheck />
          {/* <FaCheck className={clsx("", { hidden: !isSelected })} /> */}
        </div>
        <span>{_option}</span>
        {facets?.get(_option) && (
          <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
            {facets.get(_option)}
          </span>
        )}
      </CommandItem>
    );
  };

  const Selections = ({
    selections,
  }: {
    selections: Set<string>;
  }): JSX.Element => {
    return (
      <>
        <Separator orientation="vertical" className="ml-2 h-8" />
        <div className="hidden space-x-1 lg:flex">
          {options
            .filter((option: any) => selectedValues.has(option))
            .map((option: any) => (
              <div
                key={option}
                className="badge rounded-sm px-1 border-1 border-dotted border-base-content/30"
              >
                {option}
              </div>
            ))}
        </div>
      </>
    );
  };

  return (
    <>
      <button
        id={`btn-popover-${title}`}
        className="btn"
        popoverTarget={`popover-${title}`}
        style={{ anchorName: `--anchor-${title}` } as React.CSSProperties}
      >
        <IoAddCircleOutline />
        {title}
        {selectedValues.size > 0 && (
          <div className="badge rounded-full border-1 h-4 w-4 border-base-content/50 bg-base-content/10 px-1">
            {selectedValues.size}
          </div>
        )}
      </button>
      {selectedValues.size > 0 && <Selections selections={selectedValues} />}
      <Command
        className="dropdown menu w-52 rounded-box bg-base-100 shadow-sm border border-base-content/30"
        popover="auto"
        id={`popover-${title}`}
        style={{ positionAnchor: `--anchor-${title}` } as React.CSSProperties}
      >
        <CommandInput placeholder={title} />
        <CommandList>
          <CommandEmpty>No results.</CommandEmpty>
          <CommandGroup>
            {options.map((option) => renderOption(option))}
          </CommandGroup>
          {selectedValues.size > 0 && (
            <>
              <CommandSeparator />
              <CommandItem
                className="mt-1 justify-center cursor-pointer"
                onSelect={() => {
                  column?.setFilterValue(undefined);
                  const elem: HTMLButtonElement = document.getElementById(
                    `btn-popover-${title}`
                  ) as HTMLButtonElement;

                  if (elem) {
                    elem.click();
                  }
                }}
              >
                Clear
              </CommandItem>
            </>
          )}
          <div className="flex justify-center">
            <Button
              name=""
              className="hover:bg-transparent border-none shadow-none"
              icon={
                <IoCloseOutline
                  className="text-red-500"
                  onClick={() => {
                    const elem: HTMLButtonElement = document.getElementById(
                      `btn-popover-${title}`
                    ) as HTMLButtonElement;

                    if (elem) {
                      elem.click();
                    }
                  }}
                />
              }
            />
          </div>
        </CommandList>
      </Command>
    </>
  );
}
