import React, { useState, useMemo } from 'react'

function getAge(dobStr) {
  if (!dobStr) return null

  const birth = new Date(dobStr + "T00:00:00")
  const now = new Date()

  if (isNaN(birth.getTime()) || birth > now) return null

  let years = now.getFullYear() - birth.getFullYear()
  let months = now.getMonth() - birth.getMonth()
  let days = now.getDate() - birth.getDate()

  if (days < 0) {
    months--
    days += new Date(now.getFullYear(), now.getMonth(), 0).getDate()
  }

  if (months < 0) {
    years--
    months += 12
  }

  const MS_PER_DAY = 1000 * 60 * 60 * 24
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const totalDays = Math.round((today - birth) / MS_PER_DAY)
  const totalMonths = years * 12 + months
  const totalWeeks = Math.floor(totalDays / 7)
  const totalHours = totalDays * 24

  let next = new Date(
    now.getFullYear(),
    birth.getMonth(),
    birth.getDate()
  )

  if (next < today) {
    next = new Date(
      now.getFullYear() + 1,
      birth.getMonth(),
      birth.getDate()
    )
  }

  const daysToBirthday = Math.round((next - today) / MS_PER_DAY)

  return {
    years,
    months,
    days,
    totalMonths,
    totalWeeks,
    totalDays,
    totalHours,
    daysToBirthday
  }
}

const App = () => {
  const [dob, setDob] = useState("")

  const now = new Date()

  const todayStr = `${now.getFullYear()}-${String(
    now.getMonth() + 1
  ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`

  const age = useMemo(() => getAge(dob), [dob])
  const isFuture = dob && dob > todayStr

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#050b1f] p-4 font-sans text-slate-100">

      <div className="w-full max-w-xl">

        <div className="rounded-3xl border border-white/10 bg-[#070f28]/80 p-6 shadow-2xl shadow-sky-950/60 backdrop-blur-xl sm:p-8">

          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
              Age <span className="text-sky-400">Calculator</span>
            </h1>

            <p className="mt-1 text-sm text-slate-400">
              Pick your date of birth to see your exact age.
            </p>
          </div>

          {/* Input */}
          <label
            htmlFor="dob"
            className="mb-2 block text-xs font-medium uppercase tracking-widest text-sky-300/80"
          >
            Date of birth
          </label>

          <div className="flex gap-3">
            <input
              id="dob"
              type="date"
              value={dob}
              max={todayStr}
              onChange={(e) => setDob(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-[#0b1633] px-4 py-3 text-white outline-none transition [color-scheme:dark] focus:border-sky-400/70 focus:ring-2 focus:ring-sky-400/30"
            />

            {dob && (
              <button
                onClick={() => setDob("")}
                className="shrink-0 rounded-xl border border-white/10 bg-white/5 px-4 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* Future Date Error */}
          {isFuture && (
            <p className="mt-3 text-sm text-rose-400">
              Date of birth can't be in the future.
            </p>
          )}

          {/* Results */}
          {age ? (
            <div className="mt-7 space-y-5">

              {/* Main Age */}
              <div>
                <p className="mb-3 text-xs uppercase tracking-widest text-slate-400">
                  Your age
                </p>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: age.years, label: "Years" },
                    { value: age.months, label: "Months" },
                    { value: age.days, label: "Days" }
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="relative overflow-hidden rounded-2xl border border-sky-400/20 bg-gradient-to-b from-sky-400/10 to-transparent p-5 text-center"
                    >
                      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/60 to-transparent" />

                      <p className="text-4xl font-bold text-sky-300 tabular-nums sm:text-5xl">
                        {item.value}
                      </p>

                      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">
                        {item.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">

                {[
                  { label: "Months", value: age.totalMonths },
                  { label: "Weeks", value: age.totalWeeks },
                  { label: "Days", value: age.totalDays },
                  { label: "Hours", value: age.totalHours.toLocaleString() }
                ].map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3"
                  >
                    <p className="text-[11px] uppercase tracking-widest text-sky-300/70">
                      {item.label}
                    </p>

                    <p className="mt-1 text-lg font-semibold text-white tabular-nums">
                      {item.value}
                    </p>
                  </div>
                ))}

              </div>

              {/* Birthday Countdown */}
              <div className="flex items-center gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.07] px-4 py-3">

                <span className="text-xl">🎂</span>

                <p className="text-sm text-emerald-200/90">
                  {age.daysToBirthday === 0 ? (
                    <>Happy birthday! 🎉</>
                  ) : (
                    <>
                      <span className="font-semibold text-emerald-300">
                        {age.daysToBirthday}
                      </span>{" "}
                      day{age.daysToBirthday === 1 ? "" : "s"} until your next birthday.
                    </>
                  )}
                </p>

              </div>

            </div>
          ) : (
            !isFuture && (
              <div className="mt-7 rounded-2xl border border-dashed border-white/10 py-10 text-center text-sm text-slate-500">
                Enter your birth date to calculate your age.
              </div>
            )
          )}

        </div>

        <p className="mt-4 text-center text-xs text-slate-600">
          Calculated from your local date &amp; time.
        </p>

      </div>
    </div>
  )
}

export default App
