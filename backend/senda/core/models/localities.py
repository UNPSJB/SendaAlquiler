from django.db import models

from extensions.db.models import TimeStampedModel
from senda.core.managers import LocalityModelManager


class StateChoices(models.TextChoices):
    """
    Enum-like class representing choices for states. Inherits from models.TextChoices.

    It provides a set of predefined choices for Argentine states, each choice being a tuple where the first value is the internal identifier and the second value is the human-readable name.
    """

    BUENOS_AIRES = "BUENOS_AIRES", "BUENOS_AIRES"
    CATAMARCA = "CATAMARCA", "CATAMARCA"
    CHACO = "CHACO", "CHACO"
    CHUBUT = "CHUBUT", "CHUBUT"
    CORDOBA = "CORDOBA", "CORDOBA"
    CORRIENTES = "CORRIENTES", "CORRIENTES"
    ENTRE_RIOS = "ENTRE_RIOS", "ENTRE_RIOS"
    FORMOSA = "FORMOSA", "FORMOSA"
    JUJUY = "JUJUY", "JUJUY"
    LA_PAMPA = "LA_PAMPA", "LA_PAMPA"
    LA_RIOJA = "LA_RIOJA", "LA_RIOJA"
    MENDOZA = "MENDOZA", "MENDOZA"
    MISIONES = "MISIONES", "MISIONES"
    NEUQUEN = "NEUQUEN", "NEUQUEN"
    RIO_NEGRO = "RIO_NEGRO", "RIO_NEGRO"
    SALTA = "SALTA", "SALTA"
    SAN_JUAN = "SAN_JUAN", "SAN_JUAN"
    SAN_LUIS = "SAN_LUIS", "SAN_LUIS"
    SANTA_CRUZ = "SANTA_CRUZ", "SANTA_CRUZ"
    SANTA_FE = "SANTA_FE", "SANTA_FE"
    SANTIAGO_DEL_ESTERO = "SANTIAGO_DEL_ESTERO", "SANTIAGO_DEL_ESTERO"
    TIERRA_DEL_FUEGO = "TIERRA_DEL_FUEGO", "TIERRA_DEL_FUEGO"
    TUCUMAN = "TUCUMAN", "TUCUMAN"


class LocalityModel(TimeStampedModel):
    """
    Represents a locality within a state, extending the TimeStampedModel to include timestamps for creation and modification.

    Attributes:
        name (models.CharField): The name of the locality.
        postal_code (models.CharField): The postal code of the locality.
        state (models.CharField): The state in which the locality is located. The choices for this field are defined by the StateChoices class.
        objects (LocalityModelManager): Custom manager for LocalityModel providing additional functionalities like creating and retrieving locality instances.

    Meta:
        Defines a unique constraint combining 'name', 'postal_code', and 'state' to ensure the uniqueness of a locality.

    Methods:
        __str__: Returns a string representation of the LocalityModel instance, which is the name of the locality.
    """

    name = models.CharField(max_length=255)
    postal_code = models.CharField(max_length=10)
    state = models.CharField(choices=StateChoices.choices, max_length=30)

    objects: LocalityModelManager = LocalityModelManager()  # pyright: ignore

    class Meta(TimeStampedModel.Meta):
        constraints = [
            models.UniqueConstraint(
                fields=["name", "postal_code", "state"], name="unique_locality"
            )
        ]

    def __str__(self) -> str:
        return self.name

    def has_some_client(self) -> bool:
        """
        Checks if the locality has at least one client associated with it.

        Returns:
            bool: True if the locality has at least one client, False otherwise.
        """
        return self.clients.exists()
