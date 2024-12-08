import { StrictMode, useCallback, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import Menu from "./components/menu";
import { SearchType } from "./constants/search";

/**
 * TODO:
 * - close on outsideclick ✅
 * - Add url support ✅
 * - show child menu if children or url is present ✅
 * - Add internal and external search ✅
 * - Add select states ✅
 * - Test multiple menus on one page ✅
 * - Add a11y support ✅
 * - Add disabled items (optional) ✅
 * - Add debounce support for search (optional) ✅
 */

const API_URL = import.meta.env.VITE_API_URL;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
export default function App() {
  return (
    <div className="flex flex-col gap-4 justify-start w-full h-full px-6">
      <MenuWithCustomTrigger />
      <MenuWithDefaultTrigger />
    </div>
  );
}

const optionsUrl = `${API_URL}/options`;
function MenuWithCustomTrigger() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelect = useCallback((selected: string[]) => {
    setSelectedItems(selected);
  }, []);

  return (
    <Menu
      url={optionsUrl}
      selectedItems={selectedItems}
      onSelect={handleSelect}
    >
      <Menu.Trigger asChild>
        <button className="w-fit px-2 py-1 border border-gray-300 rounded-md flex items-center gap-2">
          Open menu
        </button>
      </Menu.Trigger>
    </Menu>
  );
}

const fontsUrl = `${API_URL}/fonts`;
function MenuWithDefaultTrigger() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const handleSelect = useCallback((selected: string[]) => {
    setSelectedItems(selected);
  }, []);

  const config = useMemo(
    () => ({
      search: { type: SearchType.EXTERNAL, placeholder: "Search" },
    }),
    []
  );

  return (
    <Menu
      url={fontsUrl}
      config={config}
      selectedItems={selectedItems}
      onSelect={handleSelect}
      useDebounce={300}
    >
      <Menu.Trigger>Open menu</Menu.Trigger>
    </Menu>
  );
}
