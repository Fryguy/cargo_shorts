require "./launcher"

module CargoShorts
  enum OrchestratorState
    New
    Starting
    WaitingForKioskStart
    KioskStarted
    WaitingForKioskStop
  end
end
