'use client';

import { ReactNode } from 'react';
import { ModalOverlay, Modal as AriaModal, Dialog } from 'react-aria-components';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from './Button';

type ModalProps = {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  title: string;
  children: ReactNode;
  className?: string;
};

export function Modal({ isOpen, onOpenChange, title, children, className }: ModalProps) {
  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      className={({ isEntering, isExiting }) => cn(
        'fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex min-h-full items-center justify-center p-4 text-center',
        isEntering && 'animate-fade-in',
        isExiting && 'animate-fade-out'
      )}
    >
      <AriaModal
        className={({ isEntering, isExiting }) => cn(
          'w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all border border-gray-100',
          isEntering && 'animate-zoom-in',
          isExiting && 'animate-zoom-out',
          className
        )}
      >
        <Dialog className="outline-none relative">
          {({ close }) => (
            <>
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-100">
                <h3 className="text-lg font-bold text-[#7a1f32]">{title}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  className="p-1 min-w-0 rounded-lg border-0 hover:bg-gray-100 text-gray-500"
                  onPress={close}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-gray-900 text-sm">
                {children}
              </div>
            </>
          )}
        </Dialog>
      </AriaModal>
    </ModalOverlay>
  );
}
