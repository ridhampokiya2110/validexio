'use client';

import { useState } from 'react';
import { Download, Loader2 } from 'lucide-react';

interface BoilerplateDownloadButtonProps {
  reportId: string;
  ideaTitle: string;
}

export default function BoilerplateDownloadButton({ reportId, ideaTitle }: BoilerplateDownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const resp = await fetch(`/api/v1/projects/${reportId}/export/code`);
      if (!resp.ok) {
        const data = await resp.json().catch(() => ({}));
        throw new Error(data.error || 'Download failed');
      }
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${ideaTitle.replace(/\s+/g, '_')}_boilerplate.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(e.message || 'Download failed. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={isDownloading}
      className="btn-primary text-sm gap-2 px-3 py-1.5 flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
    >
      {isDownloading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin flex-shrink-0" />
          <span className="whitespace-nowrap">Building .ZIP...</span>
        </>
      ) : (
        <>
          <Download className="w-4 h-4" />
          Download .ZIP
        </>
      )}
    </button>
  );
}
