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
    <div className="min-h-screen bg-white dark:bg-[#0d1117] text-ink-700 dark:text-ink-300 flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md text-center bg-white dark:bg-[#161b22] border border-ink-200 dark:border-[#262c36] rounded-xl p-8 shadow-soft">
        {ok ? (
          <>
            <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-green-50 dark:bg-green-500/10 flex items-center justify-center text-green-600 dark:text-green-400">
              <HiOutlineCheckCircle className="w-9 h-9" />
            </div>
            <h1 className="text-2xl font-bold text-ink-900 dark:text-white">
              You&apos;re on{' '}
              <span className="text-primary-600 dark:text-primary-400">{planLabel}</span>
            </h1>
            <p className="text-ink-600 dark:text-ink-400 mt-2">
              {amount ? `${symbol}${amount} ` : ''}payment successful. Your {planLabel} features are now unlocked.
            </p>
            <Link to="/dashboard" className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold bg-primary-600 hover:bg-primary-700 text-white transition-colors">
              Go to dashboard <HiOutlineArrowRight className="w-4 h-4" />
            </Link>
          </>
        ) : (
          <>
            <div className="w-16 h-16 mx-auto mb-5 rounded-xl bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400">
              <HiOutlineExclamationCircle className="w-9 h-9" />
            </div>
            <h1 className="text-xl font-semibold text-ink-900 dark:text-white">No recent payment found</h1>
            <p className="text-ink-500 dark:text-ink-400 mt-2 text-sm">Head back to pricing to choose a plan.</p>
            <Link to="/pricing" className="mt-6 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold border border-ink-300 dark:border-[#262c36] text-ink-800 dark:text-ink-100 hover:bg-ink-50 dark:hover:bg-white/[0.04] transition-colors">
              Back to pricing
            </Link>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSuccess;
