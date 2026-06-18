import React from 'react';

interface KBDProps {
    children: React.ReactNode;
    className?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
}

const KBD: React.FC<KBDProps> = ({ children, className = '', size = 'md' }) => {
    const sizeClasses = {
        xs: 'px-1 py-0.5 text-xs',
        sm: 'px-1.5 py-1 text-sm',
        md: 'px-2 py-1.5 text-base',
        lg: 'px-3 py-2 text-lg'
    };

    return (
        <kbd className={`${sizeClasses[size]} font-semibold text-gray-800 bg-gray-200 border border-gray-300 rounded-lg ${className}`}>
            {children}
        </kbd>
    );
};

export default KBD;
