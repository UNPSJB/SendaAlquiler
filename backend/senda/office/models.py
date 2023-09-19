from django.db import models
    
class locality(models.Model):
    nombre= models.CharField(max_length=30)

   
class OfficeModel(models.Model):
    id = models.IntegerField()
    name = models.CharField(max_length=255)
    street = models.CharField(max_length=20)
    house_number = models.CharField(max_length=10)
    locality = models.ForeignKey(locality, on_delete=models.CASCADE)
    note = models.CharField(max_length=255)

    def __str__(self) -> str:
        return self.name