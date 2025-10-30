import React from 'react';

const HomeIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955a.75.75 0 011.06 0l8.955 8.955a.75.75 0 01-.027 1.06l-.027.027a.75.75 0 01-1.06 0L12 4.06 3.337 12.727a.75.75 0 01-1.06 0 .75.75 0 010-1.06z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 9.75v10.125a.75.75 0 00.75.75h3.375v-6h4.5v6h3.375a.75.75 0 00.75-.75V9.75M8.25 21v-6.75M15.75 21v-6.75" />
    </svg>
);

export default HomeIcon;