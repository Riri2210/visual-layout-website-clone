// Type declarations for modules without TypeScript definitions

declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
}

declare module '@/assets/logo-jakarta.svg' {
  const content: string;
  export default content;
}

declare module '@/assets/logo-harumi.svg' {
  const content: string;
  export default content;
}

declare module 'date-fns' {
  export function format(date: Date | number, format: string, options?: { locale?: Locale }): string;
  export function parseISO(date: string): Date;
}

declare module 'date-fns/locale' {
  export const id: Locale;
}

declare module 'lucide-react' {
  import { FC, SVGProps } from 'react';
  export interface IconProps extends SVGProps<SVGSVGElement> {
    color?: string;
    size?: string | number;
    strokeWidth?: string | number;
  }
  export const Download: FC<IconProps>;
  export const FileText: FC<IconProps>;
  export const ChevronDown: FC<IconProps>;
  export const LoaderCircle: FC<IconProps>;
  export const Search: FC<IconProps>;
  export const PlusCircle: FC<IconProps>;
  export const Trash: FC<IconProps>;
  export const X: FC<IconProps>;
}
