/**
 * Nutriwell Organics - Clinical Wellness Assessment Master Data Specification
 * Version: NWO-WA-v1.0 (21 Nov 2026 Clinical Standard)
 * 
 * Rules:
 * - Deterministic triage mapping (No AI hallucination)
 * - Emergency red-flag stop gates
 * - Under-18 Minor gate protection
 * - Pregnancy/Chronic condition medical clearance gate
 * - Exactly approved botanical food recommendations & reviewed yogic practices
 * - Zero product marketing or commercial upselling
 */

export const QUESTIONNAIRE_VERSION = 'NWO-WA-v1.0';

export const CONSENT_NOTICE = {
  title: 'Holistic Ayurvedic Assessment & Clinical Triage Notice',
  text: 'The Ayurvedic dietary insights, lifestyle charts, and yogic asanas suggested by this clinical triage engine are intended strictly for educational and holistic lifestyle balancing. These recommendations do not constitute clinical diagnosis, prescription, or medical treatment by a registered allopathic practitioner.',
  subtext: 'If you are experiencing acute medical symptoms, please visit a hospital emergency facility immediately. Your information is securely stored under strict confidentiality protocols.',
};

/**
 * Common Health & Safety Screening Questions (Screening Gates)
 */
export const COMMON_HEALTH_QUESTIONS = [
  {
    id: 'emergency_red_flags',
    prompt: 'Are you currently experiencing any of the following acute symptoms?',
    subtext: 'Select all that apply, or choose "None of the above" if you feel stable.',
    multi_select: true,
    options: [
      { value: 'chest_pain', label: 'Unexplained chest pain, tightness, or pressure radiating to arm/jaw' },
      { value: 'breathlessness', label: 'Sudden, severe shortness of breath at rest' },
      { value: 'fainting_dizziness', label: 'Sudden fainting, loss of consciousness, or severe acute vertigo' },
      { value: 'numbness_speech', label: 'Sudden facial droop, limb weakness, or slurred speech' },
      { value: 'blood_vomit_stool', label: 'Vomiting blood or passing dark/black tarry stools' },
      { value: 'rapid_weight_loss', label: 'Unintentional rapid weight loss (>5 kg in 1 month without dieting)' },
      { value: 'none_of_above', label: 'None of the above (I have no acute emergency symptoms)' },
    ],
  },
  {
    id: 'c3_pregnancy_nursing',
    prompt: 'Are you currently pregnant, planning pregnancy within 3 months, or breastfeeding?',
    subtext: 'Botanical formulations and yogic bandhas require strict obstetric clearance.',
    multi_select: false,
    options: [
      { value: 'pregnant', label: 'Yes, currently pregnant' },
      { value: 'breastfeeding', label: 'Yes, actively nursing / breastfeeding' },
      { value: 'planning', label: 'Planning conception within the next 3 months' },
      { value: 'neither', label: 'No, none of these apply to me' },
    ],
  },
  {
    id: 'c4_chronic_conditions',
    prompt: 'Have you been diagnosed with any of the following pre-existing chronic conditions?',
    subtext: 'Select all confirmed medical diagnoses.',
    multi_select: true,
    options: [
      { value: 'type1_type2_diabetes', label: 'Diabetes (Type 1 or Type 2 on medication/insulin)' },
      { value: 'hypertension', label: 'Chronic High Blood Pressure (Hypertension)' },
      { value: 'cardiovascular', label: 'Heart Disease, Arrhythmia, or Cardiac Stents' },
      { value: 'renal_hepatic', label: 'Chronic Kidney Disease or Liver Cirrhosis/Hepatitis' },
      { value: 'autoimmune', label: 'Autoimmune Condition (Hashimoto’s, Lupus, Rheumatoid Arthritis)' },
      { value: 'none_of_above', label: 'None of the above (No diagnosed chronic medical conditions)' },
    ],
  },
  {
    id: 'c6_prescription_meds',
    prompt: 'Are you currently taking any daily allopathic prescription medications?',
    subtext: 'Including blood thinners, immunosuppressants, thyroid hormones, or psychiatric drugs.',
    multi_select: false,
    options: [
      { value: 'yes', label: 'Yes, I take daily prescription medications' },
      { value: 'no', label: 'No, I am not taking regular prescription medications' },
    ],
  },
];

/**
 * Seeker Registration & Concern Questions
 */
export const REGISTRATION_QUESTIONS = [
  {
    id: 'r4_age',
    prompt: 'Which age band applies to you?',
    subtext: 'Nutriwell personalized assessments are calibrated for adult physiological doshas.',
    multi_select: false,
    options: [
      { value: 'under-18', label: 'Under 18 years of age (Minor)' },
      { value: '18-29', label: '18 – 29 years' },
      { value: '30-44', label: '30 – 44 years' },
      { value: '45-59', label: '45 – 59 years' },
      { value: '60-plus', label: '60 years or above' },
    ],
  },
  {
    id: 'r5_biological_sex',
    prompt: 'What is your biological sex?',
    subtext: 'Required for hormonal dosha balancing and rhythmic lifecycle assessment.',
    multi_select: false,
    options: [
      { value: 'female', label: 'Female' },
      { value: 'male', label: 'Male' },
      { value: 'intersex', label: 'Intersex' },
      { value: 'prefer-not-to-say', label: 'Prefer not to disclose' },
    ],
  },
  {
    id: 'r6_primary_concern',
    prompt: 'What is your primary wellness aspiration or focal concern today?',
    subtext: 'Choose the area where you desire the most profound equilibrium.',
    multi_select: false,
    options: [
      { value: 'digestion-gut', label: 'Agni & Gut Equilibrium (Bloating, Indigestion, Sluggish Bowels)' },
      { value: 'stress-sleep', label: 'Manas Shanti & Sleep Deepening (Stress, Insomnia, Restless Mind)' },
      { value: 'joint-mobility', label: 'Sandhi Health & Mobility (Joint Stiffness, Vata Aches, Flexibility)' },
      { value: 'skin-radiance', label: 'Twacha Glow & Blood Purification (Skin Blemishes, Dullness, Heat)' },
      { value: 'metabolism-weight', label: 'Meda Dhatu & Metabolism (Sluggish Weight, Sugar Cravings, Fatigue)' },
      { value: 'general-vitality', label: 'Ojas & Daily Vitality (Immunity Boost, All-Day Energy, Rejuvenation)' },
    ],
  },
  {
    id: 'r7_concern_duration',
    prompt: 'How long have you been experiencing this imbalance?',
    subtext: 'Helps determine whether the doshic manifestation is acute or deep-seated.',
    multi_select: false,
    options: [
      { value: 'less-than-1-month', label: 'Acute (Less than 1 month)' },
      { value: '1-to-6-months', label: 'Moderate (1 to 6 months)' },
      { value: '6-to-12-months', label: 'Established (6 to 12 months)' },
      { value: 'more-than-1-year', label: 'Chronic / Long-standing (More than 1 year)' },
    ],
  },
];

/**
 * Deterministic Approved Food Suggestions Mappings
 * Strict Ayurvedic whole-food categorization per primary concern
 */
export const FOOD_MAPPINGS = {
  'digestion-gut': {
    guideline: 'Kindle Mandagni (sluggish digestive fire) with warm, unctuous, freshly prepared meals. Avoid chilled beverages and stale leftovers.',
    beneficial: [
      'Warm Cumin-Coriander-Fennel (CCF) water sipped between meals',
      'Fresh grated ginger with a pinch of black rock salt before eating',
      'Lightly spiced Moong Dal Khichdi cooked with A2 cow ghee',
      'Steamed seasonal bottle gourd (lauki), ridge gourd (turai), and pumpkin',
      'Stewed apples or pears infused with cinnamon and clove in the morning',
    ],
    limit: [
      'Iced water, carbonated cold drinks, and ice creams',
      'Deep-fried snacks, heavy gluten pastries, and refined flours',
      'Raw cruciferous salads (raw cabbage, raw broccoli) at dinner',
      'Fermented, sour, over-yeasted bakery goods',
    ],
  },
  'stress-sleep': {
    guideline: 'Soothe aggravated Prana Vata with grounding, nourishing sweet, salty, and sour tastes. Maintain consistent meal timings before sundown.',
    beneficial: [
      'Warm spiced A2 milk or almond milk with nutmeg and cardamom at bedtime',
      'Soaked and peeled almonds, walnuts, and organic Medjool dates',
      'Warm whole grain porridges (rolled oats, broken wheat) with ghee',
      'Root vegetables like sweet potatoes, carrots, and beetroot roasted in ghee',
      'Fresh chamomile, brahmi, or shankhpushpi herbal infusions',
    ],
    limit: [
      'Caffeinated espresso, energy drinks, and black tea after 2:00 PM',
      'Excessively pungent chilies, raw onions, and pungent hot sauces',
      'Late-night heavy dining after 9:00 PM',
      'Processed sugars and artificial sweeteners that trigger cortisol spikes',
    ],
  },
  'joint-mobility': {
    guideline: 'Subdue circulating dry Vata dosha in the joints by incorporating healthy unctuous oils, anti-inflammatory roots, and thermal hydration.',
    beneficial: [
      'Warm golden milk prepared with fresh turmeric root and black pepper',
      'Lightly toasted white and black sesame seeds (Til) rich in bio-calcium',
      'Bone broths or mineral-rich vegetable soups infused with fresh garlic',
      'A2 Cow Ghee used generously in warm cooked vegetable stews',
      'Moringa (drumstick) leaf broth seasoned with rock salt and cumin',
    ],
    limit: [
      'Cold, dry, airy foods like packaged chips, dry crackers, and raw puffed rice',
      'Nightshades in excess (excessive raw tomatoes, eggplants, bell peppers)',
      'Leftover refrigerated foods consumed cold without thorough reheating',
      'Sour curds (dahi) consumed late in the evening',
    ],
  },
  'skin-radiance': {
    guideline: 'Pacify aggravated Bhrajaka Pitta and purify Rakta dhatu with cooling, bitter, and astringent whole foods. Maintain optimal hydration.',
    beneficial: [
      'Fresh coconut water consumed at room temperature in the mid-morning',
      'Amla (Indian gooseberry) juice or fresh amla cooked with a drop of ghee',
      'Cooling bitter vegetables such as bitter gourd (karela), parwal, and zucchini',
      'Soaked basil seeds (sabja) or coriander seed water soaked overnight',
      'Sweet juicy fruits like pomegranates, sweet grapes, and watermelons',
    ],
    limit: [
      'Deep-fried, overly salty, and oily street savories',
      'Excessive red chilies, fermented vinegar, and sharp pungent mustard oils',
      'Refined white sugar and artificial preservative-laden confectioneries',
      'Excessive consumption of hot sour pickles and aged cheeses',
    ],
  },
  'metabolism-weight': {
    guideline: 'Stimulate stagnant Kledaka Kapha and clear metabolic channels (Srotas) with warm, light, bitter, and astringent preparations.',
    beneficial: [
      'Lukewarm water infused with half a freshly squeezed lemon and raw honey',
      'Barley (Jau) water, millet rotis (Jowar, Bajra), and horse gram (Kulthi) dal',
      'Lightly steamed seasonal greens (spinach, fenugreek/methi leaves, radish greens)',
      'Culinary spices: black pepper, long pepper (pippali), cinnamon, and dry ginger',
      'Herbal teas brewed with green tea leaves, tulsi, and crushed cardamom',
    ],
    limit: [
      'Heavy dairy sweets, condensed milk desserts, and bakery puddings',
      'Saturated trans-fats, processed margarine, and refined vegetable seed oils',
      'Daytime sleeping immediately following heavy lunchtime meals',
      'Excessive intake of refined white rice and deep-fried puris',
    ],
  },
  'general-vitality': {
    guideline: 'Nurture Ojas (the subtle essence of physical vitality) with pure, clean, sattvic prana-dense foods that strengthen innate resilience.',
    beneficial: [
      'Amla preserve (Chyawanprash or amla murabba) with warm herbal tea',
      'Fresh seasonal sweet fruits: ripe mangoes, figs, papayas, and berries',
      'Ghee-sautéed whole green moong dal seasoned with turmeric and cumin',
      'Sprouted fenugreek or mung beans lightly steamed with lemon juice',
      'Hydrating herbal infusions of Tulsi, Mulethi (licorice), and Cardamom',
    ],
    limit: [
      'Microwaved, pre-packaged ready-to-eat microwave meals',
      'Chemical energy tonics and carbonated sodas',
      'Heavy red meats and stale foods stored for more than 24 hours',
      'Excessive alcohol consumption and tobacco use',
    ],
  },
};

/**
 * Reviewed Yogic Practices Mappings
 * Strict Clinical Rule: Exactly 2 reviewed candidate practices per primary concern
 */
export const YOGA_MAPPINGS = {
  'digestion-gut': {
    practices: [
      {
        name: 'Vajrasana (Thunderbolt Stride)',
        duration: '5 – 10 minutes seated directly after meals',
        guidance: 'Sit comfortably on your heels with spine erect and hands resting on thighs. Deepen diaphragmatic belly breathing to gently stimulate digestive blood flow in the pelvic basin.',
      },
      {
        name: 'Pawanmuktasana (Gentle Wind-Relieving Flow)',
        duration: '3 – 5 slow repetitions on an empty stomach',
        guidance: 'Lie flat on your back, bend the right knee towards your chest, clasp your hands around the shin, and gently exhale as you draw it in. Alternate legs mindfully without straining the neck.',
      },
    ],
    caution: 'Avoid forceful abdominal pressure if you have acute abdominal pain, active hernia, or recent abdominal surgery.',
  },
  'stress-sleep': {
    practices: [
      {
        name: 'Nadi Shodhana Pranayama (Alternate Nostril Breath)',
        duration: '5 – 7 minutes in a quiet, seated posture',
        guidance: 'Gently close your right nostril with your right thumb, inhale smoothly through the left nostril for 4 counts, close left with ring finger, release right and exhale for 4 counts. Repeat without forceful breath retention.',
      },
      {
        name: 'Viparita Karani (Restorative Legs-Up-The-Wall Pose)',
        duration: '10 – 15 minutes before bedtime',
        guidance: 'Rest your hips against or close to a supportive wall, extending your legs upwards vertically with a soft folded blanket under your lower back. Close your eyes and allow resting parasympathetic tone to awaken.',
      },
    ],
    caution: 'Do not hold your breath uncomfortably during pranayama. Avoid Viparita Karani during active glaucoma or acute cervical spine flare-ups.',
  },
  'joint-mobility': {
    practices: [
      {
        name: 'Sukshma Vyayama (Gentle Micro-Joint Rotations)',
        duration: '8 – 10 minutes every morning',
        guidance: 'Perform slow, unhurried, synchronized rotational movements for ankles, knees, wrists, and shoulders while inhaling and exhaling smoothly. Mobilizes synovial fluid without jarring articular cartilage.',
      },
      {
        name: 'Marjaryasana-Bitilasana (Cat-Cow Dynamic Spine Waves)',
        duration: '5 – 8 gentle wave cycles on all fours',
        guidance: 'Come onto your hands and knees with wrists under shoulders. Inhale as you gently drop the belly and gaze forward; exhale as you softly round the spine toward the ceiling like a cat.',
      },
    ],
    caution: 'Never force range of motion past comfortable limits. Place a cushioned mat under your knees if your kneecaps are sensitive.',
  },
  'skin-radiance': {
    practices: [
      {
        name: 'Sheetali & Sheetkari Pranayama (Cooling Breath)',
        duration: '9 – 12 conscious breaths',
        guidance: 'Roll your tongue into a gentle tube (or close teeth softly with lips parted if unable to roll tongue), inhale cool air deeply through the mouth, close lips, and exhale slowly through both nostrils.',
      },
      {
        name: 'Sarvangasana Modification / Supported Shoulder Stand',
        duration: '2 – 3 minutes with wall support',
        guidance: 'Using wall or bolster assistance, raise lower body gently to allow oxygenated, nutrient-rich venous return to nourish facial microcapillaries and the thyroid gland.',
      },
    ],
    caution: 'Avoid cooling breath in severely cold winter weather or during active bronchial congestion. Avoid inversions if you have unmanaged hypertension.',
  },
  'metabolism-weight': {
    practices: [
      {
        name: 'Surya Namaskar (Mindful Sun Salutation Flow)',
        duration: '4 – 6 slow, breath-synchronized cycles in morning light',
        guidance: 'Flow rhythmically through the classical 12 postures at a steady, meditative pace. Inhale during backward bends and exhale during forward extensions to activate Agni.',
      },
      {
        name: 'Kapalbhati Kriya (Gentle Frontal Brain Cleansing)',
        duration: '2 rounds of 30 gentle passive inhalations and active exhalations',
        guidance: 'Sit with spine straight. Perform rhythmic, gentle abdominal contractions to expel breath through both nostrils, allowing inhalation to occur passively and smoothly.',
      },
    ],
    caution: 'Avoid Kapalbhati if you suffer from uncontrolled hypertension, cardiac conditions, epilepsy, active gastric ulcers, or during menstruation.',
  },
  'general-vitality': {
    practices: [
      {
        name: 'Bhramari Pranayama (Humming Bee Calming Sound)',
        duration: '5 – 7 long humming exhalations',
        guidance: 'Close eyes softly, place index fingers gently over the tragus of your ears, take a slow deep inhalation, and produce a soft, resonant humming bee sound (Mmmmmm) through the palate during the entire exhalation.',
      },
      {
        name: 'Tadasana & Vrikshasana (Grounded Mountain & Tree Pose)',
        duration: '3 – 5 minutes alternating steady balance on each side',
        guidance: 'Stand firm with weight distributed evenly on both feet. Focus gaze on a single unmoving point (Drishti), drawing earth energy upward from the arches through the crown of the head.',
      },
    ],
    caution: 'If balance is unsteady, practice tree pose with one hand lightly touching a sturdy wall or chair back.',
  },
};