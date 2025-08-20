"use client";

import { useProgressBar } from "@/hooks/use-progress-bar";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { MdOutlinePageview } from "react-icons/md";

const Intro = ({ href }: { href: string }) => {
  const { push } = useRouter();
  const progress = useProgressBar();

  const redirect = (href: string) => {
    progress.start(); // show the indicator

    startTransition(() => {
      push(href);
      progress.done(); // only runs when the destination page is fully loaded
    });
  };

  const goToChapter = (): void => {
    redirect(href);
  };

  return (
    <div className="card bg-base-100 shadow-sm">
      <figure>
        <div className="flex justify-start w-20 h-20">
          <Image
            src="/chapters/chapter1/chapter1.jpg"
            alt="chapter1"
            width="0"
            height="0"
            sizes="100vw"
            style={{ width: "100px", height: "auto" }}
          />
        </div>
      </figure>
      <div className="card-body">
        <h2 className="card-title">Apply account</h2>
        <p>Apply for an Europay account.</p>
        <div className="card-actions justify-end items-center">
          <label className="flex items-center space-x-2">
            <div className="text-gray-400">read</div>
            <button className="hover:cursor-pointer" onClick={goToChapter}>
              <MdOutlinePageview size={18} />
            </button>
          </label>
          {/* <button className="btn btn-primary">Buy Now</button> */}
        </div>
      </div>
    </div>
  );
};

export default Intro;
