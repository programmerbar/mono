import React, { useState, useEffect } from "react";
import logo from "../assets/programmerbar-logo.png?url";
import { Menu, X } from "lucide-react";

const links = [
  {
    name: "/hjem",
    href: "/",
  },
  {
    name: "/meny",
    href: "/meny",
  },
  {
    name: "/booking",
    href: "https://forms.gle/BLdygdoRJgjMbQZj6",
  },
  {
    name: "/om-oss",
    href: "/om-oss",
  },
];

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 0,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (windowWidth > 768) {
      setIsOpen(false);
    }
  }, [windowWidth]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div
      className={`${isOpen ? "fixed z-30 flex h-full min-h-full w-full flex-col overflow-y-auto bg-background" : ""}`}
    >
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-8">
        <div>
          <a href="/">
            <img className="h-24 w-24" src={logo} alt="Programmerbar logo" />
          </a>
        </div>

        <div>
          <div className="block md:hidden">
            <button
              onClick={toggleMenu}
              className="font-mono text-xl font-medium text-gray-600 hover:underline"
            >
              {isOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
            </button>
          </div>
          <nav className="hidden md:block">
            <ul className="flex items-center gap-4">
              {links.map(({ href, name }) => {
                const isExternal = href.startsWith("http");
                return (
                  <li key={name}>
                    <a
                      className="flex items-center gap-1 stroke-gray-600 stroke-2 font-mono text-xl font-medium text-gray-600 hover:stroke-gray-900 hover:text-gray-800 hover:underline"
                      href={href}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                    >
                      <span>{name}</span>
                      {isExternal && (
                        <svg
                          width="18px"
                          height="18px"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g>
                            <path
                              id="Vector"
                              d="M10.0002 5H8.2002C7.08009 5 6.51962 5 6.0918 5.21799C5.71547 5.40973 5.40973 5.71547 5.21799 6.0918C5 6.51962 5 7.08009 5 8.2002V15.8002C5 16.9203 5 17.4801 5.21799 17.9079C5.40973 18.2842 5.71547 18.5905 6.0918 18.7822C6.5192 19 7.07899 19 8.19691 19H15.8031C16.921 19 17.48 19 17.9074 18.7822C18.2837 18.5905 18.5905 18.2839 18.7822 17.9076C19 17.4802 19 16.921 19 15.8031V14M20 9V4M20 4H15M20 4L13 11"
                            />
                          </g>
                        </svg>
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </header>

      {isOpen && (
        <div className="flex flex-col md:hidden">
          {links.map(({ href, name }) => {
            const isExternal = href.startsWith("http");
            return (
              <a
                key={name}
                className="block p-4 font-mono text-2xl hover:bg-primary hover:text-gray-900"
                href={href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
              >
                {name}
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
};
