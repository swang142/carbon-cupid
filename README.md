# Carbon Cupid

## Inspiration
We created Carbon Cupid to solve a critical problem in the climate space: talented NPOs focused on blue carbon solutions spend precious time chasing funding rather than saving our planet, while VCs with dedicated sustainability funds struggle to discover truly impactful projects aligned with their goals. Like climate-focused matchmakers, we saw an opportunity to bring these partners together efficiently. With blue carbon initiatives representing a $3.5 billion opportunity in Canada alone, the impact potential is enormous - but market inefficiencies and connection barriers have kept this potential largely untapped. Carbon Cupid is our solution to this "dating problem" in climate finance.

## What it does
Carbon Cupid acts as a sophisticated matchmaking platform that connects climate NPOs with funding sources using AI-powered compatibility algorithms - think of it as "Tinder for climate impact." Our platform:

* **Creates intelligent profiles** by analyzing and standardizing data about both NPOs and funders, highlighting their unique attributes and requirements
* **Calculates compatibility scores** using factors like funding alignment, mission fit, risk tolerance, geographic preferences, and potential carbon impact
* **Curates personalized recommendations** of optimal matches to both funders and fundees, saving weeks of research and outreach
* **Powers discovery** through semantic search that understands the intent behind queries, not just keywords
* **Centralizes critical information** about blue carbon initiatives and ocean-based carbon removal approaches in a standardized format

## How we built it
We assembled a modern tech stack designed for performance and scalability:

* **Frontend**: Next.js provides server-side rendering and a responsive experience, while TailwindCSS ensures a clean, consistent design language
* **Backend**: TypeScript and Node.js power our server with strong typing and efficient execution, with Express.js handling our API endpoints
* **Database**: Supabase (PostgreSQL) stores our structured data about organizations, preferences, and matches
* **Deployment**: Vercel hosts our frontend while Render manages our backend services
* **Intelligence layer**: Custom-built matching algorithms evaluate multiple compatibility dimensions, while our semantic search understands the nuances of climate terminology

We developed specialized data pipelines to gather and normalize information about climate organizations, ensuring fair and accurate matching regardless of organization size or history.

## Challenges we ran into
Building Carbon Cupid pushed us to solve several complex problems:

* **Data standardization nightmares**: Climate NPOs and VCs present information in wildly different formats - creating a common language between them required creative data wrangling
* **Algorithmic fairness**: Developing a ranking system that wouldn't favor established players while still valuing proven impact required careful calibration
* **Information gaps**: Newer NPOs often have limited digital footprints compared to established VCs, creating asymmetries we needed to address
* **Cross-sector UX**: Creating an interface that speaks fluently to both finance professionals and environmental scientists meant bridging different terminology and priorities
* **Technical complexity**: Implementing semantic search that truly understands climate science concepts beyond keywords required deep domain integration

## Accomplishments that we're proud of
Despite the challenges, we achieved several breakthroughs:

* **Comprehensive ecosystem mapping**: We created the first structured database connecting ocean-based carbon removal initiatives with potential funders
* **Intelligent matching**: Our algorithm considers subtle factors like risk appetite and impact timeframes, not just surface-level keyword matching
* **Intuitive cross-sector UX**: We designed an interface that translates between finance and environmental language, making complex information accessible
* **Technical foundation**: We built a scalable system that can expand to additional climate solution categories beyond blue carbon
* **Frictionless connections**: Our platform reduces the administrative overhead of partnership formation, allowing organizations to focus on impact

## What we learned
This project taught us valuable lessons across multiple domains:

* **Climate finance complexities**: We gained insights into how capital actually flows to environmental solutions and where the bottlenecks truly lie
* **Applied AI ethics**: We discovered how to leverage AI capabilities for environmental good while avoiding bias and ensuring fair representation
* **Data normalization techniques**: We mastered approaches to standardizing messy, real-world information into comparable formats
* **Cross-sector communication**: We learned how to translate between the languages of finance, technology, and environmental science
* **Market inefficiencies**: We identified specific gaps in the climate funding landscape that technology can help bridge

## What's next for Carbon Cupid
We have an exciting roadmap to expand Carbon Cupid's impact:

* **Communication suite**: Building in-app messaging and notification systems to streamline the connection process
* **Enhanced security**: Implementing Clerk for robust authentication and user verification
* **Geographic intelligence**: Adding location-based matching to connect local funders with regional projects
* **Funding stage specialization**: Creating tailored experiences for different investment phases from seed to Series C
* **Impact measurement**: Developing tools to track and report on real carbon reductions facilitated through our platform
* **Ecosystem expansion**: Broadening beyond blue carbon to include other high-impact climate solutions