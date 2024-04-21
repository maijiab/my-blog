import { navItems } from "@/components/navbar/config";
import { NextLink } from "@/components/next-link";


export const Footer = async () => {
    return (
      <footer className="w-full flex flex-col  py-8 max-w-screen-xl mx-auto text-muted-foreground">
        <ul className="flex space-x-2 items-center justify-center">
          {navItems.map((el, idx) => (
            <li key={el.link}>
              {Boolean(idx) && <span className="mr-2">·</span>}
              <NextLink aria-label={el.label} href={el.link} className="px-0">
                {el.label}
              </NextLink>
            </li>
          ))}
        </ul>
      </footer>
    );
}