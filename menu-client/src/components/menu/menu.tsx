import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { SearchType } from "../../constants/search";
import MenuTrigger from "./menu-trigger";
import { MenuContext } from "./context";
import { MenuContent } from "./menu-content";

const defaultConfig = {
  search: { placeholder: "Search", type: SearchType.INTERNAL },
  items: {
    textKey: "text",
    nestedKey: "children",
    cmdKey: "cmd",
    disabledKey: "disabled",
  },
};

type Config<T> = Partial<typeof defaultConfig> & { [key: string]: T };

function Menu({
  url,
  config,
  children,
  selectedItems = [],
  onSelect,
}: {
  url: string;
  config?: Config<unknown>;
  children: React.ReactNode;
  selectedItems?: string[];
  onSelect?: (selected: string[]) => void;
}) {
  const menuConfig = useMemo(() => ({ ...defaultConfig, ...config }), [config]);

  const [open, setOpen] = useState(false);
  // since we fetch the menu options from a url, its better to allow users to define the textKey, nestedKey, cmdKey and disabledKey here.
  const textKey = menuConfig.items.textKey ?? "text";
  const nestedKey = menuConfig.items.nestedKey ?? "children";
  const cmdKey = menuConfig.items.cmdKey ?? "cmd";
  const disabledKey = menuConfig.items.disabledKey ?? "disabled";

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  const handleOutsideClick = useCallback(
    (e: MouseEvent) => {
      // if the click is on the menu trigger, do nothing.
      // since we are using mousedown event on the document along with the
      // click event on the trigger, we need to check if the click is on the
      // trigger to prevent the menu from closing and opening again.
      if (triggerRef.current?.contains(e.target as Node)) {
        return;
      }
      // if the click is outside the menu, close the menu.
      if (open && !menuRef.current?.contains(e.target as Node)) {
        setOpen(false);
      }
    },
    [open]
  );

  // It is ideal to hand the user the control over the selected items in a menu.
  // this helps us persist the state when the menu is closed as well.
  const handleSelect = useCallback(
    (id: string) => {
      if (selectedItems.includes(id)) {
        onSelect?.(selectedItems.filter((item) => item !== id));
      } else {
        onSelect?.(selectedItems.concat(id));
      }
    },
    [onSelect, selectedItems]
  );

  useEffect(() => {
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [open, handleOutsideClick]);

  const contextValue = useMemo(
    () => ({
      open,
      setOpen,
      config: menuConfig,
      selectedItems,
      onSelect: handleSelect,
      textKey,
      nestedKey,
      cmdKey,
      disabledKey,
    }),
    [
      open,
      setOpen,
      menuConfig,
      selectedItems,
      handleSelect,
      textKey,
      nestedKey,
      cmdKey,
      disabledKey,
    ]
  );

  return (
    <MenuContext.Provider value={contextValue}>
      <div className="relative">
        <div ref={triggerRef}>{children}</div>
        {open && (
          <div ref={menuRef}>
            <MenuContent url={url} />
          </div>
        )}{" "}
      </div>
    </MenuContext.Provider>
  );
}

Menu.Trigger = MenuTrigger;

export default Menu;
export { MenuTrigger, MenuContent };
