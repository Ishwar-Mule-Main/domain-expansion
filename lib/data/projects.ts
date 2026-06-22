export interface Metric {
  value: string;
  label: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  role: string;
}

export interface Project {
  slug: string;
  clientName: string;
  industry: string;
  title: string;
  tagline: string;
  categories: Array<"marketing" | "development" | "design" | "ai">;
  challengeHeadline: string;
  challengeDescription: string;
  approachDescription: string;
  executionDescription: string;
  resultsDescription: string;
  metrics: Metric[];
  testimonial?: Testimonial;
  duration: string;
  year: string;
  region: "India" | "International";
  lessons: string[];
}

export const projects: Project[] = [
  {
    slug: "polymint-prca",
    clientName: "PolyMint / PRCA",
    industry: "Events & Professional Network",
    title: "Multi-Market Professional Event Campaign",
    tagline: "2.08 Million Emails Bypassing Spam Filters Safely",
    categories: ["marketing", "ai", "design"],
    challengeHeadline: "Low Attendance & Deliverability Collapse",
    challengeDescription: "PolyMint in partnership with PRCA ran a multi-market professional event series across Asian markets and needed to fill seats. Previous email outreach attempts hit spam filters, leading to low open rates, zero attribution metrics, and flat registration counts.",
    approachDescription: "Domain Expansion engineered a reputation-safe sending lifecycle. We authenticated domain settings (SPF/DKIM/DMARC), warmed up IP paths, segmented the subscriber list by professional personas, and built a custom AI prompt matrix to draft personal subject lines.",
    executionDescription: "We dispatched 2.08 million emails in micro-batches to bypass spam traps. Concurrently, we wired n8n automation flows to scrape response forms and log details directly to our database, pushing registrants into automated SMS and WhatsApp confirmation streams.",
    resultsDescription: "Registrations jumped to 200+ across target markets. We protected email domain health throughout the high-volume outreach campaign, maintaining a high 38% average open rate and ensuring full campaign attribution.",
    metrics: [
      { value: "200+", label: "Registrations Generated" },
      { value: "2.08M", label: "Emails Delivered" },
      { value: "38%", label: "Average Open Rate" }
    ],
    testimonial: {
      quote: "Domain Expansion turned our event marketing around. The email deliverability strategy saved our domain reputation and filled the venue.",
      author: "PRCA Lead Organizer",
      role: "Director of Outreach"
    },
    duration: "3 Months",
    year: "2025",
    region: "International",
    lessons: [
      "IP warm-ups and authenticated records are mandatory for high-volume email campaigns.",
      "Segmented messaging beats general broadcasts every time.",
      "n8n form connectors remove registration delays completely."
    ]
  },
  {
    slug: "data-hat-ai",
    clientName: "Data-Hat AI",
    industry: "AI SaaS & Technology",
    title: "SaaS Launch Organic Traffic Strategy",
    tagline: "320% Organic Traffic Growth in 90 Days",
    categories: ["marketing", "development", "ai"],
    challengeHeadline: "High Paid Acquisition Costs & Zero Search Footprint",
    challengeDescription: "A US-based AI startup with a strong product had near-zero organic search visibility. Paid acquisition channels were their only traffic source, resulting in rising customer acquisition costs (CAC) and stagnant brand authority in a crowded space.",
    approachDescription: "We designed a technical SEO and Generative Engine Optimization (GEO) blueprint. We fixed Core Web Vitals, rebuilt the web architecture on a fast Next.js server shell, and engineered topic clusters targeting high-intent AI queries.",
    executionDescription: "We deployed schema markups and semantic HTML tags. Using a content pipeline, we published 30 authoritative articles answering developer bottlenecks and structured site schemas to ensure the brand appeared as a citation source in LLM search queries (ChatGPT, Gemini).",
    resultsDescription: "Organic sessions grew by 320% within 90 days. Over 200 high-intent keywords reached Page 1 search positions, shifting the traffic mix away from paid channels and paying back initial developer costs within two quarters.",
    metrics: [
      { value: "200+", label: "Page 1 Keywords" },
      { value: "+320%", label: "Organic Traffic Growth" },
      { value: "6 Mo", label: "Investment Payback" }
    ],
    testimonial: {
      quote: "Bypassing standard templates and focusing on speed and topical clusters gave us an organic traffic channel that continues to compound.",
      author: "Soren K.",
      role: "CEO, Data-Hat AI"
    },
    duration: "4 Months",
    year: "2025",
    region: "International",
    lessons: [
      "Technical code speed (TTFB) directly affects search crawl frequencies.",
      "Optimizing site schemas (GEO/AIO) guarantees citations in AI search interfaces.",
      "Topic clusters compound traffic faster than disjointed articles."
    ]
  },
  {
    slug: "akc-foods",
    clientName: "AKC Foods",
    industry: "Food & Beverage Retail",
    title: "Branded Social Media Design System",
    tagline: "3.4x Social Engagement Lift and Lower Cost Per Click",
    categories: ["design", "marketing"],
    challengeHeadline: "Inconsistent Ad Visuals & Rising Ad Costs",
    challengeDescription: "An Indian F&B brand struggled with inconsistent creative layouts. Graphic posts felt ad-hoc, and paid ad variations suffered from quick audience fatigue, leading to rising Cost Per Click (CPC) metrics and flat follower metrics.",
    approachDescription: "Domain Expansion constructed a branded visual system. We designed reusable templates for social feeds, stories, and video thumbnails, and established a testing matrix to quickly identify winning ad layouts.",
    executionDescription: "We designed a unified color palette and typography system in Figma. Every week we ran structured creative tests on Meta Business Suite, killing fatigue loops by swapping image borders and layout text.",
    resultsDescription: "Social engagement metrics rose 3.4x.Followers grew by 210% over the campaign footprint, and ad creative testing cut blended CPC by 28% by weeding out underperforming designs.",
    metrics: [
      { value: "3.4x", label: "Engagement Lift" },
      { value: "+210%", label: "Follower Growth" },
      { value: "-28%", label: "Blended CPC Cut" }
    ],
    duration: "2 Months",
    year: "2024",
    region: "India",
    lessons: [
      "Cohesive brand rules increase visual authority on feeds.",
      "A/B creative testing turns design assets into a performance metric.",
      "Visual thumbnails dictate video click-through indicators."
    ]
  },
  {
    slug: "rocomamas",
    clientName: "RocoMamas",
    industry: "Casual Dining & Retail",
    title: "Appetite-Led Creative Social Assets",
    tagline: "180% Organic Reach Growth via Shareable Visuals",
    categories: ["design", "marketing"],
    challengeHeadline: "Low Share Rates & Dry Photographic Copy",
    challengeDescription: "A popular casual-dining brand needed scroll-stopping, appetite-driven social creative. Generic burger photos failed to drive shares, saves, or footfall intent, resulting in flat engagement rates.",
    approachDescription: "We shifted the visual strategy toward high-contrast food layouts, bold display typography, and motion graphic loops designed specifically to encourage saves and shares (the algorithmic multipliers).",
    executionDescription: "We produced high-contrast creative posts, short motion banners, and optimized publication schedules to align with peak lunch and dinner search windows, embedding localized offers directly into the graphic frames.",
    resultsDescription: "Organic reach metrics expanded by 180%, and content saves jumped 5x. Local store-visit intent indicators verified a doubling of footfall inquiries during campaign weeks.",
    metrics: [
      { value: "+180%", label: "Organic Reach Growth" },
      { value: "5x", label: "Content Saves Jump" },
      { value: "2.1x", label: "Store-Visit Intent" }
    ],
    duration: "3 Months",
    year: "2024",
    region: "India",
    lessons: [
      "Designing for saves and shares unlocks algorithmic distribution.",
      "High-contrast visual styling outcompetes flat photography.",
      "Time-targeted posts capture organic intent during buying decisions."
    ]
  },
  {
    slug: "lucid-colloids",
    clientName: "Lucid Colloids",
    industry: "B2B Manufacturing",
    title: "Technical B2B Thought Leadership Design",
    tagline: "LinkedIn Reach Lift and Inbound Pipeline Creation",
    categories: ["design", "marketing"],
    challengeHeadline: "Invisible B2B Brand & Dry Technical Reports",
    challengeDescription: "A large B2B hydrocolloids manufacturer needed digital credibility. Their technical achievements were locked in dry text files, leaving their brand invisible to international corporate buyers.",
    approachDescription: "Domain Expansion translated complex chemical applications into clean, authoritative B2B graphic guides, explainer carousels, and LinkedIn thought leadership templates.",
    executionDescription: "We designed slide carousels explaining product properties, structured whitepapers, and established a consistent publishing pipeline on LinkedIn to target procurement managers.",
    resultsDescription: "LinkedIn impressions expanded by 260%, and profile visits jumped 3.2x, leading directly to 40+ qualified corporate inbound inquiries within two quarters.",
    metrics: [
      { value: "+260%", label: "LinkedIn Impressions" },
      { value: "3.2x", label: "Profile Visits" },
      { value: "40+", label: "Corporate Inquiries" }
    ],
    duration: "4 Months",
    year: "2024",
    region: "India",
    lessons: [
      "Technical B2B buyers convert on visual data, not taglines.",
      "LinkedIn carousels double engagement rates over text posts.",
      "Clear direct CTAs reduce procurement inquiry loops."
    ]
  },
  {
    slug: "emporis",
    clientName: "Sai Proviso Emporis",
    industry: "Real Estate & Construction",
    title: "High-Intent Real Estate Lead Generation",
    tagline: "320 Qualified Leads Billed at 41% Lower Cost",
    categories: ["marketing", "design"],
    challengeHeadline: "High Ad Spend & Unqualified Clicks",
    challengeDescription: "A premium real estate developer spent heavily on broad Facebook ads. The campaign returned high volumes of accidental clicks and unqualified phone contacts, resulting in low site visit rates and high sales overhead.",
    approachDescription: "We tightened audience boundaries to high-income target areas, designed project landing pages with explicit qualification filters, and automated lead routing systems.",
    executionDescription: "We launched localized campaigns showing project highlights, routed leads to WhatsApp APIs, and synced contact logs with the sales CRM database instantly using Make automation nodes.",
    resultsDescription: "Generated 320 qualified leads while cutting blended cost-per-lead (CPL) by 41%. The lead-to-site-visit rate reached a high 22% due to instant callback routing.",
    metrics: [
      { value: "320+", label: "Qualified Leads Logged" },
      { value: "-41%", label: "Cost-Per-Lead Cut" },
      { value: "22%", label: "Lead-To-Visit Rate" }
    ],
    duration: "3 Months",
    year: "2025",
    region: "India",
    lessons: [
      "Form qualification parameters weed out accidental clicks.",
      "Real-time CRM routing increases speed-to-call conversions.",
      "Detailed project specifications on landing pages qualify buyers early."
    ]
  },
  {
    slug: "cropwings",
    clientName: "CropWings",
    industry: "Agri-Tech & Drone Services",
    title: "Agri-Tech Platform Speed & SEO Rebuild",
    tagline: "43% Organic Session Growth on a 1.9s Page Load",
    categories: ["development", "marketing"],
    challengeHeadline: "Slow Page Loads & Weak Local Search Footprint",
    challengeDescription: "An agri-tech brand providing drone services suffered from a slow website. High bounce rates and weak local search visibility prevented farmers and corporate partners from booking drone services.",
    approachDescription: "We rebuilt the platform using Next.js to optimize crawl speeds and Core Web Vitals, and implemented structured schema markups mapping local agri-service regions.",
    executionDescription: "We optimized image sizes, deferred heavy JavaScript bundles, and deployed structured schema files, pairing the code update with on-page local keyword target strategies.",
    resultsDescription: "Organic traffic expanded by 43%. Landing page Largest Contentful Paint (LCP) was reduced to 1.9s, and Lighthouse performance scores reached 90+ across devices.",
    metrics: [
      { value: "+43%", label: "Organic Traffic Growth" },
      { value: "1.9s", label: "LCP Load Speed" },
      { value: "90+", label: "Lighthouse Score" }
    ],
    duration: "2 Months",
    year: "2025",
    region: "India",
    lessons: [
      "Page speed (LCP) directly affects conversion rates and search rankings.",
      "Structured local schemas help target regional service keywords.",
      "Decoupling script loading prevents main-thread rendering blocks."
    ]
  },
  {
    slug: "kubera",
    clientName: "Kubera",
    industry: "Consumer Retail",
    title: "E-Commerce Architecture & Checkout Optimization",
    tagline: "2.6x E-Commerce Conversion Lift and Larger Orders",
    categories: ["development", "design"],
    challengeHeadline: "Cart Abandonment & Slow Checkout Flow",
    challengeDescription: "A consumer brand moving from a product catalog to online e-commerce suffered from high cart abandonment rates. A clunky checkout flow and slow page loads frustrated buyers, resulting in low order values.",
    approachDescription: "We designed a conversion-first shopping experience. We simplified checkout steps, integrated payment interfaces, and built cross-sell recommendations directly into the cart templates.",
    executionDescription: "We coded an optimized storefront using fast React state hooks, streamlined cart drawer routes, and set up real-time analytics to track checkout bottleneck segments.",
    resultsDescription: "Storefront conversion rates rose 2.6x. Cart abandonment dropped by 34%, and average order value (AOV) expanded by 58% due to cross-sell integrations.",
    metrics: [
      { value: "2.6x", label: "Conversion Rate Boost" },
      { value: "-34%", label: "Cart Abandonment Cut" },
      { value: "+58%", label: "Average Order Value" }
    ],
    duration: "4 Months",
    year: "2025",
    region: "India",
    lessons: [
      "Reducing checkout fields cuts transaction friction immediately.",
      "In-cart product recommendations scale order values naturally.",
      "Fast storefront loading (SSR) prevents buyer drop-offs."
    ]
  },
  {
    slug: "kubera-communications",
    clientName: "Kubera Communications",
    industry: "Professional Services",
    title: "Next.js Corporate Hub & Lead Funnel",
    tagline: "4x Qualified Demo Requests on a 1.2s Page Load",
    categories: ["development", "marketing"],
    challengeHeadline: "Dry Brand Layout & Stagnant Inquiry Pipeline",
    challengeDescription: "A communications firm relied on an outdated website. The site lacked clear call-to-actions, failed to generate inbound inquiries, and suffered from slow server response times.",
    approachDescription: "We designed a modern Next.js corporate portal, created a booking path for demo inquiries, and optimized server configurations to slash load times.",
    executionDescription: "We rebuilt the site, integrated scheduling pipelines, and launched targeted search campaigns to drive high-intent corporate traffic to the main CTA blocks.",
    resultsDescription: "Demo bookings jumped 4x. Qualified inbound traffic grew by 150%, and server Time to First Byte (TTFB) fell to a fast 1.2s.",
    metrics: [
      { value: "+150%", label: "Qualified Traffic Growth" },
      { value: "4x", label: "Demo Requests Multiplier" },
      { value: "1.2s", label: "Server TTFB Speed" }
    ],
    duration: "3 Months",
    year: "2025",
    region: "India",
    lessons: [
      "A fast, modern site builds instant brand credibility.",
      "Direct scheduling loops increase demo booking rates.",
      "Paid search converts better when routed to fast pages."
    ]
  },
  {
    slug: "nahl",
    clientName: "Nahl",
    industry: "E-Commerce & Fashion",
    title: "Hyper-Optimized Paid Acquisition Landing Pages",
    tagline: "4.1x Return on Ad Spend via Conversion Landing Pages",
    categories: ["marketing", "development"],
    challengeHeadline: "Mediocre ROAS & High Cost-Per-Acquisition",
    challengeDescription: "A growing fashion brand scaled its paid ad budget but struggled with low conversion rates. A generic storefront landing template resulted in a poor Return on Ad Spend (ROAS) and high acquisition costs.",
    approachDescription: "We aligned campaigns with optimized landing pages. We built fast, product-specific grids, refined target audiences, and initiated a continuous conversion rate testing loop.",
    executionDescription: "We deployed custom Next.js landing pages, restructured campaigns, and analyzed click-through metrics to prune underperforming ad variations.",
    resultsDescription: "Blended campaign ROAS reached 4.1x. Cost-Per-Acquisition (CPA) fell by 29%, and landing page conversion rates expanded by 63%.",
    metrics: [
      { value: "4.1x", label: "Return on Ad Spend" },
      { value: "-29%", label: "Cost-Per-Acquisition Cut" },
      { value: "+63%", label: "Landing Page CVR Lift" }
    ],
    duration: "3 Months",
    year: "2025",
    region: "International",
    lessons: [
      "Hyper-focused product landing pages convert better than generic homepages.",
      "Restructuring ad groups cut wasted click spend.",
      "Continuous page checks maintain conversion efficiency."
    ]
  },
  {
    slug: "agristox",
    clientName: "AgriStox",
    industry: "Agri-Commerce B2B",
    title: "Cross-Platform Mobile App & Shared Design System",
    tagline: "12,000 App Installs with 45% Support Ticket Drop",
    categories: ["development", "marketing"],
    challengeHeadline: "UX Friction & High Support Overhead",
    challengeDescription: "A B2B agricultural trading portal suffered from user drop-offs. Traders struggled with a complex onboarding flow, leading to high support overhead and low trading volumes.",
    approachDescription: "We unified the experience under a shared design system, designed a simplified mobile application onboarding path, and automated trader verification steps.",
    executionDescription: "We coded the app using React Native, built a web portal sharing design tokens, and launched target regional marketing campaigns to drive local app installations.",
    resultsDescription: "Secured 12,000 app installs with a 4.6★ store rating. Clearer user paths cut customer support ticket volumes by 45%.",
    metrics: [
      { value: "12k+", label: "App Installs Logged" },
      { value: "4.6★", label: "Google Play Rating" },
      { value: "-45%", label: "Support Tickets Cut" }
    ],
    duration: "5 Months",
    year: "2025",
    region: "India",
    lessons: [
      "Shared design tokens accelerate multi-platform code updates.",
      "Clear onboarding screens cut support tickets immediately.",
      "Targeted regional ads drive app installations cost-effectively."
    ]
  },
  {
    slug: "organoindia",
    clientName: "Organoindia",
    industry: "Organic Food & D2C",
    title: "D2C Retention Design & Email Lifecycles",
    tagline: "210% Online Revenue Growth via Retention Engineering",
    categories: ["development", "marketing"],
    challengeHeadline: "High Acquisition Cost & Low Customer Retention",
    challengeDescription: "An organic product brand faced rising acquisition costs. A low repeat purchase rate threatened brand growth, requiring a pivot from paid ads toward lifecycle retention channels.",
    approachDescription: "We built automated customer retention loops. We designed post-purchase emails, WhatsApp subscription sequences, and optimized the online store for repeat orders.",
    executionDescription: "We integrated Klaviyo, coded automated win-back workflows, and added subscription models to the product pages.",
    resultsDescription: "Online revenue expanded by 210%. Repeat order rates rose 3.1x, and blended Customer Acquisition Cost (CAC) fell by 22% as retention carried growth.",
    metrics: [
      { value: "+210%", label: "Online Revenue Growth" },
      { value: "3.1x", label: "Repeat Purchase Rate" },
      { value: "-22%", label: "Blended CAC Cut" }
    ],
    duration: "4 Months",
    year: "2025",
    region: "India",
    lessons: [
      "Retention email automation is highly cost-effective.",
      "Subscriptions stabilize recurring revenue streams.",
      "Post-purchase thank-you codes increase repeat orders."
    ]
  },
  {
    slug: "meat-me-foods",
    clientName: "Meat Me Foods",
    industry: "F&B Delivery",
    title: "Hyperlocal Design & WhatsApp Inbound Funnel",
    tagline: "230% Lead Volume Growth on a 19% Lower Order Cost",
    categories: ["design", "marketing"],
    challengeHeadline: "Low Local Conversion & Complex Order Flows",
    challengeDescription: "A localized meat-delivery brand faced flat sales. A complex cart checkout process and generic visual ads failed to convert local neighborhood search intent into orders.",
    approachDescription: "We launched appetite-driven visual ads paired with hyperlocal target parameters, and built a direct WhatsApp ordering channel to bypass checkout steps.",
    executionDescription: "We designed high-contrast food banners, set up geo-targeted ad sets, and mapped a short click-to-WhatsApp link to route orders directly to the store team.",
    resultsDescription: "Hyperlocal lead volumes grew by 230%. Blended cost-per-order dropped by 19% as target reach expanded 4.5x.",
    metrics: [
      { value: "+230%", label: "Lead Inquiries Growth" },
      { value: "4.5x", label: "Hyperlocal Reach Lift" },
      { value: "-19%", label: "Cost-Per-Order Cut" }
    ],
    duration: "2 Months",
    year: "2024",
    region: "India",
    lessons: [
      "Localized WhatsApp links bypass complex checkout friction.",
      "Hyperlocal targeting optimizes small ad budgets.",
      "Appetite-focused photography converts buyers quickly."
    ]
  },
  {
    slug: "sahchi-united",
    clientName: "Sahchi United",
    industry: "Healthcare & Corporate Services",
    title: "Multi-Channel Corporate Demand Generation",
    tagline: "140% Inbound Lead Growth and Strong Brand Search Lift",
    categories: ["marketing"],
    challengeHeadline: "Low Inbound Consistency & Weak Brand Awareness",
    challengeDescription: "A corporate services firm struggled with an inconsistent inbound sales pipeline. A lack of brand awareness left them reliant on direct sales relationships, limiting growth.",
    approachDescription: "We designed a multi-channel demand campaign. We coordinated search ads, optimized corporate content, and aligned landing page forms to capture corporate intent.",
    executionDescription: "We launched targeted Google search campaigns, established a regular publishing calendar, and set up conversion tracking pixels.",
    resultsDescription: "Inbound leads grew by 140%. Conversion rates rose 2.4x, and branded search query volumes expanded by 35%.",
    metrics: [
      { value: "+140%", label: "Inbound Leads Growth" },
      { value: "2.4x", label: "Conversion Rate Boost" },
      { value: "+35%", label: "Branded Search Lift" }
    ],
    duration: "4 Months",
    year: "2024",
    region: "India",
    lessons: [
      "Google Search ads capture high-intent buyers effectively.",
      "Branded content arrays build long-term pipeline credibility.",
      "Conversion tracking is necessary to optimize ad spend."
    ]
  },
  {
    slug: "periship",
    clientName: "Periship",
    industry: "Logistics & Maritime",
    title: "Robust Corporate Web Platform & SEO Foundation",
    tagline: "99.9% Uptime and 120% Organic Leads Growth",
    categories: ["development", "marketing"],
    challengeHeadline: "Unreliable Site Hosting & Weak Corporate Discovery",
    challengeDescription: "A maritime logistics partner relied on an unstable site. Frequent server crashes hurt client trust, and a weak search footprint limited inbound discovery.",
    approachDescription: "We built a secure, serverless platform on Next.js, set up robust status monitoring, and deployed technical schema configurations to rank for global shipping queries.",
    executionDescription: "We deployed the code on Vercel's global CDN network, optimized asset delivery, and ran structured search optimizations.",
    resultsDescription: "Maintained a 99.9% uptime record. Organic leads grew by 120%, and page LCP speeds settled at a fast 1.7s.",
    metrics: [
      { value: "99.9%", label: "Platform Uptime" },
      { value: "+120%", label: "Organic Leads Growth" },
      { value: "1.7s", label: "LCP Load Speed" }
    ],
    duration: "3 Months",
    year: "2025",
    region: "International",
    lessons: [
      "Serverless deployments eliminate standard server crash risks.",
      "Fast page loads build trust with corporate partners.",
      "Targeted schema markups index services for global queries."
    ]
  },
  {
    slug: "find-me-eats",
    clientName: "Find Me Eats",
    industry: "F&B Tech & Directory",
    title: "Food Discovery Directory & Dynamic Layouts",
    tagline: "18k Monthly Active Users on 3.3x Longer Sessions",
    categories: ["development", "marketing"],
    challengeHeadline: "High User Drop-offs & Slow Directory Search",
    challengeDescription: "A food directory app struggled with slow search results. Slow pages and database queries caused visitors to drop off, resulting in low session times.",
    approachDescription: "We optimized directory database queries, designed clean cards, and built a client-side search engine to deliver instant results.",
    executionDescription: "We configured Next.js ISR paths to cache pages, built responsive cards, and optimized layout files.",
    resultsDescription: "Secured 18,000 monthly active users (MAU). Average session duration grew 3.3x, and app ratings stabilized at 4.7★.",
    metrics: [
      { value: "18k+", label: "Monthly Active Users" },
      { value: "3.3x", label: "Session Duration Lift" },
      { value: "4.7★", label: "App Store Rating" }
    ],
    duration: "4 Months",
    year: "2025",
    region: "International",
    lessons: [
      "Caching static routes (ISR) speeds up directory page loads.",
      "Client-side search filters prevent loading delays.",
      "Simplified list designs improve mobile search interaction."
    ]
  },
  {
    slug: "reyleaf",
    clientName: "Reyleaf",
    industry: "Wellness & E-Commerce",
    title: "Organic Topical Authority SEO Program",
    tagline: "280% Organic Traffic Lift via Topic Clusters",
    categories: ["marketing"],
    challengeHeadline: "Stagnant Brand Footprint & High Paid Dependency",
    challengeDescription: "A wellness brand relied entirely on paid social ads. They had no organic search presence, leaving their margins vulnerable to ad cost spikes.",
    approachDescription: "We built an organic search channel. We mapped educational content, optimized page schemas, and built topical clusters to answer buyer questions.",
    executionDescription: "We published targeted articles, resolved crawl errors in Search Console, and acquired high-authority category links.",
    resultsDescription: "Organic traffic expanded by 280%. Over 60 high-intent keywords reached Page 1 search rankings, increasing organic leads by 90%.",
    metrics: [
      { value: "+280%", label: "Organic Traffic Growth" },
      { value: "60+", label: "Keywords Page 1" },
      { value: "+90%", label: "Inbound Leads Growth" }
    ],
    duration: "4 Months",
    year: "2025",
    region: "India",
    lessons: [
      "Answering search questions generates high-intent buyer traffic.",
      "Resolving crawl errors helps search engine bots index content fast.",
      "Organic traffic reduces dependency on paid advertising channels."
    ]
  },
  {
    slug: "house-escort",
    clientName: "House Escort",
    industry: "Relocation Services",
    title: "Conversion-Focused Relocation Portal",
    tagline: "175% Qualified Lead Growth with 31% Lower Bounce Rates",
    categories: ["development", "marketing"],
    challengeHeadline: "Confusing Layout & Unqualified Inquiries",
    challengeDescription: "A relocation service site suffered from a confusing layout. Visitors bounced quickly, and the few submitted forms lacked key details, wasting sales team time.",
    approachDescription: "We clarified the service offering, built conversion-focused page flows, and integrated qualification steps into the intake forms.",
    executionDescription: "We rebuilt the site interface, deployed clean form blocks, and launched local search campaigns targeting relocation intent.",
    resultsDescription: "Qualified inquiries grew by 175%. Conversion rates rose 2.8x, and site bounce rates dropped by 31%.",
    metrics: [
      { value: "+175%", label: "Qualified Lead Growth" },
      { value: "2.8x", label: "Conversion Rate Boost" },
      { value: "-31%", label: "Bounce Rate Cut" }
    ],
    duration: "3 Months",
    year: "2025",
    region: "India",
    lessons: [
      "Form-based qualification filters out low-intent leads.",
      "Clear value statements on heroes cut bounce rates.",
      "Simple page layouts guide visitors to contact blocks."
    ]
  },
  {
    slug: "whats-the-buz",
    clientName: "Whats The Buz",
    industry: "Media & Entertainment",
    title: "Viral Reach Content & Social Design",
    tagline: "400% Reach Lift and 6x Shares via Dynamic Layouts",
    categories: ["marketing", "design"],
    challengeHeadline: "Flat Reach & Low Content Engagement",
    challengeDescription: "A digital media brand struggled to expand its audience. Standard posts failed to drive shares, comments, or followers in a crowded feed.",
    approachDescription: "We designed high-energy social layouts and motion templates, focusing on highly shareable hooks and trending topics.",
    executionDescription: "We built custom Instagram templates in Figma, launched a rapid publication calendar, and optimized reels styling.",
    resultsDescription: "Expanded overall reach by 400%. Follower growth grew by 120%, and content shares rose 6x.",
    metrics: [
      { value: "+400%", label: "Overall Reach Lift" },
      { value: "6x", label: "Content Shares Jump" },
      { value: "+120%", label: "Follower Growth" }
    ],
    duration: "3 Months",
    year: "2024",
    region: "India",
    lessons: [
      "Share-native templates are key to viral distribution loops.",
      "Reel styling hooks capture early user attention.",
      "Consistent publishing frequencies maintain algorithmic reach."
    ]
  },
  {
    slug: "snag-parking",
    clientName: "SNAG Parking",
    industry: "Logistics & Smart City",
    title: "Smart Parking Web App & Acquisition",
    tagline: "25,000 App Installs with 50% Lower Booking Friction",
    categories: ["development", "marketing", "design"],
    challengeHeadline: "High Onboarding Friction & Low App Installs",
    challengeDescription: "A parking booking application suffered from booking drop-offs. A complex sign-up flow and low brand awareness limited installations and transactions.",
    approachDescription: "We redesigned the booking flow, unified web and mobile apps under a shared design system, and launched install campaigns.",
    executionDescription: "We coded custom frontend screens, built a fast booking state machine, and launched localized search ads targeting parking constraints.",
    resultsDescription: "Secured 25,000 app installs. Booking friction dropped by 50%, maintaining a high 4.5★ rating on app stores.",
    metrics: [
      { value: "25k+", label: "App Installs Logged" },
      { value: "-50%", label: "Booking Friction Cut" },
      { value: "4.5★", label: "App Store Rating" }
    ],
    duration: "4 Months",
    year: "2025",
    region: "India",
    lessons: [
      "Simplified checkout steps directly improve app transaction rates.",
      "Targeted local search ads drive downloads cost-effectively.",
      "Consistent app visuals reduce user onboarding friction."
    ]
  },
  {
    slug: "teegolf",
    clientName: "Teegolf",
    industry: "Leisure & Sport Retail",
    title: "Integrated SEO & Booking Optimization Campaign",
    tagline: "3.5x Bookings Multiplier and 190% Traffic Growth",
    categories: ["marketing", "development"],
    challengeHeadline: "Weak Search Visibility & Low Booking Rates",
    challengeDescription: "A golf reservation brand lacked search presence. A confusing layout and slow booking pages prevented local golfers from reserving tee times.",
    approachDescription: "We built an SEO program and optimized the booking path. We ranked for reservation queries and built a responsive scheduling flow.",
    executionDescription: "We ran on-page SEO sprints, optimized asset files, and deployed a fast booking page to capture high-intent golfers.",
    resultsDescription: "Bookings rose 3.5x. Organic search traffic expanded by 190%, with 50+ keywords reaching Page 1 search rankings.",
    metrics: [
      { value: "+190%", label: "Organic Traffic Growth" },
      { value: "3.5x", label: "Bookings Multiplier" },
      { value: "50+", label: "Keywords Page 1" }
    ],
    duration: "3 Months",
    year: "2025",
    region: "International",
    lessons: [
      "Booking pages must load quickly on mobile networks.",
      "Targeting activity reservation queries captures intent-ready golfers.",
      "A simplified scheduling layout drives direct conversions."
    ]
  }
];
