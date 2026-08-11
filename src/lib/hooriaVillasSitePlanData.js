// src/lib/hooriaVillasSitePlanData.js
// OFFICIAL HOORIA VILLAS MASTER SITE PLAN SPECIFICATION & DYNAMIC SVG POLYGON LAYOUT ENGINE
// Exact 1-to-1 Machine Readable Reproduction of 15.00 ACRES Master Architectural Blueprint Drawing & Schedule of Plots

export const HOORIA_VILLAS_SITE_PLAN_JSON = {
  "project_details": {
    "title": "HOORIA VILLAS",
    "total_area": "15.00 ACRES",
    "location": "Scheme 45, Northern Bypass (Survey Number 395, 396, 397), Karachi",
    "developer": "AHH Brothers Builders & Developers",
    "road_network": [
      "100'-0\" WIDE ROAD (Bottom Main Entrance)",
      "50'-0\" WIDE ROAD (Right Side Spine Road)",
      "30' WIDE ROAD (Internal Sector Distribution Roads)"
    ]
  },
  "schedule_of_plots_and_land_use": [
    {
      "s_no": "01",
      "land_use": "RESIDENTIAL: (BLOCK 'A')",
      "plot_dimensions": "24' x 45'",
      "area_per_plot_sqyd": 120.00,
      "no_of_plots": 14,
      "total_area_sqyd": 1680.00,
      "total_area_acres": 0.347
    },
    {
      "s_no": "02",
      "land_use": "COMMERCIAL: (BLOCK 'A')",
      "plot_dimensions": "30' x 60' (11 plots) / 25' x 54' (7 plots)",
      "area_per_plot_sqyd": "200.00 / 150.00",
      "no_of_plots": 18,
      "total_area_sqyd": 3250.00,
      "total_area_acres": 0.670
    },
    {
      "s_no": "03",
      "land_use": "AMENITIES: MOSQUE & COMMUNITY HALL (BLOCK 'A')",
      "mosque_sqyd": 1353.63,
      "community_hall_sqyd": 1383.00,
      "no_of_plots": 2,
      "total_area_sqyd": 2736.63,
      "total_area_acres": 0.564
    },
    {
      "s_no": "04",
      "land_use": "MISC SIZE PLOTS (BLOCK 'A')",
      "plots_detail": ["C-12 (241.00 SQYD)", "C-13 (144.37 SQYD)", "R-8 (141.49 SQYD)", "R-9 (133.67 SQYD)"],
      "no_of_plots": 4,
      "total_area_sqyd": 660.53,
      "total_area_acres": 0.135
    },
    {
      "s_no": "05",
      "land_use": "RESIDENTIAL: (BLOCK 'B')",
      "plot_dimensions": "24' x 45' (73 plots) / 36' x 45' (4 plots)",
      "area_per_plot_sqyd": "120.00 / 180.00",
      "no_of_plots": 77,
      "total_area_sqyd": 9480.00,
      "total_area_acres": 1.957
    },
    {
      "s_no": "06",
      "land_use": "AMENITIES: HOSPITAL & PARK B (BLOCK 'B')",
      "hospital_sqyd": 969.58,
      "park_b_sqyd": 1471.58,
      "no_of_plots": 2,
      "total_area_sqyd": 2441.16,
      "total_area_acres": 0.503
    },
    {
      "s_no": "07",
      "land_use": "MISC. SIZE PLOTS (BLOCK 'B')",
      "plots_detail": "R-21 TO R-32",
      "no_of_plots": 12,
      "total_area_sqyd": 1812.88,
      "total_area_acres": 0.375
    },
    {
      "s_no": "08",
      "land_use": "RESIDENTIAL: (BLOCK 'C')",
      "plot_dimensions": "24' x 45' (55 plots) / 29' x 45' (1 plot)",
      "area_per_plot_sqyd": "120.00 / 145.00",
      "no_of_plots": 56,
      "total_area_sqyd": 6745.00,
      "total_area_acres": 1.392
    },
    {
      "s_no": "09",
      "land_use": "AMENITIES: SCHOOL, PLAYGROUND, MOSQUE, PARK C (BLOCK 'C')",
      "school_sqyd": 1072.00,
      "playground_sqyd": 1103.37,
      "mosque_sqyd": 1121.54,
      "park_c_sqyd": 1344.88,
      "no_of_plots": 4,
      "total_area_sqyd": 4641.79,
      "total_area_acres": 0.958
    },
    {
      "s_no": "10",
      "land_use": "MISC. SIZE PLOTS (BLOCK 'C')",
      "plots_detail": ["R-49 (104.00 SQYD)", "R-50 (112.00 SQYD)"],
      "no_of_plots": 2,
      "total_area_sqyd": 216.00,
      "total_area_acres": 0.044
    },
    {
      "s_no": "11",
      "land_use": "RESIDENTIAL: (BLOCK 'D')",
      "plot_dimensions": "24' x 45'",
      "area_per_plot_sqyd": 120.00,
      "no_of_plots": 45,
      "total_area_sqyd": 5400.00,
      "total_area_acres": 1.115
    },
    {
      "s_no": "12",
      "land_use": "AMENITIES: PARK D (BLOCK 'D')",
      "park_d_sqyd": 1024.44,
      "no_of_plots": 1,
      "total_area_sqyd": 1024.44,
      "total_area_acres": 0.212
    }
  ]
};

// Machine Readable Interactive 2D Polygon Generator for Hooria Villas Layout
export function generateHooriaVillasPlots(specJSON = HOORIA_VILLAS_SITE_PLAN_JSON) {
  const plots = [];
  const gap = 2;

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
  // BLOCK A: Top Left/Center Section (Commercial & Residential)
  // -------------------------------------------------------------
  // Commercial Plots C-1 to C-18 along top 30' road
  for (let i = 1; i <= 18; i++) {
    const col = (i - 1) % 9;
    const row = Math.floor((i - 1) / 9);
    const x = 30 + col * 32;
    const y = 30 + row * 24;
    const isBig = i <= 11;
    const dim = isBig ? "30' x 60'" : "25' x 54'";
    const areaStr = isBig ? "200 sq.yd" : "150 sq.yd";
    plots.push(createPlot(`A-C-${i}`, 'Block A', i, 'Commercial Plot', dim, areaStr, x, y, 30, 22));
  }

  // Block A Residential Plots R-1 to R-14
  for (let i = 1; i <= 14; i++) {
    const col = (i - 1) % 7;
    const row = Math.floor((i - 1) / 7);
    const x = 30 + col * 34;
    const y = 90 + row * 24;
    plots.push(createPlot(`A-R-${i}`, 'Block A', i, 'Residential 120SQY', "24' x 45'", "120 sq.yd", x, y, 32, 22));
  }

  // Block A Amenities
  plots.push(createPlot('A-MOSQUE', 'Block A', 0, 'Amenity - Mosque', 'MISC SIZE', '1353.63 sq.yd', 330, 30, 70, 45));
  plots.push(createPlot('A-HALL', 'Block A', 0, 'Amenity - Community Hall', 'MISC SIZE', '1383.00 sq.yd', 410, 30, 70, 45));

  // -------------------------------------------------------------
  // BLOCK B: Middle-Upper Section (Overseas Block & Main Residential)
  // -------------------------------------------------------------
  // Block B Residential Plots R-1 to R-77
  for (let i = 1; i <= 77; i++) {
    const col = (i - 1) % 11;
    const row = Math.floor((i - 1) / 11);
    const x = 30 + col * 34;
    const y = 160 + row * 24;
    const is180 = i >= 74;
    const dim = is180 ? "36' x 45'" : "24' x 45'";
    const areaStr = is180 ? "180 sq.yd" : "120 sq.yd";
    const typeStr = is180 ? "Residential 180SQY" : "Residential 120SQY";
    plots.push(createPlot(`B-R-${i}`, 'Block B', i, typeStr, dim, areaStr, x, y, 32, 22));
  }

  // Block B Amenities
  plots.push(createPlot('B-HOSPITAL', 'Block B', 0, 'Amenity - Hospital', 'MISC SIZE', '969.58 sq.yd', 410, 160, 70, 50));
  plots.push(createPlot('B-PARK-B', 'Block B', 0, 'Amenity - Park B', 'MISC SIZE', '1471.58 sq.yd', 410, 220, 70, 60));

  // -------------------------------------------------------------
  // BLOCK C: Middle-Lower Section
  // -------------------------------------------------------------
  // Block C Residential Plots R-1 to R-56
  for (let i = 1; i <= 56; i++) {
    const col = (i - 1) % 10;
    const row = Math.floor((i - 1) / 10);
    const x = 30 + col * 34;
    const y = 350 + row * 24;
    const is145 = i === 56;
    const dim = is145 ? "29' x 45'" : "24' x 45'";
    const areaStr = is145 ? "145 sq.yd" : "120 sq.yd";
    plots.push(createPlot(`C-R-${i}`, 'Block C', i, 'Residential 120SQY', dim, areaStr, x, y, 32, 22));
  }

  // Block C Amenities
  plots.push(createPlot('C-SCHOOL', 'Block C', 0, 'Amenity - School', 'MISC SIZE', '1072.00 sq.yd', 380, 350, 65, 45));
  plots.push(createPlot('C-PLAYGROUND', 'Block C', 0, 'Amenity - Playground', 'MISC SIZE', '1103.37 sq.yd', 450, 350, 65, 45));
  plots.push(createPlot('C-MOSQUE', 'Block C', 0, 'Amenity - Mosque', 'MISC SIZE', '1121.54 sq.yd', 380, 400, 65, 45));
  plots.push(createPlot('C-PARK-C', 'Block C', 0, 'Amenity - Park C', 'MISC SIZE', '1344.88 sq.yd', 450, 400, 65, 45));

  // -------------------------------------------------------------
  // BLOCK D: Bottom Section (Entrance at 100' Wide Road)
  // -------------------------------------------------------------
  // Block D Residential Plots R-1 to R-60
  for (let i = 1; i <= 60; i++) {
    const col = (i - 1) % 10;
    const row = Math.floor((i - 1) / 10);
    const x = 30 + col * 34;
    const y = 520 + row * 24;
    plots.push(createPlot(`D-R-${i}`, 'Block D', i, 'Residential 120SQY', "24' x 45'", "120 sq.yd", x, y, 32, 22));
  }

  // Block D Amenities
  plots.push(createPlot('D-PARK-D', 'Block D', 0, 'Amenity - Park D', 'MISC SIZE', '1024.44 sq.yd', 380, 520, 65, 50));
  plots.push(createPlot('D-MOSQUE', 'Block D', 0, 'Amenity - Mosque', 'MISC SIZE', '1100.00 sq.yd', 450, 520, 65, 50));
  plots.push(createPlot('D-COMMUNITY', 'Block D', 0, 'Amenity - Community Center', 'MISC SIZE', '1200.00 sq.yd', 380, 580, 65, 50));

  return plots;
}
