export default function FilterSelect({ label, value, onChange, options, ariaLabel }) {
  return (
    <select
      className="form-select"
      style={{ minWidth: 150 }}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label={ariaLabel || label}
    >
      <option value="">{label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}
