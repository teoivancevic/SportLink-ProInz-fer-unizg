'use client';

import { Libraries } from '@react-google-maps/api';
import { useEffect, useRef, useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { MapPin } from 'lucide-react';
import { useLoadScript } from '@react-google-maps/api';

const autocompleteStyle = `
  .pac-container {
    border-radius: 0.5rem;
    margin-top: 4px;
    padding: 0;
    border: 1px solid hsl(var(--border));
    background: hsl(var(--background));
    color: hsl(var(--foreground));
    box-shadow: none !important;
    font-family: var(--font-sans);
    z-index: 100;
  }

  .pac-item {
    padding: 8px 12px;
    border-top: 1px solid hsl(var(--border));
    cursor: pointer;
    font-size: 14px;
    line-height: 20px;
  }

  .pac-item:first-child {
    border-top: none;
  }

  .pac-item:hover {
    background-color: hsl(var(--accent));
  }

  .pac-item-selected {
    background-color: hsl(var(--accent));
  }

  .pac-item-query {
    color: hsl(var(--foreground));
    font-size: 14px;
    padding-right: 4px;
  }

  .pac-matched {
    font-weight: 600;
  }

  .pac-icon {
    display: none;
  }
`;

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
}

const libraries: Libraries = ['places'];

export function LocationInput({ value, onChange }: LocationInputProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
    libraries,
    language: 'hr',
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const [internalValue, setInternalValue] = useState(value);

  useEffect(() => {
    if (!isLoaded || !inputRef.current || !window.google) return;

    const inputElement = inputRef.current;

    const autocomplete = new google.maps.places.Autocomplete(inputElement, {
      componentRestrictions: { country: 'HR' },
      fields: ['formatted_address', 'geometry'],
      types: ['geocode'],
    });

    const styleElement = document.createElement('style');
    styleElement.textContent = autocompleteStyle;
    document.head.appendChild(styleElement);

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.formatted_address && place.geometry?.location) {
        setInternalValue(place.formatted_address);
        onChange(place.formatted_address);
      }
    });

    const preventSubmit = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        e.preventDefault();
      }
    };
    inputElement.addEventListener('keydown', preventSubmit);

    return () => {
      google.maps.event.clearInstanceListeners(autocomplete);
      inputElement.removeEventListener('keydown', preventSubmit);
      styleElement.remove();
    };
  }, [isLoaded]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInternalValue(newValue);
    onChange(newValue);
  };

  if (loadError) {
    return <div>Error loading Google Maps</div>;
  }

  return (
    <div className="space-y-2">
      <Label className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        Lokacija
      </Label>
      <Input
        ref={inputRef}
        placeholder="Unesite adresu..."
        type="text"
        value={internalValue}
        onChange={handleInputChange}
        autoComplete="off"
        required
      />
    </div>
  );
}
