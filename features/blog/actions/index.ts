"use server";

import { type Prisma } from "@prisma/client";
import { isUndefined } from "lodash-es";
import { prisma } from "@/lib/prisma";

import { getSkip } from "@/utils";
import {
  type CreateBlogDTO,
  type GetBlogsDTO,
  type UpdateBlogDTO,
  createBlogSchema,
  getBlogsSchema,
  updateBlogSchema,
} from "../types";
import { noPermission } from "@/features/user";
import { ERROR_NO_PERMISSION, PUBLISHED_MAP } from "@/constants";

export const createBlog = async (params: CreateBlogDTO) => {
  if (await noPermission()) {
    throw ERROR_NO_PERMISSION;
  }
  const result = await createBlogSchema.safeParseAsync(params);
  if (!result.success) {
    const error = result.error.format()._errors?.join(";");
    // TODO: 记录日志
    throw new Error(error);
  }
  const blogs = await prisma.blog.findMany({
    where: {
      OR: [{ title: result.data.title }, { slug: result.data.slug }],
    },
  });

  if (blogs.length) {
    // TODO: 记录日志
    throw new Error("标题或者slug重复");
  }

  await prisma.blog.create({
    data: {
      title: result.data.title,
      slug: result.data.slug,
      description: result.data.description,
      body: result.data.body,
      published: result.data.published,
      author: result.data.author,
    },
  });
};

export const getBlogs = async (params: GetBlogsDTO) => {
  const result = await getBlogsSchema.safeParseAsync(params);

  if (!result.success) {
    const error = result.error.format()._errors?.join(";");
    // TODO: 记录日志
    throw new Error(error);
  }

  // 无权限，只能查看已发布的blog
  const published = await noPermission();
  const cond: Prisma.BlogWhereInput = {};

  // TODO: 想个办法优化一下，这个写法太啰嗦了，好多 if
  if (published || !isUndefined(result.data.published)) {
    const searchPublished: boolean | undefined =
      PUBLISHED_MAP[result.data.published!];
    if (!isUndefined(searchPublished)) {
      cond.published = searchPublished;
    }
    if (published) {
      cond.published = published;
    }
  }

  if (result.data?.title?.trim()) {
    cond.OR = [
      ...(cond.OR ?? []),
      ...[
        {
          title: {
            contains: result.data.title?.trim(),
          },
        },
      ],
    ];
  }
  if (result.data?.slug?.trim()) {
    cond.OR = [
      ...(cond.OR ?? []),
      ...[
        {
          slug: {
            contains: result.data.slug?.trim(),
          },
        },
      ],
    ];
  }

  const sort: Prisma.BlogOrderByWithRelationInput = {};
  if (result.data.orderBy && result.data.order) {
    sort[result.data.orderBy] = result.data.order;
  }

  const total = await prisma.blog.count({ where: cond });
  const blogs = await prisma.blog.findMany({
    where: cond,
    take: result.data.pageSize,
    orderBy: sort,
    skip: getSkip(result.data.pageIndex, result.data.pageSize),
  });

  return { total, blogs };
};

export const getPublishedBlogs = async () => {
  const blogs = await prisma.blog.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const count = await prisma.blog.count({
    where: {
      published: true,
    },
  });

  const total = count ?? 0;

  return {
    blogs,
    total,
  };
};


export const getBlogByID = async (id: string) => {
  const blog = await prisma.blog.findUnique({
    where: { id },
  });

  return { blog };
};

export const getPlublishedBlogBySlug = async (slug: string) => {
  const blog = await prisma.blog.findUnique({
    where: { slug, published: true },
  });

  return { blog };
};

export const deleteBlogByID = async (id: string) => {
  if (await noPermission()) {
    throw ERROR_NO_PERMISSION;
  }

  const isExist = await isBlogExistByID(id);

  if (!isExist) {
    throw new Error("Blog不存在");
  }

  await prisma.blog.delete({
    where: {
      id,
    },
  });
};


export const isBlogExistByID = async (id: string): Promise<boolean> => {
  const isExist = await prisma.blog.findUnique({ where: { id } });

  return Boolean(isExist);
};
export const toggleBlogPublished = async (id: string) => {
  if (await noPermission()) {
    throw ERROR_NO_PERMISSION;
  }
  const blog = await prisma.blog.findUnique({
    where: {
      id,
    },
  });

  if (!blog) {
    throw new Error("Blog不存在");
  }

  await prisma.blog.update({
    data: {
      published: !blog.published,
    },
    where: {
      id,
    },
  });
};


export const updateBlog = async (params: UpdateBlogDTO) => {
  if (await noPermission()) {
    throw ERROR_NO_PERMISSION;
  }
  const result = await updateBlogSchema.safeParseAsync(params);

  if (!result.success) {
    const error = result.error.format()._errors?.join(";");
    // TODO: 记录日志
    throw new Error(error);
  }

  const blog = await prisma.blog.findUnique({
    where: {
      id: result.data.id,
    },
    include: { tags: true },
  });

  if (!blog) {
    throw new Error("Blog不存在");
  }

  await prisma.blog.update({
    data: {
      title: result.data.title,
      description: result.data.description,
      slug: result.data.slug,
      author: result.data.author,
      body: result.data.body,
      published: result.data.published,
    },
    where: {
      id: result.data.id,
    },
  });
};
