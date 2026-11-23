/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import NotificationsModal from '../components/modals/NotificationsModal'

const NotificationContext = createContext({
  isOpen: false,
  openNotifications: () => {},
  closeNotifications: () => {},
  toggleNotifications: () => {}
})

export function NotificationProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)

  const openNotifications = () => setIsOpen(true)
  const closeNotifications = () => setIsOpen(false)
  const toggleNotifications = () => setIsOpen((prev) => !prev)

  return (
    <NotificationContext.Provider
      value={{
        isOpen,
        openNotifications,
        closeNotifications,
        toggleNotifications
      }}
    >
      {children}
      <NotificationsModal isOpen={isOpen} onClose={closeNotifications} />
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  return useContext(NotificationContext)
}
