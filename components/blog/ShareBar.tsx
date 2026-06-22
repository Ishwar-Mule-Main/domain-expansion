"use client";

import { useState, useEffect } from "react";
import { Check, Copy, Share2 } from "lucide-react";

interface ShareBarProps {
  title: string;
  slug: string;
}

export function ShareBar({ title, slug }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const [shareUrl, setShareUrl] = useState("");

  useEffect(() => {
    // Construct URL client-side
    setShareUrl(`${window.location.origin}/blog/${slug}`);
  }, [slug]);

  const handleCopy = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(shareUrl);

  return (
    <div className="flex lg:flex-col items-center gap-3 py-4 lg:py-0 border-t border-b lg:border-none border-[#E5E5E5] w-full lg:w-auto justify-center lg:justify-start">
      <span className="text-[10px] font-mono text-[#888898] uppercase tracking-wider lg:mb-2 flex items-center gap-1.5">
        <Share2 className="h-3 w-3 text-[#FF6200]" /> Share
      </span>
      
      {/* LinkedIn Share */}
      <a
        href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="h-9 w-9 rounded-full border border-[#E5E5E5] bg-white hover:border-[#FF6200] hover:text-[#FF6200] flex items-center justify-center text-[#5A5A6A] transition-all"
        title="Share on LinkedIn"
        aria-label="Share on LinkedIn"
      >
        <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
        </svg>
      </a>

      {/* X / Twitter Share */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`}
        target="_blank"
        rel="noopener noreferrer"
        className="h-9 w-9 rounded-full border border-[#E5E5E5] bg-white hover:border-[#FF6200] hover:text-[#FF6200] flex items-center justify-center text-[#5A5A6A] transition-all"
        title="Share on X"
        aria-label="Share on X"
      >
        <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      </a>

      {/* WhatsApp Share */}
      <a
        href={`https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`}
        target="_blank"
        rel="noopener noreferrer"
        className="h-9 w-9 rounded-full border border-[#E5E5E5] bg-white hover:border-[#FF6200] hover:text-[#25D366] flex items-center justify-center text-[#5A5A6A] transition-all"
        title="Share on WhatsApp"
        aria-label="Share on WhatsApp"
      >
        {/* Custom inline SVG for WhatsApp or Lucide icon */}
        <svg className="h-4.5 w-4.5 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.57 1.98 14.093.955 11.47.953c-5.447 0-9.875 4.372-9.88 9.802-.002 1.77.463 3.5 1.34 5.042l-1.01 3.687 3.79-.983zm11.524-7.72c-.304-.15-1.8-.88-2.077-.98-.277-.1-.48-.15-.68.15-.2.3-.77.98-.94 1.18-.17.2-.34.22-.64.07-1.125-.565-1.93-1.05-2.697-2.355-.2-.35.2-.33.57-1.07.08-.15.04-.27-.02-.37-.06-.1-.48-1.17-.66-1.59-.17-.42-.35-.36-.48-.37-.12-.004-.27-.004-.42-.004-.15 0-.4.06-.6.28-.2.22-.77.75-.77 1.83s.78 2.13.89 2.27c.11.15 1.54 2.345 3.737 3.29.52.22.928.358 1.246.46.525.166 1.002.142 1.38.085.42-.062 1.8-.73 2.05-1.43.25-.7.25-1.29.17-1.42-.08-.13-.27-.2-.58-.35z"/>
        </svg>
      </a>

      {/* Copy Link */}
      <button
        onClick={handleCopy}
        className="h-9 w-9 rounded-full border border-[#E5E5E5] bg-white hover:border-[#FF6200] hover:text-[#FF6200] flex items-center justify-center text-[#5A5A6A] transition-all relative"
        title="Copy Link"
        aria-label="Copy Link"
      >
        {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
        {copied && (
          <span className="absolute -top-8 bg-black text-white text-[9px] font-mono px-1.5 py-0.5 rounded shadow z-50 whitespace-nowrap">
            Copied!
          </span>
        )}
      </button>
    </div>
  );
}
