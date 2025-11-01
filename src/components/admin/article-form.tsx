
'use client';

import { useFormState } from 'react-dom';
import { upsertArticle, type ArticleFormState } from '@/lib/article-actions';
import { type Article } from '@/lib/definitions';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SubmitButton } from './submit-button';

export function ArticleForm({ article }: { article?: Article }) {
  const initialState: ArticleFormState = { errors: {} };
  const upsertArticleWithId = upsertArticle.bind(null);
  const [state, dispatch] = useFormState(upsertArticleWithId, initialState);

  return (
    <form action={dispatch} className="space-y-6">
      <input type="hidden" name="id" value={article?.id} />
      
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
        <label htmlFor="image_url" className="block text-sm font-medium mb-1">Image URL</label>
        <Input
          id="image_url"
          name="image_url"
          defaultValue={article?.image_url ?? ''}
          aria-describedby="image-error"
        />
        <div id="image-error" aria-live="polite" aria-atomic="true">
          {state.errors?.image_url &&
            state.errors.image_url.map((error: string) => (
              <p className="mt-2 text-sm text-destructive" key={error}>
                {error}
              </p>
            ))}
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
