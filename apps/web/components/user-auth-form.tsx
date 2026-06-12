'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { toast } from 'sonner';
import { Button } from 'ui/components/ui/button';
import { Input } from 'ui/components/ui/input';
import { Label } from 'ui/components/ui/label';
import { Icons } from '@/components/shared/icons/icons-static';

export function UserAuthForm({
  authType,
  successRedirect,
  buttonsClassname,
  showGoogle = true,
  showGitHub = false,
}: {
  authType: 'sign-in' | 'sign-up';
  successRedirect?: string;
  buttonsClassname?: string;
  showGoogle?: boolean;
  showGitHub?: boolean;
}) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [provider, setProvider] = useState<'google' | 'github' | 'email'>('email');
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  function getRedirectUrl() {
    return successRedirect || `${location.origin}${location.pathname}`;
  }

  async function handleMailSignIn(event: React.SyntheticEvent) {
    setIsLoading(true);

    event.preventDefault();
    setProvider('email');

    if (!name && authType === 'sign-up') {
      toast.error('Please enter your name!');
      setIsLoading(false);
      return;
    } else if (!email) {
      toast.error('Please enter your email!');
      setIsLoading(false);
      return;
    }

    // Check if user exists
    const { data: user } = await supabase.from('profiles').select('*').eq('email', email).single();

    if (user && authType === 'sign-up') {
      toast.error('An account with this email address already exists.');
      setIsLoading(false);
      return;
    } else if (!user && authType === 'sign-in') {
      toast.error('No account found with this email address.');
      setIsLoading(false);
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: authType === 'sign-up',
        emailRedirectTo: `${location.origin}/auth/callback?successRedirect=${getRedirectUrl()}`,
        data: {
          full_name: name || user?.full_name,
        },
      },
    });

    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Magic link has been sent to your email!');
    }

    setIsLoading(false);
  }

  async function handleOAuthSignIn(oauthProvider: 'google' | 'github') {
    setIsLoading(true);
    setProvider(oauthProvider);

    const { error } = await supabase.auth.signInWithOAuth({
      provider: oauthProvider,
      options: {
        redirectTo: `${location.origin}/auth/callback?successRedirect=${getRedirectUrl()}`,
      },
    });

    if (error) {
      toast.error(error.message);
      setIsLoading(false);
    }
  }

  const showOAuth = showGoogle || showGitHub;

  return (
    <div className='grid gap-4'>
      {showOAuth ? (
        <>
          {showGoogle ? (
            <Button
              variant='outline'
              type='button'
              disabled={isLoading}
              onClick={() => handleOAuthSignIn('google')}
              className={buttonsClassname}>
              {isLoading && provider === 'google' ? (
                <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Icons.Google className='mr-2 h-4 w-4' />
              )}
              Continue with Google
            </Button>
          ) : null}
          {showGitHub ? (
            <Button
              variant='outline'
              type='button'
              disabled={isLoading}
              onClick={() => handleOAuthSignIn('github')}
              className={buttonsClassname}>
              {isLoading && provider === 'github' ? (
                <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' />
              ) : (
                <Icons.Github className='mr-2 h-4 w-4' />
              )}
              Continue with GitHub
            </Button>
          ) : null}
          <div className='relative'>
            <div className='absolute inset-0 flex items-center'>
              <span className='w-full border-t' />
            </div>
            <div className='relative flex justify-center text-xs uppercase'>
              <span className='bg-root text-muted-foreground px-2'>Or continue with email</span>
            </div>
          </div>
        </>
      ) : null}
      <form onSubmit={handleMailSignIn}>
        <div className='grid gap-3'>
          <div className='gap- grid gap-2'>
            {authType === 'sign-up' && (
              <>
                <Label className='sr-only' htmlFor='email'>
                  Full Name
                </Label>
                <Input
                  id='name'
                  placeholder='Full Name'
                  type='name'
                  autoCapitalize='none'
                  autoComplete='name'
                  autoCorrect='off'
                  disabled={isLoading}
                  onChange={(event) => {
                    setName(event.currentTarget.value);
                  }}
                  className={buttonsClassname}
                />
              </>
            )}

            <Label className='sr-only' htmlFor='email'>
              Email
            </Label>
            <Input
              id='email'
              placeholder='name@example.com'
              type='email'
              autoCapitalize='none'
              autoComplete='email'
              autoCorrect='off'
              disabled={isLoading}
              onChange={(event) => {
                setEmail(event.currentTarget.value);
              }}
              className={buttonsClassname}
            />
          </div>
          <Button disabled={isLoading}>
            {isLoading && provider === 'email' ? (
              <Icons.Spinner className='mr-2 h-4 w-4 animate-spin' />
            ) : null}
            Continue with Email
          </Button>
        </div>
      </form>
    </div>
  );
}
