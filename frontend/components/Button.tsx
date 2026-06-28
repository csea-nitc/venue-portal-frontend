'use client';

import { cn } from '@/lib/utils';
import { Button as AriaButton } from 'react-aria-components';

type ButtonProps = React.ComponentProps<typeof AriaButton> & {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'success';
  size?: 'sm' | 'md' | 'lg';
};

export function Button({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}: ButtonProps) {
  return (
    <AriaButton
      className={({ isPressed, isHovered, isFocusVisible, isDisabled }) =>
        cn(
          'rounded-full font-semibold transition-all',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          
          // Size variants
          size === 'sm' && 'px-3.5 py-1.5 text-xs',
          size === 'md' && 'px-5 py-2 text-sm',
          size === 'lg' && 'px-6 py-3 text-base',
          
          // Primary variant
          variant === 'primary' && [
            'bg-[#7a1f32] text-white',
            isHovered && 'bg-[#5a1725]',
            isPressed && 'bg-[#3a0f15] scale-95',
            isFocusVisible && 'ring-2 ring-[#7a1f32] ring-offset-2',
          ],
          
          // Secondary variant
          variant === 'secondary' && [
            'bg-[#4b90a1] text-white',
            isHovered && 'bg-[#3a7c8c]',
            isPressed && 'bg-[#2b5e6b] scale-95',
            isFocusVisible && 'ring-2 ring-[#4b90a1] ring-offset-2',
          ],
          
          // Outline variant
          variant === 'outline' && [
            'border-2 border-[#7a1f32] text-[#7a1f32]',
            isHovered && 'bg-[#7a1f32] text-white',
            isPressed && 'bg-[#5a1725] text-white scale-95',
            isFocusVisible && 'ring-2 ring-[#7a1f32] ring-offset-2',
          ],
          
          // Danger variant
          variant === 'danger' && [
            'bg-[#e8999c] text-[#5a1725]',
            isHovered && 'bg-[#d88080]',
            isPressed && 'bg-[#c86767] scale-95',
            isFocusVisible && 'ring-2 ring-[#e8999c] ring-offset-2',
          ],
          
          // Success variant
          variant === 'success' && [
            'bg-[#95d5b2] text-[#1a472a]',
            isHovered && 'bg-[#75c59a]',
            isPressed && 'bg-[#55b582] scale-95',
            isFocusVisible && 'ring-2 ring-[#95d5b2] ring-offset-2',
          ],
          
          className
        )
      }
      {...props}
    >
      {children}
    </AriaButton>
  );
}
