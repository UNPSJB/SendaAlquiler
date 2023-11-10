from decouple import config  # type: ignore

if config("ENVIROMENT") == "staging":
    from .staging import Staging  # type: ignore
elif config("ENVIROMENT") == "preview":
    from .preview import Preview  # type: ignore
elif config("ENVIROMENT") == "production":
    from .production import Production  # type: ignore
else:
    from .development import Development  # type: ignore
