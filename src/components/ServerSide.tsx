"use client";

import { useState } from "react";

interface ServerResizeProps{
  compressedFile: File | null;
  originalSize: number | null;
  onresized: (data : ResizeResult) => void;
}

interface ResizeResult {
  originalUrl: string;
  thumbnailUrl: string;
  size: {
    compressed: number;
  };
  sizes: {
    thumbnail: number;
  };
}

export default function ServerResize ({compressedFile, originalSize, onresized} : ServerResizeProps) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ResizeResult | null>(null);

  const handleResized = async () => {
    if (!compressedFile) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", compressedFile);

    try {
      const response = await fetch("/api/server-resize", {
        method: "POST",
        body: formData,
      });

      // Clone response before reading body, so we can read it twice if needed
      if (!response.ok) {
        const errorText = await response.clone().text();
        console.error("Server response:", errorText);
        throw new Error(`Server error ${response.status}: ${errorText}`);
      }


      const data: ResizeResult = await response.json();
      setResult(data);
      onresized(data);
    } catch (error) {
      console.error("Error during server resize", error);
    } finally {
      setLoading(false);
    }
  }

  const formatBytes = (bytes: number) => {
    return (bytes / 1024).toFixed(2) + ' KB'
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h2 className="text-2xl font-bold mb-4">step 2: Server side resize</h2>
      <p className="text-gray-500 mb-6">Generate thumbnail 300x300</p>

      <button
        onClick={handleResized}
        disabled={loading || !compressedFile}
        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 font-medium"
      >
        {loading ? "Proses Resize..." : "Generate thumbnail"}
      </button>

      {result && (
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">Compress Image</h3>
            <img
              src={result.originalUrl}
              alt="Compressed"
              className="w-full h-64 object-contain rounded bg-gray-50"
            />
            <p className="mt-3 text-sm text-gray-600">
              Size: {formatBytes(result.size.compressed)}
            </p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-3">thumbnail 300x300</h3>
            <img
              src={result.thumbnailUrl}
              alt="Thumbnail"
              className="w-full h-64 object-contain rounded bg-gray-50"
            />
            <p className="mt-3 text-sm text-gray-600">
              Size: {formatBytes(result.sizes.thumbnail)}
            </p>
            <p className="text-sm text-green-600 font-medium">
              -{((1 - (result.sizes.thumbnail / result.size.compressed)) * 100).toFixed(1)}% smaller than compressed
            </p>
          </div>
        </div>
      )}
    </div>
  )
}