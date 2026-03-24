import { Dropdown, type DropdownOption } from "@/components/ui/Dropdown";
import { InsightCard } from "@/components/ui/InsightCard";

interface LocationStepProps {
  location?: string;
  onLocationChange?: (location: string) => void;
}

const US_STATES: DropdownOption[] = [
  { label: "Alabama", value: "AL" },
  { label: "Alaska", value: "AK" },
  { label: "Arizona", value: "AZ" },
  { label: "Arkansas", value: "AR" },
  { label: "California", value: "CA" },
  { label: "Colorado", value: "CO" },
  { label: "Connecticut", value: "CT" },
  { label: "Delaware", value: "DE" },
  { label: "Florida", value: "FL" },
  { label: "Georgia", value: "GA" },
  { label: "Hawaii", value: "HI" },
  { label: "Idaho", value: "ID" },
  { label: "Illinois", value: "IL" },
  { label: "Indiana", value: "IN" },
  { label: "Iowa", value: "IA" },
  { label: "Kansas", value: "KS" },
  { label: "Kentucky", value: "KY" },
  { label: "Louisiana", value: "LA" },
  { label: "Maine", value: "ME" },
  { label: "Maryland", value: "MD" },
  { label: "Massachusetts", value: "MA" },
  { label: "Michigan", value: "MI" },
  { label: "Minnesota", value: "MN" },
  { label: "Mississippi", value: "MS" },
  { label: "Missouri", value: "MO" },
  { label: "Montana", value: "MT" },
  { label: "Nebraska", value: "NE" },
  { label: "Nevada", value: "NV" },
  { label: "New Hampshire", value: "NH" },
  { label: "New Jersey", value: "NJ" },
  { label: "New Mexico", value: "NM" },
  { label: "New York", value: "NY" },
  { label: "North Carolina", value: "NC" },
  { label: "North Dakota", value: "ND" },
  { label: "Ohio", value: "OH" },
  { label: "Oklahoma", value: "OK" },
  { label: "Oregon", value: "OR" },
  { label: "Pennsylvania", value: "PA" },
  { label: "Rhode Island", value: "RI" },
  { label: "South Carolina", value: "SC" },
  { label: "South Dakota", value: "SD" },
  { label: "Tennessee", value: "TN" },
  { label: "Texas", value: "TX" },
  { label: "Utah", value: "UT" },
  { label: "Vermont", value: "VT" },
  { label: "Virginia", value: "VA" },
  { label: "Washington", value: "WA" },
  { label: "West Virginia", value: "WV" },
  { label: "Wisconsin", value: "WI" },
  { label: "Wyoming", value: "WY" },
];

export const LocationStep = ({ location, onLocationChange }: LocationStepProps) => {
  const handleLocationChange = (value: string) => {
    if (onLocationChange) {
      onLocationChange(value);
    }
  };

  return (
    <div className="location-step">
      <h3 className="location-step__title">Location Selection</h3>
      <p className="location-step__description">
        Select your location to ensure we provide region-specific plan information and compliance details.
      </p>
      <div className="location-step__fields">
        <Dropdown
          label="State"
          name="location"
          value={location}
          options={US_STATES}
          onChange={handleLocationChange}
          placeholder="Select your state"
          size="compact"
        />
        <InsightCard
          message="State-level tax rules may affect retirement withdrawals."
          tone="neutral"
        />
      </div>
    </div>
  );
};
