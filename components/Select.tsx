'use client';

import { cn } from '@/lib/utils';
import { Select as AriaSelect, Label, Button, SelectValue, Popover, ListBox, ListBoxItem } from 'react-aria-components';
import { ChevronDown } from 'lucide-react';

type SelectOption = {
  id: string;
  label: string;
};

type SelectProps = {
  label?: string;
  placeholder?: string;
  options: SelectOption[];
  selectedKey?: string;
  onSelectionChange?: (key: string) => void;
  className?: string;
};

export function Select({
  label,
  placeholder = 'Select an option',
  options,
  selectedKey,
  onSelectionChange,
  className,
}: SelectProps) {
  return (
    <AriaSelect
      selectedKey={selectedKey}
      onSelectionChange={(key) => onSelectionChange?.(key as string)}
      className={cn('flex flex-col gap-1.5 w-full', className)}
      placeholder={placeholder}
    >
      {label && (
        <Label className="text-xs font-bold uppercase tracking-wider text-[#8d6e63]">
          {label}
        </Label>
      )}
      <Button className={({ isFocusVisible, isHovered, isPressed }) => cn(
        'w-full px-3.5 py-2.5 rounded-xl flex items-center justify-between text-left text-sm',
        'bg-white border border-gray-200 text-gray-900 shadow-sm',
        'transition-all duration-150 focus:outline-none',
        isHovered && 'border-gray-300',
        isFocusVisible && 'border-[#7a1f32] ring-2 ring-[#7a1f32]/25',
        isPressed && 'scale-[0.99] border-gray-300'
      )}>
        <SelectValue className="placeholder:text-gray-400 font-medium" />
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </Button>

      <Popover className="z-50 w-[--trigger-width] bg-white border border-gray-200 rounded-xl shadow-lg mt-1 overflow-hidden transition-all">
        <ListBox className="outline-none p-1">
          {options.map((opt) => (
            <ListBoxItem
              key={opt.id}
              textValue={opt.label}
              className={({ isFocused, isSelected }) => cn(
                'px-3 py-2 rounded-lg cursor-pointer text-sm text-gray-900 outline-none transition-colors font-medium',
                isFocused && 'bg-[#f4d9c6]/50 text-[#7a1f32]',
                isSelected && 'bg-[#7a1f32] text-white'
              )}
            >
              {opt.label}
            </ListBoxItem>
          ))}
        </ListBox>
      </Popover>
    </AriaSelect>
  );
}
