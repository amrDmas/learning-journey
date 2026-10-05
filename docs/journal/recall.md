# 🔁 Lembar Recall — Spaced Repetition

Halaman ini untuk **mengulang konsep secara berkala**. Tujuan spaced repetition: mengingat kembali
tepat sebelum kamu lupa, sehingga ingatan jadi tahan lama.

## Cara pakai

1. Setiap kali selesai mempelajari satu konsep penting, tambahkan satu baris ke tabel di bawah.
2. Isi tanggal **Review-1** (besok), **Review-2** (3 hari), **Review-3** (1 minggu), **Review-4** (3 minggu).
3. Saat tanggalnya tiba, coba jelaskan konsep itu **tanpa membuka catatan**.
4. Isi status: ✅ paham / ⚠️ setengah / ❌ lupa. Kalau ❌, ulangi besok.

> Aturan emas: **kalau kamu tidak bisa menjelaskannya dalam 60 detik tanpa catatan, kamu belum paham.**
> Jangan menandai ✅ kalau ragu.

---

## Tabel Recall

| # | Konsep | Fase | Review-1 (besok) | Review-2 (+3 hr) | Review-3 (+1 mg) | Review-4 (+3 mg) | Status |
|---|--------|------|:---:|:---:|:---:|:---:|:---:|
| 1 | Call stack & stack frame | 01 | — | — | — | — | ⬜ |
| 2 | Primitive vs reference (value vs reference) | 01 | — | — | — | — | ⬜ |
| 3 | Scope & lexical scope | 01 | — | — | — | — | ⬜ |
| 4 | Hoisting & Temporal Dead Zone | 01 | — | — | — | — | ⬜ |
| 5 | Closure (definisi + use case) | 01 | — | — | — | — | ⬜ |
| 6 | `==` vs `===` dan coercion | 01 | — | — | — | — | ⬜ |
| 7 | Truthy / falsy | 01 | — | — | — | — | ⬜ |
| 8 | Aturan `this` (5 kasus) | 01 | — | — | — | — | ⬜ |
| 9 | Pure function vs side effect | 01 | — | — | — | — | ⬜ |
| 10 | `map` / `filter` / `reduce` | 01 | — | — | — | — | ⬜ |
| 11 | Immutability & update state immutable | 01 | — | — | — | — | ⬜ |
| 12 | Destructuring, spread, optional chaining | 01 | — | — | — | — | ⬜ |
| 13 | Event loop: macrotask vs microtask | 01 | — | — | — | — | ⬜ |
| 14 | Promise: state & chaining | 01 | — | — | — | — | ⬜ |
| 15 | `async/await` di atas promise | 01 | — | — | — | — | ⬜ |
| 16 | `Promise.all` vs `allSettled` vs `race` vs `any` | 01 | — | — | — | — | ⬜ |
| 17 | TypeScript: `any` vs `unknown` vs `never` | 01 | — | — | — | — | ⬜ |
| 18 | TypeScript: generics & constraint | 01 | — | — | — | — | ⬜ |
| 19 | Utility types (Partial, Pick, Omit, Record…) | 01 | — | — | — | — | ⬜ |
| 20 | Membaca stack trace | 01 | — | — | — | — | ⬜ |

Tambahkan baris baru saat kamu mempelajari konsep berikutnya. Contoh saat mengisi:

| 21 | HTTP method & status code | 02 | 2026-10-06 | 2026-10-09 | 2026-10-13 | 2026-11-03 | ✅ |

---

## Kartu Konsep (opsional)

Untuk konsep yang sulit, tulis kartu tanya-jawab seperti ini:

```markdown
### Q: Kenapa `setTimeout(fn, 0)` tidak langsung jalan?
**Jawab (jelaskan sendiri):** ...
**Tanggal review:** ...
**Status:** ⚠️
```

Contoh konsep yang layak dibuatkan kartu: event loop, `this` di arrow function, closure di loop,
kenapa `NaN !== NaN`, kenapa `0.1 + 0.2 !== 0.3`.

---

## Legenda Status

| Simbol | Arti | Tindakan |
|:---:|------|----------|
| ⬜ | Belum direview | Review sesuai jadwal |
| ✅ | Paham, bisa jelaskan tanpa catatan | Lanjut, review lebih jarang |
| ⚠️ | Setengah paham / masih ragu | Review ulang 2 hari lagi |
| ❌ | Lupa | Review besok, tulis ulang penjelasannya |
