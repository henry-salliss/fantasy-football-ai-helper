import React from 'react';
import { Brain, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, ArrowLeft } from 'lucide-react';
import type { TeamAnalysis as TeamAnalysisType, AISuggestion } from '../types/fantasy';

interface TeamAnalysisProps {
  analysis: TeamAnalysisType;
  onBack: () => void;
}

const TeamAnalysis: React.FC<TeamAnalysisProps> = ({ analysis, onBack }) => {
  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100';
      case 'B': return 'text-blue-600 bg-blue-100';
      case 'C': return 'text-yellow-600 bg-yellow-100';
      case 'D': return 'text-orange-600 bg-orange-100';
      case 'F': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <AlertTriangle size={16} />;
      case 'medium': return <TrendingUp size={16} />;
      case 'low': return <CheckCircle size={16} />;
      default: return <Brain size={16} />;
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'add': return <TrendingUp size={16} className="text-green-600" />;
      case 'drop': return <TrendingDown size={16} className="text-red-600" />;
      case 'start': return <CheckCircle size={16} className="text-blue-600" />;
      case 'bench': return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'trade': return <Brain size={16} className="text-purple-600" />;
      default: return <Brain size={16} className="text-gray-600" />;
    }
  };

  const highPrioritySuggestions = analysis.suggestions.filter(s => s.priority === 'high');
  const mediumPrioritySuggestions = analysis.suggestions.filter(s => s.priority === 'medium');
  const lowPrioritySuggestions = analysis.suggestions.filter(s => s.priority === 'low');

  return (
    <div className="max-w-6xl mx-auto p-6">
      <button
        onClick={onBack}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6"
      >
        <ArrowLeft size={16} className="mr-2" />
        Back to Team Import
      </button>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{analysis.team.name}</h1>
          <div className={`px-4 py-2 rounded-full text-2xl font-bold ${getGradeColor(analysis.overallGrade)}`}>
            {analysis.overallGrade}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Formation</h3>
            <p className="text-gray-900">{analysis.team.formation}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Total Players</h3>
            <p className="text-gray-900">{analysis.team.starting11.length + analysis.team.bench.length}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Projected Points</h3>
            <p className="text-gray-900">{analysis.team.totalProjectedPoints?.toFixed(1) || '0'}</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">Total Cost</h3>
            <p className="text-gray-900">£{analysis.team.totalCost}m</p>
          </div>
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center">
            <Brain className="mr-2" />
            AI Analysis Summary
          </h3>
          <p className="text-blue-800">{analysis.summary}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {analysis.strengths.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
              <CheckCircle className="mr-2" />
              Team Strengths
            </h2>
            <ul className="space-y-2">
              {analysis.strengths.map((strength, index) => (
                <li key={index} className="flex items-center text-green-700">
                  <CheckCircle size={16} className="mr-2 text-green-600" />
                  {strength}
                </li>
              ))}
            </ul>
          </div>
        )}

        {analysis.weaknesses.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-4 flex items-center">
              <AlertTriangle className="mr-2" />
              Areas for Improvement
            </h2>
            <ul className="space-y-2">
              {analysis.weaknesses.map((weakness, index) => (
                <li key={index} className="flex items-center text-red-700">
                  <AlertTriangle size={16} className="mr-2 text-red-600" />
                  {weakness}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6 flex items-center">
          <Brain className="mr-2" />
          AI Recommendations
        </h2>

        {highPrioritySuggestions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-red-800 mb-4 flex items-center">
              <AlertTriangle className="mr-2" />
              High Priority ({highPrioritySuggestions.length})
            </h3>
            <div className="space-y-4">
              {highPrioritySuggestions.map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
            </div>
          </div>
        )}

        {mediumPrioritySuggestions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-yellow-800 mb-4 flex items-center">
              <TrendingUp className="mr-2" />
              Medium Priority ({mediumPrioritySuggestions.length})
            </h3>
            <div className="space-y-4">
              {mediumPrioritySuggestions.map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
            </div>
          </div>
        )}

        {lowPrioritySuggestions.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
              <CheckCircle className="mr-2" />
              Low Priority ({lowPrioritySuggestions.length})
            </h3>
            <div className="space-y-4">
              {lowPrioritySuggestions.map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
            </div>
          </div>
        )}

        {analysis.suggestions.length === 0 && (
          <div className="text-center py-8">
            <CheckCircle size={48} className="mx-auto text-green-600 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Great Job!</h3>
            <p className="text-gray-600">No major issues found with your team. Keep up the good work!</p>
          </div>
        )}
      </div>
    </div>
  );
};

const SuggestionCard: React.FC<{ suggestion: AISuggestion }> = ({ suggestion }) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'low': return 'text-green-600 bg-green-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'add': return <TrendingUp size={16} className="text-green-600" />;
      case 'drop': return <TrendingDown size={16} className="text-red-600" />;
      case 'start': return <CheckCircle size={16} className="text-blue-600" />;
      case 'bench': return <AlertTriangle size={16} className="text-yellow-600" />;
      case 'trade': return <Brain size={16} className="text-purple-600" />;
      default: return <Brain size={16} className="text-gray-600" />;
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center">
          {getSuggestionIcon(suggestion.type)}
          <h4 className="font-semibold text-gray-900 ml-2">{suggestion.title}</h4>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(suggestion.priority)}`}>
          {suggestion.priority}
        </span>
      </div>
      
      <p className="text-gray-700 mb-3">{suggestion.description}</p>
      
      <div className="bg-gray-50 p-3 rounded-md">
        <p className="text-sm text-gray-600">
          <strong>Reasoning:</strong> {suggestion.reasoning}
        </p>
      </div>
      
      {suggestion.projectedImpact && (
        <div className="mt-3 flex items-center text-sm text-blue-600">
          <TrendingUp size={14} className="mr-1" />
          Projected Impact: +{suggestion.projectedImpact} points
        </div>
      )}
    </div>
  );
};

export default TeamAnalysis;
