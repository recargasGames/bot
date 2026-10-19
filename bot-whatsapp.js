const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys-legacy');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const puerto = process.env.PORT || 3000;

// Ruta para tu herramienta de ping
app.get('/', (req, res) => res.send('Bot Inversiones Flores activo'));
app.listen(puerto, () => console.log(`Puerto de vigilia abierto ${puerto}`));

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
  const sock = makeWASocket({ auth: state, printQRInTerminal:true });

  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', upd => {
    const { connection, qr } = upd;
    if(qr) qrcode.generate(qr, {small:true});
    if(connection === 'open') console.log("✅ Bot Inversiones Flores conectado");
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
