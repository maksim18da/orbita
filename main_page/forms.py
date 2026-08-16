from django import forms
from .models import Contact,Registration
from django.forms import  TextInput, ValidationError
class ContactForm(forms.ModelForm):
    class Meta:
        model = Contact
        fields = '__all__'
        widgets = {
            'surname': TextInput(attrs={
                'class': 'surname input-field',
                'placeholder': 'Введите Фамилию',
            }),
            'name': TextInput(attrs={
                'class': 'name input-field',
                'placeholder': 'Введите Имя'
            }),
            'phone_number': TextInput(attrs={
                'class': 'phone input-field',
                'placeholder': 'Введите номер телефона'
            }),
            'messenger': TextInput(attrs={
                'class': 'messenger input-field',
                'placeholder': '@username или ссылка'
            }),
        }

class Registration_form(forms.ModelForm):
    class Meta:
        model = Registration
        fields = ['surname', 'name', 'email', 'phone', 'password']
