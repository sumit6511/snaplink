import { useMutation } from '@tanstack/react-query';
import { MailWarning } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { resendVerificationRequest } from '@/services/auth.service';
import { getErrorMessage } from '@/utils/errorMessage';

export function EmailVerificationBanner() {
  const { user } = useAuth();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resendMutation = useMutation({ mutationFn: resendVerificationRequest });

  if (!user || user.emailVerified) return null;

  const handleResend = async () => {
    setError(null);
    try {
      await resendMutation.mutateAsync();
      setSent(true);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not resend the verification email.'));
    }
  };

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm dark:border-amber-500/20 dark:bg-amber-500/10">
      <div className="flex items-center gap-2.5 text-amber-800 dark:text-amber-300">
        <MailWarning className="size-4.5 shrink-0" />
        <span>
          Verify your email address ({user.email}) to secure your account.
          {sent && !error && <span className="font-medium"> Verification email sent.</span>}
          {error && <span className="font-medium"> {error}</span>}
        </span>
      </div>
      <button
        type="button"
        onClick={() => void handleResend()}
        disabled={resendMutation.isPending || sent}
        className="shrink-0 font-medium text-amber-800 underline decoration-amber-400 underline-offset-2 hover:text-amber-900 disabled:cursor-not-allowed disabled:opacity-60 dark:text-amber-300 dark:hover:text-amber-200"
      >
        {sent ? 'Sent' : resendMutation.isPending ? 'Sending…' : 'Resend email'}
      </button>
    </div>
  );
}
