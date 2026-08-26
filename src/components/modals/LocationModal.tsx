import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  MapPin,
  Search,
  Check,
  Navigation,
  X,
  Loader2,
  AlertCircle,
  Edit3,
  ShieldCheck,
  Truck,
  RotateCw,
  Compass,
} from 'lucide-react';
import { reverseGeocodeCoordinates, getClosestCity } from '../../utils/location';

export const LocationModal: React.FC = () => {
  const {
    isLocationModalOpen,
    setIsLocationModalOpen,
    currentLocation,
    setLocation,
    availableCities,
  } = useApp();

  const [inputPincode, setInputPincode] = useState('');
  const [selectedCity, setSelectedCity] = useState(currentLocation.city);
  const [errorMessage, setErrorMessage] = useState('');

  // GPS detection state: 'idle' | 'detecting' | 'detected' | 'error'
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'detecting' | 'detected' | 'error'>('idle');
  const [gpsErrorMessage, setGpsErrorMessage] = useState('');

  // Detected GPS coordinates and editable fields
  const [detectedForm, setDetectedForm] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    area: string;
    city: string;
    state: string;
    pincode: string;
    street: string;
    formattedAddress: string;
  }>({
    latitude: currentLocation.latitude || 28.6139,
    longitude: currentLocation.longitude || 77.209,
    accuracy: 10,
    area: currentLocation.area || 'Connaught Place',
    city: currentLocation.city || 'New Delhi',
    state: currentLocation.state || 'Delhi',
    pincode: currentLocation.pincode || '110001',
    street: currentLocation.street || '',
    formattedAddress: currentLocation.formattedAddress || '',
  });

  if (!isLocationModalOpen) return null;

  const currentCityData =
    availableCities.find(c => c.city === selectedCity) || availableCities[0];

  // Request real device GPS
  const handleRequestRealGps = () => {
    setGpsErrorMessage('');
    setErrorMessage('');

    if (!('geolocation' in navigator)) {
      setGpsStatus('error');
      setGpsErrorMessage(
        'Geolocation is not supported by your browser. Please enter your 6-digit PIN code manually below.'
      );
      return;
    }

    setGpsStatus('detecting');

    navigator.geolocation.getCurrentPosition(
      async position => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy || 15);

        try {
          // Real reverse geocoding
          const geoResult = await reverseGeocodeCoordinates(lat, lng);
          setDetectedForm({
            latitude: lat,
            longitude: lng,
            accuracy,
            area: geoResult.area,
            city: geoResult.city,
            state: geoResult.state,
            pincode: geoResult.pincode,
            street: geoResult.street,
            formattedAddress: geoResult.formattedAddress,
          });
          setGpsStatus('detected');
        } catch {
          // Coordinate-based closest fallback
          const closest = getClosestCity(lat, lng);
          setDetectedForm({
            latitude: lat,
            longitude: lng,
            accuracy,
            area: `${closest.city} Locality`,
            city: closest.city,
            state: closest.data.state,
            pincode: closest.data.defaultPin,
            street: `GPS: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
            formattedAddress: `${closest.city}, ${closest.data.state} - ${closest.data.defaultPin}`,
          });
          setGpsStatus('detected');
        }
      },
      error => {
        setGpsStatus('error');
        let msg = 'Unable to fetch your GPS coordinates.';
        if (error.code === 1) {
          msg =
            'GPS Permission Denied. Please enable device location permissions in your browser or enter your 6-digit PIN code manually.';
        } else if (error.code === 2) {
          msg = 'GPS satellite position unavailable. Please enter your PIN code manually below.';
        } else if (error.code === 3) {
          msg = 'Location request timed out. Please enter your PIN code manually below.';
        }
        setGpsErrorMessage(msg);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Save the detected/edited location
  const handleConfirmGpsLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detectedForm.pincode || !/^\d{6}$/.test(detectedForm.pincode.trim())) {
      setGpsErrorMessage('Please provide a valid 6-digit PIN Code.');
      return;
    }
    if (!detectedForm.city.trim() || !detectedForm.area.trim()) {
      setGpsErrorMessage('Please fill in both Area and City.');
      return;
    }

    setLocation({
      city: detectedForm.city.trim(),
      pincode: detectedForm.pincode.trim(),
      area: detectedForm.area.trim(),
      state: detectedForm.state.trim() || 'India',
      street: detectedForm.street.trim(),
      formattedAddress:
        detectedForm.formattedAddress ||
        `${detectedForm.street ? detectedForm.street + ', ' : ''}${detectedForm.area}, ${detectedForm.city} - ${detectedForm.pincode}`,
      latitude: detectedForm.latitude,
      longitude: detectedForm.longitude,
      accuracyMeters: detectedForm.accuracy,
      isGpsDetected: true,
    });

    setGpsStatus('idle');
    setIsLocationModalOpen(false);
  };

  const handleApplyCustomPincode = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPin = inputPincode.trim();
    if (!/^\d{6}$/.test(cleanPin)) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN Code.');
      return;
    }

    let matchedCity = 'Custom PIN Area';
    let matchedArea = `PIN ${cleanPin}`;
    let lat: number | undefined;
    let lng: number | undefined;

    for (const cityObj of availableCities) {
      const areaObj = cityObj.areas.find(a => a.pincode === cleanPin);
      if (areaObj) {
        matchedCity = cityObj.city;
        matchedArea = areaObj.name;
        break;
      }
    }

    // Try to resolve city coordinates if matched
    const closest = getClosestCity(28.6139, 77.209);
    for (const [cName, cData] of Object.entries(availableCities)) {
      if (cName.toLowerCase() === matchedCity.toLowerCase()) {
        lat = closest.data.lat;
        lng = closest.data.lng;
        break;
      }
    }

    setLocation({
      city: matchedCity,
      pincode: cleanPin,
      area: matchedArea,
      latitude: lat,
      longitude: lng,
      isGpsDetected: false,
    });
    setErrorMessage('');
    setInputPincode('');
    setIsLocationModalOpen(false);
  };

  const handleSelectArea = (city: string, areaName: string, pin: string) => {
    setLocation({
      city,
      pincode: pin,
      area: areaName,
      isGpsDetected: false,
    });
    setIsLocationModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in">
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-black text-white">Select Delivery Location</h3>
                {currentLocation.isGpsDetected && (
                  <span className="px-2 py-0.5 bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[10px] font-extrabold rounded-full flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    GPS Active
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-300">
                Calculates seller 10 KM delivery radius & PAN-India availability
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setGpsStatus('idle');
              setIsLocationModalOpen(false);
            }}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Current Selection Bar */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex items-center justify-between gap-3">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  Current Selected Location
                </div>
                <div className="text-xs font-black text-slate-900">
                  {currentLocation.area}, {currentLocation.city} ({currentLocation.pincode})
                </div>
                {currentLocation.latitude !== undefined && currentLocation.longitude !== undefined && (
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    Coordinates: {currentLocation.latitude.toFixed(4)}° N,{' '}
                    {currentLocation.longitude.toFixed(4)}° E
                    {currentLocation.isGpsDetected && ' • Verified via Device GPS'}
                  </div>
                )}
              </div>
            </div>
            {currentLocation.isGpsDetected ? (
              <span className="shrink-0 px-2 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 text-[10px] font-black rounded-lg">
                GPS Verified
              </span>
            ) : (
              <span className="shrink-0 px-2 py-1 bg-slate-200 text-slate-700 text-[10px] font-bold rounded-lg">
                Manual PIN
              </span>
            )}
          </div>

          {/* PRIMARY: Use My Current Location Trigger */}
          {gpsStatus !== 'detected' && (
            <div className="bg-gradient-to-br from-amber-50 to-amber-100/60 border border-amber-200 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
                    <Compass className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-slate-900">
                      Real-Time GPS Location
                    </h4>
                    <p className="text-[11px] text-slate-600">
                      Detects your exact coordinates & resolves address automatically
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRequestRealGps}
                disabled={gpsStatus === 'detecting'}
                className="w-full py-2.5 px-4 bg-slate-950 hover:bg-slate-900 text-white rounded-xl flex items-center justify-center gap-2 text-xs font-black transition-all shadow-md hover:shadow-lg disabled:opacity-75 cursor-pointer"
              >
                {gpsStatus === 'detecting' ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-amber-400" />
                    <span>Acquiring Satellite GPS & Address...</span>
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4 text-amber-400" />
                    <span>📍 Use My Current Location (Real GPS)</span>
                  </>
                )}
              </button>

              {gpsStatus === 'error' && (
                <div className="bg-rose-50 border border-rose-200 rounded-xl p-3 flex items-start gap-2.5 text-xs text-rose-800">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Location Permission Denied or Unavailable</p>
                    <p className="text-[11px] text-rose-700 mt-0.5">{gpsErrorMessage}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* DETECTED GPS REVIEW & EDIT FORM */}
          {gpsStatus === 'detected' && (
            <form
              onSubmit={handleConfirmGpsLocation}
              className="bg-emerald-50/60 border-2 border-emerald-500/80 rounded-2xl p-4 space-y-4 animate-in fade-in"
            >
              <div className="flex items-center justify-between pb-2 border-b border-emerald-200">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-black text-emerald-950">
                      GPS Location Detected Successfully
                    </h4>
                    <p className="text-[10px] text-emerald-700">
                      Review and edit your address details before confirming
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleRequestRealGps}
                  className="text-[11px] font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <RotateCw className="w-3 h-3" /> Re-scan
                </button>
              </div>

              {/* Coordinates Pill */}
              <div className="bg-white/80 p-2.5 rounded-xl border border-emerald-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">GPS Coordinates:</span>
                  <span className="font-mono font-bold text-emerald-900 bg-emerald-100 px-2 py-0.5 rounded-md text-[11px]">
                    {detectedForm.latitude.toFixed(5)}° N, {detectedForm.longitude.toFixed(5)}° E
                  </span>
                </div>
                <span className="text-[10px] font-semibold text-slate-500">
                  Accuracy: ±{detectedForm.accuracy}m
                </span>
              </div>

              {/* Editable Fields */}
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Local Area / Colony *
                    </label>
                    <input
                      type="text"
                      required
                      value={detectedForm.area}
                      onChange={e =>
                        setDetectedForm({ ...detectedForm, area: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={detectedForm.city}
                      onChange={e =>
                        setDetectedForm({ ...detectedForm, city: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      6-Digit Indian PIN Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={detectedForm.pincode}
                      onChange={e =>
                        setDetectedForm({
                          ...detectedForm,
                          pincode: e.target.value.replace(/\D/g, ''),
                        })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-black text-slate-900 tracking-wider focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      value={detectedForm.state}
                      onChange={e =>
                        setDetectedForm({ ...detectedForm, state: e.target.value })
                      }
                      className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-700 mb-1">
                    Street / Landmark / House No. (Optional)
                  </label>
                  <input
                    type="text"
                    value={detectedForm.street}
                    onChange={e =>
                      setDetectedForm({ ...detectedForm, street: e.target.value })
                    }
                    placeholder="e.g. Near Main Market, Flat No. 12"
                    className="w-full px-3 py-2 bg-white border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                  />
                </div>
              </div>

              {/* Serviceability note */}
              <div className="p-2.5 bg-white/90 rounded-xl border border-emerald-200 text-[11px] text-slate-700 space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-emerald-950">
                  <Truck className="w-3.5 h-3.5 text-emerald-700" />
                  Delivery Serviceability with GPS:
                </div>
                <ul className="list-disc list-inside text-[10px] text-slate-600 space-y-0.5 pl-1">
                  <li>
                    <strong>Non-GST local sellers:</strong> Automatically restricted to{' '}
                    <strong>10 KM radius</strong> from your GPS coordinates.
                  </li>
                  <li>
                    <strong>GST sellers & Kitchen Shakti:</strong> Available for{' '}
                    <strong>PAN-India delivery</strong> to your PIN code.
                  </li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl transition-all shadow-md cursor-pointer"
                >
                  Confirm & Save Delivery Location
                </button>
                <button
                  type="button"
                  onClick={() => setGpsStatus('idle')}
                  className="py-2.5 px-3 bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* MANUAL PIN CODE SECTION */}
          <div className="border-t border-slate-200 pt-4">
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-1.5">
              Enter 6-Digit Indian PIN Code Manually
            </label>
            <form onSubmit={handleApplyCustomPincode} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  maxLength={6}
                  value={inputPincode}
                  onChange={e => {
                    setInputPincode(e.target.value.replace(/\D/g, ''));
                    setErrorMessage('');
                  }}
                  placeholder="e.g. 110001, 400058, 302017"
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-sm font-bold text-slate-900 tracking-wider placeholder:text-slate-400 focus:outline-hidden focus:border-amber-500 focus:bg-white focus:ring-2 focus:ring-amber-100"
                />
              </div>
              <button
                type="submit"
                className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-xs shrink-0 cursor-pointer"
              >
                Apply PIN
              </button>
            </form>
            {errorMessage && (
              <p className="text-xs font-semibold text-rose-600 mt-1">{errorMessage}</p>
            )}
          </div>

          {/* City Selection Tabs */}
          <div>
            <label className="block text-xs font-bold uppercase text-slate-700 tracking-wider mb-2">
              Or Select Major City & Local Market
            </label>
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
              {availableCities.map(c => {
                const isSelected = selectedCity === c.city;
                return (
                  <button
                    key={c.city}
                    onClick={() => setSelectedCity(c.city)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {c.city}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Local Area List of selected city */}
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-2">
              Popular areas in <span className="font-bold text-slate-800">{selectedCity}</span>:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentCityData.areas.map(area => {
                const isCurrent =
                  currentLocation.pincode === area.pincode &&
                  currentLocation.city === currentCityData.city;
                return (
                  <button
                    key={area.pincode + area.name}
                    onClick={() =>
                      handleSelectArea(currentCityData.city, area.name, area.pincode)
                    }
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      isCurrent
                        ? 'border-amber-500 bg-amber-50/80 ring-1 ring-amber-500'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900">{area.name}</div>
                      <div className="text-[11px] font-semibold text-amber-700">
                        PIN: {area.pincode}
                      </div>
                    </div>
                    {isCurrent && <Check className="w-4 h-4 text-amber-600" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Informational Policy Banner */}
          <div className="text-[11px] text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              Harwalkart Delivery Radius & GST Policy:
            </div>
            <p>
              • <strong>Harwalkart Direct (Kitchen Shakti Range):</strong> 100% Pan-India serviceable across all PIN codes.
            </p>
            <p>
              • <strong>GST Registered Sellers:</strong> Can ship products Pan-India with valid tax invoices.
            </p>
            <p>
              • <strong>Non-GST Micro Sellers:</strong> Hyperlocal deliveries strictly limited to within 10 KM of their store location.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

