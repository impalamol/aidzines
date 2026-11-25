/* ==========================================================
   aiDzines — site interactions (vanilla JS, no dependencies
   besides Bootstrap's bundle for navbar collapse & accordion)
   ========================================================== */
(function () {
  "use strict";

  const root = document.documentElement;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  root.classList.add("hasJs");

  /* ---------- Header (always fixed at top) ---------- */
  const header = $(".siteHeader");
  const progress = $(".scrollProgress");
  const backToTop = $(".backToTop");
  let ticking = false;

  function onScroll() {
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (header) header.classList.toggle("isScrolled", y > 24);
    if (progress) progress.style.setProperty("--progress", max > 0 ? (y / max).toFixed(4) : 0);
    if (backToTop) backToTop.classList.toggle("isVisible", y > 700);
    ticking = false;
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(onScroll);
      }
    },
    { passive: true }
  );
  onScroll();

  const navCollapse = $("#mainNavMenu");
  if (navCollapse && header) {
    navCollapse.addEventListener("show.bs.collapse", () => header.classList.add("isMenuOpen"));
    navCollapse.addEventListener("hidden.bs.collapse", () => header.classList.remove("isMenuOpen"));
  }

  if (backToTop) {
    backToTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" }));
  }

  /* ---------- Split headlines ---------- */
  $$("[data-split]").forEach((el) => {
    let index = 0;
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const parts = child.textContent.split(/(\s+)/);
          const frag = document.createDocumentFragment();
          parts.forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(" "));
              return;
            }
            const outer = document.createElement("span");
            outer.className = "splitWord";
            const inner = document.createElement("span");
            inner.textContent = part;
            inner.style.setProperty("--wordIndex", index++);
            outer.appendChild(inner);
            frag.appendChild(outer);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1 && !child.matches(".wordRotator, .gradientText")) {
          walk(child);
        } else if (child.nodeType === 1) {
          // Keep rotators & gradient text intact and animate them as one unit:
          // splitting background-clip:text across transformed spans makes the
          // gradient render late and flicker.
          const outer = document.createElement("span");
          outer.className = "splitWord";
          const inner = document.createElement("span");
          inner.style.setProperty("--wordIndex", index++);
          child.replaceWith(outer);
          inner.appendChild(child);
          outer.appendChild(inner);
        }
      });
    };
    el.setAttribute("aria-label", el.textContent.replace(/\s+/g, " ").trim());
    walk(el);
    if (!el.hasAttribute("data-reveal")) el.setAttribute("data-reveal", "fade");
  });

  /* ---------- Reveal on scroll ---------- */
  $$("[data-delay]").forEach((el) => el.style.setProperty("--revealDelay", el.dataset.delay));

  const revealTargets = $$("[data-reveal], .mockGraph");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("isRevealed");
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -6% 0px" }
    );
    revealTargets.forEach((el) => revealObserver.observe(el));
  } else {
    revealTargets.forEach((el) => el.classList.add("isRevealed"));
  }

  /* ---------- Counters ---------- */
  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const decimals = (el.dataset.count.split(".")[1] || "").length;
    const duration = 1800;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 4);
      el.textContent = (target * eased).toFixed(decimals);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  const counters = $$("[data-count]");
  if ("IntersectionObserver" in window && !prefersReducedMotion) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    counters.forEach((el) => countObserver.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = el.dataset.count));
  }

  /* ---------- Word rotator ---------- */
  $$(".wordRotator").forEach((rotator) => {
    const words = $$(".rotatorWord", rotator);
    if (words.length < 2 || prefersReducedMotion) return;
    let current = 0;
    window.setInterval(() => {
      const prev = words[current];
      current = (current + 1) % words.length;
      prev.classList.remove("isActive");
      prev.classList.add("isLeaving");
      window.setTimeout(() => prev.classList.remove("isLeaving"), 650);
      words[current].classList.add("isActive");
    }, 2600);
  });

  /* ---------- Pointer effects (desktop only) ---------- */
  if (finePointer && !prefersReducedMotion) {
    // Cursor glow
    const glow = $(".cursorGlow");
    if (glow) {
      let gx = 0, gy = 0, tx = 0, ty = 0;
      window.addEventListener("pointermove", (e) => {
        tx = e.clientX;
        ty = e.clientY;
        glow.classList.add("isActive");
      });
      document.addEventListener("pointerleave", () => glow.classList.remove("isActive"));
      const loop = () => {
        gx += (tx - gx) * 0.12;
        gy += (ty - gy) * 0.12;
        glow.style.transform = `translate3d(${gx}px, ${gy}px, 0)`;
        requestAnimationFrame(loop);
      };
      loop();
    }

    // Magnetic buttons
    $$("[data-magnetic]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.25;
        const y = (e.clientY - r.top - r.height / 2) * 0.35;
        el.style.setProperty("--mx", `${x}px`);
        el.style.setProperty("--my", `${y}px`);
      });
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--mx", "0px");
        el.style.setProperty("--my", "0px");
      });
    });

    // Spotlight cards
    $$("[data-spotlight]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty("--spotX", `${e.clientX - r.left}px`);
        el.style.setProperty("--spotY", `${e.clientY - r.top}px`);
      });
    });

    // Tilt
    $$("[data-tilt]").forEach((el) => {
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.setProperty("--rx", `${(-py * 6).toFixed(2)}deg`);
        el.style.setProperty("--ry", `${(px * 8).toFixed(2)}deg`);
      });
      el.addEventListener("pointerleave", () => {
        el.style.setProperty("--rx", "0deg");
        el.style.setProperty("--ry", "0deg");
      });
    });

    // Hero parallax layers
    const heroVisual = $(".heroVisual");
    if (heroVisual) {
      const layers = $$("[data-depth]", heroVisual);
      const hero = heroVisual.closest("section") || heroVisual;
      hero.addEventListener("pointermove", (e) => {
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        layers.forEach((layer) => {
          const d = parseFloat(layer.dataset.depth);
          layer.style.transform = `translate3d(${x * d * 40}px, ${y * d * 40}px, 0)`;
        });
      });
      hero.addEventListener("pointerleave", () => layers.forEach((l) => (l.style.transform = "")));
    }
  }

  /* ---------- Scroll-lit statement ---------- */
  const statement = $(".aboutStatement");
  if (statement) {
    const words = [];
    const wrap = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === 3) {
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) return frag.appendChild(document.createTextNode(" "));
            const s = document.createElement("span");
            s.className = "dimWord";
            s.textContent = part;
            words.push(s);
            frag.appendChild(s);
          });
          child.replaceWith(frag);
        } else if (child.nodeType === 1) {
          wrap(child);
        }
      });
    };
    wrap(statement);

    const lightUp = () => {
      const r = statement.getBoundingClientRect();
      const vh = window.innerHeight;
      const ratio = Math.min(Math.max((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0), 1);
      const lit = Math.round(ratio * words.length);
      words.forEach((w, i) => w.classList.toggle("isLit", i < lit));
    };
    if (prefersReducedMotion) words.forEach((w) => w.classList.add("isLit"));
    else {
      window.addEventListener("scroll", lightUp, { passive: true });
      lightUp();
    }
  }

  /* ---------- Testimonial slider ---------- */
  $$("[data-slider]").forEach((wrap) => {
    const track = $(".testimonialTrack", wrap);
    if (!track) return;
    const stepSize = () => {
      const card = track.firstElementChild;
      return card ? card.getBoundingClientRect().width + 20 : 320;
    };
    $$("[data-slide]", wrap).forEach((btn) => {
      btn.addEventListener("click", () => {
        track.scrollBy({ left: btn.dataset.slide === "next" ? stepSize() : -stepSize(), behavior: "smooth" });
      });
    });

    // Drag to scroll (mouse)
    let down = false, startX = 0, startLeft = 0;
    track.addEventListener("pointerdown", (e) => {
      if (e.pointerType !== "mouse") return;
      down = true;
      startX = e.clientX;
      startLeft = track.scrollLeft;
      track.classList.add("isDragging");
    });
    window.addEventListener("pointermove", (e) => {
      if (!down) return;
      track.scrollLeft = startLeft - (e.clientX - startX);
    });
    window.addEventListener("pointerup", () => {
      if (!down) return;
      down = false;
      track.classList.remove("isDragging");
    });
  });

  /* ---------- Service index scrollspy ---------- */
  const indexLinks = $$(".serviceIndex a");
  if (indexLinks.length && "IntersectionObserver" in window) {
    const spy = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          indexLinks.forEach((a) => a.classList.toggle("isCurrent", a.getAttribute("href") === `#${entry.target.id}`));
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    indexLinks.forEach((a) => {
      const target = $(a.getAttribute("href"));
      if (target) spy.observe(target);
    });
  }

  /* ---------- Portfolio filter ---------- */
  const filterBar = $(".filterBar");
  const projectItems = $$(".projectGrid > [data-category]");
  if (filterBar && projectItems.length) {
    $$(".filterButton", filterBar).forEach((btn) => {
      const f = btn.dataset.filter;
      const count = f === "all" ? projectItems.length : projectItems.filter((i) => i.dataset.category.split(" ").includes(f)).length;
      const badge = $(".filterCount", btn);
      if (badge) badge.textContent = count;

      btn.addEventListener("click", () => {
        $$(".filterButton", filterBar).forEach((b) => {
          b.classList.toggle("isActive", b === btn);
          b.setAttribute("aria-pressed", b === btn ? "true" : "false");
        });
        projectItems.forEach((item) => item.classList.add("isFiltering"));
        window.setTimeout(() => {
          projectItems.forEach((item) => {
            const show = f === "all" || item.dataset.category.split(" ").includes(f);
            item.classList.toggle("isFilteredOut", !show);
          });
          requestAnimationFrame(() => projectItems.forEach((item) => item.classList.remove("isFiltering")));
        }, 260);
      });
    });
  }

  /* ---------- Case study drawer ---------- */
  const drawer = $(".caseDrawer");
  const caseDataEl = $("#caseData");
  if (drawer && caseDataEl) {
    const cases = JSON.parse(caseDataEl.textContent);
    const panel = $(".drawerPanel", drawer);
    const content = $(".drawerContent", drawer);
    const visualSlot = $(".drawerVisual", drawer);
    let lastTrigger = null;

    const close = () => {
      drawer.classList.remove("isOpen");
      drawer.setAttribute("aria-hidden", "true");
      document.body.classList.remove("isLocked");
      if (lastTrigger) lastTrigger.focus();
    };

    const open = (trigger) => {
      const data = cases[trigger.dataset.case];
      if (!data) return;
      lastTrigger = trigger;
      const visual = $(".projectVisual", trigger);
      visualSlot.innerHTML = "";
      if (visual) visualSlot.appendChild(visual.cloneNode(true));

      content.innerHTML = `
        <span class="eyebrow">${data.category}</span>
        <h2 id="drawerTitle">${data.title}</h2>
        <p class="leadText">${data.summary}</p>
        <div class="drawerFacts">
          <div><span>Client</span><strong>${data.client}</strong></div>
          <div><span>Industry</span><strong>${data.industry}</strong></div>
          <div><span>Timeline</span><strong>${data.timeline}</strong></div>
          <div><span>Year</span><strong>${data.year}</strong></div>
        </div>
        <h5>The challenge</h5>
        <p>${data.challenge}</p>
        <h5>What we did</h5>
        <ul class="checkList">${data.work.map((w) => `<li>${w}</li>`).join("")}</ul>
        <div class="drawerResults">${data.results.map((r) => `<div><strong>${r[0]}</strong><span>${r[1]}</span></div>`).join("")}</div>
        <div class="tagList">${data.stack.map((s) => `<span class="tagPill">${s}</span>`).join("")}</div>
        <div class="btnGroupInline">
          <a href="enquiry.html" class="btn btnPrimary"><span class="btnLabel" data-text="Start a similar project"><span>Start a similar project</span></span><span class="btnIcon"><i class="bi bi-arrow-up-right"></i></span></a>
        </div>`;

      drawer.classList.add("isOpen");
      drawer.setAttribute("aria-hidden", "false");
      document.body.classList.add("isLocked");
      panel.scrollTop = 0;
      window.setTimeout(() => $(".drawerClose", drawer).focus(), 50);
    };

    $$("[data-case]").forEach((card) => card.addEventListener("click", () => open(card)));
    $$("[data-drawer-close]", drawer).forEach((el) => el.addEventListener("click", close));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("isOpen")) close();
    });
  }

  /* ---------- Form helpers ---------- */
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateField(field) {
    let valid = true;
    const value = field.value.trim();
    if (field.required && !value) valid = false;
    if (valid && field.type === "email" && value && !emailPattern.test(value)) valid = false;
    if (valid && field.minLength > 0 && value.length < field.minLength) valid = false;
    field.classList.toggle("isInvalid", !valid);
    field.setAttribute("aria-invalid", valid ? "false" : "true");
    return valid;
  }

  function validateChips(group) {
    const valid = !!$("input:checked", group);
    group.classList.toggle("isInvalid", !valid);
    const err = group.nextElementSibling;
    if (err && err.classList.contains("fieldError")) err.style.display = valid ? "none" : "block";
    return valid;
  }

  function validateScope(scope) {
    let ok = true;
    $$(".fieldInput", scope).forEach((f) => {
      if (!validateField(f)) ok = false;
    });
    $$(".chipGroup[data-required]", scope).forEach((g) => {
      if (!validateChips(g)) ok = false;
    });
    const firstBad = $(".isInvalid", scope);
    if (firstBad) {
      const focusable = firstBad.matches("input, textarea, select") ? firstBad : $("input", firstBad);
      if (focusable) focusable.focus({ preventScroll: false });
    }
    return ok;
  }

  $$(".fieldInput").forEach((f) => {
    f.addEventListener("blur", () => f.value && validateField(f));
    f.addEventListener("input", () => f.classList.contains("isInvalid") && validateField(f));
  });
  $$(".chipGroup[data-required] input").forEach((input) =>
    input.addEventListener("change", () => {
      const g = input.closest(".chipGroup");
      if (g.classList.contains("isInvalid")) validateChips(g);
    })
  );

  // NOTE: forms are front-end only. Wire `fakeSubmit` to your backend
  // (e.g. a PHP mail handler or form service) to actually deliver messages.
  function fakeSubmit(form, onDone) {
    const btn = $("[type=submit]", form);
    form.classList.add("isSubmitting");
    if (btn) btn.setAttribute("disabled", "disabled");
    window.setTimeout(() => {
      form.classList.remove("isSubmitting");
      if (btn) btn.removeAttribute("disabled");
      onDone();
    }, 900);
  }

  /* ---------- Contact form ---------- */
  const contactForm = $("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateScope(contactForm)) return;
      fakeSubmit(contactForm, () => {
        contactForm.hidden = true;
        const success = $("#contactSuccess");
        success.classList.add("isVisible");
        $(".successName", success).textContent = $("#contactName").value.trim().split(" ")[0];
        success.focus();
      });
    });
  }

  /* ---------- Newsletter ---------- */
  $$(".footerNewsletter").forEach((form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = $("input", form);
      const note = form.parentElement.querySelector(".footerNote");
      if (!emailPattern.test(input.value.trim())) {
        if (note) note.textContent = "Please enter a valid email address.";
        input.focus();
        return;
      }
      input.value = "";
      if (note) {
        note.textContent = "You're in! Watch your inbox for our next issue.";
        note.classList.add("isSuccess");
      }
    });
  });

  /* ---------- Enquiry multi-step form ---------- */
  const enquiryForm = $("#enquiryForm");
  if (enquiryForm) {
    const steps = $$(".formStep", enquiryForm);
    const dots = $$(".stepDot");
    let current = 0;

    const budget = $("#budgetRange");
    const budgetOut = $("#budgetOutput");
    const budgetLabels = ["Under ₹50k", "₹50k – ₹1L", "₹1L – ₹3L", "₹3L – ₹5L", "₹5L – ₹10L", "₹10L+"];
    const syncBudget = () => {
      const v = parseInt(budget.value, 10);
      budgetOut.textContent = budgetLabels[v];
      budget.style.setProperty("--fill", `${(v / (budgetLabels.length - 1)) * 100}%`);
      budget.setAttribute("aria-valuetext", budgetLabels[v]);
    };
    if (budget) {
      budget.addEventListener("input", syncBudget);
      syncBudget();
    }

    const checkedValues = (name) =>
      $$(`input[name="${name}"]:checked`, enquiryForm)
        .map((i) => i.value)
        .join(", ") || "—";

    const buildSummary = () => {
      const list = $("#enquirySummary");
      const rows = [
        ["Services", checkedValues("services")],
        ["Project type", checkedValues("projectType")],
        ["Budget", budgetLabels[parseInt(budget.value, 10)]],
        ["Timeline", checkedValues("timeline")],
        ["Name", $("#enqName").value.trim() || "—"],
        ["Email", $("#enqEmail").value.trim() || "—"],
      ];
      list.innerHTML = rows.map((r) => `<li><span>${r[0]}</span><strong></strong></li>`).join("");
      $$("strong", list).forEach((s, i) => (s.textContent = rows[i][1]));
    };

    const show = (i) => {
      current = i;
      steps.forEach((s, idx) => s.classList.toggle("isCurrent", idx === i));
      dots.forEach((d, idx) => {
        d.classList.toggle("isCurrent", idx === i);
        d.classList.toggle("isDone", idx < i);
      });
      if (i === steps.length - 1) buildSummary();
      const top = enquiryForm.getBoundingClientRect().top + window.scrollY - 120;
      if (window.scrollY > top) window.scrollTo({ top, behavior: prefersReducedMotion ? "auto" : "smooth" });
    };

    $$("[data-step-next]", enquiryForm).forEach((btn) =>
      btn.addEventListener("click", () => {
        if (validateScope(steps[current])) show(Math.min(current + 1, steps.length - 1));
      })
    );
    $$("[data-step-prev]", enquiryForm).forEach((btn) => btn.addEventListener("click", () => show(Math.max(current - 1, 0))));

    // Preselect a service from ?service=web etc.
    const preset = new URLSearchParams(window.location.search).get("service");
    if (preset) {
      const box = $(`input[name="services"][data-key="${preset}"]`, enquiryForm);
      if (box) box.checked = true;
    }

    enquiryForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateScope(steps[current])) return;
      fakeSubmit(enquiryForm, () => {
        enquiryForm.hidden = true;
        $(".stepper").hidden = true;
        const success = $("#enquirySuccess");
        success.classList.add("isVisible");
        $(".successName", success).textContent = $("#enqName").value.trim().split(" ")[0];
        success.focus();
      });
    });
  }

  /* ---------- Office hours: highlight today ---------- */
  const hours = $(".hoursList");
  if (hours) {
    const day = new Date().getDay(); // 0 Sun … 6 Sat
    const li = $(`[data-days*="${day}"]`, hours);
    if (li) {
      const tag = document.createElement("span");
      tag.className = "isOpenNow";
      tag.textContent = " · Today";
      $("span", li).appendChild(tag);
    }
  }

  /* ---------- Footer year ---------- */
  $$("[data-year]").forEach((el) => (el.textContent = new Date().getFullYear()));
})();
