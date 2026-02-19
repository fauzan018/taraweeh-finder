// Color palette and app constants for Taraweeh Finder

export const COLORS = {
  background: '#020617',
  surface: '#0B1220',
  card: '#111827',
  primary: '#22c55e',
};

export const INDIA_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir',
  'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra',
  'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab',
  'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh',
  'Uttarakhand', 'West Bengal'
];

// Default location (center of India)
export const DEFAULT_CENTER: [number, number] = [20.5937, 78.9629];

// State coordinates for centering map
export const STATE_COORDINATES: Record<string, [number, number]> = {
  'Delhi': [28.7041, 77.1025],
  'Maharashtra': [19.7515, 75.7139],
  'Karnataka': [15.3173, 75.7139],
  'Tamil Nadu': [11.1271, 79.2787],
  'Uttar Pradesh': [26.8467, 80.9462],
  'Rajasthan': [27.0238, 74.2179],
  'Gujarat': [22.2587, 71.1924],
  'Andhra Pradesh': [15.9129, 78.6675],
  'Telangana': [18.1124, 79.0193],
  'West Bengal': [24.8355, 88.2676],
  'Punjab': [31.1471, 75.3412],
  'Kerala': [10.8505, 76.2711],
  'Haryana': [29.0588, 76.0856],
  'Goa': [15.2993, 73.8243],
  'Jharkhand': [23.6102, 85.2799],
  'Odisha': [20.9517, 85.0985],
  'Madhya Pradesh': [22.9734, 78.6569],
  'Assam': [26.2006, 92.9376],
  'Himachal Pradesh': [31.7433, 77.1205],
  'Uttarakhand': [30.0668, 79.0193],
  'Jammu and Kashmir': [33.7782, 76.5769],
  'Chhattisgarh': [21.8787, 81.8661],
  'Arunachal Pradesh': [28.2180, 94.7278],
  'Manipur': [24.6637, 93.9063],
  'Meghalaya': [25.4670, 91.3662],
  'Mizoram': [23.1815, 92.9789],
  'Nagaland': [26.1584, 94.5624],
  'Sikkim': [27.5330, 88.5122],
  'Tripura': [23.9408, 91.9882],
};
