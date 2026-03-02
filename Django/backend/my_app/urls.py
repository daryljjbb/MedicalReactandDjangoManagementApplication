# core/urls.py
from django.urls import path
from . import views

# core/urls.py
urlpatterns = [
    # This handles GET /api/patients/ (The list you see in your screenshot)
    path('patients/', views.PatientListCreateView.as_view()),


    # ✨ ADD THIS LINE: This handles GET /api/patients/1/ (The specific patient)
    path('patients/<int:pk>/', views.PatientDetailView.as_view()),
    path('medical-records/', views.MedicalRecordListCreateView.as_view()),
    path("medical-records/<int:pk>/", views.MedicalRecordDetailView.as_view()),
    path('doctors/', views.DoctorListCreateView.as_view()),
    path("doctors/<int:pk>/", views.DoctorDetailView.as_view()),
    path('login/', views.api_login, name='api_login'),
    path('logout/', views.api_logout, name='api_logout'),
    path('register/', views.api_register, name='api_register'),
    path('me/', views.me, name='me'),
]