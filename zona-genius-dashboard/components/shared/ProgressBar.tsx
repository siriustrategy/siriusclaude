interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full">
      {label && <p className="text-sm font-medium text-gray-700 mb-2">{label}</p>}
      <div className="progress-bar">
        <div className="progress-bar-fill" style={{ width: `${percentage}%` }} />
      </div>
      <p className="text-xs text-gray-500 mt-1">
        {current} de {total}
      </p>
    </div>
  );
}
