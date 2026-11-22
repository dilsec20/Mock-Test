/* SSC CHSL Tier-I — English Language Sectional Tests (10 × 25 = 250 questions) */
(function (root) {
  'use strict';

  function hash(v) { let r = 2166136261; for (let i = 0; i < v.length; i++) { r ^= v.charCodeAt(i); r = Math.imul(r, 16777619); } return r >>> 0; }
  function shuffle(a, seed) { const r = a.slice(); let s = seed >>> 0; for (let i = r.length - 1; i > 0; i--) { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; const j = s % (i + 1); [r[i], r[j]] = [r[j], r[i]]; } return r; }
  function question(id, topic, prompt, correct, distractors, explanation, shortcut, seed) {
    const c = []; for (const ch of [String(correct), ...distractors.map(String)]) { if (!c.includes(ch) && c.length < 4) c.push(ch); }
    let fb = 1; while (c.length < 4) { const x = `None of these (${fb++})`; if (!c.includes(x)) c.push(x); }
    const opts = shuffle(c, seed);
    return { id, topic, question: prompt, options: opts, answer: opts.indexOf(String(correct)), explanation, shortcut };
  }

  /* 250 English facts: [topic, question, correct, [d1,d2,d3], explanation] */
  const engFacts = [
    // ─── Idioms & Phrases (25) ───
    ['Idioms','Which idiom means "something is near the end of its life or use"?','To be on one\'s last legs',['Not to have a leg to stand on','Show a leg','To have a hollow leg'],'To be on one\'s last legs means very close to collapse, exhaustion, or failure.'],
    ['Idioms','Fill in the blank: His inability to nurse his ailing mother was the ________ that stopped him from focusing on his duty.','albatross around his neck',['sparrow around his neck','eagle around his neck','pigeon around his neck'],'An albatross around one\'s neck refers to a heavy burden of guilt, from Coleridge\'s poem.'],
    ['Idioms','Which idiom means "dismissed, thrown out in disgrace"?','To be out on your ear',['Keep an ear out','To bend someone\'s ears','Blow it out your ear'],'To be out on your ear means forced to leave abruptly and in disgrace.'],
    ['Idioms','Fill in the blank: His sudden resignation caught everyone _______.','off guard',['red-handed','in limbo','on thin ice'],'Catch someone off guard means to surprise them when they are unprepared.'],
    ['Idioms','Fill in the blank: When the scandal broke, the minister tried to _____ and blame his aides.','pass the buck',['frown upon','brush off','touch on'],'Pass the buck means to shift responsibility to someone else.'],
    ['Idioms','Which idiom means "to do something unexpected that surprises or confuses someone"?','Throw one a curveball',['To be behind the curve','To play hardball','To swing for the fences'],'Throw a curveball means to surprise with something difficult or unexpected.'],
    ['Idioms','Which idiom means "it is impossible to get something for nothing"?','There\'s no such thing as a free lunch',['To be footloose and fancy free','Get away scot-free','We must do lunch sometime'],'This idiom means every benefit has a hidden or direct cost.'],
    ['Idioms','Which idiom means "with all one\'s strength or power"?','With might and main',['Might makes right','Might just as well','Might as well be hanged for a sheep'],'With might and main means using all physical strength and utmost effort.'],
    ['Idioms','Which idiom means "jealousy"?','The green-eyed monster',['Seeing red','Blue in the face','White as a sheet'],'The green-eyed monster personifies jealousy; from Shakespeare\'s Othello.'],
    ['Idioms','What does "the icing on the cake" mean?','The best part of something already good',['A difficult task','A sweet dessert','A minor detail'],'The icing on the cake means an additional ideal feature to something already good.'],
    ['Idioms','Which idiom means "humorous or intended as a joke though appearing serious"?','With tongue in cheek',['Bring the roses to one\'s cheeks','Cheek by jowl','With cheek to cheek'],'Tongue in cheek means speaking ironically or jokingly while appearing serious.'],
    ['Idioms','What does "till the cows come home" mean?','For a very long, indefinite amount of time',['Immediately','At dusk','Not for a long time'],'Till the cows come home means for a very long or indefinite period.'],
    ['Idioms','Which idiom means "a new, unfamiliar, potentially dangerous situation"?','Uncharted waters',['Back waters','Plow water','Charted waters'],'Uncharted waters means a situation with no past precedents to guide choices.'],
    ['Idioms','What does "break the ice" mean?','Begin a friendly conversation',['End a formal meeting','Break something cold','Start an argument'],'Break the ice means to relieve tension and begin a comfortable conversation.'],
    ['Idioms','What does "once in a blue moon" mean?','Very rarely',['Every day','At night','During a storm'],'Once in a blue moon means something happens very infrequently.'],
    ['Idioms','What does "spill the beans" mean?','Reveal a secret',['Waste food','Cook beans','Drop something'],'Spill the beans means to reveal information that was meant to be kept secret.'],
    ['Idioms','What does "burn the midnight oil" mean?','Work late into the night',['Waste electricity','Start a fire','Sleep early'],'Burn the midnight oil means to study or work late into the night.'],
    ['Idioms','What does "cost an arm and a leg" mean?','Be very expensive',['Be completely free','Cause physical injury','Be moderately priced'],'Cost an arm and a leg means something is extremely expensive.'],
    ['Idioms','What does "get cold feet" mean?','Become nervous before an action',['Feel physically cold','Walk barefoot','Catch a cold'],'Get cold feet means to become anxious or scared before doing something planned.'],
    ['Idioms','What does "piece of cake" mean?','Something very easy',['A difficult examination','A sweet treat','A complicated task'],'Piece of cake means something is very easy to do.'],
    ['Idioms','What does "beat around the bush" mean?','Avoid speaking directly',['Work in a garden','Hit something','Run in circles'],'Beat around the bush means to avoid discussing the main topic directly.'],
    ['Idioms','What does "hit the nail on the head" mean?','Describe exactly what is causing a situation',['Make a careless mistake','Use a hammer','Hurt oneself'],'Hit the nail on the head means to identify something precisely.'],
    ['Idioms','What does "a blessing in disguise" mean?','A difficulty that results in something good',['A gift kept hidden','Bad luck','A disguised person'],'A blessing in disguise means something initially bad that turns out to be beneficial.'],
    ['Idioms','What does "under the weather" mean?','Slightly ill',['Outside in the rain','Feeling happy','Very energetic'],'Under the weather means feeling slightly sick or unwell.'],
    ['Idioms','What does "call it a day" mean?','Stop working for the day',['Begin a new project','Make a phone call','Name a holiday'],'Call it a day means to decide to stop working.'],

    // ─── Antonyms & Synonyms (25) ───
    ['Vocabulary','Choose the antonym of "Interruption".','Continuation',['Break','Pause','Disruption'],'Interruption means a break in continuity; continuation means carrying on without stopping.'],
    ['Vocabulary','Choose the word most opposite in meaning to "charming".','Repulsive',['Delightful','Attractive','Engaging'],'Charming means pleasant/attractive; repulsive means causing intense distaste.'],
    ['Vocabulary','Choose the antonym of "burning".','Freezing',['Scorching','Blazing','Smoldering'],'Burning means very hot; freezing means extremely cold.'],
    ['Vocabulary','Choose the antonym of "How much".','How little',['How many','How often','How long'],'How much asks about large quantity; how little asks about small quantity.'],
    ['Vocabulary','Choose the antonym of "disappointing".','Satisfying',['Frustrating','Discouraging','Underwhelming'],'Disappointing means failing expectations; satisfying means giving fulfillment.'],
    ['Vocabulary','Choose the word most opposite to "delighted".','Displeased',['Elated','Jubilant','Overjoyed'],'Delighted means great pleasure; displeased means annoyed or unhappy.'],
    ['Vocabulary','Choose the antonym of "average".','Exceptional',['Common','Ordinary','Typical'],'Average means typical/standard; exceptional means unusually good or outstanding.'],
    ['Vocabulary','Choose the antonym of "accurate".','Inexact',['Precise','Correct','Exact'],'Accurate means free from error; inexact means not quite correct.'],
    ['Vocabulary','Choose the antonym of "Forgive".','Condemn',['Pardon','Excuse','Absolve'],'Forgive means to pardon; condemn means to express disapproval or declare guilty.'],
    ['Vocabulary','What is the synonym of "foe"?','Enemy',['Ally','Friend','Guest'],'Foe means an enemy or opponent. Synonym: enemy/adversary.'],
    ['Vocabulary','Choose the synonym of "abandon".','Forsake',['Retain','Keep','Hold'],'Abandon means to leave behind; forsake is its synonym meaning the same.'],
    ['Vocabulary','Choose the antonym of "abundant".','Scarce',['Plentiful','Ample','Copious'],'Abundant means plentiful; scarce means insufficient or rare.'],
    ['Vocabulary','Choose the antonym of "benevolent".','Malevolent',['Kind','Generous','Charitable'],'Benevolent means kind; malevolent means wishing harm.'],
    ['Vocabulary','Choose the synonym of "candid".','Frank',['Evasive','Secretive','Deceptive'],'Candid means open and honest; frank is its synonym.'],
    ['Vocabulary','Choose the antonym of "diligent".','Lazy',['Industrious','Hardworking','Meticulous'],'Diligent means hardworking; lazy means unwilling to work.'],
    ['Vocabulary','Choose the antonym of "explicit".','Implicit',['Clear','Obvious','Direct'],'Explicit means clearly stated; implicit means implied, not directly expressed.'],
    ['Vocabulary','Choose the synonym of "prudent".','Wise',['Reckless','Careless','Foolish'],'Prudent means acting with care and thought; wise is its synonym.'],
    ['Vocabulary','Choose the antonym of "resilient".','Fragile',['Adaptable','Strong','Tough'],'Resilient means able to recover; fragile means easily broken.'],
    ['Vocabulary','Choose the antonym of "serene".','Agitated',['Calm','Peaceful','Tranquil'],'Serene means calm; agitated means anxious or disturbed.'],
    ['Vocabulary','Choose the synonym of "vivid".','Striking',['Dull','Faded','Bland'],'Vivid means producing strong images; striking is its synonym.'],
    ['Vocabulary','Choose the antonym of "optimistic".','Pessimistic',['Hopeful','Positive','Confident'],'Optimistic means expecting the best; pessimistic means expecting the worst.'],
    ['Vocabulary','Choose the antonym of "transparent".','Opaque',['Clear','Obvious','See-through'],'Transparent means see-through; opaque means not letting light pass through.'],
    ['Vocabulary','Choose the synonym of "eminent".','Distinguished',['Unknown','Ordinary','Common'],'Eminent means famous and respected; distinguished is its synonym.'],
    ['Vocabulary','Choose the antonym of "frugal".','Extravagant',['Thrifty','Economical','Careful'],'Frugal means careful with money; extravagant means spending lavishly.'],
    ['Vocabulary','Choose the antonym of "obsolete".','Current',['Outdated','Archaic','Old-fashioned'],'Obsolete means no longer in use; current means up-to-date.'],

    // ─── Active / Passive Voice (30) ───
    ['Voice','Convert to passive: "The volunteers are cleaning the beach after the festival."','The beach is being cleaned by the volunteers after the festival.',['The beach is cleaned by the volunteers after the festival.','The beach has been cleaned by the volunteers after the festival.','The beach will be cleaned by the volunteers after the festival.'],'Present continuous active → is/are being + V3 in passive.'],
    ['Voice','Convert to passive: "You cannot allow such an egregious error to go unnoticed."','Such an egregious error cannot be allowed to go unnoticed by you.',['Such an egregious error cannot be allowed to be unnoticed by you.','It cannot be allowed by you that such an error goes unnoticed.','Such an error must not be allowed to go unnoticed by you.'],'Modal passive: cannot + be + V3. Keep the infinitive phrase intact.'],
    ['Voice','Convert to passive: "Are the scientists developing a new medicine?"','Is a new medicine being developed by the scientists?',['Has a new medicine been developed by the scientists?','Was a new medicine being developed by the scientists?','Is a new medicine developed by the scientists?'],'Present continuous interrogative passive: Is/Are + object + being + V3?'],
    ['Voice','Convert to active: "Had the concert tickets already been sold out by the event organisers?"','Had the event organisers already sold out the concert tickets?',['Have the event organisers already sold out the concert tickets?','Did the event organisers already sell out the concert tickets?','Were the event organisers already selling out the concert tickets?'],'Past perfect interrogative passive → Had + subject + V3 + object?'],
    ['Voice','Convert to active: "The painting could not be exhibited without being restored first."','They could not exhibit the painting without restoring it first.',['The painting could not have been exhibited without being restored.','The painting could not exhibit itself without being restored first.','Without being restore first, they could not exhibit the painting.'],'Modal passive → active: use a general subject "they" with the base verb.'],
    ['Voice','Convert to passive: "We have visited Paris many times."','Paris has been visited by us many times.',['Paris was visited by us many times.','Paris had been visited by us many times.','Paris is visited by us many times.'],'Present perfect active → has/have been + V3 in passive.'],
    ['Voice','Convert to active: "It has been being debated for months whether the new law will be enacted."','They have been debating for months whether the new law will be enacted.',['The new law will be enacted, which they have been debating.','Whether the law will be enacted has been debated for months.','They have been being debated for months.'],'Present perfect continuous passive → active: Subject + have been + V-ing.'],
    ['Voice','Convert to passive: "The archaeologists discovered ancient ruins during their excavation."','Ancient ruins were discovered by the archaeologists during their excavation.',['Ancient ruins had been discovered by the archaeologists.','Ancient ruins are discovered by the archaeologists.','Ancient ruins are being discovered by the archaeologists.'],'Simple past active → was/were + V3 in passive.'],
    ['Voice','Convert to active: "Was the letter delivered by the postman yesterday evening?"','Did the postman deliver the letter yesterday evening?',['Has the postman delivered the letter yesterday evening?','Does the postman deliver the letter yesterday evening?','Was the postman delivering the letter yesterday evening?'],'Simple past passive interrogative → Did + subject + V1 + object?'],
    ['Voice','Convert to active: "Have the rules been explained by the supervisor?"','Has the supervisor explained the rules?',['Did the supervisor explain the rules?','Does the supervisor explain the rules?','Have the supervisor explained the rules?'],'Present perfect passive interrogative → Has/Have + subject + V3?'],
    ['Voice','Convert to passive: "Why did the baker add salt to the cake batter?"','Why was salt added to the cake batter by the baker?',['Why is salt added to the cake batter by the baker?','Why are salt added to the cake batter by the baker?','Why did salt added to the cake batter by the baker?'],'Simple past interrogative → Why was/were + object + V3 + by subject?'],
    ['Voice','Convert to passive: "Why didn\'t the police arrest the miscreants?"','Why weren\'t the miscreants arrested by the police?',['Why wasn\'t the miscreants arrested by the police?','Why didn\'t the miscreants arrested by the police?','Why don\'t the miscreants arrested by the police?'],'Negative past interrogative passive uses weren\'t for plural subjects.'],
    ['Voice','Convert to active: "By whom has this programme been authorised?"','Who has authorised this programme?',['Whom has authorised this programme?','This programme has been authorised by whom?','By who is this programme authorised?'],'Passive "By whom" → Active "Who" as subject. Tense stays present perfect.'],
    ['Voice','Convert to passive: "How does he keep all these ancient clocks in working order?"','How are all these ancient clocks kept in working order by him?',['How do all these ancient clocks kept in working order by him?','How is all these ancient clocks kept in working order by him?','How are all these ancient clocks keep in working order by him?'],'Simple present interrogative → How + are + object + V3 + by subject?'],
    ['Voice','Convert to active: "A new residential complex is being constructed by the government."','The government is constructing a new residential complex.',['The government constructs a new residential complex.','The government has constructed a new residential complex.','The government constructed a new residential complex.'],'Present continuous passive → active: Subject + is/are + V-ing + object.'],
    ['Voice','Convert to passive: "We were rearranging the library when the earthquake occurred."','The library was being rearranged by us when the earthquake occurred.',['The library was rearranged by us when the earthquake occurred.','The library were rearranged by us when the earthquake occurred.','When the earthquake occurred, we were rearranging the library.'],'Past continuous active → was/were being + V3 in passive.'],
    ['Voice','Convert to active: "Why is this day celebrated as Children\'s Day?"','Why do people celebrate this day as Children\'s Day?',['Why did people celebrate this day as Children\'s Day?','Why are they celebrating this day as Children\'s Day?','Why is Children\'s Day celebrated as this day?'],'Simple present passive interrogative → Do/Does + subject + V1?'],
    ['Voice','Convert to active: "The championship trophy will be presented by the governor."','The governor will present the championship trophy.',['The governor presents the championship trophy.','The governor is presenting the championship trophy.','The governor has presented the championship trophy.'],'Future simple passive → active: Subject + will + V1 + object.'],
    ['Voice','Convert to active: "Will the final decision be announced by the committee tomorrow?"','Will the committee announce the final decision tomorrow?',['Does the committee announce the final decision tomorrow?','Is the committee announcing the final decision tomorrow?','Has the committee announced the final decision tomorrow?'],'Future simple passive interrogative → Will + subject + V1 + object?'],
    ['Voice','Convert to passive: "They have built a new bridge across the river."','A new bridge has been built across the river.',['A new bridge was being built across the river.','A new bridge is built across the river.','A new bridge will be built across the river.'],'Present perfect → has/have been + V3. Agent "by them" is optional.'],
    ['Voice','Convert to passive: "Had they submitted the final report by the time the director arrived?"','Had the final report been submitted by them by the time the director arrived?',['Was the final report submitted by them?','Had the final report submitted by them?','Has the final report been submitted by them?'],'Past perfect interrogative → Had + object + been + V3 + by subject?'],
    ['Voice','Convert to passive: "The new CEO has promised to give all employees a bonus."','All employees have been promised a bonus by the new CEO.',['A bonus have been promised to all employees.','All employees will be given a bonus by the new CEO.','A bonus will be promised to all employees.'],'Present perfect → have been + V3. Indirect object can become subject.'],
    ['Voice','Convert to passive: "The cat drank all the milk."','All the milk was drunk by the cat.',['All the milk is drunk by the cat.','All the milk has been drunk by the cat.','All the milk had been drunk by the cat.'],'Simple past: drank → was drunk. Keep the same tense.'],
    ['Voice','Convert to active: "His success is said to have been a result of his relentless determination."','People say that his success has been a result of his relentless determination.',['People said that his success was a result.','They are saying his success was a result.','His determination caused his success, it is said.'],'Passive reporting → Active: People say that + subject + has been + complement.'],
    ['Voice','Convert to active: "Couldn\'t the cancer be stopped from spreading further by the doctors?"','Couldn\'t the doctors stop the cancer from spreading further?',['Can\'t the doctors stop the cancer?','Won\'t the doctors stop the cancer?','Shouldn\'t the doctors stop the cancer?'],'Keep the same modal (couldn\'t) when converting passive to active.'],
    ['Voice','Convert to passive: "Someone has stolen my bicycle."','My bicycle has been stolen.',['My bicycle was stolen.','My bicycle is being stolen.','My bicycle had been stolen.'],'Present perfect → has been + V3. Agent "by someone" is usually omitted.'],
    ['Voice','Convert to active: "The road is being repaired by the workers."','The workers are repairing the road.',['The workers repair the road.','The workers have repaired the road.','The workers were repairing the road.'],'Present continuous passive → active: Subject + is/are + V-ing.'],
    ['Voice','Convert to passive: "The officer will issue the certificate."','The certificate will be issued by the officer.',['The certificate is issued by the officer.','The officer will be issued the certificate.','The certificate was issue by the officer.'],'Future passive uses will be + V3.'],
    ['Voice','Convert to passive: "The team has completed the project."','The project has been completed by the team.',['The project had completed by the team.','The team has been completed by the project.','The project is completing by the team.'],'Present perfect passive: has/have been + V3.'],
    ['Voice','Convert to active: "The window must be opened."','Someone must open the window.',['Someone opens the window.','The window is opened.','Someone should open the window.'],'Modal passive → active: Subject + modal + V1 + object.'],

    // ─── Spelling (25) ───
    ['Spelling','The novel\'s _____ narrator revealed the innermost thoughts of every character. Choose the correct spelling.','omniscient',['omnescient','omniscent','omniscenant'],'Omniscient = having infinite awareness (Latin: omnis + scientia).'],
    ['Spelling','He remained _____ even when chaos erupted around him. Choose the correct spelling.','nonchalant',['nonchaliant','norchalent','nonchalent'],'Nonchalant = calm and unconcerned.'],
    ['Spelling','Choose the correctly spelt word.','Indefinite',['Indefenite','Indefinate','Indefenate'],'Indefinite = not fixed, unmeasured, or unclear.'],
    ['Spelling','Choose the correctly spelt word.','Maintenance',['Maintainance','Maintanence','Maintainence'],'Maintenance = the process of preserving something in good condition.'],
    ['Spelling','Choose the misspelt word from: Essential, Industrial, Profesional, Sensational.','Profesional',['Essential','Industrial','Sensational'],'Correct spelling is Professional (double s).'],
    ['Spelling','Choose the misspelt word from: Predictable, Valuable, Sociable, Compatable.','Compatable',['Predictable','Valuable','Sociable'],'Correct spelling is Compatible (-ible, not -able).'],
    ['Spelling','Choose the misspelt word from: Vociferous, Amalgamation, Miscellanious, Innocuous.','Miscellanious',['Vociferous','Amalgamation','Innocuous'],'Correct spelling is Miscellaneous (-aneous, not -anious).'],
    ['Spelling','Choose the misspelt word from: Providence, Endurence, Convergence, Competence.','Endurence',['Providence','Convergence','Competence'],'Correct spelling is Endurance (-ance, not -ence).'],
    ['Spelling','Choose the misspelt word from: Indelable, Noticeable, Portable, Memorable.','Indelable',['Noticeable','Portable','Memorable'],'Correct spelling is Indelible (-ible, not -able).'],
    ['Spelling','The _____ soldier stood calm even in the battlefield chaos. Choose the correct spelling.','phlegmatic',['phlegmeatic','phlegmetic','phlegmiatic'],'Phlegmatic = having an unemotional, calm disposition.'],
    ['Spelling','The news of his sudden promotion _____ everyone. Choose the correct spelling.','flabbergasted',['flabergasted','flabberggasted','flabbergested'],'Flabbergasted = surprised greatly or astonished.'],
    ['Spelling','The _____ student refused to obey classroom rules. Choose the correct spelling.','recalcitrant',['recalcetrant','recalciterant','recalcitrent'],'Recalcitrant = obstinately uncooperative or defiant.'],
    ['Spelling','The _____ customer complained about every dish. Choose the correct spelling.','querulous',['querilous','queralous','quirulous'],'Querulous = habitually complaining or whining.'],
    ['Spelling','Choose the correctly spelt word.','Congregation',['Congrigation','Congragation','Congreagation'],'Congregation = a group of people assembled for religious worship.'],
    ['Spelling','Choose the correctly spelt word.','Malevolence',['Malevoilence','Malevalence','Malivoilence'],'Malevolence = the state of wishing harm to others.'],
    ['Spelling','Choose the misspelt word from: Ambeince, Consequence, Convergence, Excellence.','Ambeince',['Consequence','Convergence','Excellence'],'Correct spelling is Ambience (the atmosphere of a place).'],
    ['Spelling','Choose the correctly spelt word.','Confectionery',['Confictionary','Confectionry','Confectionnary'],'Confectionery = sweets, candies, or a shop selling them.'],
    ['Spelling','The professor was respected for his _____ knowledge. The spelling is:','erudite (No replacement required)',['erudiate','erudiete','eroudite'],'Erudite = having or showing great knowledge from study.'],
    ['Spelling','Choose the correctly spelt word.','accommodate',['accomodate','accommoddate','acommodate'],'Accommodate has double c and double m.'],
    ['Spelling','Choose the correctly spelt word.','questionnaire',['questionaire','questionnairre','questionnare'],'Questionnaire has double n and ends in -aire.'],
    ['Spelling','Choose the correctly spelt word.','occurrence',['occurence','ocurrence','occurrance'],'Occurrence has double c and double r.'],
    ['Spelling','Choose the correctly spelt word.','rhythm',['rythm','rhythym','rhythem'],'Rhythm has no standard vowel — r-h-y-t-h-m.'],
    ['Spelling','Choose the correctly spelt word.','embarrass',['embarass','embarras','embarrasss'],'Embarrass has double r and double s.'],
    ['Spelling','Choose the correctly spelt word.','necessary',['neccessary','necesary','necessery'],'Necessary: one c, double s.'],
    ['Spelling','Choose the correctly spelt word.','privilege',['priviledge','privelege','privlege'],'Privilege: no d, ends in -ilege.'],

    // ─── One-Word Substitution (25) ───
    ['One-Word Sub','A person who steers a ship.','Helmsman',['Boatswain','Captain','Steward'],'Helmsman = person controlling the rudder or helm of a ship.'],
    ['One-Word Sub','A building for keeping aircraft.','Hangar',['Dockyard','Garage','Terminal'],'Hangar = large enclosed structure for storing aircraft.'],
    ['One-Word Sub','One who is all powerful.','Omnipotent',['Omniscient','Omnipresent','Omnivorous'],'Omnipotent = having unlimited power (Latin: omni + potent).'],
    ['One-Word Sub','A government ruled by one person.','Autocracy',['Democracy','Aristocracy','Oligarchy'],'Autocracy = system where supreme power is held by one person.'],
    ['One-Word Sub','A person who collects or studies butterflies.','Lepidopterist',['Ornithologist','Entomologist','Biologist'],'Lepidopterist studies butterflies and moths (order Lepidoptera).'],
    ['One-Word Sub','A group of people who travel with an important person.','Entourage',['Gambit','Cohorts','Caravan'],'Entourage = group attending or surrounding an important person.'],
    ['One-Word Sub','A large, confused mass of people.','Maelstrom',['Convocation','Vicissitude','Machination'],'Maelstrom = a situation of confused, chaotic movement.'],
    ['One-Word Sub','The art of preserving an animal\'s body by stuffing.','Taxidermy',['Scrimshaw','Oshibana','Plastination'],'Taxidermy = preparing and mounting animal skins to appear lifelike.'],
    ['One-Word Sub','Revealing of crucial details of a film\'s plot.','Spoiler',['Teaser','Climax','Twister'],'Spoiler = information that reduces surprise for first-time viewers.'],
    ['One-Word Sub','A person who pretends to have more knowledge than they possess.','Quack',['Cynic','Sage','Mentor'],'Quack = one who dishonestly claims special knowledge, especially in medicine.'],
    ['One-Word Sub','A person who is talkative.','Garrulous',['Silent','Reticent','Introvert'],'Garrulous = excessively talkative, especially on trivial matters.'],
    ['One-Word Sub','A person who can foresee future events.','Seer',['Oxymoron','Cinephile','Pitcher'],'Seer = a person who foresees or predicts future events; a prophet.'],
    ['One-Word Sub','A person who eats human flesh.','Cannibal',['Herbivore','Carnivore','Omnivore'],'Cannibal = a person who eats the flesh of other human beings.'],
    ['One-Word Sub','Words inscribed on a tomb.','Epitaph',['Epilogue','Epigraph','Eulogy'],'Epitaph = inscription on a tombstone in memory of the deceased.'],
    ['One-Word Sub','One who walks in sleep.','Somnambulist',['Insomniac','Narcoleptic','Somnolent'],'Somnambulist = a person who walks while asleep (Latin: somnus + ambulare).'],
    ['One-Word Sub','A place where dead bodies are kept for identification.','Morgue',['Cemetery','Crematorium','Mausoleum'],'Morgue = a place where bodies are kept, especially for identification.'],
    ['One-Word Sub','One who is indifferent to pleasure or pain.','Stoic',['Hedonist','Epicurean','Ascetic'],'Stoic = a person who endures hardship without showing feelings.'],
    ['One-Word Sub','Killing of a king.','Regicide',['Fratricide','Homicide','Genocide'],'Regicide = the killing of a king (Latin: rex + caedere).'],
    ['One-Word Sub','A person who lives in seclusion for religious reasons.','Hermit',['Nomad','Pilgrim','Missionary'],'Hermit = one who lives alone, often for religious contemplation.'],
    ['One-Word Sub','Study of the origin and history of words.','Etymology',['Entomology','Zoology','Philology'],'Etymology = the study of the origin of words and their historical development.'],
    ['One-Word Sub','A speech delivered without preparation.','Extempore',['Soliloquy','Monologue','Eulogy'],'Extempore = spoken or done without preparation; impromptu.'],
    ['One-Word Sub','One who does not believe in the existence of God.','Atheist',['Agnostic','Theist','Deist'],'Atheist = a person who disbelieves in the existence of God.'],
    ['One-Word Sub','A list of books available in a library.','Catalogue',['Bibliography','Index','Glossary'],'Catalogue = a complete list of items, typically arranged systematically.'],
    ['One-Word Sub','A remedy for all diseases.','Panacea',['Placebo','Antidote','Vaccine'],'Panacea = a solution or remedy for all difficulties or diseases.'],
    ['One-Word Sub','One who can speak two languages fluently.','Bilingual',['Polyglot','Linguist','Multilingual'],'Bilingual = able to speak two languages fluently.'],

    // ─── Prepositions & Fill-in-the-Blank (20) ───
    ['Prepositions','White clothes are preferable ________ black ones during summer.','to',['of','for','from'],'Preferable is always followed by "to", not "than" or "from".'],
    ['Prepositions','She is proficient _____ several programming languages.','in',['at','on','with'],'Proficient takes "in" when referring to skill in a subject or activity.'],
    ['Prepositions','Mr. Sinha was excited to preside ____ the meeting.','over',['under','beneath','below'],'Preside is followed by "over" when leading a meeting or ceremony.'],
    ['Prepositions','I do not agree with your suggestion ________ your knowledge.','despite',['to','for','since'],'Despite means "without being affected by" — expresses contrast.'],
    ['Prepositions','The security guards prevented the people ______ entering the hall.','from',['against','out','about'],'Prevent takes "from" — prevent someone from doing something.'],
    ['Prepositions','Raghav is deaf ________ the left ear.','in',['on','for','at'],'Deaf takes "in" when referring to the specific ear affected.'],
    ['Prepositions','My friend has always been indifferent ____ my problems.','to',['on','for','into'],'Indifferent takes the fixed preposition "to".'],
    ['Prepositions','She is good ___ mathematics.','at',['in','on','for'],'Use "good at" for a skill or subject.'],
    ['Prepositions','The train arrived ___ the station on time.','at',['in','to','by'],'Use "arrive at" for a specific place.'],
    ['Prepositions','He has lived here ___ 2021.','since',['for','from','by'],'Use "since" with a starting point in time.'],
    ['Prepositions','They have been waiting ___ two hours.','for',['since','from','during'],'Use "for" with a duration of time.'],
    ['Prepositions','She prefers tea ___ coffee.','to',['than','over than','from'],'The standard construction is "prefer X to Y".'],
    ['Prepositions','We congratulated him ___ his success.','on',['for','at','with'],'Use "congratulate someone on" an achievement.'],
    ['Prepositions','He is senior ___ me in the department.','to',['than','from','over'],'Use "senior to", not "senior than".'],
    ['Prepositions','Please refrain ___ using your phone in the laboratory.','from',['to','of','with'],'The verb "refrain" takes "from".'],
    ['Prepositions','The child was accused ___ breaking the window.','of',['for','with','by'],'The verb "accuse" takes "of".'],
    ['Prepositions','The problem appeared ________ computer malfunction.','due to',['in spite of','in accordance with','together with'],'Due to = caused by / because of.'],
    ['Prepositions','The office is closed ___ Sundays.','on',['at','in','by'],'Use "on" with days of the week.'],
    ['Prepositions','The book was written ___ Ruskin Bond.','by',['with','from','of'],'Use "by" to name the agent in a passive sentence.'],
    ['Prepositions','She is responsible ___ checking the final figures.','for',['to','of','with'],'The adjective "responsible" takes "for".'],

    // ─── Error Detection (20) ───
    ['Error Detection','Find the error: "However, on the evening, he returned with one foot limping because his heel was wounded."','Part A: "on the evening" should be "in the evening"',['Part B: "he returned with"','Part C: "one foot limping because"','Part D: "his heel was wounded"'],'Use "in" for parts of the day (in the morning/evening). "On" is for specific dates.'],
    ['Error Detection','Find the error: "The committee has submitted their report to the board for review."','Part B: "their" should be "its"',['Part A: "The committee"','Part C: "to the board"','Part D: "for review"'],'When a collective noun acts as one unit, use singular pronoun "its".'],
    ['Error Detection','Find the error: "Our bicycles are fully equipped, with head and tail lights, gear shifts, a bell, and even a air pump."','Part D: "a air pump" should be "an air pump"',['Part A: "Our bicycles are fully"','Part B: "equipped, with head and"','Part C: "tail lights, gear shifts, a bell"'],'Use "an" before words beginning with a vowel sound.'],
    ['Error Detection','Find the error: "In their study, they tried to find out the relationship among an organism, its habitat, and the predators."','Part C: "among" should be "between"',['Part A: "In their study"','Part B: "find out the relationship"','Part D: "and the predators present there"'],'Use "between" for distinct named items, even if more than two.'],
    ['Error Detection','Find the error: "Let\'s move all the books kept on this shelf on the upper one."','Part B: "on the upper one" should be "to the upper shelf"',['Part A: "Let\'s move all the books"','Part C: "make space for the new books"','Part D: "purchased from the market today"'],'With "move", use "to" for destination. Repeating the noun avoids ambiguity.'],
    ['Error Detection','Find the error: "If you are looking for a free parking space, you might drive on for hours."','Part C: "drive on" should be "drive around"',['Part A: "If you are looking for"','Part B: "a free parking space"','Part D: "until you find one"'],'Drive around = search; drive on = continue forward. Context requires searching.'],
    ['Error Detection','Find the error: "Each of the applicants have submitted the form."','have should be has',['Each of','the applicants','submitted the form'],'Each is singular — takes "has", not "have".'],
    ['Error Detection','Find the error: "The news are encouraging."','are should be is',['The news','encouraging','No error'],'News is grammatically singular — takes "is".'],
    ['Error Detection','Find the error: "One of my friends live in Jaipur."','live should be lives',['One of','my friends','in Jaipur'],'Subject is "one" (singular) — takes "lives".'],
    ['Error Detection','Find the error: "The furniture were delivered yesterday."','were should be was',['The furniture','delivered','yesterday'],'Furniture is an uncountable singular noun — takes "was".'],
    ['Error Detection','Find the error: "She is one of the employees who has received an award."','has should be have',['She is one of','the employees','received an award'],'Who refers to plural "employees" — takes "have".'],
    ['Error Detection','Find the error: "The principal, along with the teachers, are attending the event."','are should be is',['The principal','along with the teachers','attending the event'],'Main subject is "principal" (singular). Phrases with "along with" do not change it.'],
    ['Error Detection','Find the error: "He is more senior than me."','than should be to',['He is','more senior','me'],'Senior/junior/superior/inferior take "to", not "than".'],
    ['Error Detection','Find the error: "I have been living here since five years."','since should be for',['I have been','living here','five years'],'Use "for" with a duration; "since" with a point in time.'],
    ['Error Detection','Find the error: "Neither of the proposals are acceptable."','are should be is',['Neither of','the proposals','acceptable'],'Neither is treated as singular — takes "is".'],
    ['Error Detection','Find the error: "Every boy and every girl were given an identity card."','were should be was',['Every boy','and every girl','given an identity card'],'When "every" precedes each coordinated noun, use singular verb.'],
    ['Error Detection','Find the error: "The athlete runs more fast than his competitors."','more fast should be faster',['The athlete','runs','than his competitors'],'One-syllable adjectives take -er (faster), not "more + adjective".'],
    ['Error Detection','Find the error: "He came to the party uninvited and behaved rudly."','rudly should be rudely',['He came to','the party uninvited','and behaved'],'Adverb of "rude" is "rudely" — add -ly after removing -e and adding -ely.'],
    ['Error Detection','Find the error: "Despite of the rain, they continued the match."','Despite of should be Despite',['the rain','they continued','the match'],'Despite is never followed by "of". Use "in spite of" or "despite".'],
    ['Error Detection','Find the error: "He is taller than any student in the class."','any student should be any other student',['He is taller','than','in the class'],'Comparative + than any other (to exclude the subject from the group).'],

    // ─── Direct & Indirect Speech (15) ───
    ['Speech','Convert to indirect: The manager said, "Will you attend the birthday party of my daughter?"','The manager asked whether they would attend the birthday party of his daughter.',['The manager requested if they shall attend.','The manager asked whether they would attended.','The manager requested whether they would have attended.'],'Yes-no questions use "whether/if" in indirect speech. Will → would, my → his.'],
    ['Speech','Convert to direct: The student asked the librarian how he could find a book on medieval history.','The student asked, "How can I find a book on medieval history?"',['The student said, "How can he find a book?"','The student said, "How could he find a book?"','The student asked, "How could I find a book?"'],'In direct speech: he → I, could → can, restore the question form.'],
    ['Speech','Convert to direct: He said that he had finished his work.','He said, "I have finished my work."',['He said, "I have finished his work."','He said, "He has finished my work."','He said, "He had finished his work."'],'he → I, his → my, had finished → have finished (restore tense).'],
    ['Speech','Convert to direct: The journalist noted that the celebrity was having a busy schedule that week.','The journalist noted, "The celebrity is having a very busy schedule this week."',['The journalist said, "The celebrity was having a busy schedule."','The journalist noted, "The celebrity has a busy schedule that week."','The journalist said, "The celebrity had a busy schedule this week."'],'Was having → is having, that week → this week in direct speech.'],
    ['Speech','Convert to indirect: She said, "I am reading a novel."','She said that she was reading a novel.',['She said that she is reading a novel.','She said that she has been reading a novel.','She said that I was reading a novel.'],'I → she, am reading → was reading (backshift tense).'],
    ['Speech','Convert to indirect: He said, "I will help you tomorrow."','He said that he would help me the next day.',['He said that he will help me tomorrow.','He said that he would help you tomorrow.','He said that I would help him the next day.'],'Will → would, you → me, tomorrow → the next day.'],
    ['Speech','Convert to indirect: The teacher said, "Do not make noise in the class."','The teacher told the students not to make noise in the class.',['The teacher said not to make noise.','The teacher ordered that they should not make noise.','The teacher told that do not make noise.'],'Imperative negative: told + not to + V1.'],
    ['Speech','Convert to indirect: She said, "What a beautiful sunset!"','She exclaimed that it was a very beautiful sunset.',['She said that what a beautiful sunset.','She exclaimed that it is a beautiful sunset.','She said what a beautiful sunset it was.'],'Exclamatory → She exclaimed that + statement form.'],
    ['Speech','Convert to direct: He asked me where I lived.','He asked me, "Where do you live?"',['He asked me, "Where did you live?"','He said, "Where I lived?"','He asked me, "Where you live?"'],'Lived → live, I → you (restore original perspective).'],
    ['Speech','Convert to indirect: "Please close the door," she said.','She requested me to close the door.',['She said that please close the door.','She told that the door be closed.','She requested that I close the door please.'],'Polite request → requested + to + V1.'],
    ['Speech','Convert to indirect: He said, "I have completed the assignment."','He said that he had completed the assignment.',['He said that he has completed the assignment.','He said that I had completed the assignment.','He said that he completed the assignment.'],'Have completed → had completed (backshift). I → he.'],
    ['Speech','Convert to direct: She told me that she had been waiting for an hour.','She said to me, "I have been waiting for an hour."',['She said, "She had been waiting for an hour."','She told me, "I had been waiting for an hour."','She said, "She has been waiting for an hour."'],'Had been waiting → have been waiting, she → I.'],
    ['Speech','Convert to indirect: "Can you lend me your pen?" he asked.','He asked me if I could lend him my pen.',['He asked me if I can lend him my pen.','He asked that could I lend him my pen.','He asked me whether I could lend him your pen.'],'Can → could, you → I, your → my, me → him.'],
    ['Speech','Convert to direct: Mother told me not to go out in the rain.','Mother said to me, "Do not go out in the rain."',['Mother said, "Not to go out in the rain."','Mother told, "Don\'t go out in the rain."','Mother said to me, "You should not go out."'],'Told + not to → "Do not + V1" in direct speech.'],
    ['Speech','Convert to indirect: The captain said, "We shall fight to the last."','The captain declared that they would fight to the last.',['The captain said that we shall fight to the last.','The captain declared they should fight to the last.','The captain said that they shall fight.'],'Shall → would, we → they. Declared is appropriate for a strong statement.'],

    // ─── Sentence Improvement & Grammar (20) ───
    ['Grammar','Improve: "The committee concluded that the measures were conducive in bring stability in the financial system."','conducive to bringing stability to',['conducive of bringing stability in','conducive for bringing stability into','No improvement required'],'Conducive takes "to" + gerund. Stability takes "to" in this structure.'],
    ['Grammar','Is the sentence correct? "Please submit your assignments by Friday."','No substitution needed',['till Friday','until Friday','at Friday'],'By = deadline (not later than). This is correct usage.'],
    ['Grammar','Improve: "The new policy was believing to have reduced corruption."','was believed to have reduced',['is believed to reduce','is being believed to reduce','No improvement required'],'Passive reporting: was believed + perfect infinitive (to have reduced).'],
    ['Grammar','Improve: "My sister is very good at children."','Good with children',['Good for children','Good in children','No substitution'],'Good at = skills/activities. Good with = handling people/things.'],
    ['Grammar','Improve: "I am angry at you for losing my book."','angry with you',['angry on you','angry about you','No substitution'],'Angry with + person. Angry at/about + situation/thing.'],
    ['Grammar','Improve: "She enjoys hiking, swimming, and to ride her bike."','and riding her bike',['and ride her bike','and to ride her bike around','No improvement required'],'Parallel structure: hiking, swimming, riding (all gerunds).'],
    ['Grammar','Improve: "The old man tried for vain to make amends."','tried in vain to make amends',['tried at vain to do amends','tried on vain to fix amends','No improvement required'],'Fixed idiom: "in vain" (not for/at/on vain). Collocation: "make amends".'],
    ['Grammar','Improve: "The man was effected by the remarks made by his peers."','affected by',['affected with','effected with','effected to'],'Affect = influence (verb). Effect = result (usually noun). Affected by = influenced by.'],
    ['Grammar','Which is correct? "He did nothing but complain."','He did nothing but complain.',['He did nothing but to complain.','He did nothing but complained.','He does nothing than complain.'],'After "did nothing but", use the base form of the verb.'],
    ['Grammar','Choose the correct word: "The school will ______ the new rules from next Monday."','adopt',['adept','addict','adapt'],'Adopt = take up or follow. Adept = skilled. Adapt = adjust.'],
    ['Grammar','Choose the correct word: "The soldiers stood firm and did not ______ in the face of danger."','quail',['quill','quell','quilt'],'Quail = feel/show fear. Quill = feather. Quell = suppress. Quilt = blanket.'],
    ['Grammar','Fill in: "You can take the early train, _____ you\'ll have to wait for the afternoon one."','otherwise',['and','unless','although'],'Otherwise = if not / or else. It shows consequence of not taking the action.'],
    ['Grammar','Which sentence uses "bank" the same way as "The river overflowed its bank"?','They enjoyed a picnic on the grassy bank of the stream.',['The teller at the bank smiled.','He used a shovel to bank the soil.','The airplane began to bank to the left.'],'Bank = rising ground bordering a river. Same meaning in the stream context.'],
    ['Grammar','Choose the correct option: "Hardly had the bell rung ___ the students left."','when',['than','then','while'],'Paired construction: hardly...when. (No sooner...than.)'],
    ['Grammar','Choose the correct option: "No sooner had the meeting begun ___ the lights went out."','than',['when','then','while'],'Paired construction: no sooner...than.'],
    ['Grammar','Choose the correct option: "If I ___ the answer, I would tell you."','knew',['know','will know','have known'],'Unreal present conditional: If + past tense in the if-clause.'],
    ['Grammar','Choose the correct option: "By next June, she ___ here for five years."','will have worked',['will work','has worked','worked'],'Future perfect marks duration completed by a future point.'],
    ['Grammar','Choose the correct form: "Neither the clerk nor the assistants ___ available."','were',['was','is','has been'],'Neither/nor: verb agrees with the nearer subject "assistants" (plural).'],
    ['Grammar','Rearrange: P. She used her trowel to loosen the dirt. Q. She made a hole and lowered a seed. S. The ground was saturated by water. R. She would watch for the first sprout.','P, Q, S, R',['R, Q, S, P','Q, P, S, R','S, Q, P, R'],'Logical sequence: loosen dirt → plant seed → water → watch for sprout.'],
    ['Grammar','Which errors exist in: "It is impossible to count people who are given, and continue to give, their lives in the fight for injustice."','Parts A and D: "are given" → "have given" and "fight for" → "fight against"',['Parts B and D','Parts A and C','Parts A and B'],'People give (not are given) their lives. Fight against injustice, not for it.'],

    // ─── Reading Comprehension / Cloze (20) ───
    ['Cloze Test','Passage about climate displacement: "Governments respond with (1) ____, issuing statements of concern without tangible measures."','platitude',['alacrity','eloquence','apathy'],'Platitude = a dull, overused remark. Fits the criticism of hollow statements.'],
    ['Cloze Test','Same passage: "Many communities find themselves in a (2) ____ position — unable to return home, yet unwelcome elsewhere."','precarious',['audacious','opulent','tenacious'],'Precarious = insecure, uncertain, unsafe. Fits the helpless refugee condition.'],
    ['Cloze Test','Same passage: "Developed nations continue to (3) ____ carbon emissions under the guise of economic necessity."','perpetuate',['curtail','mitigate','exacerbate'],'Perpetuate = cause to continue indefinitely. Fits "continue emissions".'],
    ['Cloze Test','Same passage: "Global leaders must act with (4) ____, crafting enforceable policies."','sagacity',['avarice','impunity','complacency'],'Sagacity = wisdom, foresight, sound judgment.'],
    ['Cloze Test','Same passage: "Anything less would be an (5) ____ of moral responsibility."','abdication',['redemption','proclamation','deviation'],'Abdication = renunciation of responsibility. Fits "giving up moral duty".'],
    ['Cloze Test','Passage about ripening: "Many fruits change (1) ____ as they ripen."','colour',['clothes','size','shape'],'The passage continues "change from green to red" — clearly about colour.'],
    ['Cloze Test','Same passage: "You can tell if a fruit is (2) ____ to be harvested."','ready',['steady','trepid','sober'],'Ready = prepared for use. Fits the harvesting context.'],
    ['Cloze Test','Same passage: "A factory that (3) ____ strawberries into plastic containers."','packs',['halts','tapes','breaks'],'Packs = puts items into containers for transport.'],
    ['Cloze Test','Same passage: "Containers to be (4) ____ to grocery stores across the country."','shipped off',['suited to','managed of','accounted to'],'Shipped off = sent/transported to a destination.'],
    ['Cloze Test','Same passage: "A machine that automatically (5) ____ any green strawberries."','rejects',['sustains','detains','proceeds'],'Rejects = filters out items that don\'t meet standards.'],
    ['Reading Comp','First wave of feminism focused on:','Political equality and voting rights',['Workplace equality','Intersectionality','Challenging gender roles'],'The first wave (late 19th-early 20th century) focused on women\'s suffrage.'],
    ['Reading Comp','Second wave of feminism addressed:','Workplace equality, reproductive rights, and sexual autonomy',['Intersectionality','Voting rights','Changing political systems'],'The second wave (1960s-70s) broadened to workplace and reproductive issues.'],
    ['Reading Comp','How did feminism shift across its three waves?','From legal matters to cultural, social, and identity-related matters',['Kept a single focus on suffrage','Limited its range over time','Exclusively concerned with economics'],'Feminism expanded from political rights to systemic identity structures.'],
    ['Reading Comp','Which sums up feminism\'s three-wave evolution?','Greater emphasis on intersectionality and varied voices',['Only about suffrage','Only about property rights','Only about workplace advancement'],'Feminism progressively became more diverse and inclusive.'],
    ['Reading Comp','Betty Friedan is correctly matched with:','Challenged gender roles during the second wave',['Advocated intersectionality in the third wave','Focused on voting rights in the first wave','Administrative space advocacy'],'Betty Friedan questioned traditional gender roles in the second wave.'],
    ['Reading Comp','In a passage about an unkempt garden: S1 describes the garden. Which sentence follows about willows from the Loire?','C: willows that spring from the Loire',['A: weeds adorning the shore','B: wall fruit grows like hedges','D: fruit trees neglected for ten years'],'C mentions "Loire" (the river from S1) and "willows" growing rapidly.'],
    ['Reading Comp','In a passage about Greeks arriving for war: What follows S1 (Greeks armed for war)?','D: They came because a prince of Troy did a grievous wrong',['A: cry for vengeance','B: He had stolen Helen','C: They came in a thousand ships'],'D gives the reason for their arrival, directly answering "why they came".'],
    ['Reading Comp','In a passage: S1 introduces another guest who interested the narrator. What comes first?','C: But he was of quite a different order',['A: He was a personage','D: They called him Julian Mastakovich','B: At first glance one could tell'],'C provides contrast to previous guests, then A identifies him as important.'],
    ['Reading Comp','In a passage about Sofia: After S1 (Sofia listening to departing carriage), what follows?','B: She was left alone, as she had always wished',['A: As a child she had cried alone','D: her face wore an expression of sorrow','C: consciousness of grief came over her'],'B continues directly from the departure — she was left alone.'],
    ['Reading Comp','In a passage about a hot August day: After S1, which sentence follows?','C: Baker Street was like an oven',['D: hard to believe these were the same walls','B: blinds were half drawn','A: my term of service in India'],'C adds specific heat details to the blazing hot day introduced in S1.'],
  ];

  /* ── build 10 sectional tests × 25 questions ── */
  const QUESTION_COUNT = 25;
  const MOCK_COUNT = 10;

  function buildTest(testNum) {
    const start = (testNum - 1) * QUESTION_COUNT;
    const questions = [];
    for (let i = 0; i < QUESTION_COUNT; i++) {
      const idx = start + i;
      const fact = engFacts[idx];
      const seed = hash(`sect-eng-${testNum}:${i}`);
      questions.push(
        question(
          `sect-eng-${testNum}-q${i + 1}`,
          fact[0],
          fact[1],
          fact[2],
          fact[3],
          fact[4],
          'Identify the grammar rule, keyword, or pattern; eliminate options that change tense, structure, or meaning.',
          seed
        )
      );
    }
    return { id: `sect-eng-${String(testNum).padStart(2, '0')}`, title: `English Test ${String(testNum).padStart(2, '0')}`, questions };
  }

  const tests = Array.from({ length: MOCK_COUNT }, (_, i) => buildTest(i + 1));

  /* ── deduplicate option orderings ── */
  const usedForms = new Set();
  for (const test of tests) {
    for (const q of test.questions) {
      const correctOpt = q.options[q.answer];
      const candidates = [];
      function permute(arr, s = 0) {
        if (s === arr.length) { candidates.push(arr.slice()); return; }
        for (let i = s; i < arr.length; i++) { [arr[s], arr[i]] = [arr[i], arr[s]]; permute(arr, s + 1); [arr[s], arr[i]] = [arr[i], arr[s]]; }
      }
      permute(q.options.slice());
      const ordered = shuffle(candidates, hash(q.id));
      const unique = ordered.find(o => !usedForms.has(`${q.question}|${o.join('|')}`));
      if (unique) { q.options = unique; q.answer = unique.indexOf(correctOpt); }
      usedForms.add(`${q.question}|${q.options.join('|')}`);
    }
  }

  root.SSC_CHSL_SECTIONAL_ENG_DATA = {
    exam: { name: 'SSC CHSL — English Language', totalQuestions: 25, totalMarks: 50, totalMinutes: 15, correctMarks: 2, incorrectPenalty: 0.5 },
    tests,
    questionTotal: tests.reduce((s, t) => s + t.questions.length, 0)
  };
})(globalThis);
