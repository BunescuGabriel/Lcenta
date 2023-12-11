
from django.urls import path
from about import views
from about.views import ConditiiCreate, DescriereCreate, ConditiiList, ConditiiView

urlpatterns = [
    path('termini', views.CreateTermini.as_view()),
    path('terminii', views.ViewTermini.as_view()),
    path('termini/<int:pk>', views.DeleteTermini.as_view()),


    path('conditii', ConditiiCreate.as_view()),
    path('conditi/', ConditiiView.as_view()),
    path('conditi/<int:pk>', views.DeleteConditii.as_view()),
    path('conditii/<int:condition_id>', ConditiiList.as_view()),


    path('descriere', DescriereCreate.as_view()),
    path('descriere/<int:pk>', views.DeleteDescriere.as_view()),


    path('date-contact', views.CreateDateContact.as_view()),

]