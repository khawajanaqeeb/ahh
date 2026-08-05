// src/lib/labourCitySitePlanData.js
// Labour City Master Site Plan Specification and Dynamic SVG Polygon Engine
// Parsed from public/Downloads/labour_city_site_plan.html

export const LABOUR_CITY_SITE_PLAN_JSON = {
  "project": "Labour City",
  "location": "Karachi, Pakistan",
  "developer": "AHH Brothers Builders & Developers",
  "generated": "2026-08-06",
  "summary": {
    "total_blocks": 4,
    "total_residential_plots": 355,
    "total_amenity_zones": 7,
    "road_widths": ["50 feet (main road)", "30 feet (internal roads)"]
  },
  "blocks_config": [
    { id: 'A', name: 'Block A', color: '#fca5a5', stroke: '#dc2626', size: '80 sq.yd', type: 'Residential 80SQY', x: 30, y: 60, cols: 4, count: 68, pw: 28, ph: 16 },
    { id: 'B', name: 'Block B', color: '#fed7aa', stroke: '#ea580c', size: '80 sq.yd', type: 'Residential 80SQY', x: 165, y: 60, cols: 5, count: 95, pw: 28, ph: 14 },
    { id: 'B2', name: 'Block B2', color: '#fef08a', stroke: '#ca8a04', size: '80 sq.yd', type: 'Residential 80SQY', x: 340, y: 60, cols: 5, count: 120, pw: 28, ph: 12 },
    { id: 'D', name: 'Block D', color: '#f0abfc', stroke: '#a21caf', size: '150 sq.yd', type: 'Commercial Plot 120SQY', x: 620, y: 60, cols: 4, count: 72, pw: 30, ph: 16 }
  ],
  "amenities_config": [
    { id: 'mosque', label: 'Mosque', color: '#93c5fd', stroke: '#1d4ed8', x: 530, y: 80, w: 80, h: 90, icon: '🕌' },
    { id: 'school', label: 'School', color: '#6ee7b7', stroke: '#065f46', x: 695, y: 310, w: 75, h: 80, icon: '🏫' },
    { id: 'community', label: 'Community Centre', color: '#6ee7b7', stroke: '#065f46', x: 612, y: 310, w: 75, h: 80, icon: '🏢' },
    { id: 'parkA', label: 'Park A', color: '#86efac', stroke: '#15803d', x: 30, y: 380, w: 130, h: 55, icon: '🌿' },
    { id: 'parkB', label: "Park 'B'", color: '#86efac', stroke: '#15803d', x: 245, y: 385, w: 130, h: 42, icon: '🌿' },
    { id: 'parkD1', label: 'Park D1', color: '#86efac', stroke: '#15803d', x: 620, y: 420, w: 130, h: 42, icon: '🌿' },
    { id: 'parkD2', label: 'Park D2', color: '#86efac', stroke: '#15803d', x: 755, y: 60, w: 120, h: 90, icon: '🌿' }
  ]
};

// Layout generator that parses the exact HTML coordinates to build SVG interactive plot polygons
export function generateLabourCityPlots(specJSON = LABOUR_CITY_SITE_PLAN_JSON) {
  const plots = [];
  const gap = 1;

  specJSON.blocks_config.forEach(b => {
    for (let i = 0; i < b.count; i++) {
      const plotNo = i + 1;
      const col = i % b.cols;
      const row = Math.floor(i / b.cols);
      const x = b.x + col * (b.pw + gap);
      const y = b.y + row * (b.ph + gap);
      const plotId = `${b.id}-${plotNo}`;

      plots.push({
        id: plotId,
        label: plotId,
        projectId: 'labour-city',
        block: b.id,
        plotNumber: plotNo,
        type: b.type,
        dimensions: b.size,
        area: b.size,
        rawCoords: `${x},${y} ${x + b.pw},${y} ${x + b.pw},${y + b.ph} ${x},${y + b.ph}`,
        coords: [
          { x, y },
          { x: x + b.pw, y },
          { x: x + b.pw, y: y + b.ph },
          { x, y: y + b.ph }
        ]
      });
    }
  });

  return plots;
}
