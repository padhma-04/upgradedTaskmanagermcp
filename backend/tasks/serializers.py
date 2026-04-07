from rest_framework import serializers
from .models import Task

class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        fields = ('id', 'title', 'description', 'status', 'priority', 'scheduled_at', 'app_id', 'created_at', 'updated_at')
        read_only_fields = ('id', 'created_at', 'updated_at', 'app_id')

    def create(self, validated_data):
        # app_id is handled in the view from the request
        return super().create(validated_data)
