const express = require('express');
const crypto = require('crypto');
const app = express();

// Формадан келген мәліметтерді оқу үшін
app.use(express.urlencoded({ extended: true }));

// Біздің уақытша базамыз (База данных)
const database = {};

// 1. БАСТЫ БЕТ (HTML + CSS) - Код салатын жер
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>ALINUR PASTE | Private Script Host</title>
        <style>
            body { background-color: #101015; color: #fff; font-family: 'Courier New', monospace; text-align: center; margin: 0; padding: 20px; }
            .container { max-width: 600px; margin: 0 auto; background: #1a1a24; padding: 20px; border-radius: 10px; border: 2px solid #00aaff; box-shadow: 0 0 15px #00aaff; }
            textarea { width: 95%; height: 200px; background: #0d0d12; color: #00ffaa; border: 1px solid #555; padding: 10px; border-radius: 5px; margin-bottom: 15px; font-family: inherit; resize: vertical; }
            button { background: #00aaff; color: #fff; border: none; padding: 10px 20px; font-size: 16px; font-weight: bold; border-radius: 5px; cursor: pointer; transition: 0.3s; }
            button:hover { background: #0088cc; }
            h1 { color: #00aaff; margin-top: 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>ALINUR SCRIPT HOST</h1>
            <p>Paste your private Roblox script here:</p>
            <form action="/save" method="POST">
                <textarea name="scriptCode" placeholder="print('Hello from ALINUR HUB!')" required></textarea>
                <br>
                <button type="submit">Save & Generate RAW Link</button>
            </form>
        </div>
    </body>
    </html>
    `);
});

// 2. КОДТЫ САҚТАУ ЖӘНЕ СІЛТЕМЕ БЕРУ
app.post('/save', (req, res) => {
    const code = req.body.scriptCode;
    // Әр скриптке ешкім таба алмайтын 8 әріптік құпия (рандом) ID береміз
    const id = crypto.randomBytes(4).toString('hex'); 
    
    // Кодты базаға сақтаймыз
    database[id] = code;

    // Адамға өзінің сілтемелерін көрсетеміз
    const rawLink = req.protocol + '://' + req.get('host') + '/raw/' + id;
    
    res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <title>Success | ALINUR PASTE</title>
        <style>
            body { background-color: #101015; color: #fff; font-family: 'Courier New', monospace; text-align: center; margin: 50px; }
            .container { max-width: 600px; margin: 0 auto; background: #1a1a24; padding: 30px; border-radius: 10px; border: 2px solid #00ffaa; }
            .link-box { background: #0d0d12; padding: 15px; border: 1px solid #555; border-radius: 5px; margin: 15px 0; color: #00aaff; font-weight: bold; word-break: break-all; }
            a { color: #00ffaa; text-decoration: none; font-size: 18px; font-weight: bold; border: 1px solid #00ffaa; padding: 10px 20px; border-radius: 5px; display: inline-block; margin-top: 20px; }
            a:hover { background: #00ffaa; color: #000; }
        </style>
    </head>
    <body>
        <div class="container">
            <h2 style="color: #00ffaa;">Script Saved Successfully!</h2>
            <p>Your Roblox loadstring code:</p>
            <div class="link-box">
                loadstring(game:HttpGet("${rawLink}"))()
            </div>
            <a href="${rawLink}" target="_blank">View RAW</a>
            <br><br>
            <a href="/" style="border-color: #00aaff; color: #00aaff;">Upload Another</a>
        </div>
    </body>
    </html>
    `);
});

// 3. РОБЛОКСҚА АРНАЛҒАН ТАЗА (RAW) КОД ҚАЙТАРУ
app.get('/raw/:id', (req, res) => {
    const id = req.params.id;
    const code = database[id];
    
    if (!code) {
        return res.status(404).send("-- ALINUR ERROR: Скрипт табылмады немесе өшірілген!");
    }
    
    // ЕҢ МАҢЫЗДЫ ЖЕРІ: Роблокс оны оқи алуы үшін "text/plain" форматында жібереміз
    res.type('text/plain');
    res.send(code);
});

// Серверді іске қосу
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(\`ALINUR PASTE server is running on port \${PORT}\`);
});
             
