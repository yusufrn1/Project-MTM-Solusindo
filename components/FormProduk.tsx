"use client";

import { useActionState } from "react";
import { simpanProduk } from "@/app/katalog/actions";
import { kategoriProduk } from "@/lib/skema";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};
const kolom =
  "mt-1 block w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100";

export default function FormProduk() {
  const [status, aksi, pending] = useActionState(simpanProduk, awal);
  const errors = status.galat;
  const values = status.nilai;

  return (
    <form action={aksi} className="mt-7 space-y-5">
      <div>
        <label htmlFor="name" className="text-sm font-semibold">
          Nama produk
        </label>
        <input
          id="name"
          name="name"
          required
          minLength={3}
          maxLength={80}
          defaultValue={values?.name}
          className={kolom}
          aria-invalid={Boolean(errors?.name)}
          aria-describedby="error-name"
        />
        <p id="error-name" className="mt-1 text-sm text-red-700">
          {errors?.name?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="category" className="text-sm font-semibold">
          Kategori
        </label>
        <select
          key={values?.category ?? "awal"}
          id="category"
          name="category"
          required
          defaultValue={values?.category ?? ""}
          className={kolom}
          aria-invalid={Boolean(errors?.category)}
          aria-describedby="error-category"
        >
          <option value="" disabled>
            Pilih kategori
          </option>
          {kategoriProduk.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
        <p id="error-category" className="mt-1 text-sm text-red-700">
          {errors?.category?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="description" className="text-sm font-semibold">
          Deskripsi
        </label>
        <textarea
          id="description"
          name="description"
          required
          minLength={10}
          maxLength={300}
          rows={4}
          defaultValue={values?.description}
          className={kolom}
          aria-invalid={Boolean(errors?.description)}
          aria-describedby="error-description"
        />
        <p id="error-description" className="mt-1 text-sm text-red-700">
          {errors?.description?.[0]}
        </p>
      </div>

      <div>
        <label htmlFor="features" className="text-sm font-semibold">
          Fitur produk
        </label>
        <textarea
          id="features"
          name="features"
          required
          maxLength={500}
          rows={4}
          defaultValue={values?.features}
          className={kolom}
          aria-invalid={Boolean(errors?.features)}
          aria-describedby="error-features features-hint"
        />
        <p id="features-hint" className="mt-1 text-xs text-slate-500">
          Tulis satu fitur per baris.
        </p>
        <p id="error-features" className="mt-1 text-sm text-red-700">
          {errors?.features?.[0]}
        </p>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            name="aktif"
            value="on"
            defaultChecked={values?.aktif === "on"}
            aria-invalid={Boolean(errors?.aktif)}
            aria-describedby="error-aktif"
          />
          Tampilkan produk di katalog
        </label>
        <p id="error-aktif" className="mt-1 text-sm text-red-700">
          {errors?.aktif?.[0]}
        </p>
      </div>

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Menyimpan..." : "Simpan produk"}
      </button>
      <p role="status" aria-live="polite" className="text-sm text-slate-700">
        {status.pesan}
      </p>
    </form>
  );
}