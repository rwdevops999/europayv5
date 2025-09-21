"use client";

import { createPat } from "@/app/server/pat";
import { loadUserById } from "@/app/server/users";
import { useUser } from "@/hooks/use-user";
import { tUser } from "@/lib/prisma-types";
import { generatePAT, json, renderDateInfo } from "@/lib/util";
import Button from "@/ui/button";
import { Separator } from "@/ui/radix/separator";
import React, { JSX, useState } from "react";
import { BsClipboard2, BsClipboard2Check } from "react-icons/bs";

const dayToMilliseconds: number = 24 * 60 * 60 * 1000;

type tExpiration = {
  value: number;
  notation: string;
};

export const expirations: number[] = [7, 30, 60, 90, 0];

const PersonalAccessTokens = () => {
  const { user, setUser } = useUser();

  const PATEntry = (): JSX.Element => {
    const [selectedExpiration, setSelectedExpiration] = useState<string>("30");
    const [generatedToken, setGeneratedToken] = useState<string>("");
    const [copied, setCopied] = useState<boolean>(false);

    const getExpirations = (): tExpiration[] => {
      let result: tExpiration[] = [];

      let d: Date = new Date();
      const now: number = d.getTime();

      for (let exp of expirations) {
        const e: tExpiration = {
          value: exp,
          notation: "",
        };

        if (exp === 0) {
          e.notation = "No expiration";
        } else {
          d.setTime(now + exp * dayToMilliseconds);
          e.notation = `${exp} days (${renderDateInfo(d.toString())})`;
        }

        result.push(e);
      }

      return result;
    };

    const getTokenName = (): string => {
      let result: string = "";

      let element: HTMLInputElement | null = document.getElementById(
        "tokeninput"
      ) as HTMLInputElement;

      if (element) {
        result = element.value;
      }

      return result;
    };

    const handleGenerateNewToken = async (): Promise<void> => {
      const tokenname: string = getTokenName();

      // [TODO] Tets tokename === ""
      const tokenvalue: number = parseInt(selectedExpiration);

      const pat: string = generatePAT();
      setGeneratedToken(pat);

      let d: Date = new Date();
      const now: number = d.getTime();
      d.setTime(now + tokenvalue * dayToMilliseconds);

      if (user) {
        await createPat(
          user.id,
          tokenname,
          pat,
          tokenvalue === 0 ? null : d
        ).then(async () => {
          setUser(await loadUserById(user.id));
        });
      }
    };

    const getResourceName = (): string => {
      let result: string = "";

      if (user) {
        result = user.username ?? `${user.firstname} ${user.lastname}`;
      }

      return result;
    };

    const handleExpiration = (exp: string): void => {
      setSelectedExpiration(exp);
    };

    const handleCopyToClipboard = () => {
      navigator.clipboard.writeText(generatedToken);
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    };

    return (
      <div id="tokename" className="m-1 border-1 border-cancel">
        <div className="m-1">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Token name:</legend>
            <input id="tokeninput" type="text" className="h-8 input" />
          </fieldset>
        </div>

        <div className="m-1 flex items-center space-x-1 text-xs">
          <label className="font-bold">Owner:</label>
          <label>{getResourceName()}</label>
        </div>

        <div className="m-1 block space-y-2">
          <div id="expiration" className="grid grid-cols-[25%_75%]">
            <div className="flex items-center">
              <label className="text-xs font-bold">Expiration:</label>
            </div>
            <div className="flex items-center">
              <select
                value={selectedExpiration}
                className="select select-sm w-12/12"
                onChange={(e) => handleExpiration(e.target.value)}
              >
                {getExpirations().map((exp: tExpiration) => {
                  return (
                    <option
                      key={exp.value}
                      value={exp.value}
                      className="text-xs"
                    >
                      {exp.notation}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>

        <Separator />
        <div className="m-1 flex items-center justify-between">
          <label className="text-xs font-bold">Token: {generatedToken}</label>
          <div className="tooltip tooltip-bottom" data-tip="copy">
            {copied ? (
              <BsClipboard2Check
                size={16}
                className="mr-2 hover:cursor-pointer hover:bg-foreground/30"
              />
            ) : (
              <BsClipboard2
                size={16}
                className="mr-2 hover:cursor-pointer hover:bg-foreground/30"
                onClick={handleCopyToClipboard}
              />
            )}
          </div>
        </div>
        <Separator />
        <div className="m-1 flex justify-center">
          <Button
            type="submit"
            size="small"
            className="bg-custom"
            name="Generate new token"
            onClick={handleGenerateNewToken}
          />
        </div>
      </div>
    );
  };

  const PATList = (): JSX.Element => {
    return <div className="m-1 border-1 border-yellow-500">LIST</div>;
  };

  return (
    <div className="h-[78vh] border-1 border-yellow-500">
      <PATEntry />
      <PATList />
    </div>
  );
};

export default PersonalAccessTokens;
