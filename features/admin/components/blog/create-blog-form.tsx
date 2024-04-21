"use client";

import React from "react";
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
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { TagTypeEnum } from "@prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  type CreateBlogDTO,
  createBlogSchema,
  useCreateBlog,
} from "@/features/blog";
import { BytemdEditor } from "@/components/bytemd";
import { PATHS } from "@/constants";
import { toSlug } from "@/lib/utils";

export const CreateBlogForm = () => {
  const router = useRouter();
  const createBlogQuery = useCreateBlog();
  const form = useForm<CreateBlogDTO>({
    resolver: zodResolver(createBlogSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      body: "",
      published: true,
      author: "",
    },
  });

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
            创建
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
              <FormItem>
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

  async function handleSubmit(values: CreateBlogDTO) {
    await createBlogQuery.runAsync(values);
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
