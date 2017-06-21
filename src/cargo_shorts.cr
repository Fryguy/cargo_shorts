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

    launcher.start(meeting_id, passcode)

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

Kemal.run
