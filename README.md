# SportLink
SportLink je platforma namjenjena rekreativnim sportašima svih uzrasta za otkrivanje sportskih klubova, prijavu na natjecanja i rezervacije termina.  

# Url na aplikaciju

https://webapp-sportlink-prod.azurewebsites.net/  
Za lokalno pokretanje frontenda upute se nalaze u: src/frontend/SportLink-web.  
Za lokalno pokretanje backenda upute se nalaze u: src/backend/SportLink.Backend.  

# Opis projekta

Sport i rekreacija jedne su od temeljnih potreba svakog čovjeka te doprinose općem zdravlju i smanjenju stresa. U današnjem užurbanom načinu života, sve je važnije imati jednostavan pristup sportskim aktivnostima kako bi se korisnicima olakšalo redovito bavljenje tjelesnom aktivnošću. Iako postoji velik broj dostupnih sportskih i rekreativnih opcija, korisnici često ostaju zbunjeni ili preopterećeni izborom, što može smanjiti njihovu motivaciju. Također, neke organizacije ostaju izgubljene među morem ostalih izbora te tako ostanu nepoznate javnosti. Zbog toga je nužno razviti aplikaciju koja će objediniti različite sportske aktivnosti na jednom mjestu, korisnicima olakšati pronalazak odgovora za vlastite interese, a organizacijama olakšati oglašavanje.

# Funkcionalni zahtjevi

1. Sustav omogućuje korisnicima kreiranje računa pomoću e-adrese
> * Korisnik se može registrirati e-poštom, primiti e-poruku s kodom za potvrdu i uspješno se prijaviti
2. Sustav omogućuje korištenje aplikacije različitim vrstama   korisnika
> * Aplikaciju mogu koristiti sportske organizacije, zainteresirani pojedinci (profil korisnika) i administratori uz registraciju
3. Sustav administratorima omogućuje moderiranje sadržaja i   upravljanje platformom
> * Administratori mogu potvrditi sportsku organizaciju ili ju   zabraniti, mogu vidjeti sve korisnike
4. Sustav sportskim organizacijama omogućuje oglašavanje sadržaja
> * Sportske organizacije mogu oglašavati informacije o natjecanjima,   grupama za trening i terminima
5. Sustav korisnicima omogućuje pregledavanje dostupnih sportskih   aktivnosti
> * Korisnici mogu pregledavati dostupne sportske aktivnosti unutar 3   kategorije (grupe za trening, termini, i natjecanja)
6. Sustav omogućuje pretraživanje sportskih aktivnosti po različitim   značajkama (sport, lokacija, datum …)
> * Sportske aktivnosti mogu se pretraživati po kategorijama:   sport, lokacija, dob, cijena, datum
7. Sustav korisnicima omogućuje dodavanje vlastitih sportskih   organizacija
> * Korisnik može registrirati svoj sportski klub koji administrator   aplikacije mora potvrditi
8. Sustav omogućuje ostavljanje recenzija o sportskim   organizacijama
> * Korisnik može ostavljati recenzije o sportskim   organizacijama
9. Sustav omogućuje pregledavanje recenzija za određenu sportsku organizaciju
>  * Korisnik može pregledavati recenzije za sportske organizacije
10. Sustav vlasniku organizacije omogućuje odgovaranje na recenzije
> * Korisnik koji je vlasnik organizacije može odgovarati na recenzije
11. Sustav korisniku omogućuje prijavu na određenu sportsku   aktivnost
> * Korisnik može rezervirati ili se prijaviti na određenu   sportsku aktivnost

# Nefunkcionalni zahtjevi

ID ZAHTJEVA| OPIS | PRIORITET
-- | -- | -- 
NF-1. | Sustav preko _Google_ prijave mora omogućiti autentifikaciju do 10 000 novih korisnika dnevno. | VISOK
NF-1.1. | Sustav se mora povećati u skladu s promjenjivim brojem korisnika. | VISOK
NF-2. | Sustav mora osigurati da su podaci o korisniku zaštićeni u mirovanju i prijenosu. | VISOK
NF-2.1. | Sustav mora sakrivati podatke od ostalih korisnika i zlonamjernih napadača. | VISOK
NF-2.1.1. | Sustav jedino prikazuje ime i prezime korisnika pri ostavljanju recenzije. | SREDNJE
NF-3. | Podržani jezik korisničkog sučelja jest hrvatski. | VISOK
NF-4. | Sustav treba biti oblikovan tako da omogućuje jednostavno održavanje. | VISOK
NF-4.1 | Sustav treba imati dovoljnu dokumentaciju. | VISOK
NF-5. | Aplikacija treba imati intuitivno i korisniku jasno sučelje. | VISOK
NF-5.1. | Korisničko iskustvo treba biti dosljedno na različitim preglednicima i uređajima. | VISOK
NF-5.2. | Aplikacija treba biti responzivna i funkcionalna na računalima i mobilnim uređajima. | VISOK 

# Tehnologije i Alati
> - Frontend: React.js, Vite, TypeScript, Mantine UI component library
> - Backend: .NET, Entity Framework
> - Dizajn: Figma, Pretine 7 (Mantine UI design base)
> - DB: PostgreSQL
> - QA / test: Selenium, Postman
> - DevOps: Azure, Docker

# Članovi tima
> Teo Ivančević teo.ivancevic@fer.unizg.hr - Voditelj  
> Barbara Cvitanović barbara.cvitanovic@fer.unizg.hr - Frontend developer  
> Lovro Cvitanović lovro.cvitanovic@fer.unizg.hr - Frontend developer  
> Roko Jakaša roko.jakasa@fer.unizg.hr - Backend developer  
> Rita Zonjić rita.zonjic@fer.unizg.hr - Backend developer  
> Fran Horvat fran.horvat@fer.unizg.hr - Dizajner + Ispitivanje  
> Vito Anić vito.anic@fer.unizg.hr - DevOps  

