// ------------------------------
// BACK BUTTON
// ------------------------------
const backBtn = document.getElementById("back-btn");
if (backBtn) {
  backBtn.addEventListener("click", () => {
    window.location.href = "index.html";
  });
}

// ------------------------------
// SCROLL PROGRESS BAR
// ------------------------------
const scrollBar = document.getElementById("scroll-progress");

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const value = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  if (scrollBar) scrollBar.style.width = `${value}%`;
}

window.addEventListener("scroll", updateScrollProgress);
updateScrollProgress();

// ------------------------------
// SCROLL REVEAL
// ------------------------------
const revealEls = document.querySelectorAll(".reveal");
const obs = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.2 }
);

revealEls.forEach(el => obs.observe(el));

// ------------------------------
// TILT CARD
// ------------------------------
const tiltCard = document.querySelector(".tilt-card");

if (tiltCard) {
  tiltCard.addEventListener("mousemove", e => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    tiltCard.style.transform = `rotateX(${y * -14}deg) rotateY(${x * 14}deg)`;
  });

  tiltCard.addEventListener("mouseleave", () => {
    tiltCard.style.transform = "rotateX(0deg) rotateY(0deg)";
  });
}

// ------------------------------
// BUTTON: RIPPLE
// ------------------------------
document.querySelectorAll(".ripple-btn").forEach(btn => {
  btn.addEventListener("click", e => {
    const ripple = document.createElement("span");
    ripple.classList.add("ripple");

    const rect = btn.getBoundingClientRect();
    ripple.style.left = `${e.clientX - rect.left}px`;
    ripple.style.top = `${e.clientY - rect.top}px`;

    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// ------------------------------
// PROGRESS BUTTON
// ------------------------------
const progressBtn = document.getElementById("progress-btn");
if (progressBtn) {
  progressBtn.addEventListener("click", () => {
    const fill = progressBtn.querySelector(".progress-fill");
    if (!fill) return;

    fill.style.width = "100%";
    setTimeout(() => {
      fill.style.width = "0%";
    }, 1500);
  });
}

// ------------------------------
// ACCORDION
// ------------------------------
document.querySelectorAll(".accordion-header").forEach(header => {
  header.addEventListener("click", () => {
    const item = header.parentElement;
    const open = item.classList.contains("open");

    document
      .querySelectorAll(".accordion-item")
      .forEach(i => i.classList.remove("open"));

    if (!open) item.classList.add("open");
  });
});

// ------------------------------
// FORM: LIVE INPUT + PREVIEW ANIMAT
// ------------------------------
const nameInput = document.getElementById("name-input");
const namePreview = document.getElementById("name-preview");
const inputShell = document.querySelector(".input-shell");
const inputGlow = inputShell ? inputShell.querySelector(".input-glow") : null;

function renderPreview(text) {
  if (!namePreview) return;
  namePreview.innerHTML = "";
  if (!text) return;

  const labelSpan = document.createElement("span");
  labelSpan.className = "preview-label";
  labelSpan.textContent = "Ați introdus:";
  namePreview.appendChild(labelSpan);

  [...text].forEach((ch, index) => {
    const span = document.createElement("span");
    span.className = "preview-char";
    span.style.animationDelay = `${index * 0.02}s`;
    span.textContent = ch;
    namePreview.appendChild(span);
  });
}

if (nameInput) {
  nameInput.addEventListener("input", () => {
    renderPreview(nameInput.value);
  });

  // mic efect de glow care urmărește literele
  nameInput.addEventListener("mousemove", e => {
    if (!inputGlow) return;
    const rect = nameInput.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    inputGlow.style.setProperty("--glow-x", `${x}%`);
  });
}

// ------------------------------
// TASTATURĂ DIGITALĂ (virtual + highlight la tastatura fizică)
// ------------------------------
const vkKeys = document.querySelectorAll(".vk-key");

function flashKey(keyChar) {
  const selector = `.vk-key[data-key="${keyChar.toLowerCase()}"]`;
  const keyEl = document.querySelector(selector);
  if (!keyEl) return;

  keyEl.classList.add("active");
  setTimeout(() => keyEl.classList.remove("active"), 150);
}

function handleVirtualKey(key) {
  if (!nameInput) return;

  nameInput.focus();

  if (key === "space") {
    nameInput.value += " ";
  } else if (key === "backspace") {
    nameInput.value = nameInput.value.slice(0, -1);
  } else {
    nameInput.value += key;
  }

  renderPreview(nameInput.value);
  flashKey(key);
}

vkKeys.forEach(btn => {
  btn.addEventListener("click", () => {
    const key = btn.dataset.key;
    handleVirtualKey(key);
  });
});

window.addEventListener("keydown", e => {
  if (!nameInput) return;

  const key = e.key.toLowerCase();

  // highlight pe litere, spațiu, backspace
  if (/^[a-z]$/.test(key)) {
    flashKey(key);
  } else if (key === " ") {
    flashKey("space");
  } else if (key === "backspace") {
    flashKey("backspace");
  }
});

// ------------------------------
// SLIDER ANIMAT
// ------------------------------
const slider = document.getElementById("slider");
const sliderValue = document.getElementById("slider-value");

if (slider && sliderValue) {
  const updateSlider = () => {
    const min = Number(slider.min);
    const max = Number(slider.max);
    const val = Number(slider.value);
    const percent = ((val - min) / (max - min)) * 100;

    slider.style.setProperty("--range-progress", `${percent}%`);
    sliderValue.textContent = `Valoare: ${slider.value}`;
  };

  slider.addEventListener("input", updateSlider);
  updateSlider();
}

// ------------------------------
// PARALLAX – LOCAL ÎN FEREASTRĂ, 25% MAI LENT + SENZAȚIE DE „GREU”
// ------------------------------
const parallaxBoxes = document.querySelectorAll(".parallax-box");

function updateParallax() {
  if (!parallaxBoxes.length) return;

  const vh = window.innerHeight || document.documentElement.clientHeight;

  parallaxBoxes.forEach(box => {
    const viewport = box.querySelector(".parallax-viewport");
    if (!viewport) return;

    const layers = viewport.querySelectorAll(".parallax-layer");
    if (!layers.length) return;

    const rect = box.getBoundingClientRect();

    if (rect.bottom <= 0 || rect.top >= vh) return;

    const centerY = rect.top + rect.height / 2;
    let rel = centerY / vh - 0.5; // ~[-0.5, 0.5]
    rel = Math.max(-0.5, Math.min(0.5, rel));

    layers.forEach(layer => {
      const speed = parseFloat(layer.dataset.speed) || 1;

      // 25% mai lent decât varianta anterioară + mișcare mică -> pare „lipit” în spate
      const factor = 0.75;
      const offsetY = rel * speed * -800 * factor;
      const offsetX = rel * speed * 600 * factor;

      layer.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
    });
  });
}

window.addEventListener("scroll", updateParallax);
window.addEventListener("resize", updateParallax);
window.addEventListener("load", updateParallax);

// ------------------------------
// PARTICLES
// ------------------------------
const canvas = document.getElementById("particle-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");

  function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  let particles = [];

  for (let i = 0; i < 60; i++) {
    particles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      dx: (Math.random() - 0.5) * 1.2,
      dy: (Math.random() - 0.5) * 1.2,
      size: Math.random() * 4 + 1
    });
  }

  canvas.addEventListener("mousemove", e => {
    const rect = canvas.getBoundingClientRect();
    particles.push({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      dx: (Math.random() - 0.5) * 2,
      dy: (Math.random() - 0.5) * 2,
      size: 2
    });
  });

  function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    particles.forEach(p => {
      p.x += p.dx;
      p.y += p.dy;

      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

      ctx.fillStyle = "#22c55e";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}

// ------------------------------
// MOUSE TRAIL PLAYGROUND
// ------------------------------
const mousePlayground = document.getElementById("mouse-playground");
if (mousePlayground) {
  const hint = mousePlayground.querySelector(".mouse-hint");

  mousePlayground.addEventListener("mouseenter", () => {
    if (hint) hint.style.opacity = "0.25";
  });

  mousePlayground.addEventListener("mouseleave", () => {
    if (hint) hint.style.opacity = "1";
  });

  mousePlayground.addEventListener("mousemove", e => {
    const rect = mousePlayground.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const dot = document.createElement("span");
    dot.classList.add("trail-dot");
    dot.style.left = `${x}px`;
    dot.style.top = `${y}px`;

    mousePlayground.appendChild(dot);
    setTimeout(() => dot.remove(), 900);
  });
}

// ------------------------------
// DRAG CARD – cursor rămâne unde ai apăsat, nu iese din zonă
// ------------------------------
const dragCard = document.getElementById("drag-card");
const dragArea = document.querySelector(".drag-area");

if (dragCard && dragArea) {
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  function centerCard() {
    const areaRect = dragArea.getBoundingClientRect();
    const cardRect = dragCard.getBoundingClientRect();
    const left = (areaRect.width - cardRect.width) / 2;
    const top = (areaRect.height - cardRect.height) / 2;
    dragCard.style.left = `${left}px`;
    dragCard.style.top = `${top}px`;
  }

  // centrează cardul la start
  window.addEventListener("load", centerCard);
  window.addEventListener("resize", centerCard);

  function getClientPos(e) {
    if (e.type.startsWith("touch")) {
      const t = e.touches[0] || e.changedTouches[0];
      return { x: t.clientX, y: t.clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  function startDrag(e) {
    isDragging = true;
    dragCard.classList.add("dragging");

    const cardRect = dragCard.getBoundingClientRect();
    const { x, y } = getClientPos(e);

    offsetX = x - cardRect.left;
    offsetY = y - cardRect.top;

    e.preventDefault();
  }

  function onDrag(e) {
    if (!isDragging) return;

    const areaRect = dragArea.getBoundingClientRect();
    const { x: clientX, y: clientY } = getClientPos(e);

    // poziția nouă (top-left) în coordonatele zonei
    let newLeft = clientX - areaRect.left - offsetX;
    let newTop = clientY - areaRect.top - offsetY;

    const maxLeft = areaRect.width - dragCard.offsetWidth;
    const maxTop = areaRect.height - dragCard.offsetHeight;

    newLeft = Math.max(0, Math.min(maxLeft, newLeft));
    newTop = Math.max(0, Math.min(maxTop, newTop));

    dragCard.style.left = `${newLeft}px`;
    dragCard.style.top = `${newTop}px`;
  }

  function endDrag() {
    isDragging = false;
    dragCard.classList.remove("dragging");
  }

  dragCard.addEventListener("mousedown", startDrag);
  dragCard.addEventListener("touchstart", startDrag, { passive: false });

  window.addEventListener("mousemove", onDrag);
  window.addEventListener("touchmove", onDrag, { passive: false });

  window.addEventListener("mouseup", endDrag);
  window.addEventListener("touchend", endDrag);
}

// ------------------------------
// MAGNETIC BUTTON
// ------------------------------
const magneticBtn = document.querySelector(".magnetic-btn");

if (magneticBtn) {
  document.addEventListener("mousemove", e => {
    const rect = magneticBtn.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 160) {
      magneticBtn.style.transform = `translate(${dx * 0.08}px, ${dy * 0.08}px)`;
      magneticBtn.style.boxShadow = "0 0 22px rgba(14,165,233,0.9)";
    } else {
      magneticBtn.style.transform = "translate(0,0)";
      magneticBtn.style.boxShadow = "0 0 14px #0ea5e9";
    }
  });
}
