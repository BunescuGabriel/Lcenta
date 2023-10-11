from django.urls import path
from produs import views
from produs.views import UpdateServicii, DeleteProdus, UpdatePartialProdus

urlpatterns = [
    path('banners', views.CreateBanner.as_view()),
    path('banners/<int:pk>', views.DeleteBanner.as_view()),

    path('servicii', views.CreateServicii.as_view()),
    path('d_servicii/<int:pk>', views.DeleteServicii.as_view()),
    path('servicii/<int:pk>', UpdateServicii.as_view()),

    path('car', views.CreateProdus.as_view()),
    path('d_car/<int:pk>', DeleteProdus.as_view()),
    path('car/<int:pk>', UpdatePartialProdus.as_view()),

]