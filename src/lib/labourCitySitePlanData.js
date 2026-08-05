// src/lib/labourCitySitePlanData.js
// Labour City Master Site Plan Specification JSON and Dynamic Polygon Layout Engine

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
  "roads": [
    { "id": "road_main_bottom", "label": "50'-0\" Wide Road", "direction": "horizontal", "position": "bottom boundary" },
    { "id": "road_top", "label": "30' Wide Road", "direction": "horizontal", "position": "top boundary" },
    { "id": "road_center_h", "label": "30' Wide Road", "direction": "horizontal", "position": "central divider" },
    { "id": "road_bottom_h", "label": "30' Wide Road", "direction": "horizontal", "position": "lower internal" },
    { "id": "road_v1", "label": "30' Wide Road", "direction": "vertical", "position": "between Block A and Block B" },
    { "id": "road_v2", "label": "30' Wide Road", "direction": "vertical", "position": "between Block B and Block B2" },
    { "id": "road_v3", "label": "50' Wide Road", "direction": "vertical", "position": "between Block B2 and Mosque/Block D" },
    { "id": "road_v4", "label": "30' Wide Road", "direction": "vertical", "position": "right of Mosque" }
  ],
  "blocks": [
    {
      "id": "block_A",
      "name": "Block A",
      "color_in_plan": "red",
      "plot_size": "80 sq.yd",
      "plot_type": "residential",
      "position": "west / left zone",
      "total_plots": 68,
      "plot_number_range": "1–68"
    },
    {
      "id": "block_B",
      "name": "Block B",
      "color_in_plan": "red (dense)",
      "plot_size": "80 sq.yd",
      "plot_type": "residential",
      "position": "center-left zone",
      "total_plots": 95,
      "plot_number_range": "1–95"
    },
    {
      "id": "block_B2",
      "name": "Block B2",
      "color_in_plan": "yellow",
      "plot_size": "80 sq.yd",
      "plot_type": "residential",
      "position": "central zone",
      "total_plots": 121,
      "plot_number_range": "1–121"
    },
    {
      "id": "block_D",
      "name": "Block D",
      "color_in_plan": "magenta / pink",
      "plot_size": "150 sq.yd",
      "plot_type": "residential",
      "position": "east / right zone",
      "total_plots": 72,
      "plot_number_range": "1–72"
    }
  ],
  "amenities": [
    { "id": "mosque", "name": "Mosque", "type": "religious", "position": "central-right zone" },
    { "id": "school", "name": "School", "type": "education", "position": "lower central zone" },
    { "id": "community_centre", "name": "Community Centre", "type": "community", "position": "lower central zone" },
    { "id": "park_a", "name": "Park (Block A)", "type": "green_space", "position": "left side" },
    { "id": "park_b", "name": "Park 'B'", "type": "green_space", "position": "central" },
    { "id": "park_d1", "name": "Park D1", "type": "green_space", "position": "right side" },
    { "id": "park_d2", "name": "Park D2", "type": "green_space", "position": "far right" }
  ]
};

// Layout generator to convert Labour City JSON specification into interactive 2D SVG plot polygons
export function generateLabourCityPlots(specJSON = LABOUR_CITY_SITE_PLAN_JSON) {
  const plots = [];

  // Geometry configuration constants
  const startX = 60;
  const startY = 80;
  const plotW = 48;
  const plotH = 34;
  const gap = 6;
  const roadW = 35;

  // 1. BLOCK A (68 plots: 80 sq.yd) - 4 columns x 17 rows
  const blockAStartX = startX;
  const blockAStartY = startY;
  for (let i = 0; i < 68; i++) {
    const plotNo = i + 1;
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = blockAStartX + col * (plotW + gap);
    const y = blockAStartY + row * (plotH + gap);

    plots.push({
      id: `A-${plotNo}`,
      label: `A-${plotNo}`,
      projectId: 'labour-city',
      block: 'A',
      type: 'Residential 80SQY',
      dimensions: '80 sq.yd',
      area: '80SQY',
      rawCoords: `${x},${y} ${x + plotW},${y} ${x + plotW},${y + plotH} ${x},${y + plotH}`,
      coords: [
        { x, y },
        { x: x + plotW, y },
        { x: x + plotW, y: y + plotH },
        { x, y: y + plotH }
      ]
    });
  }

  // 2. BLOCK B (95 plots: 80 sq.yd) - 5 columns x 19 rows
  const blockBStartX = blockAStartX + 4 * (plotW + gap) + roadW;
  const blockBStartY = startY;
  for (let i = 0; i < 95; i++) {
    const plotNo = i + 1;
    const col = i % 5;
    const row = Math.floor(i / 5);
    const x = blockBStartX + col * (plotW + gap);
    const y = blockBStartY + row * (plotH + gap);

    plots.push({
      id: `B-${plotNo}`,
      label: `B-${plotNo}`,
      projectId: 'labour-city',
      block: 'B',
      type: 'Residential 80SQY',
      dimensions: '80 sq.yd',
      area: '80SQY',
      rawCoords: `${x},${y} ${x + plotW},${y} ${x + plotW},${y + plotH} ${x},${y + plotH}`,
      coords: [
        { x, y },
        { x: x + plotW, y },
        { x: x + plotW, y: y + plotH },
        { x, y: y + plotH }
      ]
    });
  }

  // 3. BLOCK B2 (121 plots: 80 sq.yd) - 6 columns x 20/21 rows
  const blockB2StartX = blockBStartX + 5 * (plotW + gap) + roadW;
  const blockB2StartY = startY;
  for (let i = 0; i < 121; i++) {
    const plotNo = i + 1;
    const col = i % 6;
    const row = Math.floor(i / 6);
    const x = blockB2StartX + col * (plotW + gap);
    const y = blockB2StartY + row * (plotH + gap);

    plots.push({
      id: `B2-${plotNo}`,
      label: `B2-${plotNo}`,
      projectId: 'labour-city',
      block: 'B2',
      type: 'Residential 80SQY',
      dimensions: '80 sq.yd',
      area: '80SQY',
      rawCoords: `${x},${y} ${x + plotW},${y} ${x + plotW},${y + plotH} ${x},${y + plotH}`,
      coords: [
        { x, y },
        { x: x + plotW, y },
        { x: x + plotW, y: y + plotH },
        { x, y: y + plotH }
      ]
    });
  }

  // 4. BLOCK D (72 plots: 150 sq.yd) - 4 columns x 18 rows
  const blockDStartX = blockB2StartX + 6 * (plotW + gap) + roadW * 1.5;
  const blockDStartY = startY;
  const plotDW = 62;
  const plotDH = 38;
  for (let i = 0; i < 72; i++) {
    const plotNo = i + 1;
    const col = i % 4;
    const row = Math.floor(i / 4);
    const x = blockDStartX + col * (plotDW + gap);
    const y = blockDStartY + row * (plotDH + gap);

    plots.push({
      id: `D-${plotNo}`,
      label: `D-${plotNo}`,
      projectId: 'labour-city',
      block: 'D',
      type: 'Commercial Plot 120SQY',
      dimensions: '150 sq.yd',
      area: '150SQY',
      rawCoords: `${x},${y} ${x + plotDW},${y} ${x + plotDW},${y + plotDH} ${x},${y + plotDH}`,
      coords: [
        { x, y },
        { x: x + plotDW, y },
        { x: x + plotDW, y: y + plotDH },
        { x, y: y + plotDH }
      ]
    });
  }

  return plots;
}
