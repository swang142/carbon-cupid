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
    id: 1,
    longitude: 44.5533, 
    latitude: -80.3746,
    company_name: "Marmota Solutions Incorporated",
    company_description: "Marmota is a pioneer in environmental asset creation, green project management, emissions mitigation, and sustainable financing. The company's primary focus is the implementation of large-scale, technology-based decarbonization projects that generate revenue directly from carbon markets. Using a proven end-to-end process, Marmota helps organizations and governments at every level—municipal, provincial, and federal—to achieve their most ambitious climate goals through targeted initiatives that improve environmental impact, reduce risk, and generate high-quality, verifiable investment holdings: carbon credits, methane credits, plastics credits, and more. Our team brings extensive experience in the navigation of both compliance and voluntary carbon markets, offset program development, and large-scale offset project design. Marmota goes beyond simply quantifying or reporting our customers' sustainability challenges. Our mission is to meet these challenges head-on, delivering project-based solutions and providing responsible stewardship throughout the full lifecycle of generated environmental assets—creation, certification, and conversion—all powered by the world's first ISO-compliant green blockchain platform, ensuring full transparency and auditability. Founded and headquartered in Canada, Marmota was established with a belief in the nation's potential to lead and shape the global ESG and environmental financial markets. We provide a suite of programs and over 100 technology projects to choose from, many of which can be tailored to Canadian industries and governments, with the goal of promoting investment and capital decisions that will both reduce emissions and create tradable environmental assets.",
    website: "https://www.marmota.ca/",
    contact: "info@devvstream.com",
    headcount: "1-10",
    project_name: "Marmota EV Charging Carbon Offset Program (MEVCCOP)",
    project_description: "The Marmota EV Charging Offset Project (MEVCCOP), or the grouped project, is an initiative aimed at establishing electric vehicle (EV) charging networks across Canada and the USA. Developed by Marmota Solutions Inc., the “project proponent”, the grouped project partners with companies owning and/or operating EV charging systems for both light-duty and heavy-duty vehicles. The initiative establishes pre-approved standardized criteria for any project partner to join the grouped project and report project activity data. Each project instance within the grouped project is associated with a distinct partner company. The project seeks to reduce greenhouse gas (GHG) emissions by displacing emissions from both light-duty internal combustion engine vehicles (ICVs) and heavy-duty vehicles (trucks and buses) with electrically-powered versions of the same. This includes both Battery Electric Vehicles (BEVs) and Plug-In Hybrid Electric Vehicles (PHEVs) but excludes conventional hybrids. The project boundary is Canada (excluding the province of British Columbia (BC)) and the USA (excluding the states of California (CA), Oregon (OR) and Washington (WA)). GHG emission reductions are created by facilitating the transportation of people and/or freight via electrically-powered vehicles, charged from the electricity grid, in place of equivalent fossil fueled vehicles.",
    project_status: "Registration requested",
    method: false,
    certifier: "Verra",
    mcdr_type: "Energy industries (renewable/non-renewable sources); Transport",
    founding_year: 2022,
    stage: "Seed",
    current_funding: 0,
    funding_requested: 0,
    total_credits_issued: 16691,
    expected_credits: 0,

    // Newly added fields to match `FundeeData` interface
    logo: null,  // Assuming no logo URL, set to null
    risk_score: 60,
    efficiency_score: 70,
    impact_score: 80,
    goal_alignment_score: null,  // Assuming missing, set to null
    location_score: null,  // Assuming missing, set to null
    funding_score: null,  // Assuming missing, set to null
    match: null  // Assuming missing, set to null
  }
];

      
    // {
    //   "id": 2,
    //   "longitude": 54.839598,
    //   "latitude": -102.135239,
    //   "company_name": "Climate Smart Solutions Canada Inc.",
    //   "company_description": "We live, work, and raise our families in the same place we operate – Northern Saskatchewan, Canada. We cultivate partnerships with Indigenous communities that are based on mutual respect, transparency, trust, and a desire to work together for optimal social and economic outcomes while not only protecting the environment, but actively caring for it.",
    //   "website": "https://climatesmartservices.ca/",
    //   "contact": "info@climatesmartservices.ca",
    //   "headcount": "11-50",
    //   "project_name": "Sakahk Papakititamo (Forest Breathes)",
    //   "project_description": "Welcome to sakâhk papakîtitâmôwin (“forest breathes”), an Improved Forest Management (IFM) project of global significance that belongs to Peter Ballantyne Cree Nation (PBCN). This multi-partner project honours Traditional Knowledge, improves PBCN forests, and brings forward both social and economic opportunities for PBCN community membersthat will have a positive impact for generations to come. Together with Climate Smart as the Project Developer, PBCN is building resilience in the boreal forests and in community. The project preserves, protects, and manages a priceless resource that combats the impacts of climate change around the world to ensure we can all breathe easier about our future.",
    //   "project_status": "Under development",
    //   "method": false,
    //   "certifier": "Verra",
    //   "mcdr_type": "Agriculture Forestry and Other Land Use",
    //   "founding_year": 2017,
    //   "stage": "Growth",
    //   "current_funding": 0,
    //   "funding_requested": 0,
    //   "total_credits_issued": 254979,
    //   "expected_credits": 0
    // },
    // {
    //   "id": 3,
    //   "longitude": 53.2802,
    //   "latitude": -103.5875,
    //   "company_name": "BC Biocarbon",
    //   "company_description": "BC Biocarbon was founded in 2011 and headquartered McBride, BC, Canada. Using our proprietary biorefinery technology we produce bioenergy and biogenic carbon products (including biochar, biochemicals and other pyrolysis-derived products). Our mission is to massively accelerate atmospheric decarbonization via carbon removal and fossil carbon displacement while producing high-utility products.",
    //   "website": "https://www.bcbiocarbon.com/",
    //   "contact": "justine@marmota.ca",
    //   "headcount": "11-50",
    //   "project_name": "BC Biocarbon - McBride",
    //   "project_description": "BC Biocarbon’s new Edgewood biorefinery will be located near the town of Carrot River, Saskatchewan, Canada. The biorefinery will process 10 dry tonnes per hour of sustainable forestry waste feedstock, and sequester 44,000 tonnes of CO2e annually into biochar. Other co-products will be produced at the facility including heavy and light fraction carbon-based chemicals, water-based liquid products such as wood vinegar, and gases for thermal combustion. Environmental improvements will be realized through cleaner local water and air\nconditions. Our project reduces water run-off contamination from tannins and eliminates\nsmoke pollution, including nitrous oxide and methane emissions, by allowing for the\nretirement of beehive burners; our bio-refinery sequesters the carbon instead of combusting\nit. Social benefits to the local and small community of Carrot River will result from improved\nwater and air quality, as well as through the creation of approximately a dozen new full-time\njobs at the bio-refinery.",
    //   "project_status": "Under validation",
    //   "method": false,
    //   "certifier": "puro.earth",
    //   "mcdr_type": "Agriculture Forestry and Other Land Use",
    //   "founding_year": 2011,
    //   "stage": "Growth",
    //   "current_funding": 0,
    //   "funding_requested": 0,
    //   "total_credits_issued": 91,
    //   "expected_credits": 1200
    // },
    // {
    //   "id": 4,
    //   "longitude": 56.130371,
    //   "latitude": -106.346452,
    //   "company_name": "Bella Biochar Corporation",
    //   "company_description": "Bella Biochar is disrupting the Waste, Biochar and Carbon Dioxide Removal Markets as the only Canadian, commercial scale manufacturer of a non-traditional pyrolysis, certified organic, premium quality biochar. Bella Biochar is a Nature Based Product and Natural Carbon Solution that uses Natural Capital in the form of landfill diverted forest debris and wood waste to produce a highly stable carbon content consistency of 85-90% with highly durable carbon dioxide sequestration durability of a minimum of 1000 years (0.17 H/C:Molar Ratio). The application of Bella Biochar in soil mitigates Food Insecurity, Climate Change and Biodiversity loss to ensure long term value for future generations. Bella is proudly the first Canadian corporation and the first Female Founded corporation in the world to achieve PURO.earth (ICROA) Carbon Dioxide Removal Certification. Bella Biochar is also in 5 Canadian Wetland Restoration Projects. In recent third party trials Bella Biochar removed 71% of PFAS and 99% of TNT contamination. Numerous labs globally are conducting research on Bella Biochar's unique characteristics and outstanding performance for a variety of applications.",
    //   "website": "https://bellabiochar.com/",
    //   "contact": "",
    //   "headcount": "1-10",
    //   "project_name": "Bella Biochar Corporation",
    //   "project_description": "Bella is proudly the first Canadian corporation and the first Female Founded corporation in the world to achieve PURO.earth (ICROA) Carbon Dioxide Removal Certification. Bella Biochar increases soil fertility, biodiversity, moisture retention, water purity and overall climate health. Bella Biochar offers many environmental benefits in a multitude of applications ranging from Forest Management, Fire Prevention, Agriculture, Composting, Green Roofs, Lawn Care and Turfgrass to Wetland Restoration (currently Bella Biochar is in 4 Conservation Wetland Restoration Projects), as well as Soil/Water Rehabilitation/Remediation.",
    //   "project_status": "Under Validation",
    //   "method": false,
    //   "certifier": "puro.earth",
    //   "mcdr_type": "Agriculture Forestry and Other Land Use",
    //   "founding_year": 2019,
    //   "stage": "Seed",
    //   "current_funding": 0,
    //   "funding_requested": 0,
    //   "total_credits_issued": 2000,
    //   "expected_credits": 26500
    // },
    // {
    //   "id": 5,
    //   "longitude": 34.147328,
    //   "latitude": -118.096724,
    //   "company_name": "Captura",
    //   "company_description": "Captura uses electrodialysis technology to capture carbon dioxide directly from the ocean. Explore their field trials.",
    //   "website": "https://capturacorp.com/",
    //   "contact": "",
    //   "headcount": "51-200",
    //   "project_name": "Captura",
    //   "project_description": "Our Direct Ocean Capture system runs with just two ingredients: seawater and renewable electricity. Using Captura’s proprietary electrodialysis and gas extraction technologies, it captures CO2 directly from seawater to be permanently stored or reused. The ocean then naturally draws down additional CO2 from the atmosphere to rebalance. The net result is the removal of excess CO2 from the atmosphere via the ocean, without adding anything to the ocean. The process creates no waste and requires minimal land and no fresh water. With CO2 150x more concentrated volumetrically in the ocean compared to air, this provides an inherently scalable and efficient way to remove atmospheric CO2.",
    //   "project_status": "Unregistered",
    //   "method": true,
    //   "certifier": "",
    //   "mcdr_type": "Direct ocean capture",
    //   "founding_year": 2021,
    //   "stage": "Series A",
    //   "current_funding": 64901250,
    //   "funding_requested": 0,
    //   "total_credits_issued": 0,
    //   "expected_credits": 11111000
    // },
    // {
    //   "id": 6,
    //   "longitude": 48.051936,
    //   "latitude": -123.025416,
    //   "company_name": "Ebb Carbon",
    //   "company_description": "Ebb Carbon works on electrochemical based ocean alkalinity enhancement. Explore their field trials in Sequim Bay Washington. \nOur mission is to remove gigatons of CO2 from the air while reducing ocean acidification to create a healthier planet for generations to come.\n\nFounded by leading scientists and climate technology veterans, we are a team of chemists, engineers, physicists, strategists, oceanographers, communicators, and more. We are driven by a shared passion to make a positive impact on climate change and ocean health. This enormous challenge requires deep collaboration and partnerships with scientists, academics, businesses, philanthropies, and communities so we can thoughtfully deploy Ebb Carbon's marine carbon dioxide removal solution together.",
    //   "website": "https://www.ebbcarbon.com/",
    //   "contact": "",
    //   "headcount": "11-50",
    //   "project_name": "Ebb Carbon",
    //   "project_description": "Ebb Carbon is pioneering a new carbon removal solution by enhancing the ocean’s natural ability to safely store CO2. Our electrochemical ocean alkalinity enhancement method has the potential to be one of the largest scale and lowest cost approaches to removing excess CO2, while reducing ocean acidity.",
    //   "project_status": "Unregistered",
    //   "method": true,
    //   "certifier": "",
    //   "mcdr_type": "Ocean alkalinity enhancement (electrochemical)",
    //   "founding_year": 2021,
    //   "stage": "Series A",
    //   "current_funding": 33800000,
    //   "funding_requested": 0,
    //   "total_credits_issued": 0,
    //   "expected_credits": 100000000
    // },
    // {
    //   "id": 7,
    //   "longitude": 37.065884,
    //   "latitude": -7.677796,
    //   "company_name": "Cyanocapture",
    //   "company_description": "Cyanocapture explores increasing microalgae carbon fixation rates with synthetic biology. CyanoCapture is a biotech company that began at the University of Oxford in 2021 using the world's fastest photosynthetic microbe to turn CO2 into recombinant proteins and graphite. The future of carbon capture is here. CyanoCapture's innovative technology brings the energy cost of capture to less than 400kWh/T CO2. CyanoCapture harnesses the power of synthetic biology to speed up CO2 fixation rates in robust fast-growing bacteria. These organisms are not only capable of consuming CO2 at unprecedented effiiciencies, but they can convert this into extractable high value compounds for multibillion dollar industries, at a fraction of the cost. ​ By generating useful high value compounds, our system enables industrial scale carbon sequestration in the form of graphite, to become a byproduct of an already profitable process. CyanoCapture is now able to not only modify the DNA of the bacteria to trick it into thinking that it needs to absorb more CO2 as quickly as possible, but in the process also make the cells pump out tiny amounts of very expensive molecules (called recombinant proteins) in the process, that we can pick and choose. We use a different technology to harvest these expensive molecules out of the bacteria at high purity, without any endotoxins, and sell it to the Biopharma industry. At the end of the process, there is a lot of dead bacteria left over. Instead of throwing away the debris, we harvest this too and heat it in a furnace without oxygen in a process called pyrolysis. This makes a special type of expensive carbon-rich material that can be used to make sodium-ion batteries. The money we make from selling small amounts of highly expensive secreted molecules is enough to keep the business profitable without selling any battery materials. But the dead bacteria that we co-produce from the captured carbon is an inevitable part of the process, containing thousands of tonnes worth of CO2. We are one of few technologies in the world that is able to combine manufacturing with durable carbon capture and storage. Our value proposition is simple. By making large-scale carbon capture a byproduct of an already profitable photosynthetic biomanufacturing process, we propose to make carbon capture entirely free for emitting industries around the world, and radically lower the cost of medicines in LMICs.",
    //   "website": "https://www.cyanocapture.com/",
    //   "contact": "partnerships@cyanocapture.com",
    //   "headcount": "11-50",
    //   "project_name": "COSEC",
    //   "project_description": "The aim of COSEC project (Biogenic CO2 capture into Sustainable Energy Carriers: A novel photosynthetic and hydrogenotrophic CO2 fixation combined with waste nutrient upcycling for production of carbon negative energy carriers) is to develop a disruptive nature-based solution for capture of CO2 directly from the effluent gases of bioenergy production systems with a concomitant strategy to upgrade the fixed CO2 (algae biomass) into sustainable liquid and gaseous energy carriers, and further integrate them into the bioenergy combustion system to attain a true carbon circularity. To achieve this: We will develop a novel photosynthetic platform for capturing biogenic CO2 into energy rich algae biomass using nutrients from waste streams. Specifically, we will focus on the development of resilient strains for improving their robustness to flue gas toxicity with concurrent ability to efficiently assimilate nutrients from waste streams. Simultaneously, we will develop innovative, cost-effective and sustainable biomass production & pretreatment methods to enhance energy content and remove nitrogen suiting biocrude and biogas production. We will upgrade the captured CO2 (algae biomass) into two widely used renewable energy carriers; biocrude and biogas, maintaining the highest technical efficiency. Special attention will be given to improving the efficiency of existing bioconversion processes to best suit the algae biomass conversion with synchronised valorisation of byproducts (hydrochar and digestates), and recycling of the aqueous nutrient stream and off-gas in order to improve the sustainability of the process. We will develop affordable and efficient methods for biocrude and biogas upgrading into biofuel and biomethane using renewable H. Special focus will be given to improving efficiency of catalytic hydrotreatment of biocrude, and innovative renewable H assisted gas-to-cell bioreactors for biomethane production.",
    //   "project_status": "Unregistered",
    //   "method": true,
    //   "certifier": "",
    //   "mcdr_type": "Biomass growing/harvesting/sinking",
    //   "founding_year": 2021,
    //   "stage": "Seed",
    //   "current_funding": 8843377,
    //   "funding_requested": 0,
    //   "total_credits_issued": 0,
    //   "expected_credits": 70000000
    // },
    // {
    //   "id": 8,
    //   "longitude": 53.791334,
    //   "latitude": -113.634878,
    //   "company_name": "Equatic",
    //   "company_description": "Equatic uses an electrolytic process which directly captures carbon dioxide from the ocean converting it into solid carbonate. Explore their field trials in the Port of LA and Singapore. The world faces two unprecedented challenges: reducing reliance on fossil fuels and removing legacy carbon emissions from the atmosphere. Equatic is the only carbon removal company that tackles both. Created from more than a decade of research and development at UCLA’s Samueli School of Engineering, the patented technology accelerates the ocean’s inherent ability to absorb and permanently store massive amounts of carbon while simultaneously producing carbon-negative hydrogen. Mobilizing Equatic technology at commercial scale will help solve the world’s most urgent climate challenge, while creating immense value for industries and communities. Equatic is a carbon removal company leading the industry in combined carbon dioxide removal and green hydrogen generation. Using a patented seawater electrolysis process, Equatic activates and amplifies the ocean’s inherent ability to absorb and store massive amounts of carbon using technology created and developed at the UCLA Samueli School of Engineering’s Institute for Carbon Management. Equatic works with industry pioneers, national agencies, and government leadership to scale climate solutions at unprecedented rates. The company sells high-integrity carbon removal credits and is the only ocean-based carbon removal company that measures removal with unprecedented certainty.",
    //   "website": "https://www.equatic.tech/",
    //   "contact": "contact@equatic.tech",
    //   "headcount": "11-50",
    //   "project_name": "Deep Sky",
    //   "project_description": "Montreal-based Deep Sky is the world's first IP agnostic carbon removal project developer aiming to remove gigatons of carbon from the atmosphere and permanently store it underground. As a project developer, Deep Sky brings together the most promising direct air and ocean carbon capture companies under one roof to bring the largest supply of high quality carbon credits to the market and commercialize carbon removal and storage solutions like never before. With $75M in funding, Deep Sky is backed by world class investors including Investissement Québec, Brightspark Ventures, Whitecap Venture Partners, OMERS Ventures, BDC Climate Fund, and more. For more information, visit deepskyclimate.com.",
    //   "project_status": "Unregistered",
    //   "method": true,
    //   "certifier": "",
    //   "mcdr_type": "Direct ocean capture",
    //   "founding_year": 2022,
    //   "stage": "Seed",
    //   "current_funding": 75000000,
    //   "funding_requested": 0,
    //   "total_credits_issued": 0,
    //   "expected_credits": 3109500
    // },
    // {
    //   "id": 9,
    //   "longitude": 29.254018,
    //   "latitude": -91.369931,
    //   "company_name": "Banyu Carbon",
    //   "company_description": "Banyu Carbon develops technology for direct removal of carbon dioxide with sunlight.",
    //   "website": "https://www.banyucarbon.com/",
    //   "contact": "info@banyucarbon.com",
    //   "headcount": "1-10",
    //   "project_name": "Frontier and Friday Harbor Labs",
    //   "project_description": "We aim to radically reduce the cost of carbon capture. By providing low cost and easily verified carbon credits to companies and governments with ambitious climate goals, we seek to avoid the worst environmental impacts of climate change and hasten the transition to a net-zero carbon economy. Direct CO2 Removal with Light. Our process is designed to use sunlight to drive a chemical reaction that causes CO2 to be released from seawater. Since only a small fraction of the sunlight is needed for the chemistry, the remainder is used to generate solar electricity.The liberated CO2 can be stored in geologic formations or used by industry. The organic compounds at the heart of our process are easy to synthesize from simple starting materials and contain no metals or rare elements.",
    //   "project_status": "Unregistered",
    //   "method": true,
    //   "certifier": "",
    //   "mcdr_type": "Direct ocean capture",
    //   "founding_year": 2022,
    //   "stage": "Seed",
    //   "current_funding": 8400000,
    //   "funding_requested": 0,
    //   "total_credits_issued": 0,
    //   "expected_credits": 350000000
    // },
    // {
    //   "id": 10,
    //   "longitude": 44.677914,
    //   "latitude": -63.600048,
    //   "company_name": "Planetary Technologies",
    //   "company_description": "Planetary Technology uses ocean alkalinity enhancement to neutralize carbon dioxide and reduce ocean acidity. Explore their field trials in Chesapeake Bay and Halifax Harbour.",
    //   "website": "https://www.planetarytech.com/",
    //   "contact": "NovaScotia_Project@planetarytech.com",
    //   "headcount": "11-50",
    //   "project_name": "MRV 3.0",
    //   "project_description": "Planetary’s MRV, or Monitoring, Reporting, and Verification protocol, describes our processes for measuring both total carbon removal and the lifetime carbon cost of running the project. The published MRV contains a standardised set of methodologies for our quantification process, and was developed to ensure that our net carbon removal estimates are accurate, unbiased, and as precise as possible. The document also discusses our processes for assessing ecological impacts. Planetary’s OAE MRV protocol, one of the first created for marine CDR projects, was developed in the first half of 2022. It was reviewed by independent experts and accepted by our customer Shopify in order order to issue credits against their August 2022 purchase.",
    //   "project_status": "Unregistered",
    //   "method": true,
    //   "certifier": "",
    //   "mcdr_type": "Ocean alkalinity enhancement (mineral)",
    //   "founding_year": 2019,
    //   "stage": "Series A",
    //   "current_funding": 15800000,
    //   "funding_requested": 0,
    //   "total_credits_issued": 0,
    //   "expected_credits": 500000
    // },
    // {
    //   "id": 11,
    //   "longitude": 44.660989,
    //   "latitude": -63.543688,
    //   "company_name": "Carbon Run",
    //   "company_description": "Carbon Run adds alkalinity to rivers which delivers trapped terrestrial carbon to the ocean for storage. \nFounded in Nova Scotia by environmental scientists and freshwater ecologists, our team of global experts is dedicated to combating climate change through innovative river restoration techniques. With deep expertise spanning environmental science, engineering, and sustainability, we work collaboratively to restore damaged ecosystems, protect aquatic life, and enhance biodiversity—creating a healthier planet for future generations.",
    //   "website": "https://www.carbonrun.io/",
    //   "contact": "info@carbonrun.io",
    //   "headcount": "11-50",
    //   "project_name": "Carbon Run",
    //   "project_description": "Introducing River Alkalinity Enhancement (RAE), CarbonRun’s novel carbon removal solution that also restores river health and boosts local fish populations. Rivers, crucial to carbon cycles, are increasingly acidified as a result of pollution and acid rain, harming fish populations and releasing CO₂ prematurely. By adding alkaline minerals into these vulnerable rivers, Carbon Run traps the CO₂ into stable bicarbonate, and restores the rivers’ natural pH. Data mapping suggests the approach could achieve carbon removal costs below $100/t and be deployable globally at the gigatonne scale. With their decades of experience in river hydrology and river restoration projects, the team at Carbon Run are well-placed to implement this solution worldwide.",
    //   "project_status": "Unregistered",
    //   "method": true,
    //   "certifier": "",
    //   "mcdr_type": "Ocean alkalinity enhancement (mineral)",
    //   "founding_year": 2022,
    //   "stage": "Seed",
    //   "current_funding": 36633150,
    //   "funding_requested": 0,
    //   "total_credits_issued": 0,
    //   "expected_credits": 55000
    // },
    // {
    //   "id": 12,
    //   "longitude": 57.7089,
    //   "latitude": 11.9746,
    //   "company_name": "Arbon Earth",
    //   "company_description": "Arbon Earth works on cultivating and sinking macroalgae biomass. We help our customers to boost their sustainability agenda by removing carbon dioxide (CO2) from the atmosphere. Our design, the OceanPod, uses fast-growing bamboo, macroalgae and the vast oceans to create carbon sequestering micro-ecosystems. These will eventually sink to the sea floor by their own weight where they are buried in the sediment, for permanent storage for millions of years. Our OceanPods consist only of natural materials and require minimal labour during production. We collaborate with partners in coastal societies providing them an export income and we also build knowledge about the sea and the seafloor. It's simple, cost-effective, and vital for a healthy planet. Plus, the OceanPods nurture marine life, offering a spot for off-shore fish nurseries. A win-win for ecosystems!",
    //   "website": "https://arbon.earth/",
    //   "contact": "magnus@arbon.earth",
    //   "headcount": "1-10",
    //   "project_name": "Arbon Earth",
    //   "project_description": "Our design, the OceanPod, uses fast-growing bamboo, macroalgae and the vast oceans to create carbon sequestering micro-ecosystems. These will eventually sink to the sea floor by their own weight where they are buried in the sediment, for permanent storage for millions of years.",
    //   "project_status": "Unregistered",
    //   "method": true,
    //   "certifier": "ONCRA",
    //   "mcdr_type": "Biomass growing/harvesting/sinking",
    //   "founding_year": 2022,
    //   "stage": "Pre-Seed",
    //   "current_funding": 45000,
    //   "funding_requested": 0,
    //   "total_credits_issued": 0,
    //   "expected_credits": 132
    // },

// Function to search fundees by query
export function searchFundees(query: string): FundeeData[] {
  if (!query.trim()) return mockFundees;

  const lowercaseQuery = query.toLowerCase();

  return mockFundees.filter(fundee =>
    [
      fundee.company_name,
      fundee.mcdr_type,
      fundee.company_description,
      fundee.stage
    ]
      .filter(field => field !== null) // Ensure we don't call `.toLowerCase()` on null
      .some(field => field.toLowerCase().includes(lowercaseQuery))
  );
}

// Function to filter fundees
export function filterFundees(fundees: FundeeData[], filters: Record<string, string[]>): FundeeData[] {
  if (Object.keys(filters).length === 0) return fundees;

  return fundees.filter(fundee => {
    for (const [category, selectedOptions] of Object.entries(filters)) {
      if (selectedOptions.length === 0) continue;

      switch (category) {
        case "stage":
          if (!selectedOptions.includes(fundee.stage)) return false;
          break;
        case "mcdr_type":
          if (!selectedOptions.some(opt => fundee.mcdr_type.includes(opt))) return false;
          break;
        case "current_funding":
          if (!selectedOptions.includes(fundee.current_funding.toString())) return false;
          break;
        case "funding_requested":
          if (!selectedOptions.includes(fundee.funding_requested.toString())) return false;
          break;
        case "total_credits_issued":
          if (!selectedOptions.includes(fundee.total_credits_issued.toString())) return false;
          break;
        case "expected_credits":
          if (!selectedOptions.includes(fundee.expected_credits.toString())) return false;
          break;
        default:
          break;
      }
    }
    return true;
  });
}
