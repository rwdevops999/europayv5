"use client";

import { Statistics } from "@/app/server/data/statistic-data";
import { loadStatistics } from "@/app/server/statistics";
import { json } from "@/lib/util";
import { ChartContainer } from "@/ui/charts/chart-container";
import ChartPie from "@/ui/charts/chart-pie";
import React, { useEffect, useState } from "react";

const chData: Record<string, any> = {
  keys: ["name", "value"],
  colors: ["#000", "#ff0000"],
  segmentcolors: [
    "#F44611",
    "#F39F18",
    "#D5504E",
    "#308446",
    "#7F7679",
    "#3E5F8A",
    "#E1CC4F",
    "#E55137",
    "#8673A1",
  ],
  data: [],
};

const chartProps: any = {
  width: 500,
  height: 280,
  legend: {
    enabled: true,
    // opacity: true,
    halign: "left", // 'left'-'center'-'right' default='center'
    valign: "bottom", // 'top'-'middle'-'bottom'  default='bottom'
  },
};

const IamChart = () => {
  const [chartdata, setChartdata] = useState<Record<string, any>>(chData);

  const loadTheStatistics = async (): Promise<void> => {
    const statistics: Statistics = await loadStatistics();

    const data: any = [
      {
        name: "Actions",
        value: statistics.actions,
      },
      {
        name: "Services",
        value: statistics.services,
      },
      {
        name: "Statements",
        value: statistics.statements,
      },
      {
        name: "Policies",
        value: statistics.policies,
      },
      {
        name: "Roles",
        value: statistics.roles,
      },
      {
        name: "Users",
        value: statistics.users,
      },
      {
        name: "Groups",
        value: statistics.groups,
      },
      {
        name: "Countries",
        value: statistics.countries,
      },
    ];

    const newdata: Record<string, any> = { ...chData };

    newdata["data"] = data;

    setChartdata(newdata);
  };

  useEffect(() => {
    loadTheStatistics();
  }, []);

  return (
    <ChartContainer title="IAM statistics" border>
      <ChartPie props={chartProps} chartdata={chartdata} />
    </ChartContainer>
  );
};

export default IamChart;
