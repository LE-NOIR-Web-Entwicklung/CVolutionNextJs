import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';


interface PaymentModalProps {
  open: boolean;
  onClose: () => void;
  user: any;
  profile: any;
}


export const PaymentModal: React.FC<PaymentModalProps> = ({ open, onClose, user, profile }) => {
  const handlePay = () => {
    if (typeof window !== "undefined") {
      localStorage.setItem("confirmationEmail", user?.email || "");
      localStorage.setItem("confirmationService", "self");
      localStorage.setItem("confirmationName",  profile?.user_id|| "");
      window.location.href = "https://www.saferpay.com/SecurePayGate/MultiUsePayment/364685/17772867/95543d79-3a8d-4502-a8a1-aee08db29925";
    }
  };
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-lg bg-white rounded-3xl shadow-2xl border-2 border-blue-200 p-8">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#204878] mb-1">Zahlung erforderlich</DialogTitle>
          <DialogDescription className="text-black">
            Um Ihren Lebenslauf zu exportieren, führen Sie bitte zuerst die Zahlung aus.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            onClick={handlePay}
            className="bg-[#204878] hover:bg-[#4c6c93] text-white font-bold rounded-lg py-3 transition duration-200 px-6"
          >
            Zahlung ausführen
          </Button>
          <Button onClick={onClose} className="bg-gray-200 hover:bg-gray-300 text-black font-bold rounded-lg py-3 transition duration-200 px-6">
            Abbrechen
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
