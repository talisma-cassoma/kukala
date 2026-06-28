import { useState } from 'react';
import type {SectionCardProps} from "@/components/addProduct/types"

export const SectionCard = ({ title, description, children }: SectionCardProps) => (
  <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
    <div className="mb-4">
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
    </div>
    <div className="space-y-4">{children}</div>
  </section>
);