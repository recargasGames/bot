const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const qrcode = require('qrcode-terminal');
const QR = require('qrcode');
const express = require('express');
const app = express();
const puerto = process.env.PORT || 3000;

let qrActual = null;

// Ruta para ping y para ver el QR en imagen
app.get('/', async (req, res) => {
  if(qrActual){
    try{
      const imagenQR = await QR.toDataURL(qrActual);
      res.send(`<html><body style="text-align:center;"><h1>Escanea este QR</h1><img src="${imagenQR}" style="max-width:90%;"></body></html>`);
    }catch(e){
      res.send("Bot activo, QR no disponible ahora");
    }
  }else{
    res.send("Bot activo, ya hay sesión iniciada");
  }
});

app.listen(puerto, () => console.log(`Servicio abierto en puerto ${puerto}`));

const catalogo = {
  ropa: [
    {nombre:"Franela oversize algodón", precio:12},
    {nombre:"Blusa tejida", precio:17},
    {nombre:"Chaqueta jean", precio:25},
    {nombre:"Pantalón caballero", precio:30},
    {nombre:"Pantalón dama", precio:55}
  ],
  cosmeticos: [
    {nombre:"Pomada cejas", precio:1.50},
    {nombre:"Kit manicure", precio:3.00},
    {nombre:"Fijador maquillaje", precio:1.50},
    {nombre:"Gel cejas", precio:2.00},
    {nombre:"Brocha rubor", precio:1.00}
  ]
};

function armarLista(tipo){
  let texto = tipo === 'ropa' ? "👕 ROPA (precios USD)\n" : "💄 COSMÉTICOS (precios USD)\n";
  catalogo[tipo].forEach(p => texto += `- ${p.nombre}: ${p.precio} USD\n`);
  return texto;
}

async function iniciarBot(){
  const { state, saveCreds } = await useMultiFileAuthState("./auth_botflores");
  const sock = makeWASocket({ auth: state, printQRInTerminal:false }); // Desactivamos QR‑texto grande

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', upd => {
    const { connection, qr } = upd;
    if(qr){
      qrActual = qr;
      console.log("👉 Abre la URL pública de Render en tu teléfono para ver el QR listo para escanear");
    }
    if(connection === 'open'){
      console.log("✅ Bot Inversiones Flores conectado");
      qrActual = null;
    }
    if(connection === 'close'){
      console.log("⚠️ Desconectado, reinicio en 8 segundos");
      setTimeout(iniciarBot, 8000);
    }
  });

  sock.ev.on('messages.upsert', async evento => {
    const msg = evento.messages[0];
    if(!msg.key.remoteJid || msg.key.fromMe || msg.key.remoteJid.includes("@g.us")) return;
    const texto = (msg.message?.conversation || "").trim().toLowerCase();

    if(["hola","buenas","hl"].includes(texto)){
      await sock.sendMessage(msg.key.remoteJid, {text:
`Hola, bienvenido a Inversiones Flores. Escribe:
👉 ropa
👉 cosméticos`});
    }else if(texto === "ropa"){
      await sock.sendMessage(msg.key.remoteJid, {text: armarLista("ropa")});
    }else if(texto === "cosméticos"){
      await sock.sendMessage(msg.key.remoteJid, {text: armarLista("cosmeticos")});
    }else{
      await sock.sendMessage(msg.key.remoteJid, {text:
`Para ver precios escribe:
👉 ropa
👉 cosméticos`});
    }
  });
}

iniciarBot().catch(err => {
  console.log("Error al iniciar:", err);
  setTimeout(iniciarBot, 8000);
});
