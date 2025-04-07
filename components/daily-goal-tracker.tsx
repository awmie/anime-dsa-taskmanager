"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { PlusCircle, MinusCircle } from "lucide-react"

export function DailyGoalTracker() {
  const [animeGoal, setAnimeGoal] = useState(4)
  const [dsaGoal, setDsaGoal] = useState(4)
  const [isEditing, setIsEditing] = useState(false)

  // Mock data - in a real app, this would come from your state management or API
  const completedAnimeEpisodes = 2
  const completedDsaQuestions = 1

  const animeProgress = Math.min(100, Math.round((completedAnimeEpisodes / animeGoal) * 100))
  const dsaProgress = Math.min(100, Math.round((completedDsaQuestions / dsaGoal) * 100))
  const overallProgress = Math.min(
    100,
    Math.round(((completedAnimeEpisodes + completedDsaQuestions) / (animeGoal + dsaGoal)) * 100),
  )

  const handleIncrement = (type: "anime" | "dsa") => {
    if (type === "anime") {
      setAnimeGoal((prev) => prev + 1)
    } else {
      setDsaGoal((prev) => prev + 1)
    }
  }

  const handleDecrement = (type: "anime" | "dsa") => {
    if (type === "anime" && animeGoal > 1) {
      setAnimeGoal((prev) => prev - 1)
    } else if (type === "dsa" && dsaGoal > 1) {
      setDsaGoal((prev) => prev - 1)
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Daily Goals</CardTitle>
            <CardDescription>Track your daily anime and DSA goals</CardDescription>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(!isEditing)}>
            {isEditing ? "Save" : "Edit"}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-2" />
        </div>

        <div className="space-y-2">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Label htmlFor="anime-goal" className="flex-1">
                Anime Episodes
              </Label>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleDecrement("anime")}>
                <MinusCircle className="h-4 w-4" />
              </Button>
              <div className="w-12 text-center">{animeGoal}</div>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleIncrement("anime")}>
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Anime Episodes</span>
                <span className="text-sm text-muted-foreground">
                  {completedAnimeEpisodes}/{animeGoal}
                </span>
              </div>
              <Progress value={animeProgress} className="h-2" />
            </>
          )}
        </div>

        <div className="space-y-2">
          {isEditing ? (
            <div className="flex items-center space-x-2">
              <Label htmlFor="dsa-goal" className="flex-1">
                DSA Questions
              </Label>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleDecrement("dsa")}>
                <MinusCircle className="h-4 w-4" />
              </Button>
              <div className="w-12 text-center">{dsaGoal}</div>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleIncrement("dsa")}>
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">DSA Questions</span>
                <span className="text-sm text-muted-foreground">
                  {completedDsaQuestions}/{dsaGoal}
                </span>
              </div>
              <Progress value={dsaProgress} className="h-2" />
            </>
          )}
        </div>

        <div className="rounded-lg bg-muted p-3 text-center">
          <p className="text-sm font-medium">
            {completedAnimeEpisodes + completedDsaQuestions} of {animeGoal + dsaGoal} tasks completed today
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {Math.round(((animeGoal * 20 + dsaGoal * 30) / 60) * 10) / 10} hours planned
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

