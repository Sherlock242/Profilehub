
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { Check, Clipboard } from 'lucide-react';
import { useState } from 'react';

const correctSQLPolicy = `
-- 1. Allow public access to the 'avatars' bucket
UPDATE storage.buckets
SET public = true
WHERE id = 'avatars';

-- 2. Grant ALL authenticated users permissions to view files in the 'avatars' bucket.
-- This policy allows any logged-in user to view any avatar.
-- NOTE: This is suitable for a general social application.
-- If you need stricter privacy, you would change this policy.
DROP POLICY IF EXISTS "Authenticated users can view avatars" ON storage.objects;
CREATE POLICY "Authenticated users can view avatars"
ON storage.objects FOR SELECT
TO authenticated
USING ( bucket_id = 'avatars' );

-- 3. Grant owner permissions for their own avatar (upload, update, delete)
-- This ensures a user can only manage their own file.
DROP POLICY IF EXISTS "User can manage their own avatar" ON storage.objects;
CREATE POLICY "User can manage their own avatar"
ON storage.objects FOR INSERT, UPDATE, DELETE
TO authenticated
WITH CHECK (
  bucket_id = 'avatars'
  AND auth.uid() = (storage.foldername(name))[1]::uuid
);
`;

export default function AdminPage() {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(correctSQLPolicy.trim());
    setCopied(true);
    toast({
      title: 'Copied to Clipboard!',
      description: 'The SQL script is ready to be pasted into your Supabase SQL Editor.',
    });
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="container max-w-4xl py-8 animate-fade-in">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Fix Supabase Storage Permissions</CardTitle>
          <CardDescription>
            A security policy for your Supabase storage is preventing avatars from being displayed. Follow these steps to fix it permanently.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="font-semibold">Step 1: Copy the SQL Script</h3>
            <p className="text-sm text-muted-foreground">Click the button below to copy the correct policy script to your clipboard.</p>
            <Button onClick={handleCopy}>
              {copied ? <Check className="mr-2 h-4 w-4" /> : <Clipboard className="mr-2 h-4 w-4" />}
              Copy SQL Script
            </Button>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Step 2: Go to the Supabase SQL Editor</h3>
            <p className="text-sm text-muted-foreground">
              Open your Supabase project dashboard, navigate to the <span className="font-bold">SQL Editor</span> section (usually found in the left sidebar), and click <span className="font-bold">+ New query</span>.
            </p>
             <Button variant="outline" asChild>
                <a href={'https://supabase.com/dashboard/project/inzczaaadfmfusgekwio/sql/new'} target="_blank" rel="noopener noreferrer">
                    Open Supabase SQL Editor
                </a>
            </Button>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">Step 3: Paste and Run the Query</h3>
            <p className="text-sm text-muted-foreground">
              Paste the script you copied into the query window and click the <span className="font-bold">RUN</span> button. This will apply the new security policies.
            </p>
          </div>
           <div className="space-y-2">
            <h3 className="font-semibold">Step 4: Try Uploading Again</h3>
            <p className="text-sm text-muted-foreground">
             Once the script is executed, return to your application and try uploading a profile picture again. It should now work correctly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
