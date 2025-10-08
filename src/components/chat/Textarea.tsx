'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import Button from '../ui/Button';
import { cn } from '@/lib/utils';

interface TextareaProps {
    className?: string;
    onSendMessage: (message: string) => void;
}

export default function Textarea({ className, onSendMessage }: TextareaProps) {
    const [value, setValue] = useState('');
    const [isMultiline, setIsMultiline] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const singleRowHeight = useRef(0);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent | React.KeyboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        if (value.trim()) {
            onSendMessage(value.trim());
            setValue('');
            setIsMultiline(false); // Reset on send
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    useEffect(() => {
        if (textareaRef.current) {
            // Capture the height of a single row on the first render
            if (singleRowHeight.current === 0 && value === '') {
                singleRowHeight.current = textareaRef.current.scrollHeight;
            }

            // Reset height to calculate the new scrollHeight
            textareaRef.current.style.height = 'auto';
            const newScrollHeight = textareaRef.current.scrollHeight;

            // Check if the content is taller than a single line
            setIsMultiline(newScrollHeight > singleRowHeight.current);

            // Set the new height
            textareaRef.current.style.height = `${newScrollHeight}px`;
        }
    }, [value]);

    return (
        <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Message Notiva..."
                className={cn(
                    "w-full p-4 pl-6 pr-16 bg-zinc-900 text-white resize-none focus:outline-none transition-all duration-200",
                    "max-h-48 overflow-y-auto", // Add max-height and scroll
                    isMultiline ? "rounded-4xl" : "rounded-full" // Dynamic border radius
                )}
                rows={1}
            />
            <Button 
                type="submit"
                variant="send"
                rounded="full"
                className="absolute right-4 top-1/2 -translate-y-1/2"
                disabled={!value.trim()}
            >
                <Send size={20} className={cn("transition-colors", value.trim().length > 0 ? "text-white" : "")} />
            </Button>
        </form>
    );
}