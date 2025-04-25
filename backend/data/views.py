from django.http import JsonResponse
from django.shortcuts import render
from .models import SurveyData2
from rest_framework.decorators import api_view
from django.db.models import Count

# API pour les status
@api_view(['GET'])
def status(request):
   
   status = SurveyData2.objects.values('status').annotate(total = Count('*'))
   # list_user = list(user)
   count = SurveyData2.objects.count()
   # poursentge = (list(user)[2]['total']*100)/count
   i = 0
   list_poursentage = []
   for element in status:
      poursentage = (element['total']*100)/count 
      list_poursentage.append(poursentage)


   return JsonResponse(list_poursentage, safe = False)


@api_view(['GET'])
def survey_8_nps(request):
      count = SurveyData2.objects.filter(survey_type = 8).count()
      count_null = SurveyData2.objects.filter(survey_type = 8,nps_score = -1).count()
      survey_nps_0 = SurveyData2.objects.filter(survey_type = 8,nps_score = 0).count()
      survey_nps_1_6 = SurveyData2.objects.filter(survey_type = 8,nps_score__gte = 1 ,nps_score__lte = 6).count()
      survey_nps_7_8 = SurveyData2.objects.filter(survey_type = 8,nps_score__gte = 7 ,nps_score__lte = 8).count()
      survey_nps_9_10 = SurveyData2.objects.filter(survey_type = 8,nps_score__gte = 9 ,nps_score__lte = 10).count()

      
      return JsonResponse({'count' : str(count),
                           'null' : str(count_null),
                           '0' : str(survey_nps_0),
                           '1-6' : str(survey_nps_1_6),
                           '7-8' : str(survey_nps_7_8),
                           '9-10' : str(survey_nps_9_10)})

# API des score nps
@api_view(['GET'])  
def nps_score(request):

   nps_count = SurveyData2.objects.exclude(nps_score = -1).count()
   nps_1_6 = SurveyData2.objects.exclude(nps_score = -1).filter(nps_score__gte = 1, nps_score__lte = 6).count()
   nps_7_8 = SurveyData2.objects.exclude(nps_score = -1).filter(nps_score__gte = 7, nps_score__lte = 8).count()
   nps_9_10 = SurveyData2.objects.exclude(nps_score = -1).filter(nps_score__gte = 9, nps_score__lte = 10).count()
   nps_0 = SurveyData2.objects.filter(nps_score = 0).count()
   
   poursentage_0 = (nps_0 * 100)/nps_count
   poursentage_1_6 = (nps_1_6 * 100)/nps_count
   poursentage_7_8 = (nps_7_8 * 100)/nps_count
   poursentage_9_10 = (nps_9_10 * 100)/nps_count

   return JsonResponse({'count' : str(nps_count),
                        '0' : str(nps_0),
                        '1-6' : str(nps_1_6),
                        "7-8" : str(nps_7_8),
                        "9-10" : str(nps_9_10),
                        'poursentage 0' : str(poursentage_0) + ' %',
                        'poursentage 1-6' : str(poursentage_1_6) + ' %',
                        "poursentage 7-8" : str(poursentage_7_8)+ ' %',
                        "poursentage 9-10" : str(poursentage_9_10) + ' %'})

# API des groupe d'age
@api_view(['GET'])
def age_group(request):
   count = SurveyData2.objects.count()
   count_Null = SurveyData2.objects.filter(age_group ="-1").count()
   count_18_25 = SurveyData2.objects.filter(age_group = '18-25').count()
   count_26_35 = SurveyData2.objects.filter(age_group = '26-35').count()
   count_36_45 = SurveyData2.objects.filter(age_group = '36-45').count()
   count_46_55 = SurveyData2.objects.filter(age_group = '46-55').count()
   count_56_65 = SurveyData2.objects.filter(age_group = '56-65').count()

   return JsonResponse({'count' : str(count),
                        'NUll' : str((count_Null*100)/count),
                        '18-25' : str((count_18_25*100)/count),
                        '26-35' : str((count_26_35*100)/count),
                        '36-45' : str((count_36_45*100)/count),
                        '46-55' : str((count_46_55*100)/count),
                        '56-65' : str((count_56_65*100)/count)})

# API qui return le pourcentage de client qui ce trouve dans chaque city
@api_view(['GET'])
def city_poursentage(request): 
   count = SurveyData2.objects.count()
   city_count = SurveyData2.objects.values('city_name').annotate(total = Count('*'))
   list_city = []
   for element in city_count:
      poursentage = (element['total'] * 100 / count)
      element['total'] = str(poursentage)
      list_city.append(element)

   return JsonResponse(list_city,safe=False)

# API qui return le nombre le client (dataset) qui ce trouve dans chaque city
@api_view(['GET'])
def city(request): 
   # count = SurveyData2.objects.count()
   city_count = SurveyData2.objects.values('city_name').annotate(total = Count('*'))

   return JsonResponse(list(city_count),safe=False)

# API qui return pur chaque survey le poursentage de client qui on reduit a ce survey
@api_view(["GET"])
def survey(request):
   count = SurveyData2.objects.count()
   count_null = SurveyData2.objects.filter(survey_type = -1).count()
   count_1 = SurveyData2.objects.filter(survey_type = 1).count()
   count_2 = SurveyData2.objects.filter(survey_type = 2).count()
   count_3 = SurveyData2.objects.filter(survey_type = 3).count()
   count_4 = SurveyData2.objects.filter(survey_type = 4).count()
   count_5 = SurveyData2.objects.filter(survey_type = 5).count()
   count_6 = SurveyData2.objects.filter(survey_type = 6).count()
   count_7 = SurveyData2.objects.filter(survey_type = 7).count()
   count_8 = SurveyData2.objects.filter(survey_type = 8).count()

   return JsonResponse({'count':str(count),
                        '-1':str((count_null*100)/count),
                        '1':str((count_1*100)/count),
                        '2':str((count_2*100)/count),
                        '3':str((count_3*100)/count),
                        '4':str((count_4*100)/count),
                        '5':str((count_5*100)/count),
                        '6':str((count_6*100)/count),
                        '7':str((count_7*100)/count),
                        '8':str((count_8*100)/count)})


@api_view(['GET'])
def survey_1_nps(request):
      count = SurveyData2.objects.filter(survey_type = 1).count()
      count_null = SurveyData2.objects.filter(survey_type = 1,nps_score = -1).count()
      survey_nps_0 = SurveyData2.objects.filter(survey_type = 1,nps_score = 0).count()
      survey_nps_1_6 = SurveyData2.objects.filter(survey_type = 1,nps_score__gte = 1 ,nps_score__lte = 6).count()
      survey_nps_7_8 = SurveyData2.objects.filter(survey_type = 1,nps_score__gte = 7 ,nps_score__lte = 8).count()
      survey_nps_9_10 = SurveyData2.objects.filter(survey_type = 1,nps_score__gte = 9 ,nps_score__lte = 10).count()

      
      return JsonResponse({'count' : str(count),
                           'null' : str(count_null),
                           '0' : str(survey_nps_0),
                           '1-6' : str(survey_nps_1_6),
                           '7-8' : str(survey_nps_7_8),
                           '9-10' : str(survey_nps_9_10)})



@api_view(['GET'])
def survey_2_nps(request):
      count = SurveyData2.objects.filter(survey_type = 2).count()
      count_null = SurveyData2.objects.filter(survey_type = 2,nps_score = -1).count()
      survey_nps_0 = SurveyData2.objects.filter(survey_type = 2,nps_score = 0).count()
      survey_nps_1_6 = SurveyData2.objects.filter(survey_type = 2,nps_score__gte = 1 ,nps_score__lte = 6).count()
      survey_nps_7_8 = SurveyData2.objects.filter(survey_type = 2,nps_score__gte = 7 ,nps_score__lte = 8).count()
      survey_nps_9_10 = SurveyData2.objects.filter(survey_type = 2,nps_score__gte = 9 ,nps_score__lte = 10).count()

      
      return JsonResponse({'count' : str(count),
                           'null' : str(count_null),
                           '0' : str(survey_nps_0),
                           '1-6' : str(survey_nps_1_6),
                           '7-8' : str(survey_nps_7_8),
                           '9-10' : str(survey_nps_9_10)})


@api_view(['GET'])
def survey_3_nps(request):
      count = SurveyData2.objects.filter(survey_type = 3).count()
      count_null = SurveyData2.objects.filter(survey_type = 3,nps_score = -1).count()
      survey_nps_0 = SurveyData2.objects.filter(survey_type = 3,nps_score = 0).count()
      survey_nps_1_6 = SurveyData2.objects.filter(survey_type = 3,nps_score__gte = 1 ,nps_score__lte = 6).count()
      survey_nps_7_8 = SurveyData2.objects.filter(survey_type = 3,nps_score__gte = 7 ,nps_score__lte = 8).count()
      survey_nps_9_10 = SurveyData2.objects.filter(survey_type = 3,nps_score__gte = 9 ,nps_score__lte = 10).count()

      
      return JsonResponse({'count' : str(count),
                           'null' : str(count_null),
                           '0' : str(survey_nps_0),
                           '1-6' : str(survey_nps_1_6),
                           '7-8' : str(survey_nps_7_8),
                           '9-10' : str(survey_nps_9_10)})



@api_view(['GET'])
def survey_4_nps(request):
      count = SurveyData2.objects.filter(survey_type = 4).count()
      count_null = SurveyData2.objects.filter(survey_type = 4,nps_score = -1).count()
      survey_nps_0 = SurveyData2.objects.filter(survey_type = 4,nps_score = 0).count()
      survey_nps_1_6 = SurveyData2.objects.filter(survey_type = 4,nps_score__gte = 1 ,nps_score__lte = 6).count()
      survey_nps_7_8 = SurveyData2.objects.filter(survey_type = 4,nps_score__gte = 7 ,nps_score__lte = 8).count()
      survey_nps_9_10 = SurveyData2.objects.filter(survey_type = 4,nps_score__gte = 9 ,nps_score__lte = 10).count()

      
      return JsonResponse({'count' : str(count),
                           'null' : str(count_null),
                           '0' : str(survey_nps_0),
                           '1-6' : str(survey_nps_1_6),
                           '7-8' : str(survey_nps_7_8),
                           '9-10' : str(survey_nps_9_10)})

                           
@api_view(['GET'])
def survey_5_nps(request):
      count = SurveyData2.objects.filter(survey_type = 5).count()
      count_null = SurveyData2.objects.filter(survey_type = 5,nps_score = -1).count()
      survey_nps_0 = SurveyData2.objects.filter(survey_type = 5,nps_score = 0).count()
      survey_nps_1_6 = SurveyData2.objects.filter(survey_type = 5,nps_score__gte = 1 ,nps_score__lte = 6).count()
      survey_nps_7_8 = SurveyData2.objects.filter(survey_type = 5,nps_score__gte = 7 ,nps_score__lte = 8).count()
      survey_nps_9_10 = SurveyData2.objects.filter(survey_type = 5,nps_score__gte = 9 ,nps_score__lte = 10).count()

      
      return JsonResponse({'count' : str(count),
                           'null' : str(count_null),
                           '0' : str(survey_nps_0),
                           '1-6' : str(survey_nps_1_6),
                           '7-8' : str(survey_nps_7_8),
                           '9-10' : str(survey_nps_9_10)})


@api_view(['GET'])
def survey_6_nps(request):
      count = SurveyData2.objects.filter(survey_type = 6).count()
      count_null = SurveyData2.objects.filter(survey_type = 6,nps_score = -1).count()
      survey_nps_0 = SurveyData2.objects.filter(survey_type = 6,nps_score = 0).count()
      survey_nps_1_6 = SurveyData2.objects.filter(survey_type = 6,nps_score__gte = 1 ,nps_score__lte = 6).count()
      survey_nps_7_8 = SurveyData2.objects.filter(survey_type = 6,nps_score__gte = 7 ,nps_score__lte = 8).count()
      survey_nps_9_10 = SurveyData2.objects.filter(survey_type = 6,nps_score__gte = 9 ,nps_score__lte = 10).count()

      
      return JsonResponse({'count' : str(count),
                           'null' : str(count_null),
                           '0' : str(survey_nps_0),
                           '1-6' : str(survey_nps_1_6),
                           '7-8' : str(survey_nps_7_8),
                           '9-10' : str(survey_nps_9_10)})


@api_view(['GET'])
def survey_8_nps(request):
      count = SurveyData2.objects.filter(survey_type = 8).count()
      count_null = SurveyData2.objects.filter(survey_type = 8,nps_score = -1).count()
      survey_nps_0 = SurveyData2.objects.filter(survey_type = 8,nps_score = 0).count()
      survey_nps_1_6 = SurveyData2.objects.filter(survey_type = 8,nps_score__gte = 1 ,nps_score__lte = 6).count()
      survey_nps_7_8 = SurveyData2.objects.filter(survey_type = 8,nps_score__gte = 7 ,nps_score__lte = 8).count()
      survey_nps_9_10 = SurveyData2.objects.filter(survey_type = 8,nps_score__gte = 9 ,nps_score__lte = 10).count()

      
      return JsonResponse({'count' : str(count),
                           'null' : str(count_null),
                           '0' : str(survey_nps_0),
                           '1-6' : str(survey_nps_1_6),
                           '7-8' : str(survey_nps_7_8),
                           '9-10' : str(survey_nps_9_10)})