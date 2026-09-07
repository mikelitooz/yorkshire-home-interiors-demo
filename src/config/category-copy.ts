/**
 * Per-category page copy: the short note under the heading and the long-form
 * note below the grid, plus the questions that feed both the FAQ accordion and
 * FAQPage schema.
 *
 * WHY THIS IS CONFIG AND NOT JSX: the copy is a content decision the client
 * will want to edit, and the FAQ answers are also published as structured data.
 * Keeping both in one place means a question can never appear in schema that a
 * visitor cannot read on the page, and an edit cannot update one and miss the
 * other.
 *
 * ── TRUTHFULNESS RULE FOR THIS FILE ──────────────────────────────────────────
 * Every concrete statement here is derived from the product records in
 * src/data/ecommerce.ts — dimensions, materials, configurations, product names.
 * Nothing in this file claims anything about delivery, lead times, guarantees,
 * warranties, returns, finance, payment, stock, provenance, manufacturing or
 * price promises, because none of those are confirmed by the client. The one
 * business fact used is that the showroom is in Sheffield, which is established
 * by the site's own copy.
 *
 * The showroom lines deliberately say "ask us what is on display" rather than
 * "all of these are in the showroom". Which products are on the floor at any
 * time is not something we have been told.
 *
 * If a product is added, removed or re-specified, re-read the copy for that
 * category. scripts checked in the acceptance run assert that every product
 * name and every FAQ question mentioned here is actually present on the page.
 */

export type CategoryFaq = {
  q: string;
  /** Plain text. Rendered as the answer AND used verbatim as the FAQPage answer, so the two cannot drift. */
  a: string;
};

export type CategoryCopy = {
  /** The page's H1. Matches the category name, so H1, breadcrumb, <title> and CollectionPage.name all agree. */
  h1: string;
  /** The short note directly under the heading. */
  intro: string;
  longForm: {
    heading: string;
    paragraphs: string[];
  };
  faqs: CategoryFaq[];
};

const SHOWROOM_SOFT =
  "Our showroom is in Sheffield. Get in touch before you travel and we can tell you what is on display.";

export const categoryCopy: Record<string, CategoryCopy> = {
  /* ── Sofas ─────────────────────────────────────────────────── */
  sofas: {
    h1: "Sofas",
    intro:
      "Two, three and four-seat sofas plus a fold-out sofa bed, in woven, chenille and polyester-blend fabrics on hardwood and metal frames.",
    longForm: {
      heading: "Choosing a sofa",
      paragraphs: [
        "The widest frame in this range is 248cm and the narrowest is 170cm, so the deciding question is usually the room rather than the sofa. Measure the wall you intend to fill, then measure the route to it: doorways, stair turns and hallway pinch-points settle more sofa purchases than fabric ever does. Width, depth and height are listed on every product page, and depths here run from 90cm to 102cm.",
        "Seat counts run from two to four. A two-seat frame like the Settle Petite suits a snug, a bay window or a second reception room. A four-seat frame like the Lancaster Cloud is a main-room sofa and wants space to breathe on at least one side. The Bramley Sofa Bed folds out on a metal frame, which is the one to look at if the room has to double as a guest room.",
        "Fabrics in this range are woven, chenille and polyester blends. Frames are solid hardwood on the Lancaster Cloud and the Settle Petite, kiln-dried on the Harrogate Tailored, and a fold-out metal frame on the Bramley. Textured fabrics like chenille hide the marks of everyday use better than a flat weave does. The exact fabric and frame for each sofa is listed under Materials on its own page.",
        `If you are deciding between two, sitting on both settles it faster than any description can. ${SHOWROOM_SOFT}`,
      ],
    },
    faqs: [
      {
        q: "What sizes do these sofas come in?",
        a: "Widths run from 170cm on the Settle Petite two-seater up to 248cm on the Lancaster Cloud four-seater, with depths between 90cm and 102cm. Full width, depth and height figures are listed on every product page.",
      },
      {
        q: "Is there a sofa bed in this range?",
        a: "Yes. The Bramley Sofa Bed is 215cm wide and pulls out on a fold-out metal frame, so it works as an everyday sofa and an occasional guest bed.",
      },
      {
        q: "What are the frames made from?",
        a: "Solid hardwood on the Lancaster Cloud and the Settle Petite, a kiln-dried frame on the Harrogate Tailored, and a fold-out metal frame on the Bramley Sofa Bed. Each product page lists its own frame and fabric under Materials.",
      },
      {
        q: "Can I see these sofas before I buy?",
        a: SHOWROOM_SOFT,
      },
    ],
  },

  /* ── Corner sofas ──────────────────────────────────────────── */
  "corner-sofas": {
    h1: "Corner Sofas",
    intro:
      "L-shaped corner sofas for open-plan rooms, both over 2.7 metres along the longest side, in plush velvet and hard-wearing family fabric.",
    longForm: {
      heading: "Choosing a corner sofa",
      paragraphs: [
        // "return" was the natural furniture word for the short arm of the L, but
        // on a retail page it can be misread as a returns policy, which is a claim
        // we are not in a position to make. "Deep" is unambiguous and matches the
        // depth figure on the product page.
        "A corner sofa is the piece most often measured wrong, because it has two lengths to account for instead of one. Both frames here run over 2.7 metres wide and over 1.8 metres deep: the Whitby Luxe is 284cm by 196cm, the York Cosy Chaise 271cm by 182cm. Mark both runs out on the floor with masking tape before you decide, and leave a walking route around the open side.",
        "Which way round the long section sits matters as much as the measurement. Look carefully at the images on each product page, and if you need the chaise on a particular side, ask us before you order rather than after.",
        "The Whitby Luxe is upholstered in plush velvet over pocket sprung seat support, which is the richer-looking of the two and catches the light across the seat. The York Cosy Chaise uses what its specification calls a durable family fabric, with foam and fibre fill — that is the language to look for if the room takes heavy daily use. Both are set out in full under Materials.",
        `A corner sofa is a large commitment to make from a photograph. ${SHOWROOM_SOFT}`,
      ],
    },
    faqs: [
      {
        q: "How much space do I need for these corner sofas?",
        a: "The Whitby Luxe Corner Sofa is 284cm wide, 196cm deep and 88cm high. The York Cosy Chaise Corner Sofa is 271cm wide, 182cm deep and 86cm high. Mark both runs out on the floor before ordering.",
      },
      {
        q: "What is the difference between the two corner sofas?",
        a: "The Whitby Luxe is plush velvet over pocket sprung seat support and is the larger of the two. The York Cosy Chaise is a durable family fabric with foam and fibre fill, and is slightly smaller in both directions.",
      },
      {
        q: "Do they include a chaise section?",
        a: "Yes. The Whitby Luxe is described as having a generous chaise section, and the York Cosy Chaise is named for its chaise. Check the images on each product page to see which way it is oriented.",
      },
      {
        q: "Can I see these corner sofas before I buy?",
        a: SHOWROOM_SOFT,
      },
    ],
  },

  /* ── Recliner sofas ────────────────────────────────────────── */
  "recliner-sofas": {
    h1: "Recliner Sofas",
    intro:
      "Manual and electric recliners, from a compact two-seater to a modular corner with powered headrests, in soft-touch fabric and performance leather-look upholstery.",
    longForm: {
      heading: "Choosing a recliner",
      paragraphs: [
        "The first decision is manual or powered. The Malton Manual works on a pull handle and needs no socket at all. The Driffield Cinema reclines electrically and adds USB charging and cup holders. The Otley Motion Corner uses an electric motion system with powered headrests. Anything electric needs a power point within reach of where the sofa will actually stand, which is worth checking before you order rather than on delivery day.",
        "Recliners need clearance behind and in front that a fixed sofa does not. These are also the tallest frames on the site at 101cm to 103cm high, so measure carefully if the sofa is going under a low window sill or a wall-mounted television.",
        "Sizes run from 168cm wide on the Malton Manual two-seater up to the Otley Motion Corner at 298cm by 232cm, which is a room-defining piece rather than an extra seat. The Driffield Cinema sits between the two at 236cm.",
        "The Driffield and the Otley use performance faux leather and leather-look upholstery over a steel recliner mechanism and an electric motion system respectively. The Malton is a soft-touch fabric on a reinforced frame.",
        `Recline angle and headrest position are the two things hardest to judge from a photograph, and the two most worth trying. ${SHOWROOM_SOFT}`,
      ],
    },
    faqs: [
      {
        q: "Which of these recliners are electric?",
        a: "The Driffield Cinema Recliner Sofa has a power recline, and the Otley Motion Recliner Corner uses an electric motion system with electric headrests. The Malton Manual Recliner 2 Seat is operated by a pull handle and needs no power.",
      },
      {
        q: "Do any of them have USB charging?",
        a: "The Driffield Cinema Recliner Sofa is listed with USB charging and cup holders.",
      },
      {
        q: "How tall are these recliners?",
        a: "They stand between 101cm and 103cm high: the Malton Manual at 101cm, the Otley Motion Corner at 102cm and the Driffield Cinema at 103cm. That is taller than the fixed sofas in the range, so check any low window sill.",
      },
      {
        q: "Is there a smaller recliner for a compact room?",
        a: "The Malton Manual Recliner 2 Seat is the most compact at 168cm wide and 98cm deep.",
      },
    ],
  },

  /* ── Beds ──────────────────────────────────────────────────── */
  beds: {
    h1: "Beds",
    intro:
      "Upholstered king-size bed frames, one with a vertical-channel headboard and one with a gas-lift ottoman storage base.",
    longForm: {
      heading: "Choosing a bed frame",
      paragraphs: [
        "Both frames here are listed in king size, and both need a little over 170cm of width: the Ainsley is 171cm by 220cm, the Bridlington 172cm by 222cm. That length is the figure people forget, because a bed frame is longer than the mattress it holds once the headboard and surround are counted. Measure the room with the door swing in mind.",
        "Headboard height differs more than the footprint does. The Ainsley Upholstered Bed Frame stands 125cm tall with a vertical-channel headboard; the Bridlington Storage Ottoman Bed is 118cm. If the bed sits under a window, beneath a sloping ceiling or against a picture rail, those seven centimetres decide it.",
        "The Bridlington is an ottoman: the base lifts on a gas-lift mechanism to a storage void underneath, which is the most useful square metre in a small bedroom. It needs clear floor in front to open fully, so it is not the right choice tight against a radiator or a chest of drawers. The Ainsley is a straightforward frame on sprung slats.",
        "Fabrics are a textured linen-look on the Ainsley and a velvet-touch finish on the Bridlington. Both are listed as bed frames, so check the specification on the product page for exactly what is included before you order.",
        `A headboard reads very differently in a room than it does on a screen. ${SHOWROOM_SOFT}`,
      ],
    },
    faqs: [
      {
        q: "What size are these beds?",
        a: "Both are listed in king size. The Ainsley Upholstered Bed Frame is 171cm wide by 220cm long, and the Bridlington Storage Ottoman Bed is 172cm by 222cm.",
      },
      {
        q: "Which bed has storage?",
        a: "The Bridlington Storage Ottoman Bed. Its base lifts on a gas-lift mechanism to a storage area underneath, so it needs clear floor space in front to open.",
      },
      {
        q: "How tall are the headboards?",
        a: "The Ainsley Upholstered Bed Frame is 125cm tall and has a vertical-channel headboard. The Bridlington Storage Ottoman Bed is 118cm tall.",
      },
      {
        q: "Do these beds come with a mattress?",
        a: "Both products are listed as bed frames. Check the specification on the product page for what is included, and ask us if you are unsure.",
      },
    ],
  },

  /* ── Dining ────────────────────────────────────────────────── */
  dining: {
    h1: "Dining",
    intro:
      "Dining sets in oak and oak-veneer finishes: a round table with four chairs, an extendable table seating six to eight, and a compact table with two benches.",
    longForm: {
      heading: "Choosing a dining set",
      paragraphs: [
        "Start from how many people eat at the table on an ordinary weekday, not from how many sit down at Christmas. The Wetherby Round seats four around a 120cm circle and is the easiest of the three to move around in a tight kitchen. The Ilkley Extendable is listed as a six to eight seat set and extends from 180cm to 220cm, so it does both jobs from one footprint. The Thirsk Compact pairs a 160cm table with two benches that push underneath when they are not in use.",
        "Shape matters as much as size. A round table has no corners to catch a hip in a narrow room and suits a square space; a rectangular table sits better against a wall or down the length of a galley kitchen. If you need a small table for most of the year and a long one occasionally, the extendable Ilkley is the one to look at.",
        "Tops are oak veneer on the Ilkley, an engineered oak top on the Wetherby and an oak finish on the Thirsk, with powder-coated steel bases on the Ilkley and the Thirsk. Seating differs across the three: woven fabric chairs with the Ilkley, curved upholstered chairs with the Wetherby, and benches with the Thirsk.",
        "Leave room to pull a chair out. The tables stand 75cm to 76cm high, and a dining chair needs roughly its own depth again behind it before anyone can sit down comfortably — which is one reason bench seating works well in a room that is tight at one end.",
        `Chair comfort is the part that photographs least well. ${SHOWROOM_SOFT}`,
      ],
    },
    faqs: [
      {
        q: "How many people do these dining sets seat?",
        a: "The Wetherby Round Dining Set seats four. The Ilkley Extendable Dining Set is listed as a six to eight seat set. The Thirsk Compact Dining Bench Set comes with two benches, so the number depends on who is sitting.",
      },
      {
        q: "Which dining table extends?",
        a: "The Ilkley Extendable Dining Set. Its table extends from 180cm to 220cm long and is 95cm deep.",
      },
      {
        q: "Is there a round dining table?",
        a: "The Wetherby Round Dining Set has a 120cm diameter table at 75cm high, supplied with curved upholstered chairs.",
      },
      {
        q: "What are the tables made from?",
        a: "The Ilkley uses an oak veneer with a powder-coated steel base, the Wetherby an engineered oak top, and the Thirsk an oak finish top on a powder-coated steel base. Each product page lists its own materials.",
      },
    ],
  },

  /* ── Chairs ────────────────────────────────────────────────── */
  chairs: {
    h1: "Chairs",
    intro:
      "Accent and lounge chairs in bouclé and textured weave, including a swivel chair on a metal base. All three sit under 90cm wide.",
    longForm: {
      heading: "Choosing an accent chair",
      paragraphs: [
        "An accent chair earns its place by filling a corner without crowding it. All three of these sit between 79cm and 86cm wide and between 79cm and 82cm deep, which is small enough for a reading corner, a bay window or the space beside a fireplace, and small enough to carry up a normal staircase.",
        "The Skipton Swivel Armchair turns through 360 degrees on a metal swivel base, which earns its keep in a room where the chair has to face both the television and the conversation. The Helmsley Accent Chair and the Bingley Boucle Lounge Chair are fixed on legs: hardwood on the Helmsley, walnut-stain on the Bingley.",
        "Two of the three are bouclé — the Helmsley and the Bingley. Bouclé is a looped, nubby weave that reads as texture rather than as colour, which is exactly why it works beside a plain sofa. The Skipton is a textured weave on a metal base.",
        "If you are buying a chair to sit alongside a sofa you already own, deliberate contrast is safer than a near-match. A bouclé chair next to a flat-weave sofa looks intentional; the same fabric slightly off looks like a mistake.",
        `Chairs are the easiest thing in the range to judge by sitting in them. ${SHOWROOM_SOFT}`,
      ],
    },
    faqs: [
      {
        q: "How big are these chairs?",
        a: "Widths run from 79cm on the Bingley Boucle Lounge Chair to 86cm on the Skipton Swivel Armchair, with depths of 79cm to 82cm and heights of 84cm to 88cm.",
      },
      {
        q: "Which chair swivels?",
        a: "The Skipton Swivel Armchair turns through 360 degrees on a metal swivel base.",
      },
      {
        q: "Which chairs are bouclé?",
        a: "The Helmsley Accent Chair and the Bingley Boucle Lounge Chair are both bouclé. The Skipton Swivel Armchair is a textured weave fabric.",
      },
      {
        q: "What are the legs made from?",
        a: "Hardwood legs on the Helmsley Accent Chair, walnut-stain legs on the Bingley Boucle Lounge Chair, and a metal swivel base on the Skipton Swivel Armchair.",
      },
    ],
  },

  /* ── Coffee tables ─────────────────────────────────────────── */
  "coffee-tables": {
    h1: "Coffee Tables",
    intro:
      "Round, nesting and fluted coffee tables in stone-effect and oak-veneer finishes, including a set of two and one with a hidden shelf.",
    longForm: {
      heading: "Choosing a coffee table",
      paragraphs: [
        "These are low tables — 37cm on the Knaresborough and 38cm on the Selby — which is low enough to keep sightlines clear across a room and to sit comfortably below the arm of a sofa. Height is worth checking against the sofa you already have before anything else.",
        "Shape decides how a room walks. The Knaresborough Stone Coffee Table is a 90cm circle with no corner to catch a shin, which is the safer choice in a tight walkway or a house with small children. The Selby Fluted Coffee Table is rectangular at 110cm by 60cm and gives you noticeably more usable surface for the same floor area.",
        "The Ripon is a set of two nesting tables at 78cm and 58cm across: one tucked under the other most of the time, both out when there are people in. It is the most flexible option here and the easiest to move.",
        "Finishes across the three are a stone-effect composite top on an oak-veneer base, oak veneer on a powder-coated steel frame, and an engineered wood with an oak-veneer fluted finish. The Selby also has a hidden shelf under the top, which is where remotes and books go to stop living on the surface.",
        `Finish and grain are hard to read from a screen, particularly across oak veneers. ${SHOWROOM_SOFT}`,
      ],
    },
    faqs: [
      {
        q: "How high are these coffee tables?",
        a: "The Knaresborough Stone Coffee Table is 37cm high and the Selby Fluted Coffee Table is 38cm. The Ripon Nesting Coffee Tables are listed by diameter — 78cm and 58cm — on their product page.",
      },
      {
        q: "Which coffee table has storage?",
        a: "The Selby Fluted Coffee Table has a hidden shelf beneath the top.",
      },
      {
        q: "Do any come as a set?",
        a: "The Ripon Nesting Coffee Tables are a set of two, at 78cm and 58cm across, finished in oak veneer on a powder-coated steel frame.",
      },
      {
        q: "What are they made from?",
        a: "A stone-effect composite top on an oak-veneer base for the Knaresborough, oak veneer with a powder-coated steel frame for the Ripon, and engineered wood with an oak-veneer finish for the Selby.",
      },
    ],
  },

  /* ── Wardrobes ─────────────────────────────────────────────── */
  wardrobes: {
    h1: "Wardrobes",
    intro:
      "Hinged, sliding and mirrored wardrobes from 152cm to 200cm wide and 202cm to 212cm tall, in laminated oak board and mirrored finishes.",
    longForm: {
      heading: "Choosing a wardrobe",
      paragraphs: [
        "Height is the measurement that catches people out. These run from 202cm to 212cm, and a wardrobe usually has to be tilted upright once it is in the room, so you need more clearance than the finished height suggests. Measure floor to ceiling, and look for the light fitting, the coving or the sloping ceiling that will be in the way.",
        "Hinged doors need swing space in front of them; sliding doors do not. The Filey 3 Door Wardrobe is hinged with soft-close storage at 152cm wide. The Scarborough Sliding Wardrobe and the Leyburn Mirrored Wardrobe both use sliding fronts, at 180cm and 200cm wide, which is the better answer in a room where the bed sits close to the wardrobe.",
        "The Scarborough has mirrored sliding panels and the Leyburn has full-height mirror fronts. Both save you hanging a separate mirror and make a smaller bedroom read larger. The Filey is a plain laminated oak board with matte black handles, which is the one to choose if there is already a mirror in the room.",
        "All three are between 60cm and 65cm deep. That is the figure to check against the doorway, the landing and the stair turn you have to carry it through, and it is the depth that decides whether a coat hanger sits square or at an angle.",
        `Mirror fronts in particular behave differently in a real room than in a photograph. ${SHOWROOM_SOFT}`,
      ],
    },
    faqs: [
      {
        q: "How tall are these wardrobes?",
        a: "The Filey 3 Door Wardrobe is 202cm tall, the Scarborough Sliding Wardrobe 210cm and the Leyburn Mirrored Wardrobe 212cm. Allow extra clearance for tilting the wardrobe upright in the room.",
      },
      {
        q: "Which wardrobes have sliding doors?",
        a: "The Scarborough Sliding Wardrobe and the Leyburn Mirrored Wardrobe both have sliding fronts. The Filey 3 Door Wardrobe has hinged doors with soft-close storage.",
      },
      {
        q: "Are any of them mirrored?",
        a: "Yes. The Scarborough Sliding Wardrobe has mirrored sliding panels and the Leyburn Mirrored Wardrobe has full-height mirror sliding fronts.",
      },
      {
        q: "How deep are these wardrobes?",
        a: "Between 60cm and 65cm: the Filey at 60cm, the Leyburn at 64cm and the Scarborough at 65cm.",
      },
    ],
  },

  /* ── Decor ─────────────────────────────────────────────────── */
  decor: {
    h1: "Decor",
    intro:
      "Finishing pieces for a room: a wool-blend rug, a glazed ceramic table lamp and a set of three textured cushions.",
    longForm: {
      heading: "Finishing a room",
      paragraphs: [
        "A rug that is too small is the most common mistake in an otherwise finished room. The Heaton Wool Blend Rug is 160cm by 230cm, which is a living-room size: large enough to sit under the front legs of a sofa and a coffee table together, rather than floating in the middle of the floor like a doormat.",
        "The Oakley Ceramic Table Lamp stands 52cm tall with a 32cm shade, which puts the shade near eye level on a side table when you are seated. That is the height at which a lamp lights the room rather than the ceiling. Two or three low light sources read warmer in the evening than a single overhead fitting.",
        "The Farsley Textured Cushion Set is three 45cm square cushions in cotton-blend covers with a recycled-fibre fill. An odd number along a sofa looks less staged than a matching pair at each end.",
        "Texture is what these three have in common: a wool-blend pile underfoot, a glazed ceramic base against a linen-blend shade, and a textured cover on the cushions. When the colours in a room are close together, texture is what stops the whole thing reading flat.",
        `Colour and texture are the hardest things to judge on a screen. ${SHOWROOM_SOFT}`,
      ],
    },
    faqs: [
      {
        q: "What size is the rug?",
        a: "The Heaton Wool Blend Rug is 160cm by 230cm, in a wool-blend pile.",
      },
      {
        q: "How tall is the table lamp?",
        a: "The Oakley Ceramic Table Lamp is 52cm tall with a 32cm diameter shade, on a glazed ceramic base with a linen-blend shade.",
      },
      {
        q: "How many cushions are in the set?",
        a: "The Farsley Textured Cushion Set contains three cushions, each 45cm by 45cm, with cotton-blend covers and a recycled-fibre fill.",
      },
      {
        q: "Can you help me put a scheme together?",
        a: SHOWROOM_SOFT,
      },
    ],
  },
};

export const categoryCopyFor = (slug: string): CategoryCopy | undefined => categoryCopy[slug];
