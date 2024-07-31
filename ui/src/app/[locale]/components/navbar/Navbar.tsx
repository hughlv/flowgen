'use client';

import { usePathname } from 'next/navigation';
import { pathToRegexp } from 'path-to-regexp';

import AuthButton from './AuthButton';
import GeneralMenu from './GeneralMenu';
import ProjectMenu from './ProjectMenu';
import ThemeSwitcher from '../../../../components/ThemeSwitcher';
import NavLogo from './NavLogo';
import NavButton from './NavButton';
import { useTranslations } from 'next-intl';
import ProjectPicker from './ProjectPicker';

const apiEndpoint = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://localhost:5004';

const Navbar = () => {
  const pathname = usePathname();
  const regexResult = pathToRegexp(
    '/projects/:projectId{/:feature}?{/:sub}?'
  ).exec(pathname);
  const projectId =
    regexResult && regexResult.length >= 2 ? parseInt(regexResult[1], 10) : null;

  const NavMenu = projectId ? ProjectMenu : GeneralMenu;

  const t = useTranslations('component.Navbar');
  return (
    <div className="z-50 navbar flex w-full items-center justify-between px-2">
      <div className="navbar-start gap-2 flex items-center justify-start">
        <NavButton projectId={projectId} className="lg:hidden" />
        <NavLogo />
        <ProjectPicker
          activeProjectId={projectId}
          className="py-1 px-2 text-sm border border-base-content/20 hover:border-base-content/50 rounded"
        />
      </div>
      <div className="navbar-center gap-4 hidden lg:flex">
        <NavMenu projectId={projectId} />
      </div>
      <div className="navbar-end flex items-center my-auto gap-4">
        <a
          href="https://agentok.ai/"
          target="_blank"
          rel="noreferrer"
          className="link link-hover text-xs hidden md:block"
        >
          {t('docs')}
        </a>
        <a
          href={apiEndpoint}
          target="_blank"
          rel="noreferrer"
          className="link link-hover text-xs hidden md:block"
        >
          API
        </a>
        <a
          href="https://github.com/hughlv/agentok"
          aria-label="github"
          target="_blank"
          className="hidden md:block"
        >
          <img
            src="https://img.shields.io/github/stars/hughlv/agentok?style=flat&logo=github&color=black&labelColor=gray&label=Stars"
            alt="github"
            className="rounded h-5"
          />
        </a>
        {/* <ThemeSwitcher /> */}
        <AuthButton />
      </div>
    </div>
  );
};

export default Navbar;
