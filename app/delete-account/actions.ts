"use server";

import { createClient } from "@/utils/supabase/server";

export type DeleteAccountState = {
  success: boolean;
  message: string;
};

export async function submitDeletionRequest(
  _previousState: DeleteAccountState,
  formData: FormData,
): Promise<DeleteAccountState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const reason = String(formData.get("reason") ?? "").trim();

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { success: false, message: "Enter a valid account email address." };
  }

  if (reason.length > 2000) {
    return { success: false, message: "The optional message is too long." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("account_deletion_requests").insert({
    email,
    reason: reason || null,
  });

  if (error) {
    return {
      success: false,
      message: "We could not submit the request. Please try again.",
    };
  }

  return {
    success: true,
    message:
      "Your deletion request has been submitted. An administrator will verify the request and process the account and associated data according to the applicable retention requirements.",
  };
}
