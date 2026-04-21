export interface MenuOption {
  key: string;
  href: string;
}

export const Options: MenuOption[] = [
  {
    key: "nav.home",
    href: "#hero",
  },
  {
    key: "nav.projects",
    href: "#projects",
  },
  {
    key: "nav.about",
    href: "#about",
  },
  {
    key: "nav.contact",
    href: "#contact",
  },
];