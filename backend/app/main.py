from fastapi import FastAPI, Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from typing import Optional
from .database import Base, engine, get_db
from .models import *
from .security import hash_password, verify_password, create_token, decode_token
Base.metadata.create_all(bind=engine)
app=FastAPI(title='Destination Africa API', version='2.0.0')
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_credentials=True, allow_methods=['*'], allow_headers=['*'])
oauth2=OAuth2PasswordBearer(tokenUrl='/auth/login')
def current_user(token:str=Depends(oauth2), db:Session=Depends(get_db)):
    payload=decode_token(token)
    if not payload: raise HTTPException(401,'Invalid token')
    user=db.query(User).filter(User.id==int(payload['sub'])).first()
    if not user: raise HTTPException(401,'User not found')
    return user
def role_required(*roles):
    def guard(user=Depends(current_user)):
        if user.role not in roles: raise HTTPException(403,'Not allowed')
        return user
    return guard
@app.get('/health')
def health(): return {'ok':True,'service':'Destination Africa API'}
@app.post('/auth/register')
def register(payload:dict, db:Session=Depends(get_db)):
    if db.query(User).filter(User.email==payload['email']).first(): raise HTTPException(400,'Email already exists')
    role=payload.get('role','traveler')
    u=User(full_name=payload.get('full_name') or payload.get('contact_person') or payload.get('company_name'), email=payload['email'], phone=payload.get('phone'), country=payload.get('country') or payload.get('country_of_residence'), role=role, hashed_password=hash_password(payload['password']), interests=payload.get('interests',[]))
    db.add(u); db.commit(); db.refresh(u)
    if role=='operator':
        op=Operator(user_id=u.id, company_name=payload.get('company_name','New Tour Operator'), contact_person=payload.get('contact_person',u.full_name), city=payload.get('city','Nairobi'), country=payload.get('country','Kenya'), business_registration_number=payload.get('business_registration_number'), license_number=payload.get('license_number'), website=payload.get('website'), description=payload.get('description','Tour operator on Destination Africa'), logo_url=payload.get('logo_url','/brand/logo-mark.svg'), subscription_plan=payload.get('subscription_plan','Free'), status='pending')
        db.add(op); db.commit()
    return {'token':create_token({'sub':str(u.id),'role':u.role}),'user':{'id':u.id,'email':u.email,'role':u.role,'full_name':u.full_name}}
@app.post('/auth/login')
def login(payload:dict, db:Session=Depends(get_db)):
    u=db.query(User).filter(User.email==payload.get('email')).first()
    if not u or not verify_password(payload.get('password',''),u.hashed_password): raise HTTPException(401,'Invalid credentials')
    return {'token':create_token({'sub':str(u.id),'role':u.role}),'user':{'id':u.id,'email':u.email,'role':u.role,'full_name':u.full_name}}
@app.get('/me')
def me(user=Depends(current_user)): return {'id':user.id,'full_name':user.full_name,'email':user.email,'role':user.role,'country':user.country}
@app.get('/countries')
def countries(db:Session=Depends(get_db)): return db.query(Country).order_by(Country.name).all()
@app.get('/countries/{slug}')
def country_detail(slug:str, db:Session=Depends(get_db)):
    c=db.query(Country).filter(Country.slug==slug).first();
    if not c: raise HTTPException(404,'Country not found')
    return {'country':c,'destinations':db.query(Destination).filter(Destination.country_id==c.id).all(),'tours':db.query(Tour).filter(Tour.country_id==c.id).limit(24).all(),'guides':db.query(Guide).filter(Guide.country_id==c.id).limit(10).all(),'operators':db.query(Operator).filter(Operator.country==c.name).limit(10).all()}
@app.get('/destinations')
def destinations(country:Optional[str]=None, db:Session=Depends(get_db)):
    q=db.query(Destination)
    if country: q=q.join(Country).filter(Country.slug==country)
    return q.limit(500).all()
@app.get('/categories')
def categories(db:Session=Depends(get_db)): return db.query(Category).all()
@app.get('/operators')
def operators(db:Session=Depends(get_db)): return db.query(Operator).limit(100).all()
@app.get('/tours')
def tours(q:Optional[str]=None,country:Optional[str]=None,destination:Optional[str]=None,category:Optional[str]=None,min_price:Optional[float]=None,max_price:Optional[float]=None,rating:Optional[float]=None,operator:Optional[int]=None,travel_style:Optional[str]=None,limit:int=24,offset:int=0,db:Session=Depends(get_db)):
    query=db.query(Tour)
    if q: query=query.filter(or_(Tour.title.ilike(f'%{q}%'),Tour.description.ilike(f'%{q}%')))
    if country: query=query.join(Country).filter(Country.slug==country)
    if destination: query=query.join(Destination).filter(Destination.slug==destination)
    if category: query=query.join(Category).filter(Category.slug==category)
    if min_price is not None: query=query.filter(Tour.price>=min_price)
    if max_price is not None: query=query.filter(Tour.price<=max_price)
    if rating is not None: query=query.filter(Tour.rating>=rating)
    if operator: query=query.filter(Tour.operator_id==operator)
    if travel_style: query=query.filter(Tour.travel_style==travel_style)
    total=query.count(); items=query.offset(offset).limit(limit).all()
    return {'items':items,'total':total,'limit':limit,'offset':offset}
@app.get('/tours/{slug}')
def tour(slug:str, db:Session=Depends(get_db)):
    t=db.query(Tour).filter(Tour.slug==slug).first();
    if not t: raise HTTPException(404,'Tour not found')
    return {'tour':t,'operator':t.operator,'reviews':db.query(Review).filter(Review.tour_id==t.id).all(),'related':db.query(Tour).filter(Tour.category_id==t.category_id,Tour.id!=t.id).limit(6).all()}
@app.post('/bookings')
def create_booking(payload:dict, user=Depends(role_required('traveler','admin')), db:Session=Depends(get_db)):
    t=db.query(Tour).filter(Tour.id==payload['tour_id']).first();
    if not t: raise HTTPException(404,'Tour not found')
    guests=int(payload.get('guests',1)); total=t.price*guests; commission=round(total*0.12,2)
    b=Booking(user_id=user.id,tour_id=t.id,operator_id=t.operator_id,travel_date=payload.get('travel_date','2026-08-15'),guests=guests,total_amount=total,status='confirmed')
    db.add(b); db.commit(); db.refresh(b)
    p=Payment(booking_id=b.id,provider=payload.get('provider','Stripe'),amount=total,admin_commission=commission,operator_earning=total-commission,reference=f'DA-{b.id:06d}')
    db.add(p); db.add(Notification(user_id=user.id,title='Booking confirmed',body=f'Your booking for {t.title} is confirmed.'))
    db.add(Notification(user_id=t.operator.user_id,title='New booking',body=f'{user.full_name} booked {t.title}.'))
    db.commit(); return {'booking':b,'payment':p}
@app.get('/dashboard/traveler')
def traveler_dash(user=Depends(role_required('traveler','admin')), db:Session=Depends(get_db)):
    return {'profile':user,'bookings':db.query(Booking).filter(Booking.user_id==user.id).all(),'payments':db.query(Payment).join(Booking).filter(Booking.user_id==user.id).all(),'wishlist':db.query(Wishlist).filter(Wishlist.user_id==user.id).all(),'messages':db.query(Message).filter(or_(Message.sender_id==user.id,Message.receiver_id==user.id)).all(),'reviews':db.query(Review).filter(Review.user_id==user.id).all(),'notifications':db.query(Notification).filter(Notification.user_id==user.id).all()}
@app.get('/dashboard/operator')
def operator_dash(user=Depends(role_required('operator','admin')), db:Session=Depends(get_db)):
    op=db.query(Operator).filter(Operator.user_id==user.id).first() if user.role=='operator' else db.query(Operator).first()
    return {'operator':op,'tours':db.query(Tour).filter(Tour.operator_id==op.id).all(),'bookings':db.query(Booking).filter(Booking.operator_id==op.id).all(),'reviews':db.query(Review).filter(Review.operator_id==op.id).all(),'earnings':sum([p.operator_earning for p in db.query(Payment).join(Booking).filter(Booking.operator_id==op.id).all()]),'withdrawals':db.query(Withdrawal).filter(Withdrawal.operator_id==op.id).all(),'messages':db.query(Message).filter(or_(Message.sender_id==user.id,Message.receiver_id==user.id)).all()}
@app.get('/dashboard/admin')
def admin_dash(user=Depends(role_required('admin')), db:Session=Depends(get_db)):
    revenue=db.query(func.sum(Payment.amount)).scalar() or 0; commission=db.query(func.sum(Payment.admin_commission)).scalar() or 0
    return {'totals':{'users':db.query(User).count(),'travelers':db.query(User).filter(User.role=='traveler').count(),'operators':db.query(Operator).count(),'pending_operators':db.query(Operator).filter(Operator.status=='pending').count(),'approved_operators':db.query(Operator).filter(Operator.status=='approved').count(),'tours':db.query(Tour).count(),'bookings':db.query(Booking).count(),'gmv':revenue,'admin_commission':commission},'recent_bookings':db.query(Booking).order_by(Booking.id.desc()).limit(10).all(),'recent_users':db.query(User).order_by(User.id.desc()).limit(10).all(),'payments':db.query(Payment).order_by(Payment.id.desc()).limit(20).all(),'tickets':db.query(SupportTicket).all()}
@app.post('/messages')
def send_message(payload:dict, user=Depends(current_user), db:Session=Depends(get_db)):
    m=Message(sender_id=user.id,receiver_id=payload['receiver_id'],tour_id=payload.get('tour_id'),body=payload['body']); db.add(m); db.commit(); db.refresh(m); return m
@app.get('/messages')
def messages(user=Depends(current_user), db:Session=Depends(get_db)): return db.query(Message).filter(or_(Message.sender_id==user.id,Message.receiver_id==user.id)).order_by(Message.created_at.desc()).all()
@app.post('/wishlists/{tour_id}')
def add_wishlist(tour_id:int, user=Depends(role_required('traveler','admin')), db:Session=Depends(get_db)):
    if not db.query(Wishlist).filter(Wishlist.user_id==user.id,Wishlist.tour_id==tour_id).first(): db.add(Wishlist(user_id=user.id,tour_id=tour_id)); db.commit()
    return {'ok':True}
@app.get('/guides')
def guides(q:Optional[str]=None,country:Optional[str]=None,destination:Optional[str]=None,category:Optional[str]=None,limit:int=24,db:Session=Depends(get_db)):
    query=db.query(Guide)
    if q: query=query.filter(or_(Guide.title.ilike(f'%{q}%'),Guide.summary.ilike(f'%{q}%')))
    if country: query=query.join(Country).filter(Country.slug==country)
    if destination: query=query.join(Destination).filter(Destination.slug==destination)
    if category: query=query.join(Category).filter(Category.slug==category)
    return query.limit(limit).all()
@app.get('/guides/{slug}')
def guide(slug:str, db:Session=Depends(get_db)):
    g=db.query(Guide).filter(Guide.slug==slug).first();
    if not g: raise HTTPException(404,'Guide not found')
    return g
