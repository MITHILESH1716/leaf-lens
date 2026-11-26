// Care and treatment data for the 25 plants LeafCare supports.
//
// How it is used (see pages/Detect.jsx):
//   1. The AI model names the plant and lists the symptoms it can see.
//   2. findPlant() matches the plant name to an entry below (aliases cover other names).
//   3. rankProblems() compares the symptom text with each problem's "keywords"
//      and returns the closest matches with their treatment steps.
//
// productId matches an id in supplements.js:
//   1 Copper Fungicide   2 Sulphur   3 Neem Oil   4 NPK Fertilizer   5 Vermicompost
//   6 Farmyard Manure    7 Neem Cake 8 Trichoderma 9 Cocopeat        10 Seaweed Extract
//
// All advice is general and organic-first. Always read the product label.

export const DISCLAIMER =
  'This is general guidance based on the visible symptoms, not a lab diagnosis. For serious or spreading problems, show the plant to your nearest Krishi Vigyan Kendra (KVK) or agriculture officer before spraying.'

// Used when the plant is not in the list, or no problem matches the symptoms.
export const generalAdvice = [
  'Remove badly affected leaves and bin them (do not compost them).',
  'Water at the base of the plant in the morning and keep the leaves dry.',
  'Give plants enough space so air can move between them.',
  'Spray neem oil on both sides of the leaves in the evening, following the label.',
  'If the problem keeps spreading, ask a local KVK or agriculture officer.',
]

export const plantCare = [
  {
    id: 'apple',
    name: 'Apple',
    aliases: ['apple', 'apples'],
    care: ['Prune in winter so sunlight and air reach the centre of the tree.', 'Collect and destroy fallen leaves every autumn.'],
    problems: [
      {
        name: 'Apple scab',
        signs: 'Olive-green to brown, velvety or scabby spots on leaves; leaves may yellow and drop early.',
        keywords: ['scab', 'olive', 'velvet', 'spot', 'brown', 'dark'],
        treatment: ['Rake up and destroy fallen leaves.', 'Prune for open airflow.', 'Spray sulphur or copper from bud break, as per the label.'],
        productId: 2,
      },
      {
        name: 'Powdery mildew',
        signs: 'White powdery coating; young leaves curl and look stunted.',
        keywords: ['white', 'powder', 'mildew', 'curl', 'fuzz', 'dusty'],
        treatment: ['Remove infected shoots.', 'Spray wettable sulphur at the first sign.', 'Avoid too much nitrogen fertilizer.'],
        productId: 2,
      },
      {
        name: 'Marssonina leaf blotch',
        signs: 'Dark brown-green patches with yellowing, followed by early leaf fall.',
        keywords: ['blotch', 'patch', 'brown', 'yellow', 'drop', 'dark'],
        treatment: ['Destroy fallen leaves.', 'Avoid water standing around the tree.', 'Use a copper-based spray before and during the rains.'],
        productId: 1,
      },
    ],
  },
  {
    id: 'banana',
    name: 'Banana',
    aliases: ['banana', 'bananas', 'plantain'],
    care: ['Remove dry and dead leaves regularly.', 'Feed with compost and potash; banana needs plenty of potassium.'],
    problems: [
      {
        name: 'Sigatoka leaf spot',
        signs: 'Small yellow streaks that turn into brown spots with a yellow halo; leaf dries.',
        keywords: ['streak', 'yellow', 'spot', 'brown', 'halo', 'dry', 'stripe'],
        treatment: ['Cut off and burn infected leaves.', 'Improve drainage and plant spacing.', 'Spray copper fungicide as per the label.'],
        productId: 1,
      },
      {
        name: 'Panama wilt (Fusarium)',
        signs: 'Older leaves yellow from the edges, then collapse and hang down around the stem.',
        keywords: ['wilt', 'yellow', 'collapse', 'droop', 'hang', 'dry'],
        treatment: ['There is no cure: remove and destroy the plant.', 'Plant disease-free tissue-culture saplings.', 'Apply Trichoderma to the soil and do not replant in the same spot.'],
        productId: 8,
      },
      {
        name: 'Banana bunchy top virus',
        signs: 'Narrow, upright, stunted leaves with dark green streaks along the veins.',
        keywords: ['narrow', 'stunt', 'streak', 'upright', 'bunch', 'dark green'],
        treatment: ['Uproot and destroy infected plants.', 'Control aphids with neem oil.', 'Use only virus-free planting material.'],
        productId: 3,
      },
    ],
  },
  {
    id: 'blueberry',
    name: 'Blueberry',
    aliases: ['blueberry', 'blueberries'],
    care: ['Blueberries need acidic soil (about pH 4.5 to 5.5).', 'Mulch with pine needles or compost and water regularly.'],
    problems: [
      {
        name: 'Septoria leaf spot',
        signs: 'Small round spots with grey centres and dark brown borders.',
        keywords: ['spot', 'round', 'grey', 'gray', 'brown', 'border', 'circular'],
        treatment: ['Remove affected leaves.', 'Avoid wetting the leaves when watering.', 'Use a copper spray if it spreads.'],
        productId: 1,
      },
      {
        name: 'Powdery mildew',
        signs: 'White-grey powder on leaves; leaves may curl.',
        keywords: ['white', 'powder', 'mildew', 'curl', 'fuzz', 'dusty'],
        treatment: ['Improve airflow by pruning.', 'Spray sulphur at the first sign.', 'Avoid too much nitrogen.'],
        productId: 2,
      },
      {
        name: 'Yellowing from high soil pH (iron deficiency)',
        signs: 'Leaves turn pale yellow while the veins stay green.',
        keywords: ['yellow', 'pale', 'vein', 'chlorosis', 'fade'],
        treatment: ['Test the soil pH and bring it down to the acidic range.', 'Add acidic mulch and compost.', 'Use seaweed extract to help the plant recover.'],
        productId: 10,
      },
    ],
  },
  {
    id: 'cashew',
    name: 'Cashew',
    aliases: ['cashew', 'cashew nut', 'cashew tree'],
    care: ['Prune dry and crowded branches after harvest.', 'Add farmyard manure around the base before the monsoon.'],
    problems: [
      {
        name: 'Anthracnose',
        signs: 'Dark brown to black spots on leaves and tender shoots; shoots dry from the tip.',
        keywords: ['spot', 'brown', 'black', 'dry', 'lesion', 'shoot', 'dark'],
        treatment: ['Prune and burn affected shoots.', 'Spray copper fungicide on new flushes.', 'Keep the orchard clean of fallen leaves.'],
        productId: 1,
      },
      {
        name: 'Powdery mildew (Oidium)',
        signs: 'White powdery patches on young leaves and flower shoots.',
        keywords: ['white', 'powder', 'mildew', 'fuzz', 'dusty', 'young'],
        treatment: ['Dust or spray wettable sulphur at the flush stage.', 'Prune to let air through the canopy.', 'Avoid excess nitrogen.'],
        productId: 2,
      },
      {
        name: 'Tea mosquito bug damage',
        signs: 'Small dark, sunken spots on tender leaves and shoots that later dry up.',
        keywords: ['dark', 'sunken', 'tender', 'spot', 'shoot', 'dry', 'blacken'],
        treatment: ['Spray neem oil on new flushes in the evening.', 'Remove and destroy badly damaged shoots.', 'Check the tree regularly during flushing.'],
        productId: 3,
      },
    ],
  },
  {
    id: 'corn',
    name: 'Corn',
    aliases: ['corn', 'maize', 'sweet corn'],
    care: ['Rotate with legumes such as soybean to rebuild the soil.', 'Do not let water stand in the field.'],
    problems: [
      {
        name: 'Common rust',
        signs: 'Small reddish-brown powdery pustules on both sides of the leaf.',
        keywords: ['rust', 'pustule', 'orange', 'reddish', 'brown', 'powder', 'bump'],
        treatment: ['Plant resistant hybrids.', 'Spray at the first pustules as per the label.', 'Rotate crops each season.'],
        productId: 3,
      },
      {
        name: 'Northern leaf blight',
        signs: 'Long, cigar-shaped grey-green or tan lesions on the leaf.',
        keywords: ['lesion', 'long', 'cigar', 'grey', 'gray', 'tan', 'blight', 'streak', 'elongated'],
        treatment: ['Use resistant varieties.', 'Plough in crop residue after harvest.', 'Spray copper fungicide if it spreads early.'],
        productId: 1,
      },
      {
        name: 'Fall armyworm damage',
        signs: 'Ragged chewed holes in leaves and sawdust-like droppings in the whorl.',
        keywords: ['hole', 'chew', 'ragged', 'frass', 'caterpillar', 'whorl', 'torn', 'eaten'],
        treatment: ['Hand-pick egg masses and larvae early.', 'Apply neem oil or Bt into the whorl.', 'Sow on time; late sowing gets heavier attack.'],
        productId: 3,
      },
    ],
  },
  {
    id: 'cotton',
    name: 'Cotton',
    aliases: ['cotton', 'cotton plant'],
    care: ['Use well-drained black soil and avoid waterlogging.', 'Scout weekly for whitefly and aphids.'],
    problems: [
      {
        name: 'Leaf curl virus',
        signs: 'Leaves curl up or down with thick dark veins; plants are stunted. Spread by whitefly.',
        keywords: ['curl', 'vein', 'thick', 'stunt', 'whitefly', 'crinkle', 'twist'],
        treatment: ['Uproot and destroy infected plants.', 'Use yellow sticky traps and neem oil for whitefly.', 'Choose tolerant varieties.'],
        productId: 3,
      },
      {
        name: 'Alternaria leaf spot',
        signs: 'Brown round spots with rings inside them, sometimes with a yellow edge.',
        keywords: ['ring', 'concentric', 'target', 'round', 'brown', 'spot', 'circular'],
        treatment: ['Remove infected leaves.', 'Avoid overhead irrigation.', 'Spray copper fungicide if it spreads.'],
        productId: 1,
      },
      {
        name: 'Bacterial blight',
        signs: 'Angular, water-soaked spots limited by the veins that turn brown or black.',
        keywords: ['angular', 'water-soaked', 'water soaked', 'vein', 'black', 'brown', 'blight'],
        treatment: ['Use certified, delinted seed.', 'Spray copper as per the label.', 'Destroy infected crop residue after harvest.'],
        productId: 1,
      },
    ],
  },
  {
    id: 'grapes',
    name: 'Grapes',
    aliases: ['grape', 'grapes', 'grapevine', 'grape vine'],
    care: ['Prune and train the vine so leaves dry quickly after rain.', 'Avoid wetting the leaves with overhead irrigation.'],
    problems: [
      {
        name: 'Downy mildew',
        signs: 'Yellow oily patches on top of the leaf with white downy growth underneath.',
        keywords: ['oily', 'yellow', 'white', 'downy', 'underside', 'patch', 'mildew', 'fuzz'],
        treatment: ['Remove infected leaves and open the canopy.', 'Spray copper (Bordeaux) in humid weather.', 'Avoid overhead irrigation.'],
        productId: 1,
      },
      {
        name: 'Powdery mildew',
        signs: 'White-grey powder on leaves and berries.',
        keywords: ['white', 'powder', 'grey', 'gray', 'mildew', 'dusty', 'fuzz'],
        treatment: ['Spray wettable sulphur at the first sign.', 'Prune for airflow.', 'Do not spray sulphur in very hot weather.'],
        productId: 2,
      },
      {
        name: 'Anthracnose (bird’s-eye spot)',
        signs: 'Small dark brown spots with grey centres; the centre may fall out and leave holes.',
        keywords: ['spot', 'hole', 'brown', 'dark', 'grey', 'gray', 'shot', 'circular', 'frayed', 'torn'],
        treatment: ['Prune and destroy infected shoots and leaves.', 'Spray copper during wet weather.', 'Keep the vineyard floor clean.'],
        productId: 1,
      },
    ],
  },
  {
    id: 'guava',
    name: 'Guava',
    aliases: ['guava', 'guavas', 'peru'],
    care: ['Prune lightly after harvest to keep the tree open.', 'Mulch and add farmyard manure; avoid waterlogging.'],
    problems: [
      {
        name: 'Anthracnose',
        signs: 'Dark sunken spots on leaves and fruit; twigs may dry back.',
        keywords: ['spot', 'dark', 'brown', 'sunken', 'dry', 'dieback', 'black'],
        treatment: ['Prune and burn dry twigs.', 'Spray copper fungicide before the rains.', 'Pick and destroy infected fruit.'],
        productId: 1,
      },
      {
        name: 'Algal leaf spot (red rust)',
        signs: 'Orange-rust coloured velvety patches on leaves.',
        keywords: ['rust', 'orange', 'velvet', 'reddish', 'patch', 'spot'],
        treatment: ['Prune crowded branches.', 'Spray copper fungicide.', 'Improve drainage around the tree.'],
        productId: 1,
      },
      {
        name: 'Wilt',
        signs: 'Leaves yellow and droop, branches dry one after another.',
        keywords: ['wilt', 'yellow', 'droop', 'dry', 'collapse'],
        treatment: ['Remove and destroy dying plants.', 'Add Trichoderma with farmyard manure.', 'Avoid waterlogging and root injury.'],
        productId: 8,
      },
    ],
  },
  {
    id: 'hibiscus',
    name: 'Hibiscus',
    aliases: ['hibiscus', 'china rose', 'jasvand', 'rose mallow'],
    care: ['Give 5 to 6 hours of sun and water when the top soil feels dry.', 'Prune lightly to keep the plant bushy.'],
    problems: [
      {
        name: 'Aphids and mealybugs',
        signs: 'Sticky leaves, curled new growth, white cottony patches.',
        keywords: ['sticky', 'curl', 'cotton', 'white', 'insect', 'sooty', 'honeydew', 'bug'],
        treatment: ['Wash pests off with a strong water jet.', 'Spray neem oil every 7 days.', 'Remove heavily infested shoots.'],
        productId: 3,
      },
      {
        name: 'Cercospora leaf spot',
        signs: 'Round brown spots with a yellow halo; leaves yellow and drop.',
        keywords: ['spot', 'brown', 'yellow', 'halo', 'round', 'drop'],
        treatment: ['Remove affected leaves.', 'Water at the base, not on the leaves.', 'Use copper spray if it spreads.'],
        productId: 1,
      },
      {
        name: 'Nutrient deficiency or overwatering',
        signs: 'Leaves turn pale yellow and drop without clear spots.',
        keywords: ['yellow', 'pale', 'drop', 'fade', 'dull'],
        treatment: ['Check that the pot or bed drains well.', 'Feed with a balanced NPK fertilizer.', 'Add vermicompost to the soil.'],
        productId: 4,
      },
    ],
  },
  {
    id: 'lemon',
    name: 'Lemon',
    aliases: ['lemon', 'lemons', 'lime', 'nimbu', 'citrus limon', 'citrus aurantiifolia'],
    care: ['Water deeply but let the soil dry slightly between waterings.', 'Feed with compost and a balanced fertilizer in the growing season.'],
    problems: [
      {
        name: 'Citrus canker',
        signs: 'Raised, corky brown lesions with a yellow halo on leaves and fruit.',
        keywords: ['canker', 'raised', 'corky', 'halo', 'yellow', 'brown', 'spot', 'lesion'],
        treatment: ['Prune and destroy infected twigs and leaves.', 'Spray copper fungicide.', 'Control leaf miner, which helps canker spread.'],
        productId: 1,
      },
      {
        name: 'Citrus leaf miner',
        signs: 'Silvery winding trails inside young leaves; leaves curl.',
        keywords: ['silver', 'trail', 'curl', 'winding', 'tunnel', 'twist'],
        treatment: ['Spray neem oil on new flushes.', 'Remove and destroy badly mined leaves.', 'Avoid heavy pruning that triggers many soft new shoots.'],
        productId: 3,
      },
      {
        name: 'Sooty mould',
        signs: 'Black soot-like coating on leaves, usually with sticky honeydew from insects.',
        keywords: ['black', 'sooty', 'sticky', 'coating', 'soot', 'honeydew'],
        treatment: ['Control the sap-sucking insects with neem oil.', 'Wash the coating off with water.', 'Prune to improve airflow.'],
        productId: 3,
      },
    ],
  },
  {
    id: 'mango',
    name: 'Mango',
    aliases: ['mango', 'mangoes', 'mongo', 'alphonso mango', 'alphonso'],
    care: ['Prune after harvest to keep the canopy open.', 'Add farmyard manure around the tree before the monsoon.'],
    problems: [
      {
        name: 'Anthracnose',
        signs: 'Dark irregular spots on leaves and flowers; spots may have a yellow halo.',
        keywords: ['spot', 'dark', 'black', 'brown', 'blight', 'lesion', 'halo'],
        treatment: ['Prune dry and infected twigs.', 'Spray copper fungicide at flowering and in wet weather.', 'Clean fallen leaves from the orchard.'],
        productId: 1,
      },
      {
        name: 'Powdery mildew',
        signs: 'White powdery growth on young leaves and flower panicles.',
        keywords: ['white', 'powder', 'mildew', 'fuzz', 'dusty', 'young'],
        treatment: ['Spray wettable sulphur at the start of flowering.', 'Avoid spraying at peak noon heat.', 'Keep the canopy open.'],
        productId: 2,
      },
      {
        name: 'Mango hopper and sooty mould',
        signs: 'Sticky leaves with a black sooty coating; tiny hopper insects on flowers.',
        keywords: ['sticky', 'sooty', 'black', 'coating', 'honeydew', 'insect'],
        treatment: ['Spray neem oil at flower bud stage.', 'Wash off sooty mould with water.', 'Prune to reduce shaded, humid spots.'],
        productId: 3,
      },
    ],
  },
  {
    id: 'onion',
    name: 'Onion',
    aliases: ['onion', 'onions', 'kanda'],
    care: ['Use well-drained soil and avoid overwatering near harvest.', 'Rotate with non-onion crops every season.'],
    problems: [
      {
        name: 'Purple blotch',
        signs: 'Small white sunken spots that grow into purple centres with a yellow edge.',
        keywords: ['purple', 'blotch', 'lesion', 'white', 'sunken', 'yellow', 'elongated'],
        treatment: ['Remove infected leaves.', 'Spray copper fungicide.', 'Avoid overhead watering and crowding.'],
        productId: 1,
      },
      {
        name: 'Downy mildew',
        signs: 'Pale patches covered with grey-purple fuzz in humid weather.',
        keywords: ['fuzz', 'pale', 'grey', 'gray', 'purple', 'downy', 'mildew', 'patch'],
        treatment: ['Improve drainage and airflow.', 'Spray copper fungicide early.', 'Avoid planting too densely.'],
        productId: 1,
      },
      {
        name: 'Thrips',
        signs: 'Silvery-white streaks or patches; leaf tips whiten and twist.',
        keywords: ['silver', 'white', 'streak', 'patch', 'tip', 'twist', 'curl'],
        treatment: ['Spray neem oil in the evening.', 'Use blue sticky traps.', 'Keep the field free of weeds.'],
        productId: 3,
      },
    ],
  },
  {
    id: 'orange',
    name: 'Orange (Citrus)',
    aliases: ['orange', 'oranges', 'mandarin', 'nagpur orange', 'santra', 'citrus sinensis', 'citrus reticulata'],
    care: ['Water deeply but never let water stand around the trunk.', 'Add compost and farmyard manure twice a year.'],
    problems: [
      {
        name: 'Citrus canker',
        signs: 'Raised, corky brown lesions with a yellow halo on leaves and fruit.',
        keywords: ['canker', 'raised', 'corky', 'halo', 'yellow', 'brown', 'spot', 'lesion'],
        treatment: ['Prune and destroy infected twigs.', 'Spray copper fungicide.', 'Control leaf miner.'],
        productId: 1,
      },
      {
        name: 'Citrus leaf miner',
        signs: 'Silvery winding trails inside young leaves; leaves curl.',
        keywords: ['silver', 'trail', 'curl', 'winding', 'tunnel', 'twist'],
        treatment: ['Spray neem oil on new flushes.', 'Remove badly mined leaves.', 'Avoid heavy pruning that triggers soft new growth.'],
        productId: 3,
      },
      {
        name: 'Citrus greening (HLB)',
        signs: 'Blotchy yellow-green mottling that does not follow the veins; yellow shoots.',
        keywords: ['mottle', 'blotchy', 'yellow', 'asymmetric', 'vein', 'patchy'],
        treatment: ['There is no cure: remove infected trees.', 'Control the psyllid insect with neem oil.', 'Buy only certified disease-free saplings.'],
        productId: 3,
      },
    ],
  },
  {
    id: 'potato',
    name: 'Potato',
    aliases: ['potato', 'potatoes', 'batata'],
    care: ['Use certified seed tubers and earth up the plants as they grow.', 'Avoid waterlogging, especially during cloudy, humid weather.'],
    problems: [
      {
        name: 'Early blight',
        signs: 'Dark brown spots with rings like a target, with yellowing around them.',
        keywords: ['ring', 'concentric', 'target', 'brown', 'spot', 'yellow', 'circular'],
        treatment: ['Remove infected lower leaves.', 'Rotate crops and avoid wet leaves.', 'Spray copper fungicide as per the label.'],
        productId: 1,
      },
      {
        name: 'Late blight',
        signs: 'Water-soaked dark patches that spread fast, with white fuzz underneath in humid weather.',
        keywords: ['water-soaked', 'water soaked', 'dark', 'blight', 'white', 'fuzz', 'patch', 'black'],
        treatment: ['Remove and destroy infected plants quickly.', 'Spray copper before and during cool, wet weather.', 'Use certified seed and avoid overhead irrigation.'],
        productId: 1,
      },
      {
        name: 'Leaf roll or aphid damage',
        signs: 'Leaves roll or curl upward and plants are stunted.',
        keywords: ['curl', 'roll', 'stunt', 'aphid', 'twist'],
        treatment: ['Control aphids with neem oil.', 'Remove infected plants.', 'Use virus-free seed tubers.'],
        productId: 3,
      },
    ],
  },
  {
    id: 'red-amaranth',
    name: 'Red Amaranth',
    aliases: ['red amaranth', 'amaranth', 'amaranthus', 'lal math', 'lal maath', 'chaulai'],
    care: ['Grows quickly in warm weather; harvest young leaves regularly.', 'Add vermicompost and water lightly every day or two.'],
    problems: [
      {
        name: 'White rust',
        signs: 'White blister-like pustules under the leaf and yellow patches on top.',
        keywords: ['white', 'blister', 'pustule', 'yellow', 'rust', 'patch'],
        treatment: ['Remove affected leaves.', 'Avoid overhead watering.', 'Spray copper fungicide if it spreads.'],
        productId: 1,
      },
      {
        name: 'Caterpillar or leaf webber damage',
        signs: 'Holes, chewed or webbed-together leaves.',
        keywords: ['hole', 'web', 'chew', 'caterpillar', 'ragged', 'eaten', 'torn'],
        treatment: ['Hand-pick caterpillars and webbed leaves.', 'Spray neem oil or Bt in the evening.', 'Keep weeds away from the bed.'],
        productId: 3,
      },
      {
        name: 'Leaf spot (Cercospora or Alternaria)',
        signs: 'Round brown spots, sometimes with a lighter centre.',
        keywords: ['spot', 'brown', 'round', 'circular', 'grey', 'gray'],
        treatment: ['Pick off spotted leaves.', 'Give plants more space.', 'Use copper spray only if it spreads.'],
        productId: 1,
      },
    ],
  },
  {
    id: 'rice',
    name: 'Rice',
    aliases: ['rice', 'paddy', 'rice plant'],
    care: ['Do not overuse nitrogen fertilizer; it makes rice more prone to disease.', 'Keep field water levels steady and clear of weeds.'],
    problems: [
      {
        name: 'Blast',
        signs: 'Diamond or spindle-shaped lesions with grey centres and brown edges.',
        keywords: ['diamond', 'spindle', 'grey', 'gray', 'lesion', 'brown', 'blast', 'eye'],
        treatment: ['Avoid excess nitrogen.', 'Treat seed and soil with bio-agents such as Trichoderma or Pseudomonas.', 'Ask your agriculture officer for a recommended fungicide if severe.'],
        productId: 8,
      },
      {
        name: 'Bacterial leaf blight',
        signs: 'Yellow-white wavy stripes starting at the leaf tip or edge, then drying.',
        keywords: ['stripe', 'yellow', 'wavy', 'edge', 'tip', 'blight', 'dry'],
        treatment: ['Use certified seed.', 'Drain the field and avoid excess nitrogen.', 'Spray copper as per the label if it spreads.'],
        productId: 1,
      },
      {
        name: 'Brown spot',
        signs: 'Oval brown spots with a yellow halo, common in poor, nutrient-low soil.',
        keywords: ['oval', 'brown', 'spot', 'halo', 'yellow'],
        treatment: ['Apply balanced fertilizer, especially potash.', 'Add compost or farmyard manure.', 'Use treated, healthy seed.'],
        productId: 4,
      },
    ],
  },
  {
    id: 'rose',
    name: 'Rose',
    aliases: ['rose', 'roses', 'gulab'],
    care: ['Give at least 5 to 6 hours of morning sun.', 'Prune dead and crossing stems and water at the base.'],
    problems: [
      {
        name: 'Black spot',
        signs: 'Round black spots with fringed edges; yellow leaves that drop.',
        keywords: ['black', 'spot', 'fringe', 'yellow', 'drop', 'round'],
        treatment: ['Pick off and bin spotted leaves.', 'Water at the base in the morning.', 'Spray copper or sulphur as per the label.'],
        productId: 1,
      },
      {
        name: 'Powdery mildew',
        signs: 'White powdery coating on leaves and buds; new leaves may curl.',
        keywords: ['white', 'powder', 'mildew', 'curl', 'fuzz', 'dusty'],
        treatment: ['Prune for airflow.', 'Spray sulphur at the first sign.', 'Avoid crowding plants.'],
        productId: 2,
      },
      {
        name: 'Aphids',
        signs: 'Clusters of small insects on new shoots and buds; sticky leaves.',
        keywords: ['sticky', 'insect', 'cluster', 'curl', 'honeydew', 'sooty'],
        treatment: ['Wash off with a water jet.', 'Spray neem oil every 7 days.', 'Encourage ladybirds by avoiding harsh sprays.'],
        productId: 3,
      },
    ],
  },
  {
    id: 'spinach',
    name: 'Spinach',
    aliases: ['spinach', 'palak'],
    care: ['Grow in cool weather with steady moisture.', 'Harvest outer leaves first and add vermicompost between crops.'],
    problems: [
      {
        name: 'Downy mildew',
        signs: 'Yellow patches on top with grey-purple fuzz underneath.',
        keywords: ['yellow', 'patch', 'fuzz', 'grey', 'gray', 'purple', 'downy', 'mildew'],
        treatment: ['Remove infected leaves.', 'Space plants out and water in the morning.', 'Spray copper only if the problem spreads.'],
        productId: 1,
      },
      {
        name: 'Cercospora leaf spot',
        signs: 'Small round spots with tan centres and dark purple borders.',
        keywords: ['spot', 'round', 'tan', 'purple', 'border', 'brown', 'circular'],
        treatment: ['Pick off spotted leaves.', 'Rotate the bed with another crop.', 'Avoid wetting the leaves.'],
        productId: 1,
      },
      {
        name: 'Leaf miner',
        signs: 'Winding tunnels or pale blotches inside the leaf.',
        keywords: ['tunnel', 'trail', 'blotch', 'white', 'silver', 'winding'],
        treatment: ['Remove and bin mined leaves.', 'Spray neem oil.', 'Cover young plants with fine net.'],
        productId: 3,
      },
    ],
  },
  {
    id: 'sweet-lemon',
    name: 'Sweet Lemon',
    aliases: ['sweet lemon', 'mosambi', 'mosambi orange', 'sweet lime', 'musambi', 'citrus limetta', 'citrus limettioides'],
    care: ['Water deeply but let the soil dry between waterings.', 'Keep the trunk base dry and add compost around the tree.'],
    problems: [
      {
        name: 'Citrus canker',
        signs: 'Raised, corky brown lesions with a yellow halo on leaves and fruit.',
        keywords: ['canker', 'raised', 'corky', 'halo', 'yellow', 'brown', 'spot', 'lesion'],
        treatment: ['Prune and destroy infected twigs.', 'Spray copper fungicide.', 'Control leaf miner.'],
        productId: 1,
      },
      {
        name: 'Citrus leaf miner',
        signs: 'Silvery winding trails inside young leaves; leaves curl.',
        keywords: ['silver', 'trail', 'curl', 'winding', 'tunnel', 'twist'],
        treatment: ['Spray neem oil on new flushes.', 'Remove badly mined leaves.', 'Avoid heavy pruning that triggers soft new growth.'],
        productId: 3,
      },
      {
        name: 'Gummosis (trunk rot)',
        signs: 'Brown gum oozing from the bark, with yellowing leaves and weak growth.',
        keywords: ['gum', 'ooze', 'bark', 'yellow', 'wilt', 'weak', 'trunk'],
        treatment: ['Scrape off the diseased bark and paint with Bordeaux paste.', 'Improve drainage and keep the trunk dry.', 'Apply Trichoderma around the root zone.'],
        productId: 8,
      },
    ],
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    aliases: ['strawberry', 'strawberries'],
    care: ['Mulch under the plants to keep fruit and leaves off wet soil.', 'Water at the base and remove old, dying leaves.'],
    problems: [
      {
        name: 'Leaf spot',
        signs: 'Small purple or red spots with grey-white centres.',
        keywords: ['purple', 'red', 'spot', 'grey', 'gray', 'white', 'centre', 'center'],
        treatment: ['Remove affected leaves.', 'Avoid overhead watering.', 'Spray copper if it spreads.'],
        productId: 1,
      },
      {
        name: 'Powdery mildew',
        signs: 'Leaf edges curl upward with a white coating underneath.',
        keywords: ['white', 'powder', 'mildew', 'curl', 'fuzz', 'dusty', 'edge'],
        treatment: ['Improve airflow.', 'Spray sulphur at the first sign.', 'Remove badly affected leaves.'],
        productId: 2,
      },
      {
        name: 'Spider mites',
        signs: 'Tiny yellow or bronze speckles with fine webbing under the leaf.',
        keywords: ['speckle', 'bronze', 'web', 'stipple', 'yellow', 'dry', 'dot'],
        treatment: ['Spray the underside of leaves with neem oil.', 'Wash plants with water in dry weather.', 'Keep plants well watered; mites love dry stress.'],
        productId: 3,
      },
    ],
  },
  {
    id: 'sugarcane',
    name: 'Sugarcane',
    aliases: ['sugarcane', 'sugar cane', 'cane', 'usu'],
    care: ['Use disease-free setts and apply farmyard manure before planting.', 'Avoid water stagnation, especially in black soil.'],
    problems: [
      {
        name: 'Rust',
        signs: 'Small orange-brown pustules in streaks on both sides of the leaf.',
        keywords: ['rust', 'pustule', 'orange', 'brown', 'streak', 'powder'],
        treatment: ['Grow resistant varieties.', 'Remove heavily infected leaves.', 'Spray copper fungicide as per the label if severe.'],
        productId: 1,
      },
      {
        name: 'Red rot',
        signs: 'Red lesions on the leaf midrib and leaves drying from the tip.',
        keywords: ['red', 'midrib', 'dry', 'lesion', 'drying', 'tip'],
        treatment: ['Use disease-free setts and treat them with Trichoderma.', 'Uproot and burn infected clumps.', 'Do not keep ratoon crops from infected fields.'],
        productId: 8,
      },
      {
        name: 'Grassy shoot disease',
        signs: 'Pale or white leaves and thin, grass-like shoots.',
        keywords: ['pale', 'white', 'yellow', 'thin', 'narrow', 'stunt', 'albino', 'bleach'],
        treatment: ['Use heat-treated, disease-free seed cane.', 'Remove infected clumps.', 'Control the insect carriers with neem oil.'],
        productId: 3,
      },
    ],
  },
  {
    id: 'sweet-potato',
    name: 'Sweet Potato',
    aliases: ['sweet potato', 'sweet potatoes', 'ratalu', 'shakarkand'],
    care: ['Plant on well-drained, loose soil or ridges.', 'Do not over-fertilise with nitrogen; it gives leaves, not tubers.'],
    problems: [
      {
        name: 'Leaf spot (Cercospora or Alternaria)',
        signs: 'Small brown or purple spots, sometimes with yellow edges.',
        keywords: ['spot', 'brown', 'purple', 'yellow', 'round', 'circular'],
        treatment: ['Remove spotted leaves.', 'Rotate with another crop.', 'Use copper spray if it spreads.'],
        productId: 1,
      },
      {
        name: 'Viral mottle (feathery mottle)',
        signs: 'Mottled or feathery purple patterns on leaves; plants stunted.',
        keywords: ['mottle', 'mosaic', 'feathery', 'purple', 'stunt', 'curl', 'pattern'],
        treatment: ['Plant virus-free cuttings.', 'Control whitefly and aphids with neem oil.', 'Remove infected plants.'],
        productId: 3,
      },
      {
        name: 'Leaf-eating caterpillars',
        signs: 'Holes or ragged edges in the leaves.',
        keywords: ['hole', 'chew', 'ragged', 'caterpillar', 'eaten', 'torn', 'frayed'],
        treatment: ['Hand-pick caterpillars.', 'Spray neem oil or Bt in the evening.', 'Keep the field weed-free.'],
        productId: 3,
      },
    ],
  },
  {
    id: 'taro',
    name: 'Taro Leaf',
    aliases: ['taro leaf', 'taro', 'colocasia', 'arbi', 'alu chi vadi', 'alu', 'elephant ear'],
    care: ['Taro likes moist, fertile soil with plenty of organic matter.', 'Space plants well; crowded leaves stay wet and get diseased.'],
    problems: [
      {
        name: 'Taro leaf blight',
        signs: 'Circular brown spots with water-soaked yellow edges and liquid drops; leaves collapse quickly in rain.',
        keywords: ['blight', 'brown', 'water-soaked', 'water soaked', 'circular', 'spot', 'yellow', 'drops', 'hole'],
        treatment: ['Remove and destroy infected leaves.', 'Plant with wider spacing and good drainage.', 'Spray copper fungicide before heavy rain.'],
        productId: 1,
      },
      {
        name: 'Leaf spot (Alternaria or Cercospora)',
        signs: 'Small brown spots, sometimes with rings.',
        keywords: ['spot', 'brown', 'ring', 'round', 'circular'],
        treatment: ['Pick off affected leaves.', 'Avoid overhead watering.', 'Use copper if it spreads.'],
        productId: 1,
      },
      {
        name: 'Caterpillar damage (Spodoptera)',
        signs: 'Large ragged holes or leaves eaten from the edges.',
        keywords: ['hole', 'chew', 'ragged', 'caterpillar', 'eaten', 'torn', 'frayed'],
        treatment: ['Hand-pick egg clusters and larvae.', 'Spray neem oil or Bt.', 'Keep weeds away.'],
        productId: 3,
      },
    ],
  },
  {
    id: 'tomato',
    name: 'Tomato',
    aliases: ['tomato', 'tomatoes'],
    care: ['Stake the plants and water at the base in the morning.', 'Mulch the soil to stop mud splashing onto the leaves.'],
    problems: [
      {
        name: 'Early blight',
        signs: 'Brown spots with target-like rings, starting on the lower leaves, with yellowing.',
        keywords: ['ring', 'concentric', 'target', 'brown', 'spot', 'yellow', 'lower'],
        treatment: ['Remove infected lower leaves.', 'Rotate crops and mulch the soil.', 'Spray copper fungicide as per the label.'],
        productId: 1,
      },
      {
        name: 'Late blight',
        signs: 'Large water-soaked dark patches that spread fast, with white fuzz in humid weather.',
        keywords: ['water-soaked', 'water soaked', 'dark', 'blight', 'white', 'fuzz', 'patch', 'black'],
        treatment: ['Remove and destroy infected plants fast.', 'Spray copper before wet, cool weather.', 'Avoid overhead irrigation.'],
        productId: 1,
      },
      {
        name: 'Leaf curl virus',
        signs: 'Leaves curl upward and turn yellow; plants are stunted. Spread by whitefly.',
        keywords: ['curl', 'yellow', 'stunt', 'whitefly', 'crinkle', 'twist', 'small'],
        treatment: ['Remove infected plants.', 'Use yellow sticky traps and neem oil for whitefly.', 'Plant tolerant varieties.'],
        productId: 3,
      },
    ],
  },
  {
    id: 'coconut',
    name: 'Coconut',
    aliases: ['coconut', 'coconut palm', 'coconut tree', 'nariyal'],
    care: ['Apply compost or farmyard manure around the base each year.', 'Remove dry fronds and keep the crown clean.'],
    problems: [
      {
        name: 'Leaf blight (grey leaf spot)',
        signs: 'Brown to grey spots with a yellow halo; leaflets dry from the tips.',
        keywords: ['grey', 'gray', 'spot', 'brown', 'halo', 'yellow', 'dry', 'tip', 'blight'],
        treatment: ['Cut and burn badly affected fronds.', 'Spray copper fungicide.', 'Give balanced nutrition, especially potash.'],
        productId: 1,
      },
      {
        name: 'Rugose spiralling whitefly',
        signs: 'White waxy spirals under the leaf, with sticky black sooty mould above.',
        keywords: ['white', 'spiral', 'waxy', 'sooty', 'black', 'sticky', 'honeydew'],
        treatment: ['Wash the leaves with a strong water jet.', 'Spray neem oil on the underside.', 'Avoid harsh pesticides that kill natural predators.'],
        productId: 3,
      },
      {
        name: 'Bud rot',
        signs: 'Central spindle leaf turns yellow and rots, often with a foul smell.',
        keywords: ['spindle', 'rot', 'yellow', 'central', 'bud', 'smell', 'collapse'],
        treatment: ['Cut away the rotten tissue and apply Bordeaux paste.', 'Spray copper on the crown before the monsoon.', 'Call an agriculture officer quickly; it can kill the palm.'],
        productId: 1,
      },
    ],
  },
]

// Orange, sweet lemon (mosambi) and lemon leaves look almost the same in a photo, so the
// model often just says "Citrus". This generic entry catches that case. It reuses the
// citrus problems above, which apply to all three. (generic: true = only used when no
// specific plant matches.)
plantCare.push({
  id: 'citrus',
  generic: true,
  name: 'Citrus (Orange / Sweet Lemon / Lemon)',
  aliases: ['citrus', 'citrus tree', 'citrus fruit', 'citrus plant', 'citrus species', 'citrus fruit tree'],
  note: 'Orange, sweet lemon (mosambi) and lemon leaves look very alike in a photo, so this advice covers citrus trees in general and applies to all three.',
  care: plantCare.find((p) => p.id === 'orange').care,
  problems: plantCare.find((p) => p.id === 'orange').problems,
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// Finds the plant in the list from whatever name the model gave, e.g.
// "Sweet Potato (Ipomoea batatas)" -> Sweet Potato, "Grape" -> Grapes.
// The longest matching alias wins, so "sweet potato" beats "potato".
export function findPlant(name = '') {
  const text = ` ${String(name).toLowerCase().replace(/[^a-z\s]/g, ' ').replace(/\s+/g, ' ')} `

  // Longest matching alias wins. Specific plants are tried first; generic
  // entries (like "Citrus") are only used when nothing specific matched.
  for (const wantGeneric of [false, true]) {
    let best = null
    let bestLength = 0
    for (const plant of plantCare) {
      if (Boolean(plant.generic) !== wantGeneric) continue
      for (const alias of plant.aliases) {
        if (text.includes(` ${alias} `) && alias.length > bestLength) {
          best = plant
          bestLength = alias.length
        }
      }
    }
    if (best) return best
  }
  return null
}

// Compares the symptoms with each problem's keywords and returns the closest
// problems (best first). Returns [] if nothing matches.
// Accepts a list of symptom strings (or one string). Statements such as
// "No visible fuzz" or "edges intact, no holes" are ignored, otherwise the
// word "fuzz" would wrongly count as a symptom.
const NEGATION = /\b(no|not|without|none|free of|absence of|absent)\b/

export function rankProblems(plant, symptoms = [], limit = 2) {
  const parts = (Array.isArray(symptoms) ? symptoms : [symptoms])
    .flatMap((s) => String(s).toLowerCase().split(/[.;]/))
    .filter((part) => part.trim() && !NEGATION.test(part))
  const text = parts.join(' ')

  return plant.problems
    .map((problem) => ({ ...problem, score: problem.keywords.filter((k) => text.includes(k)).length }))
    .filter((problem) => problem.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
}