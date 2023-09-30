from django.db import models


class StateChoices(models.TextChoices):
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


class LocalityModelManager(models.Manager):
    def get_or_create_locality(self, name: str, postal_code: int, state: StateChoices):
        locality, created = self.get_or_create(
            name=name, postal_code=postal_code, state=state
        )
        return locality


class LocalityModel(models.Model):
    name = models.CharField(max_length=255)
    postal_code = models.IntegerField()
    state = models.CharField(choices=StateChoices.choices, max_length=30)

    objects = LocalityModelManager()

    def __str__(self) -> str:
        return self.name
