# Phase 04 — Node.js & Backend Fundamentals

> Durasi: 3 minggu (4+ jam/hari) | Prasyarat: [phase-03-react](../phase-03-react/README.md) selesai (React, fetch, async) + mental model JS dari phase-01 | Status: belum mulai

## Tujuan Pembelajaran

Di akhir fase ini kamu bisa:

1. **Menjelaskan runtime Node.js**: beda Node vs browser, apa yang tersedia di Node (dan yang tidak), dan kenapa JS bisa jalan di server.
2. **Menjelaskan event loop Node** dan beda fase-fasenya (timer, I/O, microtask) serta kenapa I/O non-blocking penting untuk server.
3. **Menggunakan module system**: beda ESM (`import`/`export`) vs CommonJS (`require`/`module.exports`), dan cara mengaturnya di `package.json`.
4. **Mengelola file & path** dengan `fs`/`fs/promises` dan `path` (baca/tulis file, path lintas OS).
5. **Mengelola project Node**: `npm`, `package.json`, dependency vs devDependency, scripts, dan `.gitignore` yang benar.
6. **Mengelola environment variables** dengan `.env` dan menjelaskan kenapa secret tidak boleh masuk Git.
7. **Membuat HTTP server** dasar dengan modul `http`, lalu membandingkannya dengan framework **Express/Fastify**.
8. **Membangun REST API**: routing, middleware, request/response, dan struktur project backend yang sehat.
9. **Memvalidasi input** dari client dan menolak data yang tidak valid dengan pesan jelas.
10. **Menangani error API** dengan konsisten (status code tepat, format error seragam, tidak bocorkan stack trace).
11. **Menambahkan logging** dan memahami perannya untuk debugging & monitoring.
12. **Menerapkan authentication dasar** (JWT atau session) dan menjelaskan alur login.
13. **Menjelaskan cara koneksi ke database** (sekilas) dan prinsip desain REST API yang baik.
14. **Menyelesaikan project `rest-api-node`** yang lulus review.

## Mental Model — Kenapa, bukan cuma Apa

Backend itu bukan "React tapi di server". Backend adalah **program yang menunggu event, memproses, lalu membalas**. Pahami model ini, dan semua framework backend jadi sekadar lapisan kenyamanan.

| Model | Pertanyaan yang dijawab | Konsep yang bergantung padanya |
| --- | --- | --- |
| **Node = runtime + event loop** | "Kenapa satu proses Node bisa melayani banyak request sekaligus?" | I/O non-blocking, concurrency, performa |
| **Request → middleware → handler → response** | "Di mana kode saya dijalankan dalam siklus request?" | Express/Fastify, middleware, auth |
| **Stateless vs stateful** | "Apakah server saya perlu mengingat client?" | JWT vs session, scaling, Cloud Functions |
| **Kontrak API** | "Apa yang saya janjikan ke client?" | REST design, status code, versioning, dokumentasi |
| **Gagal dengan benar** | "Apa yang terjadi kalau input jelek / DB down?" | Error handling, reliability, keamanan |
| **Konfigurasi ≠ kode** | "Kenapa koneksi DB beda di lokal dan produksi?" | environment variables, 12-factor, deployment |

> Aturan emas fase ini: **pikirkan kontrak, bukan implementasi.** Sebelum menulis handler, tulis dulu: endpoint apa, menerima apa, membalas apa, dan gagal bagaimana. Implementasi jadi jauh lebih mudah.

### Kenapa event loop Node penting untuk server

Node berjalan di **satu thread**. Kalau kamu menulis kode sinkron yang berat (mis. loop jutaan kali), **seluruh server berhenti** melayani request. Kunci performa Node adalah **tidak memblokir event loop**: operasi I/O (baca file, query DB, panggil API) dijalankan asinkron dan hasilnya masuk kembali sebagai event.

```js
// SALAH: memblokir event loop — server tidak bisa melayani request lain selama loop ini.
function hitungBerat() {
  let total = 0;
  for (let i = 0; i < 5_000_000_000; i++) total += i;
  return total;
}

// BENAR: I/O asinkron — event loop bebas melayani request lain sambil menunggu.
import { readFile } from "node:fs/promises";

async function bacaKonfigurasi() {
  const isi = await readFile("./config.json", "utf8");
  return JSON.parse(isi);
}
```

### Contoh: HTTP server dasar (tanpa framework)

> **Agar `import` jalan, tambahkan `"type": "module"` di `package.json`** (atau beri
> ekstensi `.mjs` pada file). Tanpa itu, `node server-dasar.js` akan gagal dengan
> `SyntaxError: Cannot use import statement outside a module`. Hal yang sama berlaku
> untuk contoh `app.js` dan `config.js` di bawah — lihat topik 02 (Module system).

```js
// server-dasar.js — jalankan dengan: node server-dasar.js
import { createServer } from "node:http";

const server = createServer((req, res) => {
  // Routing manual: bandingkan method + URL.
  if (req.method === "GET" && req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok" }));
    return;
  }

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not Found" }));
});

server.listen(3000, () => {
  console.log("Server jalan di http://localhost:3000");
});
```

> Perhatikan betapa repotnya: setiap route harus dicek manual, parsing body harus ditulis sendiri, error harus diurus manual. **Inilah masalah yang dipecahkan framework** — bukan sihir, tapi abstraksi.

### Contoh: REST API dengan Express + validasi + error handling

```js
// app.js — contoh kerangka; install express terlebih dahulu: npm i express
import express from "express";

const app = express();
app.use(express.json()); // parsing body JSON

// "Database" sederhana di memori, hanya untuk latihan.
let todos = [
  { id: 1, title: "Belajar Node", done: false },
];
let nextId = 2;

// Middleware logging sederhana (di produksi pakai library seperti pino/morgan).
app.use((req, _res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// GET /todos — ambil semua
app.get("/todos", (_req, res) => {
  res.json(todos);
});

// POST /todos — buat baru + validasi input
app.post("/todos", (req, res) => {
  const { title } = req.body ?? {};

  // Validasi: jangan percaya input dari client.
  if (typeof title !== "string" || title.trim() === "") {
    return res.status(400).json({
      error: { code: "INVALID_TITLE", message: "title wajib string non-kosong" },
    });
  }

  const todo = { id: nextId++, title: title.trim(), done: false };
  todos.push(todo);
  res.status(201).json(todo); // 201 Created
});

// DELETE /todos/:id — hapus berdasarkan id
app.delete("/todos/:id", (req, res) => {
  const id = Number(req.params.id);
  const index = todos.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({
      error: { code: "NOT_FOUND", message: `Todo ${id} tidak ditemukan` },
    });
  }

  todos.splice(index, 1);
  res.status(204).end(); // 204 No Content
});

// Error handler terpusat — WAJIB di akhir, setelah semua route.
// Menerima 4 argumen: (err, req, res, next) — itu tanda khusus di Express.
app.use((err, _req, res, _next) => {
  console.error(err); // di produksi: log terstruktur, jangan bocorkan ke client
  res.status(500).json({
    error: { code: "INTERNAL", message: "Terjadi kesalahan di server" },
  });
});

app.listen(3000, () => console.log("API jalan di http://localhost:3000"));
```

### Contoh: environment variables & struktur project

```bash
# .env  — JANGAN commit file ini!
PORT=3000
DATABASE_URL=postgres://user:pass@localhost:5432/app
JWT_SECRET=ganti-dengan-rahasia-panjang-acak
```

```js
// config.js — baca & validasi konfigurasi di satu tempat.
import "dotenv/config"; // memuat .env ke process.env (pakai paket dotenv)

function wajib(nama) {
  const nilai = process.env[nama];
  if (!nilai) throw new Error(`Env var ${nama} wajib diisi`);
  return nilai;
}

export const config = {
  port: Number(process.env.PORT ?? 3000),
  databaseUrl: wajib("DATABASE_URL"),
  jwtSecret: wajib("JWT_SECRET"),
};
```

```text
rest-api-node/
├── src/
│   ├── index.js          # entry: jalankan server
│   ├── app.js            # definisi app (routing, middleware)
│   ├── config.js         # konfigurasi dari env
│   ├── routes/           # definisi endpoint per resource
│   ├── controllers/      # logika handler (req → service → res)
│   ├── services/         # logika bisnis, bebas dari HTTP
│   ├── middleware/       # auth, validasi, error handler
│   └── utils/            # helper
├── .env                  # (tidak di-commit)
├── .env.example          # contoh (di-commit)
├── .gitignore
├── package.json
└── README.md
```

### Contoh: authentication dasar (JWT) — alur, bukan hafalan

```text
1. Client POST /auth/login { email, password }
2. Server cek kredensial → kalau valid, terbitkan token (mis. JWT) berisi { userId }
3. Client menyimpan token (mis. di memori atau localStorage)
4. Client mengirim token di setiap request berikutnya secara manual lewat header
   Authorization: Bearer <token> (lihat middleware di bawah)
5. Middleware di server memverifikasi token sebelum meneruskan ke handler
6. Kalau token tidak valid/kadaluarsa → 401 Unauthorized
```

> **Dua mekanisme pengiriman token — jangan dicampur.** Alur di atas memakai **Bearer
> token** karena middleware contoh di bawah memang membacanya dari header
> `Authorization`. Ingat: token di **httpOnly cookie tidak bisa dibaca JavaScript**,
> jadi client tidak mungkin memasangnya ke header `Authorization` — cookie dikirim
> otomatis oleh browser lewat header `Cookie`.
> - **Bearer (memori/localStorage):** client menempelkan token manual di header; cocok
>   untuk API lintas domain. Trade-off: `localStorage` rentan XSS (skrip jahat bisa
>   membacanya), jadi simpan di memori bila bisa.
> - **httpOnly cookie:** browser mengirim otomatis; token tidak terbaca JS sehingga
>   lebih aman dari XSS. Trade-off: perlu penanganan CSRF, dan server membaca cookie
>   (mis. `req.cookies.token`), bukan header `Authorization`.
>
> Pilih **satu** dan pakai konsisten di client maupun middleware.

```js
// middleware/auth.js — kerangka verifikasi token (pakai library seperti jsonwebtoken)
export function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Token tidak ada" },
    });
  }

  try {
    // verify() akan throw kalau token tidak valid atau kadaluarsa.
    req.user = verifyToken(token); // fungsi verifikasi milikmu
    next();
  } catch {
    res.status(401).json({
      error: { code: "UNAUTHORIZED", message: "Token tidak valid" },
    });
  }
}
```

> Prinsip keamanan: **jangan pernah menyimpan password mentah.** Simpan hash (mis. bcrypt/argon2). Dan jangan taruh JWT_SECRET di kode — selalu di env.

## Materi & Urutan Belajar

Kerjakan berurutan. Perkiraan: 1–2 hari per topik.

| # | Topik | Isi utama | Kenapa penting untuk JD |
| --- | --- | --- | --- |
| 01 | **Runtime Node & event loop Node** | Beda Node vs browser, event loop, I/O non-blocking, blocking vs non-blocking | Asynchronous programming & reliability (poin JD) |
| 02 | **Module system** | ESM vs CJS, `import`/`export`, `require`, `type: "module"` | Menata & membaca codebase besar |
| 03 | **fs & path** | Baca/tulis file (`fs/promises`), `path.join`/`resolve`, `__dirname` di ESM | Automasi/internal tools (poin JD) |
| 04 | **npm & package.json** | install/uninstall, dependencies vs devDependencies, scripts, lockfile | Manajemen project profesional |
| 05 | **Environment variables** | `.env`, `process.env`, `.env.example`, kenapa secret tidak masuk Git | Keamanan & deployment |
| 06 | **HTTP server dasar** | Modul `http`, `req`/`res`, header, status code, body | Memahami apa yang framework abstraksikan |
| 07 | **Express / Fastify** | Routing, middleware, error handler, kenapa framework dipakai | Framework utama di JD |
| 08 | **Routing & middleware** | Path params, query, middleware chain, urutan middleware | Arsitektur API |
| 09 | **Request/response & validasi input** | Body, params, query, header; validasi manual & library (mis. zod) | Keamanan & robustness |
| 10 | **Struktur project backend** | Layer route/controller/service, pemisahan tanggung jawab | Maintainable, codebase besar |
| 11 | **Error handling API** | Status code tepat, format error seragam, error handler terpusat | Reliability & UX API |
| 12 | **Logging** | Log terstruktur, level (info/warn/error), kenapa `console.log` tidak cukup | Monitoring & debugging produksi |
| 13 | **Authentication dasar** | Hash password, JWT vs session, middleware auth, alur login | Keamanan — poin JD |
| 14 | **Koneksi ke DB (sekilas)** | Pool koneksi, query async, env var koneksi, kenapa DB di luar Node | Jembatan ke phase-05 |
| 15 | **REST API design** | Resource, method, status code, idempotensi, versioning, konsistensi | Kontrak API yang baik |

### Tabel status code REST yang sering dipakai

| Code | Arti | Kapan dipakai |
| --- | --- | --- |
| `200 OK` | Sukses | `GET`/`PUT`/`PATCH` berhasil |
| `201 Created` | Dibuat | `POST` berhasil membuat resource |
| `204 No Content` | Sukses tanpa body | `DELETE` berhasil |
| `400 Bad Request` | Input salah | Validasi gagal |
| `401 Unauthorized` | Belum login / token invalid | Auth gagal |
| `403 Forbidden` | Login, tapi tidak berhak | Akses ditolak |
| `404 Not Found` | Resource tidak ada | ID tidak ditemukan |
| `409 Conflict` | Bentrok state | Duplikat email, dll. |
| `500 Internal Server Error` | Salah server | Bug / exception tak tertangani |

> Baca ini pelan-pelan: **400 itu salah client, 500 itu salah server.** Membedakannya adalah kebiasaan yang membedakan backend developer amatir dan profesional.

## Latihan

Latihan dikerjakan di folder `latihan/` atau di repo project, lalu di-commit.

1. **Event loop Node** — buat skrip yang mencampur `console.log` sinkron, `process.nextTick`, `Promise.then`, `setTimeout(0)`, dan `setImmediate`. Prediksi urutannya, lalu jalankan dan jelaskan.
2. **Blocking vs non-blocking** — buat server yang punya endpoint `/berat` (loop besar, sinkron) dan `/ringan`. Panggil `/berat` lalu `/ringan` bersamaan; amati `/ringan` ikut tertunda. Perbaiki dengan `setImmediate`/worker atau jelaskan kenapa tidak boleh begini.
3. **fs & path** — buat skrip CLI yang membaca file JSON, memodifikasinya, lalu menulisnya kembali. Tangani kasus file tidak ada & JSON rusak.
4. **npm scripts** — buat `package.json` dengan scripts: `start`, `dev`, `lint`. Jelaskan beda `dependencies` dan `devDependencies` dan beri contoh masing-masing.
5. **Env & .gitignore** — buat `.env` + `.env.example`, baca `process.env.PORT`, dan pastikan `.env` tidak ikut ter-commit.
6. **HTTP server murni** — buat server `http` dengan 3 endpoint: `/health`, `/hello`, dan 404 untuk sisanya. Tanpa framework.
7. **Express pertama** — ubah latihan 6 menjadi Express. Bandingkan jumlah kode dan jelaskan apa yang Express tangani otomatis.
8. **CRUD lengkap** — buat REST API todo (GET list, GET by id, POST, PUT/PATCH, DELETE) dengan data in-memory. Status code harus tepat.
9. **Validasi input** — tambahkan validasi ke semua endpoint; kembalikan `400` dengan format error yang konsisten saat input salah.
10. **Error handler terpusat** — buat satu middleware error handler; lempar error dari handler dan pastikan client menerima format seragam, bukan stack trace.
11. **Logging** — tambahkan middleware logging (method, path, status, durasi). Jelaskan kenapa `console.log` biasa kurang untuk produksi.
12. **Auth JWT** — buat `/auth/register` (hash password!), `/auth/login` (terbitkan token), dan satu endpoint terproteksi yang butuh token valid.
13. **Struktur project** — refactor CRUD-mu ke struktur `routes/controllers/services`. Jelaskan tanggung jawab tiap layer.
14. **Desain REST** — tulis kontrak API (tabel endpoint) untuk satu domain pilihanmu sebelum menulis kodenya. Minta review mentor soal konsistensi.

> Aturan: untuk latihan API, **uji dengan tool nyata** (curl, Postman, atau Thunder Client), bukan hanya "kayaknya jalan".

## Project

Project portofolio fase ini: **`rest-api-node`** (repo terpisah, dibuat saat fase ini dimulai).

**Spesifikasi ringkas:**

- REST API untuk satu domain nyata (mis. manajemen tugas, katalog produk, atau catatan keuangan).
- Framework: **Express** atau **Fastify** (pilih satu, konsisten).
- **CRUD lengkap** dengan status code HTTP yang tepat.
- **Validasi input** di semua endpoint yang menerima data, dengan format error konsisten.
- **Error handling terpusat** + tidak membocorkan detail internal ke client.
- **Logging** request (method, path, status, durasi).
- **Authentication** minimal: register/login + minimal satu endpoint terproteksi.
- **Konfigurasi via env** (`.env` + `.env.example`), secret tidak masuk Git.
- Struktur project berlapis (route/controller/service) — bukan satu file raksasa.
- Data boleh in-memory dulu (DB masuk di phase-05); tapi rancang agar mudah diganti sumbernya.
- **TypeScript** (disarankan) atau JavaScript dengan tipe yang jelas.
- README menjelaskan cara menjalankan, daftar endpoint, dan contoh request/response.

**Kriteria yang dinilai mentor (review seperti senior dev):**

- Kontrak API konsisten: penamaan resource, method, dan status code.
- Validasi tidak bisa dilewati; server tidak crash karena input aneh.
- Error dari server selalu berformat sama dan tidak membocorkan stack trace.
- Tidak ada secret/hardcoded config di kode.
- Layer terpisah jelas: HTTP tidak bercampur dengan logika bisnis.
- Bisa menjelaskan alur satu request dari masuk sampai response.
- Commit history rapi, README jelas, project bisa dijalankan orang lain.

> Perhatikan koneksinya: API ini akan menjadi backend yang dikonsumsi React di **phase-06 (fullstack)**. Jadi rancang kontraknya dengan baik sejak sekarang.

## Checklist Kelulusan

Fase ini **lulus** jika semua poin terukur di bawah terpenuhi. Jangan lanjut ke phase-05 sebelum ini selesai.

**Pemahaman (dinilai lewat penjelasan ke mentor)**

- [ ] Bisa menjelaskan beda Node.js dan browser serta apa yang ada/hilang di masing-masing.
- [ ] Bisa menjelaskan event loop Node dan kenapa kode sinkron berat berbahaya untuk server.
- [ ] Bisa menjelaskan beda ESM dan CommonJS serta cara mengaturnya.
- [ ] Bisa menjelaskan beda `dependencies` dan `devDependencies`.
- [ ] Bisa menjelaskan kenapa secret harus di env dan tidak boleh di-commit.
- [ ] Bisa menjelaskan apa yang framework (Express/Fastify) tangani dibanding `http` murni.
- [ ] Bisa menjelaskan peran middleware dan kenapa urutannya penting.
- [ ] Bisa menjelaskan beda status code 400, 401, 403, 404, dan 500 dengan contoh.
- [ ] Bisa menjelaskan alur login berbasis token (JWT) atau session, dan kenapa password harus di-hash.

**Praktik**

- [ ] Menyelesaikan **14 latihan** di atas dan semuanya ter-commit.
- [ ] Bisa menguji API dengan tool nyata (curl/Postman/Thunder Client) dan membaca hasilnya.
- [ ] Menulis satu endpoint dari nol tanpa melihat referensi, lalu menjelaskan tiap barisnya.
- [ ] Bisa menemukan penyebab error 500 di log dan memperbaikinya.

**Project & Git**

- [ ] Project `rest-api-node` **lulus review** mentor (CRUD, validasi, error handling, auth, logging, struktur, env).
- [ ] Riwayat Git rapi: branch `phase-04/nama-singkat`, Conventional Commits, **minimal satu Pull Request** yang kamu self-review sebelum merge.
- [ ] `.env` **tidak** ikut ter-commit; `.env.example` ada.
- [ ] Project bisa dijalankan orang lain dengan mengikuti README-nya.
- [ ] Bisa menjelaskan alur satu request dari client sampai response.

**Refleksi**

- [ ] Menulis ringkasan akhir fase: 3 hal yang paling mengubah cara berpikirmu soal backend, dan 1 hal yang masih ingin diperdalam.
- [ ] Menuliskan pertanyaan yang ingin dibawa ke phase-05 (database).

## Referensi

- **Node.js — Learn**: <https://nodejs.org/en/learn> (event loop, module system, file system).
- **Node.js — Docs (API)**: <https://nodejs.org/api/> (rujukan `fs`, `path`, `http`).
- **Node.js — Event Loop, Timers, and `nextTick`**: <https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick>.
- **MDN — HTTP**: <https://developer.mozilla.org/en-US/docs/Web/HTTP> (method, status, header).
- **Express — Getting started**: <https://expressjs.com/en/starter/installing.html> dan **Guide**: <https://expressjs.com/en/guide/routing.html>.
- **Fastify — Docs**: <https://fastify.dev/docs/latest/>.
- **REST API design** — Microsoft REST API Guidelines: <https://github.com/microsoft/api-guidelines> (prinsip konsistensi).
- **Zod** (validasi schema): <https://zod.dev/>.
- **JWT — Introduction**: <https://jwt.io/introduction>.
- **OWASP — Password Storage Cheat Sheet**: <https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html>.
- **The Twelve-Factor App** (konfigurasi & env): <https://12factor.net/config>.

> Catatan: fokus pada **kontrak & alur**, bukan hafal API framework. Framework bisa berganti (Express → Fastify), tapi model "request → middleware → handler → response" tetap sama.
