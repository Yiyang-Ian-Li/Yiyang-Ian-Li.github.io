'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';

interface ImageViewerProps {
    src: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageViewer({ src, alt, isOpen, onClose }: ImageViewerProps) {
    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
        };
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-background/70 dark:bg-neutral-950/70"
                    onClick={onClose}
                    onWheel={(e) => e.preventDefault()}
                >
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onClose();
                        }}
                        className="absolute top-5 right-5 z-10 p-1.5 rounded-full border border-neutral-200/80 bg-background/90 text-neutral-500 shadow-sm hover:text-primary hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-900/90 dark:text-neutral-400 dark:hover:text-white dark:hover:bg-neutral-800 transition-colors"
                        title="Close (ESC)"
                    >
                        <XMarkIcon className="h-4 w-4" />
                    </button>

                    {/* Image */}
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="relative flex max-w-[92vw] max-h-[86vh] items-center justify-center bg-background/95 p-2 shadow-xl dark:bg-neutral-900/95"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={src}
                            alt={alt}
                            className="max-h-[82vh] w-auto max-w-[min(1040px,90vw)] object-contain"
                        />
                    </motion.div>

                    <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 text-neutral-400 dark:text-neutral-500 text-xs">
                        Click outside to close
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
