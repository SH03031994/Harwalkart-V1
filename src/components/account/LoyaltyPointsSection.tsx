import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Coins,
  Award,
  Gift,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Copy,
  ExternalLink,
  ChevronRight,
  Zap,
  ShoppingBag,
  Info,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LoyaltyPointsSectionProps {
  onNavigateToShop?: () => void;
  onNavigateToOrder?: (orderId: string) => void;
}

export const LoyaltyPointsSection: React.FC<LoyaltyPointsSectionProps> = ({
  onNavigateToShop,
  onNavigateToOrder,
}) => {
  const {
    authSession,
    customerUser,
    registeredCustomers,
    redeemLoyaltyPoints,
    navigate,
    setSelectedTrackingOrderId,
    showToast,
    loyaltyBalance,
    loyaltyTier,
    loyaltyPointsHistory,
  } = useApp();

  const customer = authSession.customer || customerUser || registeredCustomers[0];
  const points = loyaltyBalance ?? customer?.loyaltyPoints ?? 340;
  const rupeeValue = points; // 1 Point = ₹1
  const currentTier = loyaltyTier || customer?.loyaltyTier || (points >= 1500 ? 'Platinum' : points >= 500 ? 'Gold' : 'Silver');

  // Next tier calculation
  let nextTierName = 'Gold';
  let nextTierPoints = 500;
  let currentTierBase = 0;
  let tierMultiplier = 1.0;

  if (currentTier === 'Silver') {
    nextTierName = 'Gold';
    nextTierPoints = 500;
    currentTierBase = 0;
    tierMultiplier = 1.0;
  } else if (currentTier === 'Gold') {
    nextTierName = 'Platinum';
    nextTierPoints = 1500;
    currentTierBase = 500;
    tierMultiplier = 1.25;
  } else {
    nextTierName = 'Platinum (Top Tier)';
    nextTierPoints = 1500;
    currentTierBase = 1500;
    tierMultiplier = 1.5;
  }

  const pointsToNext = Math.max(0, nextTierPoints - points);
  const progressPercent =
    currentTier === 'Platinum'
      ? 100
      : Math.min(100, Math.round(((points - currentTierBase) / (nextTierPoints - currentTierBase)) * 100));

  // Redemption state
  const [redeemAmount, setRedeemAmount] = useState<number>(100);
  const [activeFilter, setActiveFilter] = useState<'all' | 'earned' | 'redeemed' | 'bonus'>('all');
  const [generatedVoucher, setGeneratedVoucher] = useState<{ code: string; amount: number } | null>(null);

  const history = (loyaltyPointsHistory && loyaltyPointsHistory.length > 0)
    ? loyaltyPointsHistory
    : (customer?.loyaltyPointsHistory || [
    {
      id: 'lp_tx_1',
      orderId: 'HK-ORD-89421',
      orderAmount: 601,
      points: 60,
      type: 'earned',
      description: 'Earned 60 points on Order #HK-ORD-89421 (Grocery & Kitchen Shakti)',
      date: '23 Aug 2026, 02:30 PM',
      balanceAfter: 340,
    },
    {
      id: 'lp_tx_2',
      orderId: 'HK-ORD-77192',
      orderAmount: 1800,
      points: 180,
      type: 'earned',
      description: 'Earned 180 points on Order #HK-ORD-77192 (Bulk Spices & Dry Fruits)',
      date: '15 Jul 2026, 11:20 AM',
      balanceAfter: 280,
    },
    {
      id: 'lp_tx_3',
      points: 100,
      type: 'bonus',
      description: 'Harwalkart Verified Shopper Welcome Bonus 🎁',
      date: '10 Jan 2024, 10:00 AM',
      balanceAfter: 100,
    },
  ]);

  const filteredHistory = history.filter(tx => {
    if (activeFilter === 'all') return true;
    return tx.type === activeFilter;
  });

  const handleQuickRedeem = (pts: number) => {
    if (points < pts) {
      showToast(`You need at least ${pts} points to redeem this voucher. Current balance: ${points} pts.`);
      return;
    }
    const res = redeemLoyaltyPoints(pts);
    if (res.success) {
      const code = `HK-PTS${pts}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setGeneratedVoucher({ code, amount: pts });
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  const handleCustomRedeem = (e: React.FormEvent) => {
    e.preventDefault();
    if (redeemAmount <= 0) {
      showToast('Please enter a valid points amount to redeem.');
      return;
    }
    if (redeemAmount > points) {
      showToast(`You only have ${points} points available.`);
      return;
    }
    const res = redeemLoyaltyPoints(redeemAmount);
    if (res.success) {
      const code = `HK-PTS${redeemAmount}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      setGeneratedVoucher({ code, amount: redeemAmount });
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }
    }
  };

  const copyVoucherCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    showToast(`Voucher code "${code}" copied to clipboard! 📋`);
  };

  return (
    <div className="space-y-6 animate-in fade-in">
      {/* 1. Hero Points Balance Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 p-6 md:p-8 shadow-sm border border-amber-300">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-white/10 blur-xl pointer-events-none" />
        <div className="absolute -right-4 bottom-0 opacity-15 text-slate-950 pointer-events-none">
          <Coins className="w-56 h-56" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-950 text-amber-300 rounded-full text-xs font-black uppercase tracking-wide shadow-xs">
                <Award className="w-3.5 h-3.5" />
                {currentTier} Member
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-white/30 backdrop-blur-xs text-slate-950 rounded-full text-xs font-bold">
                <Zap className="w-3 h-3 text-slate-950" />
                {tierMultiplier}x Earning Multiplier
              </span>
            </div>

            <div>
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Available Loyalty Points
              </p>
              <div className="flex items-baseline gap-3 mt-1">
                <span className="text-4xl md:text-5xl font-black tracking-tight text-slate-950">
                  {points.toLocaleString()}
                </span>
                <span className="text-sm md:text-base font-extrabold text-slate-900 bg-white/40 px-2.5 py-1 rounded-xl">
                  = ₹{rupeeValue.toLocaleString()} Shopping Value
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-900/90 font-medium max-w-lg">
              Earn 1 point for every ₹10 spent on any product across Harwalkart. 1 Point equals ₹1 cash discount on future purchases.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
            <button
              onClick={() => {
                const el = document.getElementById('redeem-section');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-5 py-3 bg-slate-950 hover:bg-slate-900 text-amber-400 text-xs font-black rounded-2xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <Gift className="w-4 h-4" />
              <span>Redeem Points for Vouchers</span>
            </button>
            <button
              onClick={() => {
                if (onNavigateToShop) onNavigateToShop();
                else navigate('/products');
              }}
              className="px-5 py-3 bg-white/80 hover:bg-white text-slate-950 text-xs font-black rounded-2xl flex items-center justify-center gap-2 shadow-xs cursor-pointer transition-all"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shop & Earn More Points</span>
            </button>
          </div>
        </div>

        {/* Tier Progress Bar */}
        <div className="mt-6 pt-5 border-t border-slate-950/10">
          <div className="flex items-center justify-between text-xs font-bold mb-2 text-slate-900">
            <span>
              {currentTier === 'Platinum' ? (
                '🏆 You have achieved the highest Harwalkart VIP tier!'
              ) : (
                <>Next Tier: <strong>{nextTierName}</strong> ({pointsToNext} points to unlock)</>
              )}
            </span>
            <span>{progressPercent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-950/15 rounded-full overflow-hidden">
            <div
              className="h-full bg-slate-950 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-bold text-slate-800 mt-1.5">
            <span>Silver (0 pts)</span>
            <span>Gold (500 pts)</span>
            <span>Platinum (1,500+ pts)</span>
          </div>
        </div>
      </div>

      {/* 2. Voucher Generated Success Notice (If Any) */}
      {generatedVoucher && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 p-5 rounded-3xl space-y-3 animate-in zoom-in-95">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <h4 className="text-sm font-black text-emerald-950 dark:text-emerald-200">
                ₹{generatedVoucher.amount} Harwalkart Shopping Voucher Created!
              </h4>
            </div>
            <span className="text-[10px] font-bold uppercase bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded-md border border-emerald-300 dark:border-emerald-700">
              Ready to Use
            </span>
          </div>
          <p className="text-xs text-emerald-800 dark:text-emerald-300">
            Use this voucher code at checkout to deduct ₹{generatedVoucher.amount} instantly from your cart total.
          </p>
          <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-emerald-300 dark:border-emerald-700 px-3.5 py-2.5 rounded-xl max-w-md justify-between">
            <code className="text-sm font-mono font-black text-slate-900 dark:text-white">
              {generatedVoucher.code}
            </code>
            <button
              onClick={() => copyVoucherCode(generatedVoucher.code)}
              className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Earning Rules & How It Works */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>How Harwalkart Loyalty Points Work</span>
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Simple, honest rewards designed to save you money on authentic groceries & spices.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-black flex items-center justify-center text-sm">
              🪙
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">1 Pt per ₹10 Spent</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Every completed purchase automatically credits points straight to your account.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-black flex items-center justify-center text-sm">
              🌶️
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">Harwalkart Brand Bonus</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Earn extra bonus points on KitchenShakti, NutriFlow, RupaBhoom & GrahShorya products.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-black flex items-center justify-center text-sm">
              ⚡
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">Tier Boosters</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              Gold members enjoy 1.25x points, and Platinum members enjoy 1.50x points on every order.
            </p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-1.5">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 font-black flex items-center justify-center text-sm">
              💎
            </div>
            <h4 className="text-xs font-black text-slate-900 dark:text-white">1 Point = ₹1 Rupee</h4>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              No complicated conversion math. 100 points equals exactly ₹100 in shopping discounts.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Instant Redeem Hub */}
      <div id="redeem-section" className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
              <Gift className="w-4 h-4 text-amber-500" />
              <span>Redeem Loyalty Points for Vouchers</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Convert your accumulated points into instant store vouchers.
            </p>
          </div>
          <span className="text-xs font-black bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-300 px-3 py-1.5 rounded-xl w-max">
            Balance: {points} Points (₹{rupeeValue})
          </span>
        </div>

        {/* Quick Vouchers */}
        <div>
          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-3">
            Quick Voucher Packages
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { pts: 50, rupee: 50, label: 'Starter Pass', desc: '₹50 off any order above ₹199' },
              { pts: 100, rupee: 100, label: 'Value Voucher', desc: 'Flat ₹100 off on spices & groceries' },
              { pts: 250, rupee: 250, label: 'Mega Savings', desc: 'Flat ₹250 off on bulk shopping' },
              { pts: 40, rupee: 40, label: 'Free Delivery Pass', desc: 'Waive standard ₹40 delivery fee' },
            ].map(pkg => (
              <div
                key={pkg.pts}
                className={`p-4 rounded-2xl border transition-all flex flex-col justify-between space-y-3 ${
                  points >= pkg.pts
                    ? 'border-amber-200 dark:border-amber-800/80 bg-amber-50/40 dark:bg-amber-950/30 hover:border-amber-400'
                    : 'border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase">{pkg.label}</span>
                    <span className="text-xs font-black text-amber-700 dark:text-amber-300 bg-amber-100 dark:bg-amber-950/80 px-2 py-0.5 rounded-md border border-amber-200 dark:border-amber-800">
                      {pkg.pts} Pts
                    </span>
                  </div>
                  <p className="text-lg font-black text-slate-950 dark:text-white mt-1">₹{pkg.rupee} Voucher</p>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">{pkg.desc}</p>
                </div>

                <button
                  onClick={() => handleQuickRedeem(pkg.pts)}
                  disabled={points < pkg.pts}
                  className={`w-full py-2 px-3 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    points >= pkg.pts
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-xs'
                      : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed'
                  }`}
                >
                  <Gift className="w-3.5 h-3.5" />
                  <span>{points >= pkg.pts ? `Redeem ${pkg.pts} Pts` : `Need ${pkg.pts - points} more`}</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Custom Redemption Form */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800">
          <form onSubmit={handleCustomRedeem} className="flex flex-col sm:flex-row items-start sm:items-end gap-3">
            <div className="flex-1 w-full">
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1">
                Custom Points Redemption (1 Pt = ₹1)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min={10}
                  max={points}
                  value={redeemAmount}
                  onChange={e => setRedeemAmount(Math.max(0, parseInt(e.target.value) || 0))}
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-amber-500 pl-9"
                  placeholder="Enter points (e.g. 150)"
                />
                <Coins className="w-4 h-4 text-amber-500 absolute left-3 top-3" />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                You will receive a ₹{redeemAmount} store voucher. (Max: {points} points)
              </p>
            </div>
            <button
              type="submit"
              disabled={points < redeemAmount || redeemAmount <= 0}
              className="px-6 py-2.5 bg-slate-950 hover:bg-slate-900 disabled:opacity-50 text-amber-400 text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0 transition-all shadow-sm border border-slate-800"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Generate ₹{redeemAmount} Voucher</span>
            </button>
          </form>
        </div>
      </div>

      {/* 5. Points Transaction History */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-black text-slate-950 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <span>Points Transaction Ledger</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Complete history of points earned on purchases, bonuses, and redeemed vouchers.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            {(['all', 'earned', 'redeemed', 'bonus'] as const).map(f => (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-3 py-1 text-[11px] font-bold rounded-lg capitalize transition-all cursor-pointer ${
                  activeFilter === f
                    ? 'bg-white dark:bg-slate-700 text-slate-950 dark:text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        {filteredHistory.length === 0 ? (
          <div className="text-center py-8 space-y-2">
            <Coins className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-xs font-bold text-slate-600 dark:text-slate-400">No transactions found for this filter.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {filteredHistory.map(tx => {
              const isEarned = tx.points > 0 && tx.type === 'earned';
              const isBonus = tx.points > 0 && tx.type === 'bonus';
              const isRedeemed = tx.points < 0 || tx.type === 'redeemed';

              return (
                <div key={tx.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                        isEarned
                          ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800'
                          : isBonus
                          ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                          : 'bg-rose-100 dark:bg-rose-950/80 text-rose-800 dark:text-rose-300 border border-rose-300 dark:border-rose-800'
                      }`}
                    >
                      {isEarned ? (
                        <ArrowDownLeft className="w-4 h-4" />
                      ) : isBonus ? (
                        <Sparkles className="w-4 h-4" />
                      ) : (
                        <ArrowUpRight className="w-4 h-4" />
                      )}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-900 dark:text-white">{tx.description}</p>
                      <div className="flex flex-wrap items-center gap-2 mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                        <span>{tx.date}</span>
                        {tx.orderId && (
                          <button
                            onClick={() => {
                              setSelectedTrackingOrderId(tx.orderId!);
                              if (onNavigateToOrder) onNavigateToOrder(tx.orderId!);
                              else navigate('/order-tracking');
                            }}
                            className="inline-flex items-center gap-0.5 text-amber-600 dark:text-amber-400 hover:underline font-bold cursor-pointer"
                          >
                            <span>View Order #{tx.orderId}</span>
                            <ExternalLink className="w-2.5 h-2.5" />
                          </button>
                        )}
                        <span>• Balance after: {tx.balanceAfter} pts</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`text-sm font-black ${
                        isEarned || isBonus ? 'text-emerald-700 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {tx.points > 0 ? `+${tx.points}` : tx.points} pts
                    </span>
                    <span className="block text-[10px] text-slate-400 dark:text-slate-500 capitalize">
                      {tx.type}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
