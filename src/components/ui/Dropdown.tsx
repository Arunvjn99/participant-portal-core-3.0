import { useId, useRef, useEffect, useState } from "react";
import type { KeyboardEvent, FocusEvent } from "react";

export interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  label?: string;
  placeholder?: string;
  value?: string;
  options: DropdownOption[];
  onChange: (value: string) => void;
  name?: string;
  id?: string;
  error?: string;
  disabled?: boolean;
  size?: "default" | "compact";
}

export const Dropdown = ({
  label = "",
  placeholder = "Select an option",
  value,
  options,
  onChange,
  name,
  id,
  error,
  disabled = false,
  size = "default",
}: DropdownProps) => {
  const generatedId = useId();
  const inputId = id || name || generatedId;
  const errorId = error ? `${inputId}-error` : undefined;
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const selectedOption = options.find((opt) => opt.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setFocusedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setFocusedIndex(-1);
    }
  };

  const handleSelect = (optionValue: string) => {
    onChange(optionValue);
    setIsOpen(false);
    setFocusedIndex(-1);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (isOpen && focusedIndex >= 0) {
          handleSelect(options[focusedIndex].value);
        } else {
          setIsOpen(!isOpen);
        }
        break;
      case "Escape":
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setFocusedIndex((prev) => (prev < options.length - 1 ? prev + 1 : prev));
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setFocusedIndex((prev) => (prev > 0 ? prev - 1 : 0));
        }
        break;
      case "Tab":
        setIsOpen(false);
        setFocusedIndex(-1);
        break;
    }
  };

  const handleBlur = (e: FocusEvent<HTMLDivElement>) => {
    // Don't close if focus moves to an option
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setIsOpen(false);
      setFocusedIndex(-1);
    }
  };

  return (
    <div className="dropdown-wrapper">
      {label ? (
        <label htmlFor={inputId} className="dropdown-label">
          {label}
        </label>
      ) : null}
      <div
        ref={dropdownRef}
        className={`dropdown dropdown--${size} ${error ? "dropdown--error" : ""} ${isOpen ? "dropdown--open" : ""} ${disabled ? "dropdown--disabled" : ""}`}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={`${inputId}-listbox`}
        aria-invalid={error ? true : undefined}
        aria-describedby={errorId}
        tabIndex={disabled ? -1 : 0}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
      >
        <input
          type="hidden"
          id={inputId}
          name={name}
          value={value || ""}
          readOnly
        />
        <div className="dropdown__trigger" onClick={handleToggle}>
          <span className={`dropdown__value ${!selectedOption ? "dropdown__value--placeholder" : ""}`}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="dropdown__icon" aria-hidden="true">
            {isOpen ? "▲" : "▼"}
          </span>
        </div>
        {isOpen && (
          <ul
            id={`${inputId}-listbox`}
            className="dropdown__list"
            role="listbox"
            aria-label={label}
          >
            {options.map((option, index) => (
              <li
                key={option.value}
                className={`dropdown__option ${option.value === value ? "dropdown__option--selected" : ""} ${index === focusedIndex ? "dropdown__option--focused" : ""}`}
                role="option"
                aria-selected={option.value === value}
                onClick={() => handleSelect(option.value)}
                onMouseEnter={() => setFocusedIndex(index)}
              >
                {option.label}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <span id={errorId} className="dropdown-error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
};
