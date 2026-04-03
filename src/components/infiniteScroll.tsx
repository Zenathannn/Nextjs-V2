"use client";

import { useEffect, useState, useRef, useCallback } from "react";

interface Item {
  id: number;
  name: string;
  body: string;
  page: number;
}

export default function InfiniteScroll() {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // ✅ FIX 1: Gunakan ref untuk mencegah double-fetch di React StrictMode
  const isFetchingRef = useRef(false);

  const fetchData = useCallback(async (pageNum: number): Promise<Item[]> => {
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (pageNum > 5) return [];

    return Array.from({ length: 10 }, (_, index) => ({
      id: (pageNum - 1) * 10 + index + 1,
      name: `Item ${(pageNum - 1) * 10 + index + 1}`,
      body: `Deskripsi untuk item ${(pageNum - 1) * 10 + index + 1}`,
      page: pageNum,
    }));
  }, []);

  const loadMoreItems = useCallback(async (pageNum: number) => {
    // ✅ FIX 2: Cek isFetchingRef agar tidak double-fetch
    if (isFetchingRef.current || !hasMore) return;

    isFetchingRef.current = true;
    setLoading(true);

    try {
      const newItems = await fetchData(pageNum);
      if (newItems.length === 0) {
        setHasMore(false);
      } else {
        // ✅ FIX 3: Deduplikasi saat append untuk keamanan ekstra
        setItems((prev) => {
          const existingIds = new Set(prev.map((item) => item.id));
          const unique = newItems.filter((item) => !existingIds.has(item.id));
          return [...prev, ...unique];
        });
        setPage(pageNum + 1);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
      isFetchingRef.current = false;
    }
  }, [fetchData, hasMore]);

  // ✅ FIX 4: Load data awal dengan page langsung, bukan dari state
  useEffect(() => {
    loadMoreItems(1);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreItems(page);
        }
      },
      { rootMargin: "200px", threshold: 0.1 }
    );

    const currentSentinel = sentinelRef.current;
    if (currentSentinel) observer.observe(currentSentinel);

    return () => {
      if (currentSentinel) observer.unobserve(currentSentinel);
    };
  }, [loadMoreItems, page]);

  return (
    <div className="w-full">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Infinite Scroll</h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="p-6 bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <h4 className="text-lg font-semibold text-indigo-600 mb-2">{item.name}</h4>
            <p className="text-gray-600">{item.body}</p>
            <span className="inline-block mt-2 text-xs text-gray-400">
              Halaman {item.page} # ID {item.id}
            </span>
          </div>
        ))}
      </div>

      {loading && (
        <div className="space-y-4 mt-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonLoader key={index} />
          ))}
        </div>
      )}

      <div ref={sentinelRef} className="h-10 flex items-center justify-center">
        {!hasMore && !loading && (
          <p className="text-gray-500 text-sm font-medium">
            Anda sudah mencapai akhir feed
          </p>
        )}
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 animate-pulse">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-full mt-2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6 mt-2"></div>
      <div className="h-3 bg-gray-100 rounded w-1/4 mt-2"></div>
    </div>
  );
}