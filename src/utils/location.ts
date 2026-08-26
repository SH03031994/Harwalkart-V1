import { LocationState, Seller, Product } from '../types';

/**
 * Calculates straight-line (Haversine) distance between two GPS coordinates in kilometers.
 */
export function calculateDistanceKm(
  lat1?: number,
  lon1?: number,
  lat2?: number,
  lon2?: number
): number {
  if (
    lat1 === undefined ||
    lon1 === undefined ||
    lat2 === undefined ||
    lon2 === undefined ||
    isNaN(lat1) ||
    isNaN(lon1) ||
    isNaN(lat2) ||
    isNaN(lon2)
  ) {
    return 1.5; // default fallback nominal distance
  }

  const R = 6371; // Radius of Earth in kilometers
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return Math.round(dist * 10) / 10;
}

/**
 * Reference coordinates for key Indian major postal clusters / cities
 * Used for fallback distance mapping or PIN code coordinate resolution.
 */
export const INDIAN_CITY_COORDINATES: Record<
  string,
  { lat: number; lng: number; state: string; defaultPin: string }
> = {
  'New Delhi': { lat: 28.6139, lng: 77.209, state: 'Delhi', defaultPin: '110001' },
  'Delhi': { lat: 28.6139, lng: 77.209, state: 'Delhi', defaultPin: '110001' },
  'Mumbai': { lat: 19.076, lng: 72.8777, state: 'Maharashtra', defaultPin: '400001' },
  'Jaipur': { lat: 26.9124, lng: 75.7873, state: 'Rajasthan', defaultPin: '302001' },
  'Lucknow': { lat: 26.8467, lng: 80.9462, state: 'Uttar Pradesh', defaultPin: '226001' },
  'Indore': { lat: 22.7196, lng: 75.8577, state: 'Madhya Pradesh', defaultPin: '452001' },
  'Bengaluru': { lat: 12.9716, lng: 77.5946, state: 'Karnataka', defaultPin: '560001' },
  'Bangalore': { lat: 12.9716, lng: 77.5946, state: 'Karnataka', defaultPin: '560001' },
  'Hyderabad': { lat: 17.385, lng: 78.4867, state: 'Telangana', defaultPin: '500001' },
  'Chennai': { lat: 13.0827, lng: 80.2707, state: 'Tamil Nadu', defaultPin: '600001' },
  'Kolkata': { lat: 22.5726, lng: 88.3639, state: 'West Bengal', defaultPin: '700001' },
  'Pune': { lat: 18.5204, lng: 73.8567, state: 'Maharashtra', defaultPin: '411001' },
  'Ahmedabad': { lat: 23.0225, lng: 72.5714, state: 'Gujarat', defaultPin: '380001' },
  'Chandigarh': { lat: 30.7333, lng: 76.7794, state: 'Punjab', defaultPin: '160017' },
};

/**
 * Find the closest known Indian city for given coordinates
 */
export function getClosestCity(lat: number, lng: number) {
  let closestCity = 'New Delhi';
  let minDistance = Infinity;

  for (const [cityName, data] of Object.entries(INDIAN_CITY_COORDINATES)) {
    const dist = calculateDistanceKm(lat, lng, data.lat, data.lng);
    if (dist < minDistance) {
      minDistance = dist;
      closestCity = cityName;
    }
  }

  return {
    city: closestCity,
    data: INDIAN_CITY_COORDINATES[closestCity],
    distanceKm: minDistance,
  };
}

/**
 * Reverse Geocodes real GPS coordinates to a formatted address, locality, city, state, and 6-digit Indian PIN code.
 */
export async function reverseGeocodeCoordinates(
  latitude: number,
  longitude: number
): Promise<{
  area: string;
  city: string;
  state: string;
  pincode: string;
  street: string;
  formattedAddress: string;
}> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    // Call OpenStreetMap Nominatim reverse geocode service
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`,
      {
        signal: controller.signal,
        headers: {
          'Accept-Language': 'en-IN,en;q=0.9,hi;q=0.8',
        },
      }
    );
    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      if (data && data.address) {
        const addr = data.address;

        // Extract clean PIN code (6-digit Indian Postal PIN)
        let pincode = '';
        if (addr.postcode) {
          const match = addr.postcode.match(/\b\d{6}\b/);
          if (match) {
            pincode = match[0];
          } else {
            pincode = addr.postcode.replace(/\D/g, '').slice(0, 6);
          }
        }

        // Extract clean city / district
        const city =
          addr.city ||
          addr.town ||
          addr.city_district ||
          addr.district ||
          addr.municipality ||
          addr.county ||
          addr.state_district ||
          'New Delhi';

        // Extract clean area / locality
        const area =
          addr.suburb ||
          addr.neighbourhood ||
          addr.residential ||
          addr.quarter ||
          addr.village ||
          addr.commercial ||
          addr.road ||
          city;

        // Extract clean state
        const state = addr.state || 'Delhi';

        // Extract street / landmark
        const street =
          addr.road ||
          addr.building ||
          addr.house_number ||
          addr.amenity ||
          `${area}, ${city}`;

        // Fallback PIN if missing from OSM
        if (!pincode || pincode.length !== 6) {
          const closest = getClosestCity(latitude, longitude);
          pincode = closest.data.defaultPin;
        }

        const formattedAddress =
          data.display_name || `${street}, ${area}, ${city}, ${state} - ${pincode}`;

        return {
          area,
          city,
          state,
          pincode,
          street,
          formattedAddress,
        };
      }
    }
  } catch (err) {
    console.warn('Reverse geocoding network error / timeout, using coordinate matching fallback:', err);
  }

  // Fallback if network fails or API is blocked: Match to closest major city
  const closest = getClosestCity(latitude, longitude);
  return {
    area: `${closest.city} Central`,
    city: closest.city,
    state: closest.data.state,
    pincode: closest.data.defaultPin,
    street: `GPS Location (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`,
    formattedAddress: `${closest.city} Area, ${closest.data.state} - ${closest.data.defaultPin}`,
  };
}

export interface SellerServiceabilityResult {
  isServiceable: boolean;
  distanceKm: number;
  isPanIndia: boolean;
  isGstRegistered: boolean;
  isHarwalkartDirect: boolean;
  serviceRadiusKm: number;
  reason: string;
}

/**
 * Calculates delivery serviceability for a seller based on real GPS coordinates,
 * GST status, and Harwalkart Direct rules.
 *
 * Rules:
 * 1. Harwalkart Official Direct -> PAN-India available.
 * 2. GST Registered Sellers -> PAN-India available.
 * 3. Non-GST Local Sellers -> Strictly limited to 10 KM radius.
 */
export function checkSellerServiceability(
  seller: Seller,
  customerLoc: LocationState
): SellerServiceabilityResult {
  // 1. Harwalkart Official Direct is ALWAYS Pan-India
  if (seller.isHarwalkartDirect) {
    const dist = calculateDistanceKm(
      customerLoc.latitude,
      customerLoc.longitude,
      seller.latitude || 28.6139,
      seller.longitude || 77.209
    );
    return {
      isServiceable: true,
      distanceKm: dist,
      isPanIndia: true,
      isGstRegistered: true,
      isHarwalkartDirect: true,
      serviceRadiusKm: 5000,
      reason: 'Harwalkart Direct Central Fulfillment (Pan-India Fast Delivery)',
    };
  }

  // 2. GST Registered Sellers can deliver PAN-India
  if (seller.isGstRegistered) {
    const dist = calculateDistanceKm(
      customerLoc.latitude,
      customerLoc.longitude,
      seller.latitude,
      seller.longitude
    );
    return {
      isServiceable: true,
      distanceKm: dist,
      isPanIndia: true,
      isGstRegistered: true,
      isHarwalkartDirect: false,
      serviceRadiusKm: seller.serviceRadiusKm || 5000,
      reason: `GST Registered Seller (${seller.gstin || 'Tax Invoicing'}) - Serves Pan-India`,
    };
  }

  // 3. Non-GST Local Sellers: Limited to max 10 KM delivery radius
  const maxRadiusKm = Math.min(seller.serviceRadiusKm || 10, 10);

  // If both customer & seller have coordinates, use precise distance
  if (
    customerLoc.latitude !== undefined &&
    customerLoc.longitude !== undefined &&
    seller.latitude !== undefined &&
    seller.longitude !== undefined
  ) {
    const dist = calculateDistanceKm(
      customerLoc.latitude,
      customerLoc.longitude,
      seller.latitude,
      seller.longitude
    );

    const isServiceable = dist <= maxRadiusKm;
    return {
      isServiceable,
      distanceKm: dist,
      isPanIndia: false,
      isGstRegistered: false,
      isHarwalkartDirect: false,
      serviceRadiusKm: maxRadiusKm,
      reason: isServiceable
        ? `Within ${dist} km (Max 10 KM Local Service Radius)`
        : `Seller is ${dist} km away (Exceeds 10 KM limit for Non-GST Local Seller)`,
    };
  }

  // If coordinates are not available, check PIN code serviceability
  const isServiceableByPin =
    seller.serviceablePincodes.includes('*') ||
    seller.serviceablePincodes.includes(customerLoc.pincode) ||
    seller.address.pincode === customerLoc.pincode ||
    seller.address.city.toLowerCase() === customerLoc.city.toLowerCase();

  return {
    isServiceable: isServiceableByPin,
    distanceKm: isServiceableByPin ? 3.5 : 25.0,
    isPanIndia: false,
    isGstRegistered: false,
    isHarwalkartDirect: false,
    serviceRadiusKm: maxRadiusKm,
    reason: isServiceableByPin
      ? `Local shop serving PIN ${customerLoc.pincode} (Under 10 KM)`
      : `Outside 10 KM delivery zone for PIN ${customerLoc.pincode}`,
  };
}

/**
 * Checks if a product is serviceable to the customer.
 */
export function checkProductServiceability(
  product: Product,
  seller: Seller | undefined,
  customerLoc: LocationState
): boolean {
  if (!product.approved) return false;

  // Harwalkart Official Direct products are always available PAN-India
  if (product.isHarwalkartDirect) {
    return true;
  }

  if (!seller) {
    // If seller not found, check product's own serviceable pincodes
    return (
      product.serviceablePincodes.includes('*') ||
      product.serviceablePincodes.includes(customerLoc.pincode)
    );
  }

  // GST Sellers & Harwalkart Direct are PAN-India
  if (seller.isHarwalkartDirect || seller.isGstRegistered) {
    return true;
  }

  // Non-GST seller: check 10 KM radius
  const sellerCheck = checkSellerServiceability(seller, customerLoc);
  if (!sellerCheck.isServiceable) {
    return false;
  }

  return true;
}
