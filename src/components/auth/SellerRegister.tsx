import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { Store, User, Smartphone, Mail, Lock, MapPin, Building2, FileText, Upload, ArrowRight, ShieldCheck, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

export const SellerRegister: React.FC = () => {
  const { initiateSellerRegister, verifySellerRegistrationOtp, navigate, showToast } = useApp();

  // Form Fields
  const [ownerName, setOwnerName] = useState('');
  const [shopName, setShopName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110001');
  const [businessInfo, setBusinessInfo] = useState('');
  const [isGstRegistered, setIsGstRegistered] = useState(true);
  const [gstin, setGstin] = useState('');
  const [panNumber, setPanNumber] = useState('');
  const [kycDocType, setKycDocType] = useState<'Aadhaar Card' | 'PAN Card' | 'GST Certificate' | 'Shop Act License' | 'FSSAI Registration'>('GST Certificate');
  const [kycDocNumber, setKycDocNumber] = useState('');
  const [kycFileName, setKycFileName] = useState('Shop_GST_Registration_Certificate.pdf');

  // Step 2 OTP verification
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpCode, setOtpCode] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = initiateSellerRegister({
        ownerName,
        shopName,
        phone,
        email,
        password,
        street,
        city,
        pincode,
        businessInfo,
        isGstRegistered,
        gstin,
        panNumber,
        kycDocType,
        kycDocNumber,
        kycFileName,
      });
      setIsLoading(false);
      if (res.success) {
        setStep('otp');
        setOtpCode('123456');
      } else {
        setErrorMessage(res.error || 'Registration failed. Please check your details.');
      }
    }, 400);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = verifySellerRegistrationOtp(otpCode);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'Invalid OTP code. Please enter 123456.');
      }
    }, 400);
  };

  const handleFillDemoForm = () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    setOwnerName('Mohan Lal Agrawal');
    setShopName(`Agrawal Super Mart ${randomId}`);
    setPhone(`98200${randomId}1`);
    setEmail(`agrawal.mart${randomId}@gmail.com`);
    setPassword('seller123');
    setConfirmPassword('seller123');
    setStreet('Shop No. 15, Near Central Circle, Chandni Chowk');
    setCity('New Delhi');
    setPincode('110006');
    setBusinessInfo('Retail grocery, whole spices, dry fruits, and household cleaning supplies.');
    setIsGstRegistered(true);
    setGstin(`07AAACP${randomId}R1Z5`);
    setPanNumber(`AAACP${randomId}R`);
    setKycDocType('GST Certificate');
    setKycDocNumber(`07AAACP${randomId}R1Z5`);
    setKycFileName(`AgrawalMart_${randomId}_GST_Doc.pdf`);
    setErrorMessage(null);
    showToast('Auto-filled complete demo shop registration data!');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header & Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center p-2 bg-white rounded-2xl shadow-sm border border-slate-200">
            <Logo size="md" />
          </div>
          <div className="inline-block px-3 py-1 bg-amber-500 text-slate-950 font-extrabold rounded-full text-xs tracking-wider uppercase shadow-sm">
            Merchant Onboarding
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {step === 'form' ? 'Register Your Local Shop on HARWALKART' : 'Verify Mobile Number with OTP'}
          </h2>
          <p className="text-sm text-slate-600 max-w-md mx-auto">
            {step === 'form'
              ? 'Reach thousands of nearby local customers in your PIN code. Account remains PENDING until Admin verifies KYC.'
              : `Enter the 6-digit OTP code sent to shop contact +91 ${phone}`}
          </p>
        </div>

        {/* Notice Banner */}
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-xs text-amber-950 font-medium shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div>
            <strong>Important Policy:</strong> In compliance with Harwalkart quality standards, all new seller registrations require Admin approval. You can set up your inventory immediately, and your shop will go live upon document verification.
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80 space-y-6">
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
              <span className="text-rose-500 font-bold shrink-0">⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={handleFormSubmit} className="space-y-5">
              {/* Section 1: Owner & Shop Details */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    1. Owner & Shop Identity
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Owner Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={ownerName}
                      onChange={e => setOwnerName(e.target.value)}
                      placeholder="e.g. Ramesh Sharma"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Shop / Business Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={shopName}
                      onChange={e => setShopName(e.target.value)}
                      placeholder="e.g. Sharma Kirana & General Store"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Mobile Number (10 Digits) *
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      value={phone}
                      onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 9811223344"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Shop Official Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="e.g. sharmakirana@gmail.com"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      placeholder="Min 6 characters"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Confirm Password *
                    </label>
                    <input
                      type="password"
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={e => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Shop Location & Address */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <MapPin className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    2. Shop Location & PIN Code
                  </h4>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Shop Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={street}
                    onChange={e => setStreet(e.target.value)}
                    placeholder="Shop No., Market Name, Street Landmark"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="e.g. New Delhi, Mumbai, Jaipur"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Shop Area PIN Code (6 Digits) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={pincode}
                      onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 110001"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Business Information & Product Categories *
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={businessInfo}
                    onChange={e => setBusinessInfo(e.target.value)}
                    placeholder="Briefly describe what items your shop sells (e.g. Daily Groceries, Flours, Pulses, Dairy, Utensils)"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>
              </div>

              {/* Section 3: GST & KYC Documents */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <FileText className="w-4 h-4 text-amber-500" />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    3. Legal, GSTIN & KYC Verification
                  </h4>
                </div>

                {/* GST Toggle */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-800">Is your business GST Registered?</span>
                    <p className="text-[11px] text-slate-500">Unregistered local micro-traders can submit PAN or Shop Gumasta.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsGstRegistered(!isGstRegistered)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      isGstRegistered ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {isGstRegistered ? 'YES (GSTIN)' : 'NO (Exempt/Micro)'}
                  </button>
                </div>

                {isGstRegistered ? (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      GSTIN Number (15 Digits) *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={15}
                      value={gstin}
                      onChange={e => setGstin(e.target.value.toUpperCase())}
                      placeholder="e.g. 07AABCS1234D1Z2"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 uppercase"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Business Owner PAN Number *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={panNumber}
                      onChange={e => setPanNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. ABCDE1234F"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 uppercase"
                    />
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      KYC Document Type *
                    </label>
                    <select
                      value={kycDocType}
                      onChange={e => setKycDocType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                    >
                      <option value="GST Certificate">GST Certificate</option>
                      <option value="Shop Act License">Shop Act / Gumasta License</option>
                      <option value="FSSAI Registration">FSSAI Food License</option>
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="PAN Card">PAN Card</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Document / Certificate Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={kycDocNumber}
                      onChange={e => setKycDocNumber(e.target.value)}
                      placeholder="Enter registration/ID number"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>
                </div>

                {/* Simulated File Upload */}
                <div className="p-3.5 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-1.5 bg-slate-50/50">
                  <Upload className="w-5 h-5 text-amber-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-800">
                    Uploaded Document: <span className="text-amber-800">{kycFileName}</span>
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Supports PDF, JPG, PNG up to 10 MB (Sample file pre-attached for testing)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleFillDemoForm}
                  className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer"
                >
                  ⚡ Auto-Fill Demo Shop
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-amber-400 font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="inline-block w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit & Send Verification OTP</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Step 2: OTP Verification */
            <form onSubmit={handleVerifyOtp} className="space-y-5 animate-in fade-in">
              <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl text-center space-y-2">
                <p className="text-xs text-amber-900 font-semibold">
                  A 6-digit OTP code has been dispatched to shop mobile: <strong>+91 {phone}</strong>
                </p>
                <div className="inline-block px-3 py-1 bg-amber-200 text-amber-950 text-xs font-extrabold rounded-lg tracking-wider">
                  Demo OTP: 123456
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 text-center">
                  Enter 6-Digit Seller OTP
                </label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={e => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full py-3.5 px-4 text-center tracking-[0.5em] text-2xl font-black bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500">
                <button
                  type="button"
                  onClick={() => setStep('form')}
                  className="text-slate-600 hover:text-slate-900 font-semibold underline cursor-pointer"
                >
                  ← Edit Shop Details
                </button>
                <button
                  type="button"
                  onClick={() => {
                    showToast(`Resent OTP: 123456 to +91 ${phone}`);
                    setOtpCode('123456');
                  }}
                  className="text-amber-800 font-bold hover:underline cursor-pointer flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" /> Resend OTP
                </button>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span className="inline-block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Verify OTP & Create Pending Seller Account</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Login Link */}
          <div className="text-center pt-3 border-t border-slate-100 text-xs text-slate-600">
            Already registered your shop?{' '}
            <button
              onClick={() => navigate('/seller/login')}
              className="text-amber-800 hover:text-amber-950 font-bold hover:underline ml-1 cursor-pointer"
            >
              Sign In to Seller Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
