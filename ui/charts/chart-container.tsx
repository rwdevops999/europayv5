import { ResponsiveContainer } from "recharts";
// import TrendingPeriod from "./trending-period";
import TrendingProgress from "./trending-progress";
import { cn } from "@/lib/util";
import TrendingPeriod from "./trending-period";

type ChartContainerType = {
  title?: string;
  border?: boolean;
  previousPeriodValue?: number;
  thisPeriodValue?: number;
  currency?: string;
} & React.ComponentProps<typeof ResponsiveContainer>;

const ChartContainer = ({
  title,
  border,
  previousPeriodValue,
  thisPeriodValue,
  currency,
  className,
  children,
  ...props
}: ChartContainerType) => {
  return (
    <div
      className={cn("w-[75%]", {
        "rounded-sm border border-base-content/10": border,
      })}
    >
      <div className="flex items-center justify-between px-1 rounded-t-sm text-xs text-base-content/60 bg-base-content/30">
        <div className="flex items-center space-x-2">
          {title && <label>{title} :</label>}
          <TrendingPeriod />
        </div>
        {(previousPeriodValue || thisPeriodValue) && (
          <TrendingProgress
            _previousPeriodValue={previousPeriodValue}
            _thisPeriodValue={thisPeriodValue}
            _currency={currency}
          />
        )}
      </div>
      <br />
      <ResponsiveContainer
        width="100%"
        height="300px"
        className={className}
        {...props}
      >
        {children}
      </ResponsiveContainer>
    </div>
  );
};

export { ChartContainer };
