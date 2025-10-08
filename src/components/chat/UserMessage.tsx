import { User } from 'lucide-react';

interface UserMessageProps {
    text: string;
}

export default function UserMessage({ text }: UserMessageProps) {
    return (
        <div className="flex items-start gap-4 flex-row-reverse">
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                <User size={24} />
            </div>
            <div className="px-4 py-4 rounded-md max-w-lg bg-zinc-900 text-white break-words">
                {text}
            </div>
        </div>
    );
}