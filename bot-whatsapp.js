const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const express = require('express');
const app = express();
const puerto = process.env.PORT || 3000;

// Endpoint para tu herramienta de visita periódica
app.get('/', (req, res) => res.send('Bot activo'));
app.listen(puerto, () => console.log(`Servicio de vigilia en puerto ${puerto}`));

const catalogo = {
  ropa: [
    {"nombre":"Franela oversize algodón","precio":12.00},
    {"nombre":"Blusa tejida","precio":17.00},
    {"nombre":"Chaqueta jean","precio":25.00},
    {"nombre":"Pantalón caballero","precio":30.00},
    {"nombre":"Pantalón dama","precio":55.00}
  ],
  cosmeticos: [
    {"nombre":"Pomada para cejas","precio":1.50},
    {"nombre":"Kit de manicure","precio":3.00},
    {"nombre":"Fijador de maquillaje","precio":1.50},
    {"nombre":"Gel para cejas","precio":2.00},
    {"nombre":"Brocha para rubor","precio":1.00}
  ]
};

function armarLista(tipo){
  let texto = tipo === 'ropa' ? "👕 ROPA (precios en USD)\n" : "💄 COSMÉTICOS (precios en USD)\n";
  catalogo[tipo].forEach(prod => texto += `- ${prod.nombre}: ${prod.precio} USD\n`);
  return texto;
}

const cliente = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: {
    args: ['--no‑sandbox','--disable‑setuid‑sandbox','--disable‑dev‑shm‑usage']
  }
});

cliente.on('qr', codigo => {
  qrcode.generate(codigo, {small:true});
  console.log('👉 Escanea este código QR con WhatsApp');
});

cliente.on('ready', () => console.log('✅ Bot Inversiones Flores conectado'));

cliente.on('message', async mensaje => {
  if(mensaje.fromMe || mensaje.from.includes('@g.us')) return;
  const texto = mensaje.body.trim().toLowerCase();

  if(['hola','buenas','hl'].includes(texto)){
    await mensaje.reply(`Hola, bienvenido a Inversiones Flores. ¿Qué producto quieres consultar?
Escribe:
👉 ropa
👉 cosméticos`);
  }else if(texto === 'ropa'){
    await mensaje.reply(armarLista('ropa'));
  }else if(texto === 'cosméticos'){
    await mensaje.reply(armarLista('cosmeticos'));
  }else{
    await mensaje.reply(`Para ver precios escribe:
👉 ropa
👉 cosméticos`);
  }
});

cliente.initialize();
