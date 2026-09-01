/**
 * Authentic Busan City Dataset for HelloBusan WebMCP (Pure English Default)
 */

export const BUSAN_WEATHER = {
  condition: "Rainy / Overcast",
  temp: 21,
  precipitation: "80%",
  recommendation: "Indoor Venues & Minimal Walking Recommended",
  icon: "🌧️"
};

export const BUSAN_PLACES = [
  {
    id: "place-1",
    name: "SEA LIFE Busan Aquarium",
    category: "Aquarium / Indoor",
    district: "Haeundae",
    lat: 35.1593,
    lng: 129.1623,
    priceMin: 21000,
    priceMax: 31000,
    isIndoor: true,
    childFriendly: true,
    rating: 4.8,
    openHours: "10:00 - 19:00",
    description: "Large indoor aquarium on Haeundae Beach featuring over 250 marine species.",
    tags: ["RainyDay", "KidsFriendly", "Indoor", "Haeundae"]
  },
  {
    id: "place-2",
    name: "Museum 1 Media Art Gallery",
    category: "Media Art Gallery",
    district: "Centum City",
    lat: 35.1691,
    lng: 129.1315,
    priceMin: 13000,
    priceMax: 18000,
    isIndoor: true,
    childFriendly: true,
    rating: 4.7,
    openHours: "10:00 - 20:00",
    description: "Contemporary media art museum featuring 80 million LED lights and immersive light shows.",
    tags: ["IndoorExhibition", "MediaArt", "Photos", "Centum"]
  },
  {
    id: "place-3",
    name: "National Busan Science Museum",
    category: "Science Museum",
    district: "Osiria",
    lat: 35.2045,
    lng: 129.2132,
    priceMin: 3000,
    priceMax: 5000,
    isIndoor: true,
    childFriendly: true,
    rating: 4.9,
    openHours: "09:30 - 17:30",
    description: "Southeast Korea science hall offering robot dance performances and kids interactive labs.",
    tags: ["KidsTopPick", "GreatValue", "IndoorExperience", "Gijang"]
  },
  {
    id: "place-4",
    name: "Busan Cinema Center",
    category: "Culture & Cinema",
    district: "Centum City",
    lat: 35.1711,
    lng: 129.1272,
    priceMin: 0,
    priceMax: 12000,
    isIndoor: true,
    childFriendly: true,
    rating: 4.6,
    openHours: "09:00 - 22:00",
    description: "Home of Busan International Film Festival (BIFF) featuring world-largest Big Roof night view.",
    tags: ["Cinema", "Architecture", "IndoorTheater", "Centum"]
  }
];

export const BUSAN_RESTAURANTS = [
  {
    id: "rest-1",
    name: "Subyeon Pork Soup Centum",
    cuisine: "Korean (Pork Soup / Gukbap)",
    district: "Centum City",
    lat: 35.1704,
    lng: 129.1302,
    priceAvg: 10000,
    childFriendly: true,
    reservationRequired: false,
    rating: 4.9,
    description: "Top 3 Busan Pork Soup restaurant. Features mild pork broth menu for children.",
    tags: ["BusanClassic", "Gukbap", "KidsMenu", "Centum"]
  },
  {
    id: "rest-2",
    name: "Haeundae Gaya Milmyeon",
    cuisine: "Korean (Cold Noodles / Milmyeon)",
    district: "Haeundae",
    lat: 35.1633,
    lng: 129.1678,
    priceAvg: 9000,
    childFriendly: true,
    reservationRequired: false,
    rating: 4.7,
    description: "Representative Busan cold noodle restaurant with herbal broth and handmade dumplings.",
    tags: ["Milmyeon", "Dumplings", "Haeundae"]
  },
  {
    id: "rest-3",
    name: "Ocean View Buffet & Aqua Restaurant",
    cuisine: "Western & Family Buffet",
    district: "Haeundae",
    lat: 35.1588,
    lng: 129.1601,
    priceAvg: 24000,
    childFriendly: true,
    reservationRequired: true,
    rating: 4.8,
    description: "Kids-friendly family buffet overlooking Haeundae Beach. Reservation recommended.",
    tags: ["ReservationRequired", "OceanView", "KidsZone", "Family"]
  }
];

export const BUSAN_EVENTS = [
  {
    id: "event-1",
    title: "Busan Robot Dance & AI Science Show",
    venue: "National Busan Science Museum Hall",
    district: "Osiria",
    lat: 35.2045,
    lng: 129.2132,
    price: 0,
    time: "14:00 - 15:00",
    isIndoor: true,
    description: "Humanoid robot dance performance and interactive AI control lab for kids."
  }
];
