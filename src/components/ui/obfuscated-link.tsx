'use client';

/**
 * Enlace ofuscado: un <span> sin href que abre la URL al hacer clic (o Enter).
 * Para atribuciones obligatorias que no deben pasar autoridad ni contar como
 * enlace saliente para los buscadores. La URL va en base64 en el atributo.
 */
export function ObfuscatedLink({ href, children, className = '' }: { href: string; children: React.ReactNode; className?: string }) {
  const code = typeof btoa === 'function' ? btoa(href) : Buffer.from(href).toString('base64');
  const open = (e: React.SyntheticEvent<HTMLSpanElement>) => {
    const url = atob(e.currentTarget.dataset.o ?? '');
    if (url) window.open(url, '_blank', 'noopener');
  };
  return (
    <span
      role="link"
      tabIndex={0}
      data-o={code}
      onClick={open}
      onKeyDown={(e) => { if (e.key === 'Enter') open(e); }}
      className={`cursor-pointer underline decoration-dotted underline-offset-2 hover:text-[var(--color-fg)] ${className}`}
    >
      {children}
    </span>
  );
}
