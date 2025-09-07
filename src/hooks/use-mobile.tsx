import * as React from "react"

const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(false)
  const [isMounted, setIsMounted] = React.useState(false)

  React.useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return
    
    setIsMounted(true)
    
    try {
      const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
      const onChange = () => {
        try {
          setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
        } catch (error) {
          console.warn('Error updating mobile state:', error)
        }
      }
      
      // Set initial value
      onChange()
      
      // Add event listener
      mql.addEventListener("change", onChange)
      
      return () => {
        try {
          mql.removeEventListener("change", onChange)
        } catch (error) {
          console.warn('Error removing mobile listener:', error)
        }
      }
    } catch (error) {
      console.warn('Error setting up mobile detection:', error)
    }
  }, [])

  // Return false during SSR to prevent hydration mismatch
  if (!isMounted) return false
  
  return isMobile
}
