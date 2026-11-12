import { TeamMember, TeamRole, SpacecraftComponent } from '../types/game';

export interface MultiplayerRoom {
  roomCode: string;
  roomName: string;
  mode: 'coop' | 'competitive';
  missionId: string;
  isStarted: boolean;
  members: TeamMember[];
  sharedComponents: SpacecraftComponent[];
  activeVote?: {
    id: string;
    question: string;
    proposedBy: string;
    votes: Record<string, boolean>; // memberId -> true/false
    expiresAt: number;
    isPassed?: boolean;
  };
  activityLog: { id: string; time: string; text: string; role: TeamRole }[];
}

export const MultiplayerService = {
  createDemoRoom(roomName: string, mode: 'coop' | 'competitive', missionId: string, playerRole: TeamRole = 'director'): MultiplayerRoom {
    const code = Math.random().toString(36).substring(2, 7).toUpperCase();

    // Default simulated crew members for full 4-role team
    const simulatedMembers: TeamMember[] = [
      {
        id: 'user-player',
        name: 'You (Flight Lead)',
        role: playerRole,
        isReady: true,
        isHost: true,
        isSimulated: false
      },
      {
        id: 'bot-eng',
        name: 'Eng. Chen (Simulated)',
        role: playerRole === 'engineer' ? 'director' : 'engineer',
        isReady: true,
        isHost: false,
        isSimulated: true
      },
      {
        id: 'bot-sci',
        name: 'Dr. Aris Thorne (Simulated)',
        role: playerRole === 'scientist' ? 'systems' : 'scientist',
        isReady: true,
        isHost: false,
        isSimulated: true
      },
      {
        id: 'bot-sys',
        name: 'Ops. Marcus Vance (Simulated)',
        role: playerRole === 'systems' ? 'director' : 'systems',
        isReady: true,
        isHost: false,
        isSimulated: true
      }
    ];

    return {
      roomCode: code,
      roomName,
      mode,
      missionId,
      isStarted: false,
      members: simulatedMembers,
      sharedComponents: [],
      activityLog: [
        {
          id: 'log-1',
          time: 'T-00:15',
          text: `Mission Control Room [${code}] established. Secure data link active.`,
          role: 'director'
        },
        {
          id: 'log-2',
          time: 'T-00:12',
          text: 'Spacecraft Structural CAD workspace synchronized.',
          role: 'engineer'
        },
        {
          id: 'log-3',
          time: 'T-00:10',
          text: 'Science sensor integration profiles loaded for target planetary body.',
          role: 'scientist'
        }
      ]
    };
  },

  proposeDecision(room: MultiplayerRoom, question: string, proposerName: string): MultiplayerRoom {
    const voteId = 'vote-' + Date.now();
    const newVote = {
      id: voteId,
      question,
      proposedBy: proposerName,
      votes: {
        'user-player': true,
        'bot-eng': true,
        'bot-sci': Math.random() > 0.2, // Simulated votes
        'bot-sys': true
      },
      expiresAt: Date.now() + 30000,
      isPassed: true
    };

    return {
      ...room,
      activeVote: newVote,
      activityLog: [
        {
          id: 'act-' + Date.now(),
          time: 'NOW',
          text: `Formal vote called by ${proposerName}: "${question}" - [PASSED 3/4]`,
          role: 'director'
        },
        ...room.activityLog
      ]
    };
  }
};
