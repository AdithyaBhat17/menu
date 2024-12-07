import { isValidElement, useContext, cloneElement } from "react";
import { MenuContext } from "./context";
import { ChevronDownIcon } from "lucide-react";
import { clsx } from "clsx";

function MenuTrigger({
  children,
  asChild,
}: {
  children: React.ReactNode;
  asChild?: boolean;
}) {
  const { open, setOpen } = useContext(MenuContext);

  /*
    Sometimes, the user might want a custom trigger element.
    For example, a link or a button.
    In that case, we clone the element and add the onClick and data-trigger attributes.
  */
  if (asChild && isValidElement(children)) {
    return cloneElement(
      children as React.ReactElement<{
        onClick?: () => void;
        "aria-haspopup"?: boolean;
        "aria-expanded"?: boolean;
        "aria-controls"?: string;
      }>,
      {
        onClick: () => setOpen((open) => !open),
        "aria-haspopup": true,
        "aria-expanded": open,
        "aria-controls": "dropdown-menu",
      }
    );
  }

  return (
    <button
      onClick={() => setOpen((open) => !open)}
      className="px-2 py-1 border border-gray-300 rounded-md flex items-center gap-2 w-fit"
      aria-haspopup="true"
      aria-expanded={open}
      aria-controls="dropdown-menu"
    >
      {children}{" "}
      <ChevronDownIcon className={clsx("w-4 h-4", open && "rotate-180")} />
    </button>
  );
}

export default MenuTrigger;
