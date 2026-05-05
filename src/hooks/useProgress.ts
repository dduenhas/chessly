import { useState, useCallback } from 'react'

const STORAGE_KEY = 'chessly_progress'

export interface LessonProgress {
  completed: boolean
  score: number
  lastAttempt: string | null
}

export interface Progress {
  lessons: Record<string, LessonProgress>
  exercises: Record<string, { completed: boolean; attempts: number }>
}

const defaultProgress = (): Progress => ({
  lessons: {},
  exercises: {},
})

function loadProgress(): Progress {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {}
  return defaultProgress()
}

function saveProgress(progress: Progress) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress)

  const completeLesson = useCallback((lessonId: string, score: number) => {
    setProgress((prev) => {
      const updated: Progress = {
        ...prev,
        lessons: {
          ...prev.lessons,
          [lessonId]: {
            completed: true,
            score,
            lastAttempt: new Date().toISOString(),
          },
        },
      }
      saveProgress(updated)
      return updated
    })
  }, [])

  const completeExercise = useCallback((exerciseId: string) => {
    setProgress((prev) => {
      const current = prev.exercises[exerciseId]
      const updated: Progress = {
        ...prev,
        exercises: {
          ...prev.exercises,
          [exerciseId]: {
            completed: true,
            attempts: (current?.attempts || 0) + 1,
          },
        },
      }
      saveProgress(updated)
      return updated
    })
  }, [])

  const isLessonCompleted = useCallback(
    (lessonId: string) => !!progress.lessons[lessonId]?.completed,
    [progress.lessons]
  )

  const isExerciseCompleted = useCallback(
    (exerciseId: string) => !!progress.exercises[exerciseId]?.completed,
    [progress.exercises]
  )

  const resetProgress = useCallback(() => {
    setProgress(defaultProgress())
    localStorage.removeItem(STORAGE_KEY)
  }, [])

  return {
    progress,
    completeLesson,
    completeExercise,
    isLessonCompleted,
    isExerciseCompleted,
    resetProgress,
  }
}
