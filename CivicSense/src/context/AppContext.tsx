import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Issue, User } from '../types';
import { mockIssues, mockUsers } from '../data/mockData';
import { fetchIssues, voteOnIssue as firebaseVoteOnIssue, submitIssueWithAI } from '../services/firebaseService';
import { useAuth } from './AuthContext';

interface AppContextType {
  issues: Issue[];
  currentUser: User | null;
  isAuthenticated: boolean;
  addIssue: (issue: Issue) => void;
  updateIssueStatus: (id: string, status: Issue['status']) => void;
  voteOnIssue: (id: string, vote: 'up' | 'down') => void;
  approveIssue: (id: string) => void;
  rejectIssue: (id: string) => void;
  checkImageAuthenticity: (id: string, angle: 'angle1' | 'angle2', result: 'real' | 'fake' | 'ai-generated') => void;
  voteOnPublicPoll: (id: string, vote: 'yes' | 'no') => void;
  processIssueWithAI: (image1: File, image2?: File, issueData?: Partial<Issue>) => Promise<Issue | null>;
  updateUserReportCount: (username: string) => void;
  login: (username: string) => void;
  logout: () => void;
  loading: boolean;
  isBackendConnected: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isBackendConnected, setIsBackendConnected] = useState(false);
  const { currentUser: authUser } = useAuth();

  // Sync with Firebase auth
  useEffect(() => {
    if (authUser) {
      setCurrentUser({
        id: authUser.uid,
        username: authUser.displayName || 'Anonymous',
        email: authUser.email || '',
        reportsCount: 0,
        validationScore: 0,
        badges: [],
        isAdmin: false
      });
      setIsAuthenticated(true);
    } else {
      setCurrentUser(null);
      setIsAuthenticated(false);
    }
  }, [authUser]);

  // Load issues from Firebase (Real-time)
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    // Dynamically import subscribeToIssues to avoid circular deps if any
    import('../services/firebaseService').then(({ subscribeToIssues, fetchIssues }) => {
      console.log('🔥 Connecting to backend (real-time)...');
      setLoading(true);

      unsubscribe = subscribeToIssues((data) => {
        console.log(`✅ Loaded ${data.length} reports from real-time listener`);
        setIssues(data);
        setIsBackendConnected(true);
        setLoading(false);

        if (data.length === 0) {
          console.log('⚠️ Backend empty, checking if we should load fallback?');
          // optional: fallback to mock if really empty? No, better show empty state.
        }
      });
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const addIssue = (issue: Issue) => {
    setIssues(prev => [...prev, issue]);
  };

  const updateIssueStatus = (id: string, status: Issue['status']) => {
    setIssues(prev =>
      prev.map(issue =>
        issue.id === id ? { ...issue, status } : issue
      )
    );
  };

  const voteOnIssue = (id: string, vote: 'up' | 'down') => {
    setIssues(prev =>
      prev.map(issue =>
        issue.id === id
          ? {
            ...issue,
            upvotes: vote === 'up' ? issue.upvotes + 1 : issue.upvotes,
            downvotes: vote === 'down' ? issue.downvotes + 1 : issue.downvotes
          }
          : issue
      )
    );
  };

  const approveIssue = (id: string) => {
    setIssues(prev =>
      prev.map(issue =>
        issue.id === id
          ? {
            ...issue,
            status: 'approved',
            adminApproved: true,
            publicVoting: { ...issue.publicVoting, enabled: true }
          }
          : issue
      )
    );
  };

  const rejectIssue = (id: string) => {
    setIssues(prev =>
      prev.map(issue =>
        issue.id === id
          ? {
            ...issue,
            status: 'rejected',
            adminApproved: false,
            publicVoting: { ...issue.publicVoting, enabled: false }
          }
          : issue
      )
    );
  };

  const checkImageAuthenticity = (id: string, angle: 'angle1' | 'angle2', result: 'real' | 'fake' | 'ai-generated') => {
    setIssues(prev =>
      prev.map(issue => {
        if (issue.id === id) {
          const updatedAuthenticity = {
            ...issue.imageAuthenticity,
            [angle]: result,
            checkedAt: new Date().toISOString(),
            checkedBy: currentUser?.username
          };

          // If any image is AI-generated, reject the issue
          const isAnyImageFake = updatedAuthenticity.angle1 === 'ai-generated' || updatedAuthenticity.angle2 === 'ai-generated';

          return {
            ...issue,
            imageAuthenticity: updatedAuthenticity,
            status: isAnyImageFake ? 'rejected' : issue.status,
            adminApproved: isAnyImageFake ? false : issue.adminApproved,
            publicVoting: {
              ...issue.publicVoting,
              enabled: isAnyImageFake ? false : issue.publicVoting.enabled
            }
          };
        }
        return issue;
      })
    );
  };

  const voteOnPublicPoll = async (id: string, vote: 'yes' | 'no') => {
    try {
      // Vote on Firebase using the Firebase service
      const success = await firebaseVoteOnIssue(id, vote);

      if (success) {
        // Update local state
        setIssues(prev => {
          const updatedIssues = prev.map(issue => {
            if (issue.id === id && issue.publicVoting.enabled) {
              const updatedVoting = {
                ...issue.publicVoting,
                yesVotes: vote === 'yes' ? issue.publicVoting.yesVotes + 1 : issue.publicVoting.yesVotes,
                noVotes: vote === 'no' ? issue.publicVoting.noVotes + 1 : issue.publicVoting.noVotes
              };

              return {
                ...issue,
                publicVoting: updatedVoting
              };
            }
            return issue;
          });

          return updatedIssues;
        });
      }
    } catch (error) {
      console.error('Failed to vote on issue:', error);
    }
  };

  const login = (username: string) => {
    const user = mockUsers.find(u => u.username === username);
    if (user) {
      setCurrentUser(user);
      setIsAuthenticated(true);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const updateUserReportCount = (username: string) => {
    if (currentUser && currentUser.username === username) {
      setCurrentUser(prev => prev ? { ...prev, reportsCount: prev.reportsCount + 1 } : null);
    }
  };

  const processIssueWithAI = async (image1: File, image2?: File, issueData?: Partial<Issue>): Promise<Issue | null> => {
    try {
      console.log('🤖 Starting AI processing...');
      console.log('📁 Issue Data:', issueData);



      // Production: Use Firebase service
      console.log('🚀 Using Firebase service for production');
      const result = await submitIssueWithAI(image1, image2, issueData);

      if (result.success && result.issue) {
        // Immediately add the issue to local state for instant UI update
        console.log('📊 Adding Firebase issue to local state:', result.issue);
        setIssues(prev => {
          const newIssues = [result.issue!, ...prev];
          console.log('🔄 Updated issues list length:', newIssues.length);
          return newIssues;
        });
        // Update user's report count
        updateUserReportCount(issueData?.reportedBy || 'anonymous');
        console.log('👤 Updated report count for user:', issueData?.reportedBy || 'anonymous');
        return result.issue;
      } else {
        return null;
      }
    } catch (error) {
      console.error('AI processing failed:', error);
      return null;
    }
  };

  return (
    <AppContext.Provider value={{
      issues,
      currentUser,
      isAuthenticated,
      addIssue,
      updateIssueStatus,
      voteOnIssue,
      approveIssue,
      rejectIssue,
      checkImageAuthenticity,
      voteOnPublicPoll,
      processIssueWithAI,
      updateUserReportCount,
      login,
      logout,
      loading,
      isBackendConnected
    }}>
      {children}
    </AppContext.Provider>
  );
};