from django.contrib import admin
from .models import StudentRequest

@admin.register(StudentRequest)
class StudentRequestAdmin(admin.ModelAdmin):
    list_display = ('name', 'request', 'created_at')
    search_fields = ('name', 'request')
    list_filter = ('created_at',)
    ordering = ('-created_at',)