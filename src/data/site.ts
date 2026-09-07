import {
  Armchair,
  BedDouble,
  Clock,
  Columns3,
  LampFloor,
  MapPin,
  PackageCheck,
  Ruler,
  Sofa,
  Sparkles,
  Truck,
  UsersRound
} from "lucide-react";

export const business = {
  name: "Yorkshire Home Interiors Ltd",
  tagline: "Furniture, carpets and home styling for Sheffield homes.",
  address: "264 Queens Rd, Lowfield, Sheffield S2 4DL",
  phone: "0114 349 8269",
  email: "hello@yorkshirehomeinteriors.co.uk",
  rating: "5.0",
  reviews: "12 Google reviews",
  hours: [
    ["Monday", "9:30 AM - 5:30 PM"],
    ["Tuesday", "9:30 AM - 5:30 PM"],
    ["Wednesday", "9:30 AM - 5:30 PM"],
    ["Thursday", "9:30 AM - 5:30 PM"],
    ["Friday", "9:30 AM - 5:30 PM"],
    ["Saturday", "9:30 AM - 5:30 PM"],
    ["Sunday", "11:00 AM - 4:00 PM"]
  ],
  sourceNote:
    "Business details and review themes are based on the public Yorkshire.com listing, which references Google profile data."
};

export const sourcePages = [
  "https://www.yorkshire.com/sheffield/shopping/furniture-shops/yorkshire-home-interiors-ltd",
  "https://www.yell.com/biz/yorkshire-furniture-and-carpet-warehouse-sheffield-2539844/",
  "https://www.loopnet.com/Listing/264-270-Queens-Rd-Sheffield/38065855/"
];

export const media = {
  hero:
    "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=2200&q=85",
  showroom:
    "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1800&q=85",
  sofaWall:
    "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1800&q=85",
  dining:
    "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1800&q=85",
  bedroom:
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1800&q=85",
  decor:
    "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1800&q=85",
  chair:
    "https://images.unsplash.com/photo-1567016432779-094069958ea5?auto=format&fit=crop&w=1800&q=85",
  wardrobe:
    "https://images.unsplash.com/photo-1618221118493-9cfa1a1c00da?auto=format&fit=crop&w=1800&q=85",
  coffee:
    "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1800&q=85",
  carpet:
    "https://images.unsplash.com/photo-1600121848594-d8644e57abab?auto=format&fit=crop&w=1800&q=85"
};

export const navigation = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Collection", href: "/shop" },
  { label: "Services", href: "/services" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" }
];

export const collections = [
  {
    title: "Corner Sofas",
    description: "Generous family seating with modern fabrics and practical layouts.",
    price: "From £699",
    image: media.sofaWall,
    icon: Sofa
  },
  {
    title: "Recliner Sofas",
    description: "Relaxed comfort with supportive seating and showroom-ready finishes.",
    price: "From £849",
    image: media.chair,
    icon: Armchair
  },
  {
    title: "Dining Sets",
    description: "Tables and chairs for everyday meals, hosting, and open-plan spaces.",
    price: "From £499",
    image: media.dining,
    icon: UsersRound
  },
  {
    title: "Beds",
    description: "Statement beds, mattresses, and bedroom bundles for restful rooms.",
    price: "From £399",
    image: media.bedroom,
    icon: BedDouble
  },
  {
    title: "Wardrobes",
    description: "Storage-led bedroom furniture with clean proportions and rich finishes.",
    price: "From £549",
    image: media.wardrobe,
    icon: Columns3
  },
  {
    title: "Coffee Tables",
    description: "Compact centrepieces, nesting tables, and occasional furniture.",
    price: "From £129",
    image: media.coffee,
    icon: LampFloor
  },
  {
    title: "Living Room Furniture",
    description: "TV units, sideboards, sofas, chairs, rugs, and finishing touches.",
    price: "From £199",
    image: media.showroom,
    icon: Sofa
  },
  {
    title: "Home Decor",
    description: "Mirrors, lighting, cushions, accessories, and styled room details.",
    price: "From £39",
    image: media.decor,
    icon: Sparkles
  }
];

export const services = [
  {
    title: "Interior Design",
    description: "A guided showroom experience to shape colours, textures, furniture and flooring around your home.",
    icon: Sparkles
  },
  {
    title: "Furniture Consultation",
    description: "Practical advice on sofa sizing, bed choices, dining layouts and finishes before you buy.",
    icon: Sofa
  },
  {
    title: "Space Planning",
    description: "Room-by-room layout guidance so large pieces feel balanced and comfortable in real spaces.",
    icon: Ruler
  },
  {
    title: "Furniture Delivery",
    description: "Coordinated local delivery with careful handling, assembly options and timing that suits you.",
    icon: Truck
  },
  {
    title: "Home Styling",
    description: "Finishing touches across rugs, lighting, decor and occasional pieces for a pulled-together look.",
    icon: LampFloor
  },
  {
    title: "Custom Furniture Advice",
    description: "Support choosing the right configurations, colours and storage pieces for long-term use.",
    icon: PackageCheck
  }
];

export const reasons = [
  { title: "Showroom Choice", description: "Sofas, beds, wardrobes, carpets and home essentials under one roof." },
  { title: "Local Sheffield Team", description: "Friendly, practical guidance from people who know the area and homes nearby." },
  { title: "Delivery & Assembly", description: "A smoother route from showroom decision to furniture placed in your room." },
  { title: "Strong Value", description: "Quality-led furniture with offers and bundles designed for real households." }
];

export const testimonials = [
  {
    quote:
      "The quality was excellent, the price was great value, and the team assembled everything carefully and professionally.",
    name: "Google review summary",
    detail: "Furniture customer"
  },
  {
    quote:
      "Friendly, knowledgeable staff helped me find the perfect carpet. Installation was quick and professional.",
    name: "Google review summary",
    detail: "Flooring customer"
  },
  {
    quote:
      "Purchased a sofa, bed and wardrobe. Delivery was fantastic and the team put everything together.",
    name: "Google review summary",
    detail: "Bedroom and living customer"
  }
];

export const gallery = [
  { src: media.hero, title: "Premium sofa styling", span: "md:col-span-2 md:row-span-2" },
  { src: media.showroom, title: "Showroom atmosphere", span: "" },
  { src: media.sofaWall, title: "Sofa collections", span: "" },
  { src: media.dining, title: "Dining inspiration", span: "md:col-span-2" },
  { src: media.bedroom, title: "Bedroom furniture", span: "" },
  { src: media.decor, title: "Decor and finishing", span: "" },
  { src: media.wardrobe, title: "Wardrobes and storage", span: "" },
  { src: media.carpet, title: "Carpets and flooring", span: "md:col-span-2" }
];

export const stats = [
  { value: business.rating, label: "Google rating" },
  { value: "7 days", label: "Showroom opening" },
  { value: "264", label: "Queens Road location" },
  { value: "Sheffield", label: "Local delivery focus" }
];

export const contactCards = [
  { title: "Visit the showroom", value: business.address, icon: MapPin },
  { title: "Call", value: business.phone, icon: Clock },
  { title: "Opening", value: "Open 7 days a week", icon: PackageCheck }
];
