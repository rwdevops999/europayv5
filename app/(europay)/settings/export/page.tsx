"use client";

import {
  exportDataToDB,
  exportGroups,
  exportPolicies,
  exportRoles,
  exportServices,
  exportServiceStatements,
  exportUsers,
} from "@/app/server/export";
import { useMarkdownSettings } from "@/hooks/use-markdown-settings";
import { absoluteUrl } from "@/lib/functions";
import Button from "@/ui/button";
import PageContent from "@/ui/page-content";
import PageTitle from "@/ui/page-title";
import { ScrollArea, ScrollBar } from "@/ui/radix/scroll-area";
import { Separator } from "@/ui/radix/separator";
import clsx from "clsx";
import { JSX, useEffect, useRef, useState } from "react";
import { BiSolidFileExport } from "react-icons/bi";
import { BsClipboard2, BsClipboard2Check } from "react-icons/bs";
import { FaUser } from "react-icons/fa";
import { FaFileExport, FaUserGroup } from "react-icons/fa6";
import { GiScrollUnfurled } from "react-icons/gi";
import { LuClipboardList } from "react-icons/lu";
import { RiExportLine, RiPoliceBadgeLine } from "react-icons/ri";

let keyValue: number = 0;

const Export = () => {
  const { isMarkdownOn } = useMarkdownSettings();

  const [copied, setCopied] = useState<boolean>(false);
  const [enabledForExport, setEnabledForExport] = useState<boolean>(true);
  const [text, setText] = useState<any[]>([]);

  const originalText = useRef<string[]>([]);

  useEffect(() => {
    const element = document.getElementById("key0");
    if (element) {
      element.scrollIntoView();
    }
  }, [text]);

  let disabled: boolean = false;

  // MARKDOWN: for use in VSCode with extension Markdown Interactive Checkbox(from Bhnum)
  const handleCopyToClipboard = () => {
    if (!disabled) {
      if (isMarkdownOn()) {
        const newlines: string[] = originalText.current.map((line: string) => {
          let str: string = `- [ ] ${line}`;
          return str;
        });
        navigator.clipboard.writeText(newlines.join("\n"));
      } else {
        navigator.clipboard.writeText(originalText.current.join("\n"));
      }

      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    }
  };

  const DataViewer = (): JSX.Element => {
    return (
      <div className="grid grid-rows-[5%_90%]">
        <div className="border-2 border-blue-500 max-h-[5vh]">
          <div id="export" className="flex justify-between items-center">
            <div className="p-1.5 flex space-x-2 items-center text-sm">
              <RiExportLine size={16} />
              <div>Export IAM</div>
            </div>
            <div className="tooltip tooltip-left" data-tip="copy to clipboad">
              {copied ? (
                <BsClipboard2Check
                  size={16}
                  className={clsx(
                    "mr-2",
                    { "hover:cursor-not-allowed text-background/30": disabled },
                    { "hover:cursor-pointer hover:bg-foreground/30": !disabled }
                  )}
                />
              ) : (
                <BsClipboard2
                  size={16}
                  className={clsx(
                    "mr-2",
                    { "hover:cursor-not-allowed text-background/30": disabled },
                    { "hover:cursor-pointer hover:bg-foreground/30": !disabled }
                  )}
                  onClick={handleCopyToClipboard}
                />
              )}
            </div>
          </div>
        </div>
        <div className="h-[80vh]">
          <div className="mt-3">
            <ScrollArea className="overflow-auto col-span-6 h-[640px] w-[100%] bg-base-content/30 border border-base-content/30">
              <div id={"key0"} key={"key" + keyValue++}></div>
              {text.map((t: string) => (
                <div className="text-xs w-[97%]" key={"key" + keyValue++}>
                  {t}
                </div>
              ))}
              <ScrollBar className="bg-foreground/30" />
              {/* <ScrollBar orientation="horizontal" className="bg-foreground/30" /> */}
            </ScrollArea>
          </div>
        </div>
      </div>
    );
  };

  const disableButtons = (_name: string): void => {
    document.body.style.cursor = "progress";
    document.getElementById(_name)!.style.cursor = "progress";

    setEnabledForExport(false);
  };

  const enableButtons = (_name: string): void => {
    setEnabledForExport(true);

    document.body.style.cursor = "auto";
    document.getElementById(_name)!.style.cursor = "auto";
  };

  const handleExportStatements = async (): Promise<void> => {
    keyValue = 0;

    disableButtons("exportStatements");

    const exportData: string[] = await exportServiceStatements();
    originalText.current = exportData;

    let _key: number = 1;
    const lines: any[] = exportData.map((t: string) => (
      <div key={_key++}>{t}</div>
    ));
    setText([<div key={0}></div>, ...lines]);

    enableButtons("exportStatements");
  };

  const ExportServiceStatements = (): JSX.Element => {
    return (
      <div className="w-[90%] rounded-sm border border-base-content/10 p-1 space-y-3">
        <div className="flex items-center space-x-2">
          <LuClipboardList size={12} />
          <PageTitle title="Service Statements" className="text-sm" />
        </div>
        <div>
          <Button
            size="extrasmall"
            id="exportStatements"
            name="Export to view"
            icon={<BiSolidFileExport />}
            iconFirst
            className="bg-custom"
            onClick={handleExportStatements}
            disabled={disabled || !enabledForExport}
          />
        </div>
      </div>
    );
  };

  const handleExportPolicies = async (): Promise<void> => {
    keyValue = 0;

    disableButtons("exportPolicies");

    const exportData: string[] = await exportPolicies();
    originalText.current = exportData;

    let _key: number = 1;
    const lines: any[] = exportData.map((t: string) => (
      <div key={_key++}>{t}</div>
    ));
    setText([<div key={0}></div>, ...lines]);

    enableButtons("exportPolicies");
  };

  const ExportPolicies = (): JSX.Element => {
    return (
      <div className="w-[90%] rounded-sm border border-base-content/10 p-1 space-y-3">
        <div className="flex items-center space-x-2">
          <RiPoliceBadgeLine size={12} />
          <PageTitle title="Policies" className="text-sm" />
        </div>
        <div>
          <Button
            size="extrasmall"
            id="exportPolicies"
            name="Export to view"
            icon={<BiSolidFileExport />}
            iconFirst
            className="bg-custom"
            onClick={handleExportPolicies}
            disabled={disabled || !enabledForExport}
          />
        </div>
      </div>
    );
  };

  const handleExportRoles = async (): Promise<void> => {
    keyValue = 0;

    disableButtons("exportRoles");

    const exportData: string[] = await exportRoles();
    originalText.current = exportData;

    let _key: number = 1;
    const lines: any[] = exportData.map((t: string) => (
      <div key={_key++}>{t}</div>
    ));
    setText([<div key={0}></div>, ...lines]);

    enableButtons("exportRoles");
  };

  const ExportRoles = (): JSX.Element => {
    return (
      <div className="w-[90%] rounded-sm border border-base-content/10 p-1 space-y-3">
        <div className="flex items-center space-x-2">
          <GiScrollUnfurled size={12} />
          <PageTitle title="Roles" className="text-sm" />
        </div>
        <div>
          <Button
            size="extrasmall"
            id="exportRoles"
            name="Export to view"
            icon={<BiSolidFileExport />}
            iconFirst
            className="bg-custom"
            onClick={handleExportRoles}
            disabled={disabled || !enabledForExport}
          />
        </div>
      </div>
    );
  };

  const handleExportUsers = async (): Promise<void> => {
    keyValue = 0;

    disableButtons("exportUsers");

    const exportData: string[] = await exportUsers();
    originalText.current = exportData;

    let _key: number = 1;
    const lines: any[] = exportData.map((t: string) => (
      <div key={_key++}>{t}</div>
    ));
    setText([<div key={0}></div>, ...lines]);

    enableButtons("exportUsers");
  };

  const ExportUsers = (): JSX.Element => {
    return (
      <div className="w-[90%] rounded-sm border border-base-content/10 p-1 space-y-3">
        <div className="flex items-center space-x-2">
          <FaUser size={12} />
          <PageTitle title="Users" className="text-sm" />
        </div>
        <div>
          <Button
            size="extrasmall"
            id="exportUsers"
            name="Export to view"
            icon={<BiSolidFileExport />}
            iconFirst
            className="bg-custom"
            onClick={handleExportUsers}
            disabled={disabled || !enabledForExport}
          />
        </div>
      </div>
    );
  };

  const handleExportGroups = async (): Promise<void> => {
    keyValue = 0;

    disableButtons("exportGroups");

    const exportData: string[] = await exportGroups();
    originalText.current = exportData;

    let _key: number = 1;
    const lines: any[] = exportData.map((t: string) => (
      <div key={_key++}>{t}</div>
    ));
    setText([<div key={0}></div>, ...lines]);

    enableButtons("exportGroups");
  };

  const ExportGroups = (): JSX.Element => {
    return (
      <div className="w-[90%] rounded-sm border border-base-content/10 p-1 space-y-3">
        <div className="flex items-center space-x-2">
          <FaUserGroup size={12} />
          <PageTitle title="Groups" className="text-sm" />
        </div>
        <div>
          <Button
            size="extrasmall"
            id="exportGroups"
            name="Export to view"
            icon={<BiSolidFileExport />}
            iconFirst
            className="bg-custom"
            onClick={handleExportGroups}
            disabled={disabled || !enabledForExport}
          />
        </div>
      </div>
    );
  };

  const iamservices: Record<string, boolean> = {
    statements: true,
    policies: true,
    roles: true,
    users: true,
    groups: true,
  };

  const [iam, setIAM] = useState<Record<string, boolean>>(iamservices);

  const handleChangeIamSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
    _service: string
  ): void => {
    const checked: boolean = event.target.checked;

    const _newiam: Record<string, boolean> = { ...iam };

    _newiam[_service] = checked;

    setIAM(_newiam);
  };

  const RenderIamSelect = ({ _service }: { _service: string }): JSX.Element => {
    return (
      <div className="flex items-center space-x-2">
        <label className="label text-sm">
          <input
            type="checkbox"
            checked={iam[_service]}
            className="checkbox checkbox-xs rounded-sm"
            onChange={(e) => handleChangeIamSelect(e, _service)}
          />
          {_service}
        </label>
      </div>
    );
  };

  const focusOnElement = (): void => {
    document.getElementById("exportname")!.focus();
  };

  const clearElement = (): void => {
    setTableName("");
  };

  const resetAll = (): void => {
    Object.keys(iamservices).forEach(
      (value: string) => (iamservices[value] = true)
    );

    setIAM(iamservices);
    clearElement();
    setDisabledToExportToDB(true);
  };

  const [tableName, setTableName] = useState<string>("");

  const exportSelection = async (): Promise<void> => {
    const services: string[] = Object.entries(iam).reduce<string[]>(
      (acc: string[], value: any) => {
        const service: string = value[0];

        if (value[1] && !acc.includes(service)) {
          acc.push(service);
        }
        return acc;
      },
      []
    );

    let exportData: {
      servicestatements: [];
      policies: [];
      roles: [];
      users: [];
      groups: [];
    } = await exportServices(services);

    await exportDataToDB(tableName, exportData);

    resetAll();
  };

  const [disabledForExportToDB, setDisabledToExportToDB] =
    useState<boolean>(true);

  useEffect(() => {
    focusOnElement();
  }, [tableName, disabledForExportToDB]);

  const handleChangeEvent = (e: any): void => {
    setTableName(e.target.value);

    if (e.target.value.length > 0) {
      setDisabledToExportToDB(false);
    } else {
      setDisabledToExportToDB(true);
    }
  };

  const ExportToDB = (): JSX.Element => {
    return (
      <div className="w-[90%] rounded-sm border border-base-content/10 p-1 space-y-3">
        <div className="flex items-center space-x-2">
          <FaFileExport size={12} />
          <PageTitle title="Export to DB" className="text-md" />
        </div>
        <div>
          <label className="input">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"></path>
                <path d="M14 2v4a2 2 0 0 0 2 2h4"></path>
              </g>
            </svg>
            <input
              type="text"
              id="exportname"
              className="input-sm"
              placeholder="name"
              value={tableName}
              onChange={(e) => handleChangeEvent(e)}
            />
          </label>
        </div>
        <Separator />
        <div className="block space-y-2">
          {Object.keys(iam).map((value: string) => (
            <div key={value}>
              <RenderIamSelect _service={value} />
            </div>
          ))}
        </div>
        <div>
          <Button
            size="extrasmall"
            id="exportGroups"
            name="Export"
            icon={<BiSolidFileExport />}
            iconFirst
            className="bg-custom"
            onClick={exportSelection}
            disabled={disabled || disabledForExportToDB}
          />
        </div>
      </div>
    );
  };

  return (
    <PageContent
      breadcrumbs={[
        { name: "Europay", url: absoluteUrl("/") },
        { name: "Settings" },
        { name: "Import", url: absoluteUrl("/settings/export") },
      ]}
    >
      <div className="w-[99vw] h-[84vh] grid grid-cols-[20%_80%]">
        <div className="block space-y-1">
          <div>
            <ExportServiceStatements />
          </div>
          <div>
            <ExportPolicies />
          </div>
          <div>
            <ExportRoles />
          </div>
          <div>
            <ExportUsers />
          </div>
          <div>
            <ExportGroups />
          </div>
          <div>
            <ExportToDB />
          </div>
        </div>
        <div>
          <DataViewer />
        </div>
      </div>
    </PageContent>
  );
};

export default Export;
