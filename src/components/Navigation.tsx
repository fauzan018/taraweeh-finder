'use client';

import { MapPin, Menu } from 'lucide-react';
import RamadanCounter from './RamadanCounter';
import { Button } from '@/components/ui/UiButton';
import Link from 'next/link';
import { useState } from 'react';
import { INDIA_STATES } from '@/lib/constants';

interface NavigationProps {
  onLocationChange?: (state: string) => void;
  selectedLocation?: string;
  onCityChange?: (city: string) => void;
  selectedCity?: string;
  cities?: string[];
  showFilters?: boolean;
}

// Navigation bar for Taraweeh Sweets Finder (demo change)
export function Navigation({
  onLocationChange,
  selectedLocation,
  onCityChange,
  selectedCity,
  cities = [],
  showFilters = true,
}: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo & Branding */}
            <Link href="/" className="flex items-center gap-3 flex-shrink-0">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20 flex items-center justify-center">
                <span className="text-xl font-semibold text-primary">🕌</span>
              </div>
              <div className="hidden sm:block">
                <h1 className="text-lg font-semibold text-text-primary">Taraweeh Sweets Finder</h1>
                <p className="text-xs text-text-secondary leading-tight">Find taraweeh sweets near you</p>
              </div>
            </Link>

            {/* Center - Ramadan Counter */}
            <div className="hidden md:block">
              <RamadanCounter />
            </div>

            {/* Location Selector & Navigation */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                {showFilters && (
                  <>
                    {/* State Selector */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border hover:border-border-light transition-colors">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <select
                        className="bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer appearance-none"
                        onChange={(e) => onLocationChange?.(e.target.value)}
                        value={selectedLocation || ''}
                        aria-label="Filter by state"
                      >
                        <option value="">All States</option>
                        {INDIA_STATES.map((state) => (
                          <option key={state} value={state}>
                            {state}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* City Selector */}
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border hover:border-border-light transition-colors">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <select
                        className="bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer appearance-none min-w-[8rem]"
                        onChange={(e) => onCityChange?.(e.target.value)}
                        value={selectedCity || ''}
                        aria-label="Filter by city"
                      >
                        <option value="">All Cities</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                    </div>
                  </>
                )}

                {/* Submit Link */}
                <Link href="/submit">
                  <Button
                    variant="primary"
                    size="lg"
                    className="font-bold px-6 py-2 shadow-lg hover:scale-105 transition-transform duration-150"
                  >
                    Submit Mosque
                  </Button>
                </Link>

                {/* Support Link */}
                <Link href="/support">
                  <Button
                    variant="secondary"
                    size="lg"
                    className="font-semibold px-5 py-2"
                  >
                    Support Us
                  </Button>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                className="sm:hidden p-2 rounded-lg hover:bg-surface transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                <Menu className="w-5 h-5 text-text-primary" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden pb-4 space-y-3 border-t border-border pt-4">
              {showFilters && (
                <>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <select
                      className="bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer appearance-none flex-1"
                      onChange={(e) => {
                        onLocationChange?.(e.target.value);
                      }}
                      value={selectedLocation || ''}
                      aria-label="Filter by state"
                    >
                      <option value="">All States</option>
                      {INDIA_STATES.map((state) => (
                        <option key={state} value={state}>
                          {state}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border">
                    <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                    <select
                      className="bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer appearance-none flex-1"
                      onChange={(e) => onCityChange?.(e.target.value)}
                      value={selectedCity || ''}
                      aria-label="Filter by city"
                    >
                      <option value="">All Cities</option>
                      {cities.map((city) => (
                        <option key={city} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
                </>
              )}
              <div className="grid grid-cols-1 gap-2">
                <Link href="/submit">
                  <Button
                    variant="primary"
                    size="lg"
                    fullWidth
                    className="font-bold px-6 py-3 shadow-lg hover:scale-105 transition-transform duration-150"
                  >
                    Submit Mosque
                  </Button>
                </Link>
                <Link href="/support">
                  <Button
                    variant="secondary"
                    size="lg"
                    fullWidth
                    className="font-semibold px-6 py-3"
                  >
                    Support Us
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer */}
      <div className="h-16 md:h-20" />
    </>
  );
}
