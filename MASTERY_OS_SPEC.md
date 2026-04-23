# MASTERY OS — Product Specification
**Version:** 0.1.0  
**Status:** Active Development  
**Last Updated:** 2025-04-21  
**Owner:** Ben

---

## MISSION

Build a living intelligence system that turns daily study into compounding technical mastery. Not a flashcard app. Not a logger. A second brain that watches what you learn, maps what you know, finds the edges of your understanding, and relentlessly pushes you toward world-class technical depth across ML, algorithms, quant finance, digital biology, and AI systems.

**The north star:** Walk into any interview at Two Sigma, Anthropic, or a top clinical AI company and demonstrate genuine depth — not recited facts, but connected understanding. The system creates the pressure to get there.

---

## CORE PHILOSOPHY

1. **Write naturally, extract intelligently.** No rigid forms. Journal your study session in plain language. The system extracts concepts, updates confidence, identifies gaps.
2. **Test understanding, not recall.** Generate questions that require reasoning, not flashcard answers.
3. **Map the frontier.** Always show the edge of what you know and what's adjacent.
4. **Compound daily.** Every session builds on the last. Decay punishes gaps. Consistency compounds.
5. **Simulate the real thing.** Mock interviews that feel like the actual thing, not easier versions.

---

## TECH STACK

### Frontend
- **Framework:** React 18 + TypeScript
- **Styling:** Tailwind CSS
- **Graph visualization:** D3.js (knowledge graph)
- **State management:** Zustand
- **Routing:** React Router v6

### Backend
- **Runtime:** Node.js + Express
- **Database:** Supabase (PostgreSQL)
- **Auth:** Supabase Auth
- **Vector store:** pgvector (semantic search over knowledge nodes)
- **File storage:** Supabase Storage

### AI Layer
- **Primary model:** Claude claude-sonnet-4-20250514 (claude-sonnet-4-20250514)
- **API:** Anthropic /v1/messages
- **Context strategy:** Full graph state + recent sessions injected per call
- **Embeddings:** Voyage AI for semantic concept matching

### Integrations (Phase 2+)
- **LeetCode:** LeetCode GraphQL API (track solved problems)
- **Anki:** AnkiConnect REST API (sync cards and performance)
- **Browser extension:** Chrome extension manifest v3 (capture reading)
- **Web search:** Tavily API (resource recommendations)

### Dev Tooling
- **Package manager:** pnpm
- **Build:** Vite
- **Testing:** Vitest + Playwright
- **CI/CD:** GitHub Actions → Vercel

### File Structure
```
mastery-os/
├── apps/
│   ├── web/                    # React frontend
│   │   ├── src/
│   │   │   ├── components/     # UI components
│   │   │   ├── pages/          # Route pages
│   │   │   ├── stores/         # Zustand stores
│   │   │   ├── hooks/          # Custom hooks
│   │   │   ├── lib/            # Utilities
│   │   │   └── types/          # TypeScript types
│   └── api/                    # Express backend
│       ├── routes/             # API routes
│       ├── services/           # Business logic
│       ├── ai/                 # AI prompt layer
│       └── integrations/       # External APIs
├── packages/
│   ├── knowledge-graph/        # Graph engine (shared)
│   ├── curriculum/             # Pre-seeded knowledge data
│   └── types/                  # Shared TypeScript types
├── supabase/
│   ├── migrations/             # DB schema
│   └── seed/                   # Knowledge graph seed data
└── extensions/
    └── chrome/                 # Browser extension (Phase 2)
```

---

## DATABASE SCHEMA

### Core Tables

```sql
-- Users
users (
  id uuid PRIMARY KEY,
  email text,
  created_at timestamptz,
  target_roles jsonb,           -- ["quant_research", "ai_lab", "clinical_ai"]
  preferences jsonb
)

-- Knowledge nodes (pre-seeded + user-added)
knowledge_nodes (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  domain text,                  -- algorithms | ml | deeplearning | systems | quant | biology
  title text,
  description text,
  confidence float DEFAULT 0,   -- 0-5, decays over time
  last_reviewed_at timestamptz,
  interview_frequency float,    -- 0-1, how often this appears in target role interviews
  prerequisites uuid[],         -- node ids
  unlocks uuid[],               -- node ids
  tags text[],
  is_seeded boolean DEFAULT false,
  embedding vector(1536),       -- for semantic search
  created_at timestamptz
)

-- Study sessions (journal entries)
study_sessions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  raw_text text,                -- what the user wrote
  extracted_concepts jsonb,     -- AI-extracted concept list with confidence scores
  duration_minutes int,
  session_type text,            -- journal | problem | paper | interview | project
  linked_node_ids uuid[],       -- nodes updated by this session
  ai_analysis jsonb,            -- gaps found, recommendations made
  created_at timestamptz
)

-- Concept updates (tracks confidence over time)
concept_updates (
  id uuid PRIMARY KEY,
  node_id uuid REFERENCES knowledge_nodes,
  session_id uuid REFERENCES study_sessions,
  confidence_before float,
  confidence_after float,
  created_at timestamptz
)

-- Challenge sessions (mock interviews, quizzes)
challenge_sessions (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  challenge_type text,          -- mock_interview | quiz | system_design | invariant_test
  target_role text,             -- quant | ai_lab | clinical_ai | general
  domain text,
  messages jsonb,               -- full conversation history
  score jsonb,                  -- {accuracy, depth, senior_thinking, communication}
  gaps_identified text[],
  nodes_tested uuid[],
  created_at timestamptz
)

-- Daily briefings
daily_briefings (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  date date,
  nodes_due_for_review uuid[],
  challenge_questions jsonb,
  recommendations jsonb,
  completed boolean DEFAULT false,
  created_at timestamptz
)

-- Resources (papers, problems, links)
resources (
  id uuid PRIMARY KEY,
  node_id uuid REFERENCES knowledge_nodes,
  type text,                    -- paper | problem | video | repo | article
  title text,
  url text,
  notes text,
  completed boolean DEFAULT false,
  created_at timestamptz
)

-- Integrations sync log
integration_syncs (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users,
  source text,                  -- leetcode | anki | browser
  raw_data jsonb,
  processed boolean DEFAULT false,
  created_at timestamptz
)
```

---

## KNOWLEDGE GRAPH

### Domain Structure

The graph is pre-seeded with 6 domains, ~120 nodes total. Each domain has tiers.

```
DOMAIN: algorithms
├── TIER 1 — Foundations
│   ├── Arrays & Hashing
│   ├── Two Pointers
│   ├── Sliding Window
│   └── Binary Search
├── TIER 2 — Core
│   ├── Linked Lists
│   ├── Trees & BST
│   ├── Heaps / Priority Queue
│   └── Graphs (BFS/DFS)
├── TIER 3 — Advanced
│   ├── Dynamic Programming
│   ├── Greedy Algorithms
│   ├── Backtracking
│   └── Tries
└── TIER 4 — Expert
    ├── Advanced Graph (Dijkstra, Bellman-Ford, Topological Sort)
    ├── Segment Trees
    └── Union-Find

DOMAIN: ml
├── TIER 1 — Foundations
│   ├── Linear Algebra for ML
│   ├── Probability & Statistics
│   ├── Optimization (GD, SGD, Adam)
│   └── Bias-Variance Tradeoff
├── TIER 2 — Core Models
│   ├── Linear & Logistic Regression
│   ├── Decision Trees & Random Forests
│   ├── SVMs
│   └── XGBoost / Gradient Boosting
├── TIER 3 — Advanced
│   ├── Regularization (L1/L2/Dropout)
│   ├── Feature Engineering
│   ├── Evaluation Metrics & Calibration
│   └── Unsupervised (K-Means, GMM, PCA)
└── TIER 4 — Expert
    ├── Bayesian Methods
    ├── Causal Inference
    └── ML Theory (PAC Learning, VC Dimension)

DOMAIN: deeplearning
├── TIER 1 — Foundations
│   ├── Backpropagation from Scratch
│   ├── CNNs & Pooling
│   └── RNNs & LSTMs
├── TIER 2 — Transformers
│   ├── Attention Mechanism
│   ├── Multi-Head Attention
│   ├── Positional Encoding
│   └── Full Transformer Architecture
├── TIER 3 — Modern LLMs
│   ├── BERT & Encoder Models
│   ├── GPT & Decoder Models
│   ├── Scaling Laws
│   └── Fine-tuning (Full, LoRA, QLoRA)
└── TIER 4 — Frontier
    ├── RLHF / DPO / PPO / GRPO
    ├── Mechanistic Interpretability
    ├── Multimodal Models (CLIP, LLaVA)
    └── Efficient Inference (Quantization, Speculative Decoding)

DOMAIN: systems
├── TIER 1 — Foundations
│   ├── ML Pipeline Architecture
│   ├── Feature Stores
│   └── Model Registry & Versioning
├── TIER 2 — Serving
│   ├── REST vs gRPC
│   ├── Batching Strategies
│   ├── Latency vs Throughput
│   └── KV Cache
├── TIER 3 — Scale
│   ├── Distributed Training (FSDP, DDP)
│   ├── Vector Databases & HNSW
│   ├── RAG Pipelines
│   └── Eval Frameworks
└── TIER 4 — Agentic
    ├── Tool Use & Function Calling
    ├── Memory Architecture (Episodic/Semantic/Procedural)
    ├── Multi-Agent Orchestration
    └── MCP Protocol

DOMAIN: quant
├── TIER 1 — Foundations
│   ├── Time Series Analysis
│   ├── Stationarity & Autocorrelation
│   └── Probability for Finance
├── TIER 2 — Core Finance
│   ├── Factor Models (Fama-French)
│   ├── Portfolio Optimization (MVO, Risk Parity)
│   ├── Risk Metrics (VaR, CVaR, Sharpe)
│   └── Market Microstructure
├── TIER 3 — Quant ML
│   ├── Alpha Generation & Decay
│   ├── Backtesting (Correct Methodology)
│   ├── IC/IR Framework
│   └── Regime Detection
└── TIER 4 — Advanced
    ├── Derivatives & Options Pricing
    ├── Kelly Criterion & Sizing
    └── Execution Algorithms (TWAP/VWAP)

DOMAIN: biology
├── TIER 1 — Foundations
│   ├── Genomics Basics (DNA/RNA/NGS)
│   ├── Clinical Data (EHR/FHIR/ICD)
│   └── Drug Discovery Pipeline
├── TIER 2 — Computational Bio
│   ├── AlphaFold Architecture
│   ├── Single Cell RNA-seq
│   └── Sequence Modeling for Biology
├── TIER 3 — Clinical AI
│   ├── Clinical NLP & Named Entity Recognition
│   ├── Survival Analysis & Time-to-Event
│   ├── Real World Evidence & Confounding
│   └── FDA SaMD Regulatory Pathway
└── TIER 4 — Frontier
    ├── Foundation Models for Biology
    ├── Multimodal Health AI
    └── PSP / Patient Support Platform Architecture
```

### Node Decay Function
```
confidence_now = confidence_original * decay_factor
decay_factor = e^(-lambda * days_since_review)
lambda = 0.05 (slow decay — matches human forgetting curve)

At 7 days: 70% confidence retained
At 14 days: 50% confidence retained  
At 30 days: 22% confidence retained
```

---

## FEATURES

### Status Legend
- ✅ Complete
- 🔨 In Progress  
- 📋 Planned — Phase 1
- 🔮 Planned — Phase 2
- 💡 Future Idea

---

### MODULE 1: JOURNAL ENGINE
**The core input loop. Write naturally, extract intelligently.**

| Feature | Status | Notes |
|---------|--------|-------|
| Free-form journal input | 📋 | Primary input method. No forms. |
| AI concept extraction | 📋 | Parse journal → extract concept list → map to nodes |
| Confidence detection | 📋 | AI infers confidence from how user explains things |
| Auto-tag to knowledge nodes | 📋 | Fuzzy match extracted concepts to graph nodes |
| Session type detection | 📋 | Auto-detect: problem solving, paper reading, concept study |
| Structured log mode | 📋 | Optional: explicit domain/type/duration fields |
| Edit & delete sessions | 📋 | |
| Session history view | 📋 | Chronological feed of all entries |
| Search sessions | 📋 | Full text search across journal |

**Journal AI Prompt Pattern:**
```
User writes: "Worked through backprop today. Understood the chain rule 
application but kept getting confused about gradient accumulation at 
split nodes in computation graphs. Did 2 DP problems — coin change 
felt solid, longest subsequence I had to peek at the state transition."

AI extracts:
- backpropagation: confidence 3 (understood basics, gap at split nodes)
- chain rule: confidence 4
- gradient accumulation: confidence 2 (explicit confusion)
- computation graphs: confidence 2
- dynamic programming: confidence 3
- coin change problem: confidence 4
- longest common subsequence: confidence 2 (needed hint)

AI generates:
- Gap identified: gradient accumulation at split nodes
- Targeted question: "Draw the computation graph for y = x*w + x*b. 
  Where does gradient accumulate and why?"
- Next resource: "Karpathy micrograd — gradient accumulation section"
```

---

### MODULE 2: KNOWLEDGE GRAPH
**Visual map of everything you know and don't know.**

| Feature | Status | Notes |
|---------|--------|-------|
| Pre-seeded graph (120 nodes) | 📋 | All domains, all tiers |
| D3 force-directed visualization | 📋 | Nodes colored by confidence |
| Node detail panel | 📋 | Click node → see confidence, last reviewed, linked sessions |
| Frontier detection | 📋 | Highlight nodes adjacent to strong nodes |
| Gap highlighting | 📋 | Red nodes = low confidence or not visited |
| Prerequisite chains | 📋 | Show what unlocks what |
| Confidence decay visualization | 📋 | Show nodes fading over time |
| Add custom nodes | 📋 | User can add nodes not in seed data |
| Domain filter | 📋 | Show one domain at a time |
| Interview frequency overlay | 📋 | Show which nodes appear most in target role interviews |

---

### MODULE 3: GAP ANALYSIS ENGINE
**Always know exactly what you're missing.**

| Feature | Status | Notes |
|---------|--------|-------|
| Domain coverage scores | 📋 | Per-domain % coverage |
| Confidence heat map | 📋 | Visual grid of all nodes |
| Priority gap list | 📋 | Sorted by: interview frequency × (1 - confidence) |
| Prerequisite gap detection | 📋 | "You can't learn X until you know Y" |
| Target role alignment | 📋 | Gap scored against specific target roles |
| Weekly gap report | 📋 | Sunday summary: what moved, what's urgent |
| Decay alerts | 📋 | "You haven't reviewed attention mechanism in 12 days" |

---

### MODULE 4: CHALLENGE ENGINE
**The pressure that builds real depth.**

| Feature | Status | Notes |
|---------|--------|-------|
| Daily briefing generation | 📋 | Morning: 3 review items + 1 challenge |
| Adaptive question generation | 📋 | Questions calibrated to confidence level |
| 5-tier question system | 📋 | Explain → Apply → Defend → Connect → Invent |
| Answer evaluation | 📋 | AI scores: accuracy, depth, senior thinking, communication |
| Follow-up questioning | 📋 | Pushes back on weak answers |
| Cross-domain connection questions | 📋 | "How does X relate to Y across domains" |
| Spaced repetition scheduling | 📋 | Surface weak nodes at optimal intervals |
| Question history | 📋 | Never repeat the same question |

---

### MODULE 5: MOCK INTERVIEW SIMULATOR
**Feels like the real thing.**

| Feature | Status | Notes |
|---------|--------|-------|
| Quant fund mode | 📋 | Two Sigma / HRT / Citadel format |
| AI lab mode | 📋 | Anthropic / OpenAI format |
| Clinical AI mode | 📋 | Health AI specific questions |
| General ML mode | 📋 | Broad applied ML |
| System design mode | 📋 | ML platform design |
| Coding mode | 📋 | DSA with explanation required |
| Full conversation interface | 📋 | Multi-turn interview simulation |
| Post-interview scoring | 📋 | Detailed rubric: what you showed, what was missing |
| Improvement recommendations | 📋 | Specific nodes to study before next round |
| Session recording | 📋 | Review your answers later |

---

### MODULE 6: CURRICULUM ENGINE
**Always know what to study next.**

| Feature | Status | Notes |
|---------|--------|-------|
| Personalized study queue | 📋 | Dynamic priority list |
| Resource recommendations | 📋 | Specific papers, problems, videos per node |
| Paper library | 📋 | All landmark papers pre-loaded with summaries |
| Problem sets by node | 📋 | Curated LeetCode problems mapped to concepts |
| Learning path generation | 📋 | "To be ready for Two Sigma in 90 days, do this" |
| Target role calibration | 📋 | Weight curriculum toward chosen target roles |
| Web search for new resources | 🔮 | Find latest papers/posts on weak areas |

---

### MODULE 7: INTEGRATIONS
**Pipe in everything you already do.**

| Feature | Status | Notes |
|---------|--------|-------|
| LeetCode sync | 🔮 | Pull solved problems, map to nodes |
| Anki sync | 🔮 | Read decks, import cards as concept updates |
| Browser extension | 🔮 | Capture pages you read, auto-journal |
| GitHub sync | 🔮 | Log projects, detect concepts from code |
| Calendar integration | 💡 | Schedule study blocks, track streaks |

---

### MODULE 8: PROGRESS & ANALYTICS
**The scoreboard you've always wanted.**

| Feature | Status | Notes |
|---------|--------|-------|
| Streak tracking | 📋 | Daily consistency |
| Hours logged | 📋 | Total and by domain |
| Confidence over time | 📋 | Per-node and per-domain trend |
| Interview readiness score | 📋 | 0-100 per target role |
| Weekly progress report | 📋 | What improved, what decayed, what's next |
| Milestone system | 📋 | "Completed Transformer tier" etc |
| Comparison to target | 📋 | "You are X weeks from interview-ready" |

---

## AI PROMPT ARCHITECTURE

### System Context Template
Every AI call includes:
```
ROLE: Brutally honest technical intelligence coach.
TARGET ROLES: [user's targets]
GRAPH STATE: [top 20 nodes by priority — title, confidence, last_reviewed]
WEAK NODES: [bottom 10 by confidence]
RECENT SESSIONS: [last 5 sessions, summarized]
STREAK: [current streak]
TASK: [specific task — extract, challenge, interview, recommend, analyze]
```

### Prompt Types

**EXTRACT** — Parse journal entry, return structured concept list
**CHALLENGE** — Generate question at appropriate tier for specific node
**INTERVIEW** — Run mock interview in specified mode
**ANALYZE** — Identify gaps, generate recommendations  
**RECOMMEND** — Suggest next study resources for specific node
**SCORE** — Evaluate answer, return rubric scores + feedback
**CONNECT** — Generate cross-domain connection question
**BRIEF** — Generate daily morning briefing

---

## PHASE ROADMAP

### Phase 1 — Core Loop (Weeks 1-4)
Goal: Useful from day one. Journal → Extract → Graph → Challenge.

- [ ] Project setup (React + Supabase + Express)
- [ ] Knowledge graph seed data (all 120 nodes as JSON)
- [ ] Journal input with AI extraction
- [ ] Knowledge graph visualization (D3)
- [ ] Gap analysis dashboard
- [ ] Basic challenge engine (daily questions)
- [ ] Session history and search
- [ ] Streak and basic stats
- [ ] Deploy to Vercel

### Phase 2 — Interview Mode (Weeks 5-8)
Goal: Full mock interview simulation.

- [ ] Mock interview simulator (all 4 modes)
- [ ] Answer scoring rubric
- [ ] Post-interview report
- [ ] Spaced repetition scheduling
- [ ] Resource library (papers + problems)
- [ ] Learning path generator
- [ ] Target role calibration

### Phase 3 — Integrations (Weeks 9-12)
Goal: Automatically capture everything you do.

- [ ] LeetCode sync
- [ ] Anki sync via AnkiConnect
- [ ] Chrome browser extension
- [ ] Web search for resource recommendations
- [ ] Mobile-responsive UI

### Phase 4 — Intelligence Layer (Weeks 13+)
Goal: System gets smarter the more you use it.

- [ ] Semantic search across all sessions (pgvector)
- [ ] Concept relationship inference (AI discovers new edges)
- [ ] Personalized interview question generation (learns your weak patterns)
- [ ] Job posting analyzer ("this role requires X — here's your gap")
- [ ] Study buddy mode (share graph with accountability partner)

---

## NON-NEGOTIABLE PRINCIPLES

1. **Speed first.** Every interaction should feel instant. AI calls are async, never blocking UI.
2. **Honest over encouraging.** The AI coach tells the truth. Weak answers get called out.
3. **Friction-free input.** Journal entry should take 30 seconds. Never lose a thought to a form.
4. **Everything persists.** Nothing is lost. Every session, every answer, every graph update.
5. **Mobile works.** 5am study sessions happen on phones. UI must work on small screens.
6. **No gamification theater.** Streaks and scores exist to tell the truth, not to make you feel good.

---

## GETTING STARTED (Claude Code Instructions)

```bash
# 1. Clone and install
git clone https://github.com/[username]/mastery-os
cd mastery-os
pnpm install

# 2. Set up Supabase
# Create project at supabase.com
# Run migrations in supabase/migrations/
# Seed knowledge graph from packages/curriculum/

# 3. Environment variables
cp .env.example .env
# Fill in: ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_ANON_KEY

# 4. Run dev
pnpm dev
# Web: localhost:5173
# API: localhost:3000

# 5. First task: Build the journal input + AI extraction pipeline
# See: apps/api/ai/extract.ts
# See: apps/web/src/pages/Journal.tsx
```

---

## OPEN QUESTIONS

- Should confidence decay be per-node or should sessions reset the full timer?
- How aggressive should the daily challenge be early on (first 2 weeks)?
- Should mock interviews be timed or open-ended?
- When to introduce cross-domain connection questions (after what coverage threshold)?

---

*This document is the source of truth. Update it as the system evolves.*
