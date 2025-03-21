export function ContainerCard({
  title,
  children,
}: {
  title: string;
  children: any;
}) {
  return (
    <div className="max-h-fit rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
      <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
        <h3 className="font-medium text-black dark:text-white">{title}</h3>
      </div>
      <div>{children}</div>
    </div>
  );
}
