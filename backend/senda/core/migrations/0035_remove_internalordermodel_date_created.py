# Generated by Django 4.2.7 on 2023-11-25 23:01

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0034_alter_supplierordermodel_total'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='internalordermodel',
            name='date_created',
        ),
    ]
