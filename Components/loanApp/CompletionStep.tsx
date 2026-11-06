type EligibilityResult = {
  eligible: boolean;
  monthlyInstallment: number;
  debtToIncomeRatio: number;
};

type CompletionStepProps = {
  applicationReference: string;
  eligibilityResult: EligibilityResult | null;
  monthlyInstallmentLabel: string;
  onReturnHome: () => void;
};

export default function CompletionStep({
  applicationReference,
  eligibilityResult,
  monthlyInstallmentLabel,
  onReturnHome,
}: CompletionStepProps) {
  return (
    <div className="mt-8 space-y-6">
      <div className="rounded-xl border border-slate-800 p-6 text-center">
        <h2 className="text-2xl font-bold text-white">
          Application Completed!
        </h2>

        <p className="mt-2 text-slate-400">
          Your demo loan application process is complete.
        </p>

        <p className="mt-6 text-sm text-slate-400">Application Reference</p>

        <p className="mt-1 text-xl font-bold text-blue-400">
          {applicationReference || "Reference unavailable"}
        </p>
      </div>

      <div className="rounded-xl border border-slate-800 p-6">
        <h3 className="text-lg font-semibold text-white">
          Demo Eligibility Result
        </h3>

        {eligibilityResult ? (
          <>
            <p className="mt-4 text-slate-300">
              {eligibilityResult.eligible
                ? "Your application meets the demo eligibility criteria."
                : "Your application does not meet the demo eligibility criteria."}
            </p>

            <p className="mt-4 text-sm text-slate-400">
              Estimated monthly repayment
            </p>

            <p className="mt-1 font-semibold text-white">
              {monthlyInstallmentLabel}
            </p>

            <p className="mt-4 text-sm text-slate-400">Debt-to-income ratio</p>

            <p className="mt-1 font-semibold text-white">
              {eligibilityResult.debtToIncomeRatio.toFixed(2)}%
            </p>
          </>
        ) : (
          <p className="mt-4 text-red-400">
            Eligibility result is unavailable.
          </p>
        )}
      </div>

      <p className="text-sm text-slate-500">
        This is a frontend demonstration. No real loan application has been
        submitted or approved.
      </p>

      <button
        type="button"
        onClick={onReturnHome}
        className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Return to Home
      </button>
    </div>
  );
}
