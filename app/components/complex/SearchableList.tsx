import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

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
}

export function SearchableList<T>({
  data,
  searchConfig,
  renderItem,
  renderEmpty,
  searchPlaceholder = "Search...",
  className = "",
  listClassName = "",
  maxHeight = "400px",
  showSearch = true,
}: SearchableListProps<T>) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter((item) => {
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
        <div className="relative mb-4">
          <div className="absolute left-4 top-1/2 -translate-y-1/2">
            <svg
              className="w-4 h-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="w-full pl-12 pr-4 py-3 bg-[#2C2C2C] text-white rounded-lg outline-none placeholder-gray-500"
          />
        </div>
      )}

      <div
        className={`space-y-1 overflow-y-auto ${listClassName}`}
        style={{ maxHeight }}
      >
        <AnimatePresence>
          {filteredData.map((item, index) => (
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

        {filteredData.length === 0 && (
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
