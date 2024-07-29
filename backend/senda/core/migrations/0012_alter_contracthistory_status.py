# Generated by Django 4.2.7 on 2024-07-28 00:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0011_contract_final_deposit_amount_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='contracthistory',
            name='status',
            field=models.CharField(choices=[('EN_ESPERA_DE_CONFIMACION_DE_PEDIDOS', 'EN ESPERA DE CONFIMACION DE PEDIDOS'), ('PRESUPUESTADO', 'PRESUPUESTADO'), ('CON_DEPOSITO', 'SEÑADO'), ('PAGADO', 'PAGADO'), ('CANCELADO', 'CANCELADO'), ('ACTIVO', 'ACTIVO'), ('VENCIDO', 'VENCIDO'), ('FINALIZADO', 'FINALIZADO'), ('DEVOLUCION_EXITOSA', 'DEVOLUCION EXITOSA'), ('DEVOLUCION_FALLIDA', 'DEVOLUCION FALLIDA')], max_length=50),
        ),
    ]