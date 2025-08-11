"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { tUser } from "../lib/prisma-types";
import { BiLogIn, BiLogOut } from "react-icons/bi";

interface UserContextInterface {
  user: tUser | null;
  login: (value: tUser) => void;
  logout: () => void;
  isBlocked: () => boolean;
  isLoggedIn: () => boolean;
  getLoggedNode: () => ReactNode;
  setUser: (value: tUser | null) => void;
}

const UserContext = createContext<UserContextInterface | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<tUser | null>(null);

  const login = (value: tUser): void => {
    setUser(value!);
  };

  const logout = (): void => {
    setUser(null);
  };

  const isBlocked = (): boolean => {
    if (user) {
      return user.blocked ?? false;
    }

    return false;
  };

  const isLoggedIn = (): boolean => {
    if (user) {
      return true;
    }

    return false;
  };

  const getLoggedNode = (): ReactNode => {
    return (
      <>
        {user && (
          <div className="flex items-center justify-center border border-foreground/30">
            <div
              data-testid="user"
              className="tooltip tooltip-bottom"
              data-tip="User logged in"
            >
              <BiLogIn className="text-green-500" size={12} />
            </div>
          </div>
        )}
        {!user && (
          <div className="flex items-center justify-center border border-foreground/30">
            <div
              data-testid="user"
              className="tooltip tooltip-bottom"
              data-tip="No user logged in"
            >
              <BiLogOut className="text-red-500" size={12} />
            </div>
          </div>
        )}
      </>
    );
  };

  return (
    <UserContext.Provider
      value={{
        user,
        login,
        logout,
        isBlocked,
        isLoggedIn,
        getLoggedNode,
        setUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default {
  UserProvider,
  useUser,
};
