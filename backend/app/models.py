from sqlalchemy import Column,Integer,String,Float,Boolean,Text,ForeignKey,DateTime,JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base
class User(Base):
    __tablename__='users'; id=Column(Integer,primary_key=True); full_name=Column(String); email=Column(String,unique=True,index=True); phone=Column(String); country=Column(String); role=Column(String,index=True); hashed_password=Column(String); interests=Column(JSON,default=[]); is_active=Column(Boolean,default=True); created_at=Column(DateTime,default=datetime.utcnow)
    operator=relationship('Operator',back_populates='user',uselist=False)
class Operator(Base):
    __tablename__='operators'; id=Column(Integer,primary_key=True); user_id=Column(Integer,ForeignKey('users.id')); company_name=Column(String,index=True); contact_person=Column(String); city=Column(String); country=Column(String,index=True); business_registration_number=Column(String); license_number=Column(String); website=Column(String); description=Column(Text); logo_url=Column(String); verified=Column(Boolean,default=False); status=Column(String,default='pending'); subscription_plan=Column(String,default='Free'); rating=Column(Float,default=4.6)
    user=relationship('User',back_populates='operator'); tours=relationship('Tour',back_populates='operator')
class Country(Base):
    __tablename__='countries'; id=Column(Integer,primary_key=True); name=Column(String,unique=True,index=True); slug=Column(String,unique=True); region=Column(String); image_url=Column(String)
class Destination(Base):
    __tablename__='destinations'; id=Column(Integer,primary_key=True); country_id=Column(Integer,ForeignKey('countries.id')); name=Column(String,index=True); slug=Column(String,index=True); image_url=Column(String); summary=Column(Text); country=relationship('Country')
class Category(Base):
    __tablename__='categories'; id=Column(Integer,primary_key=True); name=Column(String,unique=True); slug=Column(String,unique=True); icon=Column(String)
class Tour(Base):
    __tablename__='tours'; id=Column(Integer,primary_key=True); operator_id=Column(Integer,ForeignKey('operators.id')); country_id=Column(Integer,ForeignKey('countries.id')); destination_id=Column(Integer,ForeignKey('destinations.id')); category_id=Column(Integer,ForeignKey('categories.id')); title=Column(String,index=True); slug=Column(String,unique=True,index=True); description=Column(Text); price=Column(Float); duration_days=Column(Integer); group_size=Column(Integer); rating=Column(Float,default=4.8); review_count=Column(Integer,default=0); image_url=Column(String); itinerary=Column(JSON); inclusions=Column(JSON); exclusions=Column(JSON); availability=Column(JSON); travel_style=Column(String,default='Adventure'); featured=Column(Boolean,default=False)
    operator=relationship('Operator',back_populates='tours'); country=relationship('Country'); destination=relationship('Destination'); category=relationship('Category')
class Booking(Base):
    __tablename__='bookings'; id=Column(Integer,primary_key=True); user_id=Column(Integer,ForeignKey('users.id')); tour_id=Column(Integer,ForeignKey('tours.id')); operator_id=Column(Integer,ForeignKey('operators.id')); travel_date=Column(String); guests=Column(Integer); total_amount=Column(Float); status=Column(String,default='confirmed'); created_at=Column(DateTime,default=datetime.utcnow); user=relationship('User'); tour=relationship('Tour'); operator=relationship('Operator')
class Payment(Base):
    __tablename__='payments'; id=Column(Integer,primary_key=True); booking_id=Column(Integer,ForeignKey('bookings.id')); provider=Column(String); amount=Column(Float); currency=Column(String,default='USD'); admin_commission=Column(Float); operator_earning=Column(Float); status=Column(String,default='paid'); reference=Column(String); created_at=Column(DateTime,default=datetime.utcnow); booking=relationship('Booking')
class Review(Base):
    __tablename__='reviews'; id=Column(Integer,primary_key=True); user_id=Column(Integer,ForeignKey('users.id')); tour_id=Column(Integer,ForeignKey('tours.id')); operator_id=Column(Integer,ForeignKey('operators.id')); rating=Column(Integer); comment=Column(Text); status=Column(String,default='published'); created_at=Column(DateTime,default=datetime.utcnow); user=relationship('User'); tour=relationship('Tour')
class Message(Base):
    __tablename__='messages'; id=Column(Integer,primary_key=True); sender_id=Column(Integer,ForeignKey('users.id')); receiver_id=Column(Integer,ForeignKey('users.id')); tour_id=Column(Integer,ForeignKey('tours.id'),nullable=True); body=Column(Text); created_at=Column(DateTime,default=datetime.utcnow); read=Column(Boolean,default=False); sender=relationship('User',foreign_keys=[sender_id]); receiver=relationship('User',foreign_keys=[receiver_id]); tour=relationship('Tour')
class Wishlist(Base):
    __tablename__='wishlists'; id=Column(Integer,primary_key=True); user_id=Column(Integer,ForeignKey('users.id')); tour_id=Column(Integer,ForeignKey('tours.id')); user=relationship('User'); tour=relationship('Tour')
class Guide(Base):
    __tablename__='guides'; id=Column(Integer,primary_key=True); title=Column(String); slug=Column(String,unique=True); country_id=Column(Integer,ForeignKey('countries.id')); destination_id=Column(Integer,ForeignKey('destinations.id')); category_id=Column(Integer,ForeignKey('categories.id')); summary=Column(Text); content=Column(Text); image_url=Column(String); seo_title=Column(String); seo_description=Column(String); country=relationship('Country'); destination=relationship('Destination'); category=relationship('Category')
class Notification(Base):
    __tablename__='notifications'; id=Column(Integer,primary_key=True); user_id=Column(Integer,ForeignKey('users.id')); title=Column(String); body=Column(Text); read=Column(Boolean,default=False); created_at=Column(DateTime,default=datetime.utcnow)
class SupportTicket(Base):
    __tablename__='support_tickets'; id=Column(Integer,primary_key=True); user_id=Column(Integer,ForeignKey('users.id')); subject=Column(String); status=Column(String,default='open'); message=Column(Text)
class Withdrawal(Base):
    __tablename__='withdrawals'; id=Column(Integer,primary_key=True); operator_id=Column(Integer,ForeignKey('operators.id')); amount=Column(Float); status=Column(String,default='pending'); method=Column(String,default='Bank Transfer')
