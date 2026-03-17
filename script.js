const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector(".site-nav");
const revealItems = document.querySelectorAll(".reveal");
const yearNode = document.querySelector("#current-year");
const marketplaceTabs = document.querySelectorAll("[data-tab-target]");

if (yearNode) {
  yearNode.textContent = new Date().getFullYear();
}

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.18 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

if (marketplaceTabs.length) {
  const setActiveTab = (nextTab) => {
    const tabList = nextTab.closest("[role='tablist']");

    if (!tabList) {
      return;
    }

    const tabs = tabList.querySelectorAll("[data-tab-target]");

    tabs.forEach((tab) => {
      const targetId = tab.getAttribute("data-tab-target");
      const panel = targetId ? document.getElementById(targetId) : null;
      const isActive = tab === nextTab;

      tab.classList.toggle("is-active", isActive);
      tab.setAttribute("aria-selected", String(isActive));
      tab.tabIndex = isActive ? 0 : -1;

      if (panel) {
        panel.classList.toggle("is-active", isActive);
        panel.hidden = !isActive;
      }
    });
  };

  marketplaceTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      setActiveTab(tab);
    });

    tab.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") {
        return;
      }

      const tabList = tab.closest("[role='tablist']");

      if (!tabList) {
        return;
      }

      const tabs = Array.from(tabList.querySelectorAll("[data-tab-target]"));
      const currentIndex = tabs.indexOf(tab);
      const direction = event.key === "ArrowRight" ? 1 : -1;
      const nextIndex = (currentIndex + direction + tabs.length) % tabs.length;
      const nextTab = tabs[nextIndex];

      nextTab.focus();
      setActiveTab(nextTab);
    });
  });
}
