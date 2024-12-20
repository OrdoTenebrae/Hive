"use client"

import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Wand2, Sparkles, Brain, X } from "lucide-react"
import { useState, useRef, KeyboardEvent, useCallback } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { toast } from "react-hot-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"

import debounce from "lodash/debounce"

// Common project types for suggestions
const commonProjectTypes = [
  "Web Development", "Mobile App", "Design", "Marketing",
  "Research", "Data Analysis", "Content Creation", "E-commerce"
]

export default function NewProjectPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [suggestion, setSuggestion] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const descriptionRef = useRef<HTMLTextAreaElement>(null)

  const debouncedSuggestion = useCallback(
    debounce(async (input: string) => {
      if (input.length < 3) {
        setSuggestion("")
        return
      }

      try {
        const response = await fetch('/api/ai/suggestions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input })
        })
        
        const data = await response.json()
        console.log("Received suggestion:", data) // Debug log
        
        if (data.suggestion && typeof data.suggestion === 'string' && 
            data.suggestion.toLowerCase().startsWith(input.toLowerCase())) {
          setSuggestion(data.suggestion)
        } else {
          setSuggestion("")
        }
      } catch (error) {
        console.error("Failed to generate suggestion:", error)
        setSuggestion("")
      }
    }, 500),
    []
  )

  // Update the generateSuggestion function
  async function generateSuggestion(input: string) {
    debouncedSuggestion(input)
  }

  // Handle tab key for accepting suggestion
  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab' && suggestion) {
      e.preventDefault()
      setDescription(suggestion)
      setSuggestion("")
    }
  }

  // Handle tag creation
  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault()
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()])
      }
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove))
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: projectName,
          description: description,
          tags: tags
        }),
      })

      if (!response.ok) throw new Error("Failed to create project")
      
      toast.success("Project created successfully")
      router.push("/projects")
      router.refresh()
    } catch (error) {
      toast.error("Failed to create project")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="h-full flex flex-col">
      <div className="border-b px-8 py-6">
        <div className="flex items-center gap-6 max-w-2xl mx-auto w-full">
          <Link href="/projects">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Create Project</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Add a new project to collaborate with your team
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="px-8 py-6 max-w-2xl mx-auto w-full">
          <Card>
            <form onSubmit={onSubmit} className="p-6 space-y-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Project Name
                </label>
                <Input
                  id="name"
                  value={projectName}
                  onChange={(e) => {
                    setProjectName(e.target.value)
                    generateSuggestion(e.target.value)
                  }}
                  required
                  placeholder="Enter project name"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Project Types
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="px-2 py-1">
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <Input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleTagKeyDown}
                  placeholder="Type and press Enter to add tags"
                  className="max-w-lg"
                />
                <div className="flex flex-wrap gap-2 mt-2">
                  {commonProjectTypes
                    .filter(type => !tags.includes(type))
                    .map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setTags([...tags, type])}
                        className="text-xs text-muted-foreground hover:text-foreground"
                      >
                        +{type}
                      </button>
                    ))}
                </div>
              </div>

              <div className="space-y-2 relative">
                <label htmlFor="description" className="text-sm font-medium">
                  Description
                </label>
                <div className="relative rounded-md shadow-sm">
                  <Textarea
                    ref={descriptionRef}
                    value={description}
                    onChange={(e) => {
                      setDescription(e.target.value)
                      generateSuggestion(e.target.value)
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Describe your project"
                    className="min-h-[120px] resize-none text-base leading-relaxed p-3 font-normal transition-all duration-200 focus:ring-1 focus:ring-primary/20"
                  />
                  {suggestion && (
                    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-md">
                      <div className="p-3 text-base leading-relaxed font-normal">
                        <span className="opacity-0">{description}</span>
                        <span className="text-primary/30 bg-gradient-to-r from-primary/20 to-primary/10 bg-clip-text">
                          {suggestion.slice(description.length)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <kbd className="px-2 py-0.5 bg-muted rounded-md text-muted-foreground">Tab</kbd>
                  <span>to accept suggestion</span>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Creating..." : "Create Project"}
                </Button>
                <Link href="/projects">
                  <Button variant="ghost">Cancel</Button>
                </Link>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  )
}
