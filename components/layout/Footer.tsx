import Link from 'next/link';
import { Zap } from 'lucide-react';

const Footer = () => {
   return (
      <footer className="bg-black text-white py-16 text-sm font-bold w-full border-t-[5px] border-black dark:border-white transition-all uppercase tracking-wider">
         <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            
            <div className="flex flex-col gap-4">
               <Link href="/" className="flex items-center text-3xl font-serif mb-2">
                  <span className="font-black text-white">B</span>
                  <span className="font-extrabold italic text-white">(logN)</span>
               </Link>
               <div className="flex flex-col gap-2">
                  <span className="text-zinc-500 text-xs lowercase">CSE Department</span>
                  <span className="text-zinc-500 text-xs lowercase">Subject: Design and Analysis of Algorithm</span>
               </div>
               <span className="mt-6 text-zinc-300 flex flex-wrap items-center gap-2">
                  BUILD BY <Zap size={14} className="text-primary fill-primary ml-1 mr-2" />
                  <a href="https://www.linkedin.com/in/vishwajit-sutar-03324b2b0/" target="_blank" rel="noopener noreferrer" className="bg-primary text-black px-3 py-1 border-[2px] border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                     VISHWAJIT SUTAR
                  </a>
                  {' & '}
                  <a href="https://www.linkedin.com/in/nealmr/" target="_blank" rel="noopener noreferrer" className="bg-secondary text-black px-3 py-1 border-[2px] border-white shadow-[3px_3px_0px_0px_rgba(255,255,255,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                     NEAL
                  </a>
               </span>
            </div>

            <div className="flex flex-col md:items-end gap-4">
               <span className="text-primary font-black text-lg uppercase tracking-tight mb-2">Oyster Kode Club</span>
               <div className="flex flex-wrap md:justify-end gap-6">
                  <a href="mailto:oysterkode@ritindia.edu" className="bg-white text-black p-3 border-[3px] border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all" aria-label="Mail" title="Mail">
                     <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z"/></svg>
                  </a>
                  <a href="#" className="bg-white text-black p-3 border-[3px] border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all" aria-label="Instagram" title="Instagram">
                     <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
                  </a>
                  <a href="https://www.linkedin.com/in/oyster-kode-club/" target="_blank" rel="noopener noreferrer" className="bg-white text-black p-3 border-[3px] border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,0.3)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all" aria-label="LinkedIn" title="LinkedIn">
                     <svg viewBox="0 0 24 24" fill="currentColor" width="24" height="24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                  </a>
               </div>
               <span className="mt-8 text-[11px] text-zinc-600">© {new Date().getFullYear()} BLOGN — NO RIGHTS RESERVED.</span>
            </div>

         </div>
      </footer>
   );
};

export default Footer;
