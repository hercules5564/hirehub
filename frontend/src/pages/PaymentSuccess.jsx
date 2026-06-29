import { Link, useLocation } from 'react-router-dom';
import { HiOutlineCheckCircle, HiOutlineExclamationCircle, HiOutlineArrowRight } from 'react-icons/hi';

// Razorpay verifies the payment inside the checkout-modal handler, then navigates
// here with the verified result in router state. This page just celebrates it.
const PaymentSuccess = () => {
  const { state } = useLocation();
  const ok = state && state.plan;

  const planLabel = ok ? state.plan.charAt(0).toUpperCase() + state.plan.slice(1) : '';
  const amount = ok && state.amountTotal != null ? (state.amountTotal / 100).toLocaleString('en-IN') : null;
  const symbol = state?.currency && state.currency.toUpperCase() === 'USD' ? '$' : '₹';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#030303] text-white flex items-center justify-center px-4 pt-20">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 right-0 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 -left-10 w-72 h-72 bg-rose-500/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md text-center bg-white/[0.03] border border-white/[0.1] rounded-2xl p-8">
        {ok ? (
          <>
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-gradient-to-br from-indigo-500 to-rose-500 flex items-center justify-center shadow-lg">
              <HiOutlineCheckCircle className="w-9 h-9 text-white" />
            </div>
            <h1 className="text-2xl font-bold">
              You&apos;re on{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-300 via-white/90 to-rose-300">{planLabel}</span> 🎉
            </h1>
            <p className="text-white/60 mt-2">
              {amount ? `${symbol}${amount} ` : ''}payment successful. Your {planLabel} features are now unlocked.
            </p>
            <Link to="/dashboard" className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold bg-gradient-to-r from-indigo-500 to-rose-500 text-white shadow-[0_8px_24px_0_rgba(99,102,241,0.35)] hover:scale-105 transition-all">
              Go to dashboard <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-rose-500/15 border border-rose-500/30 flex items-center justify-center">
              <HiOutlineExclamationCircle className="w-9 h-9 text-rose-300" />
            </div>
            <h1 className="text-xl font-semibold">No recent payment found</h1>
            <p className="text-white/60 mt-2 text-sm">Head back to pricing to choose a plan.</p>
            <Link to="/pricing" className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold border border-white/[0.12] text-white/80 hover:bg-white/[0.06] transition-colors">
              Back to pricing
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
