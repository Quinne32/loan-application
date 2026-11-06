type LoanType = "personal" | "home" | "business";

type LoanDetails = {
  amount: string;
  purpose: string;
  repaymentMonths: string;
};

type LoanDetailsStepProps = {
  loanDetails: LoanDetails;
  errors: Partial<Record<keyof LoanDetails, string>>;
  loanType: LoanType | null;
  inputClass: string;
  estimatedMonthlyRepaymentLabel: string;
  onChange: (field: keyof LoanDetails, value: string) => void;
};

const loanPurposes: Record<LoanType, string[]> = {
  personal: [
    "Education",
    "Medical expenses",
    "Debt consolidation",
    "Family expenses",
    "Other personal needs",
  ],
  home: [
    "Home purchase",
    "Home construction",
    "Home renovation",
    "Land purchase",
    "Other housing needs",
  ],
  business: [
    "Working capital",
    "Equipment purchase",
    "Inventory or stock",
    "Business expansion",
    "Other business needs",
  ],
};

const repaymentOptions = [3, 6, 9, 12, 18, 24, 36, 48, 60];

export default function LoanDetailsStep({
  loanDetails,
  errors,
  loanType,
  inputClass,
  estimatedMonthlyRepaymentLabel,
  onChange,
}: LoanDetailsStepProps) {
  return (
    <div className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="loanPurpose"
          className="text-sm font-medium text-slate-200"
        >
          Loan purpose
        </label>

        <select
          id="loanPurpose"
          value={loanDetails.purpose}
          onChange={(event) => onChange("purpose", event.target.value)}
          className={inputClass}
          aria-invalid={Boolean(errors.purpose)}
        >
          <option value="">Select a purpose</option>

          {(loanType ? loanPurposes[loanType] : []).map((purpose) => (
            <option key={purpose} value={purpose}>
              {purpose}
            </option>
          ))}
        </select>

        {errors.purpose && (
          <p className="mt-1 text-sm text-red-400">{errors.purpose}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="loanAmount"
          className="text-sm font-medium text-slate-200"
        >
          Loan amount (₦)
        </label>

        <input
          id="loanAmount"
          type="number"
          min="50000"
          max="50000000"
          step="1000"
          inputMode="numeric"
          value={loanDetails.amount}
          onChange={(event) => onChange("amount", event.target.value)}
          placeholder="e.g. 500000"
          className={inputClass}
          aria-invalid={Boolean(errors.amount)}
          aria-describedby={
            errors.amount ? "loanAmount-error" : "loanAmount-help"
          }
        />

        {errors.amount && (
          <p id="loanAmount-error" className="mt-1 text-sm text-red-400">
            {errors.amount}
          </p>
        )}

        <p id="loanAmount-help" className="mt-1 text-xs text-slate-500">
          For this portfolio demo, choose between ₦50,000 and ₦50,000,000.
        </p>
      </div>

      <div>
        <label
          htmlFor="repaymentMonths"
          className="text-sm font-medium text-slate-200"
        >
          Repayment period
        </label>

        <select
          id="repaymentMonths"
          value={loanDetails.repaymentMonths}
          onChange={(event) => onChange("repaymentMonths", event.target.value)}
          className={inputClass}
          aria-invalid={Boolean(errors.repaymentMonths)}
        >
          {repaymentOptions.map((months) => (
            <option key={months} value={months}>
              {months} months
            </option>
          ))}
        </select>

        {errors.repaymentMonths && (
          <p className="mt-1 text-sm text-red-400">{errors.repaymentMonths}</p>
        )}
      </div>

      <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5">
        <p className="text-sm font-medium text-blue-300">
          Estimated monthly repayment
        </p>

        <p className="mt-2 text-2xl font-bold">
          {estimatedMonthlyRepaymentLabel}
        </p>

        <p className="mt-3 text-xs leading-5 text-slate-400">
          Illustration only, calculated using a sample fixed annual rate of 18%.
          This is not a lender quote. Actual rates, fees, eligibility, and
          repayment amounts may differ.
        </p>
      </div>

      <p className="text-xs leading-5 text-slate-500">
        Use fictional figures while testing. LoanFlow does not submit a real
        loan request or provide an actual approval.
      </p>
    </div>
  );
}
