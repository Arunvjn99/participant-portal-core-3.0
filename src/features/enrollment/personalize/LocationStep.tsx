import { useState, useRef, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Search, Sparkles, MapPin, Check } from "lucide-react";
import { InsightCard } from "../../../components/ui/InsightCard";

const POPULAR_DESTINATIONS = [
  { name: "Florida", icon: "🌴", cost: "Low", description: "Tax-friendly, warm climate" },
  { name: "Arizona", icon: "🌵", cost: "Medium", description: "Dry climate, active communities" },
  { name: "North Carolina", icon: "🏔️", cost: "Low", description: "Mountains & beaches, affordable" },
  { name: "South Carolina", icon: "⛱️", cost: "Low", description: "Coastal living, low taxes" },
];

const ALL_STATES = [
  "Florida",
  "Arizona",
  "North Carolina",
  "South Carolina",
  "Tennessee",
  "Texas",
  "California",
  "Georgia",
  "Nevada",
  "Colorado",
  "Virginia",
  "Pennsylvania",
  "Alabama",
  "Arkansas",
  "Delaware",
  "Idaho",
  "Kentucky",
  "Maine",
  "Michigan",
  "Mississippi",
  "Missouri",
  "Montana",
  "New Mexico",
  "Ohio",
  "Oklahoma",
  "Oregon",
  "Utah",
  "Washington",
  "West Virginia",
  "Wyoming",
];

function getSmartChoiceMessage(state: string): string {
  if (state.includes("Florida")) {
    return "With no state income tax and warm weather year-round, you could save $15,000+ annually on taxes alone.";
  }
  if (state.includes("Arizona")) {
    return "Enjoy 300+ days of sunshine, no tax on Social Security benefits, and thriving 55+ communities.";
  }
  if (state.includes("North Carolina")) {
    return "Enjoy mountains and beaches with affordable living and a vibrant community.";
  }
  if (state.includes("South Carolina")) {
    return "Experience coastal living with low taxes and a relaxed lifestyle.";
  }
  return "Research shows that location can impact your retirement savings by up to 40%. We'll help you optimize your plan!";
}

export interface LocationStepProps {
  country: string;
  state: string;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  nextDisabled?: boolean;
}

export function LocationStep({
  state: selectedState,
  onCountryChange,
  onStateChange,
}: LocationStepProps) {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLUListElement>(null);

  const filteredStates = ALL_STATES.filter((name) =>
    name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  useEffect(() => {
    if (!selectedState) setSearchQuery("");
    else setSearchQuery(selectedState);
  }, [selectedState]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        !(e.target as HTMLElement).closest(".location-search-wrap")
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectState = (name: string) => {
    onCountryChange("United States");
    onStateChange(name);
    setSearchQuery(name);
    setShowSuggestions(false);
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="text-center space-y-2">
        <h2 className="text-xl font-bold text-[var(--color-text)] sm:text-2xl" id="location-heading">
          {t("personalize.whereRetire", "Where do you imagine retiring?")} 🌎
        </h2>
        <p className="text-sm text-[var(--color-textSecondary)]">
          {t("personalize.locationHelpsEstimate", "Your location helps us estimate cost of living and plan smarter.")}
        </p>
      </div>

      <div className="relative location-search-wrap">
        <div className="relative">
          <Search
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-textSecondary)] pointer-events-none"
            aria-hidden
          />
          <input
            type="text"
            className="w-full rounded-lg border-2 border-[var(--color-border)] bg-transparent py-3 pl-12 pr-4 text-sm text-[var(--color-text-primary)] outline-none transition-colors placeholder:text-[var(--color-text-secondary)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
            style={{ minHeight: 44 }}
            placeholder={t("personalize.searchState", "Search for a state...")}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => searchQuery.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            role="combobox"
            aria-expanded={showSuggestions}
            aria-controls="location-suggestions"
            aria-label={t("personalize.searchLocation", "Search for retirement location")}
          />
        </div>
        {showSuggestions && filteredStates.length > 0 && (
          <ul
            id="location-suggestions"
            ref={suggestionsRef}
            className="absolute left-0 right-0 top-full z-10 mt-2 max-h-60 overflow-auto rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] shadow-lg"
            role="listbox"
            aria-label={t("personalize.locationSuggestions", "Location suggestions")}
          >
            {filteredStates.map((name) => (
              <li key={name} role="option" aria-selected={selectedState === name}>
                <button
                  type="button"
                  className="flex w-full items-center gap-3 border-b border-[var(--color-border)] px-4 py-3 text-left text-sm text-[var(--color-text-primary)] transition-colors last:border-b-0 hover:bg-[var(--color-primary)]/10 focus:bg-[var(--color-primary)]/10 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[var(--color-primary)]"
                  onClick={() => handleSelectState(name)}
                >
                  <MapPin className="h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden />
                  <span>{name}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-[var(--color-primary)]" aria-hidden />
          <h3 className="text-sm font-semibold text-[var(--color-text)]" id="popular-locations-heading">
            {t("personalize.popularDestinations", "Popular Retirement Destinations")}
          </h3>
        </div>
        <div
          className="grid grid-cols-2 gap-3"
          role="group"
          aria-labelledby="popular-locations-heading"
        >
          {POPULAR_DESTINATIONS.map((loc) => {
            const isSelected = selectedState === loc.name;
            return (
              <button
                key={loc.name}
                type="button"
                onClick={() => handleSelectState(loc.name)}
                className={`flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 ${
                  isSelected
                    ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10"
                    : "border-[var(--color-border)] bg-[var(--color-surface)] hover:border-[var(--color-primary)]/50"
                }`}
                aria-pressed={isSelected}
                aria-label={`${loc.name}: ${loc.description}, ${loc.cost} cost of living`}
              >
                <span className="text-2xl" role="img" aria-label={loc.name}>
                  {loc.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="text-sm font-semibold text-[var(--color-text)]">{loc.name}</h4>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        loc.cost === "Low"
                          ? "bg-[var(--color-success)]/10 text-[var(--color-success)]"
                          : loc.cost === "Medium"
                            ? "bg-[var(--color-warning)]/10 text-[var(--color-warning)]"
                            : "bg-[var(--color-danger)]/10 text-[var(--color-danger)]"
                      }`}
                    >
                      {loc.cost} Cost
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-[var(--color-textSecondary)]">{loc.description}</p>
                </div>
                {isSelected && (
                  <Check className="h-5 w-5 shrink-0 text-[var(--color-primary)]" aria-hidden />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {selectedState && (
        <InsightCard
          variant="wizard"
          icon={<Sparkles className="h-3.5 w-3.5" />}
          title={t("personalize.smartChoice", "Smart Choice!")}
          message={`${selectedState} is a popular retirement destination. ${getSmartChoiceMessage(selectedState)}`}
        />
      )}
    </div>
  );
}
