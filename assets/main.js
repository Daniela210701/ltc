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
