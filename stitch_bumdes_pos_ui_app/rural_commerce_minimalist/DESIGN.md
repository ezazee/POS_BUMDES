---
name: Rural Commerce Minimalist
colors:
  surface: '#FFFFFF'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#434655'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#565e74'
  on-secondary: '#ffffff'
  secondary-container: '#dae2fd'
  on-secondary-container: '#5c647a'
  tertiary: '#943700'
  on-tertiary: '#ffffff'
  tertiary-container: '#bc4800'
  on-tertiary-container: '#ffede6'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#dae2fd'
  secondary-fixed-dim: '#bec6e0'
  on-secondary-fixed: '#131b2e'
  on-secondary-fixed-variant: '#3f465c'
  tertiary-fixed: '#ffdbcd'
  tertiary-fixed-dim: '#ffb596'
  on-tertiary-fixed: '#360f00'
  on-tertiary-fixed-variant: '#7d2d00'
  background: '#F8FAFC'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  primary-hover: '#1D4ED8'
  primary-light: '#EFF6FF'
  border-subtle: '#E2E8F0'
  text-primary: '#0F172A'
  text-secondary: '#64748B'
  text-muted: '#94A3B8'
  status-success: '#16A34A'
  status-warning: '#F59E0B'
  status-danger: '#DC2626'
typography:
  display-currency:
    fontFamily: Plus Jakarta Sans
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  display-currency-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-page:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  headline-section:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-card:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  body-regular:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-medium:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
  label-button:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
  caption-small:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  caption-medium:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
  mono-tabular:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-desktop: 1.5rem
  margin: 1rem
  margin-tablet: 1.25rem
  margin-desktop: 1.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1rem
  space-xl: 1.5rem
  space-2xl: 2rem
---

## Brand & Style

This design system is engineered for village enterprise (BUMDes) retail checkout operators, administrative staff, and village officers who require speed, legibility, and zero friction. The brand personality balances dependable institutional trust with tactile retail utility: straightforward, sturdy, transparent, and approachable. It removes visual ornamentation to eliminate cognitive overload for operators of varied technical literacies in fast-paced counter environments.

The visual style is **Modern Corporate Minimalism with High-Legibility Retail Utility**:
- **Pure Functionalism:** Form rigorously follows transactional function. Screens are built with crisp borders, distinct visual groupings, and expansive tap targets.
- **Atmospheric Clarity:** Stark clean surfaces (#FFFFFF cards set on a cool #F8FAFC canvas) ensure inventory, prices, barcode lookups, and tender calculations command primary attention.
- **Zero Distraction:** Absolutely no gradients, no skeuomorphic glassmorphism, and no superfluous animations that degrade responsiveness or clarity on low-power hardware.

## Colors

The palette establishes an unmistakable hierarchy optimized for checkout speed and situational awareness:

- **Primary (`#2563EB` - Royal Blue):** Anchors high-priority actions including the primary "Bayar" (Pay) CTA, active filter states, keyboard focus indicators, and selected navigation tabs.
- **Primary Hover (`#1D4ED8`):** Provides sharp, unambiguous tactile feedback during active presses and pointer interactions.
- **Primary Light (`#EFF6FF`):** Delivers subtle tinting for active rows, badge backdrops, and selected checkout item states without introducing chromatic noise.
- **Secondary / Text Primary (`#0F172A`):** Deep slate providing uncompromising AA/AAA contrast for currency values, product naming, invoices, and totals.
- **Neutral / Text Secondary (`#64748B`):** Guides peripheral secondary content such as unit counts, transaction timestamps, and table headers.
- **Muted Text (`#94A3B8`):** Reserved for unselected placeholders, disabled indicators, and breadcrumb dividers.
- **Surfaces & Borders:** `#FFFFFF` serves as isolated modular cards over the neutral `#F8FAFC` background, bordered with `#E2E8F0` for structural grounding without harshness.
- **Status Accents:**
  - `Success (#16A34A)`: Transaction completions, active products, normal stock indicators (>5 units).
  - `Warning (#F59E0B)`: Low stock warnings (1–5 units) and pending reconciliation items.
  - `Danger (#DC2626)`: Out of stock status, item deletion actions, and void transactions.

## Typography

Typography is powered exclusively by **Plus Jakarta Sans**, chosen for its crisp geometric terminals, open apertures, and exceptional legibility across low-resolution desktop monitors and POS touch tablets.

Numerical and monetary clarity is paramount:
- All prices, invoice codes, and quantities must render using tabular figure alignment (`font-variant-numeric: tabular-nums`) to prevent jitter and maintain vertical scannability in carts and summary reports.
- `display-currency` commands total visual authority in checkout carts and payment confirmation modals to eliminate cash exchange errors.
- Visual weights are strictly tiered: `600 (Semibold)` for structural navigation, titles, and key actions; `500 (Medium)` for card titles, active indicators, and metadata labels; `400 (Regular)` for secondary context and input text.

## Layout & Spacing

The layout is built around a predictable structural shell comprising a persistent vertical sidebar, a lightweight utility header, and a responsive workspace:

- **Desktop Shell:**
  - Sidebar: Fixed width of `240px`.
  - Header: Fixed height of `64px`.
  - Main Content Area: Padded consistently with `24px` (`space-xl`).
- **POS Split Layout:**
  - Desktop: 65% Product grid area, 35% persistent right-hand order cart.
  - Tablet (768px – 1024px): 60% Product catalog area, 40% Cart drawer / split column with collapsible sidebar navigation.
  - Mobile (<768px): 100% Product grid with a fixed floating action bar (`Floating Cart`) that slides in a full-height cart drawer on demand.

Spacing conforms strictly to a 4px/8px incremental scale. Product cards in the POS grid utilize an internal gap of `space-md` (12px) to maximize screen real estate, while management dashboards and transactional data tables utilize `space-xl` (24px) for comfortable eye movement and unambiguous interaction boundaries.

## Elevation & Depth

Visual depth is conveyed through a crisp, tactile combination of low-contrast borders and featherweight ambient shadows. Harsh dropshadows and glassmorphism blurs are strictly prohibited.

- **Level 0 (Flat / Canvas):** Applied to the workspace canvas (`#F8FAFC`). No border, no shadow.
- **Level 1 (Card & Product Surface):** Applied to product cards, table containers, and overview metrics. Styled with a solid 1px `#E2E8F0` border and a delicate ambient shadow: `box-shadow: 0 1px 3px 0 rgba(15, 23, 42, 0.04), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Dropdowns & Popovers):** Applied to search suggestion overlays, calendar pickers, and filter menus. Supported by a 1px `#E2E8F0` border and elevated via `box-shadow: 0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Modals & Checkout Sheets):** Applied to Payment Modals, Product Add/Edit Drawers, and Receipt Previews. Accompanied by a darkened slate backdrop (`rgba(15, 23, 42, 0.45)`) and lifted using `box-shadow: 0 20px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)`.

## Shapes

The design system implements a strict, predictable border-radius geometry that establishes tactile clarity across different component scales:

- **Inputs, Buttons, and Search Bars:** `8px` (`rounded-md`). Balances sharp modern discipline with sufficient softness for rapid touch targeting on POS displays.
- **Cards, Cart Summaries, and Metric Panels:** `12px` (`rounded-lg`). Groups modular content chunks distinctly from the canvas.
- **Modals, Dialogs, and Confirmation Overlays:** `16px` (`rounded-xl`). Creates prominent visual separation for mission-critical transactional confirmations.
- **Status Badges and Metric Pills:** Fully rounded (`9999px` / `rounded-full`) to contrast immediately against structural cards and input fields.

## Components

### Buttons
- **Primary:** Background `#2563EB`, text `#FFFFFF`, border-radius `8px`, height `40px` (desktop) or `48px` (touch POS). Hover state `#1D4ED8`. Active state `#1E40AF`. Used exclusively for key forward steps: "Bayar", "Simpan Produk", "Konfirmasi Pembayaran".
- **Secondary:** Background `#FFFFFF`, text `#0F172A`, border `1px solid #E2E8F0`. Hover state `#F8FAFC`. Used for "Cetak Struk", "Edit", and secondary filters.
- **Danger:** Background `#DC2626`, text `#FFFFFF`. Hover state `#B91C1C`. Reserved for destructive actions ("Hapus Produk", "Batalkan").
- **Quantity Steppers (`-` / `+`):** Compact square buttons (`32px x 32px`), neutral surface `#EFF6FF` for plus, `#F1F5F9` for minus, high touch target hit areas.

### Input Fields & Search
- **Standard Inputs:** Height `40px`, border `1px solid #E2E8F0`, corner radius `8px`, padding `0 12px`, background `#FFFFFF`. Typography `body-regular`.
- **Focus State:** 1px solid `#2563EB` with an external focus ring: `box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15)`.
- **Search Bar (POS / Products):** Prefixed with an explicit magnifying glass or barcode scanner icon in `#94A3B8`. Includes rapid-clear (`x`) icon when active.

### Product Card
- **Structure:** Surface `#FFFFFF`, border `1px solid #E2E8F0`, radius `12px`, padding `12px`.
- **Content Flow:** Fixed aspect ratio image (or clean muted placeholder with category icon), product name in `title-card`, price prominently styled in bold `16px` `#0F172A`, stock badge anchored at footer.
- **Behavior:** Whole card acts as an immediate tap target to increment cart quantity with micro-scale active press animation (`transform: scale(0.98)`).

### Cart & Cart Items
- **Container:** Padded `16px`, pinned header and sticky footer containing the subtotal, discounts, grand total in `display-currency`, and full-width "Bayar" CTA.
- **Cart Item Row:** Separated by `1px solid #F1F5F9`. Displays item name, unit pricing, quantity stepper (`[-] QTY [+]`), and total line-item sum. Trash icon in `#94A3B8` (hover `#DC2626`) for quick removal.

### Stock Badges
- **Normal (`> 5`):** Background `#DCFCE7`, text `#16A34A`, text `caption-medium`, label: `Stok: X`.
- **Low Stock (`1 - 5`):** Background `#FEF3C7`, text `#D97706`, label: `Stok Rendah (X)`.
- **Out of Stock (`0`):** Background `#FEE2E2`, text `#DC2626`, label: `Habis`. Disables checkout selection.

### Payment Modal & Calculator
- **Layout:** Centered modal, radius `16px`, backdrop dimming.
- **Tender Options:** Segmented selector cards for "Cash", "Transfer", and "QRIS".
- **Cash Input:** Large monetary input with preset quick-tender chips (`Uang Pas`, `+Rp10.000`, `+Rp50.000`, `+Rp100.000`). Immediate reactive calculation of "Kembalian" rendered in high-contrast emerald text.

### Thermal Receipt Preview
- Fixed width standard (80mm / 384px rendering container), monospaced tabular alignment, clean dashed rules, high contrast `#000000` text on pure `#FFFFFF` sheet, accompanied by a single primary "Cetak Struk" action.