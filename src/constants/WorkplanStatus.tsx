export enum WORKPLAN_STATUS {
  ON_PROGRESS = 1,
  PENDING = 2,
  FINISH = 3,
  REVISON = 4,
  REJECTED = 5,
}

export function getWorkplanStatusText(status: any) {
  let STATUS_TEXT = '';
  let STATUS_COLOR = '';

  switch (status) {
    case WORKPLAN_STATUS.ON_PROGRESS:
      STATUS_TEXT = 'Dalam Proses';
      STATUS_COLOR = 'amber';
      break;
    case WORKPLAN_STATUS.PENDING:
      STATUS_TEXT = 'Ditunda';
      STATUS_COLOR = 'deep-orange';
      break;
    case WORKPLAN_STATUS.FINISH:
      STATUS_TEXT = 'Selesai';
      STATUS_COLOR = 'green';
      break;
    case WORKPLAN_STATUS.REVISON:
      STATUS_TEXT = 'Perlu Revisi';
      STATUS_COLOR = 'cyan';
      break;
    case WORKPLAN_STATUS.REJECTED:
      STATUS_TEXT = 'Ditolak';
      STATUS_COLOR = 'red';
      break;
    default:
      STATUS_TEXT = '';
      STATUS_COLOR = '';
      break;
  }

  return { text: STATUS_TEXT, color: STATUS_COLOR };
}
