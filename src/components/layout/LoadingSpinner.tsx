import { VscRefresh } from 'react-icons/vsc';

interface LoadingSpinnerProps {
  isLarge?: boolean;
}

export function LoadingSpinner({ isLarge = false }: Readonly<LoadingSpinnerProps>) {
  const sizeClasses = isLarge ? 'w-16 h-16' : 'w-10 h-10';

  return (
    <div className="flex justify-center p-2">
      <VscRefresh className={`animate-spin ${sizeClasses}`} />
    </div>
  );
}
