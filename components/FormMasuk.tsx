"use client";

import { useActionState } from "react";
import { masuk } from "@/app/masuk/actions";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};

export default function FormMasuk() {
  const [status, aksi, pending] = useActionState(masuk, awal);
  const errors = status.galat;

  return (
    <form action={aksi} className="mt-7 space-y-5">
      <div>
        <label htmlFor="email" className="text-sm font-semibold">
          Email pengelola
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          aria-invalid={Boolean(errors?.email)}
          aria-describedby="error-email"
        />
        <p id="error-email" className="mt-1 text-sm text-red-700">
          {errors?.email?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="kataSandi" className="text-sm font-semibold">
          Kata sandi
        </label>
        <input
          id="kataSandi"
          name="kataSandi"
          type="password"
          autoComplete="current-password"
          minLength={8}
          required
          className="mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100"
          aria-invalid={Boolean(errors?.kataSandi)}
          aria-describedby="error-kata-sandi"
        />
        <p id="error-kata-sandi" className="mt-1 text-sm text-red-700">
          {errors?.kataSandi?.[0]}
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-900 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {pending ? "Memeriksa..." : "Masuk"}
      </button>
      <p role="status" aria-live="polite" className="text-sm text-slate-700">
        {status.pesan}
      </p>
    </form>
  );
}