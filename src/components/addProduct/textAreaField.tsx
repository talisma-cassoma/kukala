
import type {TextAreaFieldProps} from "@/components/addProduct/types"

export const TextAreaField = ({ label, value, onChange, placeholder, rows = 4 }: TextAreaFieldProps) => (
  <label className="block space-y-1">
    <span className="text-sm font-medium text-slate-700">{label}</span>
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      rows={rows}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm shadow-sm outline-none transition focus:border-slate-500 focus:ring-2 focus:ring-slate-200"
    />
  </label>
);