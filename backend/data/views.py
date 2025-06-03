import copy
from django.http import JsonResponse
from .models import view_status,view_nps_score,age_group,city,survey,survey_nps_score,SurveyResponseCounts,SurveyData2,CityRegionNps,SurveyHandsetBrandSummary
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

   nps_count = 973455 # This seems like a hardcoded total, ensure it's what you intend.
   nps_1_6 = view_nps_score.objects.filter(
    nps_score__gte=1, nps_score__lte=6
    ).aggregate(total_sum=Sum('count'))['total_sum'] or 0
   
   nps_7_8 = view_nps_score.objects.filter(
    nps_score__gte = 7,nps_score__lte = 8).aggregate(
    total_sum=Sum('count'))['total_sum'] or 0
   
   nps_9_10 = view_nps_score.objects.filter(
       nps_score__gte = 9, nps_score__lte = 10).aggregate(
           total_sum= Sum('count'))['total_sum'] or 0
   
   nps_0 = view_nps_score.objects.filter(nps_score = 0).aggregate(total_sum=Sum('count'))['total_sum'] or 0
   
   # It's good practice to handle potential division by zero if nps_count could be 0
   # and ensure all aggregated values are not None before arithmetic operations.
   # The 'or 0' added above helps with None values from aggregation.

   return JsonResponse({'count': nps_count,
                        '_0' : (nps_0*100/nps_count) if nps_count else 0,
                        '1-6' : (nps_1_6*100/nps_count) if nps_count else 0,
                        '7-8': (nps_7_8*100/nps_count) if nps_count else 0,
                        '9-10' : (nps_9_10*100/nps_count) if nps_count else 0,
                        'count_0' : nps_0,
                        'count_1_6' : nps_1_6,
                        'count_7_8' : nps_7_8,
                        'count_9_10' : nps_9_10})

# API des groupe d'age
@api_view(['GET'])
@permission_classes([AllowAny]) 

def age_groupe(request):
    # Get total count of valid responses (excluding -1)
    total_data = age_group.objects.aggregate(
        total_sum=Sum('total_valid'))['total_sum'] or 0
   
    # Get data for each age group
    age_groups_data = {}
    age_group_records = age_group.objects.all()
    
    for record in age_group_records:
        age_key = record.age_group
        total_valid = record.total_valid or 0
        promotors = record.promotors or 0
        passives = record.passives or 0
        detractors = record.detractors or 0
        
        # Calculate NPS score (excluding 0 from detractors as requested)
        total_responses = promotors + passives + detractors
        nps_score = None
        if total_responses > 0:
            nps_score = ((promotors / total_responses) * 100) - ((detractors / total_responses) * 100)
            nps_score = round(nps_score, 2)
        
        age_groups_data[age_key] = {
            'total': total_valid,
            'percentage': (total_valid * 100 / total_data) if total_data > 0 else 0,
            'nps_score': nps_score,
            'promotors': promotors,
            'passives': passives,
            'detractors': detractors,
            'avg_nps': float(record.avg_nps) if record.avg_nps else None
        }

    # Extract individual counts for backward compatibility
    null_data = age_groups_data.get('-1', {'total': 0, 'percentage': 0, 'nps_score': None})
    age_18_25 = age_groups_data.get('18-25', {'total': 0, 'percentage': 0, 'nps_score': None})
    age_26_35 = age_groups_data.get('26-35', {'total': 0, 'percentage': 0, 'nps_score': None})
    age_36_45 = age_groups_data.get('36-45', {'total': 0, 'percentage': 0, 'nps_score': None})
    age_46_55 = age_groups_data.get('46-55', {'total': 0, 'percentage': 0, 'nps_score': None})
    age_56_65 = age_groups_data.get('56-65', {'total': 0, 'percentage': 0, 'nps_score': None})

    return JsonResponse({
        'count': total_data,
        'Null': null_data['percentage'],
        '18-25': age_18_25['percentage'],
        '26-35': age_26_35['percentage'],
        '36-45': age_36_45['percentage'],
        '46-55': age_46_55['percentage'],
        '56-65': age_56_65['percentage'],
        'valeur null': null_data['total'],
        'age entre 18 et 25': age_18_25['total'],
        'age entre 26 et 35': age_26_35['total'],
        'age entre 36 et 45': age_36_45['total'],
        'age entre 46 et 55': age_46_55['total'],
        'age entre 56 et 65': age_56_65['total'],
        # Add NPS scores
        'nps_18_25': age_18_25['nps_score'],
        'nps_26_35': age_26_35['nps_score'],
        'nps_36_45': age_36_45['nps_score'],
        'nps_46_55': age_46_55['nps_score'],
        'nps_56_65': age_56_65['nps_score'],
        # Add detailed breakdown for each age group
        'age_groups_detail': age_groups_data
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
                        'null': count_null['total']*100/count,
                        'I Join':count_1['total']*100/count,
                        'Contact Center':count_2['total']*100/count,
                        'I use: Product':count_3['total']*100/count,
                        'Djezzy App':count_4['total']*100/count,
                        'Retail':count_5['total']*100/count,
                        'Network':count_6['total']*100/count,
                        'B2B':count_8['total']*100/count,
                        'count_null' : count_null['total']
                        })


@api_view(['GET'])
@permission_classes([AllowAny]) 
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
                           '_0' : survey_nps_0['total']*100/count_not_null,
                           '1-6' : survey_nps_1_6*100/count_not_null,
                           '7-8' : survey_nps_7_8*100/count_not_null,
                           '9-10' : survey_nps_9_10*100/count_not_null,
                           })



@api_view(['GET'])
@permission_classes([AllowAny]) 
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
                           '_0' : survey_nps_0['total']*100/count_not_null,
                           '1-6' : survey_nps_1_6*100/count_not_null,
                           '7-8' : survey_nps_7_8*100/count_not_null,
                           '9-10' : survey_nps_9_10*100/count_not_null
                           })


@api_view(['GET'])
@permission_classes([AllowAny]) 
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
                           '_0' : survey_nps_0['total']*100/count_not_null,
                           '1-6' : survey_nps_1_6*100/count_not_null,
                           '7-8' : survey_nps_7_8*100/count_not_null,
                           '9-10' : survey_nps_9_10*100/count_not_null
                         })



@api_view(['GET'])
@permission_classes([AllowAny]) 
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
                           '_0' : survey_nps_0['total']*100/count_not_null,
                           '1-6' : survey_nps_1_6*100/count_not_null,
                           '7-8' : survey_nps_7_8*100/count_not_null,
                           '9-10' : survey_nps_9_10*100/count_not_null
                           })

                           
@api_view(['GET'])
@permission_classes([AllowAny]) 
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
                           '_0' : survey_nps_0['total']*100/count_not_null,
                           '1-6' : survey_nps_1_6*100/count_not_null,
                           '7-8' : survey_nps_7_8*100/count_not_null,
                           '9-10' : survey_nps_9_10*100/count_not_null})


@api_view(['GET'])
@permission_classes([AllowAny]) 
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
                           '_0' : survey_nps_0['total']*100/count_not_null,
                           '1-6' : survey_nps_1_6*100/count_not_null,
                           '7-8' : survey_nps_7_8*100/count_not_null,
                           '9-10' : survey_nps_9_10*100/count_not_null})


@api_view(['GET'])
@permission_classes([AllowAny]) 
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
                           'not null' : count_not_null,
                           '_0' : survey_nps_0['total']*100/count_not_null,
                           '1-6' : survey_nps_1_6*100/count_not_null,
                           '7-8' : survey_nps_7_8*100/count_not_null,
                           '9-10' : survey_nps_9_10*100/count_not_null})

# API qui return le pourcentage de client qui on reduit a ce survey
#refactoirng issue here
@api_view(['GET'])
@permission_classes([AllowAny])
def question_type_stats_api(request):
    # Récupération des données depuis la vue matérialisée
    rows = SurveyResponseCounts.objects.all().order_by('-response_count')

    labels = []
    counts = []
    nps_scores = []
    total = 0
    total_promoters = 0
    total_detractors = 0

    for row in rows:
        labels.append(row.question_type)
        count = int(row.response_count)
        counts.append(count)
        total += count

        # Ces champs existent dans la vue matérialisée
        promoter_count = int(getattr(row, 'promoter_count', 0))
        detractor_count = int(getattr(row, 'detractor_count', 0))
        total_promoters += promoter_count
        total_detractors += detractor_count

        # Calcul du NPS pour ce type de question
        nps = 0
        if count > 0:
            nps = ((promoter_count - detractor_count) / count) * 100
        nps_scores.append(round(nps, 2))  # Arrondi à 2 décimales

    # Calcul du NPS global
    global_nps = 0
    if total > 0:
        global_nps = ((total_promoters - total_detractors) / total) * 100

    response_data = {
        'question_types': {
            'labels': labels,
            'counts': counts,
            'nps_scores': nps_scores
        },
        'totals': {
            'responses': total,
            'nps': round(global_nps, 2)
        }
    }

    return JsonResponse(response_data)


@api_view(['GET'])
@permission_classes([AllowAny])
def quick_stats(request):
    nps_data = view_nps_score.objects.all()

    promoters = nps_data.filter(nps_score__gte=9, nps_score__lte=10).aggregate(total=Sum('count')).get('total') or 0
    passives = nps_data.filter(nps_score__gte=7, nps_score__lte=8).aggregate(total=Sum('count')).get('total') or 0
    detractors = nps_data.filter(nps_score__gte=1, nps_score__lte=6).aggregate(total=Sum('count')).get('total') or 0

    print( "sum of 3 : ", promoters + passives + detractors)

    total_responses = promoters + passives + detractors
    null_responses = nps_data.filter(nps_score=-1).aggregate(total=Sum('count')).get('total') or 0
    print('total : ',total_responses)
    print('null : ',null_responses)

    # NPS score breakdown by segment_type
    nps_by_segment = SurveyData2.objects.exclude(nps_score=-1).exclude(segment_type='-1') \
        .values('segment_type') \
        .annotate(
    promotors=Count(Case(When(nps_score__range=(9, 10), then=1), output_field=IntegerField())),
    passives=Count(Case(When(nps_score__range=(7, 8), then=1), output_field=IntegerField())),
    detractors=Count(Case(When(nps_score__range=(1, 6), then=1), output_field=IntegerField()))
    )

    nps_score = 0
    if total_responses > 0:
        percent_promoters = promoters / total_responses * 100
        percent_detractors = detractors / total_responses * 100
        nps_score = percent_promoters - percent_detractors

    # --- Response Rate ---
    response_rate = total_responses / (total_responses + null_responses) * 100 if (total_responses + null_responses) > 0 else 0
   
    # --- Last Refresh Date ---
    last_refresh_date = None  

    # --- NPS Score Trend ---
    nps_score_trend = []  

    # Device brand distribution - Top 10 + Others
    # Fix: Use .values() to get dictionaries instead of model instances
    device_brand_queryset = SurveyHandsetBrandSummary.objects.all().values('handset_brand', 'total').order_by('-total')

    top10_brands = list(device_brand_queryset[:10])
    # Apply the same fix for others_count
    others_agg_result = device_brand_queryset[10:].aggregate(total=Sum('total'))
    others_count = others_agg_result.get('total') or 0
    
    # Calculate total for percentage calculation
    total_brand_responses = sum(brand['total'] for brand in top10_brands) + others_count
    
    # Prepare device brand data
    device_brand_labels = [brand['handset_brand'] for brand in top10_brands]
    device_brand_counts = [brand['total'] for brand in top10_brands]
    device_brand_percentages = [round((brand['total'] / total_brand_responses) * 100, 2) for brand in top10_brands]
    
    if others_count > 0:
        device_brand_labels.append('Others')
        device_brand_counts.append(others_count)
        device_brand_percentages.append(round((others_count / total_brand_responses) * 100, 2))

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
        "nps_score_trend": nps_score_trend,
        "device_brand_distribution": {
            "labels": device_brand_labels,
            "counts": device_brand_counts,
            "percentages": device_brand_percentages,
            "total_responses": total_brand_responses
        }
    })

@api_view(['GET'])
@permission_classes([AllowAny])
def geo_nps_stats(request):
    """
    Returns NPS statistics for regions and cities.
    - For each region: name, NPS score, avg rating, total responses, promoters, passives, detractors.
    - For each city: name, NPS score, avg rating, total responses, promoters, passives, detractors.
    Excludes entries where the category name itself is '-1'.
    """

    # Region statistics (aggregated per region, city_name == '-1')
    region_data_queryset = CityRegionNps.objects.filter(
        city_name='-1'
    ).values(
        'retail_region_name',
        'avg_nps',
        'total_valid',
        'promotors',
        'passives',
        'detractors'
    )

    regions = []
    for item in region_data_queryset:
        total = item['total_valid'] or 0
        promoters = item['promotors'] or 0
        detractors = item['detractors'] or 0
        passives = item['passives'] or 0

        nps_score = (
            ((promoters / total) * 100) - ((detractors / total) * 100)
        ) if total > 0 else None

        regions.append({
            'name': item['retail_region_name'],
            'average_rating': float(item['avg_nps']) if item['avg_nps'] is not None else None,
            'nps_score': round(nps_score, 2) if nps_score is not None else None,
            'total_responses': total,
            'promoters': promoters,
            'passives': passives,
            'detractors': detractors
        })

    # City statistics (aggregated per city, retail_region_name == '-1')
    city_data_queryset = CityRegionNps.objects.filter(
        retail_region_name='-1'
    ).values(
        'city_name',
        'avg_nps',
        'total_valid',
        'promotors',
        'passives',
        'detractors'
    )

    cities = []
    for item in city_data_queryset:
        total = item['total_valid'] or 0
        promoters = item['promotors'] or 0
        detractors = item['detractors'] or 0
        passives = item['passives'] or 0

        nps_score = (
            ((promoters / total) * 100) - ((detractors / total) * 100)
        ) if total > 0 else None

        cities.append({
            'name': item['city_name'],
            'average_rating': float(item['avg_nps']) if item['avg_nps'] is not None else None,
            'nps_score': round(nps_score, 2) if nps_score is not None else None,
            'total_responses': total,
            'promoters': promoters,
            'passives': passives,
            'detractors': detractors
        })

    return JsonResponse({
        'regions': regions,
        'cities': cities
    })