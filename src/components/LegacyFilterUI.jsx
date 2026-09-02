import { useEffect, useRef, useState } from "react";
import { filterPlaces, filterRestaurants } from "../lib/data.js";

const DISTRICTS = ["All", "Haeundae-gu", "Jung-gu", "Saha-gu", "Suyeong-gu", "Yeongdo-gu"];
const BUDGETS = [30000, 50000, 80000];

/**
 * A deliberately plain, click-through, no-schema web form: the "before
 * WebMCP" way of doing the exact same task an agent could do with
 * search_places / search_restaurants / calculate_route / request_reservation.
 * It is instrumented (onInteract/onError/onComplete) so both a human and a
 * scripted DOM-agent runner can produce real, live-measured numbers for the
 * WebMCP Evaluation panel — see HELLOBUSAN_PRD.md section 14.
 */
export default function LegacyFilterUI({ cityData, onInteract, onComplete }) {
  const [weatherChecked, setWeatherChecked] = useState(false);
  const [district, setDistrict] = useState(null);
  const [hasChild, setHasChild] = useState(null);
  const [budget, setBudget] = useState(null);
  const [placeResults, setPlaceResults] = useState(null);
  const [addedPlaces, setAddedPlaces] = useState([]);
  const [restaurantResults, setRestaurantResults] = useState(null);
  const [addedRestaurant, setAddedRestaurant] = useState(null);
  const [routeDone, setRouteDone] = useState(false);
  const [reserved, setReserved] = useState(false);

  const startRef = useRef(performance.now());

  function tick() {
    onInteract?.();
  }

  useEffect(() => {
    if (reserved) {
      onComplete?.({ elapsedMs: Math.round(performance.now() - startRef.current) });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reserved]);

  const canFilters = weatherChecked;
  const canSearchPlaces = canFilters && district && hasChild !== null && budget;
  const canSearchRestaurants = addedPlaces.length >= 3;
  const canRoute = canSearchRestaurants && addedRestaurant;
  const canReserve = routeDone;

  return (
    <div className="legacy-ui" data-testid="legacy-root">
      <p className="legacy-ui__intro">Old Busan Info Site (no WebMCP — plain clicks &amp; forms)</p>

      <div className="legacy-ui__step">
        <button
          type="button"
          data-testid="check-weather"
          disabled={weatherChecked}
          onClick={() => {
            setWeatherChecked(true);
            tick();
          }}
        >
          1. Check today's weather
        </button>
        {weatherChecked && <span className="legacy-ui__ok"> ✓ Checked</span>}
      </div>

      <div className="legacy-ui__step">
        <span>2. Pick a district: </span>
        {DISTRICTS.map((d) => (
          <button
            key={d}
            type="button"
            data-testid={`district-${d}`}
            disabled={!canFilters}
            className={district === d ? "legacy-ui__chip--selected" : ""}
            onClick={() => {
              setDistrict(d);
              tick();
            }}
          >
            {d}
          </button>
        ))}
      </div>

      <div className="legacy-ui__step">
        <span>3. Bringing a kid? </span>
        {["Yes", "No"].map((v) => (
          <button
            key={v}
            type="button"
            data-testid={`child-${v}`}
            disabled={!canFilters}
            className={hasChild === (v === "Yes") ? "legacy-ui__chip--selected" : ""}
            onClick={() => {
              setHasChild(v === "Yes");
              tick();
            }}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="legacy-ui__step">
        <span>4. Budget: </span>
        {BUDGETS.map((b) => (
          <button
            key={b}
            type="button"
            data-testid={`budget-${b}`}
            disabled={!canFilters}
            className={budget === b ? "legacy-ui__chip--selected" : ""}
            onClick={() => {
              setBudget(b);
              tick();
            }}
          >
            ₩{b.toLocaleString()}
          </button>
        ))}
      </div>

      <div className="legacy-ui__step">
        <button
          type="button"
          data-testid="search-places"
          disabled={!canSearchPlaces}
          onClick={() => {
            const results = filterPlaces(cityData.places, {
              rainy: false,
              hasChild,
              district: district === "All" ? undefined : district,
            }).slice(0, 6);
            setPlaceResults(results);
            tick();
          }}
        >
          5. Search places
        </button>
      </div>

      {placeResults && (
        <div className="legacy-ui__results" data-testid="place-results">
          {placeResults.map((p) => (
            <button
              key={p.id}
              type="button"
              data-testid={`add-place-${p.id}`}
              disabled={addedPlaces.includes(p.id)}
              onClick={() => {
                setAddedPlaces((prev) => [...prev, p.id]);
                tick();
              }}
            >
              {addedPlaces.includes(p.id) ? "✓ " : "+ "}
              {p.name}
            </button>
          ))}
          <div className="legacy-ui__hint">Add at least 3 ({addedPlaces.length}/3)</div>
        </div>
      )}

      <div className="legacy-ui__step">
        <button
          type="button"
          data-testid="search-restaurants"
          disabled={!canSearchRestaurants}
          onClick={() => {
            const results = filterRestaurants(cityData.restaurants, {
              budgetPerPerson: budget,
              hasChild,
            }).slice(0, 4);
            setRestaurantResults(results);
            tick();
          }}
        >
          6. Search restaurants
        </button>
      </div>

      {restaurantResults && (
        <div className="legacy-ui__results" data-testid="restaurant-results">
          {restaurantResults.map((r) => (
            <button
              key={r.id}
              type="button"
              data-testid={`add-restaurant-${r.id}`}
              disabled={!!addedRestaurant}
              onClick={() => {
                setAddedRestaurant(r.id);
                tick();
              }}
            >
              {addedRestaurant === r.id ? "✓ " : "+ "}
              {r.name}
            </button>
          ))}
        </div>
      )}

      <div className="legacy-ui__step">
        <button
          type="button"
          data-testid="calculate-route"
          disabled={!canRoute}
          onClick={() => {
            setRouteDone(true);
            tick();
          }}
        >
          7. Calculate route
        </button>
        {routeDone && <span className="legacy-ui__ok"> ✓ Calculated</span>}
      </div>

      <div className="legacy-ui__step">
        <button
          type="button"
          data-testid="reserve"
          disabled={!canReserve}
          onClick={() => {
            setReserved(true);
            tick();
          }}
        >
          8. Send reservation request
        </button>
        {reserved && <span className="legacy-ui__ok"> ✓ Done</span>}
      </div>
    </div>
  );
}
