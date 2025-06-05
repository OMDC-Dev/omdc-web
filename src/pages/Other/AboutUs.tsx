import React from 'react';
import Logo from '../../images/logo/logo.jpg';

const AboutUs: React.FC = () => {
  return (
    <div className=" bg-boxdark h-[100dvh] flex flex-col justify-center">
      <div className=" xl:grid xl:place-items-center  rounded-sm bg-boxdark dark:bg-boxdark">
        <div className=" grid min-h-screen w-full place-items-center">
          <div>
            <div className="grid place-items-center p-4 mb-4">
              <div className=" mb-4">
                <img
                  className="hidden dark:block h-20 w-20"
                  src={Logo}
                  alt="Logo"
                />
              </div>
              <h2 className="text-xl font-medium text-black dark:text-white">
                Tentang OMDC App
              </h2>
            </div>

            <div className="w-96 rounded-md bg-graydark p-6 shadow-lg">
              <form>
                <div className="mb-8">
                  <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                    Nomor Telpon
                  </label>
                  <p className=" text-white font-bold">+6281210205300</p>
                </div>
                <div className="mb-8">
                  <label className="mb-2.5 block text-sm font-medium text-black dark:text-white">
                    Email
                  </label>
                  <p className=" text-white font-bold">
                    tidakpernahsibuk@gmail.com
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
