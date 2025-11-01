
'use client';

import { useActionState, useState, useRef, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { upsertArticle, type ArticleFormState } from '@/lib/article-actions';
import { type Article } from '@/lib/definitions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SubmitButton } from './submit-button';
import Image from 'next/image';
import { Camera, Trash2, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export function ArticleForm({ article }: { article?: Article }) {
  const router = useRouter();
  const { toast } = useToast();
  const initialState: ArticleFormState = { errors: {}, message: null };
  const [state, dispatch] = useActionState(upsertArticle, initialState);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(article?.image_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState<boolean>(false);

  useEffect(() => {
    if (state.message === 'success') {
      toast({
        title: article ? 'Article Updated' : 'Article Created',
        description: 'Your article has been saved successfully.',
      });
      router.push('/admin');
    } else if (state.errors?._form) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description: state.errors._form,
      });
    }
  }, [state, router, toast, article]);


  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setRemoveImage(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setRemoveImage(true);
    if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Clear the file input
    }
  }

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };
  
  const formAction = async (formData: FormData) => {
    if (selectedFile) {
        try {
            const base64String = await fileToBase64(selectedFile);
            formData.set('image_file', base64String);
            formData.set('image_file_type', selectedFile.type);
            formData.set('image_file_name', selectedFile.name);
        } catch (error) {
            console.error("Could not convert file to base64", error);
            // Handle error state if needed
            return;
        }
    }
    if (removeImage) {
        formData.set('remove_image', 'true');
    }

    dispatch(formData);
  }

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="id" value={article?.id} />
      <input type="hidden" name="current_image_url" value={article?.image_url || ''} />
      
      <div>
        <label htmlFor="title" className="block text-sm font-medium mb-1">Title</label>
        <Input
          id="title"
          name="title"
          defaultValue={article?.title}
          aria-describedby="title-error"
          required
        />
        <div id="title-error" aria-live="polite" aria-atomic="true">
          {state.errors?.title &&
            state.errors.title.map((error: string) => (
              <p className="mt-2 text-sm text-destructive" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

       <div>
        <label className="block text-sm font-medium mb-1">Cover Image</label>
        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-input px-6 py-10">
          {previewUrl ? (
            <div className="relative group w-full max-w-md">
                <Image src={previewUrl} alt="Image preview" width={400} height={300} className="rounded-lg mx-auto" />
                <div 
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 cursor-pointer bg-background/50 rounded-full p-1 group-hover:bg-destructive text-destructive-foreground transition-colors"
                >
                    <X className="h-4 w-4" />
                </div>
            </div>
          ) : (
            <div className="text-center">
              <Camera className="mx-auto h-12 w-12 text-muted-foreground" />
              <div className="mt-4 flex text-sm leading-6 text-muted-foreground">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer rounded-md font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 hover:text-primary/80"
                >
                  <span>Upload a file</span>
                  <input ref={fileInputRef} id="file-upload" name="image_file" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">PNG, JPG, GIF up to 5MB</p>
            </div>
          )}
        </div>
      </div>
      
      <div>
        <label htmlFor="excerpt" className="block text-sm font-medium mb-1">Excerpt</label>
        <Textarea
          id="excerpt"
          name="excerpt"
          defaultValue={article?.excerpt ?? ''}
          rows={3}
          aria-describedby="excerpt-error"
        />
        <div id="excerpt-error" aria-live="polite" aria-atomic="true">
          {state.errors?.excerpt &&
            state.errors.excerpt.map((error: string) => (
              <p className="mt-2 text-sm text-destructive" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      <div>
        <label htmlFor="content" className="block text-sm font-medium mb-1">Content (Markdown supported)</label>
        <Textarea
          id="content"
          name="content"
          defaultValue={article?.content ?? ''}
          rows={10}
          aria-describedby="content-error"
        />
        <div id="content-error" aria-live="polite" aria-atomic="true">
          {state.errors?.content &&
            state.errors.content.map((error: string) => (
              <p className="mt-2 text-sm text-destructive" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      {state.errors?._form && (
         <div
           className="mt-2 text-sm text-destructive"
           aria-live="polite"
           aria-atomic="true"
         >
           <p>{state.errors._form}</p>
         </div>
       )}

      <SubmitButton />
    </form>
  );
}
