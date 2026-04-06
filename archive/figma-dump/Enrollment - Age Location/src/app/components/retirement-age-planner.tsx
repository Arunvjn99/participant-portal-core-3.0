import { useState } from 'react';
import { ChevronRight, Save, Sparkles, TrendingUp, Minus, Plus, Calendar, Check, X, MapPin, Search, ChevronLeft } from 'lucide-react';
import * as Slider from '@radix-ui/react-slider';
import imgImg from "figma:asset/6c33ba1b228b5ca4211f1ea1d3e2b4e1ffa3e19f.png";

// Popular locations data
const popularLocations = [
  { name: 'Florida', icon: '🌴', cost: 'Low', description: 'Tax-friendly, warm climate' },
  { name: 'Arizona', icon: '🌵', cost: 'Medium', description: 'Dry climate, active communities' },
  { name: 'North Carolina', icon: '🏔️', cost: 'Low', description: 'Mountains & beaches, affordable' },
  { name: 'South Carolina', icon: '⛱️', cost: 'Low', description: 'Coastal living, low taxes' },
];

const allLocations = [
  'Florida',
  'Arizona',
  'North Carolina',
  'South Carolina',
  'Tennessee',
  'Texas',
  'California',
  'Georgia',
  'Nevada',
  'Colorado',
  'Virginia',
  'Pennsylvania',
  'Alabama',
  'Arkansas',
  'Delaware',
  'Idaho',
  'Kentucky',
  'Maine',
  'Michigan',
  'Mississippi',
  'Missouri',
  'Montana',
  'New Mexico',
  'Ohio',
  'Oklahoma',
  'Oregon',
  'Utah',
  'Washington',
  'West Virginia',
  'Wyoming',
];

export function RetirementAgePlanner() {
  const [currentStep, setCurrentStep] = useState(1);
  const [retirementAge, setRetirementAge] = useState(39);
  const [isEditingBirthDate, setIsEditingBirthDate] = useState(false);
  const [locationSearch, setLocationSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [savingsAmount, setSavingsAmount] = useState('');
  
  // Birth date state
  const [birthMonth, setBirthMonth] = useState('April');
  const [birthDay, setBirthDay] = useState(16);
  const [birthYear, setBirthYear] = useState(1994);
  
  // Temporary edit state
  const [tempMonth, setTempMonth] = useState('April');
  const [tempDay, setTempDay] = useState(16);
  const [tempYear, setTempYear] = useState(1994);
  
  const currentYear = 2026;
  const currentMonth = 3;
  const currentDay = 2;

  // Calculate current age based on birth date
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                      'July', 'August', 'September', 'October', 'November', 'December'];
  const birthMonthIndex = monthNames.indexOf(birthMonth) + 1;
  
  let currentAge = currentYear - birthYear;
  if (currentMonth < birthMonthIndex || (currentMonth === birthMonthIndex && currentDay < birthDay)) {
    currentAge--;
  }

  const birthDate = `${birthMonth} ${birthDay}, ${birthYear}`;
  const yearsUntilRetirement = retirementAge - currentAge;
  const retirementYear = currentYear + yearsUntilRetirement;

  // Filter locations based on search
  const filteredLocations = allLocations.filter(location =>
    location.toLowerCase().includes(locationSearch.toLowerCase())
  );

  const handleSliderChange = (value: number[]) => {
    setRetirementAge(value[0]);
  };

  const incrementAge = () => {
    if (retirementAge < 75) {
      setRetirementAge(retirementAge + 1);
    }
  };

  const decrementAge = () => {
    if (retirementAge > currentAge + 1) {
      setRetirementAge(retirementAge - 1);
    }
  };

  const handleEditClick = () => {
    setTempMonth(birthMonth);
    setTempDay(birthDay);
    setTempYear(birthYear);
    setIsEditingBirthDate(true);
  };

  const handleSaveBirthDate = () => {
    const monthIndex = monthNames.indexOf(tempMonth);
    if (monthIndex === -1 || tempDay < 1 || tempDay > 31 || tempYear < 1900 || tempYear > currentYear) {
      alert('Please enter a valid date');
      return;
    }

    const birthDate = new Date(tempYear, monthIndex, tempDay);
    const today = new Date(currentYear, currentMonth - 1, currentDay);
    
    if (birthDate > today) {
      alert('Birth date cannot be in the future');
      return;
    }

    setBirthMonth(tempMonth);
    setBirthDay(tempDay);
    setBirthYear(tempYear);
    setIsEditingBirthDate(false);
  };

  const handleCancelEdit = () => {
    setIsEditingBirthDate(false);
  };

  const handleLocationSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationSearch(e.target.value);
    setShowSuggestions(e.target.value.length > 0);
  };

  const handleLocationSelect = (location: string) => {
    setSelectedLocation(location);
    setLocationSearch(location);
    setShowSuggestions(false);
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden mx-auto">
      {/* Header Section */}
      <div className="relative px-4 sm:px-6 pt-4 sm:pt-6 pb-4 sm:pb-5 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="absolute top-2 right-2 opacity-20">
          <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
        </div>
        <div className="relative z-10">
          <h1 className="text-2xl sm:text-3xl font-bold text-white mb-1">
            Hi, Satish 👋
          </h1>
          <p className="text-sm sm:text-base text-blue-100">
            Let's personalize your retirement journey.
          </p>
        </div>
        <div className="absolute bottom-0 right-0 opacity-10">
          <TrendingUp className="w-16 h-16 sm:w-24 sm:h-24 text-white" />
        </div>
      </div>

      {/* Progress Stepper */}
      <nav className="flex items-center justify-center gap-3 sm:gap-6 px-2 sm:px-0 py-3 sm:py-[12px] mx-0 my-[6px]" role="progressbar" aria-label="Retirement planning progress" aria-valuenow={currentStep} aria-valuemin={1} aria-valuemax={3}>
        <div className="flex items-center gap-1 sm:gap-2">
          <div 
            className={`w-8 h-8 rounded-full ${currentStep > 1 ? 'bg-green-500 text-white' : currentStep === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center font-semibold text-sm transition-all`}
            aria-label="Step 1: Age"
            aria-current={currentStep === 1 ? 'step' : undefined}
          >
            {currentStep > 1 ? <Check className="w-5 h-5" aria-hidden="true" /> : '1'}
          </div>
          <span className={`font-medium text-xs sm:text-sm hidden sm:inline ${currentStep >= 1 ? 'text-gray-900' : 'text-gray-400'}`}>Age</span>
        </div>
        <div className={`w-8 sm:w-12 h-0.5 ${currentStep > 1 ? 'bg-green-500' : 'bg-gray-200'} transition-all`} aria-hidden="true"></div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div 
            className={`w-8 h-8 rounded-full ${currentStep > 2 ? 'bg-green-500 text-white' : currentStep === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center font-semibold text-sm transition-all`}
            aria-label="Step 2: Location"
            aria-current={currentStep === 2 ? 'step' : undefined}
          >
            {currentStep > 2 ? <Check className="w-5 h-5" aria-hidden="true" /> : '2'}
          </div>
          <span className={`font-medium text-xs sm:text-sm hidden sm:inline ${currentStep >= 2 ? 'text-gray-900' : 'text-gray-400'}`}>Location</span>
        </div>
        <div className={`w-8 sm:w-12 h-0.5 ${currentStep > 2 ? 'bg-green-500' : 'bg-gray-200'} transition-all`} aria-hidden="true"></div>
        <div className="flex items-center gap-1 sm:gap-2">
          <div 
            className={`w-8 h-8 rounded-full ${currentStep === 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'} flex items-center justify-center font-semibold text-sm transition-all`}
            aria-label="Step 3: Savings"
            aria-current={currentStep === 3 ? 'step' : undefined}
          >
            3
          </div>
          <span className={`font-medium text-xs sm:text-sm hidden sm:inline ${currentStep >= 3 ? 'text-gray-900' : 'text-gray-400'}`}>Savings</span>
        </div>
      </nav>

      {/* Main Content */}
      <main className="px-4 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
        {/* Step 1: Age */}
        {currentStep === 1 && (
          <>
            {/* Current Age Card */}
            <div className="relative bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-4 shadow-sm border border-blue-100 overflow-hidden transition-all">
              <div className="absolute top-2 right-2 opacity-10">
                <Calendar className="w-10 h-10 text-purple-600" aria-hidden="true" />
              </div>
              
              <div className="relative z-10">
                {!isEditingBirthDate ? (
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full bg-white shadow-sm flex-shrink-0">
                      <img alt="User profile" className="absolute inset-0 max-w-none object-cover size-full rounded-full" src={imgImg} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-lg sm:text-xl font-semibold text-gray-900">
                        You're {currentAge} years old 🎉
                      </p>
                      <div className="flex items-center justify-between mt-1 gap-2">
                        <p className="text-gray-600 text-xs sm:text-sm">Born on {birthDate}</p>
                        <button 
                          className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium hover:underline flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1" 
                          onClick={handleEditClick}
                          aria-label="Edit birth date"
                        >
                          Edit
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); handleSaveBirthDate(); }}>
                    <div className="flex items-center gap-3 mb-3">
                      <div className="relative w-10 h-10 rounded-full bg-white shadow-sm flex-shrink-0">
                        <img alt="User profile" className="absolute inset-0 max-w-none object-cover size-full rounded-full" src={imgImg} />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900" id="edit-birthdate-heading">
                        Edit your birth date
                      </h3>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="flex-1">
                        <label htmlFor="birth-month" className="text-xs font-medium text-gray-600 mb-1 block">Month</label>
                        <select
                          id="birth-month"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                          value={tempMonth}
                          onChange={(e) => setTempMonth(e.target.value)}
                          aria-required="true"
                        >
                          {monthNames.map((month) => (
                            <option key={month} value={month}>
                              {month}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div className="flex-1 sm:w-20 sm:flex-none">
                        <label htmlFor="birth-day" className="text-xs font-medium text-gray-600 mb-1 block">Day</label>
                        <input
                          id="birth-day"
                          type="number"
                          min="1"
                          max="31"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={tempDay}
                          onChange={(e) => setTempDay(Number(e.target.value))}
                          aria-required="true"
                          aria-label="Birth day"
                        />
                      </div>
                      
                      <div className="flex-1 sm:w-24 sm:flex-none">
                        <label htmlFor="birth-year" className="text-xs font-medium text-gray-600 mb-1 block">Year</label>
                        <input
                          id="birth-year"
                          type="number"
                          min="1900"
                          max={currentYear}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          value={tempYear}
                          onChange={(e) => setTempYear(Number(e.target.value))}
                          aria-required="true"
                          aria-label="Birth year"
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-end gap-2 pt-2">
                      <button
                        type="button"
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors font-medium text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
                        onClick={handleCancelEdit}
                      >
                        <X className="w-4 h-4" aria-hidden="true" />
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <Check className="w-4 h-4" aria-hidden="true" />
                        Save
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Retirement Age Selection */}
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 text-center" id="retirement-age-heading">
                At what age would you like to retire?
              </h2>

              {/* Age Display with Controls */}
              <div className="flex items-center justify-center gap-4 sm:gap-6 py-2" role="group" aria-labelledby="retirement-age-heading">
                <button
                  onClick={decrementAge}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Decrease retirement age. Current age: ${retirementAge}`}
                  disabled={retirementAge <= currentAge + 1}
                  aria-controls="retirement-age-value"
                >
                  <Minus className="w-5 h-5 text-gray-700" aria-hidden="true" />
                </button>
                
                <div className="text-center">
                  <div className="text-gray-600 text-xs sm:text-sm mb-0.5">I plan to retire at</div>
                  <div className="text-4xl sm:text-5xl font-bold text-blue-600" id="retirement-age-value" aria-live="polite">
                    {retirementAge}
                  </div>
                </div>

                <button
                  onClick={incrementAge}
                  className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-gray-100 hover:bg-gray-200 active:bg-gray-300 transition-colors flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  aria-label={`Increase retirement age. Current age: ${retirementAge}`}
                  disabled={retirementAge >= 75}
                  aria-controls="retirement-age-value"
                >
                  <Plus className="w-5 h-5 text-gray-700" aria-hidden="true" />
                </button>
              </div>

              {/* Slider */}
              <div className="px-2 sm:px-4">
                <Slider.Root
                  className="relative flex items-center select-none touch-none w-full h-5"
                  value={[retirementAge]}
                  onValueChange={handleSliderChange}
                  min={currentAge + 1}
                  max={75}
                  step={1}
                  aria-label="Select retirement age"
                >
                  <Slider.Track className="bg-gray-200 relative grow rounded-full h-2">
                    <Slider.Range className="absolute bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full h-full" />
                  </Slider.Track>
                  <Slider.Thumb
                    className="block w-7 h-7 bg-white shadow-lg rounded-full border-2 border-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-200 active:scale-110 transition-transform"
                    aria-label={`Retirement age slider. Current value: ${retirementAge}`}
                    aria-valuemin={currentAge + 1}
                    aria-valuemax={75}
                    aria-valuenow={retirementAge}
                  />
                </Slider.Root>
                <div className="flex justify-between text-xs text-gray-500 mt-1" aria-hidden="true">
                  <span>{currentAge + 1}</span>
                  <span>75</span>
                </div>
              </div>

              {/* AI Insight - Compact */}
              <div>
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-2.5 sm:p-3 shadow-sm" role="region" aria-label="Retirement age recommendation">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-3.5 h-3.5 text-white" aria-hidden="true" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-1.5 mb-0.5">
                          <h3 className="font-semibold text-gray-900 text-xs sm:text-sm">
                            Most people retire at 58
                          </h3>
                          <span className="text-xs font-medium text-purple-600 bg-purple-100 px-1.5 py-0.5 rounded-full">
                            Popular
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs">
                          Based on 2.4M users
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setRetirementAge(58)}
                      className="text-blue-600 hover:text-blue-700 text-xs font-medium hover:underline flex-shrink-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1 self-end sm:self-auto"
                      aria-label="Apply popular retirement age of 58"
                    >
                      Apply this age
                    </button>
                  </div>
                </div>
              </div>

              {/* Insight Feedback */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 sm:p-4 space-y-2" role="region" aria-live="polite" aria-label="Retirement calculation summary">
                <p className="text-gray-800 text-center text-sm sm:text-base">
                  <span className="font-semibold">
                    Retiring at {retirementAge}
                  </span>{' '}
                  means you have{' '}
                  <span className="font-semibold text-blue-600">
                    {yearsUntilRetirement} years
                  </span>{' '}
                  until retirement.
                </p>
                <p className="text-gray-700 text-xs sm:text-sm text-center">
                  Your estimated retirement year:{' '}
                  <span className="font-bold text-blue-600 text-base sm:text-lg">
                    {retirementYear}
                  </span>
                </p>

                {/* Timeline Visualization */}
                <div className="pt-2">
                  <div className="flex items-center gap-2" role="img" aria-label={`Timeline from ${currentYear} to retirement in ${retirementYear}, ${yearsUntilRetirement} years`}>
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-blue-600"></div>
                      <div className="text-xs font-medium text-gray-600 mt-0.5">Now</div>
                      <div className="text-xs text-gray-500">{currentYear}</div>
                    </div>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-blue-600 to-indigo-600 relative">
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-50 px-2 py-0.5 rounded text-xs font-medium text-blue-600 whitespace-nowrap">
                        {yearsUntilRetirement} years
                      </div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-2.5 h-2.5 rounded-full bg-indigo-600"></div>
                      <div className="text-xs font-medium text-gray-600 mt-0.5">Retire</div>
                      <div className="text-xs text-gray-500">{retirementYear}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Step 2: Location */}
        {currentStep === 2 && (
          <div className="space-y-4 sm:space-y-5">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900" id="location-heading">
                Where do you imagine retiring? 🌎
              </h2>
              <p className="text-gray-600 text-xs sm:text-sm">
                Your location helps us estimate cost of living and plan smarter.
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" aria-hidden="true" />
                <input
                  type="text"
                  id="location-search"
                  className="w-full border-2 border-gray-300 rounded-xl pl-12 pr-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search for a state..."
                  value={locationSearch}
                  onChange={handleLocationSearchChange}
                  onFocus={() => locationSearch.length > 0 && setShowSuggestions(true)}
                  onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                  role="combobox"
                  aria-expanded={showSuggestions}
                  aria-controls="location-suggestions"
                  aria-autocomplete="list"
                  aria-label="Search for retirement location"
                />
              </div>

              {/* Autocomplete Suggestions */}
              {showSuggestions && filteredLocations.length > 0 && (
                <ul 
                  id="location-suggestions"
                  className="absolute z-10 w-full bg-white border border-gray-200 rounded-xl shadow-lg mt-2 max-h-60 overflow-y-auto"
                  role="listbox"
                  aria-label="Location suggestions"
                >
                  {filteredLocations.map((location, index) => (
                    <li key={index} role="option" aria-selected={selectedLocation === location}>
                      <button
                        className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0 flex items-center gap-3 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
                        onClick={() => handleLocationSelect(location)}
                        type="button"
                      >
                        <MapPin className="w-4 h-4 text-blue-600 flex-shrink-0" aria-hidden="true" />
                        <span className="text-gray-900 text-sm">{location}</span>
                      </button>
                    </li>
                  ))}\n                </ul>
              )}
            </div>

            {/* Popular Locations */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600" aria-hidden="true" />
                <h3 className="text-xs sm:text-sm font-semibold text-gray-900" id="popular-locations-heading">Popular Retirement Destinations</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="group" aria-labelledby="popular-locations-heading">
                {popularLocations.map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleLocationSelect(location.name)}
                    className={`text-left p-3 rounded-xl border-2 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                      selectedLocation === location.name
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 bg-white'
                    }`}
                    aria-pressed={selectedLocation === location.name}
                    aria-label={`${location.name}: ${location.description}, ${location.cost} cost of living`}
                    type="button"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-2xl" role="img" aria-label={location.name}>{location.icon}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-gray-900 text-sm">{location.name}</h4>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            location.cost === 'Low' ? 'bg-green-100 text-green-700' :
                            location.cost === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-red-100 text-red-700'
                          }`}>
                            {location.cost} Cost
                          </span>
                        </div>
                        <p className="text-gray-600 text-xs mt-0.5">{location.description}</p>
                      </div>
                      {selectedLocation === location.name && (
                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0" aria-hidden="true" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* AI Insight for Location */}
            {selectedLocation && (
              <div role="region" aria-live="polite" aria-label="Location insights">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">
                        Smart Choice! 🎯
                      </h3>
                      <p className="text-gray-700 text-xs leading-relaxed">
                        <span className="font-semibold">{selectedLocation}</span> is a popular retirement destination. 
                        {selectedLocation.includes('Florida') && ' With no state income tax and warm weather year-round, you could save $15,000+ annually on taxes alone.'}
                        {selectedLocation.includes('Arizona') && ' Enjoy 300+ days of sunshine, no tax on Social Security benefits, and thriving 55+ communities.'}
                        {selectedLocation.includes('North Carolina') && ' Enjoy mountains and beaches with affordable living and a vibrant community.'}
                        {selectedLocation.includes('South Carolina') && ' Experience coastal living with low taxes and a relaxed lifestyle.'}
                        {!selectedLocation.includes('Florida') && !selectedLocation.includes('Arizona') && !selectedLocation.includes('North Carolina') && 
                         !selectedLocation.includes('South Carolina') && ' Research shows that location can impact your retirement savings by up to 40%. We\'ll help you optimize your plan!'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Savings */}
        {currentStep === 3 && (
          <div className="space-y-4 sm:space-y-5">
            <div className="text-center space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900" id="savings-heading">What's your current retirement savings? 💰</h2>
              <p className="text-gray-600 text-xs sm:text-sm">Sharing this helps us give you a clearer picture of your future.</p>
            </div>

            {/* Savings Amount Input */}
            <div className="space-y-3">
              <label htmlFor="savings-amount" className="text-xs sm:text-sm font-semibold text-gray-900 block">
                Enter your total retirement savings 💰
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 text-lg font-semibold pointer-events-none" aria-hidden="true">
                  $
                </div>
                <input
                  id="savings-amount"
                  type="text"
                  inputMode="numeric"
                  className="w-full border-2 border-gray-300 rounded-xl pl-10 pr-4 py-3.5 sm:py-4 text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="0"
                  value={savingsAmount}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    setSavingsAmount(value ? parseInt(value).toLocaleString() : '');
                  }}
                  aria-label="Retirement savings amount in dollars"
                  aria-describedby="savings-hint"
                />
              </div>
              <p id="savings-hint" className="text-xs text-gray-500">
                Exclude 401(k), IRA, pension - only include personal savings and investments
              </p>
            </div>

            {/* AI Insight for Savings */}
            {savingsAmount && (
              <div role="region" aria-live="polite" aria-label="Savings insights">
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3 shadow-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="w-4 h-4 text-white" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-xs sm:text-sm mb-1">
                        {parseInt(savingsAmount.replace(/,/g, '')) > 100000 ? 'Excellent Progress! 🎉' : parseInt(savingsAmount.replace(/,/g, '')) > 0 ? 'Great Start! 💪' : 'Perfect Timing! ⚡'}
                      </h3>
                      <p className="text-gray-700 text-xs leading-relaxed">
                        {parseInt(savingsAmount.replace(/,/g, '')) > 100000 
                          ? `With $${savingsAmount} saved, you're ahead of 75% of Americans your age. Keep up the momentum with consistent contributions to reach your retirement goals.`
                          : parseInt(savingsAmount.replace(/,/g, '')) > 0
                          ? `Every dollar counts! With $${savingsAmount} saved and ${yearsUntilRetirement} years until retirement, consistent contributions can grow this significantly through compound interest.`
                          : 'Starting from zero means you can build a retirement strategy optimized for your goals from day one. The average American who starts planning at your age retires with $800K+ in savings.'
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer Actions */}
      <footer className="flex items-center justify-between px-4 sm:px-6 py-4 bg-gray-50 border-t border-gray-100">
        {currentStep > 1 ? (
          <button
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            onClick={handlePreviousStep}
            aria-label="Go back to previous step"
            type="button"
          >
            <ChevronLeft className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Back</span>
          </button>
        ) : (
          <button 
            className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-gray-700 hover:bg-gray-100 active:bg-gray-200 transition-colors font-medium text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
            type="button"
            aria-label="Save and exit retirement planner"
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            <span className="hidden sm:inline">Save & Exit</span>
          </button>
        )}
        <button
          className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white transition-colors font-semibold shadow-lg shadow-blue-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          onClick={handleNextStep}
          aria-label={currentStep === 3 ? 'View your retirement plan' : `Continue to step ${currentStep + 1}`}
          type="button"
        >
          {currentStep === 3 ? 'View My Plan' : 'Continue'}
          <ChevronRight className="w-5 h-5" aria-hidden="true" />
        </button>
      </footer>
    </div>
  );
}