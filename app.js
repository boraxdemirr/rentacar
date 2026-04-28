const sql = require("mssql");
const ortakStil = `
<style>
   body {
    margin: 0;
    padding: 40px;
    font-family: Arial, sans-serif;
    background-image: url('/gercekresim.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
}
    /* Menü çubuğunun (Sarı şerit) sabit kalması için */
    .navbar {
        background: #f1c40f;
        padding: 15px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        position: fixed;
        top: 0;
        width: 100%;
        z-index: 1000;
    }
</style>
`;

const config = {
    user: "nodeuser",
    password: "1234",
    server: "DESKTOP-V9Q55BF",
    database: "RentACar",
    port: 1433,
    options: {
        trustServerCertificate: true,
        encrypt: false
    },
    connectionTimeout: 5000,
    requestTimeout: 5000
};

const express = require("express");
const app = express();
app.use(express.static("public"));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));
app.get("/test", (req, res) => {
    res.send("test tamam");
});
app.get("/arabalar", async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query("SELECT * FROM dbo.AracTablosu");

        let kartlar = "";

        result.recordset.forEach(arac => {
            kartlar += `
                <div style="
                    background:white;
                    padding:20px;
                    border-radius:12px;
                    width:260px;
                    box-shadow:0 4px 10px rgba(0,0,0,0.1);
                    text-align:center;
                ">
                    <h2>${arac.marka} ${arac.model}</h2>
                    <p><b>Model Yılı:</b> ${arac.modelYılı}</p>
                    <p><b>Günlük Ücret:</b> ${arac.gunlukKiraUcreti} TL</p>
                    <p><b>Yakıt Türü:</b> ${arac.yakitTuru}</p>
                    <p><b>Araç Tipi:</b> ${arac.aracTipi}</p>
                    <p><b>Durum:</b> ${arac.durum}</p>
                    <p><b>Fotoğraf:</b> ${arac.fotografYolu}</p>
                    <form method="POST" action="/arac-sil/${arac.aracID}">
    <button type="submit">Sil</button>
</form>
                </div>
            `;
        });

        res.send(`
            <html>
            <head>
                <style>
                    body {
                        margin: 0;
                        padding: 40px;
                        font-family: Arial, sans-serif;
                        background-image: url('/arkaplan.jpg');
                        background-size: cover;
                        background-position: center;
                        background-attachment: fixed;
                        background-repeat: no-repeat;
                    }
                </style>
            </head>
            <body>
                <h1 style="text-align:center; color:white; text-shadow: 2px 2px 4px #000; margin-bottom:30px;">Araç Listesi</h1>
                <div style="display:flex; gap:20px; flex-wrap:wrap; justify-content:center;">
                    ${kartlar}
                </div>
            </body>
            </html>
        `);
    } catch (err) {
        console.log(err);
        res.send("Hata var");
    }
});
app.get("/arac-ekle", (req, res) => {
    res.send(`
        <h1>Araç Ekle</h1>

        <form method="POST" action="/arac-ekle">
            <input name="marka" placeholder="Marka" /><br><br>
            <input name="model" placeholder="Model" /><br><br>
            <input name="modelYılı" placeholder="Model Yılı" /><br><br>
            <input name="gunlukKiraUcreti" placeholder="Günlük Ücret" /><br><br>
            <input name="yakitTuru" placeholder="Yakıt Türü" /><br><br>
            <input name="aracTipi" placeholder="Araç Tipi" /><br><br>
            <input name="durum" placeholder="Durum" /><br><br>
            <input name="fotografYolu" placeholder="Fotoğraf" /><br><br>

            <button type="submit">Kaydet</button>
        </form>
    `);
});

// -------------------- VERİLER --------------------

let araclar = [
    { id: 1, marka: "Renault", model: "Clio", yil: 2022, fiyat: 1500, durum: "Müsait" },
    { id: 2, marka: "Fiat", model: "Egea", yil: 2023, fiyat: 1700, durum: "Kirada" }
];

let musteriler = [
    { id: 1, adSoyad: "Ahmet Yılmaz", telefon: "05551234567", tc: "12345678901", ehliyet: "E123456" },
    { id: 2, adSoyad: "Ayşe Demir", telefon: "05559876543", tc: "10987654321", ehliyet: "E654321" }
];

let kiralamalar = [
    {
        id: 1,
        musteriId: 2,
        aracId: 2,
        gunSayisi: 3,
        kiralamaTarihi: "2026-04-01",
        bitisTarihi: "2026-04-04",
        toplamUcret: 5100
    }
];

// -------------------- ORTAK SAYFA YAPISI --------------------

function pageTop(title, rightLinks = "") {
    return `
        <div style="
            background-color:#f4d35e;
            padding:15px 30px;
            display:flex;
            justify-content:space-between;
            align-items:center;
        ">
            <div style="font-size:22px; font-weight:bold;">
                ${title}
            </div>

            <div>
                ${rightLinks}
            </div>
        </div>
    `;
}

function basePage(title, content, rightLinks = "") {
    return `
        <body style="
    margin:0;
    font-family:Arial;
    background-image: url('/gercekresim.png');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    background-attachment: fixed;
">
            ${pageTop(title, rightLinks)}
            ${content}
        </body>
    `;
}

// -------------------- ANA SAYFA --------------------

app.get("/", (req, res) => {
    const kartlar = `
    <div style="
        height:85vh;
        display:flex;
        justify-content:center;
        align-items:center;
        gap:25px;
        flex-wrap:wrap;
    ">
        <div style="background:rgba(0,0,0,0.75); color:white; width:260px; padding:20px; border-radius:16px; text-align:center;">
            <img src="/clio.png" style="width:100%; height:140px; object-fit:contain; background:white; border-radius:8px;">
            <h2>Renault Clio</h2>
            <p>Model: 2022</p>
            <p>Günlük: 1500 TL</p>
            <a href="/arabalar" style="color:black; background:#f4d35e; padding:8px 14px; border-radius:8px; text-decoration:none; font-weight:bold;">Detay</a>
        </div>

        <div style="background:rgba(0,0,0,0.75); color:white; width:260px; padding:20px; border-radius:16px; text-align:center;">
            <img src="/egea.png" style="width:100%; height:140px; object-fit:contain; background:white; border-radius:8px;">
            <h2>Fiat Egea</h2>
            <p>Model: 2023</p>
            <p>Günlük: 1700 TL</p>
            <a href="/arabalar" style="color:black; background:#f4d35e; padding:8px 14px; border-radius:8px; text-decoration:none; font-weight:bold;">Detay</a>
        </div>

        <div style="background:rgba(0,0,0,0.75); color:white; width:260px; padding:20px; border-radius:16px; text-align:center;">
            <img src="/c4.png" style="width:100%; height:140px; object-fit:contain; background:white; border-radius:8px;">
            <h2>Citroen C4</h2>
            <p>Model: 2023</p>
            <p>Günlük: 2000 TL</p>
            <a href="/arabalar" style="color:black; background:#f4d35e; padding:8px 14px; border-radius:8px; text-decoration:none; font-weight:bold;">Detay</a>
        </div>
    </div>
    `;

    res.send(basePage("Rent A Car", kartlar, `
        <a href="/" style="margin-right:20px; text-decoration:none; color:black;">Ana Sayfa</a>
        <a href="/arabalar" style="margin-right:20px; text-decoration:none; color:black;">Araçlar</a>
        <a href="/musteriler" style="margin-right:20px; text-decoration:none; color:black;">Müşteriler</a>
        <a href="/kiralamalar" style="margin-right:20px; text-decoration:none; color:black;">Kiralamalar</a>
        <a href="/login" style="text-decoration:none; color:black; font-weight:bold; background:white; padding:8px 14px; border-radius:6px;">Giriş Yap</a>
    `));
});

// -------------------- LOGIN --------------------

app.get("/login", (req, res) => {
    const hata = req.query.hata || "";

    res.send(basePage(
        "Rent A Car",
        `
        <div style="
            height:85vh;
            display:flex;
            justify-content:center;
            align-items:center;
        ">
            <div style="
                background:white;
                padding:30px;
                border-radius:10px;
                box-shadow:0 0 10px rgba(0,0,0,0.2);
                text-align:center;
                width:320px;
            ">
                <h2>Admin Giriş</h2>

                ${hata ? `<p style="color:red; margin-bottom:15px;">${hata}</p>` : ""}

                <form method="POST" action="/login">
                    <input
                        style="width:100%; padding:10px; margin:5px 0;"
                        type="text"
                        name="kullaniciAdi"
                        placeholder="Kullanıcı Adı"
                        required
                    />

                    <input
                        style="width:100%; padding:10px; margin:5px 0;"
                        type="password"
                        name="sifre"
                        placeholder="Şifre"
                        required
                    />

                    <button style="
                        width:100%;
                        padding:10px;
                        background:green;
                        color:white;
                        border:none;
                        border-radius:5px;
                        margin-top:10px;
                        cursor:pointer;
                    ">
                        Giriş Yap
                    </button>
                </form>
            </div>
        </div>
        `,
        `<a href="/" style="text-decoration:none; color:black;">Ana Sayfa</a>`
    ));
});

app.post("/login", (req, res) => {
    const kullaniciAdi = req.body.kullaniciAdi;
    const sifre = req.body.sifre;

    if (kullaniciAdi === "admin" && sifre === "1234") {
        return res.redirect("/admin");
    }

    return res.redirect("/login?hata=Kullanıcı adı veya şifre yanlış. Tekrar deneyiniz.");
});

// -------------------- ADMIN PANEL --------------------

app.get("/admin", (req, res) => {
    res.send(basePage(
        "Admin Paneli",
        `
        <div style="padding:40px; text-align:center;">
            <h1>Admin Paneline Hoş Geldiniz</h1>
            <p>Buradan araç, müşteri ve kiralama işlemleri yapılabilir.</p>
        </div>
        `,
        `
        <a href="/admin" style="margin-right:20px; text-decoration:none; color:black;">Panel</a>
        <a href="/araclar" style="margin-right:20px; text-decoration:none; color:black;">Araçları Listele</a>
        <a href="/arac-ekle" style="margin-right:20px; text-decoration:none; color:black;">Araç Ekle</a>
        <a href="/musteriler" style="margin-right:20px; text-decoration:none; color:black;">Müşteriler</a>
        <a href="/musteri-ekle" style="margin-right:20px; text-decoration:none; color:black;">Müşteri Ekle</a>
        <a href="/kirala" style="margin-right:20px; text-decoration:none; color:black;">Araç Kirala</a>
        <a href="/kiralamalar" style="margin-right:20px; text-decoration:none; color:black;">Kiralamalar</a>
        <a href="/" style="text-decoration:none; color:black;">Ana Sayfa</a>
        `
    ));
});

// -------------------- ARAÇLAR --------------------

app.get("/araclar", (req, res) => {
    let aracKartlari = "";

    araclar.forEach((arac) => {
        aracKartlari += `
            <div style="
                background:white;
                width:260px;
                padding:20px;
                border-radius:12px;
                box-shadow:0 0 10px rgba(0,0,0,0.15);
                text-align:center;
            ">
                <h2>${arac.marka}</h2>
                <p><b>Model:</b> ${arac.model}</p>
                <p><b>Yıl:</b> ${arac.yil}</p>
                <p><b>Günlük Fiyat:</b> ${arac.fiyat} TL</p>
                <p><b>Durum:</b> ${arac.durum}</p>

                <div style="margin-top:15px;">
                    <a href="/arac-guncelle/${arac.id}"
                       style="margin-right:10px; text-decoration:none; color:orange; font-weight:bold;">
                       Güncelle
                    </a>

                    <form method="POST" action="/arac-sil/${arac.id}" style="display:inline;">
                        <button style="
                            padding:8px 12px;
                            background:red;
                            color:white;
                            border:none;
                            border-radius:6px;
                            cursor:pointer;
                        ">
                            Sil
                        </button>
                    </form>
                </div>
            </div>
        `;
    });

    res.send(basePage(
        "Araçlar",
        `
        <div style="padding:40px;">
            <h1 style="text-align:center; margin-bottom:30px;">Araç Listesi</h1>

            <div style="
                display:flex;
                justify-content:center;
                gap:20px;
                flex-wrap:wrap;
            ">
                ${aracKartlari}
            </div>
        </div>
        `,
        `
        <a href="/admin" style="margin-right:20px; text-decoration:none; color:black;">Admin Paneli</a>
        <a href="/arac-ekle" style="margin-right:20px; text-decoration:none; color:black;">Araç Ekle</a>
        <a href="/" style="text-decoration:none; color:black;">Ana Sayfa</a>
        `
    ));
});

app.get("/arac-ekle", (req, res) => {
    res.send(basePage(
        "Araç Ekle",
        `
        <div style="
            min-height:85vh;
            display:flex;
            justify-content:center;
            align-items:center;
        ">
            <div style="
                background:white;
                padding:30px;
                border-radius:12px;
                box-shadow:0 0 10px rgba(0,0,0,0.15);
                width:350px;
            ">
                <h2 style="text-align:center;">Yeni Araç Ekle</h2>

                <form method="POST" action="/arac-ekle">
                    <input style="width:100%; padding:10px; margin:5px 0;" type="text" name="marka" placeholder="Marka" required />
                    <input style="width:100%; padding:10px; margin:5px 0;" type="text" name="model" placeholder="Model" required />
                    <input style="width:100%; padding:10px; margin:5px 0;" type="number" name="yil" placeholder="Yıl" required />
                    <input style="width:100%; padding:10px; margin:5px 0;" type="number" name="fiyat" placeholder="Günlük Fiyat" required />

                    <select style="width:100%; padding:10px; margin:5px 0;" name="durum" required>
                        <option value="">Durum Seçiniz</option>
                        <option value="Müsait">Müsait</option>
                        <option value="Kirada">Kirada</option>
                    </select>

                    <button style="
                        width:100%;
                        padding:10px;
                        background:green;
                        color:white;
                        border:none;
                        border-radius:6px;
                        margin-top:10px;
                        cursor:pointer;
                    ">
                        Araç Ekle
                    </button>
                </form>
            </div>
        </div>
        `,
        `
        <a href="/admin" style="margin-right:20px; text-decoration:none; color:black;">Admin Paneli</a>
        <a href="/araclar" style="text-decoration:none; color:black;">Araçlar</a>
        `
    ));
});

app.post("/arac-ekle", (req, res) => {
    const { marka, model, yil, fiyat, durum } = req.body;

    araclar.push({
        id: Date.now(),
        marka,
        model,
        yil,
        fiyat,
        durum
    });

    res.redirect("/araclar");
});

app.post("/arac-sil/:id", (req, res) => {
    const id = Number(req.params.id);
    araclar = araclar.filter((arac) => arac.id !== id);
    res.redirect("/araclar");
});

app.get("/arac-guncelle/:id", (req, res) => {
    const id = Number(req.params.id);
    const arac = araclar.find((a) => a.id === id);

    if (!arac) {
        return res.send("Araç bulunamadı");
    }

    res.send(basePage(
        "Araç Güncelle",
        `
        <div style="
            min-height:85vh;
            display:flex;
            justify-content:center;
            align-items:center;
        ">
            <div style="
                background:white;
                padding:30px;
                border-radius:12px;
                box-shadow:0 0 10px rgba(0,0,0,0.15);
                width:350px;
            ">
                <h2 style="text-align:center;">Araç Bilgilerini Güncelle</h2>

                <form method="POST" action="/arac-guncelle/${arac.id}">
                    <input style="width:100%; padding:10px; margin:5px 0;" type="text" name="marka" value="${arac.marka}" required />
                    <input style="width:100%; padding:10px; margin:5px 0;" type="text" name="model" value="${arac.model}" required />
                    <input style="width:100%; padding:10px; margin:5px 0;" type="number" name="yil" value="${arac.yil}" required />
                    <input style="width:100%; padding:10px; margin:5px 0;" type="number" name="fiyat" value="${arac.fiyat}" required />

                    <select style="width:100%; padding:10px; margin:5px 0;" name="durum" required>
                        <option value="Müsait" ${arac.durum === "Müsait" ? "selected" : ""}>Müsait</option>
                        <option value="Kirada" ${arac.durum === "Kirada" ? "selected" : ""}>Kirada</option>
                    </select>

                    <button style="
                        width:100%;
                        padding:10px;
                        background:orange;
                        color:white;
                        border:none;
                        border-radius:6px;
                        margin-top:10px;
                        cursor:pointer;
                    ">
                        Güncelle
                    </button>
                </form>
            </div>
        </div>
        `,
        `<a href="/araclar" style="text-decoration:none; color:black;">Araçlara Dön</a>`
    ));
});

app.post("/arac-guncelle/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = araclar.findIndex((a) => a.id === id);

    if (index === -1) {
        return res.send("Araç bulunamadı");
    }

    araclar[index] = {
        id,
        ...req.body
    };

    res.redirect("/araclar");
});

// -------------------- MÜŞTERİLER --------------------

app.get("/musteriler", (req, res) => {
    let musteriKartlari = "";

    musteriler.forEach((musteri) => {
        musteriKartlari += `
            <div style="
                background:white;
                width:260px;
                padding:20px;
                border-radius:12px;
                box-shadow:0 0 10px rgba(0,0,0,0.15);
                text-align:center;
            ">
                <h2>${musteri.adSoyad}</h2>
                <p><b>Telefon:</b> ${musteri.telefon}</p>
                <p><b>TC:</b> ${musteri.tc}</p>
                <p><b>Ehliyet:</b> ${musteri.ehliyet}</p>

                <a href="/musteri-guncelle/${musteri.id}"
                   style="text-decoration:none; color:orange; font-weight:bold;">
                   Güncelle
                </a>
            </div>
        `;
    });

    res.send(basePage(
        "Müşteriler",
        `
        <div style="padding:40px;">
            <h1 style="text-align:center; margin-bottom:30px;">Müşteri Listesi</h1>

            <div style="
                display:flex;
                justify-content:center;
                gap:20px;
                flex-wrap:wrap;
            ">
                ${musteriKartlari}
            </div>
        </div>
        `,
        `
        <a href="/admin" style="margin-right:20px; text-decoration:none; color:black;">Admin Paneli</a>
        <a href="/musteri-ekle" style="margin-right:20px; text-decoration:none; color:black;">Müşteri Ekle</a>
        <a href="/" style="text-decoration:none; color:black;">Ana Sayfa</a>
        `
    ));
});

app.get("/musteri-ekle", (req, res) => {
    res.send(basePage(
        "Müşteri Ekle",
        `
        <div style="
            min-height:85vh;
            display:flex;
            justify-content:center;
            align-items:center;
        ">
            <div style="
                background:white;
                padding:30px;
                border-radius:12px;
                box-shadow:0 0 10px rgba(0,0,0,0.15);
                width:350px;
            ">
                <h2 style="text-align:center;">Yeni Müşteri Ekle</h2>

                <form method="POST" action="/musteri-ekle">
                    <input style="width:100%; padding:10px; margin:5px 0;" type="text" name="adSoyad" placeholder="Ad Soyad" required />
                    <input style="width:100%; padding:10px; margin:5px 0;" type="text" name="telefon" placeholder="Telefon" required />
                    <input style="width:100%; padding:10px; margin:5px 0;" type="text" name="tc" placeholder="TC Kimlik No" required />
                    <input style="width:100%; padding:10px; margin:5px 0;" type="text" name="ehliyet" placeholder="Ehliyet No" required />

                    <button style="
                        width:100%;
                        padding:10px;
                        background:green;
                        color:white;
                        border:none;
                        border-radius:6px;
                        margin-top:10px;
                        cursor:pointer;
                    ">
                        Müşteri Ekle
                    </button>
                </form>
            </div>
        </div>
        `,
        `
        <a href="/admin" style="margin-right:20px; text-decoration:none; color:black;">Admin Paneli</a>
        <a href="/musteriler" style="text-decoration:none; color:black;">Müşteriler</a>
        `
    ));
});

app.post("/musteri-ekle", (req, res) => {
    const { adSoyad, telefon, tc, ehliyet } = req.body;

    musteriler.push({
        id: Date.now(),
        adSoyad,
        telefon,
        tc,
        ehliyet
    });

    res.redirect("/musteriler");
});

app.get("/musteri-guncelle/:id", (req, res) => {
    const id = Number(req.params.id);
    const musteri = musteriler.find((m) => m.id === id);

    if (!musteri) {
        return res.send("Müşteri bulunamadı");
    }

    res.send(basePage(
        "Müşteri Güncelle",
        `
        <div style="
            min-height:85vh;
            display:flex;
            justify-content:center;
            align-items:center;
        ">
            <div style="
                background:white;
                padding:30px;
                border-radius:12px;
                box-shadow:0 0 10px rgba(0,0,0,0.15);
                width:350px;
            ">
                <h2 style="text-align:center;">Müşteri Bilgilerini Güncelle</h2>

                <form method="POST" action="/musteri-guncelle/${musteri.id}">
                    <input style="width:100%; padding:10px; margin:5px 0;" type="text" name="adSoyad" value="${musteri.adSoyad}" required />
                    <input style="width:100%; padding:10px; margin:5px 0;" type="text" name="telefon" value="${musteri.telefon}" required />
                    <input style="width:100%; padding:10px; margin:5px 0;" type="text" name="tc" value="${musteri.tc}" required />
                    <input style="width:100%; padding:10px; margin:5px 0;" type="text" name="ehliyet" value="${musteri.ehliyet}" required />

                    <button style="
                        width:100%;
                        padding:10px;
                        background:orange;
                        color:white;
                        border:none;
                        border-radius:6px;
                        margin-top:10px;
                        cursor:pointer;
                    ">
                        Güncelle
                    </button>
                </form>
            </div>
        </div>
        `,
        `<a href="/musteriler" style="text-decoration:none; color:black;">Müşterilere Dön</a>`
    ));
});

app.post("/musteri-guncelle/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = musteriler.findIndex((m) => m.id === id);

    if (index === -1) {
        return res.send("Müşteri bulunamadı");
    }

    musteriler[index] = {
        id,
        ...req.body
    };

    res.redirect("/musteriler");
});

// -------------------- KİRALAMA --------------------

app.get("/kirala", (req, res) => {
    let musteriOptions = "";
    let aracOptions = "";

    musteriler.forEach((musteri) => {
        musteriOptions += `<option value="${musteri.id}">${musteri.adSoyad}</option>`;
    });

    araclar.forEach((arac) => {
        if (arac.durum === "Müsait") {
            aracOptions += `<option value="${arac.id}">${arac.marka} ${arac.model}</option>`;
        }
    });

    res.send(basePage(
        "Araç Kirala",
        `
        <div style="
            min-height:85vh;
            display:flex;
            justify-content:center;
            align-items:center;
        ">
            <div style="
                background:white;
                padding:30px;
                border-radius:12px;
                box-shadow:0 0 10px rgba(0,0,0,0.15);
                width:350px;
            ">
                <h2 style="text-align:center;">Kiralama İşlemi</h2>

                <form method="POST" action="/kirala">
                    <select style="width:100%; padding:10px; margin:5px 0;" name="musteriId" required>
                        <option value="">Müşteri Seçiniz</option>
                        ${musteriOptions}
                    </select>

                    <select style="width:100%; padding:10px; margin:5px 0;" name="aracId" required>
                        <option value="">Araç Seçiniz</option>
                        ${aracOptions}
                    </select>

                    <input 
                        style="width:100%; padding:10px; margin:5px 0;" 
                        type="number" 
                        id="gunSayisi"
                        name="gunSayisi" 
                        placeholder="Kaç Gün" 
                        required 
                        oninput="bitisTarihiHesapla()" 
                    />

                    <input 
                        style="width:100%; padding:10px; margin:5px 0;" 
                        type="date" 
                        id="kiralamaTarihi"
                        name="kiralamaTarihi" 
                        required 
                        onchange="bitisTarihiHesapla()" 
                    />

                    <input 
                        style="width:100%; padding:10px; margin:5px 0;" 
                        type="date" 
                        id="bitisTarihi" 
                        name="bitisTarihi"
                        readonly 
                    />

                    <button style="
                        width:100%;
                        padding:10px;
                        background:green;
                        color:white;
                        border:none;
                        border-radius:6px;
                        margin-top:10px;
                        cursor:pointer;
                    ">
                        Kirala
                    </button>
                </form>

                <script>
                function bitisTarihiHesapla() {
                    const baslangic = document.getElementById("kiralamaTarihi").value;
                    const gun = parseInt(document.getElementById("gunSayisi").value);
                    const bitisInput = document.getElementById("bitisTarihi");

                    if (!baslangic || !gun) {
                        bitisInput.value = "";
                        return;
                    }

                    const tarih = new Date(baslangic);
                    tarih.setDate(tarih.getDate() + gun);

                    const yil = tarih.getFullYear();
                    const ay = String(tarih.getMonth() + 1).padStart(2, "0");
                    const gunStr = String(tarih.getDate()).padStart(2, "0");

                    bitisInput.value = yil + "-" + ay + "-" + gunStr;
                }
                </script>
            </div>
        </div>
        `,
        `
        <a href="/admin" style="margin-right:20px; text-decoration:none; color:black;">Admin Paneli</a>
        <a href="/kiralamalar" style="text-decoration:none; color:black;">Kiralamalar</a>
        `
    ));
});

app.post("/kirala", (req, res) => {
    const { musteriId, aracId, gunSayisi, kiralamaTarihi, bitisTarihi } = req.body;

    const secilenArac = araclar.find((a) => a.id === Number(aracId));

    if (!secilenArac) {
        return res.send("Araç bulunamadı");
    }

    const toplamUcret = Number(gunSayisi) * Number(secilenArac.fiyat);

    kiralamalar.push({
        id: Date.now(),
        musteriId: Number(musteriId),
        aracId: Number(aracId),
        gunSayisi: Number(gunSayisi),
        kiralamaTarihi,
        bitisTarihi,
        toplamUcret
    });

    secilenArac.durum = "Kirada";

    res.redirect("/kiralamalar");
});

app.get("/kiralamalar", (req, res) => {
    let kiralamaKartlari = "";

    kiralamalar.forEach((kiralama) => {
        const musteri = musteriler.find((m) => m.id === kiralama.musteriId);
        const arac = araclar.find((a) => a.id === kiralama.aracId);

        kiralamaKartlari += `
            <div style="
                background:white;
                width:300px;
                padding:20px;
                border-radius:12px;
                box-shadow:0 0 10px rgba(0,0,0,0.15);
                text-align:center;
            ">
                <h2>${musteri ? musteri.adSoyad : "Müşteri bulunamadı"}</h2>
                <p><b>Araç:</b> ${arac ? arac.marka + " " + arac.model : "Araç bulunamadı"}</p>
                <p><b>Gün:</b> ${kiralama.gunSayisi}</p>
                <p><b>Başlangıç:</b> ${kiralama.kiralamaTarihi}</p>
                <p><b>Bitiş:</b> ${kiralama.bitisTarihi}</p>
                <p><b>Toplam Ücret:</b> ${kiralama.toplamUcret} TL</p>
            </div>
        `;
    });

    res.send(basePage(
        "Kiralamalar",
        `
        <div style="padding:40px;">
            <h1 style="text-align:center; margin-bottom:30px;">Kiralama Listesi</h1>

            <div style="
                display:flex;
                justify-content:center;
                gap:20px;
                flex-wrap:wrap;
            ">
                ${kiralamaKartlari}
            </div>
        </div>
        `,
        `
        <a href="/admin" style="margin-right:20px; text-decoration:none; color:black;">Admin Paneli</a>
        <a href="/kirala" style="text-decoration:none; color:black;">Yeni Kiralama</a>
        `
    ));
});
// -------------------- ODEME SAYFASI --------------------
app.get("/odeme", async (req, res) => {
    const pool = await sql.connect(config);

    const result = await pool.request().query(`
        SELECT k.kiralamaID, a.marka, a.model, k.toplamUcret
        FROM KiralamaTablosu k
        JOIN AracTablosu a ON k.aracID = a.aracID
    `);

    let liste = "";

    result.recordset.forEach(k => {
        liste += `
            <div style="background:white; padding:15px; margin:10px;">
                <h3>${k.marka} ${k.model}</h3>
                <p>Ücret: ${k.toplamUcret} TL</p>

                <form method="POST" action="/odeme-yap">
                    <input type="hidden" name="kiralamaID" value="${k.kiralamaID}">
                    <input type="hidden" name="odenenTutar" value="${k.toplamUcret}">

                    <select name="odemeTuru">
                        <option>Kart</option>
                        <option>Nakit</option>
                    </select>

                    <button type="submit">Öde</button>
                </form>
            </div>
        `;
    });

    res.send("<h1>Ödeme</h1>" + liste);
});


// -------------------- ODEME KAYDET --------------------
app.post("/odeme-yap", async (req, res) => {
    const { kiralamaID, odenenTutar, odemeTuru } = req.body;

    const pool = await sql.connect(config);

    await pool.request()
        .input("kiralamaID", kiralamaID)
        .input("odenenTutar", odenenTutar)
        .input("gunSayisi", 1)
        .input("odemeTuru", odemeTuru)
        .input("odemeTarihi", new Date())
        .query(`
            INSERT INTO OdemeTablosu
            (kiralamaID, odenenTutar, gunSayisi, odemeTuru, odemeTarihi)
            VALUES
            (@kiralamaID, @odenenTutar, @gunSayisi, @odemeTuru, @odemeTarihi)
        `);

    res.send("Ödeme tamam ✅");
});

// -------------------- SERVER --------------------
app.post("/arac-ekle", async (req, res) => {
    try {
        const { marka, model, modelYılı, gunlukKiraUcreti, yakitTuru, aracTipi, durum, fotografYolu } = req.body;

        const pool = await sql.connect(config);

        await pool.request()
            .input("marka", marka)
            .input("model", model)
            .input("modelYılı", modelYılı)
            .input("gunlukKiraUcreti", gunlukKiraUcreti)
            .input("yakitTuru", yakitTuru)
            .input("aracTipi", aracTipi)
            .input("durum", durum)
            .input("fotografYolu", fotografYolu)
            .query(`
                INSERT INTO dbo.AracTablosu
                (marka, model, modelYılı, gunlukKiraUcreti, yakitTuru, aracTipi, durum, fotografYolu)
                VALUES
                (@marka, @model, @modelYılı, @gunlukKiraUcreti, @yakitTuru, @aracTipi, @durum, @fotografYolu)
            `);

        res.send("Araç eklendi 👍");
    } catch (err) {
        console.log(err);
        res.send("Hata oluştu");
    }
});
app.post("/arac-sil/:id", async (req, res) => {
    try {
        const id = req.params.id;
        const pool = await sql.connect(config);

        await pool.request()
            .input("id", sql.Int, id)
            .query("DELETE FROM dbo.AracTablosu WHERE aracID = @id");

        res.redirect("/arabalar");
    } catch (err) {
        console.log(err);
        res.send("Silme hatası");
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log("Server çalışıyor");

    // 🔥 VERİTABANI BAĞLANTISI BURADA
    sql.connect(config)
        .then(pool => {
            console.log("✅ Veritabanına bağlandı");

            return pool.request().query("SELECT 1 AS test");
        })
        .then(result => {
            console.log(result.recordset);
        })
        .catch(err => {
            console.log("❌ Hata:", err);
        });
});