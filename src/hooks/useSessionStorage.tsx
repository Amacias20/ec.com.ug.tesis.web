import { useCallback, useState } from 'react'
import type { SetStateAction } from 'react'

type StorageResult<T> = {
  value: T | null;
  error?: Error;
}

export function useSessionStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: SetStateAction<T>) => StorageResult<T>, () => StorageResult<T>] {
  // Función para obtener el valor inicial
  const getInitialValue = () => {
    if (typeof window === 'undefined') {
      return initialValue instanceof Function ? initialValue() : initialValue
    }

    try {
      const item = window.sessionStorage.getItem(key)
      if (item) {
        return JSON.parse(item)
      }
      return initialValue instanceof Function ? initialValue() : initialValue
    } catch (error) {
      return initialValue instanceof Function ? initialValue() : initialValue
    }
  }

  const [storedValue, setStoredValue] = useState<T>(getInitialValue)

  // Función para actualizar el valor
  const setValue = useCallback(
    (value: SetStateAction<T>): StorageResult<T> => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value
        setStoredValue(valueToStore)
        
        if (typeof window !== 'undefined') {
          window.sessionStorage.setItem(key, JSON.stringify(valueToStore))
        }
        return { value: valueToStore }
      } catch (error) {
        return { 
          value: null, 
          error: error instanceof Error ? error : new Error('Error al guardar en sessionStorage') 
        }
      }
    },
    [key, storedValue]
  )

  // Función para eliminar el valor
  const removeValue = useCallback((): StorageResult<T> => {
    try {
      if (typeof window !== 'undefined') {
        window.sessionStorage.removeItem(key)
      }
      const newValue = initialValue instanceof Function ? initialValue() : initialValue
      setStoredValue(newValue)
      return { value: newValue }
    } catch (error) {
      return { 
        value: null, 
        error: error instanceof Error ? error : new Error('Error al eliminar de sessionStorage') 
      }
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}