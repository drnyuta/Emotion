# Project Scope

## In Scope ✅

| Feature                       | Description                                                                                                                          | Priority |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ | -------- |
| User Authentication           | Registration, login, logout, password reset, account deletion with JWT-based security                                                | Must     |
| Daily Journal Entries         | Text-based journaling with date selection, emotion tagging, and entry management (create, view, edit, delete)                        | Must     |
| Emotion Selection System      | Hierarchical emotion picker with 6 core categories and sub-emotions based on emotion wheel psychology                                | Must     |
| AI Emotion Analysis           | Integration with external AI API to detect emotions in journal text and compare with user-selected emotions                          | Must     |
| Daily AI Reports              | Automated generation of daily analysis including detected emotions, triggers, insights, and recommendations                          | Must     |
| Weekly AI Reports             | Comprehensive weekly summaries analyzing emotional patterns, recurring triggers, dominant emotions, and personalized recommendations | Should   |
| Emotion Wheel (Educational)   | Interactive visual guide to 6 core emotions with sub-emotions, definitions, typical triggers, and self-regulation tips               | Should   |
| Analytics Dashboard           | Visual emotion statistics with charts showing distribution, predominant emotions, and date filtering (day/week/month)                | Must     |
| Question of the Day           | Curated list of reflective prompts to inspire journaling when users face blank page syndrome                                         | Could    |
| Insights Library              | Personal collection where users save meaningful AI-generated insights for future reference                                           | Could    |
| Gamification ("Spark" Streak) | Daily journaling streak tracker with visual indicator to encourage habit formation                                                   | Could    |
| AI Chat for Emotional Support | Real-time conversational AI assistant for empathetic emotional support and guidance                                                  | Should   |
| Calendar View                 | Visual calendar interface showing dates with entries for easy navigation and overview                                                | Must     |
| Responsive Design             | Adaptive interface optimized for desktop, tablet, and mobile devices                                                                 | Must     |
| Data Privacy Controls         | User data ownership with ability to view, export, and permanently delete all personal information                                    | Must     |

## Out of Scope ❌

| Feature                            | Reason                                                                               | When Possible                     |
| ---------------------------------- | ------------------------------------------------------------------------------------ | --------------------------------- |
| Monthly AI Reports                 | Excessive scope for MVP; weekly reports provide sufficient insight                   | Phase 2 - Post-MVP                |
| Dynamic AI-Generated Questions     | Complex AI implementation; static curated list sufficient for MVP                    | Phase 2 - Post-MVP                |
| Voice Input / Speech-to-Text       | Requires additional complexity; text input covers core use case                      | Future enhancement                |
| Image Upload for Entries           | Unnecessary for emotion tracking MVP; text-based journaling is core focus            | Future enhancement                |
| Integration with External Services | Adds complexity and dependencies (therapy platforms, health trackers, calendar apps) | Phase 2 - Partnership phase       |
| Email Notifications / Reminders    | Requires email service setup; in-app experience is priority for MVP                  | Phase 2 - Engagement features     |
| Payment / Monetization Features    | MVP is free for testing; commercial features deferred                                | Phase 3 - Commercial launch       |
| Social Sharing / Community         | Privacy-first approach; keeps journaling completely private                          | Never (conflicts with privacy)    |
| Multi-language Support             | Resource-intensive; English sufficient for academic demonstration                    | Phase 3 - International expansion |
| Mobile Native Apps (iOS/Android)   | Web-first approach with responsive design; native apps require different skillset    | Phase 3 - Mobile strategy         |
| Advanced Data Visualizations       | Basic charts sufficient for MVP; complex analytics require more development time     | Phase 2 - Advanced features       |
| Custom Emotion Categories          | Predefined emotion hierarchy based on psychology research is sufficient              | Phase 3 - Personalization         |
| Therapist/Coach Portal             | Out of scope for self-reflection tool; would change product direction                | Future consideration              |

## Assumptions

| #   | Assumption                                                                                               | Impact if Wrong                                                                       | Probability                            |
| --- | -------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------- | -------------------------------------- |
| 1   | External AI API (Claude/OpenAI) will remain available and affordable throughout development and testing  | Would need to switch providers or implement fallback mechanisms; could delay timeline | Low - established providers            |
| 2   | Test users will have modern browsers (Chrome 90+, Firefox 88+, Safari 14+) and stable internet           | Poor user experience, compatibility issues, negative feedback                         | Low - target demographic tech-savvy    |
| 3   | 5-8 test users will be sufficient to validate core functionality and UX design                           | May miss critical usability issues or edge cases that emerge at scale                 | Medium - limited by academic scope     |
| 4   | Users will journal primarily in English                                                                  | Need multi-language support, internationalization complexity                          | Low - academic project scope           |
| 5   | PostgreSQL database will handle expected load (30-50 users, ~200-300 entries) without performance issues | Database optimization required, potential slowdowns                                   | Very Low - well within capacity        |
| 6   | Single developer can complete full-stack development, design, and testing within academic timeline       | Project delays, scope reduction, quality compromises                                  | Medium - time constraint exists        |
| 7   | Free tier of AI API provides sufficient quota for testing phase                                          | Need paid plan or usage restrictions                                                  | Medium - depends on test user activity |

## Constraints

Limitations that affect the project:

| Constraint Type | Description                                                                                     | Mitigation                                                                                                                                        |
| --------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Time**        | Academic deadline limits development to ~3-4 months; fixed submission date with no extensions   | Prioritize core Must-Have features; use iterative development with weekly milestones; maintain feature flexibility for scope cuts if needed       |
| **Budget**      | Zero external funding; limited to free tiers of services and tools                              | Use free/educational tiers: AI API free quota, free PostgreSQL hosting, open-source libraries; leverage student GitHub benefits                   |
| **Technology**  | Must use technologies within developer's skillset to avoid learning curve delays                | Stick to React, TypeScript, Node.js, PostgreSQL stack (familiar technologies); avoid experimental frameworks                                      |
| **Resources**   | Single developer acting as full-stack engineer, UX designer, QA tester, and product manager     | Reduce scope to achievable MVP; use pre-built UI libraries (Tailwind, shadcn/ui); automate testing where possible; focus on quality over quantity |
| **External**    | Dependent on external AI API availability, rate limits, and response quality                    | Implement error handling and fallback messages; cache results; monitor API usage; have backup provider identified                                 |
| **Testing**     | Limited test user pool (5-8 people) due to academic context; no professional QA team            | Conduct structured usability testing; create detailed test scenarios; gather qualitative feedback; use automated testing for technical validation |
| **Compliance**  | Must follow GDPR principles and accessibility standards (WCAG 2.1) without enterprise resources | Implement basic privacy controls (data export, account deletion); follow WCAG checklist; document compliance approach for evaluation              |

## Dependencies

| Dependency                   | Type      | Owner                  | Status       |
| ---------------------------- | --------- | ---------------------- | ------------ |
| External AI API              | External  | Google                 | ✅ Active    |
| PostgreSQL Database          | Technical | PostgreSQL Community   | ✅ Stable    |
| Docker & Docker Compose      | Technical | Docker Inc.            | ✅ Stable    |
| React & TypeScript           | Technical | Meta / Microsoft       | ✅ Stable    |
| Node.js & Express            | Technical | OpenJS Foundation      | ✅ Stable    |
| Academic Supervisor Feedback | Internal  | Yahor Bialiauski       | ✅ Available |
| Test Users for Validation    | External  | Recruited participants | ✅ Available |
| Figma Design Access          | External  | Figma (free tier)      | ✅ Available |
