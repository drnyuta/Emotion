# Criterion: Refined UX

## Architecture Decision Record

### Status

**Status:** Accepted  
**Date:** 2026-01-05

### Context

The Emotion Diary application targets young adults seeking emotional self-reflection and mental well-being support.  
User research revealed several UX challenges common in existing journaling apps:

- Poor onboarding and early paywalls reduce trust
- Overly complex interfaces discourage daily use
- Lack of guidance causes anxiety when facing a blank journal
- Emotion tracking is often too simplistic or unclear
- Accessibility and emotional comfort are frequently overlooked

The system must balance emotional sensitivity, simplicity, and analytical depth while supporting both beginner and advanced users.  
Constraints include limited MVP scope, mobile-first usage, and the need for WCAG 2.1 AA compliance.

### Decision

A **refined, user-centered UX architecture** was chosen, based on:

- Clear information architecture with shallow navigation depth
- Guided journaling through prompts, emotion wheel, and AI assistance
- Consistent layouts and naming across all screens
- Calm, distraction-free visual design
- Explicit empty states and system feedback
- Accessibility-first design aligned with WCAG 2.1

The UX is designed to feel supportive and predictable, reducing cognitive load while encouraging emotional honesty and habit formation.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| Feature-heavy dashboard | Powerful, data-rich | Overwhelming, high cognitive load | Conflicts with simplicity and emotional safety |
| Minimal text-only journaling | Very simple, fast | No guidance, low emotional literacy support | Not suitable for beginner users |
| Gamification-first UX | High engagement potential | Can feel pressuring or judgmental | Emotional reflection should remain gentle |

### Consequences

**Positive:**
- Lower barrier to entry for new users
- Increased trust through transparency and predictability
- Supports both guided and free-form journaling
- Encourages long-term habit formation
- Accessible and inclusive experience

**Negative:**
- More design and implementation effort
- Requires careful consistency across features
- Some advanced customization postponed beyond MVP

**Neutral:**
- UX prioritizes emotional comfort over maximum feature density

## Implementation Details

### Key Implementation Decisions

| Decision | Rationale |
|--------|-----------|
| Sidebar-based navigation | Predictable, low cognitive load |
| Guided empty states | Reduce anxiety and encourage action |
| Emotion Wheel | Improves emotional literacy |
| Tabs instead of deep routes | Faster mental mapping |
| Autosave for journaling | Prevents emotional frustration |

## Requirements Checklist

| # | Requirement | Status | Evidence / Notes |
|---|-------------|--------|------------------|
| 1 | Clear navigation structure | ✅ | Sidebar navigation with logical sections and tabs |
| 2 | Guided user flows | ✅ | Question of the Day, Emotion Wheel, AI Reports |
| 3 | Accessibility (WCAG 2.1 AA) | ⚠️ | Accessibility checklist implemented (contrast, keyboard navigation, semantic HTML) |
| 4 | Emotional comfort & clarity | ✅ | Calm color palette, consistent UI patterns, non-intrusive feedback |
| 5 | Mobile-first usability | ⚠️ | Fully responsive layout, minor spacing and gesture refinements planned |
| 6 | Personalization | ⚠️ | Limited in MVP (fixed emotions, default layouts) |
| 7 | Clear error messages | ✅ | All errors are handled gracefully and displayed as clear, user-friendly messages|

**Legend:**
- ✅ Fully implemented  
- ⚠️ Partially implemented  
- ❌ Not implemented

## Known Limitations

| Limitation | Impact | Potential Solution |
|-----------|--------|-------------------|
| Limited personalization | Reduced sense of ownership and long-term engagement | Add user settings, preferences, and customizable UI |
| No offline support | Users cannot journal without an internet connection | Implement local storage with background sync |
| Fixed emotion set | Less emotional nuance for some users | Allow custom emotion tags or user-defined emotions |

## References

- [Ux Design Specification](https://drive.google.com/drive/folders/1RMGFrAhLpTO3F8-BLM-xrxHNZjWjPXUS?dmr=1&ec=wgc-drive-hero-goto)