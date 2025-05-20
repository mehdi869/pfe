import copy
from django.http import JsonResponse
from .models import view_status,view_nps_score,age_group,city,survey,survey_nps_score,SurveyResponseCounts,SurveyData2,CityRegionNps
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.db.models import Sum,Q,Avg , IntegerField , Count, Case, When
from django.db import connection

# API pour les status
@api_view(['GET'])
#allow any one
@permission_classes([AllowAny])
def status(request):
   
   status = view_status.objects.all().values("status", "total")
   list_status = copy.deepcopy(status)
   
   null = view_status.objects.filter(
        Q(status='-1') | Q(status='5')
    ).aggregate(somme_total=Sum('total'))['somme_total'] or 0  
    
   somme = view_status.objects.exclude(
        Q(status='-1') | Q(status='5')
    ).aggregate(somme_total=Sum('total'))['somme_total'] or 0  
   count = 61734113
   for liste in status:
      poursentage = (liste['total']*100)/count
      liste['total'] = str(poursentage)
      

   return JsonResponse({"list":list(status), 
                        "count" : str(count), 
                        "null" : str(null),
                        "somme" : str(somme),
                        'list_status' : list(list_status)
                        })

# API des score nps
@api_view(['GET']) 
#allow any one
@permission_classes([AllowAny]) 
def nps_score(request):

   nps_count = 973455
   nps_1_6 = view_nps_score.objects.filter(
    nps_score__gte=1, nps_score__lte=6
    ).aggregate(total_sum=Sum('total'))['total_sum']
   
   nps_7_8 = view_nps_score.objects.filter(
    nps_score__gte = 7,nps_score__lte = 8).aggregate(
    total_sum=Sum('total'))['total_sum']
   
   nps_9_10 = view_nps_score.objects.filter(
       nps_score__gte = 9, nps_score__lte = 10).aggregate(
           total_sum= Sum('total'))['total_sum']
   
   nps_0 = view_nps_score.objects.filter(nps_score = 0).aggregate(total_sum=Sum('total'))['total_sum']
   
   return JsonResponse({'count': nps_count,
                        '_0' : nps_0*100/nps_count,
                        '1-6' : nps_1_6*100/nps_count,
                        '7-8': nps_7_8*100/nps_count,
                        '9-10' : nps_9_10*100/nps_count,
                        'count_0' : nps_0,
                        'count_1_6' : nps_1_6,
                        'count_7_8' : nps_7_8,
                        'count_9_10' : nps_9_10})

# API des groupe d'age
@api_view(['GET'])
@permission_classes([AllowAny]) 

def age_groupe(request):
   count = age_group.objects.aggregate(
        total_sum = Sum('total'))['total_sum']
   
   count_Null = age_group.objects.filter(
        age_group ="-1").values("total").first()
   
   count_18_25 = age_group.objects.filter(
        age_group = '18-25').values("total").first()
   
   count_26_35 = age_group.objects.filter(
        age_group = '26-35').values("total").first()
   
   count_36_45 = age_group.objects.filter(
        age_group = '36-45').values("total").first()
   
   count_46_55 = age_group.objects.filter(
        age_group = '46-55').values("total").first()
   
   count_56_65 = age_group.objects.filter(
        age_group = '56-65').values("total").first()

   return JsonResponse({'count' : count,
                        'NUll' : count_Null["total"]*100/count,
                        '18-25' : count_18_25["total"]*100/count,
                        '26-35' : count_26_35["total"]*100/count,
                        '36-45' : count_36_45["total"]*100/count,
                        '46-55' : count_46_55["total"]*100/count,
                        '56-65' : count_56_65["total"]*100/count
                        })

# API qui return le pourcentage de client qui ce trouve dans chaque city
# @api_view(['GET'])
# def city_poursentage(request): 
#    count = SurveyData2.objects.count()
#    city_count = SurveyData2.objects.values('city_name').annotate(total = Count('*'))
#    list_city = []
#    for element in city_count:
#       poursentage = (element['total'] * 100 / count)
#       element['total'] = str(poursentage)
#       list_city.append(element)

#    return JsonResponse(list_city,safe=False)

# API qui return le nombre de client (dataset) qui ce trouve dans chaque city
@api_view(['GET'])
def city_views(request): 
   # count = SurveyData2.objects.count()
   city_count = city.objects.values('city_name', 'total')

   return JsonResponse(list(city_count),safe=False)

# API qui return pur chaque survey le poursentage de client qui on reduit a ce survey
@api_view(["GET"])
@permission_classes([AllowAny]) 
def survey_type(request):
   count = survey.objects.aggregate(total_sum = Sum('total'))['total_sum']
   count_null = survey.objects.filter(survey_type = -1).values('total').first()
   count_1 = survey.objects.filter(survey_type = 1).values('total').first()
   count_2 = survey.objects.filter(survey_type = 2).values('total').first()
   count_3 = survey.objects.filter(survey_type = 3).values('total').first()
   count_4 = survey.objects.filter(survey_type = 4).values('total').first()
   count_5 = survey.objects.filter(survey_type = 5).values('total').first()
   count_6 = survey.objects.filter(survey_type = 6).values('total').first()
   count_8 = survey.objects.filter(survey_type = 8).values('total').first()

   return JsonResponse({'count':count,
                        '-1': count_null['total']*100/count,
                        '1':count_1['total']*100/count,
                        '2':count_2['total']*100/count,
                        '3':count_3['total']*100/count,
                        '4':count_4['total']*100/count,
                        '5':count_5['total']*100/count,
                        '6':count_6['total']*100/count,
                        '8':count_8['total']*100/count
                        })


@api_view(['GET'])
def survey_1_nps(request):
      count = survey_nps_score.objects.filter(survey_type = 1).aggregate(total_sum = Sum('total'))['total_sum'] 
      count_null = survey_nps_score.objects.filter(survey_type = 1,nps_score = -1).values('total').first()
      count_not_null= survey_nps_score.objects.filter(survey_type = 1).exclude(nps_score = -1).aggregate(total_sum = Sum('total'))['total_sum'] 

      survey_nps_0 = survey_nps_score.objects.filter(survey_type = 1,nps_score = 0).values('total').first()
      survey_nps_1_6 = survey_nps_score.objects.filter(
           survey_type = 1,
           nps_score__gte = 1 ,
           nps_score__lte = 6
           ).aggregate(total_sum = Sum('total'))['total_sum']
      

      survey_nps_7_8 = survey_nps_score.objects.filter(survey_type = 1,nps_score__gte = 7 ,nps_score__lte = 8).aggregate(total_sum = Sum('total'))['total_sum']
      survey_nps_9_10 = survey_nps_score.objects.filter(survey_type = 1,nps_score__gte = 9 ,nps_score__lte = 10).aggregate(total_sum = Sum('total'))['total_sum']

      
      return JsonResponse({'count' :count,
                           'null' : count_null['total'],
                           'not null' : count_not_null,
                           '0' : survey_nps_0['total']*100/count_not_null,
                           '1-6' : survey_nps_1_6*100/count_not_null,
                           '7-8' : survey_nps_7_8*100/count_not_null,
                           '9-10' : survey_nps_9_10*100/count_not_null
                           })



@api_view(['GET'])
def survey_2_nps(request):
      count = survey_nps_score.objects.filter(survey_type = 2
                ).aggregate(total_sum = Sum('total'))['total_sum']
      
      count_null = survey_nps_score.objects.filter(
           survey_type = 2,
           nps_score = -1).values('total').first()
      
      count_not_null = survey_nps_score.objects.filter(survey_type = 2
                      ).exclude(nps_score = -1
                      ).aggregate(total_sum = Sum('total'))['total_sum']
      

      survey_nps_0 = survey_nps_score.objects.filter(
           survey_type = 2,
           nps_score = 0
           ).values('total').first()
      

      survey_nps_1_6 = survey_nps_score.objects.filter(
           survey_type = 2,
           nps_score__gte = 1 ,
           nps_score__lte = 6
           ).aggregate(total_sum = Sum('total'))['total_sum']
      
      
      survey_nps_7_8 = survey_nps_score.objects.filter(
           survey_type = 2,
           nps_score__gte = 7 ,
           nps_score__lte = 8
           ).aggregate(total_sum = Sum('total'))['total_sum']
      
      
      survey_nps_9_10 = survey_nps_score.objects.filter(
           survey_type = 2,
           nps_score__gte = 9 ,
           nps_score__lte = 10
           ).aggregate(total_sum = Sum('total'))['total_sum']

      
      return JsonResponse({'count' : count,
                           'null' : count_null['total'],
                           'not null' : count_not_null,
                           '0' : survey_nps_0['total']*100/count_not_null,
                           '1-6' : survey_nps_1_6*100/count_not_null,
                           '7-8' : survey_nps_7_8*100/count_not_null,
                           '9-10' : survey_nps_9_10*100/count_not_null
                           })


@api_view(['GET'])
def survey_3_nps(request):
      count = survey_nps_score.objects.filter(
           survey_type = 3
           ).aggregate(total_sum = Sum('total'))['total_sum']
      
      
      count_null = survey_nps_score.objects.filter(
           survey_type = 3,
           nps_score = -1
           ).values('total').first()
      
      count_not_null = survey_nps_score.objects.filter(survey_type = 3
                      ).exclude(nps_score = -1
                      ).aggregate(total_sum = Sum('total'))['total_sum']
      
      survey_nps_0 = survey_nps_score.objects.filter(
           survey_type = 3,
           nps_score = 0
           ).values('total').first()
      
      
      survey_nps_1_6 = survey_nps_score.objects.filter(
           survey_type = 3,
           nps_score__gte = 1 ,
           nps_score__lte = 6
           ).aggregate(total_sum = Sum('total'))['total_sum']
      
      survey_nps_7_8 = survey_nps_score.objects.filter(
           survey_type = 3,
           nps_score__gte = 7 ,
           nps_score__lte = 8
           ).aggregate(total_sum = Sum('total'))['total_sum']
      
      survey_nps_9_10 = survey_nps_score.objects.filter(
           survey_type = 3,
           nps_score__gte = 9 ,
           nps_score__lte = 10
           ).aggregate(total_sum = Sum('total'))['total_sum']

      
      return JsonResponse({'count' : count,
                           'null' : count_null['total'],
                           'not null' : count_not_null,
                           '0' : survey_nps_0['total']*100/count_not_null,
                           '1-6' : survey_nps_1_6*100/count_not_null,
                           '7-8' : survey_nps_7_8*100/count_not_null,
                           '9-10' : survey_nps_9_10*100/count_not_null
                         })



@api_view(['GET'])
def survey_4_nps(request):
      count = survey_nps_score.objects.filter(
           survey_type = 4
           ).aggregate(total_sum = Sum('total'))['total_sum']
      

      count_null = survey_nps_score.objects.filter(
           survey_type = 4,
           nps_score = -1
           ).values('total').first()
      
      count_not_null = survey_nps_score.objects.filter(
           survey_type = 4
           ).exclude(
                nps_score = -1
                ).aggregate(total_sum = Sum('total'))['total_sum']
      
      survey_nps_0 = survey_nps_score.objects.filter(
           survey_type = 4,
           nps_score = 0
           ).values('total').first()
      
      
      survey_nps_1_6 = survey_nps_score.objects.filter(
           survey_type = 4,
           nps_score__gte = 1 ,
           nps_score__lte = 6).aggregate(total_sum = Sum('total'))['total_sum']
      

      survey_nps_7_8 = survey_nps_score.objects.filter(
           survey_type = 4,
           nps_score__gte = 7 ,
           nps_score__lte = 8
           ).aggregate(total_sum = Sum('total'))['total_sum']
      
      survey_nps_9_10 = survey_nps_score.objects.filter(
           survey_type = 4,
           nps_score__gte = 9,
           nps_score__lte = 10
           ).aggregate(total_sum = Sum('total'))['total_sum']

      
      return JsonResponse({'count' : count,
                           'null' : count_null['total'],
                           "not null" : count_not_null,
                           '0' : survey_nps_0['total']*100/count_not_null,
                           '1-6' : survey_nps_1_6*100/count_not_null,
                           '7-8' : survey_nps_7_8*100/count_not_null,
                           '9-10' : survey_nps_9_10*100/count_not_null
                           })

                           
@api_view(['GET'])
def survey_5_nps(request):
      count = survey_nps_score.objects.filter(
           survey_type = 5
           ).aggregate(total_sum = Sum('total'))['total_sum']  
      
      count_null = survey_nps_score.objects.filter(
           survey_type = 5,
           nps_score = -1
           ).values('total').first()
      
      count_not_null = survey_nps_score.objects.filter(
           survey_type = 5
           ).exclude(
                nps_score = -1
                ).aggregate(total_sum = Sum('total'))['total_sum']

      survey_nps_0 = survey_nps_score.objects.filter(
           survey_type = 5,
           nps_score = 0).values('total').first()
      
      survey_nps_1_6 = survey_nps_score.objects.filter(
           survey_type = 5,
           nps_score__gte = 1 ,
           nps_score__lte = 6
           ).aggregate(total_sum = Sum('total'))['total_sum']
      
      survey_nps_7_8 = survey_nps_score.objects.filter(
           survey_type = 5,
           nps_score__gte = 7 ,
           nps_score__lte = 8
           ).aggregate(total_sum = Sum('total'))['total_sum']
      

      survey_nps_9_10 = survey_nps_score.objects.filter(
           survey_type = 5,
           nps_score__gte = 9 ,
           nps_score__lte = 10
           ).aggregate(total_sum = Sum('total'))['total_sum']

      
      return JsonResponse({'count' : count,
                           'null' : count_null['total'],
                           "not null" : count_not_null,
                           '0' : survey_nps_0['total']*100/count_not_null,
                           '1-6' : survey_nps_1_6*100/count_not_null,
                           '7-8' : survey_nps_7_8*100/count_not_null,
                           '9-10' : survey_nps_9_10*100/count_not_null})


@api_view(['GET'])
def survey_6_nps(request):
      
      count = survey_nps_score.objects.filter(
           survey_type = 6
           ).aggregate(total_sum = Sum('total'))['total_sum']
      
      count_null = survey_nps_score.objects.filter(
           survey_type = 6,
           nps_score = -1
           ).values('total').first()
      
      count_not_null = survey_nps_score.objects.filter(
           survey_type = 6
           ).exclude(
                nps_score = -1
                ).aggregate(total_sum = Sum('total'))['total_sum']
      
      survey_nps_0 = survey_nps_score.objects.filter(
           survey_type = 6,
           nps_score = 0
           ).values('total').first()
      
      survey_nps_1_6 = survey_nps_score.objects.filter(
           survey_type = 6,
           nps_score__gte = 1 ,
           nps_score__lte = 6
           ).aggregate(total_sum = Sum('total'))['total_sum']
      
      survey_nps_7_8 = survey_nps_score.objects.filter(
           survey_type = 6,
           nps_score__gte = 7 ,
           nps_score__lte = 8
           ).aggregate(total_sum = Sum('total'))['total_sum']
      survey_nps_9_10 = survey_nps_score.objects.filter(
           survey_type = 6,
           nps_score__gte = 9 ,
           nps_score__lte = 10
           ).aggregate(total_sum = Sum('total'))['total_sum']

      
      return JsonResponse({'count' : count,
                           'null' : count_null['total'],
                           'not null' : count_not_null,
                           '0' : survey_nps_0['total']*100/count_not_null,
                           '1-6' : survey_nps_1_6*100/count_not_null,
                           '7-8' : survey_nps_7_8*100/count_not_null,
                           '9-10' : survey_nps_9_10*100/count_not_null})


@api_view(['GET'])
def survey_8_nps(request):
      
      count = survey_nps_score.objects.filter(
           survey_type = 8
           ).aggregate(total_sum = Sum('total'))['total_sum']
      
      count_null = survey_nps_score.objects.filter(
           survey_type = 8,
           nps_score = -1
           ).values('total').first()
      
      count_not_null = survey_nps_score.objects.filter(
           survey_type = 8
           ).exclude(
                nps_score = -1
                ).aggregate(total_sum = Sum('total'))['total_sum']
      
      survey_nps_0 = survey_nps_score.objects.filter(
           survey_type = 8,
           nps_score = 0
           ).values('total').first()
      
      survey_nps_1_6 = survey_nps_score.objects.filter(survey_type = 8,
      nps_score__gte = 1,
      nps_score__lte = 6
      ).aggregate(total_sum = Sum('total'))['total_sum']

      survey_nps_7_8 = survey_nps_score.objects.filter(survey_type = 8,
      nps_score__gte = 7,
      nps_score__lte = 8
      ).aggregate(total_sum = Sum('total'))['total_sum']

      survey_nps_9_10 = survey_nps_score.objects.filter(survey_type = 8,
      nps_score__gte = 9,
      nps_score__lte = 10
      ).aggregate(total_sum = Sum('total'))['total_sum']

      
      return JsonResponse({'count' : count,
                           'null' : count_null['total'],
                           'not_null' : count_not_null,
                           '0' : survey_nps_0['total']*100/count_not_null,
                           '1-6' : survey_nps_1_6*100/count_not_null,
                           '7-8' : survey_nps_7_8*100/count_not_null,
                           '9-10' : survey_nps_9_10*100/count_not_null})

# API qui return le pourcentage de client qui on reduit a ce survey
#refactoirng issue here
@api_view(['GET'])
@permission_classes([AllowAny])
def question_type_stats_api(request):
    rows = SurveyResponseCounts.objects.all().order_by('-response_count')
    labels = []
    counts = []
    total = 0

    for row in rows:
        labels.append(row.question_type)
        count = int(row.response_count)
        counts.append(count)
        total += count

    response_data = {
        'question_types': {
            'labels': labels,
            'counts': counts
        },
        'total_responses': total
    }
    return JsonResponse(response_data)


@api_view(['GET'])
@permission_classes([AllowAny])
def quick_stats(request):
    nps_data = view_nps_score.objects.all()

    promoters = nps_data.filter(nps_score__gte=9, nps_score__lte=10).aggregate(total=Sum('count'))['total'] or 0
    passives = nps_data.filter(nps_score__gte=7, nps_score__lte=8).aggregate(total=Sum('count'))['total'] or 0
    detractors = nps_data.filter(nps_score__gte=0, nps_score__lte=6).aggregate(total=Sum('count'))['total'] or 0

    print( "sum of 3 : ", promoters + passives + detractors)

    total_responses = nps_data.exclude(nps_score=-1).aggregate(total=Sum('count'))['total'] or 0
    null_responses = nps_data.filter(nps_score=-1).aggregate(total=Sum('count'))['total'] or 0
    print('total : ',total_responses)
    print('null : ',null_responses)

    # NPS score breakdown by segment_type
    nps_by_segment = SurveyData2.objects.exclude(nps_score=-1).exclude(segment_type='-1') \
        .values('segment_type') \
        .annotate(
    total_valid=Count('id'),
    promotors=Count(Case(When(nps_score__range=(9, 10), then=1), output_field=IntegerField())),
    passives=Count(Case(When(nps_score__range=(7, 8), then=1), output_field=IntegerField())),
    detractors=Count(Case(When(nps_score__range=(0, 6), then=1), output_field=IntegerField()))
    )

    
    nps_score = 0
    if total_responses > 0:
        nps_score = ((promoters - detractors) * 100) / total_responses

    # --- Response Rate ---
    # You need to define what is the total population (all possible respondents)
    # For now, let's assume it's the sum of all responses (including nulls)
    response_rate = total_responses / (total_responses + null_responses) * 100 if (total_responses + null_responses) > 0 else 0
   
    # --- Last Refresh Date ---
    # the dates are flatted in the DB i.e they've used one date for all records 
    # 
    last_refresh_date = None  # <-- You need to provide this from your DB or ETL process

    # --- NPS Score Trend ---
     #
    nps_score_trend = []  # <-- You need to provide this from a time-series table or view

    return JsonResponse({
        "nps_score": round(nps_score, 2),
        "promoters": promoters,
        "passives": passives,
        "detractors": detractors,
        "total_responses": total_responses,
        "null_responses": null_responses,
        "response_rate": round(response_rate, 2),
        "nps_by_segment": list(nps_by_segment),
        "last_refresh_date": last_refresh_date,
        "nps_score_trend": nps_score_trend
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def geo_nps_stats(request):
    """
    Returns NPS statistics for regions and cities.
    - For each region: name, avg NPS, total responses, promoters, passives, detractors.
    - For each city: name, avg NPS, total responses, promoters, passives, detractors.
    Excludes entries where the category name itself is '-1'.
    """

    # Region statistics:
    # Fetches rows where city_name is '-1' (aggregated for the region)
    # and retail_region_name is an actual region name (not '-1').
    region_data_queryset = CityRegionNps.objects.filter(
        city_name='-1').values(
        'retail_region_name',
        'avg_nps',
        'total_valid',
        'promotors',
        'passives',
        'detractors'
    )

    regions = []
    for item in region_data_queryset:
        regions.append({
            'name': item['retail_region_name'],
            'avg_nps': float(item['avg_nps']) if item['avg_nps'] is not None else None,
            'total_responses': item['total_valid'],
            'promoters': item['promotors'],
            'passives': item['passives'],
            'detractors': item['detractors']
        })

    # City statistics:
    # Fetches rows where retail_region_name is '-1' (aggregated for the city)
    city_data_queryset = CityRegionNps.objects.filter(retail_region_name='-1' ).values(
        'city_name',
        'avg_nps',
        'total_valid',
        'promotors',
        'passives',
        'detractors'
    )

    cities = []
    for item in city_data_queryset:
        cities.append({
            'name': item['city_name'],
            'avg_nps': float(item['avg_nps']) if item['avg_nps'] is not None else None,
            'total_responses': item['total_valid'],
            'promoters': item['promotors'],
            'passives': item['passives'],
            'detractors': item['detractors']
        })

    return JsonResponse({
        'regions': regions,
        'cities': cities
    })