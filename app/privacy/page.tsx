import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | FocusTag",
  description: "FocusTag privacy policy and data handling information.",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <div className="mx-auto max-w-4xl px-6 py-16">
        <div className="mb-10">
          <p className="text-sm font-medium text-slate-400">FocusTag</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight">Privacy Policy</h1>
          <p className="mt-3 text-sm text-slate-400">Last updated: October 7, 2026</p>
        </div>

        <div className="space-y-8 text-slate-300 leading-7">
          <section>
            <h2 className="text-xl font-semibold text-white">1. What FocusTag does</h2>
            <p className="mt-2">
              FocusTag helps users run intentional Focus Mode sessions. A user starts or ends a session
              using a registered NFC tag or QR credential. During an active session, the Android app
              can detect when a selected app comes to the foreground and return the user to the home
              screen.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">2. Information we process</h2>
            <div className="mt-3 space-y-3">
              <p><strong className="text-white">Account information:</strong> email address, display name, user role, and institution association.</p>
              <p><strong className="text-white">Focus session information:</strong> session identifiers, start/end times, session status, entry source, classroom/tag association, and policy version where available.</p>
              <p><strong className="text-white">App package information:</strong> Android package names needed to display selectable apps locally, enforce the selected policy, and record a blocked-app interception event.</p>
              <p><strong className="text-white">NFC/QR identifiers:</strong> registered tag identifiers and QR credentials used to resolve a physical or visual FocusTag trigger.</p>
              <p><strong className="text-white">Device operation data:</strong> installation identifiers and last-seen information used for session synchronization and operational recovery.</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">3. Accessibility access</h2>
            <p className="mt-2">
              FocusTag requests Android Accessibility access because Android does not otherwise provide
              the app with a reliable foreground-app change signal for this use case. In the public
              build, the service acts only during an active Focus Mode session and only evaluates
              package names against the active blocked-app policy. Screen text is not used as the
              enforcement decision and is not intentionally stored as analytics data.
            </p>
            <p className="mt-3">
              This permission is optional until the user starts a Focus Mode session that requires
              enforcement. Users can disable it in Android settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">4. How we use information</h2>
            <p className="mt-2">
              We use the information above to authenticate users, associate sessions with the correct
              institution and class, enforce the configured Focus Mode policy, synchronize session
              history, provide institutional reporting, and maintain service security and reliability.
              We do not use this information for advertising or sell personal data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">5. Service providers</h2>
            <p className="mt-2">
              FocusTag uses Supabase for authentication and database services. Data processed through
              those services is handled according to the configuration of the FocusTag service and the
              applicable provider terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">6. Security</h2>
            <p className="mt-2">
              Access to institutional data is protected using authenticated requests and database
              row-level security. Sensitive service credentials are not embedded in the Android client.
              Password authentication is handled by the authentication provider rather than stored by
              the FocusTag application itself.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">7. Your choices</h2>
            <p className="mt-2">
              You can disable optional Android capabilities such as Accessibility access through system
              settings. You can also request deletion of your FocusTag account and associated service
              data using the account-deletion request page.
            </p>
            <p className="mt-3">
              <a className="underline underline-offset-4 text-white" href="/delete-account">
                Request account deletion
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white">8. Updates</h2>
            <p className="mt-2">
              We may update this policy when the app or its data practices materially change. The latest
              version will remain available on this page.
            </p>
          </section>
        </div>
      </div>
    </main>
  );
}
