import React from "react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { IconSolarEyeBold } from "@/components/icons";
import { NICKNAME, PATHS } from "@/constants";
import { toSlashDateString } from "@/lib/utils";
import { formatNum } from "@/utils";
import { type Blog } from "../types";

interface BlogListItemProps {
  blog: Blog;
}

export const BlogListItem = ({ blog }: BlogListItemProps) => {
  return (
    <Link
      key={blog.id}
      href={`${PATHS.SITE_BLOG}/${blog.slug}`}
      className="rounded-2xl border flex items-center p-6 transition-[border] hover:border-primary h-full"
    >
      <div className="grid gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <h3 className="text-lg md:text-2xl font-semibold line-clamp-1">
              {blog.title}
            </h3>
          </TooltipTrigger>
          <TooltipContent>{blog.title}</TooltipContent>
        </Tooltip>
        <Tooltip>
          <TooltipTrigger asChild>
            <p className="text-sm text-muted-foreground line-clamp-1">
              {blog.description}
            </p>
          </TooltipTrigger>
          <TooltipContent>{blog.description}</TooltipContent>
        </Tooltip>

        <div className="text-sm text-muted-foreground flex items-center space-x-2">
          <span>{blog.author ? blog.author : NICKNAME}</span>
          <span>·</span>
          <span>{toSlashDateString(blog.createdAt)}</span>
        </div>
      </div>
    </Link>
  );
};
