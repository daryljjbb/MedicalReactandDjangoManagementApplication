from rest_framework import serializers
from .models import Patient, MedicalRecord, Doctor, Appointment

# ----------------------------------------------------------------
# Patient Serializer
# ----------------------------------------------------------------
class PatientSerializer(serializers.ModelSerializer):
    # This helps when you want to include nested relationships later (optional)
    class Meta:
        model = Patient
        fields = "__all__"  # all patient fields
        read_only_fields = ["user"]



# ----------------------------------------------------------------
# Medical Record Serializer
# ----------------------------------------------------------------
class MedicalRecordSerializer(serializers.ModelSerializer):
    patient_name = serializers.CharField(source="patient.__str__", read_only=True)

    class Meta:
        model = MedicalRecord
        fields = "__all__"
        read_only_fields = ["user"]


# ----------------------------------------------------------------
# Doctor Serializer
# ----------------------------------------------------------------
class DoctorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Doctor
        fields = "__all__"  # includes all model fields automatically
        read_only_fields = ["user"]



# ----------------------------------------------------------------
# Appointment Serializer
# ----------------------------------------------------------------
class AppointmentSerializer(serializers.ModelSerializer):
    # Add readable names for doctor and patient
    patient_name = serializers.CharField(source="patient.__str__", read_only=True)
    doctor_name = serializers.CharField(source="doctor.__str__", read_only=True)

    class Meta:
        model = Appointment
        fields = "__all__"  # includes patient, doctor, date, status, etc.
        read_only_fields = ["user"]

