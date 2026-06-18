
import React from 'react';
export const DashboardCard = ({ children }: { children: React.ReactNode }) => {
      return (
            <div className="h-full" style={{
                  backgroundColor: 'white',
                  borderRadius: '15px',
                  padding: '20px',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
                  flex: '1',
                  minWidth: '320px'
            }}>
                  {children}
            </div>
      )
}