// JS simplu pentru schimbarea stage-urilor (0–3)
// Folosim data-stage pe #webmailPlayground și clasa .is-active pe butoane.

document.addEventListener("DOMContentLoaded", () => {
  const playground = document.getElementById("webmailPlayground");
  const chips = document.querySelectorAll(".stage-chip");

  if (!playground || !chips.length) return;

  chips.forEach((btn) => {
    btn.addEventListener("click", () => {
      const stage = btn.getAttribute("data-stage") || "0";

      // setăm etapa curentă
      playground.setAttribute("data-stage", stage);

      // highlight pe butonul activ
      chips.forEach((b) => b.classList.toggle("is-active", b === btn));
    });
  });
});
