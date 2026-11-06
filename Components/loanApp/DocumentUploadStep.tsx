type UploadedDocument = {
  file: File | null;
  previewUrl: string;
  error: string;
  compressed: boolean;
};

type DocumentUploadStepProps = {
  identityDocument: UploadedDocument;
  supportingDocument: UploadedDocument;
  identityVerified: boolean;
  verificationMessage: string;
  onUpload: (file: File | undefined, type: "identity" | "supporting") => void;
  onVerify: () => void;
};

const fileAccept =
  ".pdf,.jpg,.jpeg,.png,.webp,application/pdf,image/jpeg,image/png,image/webp";

export default function DocumentUploadStep({
  identityDocument,
  supportingDocument,
  identityVerified,
  verificationMessage,
  onUpload,
  onVerify,
}: DocumentUploadStepProps) {
  function renderDocument(
    title: string,
    description: string,
    document: UploadedDocument,
    type: "identity" | "supporting",
    inputId: string,
    previewAlt: string,
  ) {
    return (
      <div>
        <h2 className="font-semibold text-white">{title}</h2>

        <p className="mt-1 text-sm text-slate-400">{description}</p>

        <input
          id={inputId}
          type="file"
          accept={fileAccept}
          onChange={(event) => onUpload(event.target.files?.[0], type)}
          className="mt-3 block w-full rounded-lg border border-slate-700 bg-slate-950 p-3 text-sm text-slate-300 file:mr-4 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-2 file:text-white"
        />

        {document.error && (
          <p className="mt-2 text-sm text-red-400">{document.error}</p>
        )}

        {document.file && (
          <div className="mt-3 rounded-lg border border-slate-700 p-3">
            <p className="break-all text-sm text-slate-200">
              {document.file.name}
            </p>

            <p className="mt-1 text-xs text-slate-400">
              {(document.file.size / 1024).toFixed(0)} KB
              {document.compressed ? " · Image compressed" : ""}
            </p>

            {document.file.type.startsWith("image/") && (
              <img
                src={document.previewUrl}
                alt={previewAlt}
                className="mt-3 max-h-64 rounded-lg border border-slate-700 object-contain"
              />
            )}

            {document.file.type === "application/pdf" && (
              <a
                href={document.previewUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm text-blue-400 underline"
              >
                Preview PDF
              </a>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-6">
      {renderDocument(
        "Identity document",
        "Upload a sample identity document for the demo.",
        identityDocument,
        "identity",
        "identityDocument",
        "Identity document preview",
      )}

      {renderDocument(
        "Supporting document",
        "For example, a fictional proof-of-address document.",
        supportingDocument,
        "supporting",
        "supportingDocument",
        "Supporting document preview",
      )}

      <div className="rounded-xl border border-slate-700 bg-slate-950 p-4">
        <h2 className="font-semibold text-white">Demo identity verification</h2>

        <p className="mt-2 text-sm leading-6 text-slate-400">
          This button simulates a successful verification response. It does not
          check the document, confirm your identity, or contact an external
          verification provider.
        </p>

        <button
          type="button"
          onClick={onVerify}
          className="mt-4 rounded-lg bg-blue-600 px-4 py-3 font-semibold hover:bg-blue-500"
        >
          Run demo verification
        </button>

        {verificationMessage && (
          <p
            role="status"
            className={`mt-3 text-sm ${
              identityVerified ? "text-green-400" : "text-amber-400"
            }`}
          >
            {verificationMessage}
          </p>
        )}
      </div>

      <p className="text-xs leading-5 text-slate-500">
        Files are currently held in browser memory and are not uploaded to a
        server. Do not select real identity documents or sensitive personal
        records.
      </p>
    </div>
  );
}
