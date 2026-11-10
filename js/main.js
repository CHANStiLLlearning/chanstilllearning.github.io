/* ==========================================================================
   FinWise - Core Scripts
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Mobile Menu Toggle
  const toggleBtn = document.querySelector(".menu-toggle");
  const navLinks = document.querySelector(".nav-links");

  if (toggleBtn && navLinks) {
    toggleBtn.addEventListener("click", () => {
      navLinks.classList.toggle("open");
      const isOpen = navLinks.classList.contains("open");
      toggleBtn.setAttribute("aria-expanded", isOpen);
      toggleBtn.innerHTML = isOpen ? "✕" : "☰";
    });
  }

  // Update dynamic year in footer
  const yearEls = document.querySelectorAll(".current-year");
  const currentYear = new Date().getFullYear();
  yearEls.forEach((el) => {
    el.textContent = currentYear;
  });

  // Range Slider Sync Helper
  const syncInputs = document.querySelectorAll("[data-sync-with]");
  syncInputs.forEach((input) => {
    const targetId = input.getAttribute("data-sync-with");
    const target = document.getElementById(targetId);
    if (target) {
      input.addEventListener("input", () => {
        target.value = input.value;
        target.dispatchEvent(new Event("change"));
      });
      target.addEventListener("input", () => {
        input.value = target.value;
      });
    }
  });
});

