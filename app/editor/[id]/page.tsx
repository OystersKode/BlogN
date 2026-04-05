import { getBlogById } from "@/app/actions/blog";
import BlogEditor from "@/components/editor/BlogEditor";
import { notFound } from "next/navigation";

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const blog = await getBlogById(resolvedParams.id);
  
  if (!blog) {
    notFound();
  }

  return <BlogEditor initialData={blog} />;
}
