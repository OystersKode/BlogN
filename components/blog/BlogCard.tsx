import Image from 'next/image';
import Link from 'next/link';
import { format } from 'date-fns';
import { Card } from '@/components/ui/card';

const BlogCard = ({ blog }: { blog: any }) => {
  return (
    <Link href={`/blog/${blog.slug}`}>
      <Card className="overflow-hidden group hover:shadow-2xl transition-all duration-300 border-none bg-white rounded-3xl h-full flex flex-col">
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
             <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full shadow-sm">
               {blog.category}
             </span>
          </div>
        </div>
        <div className="p-6 space-y-4 flex-grow flex flex-col justify-between">
          <div className="space-y-3">
             <div className="flex items-center gap-2 text-xs text-gray-400 font-medium tracking-tight">
               <span>{format(new Date(blog.createdAt), 'MMM dd')}</span>
               <span>•</span>
               <span>{blog.readingTime}</span>
             </div>
             <h2 className="text-xl font-bold text-gray-900 leading-snug group-hover:text-blue-600 transition-colors">
               {blog.title}
             </h2>
          </div>
          
          <div className="flex items-center gap-3 pt-4 border-t border-gray-50 mt-auto">
             <Image
               src={blog.author.image || '/default-avatar.png'}
               alt={blog.author.name}
               width={32}
               height={32}
               className="rounded-full ring-2 ring-blue-50"
             />
             <span className="text-xs font-semibold text-gray-700">{blog.author.name}</span>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default BlogCard;
