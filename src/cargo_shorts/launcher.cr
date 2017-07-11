require "./launcher/*"

module CargoShorts::Launcher
  def self.instance
    @@instance ||= ENV["NO_LAUNCH"]? ? Launcher::Null.new : Launcher::Fedora.new
  end
end
