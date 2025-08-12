import { getKeyMapping } from "@/lib/util";
import React, { JSX, useEffect, useRef } from "react";

// You can find out the key mapping using event.code in keydown listener
export type KeyboardCombo = {
  key: string;
  shift?: boolean;
  command?: boolean;
  option?: boolean;
  control?: boolean;
};

const KeyboardShortcut = ({
  label,
  combo,
  callParent,
}: {
  label: string;
  combo: KeyboardCombo;
  callParent: () => void;
}): JSX.Element => {
  const combovalue = useRef<KeyboardCombo>({
    key: "",
  });

  const keyDown = (e: KeyboardEvent) => {
    let valid: boolean = true;

    if (e.code === getKeyMapping(combovalue.current.key)) {
      if (valid && (combovalue.current.command ?? false)) {
        valid = valid && e.metaKey;
      }

      if (valid && (combovalue.current.option ?? false)) {
        valid = valid && e.altKey;
      }

      if (valid && (combovalue.current.control ?? false)) {
        valid = valid && e.ctrlKey;
      }

      if (valid && (combovalue.current.shift ?? false)) {
        valid = valid && e.shiftKey;
      }
    } else {
      valid = false;
    }

    if (valid) {
      callParent();
      e.preventDefault();
      e.stopPropagation();
      return false;
    }

    return true;
  };

  useEffect(() => {
    document.addEventListener("keydown", keyDown);
    combovalue.current = combo;
  }, [combo]);

  return (
    <div>
      {label}&nbsp;
      {combo.command && <kbd className="kbd kbd-sm bg-transparent">⌘</kbd>}
      {combo.option && <kbd className="kbd kbd-sm bg-transparent">⌥</kbd>}
      {combo.control && <kbd className="kbd kbd-sm bg-transparent">⌃</kbd>}
      {combo.shift && <kbd className="kbd kbd-sm bg-transparent">⇧</kbd>}
      <kbd className="kbd kbd-sm bg-transparent">{combo.key}</kbd>
    </div>
  );
};

export default KeyboardShortcut;
