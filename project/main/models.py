from django.db import models


class ImageModel(models.Model):
    img = models.ImageField()
    description = models.CharField(max_length=70)


class Province(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class City(models.Model):
    province = models.ForeignKey(Province, null=True, on_delete=models.SET_NULL)
    name = models.CharField(max_length=150)

    def __str__(self):
        return self.name
