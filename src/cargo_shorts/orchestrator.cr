require "./launcher"

module CargoShorts
  class Orchestrator
    getter url : String?
    getter? started

    private getter launcher

    def self.instance
      @@instance ||= new
    end

    def initialize
      @launcher = Launcher.instance
      @launcher.init

      # TODO: Detect an already running application and set started = true
    end

    # Start the meeting with the specified URL or meeting_id/passcode Tuple
    def start(meeting_info : String | Tuple(String?, String?))
      raise "Cannot start if already started" if started?

      url = meeting_info.is_a?(String) ? validate_url(meeting_info) : build_url(meeting_info)

      launcher.start_display
      launcher.start_browser(url)

      @url = url
      @started = true
    end

    # Stop the current meeting
    def stop
      raise "Cannot stop if not already started" unless started?

      launcher.stop_browser
      launcher.stop_display

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
  end
end
