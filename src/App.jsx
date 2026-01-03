import { useState, useEffect } from "react";

/* ---------- helpers ---------- */

const pad = (n) => String(n).padStart(2, "0");

const timeToSeconds = ({ hour, minute, second }) =>
  Number(hour) * 3600 + Number(minute) * 60 + Number(second);

const formatDuration = (seconds) => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h} Stunden ${m} Minuten ${s} Sekunden`;
};

const getToday = () => new Date().toISOString().slice(0, 10);

const getNowTime = () => {
  const now = new Date();
  return {
    hour: pad(now.getHours()),
    minute: pad(now.getMinutes()),
    second: pad(now.getSeconds()),
  };
};

const getEndTime = () => {
  const now = new Date();
  now.setHours(now.getHours() + 1);
  return {
    hour: pad(now.getHours()),
    minute: pad(now.getMinutes()),
    second: pad(now.getSeconds()),
  };
};

const emptyTime = { hour: "00", minute: "00", second: "00" };

export default function App() {
  const [date, setDate] = useState(getToday);

  const [start, setStart] = useState(getNowTime);
  const [end, setEnd] = useState(getEndTime);

  const [abfahrt, setAbfahrt] = useState(emptyTime);
  const [ankunft, setAnkunft] = useState(emptyTime);

  const [includeFahrzeit, setIncludeFahrzeit] = useState(false);

  const [report, setReport] = useState(null);
  const [error, setError] = useState("");

  const timeOptions = (max) => Array.from({ length: max }, (_, i) => pad(i));

  useEffect(() => {
    const startSec = timeToSeconds(start);
    const endSec = timeToSeconds(end);

    if (startSec >= endSec) {
      setError("Arbeitsbeginn muss vor dem Arbeitsende liegen.");
      setReport(null);
      return;
    }

    let fahrzeit = 0;

    if (includeFahrzeit) {
      const abfahrtSec = timeToSeconds(abfahrt);
      const ankunftSec = timeToSeconds(ankunft);

      if (abfahrtSec > ankunftSec) {
        setError("Abfahrt darf nicht später als Ankunft sein.");
        setReport(null);
        return;
      }

      if (ankunftSec > startSec) {
        setError("Arbeitsbeginn darf nicht vor der Ankunft liegen.");
        setReport(null);
        return;
      }

      if (abfahrtSec > endSec) {
        setError("Abfahrt darf nicht nach dem Arbeitsende liegen.");
        setReport(null);
        return;
      }

      fahrzeit = ankunftSec - abfahrtSec;
    }

    const arbeitszeit = endSec - startSec;

    setError("");
    setReport({
      arbeitszeit,
      fahrzeit,
      gesamtzeit: arbeitszeit + fahrzeit,
      includeFahrzeit,
    });
  }, [start, end, abfahrt, ankunft, includeFahrzeit]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-4xl lg:max-w-xl mx-auto space-y-6">
        <h1 className="text-2xl font-semibold text-gray-900">
          Arbeitszeit Rechner
        </h1>

        {/* Datum */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
          <label className="block text-xs font-medium text-gray-600 mb-1">
            Arbeitsdatum
          </label>
          <input
            type="date"
            lang="de"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="
    h-9
    w-full
    max-w-full
    box-border
    rounded-md
    border border-gray-300
    px-2
    text-sm
    bg-white
    overflow-hidden
  "
          />
        </div>

        {/* Fahrzeit */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={includeFahrzeit}
              onChange={(e) => setIncludeFahrzeit(e.target.checked)}
              className="h-4 w-4"
            />
            Fahrzeit berücksichtigen
          </label>

          {includeFahrzeit && (
            <div className="space-y-4 pt-2 border-t">
              <TimeRow
                label="Abfahrt"
                value={abfahrt}
                onChange={setAbfahrt}
                timeOptions={timeOptions}
              />
              <TimeRow
                label="Ankunft"
                value={ankunft}
                onChange={setAnkunft}
                timeOptions={timeOptions}
              />
            </div>
          )}
        </div>

        {/* Arbeitszeit */}
        <TimeBlock
          title="Von"
          label="Arbeitsbeginn"
          value={start}
          onChange={setStart}
          timeOptions={timeOptions}
        />

        <TimeBlock
          title="Bis"
          label="Arbeitsende"
          value={end}
          onChange={setEnd}
          timeOptions={timeOptions}
        />

        {error && (
          <div className="border border-red-300 bg-red-50 p-3 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {report && (
          <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-2">
            <div className="text-xs uppercase tracking-wide text-gray-500">
              Zeitbericht
            </div>

            <ReportRow
              label="Arbeitszeit"
              value={formatDuration(report.arbeitszeit)}
            />

            {report.includeFahrzeit && (
              <ReportRow
                label="Fahrzeit"
                value={formatDuration(report.fahrzeit)}
              />
            )}

            <div className="pt-2 border-t">
              <ReportRow
                label="Gesamtzeit"
                value={formatDuration(report.gesamtzeit)}
                strong
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------- UI Components ---------- */

function TimeBlock({ title, label, value, onChange, timeOptions }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-3">
      <h2 className="text-sm font-semibold text-blue-600 uppercase">{title}</h2>

      <TimeRow
        label={label}
        value={value}
        onChange={onChange}
        timeOptions={timeOptions}
      />
    </div>
  );
}

function TimeRow({ label, value, onChange, timeOptions }) {
  const labels = ["Stunde", "Minute", "Sekunde"];

  return (
    <div>
      <div className="text-xs font-medium text-gray-600 mb-1">{label}</div>
      <div className="grid grid-cols-3 gap-2">
        {["hour", "minute", "second"].map((k, idx) => (
          <div key={k}>
            <div className="text-[10px] text-gray-500 mb-0.5 uppercase">
              {labels[idx]}
            </div>
            <select
              value={value[k]}
              onChange={(e) => onChange({ ...value, [k]: e.target.value })}
              className="h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-sm"
            >
              {timeOptions(k === "hour" ? 24 : 60).map((v) => (
                <option key={v} value={v}>
                  {v}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReportRow({ label, value, strong }) {
  return (
    <div className="flex justify-between text-sm">
      <span className="text-gray-600">{label}</span>
      <span className={strong ? "font-semibold" : ""}>{value}</span>
    </div>
  );
}
