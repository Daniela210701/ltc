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

// Proyectos: si existe la foto, quitar la etiqueta "Foto del evento"
document.querySelectorAll(".shot").forEach((shot) => {
  const m = shot.style.getPropertyValue("--img").match(/url\(['"]?(.*?)['"]?\)/);
  if (!m) return;
  const img = new Image();
  img.onload = () => shot.classList.add("has-img");
  img.src = m[1];
});

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

// Visor de fotos de proyectos
const lb = document.getElementById("lightbox");
if (lb) {
  const lbImg = lb.querySelector("img");
  const lbCap = lb.querySelector(".lightbox__cap");
  const close = () => { lb.hidden = true; document.body.style.overflow = ""; };
  document.querySelectorAll(".shot").forEach((shot) =>
    shot.addEventListener("click", () => {
      if (!shot.classList.contains("has-img")) return;
      const m = shot.style.getPropertyValue("--img").match(/url\(['"]?(.*?)['"]?\)/);
      lbImg.src = m ? m[1] : "";
      lbImg.alt = shot.querySelector(".shot__img")?.getAttribute("aria-label") || "";
      lbCap.textContent = shot.querySelector("figcaption")?.textContent || "";
      lb.hidden = false;
      document.body.style.overflow = "hidden";
    })
  );
  lb.addEventListener("click", (e) => { if (e.target === lb || e.target.closest(".lightbox__close")) close(); });
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !lb.hidden) close(); });
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
