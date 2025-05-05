// src/utils/TimeManager.ts
import { create } from 'zustand';

export interface TimeState {
  currentTime: Date;
  timeScale: number;
  isPaused: boolean;
  
  // Actions
  setTimeScale: (scale: number) => void;
  togglePause: () => void;
  setSpecificDate: (date: Date) => void;
  resetToCurrentTime: () => void;
  tick: () => void;
}

export const useTimeStore = create<TimeState>((set) => ({
  currentTime: new Date(),
  timeScale: 1, // 1 = real time, 60 = 1 minute per second, etc.
  isPaused: false,
  
  setTimeScale: (scale) => set({ timeScale: scale }),
  
  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),
  
  setSpecificDate: (date) => set({ currentTime: new Date(date) }),
  
  resetToCurrentTime: () => set({ currentTime: new Date() }),
  
  // This will be called in an animation loop to update the time
  tick: () => set((state) => {
    if (state.isPaused) return state;
    
    const newTime = new Date(state.currentTime);
    // Add milliseconds based on timeScale (16ms is approx. time between frames at 60fps)
    newTime.setMilliseconds(newTime.getMilliseconds() + (16 * state.timeScale));
    
    return { currentTime: newTime };
  }),
}));

// Helper function to format date and time
export const formatDateTime = (date: Date): string => {
  return date.toLocaleString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
};
