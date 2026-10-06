import { SubjectData } from './cbseData';

export const COMPREHENSIVE_CURRICULUM: Record<string, SubjectData[]> = {
  'Class 6': [
    {
      id: 'science-6',
      name: 'Science',
      icon: 'Atom',
      color: 'purple',
      chapters: [
        { id: 'c6-s1', number: 1, title: 'Components of Food', summary: 'Nutrients, carbohydrates, proteins, fats, vitamins, balanced diet and deficiency diseases.', concepts: ['Major nutrients in food', 'Test for starch, protein and fat', 'Balanced diet importance'], importantQuestions: ['Name two foods rich in dietary fibres.', 'What causes Scurvy and Rickets?'] },
        { id: 'c6-s2', number: 2, title: 'Sorting Materials into Groups', summary: 'Properties of materials: appearance, hardness, solubility, buoyancy, transparency.', concepts: ['Transparent, translucent and opaque objects', 'Soluble vs insoluble substances'], importantQuestions: ['Why is a tumbler not made with a piece of cloth?'] },
        { id: 'c6-s3', number: 3, title: 'Separation of Substances', summary: 'Handpicking, winnowing, sieving, sedimentation, decantation, filtration, evaporation.', concepts: ['Methods of separation', 'Saturated solution definition'], importantQuestions: ['How will you separate sand and water from their mixture?'] },
        { id: 'c6-s4', number: 4, title: 'Getting to Know Plants', summary: 'Herbs, shrubs, trees, parts of a plant, stem, leaf venation, root systems, flower parts.', concepts: ['Taproot vs fibrous roots', 'Photosynthesis in green leaves', 'Transpiration in plants'], importantQuestions: ['State the main functions of leaf and stem in a plant.'] },
        { id: 'c6-s5', number: 5, title: 'Body Movements', summary: 'Human skeleton, ball and socket joints, hinge joints, pivot joints, locomotion in animals.', concepts: ['Ball and socket joint in shoulder/hip', 'Cartilage and bones', 'Movement in earthworm and snail'], importantQuestions: ['What is a ball and socket joint? Give an example.'] },
        { id: 'c6-s6', number: 6, title: 'The Living Organisms: Characteristics & Habitats', summary: 'Terrestrial and aquatic habitats, biotic and abiotic components, adaptations in camel, fish, cactus.', concepts: ['Adaptation for survival', 'Respiration vs breathing in living beings'], importantQuestions: ['Explain why a cactus is adapted to survive in a desert.'] },
        { id: 'c6-s7', number: 7, title: 'Motion and Measurement of Distances', summary: 'SI units of length, standard measurements, rectilinear motion, circular motion, periodic motion.', concepts: ['SI unit of length is metre', 'Types of motion with real-life examples'], importantQuestions: ['Give two examples of periodic motion and circular motion.'] },
        { id: 'c6-s8', number: 8, title: 'Light, Shadows and Reflections', summary: 'Luminous objects, formation of shadows, pinhole camera, reflection of light by mirrors.', concepts: ['Conditions for shadow formation', 'Pinhole camera working principle'], importantQuestions: ['Can you see a shadow in a completely dark room? Explain.'] },
        { id: 'c6-s9', number: 9, title: 'Electricity and Circuits', summary: 'Electric cell, electric bulb, closed and open circuits, conductors and insulators.', concepts: ['Circuit completeness for current flow', 'Conductors vs insulators'], importantQuestions: ['Why should an electrician use rubber gloves while repairing a switch?'] },
        { id: 'c6-s10', number: 10, title: 'Fun with Magnets', summary: 'Magnetic and non-magnetic materials, poles of a magnet, magnetic compass, attraction and repulsion.', concepts: ['Like poles repel, unlike poles attract', 'Earth as a giant magnet'], importantQuestions: ['Where are the poles of a bar magnet located?'] },
        { id: 'c6-s11', number: 11, title: 'Air Around Us', summary: 'Composition of air (Nitrogen, Oxygen, Carbon dioxide, water vapour), atmosphere, respiration in organisms.', concepts: ['Oxygen supports combustion and respiration', 'Nitrogen occupies 78% of air'], importantQuestions: ['Why does a lump of cotton wool shrink in water?'] }
      ]
    },
    {
      id: 'maths-6',
      name: 'Mathematics',
      icon: 'Calculator',
      color: 'blue',
      chapters: [
        { id: 'c6-m1', number: 1, title: 'Knowing Our Numbers', summary: 'Comparing numbers, Indian and International system of numeration, estimation, Roman numerals.', concepts: ['Place value chart', 'BODMAS rules', 'Roman numeral conversions'], importantQuestions: ['Write 98 and 49 in Roman numerals.'] },
        { id: 'c6-m2', number: 2, title: 'Whole Numbers', summary: 'Natural numbers, whole numbers, successor, predecessor, number line representation, properties of whole numbers.', concepts: ['Closure and Commutative property', 'Distributive property of multiplication'], importantQuestions: ['Find the product 738 × 103 using distributive property.'] },
        { id: 'c6-m3', number: 3, title: 'Playing with Numbers', summary: 'Factors and multiples, prime and composite numbers, divisibility tests, HCF and LCM.', concepts: ['Divisibility tests for 2, 3, 5, 9, 11', 'HCF and LCM calculation methods'], importantQuestions: ['Find the LCM and HCF of 12, 15 and 21.'] },
        { id: 'c6-m4', number: 4, title: 'Basic Geometrical Ideas', summary: 'Point, line segment, ray, intersecting and parallel lines, curves, polygons, angles, triangles, circles.', concepts: ['Radius, diameter, chord, sector and segment', 'Interior and exterior of angles'], importantQuestions: ['Draw a circle and mark its centre, a radius, and a sector.'] },
        { id: 'c6-m5', number: 5, title: 'Integers', summary: 'Positive and negative integers, representation on number line, addition and subtraction of integers.', concepts: ['Rules for adding and subtracting integers on number line'], importantQuestions: ['Find the value of (-13) + (+32) - 8 - 1.'] },
        { id: 'c6-m6', number: 6, title: 'Fractions', summary: 'Proper, improper and mixed fractions, equivalent fractions, simplest form, like and unlike fractions, addition and subtraction.', concepts: ['Representing fractions on number line', 'Cross-multiplication for equivalence'], importantQuestions: ['Solve: 2/3 + 1/7 + 3/21.'] },
        { id: 'c6-m7', number: 7, title: 'Decimals', summary: 'Tenths, hundredths, thousandths, converting fractions to decimals and vice versa, addition and subtraction of decimals.', concepts: ['Place value in decimal system', 'Money, length and weight in decimal notation'], importantQuestions: ['Express 5 cm in metres and kilometres using decimals.'] },
        { id: 'c6-m8', number: 8, title: 'Data Handling', summary: 'Recording and organising data, tally marks, pictographs, drawing and interpreting bar graphs.', concepts: ['Interpretation of bar graphs with uniform scaling'], importantQuestions: ['Organise given numerical data using a frequency tally table.'] },
        { id: 'c6-m9', number: 9, title: 'Mensuration', summary: 'Perimeter of rectangle, square, regular polygons. Area of rectangle and square.', concepts: ['Perimeter = 2(l + b)', 'Area of rectangle = length × breadth'], importantQuestions: ['Find the area of a square park whose perimeter is 320 m.'] },
        { id: 'c6-m10', number: 10, title: 'Algebra', summary: 'Introduction to variables, matchstick patterns, forming algebraic expressions and simple linear equations.', concepts: ['Variable representation by letters', 'Solving equations by trial and error'], importantQuestions: ['Write the algebraic expression for: 7 added to 2m.'] },
        { id: 'c6-m11', number: 11, title: 'Ratio and Proportion', summary: 'Concept of ratio, comparison of quantities, proportion, unitary method.', concepts: ['Ratio in simplest form', 'Unitary method for calculating cost'], importantQuestions: ['If the cost of 6 cans of juice is ₹210, then what will be the cost of 4 cans?'] }
      ]
    },
    {
      id: 'social-6',
      name: 'Social Science',
      icon: 'Compass',
      color: 'amber',
      chapters: [
        { id: 'c6-sst1', number: 1, title: 'Our Pasts I (History: What, Where, How and When?)', summary: 'Early humans, hunter-gatherers, Indus Valley civilisation, Harappan cities, Vedic period, Ashoka.', concepts: ['Archaeological sources and manuscripts', 'Town planning in Harappa'], importantQuestions: ['List three ways in which hunter-gatherers used fire.'] },
        { id: 'c6-sst2', number: 2, title: 'The Earth: Our Habitat (Geography: Solar System & Maps)', summary: 'Earth in solar system, latitudes, longitudes, motions of earth (rotation & revolution), major domains.', concepts: ['Globe coordinates', 'Rotation causes day/night, revolution causes seasons'], importantQuestions: ['Why is the Earth called a unique planet?'] },
        { id: 'c6-sst3', number: 3, title: 'Social & Political Life I (Civics: Diversity & Government)', summary: 'Understanding diversity, prejudice, discrimination, key elements of a democratic government, Panchayati Raj.', concepts: ['Unity in Diversity', 'Gram Panchayat functions and local governance'], importantQuestions: ['What are the main functions of a Gram Panchayat?'] }
      ]
    },
    {
      id: 'english-6',
      name: 'English',
      icon: 'BookOpen',
      color: 'emerald',
      chapters: [
        { id: 'c6-eng1', number: 1, title: 'Honeysuckle: Who Did Patrick\'s Homework?', summary: 'Story of Patrick who hates homework until an elf appears to help him.', concepts: ['Theme of self-reliance and diligent practice', 'Grammar: Nouns, pronouns and vocabulary'], importantQuestions: ['What did Patrick think his cat was playing with? What was it really?'] },
        { id: 'c6-eng2', number: 2, title: 'A Pact with the Sun (Supplementary Reader)', summary: 'Tale of Saeeda and her ailing mother receiving sunlight to recover health.', concepts: ['Healing power of nature and medical guidance'], importantQuestions: ['What did the specialist prescribe in addition to medicine?'] }
      ]
    }
  ],

  'Class 7': [
    {
      id: 'science-7',
      name: 'Science',
      icon: 'Atom',
      color: 'purple',
      chapters: [
        { id: 'c7-s1', number: 1, title: 'Nutrition in Plants', summary: 'Autotrophic and heterotrophic nutrition, photosynthesis, stomata, chlorophyll, insectivorous and parasitic plants.', concepts: ['Photosynthesis chemical equation', 'Pitcher plant and Cuscuta adaptations'], importantQuestions: ['Distinguish between a parasite and a saprotroph with examples.'] },
        { id: 'c7-s2', number: 2, title: 'Nutrition in Animals', summary: 'Digestion in humans: mouth, stomach, small intestine, liver, pancreas. Digestion in grass-eating animals.', concepts: ['Role of hydrochloric acid and bile juice', 'Rumination in cows'], importantQuestions: ['What is the function of villi in the small intestine?'] },
        { id: 'c7-s3', number: 3, title: 'Heat and Temperature', summary: 'Clinical and laboratory thermometers, conduction, convection, radiation, land breeze and sea breeze.', concepts: ['Heat transfer modes', 'Why woollen clothes keep us warm in winter'], importantQuestions: ['Explain why the mercury level does not fall on its own in a clinical thermometer.'] },
        { id: 'c7-s4', number: 4, title: 'Acids, Bases and Salts', summary: 'Natural indicators (litmus, turmeric, China rose), neutralization reaction, real life examples.', concepts: ['Acid + Base → Salt + Water', 'Treating ant bite with calamine solution'], importantQuestions: ['What happens when dilute hydrochloric acid is mixed with sodium hydroxide?'] },
        { id: 'c7-s5', number: 5, title: 'Physical and Chemical Changes', summary: 'Rusting of iron, crystallisation, burning of magnesium ribbon, chemical reactions.', concepts: ['Reversibility in physical changes', 'Rusting prevention: galvanisation'], importantQuestions: ['Explain why burning of wood and cutting it into small pieces are considered two different types of changes.'] },
        { id: 'c7-s6', number: 6, title: 'Respiration in Organisms', summary: 'Aerobic and anaerobic respiration, breathing mechanism, diaphragm, respiration in fish and insects.', concepts: ['Glucose breakdown in presence/absence of oxygen', 'Spiracles in cockroaches'], importantQuestions: ['Why do we often sneeze when we inhale a lot of dust-laden air?'] },
        { id: 'c7-s7', number: 7, title: 'Transportation in Animals and Plants', summary: 'Circulatory system, blood components, heart structure and pulse rate, xylem and phloem transport in plants.', concepts: ['RBC, WBC, platelets functions', 'Transpiration pull in xylem'], importantQuestions: ['Why is blood necessary for all parts of the human body?'] },
        { id: 'c7-s8', number: 8, title: 'Reproduction in Plants', summary: 'Asexual reproduction (budding, vegetative propagation, fragmentation) and sexual reproduction (pollination, fertilization).', concepts: ['Self vs cross pollination', 'Seed dispersal mechanisms'], importantQuestions: ['Describe the different methods of asexual reproduction with diagrams.'] },
        { id: 'c7-s9', number: 9, title: 'Motion and Time', summary: 'Speed calculation, standard units of time, simple pendulum, distance-time graphs.', concepts: ['Speed = Distance / Time', 'Time period of pendulum: T = 2π√(l/g)'], importantQuestions: ['A car travels 30 km at a uniform speed of 40 km/h and the next 30 km at a uniform speed of 20 km/h. Find average speed.'] },
        { id: 'c7-s10', number: 10, title: 'Electric Current and Its Effects', summary: 'Symbols of electric components, heating effect of electric current (fuse, heater), magnetic effect (electromagnet).', concepts: ['Joule heating effect', 'Working principle of electric bell and fuse wire'], importantQuestions: ['Why is a copper wire not used as a fuse wire in an electrical circuit?'] },
        { id: 'c7-s11', number: 11, title: 'Light', summary: 'Rectilinear propagation of light, plane mirrors, concave and convex spherical mirrors and lenses, rainbow formation.', concepts: ['Virtual vs real images', 'Convex lens as magnifying glass'], importantQuestions: ['State the characteristics of the image formed by a plane mirror.'] }
      ]
    },
    {
      id: 'maths-7',
      name: 'Mathematics',
      icon: 'Calculator',
      color: 'blue',
      chapters: [
        { id: 'c7-m1', number: 1, title: 'Integers', summary: 'Properties of addition and subtraction of integers, multiplication and division rules.', concepts: ['Distributive property: a × (b + c) = a × b + a × c'], importantQuestions: ['Verify: (-30) × [13 + (-3)] = [(-30) × 13] + [(-30) × (-3)].'] },
        { id: 'c7-m2', number: 2, title: 'Fractions and Decimals', summary: 'Multiplication and division of fractions, decimal arithmetic, word problems.', concepts: ['Reciprocal of fractions', 'Decimal shifts during multiplication and division'], importantQuestions: ['Find 2/5 of 1/4 and solve 0.2 × 0.16.'] },
        { id: 'c7-m3', number: 3, title: 'Data Handling', summary: 'Arithmetic mean, range, mode, median of ungrouped data, double bar graphs, probability basics.', concepts: ['Mean = Sum of observations / Total number', 'Median is middle value when ordered'], importantQuestions: ['Find the mode and median of: 13, 16, 12, 14, 19, 12, 14, 13, 14.'] },
        { id: 'c7-m4', number: 4, title: 'Simple Equations', summary: 'Setting up equations, solving linear equations by transposition method, application word problems.', concepts: ['Balancing equations', 'Transposition rules'], importantQuestions: ['Solve: 4(m + 3) = 18 and 3p/4 = 6.'] },
        { id: 'c7-m5', number: 5, title: 'Lines and Angles', summary: 'Complementary, supplementary, adjacent angles, linear pair, vertically opposite angles, transversal lines.', concepts: ['Alternate interior and corresponding angles with parallel lines'], importantQuestions: ['Find the angle which is equal to its complement.'] },
        { id: 'c7-m6', number: 6, title: 'The Triangle and Its Properties', summary: 'Medians, altitudes, exterior angle theorem, angle sum property of triangle, Pythagoras theorem.', concepts: ['Exterior angle = sum of two opposite interior angles', 'Pythagoras: Hypotenuse² = Base² + Altitude²'], importantQuestions: ['A tree is broken at a height of 5 m from ground. Find original height.'] },
        { id: 'c7-m7', number: 7, title: 'Comparing Quantities', summary: 'Ratios, percentages, profit and loss percentage, simple interest calculation.', concepts: ['Simple Interest SI = (P × R × T) / 100', 'Amount A = P + SI'], importantQuestions: ['Find the simple interest on ₹12000 at 5% per annum for 3 years.'] },
        { id: 'c7-m8', number: 8, title: 'Rational Numbers', summary: 'Positive and negative rational numbers, representation on number line, standard form, arithmetic operations.', concepts: ['Rational number definition p/q where q ≠ 0'], importantQuestions: ['Find five rational numbers between -1/2 and 2/3.'] },
        { id: 'c7-m9', number: 9, title: 'Perimeter and Area', summary: 'Area of parallelogram, area of triangle, circumference and area of circle, area of rectangular paths.', concepts: ['Area of circle = πr²', 'Circumference = 2πr'], importantQuestions: ['Find the cost of polishing a circular table-top of diameter 1.6 m at ₹15/m².'] },
        { id: 'c7-m10', number: 10, title: 'Algebraic Expressions', summary: 'Terms, factors, coefficients, like and unlike terms, addition and subtraction, finding expression values.', concepts: ['Monomials, binomials, trinomials', 'Evaluating expressions at given variable values'], importantQuestions: ['Simplify: 2(a² + ab) + 3 - ab and find value when a = 5, b = -3.'] },
        { id: 'c7-m11', number: 11, title: 'Exponents and Powers', summary: 'Exponential form, laws of exponents, expressing large numbers in standard scientific notation.', concepts: ['Laws: aᵐ × aⁿ = aᵐ⁺ⁿ, aᵐ ÷ aⁿ = aᵐ⁻ⁿ, (aᵐ)ⁿ = aᵐⁿ'], importantQuestions: ['Express 39087.8 in scientific standard form.'] }
      ]
    },
    {
      id: 'social-7',
      name: 'Social Science',
      icon: 'Compass',
      color: 'amber',
      chapters: [
        { id: 'c7-sst1', number: 1, title: 'Our Pasts II (History: Delhi Sultans & Mughal Empire)', summary: 'Delhi Sultanate dynasties, architecture, Mughal emperors Akbar and Jahangir, administration and Mansabdari.', concepts: ['Mansabdari system', 'Sulh-i Kul policy of Akbar'], importantQuestions: ['What were the relationships between the mansabdar and the jagir?'] },
        { id: 'c7-sst2', number: 2, title: 'Our Environment (Geography: Earth Layers & Atmosphere)', summary: 'Interior of the earth (crust, mantle, core), rock cycle, atmosphere layers, water cycle.', concepts: ['Igneous, sedimentary, metamorphic rocks', 'Troposphere and stratosphere'], importantQuestions: ['Explain the rock cycle with a diagram.'] }
      ]
    },
    {
      id: 'english-7',
      name: 'English',
      icon: 'BookOpen',
      color: 'emerald',
      chapters: [
        { id: 'c7-eng1', number: 1, title: 'Honeycomb: Three Questions', summary: 'Leo Tolstoy\'s story of a King seeking answers to the three most important questions of life.', concepts: ['Right time, right people, right task', 'Value of living in the present moment'], importantQuestions: ['What were the three questions the king wanted to know?'] },
        { id: 'c7-eng2', number: 2, title: 'An Alien Hand (Supplementary)', summary: 'Sci-fi story of Tilloo living under the surface of Mars and exploring Viking Viking probe.', concepts: ['Space exploration and Martian habitats'], importantQuestions: ['Why was Tilloo forbidden to go to the surface of Mars?'] }
      ]
    }
  ],

  'Class 8': [
    {
      id: 'science-8',
      name: 'Science',
      icon: 'Atom',
      color: 'purple',
      chapters: [
        { id: 'c8-s1', number: 1, title: 'Crop Production and Management', summary: 'Kharif and Rabi crops, soil preparation, sowing, irrigation, manuring, harvesting, storage.', concepts: ['Drip and sprinkler irrigation', 'Fertilisers vs organic manure'], importantQuestions: ['Explain how fertilisers are different from manure.'] },
        { id: 'c8-s2', number: 2, title: 'Microorganisms: Friend and Foe', summary: 'Bacteria, fungi, protozoa, algae, viruses. Commercial, medicinal uses and food preservation.', concepts: ['Fermentation and antibiotics', 'Pasteurisation of milk'], importantQuestions: ['What are antibiotics? What precautions must be taken while taking antibiotics?'] },
        { id: 'c8-s3', number: 3, title: 'Coal and Petroleum', summary: 'Fossil fuels, refining of petroleum, fractions, destructive distillation of coal, conservation.', concepts: ['Exhaustible vs inexhaustible resources', 'Fractional distillation products'], importantQuestions: ['Explain why fossil fuels are exhaustible natural resources.'] },
        { id: 'c8-s4', number: 4, title: 'Combustion and Flame', summary: 'Conditions for combustion, ignition temperature, types of combustion, zones of a candle flame.', concepts: ['Fire triangle: fuel, oxygen, heat', 'Luminous vs non-luminous flame zones'], importantQuestions: ['Make a neat labelled diagram of a candle flame and explain its hottest zone.'] },
        { id: 'c8-s5', number: 5, title: 'Conservation of Plants and Animals', summary: 'Deforestation, wildlife sanctuaries, national parks, biosphere reserves, Red Data Book, endemic species.', concepts: ['Biodiversity conservation', 'Project Tiger in India'], importantQuestions: ['What is the Red Data Book? Distinguish between wildlife sanctuary and national park.'] },
        { id: 'c8-s6', number: 6, title: 'Reproduction in Animals', summary: 'Sexual and asexual reproduction, male/female reproductive systems, internal/external fertilization, cloning.', concepts: ['Metamorphosis in frog and silkworm', 'IVF and test-tube babies'], importantQuestions: ['Explain the process of fertilisation in human beings.'] },
        { id: 'c8-s7', number: 7, title: 'Reaching the Age of Adolescence', summary: 'Puberty, hormones, pituitary gland, secondary sexual characteristics, reproductive health.', concepts: ['Endocrine glands: thyroid, adrenal, pancreas, testes, ovaries', 'Chromosome sex determination (XX, XY)'], importantQuestions: ['How is the sex of a baby determined in humans?'] },
        { id: 'c8-s8', number: 8, title: 'Force and Pressure', summary: 'Contact and non-contact forces, atmospheric pressure, liquid pressure, calculation of pressure.', concepts: ['Pressure = Force / Area', 'Hydraulic pressure principle'], importantQuestions: ['Why do porters place a round piece of cloth on their heads when carrying heavy loads?'] },
        { id: 'c8-s9', number: 9, title: 'Friction', summary: 'Factors affecting friction, static, sliding and rolling friction, friction as a necessary evil, ball bearings.', concepts: ['Rolling friction < Sliding friction < Static friction', 'Methods to increase and reduce friction'], importantQuestions: ['Explain why objects moving in fluids must have special streamlined shapes.'] },
        { id: 'c8-s10', number: 10, title: 'Sound', summary: 'Production of sound by vibrating bodies, propagation through medium, human ear, frequency, amplitude, loudness, pitch.', concepts: ['Audible frequency range: 20 Hz to 20,000 Hz', 'Loudness ∝ Amplitude²'], importantQuestions: ['A pendulum oscillates 40 times in 4 seconds. Find its time period and frequency.'] },
        { id: 'c8-s11', number: 11, title: 'Chemical Effects of Electric Current', summary: 'Electroplating, electrolytes, LED testers, applications of electroplating in preventing corrosion.', concepts: ['Cathode and anode reactions in copper sulfate solution', 'Applications of electroplating'], importantQuestions: ['Explain the process of electroplating of copper on an iron key.'] },
        { id: 'c8-s12', number: 12, title: 'Some Natural Phenomena', summary: 'Lightning, charging by friction, electroscope, earthquakes, Richter scale, seismic waves.', concepts: ['Static electricity and transfer of charges', 'Seismograph working principle'], importantQuestions: ['Suggest three measures to protect ourselves from lightning.'] },
        { id: 'c8-s13', number: 13, title: 'Light', summary: 'Laws of reflection, regular and diffused reflection, multiple images, kaleidoscope, human eye structure and defects.', concepts: ['Angle of incidence = Angle of reflection', 'Myopia, hypermetropia, Braille system'], importantQuestions: ['Draw a neat labelled diagram of human eye and explain the function of retina.'] }
      ]
    },
    {
      id: 'maths-8',
      name: 'Mathematics',
      icon: 'Calculator',
      color: 'blue',
      chapters: [
        { id: 'c8-m1', number: 1, title: 'Rational Numbers', summary: 'Properties of rational numbers (closure, commutativity, associativity, distributivity), multiplicative inverse.', concepts: ['Additive and multiplicative identity', 'Representing rational numbers on line'], importantQuestions: ['Write the additive inverse and multiplicative inverse of -13/19.'] },
        { id: 'c8-m2', number: 2, title: 'Linear Equations in One Variable', summary: 'Solving linear equations with variable on one side and both sides, reduction to simpler form, word problems.', concepts: ['Linear equations word problems (age, digits, perimeters)'], importantQuestions: ['Solve: (8x - 3)/3x = 2 and (x + 1)/(2x + 3) = 3/8.'] },
        { id: 'c8-m3', number: 3, title: 'Understanding Quadrilaterals', summary: 'Polygons, angle sum property of polygon (n - 2) × 180°, parallelogram properties, rhombus, rectangle, square, kite.', concepts: ['Sum of exterior angles of any polygon = 360°', 'Opposite angles and diagonals of parallelogram'], importantQuestions: ['Two adjacent angles of a parallelogram have equal measure. Find each angle.'] },
        { id: 'c8-m4', number: 4, title: 'Data Handling', summary: 'Organising data, grouped frequency distribution, histograms, pie charts, probability of events.', concepts: ['Drawing pie charts with sector angle calculation: (value/total) × 360°'], importantQuestions: ['Draw a pie chart showing the percentage of students participating in sports.'] },
        { id: 'c8-m5', number: 5, title: 'Squares and Square Roots', summary: 'Properties of square numbers, Pythagorean triplets, finding square root by prime factorisation and long division.', concepts: ['Pythagorean triplets 2m, m² - 1, m² + 1', 'Long division square root algorithm'], importantQuestions: ['Find the least number which must be added to 1750 to get a perfect square.'] },
        { id: 'c8-m6', number: 6, title: 'Cubes and Cube Roots', summary: 'Cube numbers, patterns, finding cube root by prime factorisation method and estimation method.', concepts: ['Units digit of cubes', 'Prime factorisation in groups of three'], importantQuestions: ['Find the cube root of 13824 by prime factorisation method.'] },
        { id: 'c8-m7', number: 7, title: 'Comparing Quantities', summary: 'Ratios, percentages, discount, sales tax / GST, compound interest formula compounded annually and semi-annually.', concepts: ['Compound Interest Amount A = P(1 + R/100)ⁿ', 'CI = A - P'], importantQuestions: ['Find compound interest on ₹12600 for 2 years at 10% per annum compounded annually.'] },
        { id: 'c8-m8', number: 8, title: 'Algebraic Expressions & Identities', summary: 'Multiplication of algebraic expressions, standard identities: (a+b)², (a-b)², a²-b², (x+a)(x+b).', concepts: ['(a + b)² = a² + 2ab + b²', '(a - b)² = a² - 2ab + b²', 'a² - b² = (a - b)(a + b)'], importantQuestions: ['Evaluate using suitable identity: (103)² and (95 × 105).'] },
        { id: 'c8-m9', number: 9, title: 'Mensuration', summary: 'Area of trapezium, general quadrilateral, rhombus. Surface area and volume of cuboid, cube, cylinder.', concepts: ['Area of trapezium = 1/2 (a + b) h', 'Volume of cylinder = πr²h', 'Total Surface Area of cylinder = 2πr(r + h)'], importantQuestions: ['A rectangular paper of width 14 cm is rolled along width to form cylinder of radius 20 cm. Find volume.'] },
        { id: 'c8-m10', number: 10, title: 'Exponents and Powers', summary: 'Negative exponents, laws of exponents, very small and large numbers in standard scientific notation.', concepts: ['a⁻ᵐ = 1 / aᵐ', 'Expressing microns and light speed in standard form'], importantQuestions: ['Simplify: [(1/3)⁻² - (1/2)⁻³] ÷ (1/4)⁻².'] },
        { id: 'c8-m11', number: 11, title: 'Direct and Inverse Proportions', summary: 'Direct proportion (x/y = k) and inverse proportion (x × y = k), solving unitary and scaling word problems.', concepts: ['Time and work, speed and time problems'], importantQuestions: ['If 15 workers can build a wall in 48 hours, how many workers will be required for the same work in 30 hours?'] },
        { id: 'c8-m12', number: 12, title: 'Factorisation', summary: 'Common factors, regrouping terms, factorisation using standard identities, splitting middle term, division of algebraic expressions.', concepts: ['Splitting middle term in quadratic polynomials', 'Dividing polynomial by monomial/binomial'], importantQuestions: ['Factorise: y² - 7y + 12 and x⁴ - (y + z)⁴.'] },
        { id: 'c8-m13', number: 13, title: 'Introduction to Graphs', summary: 'Line graph, linear graph, coordinate Cartesian plane (x, y), independent and dependent variables.', concepts: ['Plotting points (x, y) on graph', 'Reading distance-time and cost-quantity graphs'], importantQuestions: ['Plot the points A(2, 3), B(2, 5), C(4, 5) and find the figure formed.'] }
      ]
    },
    {
      id: 'social-8',
      name: 'Social Science',
      icon: 'Compass',
      color: 'amber',
      chapters: [
        { id: 'c8-sst1', number: 1, title: 'Our Pasts III (History: 1857 Revolt & Freedom Struggle)', summary: 'East India Company rule, Revolt of 1857, tribal societies, craft and industries, Indian National Movement.', concepts: ['Causes of the 1857 Revolt', 'Role of Mahatma Gandhi and civil disobedience'], importantQuestions: ['What were the military and economic causes of the Revolt of 1857?'] },
        { id: 'c8-sst2', number: 2, title: 'Resources and Development (Geography: Land, Soil, Water)', summary: 'Types of resources, land degradation, soil conservation methods, water resources, minerals and power.', concepts: ['Sustainable development', 'Soil conservation: contour ploughing, terrace farming'], importantQuestions: ['Differentiate between renewable and non-renewable resources with examples.'] },
        { id: 'c8-sst3', number: 3, title: 'Social & Political Life III (Civics: Constitution & Secularism)', summary: 'The Indian Constitution key features, understanding secularism, Parliament and law making, judiciary system.', concepts: ['Fundamental Rights and Duties', 'Independent Judiciary and Public Interest Litigation (PIL)'], importantQuestions: ['Why does a democratic country need a Constitution?'] }
      ]
    },
    {
      id: 'english-8',
      name: 'English',
      icon: 'BookOpen',
      color: 'emerald',
      chapters: [
        { id: 'c8-eng1', number: 1, title: 'Honeydew: The Best Christmas Present in the World', summary: 'Michael Morpurgo\'s touching story of British and German soldiers celebrating Christmas truce in World War I.', concepts: ['Message of peace over war, historical empathy'], importantQuestions: ['What did the narrator find in a secret drawer of the roll-top desk?'] },
        { id: 'c8-eng2', number: 2, title: 'It So Happened: How the Camel Got His Hump', summary: 'Rudyard Kipling\'s fable on the consequences of laziness and avoidance of work.', concepts: ['Diligence and responsibility in life'], importantQuestions: ['What tasks were assigned to the dog, the horse and the ox?'] }
      ]
    }
  ],

  'Class 9': [
    {
      id: 'science-9',
      name: 'Science',
      icon: 'Atom',
      color: 'purple',
      chapters: [
        { id: 'c9-s1', number: 1, title: 'Matter in Our Surroundings', summary: 'Physical nature of matter, characteristics of particles, states of matter (solid, liquid, gas), latent heat, evaporation.', concepts: ['Latent heat of fusion and vaporisation', 'Factors affecting evaporation', 'Sublimation in camphor and ammonium chloride'], formulas: ['K = °C + 273.15'], importantQuestions: ['Why does a desert cooler cool better on a hot dry day?', 'What produces more severe burns, boiling water or steam?'] },
        { id: 'c9-s2', number: 2, title: 'Is Matter Around Us Pure', summary: 'Mixtures, solutions, suspensions, colloids, Tyndall effect, separation techniques, physical and chemical changes, elements and compounds.', concepts: ['Tyndall effect in colloids', 'Concentration of solution = (Mass of solute / Mass of solution) × 100%'], formulas: ['Mass % = (Mass of Solute / Total Mass of Solution) × 100'], importantQuestions: ['A solution contains 40 g of common salt in 320 g of water. Calculate concentration in mass percentage.'] },
        { id: 'c9-s3', number: 3, title: 'Atoms and Molecules', summary: 'Law of conservation of mass, law of constant proportions, Dalton’s atomic theory, atomic mass, valency, chemical formulae writing, mole concept.', concepts: ['Writing chemical formulae using criss-cross valency method', 'Molar mass calculation', 'Avogadro constant N_A = 6.022 × 10²³'], formulas: ['Moles n = mass / molar mass', 'Number of particles = n × 6.022 × 10²³'], importantQuestions: ['Calculate the molecular mass of HNO₃ and calculate formula mass of CaCl₂.'] },
        { id: 'c9-s4', number: 4, title: 'Structure of the Atom', summary: 'Thomson model, Rutherford α-particle scattering experiment, Bohr model of atom, subatomic particles, valency, isotopes and isobars.', concepts: ['Rutherford nuclear model of atom', 'Electronic configuration (2, 8, 8)', 'Isotopes in medicine and nuclear energy'], importantQuestions: ['Describe Bohr\'s model of the atom with postulates.', 'Explain isotopes and isobars with two examples each.'] },
        { id: 'c9-s5', number: 5, title: 'The Fundamental Unit of Life', summary: 'Cell theory, prokaryotic vs eukaryotic cells, plasma membrane, osmosis, cell wall, nucleus, cytoplasm, organelles (ER, Golgi, Lysosomes, Mitochondria, Plastids, Vacuoles).', concepts: ['Plasma membrane as selectively permeable membrane', 'Mitochondria as powerhouse of cell (ATP synthesis)', 'Lysosomes as suicidal bags of cell'], importantQuestions: ['Why is the plasma membrane called a selectively permeable membrane?', 'Draw a neat labelled diagram of plant cell vs animal cell.'] },
        { id: 'c9-s6', number: 6, title: 'Tissues', summary: 'Plant tissues: Meristematic (apical, intercalary, lateral) and Permanent (parenchyma, collenchyma, sclerenchyma, xylem, phloem). Animal tissues: Epithelial, Connective, Muscular, Nervous.', concepts: ['Complex permanent tissues: Xylem and Phloem', 'Striated, smooth and cardiac muscular tissues', 'Structure of a Neuron'], importantQuestions: ['Differentiate between parenchyma, collenchyma and sclerenchyma on the basis of their cell wall.', 'Draw a neat diagram of neuron and label axon, dendrite and cyton.'] },
        { id: 'c9-s7', number: 7, title: 'Motion', summary: 'Distance, displacement, uniform and non-uniform motion, speed, velocity, acceleration, distance-time and velocity-time graphs, equations of motion, uniform circular motion.', concepts: ['Three equations of motion by graphical method: v = u + at, s = ut + 1/2 at², v² - u² = 2as', 'Uniform circular motion: v = 2πr / t'], formulas: ['v = u + at', 's = ut + (1/2)at²', 'v² - u² = 2as', 'a = (v - u)/t'], importantQuestions: ['A bus starting from rest moves with a uniform acceleration of 0.1 m/s² for 2 minutes. Find speed acquired and distance travelled.'] },
        { id: 'c9-s8', number: 8, title: 'Force and Laws of Motion', summary: 'Balanced and unbalanced forces, Newton\'s first law of motion (inertia), Newton\'s second law (F = ma), Newton\'s third law (action-reaction), conservation of linear momentum.', concepts: ['Inertia depends on mass', 'Derivation of F = ma from rate of change of momentum', 'Law of conservation of momentum: m₁u₁ + m₂u₂ = m₁v₁ + m₂v₂'], formulas: ['F = ma = m(v - u)/t', 'p = mv', 'm₁u₁ + m₂u₂ = m₁v₁ + m₂v₂'], importantQuestions: ['A bullet of mass 20 g is fired horizontally from a pistol of 2 kg with velocity 150 m/s. Calculate recoil velocity of pistol.'] },
        { id: 'c9-s9', number: 9, title: 'Gravitation', summary: 'Universal law of gravitation, free fall, acceleration due to gravity (g), mass vs weight, thrust and pressure, Archimedes’ principle, relative density.', concepts: ['Universal gravitational constant G = 6.67 × 10⁻¹¹ N m²/kg²', 'Weight on moon = 1/6th of weight on Earth', 'Archimedes principle: Buoyant force = Weight of displaced liquid'], formulas: ['F = G (M m / d²)', 'g = GM / R²', 'W = mg', 'Relative Density = Density of substance / Density of water'], importantQuestions: ['State Universal Law of Gravitation. What happens to the force if distance between two objects is halved?'] },
        { id: 'c9-s10', number: 10, title: 'Work and Energy', summary: 'Scientific definition of work, kinetic energy, potential energy, law of conservation of energy, rate of doing work (Power), commercial unit of electrical energy (kWh).', concepts: ['Work W = F · s cos θ', 'Kinetic energy E_k = 1/2 m v²', 'Potential energy E_p = mgh', 'Power P = W / t, 1 kWh = 3.6 × 10⁶ J'], formulas: ['W = F · s', 'E_k = (1/2)mv²', 'E_p = mgh', 'P = W/t'], importantQuestions: ['An electric heater of 1500 W is used for 10 hours daily. Calculate units of electricity consumed in 30 days.'] },
        { id: 'c9-s11', number: 11, title: 'Sound', summary: 'Production and propagation of sound waves, longitudinal waves, crests and troughs, compressions and rarefactions, speed of sound, reflection of sound, echo, reverberation, ultrasound applications, sonar.', concepts: ['Conditions for hearing an echo: minimum distance = 17.2 m in air', 'SONAR: 2d = v × t', 'Ultrasound in medical ultrasonography and industrial defect detection'], formulas: ['v = ν λ (Speed = frequency × wavelength)', '2d = v · t (Echo/SONAR)'], importantQuestions: ['A submarine sends out a sonar signal and receives an echo 5 seconds later. If speed of sound in water is 1530 m/s, find distance of object.'] },
        { id: 'c9-s12', number: 12, title: 'Improvement in Food Resources', summary: 'Crop variety improvement, crop production management (nutrients, manure, fertilisers, irrigation, cropping patterns), crop protection management, animal husbandry (cattle, poultry, egg, fish farming, apiculture).', concepts: ['Inter-cropping vs crop rotation', 'Macronutrients (N, P, K, Ca, Mg, S) and micronutrients', 'Composite fish culture'], importantQuestions: ['What are the advantages of composite fish culture? State its main problem and how it is overcome.'] }
      ]
    },
    {
      id: 'maths-9',
      name: 'Mathematics',
      icon: 'Calculator',
      color: 'blue',
      chapters: [
        { id: 'c9-m1', number: 1, title: 'Number Systems', summary: 'Rational and irrational numbers, real numbers on number line, laws of exponents, rationalising the denominator.', concepts: ['Rationalising denominator of 1 / (√a ± √b)', 'Decimal expansions: terminating vs non-terminating recurring'], formulas: ['aᵖ · aᑫ = aᵖ⁺ᑫ', '(aᵖ)ᑫ = aᵖᑫ'], importantQuestions: ['Rationalise the denominator of: 1 / (7 + 3√2).', 'Express 0.2353535... in p/q form where p and q are integers.'] },
        { id: 'c9-m2', number: 2, title: 'Polynomials', summary: 'Polynomials in one variable, zeroes of polynomial, Remainder Theorem, Factor Theorem, algebraic identities.', concepts: ['Factor theorem for cubic polynomials', 'Identities: (x+y+z)², (x+y)³, (x-y)³, x³+y³+z³-3xyz'], formulas: ['x³ + y³ + z³ - 3xyz = (x+y+z)(x²+y²+z²-xy-yz-zx)', 'If x+y+z=0, x³+y³+z³ = 3xyz'], importantQuestions: ['Factorise: x³ - 23x² + 142x - 120 using factor theorem.', 'Evaluate (99)³ using algebraic identity.'] },
        { id: 'c9-m3', number: 3, title: 'Coordinate Geometry', summary: 'Cartesian system, origin, x-axis, y-axis, four quadrants, plotting coordinates (x, y) of points.', concepts: ['Abscissa and ordinate meaning', 'Signs of coordinates in quadrants I, II, III, IV'], importantQuestions: ['In which quadrant or on which axis do the points (-2, 4), (3, -1), (-1, 0) and (1, 2) lie?'] },
        { id: 'c9-m4', number: 4, title: 'Linear Equations in Two Variables', summary: 'Standard form ax + by + c = 0, solution of a linear equation, graphical representation on Cartesian plane.', concepts: ['Linear equation has infinitely many solutions', 'Graph of ax + by + c = 0 is a straight line'], formulas: ['ax + by + c = 0'], importantQuestions: ['Draw the graph of x + y = 7 and find where it intersects the axes.', 'Find the value of k if x = 2, y = 1 is a solution of 2x + 3y = k.'] },
        { id: 'c9-m5', number: 5, title: 'Introduction to Euclid\'s Geometry', summary: 'Euclid\'s definitions, axioms and postulates, equivalent versions of Euclid\'s fifth postulate.', concepts: ['Euclid\'s five postulates', 'Things which are equal to the same thing are equal to one another'], importantQuestions: ['State Euclid\'s Fifth Postulate and explain how it implies existence of parallel lines.'] },
        { id: 'c9-m6', number: 6, title: 'Lines and Angles', summary: 'Linear pair axiom, vertically opposite angles, parallel lines and transversal (alternate, corresponding angles), angle sum property.', concepts: ['Corresponding and alternate interior angles equality', 'Sum of angles of triangle = 180°'], importantQuestions: ['If two parallel lines are intersected by a transversal, prove that the bisectors of any pair of alternate interior angles are parallel.'] },
        { id: 'c9-m7', number: 7, title: 'Triangles', summary: 'Congruence of triangles (SAS, ASA, AAS, SSS, RHS criteria), properties of isosceles triangles, inequalities in triangles.', concepts: ['Angles opposite to equal sides of triangle are equal', 'RHS congruence criterion proofs'], importantQuestions: ['In an isosceles triangle ABC with AB = AC, D and E are points on BC such that BE = CD. Prove AD = AE.'] },
        { id: 'c9-m8', number: 8, title: 'Quadrilaterals', summary: 'Angle sum property of quadrilateral, properties of parallelogram, Mid-point theorem and its converse.', concepts: ['Mid-point Theorem: Line segment joining midpoints of two sides of triangle is parallel to third side and half of it'], formulas: ['Mid-point Theorem: MN = 1/2 BC and MN || BC'], importantQuestions: ['Prove that the line segment joining the mid-points of two sides of a triangle is parallel to the third side and half of it.'] },
        { id: 'c9-m9', number: 9, title: 'Circles', summary: 'Equal chords subtend equal angles at centre, perpendicular from centre to chord, angle subtended by arc at centre and circle, cyclic quadrilateral.', concepts: ['Angle subtended by an arc at centre is double the angle subtended by it at any point on circle', 'Opposite angles of cyclic quadrilateral sum to 180°'], importantQuestions: ['Prove that the angle subtended by an arc at the centre is double the angle subtended by it at any point on the remaining part of the circle.'] },
        { id: 'c9-m10', number: 10, title: 'Heron\'s Formula', summary: 'Area of triangle using Heron\'s formula s = (a+b+c)/2, application in finding areas of quadrilaterals.', concepts: ['Area = √[s(s-a)(s-b)(s-c)] where semi-perimeter s = (a+b+c)/2'], formulas: ['Area = √[s(s-a)(s-b)(s-c)]', 's = (a + b + c) / 2'], importantQuestions: ['Find the area of a triangle two sides of which are 18 cm and 10 cm and the perimeter is 42 cm.'] },
        { id: 'c9-m11', number: 11, title: 'Surface Areas and Volumes', summary: 'Surface area and volume of right circular cylinder, right circular cone, sphere and hemisphere.', concepts: ['Cone CSA = πrl, TSA = πr(l + r), Volume = 1/3 πr²h', 'Sphere Surface Area = 4πr², Volume = 4/3 πr³', 'Hemisphere CSA = 2πr², TSA = 3πr², Volume = 2/3 πr³'], formulas: ['CSA Cone = πrl', 'l = √(r² + h²)', 'Volume Cone = (1/3)πr²h', 'Sphere Volume = (4/3)πr³'], importantQuestions: ['A conical tent is 10 m high and radius of its base is 24 m. Find slant height and cost of canvas at ₹70 per m².'] },
        { id: 'c9-m12', number: 12, title: 'Statistics', summary: 'Collection and presentation of data, graphical representation (Bar graphs, Histograms with varying widths, Frequency polygons).', concepts: ['Drawing frequency polygons with class marks', 'Adjusted frequency calculation for histogram with unequal width'], formulas: ['Adjusted frequency = (Minimum class size / Class size) × Frequency'], importantQuestions: ['Draw a histogram and frequency polygon for given grouped frequency distribution table.'] }
      ]
    },
    {
      id: 'social-9',
      name: 'Social Science',
      icon: 'Compass',
      color: 'amber',
      chapters: [
        { id: 'c9-sst1', number: 1, title: 'History: The French Revolution', summary: 'Causes of French revolution, Estates General, storming of Bastille, Reign of Terror, Jacobins, abolition of slavery.', concepts: ['Three Estates in French society', 'Declaration of Rights of Man and Citizen'], importantQuestions: ['Explain the impact of the French Revolution on European society.'] },
        { id: 'c9-sst2', number: 2, title: 'History: Socialism in Europe & Russian Revolution', summary: 'Age of social change, liberals, radicals, conservatives, 1905 Revolution, October 1917 Bolshevik revolution, Lenin and Stalin.', concepts: ['Lenin April Theses', 'Stalin collectivisation programme'], importantQuestions: ['What were the main demands of Lenin\'s April Theses?'] },
        { id: 'c9-sst3', number: 3, title: 'Geography: India - Size and Location & Physical Features', summary: 'Location of India, Standard Meridian (82°30\'E), Himalayan mountains, Northern Plains, Peninsular Plateau, Thar Desert, Coastal Plains, Islands.', concepts: ['Division of Himalayas: Himadri, Himachal, Shiwaliks', 'Bhabar, Terai, Bhangar, Khadar soil zones'], importantQuestions: ['Why is 82°30\'E selected as the Standard Meridian of India?'] },
        { id: 'c9-sst4', number: 4, title: 'Civics: What is Democracy? Why Democracy? & Electoral Politics', summary: 'Features of democracy, arguments for and against democracy, electoral competition, voter lists, Election Commission.', concepts: ['Universal Adult Franchise', 'Free and fair elections under autonomous Election Commission'], importantQuestions: ['State five major features of a democratic government.'] },
        { id: 'c9-sst5', number: 5, title: 'Economics: The Story of Village Palampur & People as Resource', summary: 'Factors of production (Land, Labour, Capital, Enterprise), Human capital formation, education, health, unemployment.', concepts: ['Working capital vs fixed capital', 'Disguised and seasonal unemployment in agriculture'], importantQuestions: ['Explain how human capital is superior to other resources like land and physical capital.'] }
      ]
    },
    {
      id: 'english-9',
      name: 'English',
      icon: 'BookOpen',
      color: 'emerald',
      chapters: [
        { id: 'c9-eng1', number: 1, title: 'Beehive (Part 1 Book): The Fun They Had & The Road Not Taken', summary: 'Isaac Asimov\'s futuristic school story of Margie and Tommy. Robert Frost\'s iconic poem on decision making.', concepts: ['Theme of choices shaping destiny', 'Traditional vs virtual futuristic education'], importantQuestions: ['What kind of teachers did Margie and Tommy have?'] },
        { id: 'c9-eng2', number: 2, title: 'Beehive (Part 1 Book): The Sound of Music (Evelyn Glennie & Bismillah Khan)', summary: 'Evelyn Glennie\'s journey overcoming profound deafness to become a world-renowned percussionist. Ustad Bismillah Khan and the Shehnai.', concepts: ['Determination, perseverance, cultural mastery of Indian classical music'], importantQuestions: ['How does Evelyn Glennie hear music without hearing with her ears?'] },
        { id: 'c9-eng3', number: 3, title: 'Moments (Part 2 Book - Supplementary): The Lost Child & The Adventures of Toto', summary: 'Mulk Raj Anand\'s tale of child\'s psychology in village fair. Ruskin Bond\'s mischievous monkey adventures.', concepts: ['Child-parent emotional bond vs materialistic desires', 'Pet animal behavioural challenges'], importantQuestions: ['What are the things the child sees on his way to the fair? Why does he lag behind?'] }
      ]
    }
  ]
};
