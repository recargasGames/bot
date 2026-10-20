async function obtenerTasaBCV(apiKey, apiSecret) {
  const limpiarCadena = (texto) =>
    texto
      .replace(/[\u2000-\u200F\uFEFF\u00A0]/g, "")
      .replace(/\s+/g, "")
      .trim();

  const claveLimpia = limpiarCadena(apiKey);
  const secretoLimpio = limpiarCadena(apiSecret);
  const url = "https://pagonorte.net/recargas/api.jsp";

  const params = new URLSearchParams();
  params.append("action", "tasas");
  params.append("api_key", claveLimpia);
  params.append("api_secret", secretoLimpio);

  const respuesta = await fetch(url, {
    method: "POST",
    headers: { "Content‑Type": "application/x‑www‑form‑urlencoded" },
    body: params.toString()
  });

  const datos = await respuesta.json();
  if (datos.ok === true && datos.alerta === "green" && datos.tasa_bcv) {
    return parseFloat(datos.tasa_bcv);
  }
  return null;
}

module.exports = { obtenerTasaBCV };
