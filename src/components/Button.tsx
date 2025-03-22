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
    disabled || isLoading
      ? 'bg-opacity-50 bg-blue-gray-200 border-0 cursor-not-allowed'
      : 'hover:bg-opacity-90 cursor-pointer'
  } w-full rounded-lg border bg-primary border-primary text-white p-1 transition ${className}`;

  const outlinedClass = `w-full rounded-md border p-1 transition text-black ${
    disabled || isLoading ? 'cursor-not-allowed' : 'cursor-pointer'
  } ${className}`;

  const classMode = mode === 'filled' ? filledClass : outlinedClass;

  return (
    <button
      disabled={disabled || isLoading}
      onClick={onClick}
      className={classMode}
    >
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spinner className="h-5 w-5 text-white" />
        </div>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
