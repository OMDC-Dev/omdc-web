import React from 'react';
import DefaultLayout from '../../layout/DefaultLayout';
import { useAuth } from '../../hooks/useAuth';

const Reimbursement: React.FC = () => {
  const { user } = useAuth();

  console.log(user);

  return (
    <DefaultLayout>
      <div>p</div>
    </DefaultLayout>
  );
};

export default Reimbursement;
