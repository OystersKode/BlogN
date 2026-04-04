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
import ReaderInteractionBar from '@/components/blog/ReaderInteractionBar';
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
    <main className="min-h-screen bg-[#F4F4F1] dark:bg-zinc-950 transition-all">
      <Navbar />
      <article className="max-w-4xl mx-auto py-16 px-4 sm:px-6 lg:px-8 border-x-[5px] border-black dark:border-white bg-white dark:bg-zinc-900 shadow-neo-xl my-10">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-8">
             <span className="px-4 py-2 bg-secondary text-black text-xs font-black uppercase tracking-widest border-[3px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
               {blog.category}
             </span>
             <span className="text-black dark:text-white font-black text-sm uppercase tracking-tighter bg-primary px-3 py-1 border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">{blog.readingTime}</span>
          </div>

          <h1 className="text-4xl sm:text-[56px] lg:text-[64px] font-black text-black dark:text-white leading-[0.9] tracking-tighter uppercase mb-10 transition-all">
            {blog.title}
          </h1>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 p-6 border-[4px] border-black dark:border-white bg-zinc-50 dark:bg-zinc-800 shadow-neo">
             <Link href={`/user/${blog.author?._id}`} className="flex items-center gap-4 group">
                <div className="relative">
                   <Image
                     src={blog.author?.image || '/default-avatar.png'}
                     alt={blog.author?.name || 'Author'}
                     width={56}
                     height={56}
                     className="grayscale border-[3px] border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] dark:shadow-[3px_3px_0px_0px_rgba(255,255,255,1)]"
                   />
                </div>
                <div>
                  <p className="font-black text-black dark:text-white uppercase tracking-tight text-lg group-hover:bg-primary transition-colors">{blog.author?.name || 'Deleted User'}</p>
                  <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest mt-1">{format(new Date(blog.createdAt), 'MMM dd, yyyy')}</p>
                </div>
             </Link>
            
            {session && (session.user as any).id !== blog.author?._id && (
               <div>
                  <FollowButton targetUserId={blog.author?._id} initialFollowing={blog.isFollowingAuthor} />
               </div>
            )}
          </div>
        </header>

        <div className="mb-12">
          <ReaderInteractionBar blog={blog} />
        </div>

        {blog.coverImage && (
          <div className="relative w-full aspect-[21/9] mb-16 border-[5px] border-black dark:border-white shadow-neo-lg bg-black overflow-hidden">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              sizes="(max-width: 1024px) 100vw, 1000px"
              className="object-cover grayscale hover:grayscale-0 transition-all duration-500"
              priority
            />
          </div>
        )}

        <div className="mb-16 prose-neo">
          <BlogContent content={blog.content} />
        </div>

        <div className="mt-20 border-t-[5px] border-black dark:border-white pt-16">
          <Comments blogId={blog._id.toString()} slug={blog.slug} initialComments={comments} />
        </div>
      </article>
      <Footer />
    </main>
  );
};

export default BlogDetailPage;
