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
import { getBlogs } from '@/app/actions/blog';

export const revalidate = 3600; // 1 hour

export async function generateStaticParams() {
   const blogs = await getBlogs();
   return blogs.map((blog: any) => ({
      slug: blog.slug,
   }));
}
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
    <main className="min-h-screen bg-white dark:bg-background transition-colors">
      <Navbar />
      <article className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-6">
             <span className="px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-xs font-bold uppercase tracking-wider rounded-full transition-colors">
               {blog.category}
             </span>
             <span className="text-gray-400 dark:text-gray-500 text-sm transition-colors">•</span>
             <span className="text-gray-500 dark:text-gray-400 text-sm font-medium transition-colors">{blog.readingTime}</span>
          </div>

          <h1 className="text-4xl sm:text-[42px] lg:text-[46px] font-bold text-gray-900 dark:text-foreground leading-[1.1] tracking-tight mb-8 transition-colors">
            {blog.title}
          </h1>

             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                <div className="space-y-4">
                  <Link href={`/user/${blog.author?._id}`} className="flex items-center gap-3 group">
                     <Image
                       src={blog.author?.image || '/default-avatar.png'}
                       alt={blog.author?.name || 'Author'}
                       width={48}
                       height={48}
                       className="rounded-full ring-2 ring-gray-50 dark:ring-white/10 object-cover"
                     />
                     <div>
                       <p className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors text-[15px]">{blog.author?.name || 'Deleted User'}</p>
                       <p className="text-[13px] text-gray-500 dark:text-gray-400 transition-colors">{format(new Date(blog.createdAt), 'MMM dd, yyyy')}</p>
                     </div>
                  </Link>

                  {blog.coAuthors && blog.coAuthors.length > 0 && (
                    <div className="flex flex-wrap items-center gap-2 pl-12">
                      <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-gray-500">With:</span>
                      {blog.coAuthors.map((ca: any) => (
                        <Link key={ca._id} href={`/user/${ca._id}`} className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-white/5 px-2 py-1 rounded-full hover:border-blue-200 dark:hover:border-blue-900 transition-colors group/ca">
                           <div className="relative w-4 h-4 rounded-full overflow-hidden">
                             <Image src={ca.image || '/default-avatar.png'} alt={ca.name} fill className="object-cover" />
                           </div>
                           <span className="text-xs font-bold text-slate-600 dark:text-gray-400 group-hover/ca:text-blue-600 dark:group-hover/ca:text-blue-400 transition-colors">{ca.name}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
            
                {session && (session.user as any).id !== blog.author?._id && (
                   <div>
                      <FollowButton targetUserId={blog.author?._id} initialFollowing={blog.isFollowingAuthor} />
                   </div>
                )}
             </div>
        </header>

        <ReaderInteractionBar blog={blog} />

        {blog.coverImage && (
          <div className="relative w-full aspect-[21/9] mb-12 rounded-xl overflow-hidden shadow-sm border border-gray-100 dark:border-white/10 bg-gray-50 dark:bg-slate-900 transition-colors">
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              sizes="(max-width: 1024px) 100vw, 800px"
              className="object-cover"
              priority
            />
          </div>
        )}

        <div className="mb-12">
          <BlogContent content={blog.content} />
        </div>

        <Comments blogId={blog._id.toString()} slug={blog.slug} initialComments={comments} />
      </article>
      <Footer />
    </main>
  );
};

export default BlogDetailPage;
