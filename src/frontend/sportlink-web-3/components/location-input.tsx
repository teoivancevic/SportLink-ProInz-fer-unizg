'use client'

import { Libraries } from '@react-google-maps/api';
import { useRef, useEffect, useMemo } from 'react'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { MapPin } from 'lucide-react'
import { useLoadScript } from '@react-google-maps/api'

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

  const AutocompleteComponent = useMemo(() => {
    const Component = ({ value, onChange }: LocationInputProps) => {
      const autocompleteRef = useRef<HTMLInputElement>(null);

      useEffect(() => {

        if (!autocompleteRef.current || !window.google) {
            console.log("Google Maps API not loaded or input ref not found");
            return;
          }
      
        const inputElement = autocompleteRef.current; 
      
        const autocomplete = new google.maps.places.Autocomplete(inputElement, {
          componentRestrictions: { country: 'HR' },
          fields: ['formatted_address', 'geometry'],
          types: ['geocode']
        });
      
        const styleElement = document.createElement('style');
        styleElement.textContent = autocompleteStyle;
        document.head.appendChild(styleElement);

        const listener = autocomplete.addListener('place_changed', () => {
            const place = autocomplete.getPlace();
            if (place.adr_address) {
                onChange(place.adr_address);
            }
            
           
            if (place.formatted_address) {
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
          google.maps.event.removeListener(listener);
          inputElement.removeEventListener('keydown', preventSubmit);
          styleElement.remove();
        };
      }, [onChange]);

      return (
        <Input
          ref={autocompleteRef}
          placeholder="Unesite adresu..."
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          autoComplete="off"
          required
        />
      );
    };

    Component.displayName = 'AutocompleteComponent';
    return Component;
  }, []);

  if (loadError) {
    console.error('Google Maps failed to load:', loadError);
    return <div>Error loading Google Maps</div>;
  }

  return (
    <div className="space-y-2">
        <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Lokacija
        </Label>
        {isLoaded ? (
            <AutocompleteComponent value={value} onChange={onChange} />
        ) : (
            <Input placeholder="Loading..." disabled />
        )}
    </div>
  );
}

