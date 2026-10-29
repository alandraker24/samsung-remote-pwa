const $ = (s) => document.querySelector(s);
const ipInput = $("#tvIp");
const feedback = $("#feedback");
const statusText = $("#status");
const dot = $("#statusDot");
const connectBtn = $("#connectBtn");
let socket = null;
let connected = false;

function setStatus(message, online=false) {
  statusText.textContent = message;
  dot.classList.toggle("on", online);
  feedback.textContent = message;
}
function validIPv4(ip) {
  const parts = ip.trim().split(".");
  return parts.length === 4 && parts.every(p => /^\d{1,3}$/.test(p) && Number(p) >= 0 && Number(p) <= 255);
}
function makeToken() {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return btoa(String.fromCharCode(...bytes));
}
function connect() {
  const ip = ipInput.value.trim();
  if (!validIPv4(ip)) {
    setStatus("Escribe una dirección IP válida, por ejemplo 192.168.1.35.");
    return;
  }
  if (location.protocol === "https:") {
    setStatus("Safari puede bloquear conexiones locales inseguras desde HTTPS. Si no conecta, esta limitación requiere una app puente o versión nativa.");
  }
  if (socket) { try { socket.close(); } catch (_) {} }
  const name = btoa(unescape(encodeURIComponent("iPhone 17 Remote")));
  const token = localStorage.getItem("samsungRemoteToken") || makeToken();
  localStorage.setItem("samsungRemoteToken", token);
  const url = `wss://${ip}:8002/api/v2/channels/samsung.remote.control?name=${encodeURIComponent(name)}&token=${encodeURIComponent(token)}`;
  try {
    socket = new WebSocket(url);
    setStatus("Intentando conectar…");
    socket.onopen = () => { connected = true; connectBtn.textContent = "Conectado"; setStatus("Conectado a la TV", true); };
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.event === "ms.channel.connect") setStatus("TV conectada. Ya puedes probar los botones.", true);
        if (data.event === "ms.channel.unauthorized") setStatus("La TV rechazó el acceso. Revisa la pantalla del televisor y acepta el permiso.");
      } catch (_) {}
    };
    socket.onerror = () => { connected = false; setStatus("No se pudo establecer la conexión. Safari puede bloquear el certificado o el acceso local; esta PWA podría necesitar una app puente."); };
    socket.onclose = () => { connected = false; connectBtn.textContent = "Conectar"; };
  } catch (err) {
    setStatus("No se pudo iniciar la conexión. Comprueba la IP y la red Wi‑Fi.");
  }
}
function sendKey(key) {
  if (!socket || socket.readyState !== WebSocket.OPEN || !connected) {
    setStatus("Primero intenta conectar con la IP de tu TV.");
    return;
  }
  const payload = { method: "ms.remote.control", params: { Cmd: "Click", DataOfCmd: key, Option: "false", TypeOfRemote: "SendRemoteKey" } };
  try { socket.send(JSON.stringify(payload)); }
  catch (_) { setStatus("No se pudo enviar el botón."); }
}
connectBtn.addEventListener("click", connect);
document.querySelectorAll("[data-key]").forEach(button => button.addEventListener("click", () => sendKey(button.dataset.key)));
$("#settingsBtn").addEventListener("click", () => $("#settingsDialog").showModal());
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("./sw.js").catch(() => {}));
}
if (window.matchMedia("(display-mode: standalone)").matches) document.body.classList.add("standalone");
