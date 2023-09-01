from rest_framework import serializers
from users import models


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Users
        fields = '__all__'
        # fields = ['email', 'is_superuser']


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = models.Address
        fields = '__all__'

    def update(self, instance, validated_data):
        # Update the address fields based on the validated data
        instance.country = validated_data.get('country', instance.country)
        instance.city = validated_data.get('city', instance.city)
        instance.street = validated_data.get('street', instance.street)
        instance.house_number = validated_data.get('house_number', instance.house_number)
        instance.Apartment = validated_data.get('Apartment', instance.Apartment)

        # Save the updated instance
        instance.save()
        return instance

class ProfilesSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    address = AddressSerializer(read_only=True)

    class Meta:
        model = models.Profiles
        fields = '__all__'

    def update(self, instance, validated_data):
        # Update the profile fields based on the validated data
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.phoneNumber = validated_data.get('phoneNumber', instance.phoneNumber)
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.birthday = validated_data.get('birthday', instance.birthday)
        instance.gender = validated_data.get('gender', instance.gender)

        # Save the updated instance
        instance.save()
        return instance
    def create(self, validated_data):
        validated_data['user_id'] = self.initial_data.get('user_id')
        validated_data['address_id'] = self.initial_data.get('address_id')
        return models.Profiles.objects.create(**validated_data)

