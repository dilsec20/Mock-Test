/* SSC CHSL Tier-I — GS & Current Affairs Sectional Tests (10 × 25 = 250 questions) */
(function (root) {
  'use strict';

  /* ── helpers (same as full-mock data) ── */
  function hash(v) {
    let r = 2166136261;
    for (let i = 0; i < v.length; i++) { r ^= v.charCodeAt(i); r = Math.imul(r, 16777619); }
    return r >>> 0;
  }
  function shuffle(a, seed) {
    const r = a.slice(); let s = seed >>> 0;
    for (let i = r.length - 1; i > 0; i--) { s = (Math.imul(s, 1664525) + 1013904223) >>> 0; const j = s % (i + 1); [r[i], r[j]] = [r[j], r[i]]; }
    return r;
  }
  function question(id, topic, prompt, correct, distractors, explanation, shortcut, seed) {
    const c = [];
    for (const ch of [String(correct), ...distractors.map(String)]) { if (!c.includes(ch) && c.length < 4) c.push(ch); }
    let fb = 1; while (c.length < 4) { const x = `None of these (${fb++})`; if (!c.includes(x)) c.push(x); }
    const opts = shuffle(c, seed);
    return { id, topic, question: prompt, options: opts, answer: opts.indexOf(String(correct)), explanation, shortcut };
  }

  /* ── 250 GS facts: [topic, question, correct, [d1,d2,d3], explanation] ── */
  const gsFacts = [
    // ─── Indian History (40) ───
    ['Indian History','Who founded the Indian National Congress in 1885?','A. O. Hume',['Mahatma Gandhi','Dadabhai Naoroji','Bal Gangadhar Tilak'],'A. O. Hume played the leading role in founding the INC in 1885.'],
    ['Indian History','Who founded the Maurya Empire?','Chandragupta Maurya',['Ashoka','Bindusara','Harshavardhana'],'Chandragupta Maurya established the Maurya Empire with Chanakya\'s guidance.'],
    ['Indian History','The Kalinga War is associated with which ruler?','Ashoka',['Chandragupta II','Samudragupta','Kanishka'],'Ashoka\'s remorse after the Kalinga War influenced his policy of Dhamma.'],
    ['Indian History','Who wrote the Arthashastra?','Kautilya (Chanakya)',['Kalidasa','Banabhatta','Panini'],'The Arthashastra is attributed to Kautilya, also known as Chanakya.'],
    ['Indian History','Who founded the Mughal Empire in India?','Babur',['Akbar','Humayun','Sher Shah Suri'],'Babur founded Mughal rule after the First Battle of Panipat in 1526.'],
    ['Indian History','The First Battle of Panipat was fought in which year?','1526',['1556','1761','1498'],'The First Battle of Panipat in 1526 established Babur\'s rule in northern India.'],
    ['Indian History','Who introduced the Permanent Settlement in Bengal?','Lord Cornwallis',['Warren Hastings','Lord Wellesley','Lord Dalhousie'],'Cornwallis introduced the Permanent Settlement in 1793.'],
    ['Indian History','The Non-Cooperation Movement began in which year?','1920',['1919','1930','1942'],'Gandhi launched the Non-Cooperation Movement in 1920.'],
    ['Indian History','Who gave the slogan "Do or Die" during the freedom movement?','Mahatma Gandhi',['Subhas Chandra Bose','Bal Gangadhar Tilak','Jawaharlal Nehru'],'Gandhi gave the "Do or Die" call during the Quit India Movement in 1942.'],
    ['Indian History','The Dandi March was associated with which movement?','Civil Disobedience Movement',['Swadeshi Movement','Khilafat Movement','Quit India Movement'],'The 1930 Dandi March protested the British salt tax and launched the Civil Disobedience Movement.'],
    ['Indian History','Which material was most widely used for making Harappan seals?','Steatite',['Terracotta','Ivory','Bronze'],'Steatite (soapstone) was the most common material for Indus Valley seals.'],
    ['Indian History','The Battle of Plassey was fought in which year?','1757',['1764','1857','1600'],'The Battle of Plassey in 1757 established British rule in Bengal.'],
    ['Indian History','Who was the last Mughal Emperor?','Bahadur Shah Zafar',['Aurangzeb','Shah Alam II','Muhammad Shah'],'Bahadur Shah Zafar was the last Mughal Emperor, deposed after 1857.'],
    ['Indian History','Who founded the Arya Samaj?','Swami Dayananda Saraswati',['Swami Vivekananda','Raja Ram Mohan Roy','Ishwar Chandra Vidyasagar'],'Swami Dayananda Saraswati founded the Arya Samaj in 1875.'],
    ['Indian History','The Quit India Movement was launched in which year?','1942',['1930','1920','1947'],'The Quit India Movement was launched on 8 August 1942.'],
    ['Indian History','Who was known as the "Iron Man of India"?','Sardar Vallabhbhai Patel',['Jawaharlal Nehru','Subhas Chandra Bose','Bhagat Singh'],'Sardar Patel unified princely states and is known as the Iron Man of India.'],
    ['Indian History','The Jallianwala Bagh massacre took place in which year?','1919',['1920','1921','1930'],'The Jallianwala Bagh massacre occurred on 13 April 1919 at Amritsar.'],
    ['Indian History','Who started the Bhakti Movement in South India?','Ramanuja',['Kabir','Guru Nanak','Shankaracharya'],'Ramanuja promoted Vishishtadvaita and was a key figure in the Bhakti Movement in the south.'],
    ['Indian History','The Second Battle of Panipat was fought in which year?','1556',['1526','1761','1600'],'The Second Battle of Panipat in 1556 was between Hemu and Akbar\'s forces.'],
    ['Indian History','Who was the founder of the Slave Dynasty?','Qutbuddin Aibak',['Iltutmish','Razia Sultan','Balban'],'Qutbuddin Aibak founded the Slave (Mamluk) Dynasty in 1206.'],
    ['Indian History','The Rowlatt Act was passed in which year?','1919',['1920','1909','1935'],'The Rowlatt Act of 1919 gave British authorities power to imprison without trial.'],
    ['Indian History','Who composed the famous text "Ain-i-Akbari"?','Abul Fazl',['Birbal','Todar Mal','Faizi'],'Abul Fazl wrote Ain-i-Akbari, documenting Akbar\'s administration.'],
    ['Indian History','Who established the Khalsa Panth?','Guru Gobind Singh',['Guru Nanak','Guru Tegh Bahadur','Guru Arjan Dev'],'Guru Gobind Singh established the Khalsa in 1699.'],
    ['Indian History','The Doctrine of Lapse was introduced by which Governor General?','Lord Dalhousie',['Lord Wellesley','Lord Cornwallis','Lord Hastings'],'Lord Dalhousie introduced the Doctrine of Lapse to annex princely states.'],
    ['Indian History','Who presided over the first session of the Indian National Congress?','W. C. Bonnerjee',['A. O. Hume','Dadabhai Naoroji','Surendranath Banerjee'],'W. C. Bonnerjee presided over the first session of INC in 1885 at Bombay.'],
    ['Indian History','In which year was the Bengal Partition annulled?','1911',['1905','1909','1919'],'The Bengal Partition of 1905 was annulled in 1911 due to widespread agitation.'],
    ['Indian History','Who was the Viceroy of India at the time of the Quit India Movement?','Lord Linlithgow',['Lord Mountbatten','Lord Wavell','Lord Irwin'],'Lord Linlithgow was the Viceroy during the Quit India Movement (1942).'],
    ['Indian History','The Simon Commission visited India in which year?','1928',['1919','1930','1935'],'The Simon Commission arrived in India in 1928 and was boycotted widely.'],
    ['Indian History','Who gave the title "Mahatma" to Mohandas Karamchand Gandhi?','Rabindranath Tagore',['Jawaharlal Nehru','Subhas Chandra Bose','Gopal Krishna Gokhale'],'Rabindranath Tagore is traditionally credited with giving the title Mahatma to Gandhi.'],
    ['Indian History','The Lucknow Pact (1916) was an agreement between which two bodies?','Congress and Muslim League',['Congress and Hindu Mahasabha','Muslim League and British','Congress and British'],'The Lucknow Pact (1916) was between the Congress and Muslim League for joint political reforms.'],
    ['Indian History','Which Gupta ruler is known as the "Indian Napoleon"?','Samudragupta',['Chandragupta I','Chandragupta II','Kumaragupta'],'Samudragupta is called the Indian Napoleon for his military conquests.'],
    ['Indian History','The Third Battle of Panipat was fought in which year?','1761',['1556','1526','1764'],'The Third Battle of Panipat (1761) was between the Marathas and Ahmad Shah Abdali.'],
    ['Indian History','Who founded the Brahmo Samaj?','Raja Ram Mohan Roy',['Swami Dayananda Saraswati','Ishwar Chandra Vidyasagar','Keshub Chandra Sen'],'Raja Ram Mohan Roy founded the Brahmo Samaj in 1828.'],
    ['Indian History','The Vernacular Press Act was enacted in which year?','1878',['1857','1882','1905'],'The Vernacular Press Act of 1878 was enacted by Lord Lytton to control Indian language press.'],
    ['Indian History','Who was the first woman ruler of Delhi Sultanate?','Razia Sultan',['Nur Jahan','Chand Bibi','Durgavati'],'Razia Sultan was the first and only woman ruler of the Delhi Sultanate (1236-1240).'],
    ['Indian History','The Indian Councils Act of 1909 is also known as?','Morley-Minto Reforms',['Montagu-Chelmsford Reforms','Regulating Act','Government of India Act'],'The Indian Councils Act 1909 introduced separate electorates and is known as Morley-Minto Reforms.'],
    ['Indian History','Who led the Peasant Movement in Champaran?','Mahatma Gandhi',['Jawaharlal Nehru','Sardar Patel','Rajendra Prasad'],'Gandhi led the Champaran Satyagraha in 1917 against the indigo cultivation system.'],
    ['Indian History','Who composed "Vande Mataram"?','Bankim Chandra Chattopadhyay',['Rabindranath Tagore','Surendranath Banerjee','Aurobindo Ghosh'],'Bankim Chandra Chattopadhyay composed Vande Mataram in his novel Anandamath.'],
    ['Indian History','The capital of the Vijayanagara Empire was?','Hampi',['Warangal','Golconda','Bijapur'],'Hampi (Vijayanagara) was the capital of the Vijayanagara Empire.'],
    ['Indian History','Who introduced the "Subsidiary Alliance" system?','Lord Wellesley',['Lord Cornwallis','Lord Dalhousie','Warren Hastings'],'Lord Wellesley introduced the Subsidiary Alliance system to control Indian states.'],

    // ─── Indian Polity (35) ───
    ['Indian Polity','Which Article guarantees equality before law?','Article 14',['Article 19','Article 21','Article 32'],'Article 14 guarantees equality before the law and equal protection of laws.'],
    ['Indian Polity','Which Article abolishes untouchability?','Article 17',['Article 15','Article 18','Article 23'],'Article 17 abolishes untouchability and forbids its practice.'],
    ['Indian Polity','Which Article protects life and personal liberty?','Article 21',['Article 14','Article 20','Article 25'],'Article 21 protects life and personal liberty except by procedure established by law.'],
    ['Indian Polity','Which Article provides the right to constitutional remedies?','Article 32',['Article 22','Article 40','Article 51A'],'Article 32 allows individuals to approach the Supreme Court for Fundamental Rights enforcement.'],
    ['Indian Polity','Fundamental Duties are listed in which part?','Part IVA',['Part II','Part III','Part V'],'Fundamental Duties appear in Part IVA, Article 51A.'],
    ['Indian Polity','Who is the constitutional head of the Union executive?','The President of India',['The Prime Minister','The Chief Justice','The Speaker'],'The President is the constitutional head; executive action is through the Council of Ministers.'],
    ['Indian Polity','A Money Bill can be introduced only in which House?','Lok Sabha',['Rajya Sabha','Either House','A joint sitting only'],'A Money Bill can only be introduced in Lok Sabha on the President\'s recommendation.'],
    ['Indian Polity','Who presides over a joint sitting of Parliament?','The Speaker of the Lok Sabha',['The President','The Vice-President','The Prime Minister'],'The Lok Sabha Speaker presides over a joint sitting.'],
    ['Indian Polity','Which body conducts elections to Parliament?','Election Commission of India',['Finance Commission','UPSC','NITI Aayog'],'Article 324 vests superintendence and control of elections in the Election Commission.'],
    ['Indian Polity','Directive Principles are in which part of the Constitution?','Part IV',['Part III','Part IVA','Part VI'],'Directive Principles are in Part IV, Articles 36–51.'],
    ['Indian Polity','The Preamble primarily serves as which of the following?','A guiding principle for interpretation',['A financial guideline','A schedule to the Constitution','An enforceable part of law'],'The Preamble acts as a guiding principle for interpreting the Constitution.'],
    ['Indian Polity','Which Amendment added Fundamental Duties to the Constitution?','42nd Amendment',['44th Amendment','73rd Amendment','86th Amendment'],'The 42nd Amendment (1976) added Fundamental Duties based on the Swaran Singh Committee.'],
    ['Indian Polity','The minimum age to become the President of India is?','35 years',['25 years','30 years','40 years'],'The minimum age to be eligible for the office of the President is 35 years.'],
    ['Indian Polity','Which Schedule of the Constitution deals with anti-defection?','Tenth Schedule',['Eighth Schedule','Ninth Schedule','Seventh Schedule'],'The Tenth Schedule (added by 52nd Amendment) contains anti-defection provisions.'],
    ['Indian Polity','Who appoints the Chief Justice of India?','The President',['The Prime Minister','The Parliament','The Law Minister'],'The President appoints the Chief Justice of India.'],
    ['Indian Polity','What is the maximum strength of the Lok Sabha?','552',['545','500','600'],'The maximum strength of Lok Sabha is 552 (530 states + 20 UTs + 2 Anglo-Indians).'],
    ['Indian Polity','Which Article deals with the amendment of the Constitution?','Article 368',['Article 356','Article 370','Article 352'],'Article 368 provides the procedure for amendment of the Constitution.'],
    ['Indian Polity','The concept of Judicial Review in India is based on which Article?','Article 13',['Article 32','Article 226','Article 21'],'Article 13 declares that laws inconsistent with Fundamental Rights are void, forming the basis of judicial review.'],
    ['Indian Polity','The 73rd Amendment relates to?','Panchayati Raj Institutions',['Municipalities','Anti-Defection','Fundamental Duties'],'The 73rd Amendment (1992) gave constitutional status to Panchayati Raj Institutions.'],
    ['Indian Polity','Which writ is issued for personal liberty?','Habeas Corpus',['Mandamus','Certiorari','Quo Warranto'],'Habeas Corpus literally means "produce the body" and safeguards personal liberty.'],
    ['Indian Polity','The Inter-State Council is established under which Article?','Article 263',['Article 256','Article 280','Article 300A'],'Article 263 provides for establishment of an Inter-State Council.'],
    ['Indian Polity','Who is the ex-officio Chairman of the Rajya Sabha?','The Vice-President',['The President','The Prime Minister','The Speaker'],'The Vice-President of India is the ex-officio Chairman of the Rajya Sabha.'],
    ['Indian Polity','The concept of "Basic Structure" was established in which case?','Kesavananda Bharati Case (1973)',['Golaknath Case (1967)','Minerva Mills Case (1980)','Maneka Gandhi Case (1978)'],'In Kesavananda Bharati Case (1973), the SC held that Parliament cannot alter the basic structure.'],
    ['Indian Polity','Which part of the Constitution deals with Fundamental Rights?','Part III',['Part IV','Part IVA','Part II'],'Part III (Articles 12-35) deals with Fundamental Rights.'],
    ['Indian Polity','The Comptroller and Auditor General of India is appointed under?','Article 148',['Article 324','Article 280','Article 338'],'Article 148 provides for the CAG of India.'],
    ['Indian Polity','Which Article empowers the President to proclaim a National Emergency?','Article 352',['Article 356','Article 360','Article 368'],'Article 352 empowers the President to proclaim a National Emergency.'],
    ['Indian Polity','The 74th Amendment relates to?','Municipalities',['Panchayats','Anti-Defection','Right to Education'],'The 74th Amendment (1992) gave constitutional status to Urban Local Bodies/Municipalities.'],
    ['Indian Polity','Which commission recommends distribution of taxes between Centre and States?','Finance Commission',['Planning Commission','Election Commission','Law Commission'],'The Finance Commission, under Article 280, recommends distribution of tax revenue.'],
    ['Indian Polity','Right to Education was made a Fundamental Right by which Amendment?','86th Amendment',['42nd Amendment','44th Amendment','93rd Amendment'],'The 86th Amendment (2002) inserted Article 21A making education a Fundamental Right for ages 6-14.'],
    ['Indian Polity','Zero Hour is a feature of?','Indian Parliamentary procedure',['British Parliament only','American Congress','French Legislature'],'Zero Hour is an Indian innovation in parliamentary procedure, not found in British practice.'],
    ['Indian Polity','The Union Territory of Delhi has a special status under which Article?','Article 239AA',['Article 239','Article 240','Article 243'],'Article 239AA (added by 69th Amendment) provides special provisions for Delhi.'],
    ['Indian Polity','Which Article provides for the formation of new states?','Article 3',['Article 1','Article 4','Article 5'],'Article 3 empowers Parliament to form new states, alter boundaries, etc.'],
    ['Indian Polity','The National Commission for Scheduled Castes is established under?','Article 338',['Article 340','Article 342','Article 335'],'Article 338 provides for a National Commission for SCs.'],
    ['Indian Polity','Residuary powers of legislation belong to?','Parliament (Union)',['State Legislatures','Concurrent List','Panchayats'],'Under Article 248, residuary powers of legislation rest with the Union Parliament.'],
    ['Indian Polity','Which Schedule lists the languages recognized by the Constitution?','Eighth Schedule',['Seventh Schedule','Ninth Schedule','Tenth Schedule'],'The Eighth Schedule lists 22 recognized languages of India.'],

    // ─── Geography (40) ───
    ['Geography','Which is the longest river flowing entirely within India?','Godavari',['Narmada','Kaveri','Mahanadi'],'The Godavari is the longest peninsular river flowing entirely within India.'],
    ['Geography','Which river is known as the "Sorrow of Bihar"?','Kosi',['Son','Gandak','Damodar'],'The Kosi has historically caused severe flooding in Bihar.'],
    ['Geography','Which soil is especially suitable for cotton cultivation?','Black soil',['Laterite soil','Mountain soil','Desert soil'],'Black soil (Regur) retains moisture and is suitable for cotton.'],
    ['Geography','The Tropic of Cancer passes through how many Indian states?','Eight',['Six','Seven','Nine'],'The Tropic of Cancer passes through 8 Indian states.'],
    ['Geography','Which is the highest peak wholly within India?','Nanda Devi',['Anamudi','Guru Shikhar','Doddabetta'],'Nanda Devi is the highest peak entirely within India.'],
    ['Geography','Which plateau is rich in minerals in eastern India?','Chota Nagpur Plateau',['Malwa Plateau','Deccan Plateau','Meghalaya Plateau'],'The Chota Nagpur Plateau is rich in coal, iron ore, and other minerals.'],
    ['Geography','The Sundarbans are associated with which delta?','Ganga–Brahmaputra delta',['Godavari delta','Mahanadi delta','Narmada delta'],'The Sundarbans occupy the Ganga–Brahmaputra delta region.'],
    ['Geography','Which Indian state has the longest coastline?','Gujarat',['Tamil Nadu','Andhra Pradesh','Maharashtra'],'Gujarat has the longest coastline among Indian states.'],
    ['Geography','Which pass connects Srinagar with Leh?','Zoji La',['Shipki La','Nathu La','Bomdi La'],'Zoji La lies on the route between Srinagar and Leh.'],
    ['Geography','Which is the largest brackish-water lagoon in India?','Chilika Lake',['Wular Lake','Sambhar Lake','Pulicat Lake'],'Chilika Lake in Odisha is India\'s largest brackish-water lagoon.'],
    ['Geography','What is the standard meridian of India?','82°30′ E',['81°30′ E','80°30′ E','84°30′ E'],'The standard meridian 82°30′ E passes through Mirzapur, UP, and determines IST.'],
    ['Geography','Which is the largest desert in India?','Thar Desert',['Rann of Kutch','Ladakh Cold Desert','Spiti Valley'],'The Thar Desert (Great Indian Desert) is in Rajasthan and is India\'s largest hot desert.'],
    ['Geography','The Western Ghats are also known as?','Sahyadri',['Satpura','Vindhya','Aravalli'],'The Western Ghats are locally known as Sahyadri in Maharashtra.'],
    ['Geography','Which river originates from Amarkantak?','Narmada',['Tapti','Godavari','Son'],'The Narmada River originates from Amarkantak in Madhya Pradesh.'],
    ['Geography','India\'s southernmost point on the mainland is?','Kanyakumari',['Indira Point','Rameswaram','Dhanushkodi'],'Kanyakumari (Cape Comorin) is the southernmost tip of mainland India.'],
    ['Geography','Which state has the highest percentage of forest area?','Mizoram',['Arunachal Pradesh','Meghalaya','Nagaland'],'Mizoram has the highest percentage of geographical area under forest cover.'],
    ['Geography','The Palk Strait separates India from which country?','Sri Lanka',['Maldives','Bangladesh','Myanmar'],'The Palk Strait separates Tamil Nadu from Sri Lanka.'],
    ['Geography','Which is the highest waterfall in India?','Kunchikal Falls',['Jog Falls','Dudhsagar Falls','Nohkalikai Falls'],'Kunchikal Falls in Karnataka is India\'s tallest waterfall at 455 m.'],
    ['Geography','Which is the largest freshwater lake in India?','Wular Lake',['Dal Lake','Chilika Lake','Sambhar Lake'],'Wular Lake in Jammu & Kashmir is the largest freshwater lake in India.'],
    ['Geography','The Aravalli Range is located mainly in?','Rajasthan',['Gujarat','Madhya Pradesh','Uttar Pradesh'],'The Aravalli Range stretches across Rajasthan and is one of the oldest fold mountains.'],
    ['Geography','Which Indian river is called "Dakshin Ganga"?','Godavari',['Krishna','Kaveri','Narmada'],'Godavari is called Dakshin Ganga (Ganges of the South).'],
    ['Geography','The Siachen Glacier is located in?','Karakoram Range',['Himalayas','Pir Panjal','Zaskar Range'],'Siachen Glacier is in the Karakoram Range and is the longest glacier in the Indian subcontinent.'],
    ['Geography','Which soil is most widespread in India?','Alluvial soil',['Black soil','Red soil','Laterite soil'],'Alluvial soil covers about 40% of India and is the most widespread.'],
    ['Geography','Which island group of India is in the Arabian Sea?','Lakshadweep',['Andaman & Nicobar','Both','None'],'Lakshadweep islands are coral islands in the Arabian Sea.'],
    ['Geography','Which city is known as the "Manchester of India"?','Ahmedabad',['Mumbai','Kanpur','Coimbatore'],'Ahmedabad is called the Manchester of India for its textile industry.'],
    ['Geography','Which river forms the India-Bangladesh border?','Brahmaputra (Meghna)',['Ganga','Teesta','Hooghly'],'The Meghna-Brahmaputra system forms part of the India-Bangladesh border.'],
    ['Geography','The Nilgiri Hills are part of?','Western Ghats',['Eastern Ghats','Himalaya','Satpura'],'The Nilgiri Hills are at the junction of the Western and Eastern Ghats.'],
    ['Geography','Which state is the largest producer of tea in India?','Assam',['West Bengal','Kerala','Tamil Nadu'],'Assam is the largest tea-producing state in India.'],
    ['Geography','The Vindhya Range separates?','North India from South India',['East from West','Deccan from Konkan','Thar from Gangetic plain'],'The Vindhya Range forms a traditional boundary between North and South India.'],
    ['Geography','India shares the longest international border with?','Bangladesh',['Pakistan','China','Nepal'],'India shares its longest international border with Bangladesh (~4,096 km).'],

    // ─── Physics (20) ───
    ['Physics','What is the SI unit of force?','Newton',['Joule','Pascal','Watt'],'Force is measured in newtons (1 N = 1 kg·m/s²).'],
    ['Physics','What is the SI unit of electric current?','Ampere',['Volt','Ohm','Coulomb'],'Electric current is measured in amperes.'],
    ['Physics','Which mirror is used as a rear-view mirror?','Convex mirror',['Plane mirror','Concave mirror','Cylindrical mirror'],'A convex mirror gives a wider field of view and an erect, diminished image.'],
    ['Physics','Which colour has the longest wavelength?','Red',['Violet','Blue','Green'],'Red light has the longest wavelength in the visible spectrum.'],
    ['Physics','Which instrument measures atmospheric pressure?','Barometer',['Hygrometer','Ammeter','Calorimeter'],'A barometer measures atmospheric pressure.'],
    ['Physics','What is the SI unit of power?','Watt',['Joule','Newton','Pascal'],'Power = work/time, measured in watts.'],
    ['Physics','Sound cannot travel through?','Vacuum',['Air','Water','Steel'],'Sound requires a material medium; it cannot travel through vacuum.'],
    ['Physics','Which lens is used to correct myopia?','Concave lens',['Convex lens','Bifocal lens','Cylindrical lens'],'A concave (diverging) lens is used to correct short-sightedness (myopia).'],
    ['Physics','What is the speed of light in vacuum?','3 × 10⁸ m/s',['3 × 10⁶ m/s','3 × 10¹⁰ m/s','3 × 10⁵ m/s'],'The speed of light in vacuum is approximately 3 × 10⁸ m/s.'],
    ['Physics','Ohm\'s law relates voltage, current, and?','Resistance',['Power','Energy','Capacitance'],'Ohm\'s law: V = IR, relates voltage, current, and resistance.'],
    ['Physics','Which type of energy is stored in a stretched rubber band?','Elastic potential energy',['Kinetic energy','Chemical energy','Nuclear energy'],'A stretched rubber band stores elastic potential energy.'],
    ['Physics','The phenomenon of splitting of white light into colours is called?','Dispersion',['Diffraction','Reflection','Refraction'],'Dispersion is the splitting of white light into a spectrum of colours by a prism.'],
    ['Physics','Which device converts mechanical energy to electrical energy?','Generator',['Motor','Transformer','Battery'],'A generator (dynamo) converts mechanical energy into electrical energy.'],
    ['Physics','Fleming\'s Left-Hand Rule is used for?','Electric motor',['Generator','Transformer','Galvanometer'],'Fleming\'s Left-Hand Rule gives the direction of force on a current-carrying conductor in a magnetic field (motor principle).'],
    ['Physics','What is the unit of frequency?','Hertz',['Decibel','Watt','Joule'],'Frequency is measured in hertz (Hz), which is cycles per second.'],
    ['Physics','Microwaves are produced by?','Oscillating electric circuits',['Nuclear reactions','Chemical reactions','Gravitational waves'],'Microwaves are produced by devices like magnetrons with oscillating electric charges.'],
    ['Physics','The ozone layer converts ultraviolet radiation into?','Infrared radiation (heat)',['Visible light','X-rays','Gamma rays'],'The ozone layer absorbs UV radiation and re-emits energy mainly as heat (infrared).'],
    ['Physics','Which law states that every action has an equal and opposite reaction?','Newton\'s Third Law',['Newton\'s First Law','Newton\'s Second Law','Law of Gravitation'],'Newton\'s Third Law states: For every action, there is an equal and opposite reaction.'],
    ['Physics','What is the SI unit of electric charge?','Coulomb',['Ampere','Volt','Ohm'],'Electric charge is measured in coulombs (C).'],
    ['Physics','Which phenomenon explains why a pencil appears bent in water?','Refraction',['Reflection','Dispersion','Diffraction'],'Refraction of light at the water-air interface makes a pencil appear bent.'],

    // ─── Chemistry (20) ───
    ['Chemistry','What is the chemical symbol for sodium?','Na',['So','S','N'],'Na comes from the Latin name natrium.'],
    ['Chemistry','A solution with pH below 7 is?','Acidic',['Basic','Neutral','Saline only'],'pH below 7 indicates an acidic solution.'],
    ['Chemistry','Which gas is released when acid reacts with carbonate?','Carbon dioxide',['Hydrogen','Nitrogen','Oxygen'],'Acid–carbonate reactions produce salt, water, and CO₂.'],
    ['Chemistry','Which metal is liquid at room temperature?','Mercury',['Iron','Aluminium','Copper'],'Mercury is a metal that is liquid at room temperature.'],
    ['Chemistry','Rusting of iron requires oxygen and?','Water or moisture',['Carbon dioxide only','Nitrogen only','Helium'],'Iron rusts in the presence of oxygen and moisture.'],
    ['Chemistry','Which gas is known as "laughing gas"?','Nitrous oxide (N₂O)',['Carbon monoxide','Nitrogen dioxide','Sulphur dioxide'],'Nitrous oxide (N₂O) is called laughing gas.'],
    ['Chemistry','Baking soda is chemically known as?','Sodium bicarbonate (NaHCO₃)',['Sodium carbonate','Sodium hydroxide','Sodium chloride'],'Baking soda is sodium bicarbonate, NaHCO₃.'],
    ['Chemistry','Which element has the atomic number 1?','Hydrogen',['Helium','Lithium','Carbon'],'Hydrogen has atomic number 1.'],
    ['Chemistry','Plaster of Paris is chemically?','Calcium sulphate hemihydrate',['Calcium carbonate','Calcium chloride','Calcium hydroxide'],'Plaster of Paris is CaSO₄·½H₂O (calcium sulphate hemihydrate).'],
    ['Chemistry','Which acid is present in vinegar?','Acetic acid',['Citric acid','Hydrochloric acid','Sulphuric acid'],'Vinegar contains acetic acid (CH₃COOH).'],
    ['Chemistry','The process of depositing a layer of zinc on iron is called?','Galvanisation',['Electroplating','Alloying','Vulcanisation'],'Galvanisation is coating iron or steel with zinc to prevent rusting.'],
    ['Chemistry','Which gas is used in fire extinguishers?','Carbon dioxide',['Oxygen','Nitrogen','Hydrogen'],'CO₂ is used in fire extinguishers as it doesn\'t support combustion.'],
    ['Chemistry','The hardest naturally occurring substance is?','Diamond',['Graphite','Quartz','Topaz'],'Diamond (pure carbon in a tetrahedral structure) is the hardest natural substance.'],
    ['Chemistry','Washing soda is chemically?','Sodium carbonate (Na₂CO₃)',['Sodium bicarbonate','Sodium hydroxide','Sodium chloride'],'Washing soda is sodium carbonate decahydrate, Na₂CO₃·10H₂O.'],
    ['Chemistry','Which gas is called "marsh gas"?','Methane (CH₄)',['Ethane','Propane','Butane'],'Methane is called marsh gas as it is produced by decomposition of organic matter in marshes.'],
    ['Chemistry','Bronze is an alloy of?','Copper and Tin',['Copper and Zinc','Iron and Carbon','Aluminium and Copper'],'Bronze is an alloy of copper and tin.'],
    ['Chemistry','The chemical formula of common salt is?','NaCl',['KCl','NaOH','HCl'],'Common salt is sodium chloride, NaCl.'],
    ['Chemistry','Which non-metal is a good conductor of electricity?','Graphite',['Sulphur','Phosphorus','Nitrogen'],'Graphite (a form of carbon) conducts electricity due to free electrons.'],
    ['Chemistry','What is the chemical name of bleaching powder?','Calcium hypochlorite',['Calcium carbonate','Calcium chloride','Calcium oxide'],'Bleaching powder is calcium hypochlorite, Ca(OCl)₂ / CaOCl₂.'],
    ['Chemistry','Which element is common to all organic compounds?','Carbon',['Hydrogen','Oxygen','Nitrogen'],'Carbon is the defining element of all organic compounds.'],

    // ─── Biology (20) ───
    ['Biology','Which organelle is the powerhouse of the cell?','Mitochondrion',['Ribosome','Golgi apparatus','Lysosome'],'Mitochondria produce most cellular ATP through respiration.'],
    ['Biology','Which pigment enables photosynthesis?','Chlorophyll',['Haemoglobin','Melanin','Keratin'],'Chlorophyll absorbs light energy for photosynthesis.'],
    ['Biology','Which blood group is the universal red-cell donor?','O negative',['AB positive','A positive','B negative'],'O negative red cells lack A, B, and Rh(D) antigens.'],
    ['Biology','Which vitamin is produced with sunlight exposure?','Vitamin D',['Vitamin C','Vitamin B12','Vitamin K'],'UVB exposure helps the skin synthesize vitamin D.'],
    ['Biology','Insulin is produced by which organ?','Pancreas',['Liver','Kidney','Spleen'],'Beta cells in the pancreatic islets produce insulin.'],
    ['Biology','The largest organ of the human body is?','Skin',['Liver','Brain','Heart'],'Skin is the largest organ of the human body by area.'],
    ['Biology','Which is the longest bone in the human body?','Femur',['Humerus','Tibia','Fibula'],'The femur (thigh bone) is the longest and strongest bone.'],
    ['Biology','Red blood cells are produced in?','Bone marrow',['Liver','Spleen','Kidney'],'Red blood cells (RBCs) are produced in the bone marrow.'],
    ['Biology','Which part of the brain controls balance?','Cerebellum',['Cerebrum','Medulla','Hypothalamus'],'The cerebellum coordinates voluntary movements and balance.'],
    ['Biology','The basic unit of life is?','Cell',['Atom','Molecule','Tissue'],'The cell is the basic structural and functional unit of life.'],
    ['Biology','Which disease is caused by deficiency of Vitamin C?','Scurvy',['Rickets','Beriberi','Night blindness'],'Scurvy is caused by Vitamin C (ascorbic acid) deficiency.'],
    ['Biology','Photosynthesis takes place in which part of the plant?','Leaves (chloroplasts)',['Roots','Stem','Flowers'],'Photosynthesis mainly occurs in the chloroplasts of leaves.'],
    ['Biology','Which blood component helps in clotting?','Platelets (Thrombocytes)',['Red blood cells','White blood cells','Plasma'],'Platelets (thrombocytes) play a key role in blood clotting.'],
    ['Biology','DNA stands for?','Deoxyribonucleic Acid',['Deoxyribonitric Acid','Dualnitrogen Acid','Dinucleic Acid'],'DNA = Deoxyribonucleic Acid, the molecule carrying genetic information.'],
    ['Biology','Which gas do plants release during photosynthesis?','Oxygen',['Carbon dioxide','Nitrogen','Hydrogen'],'During photosynthesis, plants absorb CO₂ and release O₂.'],
    ['Biology','Malaria is caused by?','Plasmodium (parasite)',['Bacteria','Virus','Fungus'],'Malaria is caused by the Plasmodium parasite, transmitted by Anopheles mosquitoes.'],
    ['Biology','The study of fungi is called?','Mycology',['Virology','Bacteriology','Zoology'],'Mycology is the branch of biology that studies fungi.'],
    ['Biology','Which hormone is known as the "fight or flight" hormone?','Adrenaline',['Insulin','Thyroxine','Estrogen'],'Adrenaline (epinephrine) is released during stress, preparing the body for fight or flight.'],
    ['Biology','The human heart has how many chambers?','Four',['Two','Three','Five'],'The human heart has four chambers: 2 atria and 2 ventricles.'],
    ['Biology','Which Vitamin deficiency causes Night Blindness?','Vitamin A',['Vitamin B','Vitamin C','Vitamin D'],'Night blindness (Nyctalopia) is caused by Vitamin A deficiency.'],

    // ─── Economics (20) ───
    ['Economics','Which institution issues most currency notes in India?','Reserve Bank of India',['State Bank of India','Finance Commission','NITI Aayog'],'The RBI issues banknotes in India, except the ₹1 note issued by the Government.'],
    ['Economics','GST is an example of which type of tax?','Indirect tax',['Direct tax','Wealth tax','Corporate income tax'],'GST is an indirect tax levied on the supply of goods and services.'],
    ['Economics','What does inflation mean?','A sustained rise in the general price level',['A fall in all prices','A rise in production only','A fall in money supply only'],'Inflation is a sustained increase in the general level of prices.'],
    ['Economics','Which body recommends tax devolution between Union and States?','Finance Commission',['Election Commission','UPSC','National Development Council'],'The Finance Commission recommends distribution of tax revenues.'],
    ['Economics','The first Five-Year Plan of India was launched in?','1951',['1947','1956','1961'],'India\'s First Five-Year Plan was launched in 1951.'],
    ['Economics','Who is known as the father of Indian economic reforms (1991)?','Dr. Manmohan Singh',['P. V. Narasimha Rao','Jawaharlal Nehru','Rajiv Gandhi'],'Dr. Manmohan Singh, as Finance Minister, spearheaded the 1991 economic reforms.'],
    ['Economics','NITI Aayog was established in which year?','2015',['2014','2016','2017'],'NITI Aayog replaced the Planning Commission and was established on 1 Jan 2015.'],
    ['Economics','What does GDP stand for?','Gross Domestic Product',['General Domestic Price','Grand Development Plan','Growth Demand Protocol'],'GDP = Gross Domestic Product, the total value of goods and services produced.'],
    ['Economics','The concept of "Mixed Economy" means?','Co-existence of public and private sectors',['Only public sector','Only private sector','No government intervention'],'A mixed economy has both public (government) and private sector participation.'],
    ['Economics','Which bank is known as the "Banker\'s Bank" in India?','Reserve Bank of India',['State Bank of India','NABARD','SEBI'],'The RBI acts as the banker to other banks and the government.'],
    ['Economics','Repo Rate is the rate at which?','RBI lends to commercial banks',['Banks lend to customers','Government borrows from public','Banks lend to each other'],'Repo Rate is the rate at which RBI lends short-term money to commercial banks.'],
    ['Economics','Census in India is conducted every?','10 years',['5 years','15 years','7 years'],'The Census of India is conducted every 10 years (decennial census).'],
    ['Economics','FDI stands for?','Foreign Direct Investment',['Federal Domestic Income','Fiscal Deficit Index','Fixed Deposit Interest'],'FDI = Foreign Direct Investment, investment by foreign entities in Indian businesses.'],
    ['Economics','Which sector contributes the most to India\'s GDP currently?','Services sector',['Agriculture sector','Industrial sector','Mining sector'],'The services (tertiary) sector contributes the most to India\'s GDP.'],
    ['Economics','The fiscal year in India runs from?','April 1 to March 31',['January 1 to December 31','July 1 to June 30','October 1 to September 30'],'India\'s fiscal year runs from April 1 to March 31.'],

    // ─── Art, Culture & Sports (20) ───
    ['Art and Culture','Bharatanatyam is associated with which state?','Tamil Nadu',['Punjab','Assam','Gujarat'],'Bharatanatyam developed in Tamil Nadu.'],
    ['Art and Culture','Bihu is a major festival of?','Assam',['Kerala','Goa','Haryana'],'Bihu marks the agricultural calendar in Assam.'],
    ['Art and Culture','Kathakali is a classical dance-drama of?','Kerala',['Odisha','Manipur','Rajasthan'],'Kathakali is a highly stylized dance-drama from Kerala.'],
    ['Art and Culture','The Konark Sun Temple is located in?','Odisha',['Bihar','Madhya Pradesh','Karnataka'],'The 13th-century Sun Temple at Konark is in Odisha.'],
    ['Art and Culture','The Ajanta caves are in which state?','Maharashtra',['Uttar Pradesh','Telangana','Rajasthan'],'The Ajanta Buddhist caves are in Maharashtra.'],
    ['Art and Culture','Who wrote "The Discovery of India"?','Jawaharlal Nehru',['M. K. Gandhi','Rabindranath Tagore','B. R. Ambedkar'],'Nehru wrote The Discovery of India during imprisonment in the 1940s.'],
    ['Art and Culture','Who wrote the play "Abhijnanashakuntalam"?','Kalidasa',['Banabhatta','Tulsidas','Bharavi'],'Abhijnanashakuntalam is a celebrated Sanskrit play by Kalidasa.'],
    ['Sports','How many players per team in a standard football match?','11',['9','10','12'],'A standard football team fields 11 players.'],
    ['Sports','The Thomas Cup is associated with?','Badminton',['Hockey','Football','Table tennis'],'The Thomas Cup is the international men\'s team badminton championship.'],
    ['Sports','The Dadasaheb Phalke Award is for which field?','Indian cinema',['Literature','Science','Classical music only'],'The Dadasaheb Phalke Award recognises lifetime contribution to Indian cinema.'],
    ['Sports','The Arjuna Award recognises achievement in?','Sports',['Agriculture','Journalism','Public administration'],'The Arjuna Award recognises outstanding sports achievement.'],
    ['Sports','Cricket World Cup 2023 was hosted by?','India',['England','Australia','South Africa'],'The 2023 ICC Cricket World Cup was hosted by India.'],
    ['Sports','Who is known as the "Flying Sikh"?','Milkha Singh',['P. T. Usha','Sachin Tendulkar','Kapil Dev'],'Milkha Singh is known as the "Flying Sikh" for his sprinting achievements.'],
    ['Sports','The Ranji Trophy is associated with?','Cricket',['Hockey','Football','Badminton'],'The Ranji Trophy is India\'s premier domestic first-class cricket tournament.'],
    ['Sports','The Durand Cup is associated with?','Football',['Cricket','Hockey','Tennis'],'The Durand Cup is one of the oldest football tournaments in the world.'],
    ['Art and Culture','Pongal is a harvest festival of?','Tamil Nadu',['Kerala','Andhra Pradesh','Karnataka'],'Pongal is a four-day harvest festival celebrated in Tamil Nadu.'],
    ['Art and Culture','The Khajuraho temples are in?','Madhya Pradesh',['Rajasthan','Uttar Pradesh','Bihar'],'The Khajuraho Group of Monuments is in Madhya Pradesh.'],
    ['Art and Culture','Manipuri dance originated in?','Manipur',['Assam','Kerala','Odisha'],'Manipuri is a classical dance form from Manipur, northeast India.'],
    ['Art and Culture','Ghoomar dance is from which state?','Rajasthan',['Gujarat','Punjab','Haryana'],'Ghoomar is a traditional folk dance of Rajasthan.'],
    ['Art and Culture','The Golden Temple is located in?','Amritsar, Punjab',['Varanasi, UP','Bodh Gaya, Bihar','Haridwar, Uttarakhand'],'The Golden Temple (Harmandir Sahib) is in Amritsar, Punjab.'],

    // ─── Environment & Science (10) ───
    ['Environment','The ozone layer is in which atmospheric layer?','Stratosphere',['Troposphere','Mesosphere','Thermosphere'],'Most atmospheric ozone is concentrated in the stratosphere.'],
    ['Environment','Project Tiger was launched in?','1973',['1969','1982','1991'],'Project Tiger began in 1973 for tiger conservation.'],
    ['Environment','Largest contributor to human-caused global warming?','Carbon dioxide',['Argon','Neon','Hydrogen'],'CO₂ is the largest contributor by total anthropogenic emissions.'],
    ['Environment','What does CPU stand for?','Central Processing Unit',['Computer Primary Utility','Central Program Upload','Control Processing User'],'CPU = Central Processing Unit.'],
    ['Environment','Which memory is volatile?','RAM',['ROM','Blu-ray disc','Hard disk'],'RAM generally loses its contents when power is removed.'],
    ['Environment','Which protocol securely transfers web pages?','HTTPS',['HTTP only','FTP','SMTP'],'HTTPS uses TLS to protect HTTP communication.'],
    ['Environment','Jim Corbett National Park is in which state?','Uttarakhand',['Madhya Pradesh','Rajasthan','Assam'],'Jim Corbett National Park is in Uttarakhand, established in 1936.'],
    ['Environment','Which day is celebrated as World Environment Day?','5 June',['22 April','21 March','16 September'],'World Environment Day is celebrated on 5 June every year.'],
    ['Environment','Chipko Movement is related to?','Forest conservation',['Water conservation','Wildlife protection','Air pollution'],'The Chipko Movement (1973) was a forest conservation movement in Uttarakhand.'],
    ['Environment','The Red Data Book contains data about?','Endangered species',['Extinct volcanoes','Blood groups','Rare minerals'],'The IUCN Red Data Book lists endangered species worldwide.'],

    // ─── Current Affairs 2025-2026 (25) ───
    ['Current Affairs','Which Indians were included in TIME 100 Most Influential People 2026?','Sundar Pichai, Vikas Khanna, Ranbir Kapoor',['Only Sundar Pichai','Only Ratan Tata','Sachin Tendulkar, Virat Kohli'],'TIME 100 (2026) featured Sundar Pichai, Vikas Khanna, and Ranbir Kapoor.'],
    ['Current Affairs','In March 2026, RRU signed an MoU with which organization?','Sashastra Seema Bal (SSB) Academy',['BSF Academy','CRPF Academy','ITBP Academy'],'RRU signed an MoU with SSB Academy to enhance national security training.'],
    ['Current Affairs','India\'s first woman fighter pilot in combat is from which force?','Indian Air Force',['Indian Navy','Indian Army','Coast Guard'],'India\'s first woman fighter pilots were inducted into the IAF starting 2016.'],
    ['Current Affairs','The Artemis II mission is planned by which space agency?','NASA',['ISRO','ESA','CNSA'],'Artemis II is NASA\'s crewed lunar flyby mission.'],
    ['Current Affairs','PM VIKAS scheme is for the welfare of?','Particularly Vulnerable Tribal Groups (PVTGs)',['Farmers','Women entrepreneurs','Senior citizens'],'PM VIKAS aims for the development of PVTGs across India.'],
    ['Current Affairs','Exercise Kakadu is a multilateral naval exercise hosted by?','Australia',['India','Japan','USA'],'Exercise Kakadu is hosted by the Royal Australian Navy.'],
    ['Current Affairs','India conducted its first underwater nuclear missile test from?','INS Arighaat',['INS Vikrant','INS Arihant','INS Vishal'],'India tested submarine-launched ballistic missiles from its nuclear submarines.'],
    ['Current Affairs','Which country hosted the G20 Summit in 2023?','India',['Indonesia','Japan','Brazil'],'India hosted the G20 Summit in September 2023 under PM Modi\'s presidency.'],
    ['Current Affairs','Chandrayaan-3 successfully landed on the Moon in?','August 2023',['July 2023','September 2023','June 2023'],'Chandrayaan-3 landed on the Moon\'s south pole on 23 August 2023.'],
    ['Current Affairs','India\'s population surpassed which country to become the most populous in 2023?','China',['USA','Indonesia','Brazil'],'India surpassed China to become the world\'s most populous country in 2023.'],
    ['Current Affairs','Which Indian city hosted the International Solar Alliance (ISA) headquarters?','Gurugram (Haryana)',['New Delhi','Mumbai','Bengaluru'],'The ISA headquarters is in Gurugram, Haryana.'],
    ['Current Affairs','UPI (Unified Payments Interface) was developed by?','NPCI',['RBI','SBI','Google'],'UPI was developed by NPCI (National Payments Corporation of India).'],
    ['Current Affairs','The Ayodhya Ram Mandir was inaugurated in?','January 2024',['August 2023','March 2024','December 2023'],'The Ram Mandir Pran Pratishtha ceremony was held on 22 January 2024.'],
    ['Current Affairs','India launched its first indigenous aircraft carrier named?','INS Vikrant',['INS Viraat','INS Vishal','INS Arihant'],'INS Vikrant (IAC-1) is India\'s first indigenous aircraft carrier, commissioned in 2022.'],
    ['Current Affairs','Digital India Programme was launched in which year?','2015',['2014','2016','2017'],'Digital India was launched on 1 July 2015.'],
    ['Current Affairs','Which state became the first to implement the Ayushman Bharat scheme fully?','Andhra Pradesh',['Kerala','Tamil Nadu','Gujarat'],'Andhra Pradesh was among the first states to implement Ayushman Bharat comprehensively.'],
    ['Current Affairs','The Swachh Bharat Mission was launched on?','2 October 2014',['15 August 2014','26 January 2015','2 October 2015'],'Swachh Bharat Mission was launched on Gandhi Jayanti, 2 October 2014.'],
    ['Current Affairs','Aadhaar is a unique identity based on?','Biometric data (12-digit number)',['Passport number','PAN number','Voter ID'],'Aadhaar is a 12-digit unique identity number based on biometric and demographic data.'],
    ['Current Affairs','Make in India initiative was launched in?','September 2014',['January 2015','August 2014','March 2015'],'Make in India was launched on 25 September 2014.'],
    ['Current Affairs','The National Education Policy 2020 replaced which policy?','National Policy on Education 1986',['Kothari Commission','RTE Act 2009','Sarva Shiksha Abhiyan'],'NEP 2020 replaced the National Policy on Education 1986.'],
    ['Current Affairs','Which Indian state introduced India\'s first green hydrogen bus?','Rajasthan',['Gujarat','Kerala','Delhi'],'Rajasthan introduced India\'s first green hydrogen fuel cell bus.'],
    ['Current Affairs','India\'s target year for Net Zero carbon emissions is?','2070',['2030','2050','2060'],'India announced a Net Zero target by 2070 at COP26.'],
    ['Current Affairs','The 2024 Paris Olympics were held in which country?','France',['Japan','USA','China'],'The 2024 Summer Olympics were held in Paris, France.'],
    ['Current Affairs','Pradhan Mantri Jan Dhan Yojana was launched for?','Financial inclusion (bank accounts for all)',['Housing for all','Free healthcare','Education scholarship'],'PMJDY aims to provide bank accounts and financial services to all households.'],
    ['Current Affairs','India\'s first semiconductor manufacturing plant was announced in?','Gujarat',['Karnataka','Tamil Nadu','Maharashtra'],'India\'s first semiconductor fab plant was announced in Dholera, Gujarat.'],

    // ─── Additional (15 more to reach 250) ───
    ['Indian History','Who built the Qutub Minar?','Qutbuddin Aibak',['Iltutmish','Alauddin Khilji','Firoz Shah Tughlaq'],'Qutub Minar was started by Qutbuddin Aibak in 1193 and completed by Iltutmish.'],
    ['Indian History','The Revolt of 1857 started from which city?','Meerut',['Delhi','Lucknow','Kanpur'],'The Revolt of 1857 began with a mutiny at Meerut on 10 May 1857.'],
    ['Indian Polity','Which Article deals with President\'s Rule in a state?','Article 356',['Article 352','Article 360','Article 370'],'Article 356 empowers the President to impose President\'s Rule in a state.'],
    ['Geography','Which is the smallest state of India by area?','Goa',['Sikkim','Tripura','Mizoram'],'Goa is the smallest state of India by area (3,702 sq km).'],
    ['Geography','The Brahmaputra River is known as Tsangpo in which country?','China (Tibet)',['Nepal','Bangladesh','Myanmar'],'The Brahmaputra is called Yarlung Tsangpo in Tibet, China.'],
    ['Geography','Which city is known as the "Silicon Valley of India"?','Bengaluru',['Hyderabad','Pune','Chennai'],'Bengaluru is called the Silicon Valley of India for its IT industry.'],
    ['Geography','Which Indian state receives rainfall from both monsoons?','Tamil Nadu',['Kerala','Karnataka','West Bengal'],'Tamil Nadu receives rainfall from both southwest (limited) and northeast monsoons.'],
    ['Geography','Which is the largest state of India by area?','Rajasthan',['Madhya Pradesh','Maharashtra','Uttar Pradesh'],'Rajasthan is the largest state of India by area (342,239 sq km).'],
    ['Physics','What is the SI unit of pressure?','Pascal',['Newton','Joule','Watt'],'Pressure = Force/Area, measured in pascals (Pa).'],
    ['Chemistry','Which gas is used in balloons for lifting?','Helium',['Hydrogen','Nitrogen','Oxygen'],'Helium is used in balloons as it is lighter than air and non-flammable.'],
    ['Biology','Which is the smallest bone in the human body?','Stapes (stirrup)',['Malleus','Incus','Radius'],'The stapes in the middle ear is the smallest bone in the human body.'],
    ['Economics','What is the full form of SBI?','State Bank of India',['Standard Bank of India','Supreme Bank of India','Sovereign Bank of India'],'SBI = State Bank of India, the largest public sector bank.'],
    ['Economics','Which five-year plan is known as the "Mahalanobis Plan"?','Second Five-Year Plan',['First Five-Year Plan','Third Five-Year Plan','Fourth Five-Year Plan'],'The Second Five-Year Plan (1956-61) was based on P.C. Mahalanobis\'s model.'],
    ['Current Affairs','Which Indian city was renamed Prayagraj?','Allahabad',['Mysore','Baroda','Madras'],'Allahabad in Uttar Pradesh was officially renamed Prayagraj in 2018.'],
    ['Sports','The Uber Cup is associated with which sport?','Badminton (women\'s team)',['Tennis','Table tennis','Volleyball'],'The Uber Cup is the international women\'s team badminton championship.'],
  ];

  /* ── build 10 sectional tests × 25 questions ── */
  const QUESTION_COUNT = 25;
  const MOCK_COUNT = 10;

  function buildTest(testNum) {
    const start = (testNum - 1) * QUESTION_COUNT;
    const questions = [];
    for (let i = 0; i < QUESTION_COUNT; i++) {
      const idx = start + i;
      const fact = gsFacts[idx];
      const seed = hash(`sect-gs-${testNum}:${i}`);
      questions.push(
        question(
          `sect-gs-${testNum}-q${i + 1}`,
          fact[0],
          fact[1],
          fact[2],
          fact[3],
          fact[4],
          'Recall the associated fact, person, place, or institution; eliminate options from unrelated topics.',
          seed
        )
      );
    }
    return {
      id: `sect-gs-${String(testNum).padStart(2, '0')}`,
      title: `GS Test ${String(testNum).padStart(2, '0')}`,
      questions
    };
  }

  const tests = Array.from({ length: MOCK_COUNT }, (_, i) => buildTest(i + 1));

  /* ── deduplicate option orderings across tests ── */
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

  root.SSC_CHSL_SECTIONAL_GS_DATA = {
    exam: {
      name: 'SSC CHSL — GS & Current Affairs',
      totalQuestions: 25,
      totalMarks: 50,
      totalMinutes: 15,
      correctMarks: 2,
      incorrectPenalty: 0.5
    },
    tests,
    questionTotal: tests.reduce((s, t) => s + t.questions.length, 0)
  };
})(globalThis);
