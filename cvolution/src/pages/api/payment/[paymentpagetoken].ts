import { useRouter } from 'next/router';
import { useEffect } from 'react';

export default function PaymentTokenPage() {
  const router = useRouter();
  const { paymentpagetoken } = router.query;

  useEffect(() => {
    if (typeof paymentpagetoken === 'string') {
      // Optional: API-Call, falls du noch etwas validieren willst
      // fetch(`/api/payment/${paymentpagetoken}`);

      // Im localStorage speichern
      localStorage.setItem('paymentpagetoken', paymentpagetoken);
    }
  }, [paymentpagetoken]);
}