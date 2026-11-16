// lib/data.js

export const brands = [
  { name: 'PHlux', sub: 'Cosmetics', desc: 'Premium cosmetics and skin treatment formulations.', color: 'phlux' },
  { name: 'Bactoguard', sub: 'Derma Care', desc: 'Advanced antibacterial skin & body care solutions.', color: 'bactoguard' },
  { name: 'SOLVE', sub: 'Ayurvedic Medicine', desc: '100% Results Oriented proprietary Ayurvedic wellness blends.', color: 'solve' },
  { name: 'REGEN', sub: 'Hair Care', desc: 'Organic scalp therapy and intensive hair revitalization.', color: 'regen' },
  { name: 'Megawell', sub: 'Supplements', desc: 'Cold-pressed high potency organic supplements.', color: 'megawell' },
  { name: 'DERMADONA', sub: 'Dermatology', desc: 'Clinical grade dermatological formulations for daily skin health.', color: 'dermadona' },
  { name: 'Flavourswala', sub: 'Food & Beverage', desc: 'Pure, organic gourmet ingredients & health foods.', color: 'flavourswala' },
  { name: 'KNPL Living', sub: 'Wellness', desc: 'Holistic lifestyle and environment wellness essentials.', color: 'knpl' },
];

export const brandColors = {
  phlux: 'from-teal-pale to-[#C8E6DE] text-teal-deep border-[#A3D1C6]',
  bactoguard: 'from-[#FFE8D6] to-[#FFD4B8] text-[#8B4513] border-[#F4C19C]',
  solve: 'from-[#E8F5E9] to-[#C8E6C9] text-[#2E7D32] border-[#A5D6A7]',
  regen: 'from-[#F3E5F5] to-[#E1BEE7] text-[#6A1B9A] border-[#D1C4E9]',
  megawell: 'from-[#FFF3E0] to-[#FFE0B2] text-[#E65100] border-[#FFE0B2]',
  dermadona: 'from-[#FCE4EC] to-[#F8BBD0] text-[#C2185B] border-[#F8BBD0]',
  flavourswala: 'from-[#FFF8E1] to-[#FFECB3] text-[#F57F17] border-[#FFE082]',
  knpl: 'from-[#E3F2FD] to-[#BBDEFB] text-[#0D47A1] border-[#90CAF9]',
};

export const products = [
  {
    id: 'rejuvenate-argan-facewash',
    name: 'REjuvenate Moroccan Argan Oil Face Wash + Cleanser',
    slug: 'rejuvenate-moroccan-argan-oil-face-wash',
    brand: 'PHlux',
    category: 'Face Wash & Cleansers',
    subcategory: 'Daily Cleanser',
    netContent: '200 ml',
    sku: 'NW-PH-ARGAN-01',
    stock: 150,
    
    // Pricing
    price: 399,
    mrp: 499,
    discount: 20,
    
    // Content
    tagline: 'Moisturise & Cleanse · 100% Results Oriented Product',
    description: 'This multifunctional cleanser helps remove skin impurities and make-up residue while providing essential hydration. Enriched with Moroccan Argan Oil beads, Australian tea tree oil, Calendula extracts, Strawberry extracts, rich in vitamin E, Antioxidants and Essential Fatty Acids, it leaves the skin clean, fresh and radiant.',
    longDescription: 'Deeply cleanse, hydrate, and brighten skin, removing impurities while providing antioxidant protection to promote a radiant, youthful glow.',
    
    benefits: [
      'Deep pore cleansing and clarifying',
      'Reducing active acne and breakouts',
      'Brightening skin tone & fading dark spots',
      'Balance oily skin and prevent blemishes',
      'Soothe inflammation and irritation',
      'Mood-enhancing effect by reducing stress impact on skin'
    ],
    
    ingredients: [
      'Aqua (Water)',
      'Sodium Lauroyl Sarcosinate',
      'Acrylates Copolymer',
      'Disodium Cocoamphodiacetate',
      'Fragrance',
      'Sodium Hydroxide',
      'Argan Oil',
      'Calendula Extracts',
      'Strawberry Extracts',
      'Australian Tree Oil',
      'Sodium Benzoate',
      'Colour CI: 15510'
    ],
    
    directions: 'Take a small quantity. Apply it on wet face. Gently massage and rinse off with water.',
    storage: 'Store in a cool, dry place away from direct sunlight.',
    warnings: 'For external use only.',
    suitableFor: 'All Skin Types',
    
    // Media (Reliable high quality stock images)
    images: [
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
      'https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?w=800',
      'https://images.unsplash.com/photo-1570194065650-d99fb4b38b17?w=800'
    ],
    
    // Metadata
    rating: 4.9,
    reviewsCount: 128,
    salesCount: 840,
    badge: 'new',
    isActive: true,
    isFeatured: true,
    
    certifications: [
      'DERMATOLOGICALLY TESTED',
      'CRUELTY FREE',
      'PARABENS FREE',
      'VEGAN PRODUCT',
      'ANTI PHOTOAGING',
      'MOISTURIZING',
      'SOOTHING',
      'REJUVENATING'
    ],
    
    createdAt: '2026-09-01T00:00:00.000Z'
  },
  {
    id: 'bactoguard-active-protection',
    name: 'Bactoguard Active Defense Derma Face Wash',
    slug: 'bactoguard-active-defense-wash',
    brand: 'Bactoguard',
    category: 'Face Wash & Cleansers',
    subcategory: 'Medicated Wash',
    netContent: '150 ml',
    sku: 'NW-BG-ACTIVE-02',
    stock: 95,
    
    price: 349,
    mrp: 425,
    discount: 18,
    
    tagline: 'Deep Hygiene · Complete Dermatological Protection',
    description: 'An advanced dermatologist-approved antibacterial face wash that cleanses deeply without stripping moisture. Perfect for sensitive, germ-prone skin protection.',
    longDescription: 'Specially formulated with natural antibacterial actives to build a daily protection shield against environmental pathogens while preserving skin health.',
    
    benefits: [
      '99.9% protection from skin germs',
      'Non-drying daily antiseptic formula',
      'Dermatologically tested for hyper-sensitive skin',
      'Soothes itchiness and environmental redness'
    ],
    
    ingredients: ['Aqua', 'Salicylic Acid', 'Aloe Vera Juice', 'Chlorhexidine Digluconate', 'Neem Extract', 'Tulsi Extract'],
    directions: 'Lather gently onto wet face and rinse off completely twice daily.',
    storage: 'Keep in dry room temperature.',
    warnings: 'Avoid direct contact with eyes.',
    suitableFor: 'Acne Prone & Sensitive Skin',
    
    images: [
      'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800'
    ],
    
    rating: 4.8,
    reviewsCount: 94,
    salesCount: 512,
    badge: 'bestseller',
    isActive: true,
    isFeatured: false,
    
    certifications: [
      'CLINICALLY PROVEN',
      'DERMATOLOGICALLY TESTED',
      'HYPOALLERGENIC',
      'PARABENS FREE'
    ],
    createdAt: '2026-09-02T00:00:00.000Z'
  },
  {
    id: 'solve-ayurvedic-digestive',
    name: 'SOLVE Amrit Kanth Ayurvedic Digestive Elixir',
    slug: 'solve-amrit-kanth-digestive',
    brand: 'SOLVE',
    category: 'Ayurvedic Medicine',
    subcategory: 'Wellness Syrup',
    netContent: '200 ml',
    sku: 'NW-SV-AMRIT-03',
    stock: 220,
    
    price: 249,
    mrp: 299,
    discount: 16,
    
    tagline: 'Ancient Remedy for Fast & Natural Gut Healing',
    description: '100% Results-oriented traditional formulation containing powerful herbs to regulate acidity, eliminate toxins, and strengthen complete digestive fire.',
    longDescription: 'Handcrafted and clinically aged formulation from sacred books of Ayurveda designed to cure digestive discomfort, bloating, and maintain dynamic gut pH.',
    
    benefits: [
      'Instant relief from acidity & bloating',
      'Enhances liver metabolism and detox',
      'Improves nutritional absorption rate',
      'Balanced with tri-dosha balancing herbs'
    ],
    
    ingredients: ['Amgla', 'Haritaki', 'Bibhitaki', 'Yashtimadhu', 'Jeeraka', 'Pippali', 'Shunti'],
    directions: 'Take 10-15 ml with lukewarm water post breakfast and dinner.',
    storage: 'Store in airtight cool container.',
    warnings: 'Consult physician for pregnant usage.',
    suitableFor: 'All Adults',
    
    images: [
      'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=800',
      'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800'
    ],
    
    rating: 5.0,
    reviewsCount: 310,
    salesCount: 1420,
    badge: 'bestseller',
    isActive: true,
    isFeatured: false,
    
    certifications: [
      'GMP CERTIFIED',
      'AYUSH LICENSE APPROVED',
      '100% ORGANIC HERBS',
      'HEAVY METAL TESTED'
    ],
    createdAt: '2026-09-03T00:00:00.000Z'
  },
  {
    id: 'megawell-omega-capsules',
    name: 'Megawell Cold Pressed Omega-3 Complex Capsules',
    slug: 'megawell-omega-3-complex',
    brand: 'Megawell',
    category: 'Supplements',
    subcategory: 'Heart & Joint Health',
    netContent: '60 Softgels',
    sku: 'NW-MW-OMEGA-04',
    stock: 80,
    
    price: 899,
    mrp: 1199,
    discount: 25,
    
    tagline: 'High Potency Clean Plant-Sourced Fatty Acids',
    description: 'Rich in EPA, DHA and vital antioxidants. Sourced from cold-pressed organic seeds to promote robust cardiovascular health, cognitive functions and joint flexibility.',
    longDescription: 'Megawell provides the ultimate modern botanical Omega profile with premium clean-extracted softgels to bypass fish oils, completely avoiding heavy metals or fishy aftertastes.',
    
    benefits: [
      'Strengthens cardiac and artery health',
      'Soothes chronic joint pains & stiffness',
      'Sharpens cognitive and eye focus',
      'Clean vegan shell formulation'
    ],
    
    ingredients: ['Flaxseed oil extracts', 'Chia seed organic oil', 'Sea Buckthorn berry oil', 'D-Alpha Tocopherol (Vitamin E)'],
    directions: 'Take one softgel daily with a meal or as directed by healthcare provider.',
    storage: 'Keep refrigerated after opening.',
    warnings: 'Keep out of reach of children.',
    suitableFor: 'Daily Adult Health',
    
    images: [
      'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=800',
      'https://images.unsplash.com/photo-1611926653458-09294b3142bf?w=800'
    ],
    
    rating: 4.7,
    reviewsCount: 75,
    salesCount: 390,
    badge: 'sale',
    isActive: true,
    isFeatured: false,
    
    certifications: [
      '100% VEGETARIAN SHELL',
      'NON-GMO VERIFIED',
      'COLD PRESSED EXTRACT',
      'THIRD PARTY TESTED'
    ],
    createdAt: '2026-09-04T00:00:00.000Z'
  }
];