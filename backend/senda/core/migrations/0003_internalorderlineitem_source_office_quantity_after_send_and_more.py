# Generated by Django 4.2.7 on 2024-03-02 21:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0002_internalorderlineitem_quantity_sent'),
    ]

    operations = [
        migrations.AddField(
            model_name='internalorderlineitem',
            name='source_office_quantity_after_send',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='internalorderlineitem',
            name='source_office_quantity_before_send',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='internalorderlineitem',
            name='target_office_quantity_after_receive',
            field=models.PositiveIntegerField(default=0),
        ),
        migrations.AddField(
            model_name='internalorderlineitem',
            name='target_office_quantity_before_receive',
            field=models.PositiveIntegerField(default=0),
        ),
    ]