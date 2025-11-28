// -------------------------
// Helper: schimbă doar clasa "stare-*", păstrând bg-*
// -------------------------
const body = document.body;

function setStareClass(stare) {
  ["stare-0", "stare-1", "stare-2"].forEach((c) => body.classList.remove(c));
  body.classList.add(`stare-${stare}`);
}

// -------------------------
// Schimbare stare (0 / 1 / 2) pentru toată pagina
// -------------------------

const stageButtons = document.querySelectorAll(".stage-btn");
const panelText = document.getElementById("panel-text");
const panelList = document.getElementById("panel-list");

const descrieriStare = {
  0: {
    text:
      "În Starea 0 vezi pagina aproape doar cu stilul implicit al browser-ului. " +
      "Structura HTML există, dar nu avem un UI real.",
    puncte: [
      "Text nealiniat și fără ierarhie clară.",
      "Stil minim, util doar pentru testare rapidă.",
      "Bază pentru pașii următori."
    ]
  },
  1: {
    text:
      "În Starea 1 activăm CSS de bază: layout, font, spațiere. " +
      "Pagina devine mai ușor de citit, dar fără efecte complexe.",
    puncte: [
      "Header sticky și conținut centrat.",
      "Tipografie constantă și structură mai clară.",
      "Nu avem încă animații sau efecte UI speciale."
    ]
  },
  2: {
    text:
      "În Starea 2 activăm tema completă UI / UX: fundal animat, titlu interactiv " +
      "și secțiuni care apar progresiv la scroll.",
    puncte: [
      "Titlul UI / UX reacționează la mișcarea mouse-ului.",
      "Carduri, butoane și panouri cu micro-interacțiuni.",
      "Scroll-ul dezvăluie treptat conținutul (fade, pop, bounce)."
    ]
  }
};

function seteazaStare(stare) {
  setStareClass(stare);

  stageButtons.forEach((btn) => {
    const val = btn.getAttribute("data-stage");
    btn.classList.toggle("aktiv", String(stare) === val);
  });

  const info = descrieriStare[stare];
  if (info && panelText && panelList) {
    panelText.textContent = info.text;
    panelList.innerHTML = "";
    info.puncte.forEach((p) => {
      const li = document.createElement("li");
      li.textContent = p;
      panelList.appendChild(li);
    });
  }

  if (stare === 2) {
    initScrollReveal();
  }
}

stageButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const stare = Number(btn.getAttribute("data-stage") || "0");
    seteazaStare(stare);
  });
});

// stare inițială
seteazaStare(0);

// -------------------------
// Titlu cu efect de tilt (doar în Starea 2)
// -------------------------

const hero = document.getElementById("hero");
const heroTitle = document.getElementById("hero-title");

if (hero && heroTitle) {
  hero.addEventListener("mousemove", (event) => {
    if (!body.classList.contains("stare-2")) return;

    const rect = hero.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;

    const rotateX = y * -12;
    const rotateY = x * 18;

    heroTitle.style.transform =
      `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    heroTitle.style.textShadow =
      `${-x * 14}px ${y * 14}px 32px rgba(15, 23, 42, 0.95)`;
  });

  hero.addEventListener("mouseleave", () => {
    heroTitle.style.transform =
      "perspective(900px) rotateX(0deg) rotateY(0deg)";
    heroTitle.style.textShadow = "0 0 0 rgba(15, 23, 42, 0.9)";
  });
}

// -------------------------
// MENIU OVERLAY DEMO-URI
// -------------------------

const openMenuBtn = document.getElementById("open-menu-btn");
const menuOverlay = document.getElementById("menu-overlay");
const menuPanel = document.getElementById("menu-panel");
const menuCloseLeft = document.getElementById("menu-close-left");
const menuCloseRight = document.getElementById("menu-close-right");
const menuLinkButtons = document.querySelectorAll(".menu-link-btn");

// versiune nouă – outline-ul butonului devine outline-ul cardului
function openMenuOverlay() {
  if (!menuOverlay || !openMenuBtn) return;

  // (coord vars stay, in case you want to use them later)
  const rect = openMenuBtn.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  menuOverlay.style.setProperty("--menu-origin-x", `${x}px`);
  menuOverlay.style.setProperty("--menu-origin-y", `${y}px`);

  menuOverlay.setAttribute("aria-hidden", "false");
  document.body.classList.add("menu-open");
}

function closeMenuOverlay() {
  if (!menuOverlay) return;
  menuOverlay.setAttribute("aria-hidden", "true");
  document.body.classList.remove("menu-open");
}


if (openMenuBtn && menuOverlay && menuPanel) {
  openMenuBtn.addEventListener("click", () => {
    openMenuOverlay();
  });

  if (menuCloseLeft) {
    menuCloseLeft.addEventListener("click", () => {
      closeMenuOverlay();
    });
  }

  if (menuCloseRight) {
    menuCloseRight.addEventListener("click", () => {
      closeMenuOverlay();
    });
  }

  // închidere la click pe backdrop
  menuOverlay.addEventListener("click", (e) => {
    if (e.target === menuOverlay) {
      closeMenuOverlay();
    }
  });

  // ESC pentru închidere
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menuOverlay.getAttribute("aria-hidden") === "false") {
      closeMenuOverlay();
    }
  });
}

// butoane care deschid paginile demo (lab / redesign)
if (menuLinkButtons.length) {
  menuLinkButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const target = btn.getAttribute("data-target");
      if (!target) return;

      let href;
      if (target === "lab") href = "lab.html";
      else if (target === "redesign") href = "redesign.html";
      else href = `${target}.html`;

      window.location.href = href;
    });
  });
}

// -------------------------
// Scroll reveal (fade + pop/bounce) – doar în Starea 2
// -------------------------

let scrollObserverInitialized = false;

function initScrollReveal() {
  if (scrollObserverInitialized) return;
  scrollObserverInitialized = true;

  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (
          entry.isIntersecting &&
          body.classList.contains("stare-2")
        ) {
          entry.target.classList.add("vizibil");
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach((el) => obs.observe(el));
}

// -------------------------
// DEMO MAIL – schimbare UI simplu / UI UX
// -------------------------

const mailDemo = document.getElementById("mail-demo");
const mailStyleButtons = document.querySelectorAll(".mail-style-btn");
const mailCodeToggle = document.getElementById("mail-code-toggle");
const mailCodePanel = document.getElementById("mail-code-panel");

if (mailDemo && mailStyleButtons.length) {
  mailStyleButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const style = btn.getAttribute("data-mail-style");
      mailStyleButtons.forEach((b) => b.classList.remove("aktiv"));

      btn.classList.add("aktiv");

      if (style === "ux") {
        mailDemo.classList.remove("mail-ui-simplu");
        mailDemo.classList.add("mail-ui-ux");
      } else {
        mailDemo.classList.remove("mail-ui-ux");
        mailDemo.classList.add("mail-ui-simplu");
      }
    });
  });
}

if (mailCodeToggle && mailCodePanel) {
  mailCodeToggle.addEventListener("click", () => {
    const hidden = mailCodePanel.classList.toggle("hidden");
    mailCodeToggle.textContent = hidden
      ? "Afișează codul folosit"
      : "Ascunde codul";
  });
}

// -------------------------
// BACKGROUND PLAYGROUND
// -------------------------

const bgButtons = document.querySelectorAll(".bg-mode-btn");
const bgTitle = document.getElementById("bg-title");
const bgText = document.getElementById("bg-text");
const bgCode = document.getElementById("bg-code");

const bgInfo = {
  default: {
    title: "Mod implicit",
    text:
      "Fond întunecat, cu două radial-gradients discrete și animație lentă. " +
      "Echilibrat: nu fură atenția de la conținut.",
    code: `body.bg-default.stare-2 {
  background:
    radial-gradient(circle at top left, #1f2937 0, #020617 45%),
    radial-gradient(circle at bottom right, #022c22 0, #020617 55%);
  background-size: 200% 200%;
  animation: bgMove 18s ease-in-out infinite alternate;
}`
  },
  glass: {
    title: "Mod glass / blur",
    text:
      "Câteva pete de culoare semi-transparente, cu efect de sticlă. " +
      "Bun pentru layout-uri cu carduri și blur.",
    code: `body.bg-glass.stare-2 {
  background:
    radial-gradient(circle at 0% 0%, rgba(56,189,248,0.45), transparent 55%),
    radial-gradient(circle at 100% 0%, rgba(34,197,94,0.4), transparent 55%),
    radial-gradient(circle at 50% 100%, rgba(59,130,246,0.34), #020617 60%);
  background-attachment: fixed;
}`
  },
  gradient: {
    title: "Gradient animat puternic",
    text:
      "Culori saturate care se plimbă pe diagonală. Bun pentru hero-uri sau secțiuni " +
      "unde vrei să atragi atenția.",
    code: `body.bg-gradient.stare-2 {
  background: linear-gradient(135deg,#0f172a,#22c55e,#0ea5e9,#1d4ed8);
  background-size: 250% 250%;
  animation: bgMove 14s ease-in-out infinite alternate;
}`
  },
  plain: {
    title: "Fundal simplu",
    text:
      "Niciun efect special, doar o culoare închisă. Perfect când vrei să pui accent " +
      "doar pe componente.",
    code: `body.bg-plain.stare-2 {
  background: #020617;
}`
  }
};

function setBackgroundMode(mode) {
  ["bg-default", "bg-glass", "bg-gradient", "bg-plain"].forEach((c) =>
    body.classList.remove(c)
  );
  body.classList.add(`bg-${mode}`);

  bgButtons.forEach((btn) => {
    const val = btn.getAttribute("data-bg-mode");
    btn.classList.toggle("aktiv", val === mode);
  });

  const info = bgInfo[mode];
  if (info && bgTitle && bgText && bgCode) {
    bgTitle.textContent = info.title;
    bgText.textContent = info.text;
    bgCode.textContent = info.code;
  }
}

if (bgButtons.length) {
  bgButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const mode = btn.getAttribute("data-bg-mode") || "default";
      setBackgroundMode(mode);
    });
  });

  // background inițial
  setBackgroundMode("default");
}

// -------------------------
// INTERACTIONS: toggle, tilt card, micro button ripple
// -------------------------

// toggle ON/OFF
const demoToggle = document.getElementById("demo-toggle");
const toggleStatus = document.getElementById("toggle-status");

if (demoToggle && toggleStatus) {
  const updateToggleStatus = () => {
    const isOn = demoToggle.checked;
    toggleStatus.innerHTML =
      `Stare curentă: <strong>${isOn ? "ON" : "OFF"}</strong>`;
  };

  demoToggle.addEventListener("change", updateToggleStatus);
  updateToggleStatus();
}

// tilt card
const tiltCard = document.querySelector(".hover-tilt-card");

if (tiltCard) {
  tiltCard.addEventListener("mousemove", (e) => {
    if (!body.classList.contains("stare-2")) return;

    const rect = tiltCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotateX = y * -10;
    const rotateY = x * 12;

    tiltCard.style.transform =
      `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  });

  tiltCard.addEventListener("mouseleave", () => {
    tiltCard.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg)";
  });
}

// micro button ripple
const microBtn = document.getElementById("micro-btn");
const microRipple = microBtn?.querySelector(".micro-ripple");

if (microBtn && microRipple) {
  microBtn.addEventListener("click", (e) => {
    if (!body.classList.contains("stare-2")) return;

    const rect = microBtn.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    microRipple.style.transform = "scale(0)";
    microRipple.style.opacity = "0.75";
    microRipple.style.background =
      "radial-gradient(circle at " +
      `${x}px ${y}px, rgba(255,255,255,0.7) 0, transparent 55%)`;

    microRipple.classList.remove("show");
    void microRipple.offsetWidth;
    microRipple.classList.add("show");
  });
}

// validare live parolă
const passwordInput = document.getElementById("demo-password");
const passwordHints = document.querySelectorAll("#password-hints li");

if (passwordInput && passwordHints.length) {
  const updatePasswordHints = () => {
    const value = passwordInput.value || "";
    passwordHints.forEach((li) => {
      const rule = li.dataset.rule;
      let ok = false;
      if (rule === "length") ok = value.length >= 8;
      if (rule === "uppercase") ok = /[A-ZȘȚĂÂÎ]/.test(value);
      if (rule === "digit") ok = /\d/.test(value);
      li.classList.toggle("ok", ok);
    });
  };

  passwordInput.addEventListener("input", updatePasswordHints);
  updatePasswordHints();
}

// card pilulă extensibil
const pillCard = document.getElementById("expandable-pill");
const pillToggle = document.getElementById("pill-toggle");

if (pillCard && pillToggle) {
  pillToggle.addEventListener("click", () => {
    pillCard.classList.toggle("open");
  });
}

// toast
const toastBtn = document.getElementById("toast-btn");
const toastEl = document.getElementById("ui-toast");
let toastTimeout;

if (toastBtn && toastEl) {
  toastBtn.addEventListener("click", () => {
    toastEl.classList.add("visible");
    if (toastTimeout) clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastEl.classList.remove("visible");
    }, 3000);
  });
}

// -------------------------
// LOADING: page load explanation
// -------------------------

const pageLoadSteps = document.querySelectorAll(".page-load-steps li");
const pageLoadDetail = document.getElementById("page-load-detail");

const pageLoadInfo = {
  request:
    "Browserul trimite cererea (request) către server, pe baza adresei URL. " +
    "Serverul răspunde cu HTML-ul inițial al paginii.",
  html:
    "HTML-ul este parcurs de browser și transformat într-un „DOM tree” – arborele " +
    "de elemente (div, section, button etc.).",
  css:
    "Fișierele CSS sunt descărcate și combinate într-un CSSOM. Împreună cu DOM-ul, " +
    "se construiește structura vizuală a paginii.",
  js:
    "Fișierele JavaScript se descarcă și, uneori, blochează randarea până sunt " +
    "rulate. Aici adăugăm logica de interacțiune.",
  render:
    "Pe baza DOM + CSSOM, browserul calculează layout-ul (dimensiuni, poziții) și " +
    "apoi „desenează” (paint) pixelii pe ecran.",
  interactive:
    "După ce event handler-ele JS sunt atașate (click, hover, scroll), pagina " +
    "devine complet interactivă pentru utilizator."
};

function setPageLoadStep(key) {
  if (!pageLoadDetail) return;
  pageLoadSteps.forEach((li) => {
    li.classList.toggle("active", li.dataset.pageStep === key);
  });
  pageLoadDetail.textContent = pageLoadInfo[key] || "";
}

if (pageLoadSteps.length && pageLoadDetail) {
  pageLoadSteps.forEach((li) => {
    li.addEventListener("click", () => {
      const key = li.dataset.pageStep;
      setPageLoadStep(key);
    });
  });

  setPageLoadStep("request");
}

// -------------------------
// CODE TILES – expand / collapse (doar unul deschis)
// -------------------------

const codeTileToggles = document.querySelectorAll(".code-tile-toggle");
const codeTiles = document.querySelectorAll(".code-tile");

if (codeTileToggles.length) {
  codeTileToggles.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tile = btn.closest(".code-tile");
      if (!tile) return;

      const alreadyOpen = tile.classList.contains("open");

      // închidem toate cardurile
      codeTiles.forEach((t) => {
        t.classList.remove("open");
        const toggle = t.querySelector(".code-tile-toggle");
        if (toggle) toggle.textContent = "Vezi codul";
      });

      // deschidem doar cardul pe care l-am apăsat (dacă nu era deja deschis)
      if (!alreadyOpen) {
        tile.classList.add("open");
        btn.textContent = "Ascunde codul";
      }
    });
  });
}

// -------------------------
// UX ACCORDION – expand / collapse (un singur rând deschis)
// -------------------------

const uxAccordionHeaders = document.querySelectorAll(".ux-accordion-header");

if (uxAccordionHeaders.length) {
  uxAccordionHeaders.forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".ux-accordion-item");
      if (!item) return;

      const isOpen = item.classList.contains("open");

      document
        .querySelectorAll(".ux-accordion-item.open")
        .forEach((openItem) => openItem.classList.remove("open"));

      if (!isOpen) {
        item.classList.add("open");
      }
    });
  });
}
