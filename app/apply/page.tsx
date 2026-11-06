"use client";

import { useEffect, useState } from "react";

type LoanType = "personal" | "home" | "business";
type EmploymentStatus = "employed" | "self-employed" | "unemployed";

type PersonalDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
};

type AddressDetails = {
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
};

type FinancialDetails = {
  employmentStatus: EmploymentStatus | "";
  occupation: string;
  employerName: string;
  monthlyIncome: string;
  monthlyDebtPayments: string;
  businessName: string;
  yearsInBusiness: string;
};

type LoanDetails = {
  amount: string;
  purpose: string;
  repaymentMonths: string;
};

type UploadedDocument = {
  file: File | null;
  previewUrl: string;
  error: string;
  compressed: boolean;
};

const initialUploadedDocument: UploadedDocument = {
  file: null,
  previewUrl: "",
  error: "",
  compressed: false,
};

const initialPersonalDetails: PersonalDetails = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
};

const initialAddressDetails: AddressDetails = {
  streetAddress: "",
  city: "",
  state: "",
  postalCode: "",
};

const initialFinancialDetails: FinancialDetails = {
  employmentStatus: "",
  occupation: "",
  employerName: "",
  monthlyIncome: "",
  monthlyDebtPayments: "",
  businessName: "",
  yearsInBusiness: "",
};

const initialLoanDetails: LoanDetails = {
  amount: "",
  purpose: "",
  repaymentMonths: "12",
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

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
  "FCT",
];

const addressSuggestions: AddressDetails[] = [
  {
    streetAddress: "12 Example Road",
    city: "Wuse",
    state: "FCT",
    postalCode: "900001",
  },
  {
    streetAddress: "25 Sample Street",
    city: "Garki",
    state: "FCT",
    postalCode: "900002",
  },
  {
    streetAddress: "8 Demo Avenue",
    city: "Maitama",
    state: "FCT",
    postalCode: "900271",
  },
];

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loanType, setLoanType] = useState<LoanType | null>(null);

  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(
    initialPersonalDetails,
  );

  const [addressDetails, setAddressDetails] = useState<AddressDetails>(
    initialAddressDetails,
  );

  const [financialDetails, setFinancialDetails] = useState<FinancialDetails>(
    initialFinancialDetails,
  );

  const [loanDetails, setLoanDetails] =
    useState<LoanDetails>(initialLoanDetails);

  const [identityDocument, setIdentityDocument] = useState<UploadedDocument>({
    ...initialUploadedDocument,
  });

  const [supportingDocument, setSupportingDocument] =
    useState<UploadedDocument>({ ...initialUploadedDocument });

  const [identityVerified, setIdentityVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [typedSignature, setTypedSignature] = useState("");
  const [reviewError, setReviewError] = useState("");

  const [eligibilityResult, setEligibilityResult] = useState<{
    eligible: boolean;
    monthlyInstallment: number;
    debtToIncomeRatio: number;
  } | null>(null);

  const [applicationReference, setApplicationReference] = useState("");

  const [errors, setErrors] = useState<
    Partial<Record<keyof PersonalDetails, string>>
  >({});

  const [addressErrors, setAddressErrors] = useState<
    Partial<Record<keyof AddressDetails, string>>
  >({});

  const [financialErrors, setFinancialErrors] = useState<
    Partial<Record<keyof FinancialDetails, string>>
  >({});

  const [loanErrors, setLoanErrors] = useState<
    Partial<Record<keyof LoanDetails, string>>
  >({});

  const [showSuggestions, setShowSuggestions] = useState(false);

  const totalSteps = 8;

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500";

  function updatePersonalDetails(field: keyof PersonalDetails, value: string) {
    setPersonalDetails((previous) => ({
      ...previous,
      [field]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  }

  function validatePersonalDetails() {
    const newErrors: Partial<Record<keyof PersonalDetails, string>> = {};

    if (!personalDetails.firstName.trim()) {
      newErrors.firstName = "First name is required.";
    }

    if (!personalDetails.lastName.trim()) {
      newErrors.lastName = "Last name is required.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(personalDetails.email.trim())) {
      newErrors.email = "Enter a valid email address.";
    }

    if (!/^\+?[0-9\s()-]{7,20}$/.test(personalDetails.phone.trim())) {
      newErrors.phone = "Enter a valid phone number.";
    }

    if (!personalDetails.dateOfBirth) {
      newErrors.dateOfBirth = "Date of birth is required.";
    } else {
      const birthDate = new Date(`${personalDetails.dateOfBirth}T00:00:00`);

      const today = new Date();
      today.setHours(23, 59, 59, 999);

      if (
        Number.isNaN(birthDate.getTime()) ||
        birthDate > today ||
        birthDate.getFullYear() < 1900
      ) {
        newErrors.dateOfBirth = "Enter a valid date of birth.";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function updateAddress(field: keyof AddressDetails, value: string) {
    setAddressDetails((previous) => ({
      ...previous,
      [field]: value,
    }));

    setAddressErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  }

  function selectAddress(suggestion: AddressDetails) {
    setAddressDetails(suggestion);
    setAddressErrors({});
    setShowSuggestions(false);
  }

  function validateAddress() {
    const newErrors: Partial<Record<keyof AddressDetails, string>> = {};

    if (!addressDetails.streetAddress.trim()) {
      newErrors.streetAddress = "Street address is required.";
    }

    if (!addressDetails.city.trim()) {
      newErrors.city = "City is required.";
    }

    if (!addressDetails.state) {
      newErrors.state = "Please select a state or the FCT.";
    }

    if (
      addressDetails.postalCode.trim() &&
      !/^[a-zA-Z0-9 -]{3,10}$/.test(addressDetails.postalCode.trim())
    ) {
      newErrors.postalCode = "Enter a valid postal code.";
    }

    setAddressErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function updateFinancialDetails(
    field: keyof FinancialDetails,
    value: string,
  ) {
    setFinancialDetails((previous) => ({
      ...previous,
      [field]: value,
    }));

    setFinancialErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  }

  function validateFinancialDetails() {
    const newErrors: Partial<Record<keyof FinancialDetails, string>> = {};

    if (!financialDetails.employmentStatus) {
      newErrors.employmentStatus = "Select your employment status.";
    }

    if (!financialDetails.occupation.trim()) {
      newErrors.occupation = "Enter your occupation.";
    }

    if (
      financialDetails.employmentStatus === "employed" &&
      !financialDetails.employerName.trim()
    ) {
      newErrors.employerName = "Enter your employer's name.";
    }

    if (
      financialDetails.employmentStatus === "self-employed" &&
      !financialDetails.businessName.trim()
    ) {
      newErrors.businessName = "Enter your business name.";
    }

    const income = Number(financialDetails.monthlyIncome);

    if (
      !financialDetails.monthlyIncome.trim() ||
      !Number.isFinite(income) ||
      income <= 0
    ) {
      newErrors.monthlyIncome =
        "Enter a valid monthly income greater than zero.";
    }

    const debtPayments = Number(financialDetails.monthlyDebtPayments);

    if (
      !financialDetails.monthlyDebtPayments.trim() ||
      !Number.isFinite(debtPayments) ||
      debtPayments < 0
    ) {
      newErrors.monthlyDebtPayments =
        "Enter monthly debt payments, or 0 if there are none.";
    }

    if (loanType === "business") {
      const years = Number(financialDetails.yearsInBusiness);

      if (
        !financialDetails.yearsInBusiness.trim() ||
        !Number.isFinite(years) ||
        years < 0
      ) {
        newErrors.yearsInBusiness =
          "Enter the number of years in business (0 or more).";
      }
    }

    setFinancialErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function updateLoanDetails(field: keyof LoanDetails, value: string) {
    setLoanDetails((previous) => ({
      ...previous,
      [field]: value,
    }));

    setLoanErrors((previous) => ({
      ...previous,
      [field]: "",
    }));
  }

  function validateLoanDetails() {
    const newErrors: Partial<Record<keyof LoanDetails, string>> = {};

    const amount = Number(loanDetails.amount);
    const repaymentMonths = Number(loanDetails.repaymentMonths);

    if (
      !loanDetails.amount.trim() ||
      !Number.isFinite(amount) ||
      amount < 50000 ||
      amount > 50000000
    ) {
      newErrors.amount = "Enter an amount between ₦50,000 and ₦50,000,000.";
    }

    if (!loanDetails.purpose) {
      newErrors.purpose = "Select a purpose for this loan.";
    }

    if (
      !loanDetails.repaymentMonths.trim() ||
      !Number.isInteger(repaymentMonths) ||
      repaymentMonths < 3 ||
      repaymentMonths > 60
    ) {
      newErrors.repaymentMonths =
        "Choose a repayment period between 3 and 60 months.";
    }

    setLoanErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  // Illustrative estimate using a fixed 18% nominal annual rate.
  function getEstimatedMonthlyRepayment() {
    const principal = Number(loanDetails.amount);
    const months = Number(loanDetails.repaymentMonths);
    const monthlyRate = 0.18 / 12;

    if (
      !loanDetails.amount.trim() ||
      !Number.isFinite(principal) ||
      principal <= 0 ||
      !Number.isInteger(months) ||
      months <= 0
    ) {
      return null;
    }

    const payment =
      (principal * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

    return Number.isFinite(payment) ? payment : null;
  }

  const estimatedMonthlyRepayment = getEstimatedMonthlyRepayment();

  const nairaFormatter = new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  });

  function handleDocumentUpload(
    event: React.ChangeEvent<HTMLInputElement>,
    documentType: "identity" | "supporting",
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    const maxSize = 5 * 1024 * 1024;

    let error = "";

    if (!allowedTypes.includes(file.type)) {
      error = "Upload a PDF, JPG, PNG or WEBP file.";
    } else if (file.size > maxSize) {
      error = "File size must not exceed 5MB.";
    }

    const documentData: UploadedDocument = {
      file: error ? null : file,
      previewUrl:
        !error && file.type.startsWith("image/")
          ? URL.createObjectURL(file)
          : "",
      error,
      compressed: false,
    };

    if (documentType === "identity") {
      setIdentityDocument(documentData);
      setIdentityVerified(false);
      setVerificationMessage("");
    } else {
      setSupportingDocument(documentData);
    }

    event.target.value = "";
  }

  function verifyIdentityDocument() {
    if (!identityDocument.file) {
      setVerificationMessage("Upload an identity document first.");
      return;
    }

    // Demo simulation only. No real identity verification takes place.
    setIdentityVerified(true);
    setVerificationMessage(
      "Demo verification successful. This is a simulated result only.",
    );
  }

  function validateDocumentStep() {
    if (!identityDocument.file) {
      setIdentityDocument((previous) => ({
        ...previous,
        error: "Please upload an identity document.",
      }));
      return false;
    }

    if (!identityVerified) {
      setVerificationMessage(
        "Please complete the simulated identity verification.",
      );
      return false;
    }

    return true;
  }

  function validateReviewStep() {
    if (!consentConfirmed) {
      setReviewError(
        "Please confirm that your application details are correct.",
      );
      return false;
    }

    const applicantName =
      `${personalDetails.firstName} ${personalDetails.lastName}`.trim();

    const normalizeName = (name: string) =>
      name.trim().replace(/\s+/g, " ").toLowerCase();

    if (
      !normalizeName(typedSignature) ||
      normalizeName(typedSignature) !== normalizeName(applicantName)
    ) {
      setReviewError("Please type your full name as your demo signature.");
      return false;
    }

    setReviewError("");
    return true;
  }

  function calculateEligibility() {
    const monthlyIncome = Number(financialDetails.monthlyIncome) || 0;
    const monthlyDebt = Number(financialDetails.monthlyDebtPayments) || 0;

    // Use the same estimated repayment shown in Step 5.
    const monthlyInstallment = estimatedMonthlyRepayment ?? 0;

    const debtToIncomeRatio =
      monthlyIncome > 0
        ? ((monthlyDebt + monthlyInstallment) / monthlyIncome) * 100
        : 100;

    setEligibilityResult({
      eligible: monthlyIncome > 0 && debtToIncomeRatio <= 40,
      monthlyInstallment,
      debtToIncomeRatio,
    });

    setApplicationReference(`LF-${Date.now().toString().slice(-8)}`);
  }

  function handleNext() {
    if (currentStep === 1 && !loanType) {
      alert("Please select a loan type.");
      return;
    }

    if (currentStep === 2 && !validatePersonalDetails()) return;
    if (currentStep === 3 && !validateAddress()) return;
    if (currentStep === 4 && !validateFinancialDetails()) return;
    if (currentStep === 5 && !validateLoanDetails()) return;
    if (currentStep === 6 && !validateDocumentStep()) return;

    if (currentStep === 7) {
      if (!validateReviewStep()) return;
      calculateEligibility();
    }

    if (currentStep < totalSteps) {
      setCurrentStep((step) => step + 1);
    }
  }

  function handleBack() {
    if (currentStep > 1 && currentStep < 8) {
      setCurrentStep((step) => step - 1);
    }
  }

  function renderPersonalField(
    field: keyof PersonalDetails,
    label: string,
    type = "text",
  ) {
    return (
      <div>
        <label htmlFor={field} className="text-sm font-medium text-slate-200">
          {label}
        </label>

        <input
          id={field}
          name={field}
          type={type}
          value={personalDetails[field]}
          onChange={(event) => updatePersonalDetails(field, event.target.value)}
          className={inputClass}
          aria-invalid={Boolean(errors[field])}
          aria-describedby={errors[field] ? `${field}-error` : undefined}
          required
        />

        {errors[field] && (
          <p id={`${field}-error`} className="mt-1 text-sm text-red-400">
            {errors[field]}
          </p>
        )}
      </div>
    );
  }

  const matchingSuggestions = addressSuggestions.filter((suggestion) =>
    suggestion.streetAddress
      .toLowerCase()
      .includes(addressDetails.streetAddress.trim().toLowerCase()),
  );

  function renderDocumentCard(
    title: string,
    description: string,
    document: UploadedDocument,
    documentType: "identity" | "supporting",
    required = false,
  ) {
    return (
      <div className="rounded-xl border border-slate-700 p-5">
        <div>
          <h3 className="font-semibold text-white">{title}</h3>
          <p className="mt-1 text-sm text-slate-400">{description}</p>
        </div>

        <label
          htmlFor={`${documentType}-document`}
          className="mt-4 block cursor-pointer rounded-lg border border-dashed border-slate-600 p-5 text-center transition hover:border-blue-500"
        >
          <span className="block text-sm font-medium text-blue-400">
            Choose a file
          </span>
          <span className="mt-1 block text-xs text-slate-500">
            PDF, JPG, PNG or WEBP · Maximum 5MB
          </span>

          <input
            id={`${documentType}-document`}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp"
            className="sr-only"
            onChange={(event) => handleDocumentUpload(event, documentType)}
          />
        </label>

        {document.file && (
          <div className="mt-4 rounded-lg bg-slate-950 p-3">
            <p className="break-all text-sm font-medium text-slate-200">
              {document.file.name}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {(document.file.size / 1024 / 1024).toFixed(2)} MB
            </p>

            {document.previewUrl && (
              <img
                src={document.previewUrl}
                alt={`${title} preview`}
                className="mt-3 max-h-48 rounded-lg object-contain"
              />
            )}
          </div>
        )}

        {document.error && (
          <p className="mt-2 text-sm text-red-400">{document.error}</p>
        )}

        {!required && (
          <p className="mt-2 text-xs text-slate-500">Optional document.</p>
        )}
      </div>
    );
  }

  function renderReviewRow(label: string, value: string) {
    return (
      <div className="flex flex-col gap-1 border-b border-slate-800 py-3 sm:flex-row sm:justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <span className="break-words text-sm font-medium text-white sm:text-right">
          {value}
        </span>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-2xl">
        <a href="/" className="text-sm text-blue-400 hover:text-blue-300">
          ← Back to LoanFlow
        </a>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <p className="text-sm font-medium text-blue-400">
            STEP {currentStep} OF {totalSteps}
          </p>

          <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-800">
            <div
              className="h-full rounded-full bg-blue-500 transition-all"
              style={{
                width: `${(currentStep / totalSteps) * 100}%`,
              }}
            />
          </div>

          <h1 className="mt-8 text-2xl font-bold sm:text-3xl">
            {currentStep === 1
              ? "What type of loan do you need?"
              : currentStep === 2
                ? "Tell us about yourself"
                : currentStep === 3
                  ? "Where do you live?"
                  : currentStep === 4
                    ? "Employment and financial details"
                    : currentStep === 5
                      ? "Tell us about the loan you need"
                      : currentStep === 6
                        ? "Identity documents"
                        : currentStep === 7
                          ? "Review your application"
                          : "Your application result"}
          </h1>

          <p className="mt-3 leading-7 text-slate-400">
            {currentStep === 1
              ? "Choose a loan category to begin your application."
              : currentStep === 2
                ? "Enter your basic details before continuing."
                : currentStep === 3
                  ? "Enter your address. Suggestions below are sample data."
                  : currentStep === 4
                    ? "Tell us about your work and monthly finances."
                    : currentStep === 5
                      ? "Choose a purpose, enter the amount, and select a repayment period."
                      : currentStep === 6
                        ? "Upload an identity document to complete this demo step."
                        : currentStep === 7
                          ? "Check your information before completing the application."
                          : "Your demo eligibility result is ready."}
          </p>

          {/* STEP 1: LOAN TYPE */}
          {currentStep === 1 && (
            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {(
                [
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
                ] as const
              ).map((loan) => (
                <button
                  key={loan.value}
                  type="button"
                  onClick={() => setLoanType(loan.value)}
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
          )}

          {/* STEP 2: PERSONAL DETAILS */}
          {currentStep === 2 && (
            <PersonalDetailsStep
              personalDetails={personalDetails}
              errors={errors}
              inputClass={inputClass}
              onChange={updatePersonalDetails}
            />
          )}

          {/* STEP 3: ADDRESS DETAILS */}
          {currentStep === 3 && (
            <div className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="streetAddress"
                  className="text-sm font-medium text-slate-200"
                >
                  Street address
                </label>

                <input
                  id="streetAddress"
                  value={addressDetails.streetAddress}
                  onChange={(event) => {
                    updateAddress("streetAddress", event.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  autoComplete="street-address"
                  placeholder="Enter a street address"
                  className={inputClass}
                  aria-invalid={Boolean(addressErrors.streetAddress)}
                />

                {addressErrors.streetAddress && (
                  <p className="mt-1 text-sm text-red-400">
                    {addressErrors.streetAddress}
                  </p>
                )}

                {showSuggestions &&
                  addressDetails.streetAddress.trim().length > 0 && (
                    <div className="mt-2 overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
                      {matchingSuggestions.map((suggestion) => (
                        <button
                          key={suggestion.streetAddress}
                          type="button"
                          onClick={() => selectAddress(suggestion)}
                          className="block w-full border-b border-slate-800 px-4 py-3 text-left text-sm last:border-b-0 hover:bg-slate-800"
                        >
                          <span className="block font-medium">
                            {suggestion.streetAddress}
                          </span>
                          <span className="mt-1 block text-slate-400">
                            {suggestion.city}, {suggestion.state}
                          </span>
                        </button>
                      ))}

                      {matchingSuggestions.length === 0 && (
                        <p className="px-4 py-3 text-sm text-slate-400">
                          No demo suggestions. You can enter your address
                          manually.
                        </p>
                      )}
                    </div>
                  )}

                <p className="mt-1 text-xs text-slate-500">
                  Demo suggestions only; you can type an address manually.
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="city"
                    className="text-sm font-medium text-slate-200"
                  >
                    City
                  </label>

                  <input
                    id="city"
                    value={addressDetails.city}
                    onChange={(event) =>
                      updateAddress("city", event.target.value)
                    }
                    placeholder="e.g. Abuja"
                    className={inputClass}
                    aria-invalid={Boolean(addressErrors.city)}
                  />

                  {addressErrors.city && (
                    <p className="mt-1 text-sm text-red-400">
                      {addressErrors.city}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="state"
                    className="text-sm font-medium text-slate-200"
                  >
                    State / FCT
                  </label>

                  <select
                    id="state"
                    value={addressDetails.state}
                    onChange={(event) =>
                      updateAddress("state", event.target.value)
                    }
                    className={inputClass}
                    aria-invalid={Boolean(addressErrors.state)}
                  >
                    <option value="">Select state</option>
                    {nigerianStates.map((state) => (
                      <option key={state} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>

                  {addressErrors.state && (
                    <p className="mt-1 text-sm text-red-400">
                      {addressErrors.state}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="postalCode"
                  className="text-sm font-medium text-slate-200"
                >
                  Postal code (optional)
                </label>

                <input
                  id="postalCode"
                  value={addressDetails.postalCode}
                  onChange={(event) =>
                    updateAddress("postalCode", event.target.value)
                  }
                  placeholder="Enter postal code"
                  className={inputClass}
                  aria-invalid={Boolean(addressErrors.postalCode)}
                />

                {addressErrors.postalCode && (
                  <p className="mt-1 text-sm text-red-400">
                    {addressErrors.postalCode}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* STEP 4: FINANCIAL DETAILS */}
          {currentStep === 4 && (
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
                  onChange={(event) =>
                    updateFinancialDetails(
                      "employmentStatus",
                      event.target.value,
                    )
                  }
                  className={inputClass}
                  aria-invalid={Boolean(financialErrors.employmentStatus)}
                >
                  <option value="">Select employment status</option>
                  <option value="employed">Employed</option>
                  <option value="self-employed">Self-employed</option>
                  <option value="unemployed">Unemployed</option>
                </select>

                {financialErrors.employmentStatus && (
                  <p className="mt-1 text-sm text-red-400">
                    {financialErrors.employmentStatus}
                  </p>
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
                  onChange={(event) =>
                    updateFinancialDetails("occupation", event.target.value)
                  }
                  placeholder="e.g. Software developer"
                  className={inputClass}
                  aria-invalid={Boolean(financialErrors.occupation)}
                />

                {financialErrors.occupation && (
                  <p className="mt-1 text-sm text-red-400">
                    {financialErrors.occupation}
                  </p>
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
                    onChange={(event) =>
                      updateFinancialDetails("employerName", event.target.value)
                    }
                    placeholder="Enter employer name"
                    className={inputClass}
                    aria-invalid={Boolean(financialErrors.employerName)}
                  />

                  {financialErrors.employerName && (
                    <p className="mt-1 text-sm text-red-400">
                      {financialErrors.employerName}
                    </p>
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
                    onChange={(event) =>
                      updateFinancialDetails("businessName", event.target.value)
                    }
                    placeholder="Enter business name"
                    className={inputClass}
                    aria-invalid={Boolean(financialErrors.businessName)}
                  />

                  {financialErrors.businessName && (
                    <p className="mt-1 text-sm text-red-400">
                      {financialErrors.businessName}
                    </p>
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
                      updateFinancialDetails(
                        "yearsInBusiness",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. 3"
                    className={inputClass}
                    aria-invalid={Boolean(financialErrors.yearsInBusiness)}
                  />

                  {financialErrors.yearsInBusiness && (
                    <p className="mt-1 text-sm text-red-400">
                      {financialErrors.yearsInBusiness}
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
                    onChange={(event) =>
                      updateFinancialDetails(
                        "monthlyIncome",
                        event.target.value,
                      )
                    }
                    placeholder="e.g. 250000"
                    className={inputClass}
                    aria-invalid={Boolean(financialErrors.monthlyIncome)}
                  />

                  {financialErrors.monthlyIncome && (
                    <p className="mt-1 text-sm text-red-400">
                      {financialErrors.monthlyIncome}
                    </p>
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
                      updateFinancialDetails(
                        "monthlyDebtPayments",
                        event.target.value,
                      )
                    }
                    placeholder="Enter 0 if none"
                    className={inputClass}
                    aria-invalid={Boolean(financialErrors.monthlyDebtPayments)}
                  />

                  {financialErrors.monthlyDebtPayments && (
                    <p className="mt-1 text-sm text-red-400">
                      {financialErrors.monthlyDebtPayments}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-xs leading-5 text-slate-500">
                Portfolio demo only. Use fictional figures while testing. These
                fields do not determine real loan eligibility.
              </p>
            </div>
          )}

          {/* STEP 5: LOAN DETAILS */}
          {currentStep === 5 && (
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
                  onChange={(event) =>
                    updateLoanDetails("purpose", event.target.value)
                  }
                  className={inputClass}
                  aria-invalid={Boolean(loanErrors.purpose)}
                >
                  <option value="">Select a purpose</option>
                  {(loanType ? loanPurposes[loanType] : []).map((purpose) => (
                    <option key={purpose} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>

                {loanErrors.purpose && (
                  <p className="mt-1 text-sm text-red-400">
                    {loanErrors.purpose}
                  </p>
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
                  onChange={(event) =>
                    updateLoanDetails("amount", event.target.value)
                  }
                  placeholder="e.g. 500000"
                  className={inputClass}
                  aria-invalid={Boolean(loanErrors.amount)}
                />

                {loanErrors.amount && (
                  <p className="mt-1 text-sm text-red-400">
                    {loanErrors.amount}
                  </p>
                )}

                <p className="mt-1 text-xs text-slate-500">
                  For this portfolio demo, choose between ₦50,000 and
                  ₦50,000,000.
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
                  onChange={(event) =>
                    updateLoanDetails("repaymentMonths", event.target.value)
                  }
                  className={inputClass}
                  aria-invalid={Boolean(loanErrors.repaymentMonths)}
                >
                  <option value="3">3 months</option>
                  <option value="6">6 months</option>
                  <option value="9">9 months</option>
                  <option value="12">12 months</option>
                  <option value="18">18 months</option>
                  <option value="24">24 months</option>
                  <option value="36">36 months</option>
                  <option value="48">48 months</option>
                  <option value="60">60 months</option>
                </select>

                {loanErrors.repaymentMonths && (
                  <p className="mt-1 text-sm text-red-400">
                    {loanErrors.repaymentMonths}
                  </p>
                )}
              </div>

              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5">
                <p className="text-sm font-medium text-blue-300">
                  Estimated monthly repayment
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {estimatedMonthlyRepayment === null
                    ? "Enter a loan amount"
                    : nairaFormatter.format(estimatedMonthlyRepayment)}
                </p>

                <p className="mt-3 text-xs leading-5 text-slate-400">
                  Illustration only, calculated using a sample fixed annual rate
                  of 18%. This is not a lender quote. Actual rates, fees,
                  eligibility, and repayment amounts may differ.
                </p>
              </div>

              <p className="text-xs leading-5 text-slate-500">
                Use fictional figures while testing. LoanFlow does not submit a
                real loan request or provide an actual approval.
              </p>
            </div>
          )}

          {/* STEP 6: DOCUMENT UPLOAD */}
          {currentStep === 6 && (
            <div className="mt-8 space-y-5">
              {renderDocumentCard(
                "Identity document",
                "Upload a sample identity document for this demo.",
                identityDocument,
                "identity",
                true,
              )}

              {renderDocumentCard(
                "Supporting document",
                "You can optionally upload an additional supporting document.",
                supportingDocument,
                "supporting",
              )}

              <div className="rounded-xl border border-slate-700 p-5">
                <h3 className="font-semibold">Identity verification</h3>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  This button simulates a successful verification response. It
                  does not connect to an identity verification provider.
                </p>

                <button
                  type="button"
                  onClick={verifyIdentityDocument}
                  disabled={!identityDocument.file}
                  className="mt-4 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Verify identity document
                </button>

                {verificationMessage && (
                  <p
                    className={`mt-3 text-sm ${
                      identityVerified ? "text-green-400" : "text-amber-400"
                    }`}
                  >
                    {verificationMessage}
                  </p>
                )}

                {identityVerified && (
                  <p className="mt-3 text-sm text-green-400">
                    Demo identity status: Verified
                  </p>
                )}
              </div>

              <p className="text-xs leading-5 text-slate-500">
                Do not upload real identity documents. Use sample files only
                when testing this portfolio project.
              </p>
            </div>
          )}

          {/* STEP 7: REVIEW AND CONSENT */}
          {currentStep === 7 && (
            <div className="mt-8 space-y-6">
              <section className="rounded-xl border border-slate-700 p-5">
                <h2 className="font-semibold">Loan information</h2>

                {renderReviewRow(
                  "Loan type",
                  `${loanType ?? "Not selected"} loan`,
                )}

                {renderReviewRow(
                  "Loan purpose",
                  loanDetails.purpose || "Not selected",
                )}

                {renderReviewRow(
                  "Requested amount",
                  nairaFormatter.format(Number(loanDetails.amount)),
                )}

                {renderReviewRow(
                  "Repayment period",
                  `${loanDetails.repaymentMonths} months`,
                )}

                {renderReviewRow(
                  "Estimated monthly repayment",
                  estimatedMonthlyRepayment === null
                    ? "Not available"
                    : nairaFormatter.format(estimatedMonthlyRepayment),
                )}
              </section>

              <section className="rounded-xl border border-slate-700 p-5">
                <h2 className="font-semibold">Personal information</h2>

                {renderReviewRow(
                  "Applicant",
                  `${personalDetails.firstName} ${personalDetails.lastName}`,
                )}

                {renderReviewRow("Email", personalDetails.email)}
                {renderReviewRow("Phone", personalDetails.phone)}

                {renderReviewRow("Date of birth", personalDetails.dateOfBirth)}

                {renderReviewRow(
                  "Address",
                  `${addressDetails.streetAddress}, ${addressDetails.city}, ${addressDetails.state}`,
                )}

                {renderReviewRow(
                  "Postal code",
                  addressDetails.postalCode || "Not provided",
                )}
              </section>

              <section className="rounded-xl border border-slate-700 p-5">
                <h2 className="font-semibold">Financial information</h2>

                {renderReviewRow(
                  "Employment status",
                  financialDetails.employmentStatus,
                )}

                {renderReviewRow("Occupation", financialDetails.occupation)}

                {financialDetails.employerName &&
                  renderReviewRow("Employer", financialDetails.employerName)}

                {financialDetails.businessName &&
                  renderReviewRow(
                    "Business name",
                    financialDetails.businessName,
                  )}

                {loanType === "business" &&
                  renderReviewRow(
                    "Years in business",
                    financialDetails.yearsInBusiness,
                  )}

                {renderReviewRow(
                  "Monthly income",
                  nairaFormatter.format(Number(financialDetails.monthlyIncome)),
                )}

                {renderReviewRow(
                  "Existing monthly debt",
                  nairaFormatter.format(
                    Number(financialDetails.monthlyDebtPayments),
                  ),
                )}
              </section>

              <section className="rounded-xl border border-slate-700 p-5">
                <h2 className="font-semibold">Documents</h2>

                {renderReviewRow(
                  "Identity document",
                  identityDocument.file?.name || "Not uploaded",
                )}

                {renderReviewRow(
                  "Identity verification",
                  identityVerified ? "Demo verified" : "Not verified",
                )}

                {renderReviewRow(
                  "Supporting document",
                  supportingDocument.file?.name || "Not provided",
                )}
              </section>

              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-5">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    checked={consentConfirmed}
                    onChange={(event) => {
                      setConsentConfirmed(event.target.checked);
                      setReviewError("");
                    }}
                    className="mt-1 h-4 w-4 accent-blue-500"
                  />

                  <span className="text-sm leading-6 text-slate-200">
                    I confirm that I have reviewed the information entered above
                    and understand that this is a portfolio demo, not a real
                    loan application.
                  </span>
                </label>
              </div>

              <div>
                <label
                  htmlFor="typedSignature"
                  className="text-sm font-medium text-slate-200"
                >
                  Type your full name as your demo signature
                </label>

                <input
                  id="typedSignature"
                  type="text"
                  value={typedSignature}
                  onChange={(event) => {
                    setTypedSignature(event.target.value);
                    setReviewError("");
                  }}
                  placeholder="Enter your first and last name"
                  className={inputClass}
                />

                <p className="mt-2 text-xs text-slate-500">
                  Your signature must match the applicant name entered in Step
                  2.
                </p>
              </div>

              {reviewError && (
                <p className="text-sm text-red-400">{reviewError}</p>
              )}
            </div>
          )}

          {/* STEP 8: ELIGIBILITY RESULT */}

          {currentStep === 8 && (
            <div className="mt-8 space-y-6">
              <div className="rounded-xl border border-slate-800 p-6 text-center">
                <h2 className="text-2xl font-bold text-white">
                  Application Completed!
                </h2>

                <p className="mt-2 text-slate-400">
                  Your demo loan application process is complete.
                </p>

                <p className="mt-6 text-sm text-slate-400">
                  Application Reference
                </p>

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
                      {nairaFormatter.format(
                        eligibilityResult.monthlyInstallment,
                      )}
                    </p>

                    <p className="mt-4 text-sm text-slate-400">
                      Debt-to-income ratio
                    </p>

                    <p className="mt-1 font-semibold text-white">
                      {eligibilityResult.debtToIncomeRatio.toFixed(2)}%
                    </p>
                  </>
                ) : (
                  <p className="mt-4 text-red-400">
                    Eligibility result is unavailable. Please check the Finish
                    button logic.
                  </p>
                )}
              </div>

              <p className="text-sm text-slate-500">
                This is a frontend demonstration. No real loan application has
                been submitted or approved.
              </p>

              <button
                type="button"
                onClick={() => (window.location.href = "/")}
                className="w-full rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
              >
                Return to Home
              </button>
            </div>
          )}

          {/* NAVIGATION */}
          <div className="mt-10 flex justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1 || currentStep === 8}
              className="rounded-lg border border-slate-700 px-5 py-3 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={handleNext}
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
              >
                {currentStep === 7 ? "Finish" : "Continue"}
              </button>
            ) : (
              <a
                href="/"
                className="rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
              >
                Back to home
              </a>
            )}
          </div>
        </div>

        <p className="mt-5 text-center text-xs leading-5 text-slate-500">
          LoanFlow is a portfolio demo. Do not enter real financial or identity
          information.
        </p>
      </div>
    </main>
  );
}
