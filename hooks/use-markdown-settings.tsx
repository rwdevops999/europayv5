"use client";

import { createContext, ReactNode, useContext, useState } from "react";
import { FaMarkdown } from "react-icons/fa6";

interface MarkdownSettingsContextInterface {
  setMarkdown: (value: boolean) => void;
  isMarkdownOn: () => boolean;
  getMarkdownNode: () => ReactNode;
}

const MarkdownSettingsContext = createContext<
  MarkdownSettingsContextInterface | undefined
>(undefined);

export const useMarkdownSettings = () => {
  const context = useContext(MarkdownSettingsContext);
  if (context === undefined) {
    throw new Error(
      "useMarkdownSettings must be used within a MarkdownSettingsProvider"
    );
  }
  return context;
};

export const MarkdownSettingsProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [markdown, setMarkdown] = useState<boolean>(true);

  const isMarkdownOn = (): boolean => {
    return markdown;
  };

  const getMarkdownNode = (): ReactNode => {
    return (
      <div className="flex items-center justify-center border border-foreground/30 cursor-default">
        {isMarkdownOn() ? (
          <div
            data-testid="markdown"
            className="tooltip tooltip-bottom"
            data-tip={`Markdown active`}
          >
            <FaMarkdown className="text-green-500" size={14} />
          </div>
        ) : (
          <div
            data-testid="markdown"
            className="tooltip tooltip-bottom"
            data-tip={`Markdown inactive`}
          >
            <FaMarkdown className="text-red-500" size={14} />
          </div>
        )}
      </div>
    );
  };

  return (
    <MarkdownSettingsContext.Provider
      value={{
        setMarkdown,
        isMarkdownOn,
        getMarkdownNode,
      }}
    >
      {children}
    </MarkdownSettingsContext.Provider>
  );
};

export default {
  MarkdownSettingsProvider,
  useMarkdownSettings,
};
