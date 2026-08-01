import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('associates the label with the input via htmlFor/id', () => {
    render(<Input label="Email address" />);
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
  });

  it('accepts typed input', async () => {
    render(<Input label="Email address" />);
    const input = screen.getByLabelText('Email address');
    await userEvent.type(input, 'ada@example.com');
    expect(input).toHaveValue('ada@example.com');
  });

  it('shows an error message and marks the input aria-invalid', () => {
    render(<Input label="Email address" error="Enter a valid email address" />);
    expect(screen.getByText('Enter a valid email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toHaveAttribute('aria-invalid', 'true');
  });

  it('shows a hint when there is no error', () => {
    render(<Input label="Password" hint="At least 8 characters" />);
    expect(screen.getByText('At least 8 characters')).toBeInTheDocument();
  });

  it('prefers the error over the hint when both are given', () => {
    render(<Input label="Password" hint="At least 8 characters" error="Too short" />);
    expect(screen.getByText('Too short')).toBeInTheDocument();
    expect(screen.queryByText('At least 8 characters')).not.toBeInTheDocument();
  });
});
