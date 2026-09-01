-- HELLOBUSAN Cloudflare D1 Database Migration Schema & Seed Data

DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS places;
DROP TABLE IF EXISTS restaurants;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS itineraries;
DROP TABLE IF EXISTS permissions;
DROP TABLE IF EXISTS approvals;
DROP TABLE IF EXISTS tool_calls;

-- 1. Users
CREATE TABLE users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT,
  created_at INTEGER NOT NULL
);

-- 2. Places
CREATE TABLE places (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL,
  district TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  price_min INTEGER NOT NULL,
  price_max INTEGER NOT NULL,
  is_indoor INTEGER NOT NULL DEFAULT 1,
  child_friendly INTEGER NOT NULL DEFAULT 1,
  rating REAL NOT NULL DEFAULT 4.5,
  open_hours TEXT,
  description TEXT,
  tags TEXT
);

-- 3. Restaurants
CREATE TABLE restaurants (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  cuisine TEXT NOT NULL,
  district TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  price_avg INTEGER NOT NULL,
  child_friendly INTEGER NOT NULL DEFAULT 1,
  reservation_required INTEGER NOT NULL DEFAULT 0,
  rating REAL NOT NULL DEFAULT 4.7,
  description TEXT,
  tags TEXT
);

-- 4. Events
CREATE TABLE events (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  venue TEXT NOT NULL,
  district TEXT NOT NULL,
  lat REAL NOT NULL,
  lng REAL NOT NULL,
  price INTEGER NOT NULL,
  time_slot TEXT NOT NULL,
  is_indoor INTEGER NOT NULL DEFAULT 1,
  description TEXT
);

-- 5. Itineraries
CREATE TABLE itineraries (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  goal TEXT NOT NULL,
  budget INTEGER NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status TEXT NOT NULL,
  items_json TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

-- 6. Permissions (Agent Wallet Policy)
CREATE TABLE permissions (
  user_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  policy TEXT NOT NULL DEFAULT 'ALLOW', -- ALLOW | ASK | DENY
  daily_limit INTEGER NOT NULL DEFAULT 50000,
  updated_at INTEGER NOT NULL,
  PRIMARY KEY (user_id, tool_name)
);

-- 7. Approvals (Human-in-the-Loop)
CREATE TABLE approvals (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  payload_json TEXT NOT NULL,
  status TEXT NOT NULL, -- PENDING | APPROVED | REJECTED
  created_at INTEGER NOT NULL,
  resolved_at INTEGER
);

-- 8. Tool Calls Audit Stream
CREATE TABLE tool_calls (
  id TEXT PRIMARY KEY,
  session_id TEXT NOT NULL,
  tool_name TEXT NOT NULL,
  input_json TEXT NOT NULL,
  output_json TEXT NOT NULL,
  permission TEXT NOT NULL,
  status TEXT NOT NULL,
  latency_ms INTEGER NOT NULL,
  impact_reason TEXT,
  created_at INTEGER NOT NULL
);

-- SEED DATA INSERTIONS --
INSERT INTO places (id, name, category, district, lat, lng, price_min, price_max, is_indoor, child_friendly, rating, open_hours, description, tags)
VALUES 
('place-1', 'SEA LIFE 부산아쿠아리움', 'Aquarium / Indoor', 'Haeundae (해운대)', 35.1593, 129.1623, 21000, 31000, 1, 1, 4.8, '10:00 - 19:00', '해운대 해변에 위치한 대형 실내 수족관. 250여 종 1만 여 마리의 해양생물 전시.', '비오는날,아이동반,실내관람,해운대'),
('place-2', '뮤지엄 원 (Museum 1 Media Art)', 'Media Art Gallery', 'Centum City (센텀시티)', 35.1691, 129.1315, 13000, 18000, 1, 1, 4.7, '10:00 - 20:00', '8천만 개의 LED가 만들어내는 초대형 미디어아트 전문 현대 미술관.', '실내전시,미디어아트,사진맛집,센텀'),
('place-3', '국립부산과학관', 'Science Museum', 'Osiria (오시리아)', 35.2045, 129.2132, 3000, 5000, 1, 1, 4.9, '09:30 - 17:30', '동남권 과학기술 체험관. 아이들을 위한 무한상상실 및 로봇 댄스 공연.', '어린이강추,가성비최고,실내체험,기장'),
('place-4', '부산영화의전당', 'Culture & Cinema', 'Centum City (센텀시티)', 35.1711, 129.1272, 0, 12000, 1, 1, 4.6, '09:00 - 22:00', '부산국제영화제(BIFF) 전용 상영관이자 세계 최대의 빅루프 야경 명소.', '영화,건축물,실내극장,센텀');

INSERT INTO restaurants (id, name, cuisine, district, lat, lng, price_avg, child_friendly, reservation_required, rating, description, tags)
VALUES
('rest-1', '수변최고돼지국밥 센텀점', 'Korean (Pig Soup)', 'Centum City (센텀시티)', 35.1704, 129.1302, 10000, 1, 0, 4.9, '부산 3대 국밥 맛집. 어린이용 담백 항정국밥 메뉴 보유.', '부산대표,국밥,아이메뉴있음,센텀'),
('rest-2', '해운대 가야밀면', 'Korean (Cold Noodles)', 'Haeundae (해운대)', 35.1633, 129.1678, 9000, 1, 0, 4.7, '깊은 한약재 육수와 쫄깃한 면발의 부산 대표 밀면 전문점.', '밀면,만두,해운대맛집'),
('rest-3', '오션뷰 뷔페 & 아쿠아 레스토랑', 'Western & Family Buffet', 'Haeundae (해운대)', 35.1588, 129.1601, 24000, 1, 1, 4.8, '해운대 해변이 바라다보이는 대형 키즈 친화형 패밀리 레스토랑. 예약 권장.', '예약필수,오션뷰,키즈존,패밀리');
