import { X } from 'lucide-react';
import { KeyboardEvent, useState } from 'react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface TagInputProps {
  placeholder?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  validate?: (tag: string) => boolean;
  errorMessage?: string;
}

export function TagInput({ placeholder, value, onChange, validate, errorMessage }: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Remove last tag on backspace if input is empty
      onChange(value.slice(0, -1));
    }
  };

  const addTag = () => {
    const tag = inputValue.trim();
    if (!tag) return;

    if (value.includes(tag)) {
      setInputValue('');
      return;
    }

    if (validate && !validate(tag)) {
      setError(errorMessage || 'Invalid input');
      return;
    }

    onChange([...value, tag]);
    setInputValue('');
    setError(null);
  };

  const removeTag = (tagToRemove: string) => {
    onChange(value.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className='space-y-2'>
      <div
        className={cn(
          'flex min-h-[2.5rem] w-full flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-white px-3 py-1 text-sm ring-offset-white focus-within:ring-2 focus-within:ring-slate-950 focus-within:ring-offset-2',
          error ? 'border-destructive' : '',
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className='flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-xs'
          >
            {tag}
            <button
              type='button'
              onClick={() => removeTag(tag)}
              className='text-muted-foreground hover:text-foreground'
            >
              <X className='h-3 w-3' />
            </button>
          </span>
        ))}
        <Input
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : ''}
          className='flex-1 border-0 bg-transparent px-1 py-0 text-sm placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 h-8 shadow-none min-w-[120px]'
          autoComplete='off'
        />
      </div>
      {error && <p className='text-xs font-medium text-destructive'>{error}</p>}
    </div>
  );
}
