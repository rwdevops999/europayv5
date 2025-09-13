import { months } from "moment";
import React from "react";

const TrendingPeriod = () => {
  const getPeriod = (): string => {
    const date: Date = new Date();

    return `${months(date.getMonth())} ${date.getFullYear()}`;
  };

  return <div className="text-xs">{getPeriod()}</div>;
};

export default TrendingPeriod;
