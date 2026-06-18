import { Tooltip } from 'primereact/tooltip';
import React from 'react';

interface DashboardTileProps {
    title: string;
    value: string | number;
    icon: string;
    backgroundColor?: string;
    color?: string;
}

export const DashboardTile: React.FC<DashboardTileProps> = ({
    title,
    value,
    icon,
    backgroundColor = 'white',
    color = '#333',
}) => {
    return (
        <div
            style={{
                borderRadius: '10px',
                padding: '25px',
                backgroundColor,
                color,
                boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                position: 'relative',
                cursor: 'pointer',
            }}
        >
            <Tooltip target=".tile-title"  showDelay={750} hideDelay={800} />
            <div
            className="tile-title"
                data-pr-tooltip={title}
                style={{
                    fontSize: 'clamp(14px, 2vw, 18px)',
                    flex: 1,
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth:'80%',
                }}
            >
                {title}
            </div>
            
            <div style={{ fontSize: '32px', fontWeight: 'bold', marginTop: '10px' }}>{value}</div>
            <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <i className={`pi ${icon}`} style={{ fontSize: '1.5rem', color }}></i>
            </div>
        </div>
    );
};
