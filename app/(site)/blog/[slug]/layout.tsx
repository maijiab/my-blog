import { getPlublishedBlogBySlug } from "@/features/blog";
import { isNil } from "lodash-es";
import { Metadata } from "next";

import { WEBSITE } from "@/constants";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const { blog } = await getPlublishedBlogBySlug(params.slug);

  if(isNil(blog)){
    return {};
  }

  return {
    title: `${blog.title} - ${WEBSITE}`,
    description: blog.description,
  };

}

export default function Layout({ children }: React.PropsWithChildren) {
  return <>{children}</>;
}
