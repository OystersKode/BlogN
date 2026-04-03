import { getBlogBySlug } from '@/app/actions/blog';
import { getComments } from '@/app/actions/comment';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import Navbar from '@/components/layout/Navbar';
import { format } from 'date-fns';
import BlogContent from '@/components/blog/BlogContent';
import Comments from '@/components/blog/Comments';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import FollowButton from '@/components/profile/FollowButton';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.slug);
  if (!blog) return {};

  return {
    title: `${blog.title} | BlogDAA`,
    description: blog.seoDescription || blog.title,
    openGraph: {
      images: [blog.coverImage],
    },
  };
}

const BlogDetailPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const resolvedParams = await params;
  const blog = await getBlogBySlug(resolvedParams.slug);
  const session = await getServerSession(authOptions);

  if (!blog) {
    notFound();
  }

  const comments = await getComments(blog._id.toString());

  return (
    <main className="min-h-screen bg-white">
      <Navbar />
      <article className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <header className="mb-12 space-y-6">
          <div className="flex items-center gap-3">
             <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-bold uppercase tracking-wider rounded-full">
               {blog.category}
             </span>
             <span className="text-gray-400 text-sm">•</span>
             <span className="text-gray-500 text-sm font-medium">{blog.readingTime}</span>
          </div>

          <h1 className="text-5xl font-black text-gray-900 leading-tight">
            {blog.title}
          </h1>

          <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
            <Link href={`/user/${blog.author._id}`} className="flex items-center gap-4 group">
               <Image
                 src={blog.author.image || '/default-avatar.png'}
                 alt={blog.author.name}
                 width={48}
                 height={48}
                 className="rounded-full ring-2 ring-blue-50"
               />
               <div>
                 <p className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{blog.author.name}</p>
                 <p className="text-sm text-gray-500">{format(new Date(blog.createdAt), 'MMM dd, yyyy')}</p>
               </div>
            </Link>
            
            {session && (session.user as any).id !== blog.author._id && (
               <div className="ml-auto">
                  <FollowButton targetUserId={blog.author._id} initialFollowing={blog.isFollowingAuthor} />
               </div>
            )}
          </div>
        </header>

        {blog.coverImage && (
          <div className="relative w-full h-[450px] mb-12 rounded-3xl overflow-hidden shadow-2xl border border-gray-100">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="prose prose-lg md:prose-xl max-w-none prose-slate prose-headings:text-[#1a1a1a] prose-p:text-[#333333] prose-a:text-blue-600 prose-strong:text-[#111111] prose-blockquote:text-gray-500 prose-blockquote:border-gray-300 font-serif leading-loose">
          <BlogContent content={blog.content} />
        </div>

        <Comments blogId={blog._id.toString()} slug={blog.slug} initialComments={comments} />
      </article>
      <Footer />
    </main>
  );
};

export default BlogDetailPage;
