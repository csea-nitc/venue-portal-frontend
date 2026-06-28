'use client';

import { cn } from '@/lib/utils';
import { Input as AriaInput, Label, TextField } from 'react-aria-components';

type InputProps = {
  label?: string;
  className?: string;
  placeholder?: string;
  type?: 'text' | 'email' | 'number' | 'date' | 'time' | 'datetime-local';
} & React.ComponentProps<typeof AriaInput>;

export function Input({ label, className, placeholder, type = 'text', ...props }: InputProps) {
  return (
    <TextField className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label className="text-xs font-bold uppercase tracking-wider text-[#8d6e63] data-[disabled]:text-gray-400">
          {label}
        </Label>
      )}
      <AriaInput
        type={type}
        placeholder={placeholder}
        className={({ isFocusVisible, isDisabled }) =>
          cn(
            'w-full px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150',
            'bg-white border border-gray-200 shadow-sm',
            'text-gray-900 placeholder:text-gray-400',
            'focus:outline-none',
            isFocusVisible && 'border-[#7a1f32] ring-2 ring-[#7a1f32]/25',
            isDisabled && 'bg-gray-50 text-gray-400 cursor-not-allowed border-gray-100',
            'hover:border-gray-300'
          )
        }
        {...props}
      />
    </TextField>
  );
}
