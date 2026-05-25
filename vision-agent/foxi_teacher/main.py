import logging

from vision_agents.core import AgentLauncher, Runner
from vision_agents.core.runner.http.options import ServeOptions

from foxi_teacher.agent import create_agent, join_call
from foxi_teacher.config import load_env, validate_env
from foxi_teacher.http_app import create_foxi_fastapi_app

logger = logging.getLogger(__name__)


def main() -> None:
    load_env()
    validate_env()

    launcher = AgentLauncher(create_agent=create_agent, join_call=join_call)
    fast_api = create_foxi_fastapi_app(launcher)
    Runner(launcher, serve_options=ServeOptions(fast_api=fast_api)).cli()


if __name__ == "__main__":
    main()
