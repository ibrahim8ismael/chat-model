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
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setValue(e.target.value);
    };

    const handleSubmit = (e: React.FormEvent | React.KeyboardEvent<HTMLTextAreaElement>) => {
        e.preventDefault();
        if (value.trim()) {
            onSendMessage(value.trim());
            setValue('');
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
            textareaRef.current.style.height = 'auto';
            textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
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
                className="w-full p-4 pl-6 pr-16 bg-zinc-900 rounded-full text-white resize-none focus:outline-none transition-all duration-200"
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