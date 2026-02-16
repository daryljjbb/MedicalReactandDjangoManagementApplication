from rest_framework import generics, permissions
from rest_framework.permissions import IsAdminUser
from rest_framework.views import APIView
from rest_framework.filters import OrderingFilter
from rest_framework import filters # 1. Make sure this is imported
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models.functions import TruncMonth
from django.db.models import Sum
from .models import Patient
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.decorators import api_view, permission_classes
from .serializers import PatientSerializer
from rest_framework import viewsets

# Create your views here.
# -------------------------------
# Patient ViewSet
# -------------------------------
class PatientListCreateView(generics.ListCreateAPIView):
    serializer_class = PatientSerializer
    # Note: We don't need 'queryset = Customer.objects.all()' anymore 
    # because get_queryset handles everything.

    def get_queryset(self):
        user = self.request.user
        
        # 1. If user is logged in and is Staff/Admin, show everything
        if user.is_authenticated and user.is_staff:
            return Patient.objects.all()
        
        # 2. If user is a regular logged-in user (like Daryl), show only their own
        if user.is_authenticated:
            return Patient.objects.filter(user=user)
        # 3. FIX: Changed Invoice.objects.none() to Patient.objects.none()
        # This ensures guests see an empty list instead of a system error.
        return Patient.objects.none() 

    def perform_create(self, serializer):
        # Automatically link the PATIENT to whoever is logged in
        serializer.save(user=self.request.user)

    def get_permissions(self):
        # POST (Creating) requires a login
        if self.request.method == "POST":
            return [permissions.IsAuthenticated()]
        
        # GET (Viewing) is allowed for everyone (but guests see an empty list)
        return [permissions.AllowAny()]
    
    # 2. Add filters.SearchFilter to this list
    filter_backends = [
        DjangoFilterBackend, 
        filters.SearchFilter, # <--- Add this!
        filters.OrderingFilter
    ]

      # 3. Tell SearchFilter which fields to check when ?search= is in the URL
    search_fields = ["first_name","last_name", "phone", "email"] 
    
    filterset_fields = {
        "first_name": ["icontains"],                     # optional: search by first name
        "last_name": ["icontains"],                    # optional: search by last name
        "email": ["icontains"],                    # optional: search by email
        "phone": ["icontains"],                    # optional: search by phone
    }
    ordering_fields = ["first_name", "last_name", "email"]
    ordering = ["first_name"]


# ✨ NEW Detail View (REQUIRED for /api/patients/1/)
class PatientDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Patient.objects.all()
    serializer_class = PatientSerializer
    permission_classes = [IsAuthenticated]


@api_view(["GET"])
@permission_classes([AllowAny]) # Changed from IsAuthenticated to AllowAny
def me(request):
    if request.user.is_authenticated:
        return Response({
            "username": request.user.username,
            "is_staff": request.user.is_staff,
            "is_superuser": request.user.is_superuser
        })
    # If not authenticated, return status 200 (Success) with empty data
    return Response({
        "username": "", 
        "is_staff": False, 
        "is_superuser": False
    }, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    
    if user is not None:
        login(request, user)
        return Response({
            "message": "Logged in",
            "is_staff": user.is_staff,
            "is_superuser": user.is_superuser
        })
    return Response({"error": "Invalid credentials"}, status=400)

@api_view(['POST'])
def api_logout(request):
    logout(request)
    return Response({"message": "Logged out"}, status=200)


@api_view(['POST'])
@permission_classes([AllowAny])
def api_register(request):
    username = request.data.get('username')
    password = request.data.get('password')
    is_admin = request.data.get('is_admin', False)

    if not username or not password:
        return Response({"error": "Username and password required"}, status=400)

    if User.objects.filter(username=username).exists():
        return Response({"error": "Username already exists"}, status=400)

    # Create the user
    user = User.objects.create_user(username=username, password=password)
    
    # If the checkbox was checked, make them a Staff/Superuser
    if is_admin:
        user.is_staff = True
        user.is_superuser = True
        user.save()

    return Response({"message": "User created successfully"}, status=201)




