import { useState, useCallback, useEffect, useLayoutEffect } from 'react'

// Función auxiliar para debounce
function debounce<T extends (...args: any[]) => any>(
  fn: T,
  delay: number = 0
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout>
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn(...args), delay)
  }
}

type WindowSize = {
  width: number
  height: number
}

type UseWindowSizeOptions = {
  debounceDelay?: number
}

export function useWindowSize(options: Partial<UseWindowSizeOptions> = {}): WindowSize {
  const [windowSize, setWindowSize] = useState<WindowSize>({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  const debouncedSetWindowSize = useCallback(
    debounce(setWindowSize, options.debounceDelay),
    [options.debounceDelay]
  )

  const handleSize = useCallback(() => {
    const setSize = options.debounceDelay
      ? debouncedSetWindowSize
      : setWindowSize

    setSize({
      width: window.innerWidth,
      height: window.innerHeight,
    })
  }, [options.debounceDelay, debouncedSetWindowSize])

  useEffect(() => {
    window.addEventListener('resize', handleSize)
    return () => window.removeEventListener('resize', handleSize)
  }, [handleSize])

  useLayoutEffect(() => {
    handleSize()
  }, [handleSize])

  return windowSize
}