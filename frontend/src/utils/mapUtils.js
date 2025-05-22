export const npsCategories = [
  { id: 'excellent', label: "Excellent (≥ 75)", range: [75, 100], scoreForColor: 80 },
  { id: 'good', label: "Good (50-74)", range: [50, 74.999], scoreForColor: 60 },
  { id: 'fair', label: "Fair (25-49)", range: [25, 49.999], scoreForColor: 30 },
  { id: 'okay', label: "Okay (0-24)", range: [0, 24.999], scoreForColor: 10 },
  { id: 'improvement', label: "Needs Improvement (-25 to -1)", range: [-25, -0.001], scoreForColor: -10 },
  { id: 'poor', label: "Poor (-50 to -26)", range: [-50, -25.001], scoreForColor: -60 },
  { id: 'very_poor', label: "Very Poor (≤ -51)", range: [-100, -50.001], scoreForColor: -80 },
  { id: 'no_data', label: "No Data", range: null, scoreForColor: null },
];

export const getNpsColor = (nps, themeColors) => {
  if (nps === null || nps === undefined) return themeColors.grey[500]; // No Data
  if (nps >= 75) return themeColors.greenAccent[500]; // Excellent
  if (nps >= 50) return themeColors.greenAccent[400]; // Good
  if (nps >= 25) return themeColors.blueAccent[400];   // Fair - Adjusted for better distinction
  if (nps >= 0) return themeColors.primary[500];    // Okay - Using primary, can be adjusted
  if (nps >= -25) return themeColors.orangeAccent[500]; // Needs Improvement
  if (nps >= -50) return themeColors.redAccent[500];    // Poor
  return themeColors.redAccent[700]; // Very Poor
};

export const getBubbleRadius = (responses) => {
  if (responses === 0) return 2;
  if (responses < 10) return 5;
  if (responses < 50) return 8;
  if (responses < 100) return 11;
  if (responses < 500) return 15;
  if (responses < 1000) return 20;
  return 25;
};

// Helper to check if an NPS score falls into a specific category
export const scoreIsInNpsCategory = (npsScore, category) => {
  if (category.id === 'no_data') {
    return npsScore === null;
  }
  if (category.range && npsScore !== null) {
    return npsScore >= category.range[0] && npsScore <= category.range[1];
  }
  return false;
};