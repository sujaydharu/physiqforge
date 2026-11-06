
import {
  Activity,
  Apple,
  Bell,
  BrainCircuit,
  CalendarDays,
  ChevronRight,
  Clock3,
  Droplets,
  Dumbbell,
  Flame,
  HeartPulse,
  LayoutDashboard,
  MessageCircle,
  Moon,
  Plus,
  Settings,
  TrendingUp,
  UserRound,
  Weight,
  Zap,
} from "lucide-react";

import { LogoutButton } from "@/components/logout-button";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, active: true },
  { label: "My Profile", icon: UserRound },
  { label: "My Schedule", icon: CalendarDays },
  { label: "Fitness", icon: Dumbbell },
  { label: "Nutrition", icon: Apple },
  { label: "AI Intelligence", icon: BrainCircuit },
  { label: "AI Trainer", icon: MessageCircle },
  { label: "Progress & Analytics", icon: TrendingUp },
];

const stats = [
  {
    label: "Calories Consumed",
    value: "0",
    unit: "kcal",
    target: "Target: 2,400 kcal",
    percent: 0,
    icon: Flame,
    color: "text-orange-400",
    bar: "bg-orange-400",
  },
  {
    label: "Protein Intake",
    value: "0",
    unit: "g",
    target: "Target: 120 g",
    percent: 0,
    icon: Zap,
    color: "text-red-400",
    bar: "bg-red-400",
  },
  {
    label: "Water Intake",
    value: "0",
    unit: "L",
    target: "Target: 3 L",
    percent: 0,
    icon: Droplets,
    color: "text-blue-400",
    bar: "bg-blue-400",
  },
  {
    label: "Sleep Duration",
    value: "--",
    unit: "hrs",
    target: "Target: 8 hours",
    percent: 0,
    icon: Moon,
    color: "text-purple-400",
    bar: "bg-purple-400",
  },
];

const activities = [
  { label: "Morning workout", time: "Not logged yet", icon: Dumbbell },
  { label: "Breakfast", time: "Not logged yet", icon: Apple },
  { label: "Water intake", time: "Not logged yet", icon: Droplets },
];

type PhysiqForgeDashboardProps = {
  profileName: string;
  hasCompletedOnboarding: boolean;
};

export function PhysiqForgeDashboard({
  profileName,
  hasCompletedOnboarding,
}: PhysiqForgeDashboardProps) {
  return (
    <main className="min-h-screen bg-[#0A090B] text-white">
      <div className="flex min-h-screen">

        {/* SIDEBAR */}
        <aside className="hidden w-[255px] shrink-0 border-r border-white/[0.07] bg-[#100E11] px-5 py-7 md:flex md:flex-col">
          <div className="mb-10">
            <h1 className="text-2xl font-black tracking-tight">
              PHYSIQ<span className="text-[#D73549]">FORGE</span>
            </h1>
            <p className="mt-1 text-[9px] tracking-[3px] text-zinc-500">
              YOUR PERSONAL AI TRAINER
            </p>
          </div>

          <p className="mb-4 text-[10px] font-semibold tracking-[2px] text-zinc-600">
            MAIN MENU
          </p>

          <nav className="space-y-1">
            {navigation.map((item) => (
              <a
                href="#"
                key={item.label}
                className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm transition ${
                  item.active
                    ? "border border-red-500/20 bg-[#3A171F] font-semibold text-red-300"
                    : "text-zinc-400 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {item.active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-red-400" />
                )}
              </a>
            ))}
          </nav>

          <div className="mt-auto rounded-2xl border border-white/[0.07] bg-[#191519] p-4">
            <div className="mb-3 flex items-center gap-2">
              <BrainCircuit size={18} className="text-red-400" />
              <span className="text-sm font-semibold">AI Trainer</span>
            </div>
            <p className="mb-4 text-xs leading-5 text-zinc-500">
              Your personal fitness intelligence is waiting to help you.
            </p>
            <a
              href="#ai-insight"
              className="flex items-center justify-between text-xs font-semibold text-red-400"
            >
              Explore AI insights <ChevronRight size={15} />
            </a>
          </div>

          <a
            href="#settings"
            className="mt-5 flex items-center gap-3 px-3 py-2 text-sm text-zinc-500 hover:text-white"
          >
            <Settings size={18} /> Settings
          </a>
        </aside>

        {/* MAIN CONTENT */}
        <section className="min-w-0 flex-1">

            {/* HEADER */}
            <header className="sticky top-0 z-10 flex h-[76px] items-center justify-between border-b border-white/[0.07] bg-[#0A090B]/95 px-5 backdrop-blur-xl sm:px-8 lg:px-10">
                <div>
                    <h2 className="text-sm font-semibold text-zinc-200">
                    Personal Dashboard
                    </h2>
                    <p className="mt-1 text-[11px] text-zinc-500">
                    Your fitness journey starts here.
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                    aria-label="Notifications"
                    className="rounded-xl border border-white/10 bg-white/[0.03] p-2.5 text-zinc-400 hover:text-white"
                    >
                    <Bell size={18} />
                    </button>

                    <LogoutButton />

                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-red-500/30 bg-[#381820] text-sm font-bold text-red-300">
                    P
                    </div>
                </div>
            </header>

          <div className="mx-auto max-w-[1500px] space-y-7 p-5 sm:p-8 lg:p-10">

            {/* WELCOME */}
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-[2px] text-red-400">
                  Wednesday · Your personal space
                </p>
                <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                  Welcome{profileName ? `, ${profileName}` : ""}!
                  <br />
                  <span className="text-red-400">PhysiqForge.</span>
                </h1>
                <p className="mt-2 text-sm text-zinc-500">
                  Build consistency. Track progress. Become stronger.
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-2.5 text-xs text-zinc-400">
                <CalendarDays size={15} />
                <span>Today's overview</span>
              </div>
            </div>

            {/* HERO */}
            <div className="relative overflow-hidden rounded-2xl border border-red-500/20 bg-gradient-to-br from-[#35141E] via-[#211219] to-[#100E11] p-6 sm:p-8">
              <div className="pointer-events-none absolute -right-10 -top-24 h-64 w-64 rounded-full bg-red-600/10 blur-3xl" />

              <div className="relative max-w-2xl">
                <div className="mb-4 flex items-center gap-2">
                  <BrainCircuit size={19} className="text-red-400" />
                  <span className="text-xs font-bold uppercase tracking-[2px] text-red-300">
                    Your AI fitness companion
                  </span>
                </div>

                <h2 className="text-2xl font-bold leading-tight sm:text-3xl">
                  Every day is an opportunity
                  <br />
                  to become stronger.
                </h2>

                <p className="mt-3 max-w-lg text-sm leading-6 text-zinc-400">
                  Your personalized workout, nutrition and recovery insights
                  will appear here once your profile is configured.
                </p>

                <a
                  href={
                    hasCompletedOnboarding
                      ? "/protected/profile"
                      : "/protected/onboarding"
                  }
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#C52D42] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#DE354C]"
                >
                  {hasCompletedOnboarding ? "View / Edit Profile" : "Complete Your Profile"}
                  <ChevronRight size={17} />
                </a>
              </div>
            </div>

            {/* DAILY STATISTICS */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Daily Overview</h2>
                  <p className="mt-1 text-xs text-zinc-500">
                    Your daily health and nutrition statistics.
                  </p>
                </div>
                <Activity size={20} className="text-red-400" />
              </div>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/[0.07] bg-[#131115] p-5 transition hover:border-red-500/20"
                  >
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-zinc-500">{stat.label}</p>
                      <stat.icon size={19} className={stat.color} />
                    </div>

                    <div className="mt-5 flex items-baseline gap-1">
                      <span className="text-3xl font-bold tracking-tight">
                        {stat.value}
                      </span>
                      <span className="text-xs text-zinc-500">{stat.unit}</span>
                    </div>

                    <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                      <div
                        className={`h-full rounded-full ${stat.bar}`}
                        style={{ width: `${stat.percent}%` }}
                      />
                    </div>

                    <p className="mt-3 text-[11px] text-zinc-500">
                      {stat.target}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* WORKOUT + NUTRITION */}
            <div className="grid gap-5 lg:grid-cols-2">
              <div className="rounded-2xl border border-white/[0.07] bg-[#131115] p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-red-500/10 p-3">
                      <Dumbbell className="text-red-400" size={21} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Today's Workout</h3>
                      <p className="mt-1 text-[11px] text-zinc-500">
                        Your fitness plan
                      </p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-[10px] text-zinc-400">
                    Not configured
                  </span>
                </div>

                <div className="mt-7 rounded-xl border border-dashed border-white/10 p-7 text-center">
                  <Dumbbell className="mx-auto mb-3 text-zinc-600" size={30} />
                  <p className="text-sm font-semibold">No workout plan yet</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    Complete your profile to generate your first personalized
                    workout.
                  </p>
                  <a
                    href={
                      hasCompletedOnboarding
                        ? "/protected/fitness"
                        : "/protected/onboarding"
                    }
                    className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-red-400"
                  >
                    Create workout plan <ChevronRight size={15} />
                  </a>
                </div>
              </div>

              <div className="rounded-2xl border border-white/[0.07] bg-[#131115] p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="rounded-xl bg-emerald-500/10 p-3">
                      <Apple className="text-emerald-400" size={21} />
                    </div>
                    <div>
                      <h3 className="font-semibold">Today's Nutrition</h3>
                      <p className="mt-1 text-[11px] text-zinc-500">
                        Your diet plan
                      </p>
                    </div>
                  </div>
                  <span className="rounded-lg bg-white/[0.05] px-2.5 py-1 text-[10px] text-zinc-400">
                    Not configured
                  </span>
                </div>

                <div className="mt-7 rounded-xl border border-dashed border-white/10 p-7 text-center">
                  <Apple className="mx-auto mb-3 text-zinc-600" size={30} />
                  <p className="text-sm font-semibold">No diet plan yet</p>
                  <p className="mt-2 text-xs text-zinc-500">
                    Set your nutrition preferences to generate your personalized
                    meal plan.
                  </p>
                  <a
                    href={
                      hasCompletedOnboarding
                        ? "/protected/nutrition"
                        : "/protected/onboarding"
                    }
                    className="mt-5 inline-flex items-center gap-2 text-xs font-semibold text-red-400"
                  >
                    Create diet plan <ChevronRight size={15} />
                  </a>
                </div>
              </div>
            </div>

            {/* BOTTOM SECTION */}
            <div className="grid gap-5 lg:grid-cols-3">

              <div className="rounded-2xl border border-white/[0.07] bg-[#131115] p-5 lg:col-span-2">
                <h3 className="font-semibold">Today's Activities</h3>
                <p className="mt-1 text-xs text-zinc-500">
                  Your daily activity checklist.
                </p>

                <div className="mt-5 space-y-4">
                  {activities.map((activity) => (
                    <div
                      key={activity.label}
                      className="flex items-center gap-3 border-b border-white/[0.05] pb-4 last:border-0 last:pb-0"
                    >
                      <div className="rounded-lg bg-white/[0.05] p-2.5">
                        <activity.icon size={17} className="text-red-400" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {activity.label}
                        </p>
                        <p className="mt-1 text-[11px] text-zinc-500">
                          {activity.time}
                        </p>
                      </div>
                      <span className="text-[10px] text-zinc-600">
                        Pending
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div
                id="ai-insight"
                className="rounded-2xl border border-red-500/15 bg-gradient-to-b from-[#26131A] to-[#131115] p-5"
              >
                <div className="flex items-center gap-2">
                  <BrainCircuit size={19} className="text-red-400" />
                  <h3 className="font-semibold">AI Insights</h3>
                </div>

                <p className="mt-5 text-sm font-medium">
                  Your personal AI trainer is waiting.
                </p>
                <p className="mt-2 text-xs leading-6 text-zinc-500">
                  Once your fitness profile and activity history are available,
                  your AI trainer will provide personalized suggestions.
                </p>

                <div className="mt-5 flex items-center gap-2 text-xs text-zinc-500">
                  <HeartPulse size={16} className="text-red-400" />
                  Personalized intelligence
                </div>
              </div>
            </div>

            {/* FOOTER */}
            <footer className="border-t border-white/[0.07] pt-5 text-center">
              <p className="text-[10px] tracking-widest text-zinc-600">
                PHYSIQFORGE · YOUR BODY. YOUR DATA. YOUR INTELLIGENCE.
              </p>
            </footer>

          </div>
        </section>
      </div>
    </main>
  );
}
