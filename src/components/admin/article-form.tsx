
'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { upsertArticle } from '@/lib/article-actions';
import { type Article } from '@/lib/definitions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { SubmitButton } from './submit-button';
import Image from 'next/image';
import { Camera, X } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { Loader2 } from 'lucide-react';

function FormSubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending}>
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {pending ? 'Saving...' : 'Save Article'}
        </Button>
    )
}

export function ArticleForm({ article }: { article?: Article }) {
  const router = useRouter();
  const { toast } = useToast();
  const [errors, setErrors] = useState<any>({});
  const [message, setMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(article?.image_url || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [removeImage, setRemoveImage] = useState<boolean>(false);

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

  const handleSubmit = async (formData: FormData) => {
    if (selectedFile) {
        try {
            const base64String = await fileToBase64(selectedFile);
            formData.set('image_file', base64String);
            formData.set('image_file_type', selectedFile.type);
            formData.set('image_file_name', selectedFile.name);
        } catch (error) {
            console.error("Could not convert file to base64", error);
            setErrors({ _form: 'Could not process image file.' });
            return;
        }
    }
    if (removeImage) {
        formData.set('remove_image', 'true');
    }

    const result = await upsertArticle(formData);

    if (result.message === 'error') {
        setErrors(result.errors || {});
        toast({
            variant: 'destructive',
            title: 'An error occurred',
            description: result.errors?._form || 'Please check the form for errors.',
        });
    } else {
        toast({
            title: article ? 'Article Updated' : 'Article Created',
            description: 'Your article has been saved successfully.',
        });
        // The redirect is now handled by the server action
    }
  }


  return (
    <form action={handleSubmit} className="space-y-6">
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
          {errors?.title &&
            errors.title.map((error: string) => (
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
                  <input ref={fileInputRef} id="file-upload" name="image_file_input" type="file" className="sr-only" onChange={handleFileChange} accept="image/*" />
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
          {errors?.excerpt &&
            errors.excerpt.map((error: string) => (
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
          {errors?.content &&
            errors.content.map((error: string) => (
              <p className="mt-2 text-sm text-destructive" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>

      {errors?._form && (
         <div
           className="mt-2 text-sm text-destructive"
           aria-live="polite"
           aria-atomic="true"
         >
           <p>{errors._form}</p>
         </div>
       )}

      <FormSubmitButton />
    </form>
  );
}
