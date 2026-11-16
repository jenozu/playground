import { useEffect, useState } from 'react'
import { list, loadBundledSamples, type CourseRecord } from '.'

export function useCourses() {
  const [courses, setCourses] = useState<CourseRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  useEffect(() => {
    let live = true
    loadBundledSamples()
      .then(list)
      .then((c) => live && setCourses(c))
      .catch((e: unknown) => live && setError(e instanceof Error ? e.message : String(e)))
      .finally(() => live && setLoading(false))
    return () => { live = false }
  }, [])
  return { courses, loading, error }
}
