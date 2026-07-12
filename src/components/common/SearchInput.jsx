import { FiSearch } from 'react-icons/fi';

export default function SearchInput({ value, onChange, placeholder = 'Search...', ariaLabel }) {
  return (
    <div className="position-relative" style={{ minWidth: 220 }}>
      <FiSearch
        size={16}
        className="position-absolute text-muted-custom"
        style={{ top: '50%', left: 12, transform: 'translateY(-50%)', pointerEvents: 'none' }}
      />
      <input
        type="text"
        className="form-control"
        style={{ paddingLeft: 36 }}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel || placeholder}
      />
    </div>
  );
}
