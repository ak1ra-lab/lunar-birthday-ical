import {useState, KeyboardEvent} from 'react';
import {X} from 'lucide-react';
import {Input} from '@/components/ui/input';

interface TagInputProps {
  placeholder?: string;
  value: string[];
  onChange: (tags: string[]) => void;
  validate?: (tag: string) => boolean;
  errorMessage?: string;
}

export function TagInput({placeholder, value, onChange, validate, errorMessage}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !inputValue && value.length > 0) {
      // Optional: remove last tag on backspace if input is empty
      // onChange(value.slice(0, -1));
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
    onChange(value.filter(tag => tag !== tagToRemove));
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => (
          <span key={tag} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm">
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-3 w-3" />
            </button>
          </span>
        ))}
      </div>
      <div className="flex gap-2">
        <Input
          value={inputValue}
          onChange={(e) => {
              setInputValue(e.target.value); 
              if (error) setError(null);
          }}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={placeholder}
          className={error ? 'border-destructive' : ''}
        />
      </div>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
