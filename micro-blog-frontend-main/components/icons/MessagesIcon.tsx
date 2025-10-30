import React from 'react';

const MessagesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24" 
        strokeWidth={1.5} 
        stroke="currentColor" 
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76v-2.52a.75.75 0 01.468-.694l7.5-3a.75.75 0 01.564 0l7.5 3a.75.75 0 01.468.694v2.52M2.25 12.76v6a.75.75 0 00.75.75h17.5a.75.75 0 00.75-.75v-6M2.25 12.76l8.438-3.375a.75.75 0 01.624 0L21.75 12.76M12 21.75v-6.75" />
    </svg>
);

export default MessagesIcon;