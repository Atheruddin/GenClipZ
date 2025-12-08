"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  Download,
  Share2,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Film,
  Sparkles,
  Clock,
  Zap,
} from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { CursorTrail } from "@/components/cursor-trail"
import { FloatingParticles } from "@/components/floating-particles"
import { InteractiveGrid } from "@/components/interactive-grid"
import { HolographicCard } from "@/components/holographic-card"
import { CustomCursor } from "@/components/custom-cursor"

export default function GeneratePage() {
  const [prompt, setPrompt] = useState("")
  const [videoUrl, setVideoUrl] = useState("")
  const [isGenerating, setIsGenerating] = useState(true)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState("")
  const [generationComplete, setGenerationComplete] = useState(false)
  const [currentStage, setCurrentStage] = useState("Initializing AI...")
  const [generationTime, setGenerationTime] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const storedPrompt = sessionStorage.getItem("videoPrompt")
    if (!storedPrompt) {
      router.push("/")
      return
    }
    setPrompt(storedPrompt)
    generateVideo(storedPrompt)
  }, [router])

  useEffect(() => {
  const interval = setInterval(async () => {
    try {
      const res = await fetch("/videos/final_video.mp4", { method: "HEAD" })
      if (res.ok) {
        clearInterval(interval)
        setVideoUrl("/videos/final_video.mp4")
        setProgress(100)
        setCurrentStage("Video generation complete!")
        setIsGenerating(false)
        setGenerationComplete(true)
      }
    } catch (err) {
      // silent retry
    }
  }, 2000)

  return () => clearInterval(interval)
}, [])



  const generateVideo = async (prompt: string) => {
    try {
      setIsGenerating(true)
      setError("")
      setGenerationTime(0)

      const stages = [
        "Analyzing content structure...",
        "Building narrative flow...",
        "Generating visual elements...",
        "Optimizing transitions...",
        "Rendering final output...",
        "Adding finishing touches...",
      ]

      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          const newProgress = prev + Math.random() * 12
          const stageIndex = Math.floor((newProgress / 100) * stages.length)
          setCurrentStage(stages[Math.min(stageIndex, stages.length - 1)])

          if (newProgress >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return newProgress
        })
      }, 400)

      await fetch("http://localhost:5678/webhook/generate-shorts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ topic: prompt })
      })

      // Wait until the video is available — no time limit
      while (true) {
        try {
          const res = await fetch("/videos/final_video.mp4", { method: "HEAD", cache: "no-store" })
          if (res.ok) break
        } catch (err) {
    // Ignore errors and retry
        }

          await new Promise((r) => setTimeout(r, 5000)) // check every 5 seconds
      }

      const storedUrl = "/videos/final_video.mp4"
      sessionStorage.setItem("videoUrl", storedUrl)
      setVideoUrl(storedUrl)

      setVideoUrl(storedUrl || "")
      setProgress(100)
      setCurrentStage("Video generation complete!")
      setIsGenerating(false)
      setGenerationComplete(true)

      // Create success particle burst
      createSuccessParticles()

      clearInterval(progressInterval)
    } catch (err) {
      setError("Generation failed. Please try again...")
      setIsGenerating(false)
    }
  }

  const createSuccessParticles = () => {
    const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#f59e0b"]

    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div")
      particle.className = "fixed w-2 h-2 rounded-full pointer-events-none z-50"
      particle.style.background = colors[Math.floor(Math.random() * colors.length)]
      particle.style.left = "50%"
      particle.style.top = "50%"

      document.body.appendChild(particle)

      const angle = (i / 20) * Math.PI * 2
      const distance = 150 + Math.random() * 100
      const duration = 1000 + Math.random() * 500

      particle.animate(
        [
          {
            transform: "translate(-50%, -50%) scale(0)",
            opacity: 1,
          },
          {
            transform: `translate(${Math.cos(angle) * distance - 50}px, ${Math.sin(angle) * distance - 50}px) scale(1)`,
            opacity: 0,
          },
        ],
        {
          duration: duration,
          easing: "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        },
      ).onfinish = () => {
        document.body.removeChild(particle)
      }
    }
  }

  const handleRegenerate = () => {
    setVideoUrl("")
    setGenerationComplete(false)
    setProgress(0)
    generateVideo(prompt)
  }

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement("a")
      link.href = videoUrl
      link.download = "ai-generated-video.mp4"
      link.click()
    }
  }

  const handleShare = async () => {
    if (navigator.share && videoUrl) {
      try {
        await navigator.share({
          title: "My AI Generated Video",
          text: `Created with Gen-Clips: "${prompt}"`,
          url: window.location.href,
        })
      } catch (err) {
        navigator.clipboard.writeText(window.location.href)
      }
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      {/* Background Effects */}
      <InteractiveGrid />
      <FloatingParticles />
      <CursorTrail />
      <CustomCursor />

      <div className="fixed inset-0 bg-cyber-grid opacity-15 dark:opacity-20 pointer-events-none" />
      <div className="fixed inset-0 bg-neural-network opacity-20 dark:opacity-30 pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 border-b border-gray-200/50 dark:border-purple-500/20 bg-white/80 dark:bg-black/20 backdrop-blur-xl sticky top-0 animate-slide-in-left">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-3 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group hover-lift"
            >
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
              <span>Back to Generator</span>
            </Link>
            <div className="flex items-center gap-4">
              {isGenerating && (
                <Badge className="bg-blue-100 dark:bg-blue-500/20 border-blue-300 dark:border-blue-500/30 text-blue-800 dark:text-blue-300 backdrop-blur-sm animate-pulse">
                  <Clock className="w-3 h-3 mr-1" />
                  {formatTime(generationTime)}
                </Badge>
              )}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Prompt Display */}
          <div className="animate-fade-in-up">
            <HolographicCard className="mb-8">
              <Card className="border-0 bg-white/90 dark:bg-gray-900/40 backdrop-blur-sm hover-lift group">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg group-hover:scale-110 transition-transform">
                      <Film className="w-4 h-4 text-white" />
                    </div>
                    Your Video Topic
                    <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 dark:text-gray-300 italic text-lg leading-relaxed">"{prompt}"</p>
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Zap className="w-3 h-3" />
                    <span>AI-powered content generation</span>
                  </div>
                </CardContent>
              </Card>
            </HolographicCard>
          </div>

          {/* Generation Status */}
          {isGenerating && (
            <div className="animate-fade-in-up animate-delay-200">
              <HolographicCard className="mb-8">
                <Card className="border-0 bg-white/90 dark:bg-gray-900/40 backdrop-blur-sm hover-lift">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-gray-900 dark:text-white">
                      {/* Enhanced Film Strip Animation */}
                      <div className="relative w-12 h-8">
                        {/* Film strip base */}
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-800 to-gray-700 rounded-sm shadow-lg"></div>

                        {/* Film holes */}
                        <div className="absolute left-0 top-1 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                        <div
                          className="absolute left-0 bottom-1 w-1 h-1 bg-white rounded-full animate-pulse"
                          style={{ animationDelay: "0.5s" }}
                        ></div>
                        <div
                          className="absolute right-0 top-1 w-1 h-1 bg-white rounded-full animate-pulse"
                          style={{ animationDelay: "0.25s" }}
                        ></div>
                        <div
                          className="absolute right-0 bottom-1 w-1 h-1 bg-white rounded-full animate-pulse"
                          style={{ animationDelay: "0.75s" }}
                        ></div>

                        {/* Moving frames with enhanced visuals */}
                        <div className="absolute inset-x-2 inset-y-0 overflow-hidden rounded-sm">
                          <div className="flex h-full animate-film-roll">
                            <div className="min-w-[6px] h-full bg-gradient-to-b from-purple-500 via-purple-600 to-purple-700 mr-0.5 shadow-sm"></div>
                            <div className="min-w-[6px] h-full bg-gradient-to-b from-cyan-500 via-cyan-600 to-cyan-700 mr-0.5 shadow-sm"></div>
                            <div className="min-w-[6px] h-full bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 mr-0.5 shadow-sm"></div>
                            <div className="min-w-[6px] h-full bg-gradient-to-b from-purple-500 via-purple-600 to-purple-700 mr-0.5 shadow-sm"></div>
                            <div className="min-w-[6px] h-full bg-gradient-to-b from-cyan-500 via-cyan-600 to-cyan-700 mr-0.5 shadow-sm"></div>
                            <div className="min-w-[6px] h-full bg-gradient-to-b from-blue-500 via-blue-600 to-blue-700 mr-0.5 shadow-sm"></div>
                          </div>
                        </div>

                        {/* Enhanced glow effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-cyan-500/20 to-blue-500/20 rounded-sm blur-sm animate-pulse"></div>

                        {/* Processing indicators */}
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping"></div>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>

                        {/* Frame counter */}
                        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 text-xs font-mono text-gray-600 dark:text-gray-400 animate-pulse">
                          {Math.floor(progress * 2.4)}f
                        </div>
                      </div>
                      AI Video Generator Active
                      <div className="ml-auto flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span>Live</span>
                      </div>
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-lg">
                      Creating your impactful video with engaging content and clear structure.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="relative h-4 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden shadow-inner">
                        {/* Animated background waves */}
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-cyan-500/10 to-blue-500/10 animate-pulse"></div>

                        {/* Main progress bar with enhanced gradient */}
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 rounded-full transition-all duration-500 ease-out relative overflow-hidden shadow-lg"
                          style={{ width: `${progress}%` }}
                        >
                          {/* Animated shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"></div>

                          {/* Enhanced flowing particles */}
                          <div className="absolute inset-0 opacity-70">
                            <div
                              className="w-2 h-2 bg-white/90 rounded-full absolute top-1 animate-bounce shadow-sm"
                              style={{ left: "10%", animationDelay: "0s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 bg-white/70 rounded-full absolute top-1.5 animate-bounce shadow-sm"
                              style={{ left: "30%", animationDelay: "0.2s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-white/90 rounded-full absolute top-1 animate-bounce shadow-sm"
                              style={{ left: "50%", animationDelay: "0.4s" }}
                            ></div>
                            <div
                              className="w-1.5 h-1.5 bg-white/70 rounded-full absolute top-1.5 animate-bounce shadow-sm"
                              style={{ left: "70%", animationDelay: "0.6s" }}
                            ></div>
                            <div
                              className="w-2 h-2 bg-white/90 rounded-full absolute top-1 animate-bounce shadow-sm"
                              style={{ left: "90%", animationDelay: "0.8s" }}
                            ></div>
                          </div>
                        </div>

                        {/* Enhanced glow effect */}
                        <div
                          className="absolute top-0 h-full bg-gradient-to-r from-purple-600 via-cyan-500 to-blue-600 rounded-full blur-sm opacity-60 transition-all duration-500"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-purple-700 dark:text-purple-300 font-medium flex items-center gap-2">
                          <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                          {currentStage}
                        </span>
                        <span className="text-cyan-700 dark:text-cyan-300 font-mono bg-cyan-100 dark:bg-cyan-500/10 px-2 py-1 rounded">
                          {Math.round(progress)}%
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div className="p-3 bg-purple-100 dark:bg-purple-500/10 rounded-lg border border-purple-200 dark:border-purple-500/20 hover-lift transition-all duration-300 hover:scale-105">
                          <div className="text-purple-700 dark:text-purple-400 font-bold">CONTENT</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Analyzing</div>
                          <div className="w-full bg-purple-200 dark:bg-purple-500/20 rounded-full h-1 mt-2">
                            <div
                              className="bg-purple-500 h-1 rounded-full animate-pulse"
                              style={{ width: `${Math.min(progress * 1.2, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="p-3 bg-cyan-100 dark:bg-cyan-500/10 rounded-lg border border-cyan-200 dark:border-cyan-500/20 hover-lift transition-all duration-300 hover:scale-105">
                          <div className="text-cyan-700 dark:text-cyan-400 font-bold">AI</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Processing</div>
                          <div className="w-full bg-cyan-200 dark:bg-cyan-500/20 rounded-full h-1 mt-2">
                            <div
                              className="bg-cyan-500 h-1 rounded-full animate-pulse"
                              style={{ width: `${Math.min(progress * 1.1, 100)}%` }}
                            ></div>
                          </div>
                        </div>
                        <div className="p-3 bg-blue-100 dark:bg-blue-500/10 rounded-lg border border-blue-200 dark:border-blue-500/20 hover-lift transition-all duration-300 hover:scale-105">
                          <div className="text-blue-700 dark:text-blue-400 font-bold">VIDEO</div>
                          <div className="text-xs text-gray-600 dark:text-gray-400">Rendering</div>
                          <div className="w-full bg-blue-200 dark:bg-blue-500/20 rounded-full h-1 mt-2">
                            <div
                              className="bg-blue-500 h-1 rounded-full animate-pulse"
                              style={{ width: `${progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </HolographicCard>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="animate-scale-in">
              <HolographicCard className="mb-8">
                <Card className="border-red-300 dark:border-red-500/30 bg-red-50 dark:bg-red-900/20 backdrop-blur-sm hover-lift">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 text-red-700 dark:text-red-400 mb-4">
                      <AlertCircle className="w-6 h-6 animate-pulse" />
                      <span className="font-medium text-lg">{error}</span>
                    </div>
                    <Button
                      onClick={handleRegenerate}
                      className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 border-0 text-white hover-lift transition-all duration-300 hover:scale-105"
                    >
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Retry Generation
                    </Button>
                  </CardContent>
                </Card>
              </HolographicCard>
            </div>
          )}

          {/* Video Display */}
          {generationComplete && videoUrl && (
            <div className="animate-scale-in">
              <HolographicCard className="mb-8">
                <Card className="border-0 bg-white/90 dark:bg-gray-900/40 backdrop-blur-sm hover-lift">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-green-700 dark:text-green-400">
                      <div className="relative">
                        <CheckCircle className="w-7 h-7 animate-pulse" />
                        <div className="absolute inset-0 bg-green-500/20 rounded-full animate-ping"></div>
                      </div>
                      Video Ready!
                      <Badge className="bg-green-100 dark:bg-green-500/20 border-green-300 dark:border-green-500/30 text-green-800 dark:text-green-300">
                        <Sparkles className="w-3 h-3 mr-1" />
                        Generated in {formatTime(generationTime)}
                      </Badge>
                    </CardTitle>
                    <CardDescription className="text-gray-600 dark:text-gray-300 text-lg">
                      Your AI-generated video is ready to make an impact. Share it with the world!
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-8">
                      {/* Video Player */}
                      <div className="relative rounded-xl overflow-hidden bg-black aspect-video group hover-lift shadow-2xl">
                        <video
                          controls
                          className="w-full h-full object-cover"
                          poster="/placeholder.svg?height=400&width=600"
                        >
                          <source src={videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                        {/* Video overlay info */}
                        <div>
                          <div className="flex items-center gap-2">
                            
                            <span></span>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Action Buttons */}
                      <div className="flex flex-wrap gap-4">
                        <Button
                          onClick={handleDownload}
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 border-0 shadow-lg shadow-green-500/25 text-white hover-lift transition-all duration-300 hover:scale-105"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download Video
                        </Button>
                        <Button
                          onClick={handleShare}
                          variant="outline"
                          className="border-purple-300 dark:border-purple-500/30 bg-purple-50 dark:bg-purple-500/10 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-500/20 hover-lift transition-all duration-300 hover:scale-105"
                        >
                          <Share2 className="w-4 h-4 mr-2" />
                          Share
                        </Button>
                        <Button
                          onClick={handleRegenerate}
                          variant="outline"
                          className="border-cyan-300 dark:border-cyan-500/30 bg-cyan-50 dark:bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 hover:bg-cyan-100 dark:hover:bg-cyan-500/20 hover-lift transition-all duration-300 hover:scale-105"
                        >
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Create Another
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </HolographicCard>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
