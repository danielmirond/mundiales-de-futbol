'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

export function UpgradeButton({ locale }: { locale: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/porra/checkout?locale=${locale}`, { method: 'POST' });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Error al crear la sesión de pago');
        setLoading(false);
        return;
      }
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <Button size="lg" onClick={handleClick} disabled={loading}>
        {loading ? 'Redirigiendo a Stripe…' : 'Comprar Pase Mundial 2,99€'}
        {!loading && <ArrowRight className="ml-2 h-4 w-4" />}
      </Button>
      {error ? <p className="text-sm text-red-400">{error}</p> : null}
    </div>
  );
}
