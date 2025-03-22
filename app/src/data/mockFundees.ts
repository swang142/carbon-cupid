import { FundeeData } from "../components/FundeeCard";

// Mock company logos (using placeholder images)
const logos = [
  "https://via.placeholder.com/150/0A84FF/FFFFFF?text=TechVista",
  "https://via.placeholder.com/150/34C759/FFFFFF?text=GreenMed",
  "https://via.placeholder.com/150/FF375F/FFFFFF?text=FinEdge",
  "https://via.placeholder.com/150/AF52DE/FFFFFF?text=EduSpark",
  "https://via.placeholder.com/150/FF9F0A/FFFFFF?text=ShopWave",
  "https://via.placeholder.com/150/30B0C7/FFFFFF?text=EcoFuel",
  "https://via.placeholder.com/150/5856D6/FFFFFF?text=BuildCraft",
  "https://via.placeholder.com/150/FF2D55/FFFFFF?text=HealthPulse",
  "https://via.placeholder.com/150/FFD60A/FFFFFF?text=DataMind",
  "https://via.placeholder.com/150/32D74B/FFFFFF?text=SpaceTech",
  "https://via.placeholder.com/150/64D2FF/FFFFFF?text=SecurityLock",
  "https://via.placeholder.com/150/BF5AF2/FFFFFF?text=FoodFresh",
];

/*
const filterCategories = [
  {
    id: "stage",
    name: "Stage",
    options: ["Seed", "Pre-Seed", "Growth"],
  },
  {
    id: "technology",
    name: "Technology",
    options: ["Electrochemical CDR", "Microalgae Cultivation", "Carbon Sequestration", "Macroalgae Cultivation", "Ocean Alkalinity Enhancement", "Blue Carbon Restoration"],
  },
  {
    id: "funding",
    name: "Funding Needed",
    options: ["<$500K", "$500K-$1M", "$1M-$5M", "$5M-$10M", ">$10M"],
  },
  {
    id: "location",
    name: "Location",
    options: ["British Columbia", "Alberta", "Ontario", "Newfoundland", "PEI", "Nova Scotia", "New Brunswick", "Quebec", "Manitoba", "Saskatchewan", "Northwest Territories", "Nunavut", "Yukon"],
  },
  {
    id: "team",
    name: "Team Size",
    options: ["1-10", "11-50", "51-100", "101-500", ">500"],
  },
  {
    id: "revenue",
    name: "Revenue",
    options: ["Pre-revenue", "<$100K", "$100K-$1M", "$1M-$10M", ">$10M"],
  },
];
*/
// Generate mock fundee data
export const mockFundees: FundeeData[] = [
  {
    id: "1",
    companyName: "TechVista AI",
    logo: logos[0],
    stage: "Series A",
    industry: ["AI", "Machine Learning", "Enterprise Software"],
    tagline: "AI-powered analytics platform helping enterprises unlock insights from unstructured data",
    fundingNeeded: "$5M-$10M",
    location: "San Francisco, US",
    teamSize: "11-50",
    revenue: "$1M-$10M",
    foundedYear: 2020,
    match: 92,
    description: "TechVista AI has developed a groundbreaking AI platform that transforms how enterprises handle unstructured data. Our proprietary algorithms can analyze text, images, and audio to extract meaningful business insights, helping companies make better decisions faster. With a growing customer base including Fortune 500 companies, we're positioned to revolutionize the enterprise analytics market."
  },
  {
    id: "2",
    companyName: "GreenMed Health",
    logo: logos[1],
    stage: "Series B",
    industry: ["Healthcare", "Biotechnology", "AI"],
    tagline: "Revolutionizing preventative healthcare with AI-powered diagnostics",
    fundingNeeded: "$10M-$20M",
    location: "Boston, US",
    teamSize: "51-100",
    revenue: "$5M-$20M",
    foundedYear: 2018,
    match: 88,
    description: "GreenMed Health is transforming preventative healthcare through AI-powered diagnostic tools that can predict health issues before they become serious. Our platform combines machine learning with medical expertise to provide early warnings for various conditions, helping healthcare providers intervene earlier and more effectively. With clinical validations from major medical institutions, we're ready to scale our solution globally."
  },
  {
    id: "3",
    companyName: "FinEdge Banking",
    logo: logos[2],
    stage: "Series A",
    industry: ["Fintech", "Banking", "Software"],
    tagline: "Next-generation banking infrastructure for the digital economy",
    fundingNeeded: "$5M-$10M",
    location: "London, UK",
    teamSize: "11-50",
    revenue: "$1M-$5M",
    foundedYear: 2021,
    match: 84,
    description: "FinEdge is building the banking infrastructure for the future. Our API-first platform allows businesses to embed financial services directly into their products with minimal friction. We've developed a suite of banking services that can be easily integrated by companies of all sizes, enabling them to offer accounts, payments, cards, and lending capabilities to their customers. With regulatory compliance built-in, we're making financial innovation accessible to everyone."
  },
  {
    id: "4",
    companyName: "EduSpark Learning",
    logo: logos[3],
    stage: "Seed",
    industry: ["Education", "EdTech", "AI"],
    tagline: "Adaptive learning platform personalizing education for K-12 students",
    fundingNeeded: "$1M-$3M",
    location: "Toronto, Canada",
    teamSize: "1-10",
    revenue: "<$1M",
    foundedYear: 2022,
    match: 79,
    description: "EduSpark is on a mission to transform K-12 education through personalized, adaptive learning experiences. Our platform uses AI to understand each student's strengths, weaknesses, and learning style, then delivers customized content and activities to optimize their educational journey. With proven results showing significant improvements in student engagement and test scores, we're ready to expand our reach to more schools and districts."
  },
  {
    id: "5",
    companyName: "ShopWave Commerce",
    logo: logos[4],
    stage: "Series B",
    industry: ["E-commerce", "Retail Tech", "Supply Chain"],
    tagline: "All-in-one commerce platform for the modern retailer",
    fundingNeeded: "$15M-$25M",
    location: "New York, US",
    teamSize: "51-100",
    revenue: "$10M-$50M",
    foundedYear: 2019,
    match: 76,
    description: "ShopWave is reshaping retail with our comprehensive commerce platform that handles everything from inventory management to omnichannel sales. We provide retailers with powerful tools to manage their operations seamlessly across physical stores and digital channels, while offering advanced analytics to optimize their business. With over 500 merchants already on our platform, we're positioned for rapid growth in the global retail technology market."
  },
  {
    id: "6",
    companyName: "EcoFuel Energy",
    logo: logos[5],
    stage: "Series A",
    industry: ["Energy", "Cleantech", "Sustainability"],
    tagline: "Sustainable biofuel technology reducing carbon footprint by 70%",
    fundingNeeded: "$8M-$12M",
    location: "Copenhagen, Denmark",
    teamSize: "11-50",
    revenue: "$1M-$5M",
    foundedYear: 2020,
    match: 72,
    description: "EcoFuel has developed a breakthrough biofuel technology that can reduce carbon emissions by up to 70% compared to traditional fuels. Our proprietary process converts agricultural waste into high-quality fuel that works with existing infrastructure, making adoption simple for businesses. With successful pilot programs with major transportation companies and government incentives supporting clean energy, we're poised to scale our solution globally."
  },
  {
    id: "7",
    companyName: "BuildCraft Construction",
    logo: logos[6],
    stage: "Series B",
    industry: ["Construction", "PropTech", "Software"],
    tagline: "Digital platform streamlining construction management and reducing costs by 30%",
    fundingNeeded: "$10M-$15M",
    location: "Sydney, Australia",
    teamSize: "51-100",
    revenue: "$5M-$15M",
    foundedYear: 2018,
    match: 68,
    description: "BuildCraft is transforming the construction industry with our comprehensive digital platform that streamlines project management, supply chain logistics, and workforce coordination. Our solution helps construction companies complete projects faster, with fewer errors and at lower costs. With clients reporting an average 30% reduction in project overhead and 25% faster completion times, we've established strong market traction and are expanding globally."
  },
  {
    id: "8",
    companyName: "HealthPulse Medical",
    logo: logos[7],
    stage: "Seed",
    industry: ["Healthcare", "Medical Devices", "IoT"],
    tagline: "Remote patient monitoring platform for chronic disease management",
    fundingNeeded: "$2M-$4M",
    location: "Berlin, Germany",
    teamSize: "1-10",
    revenue: "<$1M",
    foundedYear: 2022,
    match: 65,
    description: "HealthPulse is developing a remote patient monitoring system that transforms how chronic diseases are managed. Our IoT devices and accompanying software platform enable continuous monitoring of vital health metrics, with AI algorithms that can detect concerning patterns and alert healthcare providers before emergencies occur. With successful pilot programs in multiple hospitals and strong interest from healthcare insurers, we're ready to scale our solution."
  },
  {
    id: "9",
    companyName: "DataMind Analytics",
    logo: logos[8],
    stage: "Series A",
    industry: ["Data Analytics", "Enterprise Software", "AI"],
    tagline: "Enterprise data platform unifying analytics across organizational silos",
    fundingNeeded: "$6M-$10M",
    location: "Singapore",
    teamSize: "11-50",
    revenue: "$2M-$8M",
    foundedYear: 2020,
    match: 64,
    description: "DataMind has built an enterprise data platform that solves the problem of fragmented analytics across large organizations. Our solution connects disparate data sources, applies intelligent processing, and provides actionable insights through intuitive dashboards. With clients reporting 40% faster time-to-insight and millions in savings from data-driven decisions, we've proven our value proposition and are expanding across the APAC region and beyond."
  },
  {
    id: "10",
    companyName: "SpaceTech Innovations",
    logo: logos[9],
    stage: "Series B",
    industry: ["Aerospace", "Satellite", "Communications"],
    tagline: "Low-cost satellite infrastructure enabling global connectivity",
    fundingNeeded: "$20M-$30M",
    location: "Austin, US",
    teamSize: "51-100",
    revenue: "$10M-$30M",
    foundedYear: 2019,
    match: 61,
    description: "SpaceTech is democratizing access to space with our low-cost satellite platform that enables global connectivity and Earth observation capabilities. Our proprietary miniaturized satellite technology and launch partnerships have drastically reduced the cost of deploying satellite networks, opening new possibilities for businesses, researchers, and governments. With several successful deployments already completed and a strong pipeline of commercial and government contracts, we're positioned to capture a significant share of the rapidly growing space infrastructure market."
  },
  {
    id: "11",
    companyName: "SecurityLock Cyber",
    logo: logos[10],
    stage: "Series A",
    industry: ["Cybersecurity", "Enterprise Software", "AI"],
    tagline: "AI-powered cybersecurity platform detecting threats in real-time",
    fundingNeeded: "$7M-$12M",
    location: "Tel Aviv, Israel",
    teamSize: "11-50",
    revenue: "$2M-$7M",
    foundedYear: 2021,
    match: 58,
    description: "SecurityLock has developed an advanced cybersecurity platform that uses AI to detect and neutralize threats in real-time, before they can damage an organization. Our solution continuously learns from global threat patterns and adapts its defenses accordingly, providing protection that's always current against evolving cyber threats. With a growing roster of enterprise clients and partnerships with major technology providers, we're scaling rapidly in the global cybersecurity market."
  },
  {
    id: "12",
    companyName: "FoodFresh Supply",
    logo: logos[11],
    stage: "Seed",
    industry: ["AgTech", "Supply Chain", "IoT"],
    tagline: "Smart supply chain solution reducing food waste by 40%",
    fundingNeeded: "$3M-$5M",
    location: "Mexico City, Mexico",
    teamSize: "11-50",
    revenue: "<$1M",
    foundedYear: 2022,
    match: 56,
    description: "FoodFresh is tackling the global food waste crisis with our IoT-enabled supply chain platform. Our solution tracks food from farm to store, using sensors and predictive analytics to maintain optimal conditions and identify potential waste before it occurs. Pilot programs with major grocery chains have demonstrated up to 40% reduction in food waste and significant cost savings. With the global food waste problem valued at over $1 trillion annually, we're addressing a massive market with compelling environmental and economic benefits."
  }
];

// Function to search fundees by query
export function searchFundees(query: string): FundeeData[] {
  if (!query.trim()) return mockFundees;
  
  const lowercaseQuery = query.toLowerCase();
  
  return mockFundees.filter(fundee => {
    // Search in company name, industry, tagline, description
    return (
      fundee.companyName.toLowerCase().includes(lowercaseQuery) ||
      fundee.industry.some(i => i.toLowerCase().includes(lowercaseQuery)) ||
      fundee.tagline.toLowerCase().includes(lowercaseQuery) ||
      fundee.description.toLowerCase().includes(lowercaseQuery) ||
      fundee.location.toLowerCase().includes(lowercaseQuery) ||
      fundee.stage.toLowerCase().includes(lowercaseQuery)
    );
  });
}

// Function to filter fundees
export function filterFundees(fundees: FundeeData[], filters: Record<string, string[]>): FundeeData[] {
  if (Object.keys(filters).length === 0) return fundees;
  
  return fundees.filter(fundee => {
    // Check each filter category
    for (const [category, selectedOptions] of Object.entries(filters)) {
      if (selectedOptions.length === 0) continue;
      
      // Match based on category
      switch (category) {
        case "stage":
          if (!selectedOptions.includes(fundee.stage)) return false;
          break;
        case "industry":
          if (!selectedOptions.some(option => fundee.industry.includes(option))) return false;
          break;
        case "funding":
          if (!selectedOptions.includes(fundee.fundingNeeded)) return false;
          break;
        case "location":
          if (!selectedOptions.some(option => fundee.location.includes(option))) return false;
          break;
        case "team":
          if (!selectedOptions.includes(fundee.teamSize)) return false;
          break;
        case "revenue":
          if (!selectedOptions.includes(fundee.revenue)) return false;
          break;
      }
    }
    
    return true;
  });
}