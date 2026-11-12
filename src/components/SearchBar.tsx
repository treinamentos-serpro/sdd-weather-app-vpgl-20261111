import { type FormEvent, useId, useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
}

export default function SearchBar({ onSearch, disabled = false }: SearchBarProps) {
  const [city, setCity] = useState('');
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const inputId = useId();
  const validationId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCity = city.trim();
    if (disabled) {
      return;
    }
    if (trimmedCity.length === 0) {
      setValidationMessage('Informe o nome de uma cidade.');
      return;
    }

    setValidationMessage(null);
    onSearch(trimmedCity);
  }

  return (
    <form
      aria-busy={disabled}
      aria-label="Buscar cidade"
      className="flex w-full flex-col gap-3 rounded-lg border border-white/10 bg-white/5 p-4 shadow-glass backdrop-blur-md sm:flex-row sm:items-end"
      onSubmit={handleSubmit}
      role="search"
    >
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <label className="text-sm font-medium text-white/90" htmlFor={inputId}>
          Cidade
        </label>
        <input
          autoComplete="off"
          className="w-full rounded-lg border border-white/10 bg-night-900/70 px-4 py-3 text-white placeholder:text-white/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={disabled}
          id={inputId}
          name="city"
          aria-describedby={validationMessage ? validationId : undefined}
          aria-invalid={validationMessage ? true : undefined}
          onChange={(event) => {
            const value = event.target.value;
            setCity(value);
            if (value.trim().length > 0) {
              setValidationMessage(null);
            }
          }}
          placeholder="Ex.: São Paulo"
          type="search"
          value={city}
        />
        {validationMessage && (
          <p className="text-sm text-red-200" id={validationId} role="alert">
            {validationMessage}
          </p>
        )}
      </div>
      <button
        className="w-full rounded-lg bg-accent-600 px-5 py-3 font-semibold text-white transition-colors enabled:hover:bg-night-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
        disabled={disabled}
        type="submit"
      >
        Buscar
      </button>
    </form>
  );
}
