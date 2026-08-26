import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import { SellerType } from '../../types';
import {
  Store,
  User,
  Smartphone,
  Mail,
  Lock,
  MapPin,
  Building2,
  FileText,
  Upload,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  RotateCcw,
  AlertTriangle,
  Globe,
  Compass,
  FileCheck2,
  Check,
  Info,
} from 'lucide-react';

export const SellerRegister: React.FC = () => {
  const { initiateSellerRegister, verifySellerRegistrationOtp, navigate, showToast } = useApp();

  // Seller Type Selection: Option 1 (GST Registered) vs Option 2 (Without GST / Local)
  const [sellerType, setSellerType] = useState<SellerType>('gst');

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

  // Legal & Tax Details
  const [gstin, setGstin] = useState('');
  const [gstDocFileName, setGstDocFileName] = useState('GST_Registration_Certificate_REG06.pdf');
  const [panNumber, setPanNumber] = useState('');
  const [panDocFileName, setPanDocFileName] = useState('Proprietor_PAN_Card.pdf');
  const [kycDocType, setKycDocType] = useState<
    'GST Certificate' | 'PAN Card' | 'Aadhaar Card' | 'Shop Act License' | 'FSSAI Registration' | 'Bank Passbook' | 'Electricity Bill'
  >('GST Certificate');
  const [kycDocNumber, setKycDocNumber] = useState('');
  const [kycFileName, setKycFileName] = useState('Shop_Establishment_Certificate.pdf');

  // Step 2 OTP verification
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otpCode, setOtpCode] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Switch handler for seller type
  const handleSellerTypeChange = (type: SellerType) => {
    setSellerType(type);
    setErrorMessage(null);
    if (type === 'gst') {
      setKycDocType('GST Certificate');
      if (gstin) setKycDocNumber(gstin);
    } else {
      setKycDocType('Shop Act License');
      if (kycDocNumber.startsWith('07AA')) setKycDocNumber('SHOP/DL/2024/8892');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match. Please re-enter your password.');
      return;
    }

    if (!panNumber || panNumber.trim().length !== 10) {
      setErrorMessage('Please enter a valid 10-character PAN Card number (e.g. ABCDE1234F).');
      return;
    }

    if (sellerType === 'gst') {
      if (!gstin || gstin.trim().length !== 15) {
        setErrorMessage('Option 1 (GST Registered) requires a valid 15-character GSTIN number.');
        return;
      }
    }

    if (!kycDocNumber.trim()) {
      setErrorMessage(`Please provide your ${kycDocType} number for KYC verification.`);
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      const res = initiateSellerRegister({
        sellerType,
        ownerName,
        shopName,
        phone,
        email,
        password,
        street,
        city,
        pincode,
        businessInfo,
        isGstRegistered: sellerType === 'gst',
        gstin: sellerType === 'gst' ? gstin.trim().toUpperCase() : undefined,
        gstDocFileName: sellerType === 'gst' ? gstDocFileName : undefined,
        panNumber: panNumber.trim().toUpperCase(),
        panDocFileName,
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

  // Demo auto-fill for Option 1: GST Registered
  const handleFillGstDemo = () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    setSellerType('gst');
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
    setGstin(`07AAACP${randomId}R1Z5`);
    setGstDocFileName(`AgrawalMart_${randomId}_GST_Certificate.pdf`);
    setPanNumber(`AAACP${randomId}R`);
    setPanDocFileName(`MohanLal_PAN_${randomId}.pdf`);
    setKycDocType('GST Certificate');
    setKycDocNumber(`07AAACP${randomId}R1Z5`);
    setKycFileName(`AgrawalMart_${randomId}_GST_REG06.pdf`);
    setErrorMessage(null);
    showToast('Auto-filled OPTION 1: GST Registered Seller (PAN-India enabled)');
  };

  // Demo auto-fill for Option 2: Without GST / Local Seller
  const handleFillLocalDemo = () => {
    const randomId = Math.floor(100 + Math.random() * 900);
    setSellerType('local_without_gst');
    setOwnerName('Suresh Patel');
    setShopName(`Patel Fresh Provisions ${randomId}`);
    setPhone(`98300${randomId}2`);
    setEmail(`patel.provisions${randomId}@gmail.com`);
    setPassword('seller123');
    setConfirmPassword('seller123');
    setStreet('Booth 4, Sector 14 Market, Opp Community Hall');
    setCity('New Delhi');
    setPincode('110014');
    setBusinessInfo('Fresh daily dairy, local bread, confectionery, and grocery essentials for neighborhood residents.');
    setGstin('');
    setPanNumber(`BPPPT${randomId}K`);
    setPanDocFileName(`SureshPatel_PAN_${randomId}.pdf`);
    setKycDocType('Shop Act License');
    setKycDocNumber(`DL/SHOP/ACT/2024/${randomId}`);
    setKycFileName(`PatelProvisions_Gumasta_${randomId}.pdf`);
    setErrorMessage(null);
    showToast('Auto-filled OPTION 2: Without GST / Local Seller (10 KM Radius Locked)');
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl w-full space-y-6">
        {/* Header & Logo */}
        <div className="text-center space-y-2">
          <div className="inline-flex justify-center p-2 bg-white rounded-2xl shadow-xs border border-slate-200">
            <Logo size="md" />
          </div>
          <div className="inline-block px-3 py-1 bg-amber-500 text-slate-950 font-extrabold rounded-full text-xs tracking-wider uppercase shadow-xs">
            Merchant Onboarding Portal
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {step === 'form' ? 'Seller Registration & KYC Onboarding' : 'Verify Mobile Number with OTP'}
          </h2>
          <p className="text-sm text-slate-600 max-w-lg mx-auto">
            {step === 'form'
              ? 'Select your seller category below, submit required KYC compliance documents, and launch your store on Harwalkart.'
              : `Enter the 6-digit verification code sent to shop contact +91 ${phone}`}
          </p>
        </div>

        {/* Workflow Info Banner */}
        <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl flex items-start gap-3 text-xs text-amber-950 font-medium shadow-xs">
          <ShieldCheck className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span>KYC Compliance & Verification Workflow</span>
              <span className="px-2 py-0.5 bg-amber-200 text-amber-900 rounded text-[10px] uppercase font-black">
                Admin Approval Required
              </span>
            </div>
            <p className="text-slate-600 text-[11px] leading-relaxed">
              Every shop passes through: <strong>Registration → KYC Submission → Admin Review & Document Verification → Live Storefront</strong>.
              All documents are scrutinized by Harwalkart compliance before store activation.
            </p>
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200 space-y-6">
          {errorMessage && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded-xl flex items-start gap-2 animate-in fade-in">
              <span className="text-rose-500 font-bold shrink-0">⚠️</span>
              <span className="font-semibold">{errorMessage}</span>
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* STEP 1: CHOOSE SELLER TYPE (OPTION 1 vs OPTION 2) */}
              <div className="space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      1. Select Seller Option *
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-amber-800">Choose one option</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* OPTION 1: GST REGISTERED SELLER */}
                  <div
                    onClick={() => handleSellerTypeChange('gst')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      sellerType === 'gst'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 text-slate-800'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                            sellerType === 'gst'
                              ? 'bg-amber-400 text-slate-950 border-amber-400'
                              : 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          }`}
                        >
                          Option 1: Pan-India
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            sellerType === 'gst'
                              ? 'bg-amber-400 text-slate-950 border-amber-400'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {sellerType === 'gst' && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Globe className={`w-5 h-5 ${sellerType === 'gst' ? 'text-amber-400' : 'text-slate-600'}`} />
                        <h5 className="font-extrabold text-sm">GST Registered Seller</h5>
                      </div>

                      <p
                        className={`text-xs leading-relaxed ${
                          sellerType === 'gst' ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        Registered under GST Law with a valid 15-digit GSTIN. Allows <strong>PAN-India & wider national delivery</strong> across all postal codes.
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-700/30 text-[11px] font-medium space-y-1">
                      <div className="flex items-center gap-1.5">
                        <FileCheck2 className={`w-3.5 h-3.5 ${sellerType === 'gst' ? 'text-amber-400' : 'text-emerald-600'}`} />
                        <span>Requires GSTIN + GST Certificate + PAN</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className={`w-3.5 h-3.5 ${sellerType === 'gst' ? 'text-amber-400' : 'text-emerald-600'}`} />
                        <span>Eligible for Pan-India Delivery Logistics</span>
                      </div>
                    </div>
                  </div>

                  {/* OPTION 2: WITHOUT GST / LOCAL SELLER */}
                  <div
                    onClick={() => handleSellerTypeChange('local_without_gst')}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative flex flex-col justify-between ${
                      sellerType === 'local_without_gst'
                        ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                        : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 text-slate-800'
                    }`}
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span
                          className={`text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full border ${
                            sellerType === 'local_without_gst'
                              ? 'bg-amber-400 text-slate-950 border-amber-400'
                              : 'bg-amber-100 text-amber-900 border-amber-300'
                          }`}
                        >
                          Option 2: Fixed 10 KM
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            sellerType === 'local_without_gst'
                              ? 'bg-amber-400 text-slate-950 border-amber-400'
                              : 'border-slate-300 bg-white'
                          }`}
                        >
                          {sellerType === 'local_without_gst' && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <Compass className={`w-5 h-5 ${sellerType === 'local_without_gst' ? 'text-amber-400' : 'text-slate-600'}`} />
                        <h5 className="font-extrabold text-sm">Without GST / Local Seller</h5>
                      </div>

                      <p
                        className={`text-xs leading-relaxed ${
                          sellerType === 'local_without_gst' ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        Micro/unregistered local merchant. Sell <strong>ONLY within a fixed 10 KM radius</strong> from your registered shop address.
                      </p>
                    </div>

                    <div className="mt-3 pt-2.5 border-t border-slate-700/30 text-[11px] font-medium space-y-1">
                      <div className="flex items-center gap-1.5">
                        <FileCheck2 className={`w-3.5 h-3.5 ${sellerType === 'local_without_gst' ? 'text-amber-400' : 'text-amber-600'}`} />
                        <span>Requires PAN Card + Shop / Trade Document</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Lock className={`w-3.5 h-3.5 ${sellerType === 'local_without_gst' ? 'text-amber-400' : 'text-amber-600'}`} />
                        <span>Fixed 10 KM Radius (Platform Locked)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Option 2 Warning / Info notice */}
                {sellerType === 'local_without_gst' && (
                  <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-xl flex items-start gap-2.5 text-xs text-amber-900">
                    <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong>Platform Radius Restriction:</strong> Under ecommerce marketplace compliance, sellers without GST registration are restricted to a strictly fixed 10 KM hyperlocal delivery radius. You cannot expand beyond 10 KM, and customers located outside this 10 KM boundary cannot see your shop or order your items.
                    </div>
                  </div>
                )}
              </div>

              {/* STEP 2: OWNER & SHOP IDENTITY */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <User className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    2. Owner & Shop Identity
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Owner Full Name *
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
                      Official Business Email *
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

              {/* STEP 3: SHOP ADDRESS & LOCATION */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                  <MapPin className="w-4 h-4 text-amber-600" />
                  <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                    3. Shop Location & PIN Code
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
                    placeholder="Shop No., Market Name, Landmark"
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
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 font-mono"
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
                    placeholder="Describe what items your shop specializes in (e.g. Daily Groceries, Flours, Pulses, Dairy, Household Essentials)"
                    className="w-full px-3.5 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                  />
                </div>
              </div>

              {/* STEP 4: TAX, LEGAL & KYC DOCUMENTS */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-amber-600" />
                    <h4 className="text-xs font-black text-slate-900 uppercase tracking-wider">
                      4. KYC Documents & Verification ({sellerType === 'gst' ? 'GST Mode' : 'Local 10 KM Mode'})
                    </h4>
                  </div>
                  <span className="text-[11px] font-bold text-slate-500">
                    {sellerType === 'gst' ? 'GSTIN + PAN + KYC' : 'PAN + Local KYC'}
                  </span>
                </div>

                {/* PAN Number (Mandatory for both) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Proprietor / Entity PAN Card Number (10 Chars) *
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={panNumber}
                      onChange={e => setPanNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. ABCDE1234F"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 uppercase font-mono"
                    />
                    <span className="absolute right-3 top-2.5 text-[11px] font-bold text-slate-400">
                      Mandatory
                    </span>
                  </div>
                </div>

                {/* GSTIN (If Option 1) */}
                {sellerType === 'gst' && (
                  <div className="space-y-3 p-3.5 bg-slate-50 border border-slate-200 rounded-2xl">
                    <div>
                      <label className="block text-xs font-bold text-slate-800 uppercase tracking-wider mb-1">
                        GSTIN Number (15 Characters) *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={15}
                        value={gstin}
                        onChange={e => setGstin(e.target.value.toUpperCase())}
                        placeholder="e.g. 07AABCS1234D1Z2"
                        className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20 uppercase font-mono"
                      />
                    </div>

                    <div className="p-3 bg-white border border-dashed border-slate-300 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Upload className="w-4 h-4 text-amber-600" />
                        <div>
                          <span className="text-xs font-bold text-slate-900 block">GST Certificate (REG-06)</span>
                          <span className="text-[11px] text-slate-500 font-mono">{gstDocFileName}</span>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Attached (2.4 MB)
                      </span>
                    </div>
                  </div>
                )}

                {/* Additional / Primary KYC Document Selector */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      {sellerType === 'gst' ? 'Additional Identity Document' : 'Primary Business / Local KYC Doc *'}
                    </label>
                    <select
                      value={kycDocType}
                      onChange={e => setKycDocType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                    >
                      {sellerType === 'gst' && <option value="GST Certificate">GST Certificate (REG-06)</option>}
                      <option value="Shop Act License">Shop Act / Gumasta License</option>
                      <option value="FSSAI Registration">FSSAI Food License / Registration</option>
                      <option value="Aadhaar Card">Proprietor Aadhaar Card</option>
                      <option value="PAN Card">PAN Card Certificate</option>
                      <option value="Bank Passbook">Cancelled Cheque / Bank Passbook</option>
                      <option value="Electricity Bill">Commercial Electricity Bill</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Document Registration / ID Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={kycDocNumber}
                      onChange={e => setKycDocNumber(e.target.value)}
                      placeholder="e.g. DL/SHOP/2024/9912"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-2 focus:ring-amber-400/20"
                    />
                  </div>
                </div>

                {/* Uploaded File Simulation */}
                <div className="p-3.5 border-2 border-dashed border-slate-200 rounded-2xl text-center space-y-1.5 bg-slate-50/50">
                  <Upload className="w-5 h-5 text-amber-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-800">
                    KYC Upload Package: <span className="text-amber-900">{kycFileName}</span> + <span className="text-amber-900">{panDocFileName}</span>
                  </p>
                  <p className="text-[10px] text-slate-500">
                    Supports PDF, JPG, PNG up to 10 MB (Sample documents pre-attached for testing)
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-3">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleFillGstDemo}
                    className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200"
                    title="Auto-fill Option 1: GST Registered"
                  >
                    ⚡ Demo Option 1 (GST)
                  </button>
                  <button
                    type="button"
                    onClick={handleFillLocalDemo}
                    className="px-3.5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-950 text-xs font-bold rounded-xl transition-all cursor-pointer border border-amber-200"
                    title="Auto-fill Option 2: Without GST / Local"
                  >
                    ⚡ Demo Option 2 (Local 10 KM)
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-amber-400 font-bold text-sm rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="inline-block w-5 h-5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>Submit KYC & Send Verification OTP</span>
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
                  className="w-full py-3.5 px-4 text-center tracking-[0.5em] text-2xl font-black bg-slate-50 border border-slate-300 rounded-xl focus:bg-white focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-400/20 font-mono"
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
                    <span>Verify OTP & Submit to Admin for Approval</span>
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
