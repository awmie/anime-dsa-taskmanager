"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export function TaskScheduler() {
  const { toast } = useToast()
  const [anime, setAnime] = useState("")
  const [startEpisode, setStartEpisode] = useState("1")
  const [endEpisode, setEndEpisode] = useState("3")
  const [dsaQuestions, setDsaQuestions] = useState("3")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const episodeCount = Number.parseInt(endEpisode) - Number.parseInt(startEpisode) + 1
    const dsaCount = Number.parseInt(dsaQuestions)

    // Calculate total time
    const animeTime = episodeCount * 20 // 20 minutes per episode
    const dsaTime = dsaCount * 30 // 30 minutes per DSA question
    const totalMinutes = animeTime + dsaTime

    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    toast({
      title: "Schedule Created",
      description: `Your schedule has been created with ${episodeCount} anime episodes and ${dsaCount} DSA questions. Total time: ${hours}h ${minutes}m.`,
    })
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>Create Your Schedule</CardTitle>
        <CardDescription>Plan your anime watching and DSA practice sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="anime">Anime Series</Label>
              <Input
                id="anime"
                placeholder="Enter anime name"
                value={anime}
                onChange={(e) => setAnime(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="dsa-questions">DSA Questions</Label>
              <Select value={dsaQuestions} onValueChange={setDsaQuestions}>
                <SelectTrigger id="dsa-questions">
                  <SelectValue placeholder="Select number of questions" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} question{num > 1 ? "s" : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="start-episode">Start Episode</Label>
              <Input
                id="start-episode"
                type="number"
                min="1"
                placeholder="1"
                value={startEpisode}
                onChange={(e) => setStartEpisode(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end-episode">End Episode</Label>
              <Input
                id="end-episode"
                type="number"
                min={Number.parseInt(startEpisode)}
                placeholder="3"
                value={endEpisode}
                onChange={(e) => setEndEpisode(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="flex justify-between items-center pt-2">
            <div className="text-sm text-muted-foreground">
              {(() => {
                try {
                  const episodeCount = Number.parseInt(endEpisode) - Number.parseInt(startEpisode) + 1
                  const dsaCount = Number.parseInt(dsaQuestions)

                  if (isNaN(episodeCount) || isNaN(dsaCount) || episodeCount < 0) {
                    return "Enter valid episode range and DSA questions"
                  }

                  const animeTime = episodeCount * 20 // 20 minutes per episode
                  const dsaTime = dsaCount * 30 // 30 minutes per DSA question
                  const totalMinutes = animeTime + dsaTime

                  const hours = Math.floor(totalMinutes / 60)
                  const minutes = totalMinutes % 60

                  return `Total time: ${hours}h ${minutes}m (${episodeCount} episodes, ${dsaCount} DSA questions)`
                } catch (e) {
                  return "Enter valid numbers"
                }
              })()}
            </div>
            <Button type="submit">Create Schedule</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

