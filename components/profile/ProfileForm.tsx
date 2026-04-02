'use client';

import { useState } from 'react';
import { updateUserProfile } from '@/app/actions/profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2, Save } from 'lucide-react';

const ProfileForm = ({ user }: { user: any }) => {
  const [bio, setBio] = useState(user.bio || '');
  const [twitter, setTwitter] = useState(user.socials?.twitter || '');
  const [github, setGithub] = useState(user.socials?.github || '');
  const [website, setWebsite] = useState(user.socials?.website || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      await updateUserProfile({ bio, twitter, github, website });
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error(error);
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-1">Bio</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            className="w-full h-32 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none shadow-sm"
            placeholder="Tell us a bit about yourself..."
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Twitter URL</label>
              <Input 
                 value={twitter} 
                 onChange={(e) => setTwitter(e.target.value)} 
                 placeholder="https://twitter.com/..." 
                 className="rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">GitHub URL</label>
              <Input 
                 value={github} 
                 onChange={(e) => setGithub(e.target.value)} 
                 placeholder="https://github.com/..." 
                 className="rounded-xl"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1">Personal Website</label>
              <Input 
                 value={website} 
                 onChange={(e) => setWebsite(e.target.value)} 
                 placeholder="https://yourwebsite.com" 
                 className="rounded-xl"
              />
            </div>
        </div>
      </div>

      <div className="flex items-center justify-between pt-4 border-t border-gray-50">
         <span className={`text-sm font-medium ${message.includes('Failed') ? 'text-red-500' : 'text-green-600'}`}>
            {message}
         </span>
         <Button 
            type="submit" 
            disabled={loading}
            className="bg-gray-900 text-white hover:bg-blue-600 rounded-full px-8 shadow-md transition-all font-bold"
         >
           {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
           Save Profile
         </Button>
      </div>
    </form>
  );
};

export default ProfileForm;
