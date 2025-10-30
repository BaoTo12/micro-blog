
import React, { useState } from 'react';
import FacebookIcon from './icons/FacebookIcon';
import TwitterIcon from './icons/TwitterIcon';
import LinkIcon from './icons/LinkIcon';

interface ShareToolbarProps {
  url: string;
  title: string;
}

const ShareToolbar: React.FC<ShareToolbarProps> = ({ url, title }) => {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
  const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;

  return (
    <div className="flex items-center space-x-2 p-2 rounded-full bg-slate-100 border border-slate-200">
        <span className="text-sm font-semibold text-slate-600 ml-2">Share:</span>
        <a href={facebookShareUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <FacebookIcon className="w-5 h-5 text-[#1877F2]" />
        </a>
        <a href={twitterShareUrl} target="_blank" rel="noopener noreferrer" className="p-2 rounded-full hover:bg-slate-200 transition-colors">
            <TwitterIcon className="w-5 h-5 text-[#1DA1F2]" />
        </a>
        <button onClick={copyToClipboard} className="p-2 rounded-full hover:bg-slate-200 transition-colors relative">
            <LinkIcon className="w-5 h-5 text-slate-500" />
            {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 text-xs bg-slate-800 text-white px-2 py-1 rounded">Copied!</span>}
        </button>
    </div>
  );
};

export default ShareToolbar;
