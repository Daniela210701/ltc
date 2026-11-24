document.documentElement.classList.add("js");

// Menú móvil
const toggle = document.getElementById("toggle");
const menu = document.getElementById("menu");
toggle?.addEventListener("click", () => {
  const open = toggle.getAttribute("aria-expanded") === "true";
  toggle.setAttribute("aria-expanded", String(!open));
  menu.classList.toggle("is-open", !open);
});
menu?.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", "false");
    menu.classList.remove("is-open");
  })
);

// Sombra del nav al hacer scroll
const nav = document.getElementById("nav");
const onScroll = () => nav?.classList.toggle("is-scrolled", window.scrollY > 10);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

// Animaciones de entrada
const items = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-in");
          io.unobserve(e.target);
        }
      }),
    { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
  );
  items.forEach((el, i) => {
    el.style.transitionDelay = `${(i % 4) * 70}ms`;
    io.observe(el);
  });
} else {
  items.forEach((el) => el.classList.add("is-in"));
}


// Año del footer
const y = document.getElementById("year");
if (y) y.textContent = new Date().getFullYear();

// Sección activa en el menú
const links = [...document.querySelectorAll('.nav__links a[href^="#"]:not(.btn)')];
const secs = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
if ("IntersectionObserver" in window && secs.length) {
  const so = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        links.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + e.target.id));
      }),
    { rootMargin: "-45% 0px -50% 0px" }
  );
  secs.forEach((s) => so.observe(s));
}

// "Cotizar este servicio": preselecciona el servicio en el formulario
document.querySelectorAll(".service__cta").forEach((a) =>
  a.addEventListener("click", () => {
    const sel = document.querySelector('.form select[name="servicio"]');
    if (sel) sel.value = a.dataset.servicio;
    setTimeout(() => document.querySelector('.form input[name="nombre"]')?.focus({ preventScroll: true }), 600);
  })
);

// ===== Galería de proyectos =====
const tiles = [...document.querySelectorAll(".tile")];

// Filtros
document.querySelectorAll(".pfilter").forEach((btn) =>
  btn.addEventListener("click", () => {
    document.querySelectorAll(".pfilter").forEach((b) => b.classList.toggle("is-active", b === btn));
    const f = btn.dataset.filter;
    tiles.forEach((t) => (t.hidden = f !== "todos" && t.dataset.cat !== f));
  })
);

// Videos: se reproducen solo cuando están en pantalla
if ("IntersectionObserver" in window) {
  const vo = new IntersectionObserver(
    (entries) =>
      entries.forEach((e) => {
        const v = e.target.querySelector("video");
        if (!v) return;
        if (e.isIntersecting) { v.preload = "auto"; v.play().catch(() => {}); }
        else v.pause();
      }),
    { threshold: 0.25 }
  );
  tiles.filter((t) => t.dataset.video).forEach((t) => vo.observe(t));
}

// Visor con flechas
const lb = document.getElementById("lightbox");
if (lb) {
  const lbImg = lb.querySelector("img");
  const lbVid = lb.querySelector("video");
  const lbCap = lb.querySelector(".lightbox__cap");
  let current = -1;
  const visible = () => tiles.filter((t) => !t.hidden);
  const show = (tile) => {
    const list = visible();
    current = list.indexOf(tile);
    const tag = tile.querySelector(".tile__tag")?.textContent || "";
    const cap = tile.querySelector("figcaption")?.textContent || "";
    if (lbVid) { lbVid.pause(); }
    if (tile.dataset.video) {
      lbImg.hidden = true; lbVid.hidden = false;
      lbVid.src = tile.dataset.video; lbVid.muted = false;
      lbVid.play().catch(() => {});
    } else {
      lbVid.hidden = true; lbVid.removeAttribute("src");
      lbImg.hidden = false; lbImg.src = tile.dataset.img; lbImg.alt = tag;
    }
    lbCap.textContent = tag ? `${tag} — ${cap}` : cap;
    lb.hidden = false;
    document.body.style.overflow = "hidden";
  };
  const step = (d) => { const list = visible(); if (!list.length) return; show(list[(current + d + list.length) % list.length]); };
  const close = () => {
    lb.hidden = true; document.body.style.overflow = "";
    lbVid.pause(); lbVid.removeAttribute("src"); lbVid.load();
  };
  tiles.forEach((t) => {
    t.addEventListener("click", () => show(t));
    t.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); show(t); } });
  });
  lb.querySelector(".lightbox__nav--prev")?.addEventListener("click", (e) => { e.stopPropagation(); step(-1); });
  lb.querySelector(".lightbox__nav--next")?.addEventListener("click", (e) => { e.stopPropagation(); step(1); });
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest(".lightbox__close")) close(); });
  document.addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowRight") step(1);
    if (e.key === "ArrowLeft") step(-1);
  });
}

// Ajuste automático: si una palabra del título no cabe en su columna, se reduce la letra
const fitTitles = () => {
  document.querySelectorAll(".display").forEach((el) => {
    el.style.fontSize = "";
    let size = parseFloat(getComputedStyle(el).fontSize);
    let guard = 60;
    while (el.scrollWidth > el.clientWidth + 1 && size > 18 && guard--) {
      size -= 2;
      el.style.fontSize = size + "px";
    }
  });
};
(document.fonts?.ready || Promise.resolve()).then(fitTitles);
window.addEventListener("load", fitTitles);
let fitT;
window.addEventListener("resize", () => { clearTimeout(fitT); fitT = setTimeout(fitTitles, 120); });
