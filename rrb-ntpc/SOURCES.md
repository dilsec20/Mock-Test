# RRB NTPC CBT-1 mock tests: pattern and sources

## Exam pattern used

The full-length practice papers use the 1st Stage CBT pattern in RRB CEN 06/2024: 100 questions in 90 minutes, with General Awareness (40), Mathematics (30), and General Intelligence & Reasoning (30). Correct answers score 1 mark; a wrong answer deducts one-third of a mark. The notice says the section-wise distribution is indicative and may vary. [Official RRB CEN 06/2024 notice](https://rrbcdg.gov.in/uploads/202406/Detailed%20CEN%2006-2024%20NTPC.pdf)

The sectional clocks in this practice page (27 minutes for a 30-question section, 36 minutes for a 40-question section) are proportional study timers. They are not represented as official RRB section limits. Full mocks have a single 90-minute timer.

## Question sources and labels

- **PYQ:** paraphrased / translated past-paper examples. Each such question carries its source, exam level, and a source link in the answer review.
- **Expected practice:** original practice questions based on RRB NTPC CBT-1 syllabus topics. These are not official past-paper questions.
- Questions tagged **Graduate & Undergraduate (common CBT-1)** use older CBT-1 papers where the linked source does not state a separate level. Level-specific 2025/2026 examples are labeled Graduate or Undergraduate where the paper identifies that level.
- The workspace bank files are used to generate these papers: `rrb_ntpc/01_Mathematics/pyq.md`, `rrb_ntpc/02_General_Intelligence_Reasoning/pyq.md`, `rrb_ntpc/03_General_Awareness/pyq.md`, and `rrb_ntpc/03_General_Awareness/questionbank.md`. They contain expected-practice items in addition to the explicitly sourced PYQ examples; the filenames do not mean every entry is a verbatim PYQ.

## Past-paper references

- [RRB NTPC 2021 CBT-1, 18 January Shift 2 paper (Prepp PDF)](https://cdn-images.prepp.in/public/image/RRBNTPC2021CBT1PreviousYearPaper18Jan2021Shift2_3b2114a823f008b22f49e2c2dbf09baf.pdf)
- [RRB NTPC Undergraduate CBT-1, 9 September 2025 Shift III (Drishti PDF)](https://vault.sscdrishti.com/english_file_uploads/1767871829_RRB-NTPC-Under-Graduate-CBT-1-Question-Paper-English-09-09-2025-Shift-III.pdf)
- [RRB NTPC Undergraduate CBT-1, 19 August 2025 Shift I (Drishti PDF)](https://vault.sscdrishti.com/english_file_uploads/1767870301_RRB-NTPC-Under-Graduate-CBT-1-Question-Paper-English-19-08-2025-Shift-I.pdf)
- [RRB NTPC Graduate CBT-1, 19 March 2026 Shift 2 (CareerPower PDF)](https://www.careerpower.in/blog/wp-content/uploads/2026/04/06174828/RRB-NTPC-Graduate-2025-CBT-I-Question-Paper-%E2%80%9319-03-2026%E2%80%93S2.pdf)
- [PW Railway Game Changer reasoning PYQ collection](https://static.pw.live/5eb393ee95fab7468a79d189/PW_STORE/ee36c1d7-342b-416e-a4ab-0a5519f6c71c.pdf)

## Rebuilding the browser bank

From the Placement workspace, where the `mock-test` and `rrb_ntpc` folders sit next to each other, run `python mock-test/rrb-ntpc/prepare_bank.py`. This parses the workspace Markdown banks and writes the self-contained `mock-test/rrb-ntpc/question-bank.json` used by the static webpage. The runner samples fixed sets from that bank for 15 sectional and 10 full-length mock papers, and includes at least one sourced PYQ in each section of every paper.
