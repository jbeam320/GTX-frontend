import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import SearchIcon from "/public/icons/search.svg";

interface SearchConfig<T> {
  fields: (keyof T)[];
  customSearch?: (item: T, query: string) => boolean;
}

interface SearchableListProps<T> {
  data: T[];
  searchConfig: SearchConfig<T>;
  renderItem: (item: T) => React.ReactNode;
  renderEmpty?: () => React.ReactNode;
  searchPlaceholder?: string;
  className?: string;
  listClassName?: string;
  maxHeight?: string;
  showSearch?: boolean;
  [key: string]: any;
}

export default function SearchableList<T>({
  data,
  searchConfig,
  renderItem,
  renderEmpty,
  searchPlaceholder = "Search...",
  className = "",
  listClassName = "",
  maxHeight = "400px",
  showSearch = true,
  ...restprops
}: SearchableListProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data?.filter((item) => {
    if (searchQuery === "") return true;
    const query = searchQuery.toLowerCase();

    // Use custom search if provided
    if (searchConfig.customSearch) {
      return searchConfig.customSearch(item, query);
    }

    // Default search on specified fields
    return searchConfig.fields.some((field) => {
      const value = item[field];
      if (value === null || value === undefined) return false;
      return value.toString().toLowerCase().includes(query);
    });
  });

  return (
    <div className={className}>
      {showSearch && (
        <div className="flex justify-center items-center">
          <div
            className="px-[10px] py-[8px] w-[360px] h-[40px] rounded-[8px] flex items-center space-x-[13px]"
            {...restprops}
          >
            <SearchIcon />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-[261px] h-[18px]  text-white text-[14px] outline-none"
            />
          </div>
        </div>
      )}

      <div className={`space-y-1  ${listClassName}`} style={{ maxHeight }}>
        <AnimatePresence>
          {filteredData?.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
            >
              {renderItem(item)}
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredData?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-4 text-gray-500"
          >
            {renderEmpty ? renderEmpty() : "No results found"}
          </motion.div>
        )}
      </div>
    </div>
  );
}
