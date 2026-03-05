import React, { useState, useEffect } from 'react';
import { Calculator, DollarSign, AlertCircle, TrendingUp, Tag, ShoppingBag, ShieldAlert } from 'lucide-react';

export default function App() {
  // 狀態管理 (State)
  const [msrp, setMsrp] = useState(''); // 商品建議售價
  const [fridayPrice, setFridayPrice] = useState(''); // Friday購物售價
  const [cost, setCost] = useState(''); // 現金盤成本(含稅)
  const [markup, setMarkup] = useState(2500); // 報價基準加成 (預設 2500)

  // 計算結果 (Derived State)
  const [systemQuote, setSystemQuote] = useState(0);
  const [isCapped, setIsCapped] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [profit, setProfit] = useState(0);

  // 核心計算邏輯
  useEffect(() => {
    const numMsrp = parseFloat(msrp) || 0;
    const numFriday = parseFloat(fridayPrice) || 0;
    const numCost = parseFloat(cost) || 0;
    const numMarkup = parseFloat(markup) || 0;

    if (numFriday > 0 || numCost > 0) {
      // 邏輯修改：當成本高於 Friday 售價時，以成本為基準 (即把溢價加回來)
      const basePrice = Math.max(numFriday, numCost);
      let calcQuote = basePrice + numMarkup;
      
      // 判斷是否處於溢價狀態 (成本 > Friday)
      setIsPremium(numCost > numFriday && numFriday > 0);

      // 條件限制：系統報價不得大於建議售價
      let capped = false;
      if (numMsrp > 0 && calcQuote > numMsrp) {
        calcQuote = numMsrp;
        capped = true;
      }

      setSystemQuote(calcQuote);
      setIsCapped(capped);
      setProfit(calcQuote - numCost); // 計算預估毛利
    } else {
      setSystemQuote(0);
      setIsCapped(false);
      setIsPremium(false);
      setProfit(0);
    }
  }, [msrp, fridayPrice, cost, markup]);

  // 數字格式化小工具
  const formatPrice = (price) => {
    return new Intl.NumberFormat('zh-TW', { style: 'currency', currency: 'TWD', maximumFractionDigits: 0 }).format(price);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-800">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-100">
        
        {/* Header Vibe - 遠傳延平空機報價系統 */}
        <div className="bg-gradient-to-r from-red-700 to-red-600 p-6 text-white text-center">
          <h1 className="text-2xl font-bold tracking-wider flex items-center justify-center gap-2">
            <Calculator className="w-6 h-6" />
            遠傳延平空機報價系統
          </h1>
          <p className="text-red-200 text-sm mt-1 opacity-80">極簡 ‧ 防呆 ‧ 高效</p>
        </div>

        <div className="p-6 space-y-5">
          {/* 輸入區塊 */}
          <div className="space-y-4">
            {/* 建議售價 */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1 flex items-center gap-1">
                <Tag className="w-4 h-4 text-slate-400" />
                商品建議售價 (MSRP)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">$</span>
                <input
                  type="number"
                  value={msrp}
                  onChange={(e) => setMsrp(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-lg"
                  placeholder="例如: 35900"
                />
              </div>
            </div>

            {/* Friday 售價 */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1 flex items-center gap-1">
                <ShoppingBag className="w-4 h-4 text-slate-400" />
                Friday 購物售價
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">$</span>
                <input
                  type="number"
                  value={fridayPrice}
                  onChange={(e) => setFridayPrice(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-lg"
                  placeholder="例如: 32000"
                />
              </div>
            </div>

            {/* 現金盤成本 */}
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1 flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-slate-400" />
                現金盤成本 (含稅)
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">$</span>
                <input
                  type="number"
                  value={cost}
                  onChange={(e) => setCost(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all outline-none text-lg"
                  placeholder="輸入成本以計算毛利"
                />
              </div>
              {/* 溢價警示提示 */}
              {isPremium && (
                <p className="mt-2 text-xs text-amber-600 font-medium flex items-center gap-1">
                  <ShieldAlert className="w-3 h-3" />
                  成本高於 Friday 售價，已自動補足溢價。
                </p>
              )}
            </div>

            {/* 彈性加價設定 */}
            <div className="pt-2">
              <label className="block text-sm font-medium text-slate-600 mb-1 flex justify-between items-center">
                <span>報價加成基準</span>
                <span className="text-red-600 font-semibold">+{markup}</span>
              </label>
              <input
                type="range"
                min="0"
                max="5000"
                step="100"
                value={markup}
                onChange={(e) => setMarkup(e.target.value)}
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-red-600"
              />
            </div>
          </div>

          {/* 分隔線 */}
          <div className="border-t border-slate-100 my-2"></div>

          {/* 報價結果展示區 */}
          <div className="bg-red-50 rounded-2xl p-5 relative overflow-hidden border border-red-100">
            {/* 裝飾背景 */}
            <div className="absolute -right-6 -top-6 text-red-100 opacity-50">
              <DollarSign className="w-32 h-32" />
            </div>
            
            <div className="relative z-10">
              <p className="text-red-800 font-medium text-sm mb-1">對客系統報價</p>
              <div className="flex flex-col gap-1">
                <span className="text-4xl font-bold text-red-900 tracking-tight">
                  {systemQuote > 0 ? formatPrice(systemQuote) : '$0'}
                </span>
                <div className="flex flex-wrap gap-2 mt-1">
                  {isCapped && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">
                      <AlertCircle className="w-3 h-3" />
                      已達建議售價上限
                    </span>
                  )}
                  {isPremium && (
                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full">
                      <ShieldAlert className="w-3 h-3" />
                      成本基準保護中
                    </span>
                  )}
                </div>
              </div>

              {/* 門市內部參考數據 (毛利) */}
              {systemQuote > 0 && cost > 0 && (
                <div className="mt-4 pt-4 border-t border-red-200/50 flex justify-between items-center">
                  <span className="text-sm text-red-700/70 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" />
                    預估毛利空間
                  </span>
                  <span className={`font-semibold ${profit >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                    {formatPrice(profit)}
                  </span>
                </div>
              )}
            </div>
          </div>
          
        </div>
        
        {/* Footer 宣告區 */}
        <div className="bg-slate-50 py-3 text-center border-t border-slate-100">
          <p className="text-xs text-slate-400 font-medium tracking-wide">©Money Mobile Communication</p>
        </div>
      </div>
    </div>
  );
}
