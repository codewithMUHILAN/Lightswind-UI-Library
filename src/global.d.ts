import 'react';

declare global {
  // Replaced with package.json "version" at build time (see tsup.config.ts).
  const __LIGHTSWIND_VERSION__: string;
}

declare module 'react' {
  interface StyleHTMLAttributes<T> extends React.HTMLAttributes<T> {
    jsx?: boolean;
    global?: boolean;
  }
}
