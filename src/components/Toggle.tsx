type Props<T extends string> = {
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
};

export default function Toggle<T extends string>({
  options,
  value,
  onChange,
}: Props<T>) {
  return (
    <div className="flex items-center gap-1 rounded-lg bg-[#f1f5fb] p-0.5">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          onClick={() => onChange(opt)}
          className={[
            'rounded-md px-2.5 py-1 text-[11px] font-semibold transition-colors',
            value === opt
              ? 'bg-white text-accent shadow-sm'
              : 'text-muted hover:text-ink',
          ].join(' ')}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}
