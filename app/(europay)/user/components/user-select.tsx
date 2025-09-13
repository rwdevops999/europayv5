"use client";

import { loadUserByUsernameOrEmail } from "@/app/server/users";
import { tUser } from "@/lib/prisma-types";
import { json, validEmail } from "@/lib/util";
import React, { useEffect, useState } from "react";
import { FaHouseUser } from "react-icons/fa6";
import { MdAlternateEmail } from "react-icons/md";

const UserSelect = ({
  users,
  sendUser,
}: {
  users: tUser[];
  sendUser: (_id: number) => void;
}) => {
  const [selectedId, setSelectedId] = useState<number>(-1);

  const resetFields = (): void => {
    setSelectedId(-1);
    const element: HTMLInputElement = document.getElementById(
      "userinput"
    ) as HTMLInputElement;

    if (element) {
      element.value = "";
    }
  };

  useEffect(() => {
    setSelectedId(-1);
    resetFields();
  }, []);

  const showUserInput = (_visible: boolean): void => {
    const element: HTMLDivElement = document.getElementById(
      "user"
    ) as HTMLDivElement;

    if (element) {
      element.hidden = !_visible;
    }
  };

  const handleSetUser = (event: any): void => {
    const id: number = parseInt(event.target.value);

    console.log("Handle set user", id);

    if (id === 0) {
      resetFields();
      showUserInput(true);
    } else {
      showUserInput(false);
      sendUser(id);
    }
    setSelectedId(id);
  };

  const handleChangeInput = async (e: any) => {
    const email = e.target.value;

    if (validEmail(email)) {
      await loadUserByUsernameOrEmail(email).then((value: tUser | null) => {
        console.log("LOADED USER", json(value));
        if (value) {
          console.log("SELECTED USER IS", value.id);
          setSelectedId(value.id);
          sendUser(value.id);
        }
      });
    }
  };

  return (
    <>
      <select
        value={selectedId}
        className="select-sm w-[93%] mb-1.5"
        onChange={(e) => handleSetUser(e)}
      >
        <option disabled={true} value={-1}>
          select
        </option>
        <option value={0}>Free</option>
        {users.map((_user: tUser) => (
          <option key={_user.id} value={_user.id}>
            {_user.firstname}&nbsp;{_user.lastname}
          </option>
        ))}
      </select>
      <div id="user" className="mb-1.5">
        <label className="input">
          <MdAlternateEmail size={16} />
          <input
            id="userinput"
            type="email"
            className="grow"
            placeholder="user"
            onChange={(e) => handleChangeInput(e)}
          />
        </label>
      </div>
    </>
  );
};

export default UserSelect;
