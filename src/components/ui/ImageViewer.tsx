'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { XMarkIcon, MagnifyingGlassMinusIcon, MagnifyingGlassPlusIcon } from '@heroicons/react/24/outline';
import { useState, useEffect } from 'react';

interface ImageViewerProps {
    src: string;
    alt: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function ImageViewer({ src, alt, isOpen, onClose }: ImageViewerProps) {
    const [scale, setScale] = useState(1);

    // Reset scale when opening/closing
    useEffect(() => {
        if (isOpen) {
            setScale(1);
        }
    }, [isOpen]);

    // Handle ESC key to close
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };
        if (isOpen) {
            window.addEventListener('keydown', handleEsc);
            // Prevent body scroll when viewer is open
            document.body.style.overflow = 'hidden';
        }
        return () => {
            window.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3));
    const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5));

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
                    onClick={onClose}
                >
                    {/* Controls */}
                    <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                zoomOut();
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                            title="Zoom Out"
                        >
                            <MagnifyingGlassMinusIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                zoomIn();
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                            title="Zoom In"
                        >
                            <MagnifyingGlassPlusIcon className="h-5 w-5" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onClose();
                            }}
                            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                            title="Close (ESC)"
                        >
                            <XMarkIcon className="h-6 w-6" />
                        </button>
                    </div>

                    {/* Scale indicator */}
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-lg bg-white/10 text-white text-sm z-10">
                        {Math.round(scale * 100)}%
                    </div>

                    {/* Image */}
                    <motion.div
                        initial={{ scale: 0.8 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0.8 }}
                        transition={{ duration: 0.2 }}
                        className="relative max-w-[90vw] max-h-[90vh] overflow-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div 
                            className="relative transition-transform duration-200"
                            style={{ 
                                transform: `scale(${scale})`,
                                transformOrigin: 'center'
                            }}
                        >
                            <Image
                                src={src}
                                alt={alt}
                                width={1200}
                                height={900}
                                className="w-auto h-auto max-w-none"
                                style={{ maxHeight: '90vh', width: 'auto' }}
                                priority
                            />
                        </div>
                    </motion.div>

                    {/* Hint text */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white/60 text-sm">
                        Click outside or press ESC to close
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
