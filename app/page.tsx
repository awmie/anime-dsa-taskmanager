"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, RotateCcw, Save, History, ArrowLeft } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Types
type Task = {
  id: number
  type: "anime" | "dsa"
  title: string
  duration: number // in minutes
  completed: boolean
}

type SavePoint = {
  id: string
  date: Date
  tasks: Task[]
  animeGoal: number
  dsaGoal: number
  name: string
}

export default function Home() {
  const { toast } = useToast()

  // Form state
  const [anime, setAnime] = useState("")
  const [startEpisode, setStartEpisode] = useState("1")
  const [endEpisode, setEndEpisode] = useState("3")
  const [dsaQuestions, setDsaQuestions] = useState("3")

  // Tasks state
  const [tasks, setTasks] = useState<Task[]>([])

  // Timer state
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  // Goals state
  const [animeGoal, setAnimeGoal] = useState(4)
  const [dsaGoal, setDsaGoal] = useState(4)

  // Save points state
  const [savePoints, setSavePoints] = useState<SavePoint[]>([])
  const [viewingSavePoints, setViewingSavePoints] = useState(false)
  const [savePointName, setSavePointName] = useState("")

  // Load data from localStorage on initial render
  useEffect(() => {
    const savedTasks = localStorage.getItem("tasks")
    const savedGoals = localStorage.getItem("goals")
    const savedPoints = localStorage.getItem("savePoints")

    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }

    if (savedGoals) {
      const goals = JSON.parse(savedGoals)
      setAnimeGoal(goals.anime)
      setDsaGoal(goals.dsa)
    }

    if (savedPoints) {
      setSavePoints(JSON.parse(savedPoints))
    }
  }, [])

  // Save data to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  useEffect(() => {
    localStorage.setItem("goals", JSON.stringify({ anime: animeGoal, dsa: dsaGoal }))
  }, [animeGoal, dsaGoal])

  useEffect(() => {
    localStorage.setItem("savePoints", JSON.stringify(savePoints))
  }, [savePoints])

  // Create schedule
  const createSchedule = () => {
    const newTasks: Task[] = []
    const episodeCount = Number.parseInt(endEpisode) - Number.parseInt(startEpisode) + 1

    // Set DSA questions to match episode count (1:1 ratio)
    const dsaCount = episodeCount
    setDsaQuestions(episodeCount.toString())

    // Create alternating tasks: episode -> DSA -> episode -> DSA
    for (let i = 0; i < episodeCount; i++) {
      // Add anime episode
      newTasks.push({
        id: newTasks.length + 1,
        type: "anime",
        title: `Watch ${anime}: Episode ${Number.parseInt(startEpisode) + i}`,
        duration: 20,
        completed: false,
      })

      // Add DSA question immediately after each episode
      newTasks.push({
        id: newTasks.length + 1,
        type: "dsa",
        title: `Solve DSA Question ${i + 1}`,
        duration: 30,
        completed: false,
      })
    }

    setTasks(newTasks)

    // Calculate total time
    const animeTime = episodeCount * 20
    const dsaTime = dsaCount * 30
    const totalMinutes = animeTime + dsaTime
    const hours = Math.floor(totalMinutes / 60)
    const minutes = totalMinutes % 60

    toast({
      title: "Schedule Created",
      description: `Created with ${episodeCount} anime episodes and ${episodeCount} DSA questions (one after each episode). Total time: ${hours}h ${minutes}m.`,
    })
  }

  // Task functions
  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

  // Timer functions
  const startTimer = (taskId: number) => {
    // Clear any existing timer
    if (intervalId) {
      clearInterval(intervalId)
    }

    const task = tasks.find((t) => t.id === taskId)
    if (!task) return

    setActiveTaskId(taskId)
    setTimeRemaining(task.duration * 60) // Convert minutes to seconds
    setIsTimerRunning(true)

    const id = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(id)
          setIsTimerRunning(false)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    setIntervalId(id)
  }

  const pauseTimer = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }
    setIsTimerRunning(false)
  }

  const resetTimer = () => {
    if (intervalId) {
      clearInterval(intervalId)
      setIntervalId(null)
    }

    const task = tasks.find((t) => t.id === activeTaskId)
    if (task) {
      setTimeRemaining(task.duration * 60)
    }

    setIsTimerRunning(false)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const getProgressPercentage = () => {
    const task = tasks.find((t) => t.id === activeTaskId)
    if (!task) return 0

    const totalSeconds = task.duration * 60
    const elapsedSeconds = totalSeconds - timeRemaining
    return Math.round((elapsedSeconds / totalSeconds) * 100)
  }

  // Progress calculations
  const completedAnimeEpisodes = tasks.filter((t) => t.type === "anime" && t.completed).length
  const totalAnimeEpisodes = tasks.filter((t) => t.type === "anime").length
  const completedDsaQuestions = tasks.filter((t) => t.type === "dsa" && t.completed).length
  const totalDsaQuestions = tasks.filter((t) => t.type === "dsa").length

  const animeProgress = totalAnimeEpisodes > 0 ? Math.round((completedAnimeEpisodes / totalAnimeEpisodes) * 100) : 0
  const dsaProgress = totalDsaQuestions > 0 ? Math.round((completedDsaQuestions / totalDsaQuestions) * 100) : 0
  const overallProgress =
    tasks.length > 0 ? Math.round((tasks.filter((t) => t.completed).length / tasks.length) * 100) : 0

  // Add a function to check if a task pair (episode + DSA) is completed
  const isPairCompleted = (episodeIndex: number) => {
    const episodeId = episodeIndex * 2 + 1 // 1-based index for episodes (odd numbers)
    const dsaId = episodeId + 1 // DSA questions follow episodes (even numbers)

    const episodeTask = tasks.find((t) => t.id === episodeId)
    const dsaTask = tasks.find((t) => t.id === dsaId)

    return episodeTask?.completed && dsaTask?.completed
  }

  // Calculate how many complete pairs we have
  const completedPairs =
    Math.floor(tasks.length / 2) > 0
      ? Array.from({ length: Math.floor(tasks.length / 2) }, (_, i) => isPairCompleted(i)).filter(Boolean).length
      : 0

  // Save point functions
  const createSavePoint = () => {
    if (!savePointName.trim()) {
      toast({
        title: "Error",
        description: "Please enter a name for your save point",
        variant: "destructive",
      })
      return
    }

    const newSavePoint: SavePoint = {
      id: Date.now().toString(),
      date: new Date(),
      tasks: [...tasks],
      animeGoal,
      dsaGoal,
      name: savePointName,
    }

    setSavePoints([...savePoints, newSavePoint])
    setSavePointName("")

    toast({
      title: "Save Point Created",
      description: `"${savePointName}" has been saved successfully.`,
    })
  }

  const loadSavePoint = (savePoint: SavePoint) => {
    setTasks(savePoint.tasks)
    setAnimeGoal(savePoint.animeGoal)
    setDsaGoal(savePoint.dsaGoal)
    setViewingSavePoints(false)

    toast({
      title: "Save Point Loaded",
      description: `"${savePoint.name}" has been loaded successfully.`,
    })
  }

  const deleteSavePoint = (id: string) => {
    setSavePoints(savePoints.filter((sp) => sp.id !== id))

    toast({
      title: "Save Point Deleted",
      description: "Save point has been deleted.",
    })
  }

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">AnimeCode Dashboard</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setViewingSavePoints(!viewingSavePoints)}>
              {viewingSavePoints ? <ArrowLeft className="mr-1 h-4 w-4" /> : <History className="mr-1 h-4 w-4" />}
              {viewingSavePoints ? "Back" : "History"}
            </Button>
          </div>
        </div>
      </header>

      {viewingSavePoints ? (
        <Card>
          <CardHeader>
            <CardTitle>Save Points</CardTitle>
          </CardHeader>
          <CardContent>
            {savePoints.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">
                No save points yet. Create one to save your progress.
              </p>
            ) : (
              <div className="space-y-4">
                {savePoints.map((savePoint) => (
                  <div key={savePoint.id} className="flex items-center justify-between border p-3 rounded-md">
                    <div>
                      <h3 className="font-medium">{savePoint.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {new Date(savePoint.date).toLocaleString()} •{savePoint.tasks.filter((t) => t.completed).length}
                        /{savePoint.tasks.length} tasks completed
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => loadSavePoint(savePoint)}>
                        Load
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteSavePoint(savePoint.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Tabs defaultValue="tasks">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
          </TabsList>

          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle>Create Your Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="anime">Anime Series</Label>
                      <Input
                        id="anime"
                        placeholder="Enter anime name"
                        value={anime}
                        onChange={(e) => setAnime(e.target.value)}
                      />
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
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dsa-info">DSA Questions</Label>
                      <div
                        id="dsa-info"
                        className="text-sm text-muted-foreground border rounded-md p-2 h-10 flex items-center"
                      >
                        One DSA question after each episode
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2">
                    <div className="text-sm text-muted-foreground">
                      {(() => {
                        try {
                          const episodeCount = Number.parseInt(endEpisode) - Number.parseInt(startEpisode) + 1

                          if (isNaN(episodeCount) || episodeCount < 0) {
                            return "Enter valid episode range"
                          }

                          const animeTime = episodeCount * 20 // 20 minutes per episode
                          const dsaTime = episodeCount * 30 // 30 minutes per DSA question
                          const totalMinutes = animeTime + dsaTime

                          const hours = Math.floor(totalMinutes / 60)
                          const minutes = totalMinutes % 60

                          return `Total time: ${hours}h ${minutes}m (${episodeCount} episodes, ${episodeCount} DSA questions)`
                        } catch (e) {
                          return "Enter valid numbers"
                        }
                      })()}
                    </div>
                    <Button onClick={createSchedule}>Create Schedule</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Tasks</CardTitle>
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Save point name"
                      value={savePointName}
                      onChange={(e) => setSavePointName(e.target.value)}
                      className="w-48"
                    />
                    <Button variant="outline" size="sm" onClick={createSavePoint} disabled={!savePointName.trim()}>
                      <Save className="mr-1 h-4 w-4" />
                      Save
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {tasks.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No tasks yet. Create a schedule to get started.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {activeTaskId && (
                      <div className="mb-6 space-y-2 p-4 border rounded-md">
                        <div className="flex items-center justify-between">
                          <h3 className="font-medium">{tasks.find((t) => t.id === activeTaskId)?.title}</h3>
                          <div className="text-lg font-mono">{formatTime(timeRemaining)}</div>
                        </div>
                        <Progress value={getProgressPercentage()} className="h-2" />
                        <div className="flex justify-center space-x-2 pt-2">
                          {isTimerRunning ? (
                            <Button size="sm" variant="outline" onClick={pauseTimer}>
                              <Pause className="mr-1 h-4 w-4" /> Pause
                            </Button>
                          ) : (
                            <Button size="sm" variant="outline" onClick={() => startTimer(activeTaskId)}>
                              <Play className="mr-1 h-4 w-4" /> Resume
                            </Button>
                          )}
                          <Button size="sm" variant="outline" onClick={resetTimer}>
                            <RotateCcw className="mr-1 h-4 w-4" /> Reset
                          </Button>
                        </div>
                      </div>
                    )}

                    <div className="divide-y">
                      {tasks.map((task) => (
                        <div key={task.id} className="flex items-center py-3">
                          <Checkbox
                            id={`task-${task.id}`}
                            checked={task.completed}
                            onCheckedChange={() => toggleTaskCompletion(task.id)}
                            className="mr-2"
                          />
                          <div className="flex-1 ml-2">
                            <label
                              htmlFor={`task-${task.id}`}
                              className={`font-medium ${task.completed ? "line-through text-muted-foreground" : ""}`}
                            >
                              {task.title}
                            </label>
                            <div className="flex items-center mt-1">
                              <Badge variant={task.type === "anime" ? "secondary" : "outline"} className="mr-2">
                                {task.type === "anime" ? "Anime" : "DSA"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{task.duration} min</span>
                            </div>
                          </div>
                          {!task.completed && activeTaskId !== task.id && (
                            <Button size="sm" variant="ghost" onClick={() => startTimer(task.id)} className="ml-auto">
                              <Play className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="progress">
            <Card>
              <CardHeader>
                <CardTitle>Progress Tracker</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-muted-foreground">{overallProgress}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Completed Pairs (Episode + DSA)</span>
                    <span className="text-sm text-muted-foreground">
                      {completedPairs}/{Math.floor(tasks.length / 2)}
                    </span>
                  </div>
                  <Progress
                    value={Math.floor(tasks.length / 2) > 0 ? (completedPairs / Math.floor(tasks.length / 2)) * 100 : 0}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">{completedPairs} complete episode-DSA pairs</p>
                </div>

                <div className="rounded-lg bg-muted p-4 text-center">
                  <p className="text-sm font-medium">
                    Daily Goals: {completedAnimeEpisodes + completedDsaQuestions} of {animeGoal + dsaGoal} tasks
                    completed
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(((animeGoal * 20 + dsaGoal * 30) / 60) * 10) / 10} hours planned
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}

