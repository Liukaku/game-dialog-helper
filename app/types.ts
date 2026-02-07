export interface Root {
  general: General;
  story: Story;
}

export interface General {
  optionsByTier: OptionsByTier[];
}

export interface OptionsByTier {
  tier: number;
  options: Option[];
}

export interface Option {
  key: string;
  image?: string;
  body: string;
  responses?: Response[];
}

export interface Response {
  body: string;
  next: string;
  vibe: number;
}

export interface Story {
  quests: Quest[];
}

export interface Quest {
  questUid: string;
  questStepIndex: number;
  options: Option2[];
}

export interface Option2 {
  key: string;
  image?: string;
  body: string;
  responses?: Response[];
  pages?: {
    body: string;
    responses?: Response[];
    vibe: number;
  }[];
  progressQuest?: boolean;
}
