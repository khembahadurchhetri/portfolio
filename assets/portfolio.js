(() => {
  /* ============================================================
   BEHAVIOR — EmailJS config, theme, mobile menu, scroll rail,
   reveal-on-scroll, contact form, CV-download notice.
   ============================================================ */
  /* =========================================================
   CONFIG — fill these in to enable direct-to-Gmail delivery
   -----------------------------------------------------------
   1. Create a free account at https://www.emailjs.com
   2. Add an Email Service (connect your Gmail) -> copy its ID
   3. Create an Email Template -> copy its ID
      Suggested template vars: {{from_name}} {{reply_to}} {{message}}
   4. Account > General -> copy your Public Key
   5. Paste all three below. That's it — no server needed.

   Until you fill these in, the contact form and the CV-download
   notice fall back to a plain "mailto:" link, so nothing breaks.
   ========================================================= */
  const EMAILJS_CONFIG = {
    serviceId: "service_2qbip04",
    contactTemplateId: "template_8fe31qv",
    downloadTemplateId: "template_viekl2o",
    publicKey: "YOUR_PUBLIC_KEY",
  };
  const OWNER_EMAIL = "khemchhetri10@gmail.com";

  const isEmailJsConfigured = () =>
    window.emailjs &&
    !Object.values(EMAILJS_CONFIG).some((v) => v.startsWith("YOUR_"));

  if (isEmailJsConfigured()) {
    emailjs.init({ publicKey: EMAILJS_CONFIG.publicKey });
  }

  // The original two-mode control, with optional persistence.
  const root = document.documentElement;
  const themeToggle = document.getElementById("theme-toggle");
  const themeKnob = document.getElementById("themeKnob");
  function applyTheme(theme) {
    const appearance = theme === "light" ? "light" : "dark";
    root.dataset.theme = appearance;
    const label =
      appearance === "dark" ? "Switch to light mode" : "Switch to dark mode";
    themeToggle.setAttribute("aria-label", label);
    themeToggle.title = label;
    themeKnob.textContent = appearance === "dark" ? "\u2600" : "\u263e";
    try {
      localStorage.setItem("kbc-theme", appearance);
      localStorage.setItem("kbc-appearance", appearance);
    } catch {}
    document.dispatchEvent(new Event("appearancechange"));
  }
  applyTheme(root.dataset.theme);
  themeToggle.addEventListener("click", () =>
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark"),
  );

  /* =========================================================
   MOBILE MENU
   ========================================================= */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("open");
    mobileMenu.classList.toggle("open");
  });
  mobileMenu.querySelectorAll("a").forEach((link) =>
    link.addEventListener("click", () => {
      hamburger.classList.remove("open");
      mobileMenu.classList.remove("open");
    }),
  );

  /* =========================================================
   TRAIL RAIL — progress fill; the music toggle button itself
   rides up/down the rail to mark scroll position (no more car).
   ========================================================= */
  const railFill = document.getElementById("railFill");
  const railMusicBtn = document.getElementById("railMusicBtn");

  function updateRail() {
    const scrollY = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const progress =
      docHeight > 0 ? Math.min(100, (scrollY / docHeight) * 100) : 0;

    railFill.style.height = progress + "%";
    railMusicBtn.style.top = progress + "%";
  }
  window.addEventListener("scroll", updateRail, { passive: true });
  updateRail();

  /* =========================================================
   MUSIC — the rail button toggles the background track
   ========================================================= */
  const bgAudio = document.getElementById("bgAudio");
  railMusicBtn.addEventListener("click", () => {
    if (bgAudio.paused) {
      bgAudio.play();
      railMusicBtn.textContent = "⏸";
      railMusicBtn.classList.add("playing");
    } else {
      bgAudio.pause();
      railMusicBtn.textContent = "▶";
      railMusicBtn.classList.remove("playing");
    }
  });

  /* =========================================================
   REVEAL ON SCROLL
   ========================================================= */
  const motionPreference = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );
  const revealTargets = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("in");
        entry.target.classList.remove("pending-reveal");
        revealObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.06, rootMargin: "0px 0px -24px 0px" },
  );
  revealTargets.forEach((el) => {
    // Never make visitors wait for the intro or content already on screen.
    if (
      el.closest("#hero") ||
      motionPreference.matches ||
      el.getBoundingClientRect().top < window.innerHeight
    ) {
      el.classList.add("in");
    } else {
      el.classList.add("pending-reveal");
      revealObserver.observe(el);
    }
  });
  motionPreference.addEventListener("change", () => {
    if (!motionPreference.matches) return;
    revealTargets.forEach((el) => {
      el.classList.remove("pending-reveal");
      el.classList.add("in");
    });
    revealObserver.disconnect();
  });

  /* =========================================================
   CONTACT FORM -> sends straight to Gmail via EmailJS,
   falls back to a pre-filled mailto: if not configured yet
   ========================================================= */
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const submitBtn = document.getElementById("formSubmitBtn");

  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("fName").value.trim();
    const email = document.getElementById("fEmail").value.trim();
    const message = document.getElementById("fMsg").value.trim();

    if (isEmailJsConfigured()) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
      formStatus.className = "form-status";
      formStatus.textContent = "";
      try {
        await emailjs.send(
          EMAILJS_CONFIG.serviceId,
          EMAILJS_CONFIG.contactTemplateId,
          {
            from_name: name,
            reply_to: email,
            message,
            to_email: OWNER_EMAIL,
          },
        );
        formStatus.textContent =
          "Message sent — thanks! I'll get back to you soon.";
        formStatus.classList.add("success");
        contactForm.reset();
      } catch (err) {
        formStatus.textContent =
          "Couldn't send automatically — opening your email app instead.";
        formStatus.classList.add("error");
        openMailtoFallback(name, email, message);
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Send Message";
      }
    } else {
      // EmailJS not set up yet — use mailto so the form still works.
      openMailtoFallback(name, email, message);
      formStatus.textContent = "Opening your email app to send this to Khem...";
    }
  });

  function openMailtoFallback(name, email, message) {
    const subject = encodeURIComponent(`Portfolio message from ${name}`);
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
  }

  /* =========================================================
   CV DOWNLOAD NOTICE — silently emails Khem when the CV is
   downloaded (no popup for the visitor). Only fires if
   EmailJS is configured above; otherwise the download just
   happens normally with no notice.
   ========================================================= */
  function notifyCvDownload(source) {
    if (!isEmailJsConfigured()) return;
    emailjs
      .send(EMAILJS_CONFIG.serviceId, EMAILJS_CONFIG.downloadTemplateId, {
        to_email: OWNER_EMAIL,
        source,
        time: new Date().toLocaleString(),
        referrer: document.referrer || "direct / unknown",
        user_agent: navigator.userAgent,
      })
      .catch(() => {
        /* fail silently — never block the actual download */
      });
  }
  document
    .getElementById("resumeCvBtn")
    .addEventListener("click", () => notifyCvDownload("resume section"));

  function animateVisible(element, frame, onResume = () => {}) {
    let visible = false,
      request = 0;
    let paused = false;
    const control = document.createElement("button");
    control.type = "button";
    control.className = "row-motion-toggle";
    const label = element.matches(".projects-scroll") ? "projects" : element.matches(".facts-scroll") ? "quick facts" : "ticker";
    function updateControl() {
      control.textContent = paused ? "Play motion" : "Pause motion";
      control.setAttribute("aria-label", `${paused ? "Play" : "Pause"} ${label} motion`);
    }
    updateControl();
    if (!element.matches(".ticker-row")) {
      const header = element.matches(".facts-scroll")
        ? element.parentElement.querySelector(".facts-header") : null;
      if (header) header.append(control);
      else element.before(control);
    }
    control.addEventListener("click", () => {
      paused = !paused;
      updateControl();
      schedule();
    });
    function tick(time) {
      request = 0;
      if (!visible || document.hidden || paused) return;
      frame(time);
      request = requestAnimationFrame(tick);
    }
    function schedule() {
      if (request) cancelAnimationFrame(request);
      request = 0;
      onResume();
      if (visible && !document.hidden && !paused)
        request = requestAnimationFrame(tick);
    }
    new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting;
      schedule();
    }).observe(element);
    document.addEventListener("visibilitychange", schedule);
    window.addEventListener("pageshow", schedule);
    window.addEventListener("focus", schedule);
  }

  // Move horizontal strips only while visible.
  function enableAutoScroll(el, pixelsPerSecond) {
    let direction = 1;
    let position = el.scrollLeft;
    let previousTime = null;
    let pausedUntil = 0;
    let interacting = false;
    let dragPointer = null;
    let startX = 0;
    let startScroll = 0;
    let dragged = false;

    function step(time) {
      const elapsed =
        previousTime === null ? 0 : Math.min(time - previousTime, 50);
      previousTime = time;
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (!interacting && time >= pausedUntil && maxScroll > 0) {
        position = Math.max(
          0,
          Math.min(
            maxScroll,
            position + (direction * pixelsPerSecond * elapsed) / 1000,
          ),
        );
        el.scrollLeft = position;
        if (position >= maxScroll) direction = -1;
        if (position <= 0) direction = 1;
      } else {
        position = el.scrollLeft;
      }
    }

    const pause = () => {
      pausedUntil = performance.now() + 900;
      position = el.scrollLeft;
    };
    el.addEventListener(
      "pointerdown",
      (event) => {
        if (!event.isPrimary || event.button !== 0) return;
        interacting = true;
        dragged = false;
        // Touch scrolling stays native, including momentum and vertical page swipes.
        if (event.pointerType === "touch") return;
        dragPointer = event.pointerId;
        startX = event.clientX;
        startScroll = el.scrollLeft;
      },
      { passive: true },
    );
    window.addEventListener(
      "pointermove",
      (event) => {
        if (event.pointerId !== dragPointer) return;
        if (event.buttons === 0) {
          release();
          return;
        }
        const delta = event.clientX - startX;
        if (!dragged && Math.abs(delta) < 5) return;
        if (!dragged) {
          dragged = true;
          el.setPointerCapture(event.pointerId);
          el.classList.add("is-dragging");
        }
        event.preventDefault();
        el.scrollLeft = startScroll - delta;
        position = el.scrollLeft;
      },
      { passive: false },
    );
    const release = () => {
      if (!interacting) return;
      interacting = false;
      if (dragPointer !== null && el.hasPointerCapture(dragPointer)) {
        el.releasePointerCapture(dragPointer);
      }
      dragPointer = null;
      el.classList.remove("is-dragging");
      pause();
    };
    window.addEventListener("pointerup", release, { passive: true });
    window.addEventListener("pointercancel", release, { passive: true });
    window.addEventListener("blur", release);
    window.addEventListener("focus", release);
    window.addEventListener("pageshow", release);
    window.addEventListener("pointerdown", (event) => {
      if (!el.contains(event.target)) release();
    });
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) release();
    });
    el.addEventListener("lostpointercapture", release);
    el.addEventListener("dragstart", (event) => event.preventDefault());
    el.addEventListener(
      "click",
      (event) => {
        if (!dragged || event.detail === 0) return;
        event.preventDefault();
        event.stopPropagation();
        dragged = false;
      },
      true,
    );
    el.addEventListener("wheel", pause, { passive: true });
    el.addEventListener("keydown", pause);
    animateVisible(el, step, release);
  }

  document.querySelectorAll(".projects-scroll, .facts-scroll").forEach((el) => {
    enableAutoScroll(el, el.matches(".projects-scroll") ? 21 : 27);
  });

  // Animate both ticker rows with the same frame clock as the card strips.
  // Measure one complete group so each wrap lands on its identical copy.
  document.querySelectorAll(".ticker-row").forEach((row) => {
    const track = row.querySelector(".ticker-track");
    const group = track.querySelector(".ticker-group");
    let distance = 0;
    let previousTime = null;

    function moveTicker(time) {
      const elapsed =
        previousTime === null ? 0 : Math.min(time - previousTime, 50);
      previousTime = time;
      const width = group.getBoundingClientRect().width;
      if (width > 0) {
        distance = (distance + elapsed * 0.035) % width;
        const offset =
          row.dataset.dir === "right" ? distance - width : -distance;
        track.style.transform = `translateX(${offset}px)`;
      }
    }
    animateVisible(row, moveTicker);
  });
})();
