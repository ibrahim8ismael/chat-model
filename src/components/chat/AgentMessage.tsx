import Logo from '../ui/Logo';

interface AgentMessageProps {
    text: string;
    isLoading?: boolean;
}

const TypingIndicator = () => (
    <div className="flex items-center gap-1.5">
        <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]"></span>
        <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]"></span>
        <span className="h-2 w-2 rounded-full bg-zinc-400 animate-bounce"></span>
    </div>
);

export default function AgentMessage({ text, isLoading = false }: AgentMessageProps) {
    return (
        <div className="flex items-start gap-4 flex-row">
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                <Logo view='logo' size='sm'/>
            </div>
            <div className="p-4 rounded-lg max-w-lg bg-zinc-700 text-zinc-100 break-words">
                {isLoading ? <TypingIndicator /> : text}
            </div>
        </div>
    );
}