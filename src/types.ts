export type GroupNumber = '1' | '2' | '3' | '4' | '5' | '6';

export type GroupStatus = 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'revision';

export interface GroupAreaInfo {
  groupNumber: GroupNumber;
  regionName: string;
  expectedObjects: string[];
  description: string;
}

export interface StudentGroupIdentity {
  groupName: string;
  className: string;
  groupNumber: GroupNumber;
  members: string[]; // 6 members
  assignedArea: string;
}

export interface InitialQuestions {
  objectsSeen: string;
  easiestObject: string;
  easiestReason: string;
  hardestObject: string;
  doubtfulObject: string;
}

export interface ObservationRow {
  id: string;
  objectName: string;
  visualFeature: string;
  reasonOrConjecture: string;
}

export interface PresentationObject {
  objectName: string;
  visualFeature: string;
  reasonOrEvidence: string;
}

export interface ReflectionAnswers {
  learnedToday: string;
  easiestLearned: string;
  hardestLearned: string;
  canIdentifyByShapeOnly: 'yes' | 'no' | null;
}

export interface GroupSubmission {
  id: string; // 'group1' to 'group6'
  groupNumber: GroupNumber;
  groupName: string;
  className: string;
  members: string[];
  assignedArea: string;
  imageUrl: string | null;
  answers: InitialQuestions;
  observations: ObservationRow[];
  presentationObjects: {
    obj1: PresentationObject;
    obj2: PresentationObject;
  };
  reflection: ReflectionAnswers;
  progress: number; // 0 to 100
  status: GroupStatus;
  startedAt: string | null;
  submittedAt: string | null;
  updatedAt: string;
}

export interface RubricScore {
  groupId: string;
  objectIdentification: number; // max 30
  visualReasoning: number;      // max 25
  completeness: number;         // max 20
  presentation: number;         // max 15
  reflection: number;           // max 10
  totalScore: number;           // max 100
  teacherFeedback: string;
  gradedAt: string;
  gradedBy: string;
}

export interface AppSettings {
  groupAreas: Record<string, string>;
  groupImages: Record<string, string>;
  timerDuration: number;
  timerStartedAt: number | null;
  timerIsRunning: boolean;
}

export type StudentStepKey =
  | 'identity'
  | 'instructions'
  | 'material'
  | 'image_observation'
  | 'table_objects'
  | 'presentation'
  | 'reflection'
  | 'summary_or_grade';

export interface StepDefinition {
  key: StudentStepKey;
  number: number;
  label: string;
  shortLabel: string;
  description: string;
}
