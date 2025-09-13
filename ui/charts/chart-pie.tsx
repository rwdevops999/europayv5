import { json } from "@/lib/util";
import dynamic from "next/dynamic";
import React from "react";
import { Cell, Legend, Pie, Sector } from "recharts";

const PieChart = dynamic(
  () => import("recharts").then((recharts) => recharts.PieChart),
  {
    ssr: false,
  }
);

const renderActiveShape = (props: any) => {
  console.log("[PieChart]:renderActiveShape", json(props));
  const RADIAN = Math.PI / 180;
  const {
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
    payload,
    percent,
    value,
  } = props;
  const sin = Math.sin(-RADIAN * midAngle);
  const cos = Math.cos(-RADIAN * midAngle);
  const sx = cx + (outerRadius + 10) * cos;
  const sy = cy + (outerRadius + 10) * sin;
  const mx = cx + (outerRadius + 30) * cos;
  const my = cy + (outerRadius + 30) * sin;
  const ex = mx + (cos >= 0 ? 1 : -1) * 22;
  const ey = my;
  const textAnchor = cos >= 0 ? "start" : "end";

  return (
    <g>
      <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
        {payload.name}
      </text>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 6}
        outerRadius={outerRadius + 10}
        fill={fill}
      />
      <path
        d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`}
        stroke={fill}
        fill="none"
      />
      <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        textAnchor={textAnchor}
        fill={fill}
      >{`Value ${value}`}</text>
      <text
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        y={ey}
        dy={18}
        textAnchor={textAnchor}
        fill="#999"
      >
        {`(${(percent * 100).toFixed(2)}%)`}
      </text>
    </g>
  );
};

const ChartPie = ({
  props,
  chartdata,
}: {
  props?: any;
  chartdata: Record<string, any>;
}) => {
  const _data: any = chartdata["data"];
  let _colors: any = ["#fff"];

  if (chartdata["segmentcolors"]) {
    _colors = chartdata["segmentcolors"];
  } else {
    _colors = [chartdata["colors"][1]];
  }

  const divStyle = {
    fontSize: "12px",
  };

  return (
    <PieChart width={props.width} height={props.height}>
      <Pie
        className="text-xs"
        activeShape={renderActiveShape}
        data={_data}
        cx="50%"
        cy="50%"
        innerRadius={60}
        outerRadius={80}
        fill={_colors[1]}
        dataKey="value"
      >
        {_data.map((entry: any, index: number) => (
          <Cell key={`cell-${index}`} fill={_colors[index % _colors.length]} />
        ))}
      </Pie>
      {props.legend.enabled && (
        <Legend
          layout="vertical"
          align={props.legend.halign}
          wrapperStyle={divStyle}
          verticalAlign={props.legend.valign}
        />
      )}
    </PieChart>
  );
};

export default ChartPie;
