"use client";

import { useActionState, useEffect } from "react";
import Modal from "@/components/ui/modal";
import { PasswordInput } from "@/components/ui/password-ui";
import { resetLeaderPassword } from "@/actions/leader.actions";
import { AlertCircle, CheckCircle2, X } from "lucide-react";

type Props = {
  open: boolean;
  onClose: () => void;
  leaderId: string;
};

const initialState = {
  success: "",
  error: "",
};

export function ResetPasswordModal({
  open,
  onClose,
  leaderId,
}: Props) {
  const [state, formAction, pending] = useActionState(
    resetLeaderPassword,
    initialState
  );

  useEffect(() => {
    if (state.success) {
      const timer = setTimeout(() => {
        onClose();
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [state.success, onClose]);

  return (
    <Modal
      open={open}
      onClose={onClose}
    >
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-6 py-4">
        <h2 className="text-lg font-bold text-card-foreground">
          Reset Password
        </h2>

        <button
          type="button"
          onClick={onClose}
          className="rounded-xl border border-border p-2 text-muted-foreground transition hover:bg-muted/50 hover:text-card-foreground"
        >
          <X size={18} />
        </button>
      </div>

      <form
        action={formAction}
        className="space-y-5 p-6"
      >
        <input
          type="hidden"
          name="leaderId"
          value={leaderId}
        />

        {state.error && (
          <div className="flex items-start gap-3 rounded-2xl border border-destructive/30 bg-destructive/10 p-4 text-sm font-semibold text-destructive">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <p>{state.error}</p>
          </div>
        )}

        {state.success && (
          <div className="flex items-start gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-semibold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <p>{state.success}</p>
          </div>
        )}

        <PasswordInput
          name="password"
          label="New Password"
          placeholder="Minimum 8 characters"
          required
          minLength={8}
          autoComplete="new-password"
        />

        <PasswordInput
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm password"
          required
          minLength={8}
          autoComplete="new-password"
        />

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-primary py-3 text-sm font-bold text-primary-foreground shadow-sm transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Resetting..." : "Reset Password"}
        </button>
      </form>
    </Modal>
  );
}