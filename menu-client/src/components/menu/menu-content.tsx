import clsx from "clsx";
import {
  memo,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useFetch } from "./hooks/useFetch";
import { MenuContext } from "./context";
import { SearchType } from "../../constants/search";
import { Check } from "lucide-react";

type MenuOption = {
  id: string;
  [key: string]: string | MenuOption[];
};

type MenuContentProps = {
  menuOptions?: MenuOption[];
  parentId?: string;
  url: string;
};

function MenuContent({ menuOptions, parentId, url }: MenuContentProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);
  const [search, setSearch] = useState<string>("");
  const [menuPosition, setMenuPosition] = useState<"bottom" | "top" | null>(
    null
  );

  const {
    config,
    selectedItems,
    onSelect,
    textKey,
    nestedKey,
    cmdKey,
    disabledKey,
  } = useContext(MenuContext);

  /*
    I'm assuming that we only either support internal or external search, not both.
    But supporting both search types should not be a problem.
    TODO: add debounce support for external search and avoid unnecessary API requests.
  */
  const { data, isFetching, error } = useFetch<MenuOption[]>(
    url +
      (config.search?.type === SearchType.EXTERNAL ? `?search=${search}` : ""),
    {
      enabled: !!url,
    }
  );

  const options = useMemo(() => {
    const _options = menuOptions || data;
    if (!_options) return [];
    if (config.search?.type === SearchType.INTERNAL) {
      return _options.filter((option) =>
        (option[textKey] as string).toLowerCase().includes(search.toLowerCase())
      );
    }
    return _options;
  }, [menuOptions, data, config.search?.type, textKey, search]);

  // menuItemsRef comes in handy to help us get the position of the menu item and render the
  // submenu in the correct position.
  const menuItemsRef = useRef<HTMLDivElement[]>([]);
  // menuContentRef is used to determine whether the menu is opened from the top or bottom
  // of the trigger element.
  const menuContentRef = useRef<HTMLDivElement>(null);

  // closeTimeout is used to delay the closing of the submenu when the user hovers over a submenu.
  // this is to allow the user to hover over the submenu and not have it close immediately when the user
  // leaves the current menu item.
  const closeTimeout = useRef<NodeJS.Timeout | null>(null);

  // fallbackParentId is used when the menu is not nested inside another menu.
  const fallbackParentId = useId();

  const getSubmenuPosition = useCallback((id: string) => {
    const menuItem = menuItemsRef.current[id];
    if (!menuItem) return "right";

    const rect = menuItem.getBoundingClientRect();
    const spaceOnRight = window.innerWidth - rect.right;
    const submenuWidth = menuContentRef.current?.clientWidth ?? 150;

    return spaceOnRight > submenuWidth ? "right" : "left";
  }, []);

  const getMenuPosition = useCallback(() => {
    const menuItem = menuContentRef.current;
    if (!menuItem) return "bottom";

    const rect = menuItem.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const menuHeight = 320;

    if (spaceBelow >= menuHeight || spaceBelow >= spaceAbove) {
      return "bottom";
    }
    return "top";
  }, []);

  const handleMouseEnter = useCallback((id: string) => {
    if (closeTimeout.current) {
      clearTimeout(closeTimeout.current);
    }
    setHoveredItem(id);
  }, []);

  const handleMouseLeave = useCallback(() => {
    closeTimeout.current = setTimeout(() => {
      setHoveredItem(null);
    }, 100);
  }, []);

  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    []
  );

  const handleSelect = useCallback(
    (key: string) => {
      onSelect(key);
    },
    [onSelect]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>, key: string) => {
      if (e.key === "Enter") {
        e.preventDefault();
        handleSelect(key);
        const target = e.target as HTMLDivElement;
        if (!target.dataset.id) return;
        setHoveredItem(
          hoveredItem === target.dataset.id ? null : target.dataset.id
        );
      }
    },
    [handleSelect, hoveredItem]
  );

  // We use useLayoutEffect instead of useEffect here to ensure that the
  // menu position is set before the browser has a chance to repaint the menu.
  useLayoutEffect(() => {
    if (!parentId) setMenuPosition(getMenuPosition());
  }, [getMenuPosition, parentId]);

  return (
    <div
      className={clsx("menu-content", {
        "top-full mt-1": menuPosition === "bottom",
        "bottom-full mb-1": menuPosition === "top",
      })}
      key={fallbackParentId}
      ref={menuContentRef}
    >
      <div className="p-1">
        <input
          type="text"
          placeholder={config.search?.placeholder ?? "Search"}
          className="menu-search-input"
          autoFocus
          aria-label="Search"
          value={search}
          onChange={handleSearchChange}
        />
      </div>

      {isFetching && (
        <div className="flex flex-col gap-1 p-1">
          <div className="h-6 w-full bg-gray-200 dark:bg-gray-500 rounded-md animate-pulse" />
          <div className="h-6 w-full bg-gray-200 dark:bg-gray-500 rounded-md animate-pulse" />
          <div className="h-6 w-full bg-gray-200 dark:bg-gray-500 rounded-md animate-pulse" />
        </div>
      )}
      {!isFetching && search.trim().length > 0 && options.length === 0 ? (
        <div className="p-1 pb-2 text-sm text-gray-500 text-center">
          No results found
        </div>
      ) : null}
      {error && (
        <div className="p-1 pb-2 text-sm text-red-500 text-center">
          {error.message ?? "Error fetching menu options"}
        </div>
      )}
      {!isFetching &&
        options?.map((option: MenuOption) => {
          const id = parentId
            ? `${parentId}-${option.id}`
            : `${fallbackParentId}-${option.id}`;
          const hovered = hoveredItem === id;
          const submenuPosition = getSubmenuPosition(id);
          const hasChildren =
            (option[nestedKey] && option[nestedKey].length > 0) || !!option.url;
          const selected = selectedItems.includes(option[textKey] as string);
          const disabled = !!option[disabledKey];

          return (
            <div
              className="relative rounded-md"
              key={id}
              ref={(el) => (menuItemsRef.current[id] = el)}
              role="menuitem"
              aria-selected={selected}
              aria-disabled={disabled}
              aria-hidden={disabled}
            >
              <div
                className={clsx("menu-item", {
                  selected,
                  disabled,
                })}
                onMouseEnter={() => handleMouseEnter(id)}
                onMouseLeave={handleMouseLeave}
                onClick={() =>
                  !disabled &&
                  !hasChildren &&
                  handleSelect(option[textKey] as string)
                }
                onKeyDown={(e) =>
                  !disabled &&
                  !hasChildren &&
                  handleKeyDown(e, option[textKey] as string)
                }
                data-id={id}
                tabIndex={0}
              >
                <div className="menu-item-label">
                  {selected && <Check className="w-4 h-4" />}
                  {option[textKey] as string}
                </div>
                {option[cmdKey] && (
                  <div className="menu-item-cmd">
                    {option[cmdKey] as string}
                  </div>
                )}
                {hasChildren && (
                  <div className="menu-item-children">&rsaquo;</div>
                )}
              </div>
              {hovered && (option[nestedKey] || option.url) && (
                <div
                  className={clsx(
                    "absolute top-0 z-10 bg-white shadow-lg rounded-md",
                    {
                      "left-full ml-2": submenuPosition === "right",
                      "right-full mr-2": submenuPosition === "left",
                    }
                  )}
                  onMouseEnter={() => handleMouseEnter(id)}
                  onMouseLeave={handleMouseLeave}
                >
                  <MenuContent
                    menuOptions={option[nestedKey] as MenuOption[]}
                    parentId={id}
                    url={(option.url as string) || url}
                  />
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}

const MemoizedMenuContent = memo(MenuContent);

export { MemoizedMenuContent as MenuContent };
