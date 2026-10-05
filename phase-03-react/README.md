# Phase 03 — React: Mental Model Rendering & State

> Durasi: 4 minggu (4+ jam/hari) | Prasyarat: [phase-02-web-browser](../phase-02-web-browser/README.md) selesai (DOM, event, fetch, HTML/CSS) + JS mental model dari phase-01 | Status: belum mulai

## Tujuan Pembelajaran

Di akhir fase ini kamu bisa:

1. **Menjelaskan mental model inti React**: `UI = f(state)`. Kamu tidak lagi "mengubah DOM", tapi mendeskripsikan tampilan untuk sebuah state.
2. **Menjelaskan siklus render**: kapan komponen dirender, apa yang memicu render ulang, dan kenapa React butuh **reconciliation**.
3. **Membuat komponen yang benar**: fungsi komponen, props, JSX, composition, dan `children`.
4. **Mengelola state dengan `useState`**: kapan state naik (lifting), kenapa state bersifat *snapshot per render*, dan kenapa update state asynchronous.
5. **Menggunakan `useEffect` dengan benar**: kapan **tidak** butuh effect, dependency array, cleanup, dan bahaya infinite loop.
6. **Mengambil data dari API** dengan pola `loading` / `error` / `data`, serta menangani race condition sederhana.
7. **Membuat list & key yang benar** dan menjelaskan kenapa `key` memakai index bisa jadi bug.
8. **Membuat custom hook** untuk memisahkan logika dari tampilan.
9. **Menggunakan Context dasar** untuk menghindari *prop drilling*.
10. **Menambah routing** dengan React Router dan memahami beda client-side vs server-side routing.
11. **Menyelesaikan project `react-dashboard`** yang lulus review: komponen terpisah rapi, state jelas, data dari API, dan bisa dijelaskan tiap keputusannya.

## Mental Model — Kenapa, bukan cuma Apa

React bukan "HTML di dalam JS". React adalah **fungsi yang mengubah state menjadi deskripsi UI**. Pahami model ini, dan semua API React jadi masuk akal.

| Model | Pertanyaan yang dijawab | Konsep yang bergantung padanya |
| --- | --- | --- |
| **UI = f(state)** | "Bagaimana cara saya menyuruh layar berubah?" | `useState`, props, conditional rendering, seluruh React |
| **Render adalah perhitungan, bukan perintah** | "Kenapa saya tidak boleh `document.querySelector` di React?" | JSX, re-render, pure component |
| **Snapshot per render** | "Kenapa `count` masih nilai lama di dalam handler?" | closure + render (ingat phase-01!), `useState` updater |
| **Reconciliation & diffing** | "Kenapa React tidak membangun ulang seluruh DOM?" | `key`, virtual DOM, performa |
| **Effect = sinkronisasi dengan dunia luar** | "Kapan saya butuh `useEffect`?" | fetch, subscription, timer, cleanup |
| **State milik komponen, bukan variabel biasa** | "Kenapa mengubah variabel tidak bikin UI berubah?" | re-render trigger, immutability |

> Aturan emas fase ini: **sebelum bertanya "API-nya apa?", tanya dulu "state-nya apa dan siapa yang berubah?".** 90% kebingungan React hilang ketika kamu menjawab dua pertanyaan itu lebih dulu.

### Kenapa "snapshot per render" penting (jembatan dari closure)

Setiap render membuat "foto" baru dari props & state. Handler yang dibuat di render itu **menangkap** nilai dari foto tersebut.

```tsx
function Counter() {
  const [count, setCount] = useState(0);

  function handleClick() {
    // `count` di sini adalah nilai PADA RENDER INI, bukan nilai terbaru.
    setCount(count + 1);
    setCount(count + 1); // tetap count + 1, bukan +2 — keduanya lihat foto yang sama
    console.log(count); // mencetak nilai lama (snapshot), bukan nilai baru
  }

  return <button onClick={handleClick}>Nilai: {count}</button>;
}
```

Kalau kamu ingin update berbasis nilai sebelumnya, pakai **updater function**:

```tsx
function handleClick() {
  // React memberikan nilai terbaru ke callback, jadi ini benar-benar +2.
  setCount((prev) => prev + 1);
  setCount((prev) => prev + 1);
}
```

### Contoh: data fetching dengan loading / error / data

```tsx
import { useEffect, useState } from "react";

type User = { id: number; name: string; email: string };

export function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // AbortController mencegah hasil request basi menimpa state (race condition) dan
    // menghentikan request saat komponen unmount. Blok finally tetap perlu dijaga
    // agar tidak menimpa loading state request terbaru.
    const controller = new AbortController();

    async function load() {
      try {
        setLoading(true);
        const res = await fetch("https://jsonplaceholder.typicode.com/users", {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error(`Gagal memuat: ${res.status}`);
        setUsers(await res.json());
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return; // diabaikan
        setError(err instanceof Error ? err.message : "Error tidak diketahui");
      } finally {
        // finally selalu jalan — termasuk saat request dibatalkan. Tanpa penjagaan ini,
        // request lama yang dibatalkan bisa menimpa setLoading(true) dari request baru.
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();

    // cleanup: dijalankan saat dependency berubah atau komponen unmount
    return () => controller.abort();
  }, []); // [] = jalankan sekali saat mount

  if (loading) return <p>Memuat...</p>;
  if (error) return <p role="alert">Error: {error}</p>;
  if (users.length === 0) return <p>Belum ada data.</p>;

  return (
    <ul>
      {users.map((u) => (
        // key HARUS stabil & unik — pakai id, JANGAN index
        <li key={u.id}>
          {u.name} — {u.email}
        </li>
      ))}
    </ul>
  );
}
```

### Contoh: custom hook

```tsx
import { useEffect, useState } from "react";

// Logika diangkat dari komponen → bisa dipakai ulang, mudah dites.
export function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    async function run() {
      try {
        setLoading(true);
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) throw new Error(`Gagal memuat: ${res.status}`);
        setData(await res.json());
        setError(null);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") return;
        setError(err instanceof Error ? err.message : "Error tidak diketahui");
      } finally {
        // Jangan sentuh loading state kalau request ini sudah dibatalkan —
        // biarkan request terbaru (dengan controller baru) yang menentukannya.
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    run();
    return () => controller.abort();
  }, [url]); // jalankan ulang kalau url berubah

  return { data, loading, error };
}
```

## Materi & Urutan Belajar

Kerjakan berurutan. Perkiraan: 2–4 hari per topik. **Jangan lompat ke `useEffect` sebelum paham state & render.**

| # | Topik | Isi utama | Kenapa penting untuk JD |
| --- | --- | --- | --- |
| 01 | **Mental model: UI = f(state)** | React menyelesaikan masalah apa, beda "imperative DOM" vs "declarative UI" | Fondasi seluruh React; menjelaskan kenapa React ada |
| 02 | **Komponen & props** | Fungsi komponen, props read-only, composition, `children` | Membangun UI dari potongan kecil yang reusable |
| 03 | **JSX** | JSX → JS, expression `{}`, atribut, `className`, fragment `<>...</>` | Sintaks harian React |
| 04 | **State & `useState`** | State, setter, snapshot per render, updater function, immutability | Interaksi & reaktivitas UI |
| 05 | **Render ulang & reconciliation** | Kapan re-render terjadi, virtual DOM, diffing, `key` | Performa & bug list; pemahaman inti React |
| 06 | **Lifting state & state ownership** | Mengangkat state ke induk, single source of truth, controlled vs uncontrolled | Arsitektur komponen yang sehat |
| 07 | **Controlled form** | Input terkontrol (`value` + `onChange`), multiple field, validasi | Form adalah inti aplikasi bisnis |
| 08 | **`useEffect`** | Sinkronisasi dengan dunia luar, dependency array, cleanup, kenapa bisa infinite loop | Fetch data, subscription, timer, integrasi |
| 09 | **Fetching data** | Pola loading/error/data, AbortController, kenapa effect tidak untuk semua hal | Integrasi REST API — poin JD inti |
| 10 | **List & `key`** | `map` untuk render list, kenapa index bisa jadi bug | Bug UI klasik; kualitas kode |
| 11 | **Context dasar** | `createContext`, `useContext`, kapan dipakai, batasannya | Menghindari prop drilling (tema, auth) |
| 12 | **Custom hooks** | Mengekstrak logika, aturan hooks, prefix `use` | Reuse logika, testing, codebase besar |
| 13 | **React Router dasar** | `BrowserRouter`, `Routes`, `Route`, `Link`, `useParams`, nested route | Aplikasi multi-halaman (SPA) |
| 14 | **Styling** | CSS Modules / inline style / utility class, conditional class | UI rapi & maintainable |

### Alur belajar tiap topik

1. **Baca konsepnya**, tulis ulang contoh kecil dari nol (jangan copy-paste).
2. **Prediksi** apa yang akan terjadi sebelum menjalankan — lalu bandingkan.
3. **Bikin latihan variasi**: ubah satu hal, tebak efeknya, buktikan.
4. **Commit** dan minta review mentor.
5. **Tulis 3 baris refleksi**: apa yang mengejutkan, apa yang masih kabur, apa yang mau ditanya.

> Tips: pasang **React DevTools** (ekstensi browser). Lihat komponen, props, dan state-nya secara langsung — jauh lebih cepat daripada `console.log` di mana-mana.

## Latihan

Latihan dikerjakan di project latihan atau folder `latihan/`. Fokus pada **memahami kenapa**, bukan sekadar tampil.

1. **Komponen pertama** — pecah satu halaman statis jadi minimal 4 komponen dengan props. Jelaskan mana yang jadi *container* dan mana *presentational*.
2. **Counter 3 cara** — buat counter dengan: (a) `setCount(count + 1)`, (b) dua kali `setCount(count + 1)`, (c) dua kali updater `setCount(prev => prev + 1)`. Jelaskan kenapa hasilnya berbeda.
3. **Snapshot per render** — buat tombol yang `setTimeout` lalu `console.log(count)`. Jelaskan kenapa nilainya "tertinggal".
4. **Lifting state** — buat dua komponen input yang berbagi satu state di induknya (mis. konversi suhu). Jelaskan kenapa state harus diangkat.
5. **Controlled form** — buat form login dengan validasi real-time (email format, password minimal 8 karakter), tombol submit disabled kalau invalid.
6. **Todo list** — tambah, hapus, toggle selesai, filter (semua/aktif/selesai). Pastikan pakai `key` yang stabil.
7. **Bug `key` index** — buat list dengan `key={index}`, tambahkan input di tiap item, lalu hapus item pertama. Amati bug-nya, lalu perbaiki dengan `key={id}`. Jelaskan kenapa.
8. **`useEffect` cleanup** — buat komponen dengan `setInterval` yang menampilkan jam; pastikan tidak ada memory leak saat komponen di-unmount. Buktikan dengan React DevTools / console.
9. **Infinite loop** — sengaja buat `useEffect` tanpa dependency array yang mengubah state, amati infinite loop, lalu perbaiki dan jelaskan penyebabnya.
10. **Fetch + AbortController** — buat input pencarian yang memanggil API tiap ketikan; batalkan request sebelumnya supaya hasil lama tidak menimpa hasil baru (race condition).
11. **Custom hook** — ekstrak logika fetch dari latihan 10 menjadi `useFetch<T>(url)`, lalu pakai di dua komponen berbeda.
12. **Context tema** — buat toggle dark/light mode dengan Context. Jelaskan kenapa Context lebih baik daripada meneruskan prop lewat 4 level komponen.
13. **Routing** — buat 3 halaman (Home, Daftar, Detail) dengan React Router; halaman Detail menerima `id` lewat URL (`useParams`).

> Aturan: setiap latihan harus bisa kamu jelaskan **kenapa ditulis begitu**. Kalau tidak bisa, ulangi dengan versi lebih kecil sampai bisa.

## Project

Project portofolio fase ini: **`react-dashboard`** (repo terpisah, dibuat saat fase ini dimulai).

**Spesifikasi ringkas:**

- Dashboard dengan **minimal 3 halaman/route** (mis. Overview, Data, Detail) memakai React Router.
- Data diambil dari **REST API publik** (mis. `jsonplaceholder`, `dummyjson`) dengan pola `loading` / `error` / `data` yang konsisten.
- Minimal satu **form** (pencarian/filter) yang controlled dan memengaruhi tampilan data.
- Minimal satu **custom hook** (mis. `useFetch`) yang dipakai ulang.
- Komponen dipisah berdasarkan tanggung jawab (bukan satu file raksasa).
- Styling rapi & responsive (minimal jalan di mobile dan desktop).
- Ada penanganan kondisi kosong ("belum ada data") dan error yang ramah.
- TypeScript dengan tipe props/state yang jelas; hindari `any`.
- README menjelaskan cara menjalankan, struktur folder, dan keputusan desain.

**Kriteria yang dinilai mentor (review seperti senior dev):**

- Bisa menjelaskan **state apa saja yang ada**, di mana ia hidup, dan siapa yang mengubahnya.
- Tidak ada `useEffect` yang tidak perlu; dependency array benar dan tidak ada warning.
- `key` pada list stabil & unik.
- Tidak ada logika bisnis yang tersebar di JSX; komponen tetap terbaca.
- Bisa menjelaskan kapan komponen re-render dan kenapa.
- Commit history rapi, README jelas, project bisa dijalankan orang lain.

> Perbandingan penting: buka lagi project `interactive-web-no-framework` (phase-02). Lihat bagian mana yang di vanilla JS kamu harus lakukan manual (buat elemen, pasang listener, ubah DOM), lalu lihat bagaimana React mengotomatiskan itu. **Itu inti fase ini.**

## Checklist Kelulusan

Fase ini **lulus** jika semua poin terukur di bawah terpenuhi. Jangan lanjut ke phase-04 sebelum ini selesai.

**Pemahaman (dinilai lewat penjelasan ke mentor)**

- [ ] Bisa menjelaskan `UI = f(state)` dan bedanya dengan manipulasi DOM manual.
- [ ] Bisa menjelaskan kapan sebuah komponen re-render dan apa yang memicunya.
- [ ] Bisa menjelaskan **snapshot per render** dan kenapa update state bersifat "asynchronous" dari sudut pandang kode.
- [ ] Bisa menjelaskan apa itu **reconciliation** dan peran `key`.
- [ ] Bisa menjelaskan **kapan `useEffect` diperlukan dan kapan tidak**.
- [ ] Bisa menjelaskan kenapa cleanup di `useEffect` penting (contoh: timer / fetch).
- [ ] Bisa menjelaskan beda state lokal, lifting state, dan Context — kapan pakai yang mana.

**Praktik**

- [ ] Menyelesaikan **13 latihan** di atas dan semuanya ter-commit.
- [ ] Menulis ulang todo list React dari nol tanpa melihat referensi, lalu menjelaskan tiap bagiannya.
- [ ] Bisa memakai React DevTools untuk memeriksa props & state sebuah komponen.
- [ ] Tidak ada warning React di console pada project akhir (key, dependency, dll.).

**Project & Git**

- [ ] Project `react-dashboard` **lulus review** mentor (struktur, state, routing, fetching, error handling, tipe).
- [ ] Riwayat Git rapi: branch `phase-03/nama-singkat`, Conventional Commits, **minimal satu Pull Request** yang kamu self-review sebelum merge.
- [ ] Project bisa dijalankan orang lain dengan mengikuti README-nya.
- [ ] Bisa menjelaskan alur data project-mu: user action → state berubah → re-render → UI berubah.

**Refleksi**

- [ ] Menulis ringkasan akhir fase: 3 hal yang paling mengubah cara berpikirmu soal UI, dan 1 hal yang masih ingin diperdalam.
- [ ] Menuliskan pertanyaan yang ingin dibawa ke phase-04 (backend).

## Referensi

- **React — Learn (dokumentasi resmi)**: <https://react.dev/learn> (rujukan utama; baca *Describing the UI*, *Adding Interactivity*, *Managing State*, *Escape Hatches*).
- **React — Thinking in React**: <https://react.dev/learn/thinking-in-react>.
- **React — Synchronizing with Effects**: <https://react.dev/learn/synchronizing-with-effects> (kapan pakai & tidak pakai `useEffect`).
- **React — You Might Not Need an Effect**: <https://react.dev/learn/you-might-not-need-an-effect> (baca ini minimal dua kali).
- **React — Rendering Lists / `key`**: <https://react.dev/learn/rendering-lists>.
- **React — Reusing Logic with Custom Hooks**: <https://react.dev/learn/reusing-logic-with-custom-hooks>.
- **React Router**: <https://reactrouter.com/start/library/routing>.
- **React DevTools**: <https://react.dev/learn/react-developer-tools>.
- **MDN — Using Fetch**: <https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch> (ulangi dari phase-02, sekarang dalam konteks effect).

> Catatan: jangan hafal API. Pahami model `state → render`, lalu API React jadi cara untuk mengekspresikan model itu. Kalau bingung, kembali ke pertanyaan: **"state-nya apa, dan apa yang berubah?"**
