import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'icon';
    size?: 'xsmall' | 'small' | 'medium' | 'large';
    rounded?: 'small' | 'medium' | 'large' | 'full';
    children: React.ReactNode;
    className?: string;
    isSquare?: boolean; // New prop for square buttons
}

export function Button({
    variant = 'primary',
    size = 'medium',
    rounded = 'small',
    children,
    className = '',
    isSquare = false,
    ...props
}: ButtonProps) {
    const baseStyles = "inline-block font-bold transition-all duration-300 ease-in-out text-center font-pixels";

    const sizes = {
        xsmall: "px-6 py-1 text-xs",
        small: "px-10 py-1.5 text-sm",
        medium: "px-14 py-2.5 text-base",
        large: "px-20 py-3.5 text-lg"
    } as const;

    const roundedStyles = {
        small: "rounded-sm",
        medium: "rounded-md",
        large: "rounded-lg",
        full: "rounded-full"
    } as const;

    const variants = {
        primary: {
            base: "text-black bg-white cursor-pointer",
            hover: "hover:bg-gray-200",
            active: "active:text-white active:bg-gray-900"
        },
        secondary: {
            base: "text-zinc-500 cursor-pointer",
            hover: "",
            active: ""
        },
        icon: {
            base: "text-zinc-500 cursor-pointer",
            hover: "",
            active: ""
        }

    } as const;

    // Fallback to 'primary' if variant is invalid
    const selectedVariant = variants[variant as keyof typeof variants] || variants['primary'];

    // Use cn utility to properly merge classes, allowing className to override defaults
    const buttonStyles = cn(
        baseStyles,
        !isSquare && sizes[size],
        selectedVariant.base,
        selectedVariant.hover,
        selectedVariant.active,
        roundedStyles[rounded],
        isSquare && "w-8 h-8 p-0 flex items-center justify-center", // Square styles
        className
    );

    return (
        <button className={buttonStyles} {...props}>
            {children}
        </button>
    );
}

export default Button;
