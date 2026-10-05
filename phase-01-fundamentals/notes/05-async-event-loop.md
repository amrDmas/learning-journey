# 05 — Asynchronous Programming & Event Loop

> Bagian dari `phase-01-fundamentals` | Topik ini **KRUSIAL** untuk JD Full Stack Developer (async programming & event-driven processing).
> Prasyarat: kamu sudah paham `function`, `callback`, scope, dan closure (lihat notes sebelumnya).

---

## Daftar Isi

1. [Sinkron vs Asinkron](#1-sinkron-vs-asinkron)
2. [Kenapa JS Single-Threaded Tapi Non-Blocking?](#2-kenapa-js-single-threaded-tapi-non-blocking)
3. [Event Loop — Mesin di Balik Semuanya](#3-event-loop--mesin-di-balik-semuanya)
4. [Trace Urutan Eksekusi Lengkap](#4-trace-urutan-eksekusi-lengkap)
5. [Callback & Callback Hell](#5-callback--callback-hell)
6. [Promise](#6-promise)
7. [Combinator Promise](#7-combinator-promise)
8. [async / await](#8-async--await)
9. [Error Handling Async](#9-error-handling-async)
10. [AbortController & Cancellation](#10-abortcontroller--cancellation)
11. [Timers: setTimeout & setInterval](#11-timers-settimeout--setinterval)
12. [Pengantar fetch & HTTP Dasar](#12-pengantar-fetch--http-dasar)
13. [Race Condition — Contoh Nyata](#13-race-condition--contoh-nyata)
14. [Ringkasan Kata Sendiri](#14-ringkasan-kata-sendiri)

---

## 1. Sinkron vs Asinkron

### Sinkron

Kode sinkron dieksekusi **baris per baris, berurutan**. Baris berikutnya menunggu baris sebelumnya selesai. Kalau ada satu baris yang lambat, seluruh program berhenti menunggu.

```js
console.log("1");
console.log("2");
console.log("3");
// Output:
// 1
// 2
// 3
```

Tidak ada kejutan. Urutan di kode = urutan di output.

### Asinkron

Kode asinkron **tidak menunggu**. Operasi yang butuh waktu lama (baca file, request jaringan, query database) dijadwalkan, lalu program lanjut ke baris berikutnya. Hasilnya datang belakangan.

```js
console.log("1");

setTimeout(() => {
  console.log("2"); // dijalankan belakangan
}, 1000);

console.log("3");
// Output:
// 1
// 3
// 2   <-- muncul setelah ~1 detik
```

### Kenapa asinkron penting?

Bayangkan kamu meminta data dari server yang butuh 2 detik.

- **Sinkron (kalau JS mengizinkan):** seluruh aplikasi — UI, tombol, animasi — membeku 2 detik. Browser bisa "Not Responding".
- **Asinkron:** request dikirim, aplikasi tetap responsif, dan ketika data tiba, callback/promise-nya dijalankan.

> **Mental model kunci:** asinkron bukan berarti "jalan bersamaan secara fisik". Di JavaScript, kode tetap jalan satu per satu. Yang asinkron adalah **penjadwalan**-nya — operasi lambat diserahkan ke luar, lalu hasilnya dikembalikan lewat antrean.

---

## 2. Kenapa JS Single-Threaded Tapi Non-Blocking?

### Satu thread

JavaScript punya **satu call stack** — satu "pekerja" yang mengeksekusi kode. Artinya hanya satu instruksi JS yang benar-benar berjalan pada satu waktu. Tidak ada dua potong kode JS yang berjalan benar-benar bersamaan.

### Non-blocking

Meskipun hanya punya satu pekerja, JS tidak macet saat menunggu operasi lambat. Caranya: **operasi lambat tidak dikerjakan oleh thread JS**, melainkan diserahkan ke sistem di luar JS.

| Lingkungan | Siapa yang mengerjakan operasi lambat |
|---|---|
| Browser | **Web APIs** (disediakan browser: timer, `fetch`, DOM events) |
| Node.js | **Node APIs / libuv** (thread pool untuk file I/O, DNS, dsb.) |

Thread JS hanya menerima **notifikasi** saat operasi selesai, lalu menjalankan callback-nya.

```
        ┌──────────────┐
        │  Call Stack  │  <-- satu-satunya tempat kode JS berjalan
        └──────┬───────┘
               │ operasi lambat diserahkan
               ▼
     ┌───────────────────────┐
     │  Web API / Node API   │  (timer, fetch, file I/O, ...)
     └──────────┬────────────┘
                │ selesai -> callback masuk antrean
        ┌───────┴────────┐
        ▼                ▼
┌────────────────┐ ┌────────────────┐
│ Microtask      │ │ Macrotask      │
│ Queue          │ │ Queue          │
│ (Promise.then, │ │ (setTimeout,   │
│  queueMicro-   │ │  setInterval,  │
│  task)         │ │  I/O)          │
└───────┬────────┘ └───────┬────────┘
        │                  │
        └────────┬─────────┘
                 ▼
          ┌──────────────┐
          │  Event Loop  │  <-- kuras SEMUA microtask dulu,
          └──────┬───────┘      baru ambil SATU macrotask
                 │ callback dipindahkan
                 ▼
        ┌──────────────┐
        │  Call Stack  │  (callback dijalankan)
        └──────────────┘
```

> **Perhatikan:** ada **DUA antrean terpisah**, bukan satu. Event Loop menguras habis **Microtask Queue** lebih dulu, baru mengambil **satu** tugas dari **Macrotask Queue** (detail di bagian 3).

> **Intinya:** "single-threaded" merujuk pada eksekusi JS-nya. "Non-blocking" berasal dari kemampuan menyerahkan pekerjaan ke luar. Kombinasi ini disebut **concurrency** (bukan parallelism) — banyak tugas ditangani bergantian, bukan benar-benar bersamaan.

---

## 3. Event Loop — Mesin di Balik Semuanya

Event loop adalah loop tanpa henti yang tugasnya sederhana:

> **"Kalau call stack kosong, ambil tugas berikutnya dari antrean dan jalankan."**

### Komponen

| Komponen | Peran |
|---|---|
| **Call Stack** | Tumpukan fungsi yang sedang dieksekusi. LIFO (terakhir masuk, pertama keluar). |
| **Web API / Node API** | Tempat operasi asinkron ditangani (di luar thread JS). |
| **Microtask Queue** | Antrean prioritas tinggi. Isinya callback dari `Promise.then`, `queueMicrotask`, `MutationObserver`. |
| **Macrotask Queue** (Task Queue) | Antrean prioritas normal. Isinya callback dari `setTimeout`, `setInterval`, event I/O. |
| **Event Loop** | Memindahkan tugas dari antrean ke call stack. |

### Aturan urutan (PENTING — hafalkan mental model ini)

1. Jalankan semua kode **sinkron** sampai call stack kosong.
2. Setelah call stack kosong, **kuras SEMUA microtask** sampai habis.
3. Ambil **SATU macrotask**, jalankan sampai selesai.
4. Setelah macrotask selesai, **kuras lagi semua microtask** yang baru muncul.
5. Ulangi langkah 3–4.

> **Rumus singkat:**
> `Sinkron → (semua) Microtask → 1 Macrotask → (semua) Microtask → 1 Macrotask → ...`

**Konsekuensi paling sering ditanya:** `Promise.then` (microtask) **selalu** dijalankan sebelum `setTimeout(..., 0)` (macrotask), walaupun `setTimeout` ditulis lebih dulu di kode.

---

## 4. Trace Urutan Eksekusi Lengkap

### Contoh 1 — Dasar

```js
console.log("A"); // sinkron

setTimeout(() => {
  console.log("B"); // macrotask
}, 0);

Promise.resolve().then(() => {
  console.log("C"); // microtask
});

console.log("D"); // sinkron
```

**Prediksi output:**

```
A
D
C
B
```

**Penelusuran langkah demi langkah:**

| Langkah | Aksi |
|---|---|
| 1 | `console.log("A")` masuk call stack, langsung jalan → cetak `A`. |
| 2 | `setTimeout` dipanggil → callback diserahkan ke Web API. Timer 0ms habis → callback masuk **macrotask queue**. |
| 3 | `Promise.resolve().then(...)` → callback `then` masuk **microtask queue**. |
| 4 | `console.log("D")` jalan → cetak `D`. Call stack kosong. |
| 5 | Event loop cek microtask queue → ada `C` → cetak `C`. |
| 6 | Microtask habis. Ambil macrotask → cetak `B`. |

### Contoh 2 — Microtask Menghasilkan Microtask

```js
setTimeout(() => console.log("timeout"), 0);

Promise.resolve()
  .then(() => {
    console.log("promise 1");
    return Promise.resolve(); // menghasilkan microtask baru
  })
  .then(() => console.log("promise 2"));

console.log("sync");
```

**Prediksi output:**

```
sync
promise 1
promise 2
timeout
```

**Kenapa?** Microtask queue dikuras **sampai benar-benar habis**. Saat menjalankan `promise 1`, muncul microtask baru (`promise 2`). Microtask baru ini ikut dikuras **sebelum** macrotask `timeout` dijalankan.

### Contoh 3 — Async/Await Mengubah Segalanya

```js
async function foo() {
  console.log("foo start");
  await null; // titik "yield"
  console.log("foo after await");
}

console.log("script start");
foo();
console.log("script end");
```

**Prediksi output:**

```
script start
foo start
script end
foo after await
```

**Penjelasan:** Saat `await` ditemukan, `foo` **dijeda** dan sisanya (`console.log("foo after await")`) dijadwalkan sebagai microtask. Kontrol kembali ke pemanggil, sehingga `script end` jalan dulu. Setelah stack kosong, microtask melanjutkan `foo`.

> **Catatan:** `await null` (atau `await` nilai apa pun) selalu memunculkan minimal satu tick microtask, walaupun nilainya bukan promise.

---

## 5. Callback & Callback Hell

### Callback

Callback adalah fungsi yang diberikan sebagai argumen dan dipanggil **setelah** operasi selesai.

```js
function ambilData(id, callback) {
  setTimeout(() => {
    callback({ id, nama: "Dimas" });
  }, 500);
}

ambilData(1, (user) => {
  console.log("User:", user.nama);
});
```

### Callback Hell

Masalah muncul ketika operasi asinkron **berurutan** dan saling bergantung. Callback bersarang di dalam callback.

```js
ambilUser(1, (user) => {
  ambilPesanan(user.id, (pesanan) => {
    ambilDetail(pesanan[0].id, (detail) => {
      ambilPembayaran(detail.id, (pembayaran) => {
        // ...makin dalam, makin sulit dibaca
        console.log(pembayaran);
      });
    });
  });
});
```

Masalahnya bukan sekadar "jelek":

- **Piramida miring** — sulit dibaca dan di-review.
- **Error handling berulang** — harus cek error di setiap level.
- **Sulit dikomposisi** — mengambil sebagian alur untuk dipakai ulang jadi sulit.
- **Inversi kontrol** — kamu menyerahkan kendali ke library, bukan sebaliknya.

> **Solusi modern:** Promise dan `async/await` (bagian berikutnya) dibuat persis untuk mengatasi masalah ini.

---

## 6. Promise

Promise adalah **objek yang merepresentasikan hasil operasi asinkron yang belum tentu selesai**. Anggap saja "janji" yang nanti akan ditepati (berhasil) atau dilanggar (gagal).

### Tiga State

| State | Arti | Transisi |
|---|---|---|
| **pending** | Belum selesai | Awal |
| **fulfilled** | Berhasil, punya nilai | pending → fulfilled |
| **rejected** | Gagal, punya alasan (error) | pending → rejected |

> **Aturan:** begitu settled (fulfilled/rejected), state **tidak bisa berubah lagi**. Ini yang membuat Promise bisa di-`then` berkali-kali dengan hasil yang sama.

### Executor

Promise dibuat dengan `new Promise(executor)`. Executor menerima dua fungsi: `resolve` dan `reject`.

```js
const janji = new Promise((resolve, reject) => {
  const sukses = true;
  setTimeout(() => {
    if (sukses) {
      resolve("Data berhasil diambil"); // -> fulfilled
    } else {
      reject(new Error("Gagal mengambil data")); // -> rejected
    }
  }, 1000);
});
```

> **Penting:** executor dijalankan **sinkron** saat `new Promise` dipanggil. Yang asinkron adalah kapan `resolve`/`reject` dipanggil.

### then / catch / finally

```js
janji
  .then((hasil) => {
    console.log("Sukses:", hasil);
  })
  .catch((err) => {
    console.log("Error:", err.message);
  })
  .finally(() => {
    console.log("Selesai — baik sukses maupun gagal");
  });
```

| Method | Kapan jalan | Menerima |
|---|---|---|
| `.then(onFulfilled)` | Saat fulfilled | nilai hasil |
| `.catch(onRejected)` | Saat rejected | error |
| `.finally(cb)` | Selalu, setelah settled | tidak menerima nilai |

### Chaining & Nilai Balik then

Kunci kekuatan Promise adalah **chaining**. `.then` selalu mengembalikan **Promise baru**.

```js
Promise.resolve(2)
  .then((n) => n * 3)        // return 6 (nilai biasa)
  .then((n) => n + 4)        // return 10
  .then((n) => {
    console.log(n);          // 10
  });
```

**Aturan nilai balik `then`:**

| Yang di-return di dalam `.then` | Promise berikutnya |
|---|---|
| Nilai biasa (`6`) | fulfilled dengan `6` |
| Promise (`Promise.resolve(6)`) | menunggu promise itu, lalu fulfilled dengan hasilnya |
| Melempar error (`throw`) | rejected dengan error itu |
| Tidak return apa-apa | fulfilled dengan `undefined` |

```js
// Contoh: mengembalikan promise di dalam then -> "flattening"
Promise.resolve(1)
  .then((n) => {
    return new Promise((resolve) => setTimeout(() => resolve(n + 10), 100));
  })
  .then((n) => console.log(n)); // 11, setelah 100ms
```

> Inilah yang membuat alur berurutan (seperti callback hell di atas) menjadi rata dan mudah dibaca.

---

## 7. Combinator Promise

Saat perlu menangani **banyak promise sekaligus**.

### `Promise.all` — semua harus berhasil

```js
const p1 = fetch("/api/users").then((r) => r.json());
const p2 = fetch("/api/orders").then((r) => r.json());
const p3 = fetch("/api/products").then((r) => r.json());

const [users, orders, products] = await Promise.all([p1, p2, p3]);
```

- Mengembalikan array hasil, **urutannya sesuai input**.
- **Gagal cepat (fail-fast):** kalau satu rejected, seluruh `Promise.all` langsung rejected.

**Kapan pakai:** ketika semua hasil **wajib ada** dan saling tidak bergantung.

### `Promise.allSettled` — tunggu semua, apapun hasilnya

```js
const hasil = await Promise.allSettled([p1, p2, p3]);

// hasil = [
//   { status: "fulfilled", value: ... },
//   { status: "rejected", reason: ... },
//   ...
// ]
```

- **Tidak pernah** rejected (kecuali inputnya bukan iterable).
- Mengembalikan status tiap promise.

**Kapan pakai:** ketika kamu ingin **tahu hasil semua** walaupun ada yang gagal — misalnya kirim notifikasi ke banyak user, atau health-check beberapa service.

### `Promise.race` — yang pertama settled menang

```js
const cepat = fetch("/api/data");
const timeout = new Promise((_, reject) =>
  setTimeout(() => reject(new Error("Timeout")), 3000)
);

try {
  const data = await Promise.race([cepat, timeout]);
} catch (err) {
  console.error(err.message); // "Timeout" kalau fetch > 3 detik
}
```

- Mengembalikan hasil promise **pertama yang settled** (fulfilled **atau** rejected).

**Kapan pakai:** timeout, atau mengambil hasil dari sumber tercepat.

### `Promise.any` — yang pertama *berhasil* menang

```js
const hasil = await Promise.any([
  fetch("https://server-a.example.com/data"),
  fetch("https://server-b.example.com/data"),
]);
```

- Mengembalikan promise **pertama yang fulfilled**.
- Mengabaikan yang rejected, **kecuali semua** rejected → melempar `AggregateError`.

**Kapan pakai:** fallback ke beberapa mirror/server — ambil yang pertama berhasil.

### Tabel Perbandingan

| Combinator | Selesai kapan | Kalau ada yang reject | Hasil |
|---|---|---|---|
| `Promise.all` | semua fulfilled | langsung reject | array nilai |
| `Promise.allSettled` | semua settled | tidak pernah reject | array `{status, value/reason}` |
| `Promise.race` | pertama settled | bisa reject (kalau yang pertama reject) | nilai/error pertama |
| `Promise.any` | pertama fulfilled | reject hanya jika **semua** reject | nilai pertama sukses |

---

## 8. async / await

`async/await` adalah **syntax sugar** di atas Promise. Ia tidak menggantikan Promise — ia membuatnya lebih mudah dibaca. Di balik layar, tetap ada Promise dan microtask.

### Fungsi async selalu mengembalikan Promise

```js
async function halo() {
  return "hai";
}

// ekuivalen dengan:
function halo() {
  return Promise.resolve("hai");
}

halo().then((v) => console.log(v)); // "hai"
```

### await

`await` menunggu sebuah promise selesai, lalu **mengembalikan nilainya**. Saat `await` dijalankan, fungsi dijeda dan kontrol kembali ke pemanggil.

```js
async function ambilUser(id) {
  const res = await fetch(`/api/users/${id}`); // tunggu fetch
  const user = await res.json();              // tunggu parsing
  return user;
}
```

### try/catch untuk error

```js
async function ambilUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Gagal ambil user:", err.message);
    throw err; // lempar ulang supaya pemanggil bisa tangani
  }
}
```

### Berurutan vs Paralel (SANGAT PENTING)

**Salah — berurutan tanpa perlu (lambat):**

```js
// Total waktu = 1s + 1s + 1s = 3 detik
const a = await ambilA(); // tunggu 1s
const b = await ambilB(); // tunggu 1s lagi
const c = await ambilC(); // tunggu 1s lagi
```

**Benar — paralel (jauh lebih cepat):**

```js
// Total waktu = max(1s, 1s, 1s) = 1 detik
const [a, b, c] = await Promise.all([ambilA(), ambilB(), ambilC()]);
```

> **Aturan praktis:** kalau operasi **tidak saling bergantung**, jalankan paralel. Kalau hasil B butuh hasil A, barulah berurutan.

### Kesalahan Umum: await di dalam loop

**Kasus 1 — for...of dengan await (berurutan):**

```js
// Berurutan. Kalau tiap iterasi 1s dan ada 10 item -> 10 detik.
for (const id of ids) {
  const user = await ambilUser(id);
  console.log(user);
}
```

Kadang ini **memang** yang diinginkan (misal rate-limit API, atau urutan wajib).

**Kasus 2 — ingin paralel di dalam loop:**

```js
// PARALEL: mulai semua request dulu, baru tunggu semua
const users = await Promise.all(ids.map((id) => ambilUser(id)));
```

**Kasus 3 — `forEach` dengan `await` (JEBAKAN):**

```js
// ❌ SALAH: forEach tidak menunggu await di dalamnya!
ids.forEach(async (id) => {
  const user = await ambilUser(id);
  console.log(user);
});
console.log("Selesai"); // jalan SEBELUM semua user selesai dicetak
```

`forEach` tidak peduli callback-nya async. Ia hanya memanggil semua callback lalu lanjut. Gunakan `for...of` atau `Promise.all(map(...))`.

---

## 9. Error Handling Async

Error pada operasi asinkron **tidak** bisa ditangkap `try/catch` sinkron biasa kalau tidak di-`await`.

### Di dalam fungsi async

```js
async function main() {
  try {
    const data = await ambilData();
    return data;
  } catch (err) {
    console.error("Gagal:", err);
    throw err;
  }
}
```

### Promise tanpa catch = unhandled rejection

```js
// ❌ Kalau gagal, error "hilang" (unhandled promise rejection)
ambilData().then((data) => console.log(data));

// ✅ Selalu tangani
ambilData()
  .then((data) => console.log(data))
  .catch((err) => console.error(err));
```

### Menangkap error dari callback async

```js
// ❌ try/catch TIDAK menangkap error dari callback async
try {
  setTimeout(() => {
    throw new Error("boom"); // tidak tertangkap try/catch di luar
  }, 100);
} catch (err) {
  console.log("Tidak akan tercetak");
}
```

### Pola hasil (result pattern)

Alternatif selain throw — mengembalikan objek sukses/gagal secara eksplisit. Berguna untuk error yang **diharapkan** (bukan bug).

```js
async function ambilUser(id) {
  try {
    const res = await fetch(`/api/users/${id}`);
    if (!res.ok) return { ok: false, error: `HTTP ${res.status}` };
    return { ok: true, data: await res.json() };
  } catch (err) {
    return { ok: false, error: err.message };
  }
}

const hasil = await ambilUser(1);
if (hasil.ok) {
  console.log(hasil.data);
} else {
  console.error(hasil.error);
}
```

> **Kapan pakai yang mana?** Gunakan `throw` untuk error tak terduga (bug, kegagalan infrastruktur). Gunakan result pattern untuk kegagalan yang wajar (validasi, 404).

---

## 10. AbortController & Cancellation

Operasi asinkron yang berjalan lama kadang perlu **dibatalkan** — misalnya user mengetik cepat (search) atau berpindah halaman.

`AbortController` menyediakan `signal` yang bisa dipakai untuk membatalkan operasi.

### Dasar

```js
const controller = new AbortController();

// Batalkan setelah 2 detik
setTimeout(() => controller.abort(), 2000);

try {
  const res = await fetch("/api/data", { signal: controller.signal });
  const data = await res.json();
} catch (err) {
  if (err.name === "AbortError") {
    console.log("Request dibatalkan");
  } else {
    console.error("Error lain:", err);
  }
}
```

### Kasus nyata — batalkan request sebelumnya (search-as-you-type)

```js
let controllerTerakhir = null;

async function cari(query) {
  // Batalkan request sebelumnya kalau masih berjalan
  if (controllerTerakhir) {
    controllerTerakhir.abort();
  }
  controllerTerakhir = new AbortController();

  try {
    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`, {
      signal: controllerTerakhir.signal,
    });
    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") return null; // diabaikan, memang dibatalkan
    throw err;
  }
}
```

> **Kenapa penting?** Tanpa pembatalan, request lama yang lambat bisa tiba **setelah** request baru, dan menimpa hasil yang benar. Ini contoh **race condition** (lihat bagian 13).

> **Catatan:** `AbortController` juga bisa dipakai untuk operasi lain yang menerima `signal`, tidak hanya `fetch`.

---

## 11. Timers: setTimeout & setInterval

### setTimeout — jalankan sekali setelah delay

```js
const id = setTimeout(() => {
  console.log("muncul setelah 1 detik");
}, 1000);

// Batalkan jika perlu
clearTimeout(id);
```

### setInterval — jalankan berulang setiap delay

```js
const id = setInterval(() => {
  console.log("tick");
}, 1000);

// WAJIB dibatalkan, kalau tidak akan jalan selamanya
clearInterval(id);
```

### Fakta penting yang sering disalahpahami

1. **Delay bukan jaminan waktu eksekusi.** `setTimeout(fn, 100)` berarti "jalankan **setidaknya** setelah 100ms", bukan "tepat 100ms". Kalau call stack sedang sibuk, callback menunggu lebih lama.

2. **`setTimeout(fn, 0)` tetap asinkron.** Callback tetap masuk macrotask queue, jadi baru jalan setelah kode sinkron dan semua microtask selesai.

```js
console.log("a");
setTimeout(() => console.log("b"), 0);
console.log("c");
// Output: a, c, b
```

3. **Akurasi tidak presisi.** Timer di-throttle browser (misal tab tidak aktif) dan bergantung beban sistem. Untuk animasi, gunakan `requestAnimationFrame` (khusus browser).

4. **Bahaya `setInterval` dengan kerja async lebih lama dari interval.** Kalau callback butuh 2s tapi interval 1s, callback bisa menumpuk. Lebih aman pakai pola `setTimeout` rekursif:

```js
async function poll() {
  await kerjaYangLama();
  setTimeout(poll, 1000); // baru jadwalkan ulang SETELAH selesai
}
poll();
```

---

## 12. Pengantar fetch & HTTP Dasar

`fetch` adalah API untuk melakukan request HTTP. Di browser ia selalu tersedia; di Node.js modern (18+) juga tersedia secara global.

### Bentuk dasar

```js
const res = await fetch("https://api.example.com/users/1");
const data = await res.json();
console.log(data);
```

### fetch TIDAK melempar error untuk status HTTP gagal

Ini jebakan klasik: `fetch` hanya melempar error untuk **kegagalan jaringan**, bukan untuk status 404 atau 500.

```js
const res = await fetch("/api/tidak-ada");

console.log(res.ok);     // false (status 404)
console.log(res.status); // 404

// ❌ Ini TIDAK akan masuk catch
// ✅ Harus cek manual:
if (!res.ok) {
  throw new Error(`HTTP ${res.status}`);
}
```

### Method & body

```js
const res = await fetch("/api/users", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    // "Authorization": "Bearer <token>",
  },
  body: JSON.stringify({ nama: "Dimas" }),
});
```

### HTTP Dasar (yang perlu kamu tahu)

| Method | Fungsi umum |
|---|---|
| `GET` | Ambil data |
| `POST` | Buat data baru |
| `PUT` | Ganti seluruh resource |
| `PATCH` | Ubah sebagian |
| `DELETE` | Hapus |

| Status | Arti |
|---|---|
| `2xx` | Sukses (200 OK, 201 Created, 204 No Content) |
| `4xx` | Error dari sisi client (400 Bad Request, 401 Unauthorized, 404 Not Found) |
| `5xx` | Error dari sisi server (500 Internal Server Error) |

### Pola helper yang aman

```js
async function requestJson(url, options = {}) {
  const res = await fetch(url, options);

  if (!res.ok) {
    throw new Error(`HTTP ${res.status} ${res.statusText}`);
  }

  // 204 = tidak ada body
  if (res.status === 204) return null;

  return res.json();
}
```

> **Catatan:** `res.json()` hanya bisa dipanggil **sekali** — body response adalah stream yang habis setelah dibaca.

---

## 13. Race Condition — Contoh Nyata

Race condition terjadi ketika hasil bergantung pada **urutan kejadian** yang tidak dijamin. Dalam async, ini sering muncul.

### Contoh: Search-as-you-type tanpa pembatalan

```js
let hasilTerakhir = "";

async function cari(query) {
  const res = await fetch(`/api/search?q=${query}`);
  const data = await res.json();
  hasilTerakhir = data; // ⚠️ bisa ditimpa hasil lama!
}

cari("a"); // request 1, lambat (misal 800ms)
cari("ab"); // request 2, cepat (misal 100ms)
```

**Yang bisa terjadi:**

1. `cari("a")` dikirim.
2. `cari("ab")` dikirim.
3. Request `"ab"` selesai lebih dulu → `hasilTerakhir = hasil "ab"` ✅
4. Request `"a"` baru selesai (lambat) → `hasilTerakhir = hasil "a"` ❌ **menimpa yang benar!**

User melihat hasil untuk `"a"` padahal yang diketik `"ab"`.

**Solusi (pakai AbortController dari bagian 10):**

```js
let controllerTerakhir = null;

async function cari(query) {
  if (controllerTerakhir) controllerTerakhir.abort();
  controllerTerakhir = new AbortController();

  try {
    const res = await fetch(`/api/search?q=${query}`, {
      signal: controllerTerakhir.signal,
    });
    return await res.json();
  } catch (err) {
    if (err.name === "AbortError") return null; // request lama dibatalkan
    throw err;
  }
}
```

### Contoh lain: counter dengan async

```js
let saldo = 100;

async function tarik(jumlah) {
  const saldoSaatIni = saldo;   // baca
  await tunggu(10);             // jeda async
  saldo = saldoSaatIni - jumlah; // tulis
}

// Dijalankan "bersamaan":
tarik(30); // baca 100 -> tulis 70
tarik(50); // baca 100 -> tulis 50  ❌ kehilangan update dari tarik(30)!
```

Keduanya membaca `100` sebelum yang lain menulis, sehingga update pertama hilang. **Solusi:** serialkan operasi (antre), atau gunakan mekanisme atomik di sisi backend/database (transaksi, optimistic locking).

> **Pelajaran:** setiap kali kamu "baca → tunggu async → tulis", curigai race condition. Ini alasan pentingnya `await` yang tepat dan pembatalan.

---

## 14. Ringkasan Kata Sendiri

> **Tugas kamu:** jangan hanya baca ringkasan ini. Tulis ulang dengan kata-kata kamu sendiri di `notes/05-async-event-loop.md` bagian ini, lalu jelaskan ke mentor. Kalau kamu bisa menjelaskannya tanpa melihat catatan, kamu benar-benar paham.

- **Sinkron** = berurutan, menunggu. **Asinkron** = tidak menunggu, hasilnya belakangan.
- **JS single-threaded** (satu call stack), tapi **non-blocking** karena operasi lambat diserahkan ke Web API / Node API di luar thread JS.
- **Event loop** memindahkan tugas dari antrean ke call stack saat stack kosong.
- **Urutan pasti:** kode sinkron → **semua microtask** (`Promise.then`, `queueMicrotask`) → 1 macrotask (`setTimeout`, I/O) → semua microtask lagi → ulangi.
- **Promise** punya 3 state: pending → fulfilled / rejected. State akhir tidak bisa berubah.
- **`.then` mengembalikan Promise baru** → bisa di-chain; nilai balik menentukan hasil berikutnya.
- **Combinator:** `all` (semua berhasil, fail-fast), `allSettled` (tunggu semua), `race` (pertama settled), `any` (pertama berhasil).
- **async/await** = gula sintaks di atas Promise. Fungsi `async` selalu mengembalikan Promise. `await` menjeda fungsi dan menjadwalkan sisanya sebagai microtask.
- **Paralel vs berurutan:** operasi independen → `Promise.all`; operasi bergantung → `await` berurutan.
- **Jebakan:** `forEach(async ...)` tidak menunggu; `await` di dalam loop membuat berurutan.
- **Error async** harus ditangani dengan `try/catch` **di dalam** fungsi async, atau `.catch` pada Promise. Callback async yang throw tidak tertangkap `try/catch` luar.
- **AbortController** untuk membatalkan operasi (`fetch` dan lainnya yang menerima `signal`).
- **setTimeout/setInterval**: delay itu minimum, bukan jaminan. `setTimeout(fn, 0)` tetap async.
- **fetch tidak melempar error untuk 4xx/5xx** — cek `res.ok` manual.
- **Race condition** muncul saat hasil bergantung pada urutan async yang tidak dijamin; solusinya pembatalan atau serialisasi.

---

## Latihan

Kerjakan di file terpisah (misal `exercises/05-async.ts`), lalu jalankan dengan `tsx exercises/05-async.ts` (atau `node exercises/05-async.js` bila file-nya `.js` — Node biasa tidak bisa langsung menjalankan `.ts`), dan **prediksi output sebelum menjalankan**.

### Latihan 1 — Prediksi urutan

```js
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

Promise.resolve().then(() => {
  console.log("4");
  return Promise.resolve();
}).then(() => console.log("5"));

console.log("6");
```

Tulis prediksimu, baru jalankan. Cocokkan dengan aturan di bagian 3.

### Latihan 2 — async/await vs Promise

Ubah fungsi berikut dari gaya `.then` ke `async/await`, dan sebaliknya:

```js
function ambilProfil(id) {
  return fetch(`/api/users/${id}`)
    .then((res) => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then((user) => fetch(`/api/posts?userId=${user.id}`))
    .then((res) => res.json());
}
```

### Latihan 3 — Paralel vs berurutan

Diberikan array `ids = [1, 2, 3, 4, 5]`, tulis dua versi fungsi yang mengambil semua user:

1. Versi berurutan (for...of + await).
2. Versi paralel (`Promise.all` + `map`).

Ukur waktunya (misal dengan `console.time`). Berapa selisihnya?

### Latihan 4 — Timeout helper

Buat fungsi `denganTimeout(promise, ms)` yang mengembalikan promise baru: kalau `promise` selesai sebelum `ms`, kembalikan hasilnya; kalau lewat, reject dengan error timeout. Gunakan `Promise.race`.

### Latihan 5 — Batalkan pencarian

Buat simulasi search-as-you-type: fungsi `cari(query)` yang memakai `AbortController`. Panggil berurutan dengan delay berbeda dan pastikan hasil dari request lama tidak menimpa yang baru.

### Latihan 6 — Perbaiki bug

```js
async function prosesSemua(ids) {
  const hasil = [];
  ids.forEach(async (id) => {
    const data = await ambilData(id);
    hasil.push(data);
  });
  return hasil; // kenapa ini sering kosong / tidak lengkap?
}
```

Jelaskan bug-nya, lalu perbaiki.

---

## Checklist Paham

Centang hanya kalau kamu bisa menjelaskan **tanpa melihat catatan**:

- [ ] Bisa menggambar diagram call stack, Web API, microtask queue, macrotask queue.
- [ ] Bisa menelusuri urutan output `setTimeout` vs `Promise.then` vs sinkron, langkah demi langkah.
- [ ] Bisa menjelaskan kenapa `Promise.then` selalu lebih dulu dari `setTimeout(..., 0)`.
- [ ] Bisa menjelaskan kenapa JS single-threaded tapi non-blocking.
- [ ] Bisa menulis ulang callback hell menjadi promise chain dan async/await.
- [ ] Bisa menjelaskan 3 state Promise dan aturan nilai balik `.then`.
- [ ] Bisa memilih combinator yang tepat (`all` / `allSettled` / `race` / `any`) sesuai situasi.
- [ ] Bisa menjelaskan bedanya `await` berurutan vs `Promise.all` paralel, dan kapan pakai masing-masing.
- [ ] Bisa menjelaskan kenapa `forEach(async ...)` salah.
- [ ] Bisa memakai `AbortController` untuk membatalkan request.
- [ ] Bisa menjelaskan kenapa `fetch` tidak melempar error untuk 404.
- [ ] Bisa memberi satu contoh race condition dan cara memperbaikinya.

---

## Referensi

- MDN — [Event Loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Event_loop)
- MDN — [Using Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises)
- MDN — [async function](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function)
- MDN — [Promise](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise)
- MDN — [AbortController](https://developer.mozilla.org/en-US/docs/Web/API/AbortController)
- MDN — [Using Fetch](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch)
- Jake Archibald — [In The Loop](https://www.youtube.com/watch?v=cCOL7MC4Pl0) (video event loop, sangat direkomendasikan)
- Philip Roberts — [What the heck is the event loop anyway?](https://www.youtube.com/watch?v=8aGhZQkoFbQ)

---

*Catatan ini bagian dari `phase-01-fundamentals`. Setelah selesai, lanjut ke `06-...` dan kerjakan project `cli-data-tool`.*
