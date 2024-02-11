from rest_framework.generics import ListCreateAPIView, RetrieveUpdateDestroyAPIView
from main.models import City
from api.serializers import *


class CityList(ListCreateAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer


class CityDetail(RetrieveUpdateDestroyAPIView):
    queryset = City.objects.all()
    serializer_class = CitySerializer
