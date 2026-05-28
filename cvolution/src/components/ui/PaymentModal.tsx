import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';


interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
  profile: any;
  isRenewal?: boolean;
}


export const PaymentModal: React.FC<PaymentModalProps> = ({ open, onClose, user, profile, isRenewal = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePay = async () => {
    if (typeof window === "undefined") return;
    setLoading(true);
    setError("");
    try {
      const { data } = await supabase.auth.getSession();
      const token = data.session?.access_token;

      if (!token) {
        throw new Error("Bitte melden Sie sich erneut an.");
      }

      const res = await fetch("/api/saferpay/self-subscription", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "Abo-Zahlung konnte nicht gestartet werden.");
      }

      const orderResult: { requiresPayment: boolean; paymentUrl: string | null } = await res.json();
      if (orderResult.requiresPayment && orderResult.paymentUrl) {
        window.location.href = orderResult.paymentUrl;
      }
    } catch (err) {
      console.error("Error creating order:", err);
      setError(err instanceof Error ? err.message : "Abo-Zahlung konnte nicht gestartet werden.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-blue-200 p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#204878] mb-1">
            {isRenewal ? 'Monatsabo abgelaufen' : 'Zahlung erforderlich'}
          </DialogTitle>
          <DialogDescription className="text-black">
            {isRenewal
              ? 'Ihr Monatsabo ist abgelaufen. Um den Self-Service weiterhin nutzen zu können, erneuern Sie bitte Ihr Abo.'
              : 'Um Lebenslauf-Export und KI-Motivationsschreiben zu nutzen, schliessen Sie bitte zuerst das Monatsabo ab.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-lg px-4 py-3 mr-auto">
              {error}
            </p>
          )}
          <Button
            onClick={handlePay}
            disabled={loading}
            className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg py-3 transition duration-200 px-6"
          >
            {loading ? 'Weiterleitung...' : isRenewal ? 'Abo erneuern' : 'Abo abschliessen'}
          </Button>
          <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg py-3 transition duration-200 px-6">
            Abbrechen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
