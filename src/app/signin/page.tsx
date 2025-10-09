
'use client';

import SignInForm from '@/components/auth/SignInForm';
import Logo from '@/components/ui/Logo';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { signIn } from 'next-auth/react';

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-800">
      <div className="mb-8">
        <Logo view="txt" size="lg" />
      </div>
      <div className="w-full max-w-md p-8 space-y-8 bg-zinc-900 rounded-lg">
        <h1 className="text-2xl font-bold text-center text-white">Sign In</h1>
        <SignInForm />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-zinc-700" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-zinc-900 px-2 text-zinc-500">Or continue with</span>
          </div>
        </div>
        <Button onClick={() => signIn('google', { callbackUrl: '/' })} variant="secondary" className="w-full">
          Sign in with Google
        </Button>
        <p className="text-center text-white">
          Don&apos;t have an account?{' '} 
          <Link href="/signup" className="text-blue-500 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
