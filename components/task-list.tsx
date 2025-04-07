"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Play, Pause, RotateCcw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"

type Task = {
  id: number
  type: "anime" | "dsa"
  title: string
  duration: number // in minutes
  completed: boolean
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, type: "anime", title: "Watch Anime: Episode 1", duration: 20, completed: false },
    { id: 2, type: "dsa", title: "Solve DSA Question 1", duration: 30, completed: false },
    { id: 3, type: "anime", title: "Watch Anime: Episode 2", duration: 20, completed: false },
    { id: 4, type: "dsa", title: "Solve DSA Question 2", duration: 30, completed: false },
    { id: 5, type: "anime", title: "Watch Anime: Episode 3", duration: 20, completed: false },
    { id: 6, type: "dsa", title: "Solve DSA Question 3", duration: 30, completed: false },
  ])

  const [activeTaskId, setActiveTaskId] = useState<number | null>(null)
  const [timeRemaining, setTimeRemaining] = useState<number>(0)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null)

  const toggleTaskCompletion = (taskId: number) => {
    setTasks(tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)))
  }

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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Today's Tasks</CardTitle>
        <CardDescription>Your scheduled anime episodes and DSA questions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activeTaskId && (
            <div className="mb-6 space-y-2">
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
      </CardContent>
    </Card>
  )
}

