# Bros Cafe — Website PRD

## Original Problem Statement
Design a premium, cinematic, editorial website for Bros Cafe (olive #66734A / cream #F5F0E6 / white #FFFFFF only). Latest scope (2026-08): FRONTEND ONLY. Do NOT build/modify/replace the existing loyalty card system — only visible placeholder buttons/links where the owner will manually connect the existing loyalty signup. Awwwards-level art direction: kinetic masked-reveal hero, editorial coffee cards, scroll-expanding "Bros Moment" video section, numbered manifesto chapters, slow marquee, lenis smooth scroll, framer-motion reveals, mobile-first, prefers-reduced-motion respected.

## User Personas
- Café visitor / potential regular browsing on phone
- Loyalty-curious customer who taps "GET LOYALTY CARD"
- The owner, who will manually wire the loyalty signup URL and swap placeholder videos/photos for real Bros Cafe footage

## Core Requirements (static)
- Full-screen video hero: "Good coffee. Good people." + EXPLORE / GET LOYALTY CARD buttons
- Nav: HOME / MENU / ABOUT / WHAT'S NEW / LOYALTY + loyalty CTA; blur on scroll; animated mobile menu
- Sections: Coffee cards (Espresso, Cappuccino, Latte, Americano), The Bros Moment (expanding video, "Take a minute." → "Coffee tastes better together."), About ("More than coffee."), Menu preview (Coffee / Cold drinks / Pastries / Specials + VIEW MENU), Loyalty CTA ("Your coffee should count." / Buy 4, next FREE), What's New ("From the Bros"), community collage, minimal footer
- Loyalty buttons are PLACEHOLDERS ONLY — no loyalty functionality, no accounts, no backend
- Videos: muted/autoplay/loop, marked placeholders, replaceable
- Palette strictly olive/cream/white; editorial typography; generous whitespace; GPU-friendly motion

## Architecture
- React SPA (single-page anchor navigation), FastAPI backend untouched (template health endpoint only), MongoDB untouched
- src/config.js — LOYALTY_URL placeholder + all video/image URLs (swap point for real media)
- src/hooks/useLenis.js — smooth scroll singleton + scrollToSection
- src/components/: Nav, Hero, Marquee, SectionLabel, Reveal, Coffee, BrosMoment, About, MenuPreview, LoyaltyCTA (3D-tilt card visual), WhatsNew, Community, Footer
- Fonts: Cormorant Garamond (display) + DM Sans (body) via Google Fonts
- Libraries: framer-motion (installed), lenis (installed 2026-08-25)

## Implemented (2026-08-25)
- Cinematic video hero with masked line-by-line title reveal, mouse-parallax video drift, cream/olive overlay, scroll cue
- Sticky nav with scroll blur + animated full-screen mobile menu (verified tap-through to Loyalty)
- Slow editorial marquee, numbered section labels (01–06)
- Coffee section with staggered editorial cards, hover zoom/lift/arrow slide
- Bros Moment: 240vh sticky scroll-expanding video with caption reveal (static fallback under reduced motion)
- About with three manifesto chapters + parallax photo
- Menu preview with sticky heading + dotted-leader price rows + VIEW MENU placeholder
- Loyalty CTA section with 3D-tilt loyalty card visual + placeholder button
- What's New editorial cards (4), asymmetric community collage with parallax
- Footer with links, Instagram, contact
- prefers-reduced-motion fallbacks sitewide; data-testids on all interactive elements

## Verified
- Desktop: hero, coffee, moment, menu, loyalty, community, footer screenshots; backend /api/ responds 200
- Mobile (390px): hero crop, hamburger menu, nav → loyalty scroll flow

## Implemented (2026-08-25, part 2 — Advanced Interaction Upgrade)
- Full product catalog (17 products: coffee/cold/food/sweet/merch) in src/data/products.js with flavor profiles, ingredients, sizes, allergens, Bros tips, Behind-the-Cup steps, pairings
- Cinematic product modal: blurred backdrop, expanding image, swipe/drag gallery with thumbnails, video slide for espresso, staggered detail reveal, animated flavor sliders, Behind the Cup vertical reveal, Goes Well With pairings, More From Bros related products (smooth in-modal switching), ESC/backdrop close
- The Collection: animated category filters (ALL/COFFEE/COLD/FOOD/SWEET/MERCH with layout pill) + personality search ("What are you craving?" — coffee/sweet/gift synonyms) + animated grid rearrange
- Favorites: heart on every card/modal, spring pop animation, localStorage persistence, "Your Bros Picks" section appears only when favorites exist
- "Add to My Day": playful list with floating cup button + slide-in drawer ("That's a good day."), persisted locally
- Discover Bros: vertical→horizontal sticky story section (Coffee/Sweet/People/Merch panels using user's uploaded brand posters + end CTA), progress bar, reduced-motion fallback
- Merch lookbook: editorial asymmetric grid with masked cream-panel reveals, hover price cards
- Image lightbox: community collage + about photo open fullscreen viewer with prev/next/swipe/counter
- Custom cursor (desktop only): VIEW / EXPLORE / PLAY floating labels on interactive media
- Loader: 1.3s coffee-cup steam intro; hero/nav delays shifted to follow it
- Easter eggs: click nav logo 5× → tiny coffee burst; hover loyalty card cup icon → steam rises
- Coffee section cards now open the product modal; quick-view hover chips; video hover preview on espresso card
- Verified: desktop + mobile (390px) — modal open/switch/close, fav, day drawer, filters, search, lightbox nav, horizontal scroll, swipe gallery

## Implemented (2026-08-25, part 3 — EN/HU bilingual)
- Full English/Hungarian translation system: src/i18n.js (all UI copy) + src/data/products.hu.js (all 17 products: descriptions, tips, ingredients, behind-the-cup steps, sizes, materials, allergens)
- EN | HU toggle in nav (desktop pill + mobile menu), choice persisted in localStorage (bros-lang)
- Search understands Hungarian synonyms (édes, sütemény, ajándék, bögre, kávé, jeges, gofri…)
- Cursor labels, day drawer, loyalty card mockup, marquee, Bros Moment, all section copy localized
- Verified: HU hero/nav/collection/modal (ÍZVILÁG sliders, MÉRET, BROS TIPP, A CSÉSZE MÖGÖTT) and EN switch-back

## Implemented (2026-08-26, part 4 — Loyalty system merged)
- Cloned github.com/gbeng2005-crypto/BrosCafe → /app/broscafe-loyalty (kept as reference copy)
- Backend REPLACED with the real loyalty API (server.py + apple_wallet.py + assets/); env: JWT_SECRET, ADMIN_EMAIL/PASSWORD (biblebuddiesjustforyou@gmail.com / BrosCafe2026!), FRONTEND_URL, EMERGENT_EMAIL_KEY (managed email — magic links send for real), CAFE_* details
- Frontend: loyalty app ported to src/loyalty/ (pages, contexts, i18n, components, assets) with import rewrites; mounted under LoyaltyShell providers at routes: /loyalty /menu /whats-new /shop /product/:id /contact /opening /auth/verify /card/:code /account /login /staff /admin
- Homepage CTAs now point to /loyalty; VIEW MENU → /menu (full dual-currency menu)
- Seeded content (2 What's New items, 3 shop products) via seed_content.py
- Styling scoped: loyalty.css holds shadcn HSL vars + Playfair/Manrope + stamp/reward keyframes; cinematic homepage untouched
- Verified end-to-end: admin login → /admin analytics (live data), magic-link request sends email (202 from proxy), verify → member + auto-reserved opening pass, staff scan adds stamp, /loyalty signup UI → inbox screen, /opening live countdown (Sept 16, 2026 08:00), homepage CTA → /loyalty
- NOT active: Apple Wallet pass signing (needs APPLE_* certs/env — code dormant, see APPLE_WALLET_SETUP.md in the cloned repo); Google Wallet (was backlog P1 in their PRD); Stripe shop checkout (no live key)

## Implemented (2026-08-26, part 5 — ONE unified ecosystem)
- One customer identity everywhere: CustomerAuthProvider moved to app root — homepage nav shows a live "☕ n/4" account chip when signed in; magic-link session is shared across homepage, loyalty, account, shop (no re-login ever)
- One navigation: main Nav now route-aware (MENU→/menu, LOYALTY→/loyalty, anchors scroll home first), used on loyalty pages too via `solid` prop; CustomerLayout keeps mobile bottom nav with live stamp count; logo always returns home without reload
- One typography: loyalty pages now use Cormorant Garamond + DM Sans (tailwind fontFamily switched) — same serif/editorial look as homepage
- One language: shared localStorage key + LangSync bridge — one EN/HU toggle instantly switches BOTH the homepage and loyalty pages, no reload
- One product catalog: backend `products` collection is the single source (seed_catalog.py, 16 items, full HU/EN + flavor/tips/galleries); frontend hydrates from /api/products on load with bundled fallback; Shop, product details, homepage Collection, product modal, and the new loyalty "Discover something new" row all read the same catalog; admin can add products via POST /api/admin/products
- Loyalty member view gained "Discover something new" — opens the SAME cinematic ProductModal (now mounted globally)
- Smooth 350ms fade/slide page transitions between all routes + scroll reset
- Fixed: duplicate i18n key collision (discover vs discoverRow) that blanked the homepage
- Verified: account chip 2/4 in nav, loyalty nav route, discovery→modal, shop catalog, logo→home, EN⇄HU sync both directions, member view with stamps

## Implemented (2026-08-26, part 7 — Apple Wallet LIVE)
- Apple Wallet activated with real certificates: certs in /app/backend/certs (pass.pem, ios-private-key.pem, wwdr.pem G4 + Apple root for verification)
- Verified: key matches cert, chain verifies to Apple Root CA (pass.pem: OK), /api/admin/wallet/status → configured:true, signed .pkpass generates (63KB, manifest hashes verified, correct passTypeIdentifier/teamIdentifier, unique serial per member, webServiceURL wired for push updates)
- UI: "Add to Apple Wallet" on /loyalty downloads the real signed pass
- Still dormant: Google Wallet (no integration in original system); APNs push fires on balance change once a device registers a pass

## Bugfixes (2026-08-26)
- FIXED language flip EN→HU: LangSync rewritten as last-writer-wins single effect; both systems now default to the shared "bros-lang" key (HU default, matching the café)
- FIXED magic-link redirect hang: replaced AnimatePresence mode="wait" route wrapper with enter-only fade/slide (exit hang left users stuck on "Signing you in…")
- IMPROVED sign-in: one smart email form at /loyalty — existing email → sign-in link (no duplicate account, no name needed); new email → asks first name, then creates card + sends link; backend request-link returns needs_name without creating phantom members
- Verified in browser: magic link → member view (not stuck), EN/HU hammered repeatedly + navigation, stable; new-email→name-step→inbox flow; existing-email re-login via API + UI
- Note: testing_agent subagent unavailable in this environment — verified via browser automation instead

## Implemented (2026-08-26, part 6 — Master unification pass)
- REMOVED app-style bottom nav — one website Nav everywhere (HOME / MENU / WHAT'S NEW / OPENING / LOYALTY / SHOP + account chip + EN/HU), unified Footer on all customer pages, /card/:code now uses the shared Nav too
- ONE menu: /menu and the homepage menu preview both render from the unified products catalog (no more separate menu_items lists); every menu row opens the same cinematic ProductModal
- Shop is now BROS COLLECTION — COMING SOON editorial page (steam micro-animation, asymmetric editorial cards, merch opens the same product modal with a COMING SOON chip; no fake checkout/notify)
- /product/:id deep links open the shared modal over the shop (no separate product page)
- Account page restyled as an editorial hub: "GOOD TO SEE YOU, NAME." — loyalty stamps, opening pass + countdown, rewards, favorites (click → modal), what's new, wallet, settings
- Loyalty member view got the editorial headline "Your coffee should count."; returning-member personalization on the homepage loyalty section ("GOOD TO SEE YOU AGAIN — n/4 · OPEN MY LOYALTY")
- Grand Opening teaser band on homepage (live server-synced countdown, "You're on the list" when reserved) + footer opening line; What's New cards navigate to /whats-new
- Verified: opening teaser, menu modal from both menus, shop coming-soon + modal chip, account hub, loyalty headline, card page nav, footer opening line, HU rendering of shop

## Backlog / Next Tasks

## Test Credentials
None — no auth/accounts on this site by design (loyalty system lives elsewhere).
