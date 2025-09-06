# Fantasy Premier League AI Helper

A React-based MVP application that helps Fantasy Premier League (FPL) managers analyze their teams and get AI-powered suggestions for improvements.

## Features

- **Quick Team Import**: Enter your FPL Team ID to instantly load your current team
- **Live FPL Data**: Real-time player data from the official Fantasy Premier League API
- **Formation Builder**: Choose from all FPL formations (3-4-3, 4-3-3, 5-3-2, etc.)
- **Automatic Projected Points**: AI calculates projected points based on form, fixtures, and performance
- **Budget Management**: Track spending against £100m FPL budget
- **Manual Team Building**: Build teams manually with player selectors and formation picker
- **AI Analysis**: Get intelligent suggestions for FPL team improvements
- **Position Analysis**: Optimized for English football positions (GK, DEF, MID, FWD)
- **Priority-based Recommendations**: High, medium, and low priority suggestions
- **Team Grading**: Overall team grade (A-F) based on composition and projected performance
- **Modern UI**: Clean, responsive design with custom CSS utilities

## Getting Started

### Prerequisites

- Node.js (v20.18.1 or higher)
- npm

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

### Building Your Team

1. **Select Formation**: Choose from 7 different FPL formations (3-4-3, 4-3-3, 5-3-2, etc.)
2. **Pick Players**: Select from live FPL players with real-time stats, prices, and AI-calculated projected points
3. **Budget Management**: Track your spending against the £100m FPL budget
4. **Export from FPL**: Click "Export from FPL" to import your existing team from the official website
5. **CSV Import**: Use the "Import CSV" button to upload a CSV file with your team data
6. **Sample Data**: Download a sample CSV file to see the correct format

### CSV Format

The CSV file should have the following format:
```
Player Name,Position,Team,Projected Points
Mohamed Salah,MID,LIV,13.0
Erling Haaland,FWD,MCI,14.0
Virgil van Dijk,DEF,LIV,6.2
Alisson,GK,LIV,5.8
```

**Positions**: GK (Goalkeeper), DEF (Defender), MID (Midfielder), FWD (Forward)

### Export from FPL Website

The app includes a built-in helper that provides:

- **Step-by-step guide** to export your team from the official FPL website
- **Browser bookmarklet** that automatically extracts your team data
- **Manual JavaScript code** for advanced users
- **Automatic CSV generation** with proper formatting

Click the "Export from FPL" button to access the complete guide.

### Quick Team Import by ID

The easiest way to get your team into the app is using your FPL Team ID:

1. **Find Your Team ID**: Go to your FPL team page and look at the URL
   - Example: `fantasy.premierleague.com/entry/1234567/event/1`
   - Your Team ID is: `1234567`

2. **Enter Team ID**: Paste your Team ID into the "Quick Team Import" section at the top of the page

3. **Load Team**: Click "Load Team" to automatically fetch and populate your current FPL team

4. **Analyze**: Your team will be loaded with all current players, formation, and stats ready for AI analysis

This method is much faster than CSV import and always uses the most current team data from the official FPL API.

### Live FPL Data Integration

The app connects to the official Fantasy Premier League API through a Vite proxy to provide:

- **Real-time Player Data**: All current FPL players with live stats
- **Current Prices**: Up-to-date player prices in millions (£)
- **Live Performance Stats**: Total points, form, and ownership percentages
- **Injury Status**: Current injury and availability information
- **Automatic Projections**: AI-calculated projected points based on form, performance, and availability
- **Fallback System**: If API is unavailable, uses curated static data to ensure app functionality
- **CORS Handling**: Uses Vite proxy to bypass browser CORS restrictions

### Formation System

Choose from all official FPL formations:

- **3-4-3**: Balanced attack with 3 forwards
- **3-5-2**: Midfield-heavy with 2 forwards  
- **4-3-3**: Classic formation with 3 forwards
- **4-4-2**: Traditional balanced formation
- **4-5-1**: Defensive with 1 forward
- **5-3-2**: Very defensive with 5 defenders
- **5-4-1**: Ultra-defensive formation

### AI Analysis

Once you submit your team, the AI will:
- Analyze your team composition for FPL optimization
- Identify positional needs (GK, DEF, MID, FWD)
- Check for fixture conflicts and rotation risks
- Evaluate player performance and value
- Provide prioritized suggestions for transfers
- Give your team an overall grade

## Sample Data

A sample CSV file (`sample-team.csv`) is included for testing purposes.

## Technology Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Custom CSS utilities
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Linting**: ESLint

## Project Structure

```
src/
├── components/
│   ├── TeamImport.tsx      # Team input form
│   └── TeamAnalysis.tsx    # Results display
├── services/
│   └── aiService.ts        # AI analysis logic
├── types/
│   └── fantasy.ts          # TypeScript interfaces
├── App.tsx                 # Main application
└── main.tsx               # Entry point
```

## Future Enhancements

- Real AI API integration
- FPL player database integration
- Transfer suggestions with price analysis
- Fixture difficulty analysis
- Captain and vice-captain recommendations
- Chip strategy suggestions (Wildcard, Free Hit, etc.)
- Historical performance analysis
- Mobile app version

## Contributing

This is an MVP version. Feel free to submit issues or feature requests!
