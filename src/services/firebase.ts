import { initializeApp, getApps } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  onSnapshot,
  getDocFromServer
} from 'firebase/firestore';
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject
} from 'firebase/storage';
import firebaseConfig from '../../firebase-applet-config.json';
import {
  AppSettings,
  GroupNumber,
  GroupSubmission,
  GroupStatus,
  RubricScore
} from '../types';
import { GROUP_AREAS, createDefaultGroupSubmission } from '../utils/constants';

// Firebase initialization
const app = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const storage = getStorage(app);

// Google Auth Provider
export const googleAuthProvider = new GoogleAuthProvider();

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write'
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const currentUser = auth.currentUser;
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: currentUser?.uid,
      email: currentUser?.email,
      emailVerified: currentUser?.emailVerified,
      isAnonymous: currentUser?.isAnonymous,
      tenantId: currentUser?.tenantId,
      providerInfo: currentUser?.providerData?.map((p) => ({
        providerId: p.providerId,
        email: p.email
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot per Firebase skill directive
export async function testConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or network is restricted.');
    }
    return false;
  }
}
testConnection().catch(() => {});

// LocalStorage helpers for temporary offline resilience
const LOCAL_GROUPS_KEY = 'geoexplore_groups_backup';
const LOCAL_SCORES_KEY = 'geoexplore_scores_backup';
const LOCAL_SETTINGS_KEY = 'geoexplore_settings_backup';

function loadLocalBackup<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveLocalBackup(key: string, data: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to save to localStorage backup', err);
  }
}

// Default initial state for 6 groups
export const INITIAL_DEFAULT_GROUPS: Record<string, GroupSubmission> = {
  group1: createDefaultGroupSubmission('1'),
  group2: createDefaultGroupSubmission('2'),
  group3: createDefaultGroupSubmission('3'),
  group4: createDefaultGroupSubmission('4'),
  group5: createDefaultGroupSubmission('5'),
  group6: createDefaultGroupSubmission('6')
};

// Initial default settings
export const INITIAL_DEFAULT_SETTINGS: AppSettings = {
  groupAreas: {
    '1': GROUP_AREAS['1'].regionName,
    '2': GROUP_AREAS['2'].regionName,
    '3': GROUP_AREAS['3'].regionName,
    '4': GROUP_AREAS['4'].regionName,
    '5': GROUP_AREAS['5'].regionName,
    '6': GROUP_AREAS['6'].regionName
  },
  groupImages: {},
  timerDuration: 2700, // 45 minutes
  timerStartedAt: null,
  timerIsRunning: false
};

// ======================= FIRESTORE LISTENERS =======================

/**
 * Subscribe to realtime updates for all 6 groups
 */
export function subscribeToGroups(
  onUpdate: (groups: Record<string, GroupSubmission>) => void
): () => void {
  const collectionRef = collection(db, 'groups');
  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const backup = loadLocalBackup<Record<string, GroupSubmission>>(LOCAL_GROUPS_KEY, INITIAL_DEFAULT_GROUPS);
      const groupsMap: Record<string, GroupSubmission> = { ...backup };

      snapshot.forEach((docSnap) => {
        const data = docSnap.data() as Partial<GroupSubmission>;
        const groupId = docSnap.id;
        const gNum = (data.groupNumber || groupId.replace('group', '')) as GroupNumber;

        groupsMap[groupId] = {
          ...createDefaultGroupSubmission(gNum),
          ...data,
          id: groupId,
          groupNumber: gNum
        };
      });

      saveLocalBackup(LOCAL_GROUPS_KEY, groupsMap);
      onUpdate(groupsMap);
    },
    (error) => {
      console.warn('Firestore groups subscription fallback to backup:', error);
      const backup = loadLocalBackup<Record<string, GroupSubmission>>(LOCAL_GROUPS_KEY, INITIAL_DEFAULT_GROUPS);
      onUpdate(backup);
    }
  );

  return unsubscribe;
}

/**
 * Subscribe to realtime updates for all scores
 */
export function subscribeToScores(
  onUpdate: (scores: Record<string, RubricScore>) => void
): () => void {
  const collectionRef = collection(db, 'scores');
  const unsubscribe = onSnapshot(
    collectionRef,
    (snapshot) => {
      const scoresMap: Record<string, RubricScore> = {};
      snapshot.forEach((docSnap) => {
        scoresMap[docSnap.id] = docSnap.data() as RubricScore;
      });
      saveLocalBackup(LOCAL_SCORES_KEY, scoresMap);
      onUpdate(scoresMap);
    },
    (error) => {
      console.warn('Firestore scores subscription fallback to backup:', error);
      const backup = loadLocalBackup<Record<string, RubricScore>>(LOCAL_SCORES_KEY, {});
      onUpdate(backup);
    }
  );

  return unsubscribe;
}

/**
 * Subscribe to global settings (areas, group images, timer)
 */
export function subscribeToSettings(
  onUpdate: (settings: AppSettings) => void
): () => void {
  const settingDocRef = doc(db, 'settings', 'global');
  const unsubscribe = onSnapshot(
    settingDocRef,
    (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as AppSettings;
        saveLocalBackup(LOCAL_SETTINGS_KEY, data);
        onUpdate(data);
      } else {
        const backup = loadLocalBackup<AppSettings>(LOCAL_SETTINGS_KEY, INITIAL_DEFAULT_SETTINGS);
        onUpdate(backup);
      }
    },
    (error) => {
      console.warn('Firestore settings subscription fallback to backup:', error);
      const backup = loadLocalBackup<AppSettings>(LOCAL_SETTINGS_KEY, INITIAL_DEFAULT_SETTINGS);
      onUpdate(backup);
    }
  );

  return unsubscribe;
}

// ======================= GROUP WRITES =======================

/**
 * Save student group progress (draft / temporary save or auto-save)
 */
export async function saveGroupProgress(group: GroupSubmission): Promise<void> {
  const groupId = group.id || `group${group.groupNumber}`;
  const docRef = doc(db, 'groups', groupId);
  const now = new Date().toISOString();

  // Local backup update immediately
  const localBackup = loadLocalBackup<Record<string, GroupSubmission>>(LOCAL_GROUPS_KEY, INITIAL_DEFAULT_GROUPS);
  localBackup[groupId] = {
    ...group,
    id: groupId,
    updatedAt: now
  };
  saveLocalBackup(LOCAL_GROUPS_KEY, localBackup);

  const payload: Partial<GroupSubmission> = {
    id: groupId,
    groupNumber: group.groupNumber,
    groupName: group.groupName || `Kelompok ${group.groupNumber}`,
    className: group.className || 'X',
    members: group.members || [],
    assignedArea: group.assignedArea || GROUP_AREAS[group.groupNumber].regionName,
    imageUrl: group.imageUrl || null,
    answers: group.answers,
    observations: group.observations,
    presentationObjects: group.presentationObjects,
    reflection: group.reflection,
    progress: group.progress,
    status: group.status === 'not_started' ? 'in_progress' : group.status,
    startedAt: group.startedAt || now,
    updatedAt: now
  };

  try {
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `groups/${groupId}`);
  }
}

/**
 * Final submit group LKPD
 */
export async function submitGroupLKPD(group: GroupSubmission): Promise<void> {
  const groupId = group.id || `group${group.groupNumber}`;
  const docRef = doc(db, 'groups', groupId);
  const now = new Date().toISOString();

  const payload: Partial<GroupSubmission> = {
    ...group,
    id: groupId,
    status: 'submitted',
    submittedAt: now,
    updatedAt: now,
    progress: 100
  };

  // Local mirror
  const localBackup = loadLocalBackup<Record<string, GroupSubmission>>(LOCAL_GROUPS_KEY, INITIAL_DEFAULT_GROUPS);
  localBackup[groupId] = { ...localBackup[groupId], ...payload } as GroupSubmission;
  saveLocalBackup(LOCAL_GROUPS_KEY, localBackup);

  try {
    await setDoc(docRef, payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `groups/${groupId}`);
  }
}

/**
 * Teacher reopens group submission for revision
 */
export async function reopenGroupSubmission(groupId: string): Promise<void> {
  const docRef = doc(db, 'groups', groupId);
  const now = new Date().toISOString();

  // Local mirror
  const localBackup = loadLocalBackup<Record<string, GroupSubmission>>(LOCAL_GROUPS_KEY, INITIAL_DEFAULT_GROUPS);
  if (localBackup[groupId]) {
    localBackup[groupId].status = 'revision';
    localBackup[groupId].updatedAt = now;
    saveLocalBackup(LOCAL_GROUPS_KEY, localBackup);
  }

  try {
    await updateDoc(docRef, {
      status: 'revision',
      updatedAt: now
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `groups/${groupId}`);
  }
}

// ======================= SCORING WRITES =======================

/**
 * Teacher saves rubric score and comments
 */
export async function saveRubricScore(score: RubricScore): Promise<void> {
  const docRef = doc(db, 'scores', score.groupId);
  const groupDocRef = doc(db, 'groups', score.groupId);
  const now = new Date().toISOString();

  const validatedScore: RubricScore = {
    groupId: score.groupId,
    objectIdentification: Math.min(30, Math.max(0, Number(score.objectIdentification) || 0)),
    visualReasoning: Math.min(25, Math.max(0, Number(score.visualReasoning) || 0)),
    completeness: Math.min(20, Math.max(0, Number(score.completeness) || 0)),
    presentation: Math.min(15, Math.max(0, Number(score.presentation) || 0)),
    reflection: Math.min(10, Math.max(0, Number(score.reflection) || 0)),
    totalScore: 0,
    teacherFeedback: score.teacherFeedback || '',
    gradedAt: now,
    gradedBy: auth.currentUser?.email || 'Guru Geografi'
  };

  validatedScore.totalScore =
    validatedScore.objectIdentification +
    validatedScore.visualReasoning +
    validatedScore.completeness +
    validatedScore.presentation +
    validatedScore.reflection;

  // Local backup
  const localScores = loadLocalBackup<Record<string, RubricScore>>(LOCAL_SCORES_KEY, {});
  localScores[score.groupId] = validatedScore;
  saveLocalBackup(LOCAL_SCORES_KEY, localScores);

  try {
    await setDoc(docRef, validatedScore);
    // Also update group status to 'graded'
    await updateDoc(groupDocRef, {
      status: 'graded',
      updatedAt: now
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `scores/${score.groupId}`);
  }
}

// ======================= IMAGE MANAGEMENT =======================

/**
 * Upload an image file for a group.
 * Compresses the image and stores it with high reliability.
 */
export async function uploadGroupImageFile(groupNumber: GroupNumber, file: File): Promise<string> {
  const groupId = `group${groupNumber}`;

  // Read as base64 data URL for fast, reliable storage and fallback
  const base64Data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        // Compress if larger than 1600px width
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1600;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.85));
        } else {
          resolve(e.target?.result as string);
        }
      };
      img.onerror = () => resolve(e.target?.result as string);
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  // Try saving to Firebase Storage if available, else store in Firestore settings
  let finalUrl = base64Data;
  try {
    const storageReference = ref(storage, `group_images/${groupId}_${Date.now()}`);
    const uploadResult = await uploadBytes(storageReference, file);
    const downloadUrl = await getDownloadURL(uploadResult.ref);
    if (downloadUrl) finalUrl = downloadUrl;
  } catch (storageErr) {
    console.warn('Firebase Storage upload notice (using optimized data URL):', storageErr);
  }

  // Update Firestore settings
  const settingsDocRef = doc(db, 'settings', 'global');
  const groupDocRef = doc(db, 'groups', groupId);

  try {
    await setDoc(
      settingsDocRef,
      {
        groupImages: {
          [groupNumber]: finalUrl
        }
      },
      { merge: true }
    );
    await updateDoc(groupDocRef, {
      imageUrl: finalUrl
    }).catch(() => {});
  } catch (error) {
    console.warn('Settings doc write notice:', error);
  }

  // Update local backup
  const localSettings = loadLocalBackup<AppSettings>(LOCAL_SETTINGS_KEY, INITIAL_DEFAULT_SETTINGS);
  localSettings.groupImages = {
    ...localSettings.groupImages,
    [groupNumber]: finalUrl
  };
  saveLocalBackup(LOCAL_SETTINGS_KEY, localSettings);

  return finalUrl;
}

/**
 * Remove image for a specific group
 */
export async function removeGroupImage(groupNumber: GroupNumber): Promise<void> {
  const groupId = `group${groupNumber}`;
  const settingsDocRef = doc(db, 'settings', 'global');
  const groupDocRef = doc(db, 'groups', groupId);

  const localSettings = loadLocalBackup<AppSettings>(LOCAL_SETTINGS_KEY, INITIAL_DEFAULT_SETTINGS);
  delete localSettings.groupImages[groupNumber];
  saveLocalBackup(LOCAL_SETTINGS_KEY, localSettings);

  try {
    await setDoc(
      settingsDocRef,
      {
        groupImages: {
          [groupNumber]: null
        }
      },
      { merge: true }
    );
    await updateDoc(groupDocRef, {
      imageUrl: null
    }).catch(() => {});
  } catch (error) {
    console.warn('Notice removing group image:', error);
  }
}

// ======================= AUTH & TEACHER HELPERS =======================

/**
 * Sign in as teacher with Google popup
 */
export async function signInTeacherWithGoogle(): Promise<User> {
  const result = await signInWithPopup(auth, googleAuthProvider);
  return result.user;
}

/**
 * Sign out
 */
export async function signOutUser(): Promise<void> {
  await signOut(auth);
}

/**
 * Check if user is teacher / admin
 */
export function isUserTeacher(user: User | null): boolean {
  if (!user) return false;
  // Operator email or authorized domain
  if (user.email === 'faradilashafa@gmail.com') return true;
  // Allow all logged-in Google accounts on operator page to test/manage class if configured
  return Boolean(user.email);
}
