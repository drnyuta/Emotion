# Criterion: Adaptive UI

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2025-01-05

### Context

The Emotion Diary application targets users across multiple devices (desktop, tablet, mobile) with varying screen sizes and interaction patterns. Users need to journal on-the-go (mobile), during focused work sessions (desktop), or in relaxed settings (tablet). The UI must adapt seamlessly to each context while maintaining visual consistency, usability, and accessibility. A single, rigid design would compromise user experience on smaller screens or fail to leverage larger displays effectively.

### Decision

Implement a **responsive design** using **SCSS breakpoints** (480px, 980px), **Figma design system** with device-specific layouts, and **reusable components** with adaptive behavior. The design uses three distinct breakpoints (mobile ≤480px, tablet 481-980px, desktop >980px) with components that automatically adjust layout, spacing, and interaction patterns based on screen size.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| Separate mobile app (React Native) | Native performance, platform-specific UX | Requires separate codebase, double maintenance, slower development | Limited development resources, web-first approach more feasible for MVP |
| Desktop-only design | Simpler development, no responsive complexity | Excludes mobile users (40%+ of target audience), poor accessibility | Target users journal on-the-go, mobile support essential |

### Consequences

**Positive:**
- **Cross-Device Accessibility:** Users can journal on any device without feature limitations
- **Consistent Experience:** Design system ensures visual coherence across breakpoints
- **Component Reusability:** Single codebase supports all screen sizes with conditional rendering
- **Future-Proof:** Easy to add new breakpoints (e.g., large desktop, foldable devices)
- **Design-Dev Alignment:** Figma components mirror React components for seamless handoff

**Negative:**
- **Increased Complexity:** More test cases (3 breakpoints × multiple components)
- **Design Time:** Requires designing 3 versions of every screen in Figma
- **Edge Cases:** Unusual screen sizes (foldables, ultrawide) may need special handling

**Neutral:**
- CSS complexity higher than single-layout design but manageable with SCSS mixins
- Some features better suited to specific devices (e.g., analytics charts on desktop)

## Implementation Details

### Design System Structure

```
Figma/
├── Design System/
│   ├── Colors/                    # Brand colors, semantic colors, states
│   ├── Typography/                # Font families, sizes, weights
│   ├── Icons/                     # Custom SVG icons + Ant Design icons
│   ├── Components/                # Reusable UI elements
│   │   ├── Buttons
│   │   ├── Input Fields (Text, Textarea, Date)
│   │   ├── Cards (Entry, Report, Insight)
│   │   ├── Modals
│   │   ├── Navigation (Sidebar, Header)
│   │   └── Emotion Selector
│
├── Layouts/
│   ├── Desktop (>980px)/
│   │   ├── Sidebar: 280px full width
│   ├── Tablet (481-980px)/
│   │   ├── Sidebar: 80px icons-only
│   └── Mobile (≤480px)/
│       ├── Hidden sidebar (burger menu)
```

### Key Implementation Decisions

| Decision | Rationale |
|----------|-----------|
| **Three Breakpoints Only** | Balances flexibility with maintainability; covers 95%+ of devices |
| **Figma Component Library** | Ensures design-dev consistency; components designed once, reused across breakpoints |
| **SCSS Mixins for Breakpoints** | DRY principle; centralized breakpoint logic easy to update |
| **Icon-Only Sidebar on Tablet** | Saves horizontal space while maintaining quick navigation access |
| **Conditional Rendering** | Hide/show features based on screen size (e.g., collapse emotion details on mobile) |

## Requirements Checklist

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | Three distinct breakpoints (mobile, tablet, desktop) | ✅ | SCSS mixins at 480px, 980px |
| 2 | Consistent design system across breakpoints | ✅ | Figma design system with colors, typography, components |
| 3 | Component library with reusable elements | ✅ | Custom components + Ant Design components |
| 4 | Touch-friendly targets on mobile (≥44px) | ✅ | Buttons, inputs meet touch target minimum |
| 5 | Adaptive layouts (stacked on mobile, multi-column on desktop) | ✅ | Entry form, analytics, emotion selector adapt |
| 6 | Icon library for visual consistency | ✅ | Custom SVG icons + Ant Design icons |
| 7 | Tested across devices | ⚠️ | Chrome DevTools, physical devices (iPhone, iPad, laptop) |

**Legend:**
- ✅ Fully implemented
- ⚠️ Partially implemented
- ❌ Not implemented

## Known Limitations

| Limitation | Impact | Potential Solution |
|------------|--------|-------------------|
| No support for extreme screen sizes (<320px, >2560px) | Layout may break on very small or ultra-wide displays | Add additional breakpoints; test on edge-case devices |
| Charts may lose readability on mobile | Data-dense charts hard to read on <400px screens | Implement horizontal scrolling for charts; simplify data visualization |

## References

- [Figma Design System](https://www.figma.com/design/xgrs1dQC3LwKxozlFfmQ17/Emotion)