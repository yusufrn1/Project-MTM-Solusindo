"use client";

import { useActionState } from "react";
import { simpanUlasan } from "@/app/katalog/ulasan-actions";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};
const kolom =
  "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100";

export default function FormUlasan({ productId }: { productId: number }) {
  const [status, action, pending] = useActionState(
    simpanUlasan.bind(null, productId),
    awal,
  );
  const errors = status.galat;

  return (
    <form action={action} className="mt-8 space-y-4 rounded-lg bg-white p-5">
      <h3 className="text-lg font-bold">Tulis ulasan</h3>
      <div>
        <label htmlFor="review-name" className="text-sm font-semibold">
          Nama
        </label>
        <input
          id="review-name"
          name="name"
          required
          minLength={2}
          maxLength={60}
          className={kolom}
          aria-invalid={Boolean(errors?.name)}
          aria-describedby="review-name-error"
        />
        <p id="review-name-error" className="mt-1 text-sm text-red-700">
          {errors?.name?.[0]}
        </p>
      </div>
      <div>
        <label htmlFor="review-rating" className="text-sm font-semibold">
          Nilai
        </label>
        <select
          id="review-rating"
          name="rating"
          required
          defaultValue="5"
          className={kolom}
          aria-invalid={Boolean(errors?.rating)}
          aria-describedby="review-rating-error"
        >
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating}/5
            </option>
          ))}
        </select>
        <p id="review-rating-error" className="mt-1 text-sm text-red-700">
          {errors?.rating?.[0]}
        </p>
      </div>
      <div>
        <label htmlFor="review-comment" className="text-sm font-semibold">
          Komentar
        </label>
        <textarea
          id="review-comment"
          name="comment"
          required
          minLength={5}
          maxLength={500}
          rows={4}
          className={kolom}
          aria-invalid={Boolean(errors?.comment)}
          aria-describedby="review-comment-error"
        />
        <p id="review-comment-error" className="mt-1 text-sm text-red-700">
          {errors?.comment?.[0]}
        </p>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {pending ? "Mengirim..." : "Kirim ulasan"}
      </button>
      <p role="status" aria-live="polite" className="text-sm text-slate-700">
        {status.pesan}
      </p>
    </form>
  );
}