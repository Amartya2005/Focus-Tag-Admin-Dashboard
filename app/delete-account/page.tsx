import type { Metadata } from "next";
import DeleteAccountForm from "./DeleteAccountForm";

export const metadata: Metadata = {
  title: "Request Account Deletion | FocusTag",
  description: "Submit a request to delete your FocusTag account and associated data.",
};

export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <p className="text-sm font-medium text-slate-400">FocusTag</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Request account deletion
        </h1>
        <p className="mt-4 leading-7 text-slate-300">
          Submit the email address associated with your FocusTag account. We will
          verify the request and process deletion of the account and associated
          service data according to applicable retention and institutional
          requirements.
        </p>

        <DeleteAccountForm />

        <p className="mt-8 text-sm leading-6 text-slate-500">
          For institutional accounts, an administrator may need to verify the
          request before deletion can be completed.
        </p>
      </div>
    </main>
  );
}
