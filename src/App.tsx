import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import TeamBuilder from './components/TeamBuilder';
import TeamAnalysis from './components/TeamAnalysis';
import type { FantasyTeam, TeamAnalysis as TeamAnalysisType } from './types/fantasy';
import { AIService } from './services/aiService';
import './App.css';

type AppState = 'import' | 'analyzing' | 'results';

function App() {
  const [appState, setAppState] = useState<AppState>('import');
  const [analysis, setAnalysis] = useState<TeamAnalysisType | null>(null);

  const handleTeamSubmit = async (team: FantasyTeam) => {
    setAppState('analyzing');
    try {
      const teamAnalysis = await AIService.analyzeTeam(team);
      setAnalysis(teamAnalysis);
      setAppState('results');
    } catch (error) {
      console.error('Error analyzing team:', error);
      // In a real app, you'd show an error message to the user
      setAppState('import');
    }
  };

  const handleBackToImport = () => {
    setAppState('import');
    setAnalysis(null);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {appState === 'import' && (
        <div className="py-8">
          <TeamBuilder onTeamSubmit={handleTeamSubmit} />
        </div>
      )}

      {appState === 'analyzing' && (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 text-blue-600 animate-spin mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Analyzing Your Team</h2>
            <p className="text-gray-600">Our AI is evaluating your fantasy football team...</p>
          </div>
        </div>
      )}

      {appState === 'results' && analysis && (
        <div className="py-8">
          <TeamAnalysis analysis={analysis} onBack={handleBackToImport} />
        </div>
      )}
    </div>
  );
}

export default App;
