import React, { useState, useEffect, useMemo } from 'react';
import {
  MapPin,
  Truck,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Zap,
  RotateCcw,
  Banknote,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Building2,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Product, Seller, LocationState } from '../../types';
import {
  calculateDistanceKm,
  checkSellerServiceability,
  INDIAN_CITY_COORDINATES,
} from '../../utils/location';

interface DynamicDeliveryEstimatorProps {
  product: Product;
  seller?: Seller;
}

export const DynamicDeliveryEstimator: React.FC<DynamicDeliveryEstimatorProps> = ({
  product,
  seller,
}) => {
  const {
    currentLocation,
    setLocation,
    setIsLocationModalOpen,
    availableCities,
    showToast,
    websiteSettings,
  } = useApp();

  // Local testing PIN code state
  const [inputPin, setInputPin] = useState(currentLocation.pincode || '110001');
  const [activePin, setActivePin] = useState(currentLocation.pincode || '110001');
  const [activeLocationState, setActiveLocationState] = useState<LocationState>(currentLocation);
  const [isEditingPin, setIsEditingPin] = useState(false);
  const [pinError, setPinError] = useState<string | null>(null);

  // Sync when global currentLocation changes
  useEffect(() => {
    if (currentLocation.pincode) {
      setInputPin(currentLocation.pincode);
      setActivePin(currentLocation.pincode);
      setActiveLocationState(currentLocation);
    }
  }, [currentLocation]);

  // Live countdown to today's dispatch cutoff (5:00 PM / 17:00 local time)
  const [timeLeft, setTimeLeft] = useState<{ hours: number; minutes: number; isPassed: boolean }>({
    hours: 4,
    minutes: 30,
    isPassed: false,
  });

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const cutoff = new Date();
      cutoff.setHours(17, 0, 0, 0); // 5:00 PM cutoff

      let diff = cutoff.getTime() - now.getTime();
      if (diff <= 0) {
        // Cutoff passed for today, countdown to tomorrow's 5:00 PM cutoff
        const tomorrowCutoff = new Date();
        tomorrowCutoff.setDate(tomorrowCutoff.getDate() + 1);
        tomorrowCutoff.setHours(17, 0, 0, 0);
        diff = tomorrowCutoff.getTime() - now.getTime();
        const totalMinutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        setTimeLeft({ hours, minutes, isPassed: true });
      } else {
        const totalMinutes = Math.floor(diff / (1000 * 60));
        const hours = Math.floor(totalMinutes / 60);
        const minutes = totalMinutes % 60;
        setTimeLeft({ hours, minutes, isPassed: false });
      }
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, []);

  // Resolve target location coordinates and metadata for activePin
  const resolvedTargetLocation = useMemo(() => {
    // If activePin matches activeLocationState.pincode, use it
    if (activePin === activeLocationState.pincode) {
      return activeLocationState;
    }

    // Lookup in availableCities
    for (const cityGroup of availableCities) {
      const found = cityGroup.pincodes.find(p => p.pincode === activePin);
      if (found) {
        const coords = INDIAN_CITY_COORDINATES[cityGroup.city] || {
          lat: 28.6139,
          lng: 77.209,
          state: 'India',
        };
        return {
          city: cityGroup.city,
          pincode: activePin,
          area: found.name,
          state: coords.state,
          latitude: coords.lat,
          longitude: coords.lng,
        };
      }
    }

    // Fallback: estimate from PIN prefix
    let estimatedCity = 'New Delhi';
    let estimatedState = 'Delhi';
    let lat = 28.6139;
    let lng = 77.209;

    if (activePin.startsWith('400') || activePin.startsWith('401')) {
      estimatedCity = 'Mumbai';
      estimatedState = 'Maharashtra';
      lat = 19.076;
      lng = 72.8777;
    } else if (activePin.startsWith('411') || activePin.startsWith('412')) {
      estimatedCity = 'Pune';
      estimatedState = 'Maharashtra';
      lat = 18.5204;
      lng = 73.8567;
    } else if (activePin.startsWith('302')) {
      estimatedCity = 'Jaipur';
      estimatedState = 'Rajasthan';
      lat = 26.9124;
      lng = 75.7873;
    } else if (activePin.startsWith('226')) {
      estimatedCity = 'Lucknow';
      estimatedState = 'Uttar Pradesh';
      lat = 26.8467;
      lng = 80.9462;
    } else if (activePin.startsWith('560')) {
      estimatedCity = 'Bengaluru';
      estimatedState = 'Karnataka';
      lat = 12.9716;
      lng = 77.5946;
    } else if (activePin.startsWith('452')) {
      estimatedCity = 'Indore';
      estimatedState = 'Madhya Pradesh';
      lat = 22.7196;
      lng = 75.8577;
    }

    return {
      city: estimatedCity,
      pincode: activePin,
      area: `${estimatedCity} District`,
      state: estimatedState,
      latitude: lat,
      longitude: lng,
    };
  }, [activePin, activeLocationState, availableCities]);

  // Delivery serviceability & calculation
  const deliveryCalculation = useMemo(() => {
    const isDirect = product.isHarwalkartDirect || seller?.isHarwalkartDirect;
    const isGst = seller?.isGstRegistered || false;
    const now = new Date();

    // Calculate distance between seller and resolved location
    let distanceKm = 3.5;
    if (seller?.latitude && seller?.longitude && resolvedTargetLocation.latitude && resolvedTargetLocation.longitude) {
      distanceKm = calculateDistanceKm(
        resolvedTargetLocation.latitude,
        resolvedTargetLocation.longitude,
        seller.latitude,
        seller.longitude
      );
    } else if (isDirect) {
      // Direct warehouse is in Pune MIDC (18.5204, 73.8567)
      if (resolvedTargetLocation.latitude && resolvedTargetLocation.longitude) {
        distanceKm = calculateDistanceKm(
          resolvedTargetLocation.latitude,
          resolvedTargetLocation.longitude,
          18.5204,
          73.8567
        );
      } else {
        distanceKm = 120;
      }
    }

    // Check serviceability
    let isServiceable = true;
    let failureReason = '';

    if (isDirect) {
      isServiceable = true;
    } else if (seller) {
      const serviceCheck = checkSellerServiceability(seller, resolvedTargetLocation);
      isServiceable = serviceCheck.isServiceable;
      if (!isServiceable) {
        failureReason = serviceCheck.reason;
      }
    } else {
      isServiceable =
        product.serviceablePincodes.includes('*') ||
        product.serviceablePincodes.includes(resolvedTargetLocation.pincode);
      if (!isServiceable) {
        failureReason = `Product not serviceable to PIN ${resolvedTargetLocation.pincode}`;
      }
    }

    // Calculate expected delivery date
    const expectedDate = new Date(now);
    let speedTier: 'hyperlocal' | 'express' | 'standard' = 'standard';
    let deliveryWindowText = '';
    let daysToAdd = 2;

    if (isDirect) {
      speedTier = 'express';
      // Same state (Maharashtra / nearby) vs Interstate
      const isNearbyState = resolvedTargetLocation.state?.toLowerCase().includes('maharashtra') || distanceKm < 300;
      daysToAdd = isNearbyState ? (timeLeft.isPassed ? 2 : 1) : (timeLeft.isPassed ? 3 : 2);
      expectedDate.setDate(now.getDate() + daysToAdd);
      deliveryWindowText = isNearbyState ? '1 - 2 Business Days (Express Air)' : '2 - 3 Business Days (Express Pan-India)';
    } else if (!isGst && distanceKm <= 10 && isServiceable) {
      speedTier = 'hyperlocal';
      // Hyperlocal: Same day if before cutoff, else tomorrow morning
      if (!timeLeft.isPassed) {
        daysToAdd = 0;
        deliveryWindowText = 'Today by 7:00 PM - 9:00 PM';
      } else {
        daysToAdd = 1;
        expectedDate.setDate(now.getDate() + 1);
        deliveryWindowText = 'Tomorrow by 11:00 AM - 1:00 PM';
      }
    } else if (isGst && isServiceable) {
      // GST seller: Pan-India courier
      if (distanceKm <= 50) {
        speedTier = 'hyperlocal';
        daysToAdd = timeLeft.isPassed ? 2 : 1;
        expectedDate.setDate(now.getDate() + daysToAdd);
        deliveryWindowText = 'Next-Day Priority Delivery';
      } else if (distanceKm <= 400) {
        speedTier = 'express';
        daysToAdd = timeLeft.isPassed ? 3 : 2;
        expectedDate.setDate(now.getDate() + daysToAdd);
        deliveryWindowText = '2 - 3 Days via Express Courier';
      } else {
        speedTier = 'standard';
        daysToAdd = timeLeft.isPassed ? 5 : 4;
        expectedDate.setDate(now.getDate() + daysToAdd);
        deliveryWindowText = '3 - 5 Days Surface Courier';
      }
    } else {
      // Default fallback
      daysToAdd = 3;
      expectedDate.setDate(now.getDate() + daysToAdd);
      deliveryWindowText = '2 - 4 Days';
    }

    // Format date string
    const dayOptions: Intl.DateTimeFormatOptions = { weekday: 'short', month: 'short', day: 'numeric' };
    const formattedDate = expectedDate.toLocaleDateString('en-IN', dayOptions);

    // Shipping cost calculation
    const freeDeliveryThreshold = websiteSettings?.freeDeliveryThreshold ?? 3000;
    const qualifiesFreeShipping = product.price >= freeDeliveryThreshold || isDirect;
    const shippingFee = qualifiesFreeShipping ? 0 : (websiteSettings?.standardDeliveryFee ?? 30);

    return {
      isServiceable,
      failureReason,
      speedTier,
      distanceKm: Math.round(distanceKm * 10) / 10,
      daysToAdd,
      expectedDate,
      formattedDate,
      deliveryWindowText,
      shippingFee,
      qualifiesFreeShipping,
    };
  }, [product, seller, resolvedTargetLocation, timeLeft.isPassed]);

  const handleApplyPincode = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError(null);
    const cleaned = inputPin.trim().replace(/\D/g, '');
    if (cleaned.length !== 6) {
      setPinError('Please enter a valid 6-digit Indian PIN code');
      return;
    }

    setActivePin(cleaned);
    setIsEditingPin(false);
    showToast(`Delivery estimates updated for PIN ${cleaned}`);
  };

  const handleSetAsDefaultLocation = () => {
    setLocation(resolvedTargetLocation);
    showToast(`Delivery address set to ${resolvedTargetLocation.area}, ${resolvedTargetLocation.city} - ${resolvedTargetLocation.pincode}`);
  };

  const handleSelectQuickCity = (cityPin: string) => {
    setInputPin(cityPin);
    setActivePin(cityPin);
    setIsEditingPin(false);
    setPinError(null);
    showToast(`Estimated for PIN ${cityPin}`);
  };

  return (
    <div
      id="dynamic-delivery-estimator"
      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-xs space-y-4"
    >
      {/* Top Location Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3.5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 text-xs">
          <div className="w-8 h-8 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <MapPin className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
              Deliver to
            </span>
            <div className="flex items-center gap-1.5 font-black text-slate-900 dark:text-white">
              <span>
                {resolvedTargetLocation.area || resolvedTargetLocation.city},{' '}
                {resolvedTargetLocation.city}
              </span>
              <span className="bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-[11px] font-mono text-amber-600 dark:text-amber-400">
                {activePin}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {!isEditingPin ? (
            <button
              type="button"
              onClick={() => setIsEditingPin(true)}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 underline underline-offset-2 cursor-pointer transition-colors"
            >
              Enter PIN
            </button>
          ) : null}

          <button
            type="button"
            onClick={() => setIsLocationModalOpen(true)}
            className="px-2.5 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Change City
          </button>
        </div>
      </div>

      {/* Inline PIN Code Input Form */}
      {isEditingPin && (
        <form onSubmit={handleApplyPincode} className="p-3 bg-slate-50 dark:bg-slate-850 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2 animate-in fade-in duration-150">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
            <span>Check Delivery at PIN Code:</span>
            <button
              type="button"
              onClick={() => setIsEditingPin(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              Cancel
            </button>
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={6}
              value={inputPin}
              onChange={e => {
                setInputPin(e.target.value.replace(/\D/g, ''));
                setPinError(null);
              }}
              placeholder="e.g. 110001 or 400058"
              className="flex-1 px-3 py-2 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-amber-400"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-amber-400 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 font-black text-xs rounded-xl cursor-pointer transition-colors shadow-xs"
            >
              Apply PIN
            </button>
          </div>
          {pinError && (
            <p className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {pinError}
            </p>
          )}

          {/* Quick preset city chips */}
          <div className="pt-1 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-slate-400 font-medium">Quick test:</span>
            {[
              { label: 'Delhi', pin: '110001' },
              { label: 'Mumbai', pin: '400058' },
              { label: 'Pune', pin: '411001' },
              { label: 'Jaipur', pin: '302003' },
              { label: 'Bengaluru', pin: '560001' },
            ].map(c => (
              <button
                key={c.pin}
                type="button"
                onClick={() => handleSelectQuickCity(c.pin)}
                className={`px-2 py-0.5 rounded-lg border text-[10px] font-bold cursor-pointer transition-colors ${
                  activePin === c.pin
                    ? 'bg-amber-500 text-slate-950 border-amber-500'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:border-amber-400'
                }`}
              >
                {c.label} ({c.pin})
              </button>
            ))}
          </div>
        </form>
      )}

      {/* Main Delivery Calculation Card */}
      {deliveryCalculation.isServiceable ? (
        <div className="space-y-3.5">
          {/* Expected Delivery Date & Badge */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-500/15 dark:via-transparent border border-amber-300/60 dark:border-amber-500/30">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                    Estimated Delivery:
                  </span>
                  {deliveryCalculation.speedTier === 'hyperlocal' ? (
                    <span className="inline-flex items-center gap-1 bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                      <Zap className="w-3 h-3 fill-slate-950" />
                      Hyperlocal Same-Day
                    </span>
                  ) : deliveryCalculation.speedTier === 'express' ? (
                    <span className="inline-flex items-center gap-1 bg-sky-500 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
                      <Sparkles className="w-3 h-3" />
                      Harwalkart Express
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 bg-slate-800 text-white text-[10px] font-black px-2 py-0.5 rounded-md uppercase tracking-wider">
                      <Truck className="w-3 h-3" />
                      Standard Courier
                    </span>
                  )}
                </div>

                <div className="flex items-baseline gap-2">
                  <h3 className="text-lg sm:text-xl font-black text-slate-950 dark:text-white">
                    {deliveryCalculation.daysToAdd === 0
                      ? 'Today'
                      : deliveryCalculation.daysToAdd === 1
                      ? 'Tomorrow'
                      : `By ${deliveryCalculation.formattedDate}`}
                  </h3>
                  <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                    ({deliveryCalculation.deliveryWindowText})
                  </span>
                </div>
              </div>

              {/* Free delivery badge */}
              <div className="text-right">
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-lg inline-block ${
                    deliveryCalculation.qualifiesFreeShipping
                      ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  {deliveryCalculation.qualifiesFreeShipping
                    ? 'FREE Delivery'
                    : `₹${deliveryCalculation.shippingFee} Delivery Fee`}
                </span>
                {!deliveryCalculation.qualifiesFreeShipping && (
                  <span className="block text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold mt-0.5">
                    Free for orders above ₹{websiteSettings?.freeDeliveryThreshold ?? 3000}
                  </span>
                )}
              </div>
            </div>

            {/* Cutoff countdown notice */}
            <div className="mt-2.5 pt-2.5 border-t border-amber-200/50 dark:border-amber-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                <Clock className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 animate-pulse" />
                <span>
                  Order within{' '}
                  <strong className="text-slate-950 dark:text-white">
                    {timeLeft.hours} hrs {timeLeft.minutes} mins
                  </strong>{' '}
                  for guaranteed dispatch!
                </span>
              </div>

              {seller && !seller.isHarwalkartDirect && (
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400">
                  Seller is {deliveryCalculation.distanceKm} km away
                </span>
              )}
            </div>
          </div>

          {/* Delivery Milestone Stepper */}
          <div className="py-2">
            <div className="grid grid-cols-4 gap-2 text-center relative">
              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold shadow-xs">
                  ✓
                </div>
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-1">Ordered</span>
                <span className="text-[9px] text-slate-400">Today</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center text-[10px] font-bold shadow-xs">
                  2
                </div>
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-1">Dispatched</span>
                <span className="text-[9px] text-slate-400">Within 24 hrs</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                  3
                </div>
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-1">In Transit</span>
                <span className="text-[9px] text-slate-400">To {resolvedTargetLocation.city}</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-6 h-6 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 flex items-center justify-center text-[10px] font-bold">
                  4
                </div>
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200 mt-1">Delivered</span>
                <span className="text-[9px] text-amber-600 dark:text-amber-400 font-bold">
                  {deliveryCalculation.daysToAdd === 0 ? 'Today' : deliveryCalculation.formattedDate}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Perks & Assurance Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <Banknote className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                  Cash on Delivery
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Available at this PIN</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <RotateCcw className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                  7-Day Return
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Easy refund guarantee</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
              <div>
                <span className="font-bold text-slate-800 dark:text-slate-200 block text-[11px]">
                  100% Genuine
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400">Verified Marketplace</span>
              </div>
            </div>
          </div>

          {/* Set as my default location button if different from saved */}
          {activePin !== currentLocation.pincode && (
            <div className="pt-1 flex items-center justify-between bg-amber-50 dark:bg-amber-950/40 p-2.5 rounded-xl border border-amber-200 dark:border-amber-800/80 text-xs">
              <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-200">
                Update default delivery address to {resolvedTargetLocation.area}, {resolvedTargetLocation.city}?
              </span>
              <button
                type="button"
                onClick={handleSetAsDefaultLocation}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 text-[11px] font-bold rounded-lg cursor-pointer transition-colors shadow-xs"
              >
                Set Default
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Non-Serviceable View */
        <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/80 space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-100 dark:bg-rose-900 text-rose-600 dark:text-rose-300 flex items-center justify-center shrink-0">
              <XCircle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-black text-rose-900 dark:text-rose-200">
                Delivery Unavailable at PIN {activePin}
              </h4>
              <p className="text-xs text-rose-700 dark:text-rose-300 mt-0.5">
                {deliveryCalculation.failureReason ||
                  `This local shop cannot deliver to ${resolvedTargetLocation.city} (${deliveryCalculation.distanceKm} km away, exceeds 10 KM local zone).`}
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-rose-200 dark:border-rose-900/60 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-medium text-rose-800 dark:text-rose-300">
              Want Pan-India delivery? Explore Kitchen Shakti Pure Spices!
            </span>
            <button
              type="button"
              onClick={() => setIsEditingPin(true)}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-lg cursor-pointer transition-colors"
            >
              Try Another PIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
