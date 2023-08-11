from decouple import config

if config("ENVIROMENT") == "staging":
    from .staging import Staging  # noqa
elif config("ENVIROMENT") == "preview":
    from .preview import Preview  # noqa
elif config("ENVIROMENT") == "production":
    from .production import Production  # noqa
else:
    from .development import Development  # noqa
