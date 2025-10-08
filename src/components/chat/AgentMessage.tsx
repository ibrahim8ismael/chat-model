import Logo from '../ui/Logo';

interface AgentMessageProps {
    text: string;
}

export default function AgentMessage({ text }: AgentMessageProps) {
    return (
        <div className="flex items-start gap-4 flex-row">
            <div className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center">
                <Logo view='logo' size='sm'/>
            </div>
            <div className="p-4 rounded-lg max-w-lg text-zinc-100 break-words">
                {text}
            </div>
        </div>
    );
}