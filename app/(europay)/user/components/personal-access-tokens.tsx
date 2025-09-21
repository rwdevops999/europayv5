"use client";

import { createPat, deletePatById } from "@/app/server/pat";
import { loadUserById } from "@/app/server/users";
import { TokenStatus } from "@/generated/prisma";
import { useUser } from "@/hooks/use-user";
import { tUser, tUserPat, tUserUpdate } from "@/lib/prisma-types";
import { generatePAT, json, renderDateInfo } from "@/lib/util";
import Button from "@/ui/button";
import { ScrollArea, ScrollBar } from "@/ui/radix/scroll-area";
import { Separator } from "@/ui/radix/separator";
import clsx from "clsx";
import React, { JSX, useEffect, useState } from "react";
import { BsClipboard2, BsClipboard2Check } from "react-icons/bs";
import { CiWallet, CiWarning } from "react-icons/ci";

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
            type="button"
            size="small"
            className="bg-custom"
            name="Generate new token"
            onClick={handleGenerateNewToken}
          />
        </div>
      </div>
    );
  };

  const ExpirationDate = ({ pat }: { pat: tUserPat }): JSX.Element => {
    if (pat.expirationDate) {
      return (
        <label>Expire: {renderDateInfo(pat.expirationDate.toString())}</label>
      );
    }

    return (
      <div className="flex items-center space-x-1 text-orange-400">
        <CiWarning size={14} />
        <label>This token has no expiration date</label>
      </div>
    );
  };

  const handleDeletePat = async (patid: number): Promise<void> => {
    await deletePatById(patid).then(async () => {
      if (user) {
        setUser(await loadUserById(user.id));
      }
    });
  };

  const PATItem = ({ pat }: { pat: tUserPat }): JSX.Element => {
    return (
      <div className="m-1 border-1 border-cancel">
        <div className="m-1 flex items-center justify-between">
          <label
            className={clsx(
              "text-xs font-bold",
              { "text-blue-600": pat.tokenStatus === TokenStatus.ACTIVE },
              { "text-cancel/30": pat.tokenStatus === TokenStatus.VOID }
            )}
          >
            {pat.tokenName}
          </label>
          <Button
            type="button"
            name="Delete"
            size="extrasmall"
            intent="secondary"
            style="ghost"
            onClick={() => handleDeletePat(pat.id)}
          />
        </div>
        <div className="m-1">
          <label className="text-xs">
            <ExpirationDate pat={pat} />
          </label>
        </div>
      </div>
    );
  };

  const PATList = (): JSX.Element => {
    const [pats, setPats] = useState<tUserPat[]>([]);

    useEffect(() => {
      if (user) {
        // Need sorting ???
        console.log("[USER PATS]", json(user.pats));
        setPats(user.pats);
      }
    }, [user]);

    return (
      <div className="m-1 border-1 border-cancel">
        {/* <ScrollArea className="overflow-auto max-h-[61px] h-[2000px] w-[100%]"> */}
        {pats.map((pat: tUserPat) => (
          <div key={pat.id}>
            <PATItem pat={pat} />
          </div>
        ))}
        {/* <ScrollBar className="bg-foreground/30" />
        </ScrollArea> */}
      </div>
    );
  };

  return (
    <div>
      <PATEntry />
      {user && user.pats.length > 0 && <PATList />}
    </div>
  );
};

export default PersonalAccessTokens;
