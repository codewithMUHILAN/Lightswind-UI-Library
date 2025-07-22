import * as React from "react";
declare const Pagination: {
    ({ className, ...props }: React.ComponentProps<"nav">): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const PaginationContent: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.HTMLAttributes<HTMLUListElement>, HTMLUListElement>, "ref"> & React.RefAttributes<HTMLUListElement>>;
declare const PaginationItem: React.ForwardRefExoticComponent<Omit<React.DetailedHTMLProps<React.LiHTMLAttributes<HTMLLIElement>, HTMLLIElement>, "ref"> & React.RefAttributes<HTMLLIElement>>;
type PaginationLinkProps = {
    isActive?: boolean;
    sizeValue?: "default" | "sm" | "lg" | "icon";
} & React.ComponentProps<"a">;
declare const PaginationLink: {
    ({ className, isActive, sizeValue, ...props }: PaginationLinkProps): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const PaginationPrevious: {
    ({ className, ...props }: React.ComponentProps<typeof PaginationLink>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const PaginationNext: {
    ({ className, ...props }: React.ComponentProps<typeof PaginationLink>): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
declare const PaginationEllipsis: {
    ({ className, ...props }: React.ComponentProps<"span">): import("react/jsx-runtime").JSX.Element;
    displayName: string;
};
export { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious, };
