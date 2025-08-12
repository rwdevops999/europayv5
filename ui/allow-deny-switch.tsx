"use client";

import { Permission } from "@/generated/prisma";
import { cn } from "@/lib/util";

const access: string = Permission.ALLOW;

export interface SwitchProps {
  value: string;
  accessFn: (access: string) => void;
  className: string;
  disabled?: boolean;
}

let checked: boolean = false;

const AllowDenySwitch = (props: SwitchProps) => {
  checked = props.value === Permission.ALLOW ? true : false;
  // let [checked, setChecked] = useState(access === Permission.ALLOW);

  const handleCheckChange = () => {
    const isChecked = checked;
    // setChecked(!isChecked);
    checked = !checked;
    props.accessFn(isChecked ? Permission.DENY : Permission.ALLOW);
  };

  return (
    <div className={cn("flex items-center space-x-1", props.className)}>
      <label
        className={
          !checked ? "text-background text-xs" : "text-green-500 text-xs"
        }
      >
        {Permission.ALLOW}
      </label>
      <input
        type="checkbox"
        checked={!checked}
        className="toggle toggle-xs"
        onChange={handleCheckChange}
        disabled={props.disabled ? props.disabled : false}
      />
      <label
        className={
          checked ? "text-background text-xs" : "text-orange-600 text-xs"
        }
      >
        {Permission.DENY}
      </label>
    </div>
  );
};

export default AllowDenySwitch;
