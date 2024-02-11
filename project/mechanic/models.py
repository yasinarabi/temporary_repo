from django.db import models
from django.contrib.auth.models import User
from main.models import ImageModel, City


class ServiceType(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Mechanic(models.Model):
    user = models.ForeignKey(User, null=True, on_delete=models.SET_NULL)
    phone_number = models.CharField(max_length=30)


class WorkTime(models.Model):
    saturday_start = models.TimeField(null=True, blank=True)
    saturday_end = models.TimeField(null=True, blank=True)
    sunday_start = models.TimeField(null=True, blank=True)
    sunday_end = models.TimeField(null=True, blank=True)
    monday_start = models.TimeField(null=True, blank=True)
    monday_end = models.TimeField(null=True, blank=True)
    tuesday_start = models.TimeField(null=True, blank=True)
    tuesday_end = models.TimeField(null=True, blank=True)
    wednesday_start = models.TimeField(null=True, blank=True)
    wednesday_end = models.TimeField(null=True, blank=True)
    thursday_start = models.TimeField(null=True, blank=True)
    thursday_end = models.TimeField(null=True, blank=True)
    friday_start = models.TimeField(null=True, blank=True)
    friday_end = models.TimeField(null=True, blank=True)
    is_open_in_holidays = models.BooleanField()


class Workhouse(models.Model):
    name = models.CharField(max_length=150)
    slug = models.CharField(max_length=50)
    city = models.ForeignKey(City, null=True, on_delete=models.SET_NULL)
    address = models.CharField(max_length=250)
    description = models.TextField()
    images = models.ManyToManyField(ImageModel)
    service_types = models.ManyToManyField(ServiceType)
    appointment_price = models.IntegerField()
    emerency_appointment_price = models.IntegerField()
    appointment_time = models.IntegerField() # In minutes
    work_time = models.ForeignKey(WorkTime, null=True, on_delete=models.SET_NULL)

    def __str__(self):
        return self.name
