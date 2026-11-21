import { FOOD_MAPPINGS, YOGA_MAPPINGS } from './wellnessAssessmentData';

/**
 * Deterministic Clinical Assessment Evaluator
 * Strictly implements Clinical Specification Rules:
 * - SAFE-01: Emergency Red Flags Gate
 * - SAFE-03: Under-18 Minor Protection
 * - SAFE-04: Pregnancy / Chronic Condition / Medication Gate
 * - CAT-*: Food suggestions + exactly 2 yoga practice candidates
 * 
 * ZERO product recommendation logic inside the engine.
 */

export function evaluateAssessment(answers) {
  // Step 1: Emergency Red Flags (SAFE-01)
  if (answers.emergency_red_flags && answers.emergency_red_flags.length > 0) {
    const hasActiveFlag = answers.emergency_red_flags.some(flag => flag !== 'none_of_above');
    if (hasActiveFlag) {
      return {
        safe: false,
        triage_category: 'EMERGENCY_STOP',
        title: 'Immediate Clinical Care Required',
        message: 'Your responses indicate symptoms that require prompt evaluation by a registered medical doctor or emergency healthcare provider. Botanical and wellness assessments are not suitable during acute symptoms.',
        action_required: 'Please consult a physician or visit the nearest healthcare facility immediately.',
        foods: [],
        yoga: [],
        call_status_default: 'Professional-referral',
        safety_triage: 'EMERGENCY_STOP',
      };
    }
  }

  // Step 2: Under-18 Minor Protection (SAFE-03)
  if (answers.r4_age === 'under-18') {
    return {
      safe: false,
      triage_category: 'MINOR_RESTRICTION',
      title: 'Pediatric & Guardian Guidance Notice',
      message: 'Nutriwell Organics personalized assessments are designed strictly for adults aged 18 and above. Growing bodies have unique nutritional and developmental requirements.',
      action_required: 'We encourage parents or guardians to consult a qualified pediatrician or certified Ayurvedic practitioner for minors. Emphasize wholesome home-cooked meals, joyful active play, and adequate natural rest under parental supervision.',
      guardian_note: 'Adult wellness formulations and specific dietary modifications are not recommended for unsupervised minors.',
      foods: [],
      yoga: [],
      call_status_default: 'Do-not-contact',
      safety_triage: 'MINOR_RESTRICTION',
    };
  }

  // Step 3: Pregnancy / Breastfeeding / Chronic Medication Gate (SAFE-04)
  const isPregnantOrNursing = answers.c3_pregnancy_nursing === 'pregnant' || answers.c3_pregnancy_nursing === 'breastfeeding';
  const hasChronicCondition = answers.c4_chronic_conditions && answers.c4_chronic_conditions.some(c => c !== 'none_of_above');
  const onPrescriptionMeds = answers.c6_prescription_meds === 'yes';

  if (isPregnantOrNursing || hasChronicCondition || onPrescriptionMeds) {
    const reasons = [];
    if (isPregnantOrNursing) reasons.push('Pregnancy / Nursing');
    if (hasChronicCondition) reasons.push('Pre-existing chronic condition');
    if (onPrescriptionMeds) reasons.push('Prescription medications');

    return {
      safe: false,
      triage_category: 'MEDICAL_CLEARANCE_REQUIRED',
      title: 'Medical Clearance Required Before Lifestyle Regimens',
      message: `Because you reported [${reasons.join(', ')}], standardized lifestyle regimens and specific yogic asanas require one-on-one medical clearance.`,
      action_required: 'Please discuss any dietary shifts or physical asanas with your treating physician or OB/GYN prior to starting.',
      foods: [],
      yoga: [], // Zero yoga poses forced
      call_status_default: 'Professional-referral',
      safety_triage: 'MEDICAL_CLEARANCE_REQUIRED',
    };
  }

  // Step 4: Deterministic Lifestyle & Food Category Mappings (CAT-*)
  const primaryConcern = answers.r6_primary_concern || 'general-vitality';
  const foodData = FOOD_MAPPINGS[primaryConcern] || FOOD_MAPPINGS['general-vitality'];
  const yogaData = YOGA_MAPPINGS[primaryConcern] || YOGA_MAPPINGS['general-vitality'];

  // Enforce exactly 2 reviewed yoga practice candidates
  const safeYogaPractices = (yogaData.practices || []).slice(0, 2);

  return {
    safe: true,
    triage_category: 'LIFESTYLE_RECOMMENDATION',
    title: 'Your Personalized Ayurvedic Wellness Assessment',
    primary_concern: primaryConcern,
    foods: {
      beneficial: foodData.beneficial || [],
      limit: foodData.limit || [],
      general_guideline: foodData.guideline || 'Eat fresh, seasonal, warm cooked meals with adequate daily hydration.',
    },
    yoga: {
      practices: safeYogaPractices,
      caution: yogaData.caution || 'Practice mindfully within comfortable limits. Do not strain joints or hold breath uncomfortably.',
    },
    call_status_default: 'Pending',
    safety_triage: 'CLEARED_LIFESTYLE',
  };
}