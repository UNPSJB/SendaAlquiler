# Generated by Django 4.2.7 on 2024-03-03 03:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0009_alter_product_price'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contractitemproductallocation',
            name='shipping_cost',
            field=models.PositiveBigIntegerField(default=0),
        ),
        migrations.AlterField(
            model_name='productservice',
            name='price',
            field=models.PositiveBigIntegerField(),
        ),
        migrations.AlterField(
            model_name='productsupplier',
            name='price',
            field=models.PositiveBigIntegerField(),
        ),
    ]
