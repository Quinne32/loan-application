type EmploymentStatus = "employed" | "self-employed" | "unemployed";

type FinancialDetails = {
  employmentStatus: EmploymentStatus | "";
  occupation: string;
  employerName: string;
  monthlyIncome: string;
  monthlyDebtPayments: string;
  businessName: string;
  yearsInBusiness: string;
};

type FinancialDetailsStepProps = {
  financialDetails: FinancialDetails;
  errors: Partial<Record<keyof FinancialDetails, string>>;
  loanType: "personal" | "home" | "business" | null;
  inputClass: string;
  onChange: (field: keyof FinancialDetails, value: string) => void;
};

export default function FinancialDetailsStep({
  financialDetails,
  errors,
  loanType,
  inputClass,
  onChange,
}: FinancialDetailsStepProps) {
  return (
    <div className="mt-8 space-y-5">
      <div>
        <label
          htmlFor="employmentStatus"
          className="text-sm font-medium text-slate-200"
        >
          Employment status
        </label>
        <select
          id="employmentStatus"
          value={financialDetails.employmentStatus}
          onChange={(event) => onChange("employmentStatus", event.target.value)}
          className={inputClass}
          aria-invalid={Boolean(errors.employmentStatus)}
        >
          <option value="">Select employment status</option>
          <option value="employed">Employed</option>
          <option value="self-employed">Self-employed</option>
          <option value="unemployed">Unemployed</option>
        </select>
        {errors.employmentStatus && (
          <p className="mt-1 text-sm text-red-400">{errors.employmentStatus}</p>
        )}
      </div>

      <div>
        <label
          htmlFor="occupation"
          className="text-sm font-medium text-slate-200"
        >
          Occupation
        </label>
        <input
          id="occupation"
          value={financialDetails.occupation}
          onChange={(event) => onChange("occupation", event.target.value)}
          placeholder="e.g. Software developer"
          className={inputClass}
          aria-invalid={Boolean(errors.occupation)}
        />
        {errors.occupation && (
          <p className="mt-1 text-sm text-red-400">{errors.occupation}</p>
        )}
      </div>

      {financialDetails.employmentStatus === "employed" && (
        <div>
          <label
            htmlFor="employerName"
            className="text-sm font-medium text-slate-200"
          >
            Employer name
          </label>
          <input
            id="employerName"
            value={financialDetails.employerName}
            onChange={(event) => onChange("employerName", event.target.value)}
            placeholder="Enter employer name"
            className={inputClass}
            aria-invalid={Boolean(errors.employerName)}
          />
          {errors.employerName && (
            <p className="mt-1 text-sm text-red-400">{errors.employerName}</p>
          )}
        </div>
      )}

      {financialDetails.employmentStatus === "self-employed" && (
        <div>
          <label
            htmlFor="businessName"
            className="text-sm font-medium text-slate-200"
          >
            Business name
          </label>
          <input
            id="businessName"
            value={financialDetails.businessName}
            onChange={(event) => onChange("businessName", event.target.value)}
            placeholder="Enter business name"
            className={inputClass}
            aria-invalid={Boolean(errors.businessName)}
          />
          {errors.businessName && (
            <p className="mt-1 text-sm text-red-400">{errors.businessName}</p>
          )}
        </div>
      )}

      {loanType === "business" && (
        <div>
          <label
            htmlFor="yearsInBusiness"
            className="text-sm font-medium text-slate-200"
          >
            Years in business
          </label>
          <input
            id="yearsInBusiness"
            type="number"
            min="0"
            step="1"
            value={financialDetails.yearsInBusiness}
            onChange={(event) =>
              onChange("yearsInBusiness", event.target.value)
            }
            placeholder="e.g. 3"
            className={inputClass}
            aria-invalid={Boolean(errors.yearsInBusiness)}
          />
          {errors.yearsInBusiness && (
            <p className="mt-1 text-sm text-red-400">
              {errors.yearsInBusiness}
            </p>
          )}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="monthlyIncome"
            className="text-sm font-medium text-slate-200"
          >
            Monthly income (₦)
          </label>
          <input
            id="monthlyIncome"
            type="number"
            min="0"
            step="0.01"
            value={financialDetails.monthlyIncome}
            onChange={(event) => onChange("monthlyIncome", event.target.value)}
            placeholder="e.g. 250000"
            className={inputClass}
            aria-invalid={Boolean(errors.monthlyIncome)}
          />
          {errors.monthlyIncome && (
            <p className="mt-1 text-sm text-red-400">{errors.monthlyIncome}</p>
          )}
        </div>

        <div>
          <label
            htmlFor="monthlyDebtPayments"
            className="text-sm font-medium text-slate-200"
          >
            Existing monthly debt payments (₦)
          </label>
          <input
            id="monthlyDebtPayments"
            type="number"
            min="0"
            step="0.01"
            value={financialDetails.monthlyDebtPayments}
            onChange={(event) =>
              onChange("monthlyDebtPayments", event.target.value)
            }
            placeholder="Enter 0 if none"
            className={inputClass}
            aria-invalid={Boolean(errors.monthlyDebtPayments)}
          />
          {errors.monthlyDebtPayments && (
            <p className="mt-1 text-sm text-red-400">
              {errors.monthlyDebtPayments}
            </p>
          )}
        </div>
      </div>

      <p className="text-xs leading-5 text-slate-500">
        Portfolio demo only. Use fictional figures while testing. These fields
        do not determine real loan eligibility.
      </p>
    </div>
  );
}
