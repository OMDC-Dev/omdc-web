import * as React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { COA } from '../../api/routes';
import Button from '../../components/Button';
import ModalSelector from '../../components/Modal/ModalSelctor';
import StatusGroup from '../../components/SelectGroup/StatusGroup';
import { API_STATES } from '../../constants/ApiEnum';
import useFetch from '../../hooks/useFetch';
import useModal from '../../hooks/useModal';
import DefaultLayout from '../../layout/DefaultLayout';

function SuperCOAUpdate() {
  const location = useLocation();
  const nav = useNavigate();

  const state = location.state;

  // === COA INPUT
  const [idCOA, setIdCOA] = React.useState<any>(state.id_coa);
  const [accName, setAccName] = React.useState<any>(state.accountname);
  const [desc, setDesc] = React.useState<any>(state.description);
  const [statusCOA, setStatusCOA] = React.useState<any>(state.status);

  // === Modal
  const { toggle, changeType, visible, type } = useModal();

  if (!state) {
    nav('/coa', { replace: true });
  }

  async function createAccount() {
    changeType('LOADING');

    const body = {
      accountname: accName,
      description: desc,
      status: statusCOA,
    };

    const { state, data, error } = await useFetch({
      url: COA + `/${idCOA}`,
      method: 'POST',
      data: body,
    });

    if (state == API_STATES.OK) {
      changeType('SUCCESS');
    } else {
      changeType('FAILED');
    }
  }

  return (
    <DefaultLayout>
      <div className="rounded-md border mb-6 border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="border-b border-stroke py-4 px-6.5 dark:border-strokedark">
          <h3 className="font-medium text-black dark:text-white">
            Tambah COA Baru
          </h3>
        </div>
        <div className=" p-6.5 flex flex-col gap-y-6">
          <div className="w-full">
            <label className="mb-2.5 block text-black dark:text-white">
              ID COA
            </label>
            <input
              type="text"
              disabled
              placeholder="Masukan ID COA"
              className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setIdCOA(e.target.value)}
              value={idCOA}
            />
          </div>

          <div className="w-full">
            <label className="mb-2.5 block text-black dark:text-white">
              Nama COA
            </label>
            <input
              type="text"
              placeholder="Masukan Nama COA"
              className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setAccName(e.target.value)}
              value={accName}
            />
          </div>

          <div className="w-full">
            <label className="mb-2.5 block text-black dark:text-white">
              Deskripsi
            </label>
            <input
              type="text"
              placeholder="Masukan Deskripsi"
              className="w-full rounded-md border-[1.5px] border-stroke bg-transparent py-2 px-5 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
              onChange={(e) => setDesc(e.target.value)}
              value={desc}
            />
          </div>

          <div className="w-full">
            <StatusGroup
              value={statusCOA}
              onChange={(e: any) => setStatusCOA(e.target.value)}
            />
          </div>

          <div className=" w-full">
            <Button
              disabled={!idCOA || !accName || !desc || !statusCOA}
              onClick={(e: any) => {
                e.preventDefault();
                changeType('CONFIRM');
                toggle();
              }}
            >
              Update COA
            </Button>
          </div>
        </div>
      </div>
      <ModalSelector
        visible={visible}
        toggle={toggle}
        type={type}
        onConfirm={() => createAccount()}
        onDone={() => {
          nav('/coa', { replace: true });
        }}
      />
    </DefaultLayout>
  );
}

export default SuperCOAUpdate;
