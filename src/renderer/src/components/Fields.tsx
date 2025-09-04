import React from 'react'

export const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="grid grid-cols-3 items-center gap-3">{children}</div>
)

type InputProps = {
  label: string
  value: string
  onChange: (v: string) => void
  type?: React.HTMLInputTypeAttribute
  disabled?: boolean
  required?: boolean
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode']
  pattern?: string
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>
}

export const Input = ({
  label,
  value,
  onChange,
  type = 'text',
  disabled,
  required,
  inputMode,
  pattern,
  onKeyDown
}: InputProps) => (
  <div className="relative col-span-2">
    <input
      type={type}
      className="peer w-full rounded-xl border border-gray-300 bg-white px-3 pt-5 pb-2 text-sm
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition disabled:opacity-50"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder=" "
      disabled={disabled}
      required={required}
      inputMode={inputMode}
      pattern={pattern}
      onKeyDown={onKeyDown}
    />
    <label
      className="absolute left-3 top-2 text-xs text-gray-500 transition-all
                 peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-gray-400 peer-placeholder-shown:text-sm
                 peer-focus:top-2 peer-focus:text-xs peer-focus:text-blue-600"
    >
      {label}
      {required ? ' *' : ''}
    </label>
  </div>
)

type SelectProps = {
  label: string
  value: string
  options: readonly string[]
  onChange: (v: string) => void
  disabled?: boolean
  required?: boolean
}

export const Select = ({ label, value, options, onChange, disabled, required }: SelectProps) => (
  <div className="relative col-span-2">
    <select
      className="peer w-full appearance-none rounded-xl border border-gray-300 bg-white px-3 pt-5 pb-2 text-sm
                 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/40 transition disabled:opacity-50"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      required={required}
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <label className="absolute left-3 top-2 text-xs text-gray-500 transition-all peer-focus:text-blue-600">
      {label}
      {required ? ' *' : ''}
    </label>
  </div>
)
