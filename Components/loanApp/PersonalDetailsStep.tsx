type PersonalDetails = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
};

type PersonalDetailsStepProps = {
  personalDetails: PersonalDetails;
  errors: Partial<Record<keyof PersonalDetails, string>>;
  inputClass: string;
  onChange: (field: keyof PersonalDetails, value: string) => void;
};

export default function PersonalDetailsStep({
  personalDetails,
  errors,
  inputClass,
  onChange,
}: PersonalDetailsStepProps) {
  function renderField(
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
          onChange={(event) => onChange(field, event.target.value)}
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

  return (
    <div className="mt-8 grid gap-5 sm:grid-cols-2">
      {renderField("firstName", "First name")}
      {renderField("lastName", "Last name")}

      <div className="sm:col-span-2">
        {renderField("email", "Email address", "email")}
      </div>

      <div className="sm:col-span-2">
        {renderField("phone", "Phone number", "tel")}
      </div>

      <div className="sm:col-span-2">
        {renderField("dateOfBirth", "Date of birth", "date")}
      </div>
    </div>
  );
}
