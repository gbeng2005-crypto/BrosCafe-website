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

## Backlog / Next Tasks
- P0: Owner connects LOYALTY_URL in src/config.js to the real loyalty-card signup
- P0: Replace placeholder videos (config.js VIDEOS) with real Bros Cafe footage
- P1: Real photography for community collage + What's New
- P1: Full /menu page (VIEW MENU currently placeholder)
- P2: Products/merch shelf, Instagram feed embed, contact/location block with hours + map
- P2: Multi-page routing with page transitions if site grows beyond one page

## Test Credentials
None — no auth/accounts on this site by design (loyalty system lives elsewhere).
