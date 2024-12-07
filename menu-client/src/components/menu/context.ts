import { createContext } from "react";
import { SearchType } from "../../constants/search";

type Config<T> = {
  search?: {
    placeholder?: string;
    type?: SearchType;
  };
} & T;

export const MenuContext = createContext<{
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  config: Config<unknown>;
  selectedItems: string[];
  onSelect: (id: string) => void;
  textKey: string;
  nestedKey: string;
  cmdKey: string;
  disabledKey: string;
}>({
  open: false,
  setOpen: () => {},
  config: {},
  selectedItems: [],
  onSelect: () => {},
  textKey: "text",
  nestedKey: "children",
  cmdKey: "cmd",
  disabledKey: "disabled",
});
