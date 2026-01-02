import { useState, useEffect } from "react";

/* ---------- helpers ---------- */

const pad = (n) => String(n).padStart(2, "0");

const getNowParts = () => {
  const now = new Date();
  return {
    date: now.toISOString().slice(0, 10),
    hour: pad(now.getHours()),
    minute: pad(now.getMinutes()),
    second: pad(now.getSeconds()),
  };
};

const getToParts = () => {
  const to = new Date();
  return {
    date: to.toISOString().slice(0, 10),
    hour: pad(to.getHours() + 1),
    minute: pad(to.getMinutes()),
    second: pad(to.getSeconds()),
  };
};

const MILLISECONDS_IN_DAY = 1000 * 60 * 60 * 24;
const MILLISECONDS_IN_HOUR = 1000 * 60 * 60;
const MILLISECONDS_IN_MINUTE = 1000 * 60;
const MILLISECONDS_IN_SECOND = 1000;

export default function App() {
  const [start, setStart] = useState(getNowParts);
  const [end, setEnd] = useState(getToParts);

  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const timeOptions = (max) => Array.from({ length: max }, (_, i) => pad(i));

  const buildDate = ({ date, hour, minute, second }) => {
    if (!date) return null;
    return new Date(`${date}T${hour}:${minute}:${second}`);
  };

  const calculateDifference = () => {
    const startDate = buildDate(start);
    const endDate = buildDate(end);

    if (!startDate || !endDate) {
      setResult("");
      setError("");
      return;
    }

    if (startDate > endDate) {
      setResult("");
      setError("Das Startdatum muss vor dem Enddatum liegen.");
      return;
    }

    setError("");

    const diff = endDate - startDate;

    const days = Math.floor(diff / MILLISECONDS_IN_DAY);
    const hours = Math.floor(
      (diff % MILLISECONDS_IN_DAY) / MILLISECONDS_IN_HOUR
    );
    const minutes = Math.floor(
      (diff % MILLISECONDS_IN_HOUR) / MILLISECONDS_IN_MINUTE
    );
    const seconds = Math.floor(
      (diff % MILLISECONDS_IN_MINUTE) / MILLISECONDS_IN_SECOND
    );

    setResult(
      `${days} Tage  ${hours} Stunden  ${minutes} Minuten  ${seconds} Sekunden`
    );
  };

  useEffect(() => {
    calculateDifference();
  }, [start, end, calculateDifference]);

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-5xl mx-auto space-y-8">
        <h1 className="text-2xl font-semibold">Zeitraum Rechner</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <TimeBlock
            title="Von"
            value={start}
            onChange={setStart}
            timeOptions={timeOptions}
          />

          <TimeBlock
            title="Bis"
            value={end}
            onChange={setEnd}
            timeOptions={timeOptions}
          />
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 border border-red-300 p-3">
            {error}
          </div>
        )}

        {result && (
          <div className="border p-4">
            <div className="italic text-gray-500 mb-1">Ihr Ergebnis</div>
            <div className="font-medium">{result}</div>
          </div>
        )}
      </div>
    </div>
  );
}

function TimeBlock({ title, value, onChange, timeOptions }) {
  return (
    <div className="bg-gray-100 p-4">
      <h2 className="text-blue-600 font-semibold mb-3">{title}</h2>

      {/* Datum */}
      <div className="mb-3 overflow-hidden">
        <label className="block mb-1 font-medium">Datum</label>
        <input
          type="date"
          value={value.date}
          onChange={(e) => onChange({ ...value, date: e.target.value })}
          className="w-full border px-2 py-1.5 text-sm bg-white box-border"
        />
      </div>

      {/* Zeit */}
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-[1fr_1fr_1fr] text-sm">
        <SelectField
          label="Stunde"
          value={value.hour}
          options={timeOptions(24)}
          onChange={(v) => onChange({ ...value, hour: v })}
        />

        <SelectField
          label="Minute"
          value={value.minute}
          options={timeOptions(60)}
          onChange={(v) => onChange({ ...value, minute: v })}
        />

        <SelectField
          label="Sekunde"
          value={value.second}
          options={timeOptions(60)}
          onChange={(v) => onChange({ ...value, second: v })}
        />
      </div>
    </div>
  );
}

function SelectField({ label, value, options, onChange }) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border px-2 py-1 bg-white"
      >
        {options.map((v) => (
          <option key={v} value={v}>
            {v}
          </option>
        ))}
      </select>
    </div>
  );
}
