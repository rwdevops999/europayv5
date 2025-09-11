import React, { JSX } from "react";
import {
  LuArrowDownToLine,
  LuArrowUpToLine,
  LuTrendingDown,
  LuTrendingUp,
  LuTrendingUpDown,
} from "react-icons/lu";
import { RiExpandHorizontalFill } from "react-icons/ri";

const TrendingProgress = ({
  _previousPeriodValue,
  _thisPeriodValue,
  _currency = "",
}: {
  _previousPeriodValue: number | undefined;
  _thisPeriodValue: number | undefined;
  _currency?: string;
}) => {
  const progression: string = `(${_previousPeriodValue?.toFixed(
    2
  )} to ${_thisPeriodValue?.toFixed(2)})`;

  const getMessage = (): JSX.Element => {
    if (_previousPeriodValue !== undefined) {
      if (_thisPeriodValue !== undefined) {
        if (_thisPeriodValue === _previousPeriodValue) {
          return (
            <div className="flex items-center text-xs">
              Trending equals on {_thisPeriodValue.toFixed(2)}&nbsp;{_currency}
              &nbsp;
              {progression}&nbsp;
              <LuTrendingUpDown size={14} />
            </div>
          );
        } else {
          if (_previousPeriodValue < 0) {
            if (_thisPeriodValue >= 0) {
              return (
                <div className="flex items-center text-xs">
                  Trending up by {_thisPeriodValue - _previousPeriodValue}&nbsp;
                  {progression}&nbsp;
                  {_currency}&nbsp;
                  <LuTrendingUp size={14} />
                </div>
              );
            } else if (_thisPeriodValue < 0) {
              if (_previousPeriodValue < _thisPeriodValue) {
                return (
                  <div className="flex items-center text-xs">
                    Trending up by{" "}
                    {Math.abs(_previousPeriodValue) -
                      Math.abs(_thisPeriodValue)}
                    &nbsp;{_currency}&nbsp;{progression}&nbsp;
                    <LuTrendingUp size={14} />
                  </div>
                );
              } else if (_previousPeriodValue > _thisPeriodValue) {
                return (
                  <div className="flex items-center text-xs">
                    Trending down by{" "}
                    {Math.abs(_thisPeriodValue) -
                      Math.abs(_previousPeriodValue)}
                    &nbsp;{_currency}&nbsp;{progression}&nbsp;
                    <LuTrendingDown size={14} />
                  </div>
                );
              }
            }
          } else if (_thisPeriodValue > 0) {
            return (
              <div className="flex items-center text-xs">
                Trending up by{" "}
                {(_thisPeriodValue - Math.abs(_previousPeriodValue)).toFixed(2)}
                &nbsp;{_currency}&nbsp;{progression}&nbsp;
                <LuTrendingUp size={14} />
              </div>
            );
          } else if (_thisPeriodValue < 0) {
            return (
              <div className="flex items-center text-xs">
                Trending down by{" "}
                {(_thisPeriodValue - Math.abs(_previousPeriodValue)).toFixed(2)}
                &nbsp;{_currency}&nbsp;{progression}&nbsp;
                <LuTrendingDown size={14} />
              </div>
            );
          } else if (_thisPeriodValue === 0) {
            return (
              <div className="flex items-center text-xs">
                Trending down by{" "}
                {(_previousPeriodValue - _thisPeriodValue).toFixed(2)}
                &nbsp;{_currency}&nbsp;{progression}&nbsp;
                <LuTrendingDown size={14} />
              </div>
            );
          } else {
            const pct: number =
              (_thisPeriodValue / _previousPeriodValue) * 100 - 100;
            if (_previousPeriodValue > _thisPeriodValue) {
              return (
                <div className="flex items-center text-xs">
                  Trending down by {pct.toFixed(2)}&nbsp;%&nbsp;{progression}
                  &nbsp;
                  <LuTrendingDown size={14} />
                </div>
              );
            } else {
              return (
                <div className="flex items-center text-xs">
                  Trending up by {pct.toFixed(2)}&nbsp;%&nbsp;{progression}
                  &nbsp;
                  <LuTrendingUp size={14} />
                </div>
              );
            }
          }
        }
      } else {
        return (
          <div className="flex items-center text-xs">
            No trending information
          </div>
        );
      }
    } else if (_thisPeriodValue !== undefined) {
      if (_thisPeriodValue < 0) {
        return (
          <div className="flex items-center text-xs">
            Going to {_thisPeriodValue.toFixed(2)}&nbsp;{_currency}&nbsp;
            {progression}
            &nbsp;
            <LuArrowDownToLine size={14} />
          </div>
        );
      } else if (_thisPeriodValue > 0) {
        return (
          <div className="flex items-center text-xs">
            Going to {_thisPeriodValue.toFixed(2)}&nbsp;{_currency}&nbsp;
            {progression}
            &nbsp;
            <LuArrowUpToLine size={14} />
          </div>
        );
      } else {
        return (
          <div className="flex items-center text-xs">
            Started with 0.toFixed(2)&nbsp;{_currency}&nbsp;{progression}&nbsp;
            <RiExpandHorizontalFill size={14} />
          </div>
        );
      }
    } else {
      return (
        <div className="flex items-center text-xs">No trending information</div>
      );
    }

    return <></>;
  };

  return <div className="flex gap-5">{getMessage()}</div>;
};

export default TrendingProgress;
