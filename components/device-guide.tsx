"use client"

import { Button } from "@/components/ui/button"
import "@/styles/guide.css"
import {
  X,
  ChevronRight,
  ChevronLeft,
  HelpCircle,
  Smartphone,
  Shield,
  Volume2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Play,
  Lock,
  MapPin,
} from "lucide-react"
import { useState, useEffect, useRef } from "react"

const guideSteps = [
  {
    title: "Welcome to Gods Eye",
    description: "We'll help you find your Android device using your Google account. Make sure you have your Google login ready.",
    icon: <Shield className="w-6 h-6" />,
    action: "Have your Google account credentials ready",
    buttonText: "I'm Ready",
    showPopup: false,
  },
  {
    title: "Important Requirements",
    description: window.innerWidth < 640 
      ? "Please make sure your device is turned on, connected to the internet, and has location services enabled. After completing this guide, we'll open Google's Find My Device service."
      : "We'll open Google's service in a smaller window so you can follow along with our guide.",
    icon: <ExternalLink className="w-6 h-6" />,
    action: window.innerWidth < 640 
      ? "Ensure your device meets these requirements"
      : "Click to open Google Find My Device",
    buttonText: window.innerWidth < 640 ? "Requirements Ready" : "Open Find My Device",
    showPopup: true,
  },
  {
    title: "Sign In to Google",
    description: "In the popup window, click the blue 'Sign in' button and enter your Google account details.",
    icon: <Lock className="w-6 h-6" />,
    action: "Sign in with your Google account",
    buttonText: "I've Signed In",
    showPopup: false,
    tip: "Use the same Google account that's on your missing phone",
    alternativeAction: true,
  },
  {
    title: "Select Your Device",
    description: "You'll see a list of your devices. Click on the missing device to select it.",
    icon: <Smartphone className="w-6 h-6" />,
    action: "Click on your missing device",
    buttonText: "Device Selected",
    showPopup: false,
    tip: "Look for your phone's name or model number",
  },
  {
    title: "View Phone Location",
    description:
      "Once your device is selected, you'll see its location on the map. The blue dot shows where your phone was last seen.",
    icon: <MapPin className="w-6 h-6" />,
    action: "Check your phone's location on the map",
    buttonText: "I See the Location",
    showPopup: false,
    tip: "Location accuracy depends on GPS, WiFi, and cell towers. It may show an approximate area rather than exact spot.",
  },
  {
    title: "Ring Your Phone",
    description:
      "Now that you can see your phone's location on the map, click the 'Play sound' button to make it ring at maximum volume, even if it's on silent.",
    icon: <Volume2 className="w-6 h-6" />,
    action: "Click 'Play sound' to ring your phone",
    buttonText: "Phone is Ringing!",
    showPopup: false,
    tip: "The sound plays for 5 minutes at maximum volume - perfect for finding it in the area shown on the map",
  },
  {
    title: "Additional Options",
    description: "You can also 'Secure device' to lock it or 'Erase device' as a last resort.",
    icon: <Shield className="w-6 h-6" />,
    action: "Use other options if needed",
    buttonText: "Understood",
    showPopup: false,
    tip: "Only use 'Erase device' if you can't recover your phone",
  },
  {
    title: "Success!",
    description:
      "Great! You've located your device. You can now close both windows or continue using Google's service.",
    icon: <CheckCircle className="w-6 h-6" />,
    action: "Your device has been located",
    buttonText: "Complete",
    showPopup: false,
  },
]

export function DeviceGuide({
  isOpen,
  onClose,
  currentStep,
  setCurrentStep,
}: {
  isOpen: boolean
  onClose: () => void
  currentStep: number
  setCurrentStep: (step: number) => void
}) {
  const [popupWindow, setPopupWindow] = useState<Window | null>(null)
  const [isPopupBlocked, setIsPopupBlocked] = useState(false)
  const [popupClosed, setPopupClosed] = useState(false)
  const [popupOpened, setPopupOpened] = useState(false)
  const [userAlreadySignedIn, setUserAlreadySignedIn] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const popupCheckInterval = useRef<NodeJS.Timeout | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  // Handle responsive behavior
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 640) // sm breakpoint
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Auto-scroll to top when step changes
  useEffect(() => {
    if (contentRef.current) {
      contentRef.current.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    }
  }, [currentStep])

  const openFindMyDevice = () => {
    try {
      // Calculate popup position to not overlap with guide
      const screenWidth = window.screen.width
      const screenHeight = window.screen.height
      const popupWidth = Math.min(800, screenWidth * 0.6)
      const popupHeight = Math.min(600, screenHeight * 0.7)
      const left = screenWidth - popupWidth - 50
      const top = 50

      const popup = window.open(
        "https://www.google.com/android/find",
        "findmydevice",
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes,resizable=yes,toolbar=no,menubar=no,location=yes`,
      )

      if (!popup || popup.closed) {
        setIsPopupBlocked(true)
        return
      }

      setPopupWindow(popup)
      setIsPopupBlocked(false)
      setPopupClosed(false)
      setPopupOpened(true)

      // Prevent popup from losing focus when guide is interacted with
      popup.focus()

      // Check if popup is closed
      popupCheckInterval.current = setInterval(() => {
        if (popup.closed) {
          setPopupClosed(true)
          if (popupCheckInterval.current) {
            clearInterval(popupCheckInterval.current)
          }
        }
      }, 1000)
    } catch (error) {
      setIsPopupBlocked(true)
    }
  }

  const closePopup = () => {
    if (popupWindow && !popupWindow.closed) {
      popupWindow.close()
      setPopupClosed(true)
      setPopupOpened(false)
    }
    if (popupCheckInterval.current) {
      clearInterval(popupCheckInterval.current)
    }
  }

  const focusPopup = () => {
    if (popupWindow && !popupWindow.closed) {
      popupWindow.focus()
    }
  }

  const reopenPopup = () => {
    openFindMyDevice()
    setPopupClosed(false)
  }

  const handleAlreadySignedIn = () => {
    setUserAlreadySignedIn(true)
    setCurrentStep(currentStep + 1)
  }

  useEffect(() => {
    return () => {
      if (popupCheckInterval.current) {
        clearInterval(popupCheckInterval.current)
      }
    }
  }, [])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (!isOpen) return

      if (event.key === "ArrowLeft" && currentStep > 0) {
        setCurrentStep(currentStep - 1)
      } else if (event.key === "ArrowRight" && currentStep < guideSteps.length - 1) {
        setCurrentStep(currentStep + 1)
      } else if (event.key === "Escape") {
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [isOpen, currentStep, setCurrentStep, onClose])

  if (!isOpen) return null

  return (
    <>
      {/* Popup Blocked Warning */}
      {isPopupBlocked && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-slate-800 border border-slate-600 rounded-lg p-6 max-w-md mx-4">
            <div className="flex items-center gap-3 mb-4">
              <AlertCircle className="w-8 h-8 text-orange-400" />
              <h3 className="text-lg font-semibold text-white">Popup Blocked</h3>
            </div>
            <p className="text-slate-300 mb-4">
              Your browser blocked the popup. Please allow popups for this site and try again.
            </p>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsPopupBlocked(false)}
                variant="outline"
                className="border-slate-600 text-white hover:bg-slate-700"
              >
                Try Again
              </Button>
              <Button
                onClick={() => window.open("https://www.google.com/android/find", "_blank")}
                className="bg-white text-slate-800 hover:bg-gray-100"
              >
                Open Manually
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Guide UI */}
      <div
        className="fixed z-40 
                inset-4 pt-16 
                sm:inset-x-4 sm:top-24 sm:bottom-4
                lg:left-4 lg:right-auto lg:top-24
                flex items-center justify-center
                sm:items-start sm:justify-center
                lg:justify-start"
      >
        <div
          className="bg-slate-800 border border-slate-600 rounded-xl shadow-2xl overflow-hidden 
                          w-full max-w-[90vw] sm:max-w-md lg:w-80
                          h-[calc(100vh-8rem)] sm:h-[calc(100vh-12rem)] lg:h-[calc(100vh-12rem)]
                          flex flex-col"
        >
          {/* Compact Header */}
          <div className="bg-gradient-to-r from-slate-700 to-slate-600 p-3 md:p-4 text-white flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
                  {guideSteps[currentStep].icon}
                </div>
                <div>
                  <h3 className="text-base md:text-lg font-bold">Gods Eye Guide</h3>
                  <p className="text-slate-300 text-xs">
                    Step {currentStep + 1} of {guideSteps.length}
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white hover:bg-white hover:bg-opacity-20 p-1 flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div ref={contentRef} className="p-3 md:p-4 overflow-y-auto flex-1 min-h-0 custom-scrollbar">
            <h4 className="text-base md:text-lg font-bold text-white mb-2">{guideSteps[currentStep].title}</h4>
            <p className="text-slate-300 text-sm leading-relaxed mb-3 md:mb-4">
              {guideSteps[currentStep].description}
            </p>

            {/* Action Instruction */}
            <div className="bg-slate-700 border border-slate-600 rounded-lg p-2 md:p-3 mb-3 md:mb-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-4 h-4 md:w-5 md:h-5 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Play className="w-2 h-2 md:w-3 md:h-3 text-white" />
                </div>
                <span className="font-medium text-blue-300 text-sm">Next:</span>
              </div>
              <p className="text-blue-200 text-sm">{guideSteps[currentStep].action}</p>
            </div>

            {/* Alternative Action for Sign In Step */}
            {guideSteps[currentStep].alternativeAction && !userAlreadySignedIn && (
              <div className="bg-green-900 bg-opacity-30 border border-green-600 rounded-lg p-2 md:p-3 mb-3 md:mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="font-medium text-green-300 text-sm">Already signed in?</span>
                </div>
                <p className="text-green-200 text-sm mb-2">
                  If you're already signed in to Google, skip the sign-in step.
                </p>
                <Button
                  onClick={handleAlreadySignedIn}
                  size="sm"
                  className="bg-green-600 hover:bg-green-700 text-white text-xs w-full"
                >
                  I'm Already Signed In
                </Button>
              </div>
            )}

            {/* Single Tip */}
            {guideSteps[currentStep].tip && (
              <div className="bg-slate-700 border border-slate-600 rounded-lg p-2 md:p-3 mb-3 md:mb-4">
                <div className="flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-300 text-sm">{guideSteps[currentStep].tip}</p>
                </div>
              </div>
            )}

            {/* Compact Progress */}
            <div className="mb-3 md:mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs text-slate-400">Progress</span>
                <span className="text-xs text-white">
                  {Math.round(((currentStep + 1) / guideSteps.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-600 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-400 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((currentStep + 1) / guideSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Popup Status & Controls */}
            {popupOpened && (
              <div className="mb-3 md:mb-4 p-2 md:p-3 bg-slate-700 rounded-lg">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-slate-400">Google Find Status:</span>
                  <div className="flex items-center gap-1">
                    <div className={`w-2 h-2 rounded-full ${popupClosed ? "bg-red-500" : "bg-green-500"}`} />
                    <span className={popupClosed ? "text-red-400" : "text-green-400"}>
                      {popupClosed ? "Closed" : "Active"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  {popupClosed ? (
                    <Button size="sm" onClick={reopenPopup} className="flex-1 text-xs">
                      Reopen Google Find
                    </Button>
                  ) : (
                    <>
                      <Button
                        size="sm"
                        onClick={focusPopup}
                        variant="outline"
                        className="flex-1 text-xs border-slate-500 text-white hover:bg-slate-600 bg-transparent"
                      >
                        Focus Window
                      </Button>
                      <Button
                        size="sm"
                        onClick={closePopup}
                        variant="outline"
                        className="flex-1 text-xs border-red-500 text-red-400 hover:bg-red-900 hover:bg-opacity-20 bg-transparent"
                      >
                        Close Find Hub
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Fixed Navigation Footer */}
          <div className="p-3 md:p-4 border-t border-slate-600 bg-slate-800 flex-shrink-0 sticky bottom-0">
            {/* Compact Navigation */}
            <div className="flex items-center justify-between gap-2 mb-3">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(currentStep - 1)}
                disabled={currentStep === 0}
                className="flex items-center gap-1 px-2 md:px-3 py-2 bg-transparent border border-slate-500 text-white hover:bg-slate-600 disabled:opacity-50 text-sm flex-shrink-0"
              >
                <ChevronLeft className="w-3 h-3" />
                <span className="hidden sm:inline">Back</span>
              </Button>

              <Button
                onClick={() => {
                  // For mobile devices, only open popup at the end of the guide
                  const isMobile = window.innerWidth < 640 // sm breakpoint
                  
                  if (!isMobile && guideSteps[currentStep].showPopup && !popupOpened) {
                    openFindMyDevice()
                  }

                  if (currentStep === guideSteps.length - 1) {
                    if (isMobile) {
                      openFindMyDevice() // Open popup when finishing the guide on mobile
                    }
                    onClose()
                  } else {
                    setCurrentStep(currentStep + 1)
                  }
                }}
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 px-2 md:px-3 py-2 text-sm font-medium flex items-center gap-1 flex-1 max-w-[200px]"
              >
                <span className="truncate">
                  {currentStep === guideSteps.length - 1 
                    ? (isMobile ? "Find Device" : "Done") 
                    : guideSteps[currentStep].buttonText}
                </span>
                {currentStep === guideSteps.length - 1 ? (
                  isMobile ? <ExternalLink className="w-3 h-3 flex-shrink-0" /> : <CheckCircle className="w-3 h-3 flex-shrink-0" />
                ) : (
                  <ChevronRight className="w-3 h-3 flex-shrink-0" />
                )}
              </Button>
            </div>

            {/* Keyboard Shortcuts */}
            <div className="flex justify-center gap-3 text-xs text-slate-400">
              <span className="hidden sm:inline">← → Navigate</span>
              <span>Esc Close</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
