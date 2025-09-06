import React, { useState } from 'react';
import { ExternalLink, Download, Copy, Check, AlertCircle, Info } from 'lucide-react';

interface FPLExportHelperProps {
  onClose: () => void;
}

const FPLExportHelper: React.FC<FPLExportHelperProps> = ({ onClose }) => {
  const [activeStep, setActiveStep] = useState(1);
  const [copied, setCopied] = useState(false);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const bookmarkletCode = `javascript:(function(){
    var players = [];
    var playerElements = document.querySelectorAll('.pitch-element');
    
    playerElements.forEach(function(element) {
      var name = element.querySelector('.player-name')?.textContent?.trim();
      var position = element.querySelector('.player-position')?.textContent?.trim();
      var team = element.querySelector('.player-team')?.textContent?.trim();
      
      if (name && position && team) {
        var positionMap = {
          'GKP': 'GK',
          'DEF': 'DEF', 
          'MID': 'MID',
          'FWD': 'FWD'
        };
        
        players.push(name + ',' + (positionMap[position] || position) + ',' + team + ',0');
      }
    });
    
    var csv = 'Name,Position,Team,ProjectedPoints\\n' + players.join('\\n');
    var blob = new Blob([csv], { type: 'text/csv' });
    var url = window.URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'fpl-team.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  })();`;

  const steps = [
    {
      id: 1,
      title: "Go to Fantasy Premier League",
      description: "Visit the official FPL website and log into your account",
      action: (
        <a 
          href="https://fantasy.premierleague.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <ExternalLink size={16} className="mr-2" />
          Open FPL Website
        </a>
      )
    },
    {
      id: 2,
      title: "Navigate to Your Team",
      description: "Click on 'My Team' in the navigation menu to view your current squad",
      action: (
        <div className="text-sm text-gray-600">
          <p>• Click "My Team" in the top navigation</p>
          <p>• Make sure you're on the "Pitch" view</p>
        </div>
      )
    },
    {
      id: 3,
      title: "Export Your Team Data",
      description: "Use one of these methods to get your team data:",
      action: (
        <div className="space-y-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2 flex items-center">
              <Download size={16} className="mr-2" />
              Method 1: Browser Bookmarklet (Recommended)
            </h4>
            <p className="text-sm text-blue-800 mb-3">
              Drag this button to your bookmarks bar, then click it while on your FPL team page:
            </p>
            <a 
              href={bookmarkletCode}
              className="inline-block px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
              onDragStart={(e) => e.preventDefault()}
            >
              📊 Export FPL Team
            </a>
            <p className="text-xs text-blue-700 mt-2">
              This will automatically download a CSV file with your team data
            </p>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-2 flex items-center">
              <Copy size={16} className="mr-2" />
              Method 2: Manual Copy & Paste
            </h4>
            <p className="text-sm text-gray-700 mb-3">
              Copy this JavaScript code and run it in your browser's console:
            </p>
            <div className="bg-gray-800 text-green-400 p-3 rounded text-xs font-mono overflow-x-auto">
              <pre>{bookmarkletCode}</pre>
            </div>
            <button
              onClick={() => copyToClipboard(bookmarkletCode)}
              className="mt-2 flex items-center px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700"
            >
              {copied ? <Check size={14} className="mr-1" /> : <Copy size={14} className="mr-1" />}
              {copied ? 'Copied!' : 'Copy Code'}
            </button>
          </div>
        </div>
      )
    },
    {
      id: 4,
      title: "Import to Our App",
      description: "Use the CSV file you downloaded to import your team",
      action: (
        <div className="text-sm text-gray-600">
          <p>• Click the "Import CSV" button above</p>
          <p>• Select the downloaded CSV file</p>
          <p>• Your team will be automatically loaded</p>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Export Your FPL Team</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="mb-6">
            <div className="flex items-center mb-4">
              <Info size={20} className="text-blue-600 mr-2" />
              <p className="text-gray-700">
                Follow these steps to export your Fantasy Premier League team and import it into our AI analyzer.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold mr-4 ${
                    activeStep >= step.id 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step.id}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {step.description}
                    </p>
                    {step.action}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start">
              <AlertCircle size={20} className="text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Important Notes:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Make sure you're logged into your FPL account</li>
                  <li>• The export will include your current starting XI</li>
                  <li>• Projected points will be set to 0 (you can edit them after import)</li>
                  <li>• If the bookmarklet doesn't work, try the manual console method</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
            >
              Got it!
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FPLExportHelper;
