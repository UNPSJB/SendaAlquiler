from django.db import models

class ProductModel(models.Model):
    title = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.title