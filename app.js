const liveDot = document.querySelector(".live-dot");
const updated = document.querySelector(".updated");

setInterval(() => {
  const now = new Date();
  const time = now.toLocaleTimeString("pt-PT", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  if (updated) updated.innerHTML = `Atualizado às ${time} <i></i>`;
}, 30000);

if (liveDot) {
  liveDot.addEventListener("click", () => {
    liveDot.classList.toggle("paused");
    liveDot.innerHTML = liveDot.classList.contains("paused") ? "◌ Pausado" : "<i></i> Ao vivo";
  });
}
