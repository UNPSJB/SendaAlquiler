# Generated by Django 4.1.1 on 2023-09-15 19:42

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='OfficeModel',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('street', models.CharField(max_length=60)),
                ('house_number', models.CharField(max_length=10)),
                ('note', models.CharField(max_length=255)),
            ],
        ),
    ]
