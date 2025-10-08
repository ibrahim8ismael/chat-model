import { cn } from "@/lib/utils";
import Image from "next/image";


interface LogoProps {
    className?: string;
    view?: 'logo' | 'txt';
    size?: 'sm' | 'md' | 'lg';
}

export default function Logo({
    className,
    view = 'logo',
    size = 'md'
}: LogoProps) {

    const sizeClasses = {
        sm: "h-6 w-6",
        md: "h-8 w-8",
        lg: "h-12 w-12"
    };

    const logoSrc = "/logo.png" ;
    const txtSrc = "/logo-txt.png" ;

    return(
        <div className={cn("flex items-center gap-1", className)}>
            {view === 'logo' && (
                <Image
                    src={logoSrc}
                    alt="Logo"
                    width={0}
                    height={0}
                    sizes="100vw"
                    className={cn("h-auto w-auto", sizeClasses[size])}
                    priority
                />
            )}
            {view === 'txt' && (
                <Image
                    src={txtSrc}
                    alt="Logo Text"
                    width={100}
                    height={24}
                    className={cn("h-auto w-auto", className)}
                    priority
                />
            )}
        </div>
    )
}