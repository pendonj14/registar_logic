from django.contrib import admin
from .models import StudentRequest, UserProfile

@admin.register(StudentRequest)
class StudentRequestAdmin(admin.ModelAdmin):
    list_display = ('get_user_name', 'get_birth_date', 'year_level', 'affiliation', 'request', 
                   'clearance_status', 'is_graduate', 'last_attended', 'created_at')
    search_fields = ('user__profile__first_name', 'user__profile__last_name', 'request', 
                    'year_level', 'request_purpose')
    list_filter = ('created_at', 'clearance_status', 'is_graduate', 'affiliation')

    def get_user_name(self, obj):
        return f"{obj.user.profile.first_name} {obj.user.profile.middle_name} {obj.user.profile.last_name} {obj.user.profile.extension_name}".strip()
    get_user_name.short_description = 'Name'
    def get_birth_date(self, obj):
        return obj.user.profile.birth_date

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('get_full_name', 'user', 'contact_number', 'birth_date', 'college_program','created_at')
    search_fields = ('first_name', 'middle_name', 'last_name', 'user__email')
    list_filter = ('created_at',)

    def get_full_name(self, obj):
        full_name = f"{obj.first_name} {obj.middle_name or ''} {obj.last_name}"
        if obj.extension_name:
            full_name += f" {obj.extension_name}"
        return full_name.strip()
    get_full_name.short_description = 'Full Name'