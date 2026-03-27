# AquaShield Car Wash Nairobi — Website

> A bold, industrial-grade landing page for a professional car wash and auto detailing centre in Nairobi — with live Google Sheets booking capture, animated drop effects, and a full pricing system built in.

---

## ✨ Design Philosophy

| Attribute | Choice |
|---|---|
| **Aesthetic** | Bold Industrial / Automotive — dark, high-contrast, technical |
| **Display Font** | [Barlow Condensed](https://fonts.google.com/specimen/Barlow+Condensed) — tight, muscular, all-caps energy |
| **Body Font** | [Barlow](https://fonts.google.com/specimen/Barlow) — clean, utilitarian, readable |
| **Palette** | Deep Charcoal `#0e1117` · Electric Cyan `#00d4e8` · Stark White · Hazard Yellow |
| **Mood** | Motorsport paddock meets Nairobi street credibility |
| **Signature Detail** | Angled `clip-path` corners on buttons, badges & icons — automotive precision |

---

## 📁 Project Structure

```
aquashield-carwash-nairobi/
│
├── index.html    # Full page HTML — 8 sections, semantic markup
├── style.css     # All styles — CSS variables, dark theme, responsive
├── script.js     # JavaScript — nav, form, Sheets, counters, animations
└── Code.gs       # Google Apps Script — booking capture backend
```

> **No build tools. No npm. No dependencies.** Drop into any host and go live.

---

## 🗂️ Page Sections

| Section | Description |
|---|---|
| **Hero** | Dark full-screen with animated water drop particles, diagonal slash accent, outline text effect |
| **Ticker** | High-speed scrolling services strip in charcoal band with `//` separators |
| **Services** | 6-card grid with left-border reveal on hover, featured dark card + POPULAR badge |
| **Packages** | 3-tier pricing (Basic / Premium / Elite) with feature lists and angled button clips |
| **Process** | 4-step how-it-works with oversized ghost numbers and connector lines |
| **Testimonials** | 3-column grid with dark featured card and cyan bottom-border reveal |
| **Booking** | Split layout — contact info + payment chips + full booking form |
| **Footer** | Brand, quick links, contact details, social icons |

---

## 🚀 Quick Start

### 1. Get the files

```bash
git clone https://github.com/yourname/aquashield-carwash.git
cd aquashield-carwash
```

Or download and extract the ZIP.

### 2. Open locally

```bash
open index.html
# or use VS Code Live Server
```

### 3. Replace placeholder details

| Find | Replace with | File(s) |
|---|---|---|
| `AquaShield` | Your business name | `index.html`, `Code.gs` |
| `+254700000000` | Your real number | `index.html` |
| `hello@aquashield.co.ke` | Your real email | `index.html` |
| `Mombasa Road, Industrial Area` | Your address | `index.html` |
| `YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` | Your Apps Script URL | `script.js` |

---

## 📊 Google Sheets Booking Integration

Every form submission lands in a Google Sheet row — zero backend, zero cost.

### Data Flow

```
Client submits form  →  script.js POSTs payload  →  Code.gs appends row  →  Sheet updated
                                                           ↓
                                               Optional email alert to manager
```

### Setup (~5 minutes)

**Step 1 — Create a Google Sheet**

[sheets.google.com](https://sheets.google.com) → New spreadsheet → name it `AquaShield – Bookings`

**Step 2 — Open Apps Script**

Inside the sheet: **Extensions → Apps Script**

**Step 3 — Paste Code.gs**

Delete all existing code. Paste the full contents of `Code.gs`.

Add your email to receive instant alerts:
```javascript
var NOTIFY_EMAIL = 'manager@yourcarwash.co.ke';  // line 43
```

**Step 4 — Deploy**

```
Deploy → New Deployment
  Type           → Web App
  Execute as     → Me
  Who has access → Anyone
```
Copy the Web App URL.

**Step 5 — Wire it up**

In `script.js` line 14:
```javascript
const SHEETS_WEBHOOK_URL = 'https://script.google.com/macros/s/YOUR_ID/exec';
```

**Step 6 — Test**

Submit a test booking. Row should appear in your sheet within seconds.

---

### Sheet Column Structure

| Column | Content | Notes |
|---|---|---|
| **Timestamp** | Date & time (Nairobi EAT) | Auto-filled |
| **Client Name** | Full name | From form |
| **Phone** | Phone number | From form |
| **Vehicle** | Make, model, colour, reg | From form |
| **Service** | Selected service | From form |
| **Package** | Basic / Premium / Elite | From form |
| **Preferred Date** | Requested date | From form |
| **Preferred Time** | Time slot | From form |
| **Notes** | Special requests | From form |
| **Status** | `New` (default) | Update manually |
| **Assigned Bay** | Bay 1 / 2 / 3 | Fill manually |
| **Payment** | M-Pesa / Cash / Card | Fill manually |
| **Device** | Mobile / Desktop | Auto-detected |
| **Page URL** | Referral page | Auto-filled |

> 💡 New rows are highlighted in a light cyan tint for instant visual scanning.
>
> 💡 Vehicle and Service columns are auto-bolded for fast reading.

---

## 🎨 Design System

### Colour Palette

```css
--charcoal:     #0e1117   /* Primary dark — hero, dark sections, footer */
--charcoal-mid: #161b26   /* Process section */
--charcoal-lt:  #1e2535   /* Cards, contact section */
--cyan:         #00d4e8   /* Signature accent — CTAs, icons, borders */
--cyan-dark:    #00aabb   /* Hover states, nav underlines, form focus */
--cyan-glow:    rgba(0,212,232,0.15)  /* Box shadow glow effect */
--white:        #f4f6f9   /* Page background, form backgrounds */
--steel:        #8899aa   /* Muted text, secondary info */
--steel-lt:     #c0cdd8   /* Light text on dark backgrounds */
--yellow:       #f5c518   /* Star ratings, Elite package accent */
```

### Signature Design Details

**Clipped corners** — Angled `clip-path` cuts on buttons, icons, badges, and cards give the site its automotive precision feel:
```css
clip-path: polygon(0 0, calc(100% - 12px) 0, 100% 12px, 100% 100%, 0 100%);
```

**Animated water drops** — 9 CSS-animated vertical streaks fall through the hero background, reinforcing the car wash theme without JavaScript.

**Outlined hero text** — `.h1-bot em` uses `-webkit-text-stroke` for a hollow/outline text effect on the hero headline.

**Left-border card reveals** — Service cards use a `::before` pseudo-element that grows from 0 to full height on hover.

### Fonts

| Role | Font | Weights Used |
|---|---|---|
| Headlines, labels, buttons | Barlow Condensed | 400, 600, 700, 800, 900 |
| Body, descriptions, inputs | Barlow | 300, 400, 500, 600 |

### Key Animations

| Animation | Element | Behaviour |
|---|---|---|
| `heroIn` | Hero content | Slides in from left on load |
| `dropFall` | Water drops | Continuous vertical fall through hero |
| `ticker` | Services strip | Continuous horizontal scroll |
| `tagPulse` | Hero availability dot | Green pulse glow |
| `scrollPulse` | Hero scroll line | Breathing opacity |
| Left border grow | Service cards | `::before` height 0→100% on hover |
| Bottom bar sweep | Testimonial cards | `::after` width 0→100% on hover |
| Counter animation | Hero stats | Numbers count up on scroll into view |
| Scroll reveal | Cards, steps | Fade + slide on IntersectionObserver |

---

## ⚙️ JavaScript Features

| Feature | Description |
|---|---|
| Sticky header | Transparent → solid with shadow after 60px scroll |
| Mobile nav | Slide-in drawer with overlay, Escape key support |
| Smooth scroll | Header-offset-aware anchor scrolling |
| Booking form | 7-field validation, Google Sheets POST, status messages |
| Scroll reveal | `IntersectionObserver` with staggered delay per element |
| **Stat counters** | Hero numbers animate up when scrolled into view |
| Footer year | Auto-updated copyright year |

---

## 🌍 Deployment

### Free Static Hosts

| Platform | Free | Notes |
|---|---|---|
| [Netlify](https://netlify.com) | ✅ | Drag & drop the 3 files |
| [Vercel](https://vercel.com) | ✅ | Connect GitHub repo |
| [GitHub Pages](https://pages.github.com) | ✅ | Push to `gh-pages` |
| [Cloudflare Pages](https://pages.cloudflare.com) | ✅ | Fastest CDN globally |

> ⚠️ `Code.gs` lives in Google Apps Script, not your hosting folder.

---

## 🔧 Customisation Guide

### Add a Service Card

```html
<article class="svc-card">
  <div class="svc-num">07</div>
  <div class="svc-icon cyan"><i class="fas fa-ICON"></i></div>
  <h3>SERVICE NAME</h3>
  <p>Description of what this service covers.</p>
  <div class="svc-from">From <strong>Ksh X,XXX</strong></div>
  <a href="#contact" class="svc-cta">Book <i class="fas fa-arrow-right"></i></a>
</article>
```

Add `class="svc-card svc-featured"` for the dark featured variant with cyan border + badge.

### Add a Package Tier

```html
<div class="pkg-card">
  <div class="pkg-tier">TIER NAME</div>
  <div class="pkg-price"><sup>Ksh</sup>X,XXX<span>+</span></div>
  <p class="pkg-tagline">Your tagline here.</p>
  <ul class="pkg-features">
    <li><i class="fas fa-check"></i> Feature one</li>
    <li><i class="fas fa-check"></i> Feature two</li>
    <li class="muted"><i class="fas fa-minus"></i> Not included</li>
  </ul>
  <a href="#contact" class="pkg-btn">Book Now</a>
</div>
```

### Change Hero Background

In `style.css`, update `.hero-bg`:
```css
.hero-bg {
  background: url('YOUR_DARK_CAR_PHOTO_URL') center/cover no-repeat;
}
```

Use a dark automotive photo — the overlay works best on images with natural shadows.

### Adjust Water Drops

Each `.drop` span in the hero can be tuned for position, size, and speed:
```css
.drop:nth-child(1) {
  left: 8%;          /* Horizontal position */
  height: 80px;      /* Drop length */
  animation-duration: 3.2s;   /* Fall speed */
  animation-delay: 0s;        /* Start delay */
}
```

---

## ✅ Pre-Launch Checklist

- [ ] Replace `+254700000000` with real number (all instances)
- [ ] Replace email placeholder with real business email
- [ ] Update address and operating hours
- [ ] Deploy `Code.gs` and paste Web App URL into `script.js`
- [ ] Set `NOTIFY_EMAIL` in `Code.gs`
- [ ] Submit test booking — verify row in Google Sheet
- [ ] Replace hero background image with a real photo of your wash bay
- [ ] Update service prices (Ksh amounts)
- [ ] Update package price ranges to match real pricing
- [ ] Update social media links in footer
- [ ] Add a favicon `<link rel="icon" ...>` to `<head>`
- [ ] Test on mobile — especially the booking form
- [ ] Verify Google Map embed shows correct location
- [ ] Check all `clip-path` elements render correctly on Safari

---

## 📄 License

Free for personal and commercial use. Adapt freely for your business or clients.

---

<div align="center">

**Built for speed. Designed for clean.**

*AquaShield — Every car. Every time.*

</div>
