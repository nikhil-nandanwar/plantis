import { PlantTip, DiseaseInfo, TipCategory } from '../types/tips';

/**
 * Comprehensive plant care tips and disease information service
 */

export const generalTips: PlantTip[] = [
  {
    id: 'watering-basics',
    title: 'Proper Watering',
    description: 'Water when the top inch of soil feels dry. Avoid overwatering as it can lead to root rot.',
    icon: '💧',
    category: 'general',
    expandedContent: 'Proper watering is crucial for plant health. Most plants prefer to dry out slightly between waterings rather than staying constantly moist.',
    steps: [
      'Check soil moisture by inserting your finger 1-2 inches deep',
      'Water thoroughly until water drains from the bottom',
      'Empty drainage trays after 30 minutes',
      'Adjust frequency based on season and humidity'
    ],
    relatedTips: ['humidity-control', 'soil-health']
  },
  {
    id: 'light-requirements',
    title: 'Adequate Light',
    description: 'Most plants need bright, indirect light. Adjust placement based on your plant\'s specific needs.',
    icon: '☀️',
    category: 'general',
    expandedContent: 'Light is essential for photosynthesis. Different plants have varying light requirements, from low light to full sun.',
    steps: [
      'Identify your plant\'s light requirements',
      'Place near windows for natural light',
      'Rotate plants weekly for even growth',
      'Consider grow lights for low-light areas'
    ],
    relatedTips: ['plant-placement', 'seasonal-care']
  },
  {
    id: 'temperature-control',
    title: 'Temperature Control',
    description: 'Keep plants away from drafts and maintain consistent temperatures between 65-75°F.',
    icon: '🌡️',
    category: 'general',
    expandedContent: 'Most houseplants prefer stable temperatures similar to what humans find comfortable.',
    steps: [
      'Avoid placing plants near heating/cooling vents',
      'Keep away from drafty windows and doors',
      'Monitor temperature fluctuations',
      'Move plants during extreme weather'
    ],
    relatedTips: ['humidity-control', 'seasonal-care']
  },
  {
    id: 'regular-inspection',
    title: 'Regular Inspection',
    description: 'Check your plants weekly for signs of pests, diseases, or nutrient deficiencies.',
    icon: '🔍',
    category: 'prevention',
    expandedContent: 'Early detection is key to preventing serious plant health issues. Regular inspection helps catch problems before they become severe.',
    steps: [
      'Examine leaves for discoloration or spots',
      'Check undersides of leaves for pests',
      'Look for changes in growth patterns',
      'Monitor soil condition and drainage'
    ],
    relatedTips: ['pest-prevention', 'disease-prevention']
  },
  {
    id: 'humidity-control',
    title: 'Humidity Management',
    description: 'Maintain appropriate humidity levels for tropical plants and prevent fungal issues.',
    icon: '💨',
    category: 'general',
    expandedContent: 'Many houseplants benefit from higher humidity than typical indoor environments provide.',
    steps: [
      'Group plants together to increase local humidity',
      'Use a humidifier during dry seasons',
      'Place pebble trays with water under plants',
      'Mist plants that enjoy high humidity',
      'Monitor humidity with a hygrometer'
    ],
    relatedTips: ['watering-basics', 'air-circulation']
  },
  {
    id: 'fertilization-schedule',
    title: 'Proper Fertilization',
    description: 'Feed your plants during growing season to promote healthy growth.',
    icon: '🌿',
    category: 'general',
    expandedContent: 'Plants need nutrients beyond what they can get from potting soil alone.',
    steps: [
      'Fertilize during spring and summer growing seasons',
      'Use diluted liquid fertilizer every 2-4 weeks',
      'Reduce or stop fertilizing in winter',
      'Choose fertilizer appropriate for plant type',
      'Always water before fertilizing'
    ],
    relatedTips: ['seasonal-care', 'nutrient-deficiency']
  },
  {
    id: 'repotting-guide',
    title: 'When to Repot',
    description: 'Recognize signs that your plant needs a larger home.',
    icon: '🪴',
    category: 'general',
    expandedContent: 'Repotting gives plants fresh soil and more room to grow.',
    steps: [
      'Look for roots growing through drainage holes',
      'Check if plant is top-heavy or unstable',
      'Notice if water runs straight through soil',
      'Repot in spring for best recovery',
      'Choose pot only 1-2 inches larger',
      'Use fresh, appropriate potting mix'
    ],
    relatedTips: ['soil-health', 'root-care']
  }
];

export const diseaseTips: PlantTip[] = [
  {
    id: 'fungal-treatment',
    title: 'Fungal Disease Treatment',
    description: 'Remove affected leaves and improve air circulation to prevent fungal spread.',
    icon: '🍄',
    category: 'treatment',
    severity: 'medium',
    expandedContent: 'Fungal diseases thrive in humid, poorly ventilated conditions. Quick action can prevent spread to healthy parts of the plant.',
    steps: [
      'Remove all affected leaves with clean, sharp scissors',
      'Dispose of infected plant material in trash (not compost)',
      'Improve air circulation around the plant',
      'Reduce watering frequency and avoid wetting leaves',
      'Apply fungicide if necessary'
    ],
    relatedTips: ['air-circulation', 'watering-technique']
  },
  {
    id: 'bacterial-treatment',
    title: 'Bacterial Infection Care',
    description: 'Isolate the plant and remove infected areas to prevent bacterial spread.',
    icon: '🦠',
    category: 'treatment',
    severity: 'high',
    expandedContent: 'Bacterial infections can spread rapidly and are often more serious than fungal issues. Immediate action is crucial.',
    steps: [
      'Isolate the affected plant immediately',
      'Remove infected leaves and stems with sterilized tools',
      'Avoid overhead watering',
      'Improve drainage and reduce humidity',
      'Consider copper-based bactericide for severe cases'
    ],
    relatedTips: ['plant-isolation', 'tool-sterilization']
  },
  {
    id: 'nutrient-deficiency',
    title: 'Nutrient Deficiency Solutions',
    description: 'Identify deficiency symptoms and provide appropriate fertilization.',
    icon: '🌿',
    category: 'treatment',
    severity: 'low',
    expandedContent: 'Nutrient deficiencies show specific symptoms that can help identify what your plant needs.',
    steps: [
      'Identify deficiency type by leaf symptoms',
      'Choose appropriate fertilizer (N-P-K ratio)',
      'Apply fertilizer according to package directions',
      'Monitor plant response over 2-4 weeks',
      'Adjust feeding schedule based on growth season'
    ],
    relatedTips: ['fertilization-schedule', 'soil-testing']
  }
];

export const preventionTips: PlantTip[] = [
  {
    id: 'pest-prevention',
    title: 'Pest Prevention',
    description: 'Keep plants clean and inspect regularly to prevent pest infestations.',
    icon: '🐛',
    category: 'prevention',
    expandedContent: 'Prevention is always better than treatment when it comes to plant pests.',
    steps: [
      'Quarantine new plants for 2-3 weeks',
      'Clean leaves regularly with damp cloth',
      'Maintain proper humidity levels',
      'Avoid overcrowding plants',
      'Use neem oil as preventive treatment'
    ],
    relatedTips: ['plant-quarantine', 'humidity-control']
  },
  {
    id: 'disease-prevention',
    title: 'Disease Prevention',
    description: 'Maintain good hygiene and proper growing conditions to prevent diseases.',
    icon: '🛡️',
    category: 'prevention',
    expandedContent: 'Most plant diseases can be prevented with proper care and hygiene practices.',
    steps: [
      'Ensure good air circulation',
      'Avoid overwatering and water at soil level',
      'Sterilize tools between plants',
      'Remove dead or dying plant material promptly',
      'Maintain appropriate spacing between plants'
    ],
    relatedTips: ['air-circulation', 'watering-technique']
  }
];

export const seasonalTips: PlantTip[] = [
  {
    id: 'spring-care',
    title: 'Spring Plant Care',
    description: 'Prepare your plants for the growing season with proper spring care.',
    icon: '🌸',
    category: 'general',
    expandedContent: 'Spring is the perfect time to give your plants a fresh start for the growing season.',
    steps: [
      'Gradually increase watering frequency',
      'Begin regular fertilization schedule',
      'Repot plants that have outgrown containers',
      'Prune dead or damaged growth',
      'Move plants to brighter locations',
      'Start propagating favorite plants'
    ],
    relatedTips: ['fertilization-schedule', 'repotting-guide']
  },
  {
    id: 'summer-care',
    title: 'Summer Plant Care',
    description: 'Keep plants healthy during hot summer months.',
    icon: '☀️',
    category: 'general',
    expandedContent: 'Summer brings intense light and heat that can stress plants if not managed properly.',
    steps: [
      'Water more frequently but check soil first',
      'Provide shade during hottest part of day',
      'Increase humidity around plants',
      'Watch for signs of heat stress',
      'Continue regular fertilization',
      'Monitor for increased pest activity'
    ],
    relatedTips: ['humidity-control', 'pest-prevention']
  },
  {
    id: 'winter-care',
    title: 'Winter Plant Care',
    description: 'Adjust care routine for dormant winter months.',
    icon: '❄️',
    category: 'general',
    expandedContent: 'Most plants slow their growth in winter and need adjusted care.',
    steps: [
      'Reduce watering frequency significantly',
      'Stop or reduce fertilization',
      'Provide maximum available light',
      'Keep away from cold drafts',
      'Maintain stable temperatures',
      'Increase humidity to combat dry indoor air'
    ],
    relatedTips: ['temperature-control', 'light-requirements']
  }
];

export const diseaseDatabase: Record<string, DiseaseInfo> = {
  'leaf-spot': {
    diseaseType: 'Leaf Spot Disease',
    symptoms: ['Dark spots on leaves', 'Yellow halos around spots', 'Leaf drop'],
    causes: ['Fungal infection', 'Bacterial infection', 'Poor air circulation', 'Overwatering'],
    treatment: [
      diseaseTips.find(tip => tip.id === 'fungal-treatment')!,
      {
        id: 'leaf-spot-specific',
        title: 'Leaf Spot Treatment',
        description: 'Remove affected leaves and apply appropriate fungicide.',
        icon: '🍃',
        category: 'treatment',
        severity: 'medium',
        steps: [
          'Remove all spotted leaves immediately',
          'Improve air circulation',
          'Water at soil level only',
          'Apply copper fungicide if severe'
        ]
      }
    ],
    prevention: [
      preventionTips.find(tip => tip.id === 'disease-prevention')!
    ]
  },
  'powdery-mildew': {
    diseaseType: 'Powdery Mildew',
    symptoms: ['White powdery coating on leaves', 'Stunted growth', 'Leaf distortion'],
    causes: ['High humidity', 'Poor air circulation', 'Overcrowding'],
    treatment: [
      {
        id: 'mildew-treatment',
        title: 'Powdery Mildew Treatment',
        description: 'Improve air circulation and apply fungicide treatment.',
        icon: '💨',
        category: 'treatment',
        severity: 'medium',
        steps: [
          'Increase air circulation immediately',
          'Remove heavily affected leaves',
          'Apply baking soda solution (1 tsp per quart water)',
          'Reduce humidity around plant'
        ]
      }
    ],
    prevention: [
      {
        id: 'mildew-prevention',
        title: 'Mildew Prevention',
        description: 'Maintain good air flow and avoid overcrowding.',
        icon: '🌬️',
        category: 'prevention',
        steps: [
          'Space plants adequately',
          'Use fans to improve air circulation',
          'Avoid overhead watering',
          'Monitor humidity levels'
        ]
      }
    ]
  },
  'root-rot': {
    diseaseType: 'Root Rot',
    symptoms: ['Yellowing leaves', 'Wilting despite moist soil', 'Musty smell from soil', 'Black or brown roots'],
    causes: ['Overwatering', 'Poor drainage', 'Contaminated soil', 'Fungal infection'],
    treatment: [
      {
        id: 'root-rot-treatment',
        title: 'Root Rot Emergency Treatment',
        description: 'Immediate action required to save the plant.',
        icon: '🚨',
        category: 'treatment',
        severity: 'high',
        expandedContent: 'Root rot is a serious condition that requires immediate intervention. The key is to remove all affected roots and repot in fresh, well-draining soil.',
        steps: [
          'Remove plant from pot immediately',
          'Wash roots gently with clean water',
          'Cut away all black, brown, or mushy roots with sterilized scissors',
          'Let roots dry for 1-2 hours',
          'Repot in fresh, well-draining soil',
          'Water sparingly until new growth appears'
        ],
        relatedTips: ['drainage-improvement', 'watering-schedule']
      }
    ],
    prevention: [
      {
        id: 'root-rot-prevention',
        title: 'Root Rot Prevention',
        description: 'Prevent root rot with proper watering and drainage.',
        icon: '🛡️',
        category: 'prevention',
        expandedContent: 'Prevention is much easier than treatment when it comes to root rot.',
        steps: [
          'Ensure pots have drainage holes',
          'Use well-draining potting mix',
          'Water only when top inch of soil is dry',
          'Empty drainage trays after watering',
          'Avoid overwatering in winter months'
        ]
      }
    ]
  },
  'yellowing-leaves': {
    diseaseType: 'Yellowing Leaves',
    symptoms: ['Leaves turning yellow', 'Leaf drop', 'Stunted growth'],
    causes: ['Overwatering', 'Underwatering', 'Nutrient deficiency', 'Natural aging', 'Light stress'],
    treatment: [
      {
        id: 'yellowing-diagnosis',
        title: 'Yellowing Leaves Diagnosis',
        description: 'Identify the cause of yellowing to apply correct treatment.',
        icon: '🔍',
        category: 'treatment',
        severity: 'low',
        expandedContent: 'Yellowing leaves can have multiple causes. Proper diagnosis is essential for effective treatment.',
        steps: [
          'Check soil moisture level',
          'Examine yellowing pattern (bottom-up vs random)',
          'Assess light conditions',
          'Review watering schedule',
          'Consider fertilization needs',
          'Apply appropriate treatment based on diagnosis'
        ]
      }
    ],
    prevention: [
      {
        id: 'yellowing-prevention',
        title: 'Prevent Leaf Yellowing',
        description: 'Maintain consistent care to prevent yellowing.',
        icon: '🌿',
        category: 'prevention',
        steps: [
          'Establish consistent watering schedule',
          'Provide appropriate light levels',
          'Fertilize during growing season',
          'Monitor for pests regularly',
          'Remove old leaves naturally'
        ]
      }
    ]
  }
};

export const tipCategories: TipCategory[] = [
  {
    id: 'general-care',
    name: 'General Care',
    icon: '🌱',
    description: 'Essential tips for everyday plant care',
    tips: generalTips
  },
  {
    id: 'seasonal-care',
    name: 'Seasonal Care',
    icon: '🗓️',
    description: 'Adjust care based on seasons',
    tips: seasonalTips
  },
  {
    id: 'disease-treatment',
    name: 'Disease Treatment',
    icon: '🏥',
    description: 'How to treat common plant diseases',
    tips: diseaseTips
  },
  {
    id: 'prevention',
    name: 'Prevention',
    icon: '🛡️',
    description: 'Prevent problems before they start',
    tips: preventionTips
  }
];

/**
 * Get tips based on scan result status and confidence
 */
export const getTipsForScanResult = (status: 'healthy' | 'diseased', confidence: number): PlantTip[] => {
  if (status === 'healthy') {
    return [
      generalTips.find(tip => tip.id === 'regular-inspection')!,
      preventionTips.find(tip => tip.id === 'pest-prevention')!,
      generalTips.find(tip => tip.id === 'watering-basics')!
    ];
  } else {
    // For diseased plants, provide treatment and prevention tips
    const treatmentTips = diseaseTips.slice(0, 2);
    const preventionTip = preventionTips.find(tip => tip.id === 'disease-prevention')!;
    return [...treatmentTips, preventionTip];
  }
};

/**
 * Get specific disease information if available
 */
export const getDiseaseInfo = (diseaseType?: string): DiseaseInfo | null => {
  if (!diseaseType) return null;
  return diseaseDatabase[diseaseType] || null;
};