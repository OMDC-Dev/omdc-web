import { Card, Typography } from '@material-tailwind/react';

export default function SummaryList({
  list,
  activeValue,
  setActiveValue,
}: {
  list: any[];
  activeValue: any;
  setActiveValue: any;
}) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
      {list?.map((item: any, idx: number) => (
        <Card
          onClick={() => setActiveValue(item.status)}
          key={idx}
          className={`shadow-sm p-4 ${
            item.status == activeValue
              ? 'border-blue-600 border-2'
              : 'border-blue-gray-100 border'
          } hover:shadow-md transition-all`}
        >
          <Typography variant="small" color="gray" className="mb-1 font-medium">
            {item.label}
          </Typography>
          <Typography variant="h5" color="blue-gray">
            {item.count}
          </Typography>
        </Card>
      ))}
    </div>
  );
}
