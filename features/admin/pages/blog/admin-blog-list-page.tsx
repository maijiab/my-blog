"use client";

import React, { useMemo } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSetState } from "ahooks";
import { isUndefined } from "lodash-es";
import { PageHeader } from "@/components/page-header";
import {
  IconSolarAddSquare,
  IconSolarCalendarMark,
  IconSolarEyeBold,
  IconSolarMinimalisticMagnifer,
  IconSolarPen,
  IconSolarRestart,
  IconSolarSortFromBottomToTopLinear,
  IconSolarSortFromTopToBottomLinear,
  IconSolarTag,
  IconSolarTextField,
} from "@/components/icons";
import { IllustrationNoContent } from "@/components/illustrations";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Column, type ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTable } from "@/components/ui/data-table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DEFAULT_PAGE_INDEX,
  DEFAULT_PAGE_SIZE,
  NICKNAME,
  PATHS,
  PLACEHODER_TEXT,
  PUBLISHED_ENUM,
  PUBLISHED_LABEL_MAP,
} from "@/constants";
import { type Blog, type GetBlogsDTO, useGetBlogs } from "@/features/blog";
import {
  AdminContentLayout,
  DeleteBlogButton,
  ToggleBlogPublishSwitch,
} from "../../components";
import { Highlight } from "@/components/highlight";
import { cn, isAdmin, toSlashDateString, toFromNow } from "@/lib/utils";

export const AdminBlogListPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [params, updateParams] = useSetState<GetBlogsDTO>({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
    order: "desc",
    orderBy: "createdAt",
  });

  const [inputParams, updateInputParams] = useSetState<
    Omit<GetBlogsDTO, "pageIndex" | "pageSize">
  >({
    title: undefined,
    published: undefined,
  });

  const getBlogsQuery = useGetBlogs(params);

  const data = useMemo(() => getBlogsQuery.data?.blogs ?? [], [getBlogsQuery]);

  const columns: ColumnDef<Blog>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "title",
      header: () => (
        <div className="flex space-x-1 items-center">
          <IconSolarTextField className="text-sm" />
          <span>标题</span>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <Highlight
            sourceString={row.original.title}
            searchWords={params.title ? [params.title] : undefined}
          />
        );
      },
    },
    {
      accessorKey: "author",
      header: () => (
        <div className="flex space-x-1 items-center">
          <IconSolarTextField className="text-sm" />
          <span>作者</span>
        </div>
      ),
      cell: ({ row }) => {
        return row?.original?.author?.length ? row?.original?.author : NICKNAME;
      },
    },
    {
      accessorKey: "published",
      header: () => (
        <div className="flex space-x-1 items-center">
          <IconSolarEyeBold className="text-sm" />
          <span>发布状态</span>
        </div>
      ),
      cell: ({ row }) => {
        return (
          <ToggleBlogPublishSwitch
            id={row.original.id}
            published={row.original.published}
            refreshAsync={getBlogsQuery.refreshAsync}
          />
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: () => (
        <Button
          variant="ghost"
          onClick={() => {
            handleOrderChange("createdAt");
          }}
        >
          <IconSolarCalendarMark className="text-sm" />
          <span className="mx-1">创建时间</span>
          {params.order === "asc" && params.orderBy == "createdAt" && (
            <IconSolarSortFromBottomToTopLinear />
          )}
          {params.order === "desc" && params.orderBy == "createdAt" && (
            <IconSolarSortFromTopToBottomLinear />
          )}
        </Button>
      ),
      cell({ row }) {
        return toSlashDateString(row.original.createdAt);
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        return (
          <div className="flex gap-2 items-center">
            <Link
              className={cn(buttonVariants({ variant: "ghost", size: "icon" }))}
              href={`${PATHS.SITE_BLOG}/${row.original.slug}`}
              target="_blank"
            >
              <IconSolarEyeBold className="text-base" />
            </Link>
            <Button
              size={"icon"}
              variant="ghost"
              onClick={() => handleGoToEdit(row.original.id)}
            >
              <IconSolarPen className="text-base" />
            </Button>
            <DeleteBlogButton
              id={row.original.id}
              refreshAsync={getBlogsQuery.refreshAsync}
            />
          </div>
        );
      },
    },
  ];

  return (
    <AdminContentLayout
      pageHeader={
        <PageHeader
          breadcrumbList={[PATHS.ADMIN_HOME, PATHS.ADMIN_BLOG]}
          action={
            <Button onClick={handleGoToCreate}>
              <IconSolarAddSquare className="mr-2 text-base" />
              创建博客
            </Button>
          }
        />
      }
    >
      <div className="grid gap-4 grid-cols-4 px-2 py-4 items-end">
        <Input
          placeholder="请输入标题"
          value={inputParams.title || ""}
          onChange={(v) =>
            updateInputParams({
              title: v.target.value,
            })
          }
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleSearch();
            }
          }}
        />

        {isAdmin(session?.user?.email) && (
          <Select
            onValueChange={(v: PUBLISHED_ENUM) =>
              updateInputParams({ published: v })
            }
            value={inputParams.published}
          >
            <SelectTrigger
              className={cn({
                "text-muted-foreground": isUndefined(inputParams.published),
              })}
            >
              <SelectValue placeholder="请选择发布状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={PUBLISHED_ENUM.ALL}>
                {PUBLISHED_LABEL_MAP[PUBLISHED_ENUM.ALL]}
              </SelectItem>
              <SelectItem value={PUBLISHED_ENUM.PUBLISHED}>
                {PUBLISHED_LABEL_MAP[PUBLISHED_ENUM.PUBLISHED]}
              </SelectItem>
              <SelectItem value={PUBLISHED_ENUM.NO_PUBLISHED}>
                {PUBLISHED_LABEL_MAP[PUBLISHED_ENUM.NO_PUBLISHED]}
              </SelectItem>
            </SelectContent>
          </Select>
        )}

        <div className="flex items-center space-x-4">
          <Button onClick={handleSearch}>
            <IconSolarMinimalisticMagnifer className="mr-2" />
            搜索
          </Button>
          <Button onClick={handleReset}>
            <IconSolarRestart className="mr-2" />
            重置
          </Button>
        </div>
      </div>
      <DataTable
        columns={columns}
        data={data}
        total={getBlogsQuery.data?.total}
        loading={getBlogsQuery.loading}
        params={{ ...params }}
        updateParams={updateParams}
        noResult={
          <div className="grid place-content-center gap-4 py-16">
            <IllustrationNoContent />
            <p>暂无内容</p>
          </div>
        }
      />
    </AdminContentLayout>
  );

  function handleSearch() {
    updateParams({
      title: inputParams.title,
      published: inputParams.published,
    });
  }

  function handleReset() {
    updateInputParams({
      title: "",
      published: undefined,
    });
    updateParams({
      title: "",
      published: undefined,
      pageIndex: DEFAULT_PAGE_INDEX,
      order: "desc",
      orderBy: "createdAt",
    });
  }

  function handleOrderChange(orderBy: GetBlogsDTO["orderBy"]) {
    updateParams((prev) => {
      if (prev.orderBy !== orderBy) {
        return { orderBy: orderBy, order: "asc" };
      } else {
        if (prev.order === "desc") {
          return { orderBy: undefined, order: undefined };
        } else if (prev.order === "asc") {
          return { order: "desc" };
        } else {
          return { order: "asc" };
        }
      }
    });
  }

  function handleGoToCreate() {
    router.push(PATHS.ADMIN_BLOG_CREATE);
  }

  function handleGoToEdit(id: string) {
    router.push(`${PATHS.ADMIN_BLOG_EDIT}/${id}`);
  }
};
