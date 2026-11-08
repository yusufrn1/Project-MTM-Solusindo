"use client";

import { useActionState } from "react";
import { simpanUlasan, ubahUlasan } from "@/app/katalog/ulasan-actions";
import type { StatusForm } from "@/lib/status-form";

const awal: StatusForm = {};
const kolom =
  "mt-1 block w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-100";

type UlasanAwal = {
  id: number;
  name: string;
  rating: number;
  comment: string;
};

export default function FormUlasan({
  productId,
  review,
}: {
  productId: number;
  review?: UlasanAwal;
}) {
  const aksiForm = review
    ? ubahUlasan.bind(null, review.id, productId)
    : simpanUlasan.bind(null, productId);
  const [status, action, pending] = useActionState(
    aksiForm,
    awal,
  );
  const errors = status.galat;
  const values = status.nilai;
  const idPrefix = review ? `review-${review.id}` : "new-review";

  return (
    <form action={action} className="mt-8 space-y-4 rounded-lg bg-white p-5">
      <h3 className="text-lg font-bold">
        {review ? "Ubah ulasan" : "Tulis ulasan"}
      </h3>
      <div>
        <label htmlFor={`${idPrefix}-name`} className="text-sm font-semibold">
          Nama
        </label>
        <input
          id={`${idPrefix}-name`}
          name="name"
          required
          minLength={2}
          maxLength={60}
          defaultValue={values?.name ?? review?.name}
          className={kolom}
          aria-invalid={Boolean(errors?.name)}
          aria-describedby={`${idPrefix}-name-error`}
        />
        <p id={`${idPrefix}-name-error`} className="mt-1 text-sm text-red-700">
          {errors?.name?.[0]}
        </p>
      </div>
      <div>
        <label htmlFor={`${idPrefix}-rating`} className="text-sm font-semibold">
          Nilai
        </label>
        <select
          id={`${idPrefix}-rating`}
          name="rating"
          key={values?.rating ?? String(review?.rating ?? 5)}
          required
          defaultValue={values?.rating ?? String(review?.rating ?? 5)}
          className={kolom}
          aria-invalid={Boolean(errors?.rating)}
          aria-describedby={`${idPrefix}-rating-error`}
        >
          {values?.rating &&
            !["1", "2", "3", "4", "5"].includes(values.rating) && (
              <option value={values.rating}>{values.rating}/5</option>
            )}
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating}/5
            </option>
          ))}
        </select>
        <p id={`${idPrefix}-rating-error`} className="mt-1 text-sm text-red-700">
          {errors?.rating?.[0]}
        </p>
      </div>
      <div>
        <label htmlFor={`${idPrefix}-comment`} className="text-sm font-semibold">
          Komentar
        </label>
        <textarea
          id={`${idPrefix}-comment`}
          name="comment"
          required
          minLength={5}
          maxLength={500}
          rows={4}
          defaultValue={values?.comment ?? review?.comment}
          className={kolom}
          aria-invalid={Boolean(errors?.comment)}
          aria-describedby={`${idPrefix}-comment-error`}
        />
        <p id={`${idPrefix}-comment-error`} className="mt-1 text-sm text-red-700">
          {errors?.comment?.[0]}
        </p>
      </div>
      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-900 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-800 disabled:opacity-60"
      >
        {pending
          ? review
            ? "Menyimpan..."
            : "Mengirim..."
          : review
            ? "Simpan perubahan"
            : "Kirim ulasan"}
      </button>
      <p role="status" aria-live="polite" className="text-sm text-slate-700">
        {status.pesan}
      </p>
    </form>
  );
}