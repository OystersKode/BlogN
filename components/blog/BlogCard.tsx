import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';

const BlogCard = ({ blog }: { blog: any }) => {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border-none bg-white dark:bg-slate-900 rounded-3xl h-full flex flex-col">
        <div className="relative aspect-video overflow-hidden">
          {blog.coverImage && (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          )}
          <div className="absolute top-4 left-4">
             <span className="px-3 py-1 bg-white/90 dark:bg-slate-950/80 backdrop-blur-sm text-blue-600 dark:text-blue-400 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm transition-colors">
               {blog.category}
             </span>
          </div>
        </div>
        <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 font-medium tracking-tight transition-colors">
               <span>{format(new Date(blog.createdAt), 'MMM dd')}</span>
               <span>•</span>
               <span>{blog.readingTime}</span>
             </div>
             <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
               {blog.title}
             </h2>
          </div>
          
          <div className="flex items-center gap-3 pt-4 border-t border-gray-50 dark:border-white/10 mt-auto transition-colors">
             <Image
               src={blog.author?.image || '/default-avatar.png'}
               alt={blog.author?.name || 'Author'}
               width={32}
               height={32}
               className="rounded-full ring-2 ring-blue-50 dark:ring-slate-800"
             />
             <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 transition-colors">{blog.author?.name || 'Unknown Author'}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BlogCard;
