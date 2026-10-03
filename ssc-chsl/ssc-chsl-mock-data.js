/* Original SSC CHSL Tier-I PYQ-style practice bank. Questions are generated deterministically from this file. */
(function (root) {
  const SECTIONS = [
    { id: 'english', name: 'English Language', duration: 15 },
    { id: 'reasoning', name: 'General Intelligence & Reasoning', duration: 15 },
    { id: 'quant', name: 'Quantitative Aptitude', duration: 15 },
    { id: 'awareness', name: 'General Awareness', duration: 15 }
  ];
  const QUESTION_COUNT = 25;
  const MOCK_COUNT = 10;

  function hash(value) {
    let result = 2166136261;
    for (let index = 0; index < value.length; index++) {
      result ^= value.charCodeAt(index);
      result = Math.imul(result, 16777619);
    }
    return result >>> 0;
  }

  function shuffle(values, seed) {
    const result = values.slice();
    let state = seed >>> 0;
    for (let index = result.length - 1; index > 0; index--) {
      state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
      const swap = state % (index + 1);
      [result[index], result[swap]] = [result[swap], result[index]];
    }
    return result;
  }

  function question(id, topic, prompt, correct, distractors, explanation, shortcut, seed) {
    const choices = [];
    for (const choice of [String(correct), ...distractors.map(String)]) {
      if (!choices.includes(choice) && choices.length < 4) choices.push(choice);
    }
    let fallback = 1;
    while (choices.length < 4) {
      const choice = `None of these (${fallback++})`;
      if (!choices.includes(choice)) choices.push(choice);
    }
    const options = shuffle(choices, seed);
    return {
      id,
      topic,
      question: prompt,
      options,
      answer: options.indexOf(String(correct)),
      explanation,
      shortcut
    };
  }

  function numericDistractors(answer, offsets) {
    const values = offsets.map(offset => answer + offset);
    return [...new Set(values.filter(value => value !== answer))].slice(0, 3);
  }

  const vocabulary = [
    ['abandon', 'forsake', 'retain'], ['abundant', 'plentiful', 'scarce'], ['accurate', 'precise', 'inaccurate'],
    ['amiable', 'friendly', 'hostile'], ['ancient', 'antique', 'modern'], ['arduous', 'difficult', 'easy'],
    ['benevolent', 'kind', 'malevolent'], ['candid', 'frank', 'evasive'], ['concise', 'brief', 'lengthy'],
    ['diligent', 'industrious', 'lazy'], ['ephemeral', 'temporary', 'permanent'], ['explicit', 'clear', 'implicit'],
    ['feasible', 'practicable', 'impossible'], ['frugal', 'thrifty', 'extravagant'], ['genuine', 'authentic', 'counterfeit'],
    ['hostile', 'antagonistic', 'friendly'], ['impartial', 'unbiased', 'prejudiced'], ['incessant', 'continuous', 'intermittent'],
    ['lucid', 'clear', 'obscure'], ['mitigate', 'lessen', 'aggravate'], ['novice', 'beginner', 'expert'],
    ['obscure', 'unclear', 'obvious'], ['prudent', 'wise', 'reckless'], ['reluctant', 'unwilling', 'eager'],
    ['resilient', 'adaptable', 'fragile'], ['serene', 'calm', 'agitated'], ['tedious', 'wearisome', 'enjoyable'],
    ['valiant', 'brave', 'cowardly'], ['vivid', 'striking', 'dull'], ['zeal', 'enthusiasm', 'apathy'],
    ['adapt', 'adjust', 'resist'], ['adverse', 'unfavourable', 'favourable'], ['alleviate', 'relieve', 'worsen'],
    ['apparent', 'evident', 'hidden'], ['assiduous', 'meticulous', 'careless'], ['authentic', 'genuine', 'spurious'],
    ['complacent', 'self-satisfied', 'concerned'], ['contemplate', 'consider', 'ignore'], ['credible', 'believable', 'untrustworthy'],
    ['daunt', 'intimidate', 'encourage'], ['deficient', 'inadequate', 'sufficient'], ['demolish', 'destroy', 'construct'],
    ['eloquent', 'expressive', 'inarticulate'], ['eminent', 'distinguished', 'unknown'], ['exemplary', 'commendable', 'inferior'],
    ['fastidious', 'particular', 'careless'], ['fortify', 'strengthen', 'weaken'], ['hamper', 'hinder', 'assist'],
    ['immense', 'enormous', 'tiny'], ['inevitable', 'unavoidable', 'avoidable'], ['innovative', 'inventive', 'conventional'],
    ['intricate', 'complex', 'simple'], ['lethargic', 'sluggish', 'energetic'], ['obsolete', 'outdated', 'current'],
    ['optimistic', 'hopeful', 'pessimistic'], ['peril', 'danger', 'safety'], ['plausible', 'reasonable', 'unbelievable'],
    ['profound', 'deep', 'superficial'], ['redundant', 'unnecessary', 'essential'], ['scrutinize', 'inspect', 'overlook'],
    ['substantial', 'considerable', 'trivial'], ['transient', 'temporary', 'lasting'], ['versatile', 'adaptable', 'limited']
  ];

  const idioms = [
    ['break the ice', 'begin a friendly conversation', 'end a formal meeting'],
    ['once in a blue moon', 'very rarely', 'every day'],
    ['spill the beans', 'reveal a secret', 'waste food'],
    ['hit the nail on the head', 'describe exactly what is causing a situation', 'make a careless mistake'],
    ['burn the midnight oil', 'work late into the night', 'waste electricity'],
    ['a blessing in disguise', 'a difficulty that results in something good', 'a gift kept hidden'],
    ['under the weather', 'slightly ill', 'outside in the rain'],
    ['cost an arm and a leg', 'be very expensive', 'be completely free'],
    ['beat around the bush', 'avoid speaking directly', 'work in a garden'],
    ['call it a day', 'stop working for the day', 'begin a new project'],
    ['cut corners', 'do something cheaply or carelessly', 'make a right-angle turn'],
    ['get cold feet', 'become nervous before an action', 'feel physically cold'],
    ['in hot water', 'in trouble', 'taking a warm bath'],
    ['on cloud nine', 'extremely happy', 'very confused'],
    ['piece of cake', 'something very easy', 'a difficult examination'],
    ['through thick and thin', 'in good and bad times', 'through a crowded place'],
    ['the last straw', 'the final problem that makes a situation unbearable', 'a useful solution'],
    ['keep an eye on', 'watch carefully', 'close one eye'],
    ['make ends meet', 'manage expenses with available income', 'finish a piece of rope'],
    ['by leaps and bounds', 'very rapidly', 'with great difficulty'],
    ['hold your horses', 'wait and be patient', 'take care of animals'],
    ['miss the boat', 'lose an opportunity', 'arrive at a harbour'],
    ['back to square one', 'return to the starting point', 'move to a larger house'],
    ['a storm in a teacup', 'much concern over a small matter', 'a severe weather warning'],
    ['add fuel to the fire', 'make a difficult situation worse', 'solve a disagreement']
  ];

  const spellings = [
    ['accommodate', 'accomodate', 'accommoddate', 'acommodate'], ['necessary', 'neccessary', 'necesary', 'necessery'],
    ['separate', 'seperate', 'separrate', 'separite'], ['privilege', 'priviledge', 'privelege', 'privlege'],
    ['maintenance', 'maintainance', 'maintenence', 'maintanance'], ['questionnaire', 'questionaire', 'questionnairre', 'questionnare'],
    ['occurrence', 'occurence', 'ocurrence', 'occurrance'], ['millennium', 'millenium', 'millenniam', 'milennium'],
    ['conscientious', 'consciencious', 'conscientous', 'conscietious'], ['embarrass', 'embarass', 'embarras', 'embarrasss'],
    ['rhythm', 'rythm', 'rhythym', 'rhythem'], ['environment', 'enviroment', 'environmant', 'enviornment'],
    ['definitely', 'definately', 'definitly', 'definetely'], ['calendar', 'calender', 'calandar', 'callender'],
    ['government', 'goverment', 'governement', 'governmant'], ['independent', 'independant', 'indepedent', 'independantt'],
    ['liaison', 'liason', 'liaision', 'liasion'], ['supersede', 'supercede', 'supersceed', 'superscede'],
    ['vacuum', 'vaccum', 'vacume', 'vacumm'], ['Wednesday', 'Wensday', 'Wednsday', 'Wendsday'],
    ['achievement', 'acheivement', 'achievment', 'acheivment'], ['beginning', 'begining', 'beggining', 'begininning'],
    ['business', 'buisness', 'busines', 'bussiness'], ['committee', 'comittee', 'commitee', 'committe'],
    ['existence', 'existance', 'exsistence', 'existense'], ['foreign', 'foriegn', 'forein', 'forign'],
    ['license', 'lisence', 'licencee', 'lisense'], ['perseverance', 'perseverence', 'perserverance', 'perseveranse'],
    ['recommend', 'reccomend', 'recomend', 'recommmend'], ['successful', 'succesful', 'successfull', 'sucessful']
  ];

  const prepositionItems = [
    ['She is good ___ mathematics.', 'at', ['in', 'on', 'for'], 'Use "good at" for a skill or subject.'],
    ['The train arrived ___ the station on time.', 'at', ['in', 'to', 'by'], 'Use "arrive at" for a specific place.'],
    ['He has lived here ___ 2021.', 'since', ['for', 'from', 'by'], 'Use "since" with a starting point in time.'],
    ['They have been waiting ___ two hours.', 'for', ['since', 'from', 'during'], 'Use "for" with a duration.'],
    ['The manager divided the work ___ the four members.', 'among', ['between', 'across', 'beside'], 'Use "among" for more than two people.'],
    ['The keys are ___ the drawer.', 'in', ['at', 'on', 'over'], 'Use "in" for an enclosed space.'],
    ['She prefers tea ___ coffee.', 'to', ['than', 'over than', 'from'], 'The standard construction is "prefer X to Y."'],
    ['The child was accused ___ breaking the window.', 'of', ['for', 'with', 'by'], 'The verb "accuse" takes "of."'],
    ['We congratulated him ___ his success.', 'on', ['for', 'at', 'with'], 'Use "congratulate someone on" an achievement.'],
    ['The office is closed ___ Sundays.', 'on', ['at', 'in', 'by'], 'Use "on" with days of the week.'],
    ['The book was written ___ Ruskin Bond.', 'by', ['with', 'from', 'of'], 'Use "by" to name the agent in a passive sentence.'],
    ['The flight was delayed ___ heavy rain.', 'because of', ['although', 'despite of', 'unless'], 'Use "because of" before a noun phrase giving a reason.'],
    ['She is responsible ___ checking the final figures.', 'for', ['to', 'of', 'with'], 'The adjective "responsible" takes "for."'],
    ['The two friends have been separated ___ a year.', 'for', ['since', 'from', 'during'], 'Use "for" before a length of time.'],
    ['He is senior ___ me in the department.', 'to', ['than', 'from', 'over'], 'Use "senior to," not "senior than."'],
    ['Please refrain ___ using your phone in the laboratory.', 'from', ['to', 'of', 'with'], 'The verb "refrain" takes "from."']
  ];

  const grammarItems = [
    ['Each of the applicants ___ submitted the form.', 'has', ['have', 'are', 'were'], '"Each" is singular, so it takes "has."'],
    ['Neither the clerk nor the assistants ___ available.', 'were', ['was', 'is', 'has been'], 'With neither/nor, the verb agrees with the nearer subject, "assistants."'],
    ['The news ___ encouraging.', 'is', ['are', 'were', 'have'], '"News" is grammatically singular.'],
    ['One of my friends ___ in Jaipur.', 'lives', ['live', 'living', 'have lived'], 'The subject is "one," which is singular.'],
    ['By next June, she ___ here for five years.', 'will have worked', ['will work', 'has worked', 'worked'], 'Future perfect marks duration completed by a future point.'],
    ['If I ___ the answer, I would tell you.', 'knew', ['know', 'will know', 'have known'], 'Use the past form in the unreal present conditional.'],
    ['Hardly had the bell rung ___ the students left.', 'when', ['than', 'then', 'while'], 'The paired construction is "hardly...when."'],
    ['No sooner had the meeting begun ___ the lights went out.', 'than', ['when', 'then', 'while'], 'The paired construction is "no sooner...than."'],
    ['She is one of the employees who ___ received an award.', 'have', ['has', 'is', 'was'], '"Who" refers to plural "employees."'],
    ['The committee ___ reached its decision.', 'has', ['have', 'are', 'were'], 'A committee acting as one unit takes a singular verb.'],
    ['Neither of the proposals ___ acceptable.', 'is', ['are', 'were', 'have'], '"Neither" is treated as singular in standard exam grammar.'],
    ['The furniture ___ delivered yesterday.', 'was', ['were', 'have been', 'are'], '"Furniture" is an uncountable singular noun.'],
    ['She has been preparing ___ morning.', 'since this', ['for this', 'from this', 'during this'], 'Use "since" with a starting time.'],
    ['The principal, along with the teachers, ___ attending the event.', 'is', ['are', 'were', 'have'], 'The main subject is singular "principal"; the phrase between commas does not change it.'],
    ['Every boy and every girl ___ given an identity card.', 'was', ['were', 'have', 'are'], 'When "every" precedes each coordinated singular noun, use a singular verb.'],
    ['The athlete runs ___ than his competitors.', 'faster', ['more fast', 'fastest', 'most faster'], 'Use the comparative form "faster" with "than."']
  ];

  const voiceItems = [
    ['The clerk prepared the schedule.', 'The schedule was prepared by the clerk.', ['The schedule is prepared by the clerk.', 'The clerk was prepared by the schedule.', 'The schedule had prepare by the clerk.'], 'Simple past active becomes "was/were + past participle" in passive voice.'],
    ['They are repairing the bridge.', 'The bridge is being repaired by them.', ['The bridge was repaired by them.', 'The bridge has repaired them.', 'They are being repaired by the bridge.'], 'Present continuous passive uses "is/are being + past participle."'],
    ['The officer will issue the certificate.', 'The certificate will be issued by the officer.', ['The certificate is issued by the officer.', 'The officer will be issued the certificate.', 'The certificate was issue by the officer.'], 'Future passive uses "will be + past participle."'],
    ['The team has completed the project.', 'The project has been completed by the team.', ['The project had completed by the team.', 'The team has been completed by the project.', 'The project is completing by the team.'], 'Present perfect passive uses "has/have been + past participle."'],
    ['The workers had finished the repairs.', 'The repairs had been finished by the workers.', ['The repairs have finished by the workers.', 'The workers had been finished the repairs.', 'The repairs were finishing by the workers.'], 'Past perfect passive uses "had been + past participle."'],
    ['Open the window.', 'Let the window be opened.', ['Let the window opened.', 'The window is open by you.', 'The window has opened.'], 'An imperative passive can use "Let + object + be + past participle."']
  ];

  const awarenessFacts = [
    ['Indian Polity', 'Which Article of the Constitution guarantees equality before law?', 'Article 14', ['Article 19', 'Article 21', 'Article 32'], 'Article 14 guarantees equality before the law and equal protection of laws.'],
    ['Indian Polity', 'Which Article abolishes untouchability?', 'Article 17', ['Article 15', 'Article 18', 'Article 23'], 'Article 17 abolishes untouchability and forbids its practice.'],
    ['Indian Polity', 'Which Article protects life and personal liberty?', 'Article 21', ['Article 14', 'Article 20', 'Article 25'], 'Article 21 protects life and personal liberty except according to procedure established by law.'],
    ['Indian Polity', 'Which Article provides the right to constitutional remedies?', 'Article 32', ['Article 22', 'Article 40', 'Article 51A'], 'Article 32 allows individuals to approach the Supreme Court for enforcement of Fundamental Rights.'],
    ['Indian Polity', 'Fundamental Duties are listed in which part of the Constitution?', 'Part IVA', ['Part II', 'Part III', 'Part V'], 'Fundamental Duties appear in Part IVA, Article 51A.'],
    ['Indian Polity', 'Who is the constitutional head of the Union executive?', 'The President of India', ['The Prime Minister', 'The Chief Justice of India', 'The Speaker of the Lok Sabha'], 'The President is the constitutional head; executive action is exercised through the Council of Ministers.'],
    ['Indian Polity', 'A Money Bill can be introduced only in which House?', 'Lok Sabha', ['Rajya Sabha', 'Either House', 'A joint sitting only'], 'A Money Bill can be introduced only in the Lok Sabha on the President’s recommendation.'],
    ['Indian Polity', 'Who presides over a joint sitting of Parliament?', 'The Speaker of the Lok Sabha', ['The President', 'The Vice-President', 'The Prime Minister'], 'The Lok Sabha Speaker presides over a joint sitting.'],
    ['Indian Polity', 'Which body conducts elections to Parliament and State Legislatures?', 'Election Commission of India', ['Finance Commission', 'UPSC', 'NITI Aayog'], 'Article 324 vests superintendence, direction, and control of elections in the Election Commission.'],
    ['Indian Polity', 'The Directive Principles of State Policy are contained in which part?', 'Part IV', ['Part III', 'Part IVA', 'Part VI'], 'Directive Principles are in Part IV, Articles 36–51.'],
    ['Indian History', 'Who founded the Maurya Empire?', 'Chandragupta Maurya', ['Ashoka', 'Bindusara', 'Harshavardhana'], 'Chandragupta Maurya established the Maurya Empire with the guidance of Chanakya.'],
    ['Indian History', 'The Kalinga War is associated with which ruler?', 'Ashoka', ['Chandragupta II', 'Samudragupta', 'Kanishka'], 'Ashoka’s remorse after the Kalinga War influenced his later policy of Dhamma.'],
    ['Indian History', 'Who wrote the Arthashastra?', 'Kautilya (Chanakya)', ['Kalidasa', 'Banabhatta', 'Panini'], 'The Arthashastra is attributed to Kautilya, also known as Chanakya.'],
    ['Indian History', 'Who founded the Mughal Empire in India?', 'Babur', ['Akbar', 'Humayun', 'Sher Shah Suri'], 'Babur founded Mughal rule after the First Battle of Panipat in 1526.'],
    ['Indian History', 'The First Battle of Panipat was fought in which year?', '1526', ['1556', '1761', '1498'], 'The First Battle of Panipat in 1526 established Babur’s rule in northern India.'],
    ['Indian History', 'Who introduced the Permanent Settlement in Bengal?', 'Lord Cornwallis', ['Warren Hastings', 'Lord Wellesley', 'Lord Dalhousie'], 'Cornwallis introduced the Permanent Settlement in 1793.'],
    ['Indian History', 'The Non-Cooperation Movement began in which year?', '1920', ['1919', '1930', '1942'], 'Gandhi launched the Non-Cooperation Movement in 1920.'],
    ['Indian History', 'Who gave the slogan “Do or Die” during the freedom movement?', 'Mahatma Gandhi', ['Subhas Chandra Bose', 'Bal Gangadhar Tilak', 'Jawaharlal Nehru'], 'Gandhi gave the “Do or Die” call during the Quit India Movement in 1942.'],
    ['Indian History', 'The Dandi March was associated with which movement?', 'Civil Disobedience Movement', ['Swadeshi Movement', 'Khilafat Movement', 'Quit India Movement'], 'The 1930 Dandi March protested the British salt tax and launched the Civil Disobedience Movement.'],
    ['Indian History', 'Who founded the Indian National Congress in 1885?', 'A. O. Hume', ['Dadabhai Naoroji', 'W. C. Bonnerjee', 'Surendranath Banerjee'], 'A. O. Hume played the leading role in founding the Indian National Congress in 1885.'],
    ['Geography', 'Which is the longest river that flows entirely within India?', 'Godavari', ['Narmada', 'Kaveri', 'Mahanadi'], 'The Godavari is the longest river flowing entirely within India and is often called Dakshin Ganga.'],
    ['Geography', 'Which river is known as the “Sorrow of Bihar”?', 'Kosi', ['Son', 'Gandak', 'Damodar'], 'The Kosi has historically caused severe flooding in Bihar.'],
    ['Geography', 'Which soil is especially suitable for cotton cultivation?', 'Black soil', ['Laterite soil', 'Mountain soil', 'Desert soil'], 'Black soil retains moisture and is particularly suitable for cotton.'],
    ['Geography', 'The Tropic of Cancer passes through how many Indian states?', 'Eight', ['Six', 'Seven', 'Nine'], 'The Tropic of Cancer passes through eight Indian states.'],
    ['Geography', 'Which is the highest peak located wholly within India?', 'Nanda Devi', ['Anamudi', 'Guru Shikhar', 'Doddabetta'], 'Nanda Devi is the highest peak located wholly within India.'],
    ['Geography', 'Which plateau is rich in mineral resources in eastern India?', 'Chota Nagpur Plateau', ['Malwa Plateau', 'Deccan Plateau', 'Meghalaya Plateau'], 'The Chota Nagpur Plateau is rich in coal, iron ore, and other minerals.'],
    ['Geography', 'The Sundarbans are chiefly associated with which river delta?', 'Ganga–Brahmaputra delta', ['Godavari delta', 'Mahanadi delta', 'Narmada delta'], 'The Sundarbans occupy the Ganga–Brahmaputra delta region.'],
    ['Geography', 'Which Indian state has the longest coastline?', 'Gujarat', ['Tamil Nadu', 'Andhra Pradesh', 'Maharashtra'], 'Gujarat has the longest coastline among Indian states.'],
    ['Geography', 'Which pass connects Srinagar with Leh?', 'Zoji La', ['Shipki La', 'Nathu La', 'Bomdi La'], 'Zoji La lies on the route between Srinagar and Leh.'],
    ['Geography', 'Which is the largest brackish-water lagoon in India?', 'Chilika Lake', ['Wular Lake', 'Sambhar Lake', 'Pulicat Lake'], 'Chilika Lake in Odisha is India’s largest brackish-water lagoon.'],
    ['Physics', 'What is the SI unit of force?', 'Newton', ['Joule', 'Pascal', 'Watt'], 'Force is measured in newtons; one newton is one kilogram metre per second squared.'],
    ['Physics', 'What is the SI unit of electric current?', 'Ampere', ['Volt', 'Ohm', 'Coulomb'], 'Electric current is measured in amperes.'],
    ['Physics', 'Which mirror is commonly used as a rear-view mirror in vehicles?', 'Convex mirror', ['Plane mirror', 'Concave mirror', 'Cylindrical mirror'], 'A convex mirror gives a wider field of view and forms an erect, diminished image.'],
    ['Physics', 'Which colour of visible light has the longest wavelength?', 'Red', ['Violet', 'Blue', 'Green'], 'Red light has the longest wavelength in the visible spectrum.'],
    ['Physics', 'Which instrument measures atmospheric pressure?', 'Barometer', ['Hygrometer', 'Ammeter', 'Calorimeter'], 'A barometer measures atmospheric pressure.'],
    ['Physics', 'What is the SI unit of power?', 'Watt', ['Joule', 'Newton', 'Pascal'], 'Power is the rate of doing work and is measured in watts.'],
    ['Chemistry', 'What is the chemical symbol for sodium?', 'Na', ['So', 'S', 'N'], 'Na comes from the Latin name natrium.'],
    ['Chemistry', 'A solution with pH below 7 is generally:', 'Acidic', ['Basic', 'Neutral', 'Saline only'], 'At ordinary conditions, pH below 7 indicates an acidic solution.'],
    ['Chemistry', 'Which gas is released when an acid reacts with a carbonate?', 'Carbon dioxide', ['Hydrogen', 'Nitrogen', 'Oxygen'], 'Acid–carbonate reactions produce salt, water, and carbon dioxide.'],
    ['Chemistry', 'Which metal is liquid at ordinary room temperature?', 'Mercury', ['Iron', 'Aluminium', 'Copper'], 'Mercury is a metal that is liquid at ordinary room temperature.'],
    ['Chemistry', 'Rusting of iron requires oxygen and:', 'Water or moisture', ['Carbon dioxide only', 'Nitrogen only', 'Helium'], 'Iron rusts in the presence of oxygen and moisture.'],
    ['Biology', 'Which organelle is known as the powerhouse of the cell?', 'Mitochondrion', ['Ribosome', 'Golgi apparatus', 'Lysosome'], 'Mitochondria produce most cellular ATP through respiration.'],
    ['Biology', 'Which pigment enables plants to absorb light for photosynthesis?', 'Chlorophyll', ['Haemoglobin', 'Melanin', 'Keratin'], 'Chlorophyll in chloroplasts absorbs light energy for photosynthesis.'],
    ['Biology', 'Which blood group is commonly called the universal red-cell donor?', 'O negative', ['AB positive', 'A positive', 'B negative'], 'O negative red cells lack A, B, and Rh(D) antigens; clinical transfusion still requires testing.'],
    ['Biology', 'Which vitamin is produced in the skin with adequate sunlight exposure?', 'Vitamin D', ['Vitamin C', 'Vitamin B12', 'Vitamin K'], 'UVB exposure helps the skin synthesize vitamin D.'],
    ['Biology', 'Insulin is produced by which organ?', 'Pancreas', ['Liver', 'Kidney', 'Spleen'], 'Beta cells in the pancreatic islets produce insulin.'],
    ['Economics', 'Which institution issues most currency notes in India?', 'Reserve Bank of India', ['State Bank of India', 'Finance Commission', 'NITI Aayog'], 'The RBI issues banknotes in India, except the one-rupee note issued by the Government of India.'],
    ['Economics', 'GST is primarily an example of which type of tax?', 'Indirect tax', ['Direct tax', 'Wealth tax', 'Corporate income tax'], 'GST is an indirect tax levied on the supply of goods and services.'],
    ['Economics', 'What does inflation mean?', 'A sustained rise in the general price level', ['A fall in all prices', 'A rise in production only', 'A fall in money supply only'], 'Inflation is a sustained increase in the general level of prices.'],
    ['Economics', 'Which body makes recommendations on tax devolution between the Union and states?', 'Finance Commission', ['Election Commission', 'UPSC', 'National Development Council'], 'The Finance Commission is constituted under Article 280.'],
    ['Art and Culture', 'Bharatanatyam is classically associated with which state?', 'Tamil Nadu', ['Punjab', 'Assam', 'Gujarat'], 'Bharatanatyam developed in Tamil Nadu.'],
    ['Art and Culture', 'Bihu is a major festival of which state?', 'Assam', ['Kerala', 'Goa', 'Haryana'], 'Bihu marks important stages of the agricultural calendar in Assam.'],
    ['Art and Culture', 'Kathakali is a classical dance-drama tradition of:', 'Kerala', ['Odisha', 'Manipur', 'Rajasthan'], 'Kathakali is a highly stylized classical dance-drama of Kerala.'],
    ['Art and Culture', 'The Konark Sun Temple is located in:', 'Odisha', ['Bihar', 'Madhya Pradesh', 'Karnataka'], 'The 13th-century Sun Temple at Konark is in Odisha.'],
    ['Art and Culture', 'The Ajanta caves are located in which state?', 'Maharashtra', ['Uttar Pradesh', 'Telangana', 'Rajasthan'], 'The Ajanta Buddhist caves are in Maharashtra.'],
    ['Books and Authors', 'Who wrote “The Discovery of India”?', 'Jawaharlal Nehru', ['M. K. Gandhi', 'Rabindranath Tagore', 'B. R. Ambedkar'], 'Jawaharlal Nehru wrote The Discovery of India during imprisonment in the 1940s.'],
    ['Books and Authors', 'Who wrote the play “Abhijnanashakuntalam”?', 'Kalidasa', ['Banabhatta', 'Tulsidas', 'Bharavi'], 'Abhijnanashakuntalam is a celebrated Sanskrit play by Kalidasa.'],
    ['Environment', 'The ozone layer is mainly found in which atmospheric layer?', 'Stratosphere', ['Troposphere', 'Mesosphere', 'Thermosphere'], 'Most atmospheric ozone is concentrated in the stratosphere.'],
    ['Environment', 'Project Tiger was launched in India in which year?', '1973', ['1969', '1982', '1991'], 'Project Tiger began in 1973 to support tiger conservation.'],
    ['Environment', 'Which gas is the largest contributor to human-caused global warming by total emissions?', 'Carbon dioxide', ['Argon', 'Neon', 'Hydrogen'], 'Carbon dioxide is the largest contributor by total anthropogenic emissions; other gases have higher warming potency per molecule.'],
    ['Computer Awareness', 'What does CPU stand for?', 'Central Processing Unit', ['Computer Primary Utility', 'Central Program Upload', 'Control Processing User'], 'CPU stands for Central Processing Unit.'],
    ['Computer Awareness', 'Which memory is volatile?', 'RAM', ['ROM', 'Blu-ray disc', 'Hard disk'], 'RAM generally loses its contents when power is removed.'],
    ['Computer Awareness', 'Which protocol is commonly used to transfer web pages securely?', 'HTTPS', ['HTTP only', 'FTP', 'SMTP'], 'HTTPS uses TLS to protect HTTP communication in transit.'],
    ['Computer Awareness', 'What is the binary equivalent of decimal 8?', '1000', ['1001', '1110', '1010'], 'Decimal 8 equals 1×2³, so its binary form is 1000.'],
    ['Sports', 'How many players from one team are on the field in a standard football match?', '11', ['9', '10', '12'], 'A standard association football team fields 11 players, including the goalkeeper.'],
    ['Sports', 'The Thomas Cup is associated with which sport?', 'Badminton', ['Hockey', 'Football', 'Table tennis'], 'The Thomas Cup is the international men’s team badminton championship.'],
    ['Awards', 'The Dadasaheb Phalke Award is associated with which field?', 'Indian cinema', ['Literature', 'Science', 'Classical music only'], 'The Dadasaheb Phalke Award recognises lifetime contribution to Indian cinema.'],
    ['Awards', 'The Arjuna Award recognises achievement in:', 'Sports', ['Agriculture', 'Journalism', 'Public administration'], 'The Arjuna Award recognises outstanding achievement in sports.']
  ];

  const directions = ['north', 'east', 'south', 'west'];
  const englishFiller = [
    ['The committee reached a decision after a ___ discussion.', 'lengthy', ['length', 'lengthen', 'lengthily'], 'An adjective is needed before the noun "discussion."'],
    ['The witness gave a ___ account of the incident.', 'reliable', ['rely', 'reliance', 'reliably'], 'An adjective is needed to describe the noun "account."'],
    ['The officer acted ___ and prevented further confusion.', 'promptly', ['prompt', 'promptness', 'prompting'], 'An adverb modifies the verb "acted."'],
    ['The new rule will ___ all applicants equally.', 'affect', ['effect', 'affects to', 'effected'], 'Use "affect" as a verb meaning influence.'],
    ['The principal asked the students to maintain ___ in the library.', 'silence', ['silent', 'silently', 'silenceful'], 'A noun is required after "maintain."'],
    ['The report must be submitted ___ Friday afternoon.', 'by', ['until', 'since', 'among'], '"By Friday" sets a deadline no later than Friday.'],
    ['She is accustomed ___ early for work.', 'to rising', ['to rise', 'for rise', 'with rising'], '"Accustomed to" is followed by a noun or gerund.'],
    ['The manager insisted ___ seeing the original document.', 'on', ['at', 'for', 'with'], 'The verb "insist" takes the preposition "on."'],
    ['The evidence was not ___ to support the claim.', 'sufficient', ['sufficiency', 'sufficiently', 'suffice'], 'An adjective follows the linking verb "was."'],
    ['The train was delayed ___ dense fog.', 'because of', ['although', 'despite of', 'unless'], 'Use "because of" before a noun phrase giving a cause.']
  ];

  function englishQuestion(mock, index, seed) {
    const id = `m${mock}-en-${index + 1}`;
    const type = index % 7;
    if (type === 0) {
      const item = vocabulary[(mock * 17 + index * 3) % vocabulary.length];
      const antonym = (mock + index) % 2 === 1;
      const correct = antonym ? item[2] : item[1];
      const distractors = shuffle(vocabulary.map(entry => antonym ? entry[2] : entry[1]).filter(value => value !== correct), seed).slice(0, 3);
      return question(id, 'Vocabulary', `Choose the ${antonym ? 'antonym' : 'synonym'} of “${item[0]}”.`, correct, distractors, `${item[0]} means ${item[1]}; its ${antonym ? 'antonym' : 'synonym'} is ${correct}.`, `Learn the word in a synonym–antonym pair: ${item[0]} → ${item[1]} / ${item[2]}.`, seed);
    }
    if (type === 1) {
      const item = grammarItems[(mock * 5 + index) % grammarItems.length];
      return question(id, 'Grammar', `Choose the grammatically correct word or phrase: ${item[0]}`, item[1], item[2], item[3], 'Find the true subject first; ignore phrases between the subject and verb.', seed);
    }
    if (type === 2) {
      const item = prepositionItems[(mock * 7 + index) % prepositionItems.length];
      return question(id, 'Prepositions', `Fill in the blank: ${item[0]}`, item[1], item[2], item[3], 'Memorise the complete verb/adjective + preposition combination.', seed);
    }
    if (type === 3) {
      const item = idioms[(mock * 11 + index * 2) % idioms.length];
      const wrong = idioms.map(entry => entry[1]).filter(value => value !== item[1]);
      return question(id, 'Idioms and Phrases', `Choose the meaning of “${item[0]}”.`, item[1], shuffle(wrong, seed).slice(0, 3), `The idiom “${item[0]}” means ${item[1]}.`, 'Understand the idiom as a whole; do not translate its individual words literally.', seed);
    }
    if (type === 4) {
      const item = spellings[(mock * 13 + index) % spellings.length];
      return question(id, 'Spelling', `Select the correctly spelt word.`, item[0], item.slice(1), `The correct spelling is “${item[0]}.”`, 'Break long words into syllables and check common double-letter patterns.', seed);
    }
    if (type === 5) {
      const item = voiceItems[(mock * 3 + index) % voiceItems.length];
      return question(id, 'Active and Passive Voice', `Choose the correct passive form of: “${item[0]}”`, item[1], item[2], item[3], 'Keep the tense unchanged; move the object to subject position and use the correct form of “be” + past participle.', seed);
    }
    const item = englishFiller[(mock * 9 + index) % englishFiller.length];
    return question(id, 'Sentence Completion', item[0], item[1], item[2], item[3], 'Identify the part of speech required by the sentence before selecting a word.', seed);
  }

  function reasoningQuestion(mock, index, seed) {
    const id = `m${mock}-re-${index + 1}`;
    const type = index % 8;
    if (type === 0) {
      const pairs = [['Thermometer', 'temperature', 'Barometer', 'pressure', 'current', 'speed'], ['Barometer', 'pressure', 'Ammeter', 'electric current', 'voltage', 'mass'], ['Odometer', 'distance', 'Thermometer', 'temperature', 'time', 'force'], ['Ammeter', 'electric current', 'Voltmeter', 'voltage', 'resistance', 'power'], ['Compass', 'direction', 'Anemometer', 'wind speed', 'weight', 'humidity'], ['Seismograph', 'earthquake waves', 'Rain Gauge', 'rainfall', 'wind speed', 'temperature']];
      const item = pairs[(mock * 3 + index) % pairs.length];
      return question(id, 'Analogy', `${item[0]} : ${item[1]} :: ${item[2]} : ?`, item[3], [item[4], item[5], 'none of these'], `${item[0]} measures ${item[1]}; ${item[2]} measures ${item[3]}.`, 'State the relationship in a short phrase, then apply the same relationship to the second pair.', seed);
    }
    if (type === 1) {
      const start = 3 + ((mock * 7 + index) % 18);
      const step = 2 + ((mock * 5 + index * 3) % 11);
      const values = [start, start + step, start + 2 * step, start + 3 * step];
      const answer = start + 4 * step;
      return question(id, 'Number Series', `Find the next number: ${values.join(', ')}, ___.`, answer, numericDistractors(answer, [-step, 1, step * 2]), `The sequence increases by ${step} each time; the next term is ${values[3]} + ${step} = ${answer}.`, 'Subtract consecutive terms first; test for a constant difference before considering other patterns.', seed);
    }
    if (type === 2) {
      const shift = 1 + ((mock * 3 + index) % 5);
      const word = ['MAP', 'SUN', 'PEN', 'BOX', 'CAT', 'RIM', 'TOP', 'BUS', 'INK', 'HAT'][(mock * 7 + index) % 10];
      const encode = (value, amount = shift) => value.split('').map(char => String.fromCharCode(65 + (char.charCodeAt(0) - 65 + amount) % 26)).join('');
      const correct = encode(word);
      const alternatives = [encode(word).slice(1) + encode(word)[0], word.split('').reverse().join(''), encode(word, shift + 1)];
      return question(id, 'Coding and Decoding', `If each letter is moved ${shift} place${shift === 1 ? '' : 's'} forward in the alphabet, how is ${word} coded?`, correct, alternatives, `Move each letter ${shift} position${shift === 1 ? '' : 's'} forward: ${word} becomes ${correct}.`, 'Write alphabet positions and apply the same shift to every character; wrap Z back to A.', seed);
    }
    if (type === 3) {
      const first = 3 + ((mock * 4 + index) % 8);
      const second = 4 + ((mock * 7 + index * 2) % 9);
      const answer = first + second;
      return question(id, 'Direction and Distance', `A person walks ${first} km east and then ${second} km north. What is the straight-line distance from the starting point?`, `${Math.sqrt(first * first + second * second).toFixed(2)} km`, [`${answer} km`, `${Math.abs(first - second)} km`, `${(first * second).toFixed(2)} km`], `The route forms a right triangle: distance = √(${first}² + ${second}²) = ${Math.sqrt(first * first + second * second).toFixed(2)} km.`, 'For perpendicular movements, use the Pythagorean theorem; do not add the route lengths.', seed);
    }
    if (type === 4) {
      const item = [['doctor', 'hospital', 'teacher', 'school', 'court'], ['author', 'book', 'painter', 'canvas', 'hammer'], ['bee', 'hive', 'bird', 'nest', 'stable'], ['fish', 'water', 'bird', 'air', 'soil'], ['puppy', 'dog', 'kitten', 'cat', 'calf'], ['foot', 'shoe', 'hand', 'glove', 'hat']][(mock + index) % 6];
      return question(id, 'Analogy', `${item[0]} : ${item[1]} :: ${item[2]} : ?`, item[3], [item[4], item[0], item[1]], `The first pair has the relationship “${item[0]} is associated with ${item[1]};” the same relationship gives ${item[3]}.`, 'Describe the first pair’s relationship in words before choosing the second pair.', seed);
    }
    if (type === 5) {
      const item = [['All roses are flowers. All flowers need water.', 'All roses need water.', 'Some roses need water.', 'No roses need water.', 'All flowers are roses.'], ['All clerks are employees. No employee is a visitor.', 'No clerk is a visitor.', 'All visitors are clerks.', 'Some clerks are visitors.', 'No employee is a clerk.'], ['Some books are novels. All novels are fiction.', 'Some books are fiction.', 'All books are fiction.', 'No books are fiction.', 'All fiction is a novel.'], ['All metals conduct electricity. Copper is a metal.', 'Copper conducts electricity.', 'All conductors are copper.', 'Copper is not a metal.', 'Some metals do not conduct electricity.']][(mock * 2 + index) % 4];
      return question(id, 'Syllogism', `${item[0]} Which conclusion follows logically?`, item[1], [item[2], item[3], item[4]], `The conclusion follows by applying the category relationship in the premises: ${item[1]}`, 'Use only the information given. Do not assume that “some” means “all.”', seed);
    }
    if (type === 6) {
      const a = 2 + ((mock + index) % 8);
      const firstDifference = 3 + ((mock * 2 + index) % 7);
      const secondDifference = firstDifference + 2;
      const b = a + firstDifference;
      const c = b + secondDifference;
      const answer = c + secondDifference + 2;
      return question(id, 'Number Series', `Find the next number: ${a}, ${b}, ${c}, ___.`, answer, numericDistractors(answer, [-2, -1, 3]), `The differences increase by 2: ${b - a}, ${c - b}, then ${c - b + 2}; the next term is ${answer}.`, 'Compare first differences; if they change regularly, compare the differences again.', seed);
    }
    const direction = directions[(mock + index) % 4];
    const answer = directions[(directions.indexOf(direction) + 3) % 4];
    return question(id, 'Direction Sense', `A person faces ${direction}, turns 180° and then turns 90° clockwise. Which direction are they facing?`, answer, directions.filter(value => value !== answer).slice(0, 3), `The 180° turn faces ${directions[(directions.indexOf(direction) + 2) % 4]}; a further 90° clockwise turn gives ${answer}.`, 'Track turns on a compass: 180° reverses direction, then 90° clockwise advances one quadrant.', seed);
  }

  function quantQuestion(mock, index, seed) {
    const id = `m${mock}-qa-${index + 1}`;
    const type = index % 10;
    if (type === 0) {
      const base = 200 + ((mock * 17 + index * 11) % 40) * 25;
      const percent = [12, 15, 20, 25, 30, 35, 40, 45, 50][(mock + index) % 9];
      const answer = base * percent / 100;
      return question(id, 'Percentage', `Find ${percent}% of ${base}.`, answer, numericDistractors(answer, [-10, 5, 15]), `${percent}% of ${base} = ${base} × ${percent}/100 = ${answer}.`, 'Use 10% = one tenth, 5% = half of 10%, and 1% = one hundredth to calculate mentally.', seed);
    }
    if (type === 1) {
      const cost = 240 + ((mock * 13 + index * 7) % 50) * 20;
      const rate = [10, 12, 15, 20, 25][(mock * 2 + index) % 5];
      const answer = cost * (100 + rate) / 100;
      return question(id, `Profit and Loss`, `An article costs ₹${cost}. If it is sold at a profit of ${rate}%, find its selling price.`, `₹${answer}`, [`₹${cost * (100 - rate) / 100}`, `₹${cost + rate}`, `₹${cost * 100 / (100 + rate)}`], `Selling price = cost price × (100 + profit%)/100 = ${cost} × ${100 + rate}/100 = ₹${answer}.`, 'For profit, multiply cost price by (100 + profit%)/100; for loss use (100 − loss%)/100.', seed);
    }
    if (type === 2) {
      const a = 2 + ((mock + index) % 8);
      const b = a + 1 + ((mock * 3 + index) % 7);
      const multiplier = 5 + ((mock * 7 + index) % 12);
      const total = (a + b) * multiplier;
      const answer = a * multiplier;
      return question(id, 'Ratio and Proportion', `Two amounts are in the ratio ${a}:${b}. If their sum is ${total}, what is the smaller amount?`, answer, [b * multiplier, multiplier, total - multiplier], `Total parts = ${a}+${b}=${a + b}. One part = ${total}/${a + b}=${multiplier}; the smaller amount is ${a}×${multiplier}=${answer}.`, 'Add ratio parts first, divide the total by that sum, then multiply by the requested part.', seed);
    }
    if (type === 3) {
      const firstValue = 12 + mock * 5 + index * 2;
      const values = [firstValue, firstValue + 4, firstValue + 8, firstValue + 12];
      const answer = values.reduce((sum, value) => sum + value, 0) / values.length;
      return question(id, 'Average', `Find the average of ${values.join(', ')}.`, answer, numericDistractors(answer, [-3, 2, 5]), `Average = sum ÷ number of values = ${values.join('+')} ÷ ${values.length} = ${answer}.`, 'Pair numbers around a convenient middle value to shorten the addition.', seed);
    }
    if (type === 4) {
      const principal = 1000 + ((mock * 9 + index * 5) % 30) * 500;
      const rate = [5, 6, 8, 10, 12][(mock + index) % 5];
      const years = 2 + ((mock * 3 + index) % 5);
      const answer = principal * rate * years / 100;
      return question(id, 'Simple Interest', `Find the simple interest on ₹${principal} at ${rate}% per annum for ${years} years.`, `₹${answer}`, [`₹${principal * rate / 100}`, `₹${principal * rate * years / 100 + principal}`, `₹${principal * years / 100}`], `SI = P×R×T/100 = ${principal}×${rate}×${years}/100 = ₹${answer}.`, 'Write P, R, and T separately before substituting into SI = PRT/100.', seed);
    }
    if (type === 5) {
      const distance = 60 + ((mock * 5 + index * 7) % 18) * 10;
      const speed = 30 + ((mock * 3 + index * 2) % 9) * 5;
      const answer = distance / speed;
      return question(id, 'Time, Speed and Distance', `A vehicle travels ${distance} km at ${speed} km/h. How long does the journey take?`, `${answer.toFixed(2)} hours`, [`${(distance * speed).toFixed(2)} hours`, `${(speed / distance).toFixed(2)} hours`, `${(distance + speed).toFixed(2)} hours`], `Time = distance ÷ speed = ${distance} ÷ ${speed} = ${answer.toFixed(2)} hours.`, 'Keep units consistent. If the answer is in hours, multiply the decimal part by 60 to convert it to minutes.', seed);
    }
    if (type === 6) {
      const a = 4 + ((mock * 2 + index) % 8);
      const b = 5 + ((mock * 3 + index * 2) % 9);
      const answer = (a * b / (a + b)).toFixed(2);
      return question(id, 'Time and Work', `A can complete a job in ${a} days and B in ${b} days. How long will they take working together?`, `${answer} days`, [`${a + b} days`, `${Math.abs(a - b)} days`, `${(a + b) / 2} days`], `Combined rate = 1/${a}+1/${b} = (${a + b})/${a * b}; time = ${a * b}/${a + b} = ${answer} days.`, 'Add work rates, not the number of days: 1/A + 1/B, then take the reciprocal.', seed);
    }
    if (type === 7) {
      const x = 4 + ((mock * 3 + index) % 16);
      const multiplier = 2 + ((mock + index * 2) % 5);
      const constant = 3 + ((mock * 2 + index) % 13);
      const total = multiplier * x + constant;
      return question(id, 'Algebra', `If ${multiplier}x + ${constant} = ${total}, find x.`, x, numericDistractors(x, [-2, 1, 3]), `Subtract ${constant}: ${multiplier}x=${total - constant}; divide by ${multiplier}: x=${x}.`, 'Move constants first, then divide by the coefficient of the variable.', seed);
    }
    if (type === 8) {
      const length = 8 + ((mock * 3 + index) % 20);
      const breadth = 5 + ((mock * 7 + index * 2) % 15);
      const answer = length * breadth;
      return question(id, 'Mensuration', `Find the area of a rectangle with length ${length} cm and breadth ${breadth} cm.`, `${answer} cm²`, [`${2 * (length + breadth)} cm²`, `${length + breadth} cm²`, `${2 * length * breadth} cm²`], `Area of rectangle = length × breadth = ${length} × ${breadth} = ${answer} cm².`, 'Do not confuse area (square units) with perimeter (linear units).', seed);
    }
    const principal = 1000 + (mock * 17 + index * 7) * 100;
    const rate = [5, 10, 20][(mock + index) % 3];
    const amount = principal * Math.pow(1 + rate / 100, 2);
    const interest = amount - principal;
    return question(id, 'Compound Interest', `Find the compound interest on ₹${principal} at ${rate}% per annum for 2 years, compounded annually.`, `₹${interest.toFixed(2)}`, [`₹${(principal * rate * 2 / 100).toFixed(2)}`, `₹${amount.toFixed(2)}`, `₹${(principal * rate / 100).toFixed(2)}`], `Amount = P(1+R/100)² = ${amount.toFixed(2)}; compound interest = amount − principal = ₹${interest.toFixed(2)}.`, 'For 2 years, compound interest equals P×R/100×(2+R/100).', seed);
  }

  function awarenessQuestion(mock, index, seed) {
    const id = `m${mock}-ga-${index + 1}`;
    const factIndex = (mock * 19 + index * 7) % awarenessFacts.length;
    const fact = awarenessFacts[factIndex];
    const style = (mock + index) % 4;
    const prompts = [
      fact[1],
      `Choose the correct statement about this ${fact[0]} topic: ${fact[1]}`,
      `In ${fact[0].toLowerCase()}, ${fact[1].charAt(0).toLowerCase()}${fact[1].slice(1)}`,
      `Select the correct answer. ${fact[1]}`
    ];
    const otherAnswers = awarenessFacts.map(item => item[2]).filter(value => value !== fact[2]);
    return question(id, fact[0], prompts[style], fact[2], shuffle(otherAnswers, seed).slice(0, 3), fact[4], `Recall the associated article, person, place, unit, or institution; eliminate options from unrelated topics.`, seed);
  }

  function buildMock(mockNumber) {
    const mock = mockNumber;
    return {
      id: `ssc-chsl-${String(mock).padStart(2, '0')}`,
      title: `Mock Test ${String(mock).padStart(2, '0')}`,
      sections: SECTIONS.map(section => {
        const generator = section.id === 'english' ? englishQuestion : section.id === 'reasoning' ? reasoningQuestion : section.id === 'quant' ? quantQuestion : awarenessQuestion;
        const questions = Array.from({ length: QUESTION_COUNT }, (_, index) => generator(mock, index, hash(`${mock}:${section.id}:${index}`)));
        return { ...section, questions };
      })
    };
  }

  const mocks = Array.from({ length: MOCK_COUNT }, (_, index) => buildMock(index + 1));
  const usedQuestionForms = new Set();
  for (const mock of mocks) {
    for (const section of mock.sections) {
      for (const item of section.questions) {
        const correctOption = item.options[item.answer];
        const candidates = [];
        function permute(values, start = 0) {
          if (start === values.length) {
            candidates.push(values.slice());
            return;
          }
          for (let index = start; index < values.length; index++) {
            [values[start], values[index]] = [values[index], values[start]];
            permute(values, start + 1);
            [values[start], values[index]] = [values[index], values[start]];
          }
        }
        permute(item.options.slice());
        const orderedCandidates = shuffle(candidates, hash(item.id));
        const uniqueOptions = orderedCandidates.find(options => !usedQuestionForms.has(`${section.id}|${item.question}|${options.join('|')}`));
        if (uniqueOptions) {
          item.options = uniqueOptions;
          item.answer = uniqueOptions.indexOf(correctOption);
        }
        usedQuestionForms.add(`${section.id}|${item.question}|${item.options.join('|')}`);
      }
    }
  }
  root.SSC_CHSL_MOCK_DATA = {
    exam: { name: 'SSC CHSL Tier-I', totalQuestions: 100, totalMarks: 200, totalMinutes: 60, correctMarks: 2, incorrectPenalty: 0.5 },
    sections: SECTIONS,
    mocks,
    questionTotal: mocks.reduce((sum, mock) => sum + mock.sections.reduce((inner, section) => inner + section.questions.length, 0), 0)
  };
})(globalThis);
