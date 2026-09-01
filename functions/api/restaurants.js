/**
 * Cloudflare Worker / Pages Function API: GET /api/restaurants
 */
export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const district = url.searchParams.get("district") || "";
  const maxPriceAvg = Number(url.searchParams.get("maxPriceAvg")) || 999999;
  const childFriendly = url.searchParams.get("childFriendly") === "true";

  try {
    if (env && env.DB) {
      let query = "SELECT * FROM restaurants WHERE price_avg <= ?";
      const params = [maxPriceAvg];

      if (district) {
        query += " AND district LIKE ?";
        params.push(`%${district}%`);
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

  const mockRestaurants = [
    {
      id: "rest-1",
      name: "수변최고돼지국밥 센텀점",
      cuisine: "Korean (Pig Soup)",
      district: "Centum City (센텀시티)",
      lat: 35.1704,
      lng: 129.1302,
      priceAvg: 10000,
      childFriendly: true,
      reservationRequired: false,
      rating: 4.9,
      description: "부산 3대 국밥 맛집. 어린이용 담백 항정국밥 메뉴 보유."
    },
    {
      id: "rest-3",
      name: "오션뷰 뷔페 & 아쿠아 레스토랑",
      cuisine: "Western & Family Buffet",
      district: "Haeundae (해운대)",
      lat: 35.1588,
      lng: 129.1601,
      priceAvg: 24000,
      childFriendly: true,
      reservationRequired: true,
      rating: 4.8,
      description: "해운대 해변이 바라다보이는 대형 키즈 친화형 패밀리 레스토랑."
    }
  ];

  return new Response(JSON.stringify(mockRestaurants), {
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*" }
  });
}
