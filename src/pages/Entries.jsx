import { useState, useMemo, useEffect } from "react";
import { Plus, Zap } from "lucide-react";
import { useApp } from "../context/AppContext";
import { useEntries } from "../hooks/useEntries";
import { useCustomers } from "../hooks/useCustomers";
import { useSettings } from "../hooks/useSettings";
import {
  formatCurrency,
  getCurrentDate,
  getCurrentMonth,
  formatDate,
} from "../utils/formatters";
import EntryForm from "../components/EntryForm";
import EmptyState from "../components/EmptyState";
import LoadingSpinner from "../components/LoadingSpinner";
import ConfirmDialog from "../components/ConfirmDialog";
import ModalPortal from "../components/ModalPortal";

const Entries = () => {
  const { deleteEntry, updateEntry, addEntry, state } = useApp();
  const { entries, loading } = useEntries();
  const { activeCustomers } = useCustomers();
  const { settings } = useSettings();

  const [showEntryForm, setShowEntryForm] = useState(false);
  const [showBulkEntry, setShowBulkEntry] = useState(false);
  const [editingEntry, setEditingEntry] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [filterDate, setFilterDate] = useState(getCurrentDate());
  const [filterMonth, setFilterMonth] = useState(getCurrentMonth());
  const [filterCustomer, setFilterCustomer] = useState("");
  const [viewMode, setViewMode] = useState("date");

  const filteredEntries = useMemo(() => {
    let result = entries;
    if (viewMode === "date")
      result = result.filter((e) => e.date === filterDate);
    else if (viewMode === "month")
      result = result.filter((e) => e.date.startsWith(filterMonth));
    if (filterCustomer)
      result = result.filter((e) => e.customerId === filterCustomer);
    return result;
  }, [entries, viewMode, filterDate, filterMonth, filterCustomer]);

  const groupedEntries = useMemo(() => {
    const groups = {};
    filteredEntries.forEach((entry) => {
      if (!groups[entry.date]) groups[entry.date] = [];
      groups[entry.date].push(entry);
    });
    return groups;
  }, [filteredEntries]);

  const lastEntry = state.lastEntry || null;

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div
        className="flex gap-2 p-1 rounded-xl"
        style={{ backgroundColor: "var(--bg-card-alt)" }}
      >
        <button
          onClick={() => setViewMode("date")}
          className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === "date" ? "shadow-sm" : ""}`}
          style={
            viewMode === "date"
              ? {
                  backgroundColor: "var(--bg-card)",
                  color: "var(--color-primary)",
                }
              : { color: "var(--text-muted)" }
          }
        >
          By Date
        </button>
        <button
          onClick={() => setViewMode("month")}
          className={`flex-1 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${viewMode === "month" ? "shadow-sm" : ""}`}
          style={
            viewMode === "month"
              ? {
                  backgroundColor: "var(--bg-card)",
                  color: "var(--color-primary)",
                }
              : { color: "var(--text-muted)" }
          }
        >
          By Month
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,12rem)_minmax(0,13rem)] gap-2">
        {viewMode === "date" ? (
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className="input-field"
          />
        ) : (
          <input
            type="month"
            value={filterMonth}
            onChange={(e) => setFilterMonth(e.target.value)}
            className="input-field"
          />
        )}
        <select
          value={filterCustomer}
          onChange={(e) => setFilterCustomer(e.target.value)}
          className="input-field"
        >
          <option value="">All Customers</option>
          {activeCustomers.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {lastEntry && (
        <button
          onClick={() => {
            setEditingEntry({
              customerId: lastEntry.customerId,
              customerName: lastEntry.customerName,
              date: getCurrentDate(),
              milkQty: 0,
              curdQty: 0,
              note: "",
            });
            setShowEntryForm(true);
          }}
          className="card card-interactive flex items-center gap-3 w-full py-3 px-5"
        >
          <div
            className="p-2 rounded-lg"
            style={{ backgroundColor: "var(--color-accent-muted)" }}
          >
            <Zap className="w-4 h-4" style={{ color: "var(--color-accent)" }} />
          </div>
          <div className="flex-1 text-left">
            <p
              className="text-sm font-medium"
              style={{ color: "var(--text-primary)" }}
            >
              Quick Add: {lastEntry.customerName}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Last delivery on {lastEntry.date}
            </p>
          </div>
          <span
            className="text-xs font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            Tap to add
          </span>
        </button>
      )}

      {filteredEntries.length === 0 ? (
        <EmptyState
          title="No entries found"
          description={
            viewMode === "date"
              ? "No entries for this date"
              : "No entries for this month"
          }
          action={
            <button
              onClick={() => setShowEntryForm(true)}
              className="btn-primary"
            >
              Add Entry
            </button>
          }
        />
      ) : (
        <div className="space-y-4">
          {Object.entries(groupedEntries).map(([date, dateEntries]) => (
            <div key={date}>
              <h3
                className="font-heading text-sm font-semibold mb-2 sticky top-14 py-1 z-10"
                style={{
                  color: "var(--text-muted)",
                  backgroundColor: "var(--bg-base)",
                }}
              >
                {formatDate(date)}
              </h3>
              <div className="space-y-2">
                {dateEntries.map((entry) => (
                  <EntryRow
                    key={entry.id}
                    entry={entry}
                    settings={settings}
                    onEdit={() => setEditingEntry(entry)}
                    onDelete={() => setDeleteTarget(entry)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="fab-fixed flex gap-2 no-print">
        {activeCustomers.length > 0 && (
          <button
            onClick={() => setShowBulkEntry(true)}
            className="w-12 h-12 rounded-full shadow-md flex items-center justify-center fab-enter active:scale-95 transition-transform border"
            style={{
              backgroundColor: "var(--bg-card)",
              color: "var(--text-secondary)",
              borderColor: "var(--border-light)",
            }}
            title="Bulk entry"
          >
            <Zap className="w-5 h-5" />
          </button>
        )}
        <button
          onClick={() => {
            setEditingEntry(null);
            setShowEntryForm(true);
          }}
          className="w-[52px] h-[52px] rounded-full flex items-center justify-center fab-enter active:scale-95 transition-transform"
          style={{
            backgroundColor: "var(--color-primary)",
            boxShadow: "var(--shadow-fab)",
          }}
        >
          <Plus className="w-[22px] h-[22px] text-white" />
        </button>
      </div>

      <EntryForm
        isOpen={showEntryForm}
        onClose={() => {
          setShowEntryForm(false);
          setEditingEntry(null);
        }}
        onSave={async (data) => {
          if (editingEntry?.id) {
            await updateEntry(editingEntry.id, data);
          } else {
            await addEntry(data);
          }
          setShowEntryForm(false);
          setEditingEntry(null);
        }}
        initialData={editingEntry}
        mode={editingEntry ? "edit" : "add"}
      />

      <BulkEntryModal
        isOpen={showBulkEntry}
        onClose={() => setShowBulkEntry(false)}
        customers={activeCustomers}
        selectedDate={filterDate}
        onAdd={addEntry}
      />

      <ConfirmDialog
        isOpen={!!deleteTarget}
        title="Delete Entry"
        message="Are you sure you want to delete this entry?"
        confirmText="Delete"
        onConfirm={async () => {
          if (deleteTarget) await deleteEntry(deleteTarget.id);
          setDeleteTarget(null);
        }}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

const EntryRow = ({ entry, settings, onEdit, onDelete }) => {
  const amount =
    (entry.milkQty || 0) * (settings?.milkRatePerPacket || 0) +
    (entry.curdQty || 0) * (settings?.curdRatePerPacket || 0);
  const initial = entry.customerName?.charAt(0) || "?";

  return (
    <div
      className="card card-interactive flex items-center gap-4 py-3.5 px-5"
      onClick={onEdit}
    >
      <div
        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "var(--color-primary-muted)" }}
      >
        <span
          className="text-sm font-bold"
          style={{ color: "var(--color-primary)", fontFamily: "Sora" }}
        >
          {initial.toUpperCase()}
        </span>
      </div>
      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium truncate"
          style={{ color: "var(--text-primary)" }}
        >
          {entry.customerName}
        </p>
        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
          {entry.milkQty > 0 && <span>{entry.milkQty} pkts milk</span>}
          {entry.milkQty > 0 && entry.curdQty > 0 && <span> + </span>}
          {entry.curdQty > 0 && <span>{entry.curdQty} pkts curd</span>}
          {entry.note && (
            <span style={{ color: "var(--color-accent)" }}>
              {" "}
              • {entry.note}
            </span>
          )}
        </p>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span
          className="font-mono font-semibold text-sm"
          style={{ color: "var(--color-primary)" }}
        >
          {formatCurrency(amount, settings?.currency)}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
          className="p-1.5 rounded-lg"
          style={{ color: "var(--text-muted)" }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
          </svg>
        </button>
      </div>
    </div>
  );
};

const BulkEntryModal = ({
  isOpen,
  onClose,
  customers,
  selectedDate,
  onAdd,
}) => {
  const makeInitialRows = () => {
    const baseDate = selectedDate || getCurrentDate();
    return customers.map((c) => ({
      id: `${c.id}-${baseDate}`,
      customerId: c.id,
      customerName: c.name,
      date: baseDate,
      milkQty: "",
      curdQty: "",
    }));
  };

  const [rows, setRows] = useState(makeInitialRows);

  useEffect(() => {
    if (isOpen) setRows(makeInitialRows());
  }, [isOpen, selectedDate, customers]);

  if (!isOpen) return null;

  const addDays = (value, days) => {
    const [year, month, day] = value.split("-").map(Number);
    const next = new Date(year, month - 1, day + days);
    const yyyy = next.getFullYear();
    const mm = String(next.getMonth() + 1).padStart(2, "0");
    const dd = String(next.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  };

  const updateRow = (index, key, value) => {
    setRows((current) =>
      current.map((row, i) => (i === index ? { ...row, [key]: value } : row)),
    );
  };

  const addNextDateForCustomer = (customerId) => {
    setRows((current) => {
      const customerRows = current.filter((row) => row.customerId === customerId);
      const latestDate = customerRows
        .map((row) => row.date)
        .sort()
        .at(-1) || selectedDate || getCurrentDate();
      const nextDate = addDays(latestDate, 1);
      const customer = customers.find((c) => c.id === customerId);
      const insertAfter = current.reduce(
        (last, row, index) => (row.customerId === customerId ? index : last),
        -1,
      );
      const nextRow = {
        id: `${customerId}-${nextDate}-${Date.now()}`,
        customerId,
        customerName: customer?.name || "",
        date: nextDate,
        milkQty: "",
        curdQty: "",
      };
      return [
        ...current.slice(0, insertAfter + 1),
        nextRow,
        ...current.slice(insertAfter + 1),
      ];
    });
  };

  const removeRow = (id) => {
    setRows((current) => current.filter((row) => row.id !== id));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    for (const row of rows) {
      const milk = parseInt(row.milkQty) || 0;
      const curd = parseInt(row.curdQty) || 0;
      if (milk > 0 || curd > 0)
        await onAdd({
          customerId: row.customerId,
          customerName: row.customerName,
          date: row.date,
          milkQty: milk,
          curdQty: curd,
          note: "",
        });
    }
    onClose();
  };

  return (
    <ModalPortal>
    <div
      className="fixed inset-0 z-[80] flex modal-backdrop"
      onClick={onClose}
    >
      <div
        className="modal-panel flex flex-col overflow-hidden"
        style={{ backgroundColor: "var(--bg-card)", width: "min(100%, 760px)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="px-5 py-4 border-b flex items-center justify-between"
          style={{ borderColor: "var(--border-light)" }}
        >
          <h2 className="font-heading font-semibold text-lg">Bulk Entry</h2>
          <button
            onClick={onClose}
            className="text-sm font-medium"
            style={{ color: "var(--color-primary)" }}
          >
            Close
          </button>
        </div>
        <div className="flex-1 overflow-auto px-5 py-3">
          <div className="min-w-[620px]">
            <div
              className="grid grid-cols-[1.4fr_150px_96px_96px_96px] gap-3 px-1 pb-2 text-xs font-medium sticky top-0 z-10"
              style={{
                color: "var(--text-muted)",
                backgroundColor: "var(--bg-card)",
              }}
            >
              <span>Customer</span>
              <span>Date</span>
              <span className="text-right">Milk</span>
              <span className="text-right">Curd</span>
              <span className="text-right">Add</span>
            </div>
            <div className="space-y-2">
              {rows.map((row, i) => {
                const customerRows = rows.filter((r) => r.customerId === row.customerId);
                const canRemove = customerRows.length > 1;
                const lastIndexForCustomer = rows.reduce(
                  (last, current, index) =>
                    current.customerId === row.customerId ? index : last,
                  -1,
                );
                const isLastForCustomer = lastIndexForCustomer === i;

                return (
                  <div
                    key={row.id}
                    className="grid grid-cols-[1.4fr_150px_96px_96px_96px] gap-3 items-center border-t pt-2"
                    style={{ borderColor: "var(--border-light)" }}
                  >
                    <div className="min-w-0">
                      <p
                        className="text-sm font-medium truncate"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {row.customerName}
                      </p>
                      {canRemove && (
                        <button
                          type="button"
                          onClick={() => removeRow(row.id)}
                          className="text-xs"
                          style={{ color: "var(--color-danger)" }}
                        >
                          Remove row
                        </button>
                      )}
                    </div>
                    <input
                      type="date"
                      value={row.date}
                      onChange={(e) => updateRow(i, "date", e.target.value)}
                      className="input-field py-2 px-2 text-sm"
                    />
                    <input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="0"
                      value={row.milkQty}
                      onChange={(e) => updateRow(i, "milkQty", e.target.value)}
                      className="input-field text-center py-2 px-2 font-mono text-sm"
                    />
                    <input
                      type="number"
                      step="1"
                      min="0"
                      placeholder="0"
                      value={row.curdQty}
                      onChange={(e) => updateRow(i, "curdQty", e.target.value)}
                      className="input-field text-center py-2 px-2 font-mono text-sm"
                    />
                    <button
                      type="button"
                      onClick={() => addNextDateForCustomer(row.customerId)}
                      className="btn-secondary flex items-center justify-center gap-1 px-2 py-2 text-sm"
                      disabled={!isLastForCustomer}
                      style={!isLastForCustomer ? { opacity: 0.35 } : undefined}
                    >
                      <Plus className="w-4 h-4" />
                      Day
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div
          className="px-5 py-4 border-t flex gap-3"
          style={{ borderColor: "var(--border-light)" }}
        >
          <button onClick={onClose} className="btn-secondary flex-1">
            Cancel
          </button>
          <button onClick={handleSubmit} className="btn-primary flex-1">
            Save All
          </button>
        </div>
      </div>
    </div>
    </ModalPortal>
  );
};

export default Entries;
