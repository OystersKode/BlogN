import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';

const BlogCard = ({ blog }: { blog: any }) => {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <Card className="overflow-hidden group hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all border-[4px] border-black dark:border-white bg-white dark:bg-zinc-900 rounded-none h-full flex flex-col shadow-neo">
        <div className="relative aspect-video overflow-hidden border-b-[4px] border-black dark:border-white">
          {blog.coverImage && (
            <Image
              src={blog.coverImage}
              alt={blog.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
            />
          )}
          <div className="absolute top-4 left-4">
             <span className="px-3 py-1 bg-secondary text-black text-[10px] font-black uppercase tracking-widest border-[2px] border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
               {blog.category}
             </span>
          </div>
        </div>
        <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-black uppercase tracking-tighter">
                <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 border-[2px] border-black dark:border-white">{format(new Date(blog.createdAt), 'MMM dd, yyyy')}</span>
                <span className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 border-[2px] border-black dark:border-white">{blog.readingTime}</span>
             </div>
             <h2 className="text-2xl font-black text-black dark:text-white leading-[0.9] uppercase group-hover:bg-primary transition-colors">
               {blog.title}
             </h2>
          </div>
          
          <div className="flex items-center gap-3 pt-4 border-t-[3px] border-black dark:border-white mt-auto">
             <Image
               src={blog.author?.image || '/default-avatar.png'}
               alt={blog.author?.name || 'Author'}
               width={32}
               height={32}
               className="border-[2px] border-black dark:border-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] grayscale contrast-125"
             />
             <span className="text-xs font-black uppercase text-black dark:text-white tracking-tight">{blog.author?.name || 'Unknown Author'}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BlogCard;
