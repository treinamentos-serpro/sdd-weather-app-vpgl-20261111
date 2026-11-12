import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import SearchBar from '../../../src/components/SearchBar';

afterEach(cleanup);

describe('SearchBar', () => {
  it('não chama onSearch quando o input está vazio ou só contém espaços', () => {
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);
    const input = screen.getByRole('searchbox', { name: 'Cidade' });

    fireEvent.submit(screen.getByRole('search', { name: 'Buscar cidade' }));
    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toBe('Informe o nome de uma cidade.');
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(input.getAttribute('aria-describedby')).toBeTruthy();

    fireEvent.change(input, {
      target: { value: '   ' },
    });
    fireEvent.submit(screen.getByRole('search', { name: 'Buscar cidade' }));

    expect(onSearch).not.toHaveBeenCalled();
    expect(screen.getByRole('alert').textContent).toBe('Informe o nome de uma cidade.');
  });

  it('chama onSearch com o termo aparado', async () => {
    const user = userEvent.setup();
    const onSearch = vi.fn();
    render(<SearchBar onSearch={onSearch} />);

    await user.type(screen.getByRole('searchbox', { name: 'Cidade' }), '  São Paulo  ');
    await user.click(screen.getByRole('button', { name: 'Buscar' }));

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith('São Paulo');
  });
});
