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
import { render } from "@testing-library/react";
import clsx from "clsx";
import React, { JSX, useEffect, useRef, useState } from "react";
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
    // const [selectedExpiration, setSelectedExpiration] = useState<string>("30");
    // const [generatedToken, setGeneratedToken] = useState<string>("");

    const [token, setToken] = useState<string>("");

    const [pat, setPat] = useState<tUserPat | null>(null);

    // const setTokenName = (_tokenName: string): void => {
    //   let element: HTMLInputElement | null = document.getElementById(
    //     "tokeninput"
    //   ) as HTMLInputElement;

    //   if (element) {
    //     element.value = _tokenName;
    //   }
    // };

    // const setToken = (_token: string): void => {
    //   let element: HTMLInputElement | null = document.getElementById(
    //     "tokendisplay"
    //   ) as HTMLInputElement;

    //   if (element) {
    //     element.value = _token;
    //   }
    // };

    const setupPat = (_pat: tUserPat): void => {
      console.log("[SETUP]:setupPat", json(_pat));
      setPat(_pat);
      if (_pat.delay) {
        if (_pat.delay?.toString() !== delay) {
          setDelay(_pat.delay?.toString());
        }
      }
      setToken(_pat.token);
    };

    useEffect(() => {
      if (user) {
        const len: number = user.pats.length;
        if (len > 0) {
          console.log("[SETUP]", json(user.pats[len - 1]));
          setupPat(user.pats[len - 1]);
        }
      }
    }, [user]);

    const [copied, setCopied] = useState<boolean>(false);

    // const getExpirations = (): tExpiration[] => {
    //   let result: tExpiration[] = [];

    //   let d: Date = new Date();

    //   console.log("DATE = ", renderDateInfo(d.toString()));

    //   if (pat !== null) {
    //     console.log("PAT = ", json(pat));
    //     d = pat.createDate!;
    //     console.log("PAT DEFINED => D = ", renderDateInfo(d.toString()));
    //   }

    //   let now: number = d.getTime();
    //   console.log(
    //     "PAT DEFINED => NOW = ",
    //     renderDateInfo(new Date().setTime(now).toString())
    //   );

    //   for (let exp of expirations) {
    //     const e: tExpiration = {
    //       value: exp,
    //       notation: "",
    //     };

    //     if (exp === 0) {
    //       e.notation = "No expiration";
    //     } else {
    //       d.setTime(now + exp * dayToMilliseconds);
    //       e.notation = `${exp} days (${renderDateInfo(d.toString())})`;
    //     }

    //     result.push(e);
    //   }

    //   return result;
    // };

    // const getTokenName = (): string => {
    //   let result: string = "";

    //   let element: HTMLInputElement | null = document.getElementById(
    //     "tokeninput"
    //   ) as HTMLInputElement;

    //   if (element) {
    //     result = element.value;
    //   }

    //   return result;
    // };

    // const handleGenerateNewToken = async (): Promise<void> => {
    //   const tokenname: string = getTokenName();

    //   // [TODO] Tets tokename === ""
    //   const tokenvalue: number = parseInt(selectedExpiration);

    //   const _pat: string = generatePAT();
    //   console.log("SET GENERATED TOKEN", _pat);
    //   // setGeneratedToken(_pat);
    //   // setToken(_pat);

    //   let d: Date = new Date();
    //   const now: number = d.getTime();
    //   d.setTime(now + tokenvalue * dayToMilliseconds);

    //   if (user) {
    //     await createPat(
    //       user.id,
    //       tokenname,
    //       _pat,
    //       tokenvalue === 0 ? null : d,
    //       parseInt(selectedExpiration)
    //     ).then(async () => {
    //       setUser(await loadUserById(user.id));
    //     });
    //   }
    // };

    // const getResourceName = (): string => {
    //   let result: string = "";

    //   if (user) {
    //     result = user.username ?? `${user.firstname} ${user.lastname}`;
    //   }

    //   return result;
    // };

    // const handleExpiration = (exp: string): void => {
    //   setSelectedExpiration(exp);
    // };

    // const handleCopyToClipboard = () => {
    //   console.log("COPY TP CLIPBOARD: GENERATED TOKEN", generatedToken);
    //   navigator.clipboard.writeText(generatedToken);
    //   setCopied(true);
    //   setTimeout(() => {
    //     setCopied(false);
    //   }, 2000);
    // };

    // const clearTokenDisplay = (): void => {
    //   const element: HTMLInputElement = document.getElementById(
    //     "tokendisplay"
    //   ) as HTMLInputElement;

    //   if (element) {
    //     if (element.value !== "") {
    //       element.value = "";
    //     }
    //   }
    // };

    // const handleChangeTokenName = (event: any): void => {
    //   // clearTokenDisplay();
    //   // event.preventDefault();
    //   // event.stopPropagation();
    // };

    const setExpirationSelect = (_value: string): void => {
      const element: HTMLSelectElement = document.getElementById(
        "expirationselect"
      ) as HTMLSelectElement;

      if (element) {
        element.value = _value;
      }
    };

    const handleChangeTokenName = (
      event: React.ChangeEvent<HTMLInputElement>
    ): void => {
      // setExpirationSelect("7");
      setToken("");
    };

    const getResourceName = (): string => {
      if (user) {
        return user.username ?? `${user.firstname} ${user.lastname}`;
      }

      return "";
    };

    const handleExpiration = (exp: string): void => {
      console.log("Handling expiration change", exp);
      setDelay(exp);
    };

    const [delay, setDelay] = useState<string>("7");

    const getExpirations = (
      _date: Date | null | undefined,
      _delay: number | null | undefined
    ): tExpiration[] => {
      let result: tExpiration[] = [];

      if (_date) {
        console.log("[getExpirations](1)", json(_date));
        console.log("[getExpirations](2)", renderDateInfo(_date.toString()));
      }

      let d: Date = new Date();
      if (_date) {
        console.log("CHANGE DATE", renderDateInfo(_date.toString()));
        d = _date;
      }

      console.log("DATE", renderDateInfo(d.toString()));

      let expirationDelay: number = parseInt(delay);
      if (_delay) {
        expirationDelay = _delay;
        if (_delay !== expirationDelay) {
          setDelay(_delay.toString());
        }
      }

      console.log("EXP", expirationDelay);

      let now: number = d.getTime();

      for (let exp of expirations) {
        const e: tExpiration = {
          value: exp,
          notation: "",
        };

        console.log("handle EXPIRATION", exp);
        if (exp === 0) {
          e.notation = "No expiration";
        } else {
          const _d = new Date();
          _d.setTime(now + exp * dayToMilliseconds);
          e.notation = `${exp} days (${renderDateInfo(_d.toString())})`;
          console.log("handle EXPIRATION => NOTATION", e.notation);
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
      console.log("GENERATING NEW PAT");
      const tokenname: string = getTokenName();

      if (tokenname === "") {
        console.log("[PROBLEMO] tokenname is empty");
      } else {
        console.log("TOKEN NAME IS", tokenname);
        // [TODO] existing pat which is active is not allowed
      }

      const expiration: string = delay;
      console.log("EXPIRATION IS", expiration);

      let d: Date = new Date();
      const now: number = d.getTime();
      d.setTime(now + parseInt(expiration) * dayToMilliseconds);

      const _pat: string = generatePAT();
      setToken(_pat);

      console.log("[CREATE TOKEN]", tokenname, _pat, delay);
      if (user) {
        await createPat(
          user.id,
          tokenname,
          _pat,
          delay === "0" ? null : d,
          parseInt(delay)
        ).then(async () => {
          setUser(await loadUserById(user.id));
        });
      }
    };

    return (
      // <div id="tokename" className="m-1 border-1 border-cancel">

      //   <div className="m-1 flex items-center justify-between">
      //     <div className="flex items-center space-x-1">
      //       <label className="text-xs font-bold">Token:</label>
      //       <input
      //         id="tokendisplay"
      //         type="text"
      //         className="h-8 input"
      //         disabled={true}
      //       />
      //     </div>
      //   </div>
      // </div>
      <div id="pat" className="m-1 border-1 border-cancel">
        <div className="m-1">
          <fieldset className="fieldset">
            <legend className="fieldset-legend">Token name:</legend>
            <input
              id="tokeninput"
              type="text"
              className="h-8 input"
              defaultValue={pat?.tokenName}
              onChange={(e) => handleChangeTokenName(e)}
            />
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
                id="expirationselect"
                value={pat?.delay?.toString()}
                className="select select-sm w-12/12"
                onChange={(e) => handleExpiration(e.target.value)}
              >
                {getExpirations(pat?.createDate, pat?.delay).map(
                  (exp: tExpiration) => {
                    return (
                      <option
                        key={exp.value}
                        value={exp.value}
                        className="text-xs"
                      >
                        {exp.notation}
                      </option>
                    );
                  }
                )}
              </select>
            </div>
          </div>
        </div>
        <Separator />
        <div className="m-1 flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <label className="text-xs font-bold">Token:</label>
            <input
              id="tokendisplay"
              type="text"
              className="h-8 input"
              disabled={true}
              defaultValue={token}
            />
          </div>
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
                //           onClick={handleCopyToClipboard}
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

  const PATItem = ({ pat }: { pat: tUserPat }): JSX.Element => {
    const handleDeletePat = async (patid: number): Promise<void> => {
      await deletePatById(patid).then(async () => {
        if (user) {
          setUser(await loadUserById(user.id));
        }
      });
    };

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
        console.log("UE[user]", json(user));

        // Need sorting ???
        console.log("[USER PATS]", json(user.pats));
        setPats(user.pats.toReversed());
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
