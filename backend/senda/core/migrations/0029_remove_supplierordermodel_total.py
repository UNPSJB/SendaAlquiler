# Generated by Django 4.2.7 on 2023-11-22 17:52

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0028_alter_purchaseitemmodel_total'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='supplierordermodel',
            name='total',
        ),
    ]