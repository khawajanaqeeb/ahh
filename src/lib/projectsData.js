// src/lib/projectsData.js
// Central Project Registry & Specifications for AHH Brothers

import { MEDIA } from './media';

export const PROJECTS = [
  {
    id: 'ahh-city',
    name: 'AHH City',
    tagline: 'Master Planned Housing Scheme',
    survey: 'Survey No. 297, Karachi',
    icon: '🏛️',
    logo: MEDIA.ahhCityLogo,
    color: 'blue',
    badgeBg: 'bg-blue-950/80',
    badgeBorder: 'border-blue-800/60',
    badgeText: 'text-blue-400',
    plotTypes: [
      { label: 'Residential 60SQY', costOfLand: 200000, extraCharges: 0, processingCharges: 0, total: 200000, paid: 50000 },
      { label: 'Residential 120SQY', costOfLand: 350000, extraCharges: 0, processingCharges: 0, total: 350000, paid: 100000 },
      { label: 'Commercial Shop 100SQFT', costOfLand: 350000, extraCharges: 0, processingCharges: 0, total: 350000, paid: 200000 },
      { label: 'Residential 150SQY', costOfLand: 1000000, extraCharges: 0, processingCharges: 0, total: 1000000, paid: 200000 },
      { label: 'Commercial 150SQY', costOfLand: 1500000, extraCharges: 0, processingCharges: 0, total: 1500000, paid: 300000 },
      { label: 'Custom Size', costOfLand: 0, extraCharges: 0, processingCharges: 0, total: 0, paid: 0 }
    ],
    route: '/booking'
  },
  {
    id: 'hooria-villas',
    name: 'Hooria Villas',
    tagline: 'Luxury Residential Villa Project',
    survey: 'Sector 5, Prime Location, Karachi',
    icon: '🏡',
    logo: MEDIA.hooriaVillasLogo,
    color: 'purple',
    badgeBg: 'bg-purple-950/80',
    badgeBorder: 'border-purple-800/60',
    badgeText: 'text-purple-400',
    plotTypes: [
      { label: 'Villa 120SQY', costOfLand: 4500000, extraCharges: 300000, processingCharges: 50000, total: 4850000, paid: 1000000 },
      { label: 'Luxury Villa 150SQY', costOfLand: 6500000, extraCharges: 400000, processingCharges: 50000, total: 6950000, paid: 1500000 },
      { label: 'Executive Villa 200SQY', costOfLand: 9500000, extraCharges: 500000, processingCharges: 75000, total: 10075000, paid: 2500000 },
      { label: 'Custom Villa', costOfLand: 0, extraCharges: 0, processingCharges: 0, total: 0, paid: 0 }
    ],
    route: '/booking/hooria-villas'
  },
  {
    id: 'labour-city',
    name: 'Labour City',
    tagline: 'Affordable Community Township',
    survey: 'Industrial Zone Phase 2, Karachi',
    icon: '🏗️',
    logo: MEDIA.labourCityLogo,
    color: 'emerald',
    badgeBg: 'bg-emerald-950/80',
    badgeBorder: 'border-emerald-800/60',
    badgeText: 'text-emerald-400',
    plotTypes: [
      { label: 'Residential 80SQY', costOfLand: 1200000, extraCharges: 50000, processingCharges: 25000, total: 1275000, paid: 250000 },
      { label: 'Commercial Plot 120SQY', costOfLand: 2500000, extraCharges: 100000, processingCharges: 35000, total: 2635000, paid: 500000 },
      { label: 'Industrial Plot 200SQY', costOfLand: 4500000, extraCharges: 200000, processingCharges: 50000, total: 4750000, paid: 1000000 },
      { label: 'Custom Unit', costOfLand: 0, extraCharges: 0, processingCharges: 0, total: 0, paid: 0 }
    ],
    route: '/booking/labour-city'
  },
  {
    id: 'summer-farm-houses',
    name: 'Summer Farm Houses',
    tagline: 'Exclusive Countryside Resort Scheme',
    survey: 'Super Highway Green Belt, Karachi',
    icon: '🌾',
    logo: MEDIA.summerFarmhousesLogo,
    color: 'amber',
    badgeBg: 'bg-amber-950/80',
    badgeBorder: 'border-amber-800/60',
    badgeText: 'text-amber-400',
    plotTypes: [
      { label: 'Luxury Farm 500SQY', costOfLand: 7500000, extraCharges: 500000, processingCharges: 100000, total: 8100000, paid: 2000000 },
      { label: 'Executive Farm 1000SQY', costOfLand: 14000000, extraCharges: 800000, processingCharges: 150000, total: 14950000, paid: 3500000 },
      { label: 'Resort Estate 2000SQY', costOfLand: 26000000, extraCharges: 1200000, processingCharges: 250000, total: 27450000, paid: 6000000 },
      { label: 'Custom Farm', costOfLand: 0, extraCharges: 0, processingCharges: 0, total: 0, paid: 0 }
    ],
    route: '/booking/summer-farm-houses'
  }
];

export function getProjectById(id) {
  return PROJECTS.find(p => p.id === id) || PROJECTS[0];
}

// Generate clean sample placeholder plots for new projects before machine readable site plan is uploaded
export function getPlaceholderPlotsForProject(projectId) {
  if (projectId === 'hooria-villas') {
    return Array.from({ length: 12 }, (_, i) => {
      const num = i + 1;
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = 150 + col * 260;
      const y = 150 + row * 180;
      const w = 220;
      const h = 140;
      return {
        id: `HV-${num}`,
        label: `HV-${num}`,
        type: i % 2 === 0 ? 'Villa 120SQY' : 'Luxury Villa 150SQY',
        rawCoords: `${x},${y} ${x+w},${y} ${x+w},${y+h} ${x},${y+h}`,
        coords: [
          { x, y },
          { x: x + w, y },
          { x: x + w, y: y + h },
          { x, y: y + h }
        ]
      };
    });
  }

  if (projectId === 'labour-city') {
    return Array.from({ length: 15 }, (_, i) => {
      const num = i + 1;
      const col = i % 5;
      const row = Math.floor(i / 5);
      const x = 120 + col * 200;
      const y = 140 + row * 160;
      const w = 170;
      const h = 120;
      return {
        id: `LC-${num}`,
        label: `LC-${num}`,
        type: i % 3 === 0 ? 'Commercial Plot 120SQY' : 'Residential 80SQY',
        rawCoords: `${x},${y} ${x+w},${y} ${x+w},${y+h} ${x},${y+h}`,
        coords: [
          { x, y },
          { x: x + w, y },
          { x: x + w, y: y + h },
          { x, y: y + h }
        ]
      };
    });
  }

  if (projectId === 'summer-farm-houses') {
    return Array.from({ length: 8 }, (_, i) => {
      const num = i + 1;
      const col = i % 4;
      const row = Math.floor(i / 4);
      const x = 140 + col * 280;
      const y = 160 + row * 240;
      const w = 240;
      const h = 190;
      return {
        id: `SFH-${num}`,
        label: `SFH-${num}`,
        type: i % 2 === 0 ? 'Luxury Farm 500SQY' : 'Executive Farm 1000SQY',
        rawCoords: `${x},${y} ${x+w},${y} ${x+w},${y+h} ${x},${y+h}`,
        coords: [
          { x, y },
          { x: x + w, y },
          { x: x + w, y: y + h },
          { x, y: y + h }
        ]
      };
    });
  }

  return [];
}
