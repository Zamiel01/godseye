"use client"

import { useState } from "react"
import { DeviceGuide } from "@/components/device-guide"

export default function FindMyPhonePage() {
  const [isLocating, setIsLocating] = useState(false)
  const [isGuideOpen, setIsGuideOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)

  const handleFindPhone = () => {
    setIsLocating(true)
    setIsGuideOpen(true)
    setCurrentStep(0)
    setIsLocating(false)
  }

  return (
    <>
      <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
        {/* Logo Section */}
        <div className="mb-16 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2"
              style={{
                background: "linear-gradient(45deg, #ffffff, #f0f4f8)",
                color: "#1a365d",
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M15 2L4 7V14C4 20 8 25 15 28C22 25 26 20 26 14V7L15 2Z"
                  fill="#1a365d"
                  stroke="currentColor"
                  strokeWidth="2"
                />
                <ellipse cx="15" cy="15" rx="8" ry="5" fill="currentColor" />
                <circle cx="15" cy="15" r="3" fill="#1a365d" />
                <circle cx="15" cy="15" r="1.5" fill="currentColor" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white">Gods Eye</h1>
          </div>
          <p className="text-lg text-gray-400">Find My Phone Service</p>
        </div>

        {/* Main Button Section */}
        <div className="text-center">
          <button
            onClick={handleFindPhone}
            disabled={isLocating}
            className="group relative flex items-center gap-3 px-8 py-4 text-lg font-medium rounded-full transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            style={{
              background: "linear-gradient(45deg, #ffffff, #f0f4f8)",
              color: "#1a365d",
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Location Icon */}
            <svg 
              className={`w-6 h-6 ${isLocating ? 'animate-ping' : 'animate-pulse'}`}
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 21C16 21 19 18 19 14C19 10 12 3 12 3C12 3 5 10 5 14C5 18 8 21 12 21Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 17C13.6569 17 15 15.6569 15 14C15 12.3431 13.6569 11 12 11C10.3431 11 9 12.3431 9 14C9 15.6569 10.3431 17 12 17Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            {/* Button Text */}
            <span className="relative">
              {isLocating ? "Locating..." : "Find My Phone"}
            </span>

            {/* Ripple Effect */}
            {isLocating && (
              <span className="absolute inset-0 rounded-full animate-ripple bg-white/20"></span>
            )}
          </button>

          {/* Status Message */}
          {isLocating && (
            <p className="mt-6 text-gray-400 animate-fade-in">
              Searching nearby devices...
            </p>
          )}
        </div>

        {/* Info Text */}
        <div className="mt-16 text-center text-gray-500 max-w-md">
          <p>
            Click the button above to locate your phone. Make sure you have location services enabled.
          </p>
        </div>
      </div>

      <DeviceGuide
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        currentStep={currentStep}
        setCurrentStep={setCurrentStep}
      />
    </>
  )
}
