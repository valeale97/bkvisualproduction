/*
  Central content registry for portfolio categories + projects.
  Replace media paths with your real files.
  - Images: /assets/img/...
  - Videos (recommended): Vimeo links or IDs
      - "vimeo:123456789" (preferred)
      - https://vimeo.com/123456789
      - https://player.vimeo.com/video/123456789
    (Local MP4 still works too: /assets/video/....mp4)

  Media item schema:
    { type: 'image'|'video', src: '...', thumb?: '...', alt?: '...' }

  Notes for Vimeo videos:
  - Set src to "vimeo:ID" (best), and keep a local thumbnail image in /assets/img.
  - Example:
      { type:'video', src:'vimeo:123456789', thumb:'/assets/img/my-thumb.jpg', alt:'Highlight film' }
*/
document.addEventListener("DOMContentLoaded", function () {

  document.querySelectorAll(".typing").forEach(element => {

    const words = element.textContent.split(",").map(w => w.trim());

    // Clear the text immediately
    element.textContent = "";

    // Make it visible when typing starts
    element.classList.add("active");

    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const typingSpeed = 70;
    const deletingSpeed = 40;
    const delayBetweenWords = 1200;

    function typeEffect() {
      const currentWord = words[wordIndex];

      if (!isDeleting) {
        element.textContent = currentWord.substring(0, charIndex + 1);
        charIndex++;

        if (charIndex === currentWord.length) {
          setTimeout(() => isDeleting = true, delayBetweenWords);
        }
      } else {
        element.textContent = currentWord.substring(0, charIndex - 1);
        charIndex--;

        if (charIndex === 0) {
          isDeleting = false;
          wordIndex = (wordIndex + 1) % words.length;
        }
      }

      setTimeout(typeEffect, isDeleting ? deletingSpeed : typingSpeed);
    }

    typeEffect();

  });

});


window.BKVP_DATA = {
  // Site-wide content (used on Home)
  //   heroVideo: { en: 'vimeo:123456789', hr: 'vimeo:123456789' }
  //   heroVideo: { en: '/assets/video/hero.mp4', hr: '/assets/video/hero.mp4' }
  site: {
    brand: 'BK Visual Production',
    domain: 'https://www.bk-visualproduction.com',
    assets: {
      logo: '/assets/img/logo.png',
      socialImage: '/assets/img/logo.png'
    },
    seo: {
      home: {
        path: { en: '/en/', hr: '/hr/' },
        xDefault: '/hr/',
        title: {
          hr: 'BK Visual Production | Foto i video produkcija Zadar, Hrvatska i Europa',
          en: 'BK Visual Production | Cinematic Video & Photography in Zadar, Croatia and Europe'
        },
        description: {
          hr: 'BK Visual Production stvara moderne, kinematografske foto i video sadržaje za vjenčanja, sport, ugostiteljstvo, restorane i putovanja u Zadru, Hrvatskoj i diljem Europe.',
          en: 'BK Visual Production creates modern cinematic photo and video content for weddings, sport, hospitality, restaurants, travel, and brands in Zadar, Croatia, and across Europe.'
        }
      }
    },
    // heroVideo: {
    //   en: 'vimeo:1168610073',
    //   hr: 'vimeo:1168610073'
    heroVideo: { en: '/assets/video/100km_zadra_hero.mp4', hr: '/assets/video/100km_zadra_hero.mp4' },
    heroPoster: ''
  },
  portfolio: {
    
    weddings: {
      title: { en: 'Weddings', hr: 'Vjenčanja' },
      desc: { en: 'A cinematic wedding experience created for all couples who want to preserve their most special moments, capturing authentic emotions, natural colors, and heartfelt glances - from intimate moments to grand celebrations - through a carefully crafted, story-first edit that preserves the unique beauty and personality of your day for memories that last a lifetime.'
        , hr: 'Filmsko vjenčano iskustvo stvoreno za sve parove koji žele sačuvati svoje najposebnije trenutke, bilježeći autentične emocije, prirodne boje i iskrene poglede – od intimnih trenutaka do velikih slavlja – kroz pažljivo oblikovanu montažu koja stavlja priču na prvo mjesto i čuva jedinstvenu ljepotu i osobnost vašeg dana za uspomene koje traju cijeli život.' },
      items: [
        { type: 'video', src: 'vimeo:1168635857', thumb: '/assets/img/wedding_1.jpg', alt: 'Wedding video' },
        { type: 'video', src: 'vimeo:1168637699', thumb: '/assets/img/wedding_2.jpeg', alt: 'Wedding video' },
        { type: 'image', src: '/assets/img/wedding_3.jpg', alt: 'Wedding photo' },
        { type: 'image', src: '/assets/img/wedding_4.jpg', alt: 'Wedding photo' },
        { type: 'image', src: '/assets/img/wedding_5.jpg', alt: 'Wedding photo' },
        { type: 'image', src: '/assets/img/wedding_6.jpg', alt: 'Wedding photo' },
        { type: 'image', src: '/assets/img/wedding_7.jpg', alt: 'Wedding photo' },
        { type: 'image', src: '/assets/img/wedding_8.jpg', alt: 'Wedding photo' },
        { type: 'image', src: '/assets/img/wedding_9.jpg', alt: 'Wedding photo' },
        { type: 'image', src: '/assets/img/wedding_10.jpg', alt: 'Wedding photo' },
        { type: 'image', src: '/assets/img/wedding_11.jpg', alt: 'Wedding photo' },
        { type: 'image', src: '/assets/img/wedding_12.jpg', alt: 'Wedding photo' },
        { type: 'image', src: '/assets/img/wedding_13.jpg', alt: 'Wedding photo' },
        { type: 'image', src: '/assets/img/wedding_14.jpg', alt: 'Wedding photo' },
        
        
      ]
    },
    events: {
      title: { en: 'Events', hr: 'Događaji' },
      desc: { en: 'Dynamic audio coverage for sports, nightlife, and many other kinds of events, capturing every cheer, beat, and atmosphere with crystal-clear sound. From the intensity of the game to the pulse of the party, every moment is preserved with precision and clarity, making your event come alive for audiences everywhere.'
        , hr: 'Dinamično audio snimanje za sportske događaje, noćni život i razne druge vrste evenata, koje bilježi svaki navijački uzvik, ritam i atmosferu uz kristalno čist zvuk. Od napetosti igre do pulsa zabave, svaki je trenutak zabilježen s preciznošću i jasnoćom, čineći vaš događaj živim i doživljajnim za publiku gdje god se nalazila' },
      items: [
        { type: 'video', src: 'vimeo:1168609849', thumb: '/assets/img/100km_od_zadra_3.jpg', alt: 'Event video' },
        { type: 'video', src: 'vimeo:1168608886', thumb: '/assets/img/longines_pic.jpg', alt: 'Event video' },
        { type: 'video', src: 'vimeo:1172315537', thumb: '/assets/img/bebek_event.jpeg', alt: 'Event video' },
        { type: 'video', src: 'vimeo:1168610073', thumb: '/assets/img/podroom.jpeg', alt: 'Event video' },
        { type: 'video', src: 'vimeo:1168609381', thumb: '/assets/img/futsal.jpeg', alt: 'Event video' },
        { type: 'video', src: 'vimeo:1168609332', thumb: '/assets/img/moderna.jpg', alt: 'Event video' },
        { type: 'image', src: '/assets/img/podroom.jpg', alt: 'Event photo' },
        { type: 'image', src: '/assets/img/bebek.jpg', alt: 'Event photo' },
        
      ]
    },
    company: {
      title: { en: 'Company promo material', hr: 'Promo materijal za firme' },
      desc: { en: 'Dynamic promotional content for your brand, showcasing your products, services, and team with cinematic visuals, clean audio, and a story-driven approach. Every frame is crafted to highlight your company’s unique identity, values, and impact, leaving a memorable impression on clients and audiences alike.'
        , hr: 'Dinamičan promotivni sadržaj za vaš brend, koji prikazuje vaše proizvode, usluge i tim kroz kinematografske vizuale, čist zvuk i pristup vođen pričom. Svaki kadar pažljivo je oblikovan kako bi istaknuo jedinstveni identitet, vrijednosti i utjecaj vaše tvrtke, ostavljajući nezaboravan dojam na klijente i publiku.' },
      items: [
        { type: 'video', src: 'vimeo:1168608497', thumb: '/assets/img/mont_trade.jpeg', alt: 'Sport reel (placeholder)' },
        
      ]
    },
    
    restaurants: {
      title: { en: 'Restaurants', hr: 'Restorani' },
      desc: { en: 'Cinematic food and ambience reels crafted for social media and websites, capturing the textures, flavors, and atmosphere of every dish and space. Each story-driven edit highlights your culinary offerings, the unique character of your venue, and the experience your guests will remember.'
        , hr: 'Filmski reelsi hrane i ambijenta osmišljeni za društvene mreže i web stranice, koji bilježe teksture, okuse i atmosferu svakog jela i prostora. Svaka montaža vođena pričom ističe vaše kulinarske specijalitete, jedinstveni karakter vašeg prostora i iskustvo koje će vaši gosti pamtiti.' },
      items: [
        { type: 'video', src: 'vimeo:1168609024' , thumb: '/assets/img/sfinga_2.jpeg', alt: 'Restaurant video' },
        { type: 'video', src: 'vimeo:1168608338' , thumb: '/assets/img/han.jpeg', alt: 'Restaurant video' },
        { type: 'video', src: 'vimeo:1168609164' , thumb: '/assets/img/han_1.jpeg', alt: 'Restaurant video' },
        { type: 'video', src: 'vimeo:1168627826' , thumb: '/assets/img/sfinga.jpeg', alt: 'Restaurant video' },
        { type: 'image', src: '/assets/img/food_2.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_3.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_4.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_5.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_6.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_7.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_8.jpg', alt: 'Restaurant photo' },
      ]
    },
    travel: {
      title: { en: 'Travel agency', hr: 'Putne agencije' },
      desc: { en: 'Short travel stories and cinematic montages for websites, social media, and reels, capturing breathtaking destinations, local experiences, and the spirit of every journey. Each edit brings your travel offerings to life, inspiring wanderlust and showcasing the unique adventures your clients can discover.'
        , hr: 'Kratke putničke priče i vizualno dojmljive montaže za web stranice, društvene mreže i reels, koje bilježe zadivljujuće destinacije, lokalna iskustva i duh svakog putovanja. Svaka montaža oživljava vaše putničke ponude, potiče želju za istraživanjem i ističe jedinstvene avanture koje vaši klijenti mogu doživjeti.' },
      items: [
        { type: 'video', src: 'vimeo:1168608584' , thumb: '/assets/img/toto.jpeg', alt: 'Travel video' },
        { type: 'image', src: '/assets/img/travel_1.jpg', alt: 'Travel photo' },
        { type: 'image', src: '/assets/img/travel_2.jpg', alt: 'Travel photo' },
        { type: 'image', src: '/assets/img/travel_3.jpg', alt: 'Travel photo' },
        { type: 'image', src: '/assets/img/travel_4.jpg', alt: 'Travel photo' },
        
      ]
    },
    accommodation: {
      title: { en: 'Accommodation', hr: 'Smještaj' },
      desc: { en: 'Showcase of rooms, dining spaces, amenities, and guest experiences, highlighting the comfort, atmosphere, and unique character of your property, as well as the surrounding city vibe, local events, and nearby attractions that make each stay memorable.', 
        hr: 'Predstavljanje soba, restorana, sadržaja i iskustava gostiju, ističući udobnost, atmosferu i jedinstveni karakter vašeg objekta, kao i energiju okolnog grada, lokalne događaje i atrakcije u blizini koje svaki boravak čine nezaboravnim.' },
      items: [
        { type: 'video', src: 'vimeo:1168608726', thumb: '/assets/img/villa.jpg', alt: 'Accommodation video' },
        { type: 'video', src: 'vimeo:1172317554', thumb: '/assets/img/han.jpg', alt: 'Accommodation video' },
        { type: 'image', src: '/assets/img/villa_2.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_3.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_4.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_5.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_6.jpg', alt: 'Accommodation photo' },
        
      ]
    }
  },
  projects: {
    'longines': {
      title: {
        en: 'Longines Global Champions Tour - Show Jumping',
        hr: 'Longines Global Champions Tour - preponsko jahanje'
      },

      heroVideo: 'vimeo:1168608886',
      heroPoster: '/assets/img/longiness_pic.jpg',

      videos: [
        { src: 'vimeo:1168608886', thumb: '/assets/img/longines_pic_10.jpg', alt: 'Highlight video' },
        { src: 'vimeo:1173561327', thumb: '/assets/img/longines_pic_6.jpg', alt: 'Highlight video' },
        { src: 'vimeo:1173561492', thumb: '/assets/img/longines_pic_7.jpg', alt: 'Highlight video' },
        { src: 'vimeo:1173561525', thumb: '/assets/img/longines_pic_8.jpg', alt: 'Highlight video' },
        { src: 'vimeo:1173561601', thumb: '/assets/img/longines_pic_9.jpg', alt: 'Highlight video' },
      ],

      price: '',
      short: { en: '', hr: '' },
      description: { en: '', hr: '' },

      gallery: [
        { type: 'image', src: '/assets/img/longines_pic.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/longines_pic_2.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/longines_pic_3.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/longines_pic_4.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/longines_pic_5.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/longines_pic_11.jpg', alt: 'Highlight photo'},
        { type: 'image', src: '/assets/img/longines_pic_12.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/longines_pic_13.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/longines_pic_14.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/longines_pic_15.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/longines_pic_16.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/longines_pic_17.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/longines_pic_18.jpg', alt: 'Highlight photo' },
      ]
    },
    'car-event': {
      title: { en: '100 kilometers of Zadar', hr: '100 kilometara Zadra' },
      heroVideo: 'vimeo:1168609849',
      heroPoster: '/assets/img/100km_od_zadra_3.jpg',

      videos: [
        { src: 'vimeo:1168609849', thumb: '/assets/img/100km_od_zadra_3.jpg', alt: 'Highlight video' },
      ],

      price: '',
      short: {
        en: '',
        hr: ''
      },
      description: {
        en: '',
        hr: ''
      },
      gallery: [
        { type: 'image', src: '/assets/img/100km_od_zadra.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/100km_od_zadra_2.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/100km_od_zadra_4.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/100km_od_zadra_5.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/100km_od_zadra_6.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/100km_od_zadra_7.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/100km_od_zadra_8.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/100km_od_zadra_9.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/100km_od_zadra_10.jpg', alt: 'Highlight photo' },
        { type: 'image', src: '/assets/img/100km_od_zadra_11.jpg', alt: 'Highlight photo' },
      ]
    },

    'toto-travel': {
        title: { en: 'Toto Travel', hr: 'Toto Travel' },
        heroVideo: 'vimeo:1168608584',
        heroPoster: '/assets/img/toto.jpeg',

        videos: [
          { src: 'vimeo:1168608584', thumb: '/assets/img/toto.jpeg', alt: 'Highlight video' },
        ],

        price: '',
        short: {
          en: '',
          hr: ''
        },
        description: {
          en: '',
          hr: ''
        },
        gallery: [
          { type: 'image', src: '/assets/img/travel_1.jpg', alt: 'Highlight photo' },
          { type: 'image', src: '/assets/img/travel_2.jpg', alt: 'Highlight photo' },
          { type: 'image', src: '/assets/img/travel_3.jpg', alt: 'Highlight photo' },
          { type: 'image', src: '/assets/img/travel_4.jpg', alt: 'Highlight photo' },
        ]
          
      },
  }
};


(function () {
  'use strict';

  const store = window.BKVP_DATA = window.BKVP_DATA || {};
  const site = store.site = store.site || {};
  const portfolio = store.portfolio = store.portfolio || {};
  const projects = store.projects = store.projects || {};

  site.brand = 'BK Visual Production';
  site.domain = 'https://www.bk-visualproduction.com';

  if (portfolio.accommodation) {
    portfolio.accommodation.key = 'accommodation';
    portfolio.accommodation.cover = '/assets/img/villa.jpg';
    portfolio.accommodation.path = { en: '/en/portfolio/accommodation/', hr: '/hr/galerija/smjestaj/' };
  }
  if (portfolio.restaurants) {
    portfolio.restaurants.key = 'restaurants';
    portfolio.restaurants.cover = '/assets/img/food.jpg';
    portfolio.restaurants.path = { en: '/en/portfolio/restaurants/', hr: '/hr/galerija/restorani/' };
  }
  if (portfolio.travel) {
    portfolio.travel.key = 'travel';
    portfolio.travel.cover = '/assets/img/toto.jpeg';
    portfolio.travel.path = { en: '/en/portfolio/travel-agency/', hr: '/hr/galerija/putne-agencije/' };
  }
  if (portfolio.events) {
    portfolio.events.key = 'events';
    portfolio.events.cover = '/assets/img/100km_od_zadra.jpg';
    portfolio.events.path = { en: '/en/portfolio/events/', hr: '/hr/galerija/dogadaji/' };
  }
  if (portfolio.weddings) {
    portfolio.weddings.key = 'weddings';
    portfolio.weddings.cover = '/assets/img/wedding_6.jpg';
    portfolio.weddings.path = { en: '/en/portfolio/weddings/', hr: '/hr/galerija/vjencanja/' };
  }
  if (portfolio.company) {
    portfolio.company.key = 'company';
    portfolio.company.homeTitle = { en: 'Company promo', hr: 'Promo za firme' };
    portfolio.company.cover = '/assets/img/mont_trade.jpeg';
    portfolio.company.path = { en: '/en/portfolio/company-promo-material/', hr: '/hr/galerija/promo-materijal-za-firme/' };
  }

  if (projects.longines) {
    projects.longines.key = 'longines';
    projects.longines.cover = '/assets/img/longines_pic.jpg';
    projects.longines.path = { en: '/en/projects/longines/', hr: '/hr/projekti/longines/' };
    projects.longines.location = { en: 'European Union', hr: 'Europska unija' };
    projects.longines.homeDescription = {
      en: 'Photo and video coverage of a professional show jumping competition. The material captures key action moments, the movement of horse and rider, and the atmosphere inside the arena. Coverage follows the course throughout the event, recording jumps, speed, precision, and visual details of the competition environment, resulting in sharp action imagery and dynamic sports footage suitable for media and promotional use.',      hr: 'Foto i video pokrivanje profesionalnog natjecanja u preponskom jahanju. Materijal dokumentira ključne akcijske trenutke, kretanje konja i jahača te atmosferu unutar arene. Pokrivanje prati tijek natjecanja kroz cijeli parkur, bilježeći skokove, brzinu, preciznost i vizualne detalje natjecateljskog okruženja, što rezultira oštrim akcijskim fotografijama i dinamičnim sportskim video sadržajem prikladnim za medijsku i promotivnu upotrebu.',
      hr: 'Foto i video pokrivanje profesionalnog natjecanja u preponskom jahanju. Materijal bilježi ključne akcijske trenutke, kretanje konja i jahača te atmosferu unutar arene. Pokrivanje prati tijek natjecanja kroz parkur, bilježeći skokove, brzinu, preciznost i vizualne detalje okruženja, što rezultira oštrim akcijskim fotografijama i dinamičnim sportskim video sadržajem za medijsku i promotivnu upotrebu.'
    };
  }

  if (projects['car-event']) {
    projects['car-event'].key = 'car-event';
    projects['car-event'].title = { en: '100 kilometers of Zadar', hr: '100 kilometara Zadra' };
    projects['car-event'].cover = '/assets/img/100km_od_zadra_3.jpg';
    projects['car-event'].path = { en: '/en/projects/100-km-of-zadar/', hr: '/hr/projekti/100-km-zadra/' };
    projects['car-event'].location = { en: 'Zadar area, Croatia', hr: 'Zadar, Hrvatska' };
    projects['car-event'].homeDescription = {
      en: 'Photo and video coverage of the “100 kilometara Zadra” international oldtimer rally held in the Zadar area, Croatia. The event gathers classic and historic vehicles from various countries along a scenic regional route. Coverage captures vintage automobile details, driving sequences, participant interaction, and the atmosphere of the rally, presenting the heritage, craftsmanship, and elegance of classic automotive culture for media and promotional use.',
      hr: 'Foto i video pokrivanje međunarodnog oldtimer relija „100 kilometara Zadra“ održanog na području Zadra, Hrvatska. Događaj okuplja klasična i povijesna vozila iz različitih zemalja te prati slikovitu rutu kroz regiju. Pokrivanje bilježi detalje starodobnih automobila, vožnju, interakciju sudionika i atmosferu relija, prikazujući nasljeđe, izradu i eleganciju klasične automobilske kulture za medijsku i promotivnu upotrebu.' 
    };
  }

  if (projects['toto-travel']) {
    projects['toto-travel'].key = 'toto-travel';
    projects['toto-travel'].title = { en: 'Toto Travel', hr: 'Toto Travel' };
    projects['toto-travel'].cover = '/assets/img/toto.jpeg';
    projects['toto-travel'].path = { en: '/en/projects/toto-travel/', hr: '/hr/projekti/toto-travel/' };
    projects['toto-travel'].location = { en: 'Split-Dalmatia County, Croatia', hr: 'Splitsko dalmatinska županija, Hrvatska' };
    projects['toto-travel'].homeDescription = {
      en: 'Photo and video coverage for Toto Travel, a touristic agency in Split-Dalmatia County, Croatia, specializing in Adriatic boat tours. The material presents guided visits to scenic islands, coastal towns, and natural attractions, capturing the beauty of the Dalmatian coast, guest experiences, and the relaxed atmosphere of exploring the region by sea. Suitable for tourism, media, and promotional use.',
      hr: 'Foto i video pokrivanje za Toto Travel, turističku agenciju u Splitsko-dalmatinskoj županiji specijaliziranu za izlete brodom po Jadranu. Materijal prikazuje vođene posjete slikovitim otocima, obalnim gradovima i prirodnim atrakcijama, bilježeći ljepotu dalmatinske obale, iskustva gostiju i opuštenu atmosferu istraživanja regije morskim putem. Prikladno za turističku, medijsku i promotivnu upotrebu.'    };
  }


  site.assets = {
    socialImage: '/assets/img/logo.jpg',
    logo: '/assets/img/logo.svg'
  };

  site.seo = {
    home: {
      title: { en: 'BK Visual Production', hr: 'BK Visual Production' },
      description: {
        en: "Cinematic photography and video production in Croatia for weddings, tourism, restaurants, sport, and brands. BK Visual Production creates modern storytelling visuals, drone footage, and promotional content.",
        hr: "BK Visual Production stvara foto i video sadržaje za vjenčanja, turizam, restorane, sport i brendove. Specijalizirani smo za storytelling vizuale, promotivne materijale i snimke dronom."
      },
      ogTitle: { en: 'BK Visual Production | Videography & Photography', hr: 'BK Visual Production' },
      ogDescription: {
        en: 'Video and photography for brands and unforgettable moments.',
        hr: 'Video i fotografija za brendove i posebne trenutke.'
      },
      path: { en: '/en/', hr: '/hr/' },
      xDefault: '/'
    },
    legal: {
      privacy: {
        title: { en: 'Privacy Policy | BK Visual Production', hr: 'Politika privatnosti | BK Visual Production' },
        description: { en: 'Privacy policy for BK Visual Production.', hr: 'Politika privatnosti za BK Visual Production.' },
        path: { en: '/en/privacy.html', hr: '/hr/privacy.html' },
        xDefault: '/en/privacy.html'
      },
      cookies: {
        title: { en: 'Cookie Policy | BK Visual Production', hr: 'Politika kolačića | BK Visual Production' },
        description: { en: 'Cookie policy for BK Visual Production.', hr: 'Politika kolačića za BK Visual Production.' },
        path: { en: '/en/cookies.html', hr: '/hr/cookies.html' },
        xDefault: '/en/cookies.html'
      },
      success: {
        title: { en: 'Message sent | BK Visual Production', hr: 'Poruka poslana | BK Visual Production' },
        description: { en: 'Your message has been sent successfully.', hr: 'Vaša poruka je uspješno poslana.' },
        path: { en: '/en/success/', hr: '/hr/uspjeh/' },
        xDefault: '/en/success/'
      }
    }
  };

  site.home = {
    portfolioOrder: ['accommodation', 'restaurants', 'travel', 'events', 'weddings', 'company'],
    projectOrder: ['longines', 'car-event', 'toto-travel'],
    ui: {
      en: {
        portfolioAria: 'Open',
        portfolioOverlay: 'Open',
        projectAria: 'Open',
        projectOverlay: 'Open'
      },
      hr: {
        portfolioAria: 'Otvori',
        portfolioOverlay: 'Otvori ',
        projectAria: 'Otvori',
        projectOverlay: 'Otvori'
      }
    }
  };

  function esc(value) {
    return String(value || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getLang() {
    const htmlLang = (document.documentElement.getAttribute('lang') || '').toLowerCase();
    if (htmlLang.startsWith('hr')) return 'hr';
    if (htmlLang.startsWith('en')) return 'en';
    return location.pathname.startsWith('/hr/') ? 'hr' : 'en';
  }

  function pickLocalized(value, lang, fallback = '') {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      return value[lang] || value.en || value.hr || fallback;
    }
    return value || fallback;
  }

  function formatCategoryName(key, lang) {
    const labels = {
      accommodation: {
        en: 'Accommodation',
        hr: 'Smještaj'
      },
      restaurants: {
        en: 'Restaurants',
        hr: 'Restorani'
      },
      travel: {
        en: 'Travel agency',
        hr: 'Turističke agencije'
      },
      events: {
        en: 'Events',
        hr: 'Događaji'
      },
      weddings: {
        en: 'Weddings',
        hr: 'Vjenčanja'
      },
      company: {
        en: 'Company promo',
        hr: 'Promo'
      }
    };

    return labels[key]?.[lang] || labels[key]?.en || key.replace(/_/g, ' ');
  }

  function renderHomePortfolio(lang) {
    const mount = document.getElementById('js-home-portfolio');
    if (!mount || !site.home) return;

    const ui = site.home.ui[lang] || site.home.ui.en;

    mount.innerHTML = site.home.portfolioOrder.map((key) => {
      const item = portfolio[key];
      if (!item) return '';

      const href = pickLocalized(item.path, lang, '#');
      const img =
        item.cover ||
        (item.items && item.items[0] && (item.items[0].thumb || item.items[0].src)) ||
        '/assets/img/logo.jpg';

      return `
        <a class="tile" href="${esc(href)}" aria-label="${esc(ui.portfolioAria)}">
          <img src="${esc(img)}" alt="${esc(formatCategoryName(key, lang))}" loading="lazy" />

          <span class="tile__label">
            ${esc(formatCategoryName(key, lang))}
          </span>

          <span class="tile__overlay">
            ${esc(ui.portfolioOverlay)}
          </span>
        </a>
      `;
    }).join('');
  }

  function renderHomeProjects(lang) {
    const mount = document.getElementById('js-home-projects');
    if (!mount || !site.home) return;

    const ui = site.home.ui[lang] || site.home.ui.en;
    mount.innerHTML = site.home.projectOrder.map((key, index) => {
      const item = projects[key];
      if (!item) return '';
      const title = pickLocalized(item.title, lang);
      const href = pickLocalized(item.path, lang, '#');
      const img = item.cover || item.heroPoster || '/assets/img/logo.jpg';
      const locationText = pickLocalized(item.location, lang);
      const description = pickLocalized(item.homeDescription || item.description, lang);
      const reverseClass = index % 2 === 1 ? ' latest__row--reverse' : '';
      return `
        <article class="latest__row${reverseClass}">
          <div class="latest__media">
            <a class="frameLink" href="${esc(href)}" aria-label="${esc(ui.projectAria + title)}">
              <img src="${esc(img)}" alt="${esc(title)}" loading="lazy" />
              <span class="frameLink__overlay">${esc(ui.projectOverlay)}</span>
            </a>
          </div>
          <div class="latest__text">
            <h3><a class="textLink" href="${esc(href)}">${esc(title)}</a></h3>
            <p class="latest__loc"><svg class="pin-icon pin-icon--maps" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 22s7-5 7-12a7 7 0 1 0-14 0c0 7 7 12 7 12z"/><path d="M12 13.2a3.2 3.2 0 1 0 0-6.4 3.2 3.2 0 0 0 0 6.4z" fill="currentColor"/></svg><span>${esc(locationText)}</span></p>
            <p class="latest__descript">${esc(description)}</p>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderHomeSections() {
    if (!document.body || !document.body.classList.contains('home')) return;
    const lang = getLang();
    renderHomePortfolio(lang);
    renderHomeProjects(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', renderHomeSections);
  } else {
    renderHomeSections();
  }
})();
