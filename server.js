const http = require("node:http");
const fs = require("node:fs/promises");
const nativeFs = require("node:fs");
const path = require("node:path");
const crypto = require("node:crypto");

const ROOT = __dirname;
try {
  const envFile = nativeFs.readFileSync(path.join(ROOT, ".env"), "utf8");
  for (const line of envFile.split(/\r?\n/)) {
    const entry = line.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (entry && process.env[entry[1]] === undefined) process.env[entry[1]] = entry[2].replace(/^(['"])(.*)\1$/, "$2");
  }
} catch (error) {
  if (error.code !== "ENOENT") throw error;
}
const DATA_FILE = process.env.DATA_FILE || path.join(ROOT, "data", "anand-jewels.json");
const DATA_DIR = path.dirname(DATA_FILE);
const PORT = Number(process.env.PORT || 3000);
const SESSION_TTL = 8 * 60 * 60 * 1000;
const sessions = new Map();
const loginAttempts = new Map();

const initialData = {
  content: {
    settings: {
      siteName: "Anand Jewels",
      tagline: "Beautiful Jewels at Honest Prices",
      description: "Anand Jewels – 15+ years of trust, 5 showrooms. Gold and diamond jewellery at honest prices.",
      homepageHeadline: "Beautiful Jewels at Honest Prices",
      featuredTitle: "Where\nBeauty\nmeets with\nStyle",
      heroImage: "home-hero.jpg",
      headerLogoImage: "anand-crowned-monogram-white.png",
      showroomBannerImage: "showroom-banner.jpg",
      yearsOfTrust: "15",
      teamMembers: "400",
      yearsLabel: "Years of Trust",
      showroomsLabel: "Showrooms",
      teamLabel: "Team Members",
      chipClassics: "Timeless Classics",
      chipPersonalized: "Personalized Perfection",
      chipStatement: "Statement Elegance",
      chipFinest: "India’s Finest",
      homepageQuote: "Jewellery is a celebration of life’s most meaningful moments.\nOur purpose is to make them brighter, with honesty, care and trust",
      quoteLinkText: "The Anand Insights",
      footerTagline: "Beautiful Jewels at Honest Prices",
      logoImage: "anand-golden-crest-logo.png",
      socialFacebook: "",
      socialInstagram: "",
      socialLinkedin: "",
      navHome: "Home",
      navAbout: "About Us",
      navCollection: "Collection",
      navContact: "Contact Us",
      showroomCta: "Visit Our Showroom",
      contactTitle: "Let’s talk,\njewellery.",
      contactIntro: "Questions, custom designs, or planning a visit? Our team is happy to help.",
      storesTitle: "Our {count} Showrooms",
      storesDescription: "Step into Anand Jewels and discover a more personal jewellery experience."
    },
    about: {
      title: "About us",
      growthTitle: "THE STORY OF OUR GROWTH",
      journeyTitle: "The journey of beautiful Jewels",
      paragraphs: [
        "At Anand Jewels, we have always believed that the joy of owning beautiful jewellery should come with something equally precious — complete trust in what you are paying for. That belief has shaped us since 2015.",
        "For us, beautiful jewels are more than exquisite designs. They are pieces chosen with an eye for craftsmanship, quality and timeless appeal — jewellery made to celebrate today and remain meaningful for years to come.",
        "And honest prices are more than a promise. They reflect the way we believe jewellery should be offered: with transparency, fairness and a relationship with our customers that matters far beyond a single purchase.",
        "From gold and diamonds to Polki and silver, every collection at Anand Jewels carries this philosophy at its heart. As we have grown across Indore, Bhopal and Raipur, the scale of our world may have changed, but the principle behind it has remained remarkably simple: to bring you jewellery you will love, at a value you can trust.",
        "Because to us, that is what Beautiful Jewels at Honest Prices truly means.",
        "With a deep understanding of the jewellery industry and a passion for craftsmanship, Anand Jewels was envisioned as a brand where exceptional design and uncompromising quality are matched by an equally exceptional customer experience.",
        "What began as a vision has since grown into a brand shaped by relationships — with its customers, its craft and the generations that return to Anand Jewels for their most meaningful celebrations.",
        "The house continues to evolve while remaining firmly anchored in the values passed down through generations: quality without compromise, relationships built on trust, and jewellery created to endure beyond trends.",
        "The journey has never been about building a jewellery business alone. It is about carrying forward a legacy, strengthening a name people can believe in, and creating something meaningful for generations to come."
      ],
      milestones: [
        { year: "2015", title: "The First Anand Jewels Store at", location: "M.G. Road, Indore" },
        { year: "2020", title: "Anand Jewels in Bhopal", location: "DB Mall, Bhopal" },
        { year: "2022", title: "Anand Jewels Expands to", location: "Pandri, Raipur" },
        { year: "2024", title: "EISH by Anand Jewels at", location: "A.B. Road, Indore" },
        { year: "2025", title: "Flagship Store at", location: "Malviya Nagar, Bhopal" }
      ],
      stories: [
        { label: "Indore - 2015", title: "Where the Anand Jewels Story Began", body: "In 2015, Anand Jewels opened its doors on MG Road, Indore, marking the beginning of a new chapter in the Anand family’s jewellery legacy. Built around trust, transparency and a deeply personal approach to jewellery, the Indore showroom became the foundation of the Anand Jewels experience — bringing together thoughtful craftsmanship, refined design and relationships that extend far beyond a purchase.", image: "indore-showroom.png", alt: "Anand Jewels, Indore" },
        { label: "Bhopal - 2020", title: "Taking the Anand Experience Forward", body: "In 2020, Anand Jewels expanded to Bhopal with its showroom at DB Mall, bringing its philosophy of beautiful jewellery, honest relationships and personalised service to a new city. The showroom reflects the same commitment to quality and trust in an elegant, welcoming environment.", image: "db-city-showroom.jpg", alt: "Anand Jewels at DB Mall, Bhopal" },
        { label: "Raipur - 2022", title: "A New Chapter in a Growing Legacy", body: "The Anand Jewels journey reached Raipur in 2022 with the opening of its showroom at Pandri. Designed to offer a refined and personal jewellery experience, it carries forward the values at the heart of Anand Jewels — craftsmanship, transparency and relationships built to last.", image: "raipur-showroom.webp", alt: "Anand Jewels showroom in Raipur" },
        { label: "EISH - 2024 by Anand Jewels - Indore", title: "A Modern Expression of Fine Jewellery", body: "Created to make fine jewellery more relevant to the modern woman, EISH by Anand Jewels brings a contemporary perspective to the Anand legacy. Its exclusive 18-carat destination features refined collections in gold, natural diamonds and Polki, with versatile designs for modern, western and Indo-western dressing. Conceptualised by Ishika Anand, EISH reflects her vision of jewellery that feels effortless and individual while retaining Anand’s craftsmanship and trust.", image: "eish-showroom.jpg", alt: "EISH by Anand Jewels in Indore" },
        { label: "Bhopal - 2025", title: "Taking the Anand Experience Forward", body: "In 2025, Anand Jewels opened its flagship store at Malviya Nagar, Bhopal, marking an important new chapter in the brand’s journey. The flagship brings together refined interiors, personalised service, craftsmanship and the trust that has shaped Anand Jewels over the years — a destination created for meaningful celebrations, lasting relationships and generations to come.", image: "bhopal-flagship.png", alt: "Anand Jewels flagship store in Bhopal" }
      ]
    },
    collection: {
      eyebrow: "ANAND JEWELS · THE COLLECTION",
      title: "Our Collection",
      subtitle: "Crafted for Every Story",
      description: "From timeless traditions to contemporary expressions, discover jewellery created with thoughtful design, refined craftsmanship and the trust of Anand Jewels.",
      signoff: "Beautiful Jewels at Honest Prices",
      browseTitle: "Explore every design",
      browseDescription: "Filter the collection to find a piece that feels like you.",
      designsTitle: "More designs to discover",
      designsDescription: "Explore additional pieces from the Anand Jewels collection.",
      priceNote: "*Indicative prices at demo rates. Final price is confirmed at the showroom.",
      stories: [
        { name: "DIAMOND", title: "Brilliance Refined.", cta: "Explore Diamond Jewellery", image: "collection-diamond-reference.jpg", alt: "Diamond and emerald necklace on red fabric", paragraphs: ["Elegant, contemporary and effortlessly timeless, our diamond jewellery is designed to celebrate life's most meaningful moments.", "From understated everyday pieces to striking occasion jewellery, every creation brings together refined design, exceptional craftsmanship and enduring brilliance."] },
        { name: "POLKI", title: "Tradition, Reimagined.", cta: "Explore Polki Jewellery", image: "collection-polki-necklace.webp", alt: "Traditional Polki necklace with green stones and pearls", paragraphs: ["Rooted in heritage and crafted for today, our Polki jewellery celebrates the beauty of Indian craftsmanship through intricate details, graceful forms and timeless character.", "Designed for weddings, celebrations and moments meant to be remembered, each piece carries tradition forward with a distinctive Anand Jewels expression."] },
        { name: "GOLD", title: "Timeless by Nature.", cta: "Explore Gold Jewellery", image: "collection-gold-reference.jpg", alt: "Gold jewellery displayed against a warm neutral background", paragraphs: ["Gold has always been part of life's most cherished celebrations.", "Our gold jewellery blends classic craftsmanship with contemporary design, creating pieces that feel equally beautiful for everyday moments, festive occasions and generations to come."] }
      ]
    },
    insights: {
      title: "The Anand Insights",
      description: "Buying guides, care tips, trends and festive collections.",
      author: "Anand Jewels Editorial",
      articles: [
        { id: "gold-purity-guide", title: "Gold Purity Guide", category: "Buying Guide", excerpt: "Understand gold purity and choose the right karat for your jewellery.", body: "22K gold is 91.6% pure and 18K is 75%. Higher karat means richer colour but softer metal; lower karat is tougher for daily wear." },
        { id: "diamond-buying-guide", title: "Diamond Buying Guide", category: "Buying Guide", excerpt: "A thoughtful introduction to the 4Cs of buying a diamond.", body: "Judge a diamond on the 4Cs: cut, colour, clarity and carat. Cut affects sparkle the most." },
        { id: "jewellery-care-tips", title: "Jewellery Care Tips", category: "Care", excerpt: "Simple ways to protect the jewellery you love.", body: "Store pieces separately, keep them away from perfume and water, and wipe with a soft cloth after wearing." }
      ]
    },
    policies: [
      { id: "privacy", title: "Privacy Policy", body: "We collect only the details you submit (name, phone, email) to answer enquiries and bookings, and handle them as per applicable Indian data protection requirements." },
      { id: "terms", title: "Terms of Use", body: "Images and rates shown are indicative. The final price is confirmed at the showroom." },
      { id: "shipping", title: "Shipping, Returns and Exchange", body: "Shipping, return, exchange and price-transparency policies will be added here as approved by Anand Jewels." },
      { id: "hallmark", title: "Hallmarking and Certification", body: "Our jewellery carries BIS hallmark and purity assurance. Certificates are available on request." },
      { id: "cookie", title: "Cookie Notice", body: "We use cookies for analytics and to remember your preferences." }
    ]
  },
  designs: [
    { id: "ruby-velvet-necklace", name: "Ruby Velvet Necklace", category: "Necklaces", image: "collection-ruby-velvet-necklace.webp" },
    { id: "floral-pendant-design", name: "Floral Pendant Design", category: "Pendants", image: "collection-floral-pendant.webp" },
    { id: "diamond-necklace-set", name: "Diamond Necklace Set", category: "Necklaces", image: "collection-diamond-necklace-set.webp" },
    { id: "statement-necklace", name: "Statement Necklace", category: "Necklaces", image: "collection-statement-necklace.webp" },
    { id: "ranihar-antique-necklace", name: "Ranihar Antique Necklace", category: "Necklaces", image: "collection-ranihar-antique.webp" },
    { id: "emerald-teardrop-earrings", name: "Emerald Teardrop Earrings", category: "Earrings", image: "collection-emerald-teardrop-earrings.webp" },
    { id: "polki-necklace", name: "Polki Necklace", category: "Necklaces", image: "collection-polki-necklace.webp" }
  ],
  products: [
    { id: "1", name: "Diamond Necklace", category: "Necklaces", metal: "Gold", purity: 18, weight: 24.5, stone: "Diamond", image: "diamond-necklace.jpg", featured: true },
    { id: "2", name: "Heart Pendant", category: "Pendants", metal: "Gold", purity: 22, weight: 6.2, stone: "None", image: "heart-pendant.jpg", featured: true },
    { id: "3", name: "Drop Necklace", category: "Necklaces", metal: "Gold", purity: 22, weight: 32, stone: "None", image: "drop-necklace.jpg", featured: true },
    { id: "4", name: "Solitaire Ring", category: "Rings", metal: "Gold", purity: 18, weight: 5.4, stone: "Diamond", image: "solitaire-ring.jpg", featured: true },
    { id: "5", name: "Bridal Band", category: "Rings", metal: "Gold", purity: 22, weight: 8, stone: "None", image: "bridal-band.jpg", featured: true },
    { id: "6", name: "Chandelier Earrings", category: "Earrings", metal: "Gold", purity: 22, weight: 14, stone: "None", image: "chandelier-earrings.jpg", featured: true },
    { id: "7", name: "Diamond Studs", category: "Earrings", metal: "Gold", purity: 18, weight: 3.2, stone: "Diamond", image: "stud-earrings.jpg", featured: true },
    { id: "8", name: "Temple Bangles", category: "Bangles", metal: "Gold", purity: 22, weight: 40, stone: "None", image: "temple-bangles.jpg", featured: true },
    { id: "9", name: "Silver Kada", category: "Bangles", metal: "Silver", purity: 92.5, weight: 60, stone: "None", image: "", featured: false },
    { id: "10", name: "Diamond Pendant", category: "Pendants", metal: "Gold", purity: 18, weight: 4.1, stone: "Diamond", image: "heart-pendant.jpg", featured: false }
  ],
  showrooms: [
    { id: "1", name: "Bhopal Flagship", image: "bhopal-flagship.png", address: "19, Malviya Nagar, Bhopal, Madhya Pradesh 462003", hours: "Mon–Sun, 11:30 AM – 9:30 PM", rating: "4.9/5 (1,558 reviews)", phone: "+910000000000" },
    { id: "2", name: "Indore", image: "indore-showroom.png", address: "Address to be added", hours: "Timings to be added", rating: "", phone: "+910000000000" },
    { id: "3", name: "Raipur", image: "raipur-showroom.webp", address: "Address to be added", hours: "Timings to be added", rating: "", phone: "+910000000000" },
    { id: "4", name: "EISH by Anand Jewels", image: "eish-showroom.jpg", address: "Address to be added", hours: "Timings to be added", rating: "", phone: "+910000000000" },
    { id: "5", name: "Showroom · DB City Mall", image: "db-city-showroom.jpg", address: "DB City Mall, Zone-I, Arera Hills, Bhopal, Madhya Pradesh 462011", hours: "Mon–Sun, 11:45 AM – 9:30 PM", rating: "", phone: "+910000000000" }
  ],
  enquiries: []
};

function assertConfiguration() {
  if (!process.env.ADMIN_EMAIL || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(process.env.ADMIN_EMAIL)) {
    throw new Error("Set a valid ADMIN_EMAIL before starting the server.");
  }
  if (!process.env.ADMIN_PASSWORD || process.env.ADMIN_PASSWORD.length < 12) {
    throw new Error("Set an ADMIN_PASSWORD containing at least 12 characters before starting the server.");
  }
  if (!Number.isInteger(PORT) || PORT < 1 || PORT > 65535) throw new Error("PORT must be a valid TCP port.");
}

async function loadData() {
  await fs.mkdir(DATA_DIR, { recursive: true });
  try {
    const saved = JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
    const content = { ...structuredClone(initialData.content), ...(saved.content || {}) };
    for (const section of Object.keys(initialData.content)) {
      content[section] = { ...initialData.content[section], ...(saved.content?.[section] || {}) };
    }
    return {
      ...structuredClone(initialData),
      ...saved,
      designs: Array.isArray(saved.designs) ? saved.designs : structuredClone(initialData.designs),
      content
    };
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
    await saveData(initialData);
    return structuredClone(initialData);
  }
}

async function saveData(data) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  const temporary = `${DATA_FILE}.${crypto.randomUUID()}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(data, null, 2), { mode: 0o600 });
  await fs.rename(temporary, DATA_FILE);
}

let dataPromise = loadData();
let writeQueue = Promise.resolve();

function updateData(change) {
  const operation = writeQueue.then(async () => {
    const data = await dataPromise;
    const result = await change(data);
    await saveData(data);
    return result;
  });
  writeQueue = operation.catch(() => {});
  return operation;
}

function json(res, status, body, headers = {}) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
    ...headers
  });
  res.end(JSON.stringify(body));
}

function readBody(req, maxBytes = 32_000) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => {
      body += chunk;
      if (body.length > maxBytes) {
        reject(Object.assign(new Error("Request body is too large."), { status: 413 }));
        req.destroy();
      }
    });
    req.on("end", () => {
      try {
        const parsed = body ? JSON.parse(body) : {};
        if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
          reject(Object.assign(new Error("Request body must be a JSON object."), { status: 400 }));
          return;
        }
        resolve(parsed);
      } catch {
        reject(Object.assign(new Error("Request body must be valid JSON."), { status: 400 }));
      }
    });
    req.on("error", reject);
  });
}

function cookieValue(req, name) {
  const pair = (req.headers.cookie || "").split(";").map(item => item.trim()).find(item => item.startsWith(`${name}=`));
  return pair ? pair.slice(name.length + 1) : "";
}

function getSession(req) {
  const token = cookieValue(req, "aj_session");
  if (!token) return null;
  const session = sessions.get(crypto.createHash("sha256").update(token).digest("hex"));
  if (!session || session.expiresAt <= Date.now()) {
    sessions.delete(crypto.createHash("sha256").update(token).digest("hex"));
    return null;
  }
  session.expiresAt = Date.now() + SESSION_TTL;
  return session;
}

function requireSameOrigin(req, res) {
  const origin = req.headers.origin;
  if (!origin || origin !== `http://${req.headers.host}` && origin !== `https://${req.headers.host}`) {
    json(res, 403, { error: "Request origin was not accepted." });
    return false;
  }
  return true;
}

function cleanText(value, maxLength, field, { required = true } = {}) {
  if (typeof value !== "string") {
    if (!required && (value === undefined || value === null)) return "";
    throw Object.assign(new Error(`${field} must be text.`), { status: 400 });
  }
  const cleaned = value.trim();
  if (required && !cleaned) throw Object.assign(new Error(`${field} is required.`), { status: 400 });
  if (cleaned.length > maxLength) throw Object.assign(new Error(`${field} is too long.`), { status: 400 });
  return cleaned;
}

function cleanImage(value) {
  const image = cleanText(value, 500, "Image", { required: false });
  if (!image) return "";
  if (/^(https:\/\/[^\s"'<>]+|[a-zA-Z0-9][a-zA-Z0-9._/-]*)$/.test(image) && !image.split("/").includes("..")) return image;
  throw Object.assign(new Error("Image must be a site asset path or an HTTPS URL."), { status: 400 });
}

function validateProduct(body, existingId) {
  const purity = Number(body.purity);
  const weight = Number(body.weight);
  if (!Number.isFinite(purity) || purity <= 0 || purity > 1000) throw Object.assign(new Error("Purity must be a positive number."), { status: 400 });
  if (!Number.isFinite(weight) || weight <= 0 || weight > 10000) throw Object.assign(new Error("Weight must be a positive number."), { status: 400 });
  if (!["Gold", "Silver", "Platinum"].includes(body.metal)) throw Object.assign(new Error("Choose Gold, Silver or Platinum."), { status: 400 });
  if (body.featured !== undefined && typeof body.featured !== "boolean") throw Object.assign(new Error("Featured must be true or false."), { status: 400 });
  const image = cleanImage(body.image);
  if (body.featured === true && !image) throw Object.assign(new Error("A featured piece needs an image."), { status: 400 });
  return {
    id: existingId || crypto.randomUUID(),
    name: cleanText(body.name, 100, "Name"),
    category: cleanText(body.category, 60, "Category"),
    metal: body.metal,
    purity,
    weight,
    stone: cleanText(body.stone || "None", 60, "Stone"),
    image,
    featured: body.featured === true
  };
}

function validateShowroom(body, existingId) {
  const phone = cleanText(body.phone, 30, "Phone", { required: false });
  if (phone && !/^[+()\d\s-]{7,30}$/.test(phone)) throw Object.assign(new Error("Enter a valid showroom phone number."), { status: 400 });
  const name = cleanText(body.name, 100, "Name");
  if (/[<>"\u0000-\u001f]/.test(name)) throw Object.assign(new Error("Showroom name contains unsupported characters."), { status: 400 });
  const address = cleanText(body.address, 250, "Address");
  const hours = cleanText(body.hours, 120, "Hours");
  const rating = cleanText(body.rating, 80, "Rating", { required: false });
  if (/[<>]/.test(`${address}${hours}${rating}`)) throw Object.assign(new Error("Showroom details contain unsupported characters."), { status: 400 });
  return {
    id: existingId || crypto.randomUUID(),
    name,
    image: cleanImage(body.image),
    address,
    hours,
    rating,
    phone
  };
}

function validateDesign(body, existingId) {
  const name = cleanText(body.name, 100, "Name");
  return {
    id: existingId || crypto.randomUUID(),
    name,
    category: cleanText(body.category, 60, "Category"),
    image: cleanImage(body.image)
  };
}

function validateRows(rows, field, limit, validate, stringRows = false) {
  if (!Array.isArray(rows) || rows.length > limit) throw Object.assign(new Error(`${field} must contain no more than ${limit} entries.`), { status: 400 });
  return rows.map((row, index) => {
    if (stringRows ? typeof row !== "string" : !row || typeof row !== "object" || Array.isArray(row)) {
      throw Object.assign(new Error(`${field} entry ${index + 1} is invalid.`), { status: 400 });
    }
    return validate(row, index);
  });
}

function validateContent(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw Object.assign(new Error("Website content must be an object."), { status: 400 });
  const input = (section, field) => {
    const result = value[section];
    if (!result || typeof result !== "object" || Array.isArray(result)) throw Object.assign(new Error(`${section} content is required.`), { status: 400 });
    return result[field];
  };
  const text = (section, field, max = 500, optional = false) => cleanText(input(section, field), max, `${section}.${field}`, { required: !optional });
  const image = (section, field) => cleanImage(input(section, field));
  const url = (section, field) => {
    const address = text(section, field, 500, true);
    if (!address) return "";
    let parsed;
    try { parsed = new URL(address); } catch { throw Object.assign(new Error(`${section}.${field} must be an HTTPS URL.`), { status: 400 }); }
    if (parsed.protocol !== "https:") throw Object.assign(new Error(`${section}.${field} must be an HTTPS URL.`), { status: 400 });
    return parsed.href;
  };
  const settings = {
    siteName: text("settings", "siteName", 80),
    tagline: text("settings", "tagline", 140),
    description: text("settings", "description", 300),
    homepageHeadline: text("settings", "homepageHeadline", 160),
    featuredTitle: text("settings", "featuredTitle", 160),
    heroImage: image("settings", "heroImage"),
    headerLogoImage: image("settings", "headerLogoImage"),
    showroomBannerImage: image("settings", "showroomBannerImage"),
    yearsOfTrust: text("settings", "yearsOfTrust", 5),
    teamMembers: text("settings", "teamMembers", 8),
    yearsLabel: text("settings", "yearsLabel", 60),
    showroomsLabel: text("settings", "showroomsLabel", 60),
    teamLabel: text("settings", "teamLabel", 60),
    chipClassics: text("settings", "chipClassics", 60),
    chipPersonalized: text("settings", "chipPersonalized", 60),
    chipStatement: text("settings", "chipStatement", 60),
    chipFinest: text("settings", "chipFinest", 60),
    homepageQuote: text("settings", "homepageQuote", 500),
    quoteLinkText: text("settings", "quoteLinkText", 80),
    footerTagline: text("settings", "footerTagline", 140),
    logoImage: image("settings", "logoImage"),
    socialFacebook: url("settings", "socialFacebook"),
    socialInstagram: url("settings", "socialInstagram"),
    socialLinkedin: url("settings", "socialLinkedin"),
    navHome: text("settings", "navHome", 40),
    navAbout: text("settings", "navAbout", 40),
    navCollection: text("settings", "navCollection", 40),
    navContact: text("settings", "navContact", 40),
    showroomCta: text("settings", "showroomCta", 80),
    contactTitle: text("settings", "contactTitle", 120),
    contactIntro: text("settings", "contactIntro", 300),
    storesTitle: text("settings", "storesTitle", 100),
    storesDescription: text("settings", "storesDescription", 300)
  };
  if (!/^\d{1,4}$/.test(settings.yearsOfTrust) || !/^\d{1,7}$/.test(settings.teamMembers)) {
    throw Object.assign(new Error("Homepage statistics must be whole numbers."), { status: 400 });
  }
  const about = {
    title: text("about", "title", 100),
    growthTitle: text("about", "growthTitle", 100),
    journeyTitle: text("about", "journeyTitle", 100),
    paragraphs: validateRows(input("about", "paragraphs"), "About paragraphs", 30, row => cleanText(row, 2000, "About paragraph"), true),
    milestones: validateRows(input("about", "milestones"), "About milestones", 30, row => ({
      year: cleanText(row.year, 12, "Milestone year"),
      title: cleanText(row.title, 120, "Milestone title"),
      location: cleanText(row.location, 120, "Milestone location")
    })),
    stories: validateRows(input("about", "stories"), "About stories", 20, row => ({
      label: cleanText(row.label, 100, "Story label"),
      title: cleanText(row.title, 140, "Story title"),
      body: cleanText(row.body, 2500, "Story"),
      image: cleanImage(row.image),
      alt: cleanText(row.alt, 160, "Image description")
    }))
  };
  const collection = {
    eyebrow: text("collection", "eyebrow", 100),
    title: text("collection", "title", 100),
    subtitle: text("collection", "subtitle", 120),
    description: text("collection", "description", 500),
    signoff: text("collection", "signoff", 140),
    browseTitle: text("collection", "browseTitle", 120),
    browseDescription: text("collection", "browseDescription", 300),
    designsTitle: text("collection", "designsTitle", 120),
    designsDescription: text("collection", "designsDescription", 300),
    priceNote: text("collection", "priceNote", 300),
    stories: validateRows(input("collection", "stories"), "Collection stories", 10, row => ({
      name: cleanText(row.name, 50, "Collection label"),
      title: cleanText(row.title, 120, "Collection story title"),
      cta: cleanText(row.cta, 100, "Collection link"),
      image: cleanImage(row.image),
      alt: cleanText(row.alt, 160, "Image description"),
      paragraphs: validateRows(row.paragraphs, "Story paragraphs", 6, text => cleanText(text, 1000, "Story paragraph"), true)
    }))
  };
  const insights = {
    title: text("insights", "title", 100),
    description: text("insights", "description", 300),
    author: text("insights", "author", 100),
    articles: validateRows(input("insights", "articles"), "Articles", 100, row => ({
      id: cleanText(row.id, 100, "Article ID"),
      title: cleanText(row.title, 140, "Article title"),
      category: cleanText(row.category, 60, "Article category"),
      excerpt: cleanText(row.excerpt, 300, "Article excerpt"),
      body: cleanText(row.body, 5000, "Article")
    }))
  };
  const policies = validateRows(value.policies, "Policies", 30, row => ({
    id: cleanText(row.id, 80, "Policy ID"),
    title: cleanText(row.title, 120, "Policy title"),
    body: cleanText(row.body, 5000, "Policy")
  }));
  for (const [label, rows] of [["Article", insights.articles], ["Policy", policies]]) {
    if (new Set(rows.map(row => row.id)).size !== rows.length) throw Object.assign(new Error(`${label} IDs must be unique.`), { status: 400 });
  }
  return { settings, about, collection, insights, policies };
}

async function adminApi(req, res, url) {
  if (url.pathname === "/api/admin/login" && req.method === "POST") {
    if (!requireSameOrigin(req, res)) return;
    const client = req.socket.remoteAddress || "unknown";
    const attempt = loginAttempts.get(client) || { count: 0, reset: Date.now() + 15 * 60_000 };
    if (attempt.reset <= Date.now()) {
      attempt.count = 0;
      attempt.reset = Date.now() + 15 * 60_000;
    }
    if (attempt.count >= 10) return json(res, 429, { error: "Too many sign-in attempts. Try again later." });
    const body = await readBody(req);
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    const password = typeof body.password === "string" ? body.password : "";
    const emailOk = email === process.env.ADMIN_EMAIL.toLowerCase();
    const passwordOk = password.length <= 1024 && crypto.timingSafeEqual(
      crypto.createHash("sha256").update(password).digest(),
      crypto.createHash("sha256").update(process.env.ADMIN_PASSWORD).digest()
    );
    if (!emailOk || !passwordOk) {
      attempt.count++;
      loginAttempts.set(client, attempt);
      return json(res, 401, { error: "Email or password is incorrect." });
    }
    loginAttempts.delete(client);
    const token = crypto.randomBytes(32).toString("base64url");
    sessions.set(crypto.createHash("sha256").update(token).digest("hex"), {
      email: process.env.ADMIN_EMAIL,
      expiresAt: Date.now() + SESSION_TTL
    });
    return json(res, 200, { email: process.env.ADMIN_EMAIL }, {
      "Set-Cookie": `aj_session=${encodeURIComponent(token)}; HttpOnly; SameSite=Strict; Path=/; Max-Age=${SESSION_TTL / 1000}${req.socket.encrypted || process.env.NODE_ENV === "production" ? "; Secure" : ""}`
    });
  }
  if (url.pathname === "/api/admin/logout" && req.method === "POST") {
    if (!requireSameOrigin(req, res)) return;
    const token = cookieValue(req, "aj_session");
    sessions.delete(crypto.createHash("sha256").update(token).digest("hex"));
    return json(res, 200, { ok: true }, { "Set-Cookie": "aj_session=; HttpOnly; SameSite=Strict; Path=/; Max-Age=0" });
  }

  const session = getSession(req);
  if (url.pathname === "/api/admin/session" && req.method === "GET") {
    return session ? json(res, 200, { email: session.email }) : json(res, 401, { error: "Sign in required." });
  }
  if (!session) return json(res, 401, { error: "Sign in required." });
  if (req.method !== "GET" && !requireSameOrigin(req, res)) return;

  const data = await dataPromise;
  if (url.pathname === "/api/admin/summary" && req.method === "GET") {
    const open = data.enquiries.filter(enquiry => enquiry.status === "New").length;
    return json(res, 200, { products: data.products.length, designs: data.designs.length, showrooms: data.showrooms.length, enquiries: data.enquiries.length, newEnquiries: open });
  }
  if (url.pathname === "/api/admin/content" && req.method === "GET") return json(res, 200, data.content);
  if (url.pathname === "/api/admin/content" && req.method === "PUT") {
    const content = validateContent(await readBody(req, 1_000_000));
    await updateData(store => { store.content = content; });
    return json(res, 200, content);
  }
  if (url.pathname === "/api/admin/products" && req.method === "GET") return json(res, 200, data.products);
  if (url.pathname === "/api/admin/designs" && req.method === "GET") return json(res, 200, data.designs);
  if (url.pathname === "/api/admin/showrooms" && req.method === "GET") return json(res, 200, data.showrooms);
  if (url.pathname === "/api/admin/enquiries" && req.method === "GET") return json(res, 200, data.enquiries);

  const match = url.pathname.match(/^\/api\/admin\/(products|designs|showrooms|enquiries)(?:\/([^/]+))?$/);
  if (!match) return json(res, 404, { error: "Admin endpoint not found." });
  const [, resource, itemId] = match;
  const body = ["POST", "PUT", "PATCH"].includes(req.method) ? await readBody(req) : null;
  if (resource === "enquiries") {
    if (req.method === "PATCH" && itemId) {
      if (!["New", "Contacted", "Resolved"].includes(body.status)) return json(res, 400, { error: "Choose a valid enquiry status." });
      const updated = await updateData(store => {
        const enquiry = store.enquiries.find(item => item.id === itemId);
        if (!enquiry) return null;
        enquiry.status = body.status;
        return enquiry;
      });
      return updated ? json(res, 200, updated) : json(res, 404, { error: "Enquiry not found." });
    }
    if (req.method === "DELETE" && itemId) {
      const removed = await updateData(store => {
        const index = store.enquiries.findIndex(item => item.id === itemId);
        if (index < 0) return false;
        store.enquiries.splice(index, 1);
        return true;
      });
      return removed ? json(res, 200, { ok: true }) : json(res, 404, { error: "Enquiry not found." });
    }
    return json(res, 405, { error: "Method not allowed." });
  }
  const list = data[resource];
  if (req.method === "POST" && !itemId) {
    const item = resource === "products" ? validateProduct(body) : resource === "designs" ? validateDesign(body) : validateShowroom(body);
    await updateData(store => store[resource].push(item));
    return json(res, 201, item);
  }
  if (req.method === "PUT" && itemId) {
    const item = resource === "products" ? validateProduct(body, itemId) : resource === "designs" ? validateDesign(body, itemId) : validateShowroom(body, itemId);
    const updated = await updateData(store => {
      const index = store[resource].findIndex(existing => existing.id === itemId);
      if (index < 0) return false;
      store[resource][index] = item;
      return true;
    });
    return updated ? json(res, 200, item) : json(res, 404, { error: "Record not found." });
  }
  if (req.method === "DELETE" && itemId) {
    const removed = await updateData(store => {
      const index = store[resource].findIndex(existing => existing.id === itemId);
      if (index < 0) return false;
      store[resource].splice(index, 1);
      return true;
    });
    return removed ? json(res, 200, { ok: true }) : json(res, 404, { error: "Record not found." });
  }
  return json(res, 405, { error: "Method not allowed." });
}

async function publicApi(req, res, url) {
  if (url.pathname === "/api/public/catalog" && req.method === "GET") {
    const data = await dataPromise;
    return json(res, 200, { products: data.products, designs: data.designs, showrooms: data.showrooms, content: data.content }, { "Cache-Control": "no-cache" });
  }
  if (url.pathname === "/api/public/enquiries" && req.method === "POST") {
    const client = req.socket.remoteAddress || "unknown";
    const now = Date.now();
    const recent = (loginAttempts.get(`enquiry:${client}`) || []).filter(time => now - time < 60_000);
    if (recent.length >= 5) return json(res, 429, { error: "Please wait a moment before sending another enquiry." });
    const body = await readBody(req);
    if (typeof body.hp === "string" && body.hp.trim()) return json(res, 201, { ok: true });
    const email = cleanText(body.email, 254, "Email", { required: false });
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(res, 400, { error: "Enter a valid email address." });
    const phone = cleanText(body.phone, 30, "Phone");
    if (!/^[+()\d\s-]{7,30}$/.test(phone)) return json(res, 400, { error: "Enter a valid phone number." });
    recent.push(now);
    loginAttempts.set(`enquiry:${client}`, recent);
    const enquiry = {
      id: crypto.randomUUID(),
      name: cleanText(body.name, 100, "Name"),
      phone,
      email,
      department: cleanText(body.department || "Showroom visit", 80, "Enquiry type"),
      message: cleanText(body.message || "", 2000, "Message", { required: false }),
      product: cleanText(body.product || "", 100, "Product", { required: false }),
      showroom: cleanText(body.showroom || "", 100, "Showroom", { required: false }),
      visitDate: cleanText(body.visitDate || "", 30, "Visit date", { required: false }),
      status: "New",
      createdAt: new Date().toISOString()
    };
    await updateData(store => store.enquiries.unshift(enquiry));
    return json(res, 201, { ok: true });
  }
  return json(res, 404, { error: "Public endpoint not found." });
}

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf"
};

async function staticFile(req, res, url) {
  if (req.method !== "GET" && req.method !== "HEAD") return json(res, 405, { error: "Method not allowed." });
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return json(res, 400, { error: "Invalid URL." });
  }
  if (pathname === "/") pathname = "/site-assets/index.html";
  else if (pathname === "/admin" || pathname === "/admin/") pathname = "/admin.html";
  else if (["/admin.css", "/admin.js", "/cms.css"].includes(pathname)) pathname = pathname.slice(1);
  else if (pathname.startsWith("/")) pathname = `/site-assets${pathname}`;
  const resolved = path.resolve(ROOT, pathname.replace(/^\/+/, ""));
  const assetsRoot = path.resolve(ROOT, "site-assets");
  if (!(resolved === path.join(ROOT, "admin.html") || resolved === path.join(ROOT, "admin.css") || resolved === path.join(ROOT, "admin.js") || resolved === path.join(ROOT, "cms.css") || resolved.startsWith(`${assetsRoot}${path.sep}`))) {
    return json(res, 404, { error: "Not found." });
  }
  try {
    const content = await fs.readFile(resolved);
    res.writeHead(200, {
      "Content-Type": MIME[path.extname(resolved).toLowerCase()] || "application/octet-stream",
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "Content-Security-Policy": "default-src 'self' https://maps.google.com https://www.google.com; img-src 'self' https: data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; frame-src https://maps.google.com https://www.google.com; connect-src 'self'; base-uri 'self'; form-action 'self'; frame-ancestors 'self'"
    });
    res.end(req.method === "HEAD" ? undefined : content);
  } catch (error) {
    if (error.code === "ENOENT") return json(res, 404, { error: "Not found." });
    throw error;
  }
}

async function handle(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
    if (url.pathname.startsWith("/api/admin/")) return await adminApi(req, res, url);
    if (url.pathname.startsWith("/api/public/")) return await publicApi(req, res, url);
    if (url.pathname === "/api/health") return json(res, 200, { ok: true });
    return await staticFile(req, res, url);
  } catch (error) {
    if (!res.headersSent) json(res, error.status || 500, { error: error.status ? error.message : "The request could not be completed." });
    if (!error.status) console.error(error);
  }
}

if (require.main === module) {
  try {
    assertConfiguration();
    const server = http.createServer(handle);
    server.listen(PORT, () => console.log(`Anand Jewels is available at http://localhost:${PORT} (admin: /admin)`));
    server.on("close", () => sessions.clear());
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

module.exports = { handle, validateProduct, validateShowroom, initialData };
