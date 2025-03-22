import * as React from 'react';

function ActionCard({ children, title }: { children: any; title: any }) {
  return (
    <div className="bg-white p-4.5 rounded-lg mb-4.5 flex flex-row justify-between items-center">
      <div className=" font-bold text-boxdark-2">{title}</div>
      <div className="flex flex-row gap-2.5">{children}</div>
    </div>
  );
}

export default ActionCard;
