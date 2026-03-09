import { useState, useMemo } from "react";
import { usePersonalizationWizard } from "../context/PersonalizationWizardContext";
import { filterStatesBySearch } from "../../../data/usStates";
import { SearchIcon, MapPinIcon } from "./icons";
import { InsightCard } from "./InsightCard";

export function LocationStep() {
  const { state, setLocation } = usePersonalizationWizard();
  const [search, setSearch] = useState("");
  const filtered = useMemo(() => filterStatesBySearch(search), [search]);
  const locationSelected = Boolean(state.location?.trim());

  return (
    <div className="personalization-wizard__body-inner personalization-wizard__step-content">
      <h2 className="personalization-wizard__step-title" style={{ color: "var(--color-text)" }}>
        Where do you plan to retire?
      </h2>
      <p className="personalization-wizard__step-sub" style={{ color: "var(--color-text-secondary)" }}>
        Location will influence retirement cost of living.
      </p>

      <div className="personalization-wizard__search-wrap">
        <span
          className="personalization-wizard__search-icon"
          style={{ color: "var(--color-text-tertiary)" }}
          aria-hidden
        >
          <SearchIcon />
        </span>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search states..."
          className="personalization-wizard__search-input"
          style={{
            border: "2px solid var(--color-border)",
            borderRadius: "var(--radius-2xl)",
            background: "var(--color-surface)",
            color: "var(--color-text)",
          }}
          aria-label="Search states"
          aria-describedby="location-hint"
        />
      </div>

      <div className="personalization-wizard__location-list">
        {filtered.slice(0, 8).map((s) => (
          <button
            key={s.abbreviation}
            type="button"
            onClick={() => setLocation(s.name)}
            className="personalization-wizard__location-option"
            style={{
              border: "2px solid " + (state.location === s.name ? "var(--color-primary)" : "var(--color-border)"),
              background: state.location === s.name ? "rgb(var(--color-primary-rgb) / 0.08)" : "var(--color-surface)",
              borderRadius: "var(--radius-xl)",
              color: "var(--color-text)",
            }}
            aria-pressed={state.location === s.name}
            aria-label={`Select ${s.name}`}
          >
            {s.name}
          </button>
        ))}
      </div>
      {filtered.length > 8 && (
        <p id="location-hint" className="personalization-wizard__location-hint" style={{ color: "var(--color-text-tertiary)" }}>
          Type to search all 50 states
        </p>
      )}

      {/* Insight only after a location is selected */}
      {locationSelected && (
        <InsightCard
          title={`${state.location} is a popular retirement destination`}
          subtitle="Cost of living and tax rates vary by state."
          icon={<MapPinIcon />}
        />
      )}
    </div>
  );
}
