import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Logo } from '../common/Logo';
import {
  Bike,
  ShieldCheck,
  Phone,
  Mail,
  User,
  MapPin,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Zap,
  RotateCcw,
  Sparkles,
  Wallet,
  Clock,
  Car,
  FileText,
  BadgeCheck,
} from 'lucide-react';

const CITIES = [
  'New Delhi',
  'Mumbai',
  'Pune',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Surat',
  'Chandigarh',
  'Indore',
  'Bhopal',
  'Nagpur',
  'Patna',
];

export const DeliveryPartnerRegister: React.FC = () => {
  const { initiateDeliveryPartnerRegister, verifyDeliveryPartnerRegistrationOtp, navigate } = useApp();

  // Form Fields
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('New Delhi');
  const [pincode, setPincode] = useState('110001');
  const [vehicleType, setVehicleType] = useState<'Bike' | 'Scooter' | 'Electric EV' | 'Van'>('Bike');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [upiId, setUpiId] = useState('');
  const [bankAccountNumber, setBankAccountNumber] = useState('');
  const [ifscCode, setIfscCode] = useState('HDFC0001234');
  const [bankName, setBankName] = useState('HDFC Bank Ltd');
  const [agreedToTerms, setAgreedToTerms] = useState(true);

  // OTP Step State
  const [step, setStep] = useState<'form' | 'otp'>('form');
  const [otp, setOtp] = useState('123456');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Auto-fill sample rider for quick test
  const handleAutofillDemo = () => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    setName('Amit Sharma');
    setPhone(`98112${randomSuffix}`);
    setEmail(`amit.sharma${randomSuffix}@gmail.com`);
    setCity('New Delhi');
    setPincode('110001');
    setVehicleType('Electric EV');
    setVehicleNumber(`DL-01-EV-${randomSuffix}`);
    setLicenseNumber(`DL-14201100${randomSuffix}`);
    setEmergencyContact('9876543210');
    setUpiId(`amit.sharma${randomSuffix}@okaxis`);
    setBankAccountNumber(`5010023456${randomSuffix}`);
    setIfscCode('HDFC0001234');
    setBankName('HDFC Bank Ltd');
    setErrorMessage(null);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!agreedToTerms) {
      setErrorMessage('Please accept the Delivery Fleet Terms and verification requirements.');
      return;
    }

    if (phone.trim().length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    if (pincode.trim().length !== 6) {
      setErrorMessage('Please enter a valid 6-digit Indian PIN code.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = initiateDeliveryPartnerRegister({
        name,
        phone,
        email,
        city,
        pincode,
        vehicleType,
        vehicleNumber,
        licenseNumber,
        emergencyContact,
        upiId: upiId.trim() || `${phone.trim()}@upi`,
        bankDetails: {
          accountHolderName: name.trim(),
          accountNumber: bankAccountNumber.trim() || `XXXXXX${phone.slice(-4)}`,
          ifscCode: ifscCode.trim().toUpperCase() || 'HDFC0001234',
          bankName: bankName.trim() || 'HDFC Bank Ltd',
        },
      });

      setIsLoading(false);

      if (res.success) {
        setOtp('123456');
        setStep('otp');
      } else {
        setErrorMessage(res.error || 'Failed to initiate registration.');
      }
    }, 300);
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsLoading(true);

    setTimeout(() => {
      const res = verifyDeliveryPartnerRegistrationOtp(otp);
      setIsLoading(false);
      if (!res.success) {
        setErrorMessage(res.error || 'OTP verification failed.');
      }
    }, 350);
  };

  return (
    <div className="min-h-[90vh] py-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-emerald-50/50 via-slate-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex flex-col justify-center items-center">
      <div className="max-w-2xl w-full space-y-6">
        {/* Header Branding */}
        <div className="text-center space-y-2.5">
          <div className="inline-flex justify-center p-2.5 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
            <Logo size="md" />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-600 text-white font-black rounded-full text-xs tracking-wider uppercase shadow-xs">
            <Bike className="w-3.5 h-3.5" />
            <span>Hyperlocal Delivery Fleet</span>
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Delivery Partner Registration
          </h1>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-lg mx-auto">
            Join Harwalkart's rapid grocery and brand delivery network. Earn ₹25,000 - ₹45,000 monthly with flexible hours and instant daily payouts.
          </p>
        </div>

        {/* Benefits Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 bg-white dark:bg-slate-800/90 rounded-2xl border border-emerald-100 dark:border-slate-700 shadow-xs text-center">
            <Wallet className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
            <div className="text-xs font-black text-slate-900 dark:text-white">Daily UPI Payouts</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Zero commission cut</div>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800/90 rounded-2xl border border-emerald-100 dark:border-slate-700 shadow-xs text-center">
            <Clock className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mx-auto mb-1" />
            <div className="text-xs font-black text-slate-900 dark:text-white">Flexible Shifts</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Part-time or Full-time</div>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800/90 rounded-2xl border border-emerald-100 dark:border-slate-700 shadow-xs text-center">
            <Sparkles className="w-5 h-5 text-amber-500 mx-auto mb-1" />
            <div className="text-xs font-black text-slate-900 dark:text-white">₹150 Joining Bonus</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">Credited instantly</div>
          </div>
          <div className="p-3 bg-white dark:bg-slate-800/90 rounded-2xl border border-emerald-100 dark:border-slate-700 shadow-xs text-center">
            <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400 mx-auto mb-1" />
            <div className="text-xs font-black text-slate-900 dark:text-white">Medical Cover</div>
            <div className="text-[10px] text-slate-500 dark:text-slate-400">₹2 Lakhs transit insurance</div>
          </div>
        </div>

        {/* Main Card Container */}
        <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80 dark:border-slate-800 space-y-6">
          {errorMessage && (
            <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-rose-800 dark:text-rose-300 text-xs rounded-2xl flex items-start gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
              <span className="leading-relaxed font-medium">{errorMessage}</span>
            </div>
          )}

          {step === 'form' ? (
            <form onSubmit={handleFormSubmit} className="space-y-6">
              {/* Demo quick fill button */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Rider Onboarding Application
                </span>
                <button
                  type="button"
                  onClick={handleAutofillDemo}
                  className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Autofill Sample Rider</span>
                </button>
              </div>

              {/* Section 1: Personal Details */}
              <div className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <User className="w-4 h-4" />
                  <span>1. Personal & Contact Information</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Full Legal Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="e.g. Amit Kumar"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Mobile Number (for OTP & Dispatches) *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Phone className="w-4 h-4" />
                      </div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={e => setPhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="10-digit mobile (e.g. 9811223344)"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Address *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="rider@example.com"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Operational City *
                    </label>
                    <select
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
                    >
                      {CITIES.map(c => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Local Operating PIN Code *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <MapPin className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        maxLength={6}
                        value={pincode}
                        onChange={e => setPincode(e.target.value.replace(/\D/g, ''))}
                        placeholder="6-digit PIN"
                        className="w-full pl-10 pr-3 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 2: Vehicle & Driving License */}
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <Bike className="w-4 h-4" />
                  <span>2. Vehicle & License Credentials</span>
                </h3>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                    Vehicle Type *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {(['Bike', 'Scooter', 'Electric EV', 'Van'] as const).map(type => {
                      const isSelected = vehicleType === type;
                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setVehicleType(type)}
                          className={`p-3 rounded-2xl border text-center transition-all cursor-pointer flex flex-col items-center gap-1.5 ${
                            isSelected
                              ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500 dark:border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                              : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                          }`}
                        >
                          {type === 'Bike' && <Bike className="w-5 h-5 text-emerald-600" />}
                          {type === 'Scooter' && <Bike className="w-5 h-5 text-blue-600" />}
                          {type === 'Electric EV' && <Zap className="w-5 h-5 text-amber-500" />}
                          {type === 'Van' && <Car className="w-5 h-5 text-purple-600" />}
                          <span className="text-xs font-bold">{type}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Vehicle Plate Registration Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={vehicleNumber}
                      onChange={e => setVehicleNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. DL-01-AB-1234 or MH-12-DE-9876"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-white uppercase focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Driving License Number *
                    </label>
                    <input
                      type="text"
                      required
                      value={licenseNumber}
                      onChange={e => setLicenseNumber(e.target.value.toUpperCase())}
                      placeholder="e.g. DL-1420110012345"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono font-bold text-slate-900 dark:text-white uppercase focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                    Emergency Contact Number (Family / Guardian)
                  </label>
                  <input
                    type="tel"
                    maxLength={10}
                    value={emergencyContact}
                    onChange={e => setEmergencyContact(e.target.value.replace(/\D/g, ''))}
                    placeholder="10-digit mobile number for emergency support"
                    className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Section 3: Payout & Bank Details */}
              <div className="space-y-4 pt-2 border-t border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-black uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4" />
                  <span>3. Instant Payout Preferences (UPI / Bank)</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Direct UPI VPA (for Instant Withdrawals)
                    </label>
                    <input
                      type="text"
                      value={upiId}
                      onChange={e => setUpiId(e.target.value)}
                      placeholder="e.g. 9811223344@upi or amit@okhdfcbank"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-[10px] text-slate-500 mt-1">If empty, defaults to your mobile @upi.</p>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                      Bank Account Number (Optional fallback)
                    </label>
                    <input
                      type="text"
                      value={bankAccountNumber}
                      onChange={e => setBankAccountNumber(e.target.value)}
                      placeholder="e.g. 501004567890"
                      className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-mono text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>

              {/* Agreement Checkbox */}
              <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={e => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <span className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    I confirm that I am at least 18 years of age, hold a valid government-issued Driving License, possess an active smartphone with GPS, and agree to Harwalkart’s Rider Safety Code & Delivery Partner Terms.
                  </span>
                </label>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Generating Mobile Verification OTP...</span>
                ) : (
                  <>
                    <span>Submit Application & Verify Mobile</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* OTP Verification Step */
            <div className="space-y-6">
              <div className="text-center space-y-2">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-400 rounded-2xl mx-auto flex items-center justify-center">
                  <BadgeCheck className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  Verify Mobile Number
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  A 6-digit verification code has been dispatched to{' '}
                  <strong className="text-slate-900 dark:text-white">+91 {phone}</strong>.
                </p>
              </div>

              {/* Demo Notice Banner */}
              <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-2xl flex items-center justify-between text-xs text-amber-800 dark:text-amber-300">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>
                    Demo OTP is: <strong className="text-amber-900 dark:text-amber-100 font-mono text-sm">123456</strong>
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setOtp('123456')}
                  className="px-2 py-1 bg-amber-200/80 hover:bg-amber-200 dark:bg-amber-900/60 dark:hover:bg-amber-800 text-amber-900 dark:text-amber-100 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                >
                  Insert OTP
                </button>
              </div>

              <form onSubmit={handleOtpVerify} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 text-center mb-2">
                    Enter 6-Digit OTP Code
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-full text-center text-2xl tracking-[0.4em] font-mono font-black py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-400/20"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.length < 6}
                  className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm rounded-2xl shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isLoading ? (
                    <span>Activating Delivery Partner Account...</span>
                  ) : (
                    <>
                      <span>Complete Registration & Claim ₹150 Bonus</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setStep('form')}
                    className="text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 font-semibold cursor-pointer"
                  >
                    ← Edit Details
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtp('123456');
                    }}
                    className="text-emerald-600 hover:text-emerald-500 font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Resend Code</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Already registered switch */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Already registered as a delivery partner?{' '}
              <button
                type="button"
                onClick={() => navigate('/delivery/login')}
                className="font-bold text-emerald-600 hover:text-emerald-500 hover:underline cursor-pointer"
              >
                Sign In to Fleet Panel →
              </button>
            </p>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="text-xs font-bold text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            ← Return to Harwalkart Marketplace
          </button>
        </div>
      </div>
    </div>
  );
};
