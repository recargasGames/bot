const crypto = require('crypto');
global.crypto = crypto;

const { default: makeWASocket, useMultiFileAuthState } = require('@whiskeysockets/baileys');
const QR = require('qrcode');
const express = require('express');
const app = express();
const puerto = process.env.PORT || 3000;

let qrActual = null;
const jidDueno = "58412XXXXXXX@s.whatsapp.net";
let tasaUsdBs = 880; // valor inicial temporal

const catalogo = {
  "ropa": [
    {"nombre":"Franelas oversize de algodón","precio":12.00},
    {"nombre":"Blusas tejidas","precio":17.00},
    {"nombre":"Chaqueta jean","precio":25.00},
    {"nombre":"Franelas de caballero de algodón","precio":25.00},
    {"nombre":"Franelas oversize micro algodón","precio":12.00},
    {"nombre":"Pantalones de caballero","precio":30.00},
    {"nombre":"Pantalones de dama","precio":55.00},
    {"nombre":"Vestido de piel de durazno","precio":55.00},
    {"nombre":"Blusa con hebilla","precio":38.00},
    {"nombre":"Body tyei acanalada","precio":10.00},
    {"nombre":"Pijama 2 piezas","precio":15.00},
    {"nombre":"Palazzo","precio":15.00},
    {"nombre":"Conjunto baggy","precio":20.00},
    {"nombre":"Mono baggy","precio":15.00},
    {"nombre":"Conjunto shorts mono","precio":15.00},
    {"nombre":"Pijama 2 piezas lovely","precio":12.00},
    {"nombre":"Cachero trenza par de du","precio":12.00},
    {"nombre":"Par de niño","precio":12.00},
    {"nombre":"Panty dolce niña","precio":52.00},
    {"nombre":"Medias alu","precio":2.50},
    {"nombre":"Boxer veko","precio":2.50},
    {"nombre":"Boxer calvin klein","precio":12.00},
    {"nombre":"Conjunto deportivo 3 piezas","precio":15.00},
    {"nombre":"Blusas acanaladas","precio":12.00},
    {"nombre":"Blusas básicas juvenil","precio":16.00},
    {"nombre":"Shorts deportivo","precio":15.00},
    {"nombre":"Licas kim","precio":16.00},
    {"nombre":"Batas de seda","precio":8.00},
    {"nombre":"Conjunto deportivo niña","precio":25.00}
  ],
  "cosmeticos": [
    {"nombre":"Pomada para las cejas","precio":1.50},
    {"nombre":"Kit de manicure","precio":3.00},
    {"nombre":"Fijador de maquillaje","precio":1.50},
    {"nombre":"Gel de cejas","precio":2.00},
    {"nombre":"Brocha para el rubor","precio":1.00},
    {"nombre":"Lápiz de cejas marca mac","precio":1.00},
    {"nombre":"Lápiz de ojos mariposa","precio":1.00},
    {"nombre":"Lápiz labial marca ushas","precio":1.50},
    {"nombre":"Lápiz blanco","precio":1.50},
    {"nombre":"Pincel pata de cabra","precio":1.50},
    {"nombre":"Pincel acrílico","precio":1.00},
    {"nombre":"Pincel acrílico plástico","precio":1.00},
    {"nombre":"Bledo","precio":1.80},
    {"nombre":"Puntero de silicona","precio":1.20},
    {"nombre":"Pincel liner","precio":1.50},
    {"nombre":"Remuñador","precio":1.50},
    {"nombre":"Pigmento cejas","precio":1.50},
    {"nombre":"Pigmento color‑1","precio":3.50},
    {"nombre":"Pigmento aurora","precio":4.00},
    {"nombre":"Dona para el cabello","precio":3.00},
    {"nombre":"Gancheta hawaiana 3 piezas","precio":1.50},
    {"nombre":"Mini gancheta hawaiana","precio":1.50},
    {"nombre":"Ligas para el pelo","precio":1.00},
    {"nombre":"Polygel","precio":3.00},
    {"nombre":"Monómero de 60 ml","precio":3.00},
    {"nombre":"Monómeros 128 ml","precio":5.50},
    {"nombre":"Ganchetas","precio":5.50},
    {"nombre":"Rollo de papel para el punto","precio":2.50},
    {"nombre":"Toolistas monbray","precio":2.70},
    {"nombre":"Marcador para cejas","precio":1.00},
    {"nombre":"Peine saca piojos","precio":2.00},
    {"nombre":"Hilos de visagismo","precio":2.70},
    {"nombre":"Cintillo","precio":1.00},
    {"nombre":"Gorro para mechas","precio":1.80},
    {"nombre":"Efecto aurora","precio":1.00},
    {"nombre":"Iman para uñas","precio":2.50},
    {"nombre":"Lima spongie","precio":1.00},
    {"nombre":"Patico de baño","precio":2.60},
    {"nombre":"Sticker para uñas","precio":1.00},
    {"nombre":"Pega de uñas mxbom","precio":1.50},
    {"nombre":"Pega de uñas antegu","precio":1.50},
    {"nombre":"Palito de naranja paquete","precio":4.00},
    {"nombre":"Paquete de palito de algodón","precio":1.50},
    {"nombre":"Separador de dedos","precio":0.80},
    {"nombre":"Lápiz de cejas cremoso mac","precio":0.80},
    {"nombre":"Papel ere","precio":3.00},
    {"nombre":"Kit de brochas para uñas","precio":3.50},
    {"nombre":"Tijeras para cutículas","precio":1.50},
    {"nombre":"Kit para puntos negros","precio":3.00},
    {"nombre":"Coller","precio":5.00},
    {"nombre":"Pulsera","precio":7.00},
    {"nombre":"Pinzas para pestañas","precio":1.50},
    {"nombre":"Abdidores","precio":1.50},
    {"nombre":"Pega salonpro","precio":2.50},
    {"nombre":"Removedor de pestañas","precio":2.50},
    {"nombre":"Zarcillo de oro chino","precio":3.30},
    {"nombre":"Zarcillo de plástico","precio":5.00},
    {"nombre":"Zarcillo de 3 piezas","precio":5.00},
    {"nombre":"Paquete de 500 uñas","precio":3.60},
    {"nombre":"Peine de plástico","precio":1.00},
    {"nombre":"Limas de uñas monbray","precio":1.50},
    {"nombre":"Decoración para uñas","precio":5.50},
    {"nombre":"Corta cutícula","precio":2.50},
    {"nombre":"Corta cutícula profesional","precio":5.00},
    {"nombre":"Lámpara con lupa","precio":15.00},
    {"nombre":"Pedrera","precio":2.00},
    {"nombre":"Pintura pure white","precio":3.00},
    {"nombre":"Primer de uñas","precio":2.00},
    {"nombre":"Primer vitamina c","precio":2.50},
    {"nombre":"Aceite para cutícula bnc","precio":2.50},
    {"nombre":"Aceite para cutícula monbray","precio":1.80},
    {"nombre":"Top coat monbray","precio":3.00},
    {"nombre":"Pintura semi permanente monb","precio":3.20},
    {"nombre":"6 en 1 monbray","precio":3.00},
    {"nombre":"Finish gel monbray","precio":3.50},
    {"nombre":"Protein bond monbray","precio":2.50},
    {"nombre":"Base coat magik","precio":2.00},
    {"nombre":"Premiun top coat","precio":2.00},
    {"nombre":"Ruber base monbray","precio":2.20},
    {"nombre":"Pintura de uñas monbray normal","precio":1.50},
    {"nombre":"Set de papel oro","precio":1.50},
    {"nombre":"Matizador lorianne","precio":1.20},
    {"nombre":"Uñas adoro","precio":3.00},
    {"nombre":"Uñas gelly tips monbray","precio":3.00},
    {"nombre":"Uñas soft gel tips","precio":3.50},
    {"nombre":"Uñas seamless monbray","precio":2.00},
    {"nombre":"Paquete de uñas tiffany","precio":2.00},
    {"nombre":"Paquete uñas m&y","precio":0.80},
    {"nombre":"Lápiz de tinta","precio":3.00},
    {"nombre":"Uñas decoradas","precio":4.00},
    {"nombre":"Uñas variadas monbray","precio":3.50},
    {"nombre":"Tinte lovia","precio":1.00},
    {"nombre":"Labiales matte lip gloss","precio":3.00},
    {"nombre":"Balines para uñas","precio":4.00},
    {"nombre":"Juego de esponjas","precio":1.00},
    {"nombre":"Delineador de ojos waterproof","precio":0.80},
    {"nombre":"Mopa para polvo","precio":2.00},
    {"nombre":"Balsamo","precio":1.00},
    {"nombre":"Pinzas para cejas","precio":1.20},
    {"nombre":"Protector solar 90g","precio":2.50},
    {"nombre":"Esponja base","precio":1.80},
    {"nombre":"Corrector rimoocoo","precio":1.00},
    {"nombre":"Base con protector solar derma","precio":2.00},
    {"nombre":"Perfume de niña","precio":2.00},
    {"nombre":"Combo de colonia","precio":1.50},
    {"nombre":"Polvo de hada","precio":1.00},
    {"nombre":"Brillos líquidos hanifei","precio":1.50},
    {"nombre":"Labiales matte de corazón","precio":1.50},
    {"nombre":"Brillos mágicos","precio":1.50},
    {"nombre":"Tinta labios","precio":1.50},
    {"nombre":"Mini gloss","precio":1.00},
    {"nombre":"Rubor líquido","precio":3.50},
    {"nombre":"Skin care","precio":15.00},
    {"nombre":"Perfume de aceite","precio":5.00},
    {"nombre":"Desodorante lady speed stick","precio":1.00},
    {"nombre":"Pomada 2 en 1 mac","precio":1.20},
    {"nombre":"Anillos para pega de pestañas","precio":0.20},
    {"nombre":"Polvo acrílico","precio":1.50},
    {"nombre":"Rimel sheglan","precio":1.80},
    {"nombre":"Brillo de uñas monbray tradicional","precio":1.30},
    {"nombre":"Vasito de vidrio","precio":2.00},
    {"nombre":"Corrector de ojeras conceal","precio":2.00},
    {"nombre":"Pincel para el dibujo de uñas","precio":1.50},
    {"nombre":"Brocha para maquillaje","precio":2.50},
    {"nombre":"Sombra de ojos manzana","precio":3.00},
    {"nombre":"Lápiz labial SHEGLAN","precio":1.80}
  ]
};

// Consulta la tasa BCV‑USD desde API pública Crom Studio
async function actualizarTasaBCV() {
  try {
    const respuesta = await fetch("https://datos.cromstudio.com.ve/tasa");
    const datos = await respuesta.json();
    const nuevaTasa = parseFloat(datos.tasas.USD);
    if (!isNaN(nuevaTasa)) {
      tasaUsdBs = nuevaTasa;
      console.log("✅ Tasa BCV actualizada (Crom Studio):", tasaUsdBs);
    } else {
      console.log("⚠️ No se pudo leer tasa, mantiene:", tasaUsdBs);
    }
  } catch (err) {
    console.log("❌ Fallo al consultar API‑tasa, mantiene:", tasaUsdBs, err.message);
  }
}
actualizarTasaBCV();
setInterval(actualizarTasaBCV, 60 * 60 * 1000);

// IA: aún sin configurar
async function llamarIA(mensajeUsuario) {
  return "Disculpa, la asistencia inteligente aún no está configurada.";
}

// Servidor web para mostrar el código QR
app.get('/', async (req, res) => {
  if(qrActual){
    try{
      const imagenQR = await QR.toDataURL(qrActual);
      res.send(`<html><body style="text-align:center;"><h1>Escanea este código QR para iniciar sesión</h1><img src="${imagenQR}" style="max‑width:90%;"></body></html>`);
    }catch(e){
      res.send("✅ Bot activo, sesión iniciada");
    }
  }else{
    res.send("✅ Bot activo, sesión iniciada");
  }
});
app.listen(puerto, () => console.log(`Servicio web abierto en puerto ${puerto}`));

function armarLista(tipo){
  if(!catalogo[tipo]) return "Categoría no encontrada";
  let texto = tipo === 'ropa' ? "👕 ROPA (precios en BOLÍVARES, tasa BCV‑Crom Studio)\n" : "💄 COSMÉTICOS (precios en BOLÍVARES, tasa BCV‑Crom Studio)\n";
  catalogo[tipo].forEach(p => {
    const precioBs = Math.round(p.precio * tasaUsdBs);
    texto += `- ${p.nombre}: ${precioBs} Bs\n`;
  });
  return texto;
}

async function iniciarBot(){
  const { state, saveCreds } = await useMultiFileAuthState("./auth_botflores");
  const sock = makeWASocket({
    auth: state,
    printQRInTerminal: false,
    connectTimeoutMs: 60000,
    retryRequestDelayMs: 2500
  });
  sock.ev.on('creds.update', saveCreds);
  sock.ev.on('connection.update', upd => {
    const { connection, qr } = upd;
    if(qr){ qrActual = qr; console.log("👉 Recarga la página web para ver el QR"); }
    if(connection === 'open'){ console.log("✅ Bot Inversiones Flores conectado"); actualizarTasaBCV(); qrActual=null; }
    if(connection === 'close'){ qrActual=null; console.log("⚠️ Desconectado, reinicio en 12 segundos"); setTimeout(iniciarBot,12000); }
  });
  sock.ev.on('messages.upsert', async evento => {
    try{
      const msg = evento.messages[0];
      if(!msg.key.remoteJid || msg.key.fromMe || msg.key.remoteJid.includes("@g.us")) return;
      const remitenteJid = msg.key.remoteJid;
      const texto = (msg.message?.conversation || "").trim().toLowerCase();
      if(remitenteJid === jidDueno) return;
      const saludos = ["hola","buenas","buenos días","buenas tardes","buenas noches","hl","qué tal","saludos"];
      if(saludos.some(s => texto.includes(s))){
        await sock.sendMessage(remitenteJid, {text:
`🌸 INV Flores 2025
📞 Teléfono: 0412‑555‑1078
📸 Instagram: Invflores2025
🎵 TikTok: invflores2025
📍 Ubicación: Calle Real, entre Morichal y Tamanaco
🔗 Canal WhatsApp: https://whatsapp.com/channel/0029VbCJBzTDp2QBsouKyb0S

Escribe:
👉 ropa
👉 cosméticos`});
      }else if(texto === "ropa"){
        await sock.sendMessage(remitenteJid, {text: armarLista("ropa")});
      }else if(["cosméticos","cosmeticos"].includes(texto)){
        await sock.sendMessage(remitenteJid, {text: armarLista("cosmeticos")});
      }else{
        const respuestaIA = await llamarIA(texto);
        await sock.sendMessage(remitenteJid, {text: respuestaIA});
      }
    }catch(errMsg){ console.log("Error mensaje:", errMsg); }
  });
}
iniciarBot().catch(err => { console.log("Fallo arranque:", err); setTimeout(iniciarBot,12000); });
