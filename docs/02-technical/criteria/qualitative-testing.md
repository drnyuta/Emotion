# Criterion: Qualitative Testing

## Architecture Decision Record

### Status

**Status:** Accepted

**Date:** 2025-01-05

### Context

The Emotion Diary MVP requires validation that core features work correctly, the user interface is intuitive, and the experience feels supportive rather than frustrating. Given the emotional context of the application, usability issues could directly discourage users from journaling. Quantitative testing validates code correctness but cannot assess subjective factors like clarity, emotional comfort, or workflow efficiency. The project needed a structured approach to evaluate UX consistency, functional correctness, edge cases, and user satisfaction with limited resources (solo developer, 4-week timeline, 4 test participants).

### Decision

Implement **structured qualitative testing** using three complementary methodologies: (1) **Heuristic Evaluation** based on Nielsen's 10 usability heuristics to assess design quality, (2) **Scenario-Based Testing** to validate functional requirements and edge cases with predefined test cases, and (3) **Structured Exploratory Testing** with session charters to uncover unexpected issues. Testing focused on Journal and AI modules (MVP scope) with 4 participants across 4 sessions totaling ~90 minutes, documenting findings with screenshots, severity ratings, and before/after comparisons.

### Alternatives Considered

| Alternative | Pros | Cons | Why Not Chosen |
|-------------|------|------|----------------|
| Automated UI testing | Repeatable, fast execution, regression coverage | Can't evaluate subjective UX, no emotional context | Qualitative insights more valuable for UX-focused app |
| User surveys only | Scalable, quantitative data | Shallow insights, can't observe actual behavior, no issue diagnosis | Need to observe users struggling with real tasks |
| Unstructured manual testing | Flexible, no preparation | Inconsistent coverage; hard to reproduce bugs; subjective | Structured approach ensures comprehensive coverage |

### Consequences

**Positive:**
- **Actionable Findings:** 5 UX issues and 1 functional bug identified with clear reproduction steps
- **Evidence-Based Improvements:** Before/after screenshots document impact of fixes
- **Efficient Resource Use:** 4 participants in 4 sessions covered core functionality thoroughly
- **Heuristic Violations Caught:** Nielsen's heuristics revealed consistency, visibility, and error prevention issues
- **Edge Case Coverage:** Scenario-based tests validated AI crisis detection, validation, empty states
- **Documentation Quality:** Structured findings easily communicated to stakeholders

**Negative:**
- **Limited Sample Size:** 4 participants may not represent full user diversity
- **Time-Intensive:** Manual test execution and documentation took 2 weeks
- **No Quantitative Metrics:** Can't measure task completion time, error rates, satisfaction scores

**Neutral:**
- Some features untested (Gamification, Insights, Questions, Emotion Wheel, Analytics) due to MVP scope
- Findings subjective to evaluators' expertise (frontend dev, UX specialist, informatics students)

## Implementation Details

### Testing Methodology

```
Testing Framework/
├── 1. Heuristic Evaluation/
│   ├── Nielsen's 10 Usability Heuristics
│   ├── Screen-by-screen review
│   ├── Severity rating (Critical, High, Medium, Low)
│   └── Focus areas:
│       ├── Visual consistency
│       ├── Action hierarchy
│       ├── Error prevention
│       └── Mobile usability
│
├── 2. Scenario-Based Testing/
│   ├── Predefined test cases
│   ├── Preconditions + Steps + Expected Result
│   ├── Observed Result + Screenshots
│   ├── Severity: Critical/High/Medium/Low
│   └── Coverage:
│       ├── Journal: Create, Edit, Delete, Calendar
│       ├── AI: Chat, Daily Report, Weekly Report
│       └── Edge cases: Validation, empty states, crisis content
│
└── 3. Structured Exploratory Testing/
    ├── Session charter (module, duration, participants)
    ├── Findings with timestamps
    ├── Severity assessment
    └── Evidence: Screenshots, annotations
```

### Test Scope

**In Scope:**
- Journal module (create, edit, delete, calendar view)
- AI module (chat, daily/weekly reports)
- UX consistency for all screens (Figma vs MVP)
- Input validation and error handling
- Empty states and error messages
- Mobile/tablet/desktop responsiveness

**Out of Scope:**
- Technical functionality of the following:
  - Gamification (streaks)
  - Insights Library
  - Question of the Day
  - Emotion Wheel
  - Analytics dashboard

### Test Environment

| Attribute | Details |
|-----------|---------|
| **Platform** | Web application (desktop & mobile responsive) |
| **OS/Browser** | Windows 10 / Chrome 118 |
| **Backend** | Node.js 20, PostgreSQL 16, Docker |
| **AI Service** | Google Gemini 2.5 Flash |
| **Tools** | Postman (API testing), Figma (design reference), Chrome DevTools |

### Participants and Roles

| Participant | Role | Contribution |
|-------------|------|--------------|
| Frontend Developer (experienced) | Heuristic evaluator | General feedback, technical UX assessment |
| UX Specialist (experienced) | Heuristic evaluator | Design consistency, usability patterns |
| Informatics Student (Backend focus) | Scenario executor | Functional testing, general feedback |
| Informatics Student | Scenario executor | Functional testing, general feedback |

**Total:** 4 participants

### Testing Schedule

| Date | Module | Participants | Duration |
|------|--------|--------------|----------|
| Nov 27, 2025 | UI/UX Design | Frontend Developer | 22 min |
| Dec 11, 2025 | UI/UX Design | UX Specialist | 17 min |
| Dec 17, 2025 | AI Chat, Journal, UI/UX | Informatics Student (Backend) | 31 min |
| Dec 17, 2025 | AI Chat, Journal, UI/UX | Informatics Student | 20 min |

**Total Duration:** ~90 minutes across 4 sessions

### Key Test Cases Summary

#### Journal Module (7 test cases)

| Test Case | Priority | Status | Severity |
|-----------|----------|--------|----------|
| Create entry (text ≥3 chars, ≥1 emotion) | Must | ✅ Pass | High |
| Create entry (text <3 chars) | Must | ❌ **Fail** | High |
| Create entry (0 emotions) | Must | ✅ Pass | High |
| Create entry (all 48 emotions) | Should | ✅ Pass | Medium |
| Edit entry (modify text & emotions) | Must | ✅ Pass | High |
| Delete entry (with confirmation) | Must | ✅ Pass | High |
| Calendar view (dates with entries) | Should | ✅ Pass | Medium |

#### AI Chat Module (4 test cases)

| Test Case | Priority | Status | Severity |
|-----------|----------|--------|----------|
| Send valid message | Must | ✅ Pass | High |
| Send empty message | Must | ✅ Pass | High |
| Send gibberish | Must | ✅ Pass | High |
| Send crisis content | Critical | ✅ Pass | Critical |

#### AI Daily Report (3 test cases)

| Test Case | Priority | Status | Severity |
|-----------|----------|--------|----------|
| Generate report (valid entry) | Must | ✅ Pass | High |
| Generate report (crisis content) | Critical | ✅ Pass | Critical |
| Generate report (gibberish) | Must | ✅ Pass | Critical |

#### AI Weekly Report (2 test cases)

| Test Case | Priority | Status | Severity |
|-----------|----------|--------|----------|
| Generate report (≥3 entries) | Must | ✅ Pass | High |
| Generate report (<3 entries) | Should | ✅ Pass | Medium |

## Requirements Checklist

| # | Requirement | Status | Evidence/Notes |
|---|-------------|--------|----------------|
| 1 | Structured testing workflow defined | ✅ | Three methodologies: Heuristic, Scenario-Based, Exploratory |
| 2 | Test goals and objectives documented | ✅ | Evaluate core features, identify UX issues, verify edge cases |
| 3 | Test scope clearly defined (in/out of scope) | ✅ | Journal + AI in scope; Gamification, Insights, etc. out of scope |
| 4 | Entry/exit criteria established | ✅ | Entry: MVP deployed, auth working; Exit: All scenarios executed |
| 5 | Requirements analyzed per feature | ✅ | 6 features analyzed (Create/Edit/Delete Entry, Chat, Daily/Weekly Report) |
| 6 | Testing methods documented | ✅ | Heuristic evaluation, Scenario-based, Exploratory |
| 7 | Participants and roles defined | ✅ | 4 participants (Frontend Dev, UX Specialist, 2 Students) |
| 8 | Test cases detailed with evidence | ✅ | 16+ test cases with screenshots, severity, observed results |
| 9 | Findings documented with severity | ✅ | 5 UX issues + 1 functional bug with before/after screenshots |
| 10 | Technical report summary provided | ✅ | System tested, findings, conclusions, future work documented |

## Test Results Summary

### Functional Testing

| Module | Test Cases | Passed | Failed | Pass Rate |
|--------|-----------|--------|--------|-----------|
| Journal – Create Entry | 4 | 3 | 1 | 75% |
| Journal – Edit Entry | 3 | 3 | 0 | 100% |
| Journal – Delete Entry | 1 | 1 | 0 | 100% |
| Journal – Calendar View | 2 | 2 | 0 | 100% |
| AI Chat | 4 | 4 | 0 | 100% |
| AI Daily Report | 3 | 3 | 0 | 100% |
| AI Weekly Report | 2 | 2 | 0 | 100% |
| **Total** | **19** | **18** | **1** | **94.7%** |

### UX Testing

| Finding | Heuristic | Severity | Status |
|---------|-----------|----------|--------|
| UX-01: Action buttons inconsistent | H4, H5 | Medium | ✅ Fixed |
| UX-02: Delete button style mismatch | H4 | Low | ✅ Fixed |
| UX-03: Incomplete empty states | H1, H10 | Medium | ✅ Fixed |
| UX-04: Selected emotions hidden | H6, H8 | Medium | ✅ Fixed |
| UX-05: Emotions scroll off screen (mobile) | H6, H7 | High | ✅ Fixed |
| **Total UX Issues** | **5** | - | **100% Fixed** |

## Known Limitations

| Limitation | Impact | Potential Solution |
|------------|--------|-------------------|
| Small participant pool (4 users) | May miss edge cases, diverse user needs, uncommon workflows | Expand to 10-15 participants with varied demographics and tech experience |
| Limited time per session (17-31 min) | Rushed evaluation; may not explore all features deeply | Schedule 45-60 min sessions with breaks |
| No quantitative metrics | Can't measure task completion time, error rates, satisfaction scores | Add SUS (System Usability Scale) survey, task timing measurements |
| Features untested (Gamification, Insights, etc.) | Unknown UX quality for out-of-scope features | Schedule follow-up testing when features implemented |
| Postman used for AI testing | Real user flow (UI → API → UI) not fully validated | Implement end-to-end tests through UI for AI features |

## References

- [Qualitative testing report](https://drive.google.com/drive/folders/1RMGFrAhLpTO3F8-BLM-xrxHNZjWjPXUS?dmr=1&ec=wgc-drive-hero-goto)
- [Nielsen's 10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/)