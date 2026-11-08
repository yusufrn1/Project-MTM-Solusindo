import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

vi.mock("next/cache", () => ({
  revalidatePath: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  redirect: vi.fn(),
}));

vi.mock("@/lib/sesi", () => ({
  bacaSesi: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    review: {
      create: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { bacaSesi } from "@/lib/sesi";
import { simpanUlasan, ubahUlasan } from "@/app/katalog/ulasan-actions";

function formUlasan({
  name = "Pelanggan Uji",
  rating = "4",
  comment = "Ulasan yang telah diperbarui.",
} = {}) {
  const formData = new FormData();
  formData.set("name", name);
  formData.set("rating", rating);
  formData.set("comment", comment);
  return formData;
}

describe("Server Action ubahUlasan", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(bacaSesi).mockResolvedValue({
      email: "admin@test.com",
      kedaluwarsa: Date.now() + 60_000,
    });
  });

  it("menolak rating di luar rentang dan mempertahankan nilai masukan", async () => {
    const formData = formUlasan({ rating: "6" });
    const hasil = await simpanUlasan(7, {}, formData);

    expect(hasil.galat?.rating?.[0]).toBe("Nilai maksimal 5.");
    expect(hasil.nilai?.rating).toBe("6");
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  it("menolak file pada field komentar", async () => {
    const formData = formUlasan();
    formData.set(
      "comment",
      new Blob(["Ulasan sintetis yang cukup panjang."], { type: "text/plain" }),
      "komentar.txt",
    );

    const hasil = await simpanUlasan(7, {}, formData);

    expect(hasil.galat?.comment).toBeDefined();
    expect(prisma.review.create).not.toHaveBeenCalled();
  });

  it("menolak masukan tidak valid pada field terkait", async () => {
    const hasil = await ubahUlasan(3, 7, {}, formUlasan({ rating: "6" }));

    expect(hasil.galat?.rating?.[0]).toBe("Nilai maksimal 5.");
    expect(prisma.review.updateMany).not.toHaveBeenCalled();
  });

  it("memperbarui ulasan yang cocok dengan produk dan memvalidasi ulang detail", async () => {
    vi.mocked(prisma.review.updateMany).mockResolvedValue({ count: 1 });

    const hasil = await ubahUlasan(3, 7, {}, formUlasan());

    expect(prisma.review.updateMany).toHaveBeenCalledWith({
      where: { id: 3, productId: 7 },
      data: {
        name: "Pelanggan Uji",
        rating: 4,
        comment: "Ulasan yang telah diperbarui.",
      },
    });
    expect(hasil.pesan).toBe("Perubahan ulasan disimpan.");
    expect(revalidatePath).toHaveBeenCalledWith("/katalog/7");
  });
});