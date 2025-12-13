-- Users
INSERT INTO users (name, email, password_hash, timezone, created_at, updated_at)
VALUES
('Alice Johnson', 'alice@example.com', 'hashed_password_1', 'Europe/London', NOW() - INTERVAL '14 days', NOW() - INTERVAL '14 days'),
('Bob Smith', 'bob@example.com', 'hashed_password_2', 'America/New_York', NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
('Charlie Brown', 'charlie@example.com', 'hashed_password_3', 'Asia/Tokyo', NOW(), NOW());


-- Emotion Categories
INSERT INTO emotion_categories (name)
VALUES
('Joy'),
('Sadness'),
('Anger'),
('Fear'),
('Peace'),
('Strength');


-- Questions
INSERT INTO questions (question_text)
VALUES
('What emotion was the strongest for you today?'),
('What is one thing you are proud of today?'),
('What challenged you the most today?'),
('What gave you energy today?'),
('What drained your energy today?'),
('How did your body feel throughout the day?'),
('What is one thing you wish went differently?'),
('What is one thing you are grateful for today?'),
('When did you feel the most like yourself?'),
('What moment made you pause or think?'),
('What is something you avoided today, and why?'),
('What helped you feel calm or grounded today?'),
('Did you learn anything about yourself today?'),
('What emotion surprised you today?'),
('Which interaction affected your mood the most?'),
('What thoughts repeated themselves today?'),
('What is one small win from today?'),
('How did you take care of yourself today?'),
('What is one decision you would like to make tomorrow?'),
('What emotion do you want to understand better?');


-- Emotions
INSERT INTO emotions (name, category_id, definition, triggers, recommendations)
VALUES
-- JOY
('Gratitude', 1,
 'A warm appreciation for people, experiences, or moments that feel meaningful.',
 '["Receiving help", "Noticing beauty", "Positive interactions", "Moments of reflection"]',
 '["Pause to acknowledge the feeling", "Express thanks", "Create a habit of noticing positive moments"]'
),
('Contentment', 1,
 'A calm, steady sense of satisfaction and enoughness.',
 '["Slow mornings", "Routines", "Finishing tasks", "Peaceful environments"]',
 '["Maintain routines", "Minimize overstimulation", "Take mindful pauses"]'
),
('Pride', 1,
 'Feeling accomplished or recognized for achievements.',
 '["Completing projects", "Receiving praise", "Personal milestones"]',
 '["Celebrate achievements", "Reflect on progress", "Share success with others"]'
),
('Amusement', 1,
 'Enjoyment, humor, laughter, and light-heartedness.',
 '["Funny events", "Playful moments", "Social interactions"]',
 '["Allow yourself to laugh", "Share humor", "Take playful breaks"]'
),
('Excitement', 1,
 'Anticipation of positive events and energetic feelings.',
 '["Upcoming events", "Surprises", "Achievements"]',
 '["Channel energy productively", "Savor anticipation", "Plan constructive actions"]'
),
('Love', 1,
 'Warmth, care, and attachment toward others.',
 '["Connection with loved ones", "Empathy", "Positive interactions"]',
 '["Express affection", "Nurture relationships", "Engage in caring actions"]'
),
('Optimism', 1,
 'Hopeful expectation about the future.',
 '["Seeing opportunities", "Positive outcomes", "Encouragement from others"]',
 '["Focus on possibilities", "Visualize success", "Reframe challenges positively"]'
),
('Relief', 1,
 'Release of tension and a sense of ease after stress.',
 '["Completing tasks", "Resolving uncertainty", "Overcoming obstacles"]',
 '["Acknowledge relief", "Pause to enjoy it", "Note effective strategies for next time"]'
),

-- SADNESS
('Loneliness', 2,
 'A sense of emotional distance or lack of meaningful connection.',
 '["Lack of communication", "Changes in relationships", "Isolation"]',
 '["Reach out to someone", "Write about the feeling", "Allow it without judgment"]'
),
('Disappointment', 2,
 'The feeling of unmet expectations or hopes.',
 '["Plans falling through", "Unmet goals", "Others’ behavior"]',
 '["Reevaluate expectations", "Practice self-compassion", "Break goals into smaller steps"]'
),
('Sadness', 2,
 'General low mood or feeling down.',
 '["Loss", "Setbacks", "Gloomy environments"]',
 '["Acknowledge emotions", "Express them in writing", "Engage in comforting activities"]'
),
('Regret', 2,
 'Wishing things had gone differently.',
 '["Past decisions", "Missed opportunities", "Mistakes"]',
 '["Reflect without harsh self-criticism", "Identify lessons", "Plan corrective steps"]'
),
('Hopelessness', 2,
 'Feeling unable to influence outcomes.',
 '["Repeated failures", "Overwhelming challenges", "Lack of support"]',
 '["Focus on small achievable steps", "Seek support", "Maintain perspective"]'
),
('Guilt', 2,
 'Self-blame for actions or inactions.',
 '["Perceived failures", "Harming others", "Not meeting expectations"]',
 '["Acknowledge responsibility", "Make amends if possible", "Practice self-forgiveness"]'
),
('Nostalgia', 2,
 'Longing for the past or positive memories.',
 '["Reminders", "Old photos", "Conversations about past experiences"]',
 '["Enjoy memories", "Share stories", "Balance past with present engagement"]'
),
('Grief', 2,
 'Sorrow related to loss.',
 '["Death", "Separation", "Missed opportunities"]',
 '["Allow grieving", "Express emotions safely", "Seek support if needed"]'
),

-- ANGER
('Irritation', 3,
 'A mild form of anger caused by interruptions or unmet expectations.',
 '["Delays", "Noise", "Unexpected tasks", "Chaos"]',
 '["Take deep breaths", "Step away briefly", "Identify the smallest trigger"]'
),
('Frustration', 3,
 'Feeling blocked from achieving goals.',
 '["Obstacles", "Repeated failures", "Slow progress"]',
 '["Break tasks into smaller steps", "Adjust expectations", "Use stress relief techniques"]'
),
('Resentment', 3,
 'Lingering frustration or unfairness toward someone or something.',
 '["Unresolved conflicts", "Unmet needs", "Feeling unheard"]',
 '["Acknowledge needs", "Communicate boundaries", "Reflect before reacting"]'
),
('Jealousy', 3,
 'Envy and perceived unfairness toward others.',
 '["Comparisons", "Competition", "Attention imbalances"]',
 '["Focus on self-growth", "Appreciate own strengths", "Avoid harmful comparisons"]'
),
('Rage', 3,
 'Intense anger that can overwhelm.',
 '["Severe injustice", "Violation of values", "High provocation"]',
 '["Step away", "Practice grounding", "Channel energy into constructive action"]'
),
('Annoyance', 3,
 'Discomfort from minor disruptions.',
 '["Interruptions", "Noise", "Minor mistakes"]',
 '["Pause", "Breathe", "Reframe perspective", "Take small breaks"]'
),
('Hostility', 3,
 'Negative attitude or aggression toward someone.',
 '["Threats", "Conflicts", "Ongoing tension"]',
 '["Reflect before reacting", "Seek conflict resolution", "Set boundaries"]'
),
('Impatience', 3,
 'Restlessness and intolerance for delays.',
 '["Waiting", "Slow progress", "Inefficiency"]',
 '["Practice mindfulness", "Plan buffer time", "Focus on what can be controlled"]'
),

-- FEAR
('Anxiety', 4,
 'Tense feeling connected to uncertainty or pressure.',
 '["Workload", "Deadlines", "Change", "Unknown situations"]',
 '["Grounding techniques", "Structured planning", "Reduce overwhelm with small steps"]'
),
('Caution', 4,
 'A quiet internal alertness — a subtle sense of needing to move slowly or think carefully.',
 '["New situations", "Important decisions", "Unclear outcomes", "Past negative experiences"]',
 '["Pause and assess", "Gather information", "Check assumptions", "Break decisions into steps"]'
),
('Worry', 4,
 'Repetitive thoughts about potential problems.',
 '["Anticipated difficulties", "Health concerns", "Responsibilities"]',
 '["Identify actionable steps", "Limit rumination", "Focus on solutions"]'
),
('Nervousness', 4,
 'Physiological and mental agitation.',
 '["Public speaking", "New challenges", "Performance situations"]',
 '["Practice breathing", "Mental rehearsal", "Small exposure"]'
),
('Insecurity', 4,
 'Feeling unsure about self or abilities.',
 '["Social evaluation", "Comparisons", "New tasks"]',
 '["Reinforce strengths", "Set realistic goals", "Seek feedback"]'
),
('Apprehension', 4,
 'Unease about upcoming events.',
 '["Unfamiliar situations", "Uncertainty", "Past negative experiences"]',
 '["Prepare ahead", "Focus on controllable elements", "Self-reassure"]'
),
('Panic', 4,
 'Acute fear or alarm.',
 '["Immediate threats", "Emergencies", "Sudden danger"]',
 '["Ground yourself physically", "Seek safety", "Call for help if necessary"]'
),
('Dread', 4,
 'Anticipation of something unpleasant.',
 '["Deadlines", "Confrontations", "Health concerns"]',
 '["Plan actions", "Accept limits", "Break events into manageable steps"]'
),

-- PEACE
('Calm', 5,
 'Inner quietness and emotional balance.',
 '["Meditation", "Slow environments", "Nature", "Deep breaths"]',
 '["Maintain habits that create calm", "Protect peaceful routines"]'
),
('Relief', 5,
 'Release of tension after stress or anticipation.',
 '["Completing a task", "Receiving clarity", "Resolving a worry"]',
 '["Acknowledge the release", "Reflect briefly on what reduced the tension"]'
),
('Serenity', 5,
 'Long-lasting peacefulness and mental clarity.',
 '["Safe environments", "Restful activities", "Positive interactions"]',
 '["Practice relaxation", "Maintain boundaries", "Engage in restorative activities"]'
),
('Satisfaction', 5,
 'Feeling fulfilled with outcomes or efforts.',
 '["Task completion", "Meeting personal standards", "Recognition"]',
 '["Reflect on accomplishments", "Note what contributed to satisfaction"]'
),
('Acceptance', 5,
 'Acknowledging reality without resistance.',
 '["Unchangeable situations", "Mistakes", "Limitations"]',
 '["Practice mindfulness", "Focus on controllable aspects", "Reduce resistance"]'
),
('Compassion', 5,
 'Warmth and care for others’ suffering.',
 '["Seeing others struggle", "Witnessing pain", "Helping opportunities"]',
 '["Offer support", "Empathize without overextending", "Reflect on shared humanity"]'
),
('Mindfulness', 5,
 'Present-focused awareness and attentiveness.',
 '["Meditation", "Breathing exercises", "Observation of surroundings"]',
 '["Regular mindfulness practice", "Note sensations", "Focus on one task at a time"]'
),
('Harmony', 5,
 'Feeling aligned with self and environment.',
 '["Balanced routines", "Supportive surroundings", "Cooperation with others"]',
 '["Maintain routines", "Minimize conflicts", "Engage in restorative activities"]'
),

-- STRENGTH
('Confidence', 6,
 'Grounded sense of self-assurance and capability.',
 '["Preparation", "Positive feedback", "Success"]',
 '["Channel confidence into action", "Revisit achievements", "Maintain preparation habits"]'
),
('Determination', 6,
 'Focused internal drive to continue despite difficulty.',
 '["Personal goals", "Overcoming obstacles", "Self-motivation"]',
 '["Set realistic goals", "Break tasks down", "Celebrate progress"]'
),
('Courage', 6,
 'Ability to act despite fear or uncertainty.',
 '["Challenging situations", "Confronting fears", "High stakes tasks"]',
 '["Take calculated risks", "Visualize success", "Reflect on past courage"]'
),
('Motivation', 6,
 'Internal drive to take action toward goals.',
 '["Desire for achievement", "Upcoming deadlines", "Rewards"]',
 '["Set clear objectives", "Break into steps", "Maintain accountability"]'
),
('Resilience', 6,
 'Recovering quickly from stress or adversity.',
 '["Setbacks", "Failures", "Criticism", "Challenging events"]',
 '["Reflect on coping strategies", "Maintain routines", "Seek support if needed"]'
),
('Assertiveness', 6,
 'Expressing needs and boundaries firmly and respectfully.',
 '["Conflicts", "Negotiations", "Personal goals"]',
 '["Practice clear communication", "Use “I” statements", "Respect others"]'
),
('Focus', 6,
 'Concentrated attention on a task or goal.',
 '["Distractions", "Multitasking demands", "Complex problems"]',
 '["Eliminate distractions", "Schedule focused sessions", "Use breaks strategically"]'
),
('Empowerment', 6,
 'Feeling in control and capable of influencing outcomes.',
 '["Achieving goals", "Acquiring knowledge", "Supportive environment"]',
 '["Recognize successes", "Make proactive choices", "Engage in skill-building"]');


-- Diary entries for Alice (2 weeks)
INSERT INTO diary_entries (user_id, entry_date, content, question_id, created_at, updated_at)
VALUES
(1, CURRENT_DATE - INTERVAL '13 days', 'Today I felt a mix of joy and anxiety. Work was stressful but I managed to finish my tasks on time. Felt proud of my accomplishments.', 3, NOW() - INTERVAL '13 days', NOW() - INTERVAL '13 days'),
(1, CURRENT_DATE - INTERVAL '12 days', 'Felt calm and content. Took a long walk in the park and enjoyed nature. Minimal stress today.', 6, NOW() - INTERVAL '12 days', NOW() - INTERVAL '12 days'),
(1, CURRENT_DATE - INTERVAL '11 days', 'Had a frustrating meeting. Felt irritation and mild anxiety. Needed a break afterwards.', 7, NOW() - INTERVAL '11 days', NOW() - INTERVAL '11 days'),
(1, CURRENT_DATE - INTERVAL '10 days', 'Feeling motivated. Completed a personal project. Pride and determination were strong.', 15, NOW() - INTERVAL '10 days', NOW() - INTERVAL '10 days'),
(1, CURRENT_DATE - INTERVAL '9 days', 'Today I experienced fatigue and slight sadness. Took it easy and meditated.', 6, NOW() - INTERVAL '9 days', NOW() - INTERVAL '9 days'),
(1, CURRENT_DATE - INTERVAL '8 days', 'Excited about learning a new skill. Joy and curiosity were high.', 3, NOW() - INTERVAL '8 days', NOW() - INTERVAL '8 days'),
(1, CURRENT_DATE - INTERVAL '7 days', 'Felt calm and focused. Minimal distractions. Peaceful day.', 6, NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days'),
(1, CURRENT_DATE - INTERVAL '6 days', 'Irritation appeared during a traffic jam. Managed to stay patient.', 7, NOW() - INTERVAL '6 days', NOW() - INTERVAL '6 days'),
(1, CURRENT_DATE - INTERVAL '5 days', 'Confidence was high after a successful presentation.', 15, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days'),
(1, CURRENT_DATE - INTERVAL '4 days', 'Feeling anxious about upcoming deadlines. Took notes and planned carefully.', 8, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days'),
(1, CURRENT_DATE - INTERVAL '3 days', 'Calm and content. Enjoyed evening reading.', 6, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days'),
(1, CURRENT_DATE - INTERVAL '2 days', 'Felt tired and slightly overwhelmed. Took a rest and recovered.', 19, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days'),
(1, CURRENT_DATE - INTERVAL '1 day', 'Joy and gratitude for friends. Had a small celebration.', 1, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(1, CURRENT_DATE, 'Feeling reflective. Mixed emotions: relief and slight anxiety. Planning next week.', 18, NOW(), NOW());

-- Diary entries for Bob (2 days)
INSERT INTO diary_entries (user_id, entry_date, content, question_id, created_at, updated_at)
VALUES
(2, CURRENT_DATE - INTERVAL '1 day', 'Felt anxious due to workload. Managed small tasks but still stressed.', 8, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day'),
(2, CURRENT_DATE, 'Calm and relieved. Finished a task that was bothering me. Small joy and contentment.', 1, NOW(), NOW());


-- entry_emotions
INSERT INTO entry_emotions (entry_id, emotion_id)
VALUES
(1, 4), (1, 11),
(2, 9),
(3, 12), (3, 4),
(4, 18), (4, 17),
(5, 11),
(6, 2), (6, 5),
(7, 9),
(8, 12),
(9, 18),
(10, 4),
(11, 9),
(12, 12),
(13, 1),
(14, 11),
(15, 4),
(16, 9);


-- AI REPORTS for Alice (weekly)
INSERT INTO ai_reports (user_id, report_type, report_date, report_end_date, content, created_at, updated_at)
VALUES
(1, 'weekly', CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE, 
'{
  "overview": "This week shows a generally stable emotional state with occasional fluctuations connected to stress, workload expectations, and periods of mental fatigue.",
  "dominant_emotion": "Joy",
  "main_triggers": ["Work tasks", "Meetings", "Evening fatigue"],
  "recurring_patterns": ["Evening fatigue consistently lowers mood", "Improvement with routine"],
  "recommendations": ["Establish one daily stabilizing routine", "Split tasks into smaller steps", "Set boundaries for late-evening thinking", "Reflect on successful days"]
}', NOW() - INTERVAL '7 days', NOW() - INTERVAL '7 days');

-- AI REPORTS for Alice (daily)
INSERT INTO ai_reports (user_id, entry_id, report_type, report_date, content, created_at, updated_at)
VALUES
(1, 14, 'daily', CURRENT_DATE - INTERVAL '1 day',
'{
  "detected_emotions": ["Fatigue", "Relief"],
  "main_triggers": ["End of week tasks"],
  "insights": ["You recover quickly when you give yourself moments of rest", "Describing feelings reduces intensity"],
  "recommendations": ["Schedule breaks every 90 minutes", "End day with grounding ritual"]
}', NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day');

-- AI REPORTS for Bob (daily)
INSERT INTO ai_reports (user_id, entry_id, report_type, report_date, content, created_at, updated_at)
VALUES
(2, 16, 'daily', CURRENT_DATE,
'{
  "detected_emotions": ["Calm", "Relief"],
  "main_triggers": ["Completed task"],
  "insights": ["Small wins boost confidence", "Reflecting on progress improves mood"],
  "recommendations": ["Celebrate small achievements", "Take note of positive emotions"]
}', NOW(), NOW());


-- INSIGHTS
INSERT INTO insights (user_id, insight_text, insight_date, created_at, updated_at)
VALUES
(1, 'Reflected on gratitude and noticed improvements in mood.', '2025-11-26', NOW(), NOW()),
(1, 'Observed patterns of excitement and joy in morning routines.', '2025-11-26', NOW(), NOW()),
(1, 'Recognized moments of calm helped productivity and focus.', '2025-11-26', NOW(), NOW()),
(1, 'Identified triggers of sadness and planned strategies to cope.', '2025-11-26', NOW(), NOW()),
(2, 'Noted increased motivation after completing a task.', '2025-11-25', NOW(), NOW()),
(2, 'Observed moments of pride and confidence in daily work.', '2025-11-25', NOW(), NOW()),
(2, 'Reflected on small joys and how they improve mood.', '2025-11-26', NOW(), NOW()),
(2, 'Recognized triggers of anxiety and strategies to reduce them.', '2025-11-26', NOW(), NOW());

-- STREAKS
INSERT INTO user_streaks (user_id, streak_start_date, streak_length, created_at, updated_at)
VALUES
-- Alice
(1, '2025-11-13', 13, NOW(), NOW()),
-- Bob
(2, '2025-11-25', 2, NOW(), NOW()),
-- Charlie
(3, '2025-11-28', 1, NOW(), NOW());
