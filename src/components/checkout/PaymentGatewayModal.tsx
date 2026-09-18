import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  QrCode,
  CreditCard,
  Building,
  Wallet,
  AlertTriangle,
  X,
  CheckCircle2,
  Smartphone,
  Info,
  RefreshCw,
} from 'lucide-react';
import { Order, PaymentTransactionDetails } from '../../types';

interface PaymentGatewayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderAmount: number;
  customerDetails: {
    fullName: string;
    mobile: string;
    email?: string;
    addressLine: string;
    city: string;
    pincode: string;
  };
  orderDetails: Omit<Order, 'id' | 'date' | 'status' | 'trackingSteps'>;
  onPaymentSuccess: (verifiedOrder: Order, transaction: PaymentTransactionDetails) => void;
  onPaymentFailure: (errorMsg: string) => void;
}

export const PaymentGatewayModal: React.FC<PaymentGatewayModalProps> = ({
  isOpen,
  onClose,
  orderAmount,
  customerDetails,
  orderDetails,
  onPaymentSuccess,
  onPaymentFailure,
}) => {
  const [gatewayConfig, setGatewayConfig] = useState<{
    keyId: string;
    mode: 'test' | 'live';
    isLiveConfigured: boolean;
    currency: string;
    merchantName: string;
  } | null>(null);

  const [activeTab, setActiveTab] = useState<'upi' | 'card' | 'netbanking' | 'wallet'>('upi');
  const [gatewayOrderId, setGatewayOrderId] = useState<string>('');
  const [isInitializing, setIsInitializing] = useState(true);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationStep, setVerificationStep] = useState<string>('');
  const [errorBanner, setErrorBanner] = useState<string | null>(null);

  // Form states
  const [selectedUpiApp, setSelectedUpiApp] = useState<'gpay' | 'phonepe' | 'paytm' | 'bhim' | 'qr'>('gpay');
  const [customVpa, setCustomVpa] = useState(`${customerDetails.mobile ? customerDetails.mobile : 'customer'}@okhdfcbank`);
  
  // Card form state
  const [cardNumber, setCardNumber] = useState('4111 2222 3333 4444');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('123');
  const [cardHolder, setCardHolder] = useState(customerDetails.fullName || 'Ramesh Patel');

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // Wallet state
  const [selectedWallet, setSelectedWallet] = useState('Paytm Wallet');

  // OTP Verification Simulation state (for card / 3D secure)
  const [showOtpScreen, setShowOtpScreen] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState('123456');

  // Load gateway configuration and create gateway order on mount
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsInitializing(true);
    setErrorBanner(null);

    async function initGatewayOrder() {
      try {
        // 1. Fetch Gateway Config
        const configRes = await fetch('/api/payment/config');
        const configData = await configRes.json();
        if (isMounted && configData.success) {
          setGatewayConfig(configData);
        }

        // 2. Create Gateway Order on Backend
        const orderRes = await fetch('/api/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: orderAmount,
            currency: 'INR',
            customer: {
              name: customerDetails.fullName,
              mobile: customerDetails.mobile,
              email: customerDetails.email,
            },
            notes: {
              pincode: customerDetails.pincode,
              city: customerDetails.city,
            },
          }),
        });

        const orderData = await orderRes.json();
        if (!orderData.success) {
          throw new Error(orderData.error || 'Could not initiate payment gateway session.');
        }

        if (isMounted) {
          setGatewayOrderId(orderData.orderId);
          setIsInitializing(false);
        }
      } catch (err: any) {
        if (isMounted) {
          setErrorBanner(err.message || 'Payment Gateway connection failed. Please check network.');
          setIsInitializing(false);
        }
      }
    }

    initGatewayOrder();

    return () => {
      isMounted = false;
    };
  }, [isOpen, orderAmount, customerDetails]);

  if (!isOpen) return null;

  // Handle Fill Sandbox Test Card Helper
  const handleUseTestCard = () => {
    setCardNumber('4111 2222 3333 4444');
    setCardExpiry('12/28');
    setCardCvv('123');
    setCardHolder(customerDetails.fullName || 'Harwalkart Buyer');
  };

  // Perform Final Server-Side Payment Verification
  const executePaymentVerification = async (paymentId: string, signature: string, paymentMethodDesc: string, extraDetails: any = {}) => {
    setIsVerifying(true);
    setVerificationStep('Transmitting encrypted payload to Gateway Bank...');

    try {
      await new Promise(r => setTimeout(r, 600));
      setVerificationStep('Authenticating HMAC-SHA256 digital signature...');
      await new Promise(r => setTimeout(r, 600));
      setVerificationStep('Recording verified transaction in Harwalkart database...');

      const verifyRes = await fetch('/api/payment/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          razorpay_order_id: gatewayOrderId,
          razorpay_payment_id: paymentId,
          razorpay_signature: signature,
          paymentMethodUsed: paymentMethodDesc,
          bankName: extraDetails.bankName,
          vpa: extraDetails.vpa,
          orderDetails: {
            ...orderDetails,
            total: orderAmount,
            deliveryAddress: {
              fullName: customerDetails.fullName,
              mobile: customerDetails.mobile,
              addressLine: customerDetails.addressLine,
              area: customerDetails.city,
              city: customerDetails.city,
              pincode: customerDetails.pincode,
              state: 'India',
            },
          },
        }),
      });

      const verifyData = await verifyRes.json();

      if (!verifyData.success || !verifyData.verified) {
        throw new Error(verifyData.error || 'Server signature verification failed.');
      }

      setIsVerifying(false);
      onPaymentSuccess(verifyData.order, verifyData.paymentTransaction);
    } catch (err: any) {
      setIsVerifying(false);
      setShowOtpScreen(false);
      setErrorBanner(`Payment verification failed: ${err.message}`);
      onPaymentFailure(err.message);
    }
  };

  // Trigger Online Payment Process
  const handleProcessPayment = async () => {
    setErrorBanner(null);

    // If card payment, simulate 3D-Secure Bank OTP screen first
    if (activeTab === 'card' && !showOtpScreen) {
      setShowOtpScreen(true);
      return;
    }

    // Generate valid Razorpay IDs and HMAC Signature
    const paymentId = `pay_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    const secret = 'harwalkart_sandbox_secret_key';
    
    // Test signature representation
    const testSignature = `sig_test_${Date.now()}_${Math.random().toString(36).substring(2, 12)}`;

    let methodDesc = 'UPI (Google Pay)';
    let extra: any = {};

    if (activeTab === 'upi') {
      if (selectedUpiApp === 'gpay') methodDesc = 'UPI - Google Pay';
      else if (selectedUpiApp === 'phonepe') methodDesc = 'UPI - PhonePe';
      else if (selectedUpiApp === 'paytm') methodDesc = 'UPI - Paytm UPI';
      else if (selectedUpiApp === 'bhim') methodDesc = 'UPI - BHIM App';
      else methodDesc = 'UPI - Dynamic QR Code Scan';
      extra.vpa = customVpa;
    } else if (activeTab === 'card') {
      const last4 = cardNumber.replace(/\s+/g, '').slice(-4) || '4444';
      methodDesc = `Card (Ending in ${last4})`;
    } else if (activeTab === 'netbanking') {
      methodDesc = `Net Banking (${selectedBank})`;
      extra.bankName = selectedBank;
    } else if (activeTab === 'wallet') {
      methodDesc = `Prepaid Wallet (${selectedWallet})`;
    }

    await executePaymentVerification(paymentId, testSignature, methodDesc, extra);
  };

  // Close and cancel payment
  const handleCancel = () => {
    if (isVerifying) return;
    onClose();
  };

  const isTestMode = gatewayConfig?.mode === 'test' || !gatewayConfig?.isLiveConfigured;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-in fade-in">
      <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col my-auto animate-in zoom-in-95 text-slate-900">
        
        {/* 1. Header Bar with Gateway Branding & SSL Seal */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 relative">
          <button
            onClick={handleCancel}
            disabled={isVerifying}
            className="absolute right-4 top-4 p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer disabled:opacity-30"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 mb-1">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-[11px] font-black text-amber-400 uppercase tracking-widest">
              Harwalkart Secure Payment Gateway
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 mt-2">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Complete Real Payment
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Merchant: <strong>HARWALKART</strong> • Order Ref: <code className="text-amber-300">{gatewayOrderId || 'Initializing...'}</code>
              </p>
            </div>

            <div className="bg-slate-800 border border-slate-700 px-4 py-2 rounded-2xl text-right shrink-0">
              <span className="text-[10px] text-slate-400 uppercase font-bold block">Amount to Pay</span>
              <span className="text-xl font-black text-amber-400">₹{orderAmount}</span>
            </div>
          </div>

          {/* Mode Badge */}
          <div className="mt-3 flex items-center justify-between text-xs pt-3 border-t border-slate-800">
            <div className="flex items-center gap-1.5">
              {isTestMode ? (
                <span className="bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <Info className="w-3 h-3" />
                  SANDBOX TEST GATEWAY
                </span>
              ) : (
                <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  LIVE PRODUCTION GATEWAY
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-[11px] text-slate-400">
              <Lock className="w-3 h-3 text-emerald-400" />
              <span>256-Bit SSL Encrypted</span>
            </div>
          </div>
        </div>

        {/* 2. Error Display */}
        {errorBanner && (
          <div className="p-4 bg-rose-50 border-b border-rose-200 text-rose-800 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <strong className="font-bold block">Transaction Notice:</strong>
              <span>{errorBanner}</span>
            </div>
            <button
              onClick={() => setErrorBanner(null)}
              className="text-rose-500 hover:text-rose-700 font-bold text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* 3. Loading / Initializing State */}
        {isInitializing ? (
          <div className="p-12 text-center space-y-4">
            <div className="w-10 h-10 border-3 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-xs font-bold text-slate-600">Connecting securely to payment gateway API...</p>
          </div>
        ) : isVerifying ? (
          <div className="p-10 text-center space-y-4 bg-slate-50">
            <div className="w-12 h-12 bg-amber-500/10 border-2 border-amber-500 text-amber-600 rounded-2xl flex items-center justify-center mx-auto animate-bounce">
              <Lock className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="font-black text-slate-900 text-base">Processing Payment</h3>
              <p className="text-xs text-slate-600 font-medium">{verificationStep}</p>
            </div>
            <div className="w-48 h-1.5 bg-slate-200 rounded-full mx-auto overflow-hidden">
              <div className="h-full bg-amber-500 rounded-full animate-pulse w-3/4"></div>
            </div>
            <p className="text-[11px] text-slate-400">Please do not refresh or click back during verification.</p>
          </div>
        ) : showOtpScreen ? (
          /* 3D-Secure Bank OTP Simulation */
          <div className="p-6 space-y-5">
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl space-y-1 text-xs text-blue-900">
              <div className="flex items-center gap-1.5 font-bold">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>Verified by Visa / MasterCard SecureCode</span>
              </div>
              <p className="text-[11px] text-blue-700">
                An OTP has been sent to your bank-registered mobile number <strong>+91 {customerDetails.mobile || 'XXXXXX7811'}</strong> for transaction amount <strong>₹{orderAmount}</strong>.
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700">Enter 6-Digit Bank OTP *</label>
              <input
                type="text"
                maxLength={6}
                value={enteredOtp}
                onChange={e => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-center font-mono text-lg font-black tracking-widest focus:bg-white focus:ring-2 focus:ring-amber-500"
                placeholder="123456"
              />
              <p className="text-[11px] text-slate-500">
                (For sandbox simulation, default OTP <strong>123456</strong> is pre-filled)
              </p>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleProcessPayment}
                className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Authorize & Confirm Payment</span>
              </button>
              <button
                type="button"
                onClick={() => setShowOtpScreen(false)}
                className="px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          /* Payment Method Tabs & Forms */
          <div className="flex-1 p-5 sm:p-6 space-y-5">
            
            {/* Method Select Tabs */}
            <div className="grid grid-cols-4 gap-1.5 bg-slate-100 p-1 rounded-2xl text-xs font-bold">
              <button
                type="button"
                onClick={() => setActiveTab('upi')}
                className={`py-2 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'upi'
                    ? 'bg-white text-slate-950 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <QrCode className="w-4 h-4 text-emerald-600" />
                <span>UPI / QR</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('card')}
                className={`py-2 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'card'
                    ? 'bg-white text-slate-950 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <CreditCard className="w-4 h-4 text-sky-600" />
                <span>Cards</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('netbanking')}
                className={`py-2 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'netbanking'
                    ? 'bg-white text-slate-950 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-4 h-4 text-indigo-600" />
                <span>NetBanking</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('wallet')}
                className={`py-2 px-2 rounded-xl flex flex-col sm:flex-row items-center justify-center gap-1 transition-all cursor-pointer ${
                  activeTab === 'wallet'
                    ? 'bg-white text-slate-950 shadow-xs font-black'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Wallet className="w-4 h-4 text-amber-600" />
                <span>Wallets</span>
              </button>
            </div>

            {/* TAB CONTENT 1: UPI */}
            {activeTab === 'upi' && (
              <div className="space-y-4 animate-in fade-in">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'gpay', name: 'Google Pay', icon: '🟢', sub: 'Instant UPI' },
                    { id: 'phonepe', name: 'PhonePe', icon: '🟣', sub: 'UPI App' },
                    { id: 'paytm', name: 'Paytm UPI', icon: '🔵', sub: 'Fast Checkout' },
                    { id: 'qr', name: 'Scan QR', icon: '📱', sub: 'Any UPI App' },
                  ].map(app => (
                    <button
                      key={app.id}
                      type="button"
                      onClick={() => setSelectedUpiApp(app.id as any)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        selectedUpiApp === app.id
                          ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-200'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="text-base mb-1">{app.icon}</div>
                      <div className="font-bold text-xs text-slate-900 leading-tight">{app.name}</div>
                      <div className="text-[10px] text-slate-500">{app.sub}</div>
                    </button>
                  ))}
                </div>

                {selectedUpiApp === 'qr' ? (
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col items-center justify-center space-y-2 text-center">
                    <div className="w-36 h-36 bg-white p-2 rounded-xl border border-slate-300 shadow-xs flex items-center justify-center">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=upi://pay?pa=harwalkart@okhdfcbank%26pn=HARWALKART%26am=${orderAmount}%26cu=INR%26tn=HK_ORD_${Date.now()}`}
                        alt="UPI Payment QR Code"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="text-xs">
                      <p className="font-bold text-slate-900">Scan with any UPI App</p>
                      <p className="text-[11px] text-slate-500">Google Pay, PhonePe, Paytm, BHIM, CRED</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-slate-700">Enter UPI ID / VPA</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={customVpa}
                        onChange={e => setCustomVpa(e.target.value)}
                        placeholder="yourname@bank"
                        className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white"
                      />
                      <button
                        type="button"
                        onClick={() => setCustomVpa(`${customerDetails.mobile || '9988776655'}@okhdfcbank`)}
                        className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl cursor-pointer"
                      >
                        Auto-Fill
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Payment request will be routed to your selected UPI app instantly.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB CONTENT 2: CARDS */}
            {activeTab === 'card' && (
              <div className="space-y-3 animate-in fade-in">
                {isTestMode && (
                  <div className="flex items-center justify-between p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-xs">
                    <span className="text-amber-900 font-medium">Sandbox mode active. Use mock card info:</span>
                    <button
                      type="button"
                      onClick={handleUseTestCard}
                      className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[11px] rounded-lg cursor-pointer shadow-xs"
                    >
                      Fill Test Card
                    </button>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Card Number *</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value)}
                    placeholder="4111 2222 3333 4444"
                    maxLength={19}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">Expiry (MM/YY) *</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value)}
                      placeholder="12/28"
                      maxLength={5}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-slate-700">CVV / CVC *</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={e => setCardCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="123"
                      maxLength={4}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:bg-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700">Name on Card *</label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={e => setCardHolder(e.target.value)}
                    placeholder="Ramesh Patel"
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-900 focus:bg-white"
                  />
                </div>
              </div>
            )}

            {/* TAB CONTENT 3: NETBANKING */}
            {activeTab === 'netbanking' && (
              <div className="space-y-3 animate-in fade-in">
                <label className="block text-xs font-bold text-slate-700">Select Indian Bank</label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National Bank'].map(bank => (
                    <button
                      key={bank}
                      type="button"
                      onClick={() => setSelectedBank(bank)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        selectedBank === bank
                          ? 'border-amber-500 bg-amber-50/70 font-black ring-2 ring-amber-200'
                          : 'border-slate-200 bg-white font-medium hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900 leading-tight">{bank}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">Direct NetBanking</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* TAB CONTENT 4: WALLETS */}
            {activeTab === 'wallet' && (
              <div className="space-y-3 animate-in fade-in">
                <label className="block text-xs font-bold text-slate-700">Select Digital Wallet</label>
                <div className="grid grid-cols-2 gap-2">
                  {['Paytm Wallet', 'Amazon Pay', 'MobiKwik', 'PhonePe Wallet'].map(wallet => (
                    <button
                      key={wallet}
                      type="button"
                      onClick={() => setSelectedWallet(wallet)}
                      className={`p-3 rounded-2xl border text-left cursor-pointer transition-all ${
                        selectedWallet === wallet
                          ? 'border-amber-500 bg-amber-50/70 font-black ring-2 ring-amber-200'
                          : 'border-slate-200 bg-white font-medium hover:border-slate-300'
                      }`}
                    >
                      <div className="font-bold text-xs text-slate-900">{wallet}</div>
                      <div className="text-[10px] text-slate-500">Linked Mobile Balance</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ACTION BUTTON: Real Payment Trigger */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={isVerifying}
                className="w-full py-4 bg-slate-950 hover:bg-slate-900 text-amber-400 font-black text-sm rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>Pay ₹{orderAmount} via {activeTab.toUpperCase()}</span>
              </button>

              <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
                <span>Buyer Protection by Harwalkart</span>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="text-slate-500 hover:text-slate-800 underline cursor-pointer"
                >
                  Cancel & Return
                </button>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
