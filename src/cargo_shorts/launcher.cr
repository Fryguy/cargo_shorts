module CargoShorts
  class Launcher
    getter meeting_id : String | Nil
    getter passcode : String | Nil
    getter? started

    def self.instance
      @@instance ||= new
    end

    def initialize
      # TODO: Detect an already running application and set started = true
    end

    def bluejeans_url
      url = "https://bluejeans.com/#{meeting_id}"
      url = "#{url}/#{passcode}" unless passcode.to_s.empty?
      url
    end

    def start(meeting_id, passcode)
      raise "cannot start if already started" if started?
      raise "meeting_id cannot be blank" if meeting_id.nil? || meeting_id.empty?
      @meeting_id = meeting_id
      @passcode = passcode

      launch_in_chrome

      @started = true
    end

    def stop
      raise "cannot stop if not already started" unless started?

      stop_chrome

      @meeting_id = nil
      @passcode = nil
      @started = false
    end

    private def launch_in_chrome
      Process.new("/opt/google/chrome/chrome", args: [bluejeans_url, "--kiosk"], env: {"DISPLAY" => "0"})
    end

    private def stop_chrome
      Process.new("killall", args: ["chrome"])
    end
  end
end
