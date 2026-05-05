---
name: SIRINX Master GEM
description: >
  Master Brand Creative Studio — Dynamic image generation, SEO/AEO content writing,
  and marketing material creation for SIRINX Smart Energy Hub. Used by AI agents
  for unlimited website image generation, brand-consistent content, and campaign creation.
  Triggers on: image generation, create image, generate visual, SEO content, AEO content,
  marketing material, brand content, campaign, social ad, infographic, pitch deck,
  video concept, brochure, website banner.
triggers:
  - image generation
  - create image
  - generate visual
  - SEO content
  - AEO content
  - marketing material
  - brand content
  - campaign
  - social ad
  - infographic
  - pitch deck
  - video concept
  - brochure
  - website banner
---

# SIRINX Master GEM — Brand Creative Studio v1.0

**Mission:** Single source of truth สำหรับการสร้าง creative assets, SEO/AEO content และ marketing materials ทั้งหมดของ SIRINX Smart Energy Hub ด้วย AI agents

---

## Section 1: SIRINX Brand DNA

### Company Identity
| Field | Value |
|-------|-------|
| **Company** | SIRINX Smart Energy Hub |
| **Thai Name** | แพลตฟอร์มพลังงานอัจฉริยะสำหรับธุรกิจไทย |
| **Location** | Phitsanulok, Thailand |
| **Tagline** | ปฏิวัติพลังงานอัจฉริยะ เพื่ออนาคตที่ยั่งยืน |
| **Industry** | B2B Solar Energy EPC + AI Platform (SaaS) |
| **ICP** | โรงงาน / โกดัง / โรงแรม ค่าไฟ > 50,000 THB/เดือน |

### Brand Colors
```
Deep Navy      #0A2342   — Primary background, authority, trust
Solar Gold     #F5A623   — Accent, CTAs, energy, premium
Emerald Green  #10B981   — Success, sustainability, growth
White          #FFFFFF   — Clean, light, modern surfaces
Glass White    rgba(255,255,255,0.08) — Glassmorphism panels
```

### Typography
- **Primary Font:** Sarabun (Thai + English bilingual)
- **Weight Usage:** 300 body | 500 subheads | 700 headlines | 800 hero

### Visual Identity
- **UI Style:** Glassmorphism — frosted glass panels, `backdrop-filter: blur(20px)`
- **Mood:** Futuristic but believable — engineering confidence, not science fiction
- **Context:** Thai industrial, warm tropical lighting, real business environments
- **Architecture Style:** Flowing organic curves (Zaha Hadid inspired), white surfaces, seamlessly integrated solar panels
- **Photography:** Golden hour light, clean industrial spaces, professional team

### Brand Voice
| Dimension | Description |
|-----------|-------------|
| **Tone** | Professional, engineering-confident, premium B2B |
| **Language** | Thai primary + English technical terms |
| **Personality** | Expert advisor, not salesperson |
| **Authority** | Data-driven, cite real numbers, ROI-focused |
| **Trust** | Transparent, long-term partnership oriented |

---

## Section 2: Contact Block

> **Include this block in all marketing outputs and collateral:**

```
📱 LINE: @sirinx-energy
📞 Tel: 065-624-9453
🌐 Web: sirinx.co.th
📍 Location: Phitsanulok, Thailand
```

---

## Section 3: 12 Output Modes

AI agents select the appropriate mode(s) and declare them at the top of each output.

| Mode | Code | Purpose |
|------|------|---------|
| **COMPACT MODE** | `[COMPACT]` | Short, actionable output — ideal for quick social copy, short ad, single prompt |
| **FULL MODE** | `[FULL]` | Comprehensive detail — full campaign, complete deck, long-form content |
| **BRAND-LOCKED** | `[BRAND-LOCKED]` | Strict brand adherence — every element must match brand DNA exactly |
| **ENGINEERING-FIRST** | `[ENG-FIRST]` | Technical/engineering logic emphasis — specs, diagrams, data sheets |
| **SALES-FIRST** | `[SALES-FIRST]` | Sales/conversion emphasis — urgency, ROI, CTA, objection handling |
| **VISUAL MODE** | `[VISUAL]` | Image-focused output — prompts, art direction, composition notes |
| **COPY MODE** | `[COPY]` | Text/copywriting focused — headlines, body, CTA, taglines |
| **INFOGRAPHIC MODE** | `[INFOGRAPHIC]` | Data visualization — charts, stats, flow diagrams, comparisons |
| **VIDEO MODE** | `[VIDEO]` | Motion/video concepts — storyboard, script, shot list, transitions |
| **DECK MODE** | `[DECK]` | Presentation slides — slide structure, talking points, visuals |
| **CAMPAIGN MODE** | `[CAMPAIGN]` | Full campaign packages — multi-channel, multi-asset, strategy |
| **PROMPT PACK MODE** | `[PROMPT-PACK]` | Multiple image prompt variants — 3–10 prompts, different styles/angles |

### Mode Combinations (common patterns)
```
[COMPACT][BRAND-LOCKED][SALES-FIRST]      → Quick social ad
[FULL][BRAND-LOCKED][ENGINEERING-FIRST]   → Technical brochure
[VISUAL][PROMPT-PACK][BRAND-LOCKED]       → Website image batch
[FULL][CAMPAIGN][SALES-FIRST]             → Full campaign launch
[DECK][ENGINEERING-FIRST][SALES-FIRST]    → Investor/client pitch
```

---

## Section 4: Image Generation System

### Platform-Specific Prompt Structure

#### Google Gemini (Recommended for Thai context + photorealism)
```
Photorealistic, 4K ultra high resolution, [SCENE DESCRIPTION].
Thai industrial context, [LOCATION DETAILS].
Lighting: [LIGHTING SPECIFICATION].
Style: professional commercial photography, clean composition.
Color palette: deep navy (#0A2342), solar gold (#F5A623), emerald green (#10B981).
No text overlays unless specified.
```

#### Midjourney
```
[SCENE DESCRIPTION], SIRINX brand aesthetic, deep navy and solar gold palette,
professional B2B photography style, Thai industrial context,
[LIGHTING], [MOOD] --ar [RATIO] --style raw --v 6.1 --q 2
```
Common aspect ratios: `--ar 16:9` (hero/banner) | `--ar 1:1` (social) | `--ar 9:16` (story/reel) | `--ar 4:3` (presentation)

#### DALL-E
```
[PERSPECTIVE] view of [SCENE DESCRIPTION].
[LIGHTING DESCRIPTION]. Professional commercial photography style.
Color palette: navy blue, gold, and emerald green accents.
Thai business context. Photorealistic, clean, modern aesthetic.
High resolution, sharp focus, no text.
```

### Universal Brand Keywords (include in every image prompt)
```
Brand colors: deep navy blue (#0A2342), solar gold (#F5A623), emerald green (#10B981)
Style: clean, modern, professional, futuristic, Thai context
Mood: confident, innovative, sustainable, warm, trustworthy
Architecture: flowing organic curves, white surfaces, integrated solar panels
Lighting: golden hour, warm professional, clean studio OR dramatic sky
Quality: photorealistic, 4K, commercial photography grade
Avoid: cartoon, illustration, CGI-obvious, overly dark, stock photo cliché
```

---

## Section 5: 10 Image Categories — 22 Base Prompts

### 1. Hero Section (3 prompts)

**HER-01 — Aerial Factory Solar**
```
Aerial drone view of a large Thai industrial factory/warehouse complex with a
vast solar panel array installed across the entire rooftop. Modern architecture
with white and navy surfaces. Golden sunrise lighting casting warm shadows.
Emerald green landscape surrounding the property. Deep navy sky at dawn.
Photorealistic, 4K, commercial photography. --ar 16:9 --style raw --v 6.1
```

**HER-02 — Executive Smart Dashboard**
```
Thai executive in professional attire standing at floor-to-ceiling smart glass
dashboard displaying real-time energy analytics, solar output graphs, and
AI-powered KPI panels. Deep navy background, solar gold data visualizations,
glassmorphism UI panels glowing subtly. Confident, forward-looking pose.
Modern executive office, Bangkok skyline at golden hour visible through windows.
Photorealistic, 4K. --ar 16:9 --style raw --v 6.1
```

**HER-03 — Smart Energy Hub Architectural**
```
Exterior architectural photography of a futuristic Smart Energy Hub building
with Zaha Hadid-inspired flowing white curved facade. Integrated solar panels
on curved roof surfaces. Emerald green landscaping. Solar gold accent lighting
along building contours. Deep navy sky with dramatic clouds. Warm tropical Thai
atmosphere. Ultra-modern, aspirational, photorealistic. --ar 16:9 --v 6.1
```

---

### 2. Solar Installation (4 prompts)

**SOL-01 — Industrial Rooftop Installation**
```
Wide angle view of professional solar panel installation team on the rooftop of
a large Thai warehouse/factory. Engineers in branded navy and gold safety gear
inspecting monocrystalline solar panels. Perfect rows of panels extending to
horizon. Blue sky with scattered clouds. Real-world industrial Thai context.
Commercial photography grade, sharp, detailed. --ar 16:9 --style raw --v 6.1
```

**SOL-02 — Close-up Panel Technology**
```
Macro close-up of premium monocrystalline solar panel surface showing
photovoltaic cell grid pattern. Water droplets beading off surface.
Golden sunlight reflecting at angle, creating iridescent blue-purple
shimmer across cells. Background: blurred Thai industrial rooftop.
Product photography quality, 4K ultra-sharp, bokeh background.
--ar 4:3 --style raw --v 6.1
```

**SOL-03 — Night Glow System**
```
Solar panel installation on Thai factory rooftop at dusk/twilight.
Smart inverter and monitoring equipment glowing with LED indicator lights.
Deep navy sky. Solar gold accent lighting illuminating panel edges.
Emerald green indicator lights on monitoring panels. Dramatic, premium,
high-tech atmosphere. Long exposure photography style. --ar 16:9 --v 6.1
```

**SOL-04 — Installation Team Portrait**
```
Professional group portrait of SIRINX installation engineering team, 4-5 members,
wearing matching navy and solar gold branded uniforms and safety helmets.
Rooftop solar installation in background, blue Thai sky. Team looks confident,
capable, proud. Natural professional lighting. Commercial photography,
not corporate stock photo style. --ar 3:2 --style raw --v 6.1
```

---

### 3. ESS Battery Storage (2 prompts)

**ESS-01 — Battery Cabinet System**
```
Professional product photography of a modern energy storage system (ESS)
battery cabinet installation inside a clean Thai industrial facility.
Sleek white cabinet units with deep navy and solar gold branding panels,
glowing LED status indicators in emerald green. Clean concrete floor,
high ceiling industrial space. Dramatic product lighting, studio quality.
--ar 4:3 --style raw --v 6.1
```

**ESS-02 — Day-Night Cycle Infographic Scene**
```
Split-scene visualization: left side shows solar panels charging during golden
Thai daytime; right side shows the same factory operating at night powered by
ESS battery storage, building glowing warmly. Deep navy sky on right,
bright blue sky on left. Emerald green energy flow lines connecting both scenes.
Clean infographic-meets-photography hybrid style. --ar 16:9 --v 6.1
```

---

### 4. EV Charging (2 prompts)

**EVC-01 — Modern EV Charging Station**
```
Modern EV charging station with multiple charging pods in a Thai commercial
parking facility. Electric vehicles charging simultaneously. Clean architectural
design with solar gold and navy color scheme. Overhead solar canopy providing
shade and generating power. Night scene with warm LED lighting, emerald green
charging status indicators glowing. Premium, aspirational. --ar 16:9 --v 6.1
```

**EVC-02 — Corporate Fleet Charging**
```
Fleet of electric delivery trucks and company vehicles charging at a corporate
EV charging hub. Thai industrial park setting. Daylight, clear sky, lush greenery.
Modern charging infrastructure integrated with solar canopy. Professional,
commercial, real-world use case. Shows scalability and ROI potential.
--ar 16:9 --style raw --v 6.1
```

---

### 5. AI & Technology (3 prompts)

**AI-01 — 47 Ronin Agent Network Visualization**
```
Abstract visualization of an AI agent network — 47 interconnected nodes arranged
in a hierarchical constellation pattern. Deep navy background, nodes connected
by flowing solar gold light streams. Node clusters glow in different emerald
intensities representing L1-L5 agent layers. Glassmorphism panel overlay
showing real-time data. Cinematic, epic scale. --ar 16:9 --v 6.1
```

**AI-02 — Engineer + AI Dashboard**
```
Thai solar engineer in professional attire seated at a holographic AI command
center. Multiple floating translucent screens display: solar performance charts,
weather predictions, AI agent activity, energy trading data. Deep navy room,
solar gold and emerald green data elements floating in air. Futuristic but
believable near-future aesthetic. Photorealistic, cinematic. --ar 16:9 --v 6.1
```

**AI-03 — Smart Grid Network**
```
Bird's eye view visualization of an intelligent solar energy grid network
connecting multiple Thai industrial facilities across a city. Energy flow
visualized as golden light streams connecting nodes. Satellite map base layer
with glassmorphism data overlay panels. Deep navy background, solar gold
connections, emerald green healthy-status indicators. --ar 16:9 --v 6.1
```

---

### 6. Business & Team (3 prompts)

**BIZ-01 — Executive Meeting**
```
High-level business meeting in a modern Thai corporate boardroom.
Executive team reviewing solar energy proposals on a large smart display.
Mix of Thai business professionals and engineers. Floor-to-ceiling windows
with city view. Branded materials on table. Professional, confident,
premium atmosphere. Natural + supplemental lighting. --ar 16:9 --style raw --v 6.1
```

**BIZ-02 — Site Survey Consultation**
```
SIRINX energy consultant and Thai factory owner walking the rooftop of a
large industrial facility during a site survey. Consultant using tablet,
pointing at roof areas. Professional, consultative, trust-building scene.
Golden afternoon light, Thai industrial skyline background. Authentic,
not stock-photo. --ar 3:2 --style raw --v 6.1
```

**BIZ-03 — Contract Signing Milestone**
```
Warm professional scene of Thai business owner signing solar installation
agreement with SIRINX consultant at a clean modern meeting table.
Both smiling, handshake in progress. SIRINX branded documents and laptop visible.
Bright, optimistic lighting. Celebrates the start of a partnership.
--ar 3:2 --style raw --v 6.1
```

---

### 7. Infographic Backgrounds (3 prompts)

**INF-01 — Clean Data Background**
```
Abstract professional background for infographic overlays. Deep navy gradient
base with subtle hexagonal grid pattern. Faint solar gold geometric lines.
Clean negative space for text placement. No distracting elements.
Flat lay style, digital art, 4K. --ar 16:9 --v 6.1
```

**INF-02 — Energy Flow Background**
```
Dynamic background showing stylized solar energy flow visualization.
Deep navy base, golden light rays emanating from a central sun symbol,
flowing into emerald green grid lines below. Suitable for data overlays
and charts. Professional, not overly decorative. --ar 16:9 --v 6.1
```

**INF-03 — Thailand Map Energy**
```
Stylized map of Thailand with energy flow visualizations. Deep navy background,
Thailand outline in solar gold, emerald green dots marking industrial hubs.
Glowing connection lines showing energy network. Clean, data-visualization style,
no text. Perfect for "SIRINX coverage" or "market overview" slides. --ar 4:3 --v 6.1
```

---

### 8. Social Media (3 prompts)

**SOC-01 — Square Brand Post**
```
Clean professional square social media graphic background. Deep navy base,
solar gold geometric accent shape on one corner. Subtle glassmorphism panel
in center for text overlay. SIRINX brand aesthetic. Minimal, premium.
No text elements, pure visual background. 1:1 format, digital art. --ar 1:1 --v 6.1
```

**SOC-02 — Instagram Story — Before/After**
```
Vertical social media story format. Split composition: top half shows
traditional Thai factory with utility electricity meter and high bills (desaturated,
slightly gloomy). Bottom half shows same factory with solar panels, bright and
vibrant. Arrow or energy beam dividing the two. Solar gold accent colors.
9:16 vertical format. --ar 9:16 --v 6.1
```

**SOC-03 — LinkedIn Hero Banner**
```
Professional LinkedIn company page banner. Wide format. Thai factory landscape
with solar panels under dramatic golden sky. "SIRINX Smart Energy Hub" implied
premium brand aesthetic. Deep navy and solar gold color dominant. Space for
headline text overlay on left third. Ultra-wide, cinematic. --ar 4:1 --v 6.1
```

---

### 9. Icons & UI Elements (2 prompts)

**UI-01 — Tech Icon Set Background**
```
Set of clean modern icon concepts for solar energy platform: sun/solar,
battery storage, EV charging, AI brain, energy analytics chart, smart grid.
Flat icon style with solar gold outlines on deep navy background.
Glassmorphism circle backgrounds behind each icon. Consistent line weight.
UI design quality. --ar 1:1 --v 6.1
```

**UI-02 — App Interface Mockup**
```
Smartphone and tablet display showing SIRINX AI platform interface.
Dark mode UI with deep navy background, solar gold KPI numbers, emerald green
status indicators, glassmorphism card components. Real-time solar dashboard
displayed on screens. Clean device mockup style, angled 3/4 view.
Product photography quality. --ar 4:3 --style raw --v 6.1
```

---

### 10. Testimonials (3 prompts)

**TST-01 — Happy Factory Owner**
```
Portrait of satisfied Thai male factory owner (50s, professional), standing
in front of his solar-equipped factory rooftop. Relaxed, confident, genuine smile.
Professional but approachable attire. Warm golden hour lighting.
Authentic documentary photography style, NOT stock photo feel.
--ar 3:4 --style raw --v 6.1
```

**TST-02 — Savings Moment**
```
Thai business owner looking at electricity bill with visible surprise and delight —
bill showing dramatic reduction. Solar panels visible through office window behind.
Natural light, relatable scene. Slightly warm color grade.
Authentic, believable, emotional. --ar 3:2 --style raw --v 6.1
```

**TST-03 — Hotel Property Solar**
```
Luxury Thai boutique hotel exterior with beautifully integrated solar panels
on roof and carpark canopy. Lush tropical garden, pool visible. Late afternoon
golden light. High-end property aesthetic, solar installation looks premium
and architectural, not industrial. Shows solar works for hospitality sector.
--ar 16:9 --style raw --v 6.1
```

---

## Section 6: SEO/AEO Content Guidelines

### Primary Keywords (Thai + English)
```
Tier 1 (high volume):
- โซลาร์เซลล์ | solar cell Thailand
- โซลาร์รูฟท็อป | solar rooftop
- พลังงานแสงอาทิตย์ | solar energy Thailand
- ติดโซลาร์เซลล์โรงงาน | factory solar installation
- ลดค่าไฟ | reduce electricity bill

Tier 2 (intent-focused):
- EV charging station Thailand
- แบตเตอรี่สำรองพลังงาน ESS Thailand
- solar B2B Thailand
- SIRINX solar energy
- smart energy hub Thailand

Tier 3 (long-tail):
- โซลาร์เซลล์โรงงาน ราคา คุ้มค่าไหม
- ติดโซลาร์เซลล์ 100 kWp ราคาเท่าไหร่
- solar rooftop ROI คืนทุนกี่ปี
- BOI solar 8 ปี ภาษี
- พ.ร.ฎ. 805 หักค่าใช้จ่าย 150%
```

### Content Structure (H1→H2→H3)
```
H1: Primary keyword + benefit (1 per page)
  H2: Main feature/topic sections (3-5 per page)
    H3: Specific sub-topics, FAQs, how-to steps
      Body: 150-300 words per section, data-rich
      CTA: Contact/calculator link every 2-3 sections
```

### Schema Markup Priority
- **FAQ Schema** — For all /faq and landing pages (AI search / AEO優先)
- **How-To Schema** — Installation process, ROI calculation guides
- **LocalBusiness Schema** — SIRINX company page
- **Product Schema** — Solar packages, ESS products
- **Review/Testimonial Schema** — Customer case studies

### Market Data Reference (Always Cite)
```
Thailand Solar Market:
- Market size: 5.20 GW (2023) → 7.71 GW (2024) — 48.3% YoY growth
- Solar irradiance: 4.5–5.5 kWh/m²/day (excellent ROI potential)
- Industrial electricity rate: ~4.20 THB/kWh (peak)

Financial Incentives:
- BOI promotion: 8-year corporate income tax exemption for solar projects
- พ.ร.ฎ. 805: 150% tax deduction on qualifying energy investment
- Depreciation: accelerated write-off available

ROI Benchmarks:
- Payback period: 5–7 years (industrial rooftop)
- System life: 25–30 years (panel warranty: 25 years)
- Annual savings: ~1.5–2.5M THB per 100 kWp system
- Internal Rate of Return (IRR): 18–25% for well-designed systems

EV Market:
- EV market share Thailand: 48% (2024)
- EV charging infrastructure demand growing 40%+ annually
```

### AEO Optimization (Answer Engine Optimization)
```
Strategy: Answer questions directly and completely in the first 2 sentences
Format: "Q: [question]" → "A: [direct answer with data]" structure
Target: ChatGPT/Perplexity/Google AI Overviews featured answers
Length: 50–150 words for featured snippet targets
Schema: FAQ and How-To for all answers
```

### Top AEO Questions to Answer
1. โซลาร์เซลล์โรงงานคืนทุนกี่ปี?
2. ราคาติดโซลาร์เซลล์ 100 kWp เท่าไหร่?
3. Solar rooftop ประกันกี่ปี?
4. BOI solar exemption คืออะไร?
5. SIRINX vs competitor คืออะไรที่ต่างกัน?
6. EV charging station ราคาและ ROI เป็นอย่างไร?
7. ESS battery สำหรับโรงงาน ใช้งานอย่างไร?
8. เปรียบเทียบ solar 3 phase vs single phase โรงงาน

### Brand Voice in Content
- **Open:** ข้อมูลจริง ตัวเลขจริง ไม่โอ้อวด
- **Authority:** อ้างอิงมาตรฐาน IEC, EGAT, PATT, BOI
- **Trust:** Case study จริง ชื่อจริง หรือ industry segment จริง
- **CTA:** ไม่ aggressive — "ขอคำนวณ ROI ฟรี" ดีกว่า "ซื้อเลย"
- **Length:** Long enough to be authoritative, short enough to be readable
- **Structure:** Use bullet lists, tables, and numbered steps liberally

---

## Section 7: 30 Pro Starter Commands Reference

### Quick Command Index by Category

| Category | Commands |
|----------|----------|
| **Social Ads** | #1, #2, #24, #25, #26 |
| **Infographics** | #4, #19, #20 |
| **Website** | #3, #28 |
| **Visual/Hero** | #7, #8, #21, #22, #23 |
| **Pitch Deck** | #9, #10, #11 |
| **Campaigns** | #5, #6, #15, #30 |
| **Video** | #16, #17, #18 |
| **Print/Brochure** | #12, #27 |
| **Copy/LinkedIn** | #13, #14 |
| **Prompt Pack** | #29 |

### All 30 Commands

```
#1  [COMPACT][BRAND-LOCKED][SALES-FIRST]
    Facebook ad — โรงงานเป้าหมาย, ลดค่าไฟ, ROI hook

#2  [COMPACT][BRAND-LOCKED][SALES-FIRST]
    Instagram story ad — before/after electricity bill visual

#3  [FULL][BRAND-LOCKED][COPY]
    Landing page copy — Solar Rooftop main page, full SEO

#4  [INFOGRAPHIC][BRAND-LOCKED][ENG-FIRST]
    ROI comparison infographic — solar vs grid, 10-year projection

#5  [CAMPAIGN][FULL][SALES-FIRST]
    Quarterly campaign — Q-season push, all channels

#6  [CAMPAIGN][FULL][COPY]
    Content calendar — 30-day social media plan

#7  [VISUAL][PROMPT-PACK][BRAND-LOCKED]
    Hero section image pack — 3 variants for A/B testing

#8  [VISUAL][PROMPT-PACK][BRAND-LOCKED]
    Solar installation photography prompts — 5 angles

#9  [DECK][FULL][ENG-FIRST]
    Investor pitch deck — company overview, market, technology

#10 [DECK][FULL][SALES-FIRST]
    Client proposal deck — factory-specific, ROI-led

#11 [DECK][FULL][ENG-FIRST][SALES-FIRST]
    Technical + financial hybrid deck — for enterprise clients

#12 [FULL][BRAND-LOCKED][COPY]
    Product brochure — 4-page A4, solar + ESS + EV combo

#13 [COMPACT][COPY][SALES-FIRST]
    LinkedIn post series — thought leadership, 5 posts

#14 [FULL][COPY][BRAND-LOCKED]
    Email sequence — 5-email nurture, lead to consultation

#15 [CAMPAIGN][SALES-FIRST][FULL]
    End-of-year campaign — BOI deadline urgency messaging

#16 [VIDEO][COMPACT][SALES-FIRST]
    15-second Facebook video script — ROI hook

#17 [VIDEO][FULL][ENG-FIRST]
    60-second brand video — technology storytelling

#18 [VIDEO][FULL][CAMPAIGN]
    YouTube case study video — client story, 3-minute

#19 [INFOGRAPHIC][FULL][ENG-FIRST]
    Solar system sizing guide — kWp calculation visual

#20 [INFOGRAPHIC][FULL][BRAND-LOCKED]
    Thailand solar market data visualization

#21 [VISUAL][BRAND-LOCKED][FULL]
    Website banner pack — homepage hero, 3 variants

#22 [VISUAL][PROMPT-PACK]
    AI agent visualization — 47 Ronin network art

#23 [VISUAL][BRAND-LOCKED][SALES-FIRST]
    Testimonial card design — quote + portrait layout

#24 [COMPACT][SALES-FIRST]
    Google Display ad copy — 5 headline + description sets

#25 [COMPACT][BRAND-LOCKED]
    LINE OA message template — consultation follow-up

#26 [COMPACT][SALES-FIRST]
    TikTok caption pack — 10 captions for solar content

#27 [FULL][BRAND-LOCKED][ENG-FIRST]
    Technical spec sheet — solar system components, A4 format

#28 [FULL][COPY][BRAND-LOCKED]
    SEO blog post — "โซลาร์เซลล์โรงงาน ROI คืนทุนกี่ปี"

#29 [PROMPT-PACK][VISUAL][FULL]
    Master image prompt pack — all 10 categories, 22 prompts

#30 [CAMPAIGN][FULL][BRAND-LOCKED]
    Annual brand campaign — Q1-Q4 strategic creative plan
```

### Quick Template Formula

Use this template as the starting point for any command:

```
[MODE-1][MODE-2][MODE-3]

Create a SIRINX [asset type].
Audience: [target audience — e.g., "โรงงานขนาด 500 kW ขึ้นไป"].
Theme: [campaign theme — e.g., "ลดค่าไฟ 60% ด้วย solar+ESS"].

Think and decide automatically:
- best business angle
- best engineering angle
- best background image direction
- best headline
- best subheadline
- 3 strongest proof points
- best CTA
- footer/contact block
- master prompt (image generation ready)
- layout guidance
```

---

## Section 8: Team Assignment Guide

| Team | Primary Commands | Focus |
|------|-----------------|-------|
| **Sales Team** | #1, #2, #5, #13, #15, #24, #25 | Ads, outreach, urgency |
| **Design Team** | #3, #7, #8, #14, #21, #23, #27 | Visuals, brand assets, layouts |
| **Investor Team** | #4, #9, #10, #11, #19 | Decks, financials, data viz |
| **Video Team** | #16, #17, #18 | Scripts, storyboards, motion |
| **Creative Team** | #29, #30 | Prompt packs, campaigns, big ideas |
| **Content Team** | #6, #12, #20, #22, #26, #28 | Blog, social calendar, SEO, copy |

---

## Section 9: Dynamic Agent Usage

### For AI Agents (47 Ronin) — How to Use This Skill

#### Workflow A: Generate Website Images

```
1. SELECT category from Section 5 (e.g., Hero Section)
2. CHOOSE base prompt (e.g., HER-01)
3. MODIFY for specific context:
   - Add specific location details if needed
   - Adjust lighting for time of day/season
   - Specify any unique product or feature to highlight
4. APPLY universal brand keywords from Section 4
5. FORMAT for target platform (Gemini/Midjourney/DALL-E)
6. OUTPUT: Ready-to-use generation prompt

Agent Example (L2 Analysis Agent):
  Input: "Need hero image for ESS product page"
  → Select: ESS-01 base prompt
  → Modify: Add "SIRINX branded cabinet, model SE-100"
  → Platform: Midjourney format --ar 16:9
  → Output: Final prompt string
```

#### Workflow B: Write SEO/AEO Content

```
1. IDENTIFY target keyword (Tier 1/2/3 from Section 6)
2. SELECT content type (blog, landing page, FAQ, how-to)
3. APPLY content structure (H1→H2→H3 hierarchy)
4. INSERT market data (cite figures from Section 6)
5. WRITE in brand voice (expert, data-driven, Thai-first)
6. ADD schema markup recommendation
7. INCLUDE contact block and CTA
8. OUTPUT: Publication-ready content

Agent Example (L3 Decision Agent — Sadaemon #21):
  Input: "Write page for ESS battery product"
  → Keyword: "แบตเตอรี่สำรองพลังงาน โรงงาน"
  → Structure: H1 → 4 H2 sections → FAQ
  → Data: ESS savings + BOI tax benefit
  → Schema: Product + FAQ
  → Output: Full page copy, Thai + English
```

#### Workflow C: Create Marketing Materials

```
1. SELECT output mode(s) from Section 3
2. CHOOSE command number from Section 7 (or use Quick Template)
3. FOLLOW brand DNA from Section 1
4. INCLUDE contact block (Section 2) in all collateral
5. GENERATE both:
   - Visual prompt (for image generation)
   - Copy (headlines, body, CTA)
6. FLAG for team delivery using Section 8 guide

Agent Example (L4 Coordination Agent — Gengo #35):
  Input: "Launch campaign for Q2 BOI deadline"
  → Mode: [CAMPAIGN][FULL][SALES-FIRST]
  → Command: #15 (BOI urgency campaign)
  → Assets: Facebook ad + email + landing page + LINE message
  → Assign: Sales (#1,#25) + Design (#7,#21) + Content (#28)
  → Output: Full multi-asset campaign brief
```

#### Workflow D: Batch Image Generation for Website

```
Agents can generate unlimited image prompts by:
1. Looping through all 10 categories (Section 5)
2. For each category, generating base prompt + 3 variations:
   - Variation A: Different time of day (morning/golden hour/night)
   - Variation B: Different perspective (wide/close/aerial/ground)
   - Variation C: Different Thai industry context (factory/hotel/warehouse)
3. Outputting as structured JSON for website CMS integration:

{
  "category": "hero",
  "prompt_id": "HER-01-V3",
  "platform": "midjourney",
  "prompt": "...",
  "target_page": "/",
  "aspect_ratio": "16:9",
  "generated_at": "ISO-timestamp"
}
```

---

## Section 10: Quality Checklist

Before finalizing any output, agents must verify:

### Brand Compliance
- [ ] Colors match brand palette (#0A2342, #F5A623, #10B981)
- [ ] Font is Sarabun or specified equivalent
- [ ] Tagline or brand voice consistent
- [ ] Contact block included (LINE, Tel, Web, Location)

### Content Quality
- [ ] Data cited is from Section 6 approved figures
- [ ] Thai language checked for professionalism
- [ ] CTA is clear and actionable
- [ ] No competitor names mentioned negatively

### Image Prompts
- [ ] Platform-specific format applied (Section 4)
- [ ] Universal brand keywords included
- [ ] Aspect ratio specified
- [ ] No text in image prompt (unless overlay requested)

### SEO/AEO
- [ ] Primary keyword in H1
- [ ] Schema markup type specified
- [ ] FAQ section included where relevant
- [ ] Market data cited with year

---

*SIRINX Master GEM v1.0 — Single source of truth for all SIRINX creative and content generation*
*Update this file when: brand evolves, new market data available, new image categories needed, new commands required*
