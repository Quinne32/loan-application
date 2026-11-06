type AddressDetails = {
  streetAddress: string;
  city: string;
  state: string;
  postalCode: string;
};

type AddressDetailsStepProps = {
  addressDetails: AddressDetails;
  errors: Partial<Record<keyof AddressDetails, string>>;
  inputClass: string;
  showSuggestions: boolean;
  onChange: (field: keyof AddressDetails, value: string) => void;
  onSelectAddress: (address: AddressDetails) => void;
  onShowSuggestions: () => void;
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

export default function AddressDetailsStep({
  addressDetails,
  errors,
  inputClass,
  showSuggestions,
  onChange,
  onSelectAddress,
  onShowSuggestions,
}: AddressDetailsStepProps) {
  const matchingSuggestions = addressSuggestions.filter((suggestion) =>
    suggestion.streetAddress
      .toLowerCase()
      .includes(addressDetails.streetAddress.trim().toLowerCase()),
  );

  return (
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
            onChange("streetAddress", event.target.value);
            onShowSuggestions();
          }}
          onFocus={onShowSuggestions}
          autoComplete="street-address"
          placeholder="Enter a street address"
          className={inputClass}
          aria-invalid={Boolean(errors.streetAddress)}
        />

        {errors.streetAddress && (
          <p className="mt-1 text-sm text-red-400">{errors.streetAddress}</p>
        )}

        {showSuggestions && addressDetails.streetAddress.trim().length > 0 && (
          <div className="mt-2 overflow-hidden rounded-lg border border-slate-700 bg-slate-950">
            {matchingSuggestions.map((suggestion) => (
              <button
                key={suggestion.streetAddress}
                type="button"
                onClick={() => onSelectAddress(suggestion)}
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
                No demo suggestions. You can enter your address manually.
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
          <label htmlFor="city" className="text-sm font-medium text-slate-200">
            City
          </label>

          <input
            id="city"
            value={addressDetails.city}
            onChange={(event) => onChange("city", event.target.value)}
            placeholder="e.g. Abuja"
            className={inputClass}
            aria-invalid={Boolean(errors.city)}
          />

          {errors.city && (
            <p className="mt-1 text-sm text-red-400">{errors.city}</p>
          )}
        </div>

        <div>
          <label htmlFor="state" className="text-sm font-medium text-slate-200">
            State / FCT
          </label>

          <select
            id="state"
            value={addressDetails.state}
            onChange={(event) => onChange("state", event.target.value)}
            className={inputClass}
            aria-invalid={Boolean(errors.state)}
          >
            <option value="">Select state</option>

            {nigerianStates.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>

          {errors.state && (
            <p className="mt-1 text-sm text-red-400">{errors.state}</p>
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
          onChange={(event) => onChange("postalCode", event.target.value)}
          placeholder="Enter postal code"
          className={inputClass}
          aria-invalid={Boolean(errors.postalCode)}
        />

        {errors.postalCode && (
          <p className="mt-1 text-sm text-red-400">{errors.postalCode}</p>
        )}
      </div>
    </div>
  );
}
