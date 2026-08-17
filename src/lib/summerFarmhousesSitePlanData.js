// src/lib/summerFarmhousesSitePlanData.js
// OFFICIAL SUMMER FARMHOUSES MASTER SITE PLAN SPECIFICATION & DYNAMIC SVG POLYGON LAYOUT ENGINE
// 1-to-1 Machine Readable Reproduction of 10.00 ACRES Master Architectural Blueprint Drawing (34 Farm Plots & Amenities)

export const SUMMER_FARMHOUSES_SITE_PLAN_JSON = {
  project_details: {
    title: "SUMMER FARMHOUSES",
    total_area_acres: 10.0,
    total_plots: 34,
    location: "Scheme 45, Northern Bypass, Karachi",
    developer: "AHH Brothers Builders & Developers",
    road_network: [
      "100'-0\" WIDE MAIN ENTRANCE ROAD (Bottom)",
      "50'-0\" WIDE RIGHT SPINE ROAD (Right Side)",
      "30' WIDE CROSS STREETS (Internal Distribution Roads)"
    ]
  },
  summary: {
    standard_farms: 29,
    misc_farms: 5,
    misc_plot_ids: ["F-1", "F-2", "F-3", "F-31", "F-34"]
  },
  plots: [
    { id: "F-1", plot_number: 1, plot_type: "misc", size_sqyd: 1030, dimensions: "Misc Size", status: "available" },
    { id: "F-2", plot_number: 2, plot_type: "misc", size_sqyd: 1060.66, dimensions: "Misc Size", status: "available" },
    { id: "F-3", plot_number: 3, plot_type: "misc", size_sqyd: 1117, dimensions: "Misc Size", status: "available" },
    { id: "F-4", plot_number: 4, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-5", plot_number: 5, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-6", plot_number: 6, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-7", plot_number: 7, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-8", plot_number: 8, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-9", plot_number: 9, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-10", plot_number: 10, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-11", plot_number: 11, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-12", plot_number: 12, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-13", plot_number: 13, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-14", plot_number: 14, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-15", plot_number: 15, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-16", plot_number: 16, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-17", plot_number: 17, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-18", plot_number: 18, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-19", plot_number: 19, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-20", plot_number: 20, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-21", plot_number: 21, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-22", plot_number: 22, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-23", plot_number: 23, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-24", plot_number: 24, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-25", plot_number: 25, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-26", plot_number: 26, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-27", plot_number: 27, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-28", plot_number: 28, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-29", plot_number: 29, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-30", plot_number: 30, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-31", plot_number: 31, plot_type: "misc", size_sqyd: 1425, dimensions: "Misc Size", status: "available" },
    { id: "F-32", plot_number: 32, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-33", plot_number: 33, plot_type: "standard", size_sqyd: 1000, dimensions: "90' x 100'", status: "available" },
    { id: "F-34", plot_number: 34, plot_type: "misc", size_sqyd: 1296, dimensions: "Misc Size", status: "available" }
  ]
};

// Machine Readable Interactive 2D Polygon Generator for Summer Farmhouses Layout
export function generateSummerFarmhousesPlots(specJSON = SUMMER_FARMHOUSES_SITE_PLAN_JSON) {
  const plots = [];

  const createPlot = (id, block, plotNo, type, dimensions, area, x, y, w, h) => {
    const coords = [
      { x: Math.round(x), y: Math.round(y) },
      { x: Math.round(x + w), y: Math.round(y) },
      { x: Math.round(x + w), y: Math.round(y + h) },
      { x: Math.round(x), y: Math.round(y + h) }
    ];
    return {
      id,
      label: id,
      projectId: 'summer-farm-houses',
      block: 'Farmhouse Block',
      plotNumber: plotNo,
      type,
      dimensions,
      area,
      rawCoords: `${coords[0].x},${coords[0].y} ${coords[1].x},${coords[1].y} ${coords[2].x},${coords[2].y} ${coords[3].x},${coords[3].y}`,
      coords
    };
  };

  // -------------------------------------------------------------
  // TOP ROW: Misc Farm Plots F-1, F-2, F-3
  // -------------------------------------------------------------
  plots.push(createPlot('F-1', 'Farmhouse Block', 1, 'Misc Farmhouse', 'Misc Size', '1030 sq.yd', 50, 110, 245, 60));
  plots.push(createPlot('F-2', 'Farmhouse Block', 2, 'Misc Farmhouse', 'Misc Size', '1060.66 sq.yd', 315, 110, 245, 60));
  plots.push(createPlot('F-3', 'Farmhouse Block', 3, 'Misc Farmhouse', 'Misc Size', '1117 sq.yd', 580, 110, 245, 60));

  // -------------------------------------------------------------
  // STANDARD FARM ROWS F-4 to F-30 (3 Columns x 9 Rows)
  // -------------------------------------------------------------
  const farmGrid = [
    [4, 5, 6],     // Row 1 (y: 200)
    [7, 8, 9],     // Row 2 (y: 275)
    // 30' Road
    [10, 11, 12],  // Row 3 (y: 375)
    [13, 14, 15],  // Row 4 (y: 450)
    // 30' Road
    [16, 17, 18],  // Row 5 (y: 550)
    [19, 20, 21],  // Row 6 (y: 625)
    // 30' Road
    [22, 23, 24],  // Row 7 (y: 725)
    [25, 26, 27],  // Row 8 (y: 800)
    // 30' Road
    [28, 29, 30]   // Row 9 (y: 900)
  ];

  const yOffsets = [200, 275, 375, 450, 550, 625, 725, 800, 900];

  farmGrid.forEach((rowPlots, rIdx) => {
    const yPos = yOffsets[rIdx];
    rowPlots.forEach((num, cIdx) => {
      const xPos = 50 + cIdx * 265;
      plots.push(createPlot(`F-${num}`, 'Farmhouse Block', num, 'Standard Farm 1000SQY', "90' x 100'", '1000 sq.yd', xPos, yPos, 245, 65));
    });
  });

  // -------------------------------------------------------------
  // ROW 10: F-31 (Misc), F-32, F-33
  // -------------------------------------------------------------
  plots.push(createPlot('F-31', 'Farmhouse Block', 31, 'Misc Farmhouse', 'Misc Size', '1425 sq.yd', 50, 995, 245, 65));
  plots.push(createPlot('F-32', 'Farmhouse Block', 32, 'Standard Farm 1000SQY', "90' x 100'", '1000 sq.yd', 315, 995, 245, 65));
  plots.push(createPlot('F-33', 'Farmhouse Block', 33, 'Standard Farm 1000SQY', "90' x 100'", '1000 sq.yd', 580, 995, 245, 65));

  // -------------------------------------------------------------
  // ROW 11: BOTTOM AMENITIES & F-34
  // -------------------------------------------------------------
  plots.push(createPlot('AM-MOSQUE', 'Farmhouse Block', 0, 'Amenity - Mosque', 'MISC SIZE', '1200 sq.yd', 50, 1085, 245, 65));
  plots.push(createPlot('AM-COMMUNITY', 'Farmhouse Block', 0, 'Amenity - Community Hall', 'MISC SIZE', '1400 sq.yd', 315, 1085, 245, 65));
  plots.push(createPlot('F-34', 'Farmhouse Block', 34, 'Misc Farmhouse / Park', 'Misc Size', '1296 sq.yd', 580, 1085, 245, 65));

  return plots;
}

// Vector Layout Structural Features Generator for Summer Farmhouses Blueprint
export function getSummerFarmhousesLayoutFeatures() {
  return {
    boundary: { x: 30, y: 30, width: 880, height: 1155 },
    headerTitleX: 470,
    headerSurveyX: 470,
    roads: [
      { id: 'R-MAIN-100', name: "100'-0\" WIDE MAIN ENTRANCE ROAD", type: 'horizontal', x: 30, y: 1155, width: 880, height: 35 },
      { id: 'R-SPINE-50-RIGHT', name: "50'-0\" WIDE RIGHT SPINE ROAD", type: 'vertical', x: 840, y: 100, width: 45, height: 1055 },
      { id: 'R-INT-30-1', name: "30' WIDE ROAD", type: 'horizontal', x: 50, y: 175, width: 775, height: 20 },
      { id: 'R-INT-30-2', name: "30' WIDE ROAD", type: 'horizontal', x: 50, y: 345, width: 775, height: 25 },
      { id: 'R-INT-30-3', name: "30' WIDE ROAD", type: 'horizontal', x: 50, y: 520, width: 775, height: 25 },
      { id: 'R-INT-30-4', name: "30' WIDE ROAD", type: 'horizontal', x: 50, y: 695, width: 775, height: 25 },
      { id: 'R-INT-30-5', name: "30' WIDE ROAD", type: 'horizontal', x: 50, y: 870, width: 775, height: 25 },
      { id: 'R-INT-30-6', name: "30' WIDE ROAD", type: 'horizontal', x: 50, y: 965, width: 775, height: 25 },
      { id: 'R-INT-30-7', name: "30' WIDE ROAD", type: 'horizontal', x: 50, y: 1065, width: 775, height: 18 }
    ],
    vertical30FtRoads: [],
    amenities: [
      { id: 'AM-MOSQUE', name: 'MOSQUE', x: 50, y: 1085, width: 245, height: 65 },
      { id: 'AM-COMMUNITY', name: 'COMMUNITY HALL', x: 315, y: 1085, width: 245, height: 65 }
    ],
    sectorBoundaries: [
      { id: 'SEC-FARMS', name: "SUMMER FARMHOUSES (10.0 ACRES SECTOR)", color: 'rgba(245, 158, 11, 0.06)', stroke: '#f59e0b', points: "40,100 835,100 835,1150 40,1150" }
    ],
    entrancePos: { x: 740, y: 1158 },
    legendBox: {
      x: 930,
      y: 30,
      width: 490,
      height: 1120,
      items: [
        { name: "STANDARD FARMS (29 PLOTS)", val: "1000 SQYD (90'x100')" },
        { name: "MISC SIZE FARMS (5 PLOTS)", val: "1030 to 1425 SQYD" },
        { name: "F-1 (MISC FARM)", val: "1030 SQYD" },
        { name: "F-2 (MISC FARM)", val: "1060.66 SQYD" },
        { name: "F-3 (MISC FARM)", val: "1117 SQYD" },
        { name: "F-31 (MISC FARM)", val: "1425 SQYD" },
        { name: "F-34 (MISC FARM)", val: "1296 SQYD" },
        { name: "AMENITIES: MOSQUE & HALL", val: "RESERVED" },
        { name: "TOTAL LAND AREA", val: "10.0 ACRES" }
      ]
    }
  };
}
