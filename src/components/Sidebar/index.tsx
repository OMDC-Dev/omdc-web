import {
  BanknotesIcon,
  BellAlertIcon,
  RectangleGroupIcon,
} from '@heroicons/react/24/outline';
import React, { useEffect, useRef, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { GET_ICON } from '../../api/routes';
import { cekAkses } from '../../common/utils';
import { API_STATES } from '../../constants/ApiEnum';
import { useAuth } from '../../hooks/useAuth';
import useFetch from '../../hooks/useFetch';
import IconArrow from '../../images/sidebar/IconArrow';
import IconBarang from '../../images/sidebar/IconBarang';
import IconSidebar from '../../images/sidebar/IconSidebar';
import useLogo from '../../store/useLogo';
import SidebarLinkGroup from './SidebarLinkGroup';
import { APP_VERSION } from '../../constants/AppEnv';

// Icon

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<any>(null);
  const sidebar = useRef<any>(null);

  const storedSidebarExpanded = localStorage.getItem('sidebar-expanded');
  const [sidebarExpanded, setSidebarExpanded] = useState(
    storedSidebarExpanded === null ? false : storedSidebarExpanded === 'true',
  );

  const [icon, setIcon] = React.useState<any>({ icon: '', iconMobile: '' });

  const { logo, setLogo } = useLogo();

  const { user } = useAuth();
  const IS_ADMIN = user?.isAdmin;
  const IS_SUPER_ADMIN = user?.type == 'SUPERADMIN';
  const IS_REVIEWER = user?.type == 'REVIEWER';

  // check akses
  const hasRequestBarangAkses = cekAkses('#2');
  const hasMasterBarangAkses = cekAkses('#9');
  const hasPengumumanAkses = cekAkses('#3');
  const hasExportExcell = cekAkses('#4');
  const isAdminPB = cekAkses('#7');
  const isAdminWorkplan = cekAkses('#12');
  const hasTrxBarangAkses = cekAkses('#13');

  // close on click outside
  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target) ||
        trigger.current.contains(target)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  // close if the esc key is pressed
  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  useEffect(() => {
    localStorage.setItem('sidebar-expanded', sidebarExpanded.toString());
    if (sidebarExpanded) {
      document.querySelector('body')?.classList.add('sidebar-expanded');
    } else {
      document.querySelector('body')?.classList.remove('sidebar-expanded');
    }
  }, [sidebarExpanded]);

  React.useEffect(() => {
    getIcon();
  }, []);

  async function getIcon() {
    const { state, data, error } = await useFetch({
      url: GET_ICON,
      method: 'GET',
    });

    if (state == API_STATES.OK) {
      setIcon(data);
      setLogo(data.icon);
    } else {
      setIcon(null);
    }
  }

  return (
    <aside
      ref={sidebar}
      className={`absolute left-0 top-0 z-9999 flex h-[100dvh] w-72.5 flex-col overflow-y-hidden bg-boxdark duration-300 ease-linear dark:bg-boxdark lg:static lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      {/* <!-- SIDEBAR HEADER --> */}
      <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
        <NavLink className={' flex items-center gap-x-4'} to="/">
          <img
            className=" h-10 w-10 object-contain"
            src={`data:image/png;base64,${logo}`}
            alt="Logo"
          />
          <span className=" text-title-sm font-bold text-white">
            {APP_VERSION}
          </span>
        </NavLink>

        <button
          ref={trigger}
          onClick={() => setSidebarOpen(!sidebarOpen)}
          aria-controls="sidebar"
          aria-expanded={sidebarOpen}
          className="block lg:hidden"
        >
          <IconSidebar />
        </button>
      </div>
      {/* <!-- SIDEBAR HEADER --> */}

      {IS_SUPER_ADMIN ? (
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            {/* <!-- Menu Group --> */}
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                Menu
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5">
                <li>
                  <NavLink
                    to="/"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname == '/' && 'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <IconBarang />
                    Admin R.O.P
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/adminpb"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes('/adminpb') &&
                      'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <IconBarang />
                    Admin PB
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/reimbursement"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes('/reimbursement') &&
                      'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <IconBarang />
                    Request of Payment
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/rop-attachment"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes('/rop-attachment') &&
                      'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <IconBarang />
                    Upload Manual Attachment ROP
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/departemen"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes('/departemen') &&
                      'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <IconBarang />
                    Departemen
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/coa"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes('/coa') && 'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <IconBarang />
                    COA
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/request-barang"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes('/request-barang') &&
                      'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <IconBarang />
                    Permintaan Barang
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/icon"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes('/icon') && 'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <IconBarang />
                    Ganti Icon
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="/banner"
                    className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                      pathname.includes('/banner') &&
                      'bg-graydark dark:bg-meta-4'
                    }`}
                  >
                    <IconBarang />
                    Banner
                  </NavLink>
                </li>
              </ul>
            </div>
          </nav>
        </div>
      ) : (
        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 py-4 px-4 lg:mt-9 lg:px-6">
            {/* <!-- Menu Group --> */}
            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                R.O.P & Permintaan Barang
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5">
                {/* <!-- Menu Item Dashboard --> */}
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/' || pathname.includes('reimbursement')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/' ||
                              pathname.includes('reimbursement')) &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <BanknotesIcon className=" h-5 w-5" />
                          Request of Payment
                          <IconArrow open={open} />
                        </NavLink>
                        {/* <!-- Dropdown Menu Start --> */}
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && 'hidden'
                          }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            <li>
                              <NavLink
                                to="/"
                                className={({ isActive }) =>
                                  'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                  (isActive && '!text-white')
                                }
                              >
                                Riwayat Pengajuan Saya
                              </NavLink>
                            </li>
                            {hasExportExcell ? (
                              <li>
                                <NavLink
                                  to="/report-reimbursement"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                    (isActive && '!text-white')
                                  }
                                >
                                  Report R.O.P
                                </NavLink>
                              </li>
                            ) : null}
                            {/* ------ BUAT PENGAJUAN --------- */}
                            {IS_ADMIN ? (
                              <>
                                <li>
                                  <NavLink
                                    to="/reimbursement/diajukan/waiting"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Approve R.O.P
                                  </NavLink>
                                </li>
                                <li>
                                  <NavLink
                                    to="/reimbursement/diajukan/done"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Riwayat Approve R.O.P
                                  </NavLink>
                                </li>
                                {IS_REVIEWER && (
                                  <li>
                                    <NavLink
                                      to="/reimbursement/remark-ca"
                                      className={({ isActive }) =>
                                        'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                        (isActive && '!text-white')
                                      }
                                    >
                                      Remark Cash Advance Report
                                    </NavLink>
                                  </li>
                                )}
                              </>
                            ) : null}
                          </ul>
                        </div>
                        {/* <!-- Dropdown Menu End --> */}
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
                {/* <!-- Menu Item Dashboard --> */}

                {/* <!-- Menu Item Calendar --> */}
                {hasRequestBarangAkses ? (
                  <li>
                    <NavLink
                      to="/request-barang"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes('request-barang') &&
                        !pathname.includes('admin') &&
                        'bg-graydark dark:bg-meta-4'
                      }`}
                    >
                      <RectangleGroupIcon className=" h-5 w-5" />
                      Permintaan Barang
                    </NavLink>
                  </li>
                ) : null}
                {hasMasterBarangAkses ? (
                  <li>
                    <NavLink
                      to="/master-barang"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes('master-barang') &&
                        'bg-graydark dark:bg-meta-4'
                      }`}
                    >
                      <RectangleGroupIcon className=" h-5 w-5" />
                      Master Barang
                    </NavLink>
                  </li>
                ) : null}
                {isAdminPB ? (
                  <li>
                    <NavLink
                      to="/admin-request-barang"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes('admin-request-barang') &&
                        'bg-graydark dark:bg-meta-4'
                      }`}
                    >
                      <RectangleGroupIcon className=" h-5 w-5" />
                      Approve Permintaan Barang
                    </NavLink>
                  </li>
                ) : null}
                {(hasTrxBarangAkses || hasRequestBarangAkses) && (
                  <SidebarLinkGroup
                    activeCondition={
                      pathname === '/barang-request' ||
                      pathname.includes('barang-request')
                    }
                  >
                    {(handleClick, open) => {
                      return (
                        <React.Fragment>
                          <NavLink
                            to="#"
                            className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                              (pathname === '/barang-request' ||
                                pathname.includes('barang-request')) &&
                              'bg-graydark dark:bg-meta-4'
                            }`}
                            onClick={(e) => {
                              e.preventDefault();
                              sidebarExpanded
                                ? handleClick()
                                : setSidebarExpanded(true);
                            }}
                          >
                            <RectangleGroupIcon className=" h-5 w-5" />
                            List Permintaan Barang
                            <IconArrow open={open} />
                          </NavLink>
                          {/* <!-- Dropdown Menu Start --> */}
                          <div
                            className={`translate transform overflow-hidden ${
                              !open && 'hidden'
                            }`}
                          >
                            <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                              <li>
                                <NavLink
                                  to="/barang-request/waiting"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                    (isActive && '!text-white')
                                  }
                                >
                                  Dalam Proses
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/barang-request/pending"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                    (isActive && '!text-white')
                                  }
                                >
                                  Pending
                                </NavLink>
                              </li>
                              <li>
                                <NavLink
                                  to="/barang-request/done"
                                  className={({ isActive }) =>
                                    'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                    (isActive && '!text-white')
                                  }
                                >
                                  Selesai
                                </NavLink>
                              </li>
                            </ul>
                          </div>
                          {/* <!-- Dropdown Menu End --> */}
                        </React.Fragment>
                      );
                    }}
                  </SidebarLinkGroup>
                )}
                {/* <!-- Menu Item Dashboard --> */}
                {IS_REVIEWER && (
                  <li>
                    <NavLink
                      to="/rop-attachment"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes('/rop-attachment') &&
                        'bg-graydark dark:bg-meta-4'
                      }`}
                    >
                      <IconBarang />
                      Upload Manual Attachment ROP
                    </NavLink>
                  </li>
                )}
                {/* <!-- Menu Item Calendar --> */}
                {hasPengumumanAkses ? (
                  <li>
                    <NavLink
                      to="/pengumuman"
                      className={`group relative flex items-center gap-2.5 rounded-sm py-2 px-4 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                        pathname.includes('pengumuman') &&
                        'bg-graydark dark:bg-meta-4'
                      }`}
                    >
                      <BellAlertIcon className=" w-5 h-5" />
                      Buat Pengumuman
                    </NavLink>
                  </li>
                ) : null}
              </ul>
            </div>

            <div>
              <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                Work in Progress
              </h3>

              <ul className="mb-6 flex flex-col gap-1.5">
                {/* <!-- Menu Item Dashboard --> */}
                <SidebarLinkGroup
                  activeCondition={
                    pathname === '/workplan/me' || pathname.includes('workplan')
                  }
                >
                  {(handleClick, open) => {
                    return (
                      <React.Fragment>
                        <NavLink
                          to="#"
                          className={`group relative flex items-center gap-2.5 rounded-sm px-4 py-2 font-medium text-bodydark1 duration-300 ease-in-out hover:bg-graydark dark:hover:bg-meta-4 ${
                            (pathname === '/workplan/me' ||
                              pathname.includes('workplan')) &&
                            'bg-graydark dark:bg-meta-4'
                          }`}
                          onClick={(e) => {
                            e.preventDefault();
                            sidebarExpanded
                              ? handleClick()
                              : setSidebarExpanded(true);
                          }}
                        >
                          <BanknotesIcon className=" h-5 w-5" />
                          Work in Progress
                          <IconArrow open={open} />
                        </NavLink>
                        <div
                          className={`translate transform overflow-hidden ${
                            !open && 'hidden'
                          }`}
                        >
                          <ul className="mt-4 mb-5.5 flex flex-col gap-2.5 pl-6">
                            {!isAdminWorkplan ? (
                              <>
                                <li>
                                  <NavLink
                                    to="/workplan/me"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Work In Progress Saya
                                  </NavLink>
                                </li>
                                {/* <li>
                                  <NavLink
                                    to="/workplan/me/waiting"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Dalam Proses
                                  </NavLink>
                                </li>
                                <li>
                                  <NavLink
                                    to="/workplan/me/pending"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Pending
                                  </NavLink>
                                </li>
                                <li>
                                  <NavLink
                                    to="/workplan/me/done"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Selesai
                                  </NavLink>
                                </li>
                                <li>
                                  <NavLink
                                    to="/workplan/me/due"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Due Date
                                  </NavLink>
                                </li> */}
                                <li>
                                  <NavLink
                                    to="/workplan/cc"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Work In Progress CC
                                  </NavLink>
                                </li>
                                {/* <li>
                                  <NavLink
                                    to="/workplan/cc/pending"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    CC Pending
                                  </NavLink>
                                </li>
                                <li>
                                  <NavLink
                                    to="/workplan/cc/done"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    CC Selesai
                                  </NavLink>
                                </li>
                                <li>
                                  <NavLink
                                    to="/workplan/cc/due"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    CC Due Date
                                  </NavLink>
                                </li> */}
                              </>
                            ) : (
                              <>
                                <li>
                                  <NavLink
                                    to="/workplan/approval/medic"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Work In Progress Medis
                                  </NavLink>
                                </li>
                                {/* <li>
                                  <NavLink
                                    to="/workplan/approval/pending/medic"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Pending ( Medis )
                                  </NavLink>
                                </li>
                                <li>
                                  <NavLink
                                    to="/workplan/approval/done/medic"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Selesai ( Medis )
                                  </NavLink>
                                </li>
                                <li>
                                  <NavLink
                                    to="/workplan/approval/due/medic"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Due Date ( Medis )
                                  </NavLink>
                                </li> */}
                                <li>
                                  <NavLink
                                    to="/workplan/approval/nonmedic"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Work In Progress Non Medis
                                  </NavLink>
                                </li>
                                {/* <li>
                                  <NavLink
                                    to="/workplan/approval/pending/nonmedic"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Pending ( Non Medis )
                                  </NavLink>
                                </li>
                                <li>
                                  <NavLink
                                    to="/workplan/approval/done/nonmedic"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Selesai ( Non Medis )
                                  </NavLink>
                                </li>
                                <li>
                                  <NavLink
                                    to="/workplan/approval/due/nonmedic"
                                    className={({ isActive }) =>
                                      'group relative flex items-center gap-2.5 rounded-md px-4 font-medium text-bodydark2 duration-300 ease-in-out hover:text-white ' +
                                      (isActive && '!text-white')
                                    }
                                  >
                                    Due Date ( Non Medis )
                                  </NavLink>
                                </li> */}
                              </>
                            )}
                          </ul>
                        </div>
                      </React.Fragment>
                    );
                  }}
                </SidebarLinkGroup>
              </ul>
            </div>
          </nav>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
