"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function ProgressTracker() {
  // Mock data - in a real app, this would come from your state management or API
  const totalAnimeEpisodes = 10
  const completedAnimeEpisodes = 4
  const totalDsaQuestions = 10
  const completedDsaQuestions = 3

  const animeProgress = Math.round((completedAnimeEpisodes / totalAnimeEpisodes) * 100)
  const dsaProgress = Math.round((completedDsaQuestions / totalDsaQuestions) * 100)
  const overallProgress = Math.round(
    ((completedAnimeEpisodes + completedDsaQuestions) / (totalAnimeEpisodes + totalDsaQuestions)) * 100,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>Progress Tracker</CardTitle>
        <CardDescription>Track your anime and DSA progress</CardDescription>
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
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Anime Episodes</span>
            <span className="text-sm text-muted-foreground">
              {completedAnimeEpisodes}/{totalAnimeEpisodes}
            </span>
          </div>
          <Progress value={animeProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completedAnimeEpisodes} episodes completed ({animeProgress}%)
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">DSA Questions</span>
            <span className="text-sm text-muted-foreground">
              {completedDsaQuestions}/{totalDsaQuestions}
            </span>
          </div>
          <Progress value={dsaProgress} className="h-2" />
          <p className="text-xs text-muted-foreground">
            {completedDsaQuestions} questions solved ({dsaProgress}%)
          </p>
        </div>

        <div className="pt-2 text-center text-sm">
          <p className="text-muted-foreground">Total time spent: 2h 40m</p>
        </div>
      </CardContent>
    </Card>
  )
}

