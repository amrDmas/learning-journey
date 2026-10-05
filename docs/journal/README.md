# 📓 Jurnal Belajar

Folder ini untuk **jurnal harian** dan **lembar recall** — dua kebiasaan kecil yang punya dampak besar.

## Kenapa pakai jurnal?

Menulis jurnal belajar memaksa kamu **mengungkapkan pemahaman dengan kata sendiri**. Kalau kamu
tidak bisa menuliskan "hari ini saya paham X karena Y", biasanya kamu memang belum paham. Ini
teknik yang sama dengan *rubber duck debugging* dan metode Feynman.

Selain itu, jurnal jadi bukti progres. Saat kamu merasa "kok nggak berkembang ya?", buka jurnal
2 minggu lalu dan bandingkan — hampir selalu kamu sudah jauh lebih baik dari yang kamu kira.

## Kapan diisi?

- **Setiap hari belajar** (5–10 menit di akhir sesi): tulis satu file `YYYY-MM-DD.md`.
- **Setiap Minggu**: review lembar [`recall.md`](recall.md) untuk konsep yang perlu diulang.

## Format nama file

```text
docs/journal/2026-10-05.md
docs/journal/2026-10-06.md
```

Satu file per hari belajar. Kalau tidak ada sesi belajar, tidak perlu diisi — jangan bikin beban.

## Aturan singkat

1. **Jujur.** Tulis apa yang benar-benar belum paham, bukan yang terdengar pintar.
2. **Spesifik.** "Belajar JS" kurang berguna; "paham kenapa `var` di loop closure bocor" jauh lebih baik.
3. **Pendek.** 5 baris cukup. Jurnal bukan esai.
4. **Konsisten.** Lebih baik 5 menit tiap hari daripada 1 jam sekali seminggu.

---

## Template Jurnal Harian

Copy template di bawah ke file `YYYY-MM-DD.md` baru:

```markdown
# Jurnal — YYYY-MM-DD

**Fase:** phase-XX — <nama fase>
**Durasi belajar:** <mis. 4 jam>

## Fokus Hari Ini
<Apa yang kamu kerjakan hari ini? Satu-dua kalimat.>

## Yang Dipelajari
- <Konsep 1 — jelaskan dengan kata sendiri, bukan copy dari materi>
- <Konsep 2>

## Yang Masih Bingung
- <Hal yang belum paham — ini daftar untuk ditanyakan ke mentor>
- <Kode yang belum jalan / bug yang belum ketemu>

## Kode / Commit Penting
- `<hash>` — <judul commit>
- Link PR: <url>

## Rencana Besok
- <Langkah berikutnya yang konkret>

## Refleksi (1 kalimat)
<Bagaimana perasaanmu hari ini? Apa yang berhasil, apa yang perlu diperbaiki?>
```

> **Tips:** bagian **"Yang Masih Bingung"** adalah bagian paling berharga. Bawa daftar itu ke sesi
> berikutnya bersama mentor — jangan diamkan.
