import {
  LayoutDashboard,
  ScrollTextIcon,
  SettingsIcon,
  Zap,
} from "lucide-react";

export const links = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboard className="text-black h-8 w-8 flex-shrink-0" />,
  },
  {
    label: "Integrations",
    href: "/dashboard/integrations",
    icon: <Zap className="text-black h-8 w-8 flex-shrink-0" />,
  },
  {
    label: "Activity Log",
    href: "/dashboard/logs",
    icon: <ScrollTextIcon className="text-black h-8 w-8 flex-shrink-0" />,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: <SettingsIcon className="text-black h-8 w-8 flex-shrink-0" />,
  },
];

export const SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.blood_glucose.read",
  "https://www.googleapis.com/auth/fitness.blood_pressure.read",
  "https://www.googleapis.com/auth/fitness.heart_rate.read",
  "https://www.googleapis.com/auth/fitness.body.read",
  "https://www.googleapis.com/auth/fitness.sleep.read",
  "https://www.googleapis.com/auth/fitness.reproductive_health.read",
  "https://www.googleapis.com/auth/userinfo.profile",
];
