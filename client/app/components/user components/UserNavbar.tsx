"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiOutlineMenu, HiChevronDown } from "react-icons/hi";
import DropdownUser from "./DropdownUser";

const UserNavbar = () => {
  const [activeLink, setActiveLink] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const currentPath = usePathname();

  useEffect(() => {
    import("flowbite").then(({initFlowbite}) => {
      initFlowbite();
    });

    setActiveLink(currentPath);
  }, [currentPath]);

  return (
    <div className="navbar-container bg-[#00ABCD] z-99">
      <nav className="bg-[#00ABCD] border-gray">
        <div className="w-full flex justify-between items-center px-4 md:px-0 md:w-3/4 mx-auto">
          {/* Logo */}
          <Link className="block flex-shrink-0 md:mr-10" href="/pages/user">
            <Image
              width={50}
              height={32}
              src={"/images/logo/logo.png"}
              alt="Logo"
            />

          </Link>

          {/* Menu button for mobile */}
          <button
            type="button"
            className="flex absolute left-16 items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-controls="navbar-dropdown"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {!isMenuOpen && (
              // "X" Icon when the menu is open
              <HiOutlineMenu className="text-xl" />
            )}
          </button>

          {/* Navbar items */}
          <div
            className={`${
              isMenuOpen
                ? "block bg-[#1C2434] fixed z-999 text-white !w-56 h-1.2 top-0 left-0 p-5 rounded-br-[10px] md:bg-transparent md:h-auto md:p-0 md:relative transition-all duration-300 ease-in-out"
                : "hidden"
            } w-full md:flex md:items-center md:w-auto`}
            id="navbar-dropdown"
          >
            <button
              type="button"
              className="inline-flex absolute right-0 items-center p-2 text-sm text-gray-500 rounded-lg md:hidden hover:bg-graydark focus:outline-none"
              aria-controls="navbar-dropdown"
              aria-expanded={isMenuOpen}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
             
            </button>
            <div className="flex-10 lg:w-203 py-4">
              <ul className="flex flex-col justify-between gap-y-6 gap-x-4 mt-4 md:flex-row md:space-x-2 md:mt-0 text-sm font-medium ">
                <li className="flex items-center justify-center">
                  <Link
                    href="/pages/user"
                    className={`block py-2  text-white hover:text-[#22577A] ${
                      currentPath === "/pages/user"
                        ? "border-b-4 border-[#22577A]"
                        : ""
                    }`}
                  >
                    Dashboard
                  </Link>
                </li>
                <li className="flex items-center justify-center">
                  <button
                    id="transactionDropdownHoverButton"
                    data-dropdown-toggle="transactionDropdownHover"
                    data-dropdown-trigger="hover"
                    className={`text-white font-medium text-sm text-center inline-flex items-center py-2 hover:text-[#22577A] ${
                      currentPath === "/pages/user/transaction/transactionList" ||
                      currentPath === "/pages/user/transaction/addTransaction"
                        ? "border-b-4 border-[#22577A]"
                        : ""
                    }`}
                    type="button"
                  >
                    Transaction <HiChevronDown className="text-xl" />
                  </button>
                  <div
                    id="transactionDropdownHover"
                    className="hidden z-10 bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
                  >
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <Link
                          href="/pages/user/transaction/transactionList"
                          className="block px-4 py-2 hover:bg-[#cfeaf2] text-[#22577A]"
                        >
                          Transaction List
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/pages/user/transaction/addTransaction"
                          className="block px-4 py-2 hover:bg-[#cfeaf2] text-[#22577A]"
                        >
                          Add Transaction
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="flex items-center justify-center">
                  <button
                    id="budgetDropdownHoverButton"
                    data-dropdown-toggle="budgetDropdownHover"
                    data-dropdown-trigger="hover"
                    className={`text-white font-medium text-sm text-center inline-flex items-center py-2 hover:text-[#22577A] ${
                      currentPath === "/pages/user/budget/setBudget" ||
                      currentPath === "/pages/user/budget/manageBudget"
                        ? "border-b-4 border-[#22577A]"
                        : ""
                    }`}
                    type="button"
                  >
                    Budget <HiChevronDown className="text-xl" />
                  </button>

                  <div
                    id="budgetDropdownHover"
                    className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
                  >
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="budgetDropdownHoverButton"
                    >
                      <li>
                        <Link
                          href="/pages/user/budget/manageBudget"
                          className="block px-4 py-2 hover:bg-[#cfeaf2] text-[#22577A]"
                        >
                          Manage Budget
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/pages/user/budget/setBudget"
                          className="block px-4 py-2 hover:bg-[#cfeaf2] text-[#22577A]"
                        >
                          Set Budget
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                <li className="flex items-center justify-center">
                  <button
                    id="accountDropdownHoverButton"
                    data-dropdown-toggle="accountDropdownHover"
                    data-dropdown-trigger="hover"
                    className={`text-white font-medium text-sm text-center inline-flex items-center py-2 hover:text-[#22577A] ${
                      currentPath === "/pages/user/account/addAccount" ||
                      currentPath === "/pages/user/account/manageAccount"
                        ? "border-b-4 border-[#22577A]"
                        : ""
                    }`}
                    type="button"
                  >
                    Account <HiChevronDown className="text-xl" />
                  </button>

                  <div
                    id="accountDropdownHover"
                    className="z-10 hidden bg-white divide-y divide-gray-100 rounded-lg shadow w-44"
                  >
                    <ul
                      className="py-2 text-sm text-gray-700 dark:text-gray-200"
                      aria-labelledby="accountDropdownHoverButton"
                    >
                      <li>
                        <Link
                          href="/pages/user/account/manageAccount"
                          className="block px-4 py-2 hover:bg-[#cfeaf2] text-[#22577A]"
                        >
                          Manage Account
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/pages/user/account/addAccount"
                          className="block px-4 py-2 hover:bg-[#cfeaf2] text-[#22577A]"
                        >
                          Add Account
                        </Link>
                      </li>
                    </ul>
                  </div>
                </li>

                {/* Add more similar dropdown menus for Budget and Account */}
                <li className="flex items-center justify-center">
                  <Link
                    href="/pages/user/report"
                    className={`block py-2  text-white hover:text-[#22577A] ${
                      currentPath === "/pages/user/report"
                        ? "border-b-4 border-[#22577A]"
                        : ""
                    }`}
                  >
                    Report
                  </Link>
                </li>
                <li className="flex items-center justify-center sm:block"></li>
              </ul>
            </div>
          </div>
          <DropdownUser />
        </div>
      </nav>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
      />
    </div>
  );
};

export default UserNavbar;
