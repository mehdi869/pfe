from django.contrib import admin
from .models import SurveyData2,view_status,view_nps_score,age_group,city,survey,survey_nps_score

admin.site.register(SurveyData2)
admin.site.register(view_status) 
admin.site.register(view_nps_score)
admin.site.register(age_group)
admin.site.register(city)
admin.site.register(survey)
admin.site.register(survey_nps_score)