import { useState } from 'react';

export function useCopyToClipboard(): [
  string | null,
  (text: string) => Promise<void>
] {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const copy = async (text: string) => {
    if (!navigator?.clipboard) return;

    try {
      await navigator.clipboard.writeText(text);
      setCopiedText(text);
      setTimeout(() => setCopiedText(null), 2000);
    } catch {
      setCopiedText(null);
    }
  };

  return [copiedText, copy];
}
