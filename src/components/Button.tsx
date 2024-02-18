function Button({
  onClick,
  children,
  className,
  disabled,
  mode = 'filled',
}: {
  onClick?: any;
  children?: any;
  className?: string;
  disabled?: boolean;
  mode?: string;
}) {
  const filledClass = `w-full cursor-pointer rounded-lg border ${
    disabled ? 'bg-slate-600 border-0' : 'bg-primary border-primary text-white'
  } p-1  transition hover:bg-opacity-90 ${className}`;

  const outlinedClass = `w-full cursor-pointer rounded-md border p-1 transition text-white ${className}`;

  const classMode = mode == 'filled' ? filledClass : outlinedClass;

  return (
    <button disabled={disabled} onClick={onClick} className={classMode}>
      {children}
    </button>
  );
}

export default Button;
