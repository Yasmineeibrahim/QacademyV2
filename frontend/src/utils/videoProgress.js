const STORAGE_KEY = 'qacademy-video-progress-v1'
const MILLISECONDS_THRESHOLD = 86400

const hasWindow = () => typeof window !== 'undefined'

const safeParse = (value) => {
  if (!value) return {}

  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

export const readVideoProgressStore = () => {
  if (!hasWindow()) return {}

  const rawStore = safeParse(localStorage.getItem(STORAGE_KEY))
  let changed = false

  const normalizedStore = Object.entries(rawStore).reduce((acc, [videoId, record]) => {
    if (!record || typeof record !== 'object') {
      return acc
    }

    const durationSeconds = normalizeDurationSeconds(record.durationSeconds)
    const watchedSeconds = normalizeDurationSeconds(record.watchedSeconds)
    const normalizedRecord = {
      ...record,
      durationSeconds,
      watchedSeconds,
    }

    if (
      durationSeconds !== Number(record.durationSeconds || 0) ||
      watchedSeconds !== Number(record.watchedSeconds || 0)
    ) {
      changed = true
    }

    acc[videoId] = normalizedRecord
    return acc
  }, {})

  if (changed) {
    writeVideoProgressStore(normalizedStore)
  }

  return normalizedStore
}

export const writeVideoProgressStore = (store) => {
  if (!hasWindow()) return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store))

  window.dispatchEvent(new Event('qacademy-video-progress-updated'))
}

export const upsertVideoProgress = (videoId, updates) => {
  if (!videoId) return {}

  const store = readVideoProgressStore()
  const previous = store[videoId] && typeof store[videoId] === 'object' ? store[videoId] : {}
  const watchedSeconds = Number.isFinite(Number(updates.watchedSeconds))
    ? Math.max(0, Math.round(Number(updates.watchedSeconds)))
    : Number(previous.watchedSeconds || 0)
  const durationSeconds = Number.isFinite(Number(updates.durationSeconds))
    ? Math.max(0, Math.round(Number(updates.durationSeconds)))
    : Number(previous.durationSeconds || 0)
  const completed = Boolean(updates.completed || previous.completed)

  store[videoId] = {
    ...previous,
    ...updates,
    watchedSeconds: Math.max(Number(previous.watchedSeconds || 0), watchedSeconds),
    durationSeconds: durationSeconds || Number(previous.durationSeconds || 0),
    completed,
  }

  writeVideoProgressStore(store)
  return store[videoId]
}

export const getVideoProgressRecord = (videoId) => {
  if (!videoId) return null

  const store = readVideoProgressStore()
  return store[videoId] || null
}

export const getWatchedSeconds = (record) => {
  if (!record) return 0
  if (typeof record === 'number') return Math.max(0, Math.round(record))

  const watchedSeconds =
    record.watchedSeconds ??
    record.watched_seconds ??
    record.seconds ??
    record.currentTime ??
    0

  return Math.max(0, Math.round(Number(watchedSeconds) || 0))
}

export const normalizeDurationSeconds = (value) => {
  const numericValue = Number(value)
  if (Number.isFinite(numericValue) && numericValue >= 0) {
    const rounded = Math.round(numericValue)
    // Legacy records might store milliseconds; convert to seconds.
    if (rounded > MILLISECONDS_THRESHOLD) {
      return Math.round(rounded / 1000)
    }

    // Some datasets store milliseconds under one day (e.g. 60000 for one minute).
    if (rounded >= 1000 && rounded % 1000 === 0) {
      return Math.round(rounded / 1000)
    }

    return rounded
  }

  if (typeof value !== 'string') return 0

  const trimmed = value.trim().toLowerCase()
  const hoursMatch = trimmed.match(/(\d+)\s*h/)
  const minutesMatch = trimmed.match(/(\d+)\s*m(?!\s*s)/)
  const secondsMatch = trimmed.match(/(\d+)\s*s/)

  if (hoursMatch || minutesMatch || secondsMatch) {
    const hours = hoursMatch ? Number(hoursMatch[1]) : 0
    const minutes = minutesMatch ? Number(minutesMatch[1]) : 0
    const seconds = secondsMatch ? Number(secondsMatch[1]) : 0
    return hours * 3600 + minutes * 60 + seconds
  }

  return 0
}

export const formatDurationFromSeconds = (value) => {
  const totalSeconds = normalizeDurationSeconds(value)

  if (!totalSeconds) return '0m 0s'

  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m`
  }

  return `${minutes}m ${seconds}s`
}

export const getVideoProgressPercent = (record, durationSeconds) => {
  const storedDuration = normalizeDurationSeconds(record?.durationSeconds)
  const fallbackDuration = normalizeDurationSeconds(durationSeconds)
  const totalSeconds = storedDuration > 0 ? storedDuration : fallbackDuration

  if (!totalSeconds) return record?.completed ? 100 : 0
  if (record?.completed) return 100

  const watchedSeconds = Math.min(getWatchedSeconds(record), totalSeconds)
  if (watchedSeconds <= 0) return 0

  const percent = Math.round((watchedSeconds / totalSeconds) * 100)
  return Math.max(1, Math.min(100, percent))
}

export const getCourseProgressStats = (videos = [], lessonCount) => {
  const totalLessons = Number(lessonCount) || videos.length || 0
  const store = readVideoProgressStore()

  const completedLessons = videos.reduce((count, video) => {
    const record = store[video.id]
    return count + (getVideoProgressPercent(record, video.durationSeconds) >= 100 ? 1 : 0)
  }, 0)

  return {
    completedLessons,
    totalLessons,
    progressPercent: totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0,
  }
}
