from django.urls import path
from users import views

urlpatterns = [
    path('', views.UserList.as_view()),
    path('<int:pk>', views.UserDetaliedView.as_view()),
    path('address', views.AddressList.as_view()),
    path('users-profile', views.ProfilesList.as_view()),

]