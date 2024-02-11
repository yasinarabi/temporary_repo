from django.db import models
from django.contrib.auth.models import User
from mechanic.models import Workhouse


class Plate(models.Model):
    first_digits = models.IntegerField()
    second_digits = models.IntegerField()
    middle_char = models.CharField(max_length=4)
    serial_number = models.IntegerField()

    def __str__(self):
        return str(first_digits) + middle_char + str()


class Customer(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length=30)


class Vehicle(models.Model):
    plate = models.ForeignKey(Plate, null=True, on_delete=models.SET_NULL)
    cutomer = models.ForeignKey(Customer, on_delete=models.CASCADE)
    vehicle_kind = models.CharField(max_length=70)
    chassis_numver = models.CharField(max_length=120)
    engine_number = models.CharField(max_length=120)
    brand = models.CharField(max_length=50)
    vehicle_type = models.CharField(max_length=70)
    production_year = models.IntegerField()


class Appointment(models.Model):
    vehicle = models.ForeignKey(Vehicle, null=True, on_delete=models.SET_NULL)
    error_system = models.CharField(max_length=40)
    error_decription = models.TextField()
    workhouse = models.ForeignKey(Workhouse, null=True, on_delete=models.SET_NULL)


class Comment(models.Model):
    appointment = models.ForeignKey(Appointment, null=True, on_delete=models.SET_NULL)
    stars = models.IntegerField()
    description = models.TextField()
