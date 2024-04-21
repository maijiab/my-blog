import React from "react";

import { cn } from "@/lib/utils";

type HighlightMarkProps = {
  text: string;
  className?: string;
};

type HighlightProps = {
  className?: string;
  highlightMarkClassName?: string;
  sourceString: string;
  searchWords?: string[];
  // 是否大小写敏感
  caseSensitive?: boolean;
};

export const HighlightMark = ({ text, className }: HighlightMarkProps) => {
  return (
    <span
      className={cn("bg-green-300/20 dark:bg-green-100/30 mx-1", className)}
    >
      {text}
    </span>
  );
};

export const Highlight = ({
  sourceString,
  searchWords,
  className,
  highlightMarkClassName,
  caseSensitive,
}: HighlightProps) => {
  return sourceString;
};