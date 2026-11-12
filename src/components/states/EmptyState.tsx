import type { Ref } from 'react';

interface EmptyStateProps {
  title: string;
  hint: string;
  titleRef?: Ref<HTMLHeadingElement>;
}

export default function EmptyState({ title, hint, titleRef }: EmptyStateProps) {
  return (
    <section
      aria-atomic="true"
      aria-live="polite"
      className="rounded-lg border border-white/10 bg-white/5 p-5 text-white shadow-glass backdrop-blur-md"
      role="status"
    >
      <h2
        className="text-base font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-400"
        ref={titleRef}
        tabIndex={-1}
      >
        {title}
      </h2>
      <p className="mt-2 text-sm text-white/65">{hint}</p>
    </section>
  );
}
