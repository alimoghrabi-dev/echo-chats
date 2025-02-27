import React, { useEffect, useState } from "react";
import { formUrlQuery, removeKeysFromQuery } from "@/lib/utils";
import { useNavigate, useSearchParams } from "react-router";
import DOMPurify from "dompurify";
import { Search } from "lucide-react";

const SearchInputQuery: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [search, setSearch] = useState<string>(
    searchParams.get("search-query") || ""
  );

  const sanitizedInput = (input: string) => {
    return DOMPurify.sanitize(input.trim());
  };

  useEffect(() => {
    const delayDebounceFN = setTimeout(() => {
      const sanitizedSearch = sanitizedInput(search);

      if (sanitizedSearch) {
        navigate(
          formUrlQuery({
            params: searchParams.toString(),
            key: "search-query",
            value: sanitizedSearch,
          })
        );
      } else {
        navigate(
          removeKeysFromQuery({
            params: searchParams.toString(),
            keys: ["search-query"],
          })
        );
      }
    }, 750);

    return () => clearTimeout(delayDebounceFN);
  }, [search, searchParams, navigate]);

  return (
    <div className="w-full flex items-center gap-x-2.5 px-3.5 py-2 rounded-lg bg-primary/20 hover:bg-primary/25 transition-all cursor-text">
      <Search size={21} className="text-neutral-800" />
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        autoComplete="off"
        autoCapitalize="off"
        onPaste={(e) => e.preventDefault()}
        className="w-full bg-transparent outline-none placeholder:text-neutral-600 text-neutral-800 transition duration-150"
      />
    </div>
  );
};

export default SearchInputQuery;
