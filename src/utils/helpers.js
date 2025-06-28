export const communityList = ['OC', 'BC', 'BCM', 'MBC', 'SC', 'SCA', 'ST'];

export const courseGroups = {
  ANY: [],
  'CS Related': [
    'CS', 'CM', 'IT', 'AD', 'AL', 'AM', 'CF', 'CI', 'CD', 'SC', 'SE', 'SB', 'CB', 'CW', 'CG', 'TS', 'CT'
  ],
  'Core Related': [
    'ME', 'CE', 'EE', 'EC', 'CH', 'AU', 'EI', 'IC', 'PR', 'PE', 'MT', 'MN',
    'MI', 'MF', 'MS', 'MO', 'MG', 'MC', 'MB', 'IN', 'IE'
  ]
};


export function getRankLowerBound(rank, certainty) {
  const r = parseInt(rank);
  if (certainty === 'confirm') {
    if (r < 1000) return r - 100;
    if (r < 3000) return r - 250;
    if (r < 10000) return r - 500;
    return r - 1000;
  } else {
    if (r < 1000) return r - 300;
    if (r < 3000) return r - 600;
    if (r < 10000) return r - 1500;
    return r - 3000;
  }
}

export function getCutoffLowerBound(cutoff, certainty) {
  const c = parseFloat(cutoff);
  if (certainty === 'confirm') {
    if (c > 199) return c + 0.25;
    if (c > 195) return c + 0.5;
    return c + 1.0;
  } else {
    if (c > 199) return c + 0.5;
    if (c > 195) return c + 1.0;
    return c + 2.0;
  }
}
