import { useCallback, useEffect, useRef, useState } from "react"
const alarmSound = "alarm-sound.mp3"

const INITIAL_TIME = 1500

function App() {
  const [isActive, setIsActive] = useState(false)
  const [time, setTime] = useState(INITIAL_TIME)
  const [isEditTime, setIsEditTime] = useState(false)
  const [isAlarmPlaying, setIsAlarmPlaying] = useState(false)
  const alarm = useRef(new Audio(alarmSound))

  const hours = Math.floor((time / (60 * 60)) % 24)
  const minutes = Math.floor((time / 60) % 60)
  const seconds = Math.floor(time % 60)

  const handleEditTime = useCallback(
    (unit: "hrs" | "mins" | "secs", type: "inc" | "dec") => {
      if (time === 0) return
      if (unit === "hrs") {
        setTime((t) =>
          type === "inc" ? t + 60 * 60 : type === "dec" ? t - 60 * 60 : t
        )
      }
      if (unit === "mins") {
        setTime((t) => (type === "inc" ? t + 60 : type === "dec" ? t - 60 : t))
      }
      if (unit === "secs") {
        setTime((t) => (type === "inc" ? t + 1 : type === "dec" ? t - 1 : t))
      }
    },
    [hours, minutes, seconds, time]
  )

  const handleAlarmLoop = useCallback(() => {
    if (isAlarmPlaying) {
      alarm.current.play()
    }
  }, [alarm, isAlarmPlaying])

  useEffect(() => {
    if (isEditTime && time <= 0) {
      setTime(INITIAL_TIME)
    }
    if (isActive && time <= 0) {
      setIsAlarmPlaying(true)
      setIsActive(false)
      alarm.current.play()
      // alarm.onended = handleAlarmLoop
    }
  }, [time, isEditTime, isActive])

  useEffect(() => {
    const handleAlram = () => {
      // alarm.currentTime = 0
      alarm.current.play()
    }

    if (isAlarmPlaying) {
      alarm.current.addEventListener("ended", handleAlram)
    } else {
      alarm.current.removeEventListener("ended", handleAlram)
    }

    return () => {
      alarm.current.removeEventListener("ended", handleAlram)
    }
  }, [alarm, isAlarmPlaying])

  useEffect(() => {
    let handleInterval: ReturnType<typeof setInterval> | null = null

    if (isActive) {
      handleInterval = setInterval(() => {
        setTime((t) => (t > 0 ? t - 1 : 0))
      }, 1000)
    } else {
      handleInterval && clearInterval(handleInterval)
    }

    return () => {
      handleInterval && clearInterval(handleInterval)
    }
  }, [isActive])

  return (
    <div
      data-theme="business"
      className="flex min-h-screen flex-col items-center gap-4"
    >
      <h1 className="m-6 text-4xl font-extrabold tracking-tight">
        14/27 - Pomodoro
      </h1>

      <div className="m-8">
        <div>
          <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
            <div>
              <div className="h-8">
                {isEditTime && (
                  <button
                    onClick={() => handleEditTime("hrs", "dec")}
                    className="btn btn-sm"
                  >
                    ⬆
                  </button>
                )}
              </div>

              <div className="m-2 flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-6xl">
                  <span
                    style={{ "--value": hours } as Record<string, number>}
                  ></span>
                </span>
                hours
              </div>

              <div className="h-8">
                {isEditTime && (
                  <button
                    onClick={() => handleEditTime("hrs", "inc")}
                    className="btn btn-sm"
                  >
                    ⬇
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="h-8">
                {isEditTime && (
                  <button
                    onClick={() => handleEditTime("mins", "dec")}
                    className="btn btn-sm"
                  >
                    ⬆
                  </button>
                )}
              </div>

              <div className="m-2 flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-6xl">
                  <span
                    style={{ "--value": minutes } as Record<string, number>}
                  ></span>
                </span>
                minutes
              </div>

              <div className="h-8">
                {isEditTime && (
                  <button
                    onClick={() => handleEditTime("mins", "inc")}
                    className="btn btn-sm"
                  >
                    ⬇
                  </button>
                )}
              </div>
            </div>

            <div>
              <div className="h-8">
                {isEditTime && (
                  <button
                    onClick={() => handleEditTime("secs", "dec")}
                    className="btn btn-sm"
                  >
                    ⬆
                  </button>
                )}
              </div>

              <div className="m-2 flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                <span className="countdown font-mono text-6xl">
                  <span
                    style={{ "--value": seconds } as Record<string, number>}
                  ></span>
                </span>
                seconds
              </div>

              <div className="h-8">
                {isEditTime && (
                  <button
                    onClick={() => handleEditTime("secs", "inc")}
                    className="btn btn-sm"
                  >
                    ⬇
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-flow-col gap-5 text-center auto-cols-max ">
        <button
          onClick={() => {
            setIsActive((e) => !e)
          }}
          className="btn btn-lg btn-primary"
          disabled={isEditTime || isAlarmPlaying}
        >
          {isActive ? "Stop" : "Start"}
        </button>
        <button
          onClick={() => {
            setTime(INITIAL_TIME)
          }}
          className="btn btn-lg btn-primary"
          disabled={isActive || isAlarmPlaying}
        >
          Reset
        </button>
        <button
          onClick={() => {
            alarm.current.pause()
            alarm.current.currentTime = 0
            setTime(INITIAL_TIME)
            setIsAlarmPlaying(false)
          }}
          className="btn btn-lg btn-primary"
          disabled={!isAlarmPlaying}
        >
          Stop Alarm
        </button>
        <button
          onClick={() => setIsEditTime((e) => !e)}
          className="btn btn-lg btn-primary"
          disabled={isActive || isAlarmPlaying}
        >
          {!isEditTime ? "Edit Time" : "Set Time"}
        </button>
      </div>
    </div>
  )
}

export default App
