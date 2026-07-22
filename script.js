const body = document.body;
const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const revealItems = document.querySelectorAll(".reveal");
const counters = document.querySelectorAll("[data-count]");
const faqItems = document.querySelectorAll(".faq-item");
const galleryButtons = document.querySelectorAll("[data-lightbox]");
const lightbox = document.querySelector("[data-lightbox-modal]");
const lightboxImage = lightbox?.querySelector("img");
const lightboxClose = document.querySelector("[data-lightbox-close]");

const closeMenu = () => {
  body.classList.remove("menu-open");
  nav?.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
  menuToggle?.setAttribute("aria-label", "Open menu");
};

menuToggle?.addEventListener("click", () => {
  if (!nav) return;
  const isOpen = nav.classList.toggle("open");
  body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
});

nav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMenu));

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) closeMenu();
});

const updateHeader = () => {
  header?.classList.toggle("scrolled", window.scrollY > 12);
};
updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

const animateCounter = (counter) => {
  const target = Number(counter.dataset.count);
  const duration = 1100;
  const start = performance.now();
  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.floor(progress * target);
    counter.textContent = target >= 1000 ? `${value.toLocaleString("en-IN")}+` : `${value}+`;
    if (progress < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("visible");
    if (entry.target.matches("[data-count]") && !entry.target.dataset.done) {
      entry.target.dataset.done = "true";
      animateCounter(entry.target);
    }
    observer.unobserve(entry.target);
  });
}, { threshold: 0.18 });

revealItems.forEach((item) => observer.observe(item));
counters.forEach((counter) => observer.observe(counter));

faqItems.forEach((item) => {
  const button = item.querySelector("button");
  button?.addEventListener("click", () => {
    const isOpen = item.classList.toggle("open");
    button.setAttribute("aria-expanded", String(isOpen));
    button.querySelector("span").textContent = isOpen ? "-" : "+";
  });
});

galleryButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (!lightbox || !lightboxImage) return;
    lightboxImage.src = button.dataset.lightbox;
    lightboxImage.alt = button.querySelector("img")?.alt || "Expanded gallery image";
    lightbox.hidden = false;
    body.style.overflow = "hidden";
  });
});

const closeLightbox = () => {
  if (!lightbox || !lightboxImage) return;
  lightbox.hidden = true;
  lightboxImage.src = "";
  body.style.overflow = "";
};

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
    closeMenu();
  }
});
