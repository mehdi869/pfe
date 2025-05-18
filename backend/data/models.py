from django.db import models
class SurveyData2(models.Model):
    ingestion_dttm = models.DateTimeField(blank=True, null=True)
    msisdn = models.CharField(max_length=50, blank=True, null=True)
    survey_type = models.DecimalField(max_digits=1, decimal_places=0, blank=True, null=True)
    lang_id = models.CharField(max_length=3, blank=True, null=True)
    question_number = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    first_resp = models.DateTimeField(blank=True, null=True)
    last_resp = models.DateTimeField(blank=True, null=True)
    alert = models.CharField(max_length=20, blank=True, null=True)
    alert_status = models.CharField(max_length=20, blank=True, null=True)
    assigned_role = models.CharField(max_length=20, blank=True, null=True)
    assigned_user = models.CharField(max_length=50, blank=True, null=True)
    nps_score = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    status = models.CharField(max_length=20, blank=True, null=True)
    age_group = models.CharField(max_length=20, blank=True, null=True)
    channel = models.CharField(max_length=2, blank=True, null=True)
    city_id = models.DecimalField(max_digits=5, decimal_places=0, blank=True, null=True)
    city_name = models.CharField(max_length=50, blank=True, null=True)
    curr_price_plan_desc = models.CharField(max_length=70, blank=True, null=True)
    curr_price_plan_key = models.CharField(max_length=10, blank=True, null=True)
    handset_brand = models.CharField(max_length=50, blank=True, null=True)
    handset_type = models.DecimalField(max_digits=2, decimal_places=0, blank=True, null=True)
    retail_pos_id = models.CharField(max_length=50, blank=True, null=True)
    retail_region_name = models.CharField(max_length=30, blank=True, null=True)
    segment_type = models.CharField(max_length=3, blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'survey_data2'

#relier a la view matérialiser de status 
class view_status(models.Model):
    
    id = models.IntegerField(primary_key=True)
    status = models.CharField(max_length=20)
    total = models.BigIntegerField()

    class Meta:
        managed = False   
        db_table = 'status_view' 

#relier a la view matérialiser de score_nps 
class view_nps_score (models.Model):
    id = models.IntegerField(primary_key=True)
    nps_score = models.IntegerField()
    count = models.BigIntegerField()

    class Meta:
        managed = False
        db_table = 'nps_score_view'

class age_group(models.Model):
    id = models.IntegerField(primary_key=True)
    age_group = models.CharField(max_length = 20)
    total = models.BigIntegerField()
    class Meta:
        managed = False
        db_table = 'age_group_view'


class city(models.Model):
    id = models.IntegerField(primary_key=True)
    city_name = models.CharField(max_length = 20)
    total = models.BigIntegerField()
    class Meta:
        managed = False
        db_table = 'city_view'


class survey(models.Model):
    id = models.IntegerField(primary_key=True)
    survey_type = models.CharField(max_length = 20)
    total = models.BigIntegerField()
    class Meta:
        managed = False
        db_table = 'survey_view'

class survey_nps_score(models.Model):
    id = models.IntegerField(primary_key=True)
    survey_type = models.CharField(max_length = 20)
    nps_score = models.IntegerField()
    total = models.BigIntegerField()
    class Meta:
        managed = False
        db_table = 'survey_nps_score'

class NpsQuestions(models.Model):
    survey_type = models.DecimalField(max_digits=1, decimal_places=0, primary_key=True)
    lang_id = models.CharField(max_length=3)
    question_number = models.DecimalField(max_digits=2, decimal_places=0)
    regexp_replace = models.CharField(max_length=500)
    question_name = models.CharField(max_length=100)
    question_type = models.CharField(max_length=20)

    class Meta:
        managed = False
        db_table = 'nps_questions'
        unique_together = (('survey_type', 'lang_id', 'question_number'),)
