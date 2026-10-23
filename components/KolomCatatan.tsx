"use client";

import { useId, useState } from "react";

export default function KolomCatatan({ label }: { label: string }) {
  const id = useId();
  const [catatan, setCatatan] = useState("");

  return (
    <div className="rounded-lg border border-dashed border-slate-300 p-3 text-sm">
      <label htmlFor={id} className="font-medium text-slate-700">
        {label}
      </label>
      <input
        id={id}
        value={catatan}
        onChange={(event) => setCatatan(event.target.value)}
        className="mt-2 block w-full rounded border border-slate-300 px-2 py-1"
      />
    </div>
  );
}