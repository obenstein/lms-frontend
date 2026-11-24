"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import queryString from "query-string";

export const SearchInput = () => {
  const searchParams = useSearchParams();
  const [value, setValue] = useState(searchParams.get("title") ?? "");
  const debounceValue = useDebounce(value);

  const router = useRouter();
  const pathname = usePathname();

  const currentCategoryId = searchParams.get("categoryId");

  useEffect(() => {
    const url = queryString.stringifyUrl(
      {
        url: pathname,
        query: {
          categoryId: currentCategoryId,
          title: debounceValue,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.replace(url);
  }, [pathname,debounceValue,currentCategoryId,router]);

  return (
    <div className="relative">
      <Search className="h-4 w-4 absolute top-1/2 -translate-y-1/2 left-4 text-slate-500" />
      <Input onChange={(e)=> setValue(e.target.value)} value={value}
        className="pl-10 h-11 w-full md:w-[340px] rounded-full bg-white border-2 border-slate-200 focus-visible:ring-blue-300"
        aria-label="Search courses"
        placeholder="Search course name..."
      />
    </div>
  );
};
