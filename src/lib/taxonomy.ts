export const REGIONS = {
  europe: 'Europe',
  'north-america': 'North America',
  'south-america': 'South America',
  africa: 'Africa',
  asia: 'Asia & Middle East',
  oceania: 'Oceania',
} as const;

/** Filing drawers. Each case sits in exactly one. `blurb` is the flavour text on the drawer page. */
export const CATEGORIES = {
  murder: {
    label: 'Murder trials',
    numeral: 'I',
    blurb: 'One victim, one dock, twelve strangers. The oldest drama in the courtroom: poison, pistols, passion and the long argument over who was in the room.',
  },
  serial: {
    label: 'Serial & mass murder',
    numeral: 'II',
    blurb: 'Killers who went on until somebody stopped them. The sketch artist often had the only likeness the public would ever see.',
  },
  mob: {
    label: 'Mob & organised crime',
    numeral: 'III',
    blurb: 'Families, crews and cartels in the dock. Wiretaps, turncoats, and defendants who smiled for the artist.',
  },
  assassination: {
    label: 'Assassinations & attacks',
    numeral: 'IV',
    blurb: 'Shots fired at presidents, ministers and judges. The trials that tried to explain a single violent minute.',
  },
  terror: {
    label: 'Terror & extremism',
    numeral: 'V',
    blurb: 'Bombers, plotters and preachers. Anarchists in the nineteenth century, jihadists and militias in the twentieth and twenty-first.',
  },
  spies: {
    label: 'Spies & treason',
    numeral: 'VI',
    blurb: 'Secrets, leaks and betrayals. Cases where the real evidence was classified and the verdict was a matter of national mood.',
  },
  political: {
    label: 'Political trials',
    numeral: 'VII',
    blurb: 'States putting their opponents on trial, and opponents putting the state on trial. Show trials, protest trials and impeachments.',
  },
  war: {
    label: 'War crimes & tribunals',
    numeral: 'VIII',
    blurb: 'Judges in uniform, interpreters in headphones. Atrocity, command responsibility and the first attempts at international law.',
  },
  fraud: {
    label: 'Fraud & corruption',
    numeral: 'IX',
    blurb: 'Bribes, rings, impostors and pyramids. The paper trail is the murder weapon.',
  },
  celebrity: {
    label: 'Celebrity trials',
    numeral: 'X',
    blurb: 'Famous faces in plain wooden chairs. Cameras were kept out, so the pencil drew the spectacle.',
  },
  wrongful: {
    label: 'Wrongful convictions',
    numeral: 'XI',
    blurb: 'Verdicts that did not survive the truth. Confessions, mobs, bad science and the slow work of appeals.',
  },
  landmark: {
    label: 'Landmark law & society',
    numeral: 'XII',
    blurb: 'Cases that changed a rule: free speech, schooling, science, books and the limits of self-defence.',
  },
  inquiry: {
    label: 'Inquiries & hearings',
    numeral: 'XIII',
    blurb: 'No defendant, but a witness table under bright light. Senate rooms, naval boards and confirmation hearings.',
  },
} as const;

export const VERDICTS = {
  guilty: { label: 'Guilty', tone: 'red' },
  acquitted: { label: 'Acquitted', tone: 'green' },
  overturned: { label: 'Overturned', tone: 'amber' },
  mixed: { label: 'Mixed verdict', tone: 'amber' },
  hung: { label: 'Hung jury', tone: 'amber' },
  dismissed: { label: 'Dismissed', tone: 'blue' },
  settled: { label: 'Settled', tone: 'blue' },
  ruling: { label: 'Ruling issued', tone: 'blue' },
  inquiry: { label: 'Inquiry', tone: 'blue' },
} as const;

export type RegionKey = keyof typeof REGIONS;
export type CategoryKey = keyof typeof CATEGORIES;
export type VerdictKey = keyof typeof VERDICTS;

export const regionKeys = Object.keys(REGIONS) as [RegionKey, ...RegionKey[]];
export const categoryKeys = Object.keys(CATEGORIES) as [CategoryKey, ...CategoryKey[]];
export const verdictKeys = Object.keys(VERDICTS) as [VerdictKey, ...VerdictKey[]];

export function categoryLabel(k: CategoryKey): string {
  return CATEGORIES[k].label;
}
