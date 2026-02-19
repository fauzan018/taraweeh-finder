'use client';

import { MapPin, Menu } from 'lucide-react';
import RamadanCounter from './RamadanCounter';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useState } from 'react';

interface NavigationProps {
  onLocationChange?: (state: string) => void;
  selectedLocation?: string;
}

// Navigation bar for Taraweeh Finder (demo change)
export function Navigation({ onLocationChange, selectedLocation }: NavigationProps) {
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
                <h1 className="text-lg font-semibold text-text-primary">Taraweeh Finder</h1>
                <p className="text-xs text-text-secondary leading-tight">Find prayers near you</p>
              </div>
            </Link>

            {/* Center - Ramadan Counter */}
            <div className="hidden md:block">
              <RamadanCounter />
            </div>

            {/* Location Selector & Navigation */}
            <div className="flex items-center gap-4">
              <div className="hidden sm:flex items-center gap-2">
                {/* Location Selector */}
                <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border hover:border-border-light transition-colors">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                  <select
                    className="bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer appearance-none"
                    onChange={(e) => onLocationChange?.(e.target.value)}
                    defaultValue={selectedLocation || ''}
                  >
                    <option value="">All States</option>
                    <option value="Delhi">Delhi</option>
                    <option value="Maharashtra">Maharashtra</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Uttar Pradesh">Uttar Pradesh</option>
                  </select>
                </div>


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
              </div>

              {/* Mobile Menu Button */}
              <button
                className="sm:hidden p-2 rounded-lg hover:bg-surface transition-colors"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <Menu className="w-5 h-5 text-text-primary" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="sm:hidden pb-4 space-y-3 border-t border-border pt-4">
              <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-surface border border-border">
                <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                <select
                  className="bg-transparent text-sm text-text-primary focus:outline-none cursor-pointer appearance-none flex-1"
                  onChange={(e) => {
                    onLocationChange?.(e.target.value);
                    setMobileMenuOpen(false);
                  }}
                  defaultValue={selectedLocation || ''}
                >
                  <option value="">All States</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Maharashtra">Maharashtra</option>
                  <option value="Karnataka">Karnataka</option>
                  <option value="Tamil Nadu">Tamil Nadu</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                </select>
              </div>
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
