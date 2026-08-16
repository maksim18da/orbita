from django.urls import path
from . import views

urlpatterns = [
    path('', views.home_page, name='home_page'),
    path('registration/', views.registration_page, name='registration'),
    path('contact/', views.contact_view, name='contact'),
    path('login/', views.login_view, name='login'),
    path('reset-password/', views.reset_password_view, name='reset_password'),
    path('cabinet/', views.cabinet_view, name='cabinet'),
    path('logout/', views.logout_view, name='logout'),
    path('about/', views.about_page, name='about_page'),
    path('cabinet/homework/<int:homework_id>/upload/', views.upload_homework_view, name='upload_homework'),
    path('cabinet/chat/<int:room_id>/messages/', views.chat_messages_view, name='chat_messages'),
    path('cabinet/chat/<int:room_id>/send/', views.chat_send_message_view, name='chat_send'),
]