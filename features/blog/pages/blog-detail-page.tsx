import { type Blog } from "../types";

import { BytemdViewer } from "@/components/bytemd";
import { PreviewQRCode } from "@/components/qr-code";
import { SITE_URL } from "@/config";
import { NICKNAME, PATHS } from "@/constants";
import { toSlashDateString } from "@/lib/utils";

type BlogDetailProps = {
  blog: Blog;
};

export const BlogDetailPage = ({ blog }: BlogDetailProps) => {
  return (
    <div className="md:max-w-screen-md 2xl:max-w-6xl md:px-0 md:mx-auto py-12 md:py-24 grid gap-9 px-6">
      <PreviewQRCode url={`${SITE_URL}/${PATHS.SITE_BLOG}/${blog.slug}`} />
      <article className="max-w-[678px] mx-auto">
        <h1 className="mb-4 text-2xl md:text-4xl font-extrabold ">
          {blog.title}
        </h1>
        <div className="text-sm flex flex-row items-center text-muted-foreground">
          <div>{blog.author ? blog.author : NICKNAME}</div>
          <span className="mx-2">·</span>
          <span>发布于 {toSlashDateString(blog.createdAt)}</span>
        </div>
        <BytemdViewer body={blog.body} />
      </article>
    </div>
  );
};
