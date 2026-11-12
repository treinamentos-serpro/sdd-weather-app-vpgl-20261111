interface LoadingStateProps {
  message?: string;
}

export default function LoadingState({ message = 'Carregando...' }: LoadingStateProps) {
  return (
    <div
      aria-atomic="true"
      aria-live="polite"
      className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 p-4 text-sm text-white/80 shadow-glass backdrop-blur-md"
      role="status"
    >
      <span
        aria-hidden="true"
        className="size-4 shrink-0 animate-spin rounded-full border-2 border-white/25 border-t-accent-400 motion-reduce:animate-none"
      />
      <span>{message}</span>
    </div>
  );
}
