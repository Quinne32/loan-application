type LoanType = "personal" | "home" | "business";

type ReviewStepProps = {
  loanType: LoanType | null;
  personalDetails: {
    firstName: string;
    lastName: string;
    email: string;
  };
  addressDetails: {
    city: string;
    state: string;
  };
  loanDetails: {
    amount: string;
    purpose: string;
    repaymentMonths: string;
  };
  requestedAmountLabel: string;
  identityDocumentName: string;
  supportingDocumentName: string;
  identityVerified: boolean;
  consentConfirmed: boolean;
  typedSignature: string;
  reviewError: string;
  onConsentChange: (checked: boolean) => void;
  onSignatureChange: (value: string) => void;
};

export default function ReviewStep({
  loanType,
  personalDetails,
  addressDetails,
  loanDetails,
  requestedAmountLabel,
  identityDocumentName,
  supportingDocumentName,
  identityVerified,
  consentConfirmed,
  typedSignature,
  reviewError,
  onConsentChange,
  onSignatureChange,
}: ReviewStepProps) {
  return (
    <div className="mt-8 space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-white">
          Review your application
        </h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          Review the information below before continuing. Go back to an earlier
          step if you need to make corrections.
        </p>
      </div>

      {/* Loan details */}
      <section className="rounded-xl border border-slate-800 p-4">
        <h3 className="font-semibold text-white">Loan details</h3>

        <p className="mt-4 text-sm text-slate-400">Loan type</p>
        <p className="mt-1 capitalize">{loanType} loan</p>

        <p className="mt-4 text-sm text-slate-400">Requested amount</p>
        <p className="mt-1">{requestedAmountLabel}</p>

        <p className="mt-4 text-sm text-slate-400">Purpose</p>
        <p className="mt-1">{loanDetails.purpose || "Not selected"}</p>

        <p className="mt-4 text-sm text-slate-400">Repayment period</p>
        <p className="mt-1">{loanDetails.repaymentMonths} months</p>
      </section>

      {/* Personal details */}
      <section className="rounded-xl border border-slate-800 p-4">
        <h3 className="font-semibold text-white">Personal details</h3>

        <p className="mt-4 text-sm text-slate-400">Full name</p>
        <p className="mt-1">
          {personalDetails.firstName} {personalDetails.lastName}
        </p>

        <p className="mt-4 text-sm text-slate-400">Email</p>
        <p className="mt-1 break-all">
          {personalDetails.email || "Not entered"}
        </p>

        <p className="mt-4 text-sm text-slate-400">Address</p>
        <p className="mt-1">
          {addressDetails.city || "Not entered"}
          {addressDetails.state ? `, ${addressDetails.state}` : ""}
        </p>
      </section>

      {/* Documents */}
      <section className="rounded-xl border border-slate-800 p-4">
        <h3 className="font-semibold text-white">Uploaded documents</h3>

        <p className="mt-4 text-sm text-slate-400">Identity document</p>
        <p className="mt-1 break-all">
          {identityDocumentName || "No document uploaded"}
        </p>

        <p className="mt-4 text-sm text-slate-400">Supporting document</p>
        <p className="mt-1 break-all">
          {supportingDocumentName || "No document uploaded"}
        </p>

        <p className="mt-4 text-sm text-slate-400">Demo verification</p>
        <p className="mt-1">
          {identityVerified ? "Demo passed" : "Not completed"}
        </p>
      </section>

      {/* Consent */}
      <section className="rounded-xl border border-slate-800 p-4">
        <h3 className="font-semibold text-white">Confirmation and consent</h3>

        <label className="mt-4 flex items-start gap-3 text-sm leading-6 text-slate-300">
          <input
            type="checkbox"
            checked={consentConfirmed}
            onChange={(event) => onConsentChange(event.target.checked)}
            className="mt-1 h-4 w-4 shrink-0 accent-blue-600"
          />

          <span>
            I confirm that I have reviewed the information displayed above and
            that it is accurate to the best of my knowledge.
          </span>
        </label>

        <div className="mt-6">
          <label
            htmlFor="typedSignature"
            className="block text-sm font-medium text-slate-300"
          >
            Type your full name as your demo signature
          </label>

          <input
            id="typedSignature"
            type="text"
            value={typedSignature}
            onChange={(event) => onSignatureChange(event.target.value)}
            placeholder={`${personalDetails.firstName} ${personalDetails.lastName}`}
            autoComplete="off"
            className="mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-white outline-none focus:border-blue-500"
          />

          <p className="mt-2 text-xs text-slate-500">
            This is a demonstration signature, not a legally binding electronic
            signature.
          </p>
        </div>

        {reviewError && (
          <p role="alert" className="mt-4 text-sm text-red-400">
            {reviewError}
          </p>
        )}
      </section>
    </div>
  );
}
