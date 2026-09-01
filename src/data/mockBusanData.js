/**
 * Authentic Busan City Dataset for HelloBusan WebMCP Hackathon Demo
 */

export const BUSAN_WEATHER = {
  condition: "Rainy (비/흐림)",
  temp: 21,
  precipitation: "80%",
  recommendation: "실내 시설 및 도보 최소화 동선 권장 (Indoor + Minimal Walking Recommended)",
  icon: "🌧️"
};

export const BUSAN_PLACES = [
  {
    id: "place-1",
    name: "SEA LIFE 부산아쿠아리움 (Sea Life Aquarium)",
    category: "Aquarium / Indoor",
    district: "Haeundae (해운대)",
    lat: 35.1593,
    lng: 129.1623,
    priceMin: 21000,
    priceMax: 31000,
    isIndoor: true,
    childFriendly: true,
    rating: 4.8,
    openHours: "10:00 - 19:00",
    description: "해운대 해변에 위치한 대형 실내 수족관. 250여 종 1만 여 마리의 해양생물 전시.",
    tags: ["비오는날", "아이동반", "실내관람", "해운대"]
  },
  {
    id: "place-2",
    name: "뮤지엄 원 (Museum 1 Media Art)",
    category: "Media Art Gallery",
    district: "Centum City (센텀시티)",
    lat: 35.1691,
    lng: 129.1315,
    priceMin: 13000,
    priceMax: 18000,
    isIndoor: true,
    childFriendly: true,
    rating: 4.7,
    openHours: "10:00 - 20:00",
    description: "8천만 개의 LED가 만들어내는 초대형 미디어아트 전문 현대 미술관.",
    tags: ["실내전시", "미디어아트", "사진맛집", "센텀"]
  },
  {
    id: "place-3",
    name: "국립부산과학관 (National Busan Science Museum)",
    category: "Science Museum",
    district: "Osiria (오시리아)",
    lat: 35.2045,
    lng: 129.2132,
    priceMin: 3000,
    priceMax: 5000,
    isIndoor: true,
    childFriendly: true,
    rating: 4.9,
    openHours: "09:30 - 17:30",
    description: "동남권 과학기술 체험관. 아이들을 위한 무한상상실 및 로봇 댄스 공연.",
    tags: ["어린이강추", "가성비최고", "실내체험", "기장"]
  },
  {
    id: "place-4",
    name: "부산영화의전당 (Cinema Center)",
    category: "Culture & Cinema",
    district: "Centum City (센텀시티)",
    lat: 35.1711,
    lng: 129.1272,
    priceMin: 0,
    priceMax: 12000,
    isIndoor: true,
    childFriendly: true,
    rating: 4.6,
    openHours: "09:00 - 22:00",
    description: "부산국제영화제(BIFF) 전용 상영관이자 세계 최대의 빅루프 야경 명소.",
    tags: ["영화", "건축물", "실내극장", "센텀"]
  },
  {
    id: "place-5",
    name: "부산시립미술관 & 이우환 공간 (Busan Museum of Art)",
    category: "Art Museum",
    district: "Centum City (센텀시티)",
    lat: 35.1666,
    lng: 129.1368,
    priceMin: 0,
    priceMax: 5000,
    isIndoor: true,
    childFriendly: true,
    rating: 4.7,
    openHours: "10:00 - 18:00",
    description: "현대 미술 작품과 거장 이우환 작가의 별도 전용관 보유.",
    tags: ["미술관", "문화생활", "무료관람", "센텀"]
  },
  {
    id: "place-6",
    name: "캐니언파크 부산 (Canyon Park Indoor Zoo)",
    category: "Indoor Zoo",
    district: "Munhyeon (문현동)",
    lat: 35.1468,
    lng: 129.0645,
    priceMin: 15000,
    priceMax: 19000,
    isIndoor: true,
    childFriendly: true,
    rating: 4.5,
    openHours: "10:30 - 19:00",
    description: "국내 최대 규모 실내 애니멀 테마파크. 카약 체험 및 알파카 먹이주기.",
    tags: ["실내동물원", "체험형", "어린이인기"]
  },
  {
    id: "place-7",
    name: "해운대 블루라인파크 (Haeundae Blueline Park)",
    category: "Scenic Train",
    district: "Haeundae (해운대)",
    lat: 35.1627,
    lng: 129.1764,
    priceMin: 7000,
    priceMax: 35000,
    isIndoor: false,
    childFriendly: true,
    rating: 4.8,
    openHours: "09:30 - 18:30",
    description: "동해남부선 폐선 부지를 재개발한 해변열차 및 스카이캡슐 명소.",
    tags: ["바다전망", "해변열차", "야외관광"]
  },
  {
    id: "place-8",
    name: "태종대 유원지 (Taejongdae Resort Park)",
    category: "Nature & Cliff",
    district: "Yeongdo (영도구)",
    lat: 35.0536,
    lng: 129.0872,
    priceMin: 0,
    priceMax: 4000,
    isIndoor: false,
    childFriendly: true,
    rating: 4.7,
    openHours: "05:00 - 24:00",
    description: "부산 영도 끝자락에 울창한 수목과 기암괴석 해안 절벽의 장관.",
    tags: ["다누비열차", "영도", "해안절경"]
  }
];

export const BUSAN_RESTAURANTS = [
  {
    id: "rest-1",
    name: "수변최고돼지국밥 센텀점 (Subyeon Pig Gukbap Centum)",
    cuisine: "Korean (Pig Soup / 돼지국밥)",
    district: "Centum City (센텀시티)",
    lat: 35.1704,
    lng: 129.1302,
    priceAvg: 10000,
    childFriendly: true,
    reservationRequired: false,
    rating: 4.9,
    description: "부산 3대 국밥 맛집. 어린이용 담백 항정국밥 메뉴 보유.",
    tags: ["부산대표", "국밥", "아이메뉴있음", "센텀"]
  },
  {
    id: "rest-2",
    name: "해운대 가야밀면 (Haeundae Gaya Milmyeon)",
    cuisine: "Korean (Cold Noodles / 밀면)",
    district: "Haeundae (해운대)",
    lat: 35.1633,
    lng: 129.1678,
    priceAvg: 9000,
    childFriendly: true,
    reservationRequired: false,
    rating: 4.7,
    description: "깊은 한약재 육수와 쫄깃한 면발의 부산 대표 밀면 전문점.",
    tags: ["밀면", "만두", "해운대맛집"]
  },
  {
    id: "rest-3",
    name: "오션뷰 뷔페 & 아쿠아 레스토랑 (Ocean View Kids Bistro)",
    cuisine: "Western & Family Buffet",
    district: "Haeundae (해운대)",
    lat: 35.1588,
    lng: 129.1601,
    priceAvg: 24000,
    childFriendly: true,
    reservationRequired: true,
    rating: 4.8,
    description: "해운대 해변이 바라다보이는 대형 키즈 친화형 패밀리 레스토랑. 예약 권장.",
    tags: ["예약필수", "오션뷰", "키즈존", "패밀리"]
  },
  {
    id: "rest-4",
    name: "부산어묵체험관 & 베이커리 (Samjin Amook Centum)",
    cuisine: "Korean Snack & Bakery",
    district: "Centum City (센텀시티)",
    lat: 35.1685,
    lng: 129.1298,
    priceAvg: 8000,
    childFriendly: true,
    reservationRequired: false,
    rating: 4.8,
    description: "수제 수제 어묵 크로켓과 어묵 만들기 체험이 가능한 명품 어묵 베이커리.",
    tags: ["어묵체험", "간식", "실내추천"]
  },
  {
    id: "rest-5",
    name: "기장 해녀촌 해산물 한상 (Gijang Seafood Feast)",
    cuisine: "Seafood & Abalone Porridge",
    district: "Osiria (오시리아)",
    lat: 35.1989,
    lng: 129.2201,
    priceAvg: 25000,
    childFriendly: true,
    reservationRequired: false,
    rating: 4.8,
    description: "신선한 전복죽과 해산물이 푸짐하게 제공되는 남녀노소 해산물 맛집.",
    tags: ["전복죽", "해산물", "오시리아맛집"]
  }
];

export const BUSAN_EVENTS = [
  {
    id: "event-1",
    title: "부산 실내 로봇 댄스 & 과학 체험전",
    venue: "국립부산과학관 대강당",
    district: "Osiria (오시리아)",
    lat: 35.2045,
    lng: 129.2132,
    price: 0,
    time: "14:00 - 15:00",
    isIndoor: true,
    description: "어린이를 위한 AI 및 휴머노이드 로봇 군무 공연 및 조종 체험."
  },
  {
    id: "event-2",
    title: "센텀 미디어 파사드 시공간 특별전",
    venue: "뮤지엄 원 메인 홀",
    district: "Centum City (센텀시티)",
    lat: 35.1691,
    lng: 129.1315,
    price: 15000,
    time: "11:00 - 19:00",
    isIndoor: true,
    description: "빛과 소리로 몰입하는 360도 인터랙티브 디지털 예술 전시."
  }
];
