const { createLogger, format, transports } = require("winston")
const { combine, timestamp, errors, splat, printf, colorize, json } = format
const { Console, File, MongoDB } = transports
require("winston-mongodb")

const fs = require("fs")


if (!fs.existsSync("log")) fs.mkdirSync("log")


const onlyLevel = (level) => {
  return format((info) => {
    return info.level === level ? info : false
  })()
}

const devFormat = combine(
  colorize(),
  timestamp({ format: "HH:mm:ss" }),
  errors({ stack: true }),
  splat(),
  printf(({ timestamp, level, message, stack }) => {
    return `${timestamp} [${level}]: ${stack || message}`
  })
)

const prodFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  splat(),
  json()
)

const logger = createLogger({
  level: "info",
  transports: [
    new Console({ format: devFormat }),


    new File({ filename: "log/errors.log", level: "error", format: prodFormat }),
    new File({ filename: "log/warnings.log", level: "warn", format: combine(onlyLevel("warn"), prodFormat) }),
    new File({ filename: "log/infos.log", level: "info", format: combine(onlyLevel("info"), prodFormat) }),
    new File({ filename: "log/all-logs.log", format: prodFormat }),

    new MongoDB({
      db: process.env.MONGO_URL,
      collection: "error_logs",
      level: "error",
      options: { useUnifiedTopology: true },
      format: prodFormat
    }),
    new MongoDB({
      db: process.env.MONGO_URL,
      collection: "warn_logs",
      level: "warn",
      options: { useUnifiedTopology: true },
      format: combine(onlyLevel("warn"), prodFormat)
    }),
    new MongoDB({
      db: process.env.MONGO_URL,
      collection: "info_logs",
      level: "info",
      options: { useUnifiedTopology: true },
      format: combine(onlyLevel("info"), prodFormat)
    }),
    new MongoDB({
      db: process.env.MONGO_URL,
      collection: "all_logs",
      options: { useUnifiedTopology: true },
      format: prodFormat
    })
  ],
  exceptionHandlers: [
    new File({ filename: "log/exceptions.log", format: prodFormat })
  ]
})

module.exports = logger