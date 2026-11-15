"""Build the browser question bank from the RRB NTPC Markdown study banks."""
from __future__ import annotations

import json
import re
from pathlib import Path

HERE = Path(__file__).resolve().parent
ROOT = HERE.parent.parent / "rrb_ntpc"


def parse_questions(path: Path) -> list[dict]:
    text = path.read_text(encoding="utf-8")
    blocks = re.split(r"(?=^### (?:PYQ-[A-Z]+\d+|Q\d+)\s*[.·])", text, flags=re.M)
    questions = []
    for block in blocks:
        heading = re.match(r"^### (PYQ-[A-Z]+\d+|Q\d+)\s*[.·]\s*(.*)$", block, flags=re.M)
        if not heading:
            continue
        key = heading.group(1)
        topic = heading.group(2).strip()
        answer_match = re.search(r"\*\*Answer:\*\*\s*([A-D])\.\s*(.+)", block)
        explanation_match = re.search(r"\*\*Explanation:\*\*\s*(.+)", block)
        related_match = re.search(r"\*\*(?:Related fact / rule|Shortcut / rule):\*\*\s*(.+)", block)
        source_match = re.search(r"\*\*Source:\*\*\s*\[([^\]]+)\]\((https?://[^)]+)\)", block)
        options = []
        option_matches = list(re.finditer(r"^([A-D])\.\s+(.+?)\s*$", block, flags=re.M))
        for match in option_matches:
            options.append(match.group(2).strip())
        first_option = option_matches[0].start() if option_matches else len(block)
        prompt_start = heading.end()
        prompt = block[prompt_start:first_option].strip()
        prompt = re.sub(r"\n\s*\n", " ", prompt)
        prompt = re.sub(r"\s+", " ", prompt)
        if not answer_match or len(options) != 4 or not prompt:
            continue
        answer = "ABCD".index(answer_match.group(1))
        question_type = "PYQ" if key.startswith("PYQ-") else "Expected practice"
        if question_type != "PYQ":
            level = "UG + Graduate practice"
        elif source_match and ("Under-Graduate" in source_match.group(1) or "UG CBT-1" in source_match.group(1)):
            level = "Undergraduate CBT-1 (2025)"
        elif source_match and "Graduate" in source_match.group(1):
            level = "Graduate CBT-1"
        elif source_match and "2021 CBT-1" in source_match.group(1):
            level = "Graduate & Undergraduate (common CBT-1)"
        else:
            level = "CBT-1 PYQ · level unspecified in source"
        questions.append({
            "id": key,
            "topic": topic,
            "question": prompt,
            "options": options,
            "answer": answer,
            "explanation": explanation_match.group(1).strip() if explanation_match else "Review the stated rule to confirm the answer.",
            "related": related_match.group(1).strip() if related_match else "",
            "type": question_type,
            "level": level,
            "source": source_match.group(1) if source_match else "RRB NTPC CBT-1 syllabus practice bank",
            "sourceUrl": source_match.group(2) if source_match else ""
        })
    return questions


def main() -> None:
    files = {
        "mathematics": ROOT / "01_Mathematics" / "pyq.md",
        "reasoning": ROOT / "02_General_Intelligence_Reasoning" / "pyq.md",
        "awareness": ROOT / "03_General_Awareness" / "pyq.md",
    }
    bank = {name: parse_questions(path) for name, path in files.items()}
    awareness_extra = parse_questions(ROOT / "03_General_Awareness" / "questionbank.md")
    known_prompts = {item["question"] for item in bank["awareness"]}
    bank["awareness"].extend(item for item in awareness_extra if item["question"] not in known_prompts)
    for item in bank["awareness"]:
        if item["id"] == "PYQ-G1":
            item["question"] = "Which country ranked first in the 2025 World Happiness Report?"
            item["explanation"] = "Finland ranked first in the 2025 World Happiness Report."
            item["related"] = "Annual report rankings are time-specific; retain the year in the question when revising current-affairs facts."
    graduate_source = "RRB NTPC Graduate CBT-1, 19 Mar 2026 Shift 2 (CareerPower paper PDF)"
    graduate_url = "https://www.careerpower.in/blog/wp-content/uploads/2026/04/06174828/RRB-NTPC-Graduate-2025-CBT-I-Question-Paper-%E2%80%9319-03-2026%E2%80%93S2.pdf"
    undergraduate_source = "RRB NTPC Undergraduate CBT-1, 19 Aug 2025 Shift 1 (Drishti paper PDF)"
    undergraduate_url = "https://vault.sscdrishti.com/english_file_uploads/1767870301_RRB-NTPC-Under-Graduate-CBT-1-Question-Paper-English-19-08-2025-Shift-I.pdf"
    bank["mathematics"].insert(0, {
        "id": "PYQ-GRAD-M1", "topic": "Elementary Statistics", "question": "Find the average of all natural numbers from 1 to 64.",
        "options": ["33", "33.5", "32", "32.5"], "answer": 3,
        "explanation": "The average of consecutive numbers from 1 to 64 is (first + last) ÷ 2 = (1 + 64) ÷ 2 = 32.5.",
        "related": "For an arithmetic sequence, average = (first term + last term) ÷ 2.",
        "type": "PYQ", "level": "Graduate CBT-1 (2026)", "source": graduate_source, "sourceUrl": graduate_url
    })
    bank["reasoning"].insert(0, {
        "id": "PYQ-GRAD-R1", "topic": "Letter Analogy", "question": "In a letter analogy, # : LHN :: PLR : %. If the same letter shift applies to each position, which pair fills # and %?",
        "options": ["# = MIO, % = OKQ", "# = MIO, % = OLQ", "# = MIP, % = OKQ", "# = MIO, % = OKR"], "answer": 0,
        "explanation": "Each letter in MIO moves one step backward to form LHN. Applying the same shift to PLR gives OKQ.",
        "related": "In letter analogies, compare corresponding character positions and check for consistent forward or backward shifts.",
        "type": "PYQ", "level": "Graduate CBT-1 (2026)", "source": graduate_source, "sourceUrl": graduate_url
    })
    bank["awareness"].insert(0, {
        "id": "PYQ-GRAD-G1", "topic": "Physics · Discoveries", "question": "Who determined the charge-to-mass (e/m) ratio of the electron?",
        "options": ["Isaac Newton", "Niels Bohr", "Albert Einstein", "J. J. Thomson"], "answer": 3,
        "explanation": "J. J. Thomson determined the electron's charge-to-mass ratio through cathode-ray experiments.",
        "related": "Millikan measured the electron's charge; combining the charge and e/m measurements gives its mass.",
        "type": "PYQ", "level": "Graduate CBT-1 (2026)", "source": graduate_source, "sourceUrl": graduate_url
    })
    bank["mathematics"].insert(0, {
        "id": "PYQ-UG-M1", "topic": "Profit and Loss · Successive Discounts", "question": "Two successive discounts of 65% and 24% are equivalent to a single discount of what percentage?",
        "options": ["77%", "74.5%", "76.6%", "73.4%"], "answer": 3,
        "explanation": "For a marked price of 100, the first discount leaves 35. A further 24% discount leaves 35 × 0.76 = 26.6, so the total discount is 100 − 26.6 = 73.4%.",
        "related": "Equivalent successive discount = a + b − ab/100.",
        "type": "PYQ", "level": "Undergraduate CBT-1 (2025)", "source": undergraduate_source, "sourceUrl": undergraduate_url
    })
    bank["reasoning"].insert(0, {
        "id": "PYQ-UG-R1", "topic": "Number Ordering", "question": "Arrange the digits of 7312648 in ascending order. What is the sum of the second digit from the left and the second digit from the right?",
        "options": ["11", "5", "7", "9"], "answer": 3,
        "explanation": "The ascending arrangement is 1, 2, 3, 4, 6, 7, 8. The second digit from the left is 2 and the second from the right is 7; their sum is 9.",
        "related": "For digit-order questions, write the complete rearranged sequence before selecting positions.",
        "type": "PYQ", "level": "Undergraduate CBT-1 (2025)", "source": undergraduate_source, "sourceUrl": undergraduate_url
    })
    for name, questions in bank.items():
        if not questions:
            raise SystemExit(f"No questions parsed from {files[name]}")
    target = HERE / "question-bank.json"
    target.write_text(json.dumps(bank, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print("; ".join(f"{name}: {len(items)}" for name, items in bank.items()))
    print(f"Wrote {target} ({target.stat().st_size:,} bytes)")


if __name__ == "__main__":
    main()
