module CargoShorts
  class Launcher
    getter url : String?
    getter? started

    def self.instance
      @@instance ||= new
    end

    def initialize
      # TODO: Detect an already running application and set started = true
    end

    # Start the meeting with the specified URL or meeting_id/passcode Tuple
    def start(meeting_info : String | Tuple(String?, String?))
      raise "Cannot start if already started" if started?

      @url = meeting_info.is_a?(String) ? validate_url(meeting_info) : build_url(meeting_info)

      launch_in_chrome(@url.not_nil!)

      @started = true
    end

    # Stop the current meeting
    def stop
      raise "Cannot stop if not already started" unless started?

      stop_chrome

      @url = nil
      @started = false
    end

    private def build_url(meeting_info)
      meeting_id, passcode = meeting_info
      raise "Meeting ID cannot be blank" if meeting_id.nil? || meeting_id.empty?

      String.build do |url|
        url << "https://bluejeans.com/" << meeting_id
        url << "/" << passcode unless passcode.nil? || passcode.empty?
      end
    end

    private def validate_url(url)
      parsed = URI.parse(url)
      unless parsed.host.try &.ends_with?("bluejeans.com") &&
             parsed.path.try &.match(%r{\A/\w+(?:/[0-9]+)?\Z})
        raise "Invalid URL"
      end

      url
    end

    private def launch_in_chrome(url)
      Process.new("su #{user} -c 'DISPLAY=:0 /opt/google/chrome/chrome #{url} --kiosk'", shell: true)
    end

    private def stop_chrome
      Process.new("killall", args: ["chrome"])
    end

    private def user
      configuration["x_username"].as_s
    end

    private def configuration
      JSON.parse(File.read(File.expand_path("../../public/configuration.json", __DIR__)))
    end
  end
end
