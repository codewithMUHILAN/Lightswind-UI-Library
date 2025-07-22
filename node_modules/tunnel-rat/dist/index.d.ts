import React from 'react';
declare type Props = {
    children: React.ReactNode;
};
export default function tunnel(): {
    In: ({ children }: Props) => null;
    Out: () => JSX.Element;
};
export {};
