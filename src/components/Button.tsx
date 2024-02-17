function Button({
  onClick,
  children,
  className,
  disabled,
}: {
  onClick?: any;
  children?: any;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      className={`w-full cursor-pointer rounded-lg border ${
        disabled
          ? 'bg-slate-600 border-0'
          : 'bg-primary border-primary text-white'
      } p-1  transition hover:bg-opacity-90 ${className}`}
    >
      {children}
    </button>
  );
}

export default Button;
