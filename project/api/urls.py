from django.urls import path
from . import views

urlpatterns = [
    path('cities/', views.CityList.as_view(), name='city_list'),
    path('cities/<int:pk>/', views.CityDetail.as_view(), name='city_detail'),  
]