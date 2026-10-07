"use client";

import { useActionState } from "react";
import { submitDeletionRequest, type DeleteAccountState } from "./actions";

const initialState: DeleteAccountState = {
  success: false,
  message: "",
};

export default function DeleteAccountForm() {
  const [state, action, pending] = useActionState(
    submitDeletionRequest,
    initialState,
  );

  return (
    <form action={action} className="mt-8 space-y-5">
      <label className="block">
        <span className="text-sm font-medium text-slate-200">Account email</span>
        <input
          name="email"
          type="email"
          required
          maxLength={320}
          autoComplete="email"
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none ring-0 placeholder:text-slate-500 focus:border-slate-400"
          placeholder="you@example.com"
        />
      </label>

      <label className="block">
        <span className="text-sm font-medium text-slate-200">
          Optional message
        </span>
        <textarea
          name="reason"
          maxLength={2000}
          rows={5}
          className="mt-2 w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-100 outline-none placeholder:text-slate-500 focus:border-slate-400"
          placeholder="Anything we should know about the request?"
        />
      </label>

      {state.message ? (
        <p
          className={
            state.success
              ? "rounded-xl border border-emerald-800 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-200"
              : "rounded-xl border border-red-800 bg-red-950/40 px-4 py-3 text-sm text-red-200"
          }
          role="status"
        >
          {state.message}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-xl bg-white px-4 py-3 font-medium text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {pending ? "Submitting…" : "Submit deletion request"}
      </button>
    </form>
  );
}
