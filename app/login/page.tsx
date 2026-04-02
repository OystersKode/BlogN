'use client';

import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

const LoginPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <Card className="max-w-md w-full p-8 border-none shadow-2xl bg-white/80 backdrop-blur-md">
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              BlogDAA
            </h1>
            <p className="text-gray-500 font-medium tracking-tight">Sign in to start sharing your stories</p>
          </div>
          
          <Button 
            onClick={() => signIn('google')} 
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 h-12 text-base font-bold shadow-sm transition"
          >
            <Image src="/google.svg" alt="Google" width={20} height={20} />
            Continue with Google
          </Button>

          <p className="text-xs text-gray-400">
             By signing in, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
import Image from 'next/image';
