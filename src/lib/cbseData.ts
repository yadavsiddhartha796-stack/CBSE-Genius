export interface ChapterData {
  id: string;
  number: number;
  title: string;
  summary: string;
  status?: 'Not Started' | 'In Progress' | 'Completed' | 'Needs Revision';
  concepts: string[];
  formulas?: string[];
  importantQuestions: string[];
  sampleHomeworkPrompt?: string;
}

export interface SubjectData {
  id: string;
  name: string;
  icon: string;
  color: string;
  chapters: ChapterData[];
}

export interface ClassCurriculum {
  classLevel: string;
  subjects: SubjectData[];
}

export const CBSE_CLASSES = [
  'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5',
  'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10',
  'Class 11', 'Class 12'
];

import { COMPREHENSIVE_CURRICULUM } from './curriculumData';
import { SENIOR_CURRICULUM } from './seniorCurriculumData';

export const CBSE_CURRICULUM: Record<string, SubjectData[]> = {
  ...COMPREHENSIVE_CURRICULUM,
  ...SENIOR_CURRICULUM,
  'Class 1': COMPREHENSIVE_CURRICULUM['Class 6'] || [],
  'Class 2': COMPREHENSIVE_CURRICULUM['Class 6'] || [],
  'Class 3': COMPREHENSIVE_CURRICULUM['Class 6'] || [],
  'Class 4': COMPREHENSIVE_CURRICULUM['Class 6'] || [],
  'Class 5': COMPREHENSIVE_CURRICULUM['Class 6'] || []
};

/**
 * Returns subjects for a specific class level, optionally filtered by the user's selected enrolled subjects.
 */
export function getCurriculumByClass(classLevel: string = 'Class 9', userSubjects?: string[]): SubjectData[] {
  const allSubjects = CBSE_CURRICULUM[classLevel] || CBSE_CURRICULUM['Class 9'] || [];
  if (!userSubjects || userSubjects.length === 0) {
    return allSubjects;
  }
  const filtered = allSubjects.filter(subj =>
    userSubjects.some(userSubj =>
      subj.name.toLowerCase().includes(userSubj.toLowerCase()) ||
      userSubj.toLowerCase().includes(subj.name.toLowerCase())
    )
  );
  return filtered.length > 0 ? filtered : allSubjects;
}

/**
 * Returns chapter list for a given class level and subject name.
 */
export function getChaptersForSubject(classLevel: string = 'Class 9', subjectName: string = 'Science'): ChapterData[] {
  const subjects = getCurriculumByClass(classLevel);
  const found = subjects.find(s =>
    s.name.toLowerCase().includes(subjectName.toLowerCase()) ||
    subjectName.toLowerCase().includes(s.name.toLowerCase())
  );
  return found?.chapters || [];
}

// Ready-to-use sample homework sheets for instant testing in Homework Scanner
export const SAMPLE_HOMEWORK_SHEETS = [
  {
    id: 'sample-maths-quad',
    title: 'Class 10 Maths: Quadratic Equations (Handwritten)',
    subject: 'Mathematics',
    classLevel: 'Class 10',
    chapter: 'Quadratic Equations',
    type: 'Handwritten Homework',
    text: `Student Homework - Assignment #4
Student: Rohan Sharma | Class 10-A | CBSE

Q1. Solve for x: 2x² - 7x + 3 = 0 using factorisation method.
Student's Solution:
2x² - 7x + 3 = 0
Product = 2 × 3 = 6, Sum = -7
Factors are -6 and -1.
2x² - 6x - x + 3 = 0
2x(x - 3) - 1(x - 3) = 0
(2x - 1)(x - 3) = 0
Therefore, x = 1/2 or x = 3.

Q2. Find the discriminant and nature of roots for: x² + 4x + 5 = 0.
Student's Solution:
a = 1, b = 4, c = 5
D = b² - 4ac
D = 4² - 4(1)(5)
D = 16 - 20 = -4
Student wrote: Since D = -4, the equation has two real and equal roots.`,
    previewImageBadge: '📐 Maths Worksheet',
    hasIntentionalMistake: true,
    mistakeNote: 'Q2 contains an intentional mistake in stating the nature of roots (negative discriminant means no real roots).'
  },
  {
    id: 'sample-science-light',
    title: 'Class 10 Science: Light Reflection & Refraction (Diagram Problem)',
    subject: 'Science',
    classLevel: 'Class 10',
    chapter: 'Light - Reflection and Refraction',
    type: 'Physics Numerical',
    text: `CBSE Science Homework - Chapter 10 Light
Name: Priya Verma | Date: 14/09/2026

Question:
A convex lens has a focal length of 20 cm. At what distance from the lens should an object of height 5 cm be placed so that it forms a real and inverted image at a distance of 30 cm on the other side of the lens? Also calculate the height of the image formed.

Student's Working:
Given:
Focal length of convex lens, f = +20 cm
Image distance, v = +30 cm (since real image is formed on other side)
Object height, h = 5 cm
To find: Object distance (u) and Image height (h')

Using lens formula:
1/f = 1/v - 1/u
1/20 = 1/30 - 1/u
1/u = 1/30 - 1/20
1/u = (2 - 3) / 60 = -1/60
Therefore, u = -60 cm.

Now for magnification:
m = h'/h = v/u
h'/5 = 30 / (-60)
h'/5 = -0.5
h' = -2.5 cm.
Conclusion: Object should be placed at 60 cm in front of the lens. Image height is 2.5 cm (inverted).`,
    previewImageBadge: '🔬 Science Numerical',
    hasIntentionalMistake: false,
    mistakeNote: 'Correct step-by-step solution following CBSE format.'
  },
  {
    id: 'sample-english-writing',
    title: 'Class 10 English: Formal Letter to the Editor (Handwritten)',
    subject: 'English',
    classLevel: 'Class 10',
    chapter: 'Formal Letter Writing',
    type: 'Writing Task',
    text: `Homework: Letter to the Editor regarding reckless driving in the locality.
Student: Aman Patel

Examination Hall
Delhi
15th September 2026

The Editor
The Times of India
New Delhi

Subject: Concern over reckless driving and road accidents in Mayur Vihar

Sir,
Through the esteemed columns of your reputed newspaper, I wish to draw the urgent attention of the concerned traffic authorities towards the escalating menace of rash and reckless driving in our residential locality.

Over the past three months, vehicles including two-wheelers and delivery vans speed through school zones without regard for speed limits. The lack of speed breakers and absence of traffic police at peak school hours has made crossing the streets dangerous for children and elderly residents.

I earnestly request the concerned authorities to install rumble strips, conduct regular speed checks, and impose strict penalties on violators before a tragic incident occurs.

Yours sincerely,
Aman Patel`,
    previewImageBadge: '✍️ English Letter',
    hasIntentionalMistake: false,
    mistakeNote: 'Well formatted formal letter checking CBSE format and language.'
  }
];
