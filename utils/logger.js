const { createLogger, format, transports } = require("winston")
const { combine, timestamp, errors, splat, printf, colorize, json } = format
const { Console, File } = transports
const { MongoDB } = require("winston-mongodb")
const fs = require("fs")
const path = require("path")
const EventEmitter = require("events")

// MaxListeners limitini oshiramiz
EventEmitter.defaultMaxListeners = 20

if (!fs.existsSync("log")) fs.mkdirSync("log")

const getCallerInfo = () => {
  const err = new Error()
  const stack = err.stack.split("\n")

  const callerLine = stack.find((line) => {
    return (
      line.includes("at ") &&
      !line.includes("getCallerInfo") &&
      !line.includes("winston") &&
      !line.includes("node_modules") &&
      !line.includes("node:internal")
    )
  })

  if (!callerLine) return "unknown"

  const match =
    callerLine.match(/at (.+?) \((.+):(\d+):\d+\)/) ||
    callerLine.match(/at ()(.+):(\d+):\d+/)

  if (!match) return "unknown"

  const fnName  = match[1]?.trim() || "<anonymous>"
  const file    = path.relative(process.cwd(), match[2])
  const lineNum = match[3]

  return fnName !== "<anonymous>"
    ? `${file}:${lineNum} (${fnName})`
    : `${file}:${lineNum}`
}

const addCallerInfo = format((info) => {
  info.caller = getCallerInfo()
  return info
})

// ─── Console uchun o'qishga qulay format ───────────────────────
const devFormat = combine(
  addCallerInfo(),
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  errors({ stack: true }),
  splat(),
  printf(({ timestamp, level, message, stack, caller }) => {
    const sep = "─".repeat(60)
    const loc = `\x1b[2m📍 ${caller}\x1b[0m`

    if (stack) {
      // Xato bo'lsa stack ham chiqsin, lekin chiroyli
      const stackLines = stack
        .split("\n")
        .slice(1) // birinchi qator message bilan bir xil
        .filter((l) => !l.includes("node:internal") && !l.includes("node_modules"))
        .map((l) => `   \x1b[2m${l.trim()}\x1b[0m`)
        .join("\n")

      return `${sep}\n${timestamp} [${level}]: ${message}\n${stackLines}\n${loc}\n${sep}`
    }

    return `${timestamp} [${level}]: ${message}  ${loc}`
  })
)

const prodFormat = combine(
  addCallerInfo(),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  splat(),
  json()
)

const onlyLevel = (level) => {
  return format((info) => {
    return info.level === level ? info : false
  })()
}

const logger = createLogger({
  level: "silly",
  transports: [
    new Console({ format: devFormat }),

    new File({ filename: "log/errors.log",   level: "error", format: prodFormat }),
    new File({ filename: "log/warnings.log", level: "warn",  format: combine(onlyLevel("warn"), prodFormat) }),
    new File({ filename: "log/infos.log",    level: "info",  format: combine(onlyLevel("info"), prodFormat) }),
    new File({ filename: "log/all-logs.log",                 format: prodFormat }),

    new MongoDB({ db: process.env.MONGO_URL, collection: "error_logs", level: "error", tryReconnect: true, format: prodFormat }),
    new MongoDB({ db: process.env.MONGO_URL, collection: "warn_logs",  level: "warn",  tryReconnect: true, format: combine(onlyLevel("warn"), prodFormat) }),
    new MongoDB({ db: process.env.MONGO_URL, collection: "info_logs",  level: "info",  tryReconnect: true, format: combine(onlyLevel("info"), prodFormat) }),
    new MongoDB({ db: process.env.MONGO_URL, collection: "all_logs",                   tryReconnect: true, format: prodFormat })
  ],
  exceptionHandlers: [
    new File({ filename: "log/exceptions.log", format: prodFormat }),
    new Console({ format: devFormat })
  ],
  rejectionHandlers: [
    new File({ filename: "log/rejections.log", format: prodFormat }),
    new Console({ format: devFormat })
  ]
})

module.exports = logger