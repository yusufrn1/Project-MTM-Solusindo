type Sesi = { email: string; kedaluwarsa: number };

const DELAPAN_JAM = 60 * 60 * 8;
const globalSesi = globalThis as typeof globalThis & {
  mtmSesi?: Map<string, Sesi>;
};
const penyimpanan = (globalSesi.mtmSesi ??= new Map<string, Sesi>());

export function buatRekamanSesi(email: string, sekarang = Date.now()) {
  const id = crypto.randomUUID();
  penyimpanan.set(id, {
    email,
    kedaluwarsa: sekarang + DELAPAN_JAM * 1000,
  });
  return id;
}

export function bacaRekamanSesi(id: string | undefined, sekarang = Date.now()) {
  if (!id) return null;

  const sesi = penyimpanan.get(id);
  if (!sesi || sesi.kedaluwarsa <= sekarang) {
    penyimpanan.delete(id);
    return null;
  }

  return sesi;
}

export function hapusRekamanSesi(id: string | undefined) {
  if (id) penyimpanan.delete(id);
}