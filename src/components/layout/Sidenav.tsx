import { cn } from "@/lib/utils";
import Logo from "../ui/Logo";
import Button from "../ui/Button";
import { ChevronsLeft } from 'lucide-react';

interface SidenavProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function Sidenav({
    isOpen,
    setIsOpen
}: SidenavProps) {
    return (
        <div
            className={cn(
                "group fixed top-0 left-0 h-full bg-zinc-900 text-white transform",
                isOpen ? "w-64" : "w-16",
                "transition-all duration-300 z-30 flex flex-col"
            )}
        >
            <div className={cn("p-4 flex items-center relative", isOpen ? "justify-between" : "justify-center")}>
                <Logo view={isOpen ? "logo" : "logo"} size={isOpen ? 'sm' : 'sm'} />
                <Button 
                    onClick={() => setIsOpen(!isOpen)} 
                    variant="icon" 
                    rounded="full"
                    className={cn(
                        "transition-opacity z-10 bg-zinc-900", 
                        isOpen 
                            ? "opacity-100"
                            : "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100"
                    )}
                >
                    <ChevronsLeft className={cn("transition-transform", isOpen ? "" : "rotate-180")} />
                </Button>
            </div>
        </div>
    );
}
