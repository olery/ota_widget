// Locale.js
// For more translations, copy the entire english version and translate all the sentences on it.
//
// You can also change the default locale in the ota_widget.js file (ota_widget.locale)
'use strict';

window.ota_widget.i18n.locales = {

  en: {
    review_date: 'data from %{date}',
    overall: {
      reviews: 'reviews',
      period: 'in the past 12 months'
    },

    ratings: {
      title: 'Ratings',
      topics: {
        overall: 'General',
        service: 'Service',
        location: 'Location',
        cleanliness: 'Cleanliness',
        facilities: 'Facilities',
        value: 'Value',
        room: 'Room',
        food: 'Food',
        ambience: 'Ambience'
      }
    },

    mentions: {
      title: 'What People Mention',
      times: 'times mentioned',
      positive: 'positive'
    },

    guests: {
      title: 'Who stays here',
      countries: {},
      compositions: {}
    },

    summaries: {
      title: 'Summary',
      review_count_reviews_in_the_past_6_months: ' reviews in the past 6 months',
      amazing_hotel: 'amazing hotel',
      very_good_hotel: 'very good hotel',
      mediocre_hotel: 'mediocre hotel',
      bad_hotel: 'bad hotel',
      very_clean_and_tidy: 'very clean and tidy',
      cleanliness_is_top_notch: 'cleanliness is top-notch',
      cleanliness_is_lacking: 'cleanliness is lacking',
      not_cleaned_thoroughly: 'not cleaned thoroughly',
      wonderful_rooms: 'wonderful rooms',
      pretty_good_rooms: 'pretty good rooms',
      rooms_are_okay: 'rooms are okay',
      rooms_are_not_nice: 'rooms are not nice',
      excellent_service: 'excellent service',
      good_service: 'good service',
      average_service: 'average service',
      miserable_service: 'miserable service',
      location_is_just_perfect: 'location is just perfect',
      convenient_location: 'convenient location',
      the_location_is_not_great: 'the location is not great',
      be_aware_bad_location: 'be aware, bad location',
      great_value_for_money: 'great value for money',
      very_fair_prices: 'very fair prices',
      value_for_money_is_okay: 'value for money is okay',
      overpriced: 'overpriced',
      delicious_food: 'delicious food',
      tasty_food: 'tasty food',
      average_food: 'average food',
      bad_food: 'bad food',
      delightful_breakfast: 'delightful breakfast',
      nice_breakfast: 'nice breakfast',
      breakfast_is_only_okay: 'breakfast is only okay',
      disappointing_breakfast: 'disappointing breakfast',
      luxurious_bathrooms: 'luxurious bathrooms',
      nice_bathrooms: 'nice bathrooms',
      bathrooms_are_nothing_special: 'bathrooms are nothing special',
      inferior_bathrooms: 'inferior bathrooms',
      excellent_internet_connection: 'excellent internet connection',
      good_internet_connection: 'good internet connection',
      internet_connection_is_lacking: 'internet connection is lacking',
      horrible_internet_connection: 'horrible internet connection',
      nice_and_quiet_at_night: 'nice and quiet at night',
      pretty_quiet_at_night: 'pretty quiet at night',
      sometimes_noisy_at_night: 'sometimes noisy at night',
      often_noisy_at_night: 'often noisy at night',
      delightful_swimming_pool: 'delightful swimming pool',
      pleasant_swimming_pool: 'pleasant swimming pool',
      substandard_swimming_pool: 'substandard swimming pool',
      shoddy_swimming_pool: 'shoddy swimming pool',
      almost_all_guests_slept_well_here: 'almost all guests slept well here',
      most_guests_slept_well_here: 'most guests slept well here',
      mixed_opinions_on_the_sleeping_comfort: 'mixed opinions on the sleeping comfort',
      most_guest_didn_t_sleep_well_here: 'most guest didn\'t sleep well here',
      superb_restaurant: 'superb restaurant',
      satisfying_restaurant: 'satisfying restaurant',
      restaurant_not_noteworthy: 'restaurant not noteworthy',
      unpleasant_restaurant: 'unpleasant restaurant',
      marvellous_building: 'marvellous building',
      remarkable_building: 'remarkable building',
      unremarkable_building: 'unremarkable building',
      run_down_building: 'run-down building',
      hassle_free_parking: 'hassle-free parking',
      parking_is_a_plus: 'parking is a plus',
      parking_might_be_difficult: 'parking might be difficult',
      parking_is_a_problem: 'parking is a problem',
      beautiful_spa: 'beautiful spa',
      pretty_nice_spa: 'pretty nice spa',
      spa_is_not_up_to_par: 'spa is not up to par',
      lousy_spa: 'lousy spa',
      top_notch_facilities: 'top-notch facilities',
      decent_facilities: 'decent facilities',
      unsatisfactory_facilities: 'unsatisfactory facilities',
      awful_facilities: 'awful facilities',
      really_comfortable_beds: 'really comfortable beds',
      really_uncomfortable_beds: 'really uncomfortable beds',
      great_shower: 'great shower',
      terrible_shower: 'terrible shower',
      delightful_bar: 'delightful bar',
      bar_not_very_nice: 'bar not very nice',
      really_nice_fitness_room: 'really nice fitness room',
      awful_fitness_room: 'awful fitness room',
      restaurant_offers_great_value: 'restaurant offers great value',
      restaurant_too_expensive: 'restaurant too expensive',
      breakfast_is_worth_the_price: 'breakfast is worth the price',
      pricey_breakfast: 'pricey breakfast',
      parking_is_free_or_cheap: 'parking is free or cheap',
      parking_might_be_expensive: 'parking might be expensive',
      fantastic_toiletries: 'fantastic toiletries',
      no_or_bad_toiletries: 'no or bad toiletries',
      inviting_breakfast_area: 'inviting breakfast area',
      dreadful_breakfast_area: 'dreadful breakfast area',
      expensive_internet_access: 'expensive internet access',
      attention_reports_of_bugs_or_other_vermin: 'attention: reports of bugs or other vermin!',
      restaurant_not_properly_cleaned: 'restaurant not properly cleaned',
      bathrooms_are_dirty: 'bathrooms are dirty',
      rude_staff_in_the_restaurant: 'rude staff in the restaurant',
      unfriendly_staff_at_breakfast: 'unfriendly staff at breakfast',
      reports_of_bad_smells_in_the_hotel: 'reports of bad smells in the hotel',
      issues_with_the_windows: 'issues with the windows',
      mold_in_some_bathrooms: 'mold in some bathrooms'
    },

    recent_reviews: {
      title: 'Recent Reviews',
      subtitle: 'from sites across the web',
      guest_liked: 'Guest liked the ',
      separator: ' and the ',
      negative_comms: 'Negative comments about the ',
      reviewed_at: 'Reviewed %{days} days ago',
      reviewed_a_while_ago: 'Reviewed a while ago'
    },

    nearby: {
      attractions: 'Nearby Points of Interest',
      restaurants: 'Nearby Places to Eat',
      very_popular: 'very popular',
      highly_rated: 'Highly rated'
    },

    charts: {
      date: 'Date',
      current: 'This Year',
      previous: 'Last Year',
      quarter: 'Quarter',
      year: 'Year',
      property: 'Property',
      city: 'City',
      country: 'Country',
      continent: 'Continent',
      covid_cases: 'Covid-19 cases in Country',
      seasons: 'Seasons',
      asia: 'Asia',
      africa: 'Africa',
      antarctica: 'Antartica',
      europe: 'Europe',
      oceania: 'Oceania',
      'north-america': 'North America',
      'south-america': 'South America'
    },

    over_time: {
      title: 'Over Time',
      description: 'Tracking your review volume over time and comparing how you performed the previous year. This data allows you to track your recovery based on review volume.'
    },

    trends: {
      title: 'Trends',
      description: 'Utilising our worldwide coverage of hotels consisting of almost 1 million properties. We track the review volume per your property, country and continent level. Track how your country is recovering from Covid-19 by monitoring the review volume and compare how your property is doing to the national average. Also, keep a track of confirmed cases of Covid-19 in your country with data directly from WHO on a daily basis.'
    },

    shifts: {
      title: 'Shifts',
      description: 'Track the shifts in the types of customers who are coming to your establishment. With this data you can see the changes in where your customers are coming from and what type of customers your establishment attracts. Do you still get 40 percent portuguese customers? or is it the Spanish who come to your establishment now? '
    },

    covid_events: {
      title: 'COVID-19',
      description: 'This information provides you with an update on the total number of weekly confirmed cases on a continental level. The information is taken directly from the WHO API and is updated daily. Keep track of the regional Covid-19 infections to better understand when regions will re-open up for travel. This data is based on weekly confirmed cases.'
    },

    opinions: {
      topics: {
        sanitary_safety: 'Sanitary Safety Score',
        health_precautions: 'Health Precaution Score',
        covid: 'Covid',
        breakfast_area: 'Breakfast Area',
        chemicals: 'Chemical Odor',
        defects: 'Defects in the Room',
        entertainment: 'Entertainment Facilities',
        fitness: 'Fitness Center',
        fnb: 'Food & Beverages',
        outdoor_sports: 'Outdoor Sport Grounds',
        ptec: 'Air Conditioning & Heating',
        surroundings: 'Location Surroundings',
        bar: 'bar',
        bath_accessories: 'bath accessories',
        bathroom: 'bathroom',
        bathtub: 'bathtub',
        bed: 'bed',
        bedlinen: 'bedlinen',
        beverages: 'beverages',
        breakfast: 'breakfast',
        cleanliness: 'cleanliness',
        corridor: 'corridor',
        decor: 'decor',
        dirt: 'dirt',
        dust: 'dust',
        elevator: 'elevator',
        facilities: 'facilities',
        floor: 'floor',
        food: 'food',
        furniture: 'furniture',
        health_hazards: 'health hazards',
        hotel_building: 'Building',
        humidity: 'humidity',
        internet: 'internet',
        lobby: 'lobby',
        location: 'location',
        noise: 'noise',
        odor: 'odor',
        parking: 'parking',
        pests: 'pests',
        problem: 'problem',
        restaurant: 'restaurant',
        room: 'room',
        room_equipment: 'room equipment',
        shower: 'shower',
        sleeping_comfort: 'sleeping comfort',
        smell: 'smell',
        smoke: 'smoke',
        spa: 'spa',
        staff: 'staff',
        stains: 'stains',
        tableware: 'tableware',
        toilet: 'toilet',
        toiletries: 'toiletries',
        towels: 'towels',
        tranquility: 'tranquility',
        value_for_money: 'value for money',
        walls: 'walls',
        windows: 'windows',
        swimming_pool: 'swimming pool'
      }
    }
  },

  de: {
    review_date: 'Aktualisiert am %{date}',
    overall: {
      reviews: 'Bewertungen',
      period: 'in den letzten 12 Monaten'
    },
    ratings: {
      title: 'Bewertungen',
      topics: {
        overall: 'Algemein'
      }
    },
    mentions: {
      title: 'Was Gäste sagen',
      times: 'mal geäußert',
      positive: 'positiv'
    },
    guests: {
      title: 'Wer hier Gast ist',
      countries: {},
      compositions: {}
    },
    summaries: {
      title: 'Zusammenfassung'
    },
    recent_reviews: {
      title: 'Neueste Bewertungen',
      subtitle: 'von überall aus dem Internet',
      guest_liked: 'Gäste mochten ',
      separator: ' und ',
      negative_comms: 'Negative Kommentare über ',
      reviewed_at: 'vor %{days} Tagen bewertet',
      reviewed_a_while_ago: 'vor einiger Zeit bewertet'
    },
    nearby_attractions: {
      title: 'Sehenswürdigkeiten in der Nähe',
      very_popular: 'stark besucht',
      highly_rated: 'hoch bewertet'
    },
    opinions: {
      topics: {
        breakfast_area: 'Frühstück',
        chemicals: 'chemischer Geruch',
        defects: 'Defekte im Zimmer',
        entertainment: 'Unterhaltungsangebote',
        fitness: 'Fitness Center',
        fnb: 'Essen & Trinken',
        outdoor_sports: 'Sportanalgen',
        ptec: 'Klimaanalge & Heizung',
        surroundings: 'Hotel Umgebung',
        bar: 'Bar',
        bath_accessories: 'Badzimmerartikel',
        bathroom: 'Badezimmer',
        bathtub: 'Badewanne',
        bed: 'Bett',
        bedlinen: 'Bettzeug',
        beverages: 'Getränke',
        breakfast: 'Frühstück',
        cleanliness: 'Sauberkeit',
        corridor: 'Flur',
        decor: 'Dekor',
        dirt: 'Schmutz',
        dust: 'Staub',
        elevator: 'Aufzug',
        facilities: 'Anlagen',
        floor: 'Boden',
        food: 'Essen',
        furniture: 'Möbel',
        health_hazards: 'Gesundheitsrisiken',
        hotel_building: 'Hotelgebäude',
        humidity: 'Luftfeuchtigkeit',
        internet: 'Internet',
        lobby: 'Lobby',
        location: 'Lage',
        noise: 'Lärm',
        odor: 'Geruch',
        parking: 'Parkplatz',
        pests: 'Ungeziefer',
        problem: 'Problem',
        restaurant: 'Restaurant',
        room: 'Zimmer',
        room_equipment: 'Zimmerausstattung',
        shower: 'Dusche',
        sleeping_comfort: 'Schlafcomfort',
        smell: 'Geruch',
        smoke: 'Rauch',
        spa: 'Wellness',
        staff: 'Personal',
        stains: 'Flecken',
        tableware: 'Gedeck',
        toilet: 'Toilette',
        toiletries: 'Toilettenartikel',
        towels: 'Handtücher',
        tranquility: 'Ruhe',
        value_for_money: 'Preis/Leistung',
        walls: 'Wände',
        windows: 'Fenster',
        swimming_pool: 'Swimming Pool'
      }
    }
  }

};