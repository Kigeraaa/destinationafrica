from .database import Base, engine, SessionLocal
from .models import *
from .security import hash_password
import random, re
Base.metadata.drop_all(bind=engine); Base.metadata.create_all(bind=engine)
db=SessionLocal()
def slug(s): return re.sub(r'[^a-z0-9]+','-',s.lower()).strip('-')
def img(key): return f'https://images.unsplash.com/photo-{key}?auto=format&fit=crop&w=1200&q=80'
admin=User(full_name='Admin User',email='admin@destinationafrica.com',phone='+254700000001',country='Kenya',role='admin',hashed_password=hash_password('Admin123!'))
travelers=[]
for i,(n,e,c) in enumerate([('Amina Carter','traveler@destinationafrica.com','United States'),('James Mwangi','james@example.com','Kenya'),('Sophia Turner','sophia@example.com','United Kingdom'),('Daniel Okafor','daniel@example.com','Nigeria'),('Maya Patel','maya@example.com','India')]):
    travelers.append(User(full_name=n,email=e,phone='+25470000000'+str(i+2),country=c,role='traveler',hashed_password=hash_password('Traveler123!'),interests=['Safari','Beach','Culture']))
db.add(admin); [db.add(x) for x in travelers]; db.commit()
countries=['Algeria','Angola','Benin','Botswana','Burkina Faso','Burundi','Cabo Verde','Cameroon','Central African Republic','Chad','Comoros','Republic of the Congo','Democratic Republic of the Congo','Djibouti','Egypt','Equatorial Guinea','Eritrea','Eswatini','Ethiopia','Gabon','The Gambia','Ghana','Guinea','Guinea-Bissau','Ivory Coast','Kenya','Lesotho','Liberia','Libya','Madagascar','Malawi','Mali','Mauritania','Mauritius','Morocco','Mozambique','Namibia','Niger','Nigeria','Rwanda','Sao Tome and Principe','Senegal','Seychelles','Sierra Leone','Somalia','South Africa','South Sudan','Sudan','Tanzania','Togo','Tunisia','Uganda','Zambia','Zimbabwe']
country_imgs=['1500530855697-b586d89ba3ee','1516026672322-bc52d61a55d5','1523805009345-7448845a9e53','1547471080-7cc2caa01a7e','1533105079780-92b9be482077']
country_objs=[]
for i,c in enumerate(countries):
    co=Country(name=c,slug=slug(c),region='Africa',image_url=img(country_imgs[i%len(country_imgs)])); db.add(co); country_objs.append(co)
db.commit()
popular={'Kenya':['Masai Mara','Diani Beach','Nairobi National Park','Amboseli','Lamu','Lake Nakuru','Samburu'],'Tanzania':['Serengeti','Zanzibar','Ngorongoro Crater','Kilimanjaro','Arusha','Nyerere National Park'],'Uganda':['Bwindi Impenetrable Forest','Kampala','Queen Elizabeth National Park','Jinja','Murchison Falls'],'Rwanda':['Volcanoes National Park','Kigali','Nyungwe Forest','Lake Kivu'],'South Africa':['Cape Town','Kruger National Park','Johannesburg','Garden Route','Durban'],'Morocco':['Marrakech','Sahara Desert','Fes','Casablanca','Chefchaouen'],'Egypt':['Cairo','Luxor','Aswan','Sharm El Sheikh','Giza'],'Namibia':['Sossusvlei','Etosha','Swakopmund','Windhoek'],'Botswana':['Okavango Delta','Chobe National Park','Maun'],'Zambia':['Victoria Falls','South Luangwa','Lusaka'],'Zimbabwe':['Victoria Falls','Hwange','Harare'],'Seychelles':['Mahe','Praslin','La Digue'],'Mauritius':['Grand Baie','Le Morne','Port Louis']}
dest_imgs=['1516426122078-c23e76319801','1528277342758-f1d7613953a2','1507525428034-b723cf961d3e','1502086223501-7ea6ecd79368','1527631746610-bca00a040d60','1544735716-392fe2489ffa']
for co in country_objs:
    names=popular.get(co.name,[f'{co.name} Capital Experience',f'{co.name} Cultural Quarter',f'{co.name} Nature Reserve'])
    for j,n in enumerate(names):
        db.add(Destination(country_id=co.id,name=n,slug=slug(n),image_url=img(dest_imgs[(j+co.id)%len(dest_imgs)]),summary=f'Discover {n}, one of {co.name} memorable travel destinations.'))
db.commit()
cat_objs=[]
for n,s,i in [('Safaris','safaris','lion'),('Beach Holidays','beach-holidays','beach'),('Cultural Tours','cultural-tours','culture'),('City Tours','city-tours','city'),('Food Experiences','food-experiences','food'),('Adventure Trips','adventure-trips','mountain'),('Gorilla Trekking','gorilla-trekking','gorilla'),('Luxury Travel','luxury-travel','luxury'),('Honeymoon Packages','honeymoon-packages','honeymoon'),('Wildlife Experiences','wildlife-experiences','wildlife')]:
    c=Category(name=n,slug=s,icon=i); db.add(c); cat_objs.append(c)
db.commit()
operator_specs=[('Savannah Trails Africa','Kenya','Nairobi'),('Kilimanjaro Horizon Tours','Tanzania','Arusha'),('Gorilla Pearl Expeditions','Uganda','Kampala'),('Rwanda Luxe Journeys','Rwanda','Kigali'),('Cape & Kruger Escapes','South Africa','Cape Town'),('Atlas Desert Adventures','Morocco','Marrakech'),('Nile Heritage Travel','Egypt','Cairo'),('Zambezi Wild Safaris','Zambia','Livingstone'),('Island Blue Holidays','Seychelles','Mahe'),('Namib Dune Expeditions','Namibia','Windhoek')]
operators=[]
for idx,(name,country,city) in enumerate(operator_specs):
    u=User(full_name=name+' Manager',email=('operator@destinationafrica.com' if idx==0 else f'op{idx}@destinationafrica.com'),phone='+2547110000'+str(idx),country=country,role='operator',hashed_password=hash_password('Operator123!'))
    db.add(u); db.commit()
    op=Operator(user_id=u.id,company_name=name,contact_person=u.full_name,city=city,country=country,business_registration_number=f'BRN-{idx+1000}',license_number=f'TOUR-{idx+2000}',website=f'https://{slug(name)}.example.com',description=f'{name} creates verified, memorable African travel experiences for global travelers.',logo_url='/brand/operator-logo.svg',verified=True,status='approved',subscription_plan=random.choice(['Professional','Enterprise']),rating=round(random.uniform(4.5,4.95),2))
    db.add(op); operators.append(op)
db.commit()
titles=['Classic Safari Adventure','Luxury Honeymoon Escape','Cultural Discovery Tour','Beach & Island Getaway','Wildlife Photography Safari','Mountain Hiking Expedition','Food and City Experience','Family Friendly Holiday','Premium Fly-In Safari','Hidden Gems Experience']
tour_imgs=['1516426122078-c23e76319801','1547471080-7cc2caa01a7e','1500530855697-b586d89ba3ee','1507525428034-b723cf961d3e','1523805009345-7448845a9e53','1528277342758-f1d7613953a2']
tours=[]
for i in range(100):
    op=operators[i%len(operators)]; co=db.query(Country).filter(Country.name==op.country).first(); ds=db.query(Destination).filter(Destination.country_id==co.id).all(); d=random.choice(ds); cat=cat_objs[i%len(cat_objs)]
    title=f'{d.name} {titles[i%len(titles)]}'
    t=Tour(operator_id=op.id,country_id=co.id,destination_id=d.id,category_id=cat.id,title=title,slug=slug(title)+'-'+str(i+1),description=f'Experience {d.name} with a verified operator. This package includes curated activities, local insight, comfortable logistics, and premium support from booking to return.',price=random.choice([120,250,450,650,950,1400,2200]),duration_days=random.randint(1,10),group_size=random.choice([2,4,6,8,12]),rating=round(random.uniform(4.4,5.0),1),review_count=random.randint(8,120),image_url=img(tour_imgs[i%len(tour_imgs)]),itinerary=[f'Day {x}: curated activities in and around {d.name}' for x in range(1,random.randint(3,7))],inclusions=['Professional guide','Transport','Selected meals','Park or activity support'],exclusions=['International flights','Visa fees','Personal expenses'],availability=['2026-06-15','2026-07-20','2026-08-12','2026-09-05'],travel_style=random.choice(['Adventure','Luxury','Family','Culture','Romantic']),featured=i<18)
    db.add(t); tours.append(t)
db.commit()
for i,t in enumerate(tours[:60]): db.add(Review(user_id=travelers[i%len(travelers)].id,tour_id=t.id,operator_id=t.operator_id,rating=random.randint(4,5),comment='Amazing experience. The operator was responsive, professional, and the itinerary felt authentic.'))
for i in range(25):
    u=travelers[i%len(travelers)]; t=tours[i]; guests=random.randint(1,4)
    b=Booking(user_id=u.id,tour_id=t.id,operator_id=t.operator_id,travel_date=random.choice(t.availability),guests=guests,total_amount=t.price*guests,status=random.choice(['confirmed','completed','pending']))
    db.add(b); db.commit(); amount=b.total_amount; comm=round(amount*.12,2)
    db.add(Payment(booking_id=b.id,provider=random.choice(['Stripe','PayPal','Flutterwave','M-Pesa']),amount=amount,admin_commission=comm,operator_earning=amount-comm,reference=f'DA-{b.id:06d}'))
    db.add(Notification(user_id=u.id,title='Booking update',body=f'Your {t.title} booking is {b.status}.'))
for i in range(20):
    u=travelers[i%len(travelers)]; t=tours[i]
    db.add(Wishlist(user_id=u.id,tour_id=t.id)); db.add(Message(sender_id=u.id,receiver_id=t.operator.user_id,tour_id=t.id,body=f'Hi, is {t.title} available for my preferred dates?')); db.add(Message(sender_id=t.operator.user_id,receiver_id=u.id,tour_id=t.id,body='Yes, we have availability and can customize the itinerary for you.'))
for i in range(50):
    t=tours[i]
    db.add(Guide(title=f'Guide to {t.destination.name} for {t.category.name}',slug=f'guide-{slug(t.destination.name)}-{i}',country_id=t.country_id,destination_id=t.destination_id,category_id=t.category_id,summary=f'Everything you need to know before visiting {t.destination.name}.',content=f'{t.destination.name} is one of Africa standout experiences. This guide covers best times to visit, budgeting, safety, culture, packing tips, and recommended experiences.',image_url=t.image_url,seo_title=f'{t.destination.name} Travel Guide',seo_description=f'Plan your trip to {t.destination.name} with Destination Africa.'))
for op in operators: db.add(Withdrawal(operator_id=op.id,amount=random.choice([500,1200,2500]),status=random.choice(['pending','paid','processing'])))
for u in travelers[:3]: db.add(SupportTicket(user_id=u.id,subject='Booking question',message='I need help changing my travel date.',status='open'))
db.commit(); db.close(); print('Seeded Destination Africa demo database successfully.')
