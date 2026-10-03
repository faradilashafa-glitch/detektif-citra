import React, { useState, useEffect } from 'react';
import {
  GroupNumber,
  GroupSubmission,
  RubricScore,
  AppSettings,
  StudentGroupIdentity
} from './types';
import {
  subscribeToGroups,
  subscribeToScores,
  subscribeToSettings,
  INITIAL_DEFAULT_GROUPS,
  INITIAL_DEFAULT_SETTINGS,
  saveGroupProgress,
  signOutUser
} from './services/firebase';
import { LandingPage } from './components/LandingPage';
import { StudentRegistration } from './components/StudentRegistration';
import { StudentLKPD } from './components/StudentLKPD';
import { OperatorLogin } from './components/OperatorLogin';
import { OperatorDashboard } from './components/OperatorDashboard';
import { GROUP_AREAS } from './utils/constants';

type AppView = 'landing' | 'student_register' | 'student_lkpd' | 'operator_login' | 'operator_dashboard';

export default function App() {
  const [view, setView] = useState<AppView>('landing');
  const [groups, setGroups] = useState<Record<string, GroupSubmission>>(INITIAL_DEFAULT_GROUPS);
  const [scores, setScores] = useState<Record<string, RubricScore>>({});
  const [settings, setSettings] = useState<AppSettings>(INITIAL_DEFAULT_SETTINGS);

  // Active student group state
  const [activeGroupNumber, setActiveGroupNumber] = useState<GroupNumber>('1');

  // Authenticated operator state
  const [operatorEmail, setOperatorEmail] = useState<string | null>(null);

  // Subscribe to Firestore realtime updates
  useEffect(() => {
    const unsubGroups = subscribeToGroups((updatedGroups) => {
      setGroups(updatedGroups);
    });

    const unsubScores = subscribeToScores((updatedScores) => {
      setScores(updatedScores);
    });

    const unsubSettings = subscribeToSettings((updatedSettings) => {
      setSettings(updatedSettings);
    });

    return () => {
      unsubGroups();
      unsubScores();
      unsubSettings();
    };
  }, []);

  // Handle student registration submission
  const handleStudentRegister = async (identity: StudentGroupIdentity) => {
    setActiveGroupNumber(identity.groupNumber);
    const groupId = `group${identity.groupNumber}`;
    const existing = groups[groupId] || INITIAL_DEFAULT_GROUPS[groupId];

    // Check if image is available from settings
    const assignedImage = settings.groupImages[identity.groupNumber] || existing.imageUrl || null;

    const updatedSubmission: GroupSubmission = {
      ...existing,
      id: groupId,
      groupNumber: identity.groupNumber,
      groupName: identity.groupName,
      className: identity.className,
      members: identity.members,
      assignedArea: GROUP_AREAS[identity.groupNumber].regionName,
      imageUrl: assignedImage,
      status: existing.status === 'not_started' ? 'in_progress' : existing.status,
      startedAt: existing.startedAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    // Save to Firestore & local backup
    await saveGroupProgress(updatedSubmission);
    setView('student_lkpd');
  };

  // Handle operator login success
  const handleOperatorLoginSuccess = (email: string) => {
    setOperatorEmail(email);
    setView('operator_dashboard');
  };

  // Handle operator logout
  const handleOperatorLogout = async () => {
    try {
      await signOutUser();
    } catch {
      // ignore
    }
    setOperatorEmail(null);
    setView('landing');
  };

  // Active group data
  const currentGroupId = `group${activeGroupNumber}`;
  const currentGroupData: GroupSubmission = groups[currentGroupId]
    ? {
        ...groups[currentGroupId],
        imageUrl: settings.groupImages[activeGroupNumber] || groups[currentGroupId].imageUrl || null
      }
    : INITIAL_DEFAULT_GROUPS[currentGroupId];

  const currentGroupScore = scores[currentGroupId] || null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* View Routing */}
      {view === 'landing' && (
        <LandingPage
          onSelectStudent={() => setView('student_register')}
          onSelectOperator={() => {
            if (operatorEmail) {
              setView('operator_dashboard');
            } else {
              setView('operator_login');
            }
          }}
        />
      )}

      {view === 'student_register' && (
        <StudentRegistration
          initialGroupNumber={activeGroupNumber}
          initialIdentity={{
            groupNumber: activeGroupNumber,
            groupName: currentGroupData.groupName,
            className: currentGroupData.className,
            members: currentGroupData.members,
            assignedArea: GROUP_AREAS[activeGroupNumber].regionName
          }}
          onRegister={handleStudentRegister}
          onBackToHome={() => setView('landing')}
        />
      )}

      {view === 'student_lkpd' && (
        <StudentLKPD
          initialSubmission={currentGroupData}
          score={currentGroupScore}
          onBackToHome={() => setView('landing')}
        />
      )}

      {view === 'operator_login' && (
        <OperatorLogin
          onLoginSuccess={handleOperatorLoginSuccess}
          onBackToHome={() => setView('landing')}
        />
      )}

      {view === 'operator_dashboard' && (
        <OperatorDashboard
          groups={groups}
          scores={scores}
          settings={settings}
          operatorEmail={operatorEmail || 'Guru Geografi'}
          onLogout={handleOperatorLogout}
        />
      )}
    </div>
  );
}
