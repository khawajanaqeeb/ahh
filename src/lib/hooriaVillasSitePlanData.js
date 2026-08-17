// src/lib/hooriaVillasSitePlanData.js
// OFFICIAL HOORIA VILLAS MASTER SITE PLAN SPECIFICATION & DYNAMIC SVG POLYGON LAYOUT ENGINE
// 1-to-1 Machine Readable Reproduction of 15.00 ACRES Master Architectural Blueprint & Schedule of Plots

export const HOORIA_VILLAS_SITE_PLAN_JSON = {
  project_details: {
    title: "HOORIA VILLAS",
    total_area: "15.00 ACRES",
    location: "Scheme 45, Northern Bypass (Survey Number 395, 396, 397), Karachi",
    developer: "AHH Brothers Builders & Developers",
    road_network: [
      "100'-0\" WIDE ROAD (Bottom Main Entrance)",
      "50'-0\" WIDE ROAD (Right & Left Side Spine Roads)",
      "30' WIDE ROAD (Internal Sector Distribution Roads)"
    ]
  },
  schedule_of_plots_and_land_use: [
    {
      s_no: "01",
      land_use: "RESIDENTIAL: (BLOCK 'A')",
      plot_dimensions: "24' x 45'",
      area_per_plot_sqyd: 120.00,
      no_of_plots: 14,
      total_area_sqyd: 1680.00,
      total_area_acres: 0.347
    },
    {
      s_no: "02",
      land_use: "COMMERCIAL: (BLOCK 'A')",
      plot_dimensions: "30' x 60' (11 plots) / 25' x 54' (7 plots)",
      area_per_plot_sqyd: "200.00 / 150.00",
      no_of_plots: 18,
      total_area_sqyd: 3250.00,
      total_area_acres: 0.670
    },
    {
      s_no: "03",
      land_use: "AMENITIES: MOSQUE & COMMUNITY HALL (BLOCK 'A')",
      mosque_sqyd: 1353.63,
      community_hall_sqyd: 1383.00,
      no_of_plots: 2,
      total_area_sqyd: 2736.63,
      total_area_acres: 0.564
    },
    {
      s_no: "04",
      land_use: "MISC SIZE PLOTS (BLOCK 'A')",
      plots_detail: ["C-12 (241.00 SQYD)", "C-13 (144.37 SQYD)", "R-8 (141.49 SQYD)", "R-9 (133.67 SQYD)"],
      no_of_plots: 4,
      total_area_sqyd: 660.53,
      total_area_acres: 0.135
    },
    {
      s_no: "05",
      land_use: "RESIDENTIAL: (BLOCK 'B')",
      plot_dimensions: "24' x 45' (73 plots) / 36' x 45' (4 plots)",
      area_per_plot_sqyd: "120.00 / 180.00",
      no_of_plots: 77,
      total_area_sqyd: 9480.00,
      total_area_acres: 1.957
    },
    {
      s_no: "06",
      land_use: "AMENITIES: HOSPITAL & PARK B (BLOCK 'B')",
      hospital_sqyd: 969.58,
      park_b_sqyd: 1471.58,
      no_of_plots: 2,
      total_area_sqyd: 2441.16,
      total_area_acres: 0.503
    },
    {
      s_no: "07",
      land_use: "MISC. SIZE PLOTS (BLOCK 'B')",
      plots_detail: "R-21 TO R-32",
      no_of_plots: 12,
      total_area_sqyd: 1812.88,
      total_area_acres: 0.375
    },
    {
      s_no: "08",
      land_use: "RESIDENTIAL: (BLOCK 'C')",
      plot_dimensions: "24' x 45' (55 plots) / 29' x 45' (1 plot)",
      area_per_plot_sqyd: "120.00 / 145.00",
      no_of_plots: 56,
      total_area_sqyd: 6745.00,
      total_area_acres: 1.392
    },
    {
      s_no: "09",
      land_use: "AMENITIES: SCHOOL, PLAYGROUND, MOSQUE, PARK C (BLOCK 'C')",
      school_sqyd: 1072.00,
      playground_sqyd: 1103.37,
      mosque_sqyd: 1121.54,
      park_c_sqyd: 1344.88,
      no_of_plots: 4,
      total_area_sqyd: 4641.79,
      total_area_acres: 0.958
    },
    {
      s_no: "10",
      land_use: "MISC. SIZE PLOTS (BLOCK 'C')",
      plots_detail: ["R-49 (104.00 SQYD)", "R-50 (112.00 SQYD)"],
      no_of_plots: 2,
      total_area_sqyd: 216.00,
      total_area_acres: 0.044
    },
    {
      s_no: "11",
      land_use: "RESIDENTIAL: (BLOCK 'D')",
      plot_dimensions: "24' x 45'",
      area_per_plot_sqyd: 120.00,
      no_of_plots: 45,
      total_area_sqyd: 5400.00,
      total_area_acres: 1.115
    },
    {
      s_no: "12",
      land_use: "AMENITIES: PARK D (BLOCK 'D')",
      park_d_sqyd: 1024.44,
      no_of_plots: 1,
      total_area_sqyd: 1024.44,
      total_area_acres: 0.212
    }
  ]
};

// Machine Readable Interactive 2D Polygon Generator for Hooria Villas Layout
export function generateHooriaVillasPlots(specJSON = HOORIA_VILLAS_SITE_PLAN_JSON) {
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
      projectId: 'hooria-villas',
      block,
      plotNumber: plotNo,
      type,
      dimensions,
      area,
      rawCoords: `${coords[0].x},${coords[0].y} ${coords[1].x},${coords[1].y} ${coords[2].x},${coords[2].y} ${coords[3].x},${coords[3].y}`,
      coords
    };
  };

  // -------------------------------------------------------------
  // OVERSEAS BLOCK: Left Vertical Strip
  // -------------------------------------------------------------
  for (let i = 1; i <= 30; i++) {
    const row = (i - 1) % 15;
    const col = Math.floor((i - 1) / 15);
    const x = 50 + col * 36;
    const y = 130 + row * 34;
    plots.push(createPlot(`OV-${i}`, 'Overseas Block', i, 'Residential 120SQY', "24' x 45'", "120 sq.yd", x, y, 32, 28));
  }

  // -------------------------------------------------------------
  // BLOCK A: Top Right Section (Commercial & Residential)
  // -------------------------------------------------------------
  for (let i = 1; i <= 18; i++) {
    const col = (i - 1) % 9;
    const row = Math.floor((i - 1) / 9);
    const x = 170 + col * 46;
    const y = 130 + row * 36;
    const isBig = i <= 11;
    const dim = isBig ? "30' x 60'" : "25' x 54'";
    const areaStr = isBig ? "200 sq.yd" : "150 sq.yd";
    plots.push(createPlot(`A-C-${i}`, 'Block A', i, 'Commercial Plot', dim, areaStr, x, y, 42, 30));
  }

  for (let i = 1; i <= 14; i++) {
    const col = (i - 1) % 7;
    const row = Math.floor((i - 1) / 7);
    const x = 170 + col * 46;
    const y = 215 + row * 36;
    plots.push(createPlot(`A-R-${i}`, 'Block A', i, 'Residential 120SQY', "24' x 45'", "120 sq.yd", x, y, 42, 30));
  }

  plots.push(createPlot('A-MOSQUE', 'Block A', 0, 'Amenity - Mosque', 'MISC SIZE', '1353.63 sq.yd', 500, 130, 95, 65));
  plots.push(createPlot('A-HALL', 'Block A', 0, 'Amenity - Community Hall', 'MISC SIZE', '1383.00 sq.yd', 605, 130, 95, 65));

  // -------------------------------------------------------------
  // BLOCK B: Middle Upper Section
  // -------------------------------------------------------------
  for (let i = 1; i <= 77; i++) {
    const col = (i - 1) % 11;
    const row = Math.floor((i - 1) / 11);
    const x = 170 + col * 46;
    const y = 310 + row * 36;
    const is180 = i >= 74;
    const dim = is180 ? "36' x 45'" : "24' x 45'";
    const areaStr = is180 ? "180 sq.yd" : "120 sq.yd";
    const typeStr = is180 ? "Residential 180SQY" : "Residential 120SQY";
    plots.push(createPlot(`B-R-${i}`, 'Block B', i, typeStr, dim, areaStr, x, y, 42, 30));
  }

  plots.push(createPlot('B-HOSPITAL', 'Block B', 0, 'Amenity - Hospital', 'MISC SIZE', '969.58 sq.yd', 680, 310, 100, 70));
  plots.push(createPlot('B-PARK-B', 'Block B', 0, 'Amenity - Park B', 'MISC SIZE', '1471.58 sq.yd', 680, 395, 100, 90));

  // -------------------------------------------------------------
  // BLOCK C: Middle Lower Section
  // -------------------------------------------------------------
  for (let i = 1; i <= 56; i++) {
    const col = (i - 1) % 10;
    const row = Math.floor((i - 1) / 10);
    const x = 170 + col * 46;
    const y = 580 + row * 36;
    const is145 = i === 56;
    const dim = is145 ? "29' x 45'" : "24' x 45'";
    const areaStr = is145 ? "145 sq.yd" : "120 sq.yd";
    plots.push(createPlot(`C-R-${i}`, 'Block C', i, 'Residential 120SQY', dim, areaStr, x, y, 42, 30));
  }

  plots.push(createPlot('C-SCHOOL', 'Block C', 0, 'Amenity - School', 'MISC SIZE', '1072.00 sq.yd', 640, 580, 100, 65));
  plots.push(createPlot('C-PLAYGROUND', 'Block C', 0, 'Amenity - Playground', 'MISC SIZE', '1103.37 sq.yd', 750, 580, 100, 65));
  plots.push(createPlot('C-MOSQUE', 'Block C', 0, 'Amenity - Mosque', 'MISC SIZE', '1121.54 sq.yd', 640, 660, 100, 65));
  plots.push(createPlot('C-PARK-C', 'Block C', 0, 'Amenity - Park C', 'MISC SIZE', '1344.88 sq.yd', 750, 660, 100, 65));

  // -------------------------------------------------------------
  // BLOCK D: Bottom Section (Near 100' Wide Main Entrance Road)
  // -------------------------------------------------------------
  for (let i = 1; i <= 50; i++) {
    const col = (i - 1) % 10;
    const row = Math.floor((i - 1) / 10);
    const x = 170 + col * 46;
    const y = 810 + row * 36;
    plots.push(createPlot(`D-R-${i}`, 'Block D', i, 'Residential 120SQY', "24' x 45'", "120 sq.yd", x, y, 42, 30));
  }

  plots.push(createPlot('D-PARK-D', 'Block D', 0, 'Amenity - Park D', 'MISC SIZE', '1024.44 sq.yd', 640, 810, 100, 75));
  plots.push(createPlot('D-MOSQUE', 'Block D', 0, 'Amenity - Mosque', 'MISC SIZE', '1100.00 sq.yd', 750, 810, 100, 75));
  plots.push(createPlot('D-COMMUNITY', 'Block D', 0, 'Amenity - Community Center', 'MISC SIZE', '1200.00 sq.yd', 640, 900, 210, 75));

  return plots;
}

// Vector Layout Structural Features Generator for Hooria Villas Blueprint
export function getHooriaVillasLayoutFeatures() {
  return {
    boundary: { x: 30, y: 30, width: 880, height: 970 },
    headerTitleX: 470,
    headerSurveyX: 470,
    roads: [
      { id: 'R-MAIN-100', name: "100'-0\" WIDE MAIN ENTRANCE ROAD", type: 'horizontal', x: 30, y: 960, width: 880, height: 35 },
      { id: 'R-SPINE-50-RIGHT', name: "50'-0\" WIDE RIGHT SPINE ROAD", type: 'vertical', x: 865, y: 100, width: 45, height: 860 },
      { id: 'R-SPINE-50-LEFT', name: "50'-0\" WIDE OVERSEAS ROAD", type: 'vertical', x: 130, y: 100, width: 35, height: 860 },
      { id: 'R-INT-30-A', name: "30' WIDE ROAD (BLOCK A)", type: 'horizontal', x: 165, y: 195, width: 700, height: 18 },
      { id: 'R-INT-30-B', name: "30' WIDE ROAD (BLOCK B)", type: 'horizontal', x: 165, y: 290, width: 700, height: 18 },
      { id: 'R-INT-30-C', name: "30' WIDE ROAD (BLOCK C)", type: 'horizontal', x: 165, y: 560, width: 700, height: 18 },
      { id: 'R-INT-30-D', name: "30' WIDE ROAD (BLOCK D)", type: 'horizontal', x: 165, y: 790, width: 700, height: 18 }
    ],
    vertical30FtRoads: [],
    amenities: [
      { id: 'AM-PARK-B', name: 'PARK (B)\n1471.58 SQYD', x: 680, y: 395, width: 100, height: 90 },
      { id: 'AM-PARK-C', name: 'PARK (C)\n1344.88 SQYD', x: 750, y: 660, width: 100, height: 65 },
      { id: 'AM-PARK-D', name: 'PARK (D)\n1024.44 SQYD', x: 640, y: 810, width: 100, height: 75 },
      { id: 'AM-HOSPITAL', name: 'HOSPITAL\n969.58 SQYD', x: 680, y: 310, width: 100, height: 70 },
      { id: 'AM-SCHOOL', name: 'SCHOOL\n1072.00 SQYD', x: 640, y: 580, width: 100, height: 65 },
      { id: 'AM-PLAYGROUND', name: 'PLAY GROUND\n1103.37 SQYD', x: 750, y: 580, width: 100, height: 65 },
      { id: 'AM-MOSQUE-A', name: 'MOSQUE\n1353.63 SQYD', x: 500, y: 130, width: 95, height: 65 },
      { id: 'AM-MOSQUE-C', name: 'MOSQUE\n1121.54 SQYD', x: 640, y: 660, width: 100, height: 65 },
      { id: 'AM-COMMUNITY-A', name: 'COMMUNITY HALL\n1383.00 SQYD', x: 605, y: 130, width: 95, height: 65 }
    ],
    sectorBoundaries: [
      { id: 'SEC-A', name: "BLOCK 'A' (COMMERCIAL & RESIDENTIAL)", color: 'rgba(59, 130, 246, 0.08)', stroke: '#3b82f6', points: "165,100 860,100 860,285 165,285" },
      { id: 'SEC-B', name: "BLOCK 'B' (RESIDENTIAL & HOSPITAL)", color: 'rgba(168, 85, 247, 0.08)', stroke: '#a855f7', points: "165,295 860,295 860,555 165,555" },
      { id: 'SEC-C', name: "BLOCK 'C' (SCHOOL & PLAYGROUND)", color: 'rgba(16, 185, 129, 0.08)', stroke: '#10b981', points: "165,565 860,565 860,785 165,785" },
      { id: 'SEC-D', name: "BLOCK 'D' (MAIN ENTRANCE SECTOR)", color: 'rgba(245, 158, 11, 0.08)', stroke: '#f59e0b', points: "165,795 860,795 860,955 165,955" },
      { id: 'SEC-OV', name: "OVERSEAS BLOCK", color: 'rgba(236, 72, 153, 0.08)', stroke: '#ec4899', points: "40,100 125,100 125,955 40,955" }
    ],
    entrancePos: { x: 740, y: 965 },
    legendBox: {
      x: 950,
      y: 30,
      width: 480,
      height: 940,
      items: [
        { name: "RESIDENTIAL: BLOCK 'A' (14 PLOTS)", val: "120 SQYD" },
        { name: "COMMERCIAL: BLOCK 'A' (18 PLOTS)", val: "150/200 SQYD" },
        { name: "RESIDENTIAL: BLOCK 'B' (77 PLOTS)", val: "120/180 SQYD" },
        { name: "RESIDENTIAL: BLOCK 'C' (56 PLOTS)", val: "120/145 SQYD" },
        { name: "RESIDENTIAL: BLOCK 'D' (45 PLOTS)", val: "120 SQYD" },
        { name: "OVERSEAS BLOCK (30 PLOTS)", val: "120 SQYD" },
        { name: "TOTAL LAND AREA", val: "15.00 ACRES" }
      ]
    }
  };
}
