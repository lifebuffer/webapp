import { useStore } from "@tanstack/react-store"
import * as React from "react"
import { Calendar } from "~/components/ui/calendar"
import {
  SidebarGroup,
  SidebarGroupContent,
} from "~/components/ui/sidebar"
import { userStore, userActions } from "~/stores/userStore"

export function DatePicker() {
  const state = useStore(userStore)
  const { selectedDate } = state

  // Convert selectedDate string to Date object for the calendar
  const selectedDateObj = React.useMemo(() => {
    const [year, month, day] = selectedDate.split('-').map(Number)
    return new Date(year, month - 1, day)
  }, [selectedDate])

  const handleSelect = (date: Date | undefined) => {
    if (date) {
      // Format date as YYYY-MM-DD
      const year = date.getFullYear()
      const month = String(date.getMonth() + 1).padStart(2, '0')
      const day = String(date.getDate()).padStart(2, '0')
      const dateString = `${year}-${month}-${day}`
      
      // Fetch data for the selected date
      userActions.fetchDayData(dateString)
    }
  }

  return (
    <SidebarGroup className="px-0">
      <SidebarGroupContent>
        <Calendar
          mode="single"
          selected={selectedDateObj}
          onSelect={handleSelect}
          className="[&_[role=gridcell].bg-accent]:bg-sidebar-primary [&_[role=gridcell].bg-accent]:text-sidebar-primary-foreground [&_[role=gridcell]]:w-[33px]"
        />
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
