import { useRef, useLayoutEffect, useEffect } from 'react'

type UseDocumentTitleOptions = {
  preserveTitleOnUnmount?: boolean
  appName?: string
}

export function useDocumentTitle(
  title: string,
  options: UseDocumentTitleOptions = {},
): void {
  const { preserveTitleOnUnmount = true, appName } = options
  const defaultTitle = useRef<string | null>(null)

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

  useIsomorphicLayoutEffect(() => {
    defaultTitle.current = window.document.title
  }, [])

  useIsomorphicLayoutEffect(() => {
    const formattedTitle = appName ? `${appName} | ${title}` : title
    window.document.title = formattedTitle
  }, [title, appName])

  useEffect(() => {
    return () => {
      if (!preserveTitleOnUnmount && defaultTitle.current) {
        window.document.title = defaultTitle.current
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}