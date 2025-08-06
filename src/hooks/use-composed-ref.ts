import { useCallback } from "react"

export function useComposedRef<T>(...refs: (React.Ref<T> | undefined)[]) {
  return useCallback(
    (node: T) => {
      for (const ref of refs) {
        if (typeof ref === "function") {
          ref(node)
        } else if (ref != null) {
          // @ts-ignore
          ref.current = node
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs
  )
}
