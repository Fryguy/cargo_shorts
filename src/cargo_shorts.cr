require "./cargo_shorts/*"
require "kemal"

def to_url_with_params(to path, params)
  query = params.map { |k, v| "#{k}=#{v}" }.join("&")
  path += "?#{query}" unless query.empty?
  path
end

def launcher
  CargoShorts::Launcher.instance
end

get "/" do |env|
  error = env.params.query["error"]?
  render "src/views/index.ecr"
end

get "/start_meeting" do |env|
  begin
    meeting_id = env.params.query["meeting_id"]?
    passcode = env.params.query["passcode"]?
    url = env.params.query["url"]?

    meeting_info =
      if url.nil? || url.empty?
        {meeting_id, passcode}
      else
        url
      end

    launcher.start(meeting_info)

    env.redirect "/"
  rescue err
    env.redirect to_url_with_params("/", {"error" => err.message})
  end
end

get "/stop_meeting" do |env|
  begin
    launcher.stop

    env.redirect "/"
  rescue err
    env.redirect to_url_with_params("/", {"error" => err.message})
  end
end

ws "/ws" do |socket|
  socket.send({action: "leave_meeting"}.to_json)
end

Kemal.run
