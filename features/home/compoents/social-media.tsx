import {
  IconBarandGithub,
  IconBrandBilibili,
  IconLogoJuejin,
  IconSkillGmailDark,
  IconSkillGmailLight,
} from "@/components/icons";

import { EMAIL, GITHUB_PAGE,  } from "@/constants";

type SocialMedia = {
  icon: React.ReactNode;
  label: string;
  link: string;
};

export const socialMediaList: Array<SocialMedia> = [
  {
    label: "Github",
    icon: <IconBarandGithub className="text-2xl" />,
    link: GITHUB_PAGE,
  },
  {
    icon: (
      <>
        <IconSkillGmailDark className="text-2xl dark:hidden" />
        <IconSkillGmailLight className="text-2xl hidden dark:inline-block" />
      </>
    ),
    label: "Gmail",
    link: `mailto:${EMAIL}`,
  },
  {
    icon: <IconBrandBilibili className={`text-2xl text-[#00AEEC]`} />,
    label: "Bilibili",
    link: GITHUB_PAGE,
  },
  {
    icon: <IconLogoJuejin className={`text-2xl text-[#2985fc]`} />,
    label: "掘金",
    link: GITHUB_PAGE,
  },
];
