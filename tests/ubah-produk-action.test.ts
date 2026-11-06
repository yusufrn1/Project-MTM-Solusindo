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
    product: {
      update: vi.fn(),
    },
  },
}));

import { Prisma } from "@/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { bacaSesi } from "@/lib/sesi";
import { ubahProduk } from "@/app/katalog/actions";

describe("Server Action ubahProduk", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("menangani P2025 ketika produk tidak ditemukan", async () => {
    vi.mocked(bacaSesi).mockResolvedValue({
      email: "admin@test.com",
      kedaluwarsa: Date.now() + 60_000,
    });

    vi.mocked(prisma.product.update).mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError(
        "Record to update not found",
        {
          code: "P2025",
          clientVersion: "7.10.1",
        },
      ),
    );

    const formData = new FormData();
    formData.set("name", "RFID Gateway");
    formData.set("category", "RFID Solutions");
    formData.set("description", "Perangkat pembaca RFID untuk inventaris.");
    formData.set("features", "Identifikasi barang\nDukungan inventaris");
    formData.set("aktif", "on");

    const hasil = await ubahProduk(999, {}, formData);

    expect(hasil.pesan).toBe(
      "Produk tidak ditemukan atau sudah dihapus.",
    );
    expect(prisma.product.update).toHaveBeenCalledOnce();
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
