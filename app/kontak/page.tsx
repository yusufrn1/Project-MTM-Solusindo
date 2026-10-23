"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

type FormData = {
  nama: string;
  email: string;
  perusahaan: string;
  kategori: string;
  pesan: string;
};

type FormErrors = Partial<Record<keyof FormData, string>>;

const initialForm: FormData = {
  nama: "",
  email: "",
  perusahaan: "",
  kategori: "",
  pesan: "",
};

const categories = [
  "People Counting",
  "RFID Solutions",
  "POS Systems",
  "Barcode Scanners",
  "Data Collection",
  "Lainnya",
];

export default function KontakPage() {
  const [form, setForm] = useState<FormData>(() => {
  if (typeof window === "undefined") {
    return initialForm;
  }

  const params = new URLSearchParams(window.location.search);
  const requestedCategory = params.get("kategori");

  if (requestedCategory && categories.includes(requestedCategory)) {
    return { ...initialForm, kategori: requestedCategory };
  }

  return initialForm;
});
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function validateForm(): FormErrors {
    const newErrors: FormErrors = {};

    if (!form.nama.trim()) {
      newErrors.nama = "Nama wajib diisi.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email wajib diisi.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Masukkan alamat email yang valid.";
    }

    if (!form.perusahaan.trim()) {
      newErrors.perusahaan = "Nama perusahaan wajib diisi.";
    }

    if (!form.kategori) {
      newErrors.kategori = "Pilih kategori kebutuhan Anda.";
    }

    if (!form.pesan.trim()) {
      newErrors.pesan = "Pesan wajib diisi.";
    } else if (form.pesan.trim().length < 10) {
      newErrors.pesan = "Pesan minimal 10 karakter.";
    }

    return newErrors;
  }

  function handleChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: undefined,
    }));

    setSubmitted(false);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const newErrors = validateForm();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      setSubmitted(false);
      return;
    }

    setSubmitted(true);

    // Simulasi saja. Data tidak dikirim ke server.
  }

  const inputClass =
    "mt-2 w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-700 focus:ring-2 focus:ring-blue-100";

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <Navbar />

      <main>
        {/* Hero */}
        <section className="bg-blue-950 px-6 py-16 text-white sm:py-20">
          <div className="mx-auto max-w-7xl">
            <p className="text-sm font-bold tracking-widest text-cyan-300 uppercase">
              Contact & Consultation
            </p>

            <h1 className="mt-4 max-w-3xl text-4xl leading-tight font-bold sm:text-5xl">
              Mari Diskusikan Kebutuhan Bisnis Anda
            </h1>

            <p className="mt-5 max-w-2xl leading-8 text-blue-100">
              Ceritakan kebutuhan teknologi Anda agar kami dapat memahami
              solusi yang ingin Anda cari.
            </p>
          </div>
        </section>

        {/* Contact content */}
        <section className="mx-auto grid max-w-7xl gap-10 px-6 py-14 lg:grid-cols-[0.8fr_1.2fr] lg:py-20">
          <aside>
            <p className="text-sm font-bold tracking-widest text-blue-700 uppercase">
              Hubungi Kami
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Mulai dari kebutuhan Anda.
            </h2>

            <p className="mt-4 leading-8 text-slate-600">
              Gunakan formulir ini untuk menyampaikan kebutuhan perangkat atau
              solusi teknologi bagi operasional bisnis Anda.
            </p>

            <div className="mt-8 space-y-4">
              <article className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold">
                  01 — Informasi kebutuhan
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Jelaskan kebutuhan bisnis dan kategori teknologi yang Anda
                  cari.
                </p>
              </article>

              <article className="rounded-xl border border-slate-200 bg-white p-5">
                <h3 className="font-bold">02 — Data kontak</h3>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Isi data yang diperlukan untuk simulasi pengajuan permintaan.
                </p>
              </article>
            </div>
          </aside>

          {/* Form */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-9">
            <h2 className="text-2xl font-bold">Formulir Konsultasi</h2>

            <p className="mt-2 text-sm leading-6 text-slate-600">
              Kolom bertanda * wajib diisi. Formulir ini merupakan simulasi
              antarmuka dan belum mengirim data ke server.
            </p>

            {submitted && (
              <div
                role="status"
                aria-live="polite"
                className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-sm leading-6 text-green-800"
              >
                <p className="font-bold">Validasi berhasil!</p>

                <p>
                  Data formulir berhasil divalidasi. Ini masih simulasi dan
                  belum dikirim ke MTM Solusindo.
                </p>
              </div>
            )}

            <form
              className="mt-7 space-y-5"
              onSubmit={handleSubmit}
              noValidate
            >
              {/* Nama */}
              <div>
                <label htmlFor="nama" className="text-sm font-semibold">
                  Nama lengkap *
                </label>

                <input
                  id="nama"
                  name="nama"
                  value={form.nama}
                  onChange={handleChange}
                  autoComplete="name"
                  aria-invalid={Boolean(errors.nama)}
                  aria-describedby={errors.nama ? "nama-error" : undefined}
                  className={inputClass}
                  placeholder="Masukkan nama lengkap"
                />

                {errors.nama && (
                  <p
                    id="nama-error"
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.nama}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label htmlFor="email" className="text-sm font-semibold">
                  Email *
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  aria-invalid={Boolean(errors.email)}
                  aria-describedby={errors.email ? "email-error" : undefined}
                  className={inputClass}
                  placeholder="nama@perusahaan.com"
                />

                {errors.email && (
                  <p
                    id="email-error"
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.email}
                  </p>
                )}
              </div>

              {/* Perusahaan */}
              <div>
                <label
                  htmlFor="perusahaan"
                  className="text-sm font-semibold"
                >
                  Nama perusahaan *
                </label>

                <input
                  id="perusahaan"
                  name="perusahaan"
                  value={form.perusahaan}
                  onChange={handleChange}
                  autoComplete="organization"
                  aria-invalid={Boolean(errors.perusahaan)}
                  aria-describedby={
                    errors.perusahaan ? "perusahaan-error" : undefined
                  }
                  className={inputClass}
                  placeholder="Nama perusahaan atau usaha"
                />

                {errors.perusahaan && (
                  <p
                    id="perusahaan-error"
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.perusahaan}
                  </p>
                )}
              </div>

              {/* Kategori */}
              <div>
                <label htmlFor="kategori" className="text-sm font-semibold">
                  Kategori kebutuhan *
                </label>

                <select
                  id="kategori"
                  name="kategori"
                  value={form.kategori}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.kategori)}
                  aria-describedby={
                    errors.kategori ? "kategori-error" : undefined
                  }
                  className={inputClass}
                >
                  <option value="">Pilih kategori</option>

                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>

                {errors.kategori && (
                  <p
                    id="kategori-error"
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.kategori}
                  </p>
                )}
              </div>

              {/* Pesan */}
              <div>
                <label htmlFor="pesan" className="text-sm font-semibold">
                  Deskripsi kebutuhan *
                </label>

                <textarea
                  id="pesan"
                  name="pesan"
                  value={form.pesan}
                  onChange={handleChange}
                  rows={5}
                  aria-invalid={Boolean(errors.pesan)}
                  aria-describedby={errors.pesan ? "pesan-error" : undefined}
                  className={inputClass}
                  placeholder="Jelaskan kebutuhan teknologi Anda (minimal 10 karakter)"
                />

                {errors.pesan && (
                  <p
                    id="pesan-error"
                    className="mt-2 text-sm text-red-600"
                  >
                    {errors.pesan}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full rounded-lg bg-blue-950 px-6 py-4 font-bold text-white transition hover:bg-blue-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
              >
                Validasi Formulir →
              </button>

              <p className="text-xs leading-6 text-slate-500">
                Data hanya digunakan dalam simulasi di halaman ini dan tidak
                dikirim atau disimpan ke server.
              </p>
            </form>
          </section>
        </section>
      </main>

      <Footer />
    </div>
  );
}