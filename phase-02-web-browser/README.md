# Phase 02 — Web & Browser Fundamentals

> Durasi: 2 minggu (4+ jam/hari) | Prasyarat: [phase-01-fundamentals](../phase-01-fundamentals/README.md) selesai (mental model JS: scope, closure, event loop, async) | Status: belum mulai

## Tujuan Pembelajaran

Di akhir fase ini kamu bisa:

1. **Menjelaskan perjalanan sebuah request** dari mengetik URL sampai halaman tampil: DNS → TCP → TLS → HTTP request → response → render. Bukan hafalan, tapi alur sebab-akibat.
2. **Membaca HTTP dengan percaya diri**: method (`GET`/`POST`/`PUT`/`PATCH`/`DELETE`), status code (2xx/3xx/4xx/5xx), header, body, dan cookie.
3. **Menjelaskan cara browser merender**: HTML → DOM, CSS → CSSOM, gabungan menjadi render tree, lalu layout → paint. Paham kenapa **reflow** mahal dan **repaint** lebih murah.
4. **Menulis HTML semantik** dan menjelaskan kenapa `<button>` lebih baik daripada `<div onclick>`, serta dampaknya ke aksesibilitas & SEO.
5. **Menguasai CSS layout**: box model (`content`/`padding`/`border`/`margin`, `box-sizing`), Flexbox, Grid, dan responsive design (unit relatif, media query, mobile-first).
6. **Memakai DOM API & event**: `querySelector`, `createElement`, `addEventListener`, event bubbling, event delegation, dan form validation.
7. **Menggunakan DevTools** untuk investigasi nyata: tab **Network** (lihat request/response, status, timing) dan tab **Application** (cookie, localStorage, cache).
8. **Membuat aplikasi web interaktif tanpa framework** — membuktikan bahwa React hanyalah lapisan di atas API browser yang sama.

## Mental Model — Kenapa, bukan cuma Apa

Fase ini menyerang satu miskonsepsi besar: **"React itu sihir"**. Sebelum masuk React, kamu harus tahu apa yang sebenarnya terjadi di browser. Kalau tidak, kamu akan pakai React tanpa paham — persis masalah "kode jalan tapi tidak paham kenapa".

Model inti yang dibangun:

| Model | Pertanyaan yang dijawab | Konsep yang bergantung padanya |
| --- | --- | --- |
| **Client–server & HTTP** | "Siapa yang minta, siapa yang menjawab, dalam format apa?" | REST API, fetch, status code, auth, caching |
| **DNS → TCP → TLS → HTTP** | "Kenapa ada jeda sebelum response datang?" | performa, latency, HTTPS, keamanan |
| **DOM sebagai pohon objek** | "Kenapa JS bisa mengubah halaman padahal HTML itu teks statis?" | `querySelector`, React virtual DOM, rendering |
| **Render pipeline (parse → layout → paint)** | "Kenapa animasi pakai `top/left` lebih berat dari `transform`?" | performa, reflow/repaint, UX |
| **Event flow (capture → target → bubble)** | "Kenapa klik anak memicu handler induk?" | event delegation, handler React, form |
| **CSS sebagai sistem layout** | "Kenapa elemen ini tidak mau di tengah?" | Flexbox, Grid, responsive, styling React |

> Aturan emas fase ini: **buka DevTools untuk setiap hal baru yang kamu pelajari.** Jangan percaya "katanya" — lihat request, lihat style yang dihitung (computed), lihat event yang terpasang. Browser adalah laboratoriummu.

## Materi & Urutan Belajar

Kerjakan berurutan. Perkiraan: 1–2 hari per topik, dengan latihan menyertai.

| # | Topik | Isi utama | Kenapa penting untuk JD Full Stack |
| --- | --- | --- | --- |
| 01 | **Cara kerja internet & HTTP** | Client–server, request/response, method, status code, header, body, cookie | Fondasi REST API & integrasi pihak ketiga; membaca error response |
| 02 | **DNS, TCP, TLS (sekilas)** | Resolusi nama domain, handshake koneksi, HTTPS/encryption | Memahami latency, kenapa HTTPS wajib, debugging koneksi |
| 03 | **Browser rendering** | HTML → DOM, CSS → CSSOM, render tree, layout, paint; reflow vs repaint | Performa UI; memahami kenapa React reconciliation dibuat |
| 04 | **HTML semantik** | Struktur dokumen, elemen semantik (`header`/`nav`/`main`/`section`/`article`/`footer`), form, aksesibilitas dasar | Kode maintainable, SEO, aksesibilitas — standar kerja tim |
| 05 | **CSS layout: box model & units** | Box model, `box-sizing`, unit (`px`/`rem`/`em`/`%`/`vw`/`vh`), display | Dasar semua styling; rem vs px penting untuk responsive |
| 06 | **Flexbox** | Sumbu utama/lintang, `justify-content`, `align-items`, `gap`, `flex` shorthand | Layout satu dimensi; paling sering dipakai |
| 07 | **Grid** | Baris/kolom, `grid-template`, `gap`, area, `fr` | Layout dua dimensi; dashboard (project phase-03) |
| 08 | **Responsive design** | Mobile-first, media query, breakpoint, `max-width`/`min-width`, gambar responsif | Aplikasi harus jalan di layar apa pun |
| 09 | **DOM API & event** | `querySelector`, `createElement`, `append`, `addEventListener`, bubbling, delegation | Interaksi tanpa framework; dasar React event |
| 10 | **Form & validasi** | `input` types, `required`, `pattern`, validasi JS, `preventDefault`, aksesibilitas form | Form adalah inti hampir semua aplikasi bisnis |
| 11 | **DevTools: Network & Application** | Inspeksi request, status, timing; cookie, localStorage, cache | Debugging harian; wajib untuk kerja backend/frontend |

### Contoh alur request (gambaran besar)

```text
1. Kamu ketik https://contoh.com/data
2. DNS   : "contoh.com" → IP address server (mis. 93.184.216.34)
3. TCP   : buka koneksi ke IP itu (3-way handshake)
4. TLS   : negosiasi enkripsi (kalau https://)
5. HTTP  : kirim "GET /data HTTP/1.1" + header
6. Server: proses, balas "200 OK" + body (HTML/JSON)
7. Browser: parse HTML → bangun DOM → render
```

### Contoh: fetch JSON dan render ke DOM (vanilla, tanpa framework)

```js
// Ambil data dari API, lalu render daftar ke halaman.
async function muatData() {
  const daftar = document.querySelector("#daftar");
  daftar.textContent = "Memuat...";

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/users");
    if (!res.ok) {
      // fetch TIDAK throw untuk status 4xx/5xx — kita yang harus cek res.ok
      throw new Error(`Request gagal: ${res.status}`);
    }
    const users = await res.json();

    daftar.innerHTML = ""; // bersihkan sebelum render ulang
    for (const user of users) {
      const li = document.createElement("li");
      li.textContent = `${user.name} — ${user.email}`;
      daftar.append(li);
    }
  } catch (err) {
    daftar.textContent = `Terjadi error: ${err.message}`;
  }
}

document.querySelector("#tombol").addEventListener("click", muatData);
```

### Contoh: event delegation (satu listener untuk banyak elemen)

```js
// Alih-alih memasang listener ke tiap <li>, pasang ke induknya.
// Klik pada <li> akan "bubble" naik ke <ul>, tempat kita menanganinya.
const daftar = document.querySelector("#daftar");

daftar.addEventListener("click", (event) => {
  const li = event.target.closest("li");
  if (!li) return; // klik di area kosong <ul>
  console.log("Item diklik:", li.textContent);
});
```

## Latihan

Latihan dikerjakan langsung di browser/editor, lalu di-commit. Fokus pada **observasi lewat DevTools**, bukan sekadar "hasilnya jalan".

1. **Inspeksi request nyata** — buka sebuah situs, buka tab **Network**, muat ulang halaman, dan catat: berapa request, mana yang HTML, mana yang CSS/JS/gambar, status code masing-masing. Jelaskan ke mentor kenapa satu halaman bisa memicu puluhan request.
2. **Simulasi status code** — pakai `fetch` ke API publik (mis. `jsonplaceholder.typicode.com`), lalu sengaja minta endpoint yang tidak ada (`/users/999999`) dan tangani `res.ok === false`. Jelaskan kenapa `fetch` tidak otomatis throw.
3. **HTML semantik** — ambil satu halaman HTML yang penuh `<div>` (buatan sendiri), lalu refactor jadi elemen semantik. Jelaskan perbaikan yang didapat (aksesibilitas, keterbacaan).
4. **Box model visual** — buat 3 kotak dengan `width`, `padding`, `border`, `margin` berbeda; bandingkan `box-sizing: content-box` vs `border-box`. Buktikan lewat DevTools (bagian *computed*).
5. **Flexbox playground** — buat navbar (logo kiri, menu kanan) dan kartu berjajar. Lakukan **hanya** dengan Flexbox. Jelaskan beda `justify-content` dan `align-items`.
6. **Grid dashboard** — buat layout dashboard 3 kolom × 2 baris dengan Grid, lalu ubah jadi 1 kolom di layar kecil via media query.
7. **DOM interaktif** — buat todo list sederhana: tambah, hapus, tandai selesai — pakai `createElement` + `addEventListener`. **Tulis ulang dari nol** setelah selesai.
8. **Event delegation** — modifikasi todo list agar hanya ada **satu** listener di `<ul>` yang menangani semua klik item. Jelaskan konsep bubbling.
9. **Form & validasi** — buat form registrasi dengan validasi HTML (`required`, `type="email"`, `minlength`) **dan** validasi JS; cegah submit kalau tidak valid dengan `preventDefault()`.
10. **DevTools Application** — simpan sesuatu di `localStorage`, lihat di tab Application, muat ulang halaman, dan baca lagi. Jelaskan beda `localStorage`, `sessionStorage`, dan cookie (sekilas).

> Aturan: setiap latihan harus bisa kamu **jelaskan kenapa** kodenya begitu, bukan hanya "berhasil jalan".

## Project

Project portofolio fase ini: **`interactive-web-no-framework`** (repo terpisah, dibuat saat fase ini dimulai).

**Aturan utama: tanpa framework.** Tujuannya membuktikan kamu paham API browser mentah sebelum dibantu React. Kalau langsung pakai framework, kamu akan "jalan tanpa paham".

**Spesifikasi ringkas:**

- Aplikasi web satu halaman dengan **HTML semantik**, **CSS** (Flexbox/Grid, responsive), dan **vanilla JavaScript**.
- Minimal satu interaksi data nyata: `fetch` ke API publik (atau data lokal), lalu render hasilnya ke DOM.
- Minimal satu form dengan validasi (HTML + JS).
- Ada state yang dikelola sendiri (mis. filter, pencarian, atau penambahan item) dan UI yang re-render saat state berubah.
- Error handling: request gagal / input tidak valid harus menampilkan pesan yang ramah, bukan diam saja.
- Struktur file rapi: `index.html`, `styles/`, `scripts/` yang dipisah berdasarkan tanggung jawab.
- README project menjelaskan cara menjalankan dan keputusan desain.

**Kriteria yang dinilai mentor (review seperti senior dev):**

- HTML semantik & aksesibilitas dasar (label form, `alt` gambar, kontras warna).
- Layout tidak berantakan di layar kecil (mobile) maupun besar.
- Tidak ada manipulasi DOM yang berulang-ulang tanpa alasan; state dan render dipisah rapi.
- Bisa menjelaskan alur data: dari user action → state berubah → DOM diperbarui.
- Commit history rapi, README jelas, project bisa dijalankan orang lain.

> Perhatikan: yang kamu bangun di sini (state → render, event handler, fetch, conditional rendering) **adalah** konsep yang sama yang akan React otomatiskan di phase-03. Simpan project ini — kamu akan membandingkannya.

## Checklist Kelulusan

Fase ini **lulus** jika semua poin terukur di bawah terpenuhi. Jangan lanjut ke phase-03 sebelum ini selesai.

**Pemahaman (dinilai lewat penjelasan ke mentor)**

- [ ] Bisa menjelaskan perjalanan request dari URL sampai render, dengan kata sendiri.
- [ ] Bisa menjelaskan beda method HTTP dan kapan memakai masing-masing.
- [ ] Bisa menjelaskan makna kelas status code (2xx/3xx/4xx/5xx) dan memberi contoh nyata.
- [ ] Bisa menjelaskan apa itu DNS, TCP, dan TLS serta perannya (sekilas, tidak perlu hafal detail).
- [ ] Bisa menjelaskan DOM dan kenapa JS bisa mengubah halaman yang awalnya teks statis.
- [ ] Bisa menjelaskan render pipeline dan beda **reflow** vs **repaint**.
- [ ] Bisa menjelaskan beda `localStorage`, `sessionStorage`, dan cookie.

**Praktik**

- [ ] Menyelesaikan **10 latihan** di atas dan semuanya ter-commit.
- [ ] Menulis ulang todo list DOM dari nol tanpa melihat referensi, lalu menjelaskan tiap bagiannya.
- [ ] Bisa menggunakan tab **Network** untuk menemukan request yang gagal dan membaca status code-nya.
- [ ] Bisa menggunakan tab **Application** untuk memeriksa cookie / localStorage.

**Project & Git**

- [ ] Project `interactive-web-no-framework` **lulus review** mentor (HTML semantik, layout responsive, interaksi data, error handling, struktur).
- [ ] Riwayat Git rapi: branch `phase-02/nama-singkat`, Conventional Commits, **minimal satu Pull Request** yang kamu self-review sebelum merge.
- [ ] Project bisa dijalankan orang lain dengan mengikuti README-nya.
- [ ] Bisa menjelaskan alur data project-mu sendiri: user action → state → render.

**Refleksi**

- [ ] Menulis ringkasan akhir fase: konsep web mana yang paling mengubah caramu melihat "halaman web", dan apa yang masih kabur.
- [ ] Menuliskan satu pertanyaan yang ingin kamu bawa ke phase-03 (React).

## Referensi

- **MDN — How the web works**: <https://developer.mozilla.org/en-US/docs/Learn/Getting_started_with_the_web/How_the_Web_works>.
- **MDN — HTTP overview**: <https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview> dan **Status codes**: <https://developer.mozilla.org/en-US/docs/Web/HTTP/Status>.
- **MDN — HTML elements reference**: <https://developer.mozilla.org/en-US/docs/Web/HTML/Element> (pakai untuk memilih elemen semantik yang tepat).
- **MDN — CSS layout**: <https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout> (box model, Flexbox, Grid).
- **A Complete Guide to Flexbox** (CSS-Tricks): <https://css-tricks.com/snippets/css/a-guide-to-flexbox/>.
- **A Complete Guide to Grid** (CSS-Tricks): <https://css-tricks.com/snippets/css/complete-guide-grid/>.
- **MDN — DOM introduction**: <https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction> dan **Events**: <https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Building_blocks/Events>.
- **MDN — Client-side form validation**: <https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation>.
- **Chrome DevTools docs**: <https://developer.chrome.com/docs/devtools/> (tab Network & Application).
- **web.dev — Learn Performance / rendering**: <https://web.dev/learn/performance/> (reflow, paint, critical rendering path).

> Catatan: jangan menghafal daftar status code atau properti CSS. Pahami *kelompoknya* (2xx = sukses, 4xx = salahmu, 5xx = salah server) dan pakai DevTools/dokumentasi saat butuh detail.
