module CargoShorts::Launcher
  class Fedora < Base
    @x_authority : String?
    @x_username : String?

    def init
      Process.new("XAUTHORITY=#{x_authority} DISPLAY=:0 xhost +localhost", shell: true).wait
    end

    def start_browser(url)
      Process.new("su #{x_username} -c 'DISPLAY=:0 /opt/google/chrome/chrome #{url} --kiosk'", shell: true)
    end

    def stop_browser
      Process.new("killall", args: ["chrome"])
    end

    def start_display
      Process.new("XAUTHORITY=#{x_authority} DISPLAY=:0 xset dpms force on", shell: true)
    end

    def stop_display
      Process.new("XAUTHORITY=#{x_authority} DISPLAY=:0 xset dpms force off", shell: true)
    end

    private def x_authority
      @x_authority ||= `find /run/user/*/gdm/Xauthority`.chomp
    end

    private def x_username
      @x_username ||= `getent passwd #{x_authority.split("/")[3]}`.split(":").first
    end
  end
end
