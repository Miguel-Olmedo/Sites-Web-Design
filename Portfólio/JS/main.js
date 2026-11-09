/* =========================================
   Portfólio - Scripts principais
   ========================================= */

if ("scrollRestoration" in history) {
  history.scrollRestoration = "manual";
}

window.addEventListener("beforeunload", () => {
  window.scrollTo(0, 0);
});

window.addEventListener("load", () => {
  setTimeout(() => {
    window.scrollTo(0, 0);
  }, 10);
});

document.addEventListener("DOMContentLoaded", () => {
  initMobileMenu();
  initSmoothScroll();
  initContactForm();
  initCopyEmail();
  initProjectFilters();

  if (typeof ScrollReveal !== "undefined") {
    const sr = ScrollReveal({
      duration: 1000,
      delay: 200,
      reset: false,
    });

    // Animações da Hero Section
    sr.reveal(".hero-content", { origin: "left", distance: "40px" });
    sr.reveal(".profile-img", { origin: "right", distance: "50px", delay: 400 });
  }
});

/**
 * Menu hambúrguer - abre/fecha em telas pequenas
 */
function initMobileMenu() {
  const menuToggle = document.getElementById("menu-toggle");
  const nav = document.getElementById("nav");
  const navLinks = document.querySelectorAll(".nav-link");

  if (!menuToggle || !nav) return;

  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.contains("open");

    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Fecha o menu ao clicar em um link
  navLinks.forEach((link) => {
    link.addEventListener("click", closeMenu);
  });

  function openMenu() {
    nav.classList.add("open");
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Fechar menu");
  }

  function closeMenu() {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Abrir menu");
  }
}

/**
 * Scroll suave para as seções ao clicar nos links do menu
 */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener("click", (event) => {
      const targetId = link.getAttribute("href");

      if (targetId === "#" || targetId === "#!") return;

      const targetElement = document.querySelector(targetId);
      if (!targetElement) return;

      event.preventDefault();

      const headerOffset = document.querySelector(".header")?.offsetHeight || 72;
      const elementPosition = targetElement.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth",
      });
    });
  });
}

/**
 * Formulário de contato - envio simples (simulação)
 */
function initContactForm() {
  const form = document.getElementById("contato-form");

  if (!form) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.textContent;

    btn.textContent = "Enviando...";
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = "Mensagem enviada!";
      btn.style.background = "#10b981";

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = "";
        btn.disabled = false;
        form.reset();
      }, 2000);
    }, 1500);
  });
}

/**
 * Copiar e-mail para a área de transferência
 */
function initCopyEmail() {
  const btn = document.querySelector(".btn-copy-email");

  if (!btn) return;

  const email = btn.getAttribute("data-email");

  btn.addEventListener("click", () => {
    navigator.clipboard.writeText(email).then(() => {
      const originalText = btn.textContent;
      btn.textContent = "✓ Copiado!";
      btn.classList.add("copied");

      setTimeout(() => {
        btn.textContent = originalText;
        btn.classList.remove("copied");
      }, 2000);
    });
  });
}

/**
 * Filtro de projetos por categoria
 */
function initProjectFilters() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const category = btn.getAttribute("data-category");

      // Atualiza botão ativo
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Filtra cards com transição de opacidade
      projectCards.forEach((card) => {
        const cardCategory = card.getAttribute("data-category");

        if (category === "todos" || cardCategory === category) {
          card.classList.remove("hidden");
        } else {
          card.classList.add("hidden");
        }
      });
    });
  });
}
