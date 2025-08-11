"use client";

import React, { useEffect, useState } from "react";

const AvatarSelect = ({
  _avatar,
  forwardFileName,
}: {
  _avatar: string;
  forwardFileName: (_filename: string) => void;
}) => {
  const [avatar, setAvatar] = useState<string>();

  useEffect(() => {
    setAvatar(_avatar);
  }, []);

  const handleShowFileUpload = (): void => {
    const element: HTMLInputElement | null = document.getElementById(
      "fileinput"
    ) as HTMLInputElement | null;

    if (element) {
      element.click();
    }
  };

  const handleFileSelect = async (): Promise<void> => {
    const element: HTMLInputElement | null = document.getElementById(
      "fileinput"
    ) as HTMLInputElement | null;

    if (element && element.files) {
      var img: HTMLImageElement | null = document.getElementById(
        "myavatar"
      ) as HTMLImageElement;
      if (img) {
        const avatar: string = `/avatars/${element.files[0].name}`;
        img.src = avatar;
      }

      forwardFileName(element.files[0].name);
    }
  };

  return (
    <>
      <div className="w-8 h-8 rounded-lg flex justify-center items-center">
        <div className="avatar">
          <div className="w-8 rounded-full hover:cursor-pointer">
            {avatar && (
              <img
                id="myavatar"
                src={`/avatars/${avatar}`}
                onClick={handleShowFileUpload}
              />
            )}
            {!avatar && (
              <img
                id="myavatar"
                src={`/avatars/john.doe.png`}
                onClick={handleShowFileUpload}
              />
            )}
          </div>
        </div>
      </div>
      <input
        id="fileinput"
        hidden
        type="file"
        className="file-input"
        onChange={handleFileSelect}
      />
    </>
  );
};

export default AvatarSelect;
