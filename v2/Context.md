# Solo Leveling Fitness & Nutrition Tracker v2 — Session Context

## Overview

Single-file React 18 app (`index.html`) using useReducer state management, Babel standalone for JSX, localStorage persistence, and a MAKO dark color palette. Solo Leveling themed gamified fitness + nutrition tracker.

## Changes Made This Session

### 1. Reset to Zero

- Added a **RESET TO ZERO** button at the very bottom of the page
- Built `ResetConfirmationModal` — full-screen overlay with warning icon, CANCEL and CONFIRM RESET buttons
- Dispatches `RESET` to both fitness and nutrition reducers, restoring initial state with `loaded: true`

### 2. Edit Past Day

- Users can edit any of the **last 7 days** (yesterday through 7 days ago)
- Built `EditPastDayModal` with a horizontal date picker and fitness/nutrition tab switcher
- Added `TOGGLE_QUEST_FOR_DATE` action to fitnessReducer and `TOGGLE_ITEM_FOR_DATE` action to nutritionReducer
- When a past day is edited, **totalXp is recalculated from scratch** by iterating all log entries, level is recalculated via `recalcFitnessLevelFromXp()` / `recalcNutritionLevelFromXp()`, streak is recalculated backward from today, and weeklyGymLog is rebuilt
- EDIT PAST DAY buttons added to both fitness quests tab and nutrition meals tab

### 3. Rank Progression Repositioned

- Moved the Rank Progression display from inside the quests sub-tab to **after the PerformanceOverview component**, so it's visible regardless of which fitness sub-tab is selected

### 4. Responsive Design Audit

- All buttons: `minHeight: 44px` for touch targets
- Font sizes bumped across the board (e.g., 0.48→0.58, 0.5→0.6, 0.55→0.64rem)
- Quest cards: padding 10→12px, icon 36→38px, name font 0.88→0.92rem, desc 0.68→0.74rem
- DietCheckItem: padding 7→10px, checkbox 16→20px, text 0.78→0.84rem
- Date picker: switched from fixed `minWidth` to `flex: "1 1 0"` for equal distribution
- Heatmap: cell size 10→12px, added horizontal scroll with `-webkit-overflow-scrolling: touch`
- Stats rows: added `flexWrap: "wrap"`
- Added `-webkit-tap-highlight-color: transparent` globally
- Added tablet centering media query (`@media min-width: 768px`)

### 5. Automatic Daily Penalties (replaced manual End Day)

**Removed:**
- `handleFitnessPenalty` and `handleNutritionPenalty` functions
- END DAY buttons from both fitness and nutrition tabs (kept the "X QUESTS/ITEMS REMAINING" reminder text)

**Added:**
- `lastPenaltyDate` field to both `fitnessInitialState` and `nutritionInitialState`
- `lastPenaltyDate` persisted in `saveFitnessState` / `saveNutritionState` and loaded back
- `SET_LAST_PENALTY_DATE` action in both reducers
- Modified `APPLY_PENALTY` in both reducers to accept optional `penaltyCount` and `lastPenaltyDate`
- `RESET` action clears `lastPenaltyDate` to `null`
- **Auto-penalty useEffect** in the App component that runs on load after both states are ready:
  - First launch: grace period, sets `lastPenaltyDate` to yesterday with no penalty
  - Subsequent launches: loops from `lastPenaltyDate + 1` through yesterday
  - Fitness: counts missed daily quests per day × `DAILY_SKIP_PENALTY` (-15 XP each)
  - Nutrition: counts missed items per day, `floor(missed / 3)` × `NUTRITION_SKIP_PENALTY` (-8 XP each)
  - Dispatches accumulated penalty or just updates `lastPenaltyDate` if no penalty needed
  - After a reset, grace period kicks in again

## Key Constants

| Constant | Value |
|---|---|
| `DAILY_SKIP_PENALTY` | -15 XP per missed daily quest |
| `NUTRITION_SKIP_PENALTY` | -8 XP per 3 missed nutrition items |
| Daily fitness quests | 5 (stretch, core, pushups, squats, dogwalk) |
| Weekly quest | 1 (gym, target 3/week) |
| Total nutrition items | 24 (16 meal + 5 hydration + 3 alani rules) |

## Architecture Notes

- **Single file**: All components, reducers, styles, and data live in `index.html`
- **State**: Two independent `useReducer` stores — `fitnessState`/`fitnessDispatch` and `nutritionState`/`nutritionDispatch`
- **Persistence**: Custom `saveFitnessState`/`loadFitnessState` and `saveNutritionState`/`loadNutritionState` using localStorage
- **XP recalculation**: When editing past days, totalXp is rebuilt from scratch (not incrementally) to ensure accuracy
- **Streak**: Calculated by walking backward from today, counting consecutive days with all daily quests complete
- **Date keys**: `YYYY-MM-DD` format via `getDateKey()` using local time
