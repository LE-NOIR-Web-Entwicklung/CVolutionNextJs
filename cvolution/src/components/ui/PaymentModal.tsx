import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';


interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
  profile: any;
  isRenewal?: boolean;
}


export const PaymentModal: React.FC<PaymentModalProps> = ({ open, onClose, user, profile, isRenewal = false }) => {
  const paymentUrl = "https://www.saferpay.com/SecurePayGate/MultiUsePayment/364685/17772867/95543d79-3a8d-4502-a8a1-aee08db29925";

  const handlePay = async () => {
    if (typeof window === "undefined") return;
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: profile?.user_id || "",
          email: user?.email || "",
          serviceType: "self",
          serviceLabel: "self",
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to create order");
      }

      window.location.href = paymentUrl;
    } catch (err) {
      console.error("Error creating order:", err);
      window.location.href = paymentUrl;
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
              ? 'Ihr Monatsabo ist abgelaufen. Um Ihren Lebenslauf weiterhin exportieren zu können, erneuern Sie bitte Ihr Abo.'
              : 'Um Ihren Lebenslauf zu exportieren, führen Sie bitte zuerst die Zahlung aus.'}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handlePay}
            className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg py-3 transition duration-200 px-6"
          >
            {isRenewal ? 'Abo erneuern' : 'Zahlung ausführen'}
          </Button>
          <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg py-3 transition duration-200 px-6">
            Abbrechen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
