import { Spinner } from '@material-tailwind/react';

function Button({
  onClick,
  children,
  className,
  disabled,
  mode = 'filled',
  isLoading,
}: {
  onClick?: any;
  children?: any;
  className?: string;
  disabled?: boolean;
  mode?: string;
  isLoading?: boolean;
}) {
  const filledClass = `${
    disabled ? 'bg-opacity-50 bg-blue-gray-200 border-0' : 'hover:bg-opacity-90'
  } w-full rounded-lg border bg-primary border-primary text-white cursor-pointer p-1  transition ${className}`;

  const outlinedClass = ` w-full cursor-pointer rounded-md border p-1 transition text-black ${className}`;

  const classMode = mode == 'filled' ? filledClass : outlinedClass;

  return (
    <button disabled={disabled} onClick={onClick} className={classMode}>
      {children}
    </button>
  );
}

export default Button;
