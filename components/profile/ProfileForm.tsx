'use client';

import { useState } from 'react';
import { updateUserProfile } from '@/app/actions/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save, Edit3, X } from 'lucide-react';

const ProfileForm = ({ user }: { user: any }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(user.bio || '');
  const [prn, setPrn] = useState(user.prn || '');
  const [linkedin, setLinkedin] = useState(user.socials?.linkedin || '');
  const [github, setGithub] = useState(user.socials?.github || '');
  const [website, setWebsite] = useState(user.socials?.website || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      await updateUserProfile({ bio, prn, linkedin, github, website });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-8">
          <div className="space-y-6">
             <div>
                <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 transition-colors">Biography</label>
                <div className="bg-white dark:bg-zinc-800 p-4 border-[3px] border-black dark:border-white shadow-neo">
                   <p className="text-black dark:text-white text-[15px] font-bold leading-tight whitespace-pre-wrap transition-colors">
                      {bio || 'Technical background not provided yet.'}
                   </p>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 transition-colors">
                  <div className="md:col-span-2">
                    <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-wider mb-2 transition-colors">PRN (Student ID)</label>
                    <p className="inline-block bg-primary text-black px-3 py-1 border-[2px] border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-mono font-black text-[14px]">
                       {prn || 'NONE'}
                    </p>
                  </div>
                  <div>
                     <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-wider mb-2 transition-colors">LinkedIn Profile</label>
                     {linkedin ? (
                       <a 
                         href={linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin}`} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="inline-block bg-white dark:bg-zinc-800 text-black dark:text-white px-3 py-1 border-[2px] border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-black text-[12px] uppercase hover:bg-secondary transition-all truncate max-w-full"
                       >
                          {linkedin.split('/').filter(Boolean).pop()}
                       </a>
                     ) : (
                       <p className="text-zinc-400 font-bold uppercase text-xs italic">Not linked</p>
                     )}
                  </div>
                  <div>
                     <label className="block text-[11px] font-black text-zinc-500 uppercase tracking-wider mb-2 transition-colors">GitHub Repository</label>
                     {github ? (
                       <a 
                         href={github.startsWith('http') ? github : `https://github.com/${github}`} 
                         target="_blank" 
                         rel="noopener noreferrer" 
                         className="inline-block bg-black text-white px-3 py-1 border-[2px] border-black dark:border-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] font-black text-[12px] uppercase hover:bg-primary hover:text-black transition-all truncate max-w-full"
                       >
                          {github.split('/').filter(Boolean).pop()}
                       </a>
                     ) : (
                       <p className="text-zinc-400 font-bold uppercase text-xs italic">Not linked</p>
                     )}
                  </div>
             </div>
          </div>
          
          <div className="pt-8 border-t-[4px] border-black dark:border-white flex justify-end">
             <Button 
                onClick={() => setIsEditing(true)} 
                className="bg-black text-white font-black uppercase tracking-widest px-8 py-6 border-[3px] border-black shadow-neo active:shadow-none active:translate-x-1 active:translate-y-1 transition-all h-auto text-xs"
             >
                <Edit3 className="mr-2 h-4 w-4" strokeWidth={3} /> Modify Identity
             </Button>
          </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-10">
       <div className="space-y-8">
         <div>
           <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 transition-colors">Technical Bio</label>
           <textarea
             value={bio}
             onChange={(e) => setBio(e.target.value)}
             className="w-full h-32 rounded-none border-[3px] border-black dark:border-white bg-white dark:bg-zinc-800 text-black dark:text-white px-4 py-3 text-sm font-bold focus:shadow-neo transition-all resize-none placeholder-zinc-400"
             placeholder="Field of interest, tech stack, or simple greetings..."
           />
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="md:col-span-2">
                <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 transition-colors">PRN (Student ID)</label>
                <Input 
                   value={prn} 
                   onChange={(e) => setPrn(e.target.value)} 
                   placeholder="Enter your PRN" 
                   className="rounded-none font-mono font-bold bg-white dark:bg-zinc-800 border-[3px] border-black dark:border-white focus:shadow-neo transition-all h-12"
                />
              </div>
               <div>
                 <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 transition-colors">LinkedIn Handle</label>
                 <Input 
                    value={linkedin} 
                    onChange={(e) => setLinkedin(e.target.value)} 
                    placeholder="Username or URL" 
                    className="rounded-none font-bold bg-white dark:bg-zinc-800 border-[3px] border-black dark:border-white focus:shadow-neo transition-all h-12"
                 />
               </div>
              <div>
                <label className="block text-xs font-black text-zinc-500 uppercase tracking-widest mb-2 transition-colors">GitHub Handle</label>
                <Input 
                   value={github} 
                   onChange={(e) => setGithub(e.target.value)} 
                   placeholder="Username or URL" 
                   className="rounded-none font-bold bg-white dark:bg-zinc-800 border-[3px] border-black dark:border-white focus:shadow-neo transition-all h-12"
                />
              </div>
         </div>
       </div>

       <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t-[4px] border-black dark:border-white">
          <span className={`text-xs font-black uppercase tracking-widest ${message.includes('Failed') ? 'text-red-500' : 'text-primary dark:text-primary'}`}>
             {message}
          </span>
          <div className="flex gap-4 w-full sm:w-auto">
             <Button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="flex-1 sm:flex-none bg-white text-black border-[3px] border-black shadow-neo active:shadow-none active:translate-x-1 active:translate-y-1 transition-all font-black uppercase text-xs px-8 py-5 h-auto"
             >
               Discard
             </Button>
              <Button 
                 type="submit" 
                 disabled={loading}
                 className="flex-1 sm:flex-none bg-black text-white border-[3px] border-black shadow-neo active:shadow-none active:translate-x-1 active:translate-y-1 transition-all font-black uppercase text-xs px-10 py-5 h-auto"
              >
               {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" strokeWidth={3} />}
               Commit Changes
             </Button>
          </div>
       </div>
    </form>
  );
};

export default ProfileForm;
