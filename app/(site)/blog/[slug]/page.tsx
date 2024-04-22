
import { BlogDetailPage, getPlublishedBlogBySlug } from "@/features/blog";

export default async function Page({ params }: { params: { slug: string } }) {
  const { blog } = await getPlublishedBlogBySlug(params.slug);


  return <BlogDetailPage blog={blog}  />;
}
