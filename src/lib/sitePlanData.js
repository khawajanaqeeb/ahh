// src/lib/sitePlanData.js
// Master Architectural JSON Specification and Dynamic SVG Generator for AHH CITY (Survey No 297)
// Matches the EXACT blueprint image layout pixel-by-pixel.

export const MASTER_SITE_PLAN_JSON = {
  "project_details": {
    "title": "AHH CITY",
    "survey_number": 297,
    "entrance": "Located at the bottom right",
    "developer_branding": "AHH Brothers"
  },
  "legend_and_dimensions": {
    "parks": "500SQY",
    "mosque": "500SQY",
    "hospital_community": "516SQY",
    "school": "500SQY",
    "plots": [
      { "type": "S.R (Highrise Building / Senior Resident)", "area": "150SQY", "dimensions": "35 X 50" },
      { "type": "Residential Plot", "area": "60SQY", "dimensions": "18 X 30" },
      { "type": "Residential Plot", "area": "120SQY", "dimensions": "24 X 45" },
      { "type": "Commercial Plot", "area": "150SQY", "dimensions": "30 X 45" }
    ]
  },
  "road_network": [
    { "name": "30 Fit Wide Road", "location": "Top Horizontal above 60 SQY" },
    { "name": "30 SQ FIT WIDE ROAD", "location": "Vertical Roads between 60 SQY column pairs" },
    { "name": "50 SQ FIT WIDE ROAD", "location": "Central Vertical Dividing Road between left and right blocks" },
    { "name": "50 SQ FIT WIDE ROAD", "location": "Mid Horizontal Axis Road below 60 SQY" },
    { "name": "40 SQ FIT WIDE ROAD", "location": "Lower Horizontal Axis Road above 120 SQY" },
    { "name": "30 Fit Wide Road", "location": "Bottom Horizontal Road under 120 SQY" },
    { "name": "50 SQ FIT WIDE ROAD", "location": "Right Vertical Road to Entrance" }
  ],
  "amenities": [
    { "name": "PARK", "location": "Left Mid Section", "area": "500SQY" },
    { "name": "SCHOOL", "location": "Center-Left Mid Section", "area": "500SQY" },
    { "name": "MOSQUE", "location": "Center-Right Mid Section", "area": "500SQY" },
    { "name": "PARK", "location": "Right Mid Section", "area": "500SQY" },
    { "name": "HOSPITAL / COMMUNITY", "location": "Bottom Left Corner", "area": "516SQY" }
  ],
  "residential_plots": {
    "60_sq_yard_sector": {
      "left_block_column_pairs": [
        { "left": [88,87,86,85,84,83,82,81], "right": [80,79,78,77,76,75,74,73] },
        { "left": [72,71,70,69,68,67,66,65], "right": [64,63,62,61,60,59,58,57] },
        { "left": [56,55,54,53,52,51,50,49], "right": [48,47,46,45,44,43,42,41] }
      ],
      "right_block_column_pairs": [
        { "left": [40,39,38,37,36,35,34,33], "right": [32,31,30,29,28,27,26,25] },
        { "left": [24,23,22,21,20,19,18,17], "right": [16,15,14,13,12,11,10,9] }
      ],
      "right_block_single_column": [8,7,6,5,4,3,2,1]
    },
    "120_sq_yard_sector": {
      "top_row_numbers": [10,9,8,7,6,5,4,3,2,1],
      "bottom_row_numbers": [20,19,18,17,16,15,14,13,12,11]
    }
  },
  "commercial_plots": {
    "c_plots": ["C-4", "C-3", "C-2", "C-1"],
    "sr_plots": ["SR-2", "SR-1"]
  }
};

/**
 * Generate accurate SVG plot coordinates matching the blueprint image exactly.
 */
export function generatePlotsFromMasterJson(json = MASTER_SITE_PLAN_JSON) {
  const plots = [];

  const createRectPlot = (id, type, x, y, width, height, dimensionsText, areaText, label) => {
    const coords = [
      { x: Math.round(x), y: Math.round(y) },
      { x: Math.round(x + width), y: Math.round(y) },
      { x: Math.round(x + width), y: Math.round(y + height) },
      { x: Math.round(x), y: Math.round(y + height) }
    ];
    const rawCoords = coords.map(p => `${p.x},${p.y}`).join(' ');
    return {
      id: String(id),
      label: label || String(id),
      type: type || 'Residential Plot',
      dimensions: dimensionsText,
      area: areaText,
      coords,
      rawCoords
    };
  };

  const PLOT_W    = 48;
  const PLOT_H    = 38;
  const ROW_GAP   = 2;
  const ROAD_30   = 24;
  const ROAD_50V  = 55;
  const NUM_ROWS  = 8;
  const START_X   = 50;
  const START_Y   = 90;

  // 1. LEFT BLOCK
  const leftPairs = json.residential_plots["60_sq_yard_sector"].left_block_column_pairs;
  let curX = START_X;
  leftPairs.forEach((pair) => {
    pair.left.forEach((plotNum, rowIdx) => {
      const px = curX;
      const py = START_Y + rowIdx * (PLOT_H + ROW_GAP);
      plots.push(createRectPlot(plotNum, 'Residential 60SQY', px, py, PLOT_W, PLOT_H, '18 X 30', '60SQY', String(plotNum)));
    });
    pair.right.forEach((plotNum, rowIdx) => {
      const px = curX + PLOT_W;
      const py = START_Y + rowIdx * (PLOT_H + ROW_GAP);
      plots.push(createRectPlot(plotNum, 'Residential 60SQY', px, py, PLOT_W, PLOT_H, '18 X 30', '60SQY', String(plotNum)));
    });
    curX += PLOT_W * 2 + ROAD_30;
  });

  const leftBlockEndX = curX - ROAD_30;

  // 2. CENTRAL ROAD
  const centralRoadX = leftBlockEndX + 8;
  const rightBlockStartX = centralRoadX + ROAD_50V;

  // 3. RIGHT BLOCK
  const rightPairs = json.residential_plots["60_sq_yard_sector"].right_block_column_pairs;
  const singleCol = json.residential_plots["60_sq_yard_sector"].right_block_single_column;

  curX = rightBlockStartX;
  rightPairs.forEach((pair) => {
    pair.left.forEach((plotNum, rowIdx) => {
      const px = curX;
      const py = START_Y + rowIdx * (PLOT_H + ROW_GAP);
      plots.push(createRectPlot(plotNum, 'Residential 60SQY', px, py, PLOT_W, PLOT_H, '18 X 30', '60SQY', String(plotNum)));
    });
    pair.right.forEach((plotNum, rowIdx) => {
      const px = curX + PLOT_W;
      const py = START_Y + rowIdx * (PLOT_H + ROW_GAP);
      plots.push(createRectPlot(plotNum, 'Residential 60SQY', px, py, PLOT_W, PLOT_H, '18 X 30', '60SQY', String(plotNum)));
    });
    curX += PLOT_W * 2 + ROAD_30;
  });

  singleCol.forEach((plotNum, rowIdx) => {
    const px = curX;
    const py = START_Y + rowIdx * (PLOT_H + ROW_GAP);
    plots.push(createRectPlot(plotNum, 'Residential 60SQY', px, py, PLOT_W, PLOT_H, '18 X 30', '60SQY', String(plotNum)));
  });

  const rightBlockEndX = curX + PLOT_W;

  // 4. COMMERCIAL PLOTS
  const cPlots = json.commercial_plots.c_plots;
  const cX = rightBlockEndX - PLOT_W + 30;
  const amenityY = START_Y + NUM_ROWS * (PLOT_H + ROW_GAP) + 55;
  const cStartY = amenityY + 10;
  const cWidth = 130;
  const cHeight = 32;

  cPlots.forEach((cId, index) => {
    const cY = cStartY + index * (cHeight + 4);
    plots.push(createRectPlot(cId, 'Commercial 150SQY', cX, cY, cWidth, cHeight, '30 X 45', '150SQY', cId));
  });

  // 5. 120 SQYD SECTOR
  const sec120Top = json.residential_plots["120_sq_yard_sector"].top_row_numbers;
  const sec120Bottom = json.residential_plots["120_sq_yard_sector"].bottom_row_numbers;
  const lowerSectionY = amenityY + 195;
  const hospitalW = 155;
  const sec120StartX = START_X + hospitalW + 15;
  const sec120W = 56;
  const sec120H = 60;
  const sec120Gap = 2;

  sec120Top.forEach((plotNum, colIdx) => {
    const px = sec120StartX + colIdx * (sec120W + sec120Gap);
    plots.push(createRectPlot(`120-${plotNum}`, 'Residential 120SQY', px, lowerSectionY, sec120W, sec120H, '24 X 45', '120SQY', String(plotNum)));
  });

  sec120Bottom.forEach((plotNum, colIdx) => {
    const px = sec120StartX + colIdx * (sec120W + sec120Gap);
    const py = lowerSectionY + sec120H + sec120Gap;
    plots.push(createRectPlot(`120-${plotNum}`, 'Residential 120SQY', px, py, sec120W, sec120H, '24 X 45', '120SQY', String(plotNum)));
  });

  const sec120EndX = sec120StartX + 10 * (sec120W + sec120Gap);

  // 6. SR HIGHRISE BUILDINGS
  const srPlots = json.commercial_plots.sr_plots;
  const srX = sec120EndX + 15;
  const srW = 120;
  const srH = 60;

  srPlots.forEach((srId, index) => {
    const srY = lowerSectionY + index * (srH + 5);
    plots.push(createRectPlot(srId, 'S.R (Highrise Building / Senior Resident)', srX, srY, srW, srH, '35 X 50', '150SQY', srId));
  });

  return plots;
}

/**
 * Structural vector elements matching the blueprint image exactly.
 */
export function getLayoutFeatures(json = MASTER_SITE_PLAN_JSON) {
  const PLOT_W = 48, PLOT_H = 38, ROW_GAP = 2, ROAD_30 = 24, ROAD_50V = 55, NUM_ROWS = 8;
  const START_X = 50, START_Y = 90;

  const leftPairWidth = PLOT_W * 2;
  const leftBlockWidth = 3 * leftPairWidth + 2 * ROAD_30;
  const leftBlockEndX = START_X + leftBlockWidth;

  const centralRoadX = leftBlockEndX + 8;
  const rightBlockStartX = centralRoadX + ROAD_50V;

  const rightPairWidth = PLOT_W * 2;
  const rightBlockWidth = 2 * rightPairWidth + 2 * ROAD_30 + PLOT_W;
  const rightBlockEndX = rightBlockStartX + rightBlockWidth;

  const plotGridBottom = START_Y + NUM_ROWS * (PLOT_H + ROW_GAP);
  const amenityY = plotGridBottom + 55;
  const amenityH = 145;
  const lowerRoadY = amenityY + amenityH + 10;
  const lowerSectionY = lowerRoadY + 42;
  const hospitalW = 155;
  const sec120StartX = START_X + hospitalW + 15;
  const sec120W = 56, sec120H = 60, sec120Gap = 2;
  const sec120EndX = sec120StartX + 10 * (sec120W + sec120Gap);
  const srX = sec120EndX + 15;

  const boundaryW = Math.max(rightBlockEndX, srX + 120) - START_X + 40;
  const boundaryH = lowerSectionY + 2 * (sec120H + sec120Gap) + 45;
  const canvasW = START_X + boundaryW + 370;
  const canvasH = boundaryH + 50;
  const cX = rightBlockEndX - PLOT_W + 30;
  const cWidth = 130;
  const entranceRoadX = srX + 120 + 15;

  return {
    canvasDimensions: { width: canvasW, height: canvasH },
    boundary: {
      x: START_X - 15,
      y: 30,
      width: boundaryW + 15,
      height: boundaryH - 10,
      surveyNumber: json.project_details.survey_number,
      title: json.project_details.title,
      developer: json.project_details.developer_branding
    },
    headerTitleX: START_X + leftBlockWidth / 2 + 50,
    headerSurveyX: rightBlockStartX + rightBlockWidth / 2 + 20,
    roads: [
      { id: 'road-top-horiz', name: '30 Fit Wide Road', x: START_X, y: START_Y - 26, width: rightBlockEndX - START_X, height: 22, type: 'horizontal' },
      { id: 'road-central-vert', name: '50 SQ FIT WIDE ROAD', x: centralRoadX, y: START_Y - 26, width: ROAD_50V, height: plotGridBottom - (START_Y - 26) + 15, type: 'vertical' },
      { id: 'road-mid-horiz-left', name: '50 SQ FIT WIDE ROAD', x: START_X, y: plotGridBottom + 8, width: centralRoadX - START_X, height: 35, type: 'horizontal' },
      { id: 'road-mid-horiz-right', name: '50 SQ FIT WIDE ROAD', x: rightBlockStartX, y: plotGridBottom + 8, width: rightBlockEndX - rightBlockStartX, height: 35, type: 'horizontal' },
      { id: 'road-lower-horiz', name: '40 SQ FIT WIDE ROAD', x: START_X, y: lowerRoadY, width: entranceRoadX - START_X, height: 35, type: 'horizontal' },
      { id: 'road-bottom-horiz', name: '30 Fit Wide Road', x: sec120StartX, y: lowerSectionY + 2 * (sec120H + sec120Gap) + 5, width: sec120EndX - sec120StartX, height: 22, type: 'horizontal' },
      { id: 'road-right-entrance-vert', name: '50 SQ FIT WIDE ROAD', x: entranceRoadX, y: plotGridBottom + 8, width: 42, height: boundaryH - plotGridBottom - 25, type: 'vertical' }
    ],
    vertical30FtRoads: (() => {
      const roads = [];
      const roadH = plotGridBottom - START_Y;
      for (let i = 0; i < 2; i++) {
        const rx = START_X + (i + 1) * (2 * PLOT_W) + i * ROAD_30;
        roads.push({ x: rx, y: START_Y, width: ROAD_30, height: roadH, label: '30 SQ FIT WIDE ROAD' });
      }
      for (let i = 0; i < 2; i++) {
        const rx = rightBlockStartX + (i + 1) * (2 * PLOT_W) + i * ROAD_30;
        roads.push({ x: rx, y: START_Y, width: ROAD_30, height: roadH, label: '30 SQ FIT WIDE ROAD' });
      }
      return roads;
    })(),
    amenities: [
      { id: 'amenity-park-left', name: 'PARK', area: json.legend_and_dimensions.parks, x: START_X, y: amenityY, width: 130, height: amenityH, color: '#10b981', icon: '🌳' },
      { id: 'amenity-school', name: 'SCHOOL', area: json.legend_and_dimensions.school, x: START_X + 150, y: amenityY, width: centralRoadX - (START_X + 150) - 10, height: amenityH, color: '#3b82f6', icon: '🏫' },
      { id: 'amenity-mosque', name: 'MOSQUE', area: json.legend_and_dimensions.mosque, x: rightBlockStartX, y: amenityY, width: 180, height: amenityH, color: '#8b5cf6', icon: '🕌' },
      { id: 'amenity-park-right', name: 'PARK', area: json.legend_and_dimensions.parks, x: rightBlockStartX + 200, y: amenityY, width: cX - (rightBlockStartX + 200) - 10, height: amenityH, color: '#10b981', icon: '🌳' },
      { id: 'amenity-hospital', name: 'HOSPITAL /\nCOMMUNITY', area: json.legend_and_dimensions.hospital_community, x: START_X, y: lowerSectionY, width: hospitalW, height: 2 * sec120H + sec120Gap, color: '#ec4899', icon: '🏥' }
    ],
    entrancePos: { x: entranceRoadX, y: lowerSectionY + 2 * (sec120H + sec120Gap) + 5 },
    legendBox: {
      x: rightBlockEndX + 120,
      y: 180,
      width: 310,
      height: 390,
      title: 'Dimension',
      items: [
        { name: 'PARKS', val: '= 500SQY' },
        { name: 'MOSQUE', val: '= 500SQY' },
        { name: 'HOSPITAL COMMUNITY', val: '= 516SQY' },
        { name: 'SCHOOL', val: '= 500SQY' },
        { name: 'S.R - 150SQY', val: '= 35 X 50' },
        { name: 'RESIDENTIAL PLOT 60SQY', val: '= 18 X 30' },
        { name: 'RESIDENTIAL PLOT 120SQY', val: '= 24 X 45' },
        { name: 'COMMERCIAL PLOT 150SQY', val: '= 30 X 45' }
      ]
    },
    logoTreePos: { x: rightBlockEndX + 170, y: 30 },
    logoBrothersPos: { x: rightBlockEndX + 170, y: lowerSectionY + 2 * sec120H - 20 }
  };
}
