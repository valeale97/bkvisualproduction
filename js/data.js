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
          hr: 'Sa sjedištem u Zadru, BK Visual Production stvara moderne, kinematografske foto i video sadržaje za vjenčanja, sport, ugostiteljstvo, restorane i putovanja po Hrvatskoj i diljem Europe.',
          en: 'Based in Zadar, Croatia - BK Visual Production creates modern cinematic photo and video content for weddings, sport, hospitality, restaurants, travel, and brands in Croatia, and across Europe.'
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
        { type: 'image', src: '/assets/img/wedding_12.jpg', alt: 'Wedding photo' },
        { type: 'image', src: '/assets/img/wedding_13.jpg', alt: 'Wedding photo' },
        { type: 'image', src: '/assets/img/wed_new1.JPG', alt: 'Wedding photo' },
        { type: 'image', src: '/assets/img/wed_new2.JPG', alt: 'Wedding photo',position: 'center 30%' },
        { type: 'image', src: '/assets/img/wed_new3.JPG', alt: 'Wedding photo',position: 'center 40%' },
        { type: 'image', src: '/assets/img/wed_new4.JPG', alt: 'Wedding photo',position: 'center 70%' },
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
        { type: 'image', src: '/assets/img/event1.JPG', alt: 'Event photo' },
        { type: 'image', src: '/assets/img/event2.JPG', alt: 'Event photo' },
        { type: 'image', src: '/assets/img/event3.JPG', alt: 'Event photo' },
        { type: 'image', src: '/assets/img/event4.JPG', alt: 'Event photo' },
        { type: 'image', src: '/assets/img/event5.JPG', alt: 'Event photo' },
        { type: 'image', src: '/assets/img/event6.JPG', alt: 'Event photo' },
        
      ]
    },
    company: {
      title: { en: 'Company promo material', hr: 'Promo materijal za firme' },
      desc: { en: 'Dynamic promotional content for your brand, showcasing your products, services, and team with cinematic visuals, clean audio, and a story-driven approach. Every frame is crafted to highlight your company’s unique identity, values, and impact, leaving a memorable impression on clients and audiences alike.'
        , hr: 'Dinamičan promotivni sadržaj za vaš brend, koji prikazuje vaše proizvode, usluge i tim kroz kinematografske vizuale, čist zvuk i pristup vođen pričom. Svaki kadar pažljivo je oblikovan kako bi istaknuo jedinstveni identitet, vrijednosti i utjecaj vaše tvrtke, ostavljajući nezaboravan dojam na klijente i publiku.' },
      items: [
        { type: 'video', src: 'vimeo:1168608497', thumb: '/assets/img/mont_trade.jpeg', alt: 'Company promo video' },
        { type: 'video', src: 'vimeo:1196658869', thumb: '/assets/img/transfer.jpg', alt: 'Company promo video' },
        { type: 'video', src: 'vimeo:1196658850', thumb: '/assets/img/karcher.jpg', alt: 'Company promo video' },
        
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
        { type: 'image', src: '/assets/img/food_9.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_10.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_11.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_12.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_13.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_14.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_15.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_16.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_17.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_18.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_19.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_20.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_21.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_22.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_23.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_24.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_25.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_26.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_27.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_28.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_29.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_30.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_31.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_32.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_33.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_34.jpg', alt: 'Restaurant photo' },
        { type: 'image', src: '/assets/img/food_35.jpg', alt: 'Restaurant photo', position: 'center 80%' },
        { type: 'image', src: '/assets/img/food_36.jpg', alt: 'Restaurant photo' },
      ]
    },
    travel: {
      title: { en: 'Travel agency', hr: 'Putne agencije' },
      desc: { en: 'Short travel stories and cinematic montages for websites, social media, and reels, capturing breathtaking destinations, local experiences, and the spirit of every journey. Each edit brings your travel offerings to life, inspiring wanderlust and showcasing the unique adventures your clients can discover.'
        , hr: 'Kratke putničke priče i vizualno dojmljive montaže za web stranice, društvene mreže i reels, koje bilježe zadivljujuće destinacije, lokalna iskustva i duh svakog putovanja. Svaka montaža oživljava vaše putničke ponude, potiče želju za istraživanjem i ističe jedinstvene avanture koje vaši klijenti mogu doživjeti.' },
      items: [
        { type: 'video', src: 'vimeo:1168608584' , thumb: '/assets/img/toto.jpeg', alt: 'Travel video' },
        { type: 'video', src: 'vimeo:1196658852' , thumb: '/assets/img/dalmaland.jpg', alt: 'Travel video' },
        { type: 'video', src: 'vimeo:1196658851' , thumb: '/assets/img/plitvice.jpg', alt: 'Travel video' },
        { type: 'video', src: 'vimeo:1196658848' , thumb: '/assets/img/krka.jpg', alt: 'Travel video' },
        
        
      ]
    },
    accommodation: {
      title: { en: 'Accommodation', hr: 'Smještaj' },
      desc: { en: 'Showcase of rooms, dining spaces, amenities, and guest experiences, highlighting the comfort, atmosphere, and unique character of your property, as well as the surrounding city vibe, local events, and nearby attractions that make each stay memorable.', 
        hr: 'Predstavljanje soba, restorana, sadržaja i iskustava gostiju, ističući udobnost, atmosferu i jedinstveni karakter vašeg objekta, kao i energiju okolnog grada, lokalne događaje i atrakcije u blizini koje svaki boravak čine nezaboravnim.' },
      items: [
        { type: 'video', src: 'vimeo:1168608726', thumb: '/assets/img/villa.jpg', alt: 'Accommodation video' },
        { type: 'video', src: 'vimeo:1181708473', thumb: '/assets/img/villaz6.jpg', alt: 'Accommodation video' },
        { type: 'video', src: 'vimeo:1172317554', thumb: '/assets/img/han.jpg', alt: 'Accommodation video' },
        { type: 'video', src: 'vimeo:1181708497', thumb: '/assets/img/hanfpv.jpg', alt: 'Accommodation video' },
        { type: 'image', src: '/assets/img/villa_2.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_3.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_4.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_5.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_6.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_7.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_8.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_9.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_11.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_12.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_13.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_15.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_16.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_17.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_18.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_19.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_20.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_21.jpg', alt: 'Accommodation photo' },
        { type: 'image', src: '/assets/img/villa_22.jpg', alt: 'Accommodation photo' },
        
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
    projects.longines.path = { en: '/en/highlights/longines/', hr: '/hr/istaknuto/longines/' };
    projects.longines.location = { en: 'European Union', hr: 'Europska unija' };
    projects.longines.homeDescription = {
      en: 'Photo and video coverage of a professional show jumping competition. The material captures key action moments, the movement of horse and rider, and the atmosphere inside the arena. Coverage follows the course throughout the event, recording jumps, speed, precision, and visual details of the competition environment, resulting in sharp action imagery and dynamic sports footage suitable for media and promotional use.',
      hr: 'Foto i video pokrivanje profesionalnog natjecanja u preponskom jahanju. Materijal dokumentira ključne akcijske trenutke, kretanje konja i jahača te atmosferu unutar arene. Pokrivanje prati tijek natjecanja kroz cijelu arenu, bilježeći skokove, brzinu, preciznost i vizualne detalje natjecateljskog okruženja, što rezultira oštrim akcijskim fotografijama i dinamičnim sportskim video sadržajem prikladnim za medijsku i promotivnu upotrebu.',
    };
  }

  if (projects['car-event']) {
    projects['car-event'].key = 'car-event';
    projects['car-event'].title = { en: '100 kilometers of Zadar', hr: '100 kilometara Zadra' };
    projects['car-event'].cover = '/assets/img/100km_od_zadra_3.jpg';
    projects['car-event'].path = { en: '/en/highlights/100-km-of-zadar/', hr: '/hr/istaknuto/100-km-zadra/' };
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
    projects['toto-travel'].path = { en: '/en/highlights/toto-travel/', hr: '/hr/istaknuto/toto-travel/' };
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
      }}
  };


  function makePlaceholderImage(label) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1200" role="img" aria-label="${label}">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#101826" />
          <stop offset="100%" stop-color="#241739" />
        </linearGradient>
        <radialGradient id="iris" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#d9f7ff" />
          <stop offset="38%" stop-color="#77d7ff" />
          <stop offset="64%" stop-color="#6b7cff" />
          <stop offset="100%" stop-color="#1b2033" />
        </radialGradient>
      </defs>
      <rect width="1200" height="1200" fill="url(#bg)" />
      <ellipse cx="600" cy="600" rx="430" ry="250" fill="#eef2fb" opacity="0.95" />
      <ellipse cx="600" cy="600" rx="250" ry="250" fill="url(#iris)" />
      <circle cx="600" cy="600" r="105" fill="#040507" />
      <circle cx="530" cy="530" r="48" fill="#ffffff" opacity="0.30" />
      <text x="600" y="1030" fill="#eef2fb" font-size="72" font-family="Arial, Helvetica, sans-serif" text-anchor="middle">${label}</text>
    </svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  if (!projects['eye-photography']) {
    projects['eye-photography'] = {
      key: 'eye-photography',
      title: { en: 'Eye Photography', hr: 'Fotografije oka' },
      path: { en: '/en/projects/eye-photography/', hr: '/hr/projekti/fotografije-oka/' },
      cover: '/assets/img/eye1.jpeg',
      heroPoster: '/assets/img/eye1.jpeg',
      description: {
        en: 'Capture the structure, color, and fine details of the iris in a clean studio setup. Explore the gallery, book a session, and open directions to the studio from your current location.',
        hr: 'Zabilježite strukturu, boju i sitne detalje šarenice u čistom studijskom setupu. Pregledajte galeriju, rezervirajte termin i otvorite rutu do studija sa svoje trenutne lokacije.'
      },
      address: { en: 'Varoška ul. 4, 23000 Zadar, Croatia', hr: 'Varoška ul. 4, 23000 Zadar, Hrvatska' },
      phone: { raw: '+385955984248', display: '+385 95 598 4248' },
      workingHours: {
        en: ['Mon–Fri: 9:00–13:00, 18:00–20:00', 'Saturday: 9:00–13:00', 'Sunday: Closed'],
        hr: ['Pon–Pet: 9:00–13:00, 18:00–20:00', 'Subota: 9:00–13:00', 'Nedjelja: Zatvoreno']
      },
      bookingUrl: '#booking-chooser',
      mapQuery: 'Varoška ul. 4, 23000 Zadar, Croatia',
      bookingChooser: {
        title: { en: 'Choose the number of people', hr: 'Odaberite broj osoba' },
        prompt: {
          en: 'Please select how many people are coming. Maximum is 5. If your group is bigger than 5, please call us to arrange the session.',
          hr: 'Molimo odaberite koliko osoba dolazi. Maksimalno je 5. Ako je grupa veća od 5 osoba, nazovite nas kako bismo dogovorili termin.'
        },
        readyMessage: {
          en: 'To continue, click Book now and follow the instructions. If the calendar moves you to the next working day, working hours are over or all appointments are full.',
          hr: 'Za nastavak kliknite na Rezerviraj termin i pratite upute. Ukoliko vas kalendar prebaci na idući radni dan, radno vrijeme je gotovo ili su svi termini popunjeni.'
        },
        peopleLabels: {
          en: { singular: 'person', plural: 'people' },
          hr: { singular: 'osobu', plural: 'osobe' }
        },
        buttons: {
          en: { book: 'Book now', proceed: 'Proceed' },
          hr: { book: 'Rezerviraj termin', proceed: 'Nastavi' }
        }
      },
      bookingAvailability: {
        closedRange: {
          start: '2026-05-01',
          end: '2026-05-05'
        },
        statusMessage: {
          open: {
            en: 'Studio is open to book.',
            hr: 'Studio je otvoren za rezervacije.'
          },
          closed: {
            en: 'Studio is not working from {start} to {end} Booking is temporarily disabled.',
            hr: 'Studio ne radi od {start} do {end} Rezervacije su privremeno onemogućene.'
          }
        }
      },
      calCom: {
        origin: 'https://app.cal.com',
        ui: { hideEventTypeDetails: false, layout: 'month_view' },
        events: {
          1: {
            namespace: 'single',
            link: 'eye-photography-zadar/single',
            config: { layout: 'month_view', useSlotsViewOnSmallScreen: true }
          },
          2: {
            namespace: 'duo',
            link: 'eye-photography-zadar/duo',
            config: { layout: 'month_view', useSlotsViewOnSmallScreen: true }
          },
          3: {
            namespace: 'trio',
            link: 'eye-photography-zadar/trio',
            config: { layout: 'month_view', useSlotsViewOnSmallScreen: true }
          },
          4: {
            namespace: 'group-of-4',
            link: 'eye-photography-zadar/group-of-4',
            config: { layout: 'month_view', useSlotsViewOnSmallScreen: true }
          },
          5: {
            namespace: 'group-of-5',
            link: 'eye-photography-zadar/group-of-5',
            config: { layout: 'month_view', useSlotsViewOnSmallScreen: true }
          }
        }
      },
      pricingIntro: {
        en: {
          default: 'Paketi i cijene za fotografiranje oka.',
          selected: 'Paketi i cijene za fotografiranje oka.'
        },
        hr: {
          default: 'Paketi i cijene za fotografiranje oka.',
          selected: 'Paketi i cijene za fotografiranje oka.'
        }
      },
      pricing: [
        {
          title: { en: 'Osnovni paket', hr: 'Osnovni paket' },
          description: {
            en: 'Fotografiranje jednog oka uz profesionalnu umjetničku obradu. Fotografiranje šarenice oka, detaljna obrada fotografije, digitalna isporuka u formatima: Full Size, Desktop Wallpaper, IG/FB Story format i isporuka gotovih fotografija unutar 24 sata.',
            hr: 'Fotografiranje jednog oka uz profesionalnu umjetničku obradu. Fotografiranje šarenice oka, detaljna obrada fotografije, digitalna isporuka u formatima: Full Size, Desktop Wallpaper, IG/FB Story format i isporuka gotovih fotografija unutar 24 sata.'
          },
          priceText: {
            en: '38 € po osobi',
            hr: '38 € po osobi'
          }
        },
        {
          title: { en: 'Premium paket', hr: 'Premium paket' },
          description: {
            en: 'Sadrži sve što i Osnovni paket + dodatna kreativna obrada, eksplozija boja, svjetlosni efekti, umjetnički/apstraktni efekti i personalizirani stil po želji.',
            hr: 'Sadrži sve što i Osnovni paket + dodatna kreativna obrada, eksplozija boja, svjetlosni efekti, umjetnički/apstraktni efekti i personalizirani stil po želji.'
          },
          priceText: {
            en: '48 € po osobi',
            hr: '48 € po osobi'
          }
        }
      ],
      gallery: [
        { type: 'image', src: '/assets/img/eye1.jpeg', alt: 'Eye Photography' },
        { type: 'image', src: '/assets/img/eye2.jpeg', alt: 'Eye Photography' },
        { type: 'image', src: '/assets/img/eye3.jpeg', alt: 'Eye Photography' },
        { type: 'image', src: '/assets/img/eye4.jpeg', alt: 'Eye Photography', position: 'center 50%' },
        { type: 'image', src: '/assets/img/eye5.jpeg', alt: 'Eye Photography' },
        { type: 'image', src: '/assets/img/eye6.jpeg', alt: 'Eye Photography' },
        { type: 'image', src: '/assets/img/eye7.jpeg', alt: 'Eye Photography',position: 'center 52%' },
        { type: 'image', src: '/assets/img/eye8.jpeg', alt: 'Eye Photography' },
      ]
    };
  }

  store.serviceProjects = {
    'eye-photography': {
      ...projects['eye-photography'],
      location: { en: 'Zadar, Croatia', hr: 'Zadar, Hrvatska' },
      homeDescription: {
        en: 'Your iris as personal artwork. Eye photography is a close-up macro portrait of the iris - the coloured part of your eye. Every iris has its own structure, colour transitions, texture and fine details, so the final image becomes a personal art piece rather than a standard portrait. During the session we use controlled lighting and macro photography equipment to capture the iris clearly, without touching the eye. After the photo is taken, the image is carefully optimised for clarity, contrast and colour, then prepared as a digital file, print or framed piece. The experience is designed for individuals, couples, friends and families who want a unique keepsake or personalised wall art.',
        hr: 'Vaša šarenica kao osobna umjetnina. Fotografija oka je makro portret šarenice - obojenog dijela oka. Svaka šarenica ima vlastitu strukturu, prijelaze boja, teksturu i sitne detalje, pa završna fotografija postaje osobni umjetnički komad, a ne klasičan portret. Tijekom fotografiranja koristimo kontrolirano osvjetljenje i makro fotografsku opremu kako bismo jasno snimili šarenicu, bez dodirivanja oka. Nakon fotografiranja slika se pažljivo obrađuje radi jasnoće, kontrasta i boje, a zatim priprema kao digitalna datoteka, print ili uokvirena slika. Iskustvo je namijenjeno pojedincima, parovima, prijateljima i obiteljima koje žele jedinstvenu uspomenu ili personaliziranu zidnu umjetninu.'
      },
      description: {
        en: 'Your iris as personal artwork. Eye photography is a close-up macro portrait of the iris - the coloured part of your eye. Every iris has its own structure, colour transitions, texture and fine details, so the final image becomes a personal art piece rather than a standard portrait. During the session we use controlled lighting and macro photography equipment to capture the iris clearly, without touching the eye. After the photo is taken, the image is carefully optimised for clarity, contrast and colour, then prepared as a digital file, print or framed piece. The experience is designed for individuals, couples, friends and families who want a unique keepsake or personalised wall art.',
        hr: 'Vaša šarenica kao osobna umjetnina. Fotografija oka je makro portret šarenice - obojenog dijela oka. Svaka šarenica ima vlastitu strukturu, prijelaze boja, teksturu i sitne detalje, pa završna fotografija postaje osobni umjetnički komad, a ne klasičan portret. Tijekom fotografiranja koristimo kontrolirano osvjetljenje i makro fotografsku opremu kako bismo jasno snimili šarenicu, bez dodirivanja oka. Nakon fotografiranja slika se pažljivo obrađuje radi jasnoće, kontrasta i boje, a zatim priprema kao digitalna datoteka, print ili uokvirena slika. Iskustvo je namijenjeno pojedincima, parovima, prijateljima i obiteljima koje žele jedinstvenu uspomenu ili personaliziranu zidnu umjetninu.'
      }
    }
  };

  site.home = {
    portfolioOrder: ['accommodation', 'restaurants', 'travel', 'events', 'weddings', 'company'],
    serviceProjectOrder: ['eye-photography'],
    projectOrder: ['longines', 'car-event', 'toto-travel'],
    ui: {
      en: {
        portfolioAria: 'Open',
        portfolioOverlay: 'Open',
        projectAria: 'Open ',
        projectOverlay: 'Open',
        bookNow: 'Book now',
        getDirections: 'Get directions',
        workingHours: 'Working hours',
        addressLabel: 'Address',
        pricingButton: 'See pricing',
        pricingTitle: 'Pricing',
        galleryTitle: 'Gallery',
        proceedButton: 'Proceed'
      },
      hr: {
        portfolioAria: 'Otvori',
        portfolioOverlay: 'Otvori ',
        projectAria: 'Otvori ',
        projectOverlay: 'Otvori',
        bookNow: 'Rezerviraj termin',
        getDirections: 'Pokreni rutu',
        workingHours: 'Radno vrijeme',
        addressLabel: 'Adresa',
        pricingButton: 'Pogledaj cijene',
        pricingTitle: 'Cijene',
        galleryTitle: 'Galerija',
        proceedButton: 'Nastavi'
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

  function getMediaPositionValue(item){
    if (!item || typeof item !== 'object') return '';
    return item.position || item.objectPosition || item.thumbPosition || item.coverPosition || item.mediaPosition || item.dataPosition || item['data-position'] || '';
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


  function getGalleryItems(item) {
    return (Array.isArray(item && item.gallery) ? item.gallery : [])
      .map((entry) => {
        if (!entry) return null;
        if (typeof entry === 'string') return { src: entry, position: '' };
        const src = entry.src || entry.url || '';
        if (!src) return null;
        return {
          src,
          position: getMediaPositionValue(entry)
        };
      })
      .filter(Boolean);
  }

  function getGalleryImages(item) {
    return getGalleryItems(item).map((entry) => entry.src).filter(Boolean);
  }

  function buildRotatingAttr(items) {
    return esc(JSON.stringify((items || []).map((entry) => {
      if (typeof entry === 'string') return { src: entry };
      const position = getMediaPositionValue(entry);
      return position ? { src: entry.src, position } : { src: entry.src };
    })));
  }

  function renderHomeRows(lang, mountId, collection, order) {
    const mount = document.getElementById(mountId);
    if (!mount || !site.home) return;

    const ui = site.home.ui[lang] || site.home.ui.en;
    mount.innerHTML = order.map((key, index) => {
      const item = collection[key];
      if (!item) return '';
      const title = pickLocalized(item.title, lang);
      const href = pickLocalized(item.path, lang, '#');
      const galleryItems = getGalleryItems(item);
      const galleryImages = galleryItems.map((entry) => entry.src);
      const img = item.cover || galleryImages[0] || item.heroPoster || '/assets/img/logo.jpg';
      const imgPosition = getMediaPositionValue(item) || item.coverPosition || (galleryItems[0] && galleryItems[0].position) || '';
      const imgPositionAttr = imgPosition ? ` style="object-position:${esc(imgPosition)}"` : '';
      const locationText = pickLocalized(item.location, lang);
      const description = pickLocalized(item.homeDescription || item.description, lang);
      const reverseClass = index % 2 === 1 ? ' latest__row--reverse' : '';
      const rotating = galleryItems.length ? ` data-rotating-gallery="${buildRotatingAttr(galleryItems)}"` : '';
      return `
        <article class="latest__row${reverseClass}">
          <div class="latest__media">
            <a class="frameLink" href="${esc(href)}" aria-label="${esc(ui.projectAria + title)}">
              <img src="${esc(img)}" alt="${esc(title)}" loading="lazy"${imgPositionAttr}${rotating} />
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

  function renderProjectExtraDetails(lang) {
    const projectId = document.body && document.body.dataset ? document.body.dataset.project : '';
    if (!projectId || !store.projects || !store.projects[projectId]) return;

    const project = store.projects[projectId];
    const ui = site.home.ui[lang] || site.home.ui.en;
    const bookBtn = document.getElementById('js-project-book');
    const featureMount = document.getElementById('js-project-feature-media');
    const addressEl = document.getElementById('js-project-address');
    const phoneEl = document.getElementById('js-project-phone');
    const hoursEl = document.getElementById('js-project-hours');
    const directionsBtn = document.getElementById('js-project-directions');
    const mapFrame = document.getElementById('js-project-map');
    const pricingMount = document.getElementById('js-project-pricing');
    const pricingTitle = document.getElementById('js-project-pricing-title');
    const pricingNoteEl = document.getElementById('js-project-pricing-note');
    const addressLabelEl = document.getElementById('js-project-address-label');
    const hoursLabelEl = document.getElementById('js-project-hours-label');
    const pricingBtn = document.getElementById('js-project-pricing-btn');
    const bookingTitleEl = document.getElementById('js-project-booking-title');
    const bookingCopyEl = document.getElementById('js-project-booking-copy');
    const bookingNoteEl = document.getElementById('js-project-booking-note');
    const bookingStatusEl = document.getElementById('js-project-booking-status');
    const bookingSelectedEl = document.getElementById('js-project-booking-selected');
    const bookingOptionsEl = document.getElementById('js-project-booking-options');
    const bookingActionBtn = document.getElementById('js-project-booking-book');
    const bookingProceedBtn = document.getElementById('js-project-booking-proceed');
    const bookingTriggersEl = document.getElementById('js-project-booking-triggers');

    const galleryItems = getGalleryItems(project);
    const rotatingImages = galleryItems.map((entry) => entry.src).filter(Boolean);
    const featureImage = rotatingImages[0] || project.heroPoster || '/assets/img/logo.jpg';
    const projectFeaturePosition = getMediaPositionValue(project) || project.coverPosition || (galleryItems[0] && galleryItems[0].position) || '';
    const featurePosition = projectFeaturePosition ? ` style="object-position:${esc(projectFeaturePosition)}"` : '';
    const rotatingAttr = galleryItems.length ? ` data-rotating-gallery="${buildRotatingAttr(galleryItems)}"` : '';

    if (featureMount) {
      featureMount.innerHTML = `<div class="projectHeroTile"><img src="${esc(featureImage)}" alt="${esc(pickLocalized(project.title, lang))}" loading="eager" decoding="async"${featurePosition}${rotatingAttr} /></div>`;
      window.dispatchEvent(new Event('bkvp:home-rendered'));
    }

    if (bookBtn) {
      bookBtn.href = '#booking-chooser';
      bookBtn.removeAttribute('target');
      bookBtn.removeAttribute('rel');
      bookBtn.textContent = ui.bookNow || bookBtn.textContent;
    }
    if (pricingBtn) pricingBtn.textContent = ui.pricingButton || pricingBtn.textContent;

    const address = pickLocalized(project.address, lang);
    const workingHours = pickLocalized(project.workingHours, lang);
    const phone = project.phone || {};
    const phoneRaw = phone.raw || '';
    const phoneDisplay = phone.display || phone.raw || '';
    const phoneLabel = lang === 'hr' ? 'Telefon' : 'Phone';
    const mapQuery = project.mapQuery || address || 'Zadar, Croatia';

    if (addressEl) addressEl.textContent = address;
    if (phoneEl) {
      phoneEl.innerHTML = phoneRaw ? `<a href="tel:${esc(phoneRaw)}">${esc(phoneLabel)}: ${esc(phoneDisplay)}</a>` : '';
    }
    if (hoursEl) {
      if (Array.isArray(workingHours)) {
        hoursEl.innerHTML = `<ul class="hoursList">${workingHours.map((entry) => `<li>${esc(entry)}</li>`).join('')}</ul>`;
      } else {
        hoursEl.textContent = workingHours;
      }
    }
    if (addressLabelEl) addressLabelEl.textContent = ui.addressLabel || (lang === 'hr' ? 'Adresa' : 'Address');
    if (hoursLabelEl) hoursLabelEl.textContent = ui.workingHours || (lang === 'hr' ? 'Radno vrijeme' : 'Working hours');
    if (directionsBtn) directionsBtn.href = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(mapQuery)}`;
    if (mapFrame) mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`;

    if (pricingTitle) pricingTitle.textContent = ui.pricingTitle || pricingTitle.textContent;

    function renderPricing(selectedCountForPricing) {
      if (!pricingMount) return;
      const pricingIntro = project.pricingIntro || {};
      const pricingDefault = pickLocalized(pricingIntro.default, lang, lang === 'hr' ? 'Cijene su prikazane po osobi. Cijena za djecu prikazana je zasebno.' : 'Prices are shown per person. Children price is listed separately.');
      const pricingSelected = pickLocalized(pricingIntro.selected, lang, pricingDefault);
      const pricingItems = Array.isArray(project.pricing) ? project.pricing : [];
      const hasStaticPricing = pricingItems.some((item) => item && item.priceText);

      if (pricingNoteEl) {
        if (selectedCountForPricing) {
          const peopleLabel = getPeopleLabel(selectedCountForPricing);
          pricingNoteEl.textContent = pricingSelected
            .replace('{count}', String(selectedCountForPricing))
            .replace('{peopleLabel}', peopleLabel);
        } else {
          pricingNoteEl.textContent = pricingDefault;
        }
      }

      if (hasStaticPricing) {
        pricingMount.innerHTML = pricingItems.map((item) => {
          const priceText = pickLocalized(item.priceText, lang, '');
          return `
        <article class="infoCard pricingCard pricingCard--static">
          ${priceText ? `<span class="priceTag priceTag--text">${esc(priceText)}</span>` : ''}
          <h4>${esc(pickLocalized(item.title, lang))}</h4>
          <p>${esc(pickLocalized(item.description, lang))}</p>
        </article>
      `;
        }).join('');
        return;
      }

      if (!selectedCountForPricing) {
        pricingMount.innerHTML = '';
        return;
      }

      pricingMount.innerHTML = pricingItems.map((item) => {
        const amountMap = item.amountByCount || {};
        const amount = amountMap[selectedCountForPricing] || amountMap[String(selectedCountForPricing)] || '';
        if (!amount) return '';
        const currency = esc(item.currency || '€');
        return `
        <article class="infoCard pricingCard">
          <span class="priceTag"><span class="priceTag__amount">${esc(amount)}</span><span class="priceTag__currency">${currency}</span></span>
          <h4>${esc(pickLocalized(item.title, lang))}</h4>
          <p>${esc(pickLocalized(item.description, lang))}</p>
        </article>
      `;
      }).join('');
    }

    const chooser = project.bookingChooser || {};
    const chooserButtons = chooser.buttons || {};
    const chooserButtonLabels = pickLocalized(chooserButtons, lang, chooserButtons.en || {});
    if (bookingTitleEl) bookingTitleEl.textContent = pickLocalized(chooser.title, lang, bookingTitleEl.textContent || '');
    if (bookingCopyEl) bookingCopyEl.textContent = pickLocalized(chooser.prompt, lang, '');
    if (bookingNoteEl) bookingNoteEl.textContent = pickLocalized(chooser.prompt, lang, '');
    if (bookingActionBtn) bookingActionBtn.textContent = (chooserButtonLabels && chooserButtonLabels.book) || ui.bookNow || bookingActionBtn.textContent;
    if (bookingProceedBtn) bookingProceedBtn.textContent = (chooserButtonLabels && chooserButtonLabels.proceed) || ui.proceedButton || bookingProceedBtn.textContent;

    if (!bookingOptionsEl || !bookingActionBtn || !bookingTriggersEl) return;

    const calSettings = project.calCom || {};
    const eventMap = calSettings.events || {};
    const bookingAvailability = project.bookingAvailability || {};
    let selectedCount = 0;

    function parseDateBoundary(value, endOfDay) {
      if (!value) return null;
      const suffix = endOfDay ? 'T23:59:59' : 'T00:00:00';
      const parsed = new Date(`${value}${suffix}`);
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    function formatStatusDate(value) {
      if (!value) return '';
      const parsed = new Date(`${value}T12:00:00`);
      if (Number.isNaN(parsed.getTime())) return value;
      return parsed.toLocaleDateString(lang === 'hr' ? 'hr-HR' : 'en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }

    function getStudioAvailability() {
      const closedRange = bookingAvailability.closedRange || {};
      const startDate = parseDateBoundary(closedRange.start, false);
      const endDate = parseDateBoundary(closedRange.end, true);
      const now = new Date();
      const isClosed = !!(startDate && endDate && now >= startDate && now <= endDate);
      return {
        isClosed,
        start: closedRange.start || '',
        end: closedRange.end || ''
      };
    }

    function updateBookingAvailability(chips) {
      const availability = getStudioAvailability();
      const openMessage = pickLocalized((bookingAvailability.statusMessage || {}).open, lang, lang === 'hr' ? 'Studio je otvoren za rezervacije.' : 'Studio is open to book.');
      const closedTemplate = pickLocalized((bookingAvailability.statusMessage || {}).closed, lang, lang === 'hr' ? 'Studio ne radi od {start} do {end}. Rezervacije su privremeno onemogućene.' : 'Studio is not working from {start} to {end}. Booking is temporarily disabled.');
      const statusText = availability.isClosed
        ? closedTemplate.replace('{start}', formatStatusDate(availability.start)).replace('{end}', formatStatusDate(availability.end))
        : openMessage;

      if (bookingStatusEl) {
        bookingStatusEl.textContent = statusText;
        bookingStatusEl.classList.toggle('is-open', !availability.isClosed);
        bookingStatusEl.classList.toggle('is-closed', availability.isClosed);
      }

      chips.forEach((chip) => {
        chip.disabled = availability.isClosed;
        chip.setAttribute('aria-disabled', availability.isClosed ? 'true' : 'false');
      });

      if (availability.isClosed) selectedCount = 0;
      return availability;
    }

    function ensureCalBootstrap() {
      if (window.__bkvpCalBootstrapReady) return;
      (function (C, A, L) {
        const p = function (a, ar) { a.q.push(ar); };
        const d = C.document;
        C.Cal = C.Cal || function () {
          const cal = C.Cal;
          const ar = arguments;
          if (!cal.loaded) {
            cal.ns = {};
            cal.q = cal.q || [];
            d.head.appendChild(d.createElement('script')).src = A;
            cal.loaded = true;
          }
          if (ar[0] === L) {
            const api = function () { p(api, arguments); };
            const namespace = ar[1];
            api.q = api.q || [];
            if (typeof namespace === 'string') {
              cal.ns[namespace] = cal.ns[namespace] || api;
              p(cal.ns[namespace], ar);
              p(cal, ['initNamespace', namespace]);
            } else {
              p(cal, ar);
            }
            return;
          }
          p(cal, ar);
        };
      })(window, `${calSettings.origin || 'https://app.cal.com'}/embed/embed.js`, 'init');
      window.__bkvpCalBootstrapReady = true;
    }

    function initCalNamespace(config) {
      if (!config || !config.namespace || !config.link) return;
      ensureCalBootstrap();
      const namespaces = window.__bkvpCalNamespaces = window.__bkvpCalNamespaces || {};
      if (namespaces[config.namespace]) return;
      window.Cal('init', config.namespace, { origin: calSettings.origin || 'https://app.cal.com' });
      if (window.Cal.ns && window.Cal.ns[config.namespace]) {
        window.Cal.ns[config.namespace]('ui', calSettings.ui || { hideEventTypeDetails: false, layout: 'month_view' });
      }
      namespaces[config.namespace] = true;
    }

    bookingTriggersEl.innerHTML = '';
    Object.keys(eventMap).forEach((countKey) => {
      const config = eventMap[countKey];
      if (!config || !config.namespace || !config.link) return;
      initCalNamespace(config);
      const trigger = document.createElement('button');
      trigger.type = 'button';
      trigger.hidden = true;
      trigger.dataset.count = String(countKey);
      trigger.setAttribute('data-cal-link', config.link);
      trigger.setAttribute('data-cal-namespace', config.namespace);
      trigger.setAttribute('data-cal-config', JSON.stringify(config.config || { layout: 'month_view', useSlotsViewOnSmallScreen: true }));
      bookingTriggersEl.appendChild(trigger);
    });

    bookingOptionsEl.innerHTML = [1, 2, 3, 4, 5].map((count) => `
      <button type="button" class="bookingCountChip" data-count="${count}" role="radio" aria-checked="false">${count}</button>
    `).join('');

    const chips = Array.from(bookingOptionsEl.querySelectorAll('.bookingCountChip'));
    const peopleLabels = pickLocalized(chooser.peopleLabels, lang, chooser.peopleLabels && chooser.peopleLabels.en ? chooser.peopleLabels.en : { singular: 'person', plural: 'people' });
    const readyTemplate = pickLocalized(chooser.readyMessage, lang, lang === 'hr'
      ? 'Za nastavak kliknite na Rezerviraj termin i pratite upute. Ukoliko vas kalendar prebaci na idući radni dan, radno vrijeme je gotovo ili su svi termini popunjeni.'
      : 'To continue, click Book now and follow the instructions. If the calendar moves you to the next working day, working hours are over or all appointments are full.');

    function resolveEventConfig(count) {
      return eventMap[count] || eventMap[String(count)] || null;
    }

    function getPeopleLabel(count) {
      if (!peopleLabels || typeof peopleLabels !== 'object') return count === 1 ? 'person' : 'people';
      if (lang === 'hr') return count === 1 ? 'osobu' : (count >= 5 ? 'osoba' : 'osobe');
      return count === 1 ? (peopleLabels.singular || 'person') : (peopleLabels.plural || 'people');
    }

    function updateSelectionState() {
      const availability = updateBookingAvailability(chips);

      chips.forEach((chip) => {
        const count = Number(chip.dataset.count || '0');
        const isSelected = !availability.isClosed && count === selectedCount;
        chip.classList.toggle('is-selected', isSelected);
        chip.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      });

      const isReady = !availability.isClosed && selectedCount > 0;
      const hasConfig = !!resolveEventConfig(selectedCount);
      bookingActionBtn.disabled = !(isReady && hasConfig);
      if (bookingProceedBtn) {
        bookingProceedBtn.disabled = !(isReady && hasConfig);
        bookingProceedBtn.hidden = true;
      }
      if (bookingSelectedEl) {
        bookingSelectedEl.textContent = '';
      }

      renderPricing(selectedCount);

      if (bookingNoteEl) {
        if (availability.isClosed) {
          bookingNoteEl.textContent = pickLocalized(chooser.prompt, lang, '');
        } else if (!isReady) {
          bookingNoteEl.textContent = pickLocalized(chooser.prompt, lang, '');
        } else if (!hasConfig) {
          bookingNoteEl.textContent = lang === 'hr'
            ? 'Online rezervacija za odabrani broj osoba još nije postavljena.'
            : 'Online booking for the selected number of people is not set up yet.';
        } else {
          const peopleLabel = getPeopleLabel(selectedCount);
          bookingNoteEl.textContent = readyTemplate
            .replace('{count}', String(selectedCount))
            .replace('{peopleLabel}', peopleLabel);
        }
      }
    }

    function openCalendar() {
      const config = resolveEventConfig(selectedCount);
      if (!config) return;
      const trigger = bookingTriggersEl.querySelector(`[data-count="${selectedCount}"]`);
      if (trigger) {
        trigger.click();
      }
    }

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        if (chip.disabled) return;
        selectedCount = Number(chip.dataset.count || '0');
        updateSelectionState();
      });
    });

    bookingActionBtn.addEventListener('click', openCalendar);
    if (bookingProceedBtn) bookingProceedBtn.addEventListener('click', openCalendar);
    updateSelectionState();
  }

  function renderHomePortfolio(lang) {
    const mount = document.getElementById('js-home-portfolio');
    if (!mount || !site.home) return;

    const ui = site.home.ui[lang] || site.home.ui.en;

    mount.innerHTML = site.home.portfolioOrder.map((key) => {
      const item = portfolio[key];
      if (!item) return '';

      const href = pickLocalized(item.path, lang, '#');
      const firstMedia = item.items && item.items[0] ? item.items[0] : null;
      const img =
        item.cover ||
        (firstMedia && (firstMedia.thumb || firstMedia.src)) ||
        '/assets/img/logo.jpg';
      const firstMediaPosition = getMediaPositionValue(firstMedia) || item.coverPosition || getMediaPositionValue(item);
      const imgPosition = firstMediaPosition ? ` style="object-position:${esc(firstMediaPosition)}"` : '';

      return `
        <a class="tile" href="${esc(href)}" aria-label="${esc(ui.portfolioAria)}">
          <img src="${esc(img)}" alt="${esc(formatCategoryName(key, lang))}" loading="lazy"${imgPosition} />

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
    renderHomeRows(lang, 'js-home-projects', projects, site.home.projectOrder || []);
  }

  function renderHomeServiceProjects(lang) {
    renderHomeRows(lang, 'js-home-service-projects', store.serviceProjects || {}, site.home.serviceProjectOrder || []);
  }

  function renderHomeSections() {
    if (!document.body || !document.body.classList.contains('home')) return;
    const lang = getLang();
    renderHomeServiceProjects(lang);
    renderHomePortfolio(lang);
    renderHomeProjects(lang);
    window.dispatchEvent(new Event('bkvp:home-rendered'));
  }

  function initPageData(){
    const lang = getLang();
    renderHomeSections();
    renderProjectExtraDetails(lang);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initPageData);
  } else {
    initPageData();
  }
})();
