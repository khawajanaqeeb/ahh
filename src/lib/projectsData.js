// src/lib/projectsData.js
// Central Project Registry & Specifications for AHH Brothers

import { MEDIA } from './media';
import { generateLabourCityPlots } from './labourCitySitePlanData';
import { generateHooriaVillasPlots } from './hooriaVillasSitePlanData';
import { generateSummerFarmhousesPlots } from './summerFarmhousesSitePlanData';

export const PROJECTS = [
  {
    id: 'ahh-city',
    name: 'AHH City',
    tagline: 'Residential & Commercial Units',
    survey: 'Scheme 45, Northern Bypass (Survey Number 297), Karachi',
    icon: '🏛️',
    logo: MEDIA.ahhCityLogo,
    color: 'blue',
    badgeBg: 'bg-blue-950/80',
    badgeBorder: 'border-blue-800/60',
    badgeText: 'text-blue-400',
    plotTypes: [
      { label: '60 SQ YARDS (Residential)', costOfLand: 350000, extraCharges: 0, processingCharges: 0, total: 350000, paid: 100000 },
      { label: '120 SQ YARDS (Residential)', costOfLand: 500000, extraCharges: 0, processingCharges: 0, total: 500000, paid: 150000 },
      { label: 'Commercial Shop (100 Sq.Ft.)', costOfLand: 350000, extraCharges: 0, processingCharges: 0, total: 350000, paid: 200000 },
      { label: 'Custom Size', costOfLand: 0, extraCharges: 0, processingCharges: 0, total: 0, paid: 0 }
    ],
    route: '/booking'
  },
  {
    id: 'hooria-villas',
    name: 'Hooria Villas',
    tagline: 'Residential & Commercial Plots',
    survey: 'Scheme 45, Northern Bypass (Survey Number 395, 396, 397), Karachi',
    icon: '🏡',
    logo: MEDIA.hooriaVillasLogo,
    color: 'purple',
    badgeBg: 'bg-purple-950/80',
    badgeBorder: 'border-purple-800/60',
    badgeText: 'text-purple-400',
    plotTypes: [
      { label: '120 SQ YARDS (Residential)', costOfLand: 1000000, extraCharges: 0, processingCharges: 0, total: 1000000, paid: 200000 },
      { label: 'Commercial Plots (150 Sq Yards)', costOfLand: 1500000, extraCharges: 0, processingCharges: 0, total: 1500000, paid: 300000 },
      { label: 'Custom Villa', costOfLand: 0, extraCharges: 0, processingCharges: 0, total: 0, paid: 0 }
    ],
    route: '/booking/hooria-villas'
  },
  {
    id: 'labour-city',
    name: 'Labour City',
    tagline: 'Residential Home Town & Commercial Plots',
    survey: 'Scheme 45, Northern Bypass (Survey Number 398, 398/1), Near Gulshan-e-Maymar, Karachi',
    icon: '🏗️',
    logo: MEDIA.labourCityLogo,
    color: 'emerald',
    badgeBg: 'bg-emerald-950/80',
    badgeBorder: 'border-emerald-800/60',
    badgeText: 'text-emerald-400',
    plotTypes: [
      { label: '80 SQ YARDS (Residential)', costOfLand: 600000, extraCharges: 0, processingCharges: 0, total: 600000, paid: 200000 },
      { label: 'Commercial Plots (150 Sq Yards)', costOfLand: 1350000, extraCharges: 0, processingCharges: 0, total: 1350000, paid: 300000 },
      { label: 'Custom Unit', costOfLand: 0, extraCharges: 0, processingCharges: 0, total: 0, paid: 0 }
    ],
    route: '/booking/labour-city'
  },
  {
    id: 'summer-farm-houses',
    name: 'Summer Farmhouses',
    tagline: 'Farm House Land & Community',
    survey: 'Scheme 45, Northern Bypass, Karachi',
    icon: '🌾',
    logo: MEDIA.summerFarmhousesLogo,
    color: 'amber',
    badgeBg: 'bg-amber-950/80',
    badgeBorder: 'border-amber-800/60',
    badgeText: 'text-amber-400',
    plotTypes: [
      { label: 'FARM HOUSE LAND (1000 Sq Yds)', costOfLand: 2500000, extraCharges: 0, processingCharges: 0, total: 2500000, paid: 1000000 },
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
    return generateHooriaVillasPlots();
  }

  if (projectId === 'labour-city') {
    return generateLabourCityPlots();
  }

  if (projectId === 'summer-farm-houses') {
    return generateSummerFarmhousesPlots();
  }

  return [];
}
