import React, { useState } from 'react';
// import { loadStripe } from '@stripe/stripe-js';
import { CreditCard, Bitcoin, Package } from 'lucide-react';
import { motion } from 'framer-motion';

// Stripe promise for future use
// const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_mock');

interface PaymentModalProps {
    onClose: () => void;
    onSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({ onClose, onSuccess }) => {
    const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'crypto'>('stripe');
    const [selectedBundle, setSelectedBundle] = useState<number>(100);
    const [loading, setLoading] = useState(false);

    const bundles = [
        { credits: 50, price: 5, discount: 0 },
        { credits: 100, price: 9, discount: 10 },
        { credits: 500, price: 42.5, discount: 15 },
        { credits: 1000, price: 80, discount: 20 }
    ];

    const handleStripePayment = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const bundle = bundles.find(b => b.credits === selectedBundle);

            // Create payment intent
            const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/stripe/create-intent`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ amount_usd: bundle?.price })
            });

            const { client_secret: _client_secret } = await response.json();

            // Redirect to Stripe Checkout or use Elements
            // For simplicity, showing success message
            alert('Payment processing... (Stripe integration pending)');
            if (onSuccess) onSuccess();
            onClose();
        } catch (error) {
            console.error('Payment failed:', error);
            alert('Payment failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleCryptoPayment = async () => {
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const bundle = bundles.find(b => b.credits === selectedBundle);

            const response = await fetch(`${import.meta.env.VITE_API_URL}/payments/crypto/create-invoice`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    amount_usd: bundle?.price,
                    currency: 'USDT'
                })
            });

            const invoice = await response.json();

            // Show crypto payment instructions
            alert(`Send ${invoice.amount} USDT to:\n${invoice.wallet_address}`);
            onClose();
        } catch (error) {
            console.error('Crypto payment failed:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
            onClick={onClose}
        >
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gray-900 rounded-2xl p-6 max-w-2xl w-full"
                onClick={(e) => e.stopPropagation()}
            >
                <h2 className="text-2xl font-bold mb-6">Buy Credits</h2>

                {/* Bundle Selection */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {bundles.map((bundle) => (
                        <motion.button
                            key={bundle.credits}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setSelectedBundle(bundle.credits)}
                            className={`relative p-4 rounded-xl border-2 transition-all ${selectedBundle === bundle.credits
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-gray-700 hover:border-gray-600'
                                }`}
                        >
                            {bundle.discount > 0 && (
                                <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    -{bundle.discount}%
                                </div>
                            )}
                            <Package className="mx-auto mb-2 text-purple-400" size={24} />
                            <div className="text-2xl font-bold">{bundle.credits}</div>
                            <div className="text-sm text-gray-400">credits</div>
                            <div className="text-lg font-semibold mt-2">${bundle.price}</div>
                        </motion.button>
                    ))}
                </div>

                {/* Payment Method Selection */}
                <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">Payment Method</h3>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => setPaymentMethod('stripe')}
                            className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'stripe'
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-gray-700 hover:border-gray-600'
                                }`}
                        >
                            <CreditCard size={20} />
                            <span>Card / PayPal</span>
                        </button>
                        <button
                            onClick={() => setPaymentMethod('crypto')}
                            className={`flex items-center justify-center gap-2 p-4 rounded-xl border-2 transition-all ${paymentMethod === 'crypto'
                                ? 'border-purple-500 bg-purple-500/10'
                                : 'border-gray-700 hover:border-gray-600'
                                }`}
                        >
                            <Bitcoin size={20} />
                            <span>Crypto</span>
                        </button>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                    <button
                        onClick={paymentMethod === 'stripe' ? handleStripePayment : handleCryptoPayment}
                        disabled={loading}
                        className="flex-1 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed py-3 rounded-xl font-semibold transition-colors"
                    >
                        {loading ? 'Processing...' : `Pay $${bundles.find(b => b.credits === selectedBundle)?.price}`}
                    </button>
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                </div>

                <p className="text-xs text-gray-500 text-center mt-4">
                    Secure payment powered by Stripe. Your payment information is encrypted and secure.
                </p>
            </motion.div>
        </div>
    );
};
