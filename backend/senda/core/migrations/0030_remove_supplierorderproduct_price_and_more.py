# Generated by Django 4.2.7 on 2023-11-22 20:30

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0029_remove_supplierordermodel_total'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='supplierorderproduct',
            name='price',
        ),
        migrations.RemoveField(
            model_name='supplierorderproduct',
            name='total',
        ),
    ]
