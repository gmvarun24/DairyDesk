import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  Milk,
  Droplets,
  TrendingUp,
  CalendarDays,
  UserCheck,
  Plus,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useApp } from "../context/AppContext";
import { useEntries } from "../hooks/useEntries";
import { useCustomers } from "../hooks/useCustomers";
import { useSettings } from "../hooks/useSettings";
import { calculateTotals } from "../utils/billCalculator";
import {
  formatCurrency,
  getCurrentMonth,
  getCurrentDate,
  formatGreeting,
} from "../utils/formatters";
import EntryForm from "../components/EntryForm";
import LoadingSpinner from "../components/LoadingSpinner";

const customerIcons = [
  "🥛",
  "🐄",
  "🧈",
  "☕",
  "🍶",
  "🥣",
  "🧑‍🌾",
  "🏪",
  "🏠",
  "📦",
];

const Dashboard = () => {
  const { user } = useAuth();
  const { addEntry } = useApp();
  const { entries, loading: entriesLoading } = useEntries();
  const { activeCustomers } = useCustomers();
  const { settings } = useSettings();
  const navigate = useNavigate();

  const [showEntryForm, setShowEntryForm] = useState(false);

  const today = getCurrentDate();
  const currentMonth = getCurrentMonth();

  const todayEntries = useMemo(
    () => entries.filter((e) => e.date === today),
    [entries, today],
  );
  const monthEntries = useMemo(
    () => entries.filter((e) => e.date.startsWith(currentMonth)),
    [entries, currentMonth],
  );
  const recentEntries = useMemo(() => entries.slice(0, 5), [entries]);

  const todayTotals = calculateTotals(
    todayEntries,
    settings?.milkRatePerPacket || 0,
    settings?.curdRatePerPacket || 0,
  );
  const monthTotals = calculateTotals(
    monthEntries,
    settings?.milkRatePerPacket || 0,
    settings?.curdRatePerPacket || 0,
  );

  if (entriesLoading) return <LoadingSpinner />;

  const initial = user?.displayName?.charAt(0) || user?.email?.charAt(0) || "U";
  const firstName = user?.displayName?.split(" ")[0] || "User";

  return (
    <div className="space-y-5">
      {/* Welcome Banner */}
      <div className="gradient-primary rounded-[16px] p-6 relative overflow-hidden">
        <div
          className="absolute right-4 top-1/2 -translate-y-1/2 opacity-[0.08]"
          aria-hidden="true"
        >
          <svg width="120" height="120" viewBox="0 0 100 100" fill="none">
            <path
              d="M50 10 C50 10, 25 45, 25 60 C25 75, 36 88, 50 88 C64 88, 75 75, 75 60 C75 45, 50 10, 50 10Z"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </div>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.7)" }}>
          {formatGreeting()}
        </p>
        <h2 className="font-heading text-[28px] font-bold text-white mt-0.5">
          {firstName} <span className="inline-block">👋</span>
        </h2>
        <p
          className="text-sm mt-1 flex items-center gap-1.5"
          style={{ color: "rgba(255,255,255,0.6)" }}
        >
          <CalendarDays className="w-3.5 h-3.5" />
          {new Date().toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        <StatPanel
          label="Today"
          icon={TrendingUp}
          totals={todayTotals}
          settings={settings}
        />
        <StatPanel
          label="Month"
          icon={CalendarDays}
          totals={monthTotals}
          settings={settings}
        />
      </div>

      {/* Active Customers */}
      <div className="card">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div
              className="p-1.5 rounded-lg"
              style={{ backgroundColor: "var(--color-primary-muted)" }}
            >
              <UserCheck
                className="w-4 h-4"
                style={{ color: "var(--color-primary)" }}
              />
            </div>
            <span
              className="text-[11px] font-medium uppercase tracking-[0.08em]"
              style={{ color: "var(--text-secondary)" }}
            >
              Active Customers
            </span>
            <span
              className="px-2 py-0.5 rounded-full text-xs font-semibold"
              style={{
                backgroundColor: "var(--color-primary-muted)",
                color: "var(--color-primary)",
              }}
            >
              {activeCustomers.length}
            </span>
          </div>
          <button
            onClick={() => navigate("/customers")}
            className="text-sm font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            View all →
          </button>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {activeCustomers.slice(0, 8).map((c, i) => (
            <div
              key={c.id}
              className="flex items-center gap-2 px-1.5 pr-3 py-1 rounded-full border cursor-pointer hover:bg-[var(--bg-hover)] transition-colors"
              style={{
                backgroundColor: "var(--bg-card)",
                borderColor: "var(--border-light)",
              }}
              onClick={() => navigate(`/customers/${c.id}`)}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                <span
                  className="text-xs font-semibold text-white"
                  style={{ fontFamily: "Sora" }}
                >
                  {c.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <span
                className="text-sm"
                style={{ color: "var(--text-primary)" }}
              >
                {c.name.split(" ")[0]}
              </span>
            </div>
          ))}
          {activeCustomers.length > 8 && (
            <span
              className="px-3 py-1 rounded-full text-xs"
              style={{
                backgroundColor: "var(--bg-card-alt)",
                color: "var(--text-muted)",
              }}
            >
              +{activeCustomers.length - 8} more
            </span>
          )}
        </div>
      </div>

      {/* Recent Entries */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3
            className="text-[11px] font-medium uppercase tracking-[0.1em]"
            style={{ color: "var(--text-muted)" }}
          >
            Recent Entries
          </h3>
          <button
            onClick={() => navigate("/entries")}
            className="text-sm font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            View all
          </button>
        </div>

        {recentEntries.length === 0 ? (
          <div className="card text-center py-8">
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3"
              style={{ backgroundColor: "var(--bg-card-alt)" }}
            >
              <Plus
                className="w-5 h-5"
                style={{ color: "var(--text-muted)" }}
              />
            </div>
            <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
              No entries yet. Tap + to add your first delivery.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {recentEntries.map((entry, i) => {
              const amount =
                (entry.milkQty || 0) * (settings?.milkRatePerPacket || 0) +
                (entry.curdQty || 0) * (settings?.curdRatePerPacket || 0);
              const cust = activeCustomers.find(
                (c) => c.id === entry.customerId,
              );
              const custInitial =
                cust?.name?.charAt(0) || entry.customerName?.charAt(0) || "?";
              return (
                <div
                  key={entry.id}
                  className="card flex items-center gap-4 py-3.5 px-5 card-interactive list-item"
                  onClick={() => navigate(`/customers/${entry.customerId}`)}
                >
                  <div
                    className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: "var(--color-primary-muted)" }}
                  >
                    <span
                      className="text-sm font-bold"
                      style={{
                        color: "var(--color-primary)",
                        fontFamily: "Sora",
                      }}
                    >
                      {custInitial.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p
                      className="text-sm font-medium truncate"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {entry.customerName}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {entry.milkQty > 0 && <span>{entry.milkQty}M</span>}
                      {entry.milkQty > 0 && entry.curdQty > 0 && (
                        <span className="mx-1">+</span>
                      )}
                      {entry.curdQty > 0 && <span>{entry.curdQty}C</span>}
                    </p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p
                      className="font-mono font-semibold"
                      style={{
                        color: "var(--color-primary)",
                        fontSize: "15px",
                      }}
                    >
                      {formatCurrency(amount, settings?.currency)}
                    </p>
                    <p
                      className="text-[11px] mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {entry.date}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* FAB */}
      <button
        onClick={() => setShowEntryForm(true)}
        className="fab-fixed w-[52px] h-[52px] rounded-full flex items-center justify-center no-print fab-enter"
        style={{
          backgroundColor: "var(--color-primary)",
          boxShadow: "var(--shadow-fab)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-primary-light)";
          e.currentTarget.style.transform = "scale(1.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "var(--color-primary)";
          e.currentTarget.style.transform = "scale(1)";
        }}
      >
        <Plus className="w-[22px] h-[22px] text-white" />
      </button>

      <EntryForm
        isOpen={showEntryForm}
        onClose={() => setShowEntryForm(false)}
        onSave={async (data) => {
          await addEntry(data);
          setShowEntryForm(false);
        }}
      />
    </div>
  );
};

const StatPanel = ({ label, icon: Icon, totals, settings }) => (
  <div className="card">
    <div className="flex items-center gap-2 mb-4">
      <div
        className="p-1.5 rounded-lg"
        style={{ backgroundColor: "var(--color-primary-muted)" }}
      >
        <Icon className="w-4 h-4" style={{ color: "var(--color-primary)" }} />
      </div>
      <span
        className="text-[11px] font-medium uppercase tracking-[0.08em]"
        style={{ color: "var(--text-muted)" }}
      >
        {label}
      </span>
    </div>
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Milk
        </span>
        <span>
          <span
            className="font-mono font-medium text-lg"
            style={{ color: "var(--text-primary)" }}
          >
            {totals.totalMilk}
          </span>
          <span
            className="text-[11px] ml-1 align-baseline"
            style={{ color: "var(--text-muted)" }}
          >
            pkts
          </span>
        </span>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Curd
        </span>
        <span>
          <span
            className="font-mono font-medium text-lg"
            style={{ color: "var(--text-primary)" }}
          >
            {totals.totalCurd}
          </span>
          <span
            className="text-[11px] ml-1 align-baseline"
            style={{ color: "var(--text-muted)" }}
          >
            pkts
          </span>
        </span>
      </div>
      <div
        className="pt-2.5 border-t"
        style={{ borderColor: "var(--border-light)" }}
      >
        <div className="flex items-center justify-between">
          <span
            className="text-sm font-medium"
            style={{ color: "var(--text-secondary)" }}
          >
            Total
          </span>
          <span
            className="font-mono font-bold text-xl"
            style={{ color: "var(--color-primary)" }}
          >
            {formatCurrency(totals.totalAmount, settings?.currency)}
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default Dashboard;
