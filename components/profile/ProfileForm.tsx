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
      setIsEditing(false); // Seamlessly return to read-only view
    } catch (error) {
      console.error(error);
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  if (!isEditing) {
    return (
      <div className="space-y-6">
          <div className="space-y-4 transition-colors">
             <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors">Bio</label>
                <p className="text-gray-800 dark:text-gray-200 text-[15px] max-w-full leading-relaxed whitespace-pre-wrap transition-colors">{bio || 'No bio provided.'}</p>
             </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 transition-colors">
                 <div className="md:col-span-2">
                   <label className="block text-[13px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 transition-colors">PRN (Roll Number)</label>
                   <p className="text-gray-900 dark:text-white font-mono font-medium text-[15px] transition-colors">{prn || 'Not provided'}</p>
                 </div>
                 <div>
                    <label className="block text-[13px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 transition-colors">LinkedIn</label>
                    {linkedin ? (
                      <a 
                        href={linkedin.startsWith('http') ? linkedin : `https://linkedin.com/in/${linkedin}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 dark:text-blue-400 font-medium text-[15px] hover:underline cursor-pointer truncate block transition-colors"
                      >
                         {linkedin.split('/').filter(Boolean).pop()}
                      </a>
                    ) : (
                      <p className="text-gray-400 dark:text-gray-500 text-[15px] transition-colors italic">Not provided</p>
                    )}
                 </div>
                 <div>
                    <label className="block text-[13px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 transition-colors">GitHub</label>
                    {github ? (
                      <a 
                        href={github.startsWith('http') ? github : `https://github.com/${github}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-gray-900 dark:text-white font-medium text-[15px] hover:underline cursor-pointer truncate block transition-colors"
                      >
                         {github.split('/').filter(Boolean).pop()}
                      </a>
                    ) : (
                      <p className="text-gray-400 dark:text-gray-500 text-[15px] transition-colors italic">Not provided</p>
                    )}
                 </div>
                 <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 transition-colors">Personal Website</label>
                    {website ? (
                      <a 
                        href={website.startsWith('http') ? website : `https://${website}`} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-green-600 dark:text-green-400 font-medium text-[15px] hover:underline cursor-pointer truncate block transition-colors"
                      >
                         {website.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '')}
                      </a>
                    ) : (
                      <p className="text-gray-400 dark:text-gray-500 text-[15px] transition-colors italic">Not provided</p>
                    )}
                 </div>
            </div>
         </div>
                  <div className="pt-6 mt-6 border-t border-gray-50 dark:border-white/10 flex justify-end transition-colors">
             <Button onClick={() => setIsEditing(true)} className="bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full px-6 transition-colors shadow-sm font-bold">
                <Edit3 className="mr-2 h-4 w-4" /> Edit Profile
             </Button>
          </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-in fade-in duration-300">
       <div className="space-y-4">
         <div>
           <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors">Bio</label>
           <textarea
             value={bio}
             onChange={(e) => setBio(e.target.value)}
             className="w-full h-32 rounded-xl border border-gray-200 dark:border-white/20 bg-white dark:bg-slate-800 text-gray-900 dark:text-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none shadow-sm transition-colors placeholder-gray-400 dark:placeholder-gray-600"
             placeholder="Tell us a bit about yourself..."
           />
         </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="md:col-span-2">
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors">PRN (Roll Number)</label>
               <Input 
                  value={prn} 
                  onChange={(e) => setPrn(e.target.value)} 
                  placeholder="Enter your PRN" 
                  className="rounded-xl font-mono bg-white dark:bg-slate-800 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white transition-colors"
               />
             </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors">LinkedIn URL</label>
                <Input 
                   value={linkedin} 
                   onChange={(e) => setLinkedin(e.target.value)} 
                   placeholder="https://linkedin.com/in/..." 
                   className="rounded-xl bg-white dark:bg-slate-800 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white transition-colors"
                />
              </div>
             <div>
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors">GitHub URL</label>
               <Input 
                  value={github} 
                  onChange={(e) => setGithub(e.target.value)} 
                  placeholder="https://github.com/..." 
                  className="rounded-xl bg-white dark:bg-slate-800 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white transition-colors"
               />
             </div>
             <div className="md:col-span-2">
               <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-1 transition-colors">Personal Website</label>
               <Input 
                  value={website} 
                  onChange={(e) => setWebsite(e.target.value)} 
                  placeholder="https://yourwebsite.com" 
                  className="rounded-xl bg-white dark:bg-slate-800 border-gray-200 dark:border-white/10 text-gray-900 dark:text-white transition-colors"
               />
             </div>
        </div>
      </div>

       <div className="flex items-center justify-between pt-4 border-t border-gray-50 dark:border-white/10 transition-colors">
          <span className={`text-sm font-medium transition-colors ${message.includes('Failed') ? 'text-red-500' : 'text-green-600'}`}>
             {message}
          </span>
         <div className="flex gap-2">
            <Button 
               type="button" 
               variant="ghost"
               onClick={() => setIsEditing(false)}
               className="rounded-full px-6 transition-all font-bold hover:bg-gray-100"
            >
              Cancel
            </Button>
             <Button 
                type="submit" 
                disabled={loading}
                className="bg-blue-600 dark:bg-blue-700 text-white hover:bg-blue-700 dark:hover:bg-blue-600 rounded-full px-8 shadow-sm transition-all font-bold"
             >
              {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
         </div>
      </div>
    </form>
  );
};

export default ProfileForm;
