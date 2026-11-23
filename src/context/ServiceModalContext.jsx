/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import ServiceDetailModal from '../components/modals/ServiceDetailModal'

const ServiceModalContext = createContext({
  isOpen: false,
  serviceKey: 'land',
  openServiceModal: (_key = 'land') => {},
  closeServiceModal: () => {},
})

export function ServiceModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  const [serviceKey, setServiceKey] = useState('land')

  const openServiceModal = (key = 'land') => {
    setServiceKey(key)
    setIsOpen(true)
  }

  const closeServiceModal = () => {
    setIsOpen(false)
  }

  return (
    <ServiceModalContext.Provider
      value={{
        isOpen,
        serviceKey,
        openServiceModal,
        closeServiceModal,
      }}
    >
      {children}
      <ServiceDetailModal
        isOpen={isOpen}
        serviceKey={serviceKey}
        onClose={closeServiceModal}
      />
    </ServiceModalContext.Provider>
  )
}

export function useServiceModal() {
  return useContext(ServiceModalContext)
}
