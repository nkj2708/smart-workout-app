import dotenv from 'dotenv';
dotenv.config();

/**
 * Calculates BMI and classifies category
 */
export function calculateBMI(weightKg, heightCm) {
  if (!weightKg || !heightCm) return { bmi: 22.0, category: 'Normal weight' };
  const heightM = heightCm / 100;
  const bmi = +(weightKg / (heightM * heightM)).toFixed(1);
  let category = 'Normal weight';
  if (bmi < 18.5) category = 'Underweight';
  else if (bmi < 25) category = 'Normal weight';
  else if (bmi < 30) category = 'Overweight';
  else category = 'Obese';
  return { bmi, category };
}

/**
 * Call Gemini API using REST or fallback
 */
async function callGemini(prompt, systemInstruction = '', jsonMode = true) {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    console.log('[GeminiService] No GEMINI_API_KEY found, using high-fidelity local AI engine fallback.');
    return null;
  }

  // Use Gemini 2.5 Flash / 1.5 Flash
  const model = 'gemini-1.5-flash';
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

  const body = {
    contents: [
      {
        role: 'user',
        parts: [{ text: prompt }]
      }
    ],
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 2500,
      ...(jsonMode ? { responseMimeType: 'application/json' } : {})
    }
  };

  if (systemInstruction) {
    body.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error(`[GeminiService] API error ${response.status}:`, errorText);
    throw new Error(`Gemini API returned error: ${response.status}`);
  }

  const data = await response.json();
  const textOutput = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!textOutput) {
    throw new Error('Gemini API returned empty response');
  }

  return textOutput;
}

/**
 * Generates personalized workout and nutrition recommendation using Gemini AI
 */
export async function generateWorkoutRecommendation(userData) {
  const {
    name = 'Athlete',
    age = 25,
    gender = 'male',
    weightKg = 70,
    heightCm = 175,
    fitnessGoal = 'muscle_building',
    fitnessLevel = 'intermediate',
    availableEquipment = ['dumbbells', 'bodyweight'],
    workoutDaysPerWeek = 4,
    sessionDurationMinutes = 45,
    dietaryPreference = 'high-protein',
    medicalLimitations = 'None'
  } = userData;

  const { bmi, category: bmiCategory } = calculateBMI(weightKg, heightCm);

  const prompt = `
You are a world-class Elite Strength & Conditioning Specialist (CSCS) and Sports Nutritionist.
Generate a scientifically validated, customized multi-day workout regimen and nutrition guideline tailored precisely to the user's biomechanics, equipment, and goals.

User Profile:
- Name: ${name}
- Age: ${age}, Gender: ${gender}
- Height: ${heightCm} cm, Weight: ${weightKg} kg (Calculated BMI: ${bmi} - ${bmiCategory})
- Primary Fitness Goal: ${fitnessGoal}
- Current Fitness Experience: ${fitnessLevel}
- Available Equipment: ${Array.isArray(availableEquipment) ? availableEquipment.join(', ') : availableEquipment}
- Schedule: ${workoutDaysPerWeek} days per week, ${sessionDurationMinutes} minutes per session
- Dietary Preference: ${dietaryPreference}
- Physical Limitations / Injuries: ${medicalLimitations}

Return a valid JSON object ONLY. Follow this strict JSON structure:
{
  "planTitle": "string (e.g. 4-Day Hypertrophy & Core Conditioning Plan)",
  "summary": "string (2-3 sentences explaining the science and focus of this routine)",
  "fitnessGoal": "${fitnessGoal}",
  "fitnessLevel": "${fitnessLevel}",
  "weeklySchedule": [
    {
      "dayName": "string (e.g. Day 1: Upper Body Push & Core)",
      "focus": "string (e.g. Chest, Shoulders, Triceps, Abs)",
      "durationMinutes": ${sessionDurationMinutes},
      "warmup": ["string", "string"],
      "exercises": [
        {
          "name": "string",
          "targetMuscle": "string",
          "sets": 3,
          "reps": "string (e.g. 8-12 reps)",
          "restSeconds": 60,
          "equipment": "string",
          "formCue": "string (actionable biomechanical cue for safe execution)",
          "alternativeExercise": "string (in case user lacks equipment or experiences discomfort)"
        }
      ],
      "cooldown": ["string", "string"]
    }
  ],
  "nutritionAdvice": {
    "caloriesTarget": 2300,
    "proteinGrams": 140,
    "carbsGrams": 260,
    "fatsGrams": 70,
    "recommendations": [
      "string (hydration advice)",
      "string (pre/post workout timing)",
      "string (micronutrient / recovery tip)"
    ]
  }
}

Ensure the number of days in "weeklySchedule" is exactly ${workoutDaysPerWeek}. Use realistic sets, reps, and exercises strictly matching their available equipment (${Array.isArray(availableEquipment) ? availableEquipment.join(', ') : availableEquipment}).
`;

  try {
    const rawResult = await callGemini(prompt, 'You are an elite fitness and nutrition intelligence system. Output only pure JSON without markdown code fences.');
    if (rawResult) {
      let cleanJson = rawResult.trim();
      if (cleanJson.startsWith('```json')) {
        cleanJson = cleanJson.replace(/^```json\s*/, '').replace(/\s*```$/, '');
      } else if (cleanJson.startsWith('```')) {
        cleanJson = cleanJson.replace(/^```\s*/, '').replace(/\s*```$/, '');
      }
      const parsed = JSON.parse(cleanJson);
      parsed.bmi = bmi;
      parsed.bmiCategory = bmiCategory;
      return parsed;
    }
  } catch (err) {
    console.warn('[GeminiService] AI generation error, switching to smart fallback:', err.message);
  }

  // Intelligent algorithmic fallback if API key not provided or request fails
  return generateSmartFallbackPlan({ ...userData, bmi, bmiCategory });
}

/**
 * Intelligent Fallback Generator ensuring 100% operational uptime
 */
function generateSmartFallbackPlan(user) {
  const { bmi, bmiCategory, fitnessGoal, fitnessLevel, workoutDaysPerWeek, sessionDurationMinutes, availableEquipment } = user;
  const daysCount = Math.min(Math.max(Number(workoutDaysPerWeek) || 4, 2), 6);
  const equip = Array.isArray(availableEquipment) ? availableEquipment : ['bodyweight'];
  const hasDumbbells = equip.includes('dumbbells') || equip.includes('gym');

  const baseDays = [
    {
      dayName: 'Day 1: Upper Body Power & Hypertrophy',
      focus: 'Chest, Back, Shoulders & Arms',
      durationMinutes: sessionDurationMinutes,
      warmup: ['5 min Arm Circles & Dynamic Chest Openers', 'Cat-Cow mobility stretch (10 reps)'],
      exercises: [
        {
          name: hasDumbbells ? 'Dumbbell Floor Press / Bench Press' : 'Standard Push-Ups (or Knee Push-Ups)',
          targetMuscle: 'Chest & Triceps',
          sets: 4,
          reps: '10-12 reps',
          restSeconds: 60,
          equipment: hasDumbbells ? 'Dumbbells' : 'Bodyweight',
          formCue: 'Keep elbows tucked at 45 degrees; brace abdominal wall throughout press.',
          alternativeExercise: 'Incline Push-Ups'
        },
        {
          name: hasDumbbells ? 'Dumbbell Bent-Over Rows' : 'Inverted Table Rows / Doorway Rows',
          targetMuscle: 'Lats & Rhomboids',
          sets: 4,
          reps: '10-12 reps',
          restSeconds: 60,
          equipment: hasDumbbells ? 'Dumbbells' : 'Bodyweight',
          formCue: 'Hinge deeply at hips; drive elbows backward toward hip pockets.',
          alternativeExercise: 'Prone Cobra pulses'
        },
        {
          name: hasDumbbells ? 'Dumbbell Overhead Shoulder Press' : 'Pike Push-Ups',
          targetMuscle: 'Anterior & Lateral Deltoids',
          sets: 3,
          reps: '10-12 reps',
          restSeconds: 60,
          equipment: hasDumbbells ? 'Dumbbells' : 'Bodyweight',
          formCue: 'Press in full range without arching the lower lumbar spine.',
          alternativeExercise: 'Dumbbell Lateral Raises'
        },
        {
          name: 'Plank with Shoulder Taps',
          targetMuscle: 'Core & Stabilizers',
          sets: 3,
          reps: '30-45 seconds',
          restSeconds: 45,
          equipment: 'Bodyweight',
          formCue: 'Keep hips completely level; prevent rotation while tapping shoulders.',
          alternativeExercise: 'Forearm Plank hold'
        }
      ],
      cooldown: ['Child’s Pose (60s)', 'Cross-Body Shoulder Stretch (30s per side)']
    },
    {
      dayName: 'Day 2: Lower Body Strength & Stability',
      focus: 'Quadriceps, Hamstrings, Glutes & Calves',
      durationMinutes: sessionDurationMinutes,
      warmup: ['Bodyweight Squat Mobility (12 reps)', 'Leg Swings front-to-back & side-to-side'],
      exercises: [
        {
          name: hasDumbbells ? 'Dumbbell Goblet Squats' : 'Bodyweight Tempo Squats',
          targetMuscle: 'Quadriceps & Glutes',
          sets: 4,
          reps: '12-15 reps',
          restSeconds: 75,
          equipment: hasDumbbells ? 'Dumbbells' : 'Bodyweight',
          formCue: 'Drive through mid-foot and heels; keep torso proud and chest elevated.',
          alternativeExercise: 'Box Squats'
        },
        {
          name: hasDumbbells ? 'Dumbbell Romanian Deadlifts' : 'Single-Leg Glute Bridges',
          targetMuscle: 'Hamstrings & Gluteal Chain',
          sets: 3,
          reps: '12 reps',
          restSeconds: 60,
          equipment: hasDumbbells ? 'Dumbbells' : 'Bodyweight',
          formCue: 'Push hips backward until hamstring tension peaks; do not round shoulders.',
          alternativeExercise: 'Good Mornings'
        },
        {
          name: 'Reverse Lunges',
          targetMuscle: 'Quads & Balance',
          sets: 3,
          reps: '10 reps each leg',
          restSeconds: 60,
          equipment: hasDumbbells ? 'Dumbbells' : 'Bodyweight',
          formCue: 'Step backward smoothly, gently hovering back knee 1 inch off ground.',
          alternativeExercise: 'Split Squat holds'
        },
        {
          name: 'Standing Calf Raises',
          targetMuscle: 'Gastrocnemius & Soleus',
          sets: 3,
          reps: '15-20 reps',
          restSeconds: 45,
          equipment: 'Bodyweight',
          formCue: 'Hold 1-second contraction at peak extension before lowering slowly.',
          alternativeExercise: 'Seated Calf Raise'
        }
      ],
      cooldown: ['Hamstring Fold Stretch (45s)', 'Quad Stretch against wall (30s each)']
    },
    {
      dayName: 'Day 3: Aerobic Conditioning & Core Engine',
      focus: 'Cardiovascular Endurance, Core Anti-Rotation & Mobility',
      durationMinutes: sessionDurationMinutes,
      warmup: ['Jumping Jacks (60s)', 'High Knees & Butt Kicks (60s)', 'Hip Openers'],
      exercises: [
        {
          name: 'Mountain Climbers HIIT Intervals',
          targetMuscle: 'Cardio & Transverse Abdominis',
          sets: 4,
          reps: '30s on / 30s rest',
          restSeconds: 45,
          equipment: 'Bodyweight',
          formCue: 'Sprint knees rhythmically to chest while sustaining tight plank.',
          alternativeExercise: 'High Knee marches'
        },
        {
          name: 'Dead Bug Rotations',
          targetMuscle: 'Deep Core & Spinal Stabilization',
          sets: 3,
          reps: '12 reps per side',
          restSeconds: 45,
          equipment: 'Bodyweight',
          formCue: 'Press lower back flush against the ground at all times.',
          alternativeExercise: 'Bird-Dog'
        },
        {
          name: 'Bicycle Crunches',
          targetMuscle: 'Obliques & Rectus Abdominis',
          sets: 3,
          reps: '20 total reps',
          restSeconds: 45,
          equipment: 'Bodyweight',
          formCue: 'Slow and controlled rotation, initiating from ribs rather than pulling neck.',
          alternativeExercise: 'Side Plank Holds'
        }
      ],
      cooldown: ['Cobra Pose (45s)', 'Downward Facing Dog (60s)']
    },
    {
      dayName: 'Day 4: Functional Full-Body Integration',
      focus: 'Compound Movement, Functional Power & Posture',
      durationMinutes: sessionDurationMinutes,
      warmup: ['World’s Greatest Stretch (5 per side)', 'Inchworms (6 reps)'],
      exercises: [
        {
          name: hasDumbbells ? 'Dumbbell Thrusters (Squat to Overhead Press)' : 'Bodyweight Burpees',
          targetMuscle: 'Full Body & Metabolic Conditioning',
          sets: 4,
          reps: '10-12 reps',
          restSeconds: 75,
          equipment: hasDumbbells ? 'Dumbbells' : 'Bodyweight',
          formCue: 'Transfer power fluidly from squat ascent directly into vertical press.',
          alternativeExercise: 'Squat jumps'
        },
        {
          name: hasDumbbells ? 'Renegade Rows' : 'Bear Crawl Holds',
          targetMuscle: 'Upper Back & Core Stability',
          sets: 3,
          reps: '10 reps each side',
          restSeconds: 60,
          equipment: hasDumbbells ? 'Dumbbells' : 'Bodyweight',
          formCue: 'Widen feet stance to lock hips and restrict pelvic sway.',
          alternativeExercise: 'Standard Plank'
        },
        {
          name: 'Glute Bridge with 2s Squeeze',
          targetMuscle: 'Gluteus Maximus & Hamstrings',
          sets: 3,
          reps: '15 reps',
          restSeconds: 45,
          equipment: 'Bodyweight',
          formCue: 'Drive hips upward till body forms straight line knees to shoulders.',
          alternativeExercise: 'Single-leg bridge'
        }
      ],
      cooldown: ['Pigeon Pose (45s each leg)', 'Deep Diaphragmatic Box Breathing (2 mins)']
    }
  ];

  const selectedDays = baseDays.slice(0, daysCount);

  // Calculate target nutrition based on weight & goal
  let caloriesTarget = 2200;
  let proteinGrams = Math.round(user.weightKg * 1.8);
  if (fitnessGoal === 'weight_loss') {
    caloriesTarget = Math.round(user.weightKg * 28);
    proteinGrams = Math.round(user.weightKg * 2.0);
  } else if (fitnessGoal === 'muscle_building') {
    caloriesTarget = Math.round(user.weightKg * 34);
    proteinGrams = Math.round(user.weightKg * 2.1);
  } else if (fitnessGoal === 'endurance') {
    caloriesTarget = Math.round(user.weightKg * 32);
    proteinGrams = Math.round(user.weightKg * 1.6);
  }

  const fatsGrams = Math.round((caloriesTarget * 0.25) / 9);
  const carbsGrams = Math.round((caloriesTarget - (proteinGrams * 4 + fatsGrams * 9)) / 4);

  return {
    planTitle: `${daysCount}-Day Smart ${fitnessGoal.replace('_', ' ').toUpperCase()} Program`,
    summary: `Tailored precision routine formulated for BMI ${bmi} (${bmiCategory}) focusing on ${fitnessGoal.replace('_', ' ')} using ${equip.join(', ')}. Designed with progressive overload and optimal joint recovery cycles.`,
    fitnessGoal,
    fitnessLevel,
    bmi,
    bmiCategory,
    weeklySchedule: selectedDays,
    nutritionAdvice: {
      caloriesTarget,
      proteinGrams,
      carbsGrams,
      fatsGrams,
      recommendations: [
        `Target ${proteinGrams}g daily protein spread across 3-4 meals to maximize muscle protein synthesis.`,
        `Maintain hydration of at least 3.0 - 3.5 Liters of water daily, especially during your ${sessionDurationMinutes}-minute sessions.`,
        'Consume complex carbohydrates (oats, brown rice, sweet potatoes) 90 minutes before training for sustained glycogen.',
        'Prioritize 7-8 hours of quality sleep to optimize nervous system recovery and cortisol balance.'
      ]
    }
  };
}

/**
 * Real-time AI Fitness Coach Assistant chat
 */
export async function chatWithFitnessCoach(history = [], userMessage = '', userContext = {}) {
  const prompt = `
User Context:
- Goal: ${userContext.fitnessGoal || 'General Fitness'}
- Fitness Level: ${userContext.fitnessLevel || 'Intermediate'}
- BMI: ${userContext.bmi || '23'} (${userContext.bmiCategory || 'Normal'})
- Available Equipment: ${userContext.availableEquipment ? JSON.stringify(userContext.availableEquipment) : 'Bodyweight'}

Chat History:
${history.map(m => `${m.sender === 'user' ? 'User' : 'Coach'}: ${m.text}`).join('\n')}

User Question: "${userMessage}"

Respond as an energetic, certified elite fitness trainer & coach. Give actionable, safe, science-backed guidance. Keep answers concise, highly encouraging, and formatted with bullet points if explaining exercises or meal suggestions.
`;

  try {
    const response = await callGemini(
      prompt,
      'You are coach Alex, a supportive, elite CSCS certified fitness coach and sports nutritionist. Be enthusiastic, direct, and practical.',
      false
    );
    if (response) return response;
  } catch (err) {
    console.warn('[GeminiService] Chat fallback triggered:', err.message);
  }

  // Smart fallback chat responses
  const q = userMessage.toLowerCase();
  if (q.includes('shoulder') || q.includes('pain') || q.includes('hurt') || q.includes('injury')) {
    return `Safety is always priority #1! If you are feeling shoulder or joint discomfort:
• **Cease overhead or painful pressing movements immediately.**
• **Alternative for Chest/Shoulders:** Try Floor Presses with neutral grip (palms facing each other) or Push-Ups with hands on an elevated bench.
• **Rehab warmup:** Perform light external rotations and face-pulls using resistance bands.
If sharp or persisting pain occurs, always consult a physical therapist before loading weight!`;
  }
  if (q.includes('protein') || q.includes('diet') || q.includes('food') || q.includes('eat') || q.includes('meal')) {
    return `Here is a solid nutrition quick-guide for your goal:
• **Post-Workout Window:** Aim for 25-35g of high-quality protein (whey protein shake, eggs, Greek yogurt, or tofu/chicken breast) within 60-90 minutes of training.
• **Carb Timing:** Pair with fast-digesting carbs like a banana, rice cakes, or berries to replenish muscle glycogen stores.
• **Hydration:** Replenish with 500ml of water and an electrolyte pinch after intense sweating!`;
  }
  return `Great question! Consistency and progressive overload are key. For your target goal of ${userContext.fitnessGoal || 'building fitness'}, keep your form strict, leave 1-2 reps in reserve (RIR), and prioritize quality recovery and protein intake. What specific exercise or part of your workout can I help refine today?`;
}
