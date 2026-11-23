/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react'
import PrivacyPolicyModal from '../components/modals/PrivacyPolicyModal'
import TermsAndConditionsModal from '../components/modals/TermsAndConditionsModal'
import HelpCenterModal from '../components/modals/HelpCenterModal'
import ContactUsModal from '../components/modals/ContactUsModal'

const LegalModalContext = createContext({
  activeModal: null,
  openLegalModal: (_modalType = 'privacy') => {},
  closeLegalModal: () => {},
})

export function LegalModalProvider({ children }) {
  const [activeModal, setActiveModal] = useState(null) // 'privacy' | 'terms' | 'help' | 'contact' | null

  const openLegalModal = (modalType = 'privacy') => {
    setActiveModal(modalType)
  }

  const closeLegalModal = () => {
    setActiveModal(null)
  }

  return (
    <LegalModalContext.Provider
      value={{
        activeModal,
        openLegalModal,
        closeLegalModal,
      }}
    >
      {children}
      <PrivacyPolicyModal
        isOpen={activeModal === 'privacy'}
        onClose={closeLegalModal}
      />
      <TermsAndConditionsModal
        isOpen={activeModal === 'terms'}
        onClose={closeLegalModal}
      />
      <HelpCenterModal
        isOpen={activeModal === 'help'}
        onClose={closeLegalModal}
      />
      <ContactUsModal
        isOpen={activeModal === 'contact'}
        onClose={closeLegalModal}
      />
    </LegalModalContext.Provider>
  )
}

export function useLegalModal() {
  return useContext(LegalModalContext)
}
