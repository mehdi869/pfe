# ce fichier est pour convertir les objet python en données json est le contraire
from django.contrib.auth.models import User # le modèle User est prêt dans django , donc on doit l'importez
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["id","username","password"]
        extra_kwargs={"password":{"write_only":True}} # pour ne pas retaurner le password

    def create(self, validated_data):
        user=User.objects.create_user(**validated_data)
        return user