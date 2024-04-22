import { type Blog } from "../types";

import { BytemdViewer } from "@/components/bytemd";

type BlogDetailProps = {
  blog: Blog;
};

export const BlogDetailPage = ({ blog }: BlogDetailProps) => {
  return (
    <div className="md:max-w-screen-md 2xl:max-w-6xl md:px-0 md:mx-auto py-12 md:py-24 grid gap-9 px-6">
      <article className="max-w-[678px] mx-auto">
        <BytemdViewer body={blog.body || ""} />
      </article>
    </div>
  );
};
