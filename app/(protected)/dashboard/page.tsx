import { cookies } from "next/headers";
import Link from "next/link";

/**
 * Module registry — the single place to register a new module's display info.
 * Adding a new module = add one entry here + create the module folder.
 */





const MODULE_REGISTRY: Record<
  string,
  { label: string; href: string; description: string; color: string }
> = {
  invoice: {
    label: "Invoice",
    href: "/modules/invoice",
    description: "Create, send, and track invoices",
    color: "bg-violet-50 border-violet-100 hover:border-violet-300",
  },
  school_fee: {
    label: "School Fee",
    href: "/modules/school-fee",
    description: "Manage student fee records and payments",
    color: "bg-teal-50 border-teal-100 hover:border-teal-300",
  },
};

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const userInfoRaw = cookieStore.get("user_info")?.value;
  const userInfo: { email: string; modules: string[] } = userInfoRaw
    ? JSON.parse(userInfoRaw)
    : { email: "", modules: [] };

  const accessibleModules = userInfo.modules
    .filter((key) => key in MODULE_REGISTRY)
    .map((key) => ({ key, ...MODULE_REGISTRY[key] }));

  return (
    <div>
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1 text-sm">
          Welcome back,{" "}
          <span className="font-medium text-gray-700">{userInfo.email}</span>
        </p>
      </div>

      {/* Module grid */}
      <div>
        <p className="text-xs font-medium text-gray-400 uppercase tracking-widest mb-4">
          Your apps
        </p>

        {accessibleModules.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-gray-200 rounded-2xl">
            <p className="text-gray-400 text-sm">
              No modules are assigned to your account.
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Contact your administrator.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {accessibleModules.map((mod) => (
              <Link
                key={mod.key}
                href={mod.href}
                className={`group block rounded-2xl border p-6 transition ${mod.color}`}
              >
                <div className="flex items-start justify-between mb-3">
                  <span
                    className="inline-flex items-center px-2 py-0.5 rounded-full
                                   text-xs font-medium bg-white/70 text-gray-600 border border-white"
                  >
                    {mod.key}
                  </span>
                  <svg
                    className="w-4 h-4 text-gray-400 group-hover:text-gray-700 transition"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </div>
                <h2 className="text-base font-semibold text-gray-900 mb-1">
                  {mod.label}
                </h2>
                <p className="text-sm text-gray-500">{mod.description}</p>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
