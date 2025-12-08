"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Sparkles, Video, ArrowRight, BookOpen, Users, Presentation, Play, Layers, GraduationCap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ThemeToggle } from "@/components/theme-toggle"
import { CursorTrail } from "@/components/cursor-trail"
import { FloatingParticles } from "@/components/floating-particles"
import { InteractiveGrid } from "@/components/interactive-grid"
import { HolographicCard } from "@/components/holographic-card"
import { CustomCursor } from "@/components/custom-cursor"



export default function HomePage() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const router = useRouter()
  const handleSubmit = async () => {
  if (!prompt.trim()) return
  setIsGenerating(true)

  try {
    const res = await fetch(`http://localhost:5678/webhook/generate-shorts?topic=${encodeURIComponent(prompt)}`)

    const data = await res.json()

    sessionStorage.setItem("videoPrompt", prompt)
    sessionStorage.setItem("videoUrl", data.videoUrl)

    router.push("/generate")
  } catch (error) {
    console.error("Video generation failed:", error)
    alert("Something went wrong. Please try again.")
  } finally {
    setIsGenerating(false)
  }
  }

  const handleGenerate = () => {
  if (!prompt.trim()) return

  const button = document.querySelector("[data-generate-button]") as HTMLElement
  if (button) {
    button.classList.add("animate-bang")
    createParticleBurst(button)
    setTimeout(() => {
      button.classList.remove("animate-bang")
    }, 600)
  }

  setIsGenerating(true)
  sessionStorage.setItem("videoPrompt", prompt)

  //  Call actual fetch + router push
  handleSubmit()
}


  // Add particle burst function
  const createParticleBurst = (element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    // Create multiple particles
    for (let i = 0; i < 12; i++) {
      const particle = document.createElement("div")
      particle.className =
        "fixed w-2 h-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full pointer-events-none z-50"
      particle.style.left = centerX + "px"
      particle.style.top = centerY + "px"

      const angle = (i / 12) * Math.PI * 2
      const distance = 100 + Math.random() * 50
      const duration = 800 + Math.random() * 400

      document.body.appendChild(particle)

      // Animate particle
      particle.animate(
        [
          {
            transform: "translate(-50%, -50%) scale(1)",
            opacity: 1,
          },
          {
            transform: `translate(${Math.cos(angle) * distance - 50}px, ${Math.sin(angle) * distance - 50}px) scale(0)`,
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

  const educationalPrompts = [
    "Create an engaging video explaining the basics of photosynthesis with clear visuals",
    "Make an impactful video about the water cycle showing evaporation, condensation, and precipitation",
    "Generate compelling content on the solar system with facts about each planet",
    "Create an educational video explaining fractions with visual examples and practice problems",
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-gray-50 via-purple-50/30 to-blue-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-900">
      {/* Background Effects */}
      <InteractiveGrid />
      <FloatingParticles />
      <CursorTrail />
      <CustomCursor />

      {/* Cyber grid overlay */}
      <div className="fixed inset-0 bg-cyber-grid opacity-20 dark:opacity-30 pointer-events-none" />

      {/* Neural network background */}
      <div className="fixed inset-0 bg-neural-network opacity-30 dark:opacity-50 pointer-events-none" />

      {/* Header */}
      <header className="relative z-20 border-b border-gray-200/50 dark:border-purple-500/20 bg-white/80 dark:bg-black/20 backdrop-blur-xl sticky top-0 animate-slide-in-left">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative p-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl animate-pulse-glow hover-lift">
                <Video className="w-6 h-6 text-white transition-transform group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-xl blur-lg opacity-50 -z-10" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white transition-all group-hover:scale-105">
                <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                  Gen-Clips
                </span>
              </h1>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-16 animate-fade-in-up">
            <div className="relative inline-block mb-6 animate-scale-in animate-delay-200">
              <Badge className="bg-purple-100 dark:bg-purple-500/20 border-purple-300 dark:border-purple-500/30 text-purple-800 dark:text-purple-300 backdrop-blur-sm hover-lift">
                <Sparkles className="w-4 h-4 mr-1 animate-pulse" />
                AI Video Generator
              </Badge>
            </div>

            <h2 className="text-5xl md:text-7xl font-bold mb-8 leading-tight animate-fade-in-up animate-delay-300">
              <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Transform
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">Ideas into</span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-cyan-500 bg-clip-text text-transparent">
                Impactful Videos
              </span>
            </h2>

            <p className="text-xl text-gray-700 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed animate-fade-in-up animate-delay-400">
              Create engaging video content instantly. Perfect for educators, creators, and professionals who want to
              turn concepts into compelling visual stories.
            </p>
          </div>

          {/* Input Card */}
          <div className="animate-fade-in-up animate-delay-500">
            <HolographicCard className="mb-12">
              <Card className="border-0 bg-white/90 dark:bg-gray-900/80 shadow-none backdrop-blur-sm hover-lift">
                <CardHeader className="pb-6">
                  <CardTitle className="text-2xl flex items-center gap-3 text-gray-900 dark:text-white">
                    <div className="p-2 bg-gradient-to-r from-purple-600 to-cyan-500 rounded-lg hover-lift">
                      <Play className="w-5 h-5 text-white" />
                    </div>
                    Create Your Video
                  </CardTitle>
                  <CardDescription className="text-lg text-gray-600 dark:text-gray-300">
                    Describe the topic you want to present. Include key points, target audience, and any specific
                    details you'd like covered.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    <label
                      htmlFor="prompt"
                      className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2"
                    >
                      <Layers className="w-4 h-4" />
                      Video Content & Description
                    </label>
                    <div className="relative">
                      <Textarea
                        id="prompt"
                        placeholder="Create an impactful video about renewable energy sources, covering key concepts with engaging visuals and clear explanations..."
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        className="min-h-[140px] text-lg resize-none border-2 border-purple-300 dark:border-purple-500/30 bg-white/80 dark:bg-gray-800/40 backdrop-blur-sm text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400 focus:border-purple-500 dark:focus:border-purple-400 focus:ring-2 focus:ring-purple-500/20 dark:focus:ring-purple-400/20 transition-all duration-300 hover-lift"
                      />
                      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-purple-500/5 to-cyan-500/5 dark:from-purple-500/10 dark:to-cyan-500/10 pointer-events-none opacity-0 transition-opacity duration-300 hover:opacity-100" />
                    </div>
                    <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="w-3 h-3" />
                        Be specific about content and structure
                      </span>
                      <span className={prompt.length > 400 ? "text-yellow-600 dark:text-yellow-400" : ""}>
                        {prompt.length}/500
                      </span>
                    </div>
                  </div>

                  <Button
                    data-generate-button
                    onClick={handleGenerate}
                    disabled={!prompt.trim() || isGenerating}
                    className="w-full h-16 text-lg bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-500 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-600 border-0 shadow-2xl shadow-purple-500/25 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-purple-500/40 disabled:opacity-50 disabled:cursor-not-allowed text-white hover-lift relative overflow-hidden"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        <span>Creating Video...</span>
                      </>
                    ) : (
                      <>
                        <span className="mr-3">Generate Video</span>
                        <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </HolographicCard>
          </div>

          {/* Example Prompts */}
          <div className="mb-16 animate-fade-in-up animate-delay-600">
            <h3 className="text-2xl font-semibold mb-8 text-center text-gray-900 dark:text-white">Popular Topics</h3>
            <div className="grid md:grid-cols-2 gap-6">
              {educationalPrompts.map((example, index) => (
                <div key={index} className={`animate-fade-in-up animate-delay-${(index + 1) * 100}`}>
                  <HolographicCard>
                    <Card
                      className="cursor-pointer transition-all duration-300 hover:scale-[1.02] border-purple-200 dark:border-purple-500/20 bg-white/90 dark:bg-gray-900/40 backdrop-blur-sm group hover-lift"
                      onClick={() => setPrompt(example)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-100 dark:bg-purple-500/20 rounded-lg group-hover:bg-purple-200 dark:group-hover:bg-purple-500/30 transition-all duration-300">
                            <Video className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                          </div>
                          <p className="text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300">
                            {example}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </HolographicCard>
                </div>
              ))}
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 animate-fade-in-up animate-delay-700">
            <HolographicCard>
              <Card className="text-center border-purple-200 dark:border-purple-500/20 bg-white/90 dark:bg-gray-900/40 backdrop-blur-sm h-full hover-lift">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float hover-lift">
                    <Presentation className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white text-xl">Smart Content</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    AI organizes your content into clear, structured slides with key points and visuals
                  </p>
                </CardContent>
              </Card>
            </HolographicCard>

            <HolographicCard>
              <Card className="text-center border-cyan-200 dark:border-cyan-500/20 bg-white/90 dark:bg-gray-900/40 backdrop-blur-sm h-full hover-lift">
                <CardContent className="p-8">
                  <div
                    className="w-16 h-16 bg-cyan-100 dark:bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float hover-lift"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <Users className="w-8 h-8 text-cyan-600 dark:text-cyan-400" />
                  </div>
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white text-xl">Audience Ready</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Content tailored for your specific audience, from elementary students to professionals
                  </p>
                </CardContent>
              </Card>
            </HolographicCard>

            <HolographicCard>
              <Card className="text-center border-blue-200 dark:border-blue-500/20 bg-white/90 dark:bg-gray-900/40 backdrop-blur-sm h-full hover-lift">
                <CardContent className="p-8">
                  <div
                    className="w-16 h-16 bg-blue-100 dark:bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-6 animate-float hover-lift"
                    style={{ animationDelay: "1s" }}
                  >
                    <BookOpen className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-3 text-gray-900 dark:text-white text-xl">Easy to Use</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    Simply describe your topic and get a complete slideshow ready for presentation
                  </p>
                </CardContent>
              </Card>
            </HolographicCard>
          </div>
        </div>
      </main>
    </div>
  )
}
