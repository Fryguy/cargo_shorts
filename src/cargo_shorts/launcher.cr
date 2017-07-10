module CargoShorts
  class Launcher
    getter url : String?
    getter? started

    @x_authority : String?
    @x_username : String?

    def self.instance
      @@instance ||= new
    end

    def initialize
      enable_display_control
      # TODO: Detect an already running application and set started = true
    end

    # Start the meeting with the specified URL or meeting_id/passcode Tuple
    def start(meeting_info : String | Tuple(String?, String?))
      raise "Cannot start if already started" if started?

      url = meeting_info.is_a?(String) ? validate_url(meeting_info) : build_url(meeting_info)

      start_display
      launch_in_chrome(url)

      @url = url
      @started = true
    end

    # Stop the current meeting
    def stop
      raise "Cannot stop if not already started" unless started?

      stop_chrome
      stop_display

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

    private def enable_display_control
      return if ENV["MANUAL_LAUNCH"]
      Process.new("XAUTHORITY=#{x_authority} DISPLAY=:0 xhost +localhost", shell: true).wait
    end

    private def launch_in_chrome(url)
      return if ENV["MANUAL_LAUNCH"]
      Process.new("su #{x_username} -c 'DISPLAY=:0 /opt/google/chrome/chrome #{url} --kiosk'", shell: true)
    end

    private def start_display
      return if ENV["MANUAL_LAUNCH"]
      Process.new("XAUTHORITY=#{x_authority} DISPLAY=:0 xset dpms force on", shell: true)
    end

    private def stop_chrome
      return if ENV["MANUAL_LAUNCH"]
      Process.new("killall", args: ["chrome"])
    end

    private def stop_display
      return if ENV["MANUAL_LAUNCH"]
      Process.new("XAUTHORITY=#{x_authority} DISPLAY=:0 xset dpms force off", shell: true)
    end

    private def x_authority
      return "" if ENV["MANUAL_LAUNCH"]
      @x_authority ||= `find /run/user/*/gdm/Xauthority`.chomp
    end

    private def x_username
      return "" if ENV["MANUAL_LAUNCH"]
      @x_username ||=
        `getent passwd #{x_authority.split("/")[3]}`.split(":").first
    end
  end
end
