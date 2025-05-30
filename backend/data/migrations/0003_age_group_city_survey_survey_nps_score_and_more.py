# Generated by Django 5.2 on 2025-05-15 08:38

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0002_npsquestions'),
    ]

    operations = [
        migrations.CreateModel(
            name='age_group',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('age_group', models.CharField(max_length=20)),
                ('total', models.BigIntegerField()),
            ],
            options={
                'db_table': 'age_group_view',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='city',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('city_name', models.CharField(max_length=20)),
                ('total', models.BigIntegerField()),
            ],
            options={
                'db_table': 'city_view',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='survey',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('survey_type', models.CharField(max_length=20)),
                ('total', models.BigIntegerField()),
            ],
            options={
                'db_table': 'survey_view',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='survey_nps_score',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('survey_type', models.CharField(max_length=20)),
                ('nps_score', models.IntegerField()),
                ('total', models.BigIntegerField()),
            ],
            options={
                'db_table': 'survey_nps_score',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='view_nps_score',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('nps_score', models.IntegerField()),
                ('total', models.BigIntegerField()),
            ],
            options={
                'db_table': 'nps_score_view',
                'managed': False,
            },
        ),
        migrations.CreateModel(
            name='view_status',
            fields=[
                ('id', models.IntegerField(primary_key=True, serialize=False)),
                ('status', models.CharField(max_length=20)),
                ('total', models.BigIntegerField()),
            ],
            options={
                'db_table': 'status_view',
                'managed': False,
            },
        ),
    ]
