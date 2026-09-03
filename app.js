(() => {
  const cfg = window.RISTA_CONFIG || {};
  const smartlink = cfg.SMARTLINK_URL || "";
  const grid = document.getElementById("profile-grid");

  function validSmartLink() {
    try {
      const u = new URL(smartlink);
      return u.protocol === "http:" || u.protocol === "https:";
    } catch (_) { return false; }
  }

  function openSmartLink(event) {
    event.preventDefault();
    if (!validSmartLink()) {
      alert("Please add your Adsterra SmartLink in config.js");
      return;
    }
    window.open(smartlink, "_blank", "noopener,noreferrer");
  }

  // Any element marked as a SmartLink trigger opens the ad.
  document.querySelectorAll("[data-smartlink], .smartlink-trigger").forEach(el => {
    el.addEventListener("click", openSmartLink);
  });

  // Build image/profile cards. Clicking the image OR the card opens SmartLink.
  if (grid && Array.isArray(cfg.PROFILES)) {
    grid.innerHTML = "";
    cfg.PROFILES.forEach((p) => {
      const card = document.createElement("article");
      card.className = "profile-card smartlink-trigger";
      card.tabIndex = 0;
      card.setAttribute("role", "link");
      card.innerHTML = `
        <div class="profile-image-wrap">
          <img src="${p.image}" alt="${p.name}" loading="lazy"
               onerror="this.src='fallback.svg'">
          <span class="profile-badge">View Match</span>
        </div>
        <div class="profile-info">
          <h3>${p.name}</h3>
          <p>${p.age} · ${p.city}</p>
        </div>`;
      card.addEventListener("click", openSmartLink);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") openSmartLink(e);
      });
      grid.appendChild(card);
    });
  }

  // Inject only user-supplied ad code. No fake ad scripts.
  const adMap = {
    topBanner: "top-banner-ad",
    nativeTop: "native-ad-top",
    nativeBottom: "native-ad-bottom",
    highRevenue: "high-revenue-ad",
    sideLeft: "side-ad-left",
    sideRight: "side-ad-right",
    footerBanner: "banner-ad-footer"
  };
  Object.entries(adMap).forEach(([key, id]) => {
    const box = document.getElementById(id);
    const code = cfg.ADS?.[key];
    if (box && typeof code === "string" && code.trim()) box.innerHTML = code;
  });
})();
