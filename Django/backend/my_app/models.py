from django.db import models
from django.utils import timezone
from django.contrib.auth.models import User
from django.conf import settings


# Create your models here.
# ------------------------------------------------------------
# Patient Model - stores basic patient information
# ------------------------------------------------------------
class Patient(models.Model):
    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE)

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    date_of_birth = models.DateField()
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    date_registered = models.DateTimeField(default=timezone.now)
    blood_type = models.CharField(max_length=3, choices=[
        ('A+', 'A+'), ('A-', 'A-'), ('B+', 'B+'), ('B-', 'B-'),
        ('AB+', 'AB+'), ('AB-', 'AB-'), ('O+', 'O+'), ('O-', 'O-')
    ])


    def __str__(self):
        return f"{self.first_name} {self.last_name}"
    

# ------------------------------------------------------------
# Medical Record - stores health details for each patient
# ------------------------------------------------------------
class MedicalRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)


    patient = models.ForeignKey(Patient, on_delete=models.CASCADE, related_name="medical_records")
    diagnosis = models.TextField()
    allergies = models.TextField(blank=True, null=True)
    treatment = models.TextField(blank=True, null=True)
    record_date = models.DateTimeField(default=timezone.now)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"Record for {self.patient} on {self.record_date.strftime('%Y-%m-%d')}"


# ------------------------------------------------------------
# Doctor Model - stores info about medical professionals
# ------------------------------------------------------------
class Doctor(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    specialization = models.CharField(max_length=100, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)

    def __str__(self):
        return f"Dr. {self.first_name} {self.last_name}"

