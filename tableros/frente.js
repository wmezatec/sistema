/* Diseñador del frente de un tablero: caja, rieles DIN, dispositivos a escala, cableado y simulación.
   Un módulo DIN = 18 mm. Uso: Frente.montar(elemento, tablero, alCambiar). */
(function () {
  "use strict";
  const M = 18, H = 88, PASO = 156, MX = 26, MY = 30, TOP0 = 74, LW = 48, LH = 56, GAP = 34, ISC = 3000;
  let TOP = TOP0;
  const CLS = { termo: "prot", difer: "prot", general: "prot", fusible: "prot", guardamotor: "prot", contactor: "sw", rele: "sw", temporizador: "sw", horario: "sw", relewifi: "sw", voltimetro: "tap", amperimetro: "med", medidor1: "med", medidor3: "med", bornera: "junc", barraN: "junc", barraT: "junc", dps: "tap", monitor: "tap", piloto: "tap", fuente: "carga", reserva: "none", acometida: "src" };

  /* ---------- Dibujos (vista frontal, en mm). v = estado en la simulación ---------- */
  const t = (x, y, s, txt, o) => `<text x="${x}" y="${y}" font-size="${s}" text-anchor="middle" font-family="Archivo,Arial,sans-serif" ${o || 'fill="#222"'}>${txt}</text>`;
  const cuerpo = (w, base) => `<rect x=".5" y=".5" width="${w - 1}" height="${H - 1}" rx="3" fill="${base || "#f6f6f3"}" stroke="#9fa19a" stroke-width=".9"/><rect x="1.6" y="1.6" width="${w - 3.2}" height="${H - 3.2}" rx="2.3" fill="none" stroke="#fff" stroke-width=".7"/><line x1="2" y1="22" x2="${w - 2}" y2="22" stroke="#e1e2dd" stroke-width=".6"/><line x1="2" y1="${H - 22}" x2="${w - 2}" y2="${H - 22}" stroke="#e1e2dd" stroke-width=".6"/>`;
  /* banda negra de la palanca: n palancas repartidas en el ancho; e = on, off o trip */
  const banda = (w, n, e, col, y, h) => {
    y = y || 50; h = h || 16; let s2 = `<rect x="2.6" y="${y}" width="${w - 5.2}" height="${h}" rx="2" fill="#242424"/>`;
    for (let i = 0; i < n; i++) { const pw = w / n, kw = Math.min(11, pw - 6), kx = i * pw + (pw - kw) / 2, ky = e === "off" ? y + h - 9.6 : e === "trip" ? y + 3.4 : y + 1.2;
      s2 += `<rect x="${kx}" y="${ky}" width="${kw}" height="8.4" rx="1.6" fill="${e === "trip" ? "#c23b2c" : (col || "#4a4a4a")}" stroke="#0d0d0d" stroke-width=".5"/><rect x="${kx + 1.4}" y="${ky + 1.2}" width="${kw - 2.8}" height="1.2" fill="#fff" opacity=".35"/>`; }
    return s2;
  };
  const lcd = (w, y, h, txt, fg, sub) => `<rect x="3" y="${y}" width="${w - 6}" height="${h}" rx="1.6" fill="#101a14" stroke="#4a4a4a" stroke-width=".6"/>` + t(w / 2 - (sub ? 3 : 0), y + h * .72, h * .5, txt, `fill="${fg}" font-family="Consolas,monospace" font-weight="700"`) + (sub ? t(w - 6, y + h * .72, h * .28, sub, `fill="${fg}"`) : "");
  const led = (x, y, v, col) => `<circle cx="${x}" cy="${y}" r="2.2" fill="${v && v.sim ? (v.on ? col : "#6b6d66") : col}"/>`;
  const gris = 'fill="#6b6d66"', negro = 'fill="#1f201d" font-weight="800"';
  /* tornillos de los bornes: arriba entra el cable con el tornillo en un hueco, abajo la cabeza negra */
  const tornilloSup = (x, y) => `<circle cx="${x}" cy="${y}" r="6" fill="#dcddd7" stroke="#a3a59d" stroke-width=".8"/><circle cx="${x}" cy="${y}" r="3.8" fill="#8d8f88"/><line x1="${x - 2.6}" y1="${y}" x2="${x + 2.6}" y2="${y}" stroke="#3b3c38" stroke-width=".9"/>`;
  const tornilloInf = (x, y) => `<circle cx="${x}" cy="${y}" r="5.8" fill="#161616" stroke="#000" stroke-width=".6"/><circle cx="${x}" cy="${y}" r="4" fill="#2b2b2b"/><line x1="${x - 2.8}" y1="${y}" x2="${x + 2.8}" y2="${y}" stroke="#bdbdbd" stroke-width=".9"/>`;
  const D = {
    termo: (w, p, v) => { const n = w / M; let s2 = cuerpo(w) + t(M / 2, 35, 7, `${p.curva}${p.amp}`, negro) + t(M / 2, 41, 2.7, "230/400 V~", gris) + t(M / 2, 45, 2.7, "IEC 60898", gris);
      for (let i = 1; i < n; i++) s2 += t(i * M + M / 2, 37, 4.8, "ITM", 'fill="#3b3c38" font-weight="700"') + `<path d="M${i * M + 5} 44h3l2-3 2 3h3" fill="none" stroke="#6b6d66" stroke-width=".7"/>`;
      return s2 + banda(w, n, v.e); },
    difer: (w, p, v) => cuerpo(w) + t(w / 2, 31, 6.4, "ID", negro) + t(w / 2, 37, 2.9, `In ${p.amp} A`, gris) + t(w / 2, 41.4, 2.9, `IΔn ${p.sens} mA`, gris) +
      `<rect x="3.6" y="44.5" width="9.4" height="8.4" rx="1.4" fill="#2b5bd7" stroke="#173a8a" stroke-width=".5"/>` + t(8.3, 51, 5, "T", 'fill="#fff" font-weight="700"') + banda(w, 1, v.e, "#2b5bd7", 55, 12),
    general: (w, p, v) => cuerpo(w, "#f1f1ed") + t(w / 2, 36, 7.8, `${p.amp} A`, negro) + t(w / 2, 42, 2.8, "Interruptor general", gris) + t(w / 2, 46, 2.8, "IEC 60947-3", gris) + banda(w, 1, v.e, "#b32d22", 50, 16),
    dps: (w, p, v) => cuerpo(w) + t(w / 2, 30, 5, "DPS", negro) + `<rect x="4" y="34" width="${w - 8}" height="14" rx="2" fill="#2f8a4c"/>` + t(w / 2, 44, 6, "OK", 'fill="#fff" font-weight="700"') + t(w / 2, 58, 3.2, "Tipo 2", gris),
    guardamotor: (w, p, v) => cuerpo(w) + t(w / 2, 29, 5, "GM", negro) + t(w / 2, 34, 3, `${p.rango || ""} A`, gris) + `<circle cx="${w / 2}" cy="46" r="9" fill="#222" stroke="#666" stroke-width="1"/><line x1="${w / 2}" y1="46" x2="${w / 2 + 5}" y2="40" stroke="#fff" stroke-width="1.5"/>` +
      `<rect x="${w / 2 - 14}" y="58" width="12" height="8" rx="1.4" fill="${v.e === "on" || !v.sim ? "#2f8a4c" : "#3f6b4f"}"/><rect x="${w / 2 + 2}" y="58" width="12" height="8" rx="1.4" fill="${v.e === "on" || !v.sim ? "#8c3a32" : "#c23b2c"}"/>` + t(w / 2 - 8, 64, 4.6, "I", 'fill="#fff" font-weight="700"') + t(w / 2 + 8, 64, 4.6, "O", 'fill="#fff" font-weight="700"'),
    fusible: (w, p, v) => cuerpo(w) + t(w / 2, 30, 5.2, `${p.amp} A`, negro) + `<rect x="3.6" y="35" width="${w - 7.2}" height="28" rx="2" fill="${v.e === "trip" ? "#f3d3cf" : "#e6e6df"}" stroke="#9a9b95" stroke-width=".6"/><rect x="${w / 2 - 2}" y="39" width="4" height="${v.e === "trip" ? 8 : 20}" rx="1.4" fill="${v.e === "trip" ? "#c23b2c" : "#b7b8b2"}"/>`,
    voltimetro: (w, p, v) => cuerpo(w, "#ececE8") + lcd(w, 26, 22, v.txt != null ? v.txt : "230", "#7CFF9B", "V") + `<circle cx="${w / 3}" cy="55" r="2.6" fill="#bdbeb8" stroke="#777" stroke-width=".5"/><circle cx="${w * .66}" cy="55" r="2.6" fill="#bdbeb8" stroke="#777" stroke-width=".5"/>` + t(w / 2, 63, 3.4, "Voltímetro", gris),
    amperimetro: (w, p, v) => cuerpo(w, "#ececE8") + lcd(w, 26, 22, v.txt != null ? v.txt : "16.4", "#ffb84d", "A") + `<circle cx="${w / 3}" cy="55" r="2.6" fill="#bdbeb8" stroke="#777" stroke-width=".5"/><circle cx="${w * .66}" cy="55" r="2.6" fill="#bdbeb8" stroke="#777" stroke-width=".5"/>` + t(w / 2, 63, 3.4, "Amperímetro", gris),
    medidor1: (w, p, v) => cuerpo(w, "#f1f1ed") + t(w / 2, 30, 4.6, "Medidor 1~", negro) + `<rect x="6" y="33" width="${w - 12}" height="16" rx="1.6" fill="#cbd9c4" stroke="#777" stroke-width=".6"/>` + t(w / 2, 45, 8, v.txt != null ? v.txt : "0012345.6", 'fill="#1d2b1d" font-family="Consolas,monospace" font-weight="700"') + t(w - 11, 48, 3.4, v.sub || "kWh", 'fill="#1d2b1d"') +
      t(w / 2, 56, 3.4, "230 V  ~  50 Hz", gris) + `<circle cx="${w - 8}" cy="60" r="1.8" fill="${v.on ? "#e11d1d" : "#8c3a32"}"/><rect x="${w / 2 - 16}" y="58" width="12" height="5.6" rx="1.2" fill="#bdbeb8" stroke="#777" stroke-width=".5"/><rect x="${w / 2 + 4}" y="58" width="12" height="5.6" rx="1.2" fill="#bdbeb8" stroke="#777" stroke-width=".5"/>`,
    medidor3: (w, p, v) => cuerpo(w, "#f1f1ed") + t(w / 2, 30, 4.6, "Medidor 3~", negro) + `<rect x="6" y="33" width="${w - 12}" height="16" rx="1.6" fill="#cbd9c4" stroke="#777" stroke-width=".6"/>` + t(w / 2, 45, 9, v.txt != null ? v.txt : "0012345.6", 'fill="#1d2b1d" font-family="Consolas,monospace" font-weight="700"') + t(w - 12, 48, 3.4, v.sub || "kWh", 'fill="#1d2b1d"') +
      t(w / 2, 55, 3.4, "3 x 230/400 V", gris) + ["L1", "L2", "L3"].map((x, i) => `<circle cx="${w / 2 - 14 + i * 14}" cy="60" r="1.6" fill="${v.sim && !v.on ? "#6b6d66" : "#2fe06b"}"/>` + t(w / 2 - 14 + i * 14, 65, 3, x, gris)).join(""),
    rele: (w, p, v) => cuerpo(w, "#e8edf5") + led(w / 2, 28, v, "#2fe06b") + `<rect x="3.6" y="33" width="${w - 7.2}" height="20" rx="1.6" fill="#2e5aac" stroke="#1b3a74" stroke-width=".6"/>` + t(w / 2, 46, 4, "RELÉ", 'fill="#fff" font-weight="700"') + t(w / 2, 60, 3.4, "A1  A2", gris),
    contactor: (w, p, v) => cuerpo(w, "#d9dad5") + t(w / 2, 30, 4.6, `${p.polos}P ${p.amp}A`, negro) + `<rect x="${w / 2 - 8}" y="${v.e === "off" ? 38 : 34}" width="16" height="12" rx="1.8" fill="${v.e === "off" ? "#7a7a7a" : "#3a3a3a"}" stroke="#111" stroke-width=".5"/>` + t(w / 2, 54, 3.4, "A1   A2", 'fill="#222"') + t(w / 2, 60, 3.2, p.bobina, gris) + led(w - 6, 28, v, "#2fe06b"),
    temporizador: (w, p, v) => cuerpo(w, "#f1f1ed") + t(w / 2, 28, 3.6, "Temporizador", negro) + `<circle cx="${w / 2}" cy="43" r="9.5" fill="#fafaf7" stroke="#333" stroke-width="1"/>` + Array.from({ length: 12 }, (_, i) => { const a = i * Math.PI / 6; return `<line x1="${w / 2 + 7.4 * Math.sin(a)}" y1="${43 - 7.4 * Math.cos(a)}" x2="${w / 2 + 9 * Math.sin(a)}" y2="${43 - 9 * Math.cos(a)}" stroke="#333" stroke-width=".6"/>` }).join("") +
      `<line x1="${w / 2}" y1="43" x2="${w / 2 + 5}" y2="39" stroke="#c23b2c" stroke-width="1.4"/>` + led(w - 7, 28, v, "#f59e0b") + t(w / 2, 60, 3.4, "0 - 10 min", gris),
    horario: (w, p, v) => cuerpo(w, "#f1f1ed") + t(w / 2, 28, 3.6, "Horario", negro) + lcd(w, 31, 13, "12:30", "#7CFF9B") + `<circle cx="${w / 2}" cy="55" r="7" fill="#fafaf7" stroke="#333" stroke-width="1"/><line x1="${w / 2}" y1="55" x2="${w / 2}" y2="49.5" stroke="#333" stroke-width="1.1"/><line x1="${w / 2}" y1="55" x2="${w / 2 + 4}" y2="57" stroke="#c23b2c" stroke-width="1.1"/>`,
    relewifi: (w, p, v) => cuerpo(w, "#fbfbf9") + led(w / 2, 28, v, "#3b82f6") + [12, 8, 4].map(r => `<path d="M ${w / 2 - r} 48 A ${r} ${r} 0 0 1 ${w / 2 + r} 48" fill="none" stroke="#2563eb" stroke-width="1.7" stroke-linecap="round"/>`).join("") + `<circle cx="${w / 2}" cy="51" r="1.7" fill="#2563eb"/>` + t(w / 2, 62, 3.4, "Relé WiFi", gris),
    fuente: (w, p, v) => cuerpo(w, "#dfe0db") + [27, 31, 35, 39].map(y => `<line x1="8" y1="${y}" x2="${w - 8}" y2="${y}" stroke="#9a9b95" stroke-width="1"/>`).join("") + t(w / 2, 52, 7.5, p.salida, negro) + led(w - 9, 60, v, "#2fe06b") + t(w / 2, 62, 3.2, "Fuente", gris),
    monitor: (w, p, v) => cuerpo(w, "#e8edf2") + t(w / 2, 28, 3.6, "Falta de fase", negro) + ["L1", "L2", "L3"].map((x, i) => led(w / 2 - 10 + i * 10, 36, v, "#2fe06b") + t(w / 2 - 10 + i * 10, 43, 3.2, x, gris)).join("") + `<rect x="5" y="49" width="${w - 10}" height="10" rx="1.6" fill="#c9cbc5"/>`,
    piloto: (w, p, v) => { const c = ({ rojo: "#d6342a", verde: "#2fb15a", "ámbar": "#f0a30a", azul: "#2563eb", blanco: "#f4f4f4" })[p.color] || "#d6342a"; return cuerpo(w) + t(w / 2, 29, 4, "Piloto", negro) + `<circle cx="${w / 2}" cy="46" r="7" fill="${v.sim && !v.on ? "#5c5d58" : c}" stroke="#222" stroke-width="1"/>` + (v.sim && v.on ? `<circle cx="${w / 2}" cy="46" r="10.5" fill="${c}" opacity=".3"/>` : "") + `<circle cx="${w / 2 - 2.4}" cy="43.4" r="1.8" fill="#fff" opacity=".55"/>`; },
    bornera: (w) => { const n = Math.round(w / 9); let s2 = ""; for (let i = 0; i < n; i++) { const x = i * 9 + 4.5; s2 += `<rect x="${i * 9 + .6}" y="10" width="7.8" height="68" rx="1.4" fill="${i % 2 ? "#d4d6d0" : "#cdd0ca"}" stroke="#8d8f88" stroke-width=".6"/>` + tornilloSup(x, 22) + `<rect x="${x - 2.5}" y="34" width="5" height="22" rx="1" fill="#9a9c95"/>` + tornilloInf(x, 66); } return s2; },
    barraN: (w) => barra(w, "#3b7fc4", "N"),
    barraT: (w) => barra(w, "#2f8a4c", "PE"),
    reserva: (w) => `<rect x="1" y="6" width="${w - 2}" height="${H - 12}" rx="2.4" fill="none" stroke="#9a9b95" stroke-width="1" stroke-dasharray="3 2.4"/>` + t(w / 2, 48, 5, "libre", 'fill="#9a9b95"')
  };
  /* barra de cobre con tapas de colores y los tornillos al frente, como las de tierra y neutro de un tablero */
  function barra(w, tapa, txt) {
    let s2 = `<rect x="1" y="30" width="${w - 2}" height="28" rx="2.4" fill="#c9783a" stroke="#8a4f21" stroke-width=".8"/><rect x="1" y="30" width="${w - 2}" height="9" rx="2.4" fill="#e0985a" opacity=".7"/><rect x="0" y="27" width="5" height="34" rx="1.6" fill="${tapa}"/><rect x="${w - 5}" y="27" width="5" height="34" rx="1.6" fill="${tapa}"/>`;
    const n = Math.round(w / M);
    for (let i = 0; i < n; i++) { const x = (i + .5) * M; s2 += `<circle cx="${x}" cy="44" r="4.6" fill="#e9c27e" stroke="#7a4a1d" stroke-width=".7"/><circle cx="${x}" cy="44" r="3" fill="#b98a4a"/><line x1="${x - 2}" y1="42.2" x2="${x + 2}" y2="45.8" stroke="#5b3714" stroke-width=".9"/><line x1="${x + 2}" y1="42.2" x2="${x - 2}" y2="45.8" stroke="#5b3714" stroke-width=".9"/>`; }
    return s2 + t(w / 2, 70, 5, txt, `fill="${tapa}" font-weight="800"`);
  }

  /* Cargas (fuera del tablero) y acometida */
  const LOAD = {
    lampara: { n: "Iluminación", w: 300, cos: 1 }, toma: { n: "Tomacorrientes", w: 2200, cos: 1 }, aire: { n: "Aire acondicionado", w: 1500, cos: .85 },
    heladera: { n: "Heladera", w: 300, cos: .8 }, calefactor: { n: "Estufa / termotanque", w: 2000, cos: 1 }, motor1: { n: "Motor monofásico", w: 1100, cos: .8 },
    motor3: { n: "Motor trifásico", w: 3000, cos: .85, tri: 1 }, bomba: { n: "Bomba de agua", w: 750, cos: .8 }
  };
  function motor(v, txt) {
    return `<rect x="4" y="11" width="24" height="20" rx="4" fill="#4a6fa5" stroke="#274a7a" stroke-width="1"/>` + [9, 13, 17, 21].map(x => `<line x1="${x}" y1="11" x2="${x}" y2="31" stroke="#274a7a" stroke-width=".9"/>`).join("") + `<rect x="28" y="18" width="8" height="6" fill="#b7b8b2" stroke="#7d7f78" stroke-width=".6"/>` + t(16, 24.5, 6.4, txt, 'fill="#fff" font-weight="700"') + (v.on ? `<g class="fr-giro" style="transform-origin:34px 21px"><line x1="34" y1="14" x2="34" y2="28" stroke="#555" stroke-width="1.2"/><line x1="27" y1="21" x2="41" y2="21" stroke="#555" stroke-width="1.2"/></g>` : "");
  }
  const icono = {
    lampara: v => `<circle cx="20" cy="17" r="11" fill="${v.on ? "#ffe27a" : "#ececE8"}" stroke="#7d7f78" stroke-width="1"/><rect x="15" y="28" width="10" height="8" rx="1.5" fill="#9a9b95"/><path d="M15 19 l3 -5 l2 5 l2 -5 l3 5" fill="none" stroke="#a36a00" stroke-width="1"/>` + (v.on ? [0, 45, 90, 135, 180, 225, 270, 315].map(a => `<line x1="${20 + 14 * Math.cos(a * Math.PI / 180)}" y1="${17 + 14 * Math.sin(a * Math.PI / 180)}" x2="${20 + 18 * Math.cos(a * Math.PI / 180)}" y2="${17 + 18 * Math.sin(a * Math.PI / 180)}" stroke="#f5b400" stroke-width="1.4"/>`).join("") : ""),
    toma: v => `<rect x="6" y="3" width="28" height="30" rx="4" fill="#f6f6f2" stroke="#7d7f78" stroke-width="1"/><rect x="13" y="10" width="3" height="9" fill="#333"/><rect x="24" y="10" width="3" height="9" fill="#333"/><rect x="18.5" y="23" width="3" height="5" fill="#333"/><circle cx="31" cy="7" r="1.5" fill="${v.on ? "#2fe06b" : "#9a9b95"}"/>`,
    aire: v => `<rect x="2" y="6" width="36" height="16" rx="4" fill="#f1f1ee" stroke="#7d7f78" stroke-width="1"/><line x1="6" y1="17" x2="34" y2="17" stroke="#9a9b95" stroke-width="1"/><circle cx="32" cy="11" r="1.4" fill="${v.on ? "#2fe06b" : "#9a9b95"}"/>` + (v.on ? `<path d="M8 26 q4 4 0 8 M16 26 q4 4 0 8 M24 26 q4 4 0 8 M32 26 q4 4 0 8" fill="none" stroke="#3b82f6" stroke-width="1.4" class="fr-aire"/>` : ""),
    heladera: v => `<rect x="10" y="2" width="20" height="34" rx="3" fill="#e8eef2" stroke="#7d7f78" stroke-width="1"/><line x1="10" y1="14" x2="30" y2="14" stroke="#7d7f78" stroke-width=".8"/><rect x="26" y="6" width="2" height="5" fill="#7d7f78"/><rect x="26" y="18" width="2" height="9" fill="#7d7f78"/>` + (v.on ? `<circle cx="14" cy="8" r="1.4" fill="#2fe06b"/>` : ""),
    calefactor: v => `<rect x="7" y="5" width="26" height="28" rx="3" fill="#d6d6d2" stroke="#7d7f78" stroke-width="1"/>` + [11, 18, 25].map(y => `<path d="M11 ${y} q3 -3 6 0 t6 0 t6 0" fill="none" stroke="${v.on ? "#e11d1d" : "#8d8f88"}" stroke-width="1.6"/>`).join(""),
    motor1: v => motor(v, "M"), motor3: v => motor(v, "M 3~"),
    bomba: v => `<circle cx="16" cy="20" r="10" fill="#4a79b5" stroke="#274a7a" stroke-width="1"/><circle cx="16" cy="20" r="4" fill="#cfe0f4"/><rect x="24" y="16" width="14" height="8" fill="#9bb6d6" stroke="#274a7a" stroke-width=".8"/><path d="M28 20 h7 m-2 -2 l2 2 l-2 2" fill="none" stroke="#1e3a5f" stroke-width="1.1"/>`
  };
  const dibujarCarga = (o, v) => {
    const d = LOAD[o.k], w = +o.p.w || d.w;
    let s = `<g transform="translate(4,0)">${icono[o.k](v)}</g>`;
    if (v.f === "cc") s += `<rect x="-2" y="-4" width="${LW - 2}" height="46" rx="6" fill="none" stroke="#e11d1d" stroke-width="2" class="fr-alarma"/><polygon points="22,-6 14,16 22,16 18,36 34,10 25,10 30,-6" fill="#ffd400" stroke="#e11d1d" stroke-width="1" class="fr-chispa"/>`;
    else if (v.f === "sobre") s += `<rect x="-2" y="-4" width="${LW - 2}" height="46" rx="6" fill="none" stroke="#f59e0b" stroke-width="2" class="fr-alarma"/>`;
    else if (v.f === "fuga") s += `<rect x="-2" y="-4" width="${LW - 2}" height="46" rx="6" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="3 2" class="fr-alarma"/><path d="M22 36 v6 m-3 0 h6 m-4.5 3 h3" stroke="#2563eb" stroke-width="1.2" fill="none"/>`;
    if (v.sim && !v.on && !v.f) s += `<rect x="-2" y="-4" width="${LW - 2}" height="46" rx="6" fill="rgba(255,255,255,.55)"/>`;
    if (v.motivo) s += t(LW / 2 - 2, 22, 5.6, v.motivo, 'fill="#c23b2c" font-weight="700"');
    s += t(LW / 2 - 2, 49, 5.2, d.n, 'fill="#1f201d" font-weight="700"') + t(LW / 2 - 2, 55, 4.6, (v.i != null && v.sim ? v.i.toFixed(v.i >= 100 ? 0 : 1) + " A · " : "") + w + " W", 'fill="#55574f"');
    return s;
  };
  const dibujarAcom = (o, v) => {
    const tri = o.p.tipo === "tri", cut = v.sim && !v.on;
    return `<g opacity="${cut ? ".45" : 1}"><rect x="32" y="2" width="5" height="22" fill="#8a6a43"/><rect x="17" y="8" width="35" height="3.4" rx="1" fill="#8a6a43"/>` + [20, 34.5, 49].map(x => `<circle cx="${x}" cy="7" r="1.8" fill="#b7d3e8" stroke="#6b8aa5" stroke-width=".5"/>`).join("") +
      `<path d="M20 7 q-10 6 -19 6 M49 7 q10 6 19 6" fill="none" stroke="#333" stroke-width=".9"/></g>` +
      t(35, 36, 5.4, tri ? "380 V trifásica" : "220 V monofásica", `fill="${cut ? "#c23b2c" : "#1f201d"}" font-weight="700"`) + t(35, 43, 4.2, cut ? "SIN RED" : "Bajada de línea", `fill="${cut ? "#c23b2c" : "#55574f"}" font-weight="700"`);
  };

    /* ---------- Catálogo ---------- */
  const AMP_T = ["2", "4", "6", "10", "16", "20", "25", "32", "40", "50", "63"], AMP_G = ["25", "32", "40", "63", "80", "100", "125"], AMP_C = ["16", "25", "40", "63"];
  const POL = [1, 2, 3, 4];
  const K = {
    acometida: { n: "Acometida (bajada de línea)", cat: "acom", z: "a", def: { tipo: "mono" }, campos: ["tipo"], d: () => "" },
    termo: { n: "Térmica", cat: "prot", polos: POL, mod: p => p.polos, def: { polos: 1, amp: "16", curva: "C" }, campos: ["polos", "amp", "curva"], d: p => `Térmica ${p.polos}P ${p.curva}${p.amp} A` },
    difer: { n: "Diferencial", cat: "prot", polos: [2, 4], mod: p => p.polos, def: { polos: 2, amp: "40", sens: "30" }, campos: ["polos", "amp", "sens"], d: p => `Diferencial ${p.polos}P ${p.amp} A ${p.sens} mA` },
    general: { n: "Interruptor general", cat: "prot", polos: [2, 4], mod: p => p.polos, def: { polos: 2, amp: "63" }, campos: ["polos", "amp"], d: p => `Interruptor general ${p.polos}P ${p.amp} A` },
    dps: { n: "Protector de sobretensión", cat: "prot", polos: POL, mod: p => p.polos, def: { polos: 2 }, campos: ["polos"], d: p => `Protector de sobretensión ${p.polos}P` },
    guardamotor: { n: "Guardamotor", cat: "prot", mod: () => 3, def: { rango: "4-6.3" }, campos: ["rango"], d: p => `Guardamotor ${p.rango} A` },
    fusible: { n: "Portafusible", cat: "prot", polos: [1, 2, 3], mod: p => p.polos, def: { polos: 1, amp: "16" }, campos: ["polos", "amp"], d: p => `Portafusible ${p.polos}P ${p.amp} A` },
    voltimetro: { n: "Voltímetro", cat: "med", mod: () => 2, def: {}, campos: [], d: () => "Voltímetro digital" },
    amperimetro: { n: "Amperímetro", cat: "med", mod: () => 2, def: {}, campos: [], d: () => "Amperímetro digital" },
    medidor1: { n: "Medidor monofásico", cat: "med", mod: () => 4, def: {}, campos: [], d: () => "Medidor de energía monofásico" },
    medidor3: { n: "Medidor trifásico", cat: "med", mod: () => 6, def: {}, campos: [], d: () => "Medidor de energía trifásico" },
    rele: { n: "Relé", cat: "ctl", mod: () => 1, def: { bobina: "220 V" }, campos: ["bobina"], d: p => `Relé modular bobina ${p.bobina}` },
    contactor: { n: "Contactor", cat: "ctl", polos: [2, 4], mod: p => p.polos, def: { polos: 2, amp: "25", bobina: "220 V" }, campos: ["polos", "amp", "bobina"], d: p => `Contactor ${p.polos}P ${p.amp} A bobina ${p.bobina}` },
    temporizador: { n: "Temporizador", cat: "ctl", mod: () => 2, def: {}, campos: [], d: () => "Temporizador (relé de tiempo)" },
    horario: { n: "Reloj horario", cat: "ctl", mod: () => 2, def: {}, campos: [], d: () => "Reloj programador horario" },
    relewifi: { n: "Relé WiFi", cat: "ctl", mod: () => 2, def: {}, campos: [], d: () => "Relé WiFi" },
    monitor: { n: "Falta de fase", cat: "ctl", mod: () => 2, def: {}, campos: [], d: () => "Relé monitor de tensión (falta de fase)" },
    fuente: { n: "Fuente", cat: "ctl", mod: () => 4, def: { salida: "24 V DC" }, campos: ["salida"], d: p => `Fuente ${p.salida}` },
    piloto: { n: "Luz piloto", cat: "ctl", mod: () => 1, def: { color: "verde" }, campos: ["color"], d: p => `Luz piloto ${p.color}` },
    bornera: { n: "Bornera", cat: "con", mod: p => p.n, def: { n: 2 }, campos: ["n"], nmax: 12, d: p => `Bornera ${p.n * 2} bornes` },
    barraN: { n: "Barra de neutro", cat: "con", mod: p => p.n, def: { n: 4 }, campos: ["n"], nmax: 12, d: p => `Barra de neutro ${p.n} módulos` },
    barraT: { n: "Barra de tierra", cat: "con", mod: p => p.n, def: { n: 4 }, campos: ["n"], nmax: 12, d: p => `Barra de tierra ${p.n} módulos` },
    reserva: { n: "Espacio libre", cat: "otro", mod: p => p.n, def: { n: 2 }, campos: ["n"], nmax: 12, d: p => `Reserva ${p.n} módulos`, sinLista: true }
  };
  Object.keys(LOAD).forEach(k => { K[k] = { n: LOAD[k].n, cat: "acom", z: "c", def: { w: LOAD[k].w }, campos: ["w"], d: () => "" }; CLS[k] = "load"; });
  const CAT = [["prot", "Protecciones"], ["med", "Medición"], ["ctl", "Control"], ["con", "Conexión"], ["acom", "Acometida y cargas"], ["otro", "Otros"]];
  const OPC = { polos: ["Polos", k => k.polos], amp: ["Corriente (A)", k => (k === K.general ? AMP_G : k === K.contactor ? AMP_C : AMP_T)], curva: ["Curva", () => ["B", "C", "D"]], sens: ["Sensibilidad (mA)", () => ["10", "30", "100", "300"]], bobina: ["Bobina", () => ["12 V", "24 V", "110 V", "220 V"]], salida: ["Salida", () => ["12 V DC", "24 V DC", "48 V DC"]], color: ["Color", () => ["rojo", "verde", "ámbar", "azul", "blanco"]], tipo: ["Red", () => ["mono", "tri"]] };
  const PRESETS = [["12", "12 módulos (1 fila de 12)", 1, 12], ["18", "18 módulos (1 fila de 18)", 1, 18], ["24", "24 módulos (2 filas de 12)", 2, 12], ["36", "36 módulos (3 filas de 12)", 3, 12], ["48", "48 módulos (2 filas de 24)", 2, 24], ["72", "72 módulos (3 filas de 24)", 3, 24], ["x", "Personalizado", 0, 0]];

  const enRiel = o => !o.z || o.z === "r";
  const modOf = o => Math.max(1, Math.round(K[o.k].mod(o.p)));

  /* ---------- Estado del tablero ---------- */
  function iniciar(tb) {
    if (!tb.frente) tb.frente = { preset: "24", filas: 2, mpf: 12, ancho: "", alto: "", prof: "110", items: [], cables: [] };
    const f = tb.frente; f.items = f.items || []; f.cables = (f.cables || []).filter(c => tipoDe(c.a) && tipoDe(c.b)); return f;
  }
  const libre = (f, fila, x, mod, ignorar) => {
    if (fila < 0 || fila >= f.filas || x < 0 || x + mod > f.mpf) return false;
    return !f.items.some(o => enRiel(o) && !(ignorar instanceof Set ? ignorar.has(o.id) : o.id === ignorar) && o.f === fila && x < o.x + modOf(o) && o.x < x + mod);
  };
  const hueco = (f, mod, desde) => { for (let i = 0; i < f.filas; i++) { const fi = ((desde || 0) + i) % f.filas; for (let x = 0; x + mod <= f.mpf; x++) if (libre(f, fi, x, mod)) return { f: fi, x }; } return null; };
  const uid = () => Math.random().toString(36).slice(2, 9);
  const medidas = f => ({ ancho: f.ancho || String(Math.round(f.mpf * M + 90)), alto: f.alto || String(Math.round(f.filas * PASO * .96 + 80)), prof: f.prof || "110" });
  const usados = f => f.items.filter(o => enRiel(o) && o.k !== "reserva").reduce((a, o) => a + modOf(o), 0);

  /* Geometría y terminales */
  function G(f) {
    TOP = f.items.some(o => o.z === "a") ? TOP0 : 22;
    const nC = f.items.filter(o => o.z === "c").length, cajaW = f.mpf * M + 2 * MX, W = Math.max(cajaW, nC * LW + 2 * MX, 220), OX = (W - cajaW) / 2, cajaH = f.filas * PASO + 2 * MY, LY = TOP + cajaH + GAP;
    return { nC, cajaW, W, OX, cajaH, LY, Hh: nC ? LY + LH + 14 : TOP + cajaH + 10 };
  }
  function pos(o, g, f) {
    if (o.z === "c") { const i = f.items.filter(q => q.z === "c").indexOf(o); return { x: (g.W - g.nC * LW) / 2 + i * LW, y: g.LY }; }
    if (o.z === "a") return { x: g.W / 2 - 35, y: 4 };
    return { x: g.OX + MX + o.x * M, y: TOP + MY + o.f * PASO + PASO / 2 - H / 2 };
  }
  /* ---------- Conductores: fases, neutro y tierra (AEA 90364, esquema TT) ---------- */
  const POLOS_T = { 1: ["L1"], 2: ["L1", "N"], 3: ["L1", "L2", "L3"], 4: ["L1", "L2", "L3", "N"] };
  const COLOR_AUTO = { L1: "marron", L2: "negro", L3: "rojo", N: "celeste", PE: "verdeamarillo", X: "gris" };
  const COLORES = { marron: ["Marrón", "#7a4a21"], negro: ["Negro", "#1c1c1c"], rojo: ["Rojo", "#c9302c"], celeste: ["Celeste", "#5bb8e8"], verdeamarillo: ["Verde-amarillo", "bi"], blanco: ["Blanco", "#f2f2f2"], gris: ["Gris", "#8d8f88"], azul: ["Azul", "#2b4fb3"] };
  const PUNTO = { L1: "#7a4a21", L2: "#1c1c1c", L3: "#c9302c", N: "#5bb8e8", PE: "#2f8a4c", X: "#f9a01b" };
  const tipoDe = id => { const m = /:[tb](L1|L2|L3|N|PE|X)/.exec(id || ""); return m ? m[1] : null; };
  function polosDe(o) {
    switch (o.k) {
      case "termo": case "difer": case "general": case "dps": case "fusible": case "contactor": return POLOS_T[o.p.polos] || ["L1"];
      case "guardamotor": return ["L1", "L2", "L3"];
      case "medidor1": return ["L1", "N"];
      case "medidor3": case "monitor": return ["L1", "L2", "L3", "N"];
      case "amperimetro": case "rele": case "temporizador": case "horario": case "relewifi": return ["L1"];
      case "voltimetro": case "piloto": case "fuente": return ["L1", "N"];
      case "acometida": return o.p.tipo === "tri" ? ["L1", "L2", "L3", "N", "PE"] : ["L1", "N", "PE"];
      default: return CLS[o.k] === "load" ? (LOAD[o.k].tri ? ["L1", "L2", "L3", "PE"] : ["L1", "N", "PE"]) : [];
    }
  }
  function terminales(o, g, f) {
    const p = pos(o, g, f), c = CLS[o.k], r = [], T = (lado, tipo, x, y, id) => ({ id: id || `${o.id}:${lado}${tipo}`, x, y, tipo, lado });
    if (c === "src") { const pl = polosDe(o); return pl.map((tp, i) => T("b", tp, p.x + 5 + i * (60 / (pl.length - 1)), TOP - 8)); }
    if (c === "load") { const pl = polosDe(o); return pl.map((tp, i) => T("t", tp, p.x + 6 + i * (34 / (pl.length - 1)), p.y - 8)); }
    const w = enRiel(o) ? modOf(o) * M : 0, top = p.y + 10, bot = p.y + H - 10;
    if (c === "prot" || c === "sw" || c === "med") { const pl = polosDe(o); pl.forEach((tp, i) => { const x = p.x + w * (i + .5) / pl.length; r.push(T("t", tp, x, top)); r.push(T("b", tp, x, bot)); }); return r; }
    if (c === "tap" || c === "carga") { const pl = polosDe(o); pl.forEach((tp, i) => r.push(T("t", tp, p.x + w * (i + .5) / pl.length, top))); return r; }
    if (c === "junc") {
      const n = modOf(o);
      if (o.k === "bornera") { for (let i = 0; i < n * 2; i++) { const x = p.x + w * (i + .5) / (n * 2); r.push(T("t", "X", x, p.y + 22, `${o.id}:tX${i}`)); r.push(T("b", "X", x, p.y + 66, `${o.id}:bX${i}`)); } return r; }
      const tp = o.k === "barraN" ? "N" : "PE";
      for (let i = 0; i < n; i++) { const x = p.x + (i + .5) * M; r.push(T("t", tp, x, p.y + 39, `${o.id}:t${tp}${i}`)); r.push(T("b", tp, x, p.y + 49, `${o.id}:b${tp}${i}`)); }
      return r;
    }
    return r;
  }

    /* ---------- Simulación ---------- */
  const mk = () => ({ on: false, t: 0, red: true, cerrado: {}, disparo: {}, heat: {}, falla: {}, extra: {}, fuga: {}, kwh: {}, log: [], flash: null });
  const nominal = o => { const p = o.p; if (o.k === "guardamotor") { const r = String(p.rango || "4-6.3").split("-"); return parseFloat(r[r.length - 1]) || 6.3; } return parseFloat(p.amp) || 16; };
  const magMult = o => (o.k === "guardamotor" ? 12 : o.k === "fusible" ? 6 : ({ B: 5, C: 10, D: 20 })[o.p.curva] || 10);
  function corrienteCarga(o, sim) {
    const d = LOAD[o.k], w = +o.p.w || d.w, f = sim.falla[o.id];
    if (sim.cerrado[o.id] === false) return 0;
    if (f === "cc") return ISC;
    const I = d.tri ? w / (Math.sqrt(3) * 380 * d.cos) : w / (220 * d.cos);
    return f === "sobre" ? I * (1 + (sim.extra[o.id] || 70) / 100) : I;
  }
  function evaluar(f, sim) {
    const items = f.items, adj = new Map();
    const add = (a, b) => { (adj.get(a) || adj.set(a, []).get(a)).push(b); (adj.get(b) || adj.set(b, []).get(b)).push(a); };
    f.cables.forEach(c => add(c.a, c.b));
    const conduce = o => { const c = CLS[o.k]; if (c === "prot") return sim.cerrado[o.id] !== false && !sim.disparo[o.id]; if (c === "sw") return sim.cerrado[o.id] !== false; return true; };
    items.forEach(o => {
      const c = CLS[o.k];
      if ((c === "prot" || c === "sw" || c === "med") && conduce(o)) polosDe(o).forEach(tp => add(`${o.id}:t${tp}`, `${o.id}:b${tp}`));
      if (c === "junc") { const n = modOf(o); if (o.k === "bornera") { for (let i = 0; i < n * 2; i++) add(`${o.id}:tX${i}`, `${o.id}:bX${i}`); } else { const tp = o.k === "barraN" ? "N" : "PE"; for (let i = 0; i < n; i++) { add(`${o.id}:t${tp}${i}`, `${o.id}:t${tp}0`); add(`${o.id}:b${tp}${i}`, `${o.id}:t${tp}0`); } } }
    });
    const src = items.find(o => CLS[o.k] === "src"), V = 220, runs = {};
    if (src && sim.red) polosDe(src).forEach(tp => {
      const s0 = `${src.id}:b${tp}`, vis = new Set([s0]), parent = new Map(), depth = new Map([[s0, 0]]), order = [s0];
      for (let i = 0; i < order.length; i++) { const n = order[i]; (adj.get(n) || []).forEach(m => { if (!vis.has(m)) { vis.add(m); parent.set(m, n); depth.set(m, depth.get(n) + 1); order.push(m); } }); }
      runs[tp] = { vis, parent, depth, order, acc: new Map(), accL: new Map(), own: new Map(), leak: new Map() };
    });
    const has = (tp, id) => !!(runs[tp] && runs[tp].vis.has(id));
    /* cables mal conectados: fase con neutro, fase con fase o fase con tierra */
    const cortos = [];
    Object.keys(runs).forEach(T => { if (T === "PE") return; runs[T].order.forEach(id => { const U = tipoDe(id); if (!U || U === "X" || U === T) return; if (U === "PE") { runs[T].leak.set(id, 5); cortos.push({ k: "tierra", id, T }); } else { runs[T].own.set(id, ISC); cortos.push({ k: U === "N" ? "fn" : "ff", id, T, U }); } }); });
    /* cargas: necesitan fase y neutro (o las tres fases) para funcionar */
    const estados = {};
    items.filter(o => CLS[o.k] === "load").forEach(o => {
      const d = LOAD[o.k], ph = d.tri ? ["L1", "L2", "L3"] : ["L1"];
      const okF = ph.every(tp => has(tp, `${o.id}:t${tp}`)), okN = d.tri || has("N", `${o.id}:tN`), enc = sim.cerrado[o.id] !== false, okT = has("PE", `${o.id}:tPE`);
      const I = okF && okN && enc ? corrienteCarga(o, sim) : 0;
      estados[o.id] = { okF, okN, okT, I };
      if (I > 0) {
        ph.forEach(tp => runs[tp].own.set(`${o.id}:t${tp}`, (runs[tp].own.get(`${o.id}:t${tp}`) || 0) + I));
        if (!d.tri) runs.N.own.set(`${o.id}:tN`, (runs.N.own.get(`${o.id}:tN`) || 0) + I);
        if (sim.falla[o.id] === "fuga" && okT) ph.forEach(tp => runs[tp].leak.set(`${o.id}:t${tp}`, (sim.fuga[o.id] || 100) / 1000));
      }
    });
    items.filter(o => o.k === "piloto" || o.k === "fuente").forEach(o => { if (has("L1", `${o.id}:tL1`) && has("N", `${o.id}:tN`)) { const I = o.k === "fuente" ? .4 : .02; runs.L1.own.set(`${o.id}:tL1`, I); runs.N.own.set(`${o.id}:tN`, I); } });
    Object.keys(runs).forEach(T => { const Rn = runs[T]; for (let i = Rn.order.length - 1; i >= 0; i--) { const n = Rn.order[i]; Rn.acc.set(n, (Rn.acc.get(n) || 0) + (Rn.own.get(n) || 0)); Rn.accL.set(n, (Rn.accL.get(n) || 0) + (Rn.leak.get(n) || 0)); const p = Rn.parent.get(n); if (p) { Rn.acc.set(p, (Rn.acc.get(p) || 0) + Rn.acc.get(n)); Rn.accL.set(p, (Rn.accL.get(p) || 0) + Rn.accL.get(n)); } } });
    const dev = new Map();
    items.forEach(o => {
      const c = CLS[o.k];
      if (c === "prot" || c === "sw" || c === "med") {
        const pl = polosDe(o), fases = pl.filter(t => t !== "N"); let vivo = false, I = 0, L = 0, prof = 0; const Iph = [];
        fases.forEach(tp => { const Rn = runs[tp], t = `${o.id}:t${tp}`, b = `${o.id}:b${tp}`; if (Rn && Rn.vis.has(t)) { vivo = true; prof = Math.max(prof, Rn.depth.get(t) || 0); } if (Rn && Rn.vis.has(b)) { const i = Rn.acc.get(b) || 0; I = Math.max(I, i); Iph.push(i); L = Math.max(L, Rn.accL.get(b) || 0); } });
        dev.set(o.id, { vivo, I, L, prof, P: Iph.reduce((a, x) => a + x, 0) * V });
      } else if (c === "tap" || c === "carga") dev.set(o.id, { vivo: polosDe(o).every(tp => has(tp, `${o.id}:t${tp}`)), I: 0 });
      else if (c === "load") { const e = estados[o.id]; dev.set(o.id, { vivo: e.okF && e.okN && sim.cerrado[o.id] !== false, I: e.I }); }
    });
    const cable = new Map();
    f.cables.forEach(c => { const T = tipoDe(c.a) === "X" ? tipoDe(c.b) : tipoDe(c.a), Rn = runs[T]; let vivo = false, I = 0; if (Rn && Rn.vis.has(c.a) && Rn.vis.has(c.b)) { vivo = true; if (Rn.parent.get(c.b) === c.a) I = Rn.acc.get(c.b) || 0; else if (Rn.parent.get(c.a) === c.b) I = Rn.acc.get(c.a) || 0; } cable.set(c.id, { vivo, I }); });
    const vis = new Set(); Object.keys(runs).forEach(T => runs[T].vis.forEach(x => vis.add(x)));
    return { vis, dev, cable, V, src, estados, cortos, runs };
  }
  function avisos(f, sim, R) {
    const a = [];
    if (!R.src) a.push("Falta la acometida (bajada de línea)."); else if (!f.cables.length) a.push("No hay cables conectados."); else if (!sim.red) a.push("No hay red.");
    if (R.src && sim.red && f.cables.length) {
      R.cortos.forEach(c => a.push(c.k === "fn" ? "Un cable une una fase con el neutro: cortocircuito." : c.k === "ff" ? "Un cable une dos fases: cortocircuito." : "Un cable une una fase con la tierra: fuga a tierra."));
      f.items.filter(o => CLS[o.k] === "load").forEach(o => {
        const d = LOAD[o.k], e = R.estados[o.id];
        if (!e.okF) a.push(`${d.n}: no le llega ${d.tri ? "alguna fase" : "la fase"}.`);
        else if (!e.okN) a.push(`${d.n}: falta el neutro, el circuito no cierra y no funciona.`);
        else if (!e.okT) a.push(`${d.n}: sin puesta a tierra, hay riesgo de contacto y el diferencial no puede actuar.`);
        if (d.tri && !f.items.some(q => CLS[q.k] === "prot" && (q.p.polos || 3) >= 3)) a.push(`${d.n}: un motor trifásico necesita protección de 3 o 4 polos.`);
      });
      if (!f.items.some(q => q.k === "difer")) a.push("Falta el interruptor diferencial.");
    }
    return a;
  }

    /* ---------- Interfaz ---------- */
  const CSS = `.fr{display:grid;grid-template-columns:210px minmax(0,1fr);gap:16px;align-items:start}
  .fr-pal{background:#f7f7f3;border:1px solid #c9cbc4;border-radius:20px;padding:12px;max-height:calc(100vh - 220px);overflow:auto;position:sticky;top:12px}
  .fr-pal h4{margin:10px 4px 6px;font-size:.74rem;color:#55574f;font-weight:800}.fr-pal h4:first-child{margin-top:2px}
  .fr-tiles{display:grid;grid-template-columns:1fr 1fr;gap:6px}
  .fr-tile{background:#fff;border:1px solid #dcded6;border-radius:12px;padding:5px 3px 4px;text-align:center;cursor:grab;display:flex;flex-direction:column;align-items:center;gap:2px;font:inherit;color:#1f201d}
  .fr-tile:hover{border-color:#f9a01b;box-shadow:0 0 0 2px rgba(249,160,27,.35)}
  .fr-tile svg{width:100%;height:46px}.fr-tile span{font-size:.66rem;font-weight:700;line-height:1.1}
  .fr-cab{display:flex;gap:8px;flex-wrap:wrap;align-items:end;margin-bottom:8px}
  .fr-cab label{margin:0 0 3px .2em;font-size:.76rem}
  .fr-cab input,.fr-cab select{width:auto;min-width:0;padding:.4em .7em;font-size:.9rem}.fr-cab input{width:74px}.fr-cab input[type=range]{width:110px;padding:0;box-shadow:none;background:none}
  .fr-modo{display:inline-flex;background:#d9dbd3;border-radius:99px;padding:3px}
  .fr-modo button{border:0;background:none;padding:.35em 1em;border-radius:99px;font-weight:800;color:#55574f;font-size:.88rem}.fr-modo button.on{background:#232323;color:#fff}.fr-modo button.on.sim{background:#c23b2c}
  .fr-info{font-size:.84rem;color:#55574f;margin:0 0 6px}
  .fr-lienzo{background:#e3e4df;border-radius:20px;padding:10px;border:1px solid #c9cbc4;overflow:auto}
  .fr-lienzo svg{display:block;margin:0 auto;height:auto;touch-action:none;user-select:none}
  .fr-dev{cursor:grab}.fr-dev.sel>rect:first-child{stroke:#f9a01b;stroke-width:1.6}.fr-sim .fr-dev,.fr-sim .fr-carga{cursor:pointer}
  .fr-term{cursor:crosshair}.fr-term circle{transition:r .1s}.fr-term:hover circle{r:4.6}
  .fr-cable{fill:none;stroke:#3b3b3b;stroke-width:2.2;stroke-linecap:round}.fr-cable.sel{stroke:#f9a01b;stroke-width:3}
  .fr-flujo{fill:none;stroke:#fff;stroke-opacity:.9;stroke-width:1;stroke-linecap:round;stroke-dasharray:5 6;animation:fr-flow .55s linear infinite}
  .fr-flujo.alto{stroke:#ffd54f;stroke-width:1.4;animation-duration:.3s}.fr-flujo.cc{stroke:#ff3b30;stroke-width:2.2;stroke-opacity:1;animation-duration:.12s}
  @keyframes fr-flow{to{stroke-dashoffset:-11}}
  .fr-giro{animation:fr-spin .5s linear infinite}@keyframes fr-spin{to{transform:rotate(360deg)}}
  .fr-chispa{animation:fr-chispa .18s steps(2) infinite}@keyframes fr-chispa{50%{opacity:.25}}
  .fr-alarma{animation:fr-alarma .5s ease-in-out infinite alternate}@keyframes fr-alarma{to{opacity:.3}}
  .fr-aire{animation:fr-alarma .8s ease-in-out infinite alternate}
  .fr-prop,.fr-simp,.fr-lista{background:#f7f7f3;border:1px solid #c9cbc4;border-radius:20px;padding:14px;margin-top:12px}
  .fr-prop .g{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px}
  .fr-lista table{width:100%;border-collapse:collapse;font-size:.9rem}.fr-lista td{padding:6px 8px;border-bottom:1px solid #e3e4de}.fr-lista td:last-child{text-align:right;font-weight:800;width:60px}
  .fr-alerta{background:#f8e0dc;border-left:5px solid #c23b2c;border-radius:12px;padding:10px 12px;font-weight:700;margin-bottom:8px;animation:fr-alarma .6s ease-in-out infinite alternate}
  .fr-log{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:4px;font-size:.88rem;max-height:200px;overflow:auto}.fr-log li{background:#fff;border-radius:10px;padding:5px 10px}
  .fr-log li b{font-variant-numeric:tabular-nums;color:#55574f;margin-right:6px}
  @media print{.fr-pal,.fr-cab,.fr-prop,.fr-simp{display:none}.fr{display:block}.fr-lienzo,.fr-lista{border:0;background:#fff}}
  .fr2{display:grid;grid-template-columns:50px minmax(0,1fr) 300px;gap:10px;height:100%;min-height:0}
  .fr-rail{display:flex;flex-direction:column;gap:4px;padding:7px 5px;background:#f7f7f3;border:1px solid #c9cbc4;border-radius:18px;align-self:start;max-height:100%;overflow:visible}
  .fr-rail button{position:relative;width:38px;height:38px;border:0;border-radius:12px;background:none;color:#3a3b36;display:grid;place-items:center;padding:0;cursor:pointer}
  .fr-rail button:hover{background:#ececE6}.fr-rail button.on{background:#232323;color:#fff}.fr-rail button.on.sim{background:#c23b2c}
  .fr-rail button:disabled{opacity:.3;cursor:default}.fr-rail button:disabled:hover{background:none}
  .fr-rail hr{border:0;border-top:1px solid #d6d8d0;margin:3px 5px;width:28px}
  .fr-rail svg{width:20px;height:20px;fill:none;stroke:currentColor;stroke-width:1.9;stroke-linecap:round;stroke-linejoin:round}
  .fr-rail [data-tip]:hover::after,.fr-rail [data-tip]:focus-visible::after{left:calc(100% + 10px);top:50%;transform:translateY(-50%)}
  .fr-mid{display:flex;flex-direction:column;min-height:0;min-width:0}
  .fr2 .fr-lienzo{flex:1;min-height:0;padding:8px}
  .fr-estado{font-size:.8rem;color:#55574f;margin:6px 4px 0}
  .fr-lado{display:flex;flex-direction:column;min-height:0;background:#f7f7f3;border:1px solid #c9cbc4;border-radius:18px;overflow:hidden}
  .fr-tabs{display:flex;gap:2px;padding:6px;border-bottom:1px solid #dcded6}
  .fr-tabs button{flex:1;border:0;background:none;padding:.45em .1em;border-radius:10px;font-weight:700;font-size:.76rem;color:#55574f;cursor:pointer}
  .fr-tabs button:hover{background:#ececE6}.fr-tabs button.on{background:#232323;color:#fff}
  .fr-panes{flex:1;min-height:0;overflow:auto;padding:10px}
  .fr-lado .fr-panes>div{display:none}
  .fr-lado[data-t=comp] .p-comp,.fr-lado[data-t=prop] .p-prop,.fr-lado[data-t=sim] .p-sim,.fr-lado[data-t=caja] .p-caja,.fr-lado[data-t=lista] .p-lista{display:block}
  .fr-lado .fr-pal{position:static;max-height:none;overflow:visible;border:0;background:none;padding:0}
  .fr-lado .fr-tiles{grid-template-columns:repeat(3,1fr)}
  .fr-lado .fr-prop,.fr-lado .fr-simp,.fr-lado .fr-lista{border:0;background:none;padding:0;margin:0}
  .fr-lado .fr-cab{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:0}.fr-lado .fr-cab>div:first-child{grid-column:1/-1}
  .fr-lado .fr-cab input,.fr-lado .fr-cab select{width:100%}
  .fr-lado .fr-prop .g{grid-template-columns:1fr 1fr}
  @media print{.fr-rail,.fr-lado{display:none}.fr2{display:block;height:auto}}
  @media (max-width:900px){.fr2{grid-template-columns:1fr;height:auto}.fr-rail{flex-direction:row;flex-wrap:wrap;align-self:stretch}.fr-rail hr{width:1px;height:28px;border-top:0;border-left:1px solid #d6d8d0;margin:5px 3px}.fr2 .fr-lienzo{min-height:60vh}.fr-lado{max-height:70vh}}
  @media (max-width:900px){.fr{grid-template-columns:1fr}.fr-pal{position:static;max-height:none}}`;

  function montar(el, tb, alCambiar) {
    if (!document.getElementById("fr-css")) { const s = document.createElement("style"); s.id = "fr-css"; s.textContent = CSS; document.head.appendChild(s); }
    const f = iniciar(tb); let sel = null, selC = null, arrastre = null, sim = mk(), modo = "armar", R = null, ultimaSig = "", timer = null, previa = null;
    let zoom = innerWidth < 900 ? 100 : 62; try { zoom = +localStorage.getItem("fr-zoom") || zoom; } catch (e) { }
    let multi = new Set(), marco = null, clip = null, hist = [], hpos = -1, hsig = "", ht = null, restaurando = false;
    const guardar = () => { alCambiar && alCambiar(); if (!restaurando) { clearTimeout(ht); ht = setTimeout(pushHist, 350); } };
    /* Historial (Ctrl+Z, Ctrl+Y, Ctrl+Shift+Z): una copia de la caja, los dispositivos y los cables después de cada cambio terminado */
    const snap = () => JSON.stringify({ preset: f.preset, filas: f.filas, mpf: f.mpf, ancho: f.ancho, alto: f.alto, prof: f.prof, items: f.items, cables: f.cables });
    function pushHist() {
      clearTimeout(ht); ht = null; const sg = snap(); if (sg === hsig) return;
      hsig = sg; hist = hist.slice(0, hpos + 1); hist.push(sg); if (hist.length > 80) hist.shift(); hpos = hist.length - 1; syncHist();
    }
    function restaurar(p) {
      if (p < 0 || p >= hist.length) return;
      hpos = p; restaurando = true; Object.assign(f, JSON.parse(hist[p])); restaurando = false; hsig = hist[p];
      multi = new Set(); sel = null; selC = null; previa = null; alCambiar && alCambiar(); pintarCab(); info(); pintar(); lista(); prop(); panelSim();
    }
    const deshacer = () => { if (ht) pushHist(); restaurar(hpos - 1); };
    const rehacer = () => restaurar(hpos + 1);
    function syncHist() { const u = el.querySelector("#fr-undo"), r2 = el.querySelector("#fr-redo"); if (u) u.disabled = hpos <= 0; if (r2) r2.disabled = hpos >= hist.length - 1; }
    const esc = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
    const aviso = txt => { const x = document.createElement("div"); x.className = "toast"; x.textContent = txt; document.body.appendChild(x); setTimeout(() => x.remove(), 2400); };

    el.innerHTML = `<div class="fr2"><div class="fr-rail" id="fr-rail"></div><div class="fr-mid"><div class="fr-lienzo" id="fr-lz"><svg id="fr-svg" xmlns="http://www.w3.org/2000/svg"></svg></div><p class="fr-estado" id="fr-info"></p></div><aside class="fr-lado" id="fr-lado" data-t="comp"><div class="fr-tabs" id="fr-tabs"></div><div class="fr-panes"><div class="p-comp"><div class="fr-pal" id="fr-pal"></div></div><div class="p-prop"><div class="fr-prop" id="fr-prop"></div></div><div class="p-sim"><div class="fr-simp" id="fr-simp" hidden></div></div><div class="p-caja"><div class="fr-cab" id="fr-cab"></div></div><div class="p-lista"><div class="fr-lista" id="fr-lista"></div></div></div></aside></div>`;
    const $ = id => el.querySelector("#" + id), svg = $("fr-svg");

    /* Paleta */
    $("fr-pal").innerHTML = CAT.map(([id, nombre]) => `<h4>${nombre}</h4><div class="fr-tiles">${Object.keys(K).filter(k => K[k].cat === id).map(k => {
      let inner, w, h;
      if (K[k].z === "c") { inner = `<g transform="translate(4,0)">${icono[k]({})}</g>`; w = 46; h = 42; }
      else if (K[k].z === "a") { inner = dibujarAcom({ p: K[k].def }, {}); w = 70; h = 40; }
      else { const o = { k, p: Object.assign({}, K[k].def) }; w = modOf(o) * M; h = H; inner = `<g>${D[k](w, o.p, {})}</g>`; }
      return `<button type="button" class="fr-tile" draggable="${K[k].z ? "false" : "true"}" data-k="${k}" title="Agregar ${esc(K[k].n)}"><svg viewBox="-2 -2 ${w + 4} ${h + 4}" preserveAspectRatio="xMidYMid meet">${inner}</svg><span>${esc(K[k].n)}</span></button>`;
    }).join("")}</div>`).join("");

    function pintarCab() {
      const m = medidas(f);
      $("fr-cab").innerHTML = `<div><label for="fr-pre">Caja</label><select id="fr-pre">${PRESETS.map(p => `<option value="${p[0]}"${p[0] === f.preset ? " selected" : ""}>${p[1]}</option>`).join("")}</select></div>
      <div><label for="fr-fil">Filas</label><input id="fr-fil" type="number" min="1" max="6" value="${f.filas}"></div>
      <div><label for="fr-mpf">Módulos por fila</label><input id="fr-mpf" type="number" min="4" max="36" value="${f.mpf}"></div>
      <div><label for="fr-an">Ancho (mm)</label><input id="fr-an" inputmode="numeric" value="${esc(f.ancho)}" placeholder="${m.ancho}"></div>
      <div><label for="fr-al">Alto (mm)</label><input id="fr-al" inputmode="numeric" value="${esc(f.alto)}" placeholder="${m.alto}"></div>
      <div><label for="fr-pr">Prof. (mm)</label><input id="fr-pr" inputmode="numeric" value="${esc(f.prof)}" placeholder="110"></div>`;
    }
    /* Barra de herramientas (iconos con descripción al pasar el mouse) y pestañas del panel lateral */
    const IC = {
      puntero: '<path d="m4 4 7 17 2.2-7.2L20.5 11.5z"/>', play: '<path d="M7 4.5v15l12-7.5z"/>',
      undo: '<path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5a5.5 5.5 0 0 1-5.5 5.5H11"/>', redo: '<path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5A5.5 5.5 0 0 0 9.5 20H13"/>',
      copiar: '<rect width="14" height="14" x="8" y="8" rx="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>', cortar: '<circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/><path d="M20 4 8.1 15.9M14.5 14.5 20 20M8.1 8.1 12 12"/>',
      pegar: '<rect x="8" y="2" width="8" height="4" rx="1"/><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>', duplicar: '<rect x="8" y="8" width="13" height="13" rx="2"/><path d="M4 16V5a1 1 0 0 1 1-1h11M14.5 12.5v6M11.5 15.5h6"/>',
      todo: '<rect x="4" y="4" width="16" height="16" rx="2" stroke-dasharray="3 3"/>', basura: '<path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14M10 11v6M14 11v6"/>',
      rayo: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>', cortacable: '<path d="M18.8 13.2l1.4-1.4a4 4 0 0 0-5.7-5.7l-1.4 1.4M5.2 10.8l-1.4 1.4a4 4 0 0 0 5.7 5.7l1.4-1.4M8 8 4 4M16 16l4 4"/>',
      masz: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M8 11h6M11 8v6"/>', menosz: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3M8 11h6"/>', ajustar: '<path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/>'
    };
    const ico = n => `<svg viewBox="0 0 24 24" aria-hidden="true">${IC[n]}</svg>`;
    function pintarRail() {
      const b = (ac, ic, tip, cls, id) => `<button type="button" data-ac="${ac}" data-tip="${tip}" aria-label="${tip}"${id ? ` id="${id}"` : ""}${cls ? ` class="${cls}"` : ""}>${ico(ic)}</button>`;
      $("fr-rail").innerHTML = b("armar", "puntero", "Armar: mover dispositivos y unir cables (A)", modo === "armar" ? "on" : "") + b("sim", "play", "Simular: ver la corriente y provocar fallas (S)", modo === "sim" ? "on sim" : "") +
        (modo === "armar" ? "<hr>" + b("undo", "undo", "Deshacer (Ctrl+Z)", "", "fr-undo") + b("redo", "redo", "Rehacer (Ctrl+Y)", "", "fr-redo") +
          "<hr>" + b("copy", "copiar", "Copiar lo seleccionado (Ctrl+C)") + b("cut", "cortar", "Cortar (Ctrl+X)") + b("paste", "pegar", "Pegar (Ctrl+V)") + b("dup", "duplicar", "Duplicar (Ctrl+D)") +
          "<hr>" + b("selall", "todo", "Seleccionar todo (Ctrl+A)") + b("del", "basura", "Quitar lo seleccionado (Suprimir)") +
          "<hr>" + b("auto", "rayo", "Cablear solo: acometida, protecciones y cargas") + b("quitarc", "cortacable", "Quitar todos los cables") : "") +
        "<hr>" + b("zin", "masz", "Acercar") + b("zout", "menosz", "Alejar") + b("fit", "ajustar", "Ajustar a la pantalla");
      syncHist();
    }
    let ptab = "comp", ultSel = "", noAuto = false;
    function pintarTabs() {
      const t = modo === "sim" ? [["sim", "Simulación"], ["lista", "Lista"]] : [["comp", "Componentes"], ["prop", "Propiedades"], ["caja", "Caja"], ["lista", "Lista"]];
      if (!t.some(x => x[0] === ptab)) ptab = t[0][0];
      $("fr-tabs").innerHTML = t.map(x => `<button type="button" data-ptab="${x[0]}" class="${x[0] === ptab ? "on" : ""}">${x[1]}</button>`).join(""); $("fr-lado").dataset.t = ptab;
    }
    const verTab = n => { ptab = n; pintarTabs(); };
    function zoomPor(d) { zoom = Math.max(20, Math.min(220, zoom + d)); svg.style.width = zoom + "%"; try { localStorage.setItem("fr-zoom", zoom); } catch (e) { } }
    function ajustar() {
      const lz = $("fr-lz"), vb = svg.viewBox.baseVal; if (!vb || !vb.height) return;
      const cw = lz.clientWidth - 16, ch = lz.clientHeight - 16; zoom = Math.max(20, Math.min(100, Math.floor(ch * (vb.width / vb.height) / cw * 100))); svg.style.width = zoom + "%";
      try { localStorage.setItem("fr-zoom", zoom); } catch (e) { }
    }
    function info() {
      const m = medidas(f), u = usados(f), tot = f.filas * f.mpf;
      $("fr-info").textContent = `Caja de ${tot} módulos (${f.filas} ${f.filas === 1 ? "fila" : "filas"} de ${f.mpf}) · ${m.ancho} x ${m.alto} x ${m.prof} mm · ocupados ${u} de ${tot} módulos (${tot ? Math.round(u / tot * 100) : 0} %)`;
    }

    /* Lienzo */
    function estadoVista(o) {
      const c = CLS[o.k];
      if (modo !== "sim" || !R) return {};
      const d = R.dev.get(o.id) || {}, v = { sim: 1, on: !!d.vivo };
      if (c === "prot" || c === "sw") v.e = sim.disparo[o.id] ? "trip" : sim.cerrado[o.id] === false ? "off" : "on";
      if (o.k === "voltimetro") v.txt = d.vivo ? "220" : "0";
      if (o.k === "amperimetro") v.txt = d.vivo ? d.I.toFixed(d.I >= 100 ? 0 : 1) : "0.0";
      if (o.k === "medidor1" || o.k === "medidor3") { v.txt = ((d.vivo ? d.P || 0 : 0) / 1000).toFixed(2); v.sub = "kW"; }
      if (c === "load") { const e = R.estados[o.id] || {}; v.f = sim.falla[o.id]; v.i = d.I; v.on = !!d.vivo && sim.cerrado[o.id] !== false; if (R.src && sim.red && sim.cerrado[o.id] !== false) v.motivo = !e.okF ? "sin fase" : !e.okN ? "sin neutro" : ""; }
      if (c === "src") v.on = sim.red;
      return v;
    }
    const tornillos = (o, g2, f2, p) => { const c = CLS[o.k]; if (!(c === "prot" || c === "sw" || c === "med" || c === "tap" || c === "carga")) return ""; return terminales(o, g2, f2).map(tt => (tt.lado === "t" ? tornilloSup : tornilloInf)(tt.x - p.x, tt.y - p.y)).join(""); };
    const redondo = (pts, r) => {
      pts = pts.filter((q, k) => k === 0 || Math.hypot(q[0] - pts[k - 1][0], q[1] - pts[k - 1][1]) > .01);
      let d = `M${pts[0][0]} ${pts[0][1]}`;
      for (let i = 1; i < pts.length - 1; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i], [x2, y2] = pts[i + 1], l1 = Math.hypot(x1 - x0, y1 - y0), l2 = Math.hypot(x2 - x1, y2 - y1), rr = Math.min(r, l1 / 2, l2 / 2);
        d += `L${x1 + (x0 - x1) / l1 * rr} ${y1 + (y0 - y1) / l1 * rr}Q${x1} ${y1} ${x1 + (x2 - x1) / l2 * rr} ${y1 + (y2 - y1) / l2 * rr}`;
      }
      return d + `L${pts[pts.length - 1][0]} ${pts[pts.length - 1][1]}`;
    };
    /* dA y dB: hacia dónde sale cada borne (-1 arriba, 1 abajo). Del mismo lado el cable hace una U. */
    const camino = (x1, x2, y1, y2, lane, dA, dB) => {
      lane = +lane || 0; dA = dA == null ? 1 : dA; dB = dB == null ? -dA : dB; const st = 28, ofs = (lane + 12) / 2; let pts;
      if (dA !== dB) {
        if (dA === -1) return camino(x2, x1, y2, y1, lane, dB, dA);
        if (Math.abs(x1 - x2) < .5 && y2 > y1) return `M${x1} ${y1}L${x2} ${y2}`;
        if (y2 - y1 >= 2 * st) { const ym = Math.min(y2 - st, Math.max(y1 + st, y1 + (y2 - y1) / 2 + lane)); pts = [[x1, y1], [x1, ym], [x2, ym], [x2, y2]]; }
        else { const ya = y1 + st + ofs, yb = y2 - st - ofs, xs = Math.abs(x1 - x2) > 8 ? (x1 + x2) / 2 + lane * .4 : Math.max(x1, x2) + 16 + lane; pts = [[x1, y1], [x1, ya], [xs, ya], [xs, yb], [x2, yb], [x2, y2]]; }
      } else {
        const nivel = dA === -1 ? Math.min(y1, y2) - st - ofs : Math.max(y1, y2) + st + ofs;
        pts = [[x1, y1], [x1, nivel], [x2, nivel], [x2, y2]];
      }
      return redondo(pts, 6);
    };
    /* vista previa mientras se arrastra: sale del borne hacia su lado y llega al puntero con ángulos rectos */
    const caminoLibre = (x1, y1, d, x2, y2) => {
      const st = 28, enLado = (y2 - y1) * d >= st, ym = enLado ? y1 + (y2 - y1) / 2 : y1 + d * st;
      return redondo(Math.abs(x1 - x2) < .5 && enLado ? [[x1, y1], [x2, y2]] : [[x1, y1], [x1, ym], [x2, ym], [x2, y2]], 6);
    };
    const cableSvg = (d, col, sel) => {
      const c = COLORES[col] || COLORES.gris;
      return (sel ? `<path d="${d}" fill="none" stroke="#f9a01b" stroke-width="6.4" stroke-linejoin="round" opacity=".55"/>` : "") + `<path d="${d}" fill="none" stroke="#1d1d1d" stroke-width="3.6" stroke-linejoin="round" stroke-linecap="round"/>` +
        (c[1] === "bi" ? `<path d="${d}" fill="none" stroke="#2f8a4c" stroke-width="2.5" stroke-linejoin="round"/><path d="${d}" fill="none" stroke="#f0c419" stroke-width="2.5" stroke-dasharray="4 4" stroke-linejoin="round"/>` : `<path d="${d}" fill="none" stroke="${c[1]}" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="butt"/>`);
    };
        function pintar() {
      const g = G(f); R = modo === "sim" ? evaluar(f, sim) : null;
      svg.setAttribute("viewBox", `0 0 ${g.W} ${g.Hh}`); svg.style.width = zoom + "%"; svg.classList.toggle("fr-sim", modo === "sim");
      let s = `<defs><linearGradient id="fr-riel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#dfe1e4"/><stop offset=".5" stop-color="#b9bcc2"/><stop offset="1" stop-color="#d4d6da"/></linearGradient></defs>`;
      s += `<rect x="${g.OX}" y="${TOP}" width="${g.cajaW}" height="${g.cajaH}" rx="7" fill="#f2f2ee" stroke="#8d8f88" stroke-width="1.6"/><rect x="${g.OX + 8}" y="${TOP + 8}" width="${g.cajaW - 16}" height="${g.cajaH - 16}" rx="4" fill="#eceae4" stroke="#c9cbc4" stroke-width=".8"/>`;
      for (let r = 0; r < f.filas; r++) {
        const cy = TOP + MY + r * PASO + PASO / 2, rx = g.OX + MX - 5, rw = f.mpf * M + 10;
        s += `<rect x="${rx}" y="${cy - 17.5}" width="${rw}" height="35" fill="url(#fr-riel)" stroke="#8d8f88" stroke-width=".6"/>`;
        for (let i = 0; i < f.mpf * 2; i++) s += `<rect x="${g.OX + MX + 3 + i * 9}" y="${cy - 2.2}" width="5" height="4.4" rx="2.2" fill="#8d8f88" opacity=".55"/>`;
        for (let i = 0; i <= f.mpf; i++) s += `<line x1="${g.OX + MX + i * M}" y1="${cy - H / 2 - 2}" x2="${g.OX + MX + i * M}" y2="${cy + H / 2 + 2}" stroke="#bdbeb8" stroke-width=".35" stroke-dasharray="1.2 2.4"/>`;
        const ocup = f.items.filter(o => enRiel(o) && o.f === r && o.k !== "reserva").reduce((a, o) => a + modOf(o), 0);
        s += `<text x="${g.OX + 12}" y="${cy - H / 2 - 40}" font-size="5.4" fill="#7a7c74" font-family="Archivo,Arial,sans-serif" font-weight="700">Fila ${r + 1} · ${ocup}/${f.mpf} módulos</text>`;
      }
      const TM = new Map(); f.items.forEach(o => terminales(o, g, f).forEach(tt => TM.set(tt.id, tt)));
      const hayCC = Object.values(sim.falla).includes("cc");
      f.cables.forEach(c => {
        const a = TM.get(c.a), b = TM.get(c.b); if (!a || !b) return;
        const T = (a.tipo === "X" ? b.tipo : a.tipo) || "L1", lane = ({ L1: -12, L2: -6, L3: 0, N: 6, PE: 12, X: 0 })[T] || 0, d = camino(a.x, b.x, a.y, b.y, lane, a.lado === "t" ? -1 : 1, b.lado === "t" ? -1 : 1), cs = R && R.cable.get(c.id);
        s += cableSvg(d, c.color || COLOR_AUTO[T] || "gris", c.id === selC) + `<path d="${d}" fill="none" stroke="transparent" stroke-width="9" data-cable="${c.id}" style="cursor:pointer"/>`;
        if (sim.flash && sim.t < sim.flash.hasta && sim.flash.ids.includes(c.id)) s += `<path class="fr-flujo cc" d="${d}"/>`;
        else if (cs && cs.vivo && (cs.I > 0 || T === "N" || T === "PE" ? cs.I > 0 : true)) s += `<path class="fr-flujo${hayCC && cs.I >= ISC * .5 ? " cc" : cs.I > 16 ? " alto" : ""}" d="${d}"/>`;
      });
      f.items.forEach(o => {
        const p = pos(o, g, f), v = estadoVista(o);
        if (o.z === "c") { s += `<g class="fr-carga fr-dev${multi.has(o.id) ? " sel" : ""}" data-id="${o.id}" transform="translate(${p.x},${p.y})"><rect x="0" y="-4" width="${LW}" height="${LH}" rx="6" fill="transparent"/>${dibujarCarga(o, v)}</g>`; return; }
        if (o.z === "a") { s += `<g class="fr-dev${multi.has(o.id) ? " sel" : ""}" data-id="${o.id}" transform="translate(${p.x},${p.y})"><rect x="0" y="0" width="70" height="${TOP - 18}" rx="6" fill="transparent"/>${dibujarAcom(o, v)}</g>`; return; }
        const w = modOf(o) * M, heat = sim.heat[o.id] || 0;
        s += `<g class="fr-dev${multi.has(o.id) ? " sel" : ""}" data-id="${o.id}" transform="translate(${p.x},${p.y})">${D[o.k](w, o.p, v)}${tornillos(o, g, f, p)}<rect x="0" y="0" width="${w}" height="${H}" fill="transparent"/>` +
          (v.e === "trip" ? `<circle cx="${w - 5}" cy="5.5" r="3" fill="#c23b2c" class="fr-alarma"/>` : "") +
          (modo === "sim" && heat > .05 ? `<rect x="3" y="${H + 13}" width="${w - 6}" height="2.6" rx="1.3" fill="#ddd"/><rect x="3" y="${H + 13}" width="${Math.min(1, heat) * (w - 6)}" height="2.6" rx="1.3" fill="${heat > .7 ? "#c23b2c" : "#f59e0b"}"/>` : "") +
          (o.rot ? `<rect x="${w / 2 - Math.min(w / 2, 22)}" y="${H + 2}" width="${Math.min(w, 44)}" height="9" rx="1.6" fill="#fff" stroke="#9a9b95" stroke-width=".5"/><text x="${w / 2}" y="${H + 8.6}" font-size="5.2" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="700" fill="#1f201d">${esc(o.rot)}</text>` : "") + `</g>`;
      });
      f.items.forEach(o => terminales(o, g, f).forEach(tt => {
        const cl = CLS[o.k], usado = f.cables.some(c => c.a === tt.id || c.b === tt.id), activo = previa === tt.id, en = R && R.vis.has(tt.id), ac = PUNTO[tt.tipo] || "#f9a01b";
        const sobre = cl === "prot" || cl === "sw" || cl === "med" || cl === "tap" || cl === "carga" || cl === "junc";
        let marca;
        if (sobre) marca = `<circle cx="${tt.x}" cy="${tt.y}" r="${activo ? 8.4 : cl === "junc" ? 3.4 : 7.2}" fill="rgba(255,255,255,.01)" stroke="${en ? "#ffb300" : ac}" stroke-width="${en ? 2.4 : 1.7}"/>${usado ? `<circle cx="${tt.x}" cy="${tt.y}" r="1.7" fill="${ac}" stroke="#fff" stroke-width=".6"/>` : ""}`;
        else marca = `<circle cx="${tt.x}" cy="${tt.y}" r="${activo ? 4.8 : 3.4}" fill="${ac}" stroke="${en ? "#ffb300" : "#232323"}" stroke-width="${en ? 1.8 : .9}"/>${usado ? `<circle cx="${tt.x}" cy="${tt.y}" r="1.2" fill="#fff"/>` : ""}`;
        const ly = sobre ? (tt.lado === "t" ? tt.y + 11.4 : tt.y - 8.4) : (cl === "src" ? tt.y - 5.6 : tt.y + 8);
        s += `<g class="fr-term" data-term="${tt.id}">${marca}` + (tt.tipo !== "X" && !(cl === "junc") ? `<text x="${tt.x}" y="${ly}" font-size="3.2" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="700" fill="#55574f">${tt.tipo}</text>` : "") + `</g>`;
      }));
      s += `<path id="fr-prev" d="" fill="none" stroke="#f9a01b" stroke-width="1.2" stroke-dasharray="3 2.4" stroke-linejoin="round"/>`;
      if (!f.items.some(o => CLS[o.k] === "src")) s += `<text x="${g.W / 2}" y="13" text-anchor="middle" font-size="5" fill="#9a9b95" font-family="Archivo,Arial,sans-serif" font-weight="700">Sumá la acometida (bajada de línea) desde Componentes</text>`;
      svg.innerHTML = s; svg._TM = TM;
    }
    function lista() {
      const c = {};
      f.items.filter(o => enRiel(o) && !K[o.k].sinLista).forEach(o => { const d = K[o.k].d(o.p); c[d] = (c[d] || 0) + 1; });
      const ks = Object.keys(c).sort();
      $("fr-lista").innerHTML = `<h3 style="margin:0 0 8px">Lista de materiales</h3>` + (ks.length ? `<table>${ks.map(k => `<tr><td>${esc(k)}</td><td>${c[k]}</td></tr>`).join("")}</table>` : `<p style="margin:0;color:#55574f">Agregá dispositivos desde el panel de la izquierda.</p>`);
    }
    function prop() {
      const sg = [...multi].join(",") + "|" + selC;
      if (sg !== ultSel) { ultSel = sg; if (noAuto) noAuto = false; else if (modo === "armar") verTab(multi.size || selC ? "prop" : "comp"); }
      const o = f.items.find(i => i.id === sel), box = $("fr-prop");
      if (modo === "sim") { box.hidden = true; return; } box.hidden = false;
      if (multi.size > 1) {
        box.innerHTML = `<h3 style="margin:0 0 10px">${multi.size} elementos seleccionados</h3><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn chico claro" id="fm-dup">Duplicar</button><button type="button" class="btn chico claro" id="fm-cp">Copiar</button><button type="button" class="btn chico peligro" id="fm-del">Quitar</button></div><p style="margin:10px 0 0;color:#55574f;font-size:.86rem">Ctrl+C, Ctrl+X y Ctrl+V copian, cortan y pegan. Ctrl+Z deshace. Las flechas los mueven y Suprimir los quita.</p>`;
        box.querySelector("#fm-dup").onclick = () => { copiar(); pegar(); }; box.querySelector("#fm-cp").onclick = copiar; box.querySelector("#fm-del").onclick = () => quitarVarios([...multi]); return;
      }
      if (selC) { const cb = f.cables.find(c => c.id === selC); if (!cb) { selC = null; return; } const T = tipoDe(cb.a) === "X" ? tipoDe(cb.b) : tipoDe(cb.a); box.innerHTML = `<h3 style="margin:0 0 10px">Cable</h3><div class="g"><div><label for="fp-col">Color</label><select id="fp-col">${Object.keys(COLORES).map(k => `<option value="${k}"${k === (cb.color || COLOR_AUTO[T]) ? " selected" : ""}>${COLORES[k][0]}</option>`).join("")}</select></div></div><div style="margin-top:12px"><button type="button" class="btn chico peligro" id="fp-qc">Quitar cable</button></div>`; box.querySelector("#fp-col").onchange = e => { cb.color = e.target.value; guardar(); pintar(); }; box.querySelector("#fp-qc").onclick = () => { f.cables = f.cables.filter(c => c.id !== selC); selC = null; todo(); }; return; }
      if (!o) { box.innerHTML = `<p style="margin:0;color:#55574f">Tocá un dispositivo para editarlo o arrastralo. Unir dos puntos arma un cable. Colores habituales: fases marrón, negro y rojo; neutro celeste; tierra verde-amarillo.</p>`; return; }
      const k = K[o.k];
      box.innerHTML = `<h3 style="margin:0 0 10px">${esc(k.n)}</h3><div class="g">${enRiel(o) ? `<div><label for="fp-rot">Rótulo (circuito)</label><input id="fp-rot" value="${esc(o.rot || "")}" placeholder="Luces, Tomas…"></div>` : ""}` +
        k.campos.map(c => {
          if (c === "n") return `<div><label for="fp-n">Módulos</label><input id="fp-n" type="number" min="1" max="${k.nmax || 12}" value="${o.p.n}"></div>`;
          if (c === "rango") return `<div><label for="fp-rango">Rango (A)</label><input id="fp-rango" value="${esc(o.p.rango)}"></div>`;
          if (c === "w") return `<div><label for="fp-w">Potencia (W)</label><input id="fp-w" type="number" min="10" step="10" value="${o.p.w}"></div>`;
          const [l, op] = OPC[c], lst = op(k);
          return `<div><label for="fp-${c}">${l}</label><select id="fp-${c}">${lst.map(v => `<option value="${v}"${String(v) === String(o.p[c]) ? " selected" : ""}>${v === "mono" ? "Monofásica 220 V" : v === "tri" ? "Trifásica 380 V" : v}</option>`).join("")}</select></div>`;
        }).join("") + `</div><div style="display:flex;gap:8px;margin-top:12px;flex-wrap:wrap"><button type="button" class="btn chico claro" id="fp-dup">Duplicar</button><button type="button" class="btn chico peligro" id="fp-del">Quitar</button></div>`;
      const cambiar = (clave, valor) => {
        const prev = JSON.stringify(o.p), antes = enRiel(o) ? modOf(o) : 0;
        if (clave === "n") o.p.n = Math.max(1, Math.min(k.nmax || 12, +valor || 1)); else if (clave === "polos") o.p.polos = +valor; else if (clave === "w") o.p.w = Math.max(10, +valor || 10); else o.p[clave] = valor;
        if (enRiel(o) && modOf(o) !== antes && !libre(f, o.f, o.x, modOf(o), o.id)) { o.p = JSON.parse(prev); aviso("No hay lugar en esa fila para ese ancho"); prop(); return; }
        guardar(); pintar(); lista(); info();
      };
      const rot = box.querySelector("#fp-rot"); if (rot) rot.oninput = e => { o.rot = e.target.value; guardar(); pintar(); };
      k.campos.forEach(c => { const i = box.querySelector("#fp-" + c); if (i) i.onchange = e => cambiar(c, e.target.value); });
      box.querySelector("#fp-del").onclick = () => quitar(o.id);
      box.querySelector("#fp-dup").onclick = () => { if (!enRiel(o)) { if (o.z === "a") return aviso("Hay una sola acometida"); const n = { id: uid(), k: o.k, p: Object.assign({}, o.p), z: o.z }; f.items.push(n); sel = n.id; multi = new Set([n.id]); return todo(); } const h = hueco(f, modOf(o), o.f); if (!h) return aviso("No hay lugar libre en el tablero"); const n = { id: uid(), k: o.k, p: Object.assign({}, o.p), rot: o.rot, f: h.f, x: h.x }; f.items.push(n); sel = n.id; multi = new Set([n.id]); todo(); };
    }
    function selTodo() { multi = new Set(f.items.map(o => o.id)); sel = f.items[0] ? f.items[0].id : null; selC = null; pintar(); prop(); }
    function borrarSel() { if (selC) { f.cables = f.cables.filter(c => c.id !== selC); selC = null; todo(); } else if (multi.size) quitarVarios([...multi]); }
    function quitarVarios(ids) {
      const S = new Set(ids); f.items = f.items.filter(i => !S.has(i.id)); f.cables = f.cables.filter(c => !S.has(c.a.split(":")[0]) && !S.has(c.b.split(":")[0])); multi = new Set(); sel = null; selC = null; todo();
    }
    /* Copiar, cortar y pegar: los dispositivos y los cables que hay entre ellos */
    function copiar() {
      const ids = [...multi], its = f.items.filter(o => ids.includes(o.id) && CLS[o.k] !== "src"); if (!its.length) return aviso("Seleccioná algo para copiar");
      const S = new Set(its.map(o => o.id)); clip = { items: JSON.parse(JSON.stringify(its)), cables: JSON.parse(JSON.stringify(f.cables.filter(c => S.has(c.a.split(":")[0]) && S.has(c.b.split(":")[0])))) };
      aviso(its.length === 1 ? "Copiado" : its.length + " copiados");
    }
    function cortar() { copiar(); if (clip) quitarVarios([...multi]); }
    function pegar() {
      if (!clip) return aviso("No hay nada copiado");
      const mapa = {}, nuevos = [], extra = [];
      for (const o of clip.items) {
        const n = JSON.parse(JSON.stringify(o)); n.id = uid(); mapa[o.id] = n.id;
        if (!enRiel(n)) { extra.push(n); continue; }
        const h = hueco(f, modOf(n), o.f); if (!h) { aviso("No hay lugar libre para pegar todo"); continue; }
        n.f = h.f; n.x = h.x; f.items.push(n); nuevos.push(n);
      }
      extra.forEach(n => { f.items.push(n); nuevos.push(n); });
      clip.cables.forEach(c => { const a = mapa[c.a.split(":")[0]], b = mapa[c.b.split(":")[0]]; if (a && b) f.cables.push({ id: uid(), a: a + ":" + c.a.split(":").slice(1).join(":"), b: b + ":" + c.b.split(":").slice(1).join(":"), color: c.color }); });
      multi = new Set(nuevos.map(n => n.id)); sel = nuevos[0] ? nuevos[0].id : null; selC = null; todo();
    }
    function quitar(id) { f.items = f.items.filter(i => i.id !== id); f.cables = f.cables.filter(c => !c.a.startsWith(id + ":") && !c.b.startsWith(id + ":")); multi.delete(id); if (sel === id) sel = null; todo(); }

    /* Panel de la simulación */
    function panelSim() {
      const box = $("fr-simp"); box.hidden = modo !== "sim"; if (modo !== "sim") return;
      const o = f.items.find(i => i.id === sel), carga = o && CLS[o.k] === "load", RR = R || evaluar(f, sim);
      const ccActivo = Object.values(sim.falla).includes("cc"), alertas = avisos(f, sim, RR), nombresCC = Object.keys(sim.falla).filter(k => sim.falla[k] === "cc").map(id => { const q = f.items.find(i => i.id === id); return q ? LOAD[q.k].n : ""; }).join(", ");
      box.innerHTML = `<div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-bottom:10px"><h3 style="margin:0;margin-right:auto">Simulación</h3><button type="button" class="btn chico ${sim.red ? "claro" : "peligro"}" id="fs-red">${sim.red ? "Cortar la red" : "Volver la red"}</button><button type="button" class="btn chico claro" id="fs-reset">Reiniciar</button></div>` +
        (ccActivo ? `<div class="fr-alerta">Cortocircuito en ${esc(nombresCC)}</div>` : "") +
        (carga ? `<div style="margin-bottom:10px"><b>${esc(LOAD[o.k].n)}</b> · ${o.p.w} W · ${sim.cerrado[o.id] === false ? "apagado" : "encendido"}${sim.falla[o.id] ? " · falla: " + ({ cc: "cortocircuito", sobre: "sobrecarga", fuga: "fuga a tierra" })[sim.falla[o.id]] : ""}</div><div style="display:flex;gap:8px;flex-wrap:wrap"><button type="button" class="btn chico peligro" data-fa="cc">Cortocircuito</button><button type="button" class="btn chico" data-fa="sobre" style="background:#f59e0b;color:#201600">Sobrecarga</button><button type="button" class="btn chico" data-fa="fuga" style="background:#2563eb">Fuga a tierra</button><button type="button" class="btn chico claro" data-fa="ok">Quitar falla</button><button type="button" class="btn chico claro" data-fa="onoff">${sim.cerrado[o.id] === false ? "Encender" : "Apagar"}</button></div>`
          : `<p style="margin:0 0 8px;color:#55574f">Tocá un interruptor para abrirlo o cerrarlo, o una carga para provocarle una falla.</p>`) +
        (alertas.length ? `<ul class="fr-log">${alertas.map(a => `<li>${esc(a)}</li>`).join("")}</ul>` : "") +
        (sim.log.length ? `<ul class="fr-log">${sim.log.slice(-8).reverse().map(l => `<li><b>${l.t.toFixed(1)} s</b>${esc(l.m)}</li>`).join("")}</ul>` : "");
      box.querySelector("#fs-red").onclick = () => { sim.red = !sim.red; sim.log.push({ t: sim.t, m: sim.red ? "Vuelve la red." : "Se cortó la red." }); ultimaSig = ""; tick(true); };
      box.querySelector("#fs-reset").onclick = () => { sim = mk(); sim.on = true; ultimaSig = ""; pintar(); panelSim(); };
      box.querySelectorAll("[data-fa]").forEach(b => b.onclick = () => {
        const a = b.dataset.fa; if (a === "ok") delete sim.falla[o.id]; else if (a === "onoff") sim.cerrado[o.id] = sim.cerrado[o.id] === false; else { sim.falla[o.id] = a; sim.log.push({ t: sim.t, m: `${LOAD[o.k].n}: ${({ cc: "cortocircuito", sobre: "sobrecarga", fuga: "fuga a tierra" })[a]}.` }); }
        ultimaSig = ""; tick(true);
      });
    }
    function todo() { guardar(); pintarCab(); info(); pintar(); lista(); prop(); panelSim(); }

    /* Motor de la simulación: cada 100 ms */
    function tick(forzar) {
      if (!document.body.contains(el)) { clearInterval(timer); return; }
      if (modo !== "sim") return;
      const dt = forzar === true ? 0 : .1; sim.t += dt;
      const r = evaluar(f, sim); const cand = [];
      f.items.filter(o => CLS[o.k] === "prot").forEach(o => {
        const d = r.dev.get(o.id); if (!d || !d.vivo || sim.disparo[o.id] || sim.cerrado[o.id] === false) return;
        const In = nominal(o), ratio = d.I / In;
        if (o.k !== "difer" && d.I >= magMult(o) * In) cand.push({ o, m: "cc", prof: d.prof });
        else if (o.k === "difer" && d.L >= (parseFloat(o.p.sens) || 30) / 1000) cand.push({ o, m: "fuga", prof: d.prof });
        else { if (ratio > 1.13) sim.heat[o.id] = (sim.heat[o.id] || 0) + dt * (ratio * ratio - 1) / 4.4; else sim.heat[o.id] = Math.max(0, (sim.heat[o.id] || 0) - dt * .2); if (sim.heat[o.id] >= 1) cand.push({ o, m: "sobre", prof: d.prof }); }
      });
      let disparo = null;
      if (cand.length) { cand.sort((a, b) => (a.m === "sobre") - (b.m === "sobre") || b.prof - a.prof); disparo = cand[0]; }
      if (disparo) {
        const o = disparo.o; sim.disparo[o.id] = disparo.m; sim.heat[o.id] = 0;
        const nom = (K[o.k].d(o.p) + (o.rot ? " (" + o.rot + ")" : "")).trim();
        if (disparo.m === "cc") sim.flash = { hasta: sim.t + 1.6, ids: f.cables.filter(c => (r.cable.get(c.id) || {}).I >= ISC * .5).map(c => c.id) };
        sim.log.push({ t: sim.t, m: `Disparó ${nom}: ${{ cc: "cortocircuito, al instante", sobre: "sobrecarga, por calentamiento", fuga: "fuga a tierra" }[disparo.m]}.` });
      }
      const fl = sim.flash && sim.t < sim.flash.hasta ? 1 : 0; if (!fl && sim.flash) { sim.flash = null; ultimaSig = ""; }
      const sig = JSON.stringify([fl, sim.red, sim.cerrado, sim.disparo, sim.falla, [...r.dev].map(([k, d]) => k + (d.vivo ? 1 : 0) + Math.round(d.I * 10)), Object.keys(sim.heat).map(k => Math.round((sim.heat[k] || 0) * 8)), sim.log.length]);
      if (sig !== ultimaSig || disparo) { ultimaSig = sig; pintar(); panelSim(); }
    }
    function cambiarModo(m) {
      modo = m; sel = null; multi = new Set(); selC = null; previa = null; clearInterval(timer);
      if (m === "sim") { sim = mk(); sim.on = true; ultimaSig = ""; timer = setInterval(tick, 100); } else sim.on = false;
      ptab = m === "sim" ? "sim" : "comp"; ultSel = ""; pintarTabs(); pintarRail(); pintarCab(); info(); pintar(); prop(); panelSim();
    }

    function agregar(k, fila, x) {
      const kk = K[k], it = { id: uid(), k, p: Object.assign({}, kk.def) };
      if (kk.z === "a") { if (f.items.some(o => o.z === "a")) return aviso("Ya hay una acometida"); it.z = "a"; }
      else if (kk.z === "c") { it.z = "c"; }
      else { const m = modOf(it); it.rot = ""; if (fila != null && libre(f, fila, x, m)) { it.f = fila; it.x = x; } else { const h = hueco(f, m, sel ? (f.items.find(i => i.id === sel) || {}).f || 0 : 0); if (!h) return aviso("No hay lugar libre en el tablero"); it.f = h.f; it.x = h.x; } }
      f.items.push(it); sel = it.id; multi = new Set([it.id]); noAuto = true; todo();
    }

    /* Cablear solo: acometida -> general -> diferencial -> protecciones -> cargas */
    function cablear() {
      const A = f.items.find(o => o.z === "a"); if (!A) return aviso("Primero sumá la acometida");
      if (f.cables.length && !confirm("Esto reemplaza los cables actuales. ¿Seguir?")) return;
      f.cables = []; const w = (a, b, tp) => f.cables.push({ id: uid(), a, b, color: COLOR_AUTO[tp] || "gris" });
      const rail = f.items.filter(enRiel).sort((a, b) => (a.f - b.f) || (a.x - b.x)), up = {};
      polosDe(A).forEach(tp => { up[tp] = `${A.id}:b${tp}`; });
      const pasar = o => polosDe(o).forEach(tp => { if (up[tp]) { w(up[tp], `${o.id}:t${tp}`, tp); up[tp] = `${o.id}:b${tp}`; } });
      rail.filter(o => ["medidor1", "medidor3", "amperimetro"].includes(o.k)).forEach(pasar);
      const G1 = rail.find(o => o.k === "general"), D1 = rail.find(o => o.k === "difer"); if (G1) pasar(G1); if (D1) pasar(D1);
      const bn = rail.find(o => o.k === "barraN"), bt = rail.find(o => o.k === "barraT"); let ni = 0, ti = 0;
      if (bn && up.N) w(up.N, `${bn.id}:tN0`, "N");
      if (bt && up.PE) w(up.PE, `${bt.id}:tPE0`, "PE");
      const neutro = () => (bn ? `${bn.id}:bN${ni++ % modOf(bn)}` : up.N), tierra = () => (bt ? `${bt.id}:bPE${ti++ % modOf(bt)}` : up.PE);
      rail.filter(o => ["voltimetro", "piloto", "monitor", "dps", "fuente"].includes(o.k)).forEach(o => polosDe(o).forEach(tp => { const o2 = tp === "N" ? neutro() : up[tp]; if (o2) w(o2, `${o.id}:t${tp}`, tp); }));
      const ramas = rail.filter(o => ["termo", "fusible", "guardamotor", "contactor"].includes(o.k)), tieneN = {};
      ramas.forEach(o => polosDe(o).forEach(tp => { const o2 = tp === "N" ? neutro() : up[tp]; if (o2) w(o2, `${o.id}:t${tp}`, tp); if (tp === "N") tieneN[o.id] = 1; }));
      f.items.filter(o => o.z === "c").forEach((c, i) => {
        const r = ramas[i] || ramas[ramas.length - 1]; if (!r) return; const pr = polosDe(r);
        polosDe(c).forEach(tp => {
          if (tp === "PE") { const o2 = tierra(); if (o2) w(o2, `${c.id}:tPE`, "PE"); }
          else if (tp === "N") { const o2 = pr.includes("N") ? `${r.id}:bN` : neutro(); if (o2) w(o2, `${c.id}:tN`, "N"); }
          else if (pr.includes(tp)) w(`${r.id}:b${tp}`, `${c.id}:t${tp}`, tp);
        });
      });
      todo(); aviso("Cableado armado");
    }

        /* Eventos de la caja y la paleta */
    el.addEventListener("change", e => {
      const id = e.target.id;
      if (id === "fr-pre") { const p = PRESETS.find(q => q[0] === e.target.value); f.preset = p[0]; if (p[2]) aplicar(p[2], p[3]); else pintarCab(); }
      else if (id === "fr-fil") aplicar(+e.target.value || 1, f.mpf, true);
      else if (id === "fr-mpf") aplicar(f.filas, +e.target.value || 12, true);
      else if (id === "fr-an") { f.ancho = e.target.value.trim(); guardar(); info(); }
      else if (id === "fr-al") { f.alto = e.target.value.trim(); guardar(); info(); }
      else if (id === "fr-pr") { f.prof = e.target.value.trim(); guardar(); info(); }
    });
    el.addEventListener("input", e => { if (e.target.id === "fr-z") { zoom = +e.target.value; svg.style.width = zoom + "%"; try { localStorage.setItem("fr-zoom", zoom); } catch (x) { } } });
    el.addEventListener("click", e => {
      const ac = e.target.closest("[data-ac]");
      if (ac) { const fn = { armar: () => cambiarModo("armar"), sim: () => cambiarModo("sim"), undo: deshacer, redo: rehacer, copy: copiar, cut: cortar, paste: pegar, dup: () => { copiar(); pegar(); }, selall: selTodo, del: borrarSel, auto: cablear, quitarc: () => { f.cables = []; todo(); }, zin: () => zoomPor(12), zout: () => zoomPor(-12), fit: ajustar }[ac.dataset.ac]; if (fn) fn(); return; }
      const pt = e.target.closest("[data-ptab]"); if (pt) return verTab(pt.dataset.ptab);
      const m = e.target.closest("[data-modo]"); if (m) return cambiarModo(m.dataset.modo);
      if (e.target.id === "fr-undo") return deshacer();
      if (e.target.id === "fr-redo") return rehacer();
      if (e.target.id === "fr-auto") return cablear();
      if (e.target.id === "fr-quitarc") { f.cables = []; todo(); }
    });
    function aplicar(filas, mpf, manual) {
      filas = Math.max(1, Math.min(6, filas)); mpf = Math.max(4, Math.min(36, mpf));
      if (f.items.some(o => enRiel(o) && (o.f >= filas || o.x + modOf(o) > mpf))) { aviso("Hay dispositivos fuera de esa medida. Movelos o quitalos primero."); pintarCab(); return; }
      f.filas = filas; f.mpf = mpf; if (manual) f.preset = (PRESETS.find(p => p[2] === filas && p[3] === mpf) || ["x"])[0]; f.ancho = ""; f.alto = ""; todo();
    }
    $("fr-pal").addEventListener("click", e => { const b = e.target.closest(".fr-tile"); if (b) agregar(b.dataset.k); });
    $("fr-pal").addEventListener("dragstart", e => { const b = e.target.closest(".fr-tile"); if (b) e.dataTransfer.setData("text/fr", b.dataset.k); });
    const aPunto = (cx, cy) => { const pt = svg.createSVGPoint(); pt.x = cx; pt.y = cy; return pt.matrixTransform(svg.getScreenCTM().inverse()); };
    const celda = (p, mod, offX) => { const g = G(f), fila = Math.max(0, Math.min(f.filas - 1, Math.floor((p.y - TOP - MY) / PASO))); const x = Math.round((p.x - g.OX - MX - offX) / M); return { f: fila, x: Math.max(0, Math.min(f.mpf - mod, x)) }; };
    svg.addEventListener("dragover", e => e.preventDefault());
    svg.addEventListener("drop", e => { e.preventDefault(); const k = e.dataTransfer.getData("text/fr"); if (!k || modo === "sim" || K[k].z) return; const it = { k, p: Object.assign({}, K[k].def) }, m = modOf(it), p = aPunto(e.clientX, e.clientY), c = celda(p, m, m * M / 2); agregar(k, c.f, c.x); });

    /* Puntero: terminales, cables, dispositivos */
    function crearCable(a, b) {
      const ia = a.split(":")[0], ib = b.split(":")[0], ka = (f.items.find(o => o.id === ia) || {}).k;
      if (a === b || (ia === ib && CLS[ka] !== "junc")) return aviso("Unilo con otro dispositivo");
      if (f.cables.some(c => (c.a === a && c.b === b) || (c.a === b && c.b === a))) return;
      const T = tipoDe(a) === "X" ? tipoDe(b) : tipoDe(a); f.cables.push({ id: uid(), a, b, color: COLOR_AUTO[T] || "gris" }); selC = null; todo();
    }
    const NS = "http://www.w3.org/2000/svg";
    function dibujarMarco() {
      let r = svg.querySelector("#fr-marco"); if (!r) { r = document.createElementNS(NS, "rect"); r.id = "fr-marco"; r.setAttribute("fill", "rgba(249,160,27,.12)"); r.setAttribute("stroke", "#f9a01b"); r.setAttribute("stroke-width", ".9"); r.setAttribute("stroke-dasharray", "3 2"); svg.appendChild(r); }
      r.setAttribute("x", Math.min(marco.x0, marco.x1)); r.setAttribute("y", Math.min(marco.y0, marco.y1)); r.setAttribute("width", Math.abs(marco.x1 - marco.x0)); r.setAttribute("height", Math.abs(marco.y1 - marco.y0));
    }
    function terminarMarco() {
      const m = marco; marco = null; const r = svg.querySelector("#fr-marco"); if (r) r.remove();
      const x0 = Math.min(m.x0, m.x1), x1 = Math.max(m.x0, m.x1), y0 = Math.min(m.y0, m.y1), y1 = Math.max(m.y0, m.y1);
      if (x1 - x0 < 2 && y1 - y0 < 2) { if (!m.suma) { sel = null; multi = new Set(); selC = null; } pintar(); prop(); panelSim(); return; }
      const g = G(f), dentro = f.items.filter(o => { const p = pos(o, g, f), w = o.z === "c" ? LW : o.z === "a" ? 70 : modOf(o) * M, h = o.z === "c" ? LH : o.z === "a" ? TOP - 18 : H; return p.x < x1 && p.x + w > x0 && p.y < y1 && p.y + h > y0; });
      multi = new Set([...m.base, ...dentro.map(o => o.id)]); sel = multi.size ? [...multi][0] : null; selC = null; pintar(); prop();
    }
    svg.addEventListener("pointerdown", e => {
      const term = e.target.closest(".fr-term");
      if (term && modo === "armar") { const id = term.dataset.term; if (!previa) { previa = id; pintar(); } else { const a = previa; previa = null; crearCable(a, id); } return; }
      const cab = e.target.closest("[data-cable]");
      if (cab && modo === "armar") { selC = cab.dataset.cable; sel = null; multi = new Set(); prop(); pintar(); return; }
      const g = e.target.closest(".fr-dev");
      if (!g) {
        if (previa) { previa = null; pintar(); }
        if (modo === "armar") { const p = aPunto(e.clientX, e.clientY); marco = { x0: p.x, y0: p.y, x1: p.x, y1: p.y, suma: e.shiftKey, base: e.shiftKey ? new Set(multi) : new Set() }; selC = null; svg.setPointerCapture(e.pointerId); }
        else if (sel) { sel = null; multi = new Set(); pintar(); prop(); panelSim(); }
        return;
      }
      const o = f.items.find(i => i.id === g.dataset.id); if (!o) return;
      if (modo === "sim") {
        sel = o.id; multi = new Set([o.id]); const c = CLS[o.k];
        if (c === "prot") { if (sim.disparo[o.id]) { delete sim.disparo[o.id]; sim.cerrado[o.id] = true; sim.log.push({ t: sim.t, m: `Se rearmó ${K[o.k].d(o.p)}.` }); } else sim.cerrado[o.id] = sim.cerrado[o.id] === false; }
        else if (c === "sw") sim.cerrado[o.id] = sim.cerrado[o.id] === false;
        ultimaSig = ""; tick(true); panelSim(); return;
      }
      selC = null;
      if (e.shiftKey) { if (multi.has(o.id)) multi.delete(o.id); else multi.add(o.id); sel = multi.size ? (multi.has(o.id) ? o.id : [...multi][0]) : null; prop(); pintar(); return; }
      const yaDentro = multi.has(o.id) && multi.size > 1;
      if (!yaDentro) multi = new Set([o.id]);
      sel = o.id; prop();
      if (!enRiel(o)) { pintar(); return; }
      const grupo = f.items.filter(q => multi.has(q.id) && enRiel(q)).map(q => ({ it: q, f: q.f, x: q.x })), p = aPunto(e.clientX, e.clientY), gg = G(f);
      arrastre = { it: o, grupo, off: p.x - (gg.OX + MX + o.x * M), mov: false, ok: false, d: { f: 0, x: 0 }, antes: yaDentro }; svg.setPointerCapture(e.pointerId); pintar();
    });
    svg.addEventListener("pointermove", e => {
      if (marco) { const p = aPunto(e.clientX, e.clientY); marco.x1 = p.x; marco.y1 = p.y; dibujarMarco(); return; }
      if (previa) { const prev = svg.querySelector("#fr-prev"), a = svg._TM && svg._TM.get(previa); if (prev && a) { const p = aPunto(e.clientX, e.clientY); prev.setAttribute("d", caminoLibre(a.x, a.y, a.lado === "t" ? -1 : 1, p.x, p.y)); } return; }
      if (!arrastre) return;
      const p = aPunto(e.clientX, e.clientY), m = modOf(arrastre.it), c = celda(p, m, arrastre.off), base = arrastre.grupo.find(q => q.it === arrastre.it) || { f: arrastre.it.f, x: arrastre.it.x };
      const dF = c.f - base.f, dX = c.x - base.x, ids = new Set(arrastre.grupo.map(q => q.it.id));
      arrastre.mov = true; arrastre.d = { f: dF, x: dX }; arrastre.ok = arrastre.grupo.every(q => libre(f, q.f + dF, q.x + dX, modOf(q.it), ids));
      svg.querySelectorAll(".fr-ghost").forEach(x => x.remove()); const gg = G(f);
      arrastre.grupo.forEach(q => { const r = document.createElementNS(NS, "rect"); r.setAttribute("class", "fr-ghost"); r.setAttribute("rx", "2.6"); r.setAttribute("stroke-width", "1.2"); r.setAttribute("stroke-dasharray", "3 2");
        r.setAttribute("x", gg.OX + MX + (q.x + dX) * M); r.setAttribute("y", TOP + MY + (q.f + dF) * PASO + PASO / 2 - H / 2); r.setAttribute("width", modOf(q.it) * M); r.setAttribute("height", H);
        r.setAttribute("fill", arrastre.ok ? "rgba(249,160,27,.22)" : "rgba(194,59,44,.25)"); r.setAttribute("stroke", arrastre.ok ? "#f9a01b" : "#c23b2c"); svg.appendChild(r); });
    });
    const soltar = () => {
      if (marco) return terminarMarco();
      if (!arrastre) return; const a = arrastre; arrastre = null;
      if (a.mov && a.ok && (a.d.f || a.d.x)) { a.grupo.forEach(q => { q.it.f = q.f + a.d.f; q.it.x = q.x + a.d.x; }); todo(); }
      else { if (!a.mov && a.antes) { multi = new Set([a.it.id]); sel = a.it.id; prop(); } pintar(); }
    };
    svg.addEventListener("pointerup", soltar); svg.addEventListener("pointercancel", soltar);
    document.addEventListener("keydown", function h(e) {
      if (!document.body.contains(el)) return document.removeEventListener("keydown", h);
      if (/INPUT|SELECT|TEXTAREA/.test(document.activeElement.tagName)) return;
      const ctrl = e.ctrlKey || e.metaKey, k = e.key.toLowerCase();
      if (e.key === "Escape") { if (previa) { previa = null; pintar(); } else if (multi.size || selC) { multi = new Set(); sel = null; selC = null; pintar(); prop(); panelSim(); } return; }
      if (!ctrl && !e.altKey && k === "s") { cambiarModo("sim"); return; }
      if (!ctrl && !e.altKey && k === "a") { cambiarModo("armar"); return; }
      if (modo !== "armar") return;
      if (ctrl && k === "z" && !e.shiftKey) { e.preventDefault(); return deshacer(); }
      if (ctrl && (k === "y" || (k === "z" && e.shiftKey))) { e.preventDefault(); return rehacer(); }
      if (ctrl && k === "c") { e.preventDefault(); return copiar(); }
      if (ctrl && k === "x") { e.preventDefault(); return cortar(); }
      if (ctrl && k === "v") { e.preventDefault(); return pegar(); }
      if (ctrl && k === "d") { e.preventDefault(); copiar(); return pegar(); }
      if (ctrl && k === "a") { e.preventDefault(); return selTodo(); }
      if (e.key === "Delete" || e.key === "Backspace") { e.preventDefault(); return borrarSel(); }
      const fl = { ArrowLeft: [0, -1], ArrowRight: [0, 1], ArrowUp: [-1, 0], ArrowDown: [1, 0] }[e.key];
      if (fl && multi.size && !ctrl) {
        e.preventDefault(); const grupo = f.items.filter(o => multi.has(o.id) && enRiel(o)); if (!grupo.length) return; const ids = new Set(grupo.map(o => o.id));
        if (grupo.every(o => libre(f, o.f + fl[0], o.x + fl[1], modOf(o), ids))) { grupo.forEach(o => { o.f += fl[0]; o.x += fl[1]; }); todo(); }
      }
    });
    el._exportar = () => {
      const s = svg.outerHTML.replace(/class="[^"]*"/g, "").replace(/style="[^"]*"/, "").replace("<svg ", '<svg width="1600" ');
      const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(['<?xml version="1.0" encoding="UTF-8"?>' + s], { type: "image/svg+xml" })); a.download = (tb.nombre || "tablero").replace(/[^\w-]+/g, "-") + "-frente.svg"; a.click();
    };
    hist = [snap()]; hpos = 0; hsig = hist[0];
    pintarTabs(); pintarRail();
    todo();
    let guardado = null; try { guardado = localStorage.getItem("fr-zoom"); } catch (e) { }
    requestAnimationFrame(() => { if (!guardado) ajustar(); });
    return { exportar: el._exportar, _tick: tick, _modo: cambiarModo, _st: () => ({ f, sim, R }) };
  }
  window.Frente = { montar, contar: tb => (tb && tb.frente ? tb.frente.items.length : 0) };
})();
