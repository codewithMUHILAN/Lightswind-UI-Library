import * as React from "react";
interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
    type?: "single" | "multiple";
    value?: string | string[];
    defaultValue?: string | string[];
    onValueChange?: (value: string[]) => void;
    collapsible?: boolean;
}
declare const Accordion: React.ForwardRefExoticComponent<AccordionProps & React.RefAttributes<HTMLDivElement>>;
interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
    value: string;
    disabled?: boolean;
}
declare const AccordionItem: React.ForwardRefExoticComponent<AccordionItemProps & React.RefAttributes<HTMLDivElement>>;
interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
}
declare const AccordionTrigger: React.ForwardRefExoticComponent<AccordionTriggerProps & React.RefAttributes<HTMLButtonElement>>;
interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
}
declare const AccordionContent: React.ForwardRefExoticComponent<AccordionContentProps & React.RefAttributes<HTMLDivElement>>;
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
