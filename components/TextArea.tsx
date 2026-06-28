'use client';

import { cn } from '@/lib/utils';
import { Label, TextArea as AriaTextArea, TextField } from 'react-aria-components';

type TextAreaProps = {
  label?: string;
  className?: string;
  placeholder?: string;
} & React.ComponentProps<typeof AriaTextArea>;

export function TextArea({ label, className, placeholder, ...props }: TextAreaProps) {
  return (
    <TextField className={cn('flex flex-col gap-1.5', className)}>
      {label && (
        <Label className="text-xs font-bold uppercase tracking-wider text-[#8d6e63] data-[disabled]:text-gray-400">
          {label}
        </Label>
      )}
      <AriaTextArea
        placeholder={placeholder}
        className="w-full px-3.5 py-2.5 rounded-xl text-sm transition-all duration-150 bg-white border border-gray-200 shadow-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#7a1f32] focus:ring-2 focus:ring-[#7a1f32]/25 hover:border-gray-300 min-h-[100px] resize-y"
        {...props}
      />
    </TextField>
  );
}
