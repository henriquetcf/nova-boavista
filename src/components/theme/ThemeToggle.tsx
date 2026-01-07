'use client'
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { setTheme, resolvedTheme } = useTheme();

  const toggleDarkMode = () => {
    if (!document.startViewTransition) {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
      return;
    }
    document.startViewTransition(() => {
      setTheme(resolvedTheme === "dark" ? "light" : "dark");
    });
  };

  return (
    <button onClick={toggleDarkMode} className="p-2 rounded-lg hover:bg-brand-purple dark:hover:bg-white/10 active:scale-90">
      <div className="transition-transform duration-900 rotate-0 dark:rotate-[180deg]">
        <SunIcon className="hidden dark:block h-6 w-6 text-yellow-400" />
        <MoonIcon className="block dark:hidden h-6 w-6 text-brand-gray" />
      </div>
    </button>
  );
}