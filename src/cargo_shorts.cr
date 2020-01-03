require "./cargo_shorts/*"
require "kemal"

def to(path, params = nil)
  query = HTTP::Params.encode(params) if params
  path += "?#{query}" if query && !query.empty?
  path
end

def orchestrator
  CargoShorts::Orchestrator.instance
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

    orchestrator.start(meeting_info)

    env.redirect to("/")
  rescue err
    env.redirect to("/", {"error" => err.message.to_s})
  end
end

get "/stop_meeting" do |env|
  begin
    orchestrator.stop

    env.redirect to("/")
  rescue err
    env.redirect to("/", {"error" => err.message.to_s})
  end
end

Kemal.run
