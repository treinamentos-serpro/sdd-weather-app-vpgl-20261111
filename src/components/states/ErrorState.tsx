interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export default function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div
      className="flex flex-col items-start gap-4 rounded-lg border border-red-300/20 bg-white/5 p-4 text-white shadow-glass backdrop-blur-md sm:flex-row sm:items-center sm:justify-between"
      role="alert"
    >
      <p className="text-sm text-white/85">{message}</p>
      {onRetry && (
        <button
          className="shrink-0 rounded-lg border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
          onClick={onRetry}
          type="button"
        >
          Tentar novamente
        </button>
      )}
    </div>
  );
}
