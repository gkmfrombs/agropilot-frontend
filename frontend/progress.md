# AgroPilot Frontend — Progress Notes

## Project
- **Stack**: React 19 + TypeScript + Vite + React Router v7
- **No Tailwind** — all inline styles
- **Fonts**: Fraunces (serif headings) + Plus Jakarta Sans (body)
- **Dev server**: `cd agropilot-frontend/frontend && npm run dev` → `http://localhost:5173`

## Design System (CSS vars in `src/index.css`)
```
--bg: #F5F1E8          (parchment)
--surface: #FFFFFF
--surface-warm: #FAF6EC
--ink: #1A1A17
--ink-soft: #6B6A5F
--primary: #2E4A3A     (forest green)
--primary-soft: #C8D5BB
--accent: #C9974A      (amber)
--danger: #B85C3C
--warning: #D4A347
--border: #E5DCC9
```
Body background: `#2c3a22` (dark green — desktop frame surround)  
Manager dashboard: dark theme `#0F1A14` bg, `#E8E2D4` text

## App Structure
- **Rep app** (field reps): wrapped in `IOSDevice` frame (390×844), routes at `/`
- **Manager app**: full-screen dashboard, routes at `/manager/*`
- Auth via `AuthContext` — roles: `rep` | `manager`
- Login screen lets you pick role before entering

### Rep App Routes
| Path | Screen |
|------|--------|
| `/` | MorningBriefing (dashboard) |
| `/chat` | AIConsultant (chatbot) |
| `/route` | RoutePlanning |
| `/alerts` | AlertsFeed |
| `/me` | RepProfile |
| `/alert` | PredictiveAlert |
| `/farmer/:id` | FarmerProfile |
| `/retailer/:id` | RetailerProfile |
| `/visit` | VisitCopilot |
| `/log-visit` | LogVisit |
| `/scanner` | CropScanner |
| `/calculator` | YieldCalculator |

### Manager Routes (under `/manager/*`)
| Path | Screen |
|------|--------|
| `/manager` | TerritoryHeatmap |
| `/manager/kpi` | KPIDashboard |
| `/manager/reps` | RepPerformance |
| `/manager/alerts` | AlertManagement |
| `/manager/campaigns` | CampaignPerformance |

## Shared Components (`src/components/Shared.tsx`)
- `TopStrip` — sticky top bar (offline badge + bell icon)
- `BottomNav` — sticky bottom nav (5 tabs: Home/Route/Chat/Alerts/Profile)
- `VoiceFAB` — floating mic button (links to `/chat`)
- `ScreenShell` — wrapper with parchment bg + grain texture
- `PulseDot` — animated pulsing circle (used for live status)
- `Eyebrow` — small uppercase label component
- `WheatStalk` — decorative SVG wheat illustration
- All icons are inline SVG (Lucide-style, strokeWidth 1.5)

## Animations (defined in `src/index.css`)
- `fade-up` — elements slide up on mount (620ms cubic-bezier)
- `slide-in-l` — slide from left (chat messages)
- `ken-burns` — slow zoom on hero images (12s)
- `pulse-ring` — expanding ring for PulseDot
- `fab-ring` / `fab-breathe` — FAB button animations
- `caret-blink` — text cursor blink

---

## Changes Made This Session

### 1. FarmerProfile — Profile Pic Bug Fixed
**File**: `src/screens/FarmerProfile.tsx` line 15  
**Bug**: `background: \`center/cover url(...)\`` — wrong CSS shorthand order, image didn't render  
**Fix**: Split into `backgroundImage`, `backgroundSize: 'cover'`, `backgroundPosition: 'center'`, `backgroundRepeat: 'no-repeat'`

### 2. All Emojis/Unicode Removed (Professional cleanup)
Replaced across 8 files with proper SVG icons:

| File | Removed | Replaced with |
|------|---------|---------------|
| `AIConsultant.tsx` | `●` bullet | `PulseDot` component |
| `CampaignPerformance.tsx` | `●` / `⚠` | colored dot span + alert triangle SVG |
| `AlertsFeed.tsx` | `📦📈🔥🌧️⚔️📱` icons | type-mapped SVG icon containers (styled to severity color) |
| `AlertManagement.tsx` | `📦📈⚔️🌧️🔥` + `🚨 ESCALATED` + `✓ RESOLVED` | SVG icon containers + inline SVG badges |
| `Login.tsx` | `🌾` (rep) + `📊` (manager) | WheatStalk SVG + bar chart SVG |
| `LogVisit.tsx` | `✓` checkmark | ICheck inline SVG (button now `display: flex`) |
| `RoutePlanning.tsx` | `🏪 Retailers` / `🌾 Farmers` | plain text |
| `KPIDashboard.tsx` | `⚠ Gap detected` | alert triangle SVG + span |
| `RepPerformance.tsx` | `⚠ AI-Flagged Issues` | alert triangle SVG + span |
| `TerritoryHeatmap.tsx` | `📦` stockout / `⚔️` competitor | box SVG + shield SVG |

### 3. Scarecrow Chatbot Avatar
**File**: `src/screens/AIConsultant.tsx`  
Added `ScarecrowAvatar` SVG component — flat 2-color cartoon:
- Straw hat (brown `#7A5230`) with amber band (`#C9974A`)
- Parchment face (`#F5C88A`) with X-stitch eyes + curved smile
- Forest green shirt (`#2E4A3A`) with patch
- Straw lines poking from hat and sleeves
- Amber cheek blush circles

Used in:
- Chat header (40×40 rounded square, replaces "A" circle)
- Per-message AI avatar (28×28, replaces "A" circle)

### 4. Manager Layout — Mobile Responsive
**File**: `src/screens/manager/ManagerLayout.tsx`  
**Problem**: Sidebar (260px wide) not responsive — sign-out button hidden on mobile  
**Fix**: Added `isMobile` state (same pattern as IOSFrame). On `≤768px`:
- Sidebar hidden
- Top bar: brand name + "Sign Out" button (always visible, top-right)
- Bottom tab nav: 5 icon tabs with amber active indicator + truncated labels
- Desktop: unchanged (full sidebar)

### 5. AIConsultant Chat Layout Fix
**File**: `src/screens/AIConsultant.tsx`  
**Problem**: Input box scrolled away with messages — not fixed to bottom  
**Root cause**: `height: '100%'` inside IOSDevice scroll container resolves to content height, not viewport height  
**Fix**:
- Outer wrapper: `position: absolute; inset: 0` (fills IOSDevice viewport exactly)
- Header: added `flexShrink: 0`
- Input bar: added `flexShrink: 0` + `padding-bottom: env(safe-area-inset-bottom, 20px)` for iOS notch

Result: header locked top, input locked bottom, messages (`flex: 1, overflowY: auto`) scrolls independently.

---

## Known Issues / Not Yet Done
- FarmerProfile CropCalendar timeline — dot positions may be slightly off (magic number `left: -21` in visit log)
- No real backend connected — all data is hardcoded mock data
- VoiceFAB mic button has no actual voice functionality
- TopStrip shows hardcoded "3 actions queued" and "Offline" — not dynamic
