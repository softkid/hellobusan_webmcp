/**
 * Cloudflare Worker / Pages Function API: GET /api/places
 * Queries Cloudflare D1 Database or returns structured JSON
 */
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const district = url.searchParams.get("district") || "";
  const maxPrice = Number(url.searchParams.get("maxPrice")) || 999999;
  const isIndoor = url.searchParams.get("isIndoor") === "true";
  const childFriendly = url.searchParams.get("childFriendly") === "true";

  try {
    if (env && env.DB) {
      let query = "SELECT * FROM places WHERE price_min <= ?";
      const params = [maxPrice];

      if (district) {
        query += " AND district LIKE ?";
        params.push(`%${district}%`);
      }
      if (isIndoor) {
        query += " AND is_indoor = 1";
      }
      if (childFriendly) {
        query += " AND child_friendly = 1";
      }

      const { results } = await env.DB.prepare(query).bind(...params).all();
      return new Response(JSON.stringify(results), {
        headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
      });
    }
  } catch (err) {
    console.error("D1 Query Error:", err);
  }

  // Fallback payload if env.DB is initializing
  const mockPlaces = [
    {
      id: "place-1",
      name: "SEA LIFE 부산아쿠아리움",
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
      description: "해운대 해변에 위치한 대형 실내 수족관. 250여 종 1만 여 마리의 해양생물 전시."
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
      description: "8천만 개의 LED가 만들어내는 초대형 미디어아트 전문 현대 미술관."
    }
  ];

  return new Response(JSON.stringify(mockPlaces), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}
