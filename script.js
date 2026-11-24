// =========================================================
// Harsh Dave — portfolio
// =========================================================

// WhatsApp number in international format, digits only (e.g. 919876543210).
// Every "Hire me" button and the contact form use this.
const WHATSAPP_NUMBER = "918424850011";

const DEFAULT_MESSAGE =
    "Hi Harsh, I came across your portfolio and would like to talk about working together.";

function whatsappLink(text) {
    if (!WHATSAPP_NUMBER) return null;
    return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(text);
}

function track(name) {
    if (typeof gtag === "function") gtag("event", name);
}

// ---------- Hire me buttons ----------
document.querySelectorAll(".js-hire").forEach(function (el) {
    const link = whatsappLink(DEFAULT_MESSAGE);
    if (link) {
        el.href = link;
        el.target = "_blank";
        el.rel = "noopener";
    } else {
        // No number set yet: fall back to the contact section
        el.href = "#contact";
    }
});

// ---------- GA events on any element with data-ga ----------
document.querySelectorAll("[data-ga]").forEach(function (el) {
    if (el.tagName === "BUTTON" && el.type === "submit") return; // tracked on submit
    el.addEventListener("click", function () { track(el.dataset.ga); });
});

// ---------- Hero: type the search, then show the result ----------
(function () {
    const query = document.getElementById("query");
    const ad = document.getElementById("ad");
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!query || !ad || reduce || window.scrollY > 200) return;

    const text = query.dataset.text;
    let i = 0;
    query.textContent = "";
    query.classList.add("typing");
    ad.classList.add("waiting");

    function step() {
        query.textContent = text.slice(0, ++i);
        if (i < text.length) {
            setTimeout(step, 38 + Math.random() * 40);
        } else {
            setTimeout(function () {
                query.classList.remove("typing");
                ad.classList.add("shown");
                ad.classList.remove("waiting");
            }, 350);
        }
    }
    setTimeout(step, 400);
})();

// ---------- Contact form → WhatsApp ----------
const form = document.getElementById("hireForm");
const note = document.getElementById("formNote");

if (form) {
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = form.elements.name;
        const message = form.elements.message;
        let ok = true;

        [name, message].forEach(function (field) {
            const empty = !field.value.trim();
            field.classList.toggle("invalid", empty);
            if (empty) ok = false;
        });

        if (!ok) {
            note.textContent = "Add your name and a short message, then send.";
            return;
        }

        const company = form.elements.company.value.trim();
        const type = form.elements.type.value;

        const text =
            "Hi Harsh, I'm " + name.value.trim() +
            (company ? " from " + company : "") +
            ". I'm reaching out about " + type + ".\n\n" +
            message.value.trim();

        const link = whatsappLink(text);
        track("hire_me_form");

        if (link) {
            window.open(link, "_blank", "noopener");
            note.textContent = "WhatsApp opened in a new tab with your message. Press send there.";
        } else {
            note.textContent = "WhatsApp isn't connected yet. Message me on LinkedIn instead.";
        }
    });
}

// ---------- Theme toggle ----------
const themeBtn = document.getElementById("themeToggle");
if (themeBtn) {
    themeBtn.addEventListener("click", function () {
        const root = document.documentElement;
        const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
        root.setAttribute("data-theme", next);
        try { localStorage.setItem("theme", next); } catch (e) {}
    });
}

// ---------- Mobile menu ----------
const menuBtn = document.getElementById("menuToggle");
const nav = document.getElementById("nav");
if (menuBtn && nav) {
    menuBtn.addEventListener("click", function () {
        const open = nav.classList.toggle("open");
        menuBtn.setAttribute("aria-expanded", open);
    });
    nav.querySelectorAll("a").forEach(function (a) {
        a.addEventListener("click", function () {
            nav.classList.remove("open");
            menuBtn.setAttribute("aria-expanded", "false");
        });
    });
}

// ---------- Top bar border on scroll ----------
const topbar = document.querySelector(".topbar");
function onScroll() { topbar.classList.toggle("scrolled", window.scrollY > 8); }
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// ---------- Active nav link ----------
const links = Array.from(document.querySelectorAll(".nav a"));
const sections = links
    .map(function (a) { return document.querySelector(a.getAttribute("href")); })
    .filter(Boolean);

if ("IntersectionObserver" in window) {
    const navObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                links.forEach(function (a) {
                    a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
                });
            }
        });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach(function (s) { navObserver.observe(s); });
}

// ---------- Footer year ----------
const year = document.getElementById("year");
if (year) year.textContent = new Date().getFullYear();
