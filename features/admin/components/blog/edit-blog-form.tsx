"use client";

import React, { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  hideToast,
  showErrorToast,
  showInfoToast,
  showLoadingToast,
  showSuccessToast,
} from "@/components/ui/toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TagTypeEnum } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  type UpdateBlogDTO,
  updateBlogSchema,
  useGetBlog,
  useUpdateBlog,
} from "@/features/blog";
import { BytemdEditor } from "@/components/bytemd";
import { PATHS } from "@/constants";
import { toSlug } from "@/lib/utils";

export const EditBlogForm = () => {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const getBlogQuery = useGetBlog(id, Boolean(id));
  const blog = useMemo(() => {
    return getBlogQuery.data?.blog;
  }, [getBlogQuery]);
  const updateBlogQuery = useUpdateBlog();

  const form = useForm<UpdateBlogDTO>({
    resolver: zodResolver(updateBlogSchema),
    defaultValues: {
      title: blog?.title ?? "",
      id: blog?.id ?? "",
      slug: blog?.slug ?? "",
      description: blog?.description ?? "",
      body: blog?.body ?? "",
      published: blog?.published ?? true,
      author: blog?.author ?? "",
    },
  });

  useEffect(() => {
    form.setValue("title", blog?.title ?? "");
    form.setValue("id", blog?.id ?? "");
    form.setValue("slug", blog?.slug ?? "");
    form.setValue("description", blog?.description ?? "");
    form.setValue("body", blog?.body ?? "");
    form.setValue("published", blog?.published ?? true);
  }, [blog, form]);

  return (
    <Form {...form}>
      <form autoComplete="off">
        <div className="fixed z-10 bottom-10 left-24 right-24 md:left-[20vw] md:right-[20vw]">
          <Button
            type="button"
            onClick={() => form.handleSubmit(handleSubmit)()}
            variant={"outline"}
            className="!w-full"
          >
            保存
          </Button>
        </div>

        <div className="grid gap-4 pb-24 px-1">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>标题</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="请输入标题" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>slug</FormLabel>
                <FormControl>
                  <div className="flex items-center w-full gap-4">
                    <Input {...field} placeholder="请输入slug" />
                    <Button type="button" onClick={handleFormatSlug}>
                      格式化
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>描述</FormLabel>
                <FormControl>
                  <Textarea {...field} placeholder="请输入描述" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="author"
            render={({ field }) => (
              <FormItem>
                <FormLabel>作者</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    value={field.value ?? ""}
                    placeholder="请输入作者"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="published"
            render={({ field }) => (
              <FormItem>``
                <FormLabel>是否发布</FormLabel>
                <FormControl>
                  <div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>内容</FormLabel>
                <FormControl>
                  <div id="content-editor">
                    <BytemdEditor
                      body={field.value}
                      setContent={field.onChange}
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      </form>
    </Form>
  );

  async function handleSubmit(values: UpdateBlogDTO) {
    await updateBlogQuery.runAsync(values);
    router.push(PATHS.ADMIN_BLOG);
  }


  function handleFormatSlug() {
    const tmp = form.getValues().slug?.trim();
    if (tmp) {
      const formatted = toSlug(tmp);
      form.setValue("slug", formatted);
    }
  }
};
