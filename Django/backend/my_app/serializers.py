from rest_framework import serializers
from .models import Patient

# ----------------------------------------------------------------
# Patient Serializer
# ----------------------------------------------------------------
class PatientSerializer(serializers.ModelSerializer):
    # This helps when you want to include nested relationships later (optional)
    class Meta:
        model = Patient
        fields = "__all__"  # all patient fields
        read_only_fields = ["user"]

