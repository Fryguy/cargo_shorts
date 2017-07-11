module CargoShorts::Launcher
  abstract class Base
    abstract def init
    abstract def start_browser(url)
    abstract def stop_browser
    abstract def start_display
    abstract def stop_display
  end
end
