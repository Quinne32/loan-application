"use client";

import ProgressIndicator from "@/Components/loanApp/ProgressIndicator";
import LoanTypeStep from "@/Components/loanApp/LoanTypeStep";
import PersonalDetailsStep from "@/Components/loanApp/PersonalDetailsStep";
import AddressDetailsStep from "@/Components/loanApp/AddressDetailsStep";
import FinancialDetailsStep from "@/Components/loanApp/FinancialDetailsStep";
import LoanDetailsStep from "@/Components/loanApp/LoanDetailsStep";
import DocumentUploadStep from "@/Components/loanApp/DocumentUploadStep";
import ReviewStep from "@/Components/loanApp/ReviewStep";
import CompletionStep from "@/Components/loanApp/CompletionStep";
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

const DRAFT_STORAGE_KEY = "loanflow-application-draft";

type LoanApplicationDraft = {
  currentStep: number;
  loanType: LoanType | null;
  personalDetails: PersonalDetails;
  addressDetails: AddressDetails;
  financialDetails: FinancialDetails;
  loanDetails: LoanDetails;
  consentConfirmed: boolean;
  typedSignature: string;
  eligibilityResult: {
    eligible: boolean;
    monthlyInstallment: number;
    debtToIncomeRatio: number;
  } | null;
  applicationReference: string;
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

// const nigerianStates = [
//   "Abia",
//   "Adamawa",
//   "Akwa Ibom",
//   "Anambra",
//   "Bauchi",
//   "Bayelsa",
//   "Benue",
//   "Borno",
//   "Cross River",
//   "Delta",
//   "Ebonyi",
//   "Edo",
//   "Ekiti",
//   "Enugu",
//   "Gombe",
//   "Imo",
//   "Jigawa",
//   "Kaduna",
//   "Kano",
//   "Katsina",
//   "Kebbi",
//   "Kogi",
//   "Kwara",
//   "Lagos",
//   "Nasarawa",
//   "Niger",
//   "Ogun",
//   "Ondo",
//   "Osun",
//   "Oyo",
//   "Plateau",
//   "Rivers",
//   "Sokoto",
//   "Taraba",
//   "Yobe",
//   "Zamfara",
//   "FCT",
// ];

// const addressSuggestions: AddressDetails[] = [
//   {
//     streetAddress: "12 Example Road",
//     city: "Wuse",
//     state: "FCT",
//     postalCode: "900001",
//   },
//   {
//     streetAddress: "25 Sample Street",
//     city: "Garki",
//     state: "FCT",
//     postalCode: "900002",
//   },
//   {
//     streetAddress: "8 Demo Avenue",
//     city: "Maitama",
//     state: "FCT",
//     postalCode: "900271",
//   },
// ];

export default function ApplyPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loanType, setLoanType] = useState<LoanType | null>(null);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>(
    initialPersonalDetails,
  );
  const [consentConfirmed, setConsentConfirmed] = useState(false);
  const [typedSignature, setTypedSignature] = useState("");
  const [reviewError, setReviewError] = useState("");
  const [addressDetails, setAddressDetails] = useState<AddressDetails>(
    initialAddressDetails,
  );
  const [eligibilityResult, setEligibilityResult] = useState<{
    eligible: boolean;
    monthlyInstallment: number;
    debtToIncomeRatio: number;
  } | null>(null);

  const [applicationReference, setApplicationReference] = useState("");
  const [financialDetails, setFinancialDetails] = useState<FinancialDetails>(
    initialFinancialDetails,
  );
  const [loanDetails, setLoanDetails] =
    useState<LoanDetails>(initialLoanDetails);

  const [identityDocument, setIdentityDocument] = useState<UploadedDocument>({
    ...initialUploadedDocument,
  });

  const [supportingDocument, setSupportingDocument] =
    useState<UploadedDocument>({
      ...initialUploadedDocument,
    });

  const [identityVerified, setIdentityVerified] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

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
  const [draftLoaded, setDraftLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);

      if (savedDraft) {
        const draft: LoanApplicationDraft = JSON.parse(savedDraft);

        setCurrentStep(draft.currentStep === 7 ? 6 : draft.currentStep);

        setLoanType(draft.loanType);
        setPersonalDetails(draft.personalDetails);
        setAddressDetails(draft.addressDetails);
        setFinancialDetails(draft.financialDetails);
        setLoanDetails(draft.loanDetails);
        setConsentConfirmed(draft.consentConfirmed);
        setTypedSignature(draft.typedSignature);
        setEligibilityResult(draft.eligibilityResult);
        setApplicationReference(draft.applicationReference);

        // Files cannot be restored from localStorage.
        setIdentityDocument({ ...initialUploadedDocument });
        setSupportingDocument({ ...initialUploadedDocument });
        setIdentityVerified(false);
        setVerificationMessage("");
      }
    } catch (error) {
      console.error("Unable to restore LoanFlow draft:", error);
    } finally {
      setDraftLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!draftLoaded) return;

    const draft: LoanApplicationDraft = {
      currentStep,
      loanType,
      personalDetails,
      addressDetails,
      financialDetails,
      loanDetails,
      consentConfirmed,
      typedSignature,
      eligibilityResult,
      applicationReference,
    };

    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(draft));
    } catch (error) {
      console.error("Unable to save LoanFlow draft:", error);
    }
  }, [
    draftLoaded,
    currentStep,
    loanType,
    personalDetails,
    addressDetails,
    financialDetails,
    loanDetails,
    consentConfirmed,
    typedSignature,
    eligibilityResult,
    applicationReference,
  ]);

  const totalSteps = 8;

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none focus:border-blue-500";

  function updatePersonalDetails(field: keyof PersonalDetails, value: string) {
    setPersonalDetails((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: "" }));
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
    setAddressDetails((previous) => ({ ...previous, [field]: value }));
    setAddressErrors((previous) => ({ ...previous, [field]: "" }));
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
    setFinancialDetails((previous) => ({ ...previous, [field]: value }));
    setFinancialErrors((previous) => ({ ...previous, [field]: "" }));
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
    setLoanDetails((previous) => ({ ...previous, [field]: value }));
    setLoanErrors((previous) => ({ ...previous, [field]: "" }));
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

  // Illustrative estimate only: fixed 18% nominal annual rate, monthly compounding.
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

  async function compressImage(file: File): Promise<File> {
    // PDFs are not images, so return them unchanged.
    if (!file.type.startsWith("image/")) {
      return file;
    }

    // Avoid processing formats the browser cannot decode.
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      return file;
    }

    try {
      const bitmap = await createImageBitmap(file);

      const maxDimension = 1600;
      const scale = Math.min(
        1,
        maxDimension / Math.max(bitmap.width, bitmap.height),
      );

      const canvas = document.createElement("canvas");
      canvas.width = Math.round(bitmap.width * scale);
      canvas.height = Math.round(bitmap.height * scale);

      const context = canvas.getContext("2d");

      if (!context) {
        bitmap.close();
        return file;
      }

      context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
      bitmap.close();

      const blob = await new Promise<Blob | null>((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.8);
      });

      if (!blob || blob.size >= file.size) {
        return file;
      }

      return new File([blob], file.name.replace(/\.[^.]+$/, "") + ".jpg", {
        type: "image/jpeg",
        lastModified: Date.now(),
      });
    } catch {
      // If compression is unsupported or fails, keep the original file.
      return file;
    }
  }

  async function handleDocumentUpload(
    file: File | undefined,
    documentType: "identity" | "supporting",
  ) {
    const setDocument =
      documentType === "identity" ? setIdentityDocument : setSupportingDocument;

    // Reset verification whenever a document changes.
    setIdentityVerified(false);
    setVerificationMessage("");

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setDocument({
        ...initialUploadedDocument,
        error: "Upload a PDF, JPG, PNG, or WebP file.",
      });
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      setDocument({
        ...initialUploadedDocument,
        error: "The original file must be 5 MB or smaller.",
      });
      return;
    }

    try {
      const processedFile = await compressImage(file);
      const previewUrl = URL.createObjectURL(processedFile);

      setDocument((previous) => {
        if (previous.previewUrl) {
          URL.revokeObjectURL(previous.previewUrl);
        }

        return {
          file: processedFile,
          previewUrl,
          error: "",
          compressed: processedFile.size < file.size,
        };
      });
    } catch {
      setDocument({
        ...initialUploadedDocument,
        error: "Unable to process this file. Please try another.",
      });
    }
  }

  function simulateIdentityVerification() {
    if (!identityDocument.file) {
      setVerificationMessage(
        "Upload an identity document before running verification.",
      );
      setIdentityVerified(false);
      return;
    }

    // Demo only: this does not verify identity or inspect document contents.
    setIdentityVerified(true);
    setVerificationMessage(
      "Demo verification passed. No real identity check was performed.",
    );
  }

  function validateDocuments() {
    let valid = true;

    if (!identityDocument.file) {
      setIdentityDocument((previous) => ({
        ...previous,
        error: "Please upload an identity document.",
      }));
      valid = false;
    }

    if (!supportingDocument.file) {
      setSupportingDocument((previous) => ({
        ...previous,
        error: "Please upload a supporting document.",
      }));
      valid = false;
    }

    if (!identityVerified) {
      setVerificationMessage(
        "Run the demo identity verification before continuing.",
      );
      valid = false;
    }

    return valid;
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
    if (currentStep === 6 && !validateDocuments()) return;

    if (currentStep === 7) {
      if (!consentConfirmed) {
        setReviewError(
          "Please confirm that your application details are correct.",
        );
        return;
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
        return;
      }

      setReviewError("");

      const monthlyIncome = Number(financialDetails.monthlyIncome) || 0;

      const monthlyDebt = Number(financialDetails.monthlyDebtPayments) || 0;

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

    if (currentStep < totalSteps) {
      setCurrentStep((step) => step + 1);
    }
  }

  function handleBack() {
    if (currentStep > 1) {
      setCurrentStep((step) => step - 1);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-10 text-white sm:px-6">
      <div className="mx-auto max-w-2xl">
        <a href="/" className="text-sm text-blue-400 hover:text-blue-300">
          ← Back to LoanFlow
        </a>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <ProgressIndicator
            currentStep={currentStep}
            totalSteps={totalSteps}
          />

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
                        ? "Upload your identity and supporting documents, then complete demo verification."
                        : currentStep === 7
                          ? "Review your application details, confirm your information, and provide your demo signature."
                          : currentStep === 8
                            ? "Check your demo eligibility result and application confirmation."
                            : `Application step ${currentStep}`}
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
                        ? "Upload your documents and complete the demo identity verification."
                        : currentStep === 7
                          ? "Review your application details and confirm your information."
                          : currentStep === 8
                            ? "View your demo eligibility result and application confirmation."
                            : ""}
          </p>
          {currentStep === 1 && (
            <LoanTypeStep loanType={loanType} onSelect={setLoanType} />
          )}
          {currentStep === 2 && (
            <PersonalDetailsStep
              personalDetails={personalDetails}
              errors={errors}
              inputClass={inputClass}
              onChange={updatePersonalDetails}
            />
          )}
          {currentStep === 3 && (
            <AddressDetailsStep
              addressDetails={addressDetails}
              errors={addressErrors}
              inputClass={inputClass}
              showSuggestions={showSuggestions}
              onChange={updateAddress}
              onSelectAddress={selectAddress}
              onShowSuggestions={() => setShowSuggestions(true)}
            />
          )}
          {currentStep === 4 && (
            <FinancialDetailsStep
              financialDetails={financialDetails}
              errors={financialErrors}
              loanType={loanType}
              inputClass={inputClass}
              onChange={updateFinancialDetails}
            />
          )}
          {currentStep === 5 && (
            <LoanDetailsStep
              loanDetails={loanDetails}
              errors={loanErrors}
              loanType={loanType}
              inputClass={inputClass}
              estimatedMonthlyRepaymentLabel={
                estimatedMonthlyRepayment === null
                  ? "Enter a loan amount"
                  : nairaFormatter.format(estimatedMonthlyRepayment)
              }
              onChange={updateLoanDetails}
            />
          )}
          {currentStep === 6 && (
            <DocumentUploadStep
              identityDocument={identityDocument}
              supportingDocument={supportingDocument}
              identityVerified={identityVerified}
              verificationMessage={verificationMessage}
              onUpload={handleDocumentUpload}
              onVerify={simulateIdentityVerification}
            />
          )}

          {currentStep === 7 && (
            <ReviewStep
              loanType={loanType}
              personalDetails={personalDetails}
              addressDetails={addressDetails}
              loanDetails={loanDetails}
              requestedAmountLabel={
                loanDetails.amount
                  ? nairaFormatter.format(Number(loanDetails.amount))
                  : "Not entered"
              }
              identityDocumentName={identityDocument.file?.name || ""}
              supportingDocumentName={supportingDocument.file?.name || ""}
              identityVerified={identityVerified}
              consentConfirmed={consentConfirmed}
              typedSignature={typedSignature}
              reviewError={reviewError}
              onConsentChange={(checked) => {
                setConsentConfirmed(checked);
                setReviewError("");
              }}
              onSignatureChange={(value) => {
                setTypedSignature(value);
                setReviewError("");
              }}
            />
          )}

          {/* STEP 8: ELIGIBILITY RESULT */}
          {currentStep === 8 && (
            <CompletionStep
              applicationReference={applicationReference}
              eligibilityResult={eligibilityResult}
              monthlyInstallmentLabel={
                eligibilityResult
                  ? nairaFormatter.format(eligibilityResult.monthlyInstallment)
                  : ""
              }
              onReturnHome={() => {
                localStorage.removeItem(DRAFT_STORAGE_KEY);
                window.location.href = "/";
              }}
            />
          )}

          <div className="mt-10 flex justify-between gap-4">
            <button
              type="button"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="rounded-lg border border-slate-700 px-5 py-3 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Back
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="rounded-lg bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500"
            >
              {currentStep === totalSteps ? "Finish" : "Continue"}
            </button>
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
