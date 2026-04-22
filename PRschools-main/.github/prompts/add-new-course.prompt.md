---
description: "Add a new course entry to defenceCourses.ts or padmaCourses.ts. Use when: adding a defence exam course (NDA, CDS, AFCAT, etc.) or a Padma Maths course (CBSE/ICSE grade). Generates a fully-typed object matching the existing schema."
name: "Add New Course"
argument-hint: "Course name, type (defence|padma), fee, duration, eligibility"
agent: "agent"
tools: [read_file, replace_string_in_file]
---

You are adding a new course entry to this project's course data files.

## Step 1 — Identify the target file

- If the course is for **R's Defence Academy** (entrance exams like NDA, CDS, AFCAT, MNS, CAPF, Territorial Army, etc.) → [defenceCourses.ts](../../src/data/defenceCourses.ts)
- If the course is for **Padma Maths Pro** (CBSE/ICSE school maths grades) → [padmaCourses.ts](../../src/data/padmaCourses.ts)

Read the target file first to understand the existing structure before writing anything.

## Step 2 — Follow the correct interface

### DefenceCourse (defenceCourses.ts)
```ts
{
  slug: string;           // kebab-case, URL-safe, unique (e.g. "cds", "afcat-1")
  title: string;          // Full exam name
  subtitle: string;       // Short descriptor
  description: string;    // 2-3 sentence overview
  eligibility: string[];  // Each item is one criterion
  duration: string;
  fee: string;            // Format: "₹X,XXX - ₹X,XXX"
  batchSize: string;
  schedule: string;
  highlights: string[];   // 5-8 bullet points
  syllabus: { name: string; topics: string[] }[];
  faqs: { question: string; answer: string }[];
}
```

### Course (padmaCourses.ts)
```ts
{
  slug: string;           // e.g. "10th-cbse", "8th-icse"
  title: string;
  subtitle: string;
  description: string;
  fee: string;
  duration: string;
  batchSize: string;
  schedule: string;
  highlights: string[];
  units: {
    name: string;
    chapters: { name: string; topics: string[] }[];
  }[];
  faqs: { question: string; answer: string }[];
}
```

## Step 3 — Generate the entry

- Fill every required field — do NOT leave any field empty or as a placeholder.
- Match the formatting style (indentation, string quotes, trailing commas) of the existing entries.
- Choose a `slug` that doesn't already exist in the array.
- Provide at least 5 `highlights`, at least 2 `syllabus`/`units` sections, and at least 3 `faqs`.

## Step 4 — Insert the entry

Append the new object inside the exported array in the target file. Place it after the last existing entry, before the closing `]`. Use `replace_string_in_file` to make the edit precisely.

## Step 5 — Confirm

Report: the slug added, the target file, and the number of syllabus/unit sections included.
