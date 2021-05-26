import React, { useState, useEffect, useRef } from "react";
import useSWR from "swr";

import { SignalStrength, Modal, Icon } from "./components";

import { ICONS } from "./constants";
import fetcher from "./utils/fetcher";
import config from "./config";

import { INetwork, IForm } from "./interfaces/network.interfaces";

const isSecured = (secure: number) => (secure !== 7 ? true : false);

const Placeholder = () => (
  <li
    tabIndex={-1}
    className="flex px-5 py-6 text-white cursor-pointer pointer-events-none bg-primary-200 rounded-4xl"
  >
    <div className="flex-shrink-0">
      <div className="relative overflow-hidden bg-opacity-50 rounded-md bg-placeholder w-7 h-7 bg-primary-100"></div>
    </div>
    <div className="flex-grow ml-2">
      <div className="relative w-40 h-5 overflow-hidden bg-opacity-50 rounded-md bg-placeholder bg-primary-100"></div>
      <div className="relative w-24 h-4 mt-2 overflow-hidden bg-opacity-50 rounded-md bg-placeholder bg-primary-100"></div>
    </div>
  </li>
);

const Loader = () => (
  <svg
    className="animate-spin h-5 w-5"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    ></circle>
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    ></path>
  </svg>
);

export default function Home() {
  const inputPassphrase = useRef<HTMLInputElement>(null);
  const { data: networks, error } = useSWR(config.ENDPOINT_SCAN, fetcher);

  const [isModalLoading, setModalLoading] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [credential, setCredential] = useState({
    submitted: false,
    success: false,
  });

  const [formData, setformData] = useState<IForm>({
    rssi: 0,
    ssid: "",
    bssid: "",
    channel: 0,
    secure: 0,
    hidden: false,
    psk: "",
  });

  const onChooseNetwork = (networkInfo: INetwork) => {
    setModalOpen(true);
    setformData({ ...networkInfo, psk: "" });
  };

  const closeModal = () => {
    setModalOpen(false);
    setformData({ ...formData, psk: "" });

    setTimeout(() => {
      setCredential({
        submitted: false,
        success: false,
      });
    }, 200);
  };

  const reboot = () => {
    setModalLoading(true);

    fetch("/api/reboot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: null,
    });
  };

  const handlePassphraseChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setformData({ ...formData, psk: e.target.value });
  };

  const sendCredential = async () => {
    const { ssid, psk, secure } = formData;
    const data = isSecured(secure) ? { ssid, psk } : { ssid };

    setModalLoading(true);
    fetch(config.ENDPOINT_CONNECT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setCredential({
          submitted: true,
          success: data.success,
        });
        console.log("Success:", data);
        setModalLoading(false);
      })
      .catch((error) => {
        console.error("Error:", error);
        setModalLoading(false);
      });
  };

  useEffect(() => {
    setTimeout(() => {
      if (isSecured(formData.secure)) {
        inputPassphrase.current?.focus();
      }
    }, 100);
  }, [isModalOpen]);

  if (error) return <div>failed to load</div>;

  return (
    <>
      <div className="Home">
        <div className="flex items-center justify-between mx-5 mt-12">
          <h1 className="text-lg font-semibold">Available Networks</h1>
        </div>
        <ul className="mx-8 my-6 space-y-4">
          {networks ? (
            networks.map((n: INetwork, index: number) => (
              <li
                tabIndex={isModalOpen ? -1 : 1}
                key={index}
                onClick={() => onChooseNetwork(n)}
                onKeyUp={(e) => (e.key === "Enter" ? onChooseNetwork(n) : null)}
                className={`${
                  isModalLoading ? "f" : null
                } flex pl-5 pr-6 py-6 text-white cursor-pointer bg-primary-200 rounded-4xl focus:outline-none focus:ring-2 ring-indigo-500 ring-opacity-50 ring-offset-primary-100 ring-offset-2 hover:opacity-75`}
              >
                <div className="flex-shrink-0">
                  <SignalStrength secure={isSecured(n.secure)} dbm={n.rssi} />
                </div>
                <div className="ml-3">
                  <h3 className="text-base font-medium tracking-wide text-white">
                    {n.ssid}
                  </h3>
                  <h6 className="mt-1 text-xs text-gray-500">{n.bssid}</h6>
                  <span>{n.hidden}</span>
                </div>
              </li>
            ))
          ) : (
            <>
              <Placeholder />
              <Placeholder />
            </>
          )}
        </ul>
      </div>
      <Modal isOpen={isModalOpen} handleClose={closeModal}>
        {isModalLoading ? (
          <div className="flex items-center justify-center text-white">
            <Loader />
          </div>
        ) : credential.submitted ? (
          <div className="pt-5 bg-white rounded-xl rounded-b-2xl">
            <h3 className="text-gray-900 font-medium text-lg mx-5 text-left">
              {formData.ssid}
            </h3>
            <div className="flex items-center text-xs tracking-wider text-green-500 pb-3 mx-5">
              <Icon className="w-4 h-4 mb-0.5 mr-1" icon={ICONS.TICK} />
              SAVED
            </div>
            <p className="mx-5 text-gray-400">
              Wifi credential successfully saved. Reboot to connect to the
              network.
            </p>

            <div className="flex flex-col mt-5 border-t border-t-gray-300">
              <button
                onClick={() => closeModal()}
                type="reset"
                className="px-5 py-3 text-sm text-center bg-white rounded-none focus:outline-none focus:bg-gray-200 hover:bg-gray-100"
              >
                Choose to another network
              </button>
              <button
                onClick={() => reboot()}
                type="button"
                className="px-5 py-3 text-sm text-center font-medium text-indigo-500 bg-white rounded-none rounded-b-xl border-t focus:outline-none focus:bg-gray-200 hover:bg-gray-100"
              >
                Reboot
              </button>
            </div>
          </div>
        ) : (
          <form
            onSubmit={(e) => (e.preventDefault(), sendCredential())}
            action="#"
            method="post"
            className="pt-5 bg-white rounded-xl rounded-b-2xl"
          >
            <h3 className="text-gray-900 font-medium text-lg mx-5 text-left">
              {formData.ssid}
            </h3>

            {isSecured(formData.secure) ? (
              <>
                <div className="flex items-center text-xs tracking-wider text-green-500 pb-3 mx-5">
                  <Icon className="w-4 h-4 mb-0.5 mr-1" icon={ICONS.LOCK} />
                  SECURED
                </div>
                <p className="mx-5 text-gray-400">
                  Enter the network security key.
                </p>
                <div className="mx-5">
                  <label className="hidden">Passphrase</label>
                  <div className="flex mt-1 rounded-md shadow-sm">
                    <span className="inline-flex items-center px-3 text-sm text-gray-500 border border-r-0 border-gray-300 rounded-l-md bg-gray-50">
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M7.61256 8.3869C5.62113 8.3869 4.00049 10.0075 4.00049 11.999C4.00049 13.9918 5.62113 15.6124 7.61256 15.6124C9.24015 15.6124 10.6039 14.5237 11.0538 13.0405H13.9868V14.5709C13.9868 15.1458 14.4534 15.6124 15.0284 15.6124C15.6033 15.6124 16.0699 15.1458 16.0699 14.5709V13.0405H17.9169V14.5709C17.9169 15.1458 18.3835 15.6124 18.9585 15.6124C19.5334 15.6124 20 15.1458 20 14.5709V11.999C20 11.424 19.5334 10.9574 18.9585 10.9574H11.0538C10.6039 9.47566 9.24015 8.3869 7.61256 8.3869ZM7.6127 10.4699C8.45566 10.4699 9.14308 11.1559 9.14308 12.0002C9.14308 12.8432 8.45566 13.5292 7.6127 13.5292C6.76975 13.5292 6.08233 12.8432 6.08233 12.0002C6.08233 11.1559 6.76975 10.4699 7.6127 10.4699Z"
                          fill="currentColor"
                        />
                      </svg>
                    </span>
                    <input
                      ref={inputPassphrase}
                      onChange={handlePassphraseChange}
                      value={formData.psk}
                      type="password"
                      className="flex-1 block w-full border-gray-300 rounded-none focus:ring-indigo-500 focus:border-indigo-500 rounded-r-md sm:text-sm focus:outline-none border py-2 px-3"
                    />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center text-xs tracking-wider text-yellow-500 pb-3 mx-5">
                  <Icon className="w-4 h-4 mb-0.5 mr-1" icon={ICONS.UNLOCK} />
                  OPEN
                </div>
                <p className="mx-5 text-gray-400">
                  Other people might be able to see info you send over this
                  network.
                </p>
              </>
            )}

            <div className="flex mt-5 border-t border-t-gray-300">
              <button
                onClick={() => closeModal()}
                type="reset"
                style={{ flexBasis: "50%" }}
                className="px-5 py-3 text-sm font-medium bg-white rounded-none rounded-bl-xl focus:outline-none focus:bg-gray-200 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                style={{ flexBasis: "50%" }}
                className="flex justify-center px-5 py-3 text-sm font-medium text-indigo-500 bg-white border-l rounded-none rounded-br-xl focus:outline-none focus:bg-gray-200 hover:bg-gray-100"
              >
                Connect
              </button>
            </div>
          </form>
        )}
      </Modal>
      {/* <Modal
        isOpen={true}
        title="Reboot now?"
        handleClose={closeModal}
        description="Enter the network security key."
        titleStyle="left"
      >
        <div>ok</div>
      </Modal> */}
    </>
  );
}
