"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ClickOutside from "../ClickOutside";
import {
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineUserCircle,
  HiOutlineUserGroup,
  HiOutlineViewGrid,
} from "react-icons/hi";
import { useRouter } from "next/navigation";
import apiClient from "@/app/lib/axiosConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { HiArrowLeft } from "react-icons/hi";

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (arg: boolean) => void;
}

const Sidebar = ({ sidebarOpen, setSidebarOpen }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await apiClient.post("/auth/logout");
      if (response.status === 200) {
        toast.success("Logout successful!");
        setTimeout(() => router.push("/pages/admin/auth/signin"), 2000);
      }
    } catch (err) {
      toast.error("An error occurred during logout.");
    }
  };

  interface MenuItem {
    id: string;
    icon: JSX.Element;
    label: string;
    route: string;
    onClick?: () => Promise<void>; 
  }
  
  interface MenuGroup {
    name?: string;
    menuItems: MenuItem[];
  }
  
  const menuGroups: MenuGroup[] = [
    {
      name: "MENU",
      menuItems: [
        {
          id: "dashboard",
          icon: <HiOutlineViewGrid className="text-2xl" />,
          label: "Dashboard",
          route: "/pages/admin/dashboard",
        },
        {
          id: "profile",
          icon: <HiOutlineUserCircle className="text-2xl" />,
          label: "Profile",
          route: "/pages/admin/profile",
        },
        {
          id: "users",
          icon: <HiOutlineUserGroup className="text-2xl" />,
          label: "Users",
          route: "/pages/admin/users",
        },
        {
          id: "settings",
          icon: <HiOutlineCog className="text-2xl" />,
          label: "Settings",
          route: "/pages/admin/settings",
        },
      ],
    },
    {
      menuItems: [
        {
          id: "logout",
          icon: <HiOutlineLogout className="text-2xl" />,
          label: "Log Out",
          route: "#",
          onClick: handleLogout,
        },
      ],
    },
  ];

  return (
    <ClickOutside onClick={() => setSidebarOpen(false)}>
      <aside
        className={`fixed left-0 top-0 z-9999 flex h-screen w-72.5 flex-col overflow-y-hidden bg-black duration-300 ease-linear dark:bg-boxdark lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* <!-- SIDEBAR HEADER --> */}
        <div className="flex items-center justify-between gap-2 px-6 py-5.5 lg:py-6.5">
          <Link href="/">
            <Image
              width={160}
              height={32}
              src={"/images/logo/logo-txt-white.png"}
              alt="Logo"
              priority
            />
          </Link>

          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            className="block lg:hidden"
          >
            <HiArrowLeft className="text-gray text-2xl" />
          </button>
        </div>
        {/* <!-- SIDEBAR HEADER --> */}

        <div className="no-scrollbar flex flex-col overflow-y-auto duration-300 ease-linear">
          {/* <!-- Sidebar Menu --> */}
          <nav className="mt-5 px-4 py-4 lg:mt-9 lg:px-6">
            {menuGroups.map((group, groupIndex) => (
              <div key={groupIndex}>
                <h3 className="mb-4 ml-4 text-sm font-semibold text-bodydark2">
                  {group.name}
                </h3>

                <ul className="mb-6 flex flex-col gap-1.5">
                  {group.menuItems.map((menuItem) => (
                    <li key={menuItem.id} className="flex items-center">
                      <a
                        href={menuItem.route}
                        onClick={(e) => {
                          if (menuItem.onClick) {
                            e.preventDefault();
                            menuItem.onClick(); 
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-white hover:bg-gray-700 rounded"
                      >
                        {menuItem.icon}
                        <span>{menuItem.label}</span>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          {/* <!-- Sidebar Menu --> */}
        </div>
      </aside>
    </ClickOutside>
  );
};

export default Sidebar;
