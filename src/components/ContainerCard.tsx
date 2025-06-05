export function ContainerCard({
  title,
  children,
  suffix,
}: {
  title: string;
  children: any;
  suffix?: any;
}) {
  return (
    <div className="max-h-fit rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="flex flex-row justify-between items-center border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">{title}</h3>
        {suffix}
      </div>
      <div>{children}</div>
    </div>
  );
}
