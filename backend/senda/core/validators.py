from django.core.validators import RegexValidator

only_digits_validator = RegexValidator(
    regex="^\d+$", message="Solo se permiten dígitos."  # type: ignore
)
disallow_spaces_validator = RegexValidator(
    regex="^\S+$", message="No se permiten espacios."  # type: ignore
)
