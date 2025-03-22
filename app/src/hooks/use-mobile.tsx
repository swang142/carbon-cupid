"use client"

import { useState, useEffect } from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    if (typeof window !== "undefined") {
      const checkIsMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }
      checkIsMobile()
      window.addEventListener("resize", checkIsMobile)
      return () => window.removeEventListener("resize", checkIsMobile)
    }
  }, [])

  return isMobile
}

