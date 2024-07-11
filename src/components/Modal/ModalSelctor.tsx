import {
  Button as MButton,
  Dialog,
  DialogBody,
  DialogFooter,
  DialogHeader,
} from '@material-tailwind/react';
import Modal from './Modal';
import Button from '../Button';

const ModalSelector = ({
  visible,
  toggle,
  type,
  onConfirm,
  onDone,
  code,
}: {
  visible: boolean;
  toggle: any;
  type?: string;
  onConfirm?: any;
  onDone?: any;
  code?: string;
}) => {
  if (!visible) return null;

  if (type == 'LOADING') {
    return <Modal visible={visible} toggle={toggle} />;
  }

  if (type == 'CONFIRM') {
    return (
      <Dialog open={visible} handler={toggle}>
        <DialogHeader>Konfirmasi</DialogHeader>
        <DialogBody>
          Apakah anda yakin ingin mengkonfirmasi tindakan anda?
        </DialogBody>
        <DialogFooter>
          <MButton variant="text" color="red" onClick={toggle} className="mr-1">
            <span>Batalkan</span>
          </MButton>
          <MButton variant="gradient" color="green" onClick={onConfirm}>
            <span>Konfirmasi</span>
          </MButton>
        </DialogFooter>
      </Dialog>
    );
  }

  if (type == 'SUCCESS' || type == 'OK') {
    return (
      <Dialog
        open={visible}
        size={'xs'}
        handler={toggle}
        dismiss={{ enabled: false }}
      >
        <DialogHeader>Sukses</DialogHeader>
        <DialogBody>Permintaan anda telah sukses dilakukan!</DialogBody>
        <DialogFooter>
          <Button
            onClick={(e: any) => {
              e.preventDefault();
              toggle();
              onDone();
            }}
          >
            Ok
          </Button>
        </DialogFooter>
      </Dialog>
    );
  }

  if (type == 'SUCCESSCODE') {
    return (
      <Dialog
        open={visible}
        size={'xs'}
        handler={toggle}
        dismiss={{ enabled: false }}
      >
        <DialogHeader>Sukses</DialogHeader>
        <DialogBody>
          Permintaan anda telah sukses dilakukan dengan nomor pengajuan
          <div className="text-black font-bold">{code}</div>
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={(e: any) => {
              e.preventDefault();
              toggle();
              onDone();
            }}
          >
            Ok
          </Button>
        </DialogFooter>
      </Dialog>
    );
  }

  if (type == 'FAILED' || type == 'ERROR') {
    return (
      <Dialog
        open={visible}
        size={'xs'}
        handler={toggle}
        dismiss={{ enabled: false }}
      >
        <DialogHeader>Gagal</DialogHeader>
        <DialogBody>
          Permintaan anda gagal dilakukan, mohon coba lagi!
        </DialogBody>
        <DialogFooter>
          <Button
            onClick={(e: any) => {
              e.preventDefault();
              toggle();
            }}
          >
            Ok
          </Button>
        </DialogFooter>
      </Dialog>
    );
  }
};

export default ModalSelector;
