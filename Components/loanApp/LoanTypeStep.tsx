type LoanType = "personal" | "home" | "business";

type LoanTypeStepProps = {
  loanType: LoanType | null;
  onSelect: (loanType: LoanType) => void;
};

const loanOptions = [
  {
    value: "personal",
    title: "Personal loan",
    description: "For personal expenses",
  },
  {
    value: "home",
    title: "Home loan",
    description: "For housing needs",
  },
  {
    value: "business",
    title: "Business loan",
    description: "For business needs",
  },
] as const;

export default function LoanTypeStep({
  loanType,
  onSelect,
}: LoanTypeStepProps) {
  return (
    <div className="mt-8 grid gap-4 sm:grid-cols-3">
      {loanOptions.map((loan) => (
        <button
          key={loan.value}
          type="button"
          onClick={() => onSelect(loan.value)}
          className={`rounded-xl border p-4 text-left transition ${
            loanType === loan.value
              ? "border-blue-500 bg-blue-500/10"
              : "border-slate-700 hover:border-slate-500"
          }`}
        >
          <span className="block font-semibold">{loan.title}</span>
          <span className="mt-2 block text-sm text-slate-400">
            {loan.description}
          </span>
        </button>
      ))}
    </div>
  );
}
