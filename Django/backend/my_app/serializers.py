from rest_framework import serializers
from .models import Patient, MedicalRecord

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
