const express = require('express');
const router = express.Router();
const fs = require('fs');
const { check, validationResult } = require('express-validator');

const HttpError = require('../models/http-error');
const validateIncomingValues = require('../util/validation');
const uploadFile = require('../util/google-storage');

// const properties = require('../formattedProperties.json')

const dummyProperties = [
    {
        "type": "apartment",
        "list_date": "2018-09-13T14:20:00.000Z",
        "address": {
            "street": "9435 Green Park Gardens Dr",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63123",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.523421,
                "lng": -90.334641
            }
        },
        "details": {
            "rent": [
                795,
                795
            ],
            "beds": [
                2,
                2
            ],
            "baths": [
                2,
                2
            ],
            "size": [
                832,
                832
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Green Park Gardens Condominiums"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f1597730887o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f1667868443o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f2656244013o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f2227427371o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f4211735327o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f1947221220o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f2501888770o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f2201457195o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f1427821496o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f207827155o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f3289042835o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f259727517o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f226517515o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f1653658189o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f2958518003o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f3741906324o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f328167225o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f1148749195o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a2c4c5456e1062c3cdd5f869c4575d75c-f1399552340o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "6203 Kingsfont Pl",
            "city": "Florissant",
            "state": "MO",
            "zip": "63033",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.7917,
                "lng": -90.2456
            }
        },
        "details": {
            "rent": [
                725,
                1175
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                1.5
            ],
            "size": [
                642,
                1498
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Heatherton"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/2c7039a11375e21faa7f638fe5c0c3e5c-f246966891o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2580885937/2c7039a11375e21faa7f638fe5c0c3e5c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4219464134/2c7039a11375e21faa7f638fe5c0c3e5c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3864038657/2c7039a11375e21faa7f638fe5c0c3e5c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/491836562/2c7039a11375e21faa7f638fe5c0c3e5c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1303322432/2c7039a11375e21faa7f638fe5c0c3e5c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3492757994/2c7039a11375e21faa7f638fe5c0c3e5c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3036492433/2c7039a11375e21faa7f638fe5c0c3e5c-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2178917822/2c7039a11375e21faa7f638fe5c0c3e5c-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2985764200/2c7039a11375e21faa7f638fe5c0c3e5c-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2726310886/2c7039a11375e21faa7f638fe5c0c3e5c-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4142963379/2c7039a11375e21faa7f638fe5c0c3e5c-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2121923660/2c7039a11375e21faa7f638fe5c0c3e5c-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1613594161/2c7039a11375e21faa7f638fe5c0c3e5c-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1552849249/2c7039a11375e21faa7f638fe5c0c3e5c-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330700094/2c7039a11375e21faa7f638fe5c0c3e5c-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3979253159/2c7039a11375e21faa7f638fe5c0c3e5c-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2326248417/2c7039a11375e21faa7f638fe5c0c3e5c-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3928112184/2c7039a11375e21faa7f638fe5c0c3e5c-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2c7039a11375e21faa7f638fe5c0c3e5c-f3416068124o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2c7039a11375e21faa7f638fe5c0c3e5c-f2592935822o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2c7039a11375e21faa7f638fe5c0c3e5c-f2617152069o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2c7039a11375e21faa7f638fe5c0c3e5c-f2848611931o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/670085252/2c7039a11375e21faa7f638fe5c0c3e5c-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2016593986/2c7039a11375e21faa7f638fe5c0c3e5c-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3254394240/2c7039a11375e21faa7f638fe5c0c3e5c-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2067424621/2c7039a11375e21faa7f638fe5c0c3e5c-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4039464063/2c7039a11375e21faa7f638fe5c0c3e5c-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2880417793/2c7039a11375e21faa7f638fe5c0c3e5c-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3487054580/2c7039a11375e21faa7f638fe5c0c3e5c-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1397315298/2c7039a11375e21faa7f638fe5c0c3e5c-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3265304593/2c7039a11375e21faa7f638fe5c0c3e5c-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93021381/2c7039a11375e21faa7f638fe5c0c3e5c-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2248920343/2c7039a11375e21faa7f638fe5c0c3e5c-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1188728034/2c7039a11375e21faa7f638fe5c0c3e5c-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/807187352/2c7039a11375e21faa7f638fe5c0c3e5c-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2293994704/2c7039a11375e21faa7f638fe5c0c3e5c-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3760412027/2c7039a11375e21faa7f638fe5c0c3e5c-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2067555045/2c7039a11375e21faa7f638fe5c0c3e5c-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2125037628/2c7039a11375e21faa7f638fe5c0c3e5c-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/123612692/2c7039a11375e21faa7f638fe5c0c3e5c-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4013397530/2c7039a11375e21faa7f638fe5c0c3e5c-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3694157070/2c7039a11375e21faa7f638fe5c0c3e5c-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/781701696/2c7039a11375e21faa7f638fe5c0c3e5c-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2351492719/2c7039a11375e21faa7f638fe5c0c3e5c-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1458226220/2c7039a11375e21faa7f638fe5c0c3e5c-f45o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2782089275/2c7039a11375e21faa7f638fe5c0c3e5c-f46o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2241895244/2c7039a11375e21faa7f638fe5c0c3e5c-f47o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1144698857/2c7039a11375e21faa7f638fe5c0c3e5c-f48o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/411638731/2c7039a11375e21faa7f638fe5c0c3e5c-f49o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3929884056/2c7039a11375e21faa7f638fe5c0c3e5c-f50o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3029850063/2c7039a11375e21faa7f638fe5c0c3e5c-f51o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3769856923/2c7039a11375e21faa7f638fe5c0c3e5c-f52o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3580984306/2c7039a11375e21faa7f638fe5c0c3e5c-f53o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2672249801/2c7039a11375e21faa7f638fe5c0c3e5c-f54o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3553005080/2c7039a11375e21faa7f638fe5c0c3e5c-f55o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2447250736/2c7039a11375e21faa7f638fe5c0c3e5c-f56o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1471192018/2c7039a11375e21faa7f638fe5c0c3e5c-f57o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1828075312/2c7039a11375e21faa7f638fe5c0c3e5c-f58o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1043095521/2c7039a11375e21faa7f638fe5c0c3e5c-f59o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1182116848/2c7039a11375e21faa7f638fe5c0c3e5c-f60o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4209034768/2c7039a11375e21faa7f638fe5c0c3e5c-f61o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2884561975/2c7039a11375e21faa7f638fe5c0c3e5c-f62o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3635383576/2c7039a11375e21faa7f638fe5c0c3e5c-f63o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/314575070/2c7039a11375e21faa7f638fe5c0c3e5c-f64o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/767812102/2c7039a11375e21faa7f638fe5c0c3e5c-f65o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3969113067/2c7039a11375e21faa7f638fe5c0c3e5c-f66o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/510536510/2c7039a11375e21faa7f638fe5c0c3e5c-f67o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1509978922/2c7039a11375e21faa7f638fe5c0c3e5c-f68o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/167406573/2c7039a11375e21faa7f638fe5c0c3e5c-f69o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1395722213/2c7039a11375e21faa7f638fe5c0c3e5c-f70o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3018453659/2c7039a11375e21faa7f638fe5c0c3e5c-f71o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2933324254/2c7039a11375e21faa7f638fe5c0c3e5c-f72o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2408147842/2c7039a11375e21faa7f638fe5c0c3e5c-f73o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4081227295/2c7039a11375e21faa7f638fe5c0c3e5c-f74o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1568919669/2c7039a11375e21faa7f638fe5c0c3e5c-f75o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2382892687/2c7039a11375e21faa7f638fe5c0c3e5c-f76o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3697397233/2c7039a11375e21faa7f638fe5c0c3e5c-f77o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3888543742/2c7039a11375e21faa7f638fe5c0c3e5c-f78o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1806884923/2c7039a11375e21faa7f638fe5c0c3e5c-f79o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2231819608/2c7039a11375e21faa7f638fe5c0c3e5c-f80o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2611629085/2c7039a11375e21faa7f638fe5c0c3e5c-f81o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3865986975/2c7039a11375e21faa7f638fe5c0c3e5c-f82o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3758422254/2c7039a11375e21faa7f638fe5c0c3e5c-f83o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3595015270/2c7039a11375e21faa7f638fe5c0c3e5c-f84o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1809196631/2c7039a11375e21faa7f638fe5c0c3e5c-f85o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2128354576/2c7039a11375e21faa7f638fe5c0c3e5c-f86o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2033004420/2c7039a11375e21faa7f638fe5c0c3e5c-f87o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1041822258/2c7039a11375e21faa7f638fe5c0c3e5c-f88o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1501483968/2c7039a11375e21faa7f638fe5c0c3e5c-f89o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/541243304/2c7039a11375e21faa7f638fe5c0c3e5c-f90o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/884423302/2c7039a11375e21faa7f638fe5c0c3e5c-f91o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2314368304/2c7039a11375e21faa7f638fe5c0c3e5c-f92o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "5182 Golf Ridge Ln",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63128",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.485274,
                "lng": -90.387719
            }
        },
        "details": {
            "rent": [
                750,
                1209
            ],
            "beds": [
                0,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                486,
                1270
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f2830051407o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f2678904254o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f915837277o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f1485834730o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f4136044807o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f130246470o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f1772028454o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f985111235o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f1089713944o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f1905267947o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f86869375o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f2570607975o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f4021579550o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3551452750o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3160524165o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f570383574o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f2203647125o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f2622362967o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f1791546356o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f4294114084o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f1549135866o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f2052372632o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f138022462o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f320551380o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3093961111o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f417532438o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f2613738170o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3043420547o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f2733338669o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f1533304932o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3330577531o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f409023357o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f605690494o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f1729308581o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f516631402o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f4107648500o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f525470794o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f1883418244o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3509051507o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f2419746073o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f4113843561o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f2682233142o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f2965748063o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3026629111o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3673841935o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f2066101994o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f1389083141o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f2044521072o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f1171713368o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f412498424o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3142756672o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f2912347532o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3038321689o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3608503034o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3526447693o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3004145321o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3525759871o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f1722143242o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f2601003410o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f482146105o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3097077559o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f2870905701o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3820687120o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3373729898o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f1422356069o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f1690369866o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f687663648o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f1418482744o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f1368113235o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f73743564o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f3170853204o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f4112773695o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/26b63db2a8a3a392aeb79a9876ad7436c-f932516136o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2016-11-30T15:38:00.000Z",
        "address": {
            "street": "650-700 Waterford Dr",
            "city": "Florissant",
            "state": "MO",
            "zip": "63033",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.78881,
                "lng": -90.30088
            }
        },
        "details": {
            "rent": [
                777,
                932
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                624,
                927
            ],
            "pet_policy": {}
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1532186282/0060537773f5b43f9b9ede607c11d4c3c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1282633906/0060537773f5b43f9b9ede607c11d4c3c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1835522376/0060537773f5b43f9b9ede607c11d4c3c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/547312661/0060537773f5b43f9b9ede607c11d4c3c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/384286922/0060537773f5b43f9b9ede607c11d4c3c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1568027865/0060537773f5b43f9b9ede607c11d4c3c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2069176079/0060537773f5b43f9b9ede607c11d4c3c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/192747660/0060537773f5b43f9b9ede607c11d4c3c-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1553296802/0060537773f5b43f9b9ede607c11d4c3c-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1449318613/0060537773f5b43f9b9ede607c11d4c3c-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/81144631/0060537773f5b43f9b9ede607c11d4c3c-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1638536943/0060537773f5b43f9b9ede607c11d4c3c-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/14263845/0060537773f5b43f9b9ede607c11d4c3c-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1341040297/0060537773f5b43f9b9ede607c11d4c3c-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/178799553/0060537773f5b43f9b9ede607c11d4c3c-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1329386734/0060537773f5b43f9b9ede607c11d4c3c-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1928094064/0060537773f5b43f9b9ede607c11d4c3c-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1331351178/0060537773f5b43f9b9ede607c11d4c3c-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1281583738/0060537773f5b43f9b9ede607c11d4c3c-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1820862593/0060537773f5b43f9b9ede607c11d4c3c-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/625279936/0060537773f5b43f9b9ede607c11d4c3c-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/518446191/0060537773f5b43f9b9ede607c11d4c3c-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/603407517/0060537773f5b43f9b9ede607c11d4c3c-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/906650239/0060537773f5b43f9b9ede607c11d4c3c-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/104776455/0060537773f5b43f9b9ede607c11d4c3c-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1167925124/0060537773f5b43f9b9ede607c11d4c3c-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1969745154/0060537773f5b43f9b9ede607c11d4c3c-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1808379466/0060537773f5b43f9b9ede607c11d4c3c-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1760542151/0060537773f5b43f9b9ede607c11d4c3c-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2112861449/0060537773f5b43f9b9ede607c11d4c3c-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/68703623/0060537773f5b43f9b9ede607c11d4c3c-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2065076862/0060537773f5b43f9b9ede607c11d4c3c-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/33645525/0060537773f5b43f9b9ede607c11d4c3c-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/991066266/0060537773f5b43f9b9ede607c11d4c3c-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1982438485/0060537773f5b43f9b9ede607c11d4c3c-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1893149783/0060537773f5b43f9b9ede607c11d4c3c-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93793462/0060537773f5b43f9b9ede607c11d4c3c-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1809418848/0060537773f5b43f9b9ede607c11d4c3c-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2023318112/0060537773f5b43f9b9ede607c11d4c3c-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1981397981/0060537773f5b43f9b9ede607c11d4c3c-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1861466762/0060537773f5b43f9b9ede607c11d4c3c-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/956650272/0060537773f5b43f9b9ede607c11d4c3c-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1507283993/0060537773f5b43f9b9ede607c11d4c3c-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1305166976/0060537773f5b43f9b9ede607c11d4c3c-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/231708724/0060537773f5b43f9b9ede607c11d4c3c-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1764439048/0060537773f5b43f9b9ede607c11d4c3c-f45o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1783926393/0060537773f5b43f9b9ede607c11d4c3c-f46o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1432759601/0060537773f5b43f9b9ede607c11d4c3c-f47o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/656131928/0060537773f5b43f9b9ede607c11d4c3c-f48o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1622878206/0060537773f5b43f9b9ede607c11d4c3c-f49o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/610962018/0060537773f5b43f9b9ede607c11d4c3c-f50o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/360551355/0060537773f5b43f9b9ede607c11d4c3c-f51o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1637514434/0060537773f5b43f9b9ede607c11d4c3c-f52o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/60469343/0060537773f5b43f9b9ede607c11d4c3c-f53o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/905780431/0060537773f5b43f9b9ede607c11d4c3c-f54o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/161064568/0060537773f5b43f9b9ede607c11d4c3c-f55o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1335808308/0060537773f5b43f9b9ede607c11d4c3c-f56o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1848737504/0060537773f5b43f9b9ede607c11d4c3c-f57o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1356816932/0060537773f5b43f9b9ede607c11d4c3c-f58o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2016-08-05T15:32:00.000Z",
        "address": {
            "street": "11324 HI Tower Dr",
            "city": "Saint Ann",
            "state": "MO",
            "zip": "63074",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.73757,
                "lng": -90.39097
            }
        },
        "details": {
            "rent": [
                775,
                1225
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                1.5
            ],
            "size": [
                720,
                1950
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "East Post Point"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1428638263/0cbeca288de8d015e50bb7654b6172e3c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1372784191/0cbeca288de8d015e50bb7654b6172e3c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/107998618/0cbeca288de8d015e50bb7654b6172e3c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3583233663/0cbeca288de8d015e50bb7654b6172e3c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1735721391/0cbeca288de8d015e50bb7654b6172e3c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1580370624/0cbeca288de8d015e50bb7654b6172e3c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3899664809/0cbeca288de8d015e50bb7654b6172e3c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3553722921/0cbeca288de8d015e50bb7654b6172e3c-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4206488138/0cbeca288de8d015e50bb7654b6172e3c-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2299733907/0cbeca288de8d015e50bb7654b6172e3c-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/848669701/0cbeca288de8d015e50bb7654b6172e3c-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3536385473/0cbeca288de8d015e50bb7654b6172e3c-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3876006422/0cbeca288de8d015e50bb7654b6172e3c-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1020980096/0cbeca288de8d015e50bb7654b6172e3c-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/721940730/0cbeca288de8d015e50bb7654b6172e3c-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3972904474/0cbeca288de8d015e50bb7654b6172e3c-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/841428521/0cbeca288de8d015e50bb7654b6172e3c-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3594188119/0cbeca288de8d015e50bb7654b6172e3c-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3996378914/0cbeca288de8d015e50bb7654b6172e3c-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2157805901/0cbeca288de8d015e50bb7654b6172e3c-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4054171949/0cbeca288de8d015e50bb7654b6172e3c-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/526212061/0cbeca288de8d015e50bb7654b6172e3c-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3133500016/0cbeca288de8d015e50bb7654b6172e3c-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4079249271/0cbeca288de8d015e50bb7654b6172e3c-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2837908811/0cbeca288de8d015e50bb7654b6172e3c-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/614320907/0cbeca288de8d015e50bb7654b6172e3c-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2471824925/0cbeca288de8d015e50bb7654b6172e3c-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1091807757/0cbeca288de8d015e50bb7654b6172e3c-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3792449285/0cbeca288de8d015e50bb7654b6172e3c-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1594588351/0cbeca288de8d015e50bb7654b6172e3c-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3978334712/0cbeca288de8d015e50bb7654b6172e3c-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/850481413/0cbeca288de8d015e50bb7654b6172e3c-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1079218974/0cbeca288de8d015e50bb7654b6172e3c-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/917119991/0cbeca288de8d015e50bb7654b6172e3c-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3672063764/0cbeca288de8d015e50bb7654b6172e3c-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3775906883/0cbeca288de8d015e50bb7654b6172e3c-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3848908010/0cbeca288de8d015e50bb7654b6172e3c-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1722035757/0cbeca288de8d015e50bb7654b6172e3c-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2676948470/0cbeca288de8d015e50bb7654b6172e3c-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3633979270/0cbeca288de8d015e50bb7654b6172e3c-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/382461569/0cbeca288de8d015e50bb7654b6172e3c-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/607748476/0cbeca288de8d015e50bb7654b6172e3c-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3550623006/0cbeca288de8d015e50bb7654b6172e3c-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2919303165/0cbeca288de8d015e50bb7654b6172e3c-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1565354430/0cbeca288de8d015e50bb7654b6172e3c-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2084628614/0cbeca288de8d015e50bb7654b6172e3c-f45o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2678795682/0cbeca288de8d015e50bb7654b6172e3c-f46o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4094126674/0cbeca288de8d015e50bb7654b6172e3c-f47o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/342034780/0cbeca288de8d015e50bb7654b6172e3c-f48o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1850974342/0cbeca288de8d015e50bb7654b6172e3c-f49o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2016-08-13T13:58:00.000Z",
        "address": {
            "street": "2745 Rottingdean Dr",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63136",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.774737,
                "lng": -90.264208
            }
        },
        "details": {
            "rent": [
                570,
                670
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                1
            ],
            "size": [
                690,
                960
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f3585428720o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f3759950506o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f2988778562o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f1586566863o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f1183150288o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f3516338142o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f3113729273o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f4095529180o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f2253320074o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f1589513518o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f578098070o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f1722795635o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f1805606010o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f1103112987o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f2744774546o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f1437128886o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f2498242088o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f446895187o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f479233177o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f1042926927o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f2502027540o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f737482565o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f3604015818o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f2991357908o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f3193294218o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f1437844522o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f4210028755o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f3277130007o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f3630927713o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f120582031o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/76f6ff53f054b037d0153e3bbc703bdcc-f1351989091o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2016-08-05T15:32:00.000Z",
        "address": {
            "street": "3737 Ashby Rd",
            "city": "Saint Ann",
            "state": "MO",
            "zip": "63074",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.729988,
                "lng": -90.387373
            }
        },
        "details": {
            "rent": [
                700,
                785
            ],
            "beds": [
                0,
                1
            ],
            "baths": [
                1,
                1
            ],
            "size": [
                370,
                582
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f1867049327o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f1406085046o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f1140199407o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f1968388842o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f4210028755o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f1191909497o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f2574752404o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f3381688511o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f260522148o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f3063143504o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f1841516854o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f2540065534o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f128451524o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f1217229865o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f933916647o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f3000523524o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f1437844522o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f811827247o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f2502027540o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f566723695o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f3541726468o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f1536029071o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f3191194997o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/6be4e1b2d49a1d9f0461956655411a64c-f3982141776o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2016-11-24T14:20:00.000Z",
        "address": {
            "street": "4530 W Pine Blvd",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63108",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.640866,
                "lng": -90.259582
            }
        },
        "details": {
            "rent": [
                850,
                945
            ],
            "beds": [
                1,
                1
            ],
            "baths": [
                1,
                1
            ],
            "size": [
                600,
                600
            ],
            "pet_policy": {
                "cats": true,
                "dogs": false
            },
            "neighborhood": "Central West End"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/2070037336/63650f320e55ab8c7a77db21aed56e32c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3558751451/63650f320e55ab8c7a77db21aed56e32c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2448271427/63650f320e55ab8c7a77db21aed56e32c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1125553939/63650f320e55ab8c7a77db21aed56e32c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4267266183/63650f320e55ab8c7a77db21aed56e32c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3595542799/63650f320e55ab8c7a77db21aed56e32c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4086101731/63650f320e55ab8c7a77db21aed56e32c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/751369791/63650f320e55ab8c7a77db21aed56e32c-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4187972547/63650f320e55ab8c7a77db21aed56e32c-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/452406441/63650f320e55ab8c7a77db21aed56e32c-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2375129132/63650f320e55ab8c7a77db21aed56e32c-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3207264438/63650f320e55ab8c7a77db21aed56e32c-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/651238328/63650f320e55ab8c7a77db21aed56e32c-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2386556775/63650f320e55ab8c7a77db21aed56e32c-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1726597958/63650f320e55ab8c7a77db21aed56e32c-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2170265096/63650f320e55ab8c7a77db21aed56e32c-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2725241764/63650f320e55ab8c7a77db21aed56e32c-f16o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2016-02-17T09:47:00.000Z",
        "address": {
            "street": "11333 Sugar Pine Dr",
            "city": "Florissant",
            "state": "MO",
            "zip": "63033",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.774688,
                "lng": -90.274381
            }
        },
        "details": {
            "rent": [
                530,
                700
            ],
            "beds": [
                0,
                1
            ],
            "baths": [
                1,
                1
            ],
            "size": [
                375,
                543
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Wellington Arms"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1756342895/f724512b29be43c82d081849686f0573c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f724512b29be43c82d081849686f0573c-f3618834205o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f724512b29be43c82d081849686f0573c-f1900567844o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f724512b29be43c82d081849686f0573c-f2174798748o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f724512b29be43c82d081849686f0573c-f2629302345o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f724512b29be43c82d081849686f0573c-f3254821780o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f724512b29be43c82d081849686f0573c-f1088411132o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f724512b29be43c82d081849686f0573c-f922317757o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f724512b29be43c82d081849686f0573c-f554508103o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f724512b29be43c82d081849686f0573c-f2736219905o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f724512b29be43c82d081849686f0573c-f3119420022o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f724512b29be43c82d081849686f0573c-f16839391o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f724512b29be43c82d081849686f0573c-f1720967592o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f724512b29be43c82d081849686f0573c-f1953564795o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f724512b29be43c82d081849686f0573c-f3097219529o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2020-07-09T03:59:00.000Z",
        "address": {
            "street": "226 E Lockwood Ave",
            "city": "Webster Groves",
            "state": "MO",
            "zip": "63119",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.591651,
                "lng": -90.351293
            }
        },
        "details": {
            "rent": [
                1200,
                2300
            ],
            "beds": [
                0,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                488,
                1154
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/f8ff3324bf7a31022860dd3718774a95c-f1894192962o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f8ff3324bf7a31022860dd3718774a95c-f978433209o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f8ff3324bf7a31022860dd3718774a95c-f1165431139o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f8ff3324bf7a31022860dd3718774a95c-f3397087043o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f8ff3324bf7a31022860dd3718774a95c-f3543465286o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f8ff3324bf7a31022860dd3718774a95c-f4170521636o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f8ff3324bf7a31022860dd3718774a95c-f325971523o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f8ff3324bf7a31022860dd3718774a95c-f1938175962o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f8ff3324bf7a31022860dd3718774a95c-f1034009661o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f8ff3324bf7a31022860dd3718774a95c-f3798126899o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f8ff3324bf7a31022860dd3718774a95c-f2593485690o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f8ff3324bf7a31022860dd3718774a95c-f2571428991o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2020-04-25T05:43:00.000Z",
        "address": {
            "street": "4400 Manchester Ave",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63110",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.626308,
                "lng": -90.259877
            }
        },
        "details": {
            "rent": [
                700,
                1650
            ],
            "beds": [
                0,
                2
            ],
            "baths": [
                1,
                1
            ],
            "size": [
                365,
                993
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Forest Park South East"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/e64e42291c6b9a487208512b19ea45b1c-f3577102671o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e64e42291c6b9a487208512b19ea45b1c-f3068796828o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e64e42291c6b9a487208512b19ea45b1c-f3596309973o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e64e42291c6b9a487208512b19ea45b1c-f537621022o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e64e42291c6b9a487208512b19ea45b1c-f1299517464o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e64e42291c6b9a487208512b19ea45b1c-f3127146610o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e64e42291c6b9a487208512b19ea45b1c-f4172710496o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e64e42291c6b9a487208512b19ea45b1c-f2374331117o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e64e42291c6b9a487208512b19ea45b1c-f1739649746o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e64e42291c6b9a487208512b19ea45b1c-f3959100834o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e64e42291c6b9a487208512b19ea45b1c-f1468866354o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e64e42291c6b9a487208512b19ea45b1c-f3861105099o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2020-06-02T04:34:00.000Z",
        "address": {
            "street": "5539 Pershing Ave",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63112",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.648589,
                "lng": -90.280174
            }
        },
        "details": {
            "rent": [
                1000,
                1700
            ],
            "beds": [
                0,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                402,
                971
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "DeBaliviere Place"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f3382915977o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f2185921557o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f81391085o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f3641102078o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f2385632099o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f2234573168o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f174362443o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f4151190827o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f1959449789o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f1139666118o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f68655284o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f1974247590o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f1001206771o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f1389938728o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f3576586058o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f3249333425o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f284252288o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/18aa76106f61aad591400195b78cbe61c-f3524626494o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "724 Overlook Circle Dr",
            "city": "Manchester",
            "state": "MO",
            "zip": "63021",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.57264,
                "lng": -90.47891
            }
        },
        "details": {
            "rent": [
                805,
                1003
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                662,
                954
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Country Lane Woods"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/387467838/078ed53aa26ff18ea5377ee3cf379081c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/357174178/078ed53aa26ff18ea5377ee3cf379081c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/078ed53aa26ff18ea5377ee3cf379081c-f3020988678o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/078ed53aa26ff18ea5377ee3cf379081c-f1065065286o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/078ed53aa26ff18ea5377ee3cf379081c-f1310797163o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/078ed53aa26ff18ea5377ee3cf379081c-f2957330936o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/078ed53aa26ff18ea5377ee3cf379081c-f3274948328o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/078ed53aa26ff18ea5377ee3cf379081c-f4203378113o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/078ed53aa26ff18ea5377ee3cf379081c-f2878651451o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/078ed53aa26ff18ea5377ee3cf379081c-f3836804035o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/078ed53aa26ff18ea5377ee3cf379081c-f3247276o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/078ed53aa26ff18ea5377ee3cf379081c-f3128651476o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/078ed53aa26ff18ea5377ee3cf379081c-f2456738712o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/078ed53aa26ff18ea5377ee3cf379081c-f2559342405o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/078ed53aa26ff18ea5377ee3cf379081c-f2603554496o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/078ed53aa26ff18ea5377ee3cf379081c-f3657831491o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/078ed53aa26ff18ea5377ee3cf379081c-f1948024372o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2020-08-04T04:00:00.000Z",
        "address": {
            "street": "4525 Lindell Blvd",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63108",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.64313,
                "lng": -90.258742
            }
        },
        "details": {
            "rent": [
                1425,
                1625
            ],
            "beds": [
                3,
                3
            ],
            "baths": [
                2,
                2.5
            ],
            "size": [
                1200,
                1200
            ],
            "pet_policy": {
                "cats": true,
                "dogs": false
            },
            "neighborhood": "Central West End"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/9b852401387cc118db20a8dcf6989fd1c-f2546033132o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b852401387cc118db20a8dcf6989fd1c-f1755121411o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b852401387cc118db20a8dcf6989fd1c-f3686048950o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b852401387cc118db20a8dcf6989fd1c-f94423483o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b852401387cc118db20a8dcf6989fd1c-f659080695o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b852401387cc118db20a8dcf6989fd1c-f4254771165o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b852401387cc118db20a8dcf6989fd1c-f2819135459o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b852401387cc118db20a8dcf6989fd1c-f155084701o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b852401387cc118db20a8dcf6989fd1c-f3253540380o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b852401387cc118db20a8dcf6989fd1c-f453953444o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b852401387cc118db20a8dcf6989fd1c-f3960616247o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b852401387cc118db20a8dcf6989fd1c-f1823303260o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b852401387cc118db20a8dcf6989fd1c-f2270943161o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b852401387cc118db20a8dcf6989fd1c-f3469846085o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b852401387cc118db20a8dcf6989fd1c-f2490112853o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b852401387cc118db20a8dcf6989fd1c-f599077840o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "300 N 4th St",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63102",
            "country": "USA",
            "county": "ST. LOUIS CITY",
            "coordinates": {
                "lat": 38.628043,
                "lng": -90.187004
            }
        },
        "details": {
            "rent": [
                749,
                2380
            ],
            "beds": [
                0,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                500,
                1075
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Downtown East St. Louis"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/539901409/2922d7294ead62b7a9035ef83a141e7ec-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f539901409o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1328448645o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1519076828o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3028497079o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1999009335o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2753087543o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1457240628o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1640735182o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2707092113o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1963448660o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f57001186o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f989491586o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f991617294o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1816953010o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3542908428o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1541479189o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3227232491o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f4236033430o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f151937709o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1201449866o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2428543321o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1755489985o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2572620105o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2128401144o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3322098810o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3321117238o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f788058130o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2357620855o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1621375018o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f4186133382o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2628931909o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2994327875o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1318881322o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f562559559o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2267126367o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3399146387o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2494826656o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2215908885o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f4128361005o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f884361641o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2023565654o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1635790943o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2711361693o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f274312292o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3383372665o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2343314260o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2218840508o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2702519463o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3503241861o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1616650709o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f382441579o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3910555491o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2043268129o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2462598771o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f375593308o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3342219946o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f61875432o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2109343990o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3035628021o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3942964404o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2837296901o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f402802457o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1264170784o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1286469988o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3087036996o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3507824470o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1623281522o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f237481155o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f257640235o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3506286630o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1071162705o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3636324403o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3705458173o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f940020406o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f425422266o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f698640321o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1379067987o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2010928837o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f4278486920o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3160971863o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1194765809o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2847126624o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2836531103o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f111971413o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f727330203o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3808489536o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f853629166o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1010302132o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3807112326o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2794238523o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f40045690o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1566478232o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1979556413o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f4198050398o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1809823705o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3306279359o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3293582493o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1905409347o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f4005166814o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3744850811o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2379488593o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3642522103o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f116221256o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2994526338o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3939924825o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f465292733o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f526318673o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3461660864o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f1814009855o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2876306724o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2760273662o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f7486615o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f309034402o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2477874307o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f488682626o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f3550515212o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f144753831o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2136988644o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922d7294ead62b7a9035ef83a141e7ec-f2454132609o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2018-08-20T17:22:00.000Z",
        "address": {
            "street": "1519 Tower Grove Ave",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63110",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.62272,
                "lng": -90.25637
            }
        },
        "details": {
            "rent": [
                1285,
                2125
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                636,
                1877
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Forest Park South East"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/981267698/94f60c1950babf007a559123baccdfb8c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/992119342/94f60c1950babf007a559123baccdfb8c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1854983551/94f60c1950babf007a559123baccdfb8c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3296085061/94f60c1950babf007a559123baccdfb8c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/821567283/94f60c1950babf007a559123baccdfb8c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2224501141/94f60c1950babf007a559123baccdfb8c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2690599803/94f60c1950babf007a559123baccdfb8c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/741059710/94f60c1950babf007a559123baccdfb8c-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/992119342/94f60c1950babf007a559123baccdfb8c-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1854983551/94f60c1950babf007a559123baccdfb8c-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3296085061/94f60c1950babf007a559123baccdfb8c-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/821567283/94f60c1950babf007a559123baccdfb8c-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2224501141/94f60c1950babf007a559123baccdfb8c-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2690599803/94f60c1950babf007a559123baccdfb8c-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/741059710/94f60c1950babf007a559123baccdfb8c-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1385983415/94f60c1950babf007a559123baccdfb8c-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2802244619/94f60c1950babf007a559123baccdfb8c-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3537956038/94f60c1950babf007a559123baccdfb8c-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1192419127/94f60c1950babf007a559123baccdfb8c-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/796908450/94f60c1950babf007a559123baccdfb8c-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3018104018/94f60c1950babf007a559123baccdfb8c-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3997491865/94f60c1950babf007a559123baccdfb8c-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/900484620/94f60c1950babf007a559123baccdfb8c-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/707605805/94f60c1950babf007a559123baccdfb8c-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3822969159/94f60c1950babf007a559123baccdfb8c-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1385983415/94f60c1950babf007a559123baccdfb8c-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2802244619/94f60c1950babf007a559123baccdfb8c-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3537956038/94f60c1950babf007a559123baccdfb8c-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1192419127/94f60c1950babf007a559123baccdfb8c-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/796908450/94f60c1950babf007a559123baccdfb8c-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3018104018/94f60c1950babf007a559123baccdfb8c-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3997491865/94f60c1950babf007a559123baccdfb8c-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/900484620/94f60c1950babf007a559123baccdfb8c-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/707605805/94f60c1950babf007a559123baccdfb8c-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3822969159/94f60c1950babf007a559123baccdfb8c-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4000122741/94f60c1950babf007a559123baccdfb8c-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1878324415/94f60c1950babf007a559123baccdfb8c-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1462952590/94f60c1950babf007a559123baccdfb8c-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2581081108/94f60c1950babf007a559123baccdfb8c-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1376379162/94f60c1950babf007a559123baccdfb8c-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1226583186/94f60c1950babf007a559123baccdfb8c-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1089432226/94f60c1950babf007a559123baccdfb8c-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3055551691/94f60c1950babf007a559123baccdfb8c-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3794967208/94f60c1950babf007a559123baccdfb8c-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/103919166/94f60c1950babf007a559123baccdfb8c-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2745503075/94f60c1950babf007a559123baccdfb8c-f45o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3349744693/94f60c1950babf007a559123baccdfb8c-f46o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1006619012/94f60c1950babf007a559123baccdfb8c-f47o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4257693939/94f60c1950babf007a559123baccdfb8c-f48o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2131466199/94f60c1950babf007a559123baccdfb8c-f49o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2396645804/94f60c1950babf007a559123baccdfb8c-f50o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3695020888/94f60c1950babf007a559123baccdfb8c-f51o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/331241436/94f60c1950babf007a559123baccdfb8c-f52o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1923020622/94f60c1950babf007a559123baccdfb8c-f53o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2568051548/94f60c1950babf007a559123baccdfb8c-f54o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3461143535/94f60c1950babf007a559123baccdfb8c-f55o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2357456637/94f60c1950babf007a559123baccdfb8c-f56o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2136110336/94f60c1950babf007a559123baccdfb8c-f57o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1360751289/94f60c1950babf007a559123baccdfb8c-f58o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/595309919/94f60c1950babf007a559123baccdfb8c-f59o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64009690/94f60c1950babf007a559123baccdfb8c-f60o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2117090914/94f60c1950babf007a559123baccdfb8c-f61o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3245463183/94f60c1950babf007a559123baccdfb8c-f62o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/114378654/94f60c1950babf007a559123baccdfb8c-f63o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2791641311/94f60c1950babf007a559123baccdfb8c-f64o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3537956038/94f60c1950babf007a559123baccdfb8c-f65o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/796908450/94f60c1950babf007a559123baccdfb8c-f66o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3018104018/94f60c1950babf007a559123baccdfb8c-f67o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1192419127/94f60c1950babf007a559123baccdfb8c-f68o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3997491865/94f60c1950babf007a559123baccdfb8c-f69o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/900484620/94f60c1950babf007a559123baccdfb8c-f70o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1385983415/94f60c1950babf007a559123baccdfb8c-f71o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2802244619/94f60c1950babf007a559123baccdfb8c-f72o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/707605805/94f60c1950babf007a559123baccdfb8c-f73o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3822969159/94f60c1950babf007a559123baccdfb8c-f74o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2224501141/94f60c1950babf007a559123baccdfb8c-f75o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2690599803/94f60c1950babf007a559123baccdfb8c-f76o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/741059710/94f60c1950babf007a559123baccdfb8c-f77o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/992119342/94f60c1950babf007a559123baccdfb8c-f78o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1854983551/94f60c1950babf007a559123baccdfb8c-f79o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3296085061/94f60c1950babf007a559123baccdfb8c-f80o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/821567283/94f60c1950babf007a559123baccdfb8c-f81o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3457586017/94f60c1950babf007a559123baccdfb8c-f82o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1005346600/94f60c1950babf007a559123baccdfb8c-f83o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2981980321/94f60c1950babf007a559123baccdfb8c-f84o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2486812431/94f60c1950babf007a559123baccdfb8c-f85o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1419679340/94f60c1950babf007a559123baccdfb8c-f86o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1673580408/94f60c1950babf007a559123baccdfb8c-f87o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/229110555/94f60c1950babf007a559123baccdfb8c-f88o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3028343008/94f60c1950babf007a559123baccdfb8c-f89o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1734531419/94f60c1950babf007a559123baccdfb8c-f90o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2706828893/94f60c1950babf007a559123baccdfb8c-f91o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1573615198/94f60c1950babf007a559123baccdfb8c-f92o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f266111101o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f4009074072o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f1970768098o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f502858432o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f1810646183o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f3258119923o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f1732110709o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f3975666140o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f2598193022o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f1920511951o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f1627851063o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f3957731790o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f243877835o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f1440198431o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f1129895040o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f4080160052o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f303337220o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f1298774779o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f2139113451o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f1386986868o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f992451206o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f4044469101o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f2337005o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f2902592537o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/94f60c1950babf007a559123baccdfb8c-f1468803300o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2016-04-01T10:38:00.000Z",
        "address": {
            "street": "12831 Daylight Dr",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63131",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.60634,
                "lng": -90.4569
            }
        },
        "details": {
            "rent": [
                1202,
                2575
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                590,
                1365
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Town and Country"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3277094978o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f1756565149o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/486787202/4546c1d34da382d19b98a8e65adb4903c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3606659271/4546c1d34da382d19b98a8e65adb4903c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/249472985/4546c1d34da382d19b98a8e65adb4903c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1143412536/4546c1d34da382d19b98a8e65adb4903c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3438598515/4546c1d34da382d19b98a8e65adb4903c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2330947998/4546c1d34da382d19b98a8e65adb4903c-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2287220706/4546c1d34da382d19b98a8e65adb4903c-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/240222298/4546c1d34da382d19b98a8e65adb4903c-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/565336570/4546c1d34da382d19b98a8e65adb4903c-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1920510074/4546c1d34da382d19b98a8e65adb4903c-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1794385335/4546c1d34da382d19b98a8e65adb4903c-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922824889/4546c1d34da382d19b98a8e65adb4903c-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4075657561/4546c1d34da382d19b98a8e65adb4903c-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1989306805/4546c1d34da382d19b98a8e65adb4903c-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3765791757/4546c1d34da382d19b98a8e65adb4903c-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1720238738/4546c1d34da382d19b98a8e65adb4903c-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2766169671/4546c1d34da382d19b98a8e65adb4903c-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/702753319/4546c1d34da382d19b98a8e65adb4903c-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/179328399/4546c1d34da382d19b98a8e65adb4903c-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1818908481/4546c1d34da382d19b98a8e65adb4903c-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2455571260/4546c1d34da382d19b98a8e65adb4903c-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4094160275/4546c1d34da382d19b98a8e65adb4903c-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/542202968/4546c1d34da382d19b98a8e65adb4903c-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3508691990/4546c1d34da382d19b98a8e65adb4903c-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1719204679/4546c1d34da382d19b98a8e65adb4903c-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2996964050/4546c1d34da382d19b98a8e65adb4903c-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3319203411/4546c1d34da382d19b98a8e65adb4903c-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3409886345/4546c1d34da382d19b98a8e65adb4903c-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1495452647/4546c1d34da382d19b98a8e65adb4903c-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2678848074/4546c1d34da382d19b98a8e65adb4903c-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2259951831/4546c1d34da382d19b98a8e65adb4903c-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1604930224/4546c1d34da382d19b98a8e65adb4903c-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4276666651/4546c1d34da382d19b98a8e65adb4903c-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2813251536/4546c1d34da382d19b98a8e65adb4903c-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3080519246/4546c1d34da382d19b98a8e65adb4903c-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2841908656/4546c1d34da382d19b98a8e65adb4903c-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1166750689/4546c1d34da382d19b98a8e65adb4903c-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1353178404/4546c1d34da382d19b98a8e65adb4903c-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1870151589/4546c1d34da382d19b98a8e65adb4903c-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3583951220/4546c1d34da382d19b98a8e65adb4903c-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/354111378/4546c1d34da382d19b98a8e65adb4903c-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1076027714/4546c1d34da382d19b98a8e65adb4903c-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1351743998/4546c1d34da382d19b98a8e65adb4903c-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/377514906/4546c1d34da382d19b98a8e65adb4903c-f45o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1145238066/4546c1d34da382d19b98a8e65adb4903c-f46o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2677957414/4546c1d34da382d19b98a8e65adb4903c-f47o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1817748788/4546c1d34da382d19b98a8e65adb4903c-f48o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f936305012o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f4095400685o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3497791055o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f2932630602o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f4137001809o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3270521362o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f1992834306o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f4245753052o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3584898650o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3976296718o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f2036335124o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f298365076o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3850679436o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f1782480296o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f1303273009o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f1019471774o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f2267555541o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f670012455o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f2331168540o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f1716550447o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f1901920663o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f2805359414o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3568167230o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f2969296205o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f2752277177o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f2290868528o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f4236742356o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3996599701o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3112511198o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3714835874o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f2968320679o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3280261365o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f2694667196o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3374464516o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f1940101702o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f620620869o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3131183168o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3673665596o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3892215093o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3364562270o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f146434057o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f1623754947o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f2472086733o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f644598571o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f1809966064o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f2692166312o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3514642676o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f261959228o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3709325846o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f1086367365o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3398931414o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f947469380o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f1008910526o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f2048446267o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f235157017o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f1885947685o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f3512766071o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f351863014o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f462789425o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f2973012255o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f2186720258o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f1916506501o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4546c1d34da382d19b98a8e65adb4903c-f806562354o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2017-11-17T22:27:00.000Z",
        "address": {
            "street": "5700 Highlands Plaza Dr",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63110",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.62834,
                "lng": -90.28315
            }
        },
        "details": {
            "rent": [
                1319,
                2231
            ],
            "beds": [
                0,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                572,
                1712
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Cheltenham"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1792629871/ba39365ae19e33d7dc1f0723f194d7b1c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3708736113o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3326820707o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3706876027o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3744268293o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2196514795o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2148397637o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3080633058o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f790610191o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2675433645o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1876553693o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f4028074422o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3988052271o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3872672230o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3393633106o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f134513454o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f4252102435o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f225480938o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1149903051o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3811194760o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1848771161o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2565130244o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2855495767o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1720424011o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3967243948o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f4053511290o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2354378523o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2821658239o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f4245660692o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3297377858o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2894228868o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2644895811o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f4257240721o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1539512216o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3926489794o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f4107746088o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3415734943o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3908660435o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3160672718o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2750805265o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2705684270o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2109796580o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f594348982o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1600920023o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3108200115o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2517253744o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f168631508o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3675073289o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2303989886o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2095704155o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f113021758o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2011560265o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f98357709o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3043650402o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2824478722o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f4154454520o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3087886612o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1215758442o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f4107103084o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3187504007o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1893133613o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3865998169o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1157462719o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2671665051o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f4194797759o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1149546476o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f853806584o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2559861485o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3917638824o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1110994104o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1044143565o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f4229854537o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f234840263o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f451766682o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f123351516o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1902425230o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1543799162o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2543228031o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f716974826o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f959962310o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f2910215170o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1893496599o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3462189037o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1702963591o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1960804260o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1830909758o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f4128925963o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f973304393o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3617933200o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f854694081o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1922722947o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f446430224o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f514229029o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3500717755o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3216234927o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1452619654o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f204698412o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3076383329o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f882198931o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1440138103o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f626544068o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f3727581355o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f843286424o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f570617131o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f585990514o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1856889617o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba39365ae19e33d7dc1f0723f194d7b1c-f1297742396o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "4567 W Pine Blvd",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63108",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.64198,
                "lng": -90.26109
            }
        },
        "details": {
            "rent": [
                1882,
                4938
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                634,
                1736
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Central West End"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2672660735o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2672660735o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2170464434o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1188483240o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3200236584o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1159071884o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f4138147936o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1423310569o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2775029963o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1981294474o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1426699717o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3716944946o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f4248847043o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3789049161o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1670719719o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3251264536o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f864087257o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2395203287o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f4117886533o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f91713964o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1306610827o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1382754073o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1907718146o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2294473368o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2871597495o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2212384678o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1113604784o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f4010752470o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2383943321o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3530074532o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1597921532o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3219918751o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3979649096o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1597356999o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f946055773o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1765278736o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f56802302o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2155138187o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f515857860o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f4228658020o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3899473499o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3379164355o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1251710760o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1327454776o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f264894266o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1031231896o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3042270842o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3286461005o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2475413571o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3316766568o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f18983914o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f899207055o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1951218410o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1668588778o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2254893091o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3130341656o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2373772965o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2847528185o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2328570221o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3254687468o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1261247506o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f956651869o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f4247336675o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f288783830o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f395543303o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f4270488865o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f4065587265o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1506354247o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2076622009o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f520567856o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3617200976o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3949470390o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3658349440o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1269907854o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2538473792o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f699488942o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3345422432o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f3608650722o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2697121748o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1015979034o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1294447681o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f2119349434o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f965567166o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f1274414o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4461dee39555bd13bad9e55c974f4f2c-f662790866o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "10871 Chase Park Ln",
            "city": "Creve Coeur",
            "state": "MO",
            "zip": "63141",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.67369,
                "lng": -90.41909
            }
        },
        "details": {
            "rent": [
                970,
                1299
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                809,
                1069
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f1289829209o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f1289829209o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3818310108o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f1941694070o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2420836433o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f1469324713o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f1842410498o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3669591469o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3034934163o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2221348653o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f1740087426o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f693750474o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f427838848o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3865095546o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3697859588o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f4001002034o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f1593458121o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3921218653o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f4164980130o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2319792859o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3357685611o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3662846682o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2669324055o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2684905256o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f36366018o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f469350374o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3766017495o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2135287978o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f1739461287o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2900265636o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f586261393o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f1287382200o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2925785997o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3811980097o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f1305119182o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3873027251o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3455183237o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f1447584691o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f1429864482o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2184558446o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3698149406o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2505159937o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2601036060o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f476254789o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3834296284o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f1142026767o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3058540620o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f276625174o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f23804598o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3628578916o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2591516532o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f254724759o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f911161404o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2641237489o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2754219281o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2722915386o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3404891523o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f1901358240o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f232291430o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3139245664o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3947971318o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f1237527984o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f3200912989o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f797435100o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2825480718o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f555605686o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ec9339466bf23b97d0a59de73651ace6c-f2776574850o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "400 N 4th St",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63102",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.628957,
                "lng": -90.186671
            }
        },
        "details": {
            "rent": [
                635,
                1025
            ],
            "beds": [
                0,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                500,
                1050
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Downtown East St. Louis"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1316643704/f729b8dd273bcaf37bdf4babec8b4689c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1524799136/f729b8dd273bcaf37bdf4babec8b4689c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1594353239/f729b8dd273bcaf37bdf4babec8b4689c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3588341249/f729b8dd273bcaf37bdf4babec8b4689c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/308011083/f729b8dd273bcaf37bdf4babec8b4689c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2834403248/f729b8dd273bcaf37bdf4babec8b4689c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/450900316/f729b8dd273bcaf37bdf4babec8b4689c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2828806910/f729b8dd273bcaf37bdf4babec8b4689c-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2587952114/f729b8dd273bcaf37bdf4babec8b4689c-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3619200515/f729b8dd273bcaf37bdf4babec8b4689c-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4015929279/f729b8dd273bcaf37bdf4babec8b4689c-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2607776474/f729b8dd273bcaf37bdf4babec8b4689c-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3499314192/f729b8dd273bcaf37bdf4babec8b4689c-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4083605066/f729b8dd273bcaf37bdf4babec8b4689c-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1515726545/f729b8dd273bcaf37bdf4babec8b4689c-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3561586303/f729b8dd273bcaf37bdf4babec8b4689c-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2048658303/f729b8dd273bcaf37bdf4babec8b4689c-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2744299094/f729b8dd273bcaf37bdf4babec8b4689c-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2321473813/f729b8dd273bcaf37bdf4babec8b4689c-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3864710327/f729b8dd273bcaf37bdf4babec8b4689c-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4239644138/f729b8dd273bcaf37bdf4babec8b4689c-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4290722683/f729b8dd273bcaf37bdf4babec8b4689c-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2240807222/f729b8dd273bcaf37bdf4babec8b4689c-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3789249569/f729b8dd273bcaf37bdf4babec8b4689c-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3561236783/f729b8dd273bcaf37bdf4babec8b4689c-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/694495995/f729b8dd273bcaf37bdf4babec8b4689c-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3382008279/f729b8dd273bcaf37bdf4babec8b4689c-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1589517206/f729b8dd273bcaf37bdf4babec8b4689c-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2033151822/f729b8dd273bcaf37bdf4babec8b4689c-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/755647927/f729b8dd273bcaf37bdf4babec8b4689c-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4064401300/f729b8dd273bcaf37bdf4babec8b4689c-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3854359177/f729b8dd273bcaf37bdf4babec8b4689c-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4152750724/f729b8dd273bcaf37bdf4babec8b4689c-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2680668157/f729b8dd273bcaf37bdf4babec8b4689c-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/91507008/f729b8dd273bcaf37bdf4babec8b4689c-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/505123044/f729b8dd273bcaf37bdf4babec8b4689c-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2678534232/f729b8dd273bcaf37bdf4babec8b4689c-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3379547869/f729b8dd273bcaf37bdf4babec8b4689c-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3922454760/f729b8dd273bcaf37bdf4babec8b4689c-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1146335636/f729b8dd273bcaf37bdf4babec8b4689c-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1599538099/f729b8dd273bcaf37bdf4babec8b4689c-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1038872098/f729b8dd273bcaf37bdf4babec8b4689c-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2100319917/f729b8dd273bcaf37bdf4babec8b4689c-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1808710329/f729b8dd273bcaf37bdf4babec8b4689c-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2185078741/f729b8dd273bcaf37bdf4babec8b4689c-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1602648023/f729b8dd273bcaf37bdf4babec8b4689c-f45o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1060643624/f729b8dd273bcaf37bdf4babec8b4689c-f46o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2178258605/f729b8dd273bcaf37bdf4babec8b4689c-f47o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2663044419/f729b8dd273bcaf37bdf4babec8b4689c-f48o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922621689/f729b8dd273bcaf37bdf4babec8b4689c-f49o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/428675643/f729b8dd273bcaf37bdf4babec8b4689c-f50o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/227221838/f729b8dd273bcaf37bdf4babec8b4689c-f51o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/776017737/f729b8dd273bcaf37bdf4babec8b4689c-f52o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/880637267/f729b8dd273bcaf37bdf4babec8b4689c-f53o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "8300 Delmar Blvd",
            "city": "Clayton",
            "state": "MO",
            "zip": "63124",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.66022,
                "lng": -90.35159
            }
        },
        "details": {
            "rent": [
                1895,
                5095
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                768,
                2477
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Mansions on the Plaza Condominiums"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f4228963752o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f4228963752o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f200343556o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f3228453668o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f2112529922o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f2491263118o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f3033909866o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f2478269933o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f3168704897o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f3938202918o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f1547472427o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f3698782790o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f716405804o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f3252302767o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f1413186483o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f2528174621o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f1432987065o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f123151260o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f1739012918o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f2576805295o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f616671254o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f2457317348o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f1183024428o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f3950868082o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f3987508371o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f2203641033o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f903733337o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f1141311205o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f2558154772o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f4281995109o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f295493910o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f3032602023o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f3781927206o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f2874112794o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f2578015510o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f3585677921o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f749036363o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f371201534o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f177287936o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f4126495415o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f1743597802o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f2202532425o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f4111824607o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f3147232516o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f4139700714o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f3864877829o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f2383476086o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f3046242654o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f2523163746o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f3913216133o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f3955087432o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a8414a44759dbeadb3e6dd5fd0277ed6c-f2747995519o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "12400 Lighthouse Way Dr",
            "city": "Creve Coeur",
            "state": "MO",
            "zip": "63141",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.672024,
                "lng": -90.460592
            }
        },
        "details": {
            "rent": [
                945,
                1225
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                730,
                930
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f1046351045o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f1203483194o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f72064254o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f982577432o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f3360767381o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f3171716837o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f789946743o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f1664735211o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f9764799o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f2385606969o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f3681694400o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f927217843o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f191504823o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f1476276080o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f2013629122o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f1166367775o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f348119602o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f2436419862o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f560966614o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f3384257516o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f2828122175o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f236090786o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f3377232690o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f3628630064o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f1559038294o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f2892643299o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f3745411102o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f3566430187o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f1189959422o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f3689816050o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f3509122600o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f4109016324o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f2411665960o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f263399676o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f2215884923o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f2755111510o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f285054959o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f99816119o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f4025036457o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f387773857o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f2992865116o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f3679192316o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f4024138693o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f3444793693o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f3185508453o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/46088b88376029711c662e8da7656f3dc-f3989588205o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "1173 Pompeii Dr",
            "city": "Chesterfield",
            "state": "MO",
            "zip": "63017",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.68244,
                "lng": -90.49764
            }
        },
        "details": {
            "rent": [
                945,
                1395
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                610,
                1290
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Forum Condominiums"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f93734267o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f1275138680o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f2793490873o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f654958784o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f4148349843o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f2623159930o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f1877605022o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f1315545142o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f2155337191o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f537153453o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f50923976o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f1306792229o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f1201547226o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f490427552o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f4199991333o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f2345072613o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f2383960585o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f1029664210o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f4071893679o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f1277356543o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f2479510207o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f3103896894o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f3379977835o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f2307030009o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f1080729860o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f3886031832o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f1733450022o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f1185267489o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f1087729896o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f2656894767o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f3273669526o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f2187822086o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f962458236o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f2897697329o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f4180325372o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f3329690128o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f2221957625o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f4164962841o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f3140380076o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f1258875487o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f3677157110o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f1597667741o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f1181108533o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/034ceabaa306ee26b7e37759198346e6c-f4268652218o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "8342 Delcrest Dr",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63124",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.65826,
                "lng": -90.354138
            }
        },
        "details": {
            "rent": [
                1474,
                2030
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                625,
                1410
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Delcrest"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f1362227398o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f3226763673o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f1640829415o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f752466985o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f2508508150o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f3519849607o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f3633938549o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f203178074o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f121821968o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f1930615644o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f2973879307o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f1647761148o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f2829136921o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f345998432o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f2206643663o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f3135255165o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f2677472542o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f2673395826o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f40222779o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f1023768619o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f397663170o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f430410464o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f3369030636o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f1819600696o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f2375855650o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f2671644008o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f2965688785o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f3939584998o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f2878689375o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f2467393873o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f1011645185o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f4089626819o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f2834330242o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f3220048698o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f748982142o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f3997080603o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f2358808304o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b38cf0c948a3f2a92d9d81012a07d60cc-f3511838086o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "7880 Chatwell Dr",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63119",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.57389,
                "lng": -90.33834
            }
        },
        "details": {
            "rent": [
                745,
                1350
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2.5
            ],
            "size": [
                729,
                1504
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1563913559/75dc531c2ff1ad25f71458f1362a0f76c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f3765337853o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f3371136513o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f3263530191o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f3233076624o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f1103245833o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f1246527302o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f2656718006o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f3215646896o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f2574236353o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f783418310o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f4131506966o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f1184406710o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f1657213777o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f2075783761o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f802990832o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f51516820o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f1521866994o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f404663673o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f1211950151o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f2149295287o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f1953958856o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f2006923424o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f2517065657o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f446206598o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f4269825048o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f1683124876o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f3053369148o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f1557066914o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f310271209o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f2385442413o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f469146752o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f717670053o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f3090470396o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f2743989760o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc531c2ff1ad25f71458f1362a0f76c-f1164926893o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2018-12-28T09:36:00.000Z",
        "address": {
            "street": "1 Cardinal Way",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63102",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.6238,
                "lng": -90.19102
            }
        },
        "details": {
            "rent": [
                1510,
                7935
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                571,
                2573
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Downtown East St. Louis"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f997563287o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f1784776237o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f1610554784o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f3512809851o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f1828647180o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f3319617930o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f2596339283o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f4043398395o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f1192498568o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f2469978807o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f903287801o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f3947777840o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f2234598560o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f663447397o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f2169363095o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f2357960751o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f26383840o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f1249990178o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f354848812o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f2360991637o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f997889545o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f2714316873o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f1237002781o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f1933968020o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f2364489183o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f2590513444o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f338454057o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f1057430144o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/75dc8d870c0a9cda27b409c85c72ce65c-f738186296o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2018-08-20T17:22:00.000Z",
        "address": {
            "street": "1706 Washington Ave",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63103",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.63297,
                "lng": -90.20393
            }
        },
        "details": {
            "rent": [
                1015,
                2145
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                558,
                1196
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Downtown West St. Louis"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/2129305442/daece7de393f96fc5868eff6a4e21fcec-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f1514273506o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f2678742211o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f3306570371o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f3717347981o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f2747325572o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f2251830117o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f2815205643o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f3826718605o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f3446742915o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f867580743o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f2360357157o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f4083419559o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f3935227317o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f3791848149o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f1819815686o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f597988327o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f1679833882o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f3003703937o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f3479624571o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f3104220478o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f3463904581o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f2947283347o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f1680395119o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/daece7de393f96fc5868eff6a4e21fcec-f2330817985o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2019-06-02T04:31:00.000Z",
        "address": {
            "street": "1418 Carroll St",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63104",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.614082,
                "lng": -90.208289
            }
        },
        "details": {
            "rent": [
                995,
                1850
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2.5
            ],
            "size": [
                518,
                1294
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Peabody Darst Webbe"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/0302a8ef88bd0ef875f1845681e327f7c-f1703809736o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0302a8ef88bd0ef875f1845681e327f7c-f238623020o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0302a8ef88bd0ef875f1845681e327f7c-f4155851148o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0302a8ef88bd0ef875f1845681e327f7c-f104695275o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0302a8ef88bd0ef875f1845681e327f7c-f3343637194o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0302a8ef88bd0ef875f1845681e327f7c-f110831061o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0302a8ef88bd0ef875f1845681e327f7c-f2151112622o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0302a8ef88bd0ef875f1845681e327f7c-f1610993258o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0302a8ef88bd0ef875f1845681e327f7c-f1231321726o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0302a8ef88bd0ef875f1845681e327f7c-f19912979o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0302a8ef88bd0ef875f1845681e327f7c-f1851575322o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0302a8ef88bd0ef875f1845681e327f7c-f210470508o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0302a8ef88bd0ef875f1845681e327f7c-f3436835702o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0302a8ef88bd0ef875f1845681e327f7c-f3012253975o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2019-03-16T04:41:00.000Z",
        "address": {
            "street": "6300 Clayton Ave",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63139",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.62827,
                "lng": -90.29172
            }
        },
        "details": {
            "rent": [
                1210,
                2325
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                626,
                1027
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Clayton - Tamm"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/b0ef3a0c7626579958b4eef6319aa4e2c-f4191303966o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b0ef3a0c7626579958b4eef6319aa4e2c-f816079116o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b0ef3a0c7626579958b4eef6319aa4e2c-f3838827081o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b0ef3a0c7626579958b4eef6319aa4e2c-f195124551o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b0ef3a0c7626579958b4eef6319aa4e2c-f1134985184o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b0ef3a0c7626579958b4eef6319aa4e2c-f1062771606o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b0ef3a0c7626579958b4eef6319aa4e2c-f1672947295o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b0ef3a0c7626579958b4eef6319aa4e2c-f1805958680o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b0ef3a0c7626579958b4eef6319aa4e2c-f2448154470o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b0ef3a0c7626579958b4eef6319aa4e2c-f2163923861o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/b0ef3a0c7626579958b4eef6319aa4e2c-f2986430015o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "4535 Forest Park Ave",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63108",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.639193,
                "lng": -90.26117
            }
        },
        "details": {
            "rent": [
                1525,
                2495
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                695,
                1340
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Central West End"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/ba5be41e9a748bdfa34bb826adb5b799c-f3007830585o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ba5be41e9a748bdfa34bb826adb5b799c-f2121145772o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2018-11-02T03:26:00.000Z",
        "address": {
            "street": "2232 S Grand Blvd",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63104",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.610339,
                "lng": -90.240038
            }
        },
        "details": {
            "rent": [
                1099,
                2100
            ],
            "beds": [
                0,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                532,
                1245
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Compton Heights"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/bf0d05ad809ea9c48721a426e877fc40c-f209033212o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2016-06-01T13:15:00.000Z",
        "address": {
            "street": "40 N Kingshighway Blvd",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63108",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.641904,
                "lng": -90.264603
            }
        },
        "details": {
            "rent": [
                1095,
                4595
            ],
            "beds": [
                0,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                436,
                2400
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Central West End"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3766985807o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1900678304o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f341229594o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f74407284o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f997071275o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f145104217o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3334747619o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3039398083o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2610039816o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2549722098o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1746882739o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2170786619o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1319353362o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3254877761o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1071366075o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3164594707o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3148474551o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3657835319o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3427452760o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1384268031o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1186272078o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f668341426o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1353708421o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1720219550o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1612067806o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2143080541o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1474623010o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2627073577o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2350967163o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f598769081o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2231064439o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f4190743537o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f377457309o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f397996748o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3649810404o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3229436002o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2884652818o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3728800346o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2966912646o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1720712443o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2812358156o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3868856953o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1565936968o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2932743980o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f412007532o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2222339504o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1054834588o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f75200332o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3380876551o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1908199808o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3450552214o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2815501527o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f613154022o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f4092420940o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1782655953o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f127437231o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f613192742o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f4058658331o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2616966400o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1954440111o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1608434376o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f112116158o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2330250719o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2988015853o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3294308085o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3810443016o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2753538226o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3866445001o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f249852829o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2187087993o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f170531409o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3522481672o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1279979581o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2146218855o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f6076913o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f15054711o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f829605506o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1350438304o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f294977483o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1572470968o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3442585245o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2765684984o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1962607896o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3067885240o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f660849040o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2189308153o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f4006864004o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2492879183o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2769633292o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2953060018o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f205260802o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2217365337o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2646071508o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3179224510o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f638747471o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2075759826o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3682932504o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3838460489o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3840176104o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3424717538o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f336324877o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f868081290o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3036430478o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3728800346o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2476459063o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f947034884o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1064808406o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3788778554o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f236616994o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2788544884o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2722113158o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1586795598o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f4121152612o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f374558990o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1840912556o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f492493549o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2395988878o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2952665060o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1053403894o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2462004924o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1674488403o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2939370335o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3813256330o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3325247261o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2629126964o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f384307777o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1668240746o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2388661127o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1389472931o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3745153414o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f4170866768o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3990808545o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2844889135o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1999952560o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3787587709o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2680732935o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f4279087096o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f4264804126o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1723633058o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f693397674o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3130725149o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f4038215865o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f19200918o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f4044011078o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3466966029o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1416586793o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3563147521o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2611369459o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f749759433o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f526129965o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3912019993o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3457282040o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3001005033o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2874512460o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f4103001105o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3628163902o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3083850341o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3355936257o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2973964370o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f4068302693o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2974571986o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f438522611o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f487110833o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2750646293o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1212802832o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2103832854o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2632187036o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2951619834o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f263240802o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f1330832018o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2252694455o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f243138742o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3952283353o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3361759268o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3036412139o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3346052241o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f395840730o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2973754932o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3060228112o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3817619832o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2312286628o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2500989165o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f3665586522o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/64ab873524f346534532d38a7ccd80eac-f2343264129o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "6960 Creekview Trl",
            "city": "Affton",
            "state": "MO",
            "zip": "63123",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.56572,
                "lng": -90.33508
            }
        },
        "details": {
            "rent": [
                570,
                850
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                1
            ],
            "size": [
                480,
                946
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/790862469/45783e707a59151704f28ec6d33206dcc-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2250944972o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1232016123o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1882536731o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3914442974o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f334134244o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1128201642o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1235613275o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3250158407o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1538521449o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1580771965o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f507843025o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1739502913o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f853161275o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f825651513o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1794586617o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f4116963090o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2851627146o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3345695782o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3587062887o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f995053114o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f487812086o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1395962267o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1488113385o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2644788955o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2914424623o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1737389620o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3677894391o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3897180141o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f512878572o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2965027509o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f354510776o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1338776219o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f399522514o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1422449186o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3568330380o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1601048978o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3147107092o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f275220266o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2719469079o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f48638722o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1860010331o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2909758140o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3718730161o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1762943583o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2046205259o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3505470434o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1287199381o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f169952952o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1704435254o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f969525893o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f362123126o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3608419569o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f866788532o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3808685401o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3605612929o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f679984047o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f4119590580o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2006565842o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f383677o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1810623733o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1039637555o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f927831602o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3715202281o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1211283903o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2637046964o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f4195439047o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1006963793o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3131100878o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1432087864o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2327572130o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2364058420o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f241460190o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f4221527374o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3115229687o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3490469869o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3627114301o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f688067924o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2950842628o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2559337959o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2961509497o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1436520159o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1410872887o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1671331971o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3110849473o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f4214814982o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2608127754o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3854835491o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f598372584o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f933013463o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3176005876o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2875159899o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f449107828o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f150732098o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f182998052o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f4091131705o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1255869056o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f804657149o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f990469917o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1702629541o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f159382992o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f626163792o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f441410729o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1887161543o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1079977145o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2956819292o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3179850775o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3151201516o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2160400253o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3692674966o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2016772750o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1099014753o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1068280961o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f4133711559o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1324011592o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f332830585o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1554861186o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f344650742o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f327188786o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2840395728o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1606863704o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2727388582o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2369949340o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f980561804o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2375703233o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2389854552o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f4272284613o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1320168392o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2758087024o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2543192896o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1793792051o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1181105256o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1161554458o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1089957910o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1871024496o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f4239922846o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f1435699515o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f3841425037o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f2197174726o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45783e707a59151704f28ec6d33206dcc-f432735616o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "411 N Eighth St",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63101",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.629898,
                "lng": -90.192271
            }
        },
        "details": {
            "rent": [
                1000,
                1445
            ],
            "beds": [
                0,
                1
            ],
            "baths": [
                1,
                1
            ],
            "size": [
                761,
                990
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Downtown East St. Louis"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1223477372/93fe4e018c2dc399bfef49a2eab06fecc-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2092145817o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f903343897o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3355515243o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1628310317o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1226580519o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2209817647o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1145826120o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f800401366o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1336309230o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f4192294477o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3136589284o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1267155619o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1026744425o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1871383450o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3680717220o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f86279365o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2103116778o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f645837509o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3613490792o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1786197185o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f708613956o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3449575020o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2391404547o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f79321924o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2447399444o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3854438624o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1449916383o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2872515170o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3584003197o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1657463122o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2238657379o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f376047962o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f156799323o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f4294523068o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f280240371o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2351336243o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2371057472o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f682910949o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1430088222o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1866478743o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f210542870o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f56952449o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1176705712o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f413912316o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3772342646o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f4191542738o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2323442422o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1767144230o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f4207318083o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2151175724o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f271036328o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2491552541o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f4009013842o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f21474183o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1720365887o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f182047345o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f440945470o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3167129435o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f296588301o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2502917023o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3230868202o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2921012593o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2518724119o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1430981322o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2876316707o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3047209070o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f599273751o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2227738281o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2709214675o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f865109858o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1305839559o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3528401555o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f459202651o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f821793746o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3974168245o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f976569450o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2682150638o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3677631159o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f418412604o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2173292199o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3918761775o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3408629224o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2521128489o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3485997933o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2338268598o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3860020253o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f103013468o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f862561576o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3786464478o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f71892230o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f690912191o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1678902727o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f640763406o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3112558918o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1844326062o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1158049410o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f722776647o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f503499210o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3082961469o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1861612618o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2988952276o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3892676835o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f4256560937o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1837380620o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1647627486o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3854613676o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3554430600o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1773278753o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3649504856o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1690165225o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2217205359o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2196540863o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f607500303o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2309584209o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3031386666o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2134166153o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3333177931o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f4110438800o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f647247617o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f784985428o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3573019883o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f2043055120o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3985796041o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3178187026o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1788848306o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f870183357o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1116618454o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f3828750649o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f1428997150o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f68865011o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f503550761o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/93fe4e018c2dc399bfef49a2eab06fecc-f938219500o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "8650 Kingsbridge Dr",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63132",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.66335,
                "lng": -90.36021
            }
        },
        "details": {
            "rent": [
                836,
                1254
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                1
            ],
            "size": [
                600,
                1015
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Le Pere Villa Place"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/4235498603/a062427c53bc3a9c7ed2f08349552bb1c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/461319514/a062427c53bc3a9c7ed2f08349552bb1c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/448638798/a062427c53bc3a9c7ed2f08349552bb1c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4138260593/a062427c53bc3a9c7ed2f08349552bb1c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3896807288/a062427c53bc3a9c7ed2f08349552bb1c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2188126905/a062427c53bc3a9c7ed2f08349552bb1c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3646310660/a062427c53bc3a9c7ed2f08349552bb1c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/281828337/a062427c53bc3a9c7ed2f08349552bb1c-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3411330937/a062427c53bc3a9c7ed2f08349552bb1c-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1072670151/a062427c53bc3a9c7ed2f08349552bb1c-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2269324029/a062427c53bc3a9c7ed2f08349552bb1c-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3623997481/a062427c53bc3a9c7ed2f08349552bb1c-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3794146515/a062427c53bc3a9c7ed2f08349552bb1c-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2952934690/a062427c53bc3a9c7ed2f08349552bb1c-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2840089845/a062427c53bc3a9c7ed2f08349552bb1c-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2368688574/a062427c53bc3a9c7ed2f08349552bb1c-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2777290786/a062427c53bc3a9c7ed2f08349552bb1c-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3693250054/a062427c53bc3a9c7ed2f08349552bb1c-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4073988108/a062427c53bc3a9c7ed2f08349552bb1c-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3769516883/a062427c53bc3a9c7ed2f08349552bb1c-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2386670302/a062427c53bc3a9c7ed2f08349552bb1c-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2726827625/a062427c53bc3a9c7ed2f08349552bb1c-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3441830799/a062427c53bc3a9c7ed2f08349552bb1c-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3457481309/a062427c53bc3a9c7ed2f08349552bb1c-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/475881676/a062427c53bc3a9c7ed2f08349552bb1c-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/111019057/a062427c53bc3a9c7ed2f08349552bb1c-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3963146556/a062427c53bc3a9c7ed2f08349552bb1c-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3067180496/a062427c53bc3a9c7ed2f08349552bb1c-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3965293403/a062427c53bc3a9c7ed2f08349552bb1c-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1601855028/a062427c53bc3a9c7ed2f08349552bb1c-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2875176653/a062427c53bc3a9c7ed2f08349552bb1c-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/236102116/a062427c53bc3a9c7ed2f08349552bb1c-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/486218763/a062427c53bc3a9c7ed2f08349552bb1c-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2066032160/a062427c53bc3a9c7ed2f08349552bb1c-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2598991881/a062427c53bc3a9c7ed2f08349552bb1c-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3093555888/a062427c53bc3a9c7ed2f08349552bb1c-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4234744660/a062427c53bc3a9c7ed2f08349552bb1c-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/379951124/a062427c53bc3a9c7ed2f08349552bb1c-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4032017289/a062427c53bc3a9c7ed2f08349552bb1c-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/480184308/a062427c53bc3a9c7ed2f08349552bb1c-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/462849602/a062427c53bc3a9c7ed2f08349552bb1c-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2354898319/a062427c53bc3a9c7ed2f08349552bb1c-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2012453652/a062427c53bc3a9c7ed2f08349552bb1c-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2943910667/a062427c53bc3a9c7ed2f08349552bb1c-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3034743116/a062427c53bc3a9c7ed2f08349552bb1c-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/359142970/a062427c53bc3a9c7ed2f08349552bb1c-f45o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/564390341/a062427c53bc3a9c7ed2f08349552bb1c-f46o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3208277544/a062427c53bc3a9c7ed2f08349552bb1c-f47o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/338348084/a062427c53bc3a9c7ed2f08349552bb1c-f48o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3829099659/a062427c53bc3a9c7ed2f08349552bb1c-f49o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3510313190/a062427c53bc3a9c7ed2f08349552bb1c-f50o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/793130275/a062427c53bc3a9c7ed2f08349552bb1c-f51o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3047440144/a062427c53bc3a9c7ed2f08349552bb1c-f52o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2012996037/a062427c53bc3a9c7ed2f08349552bb1c-f53o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2623682192/a062427c53bc3a9c7ed2f08349552bb1c-f54o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3977625654/a062427c53bc3a9c7ed2f08349552bb1c-f55o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3209299498/a062427c53bc3a9c7ed2f08349552bb1c-f56o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3858162827/a062427c53bc3a9c7ed2f08349552bb1c-f57o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/722402237/a062427c53bc3a9c7ed2f08349552bb1c-f58o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3972345596/a062427c53bc3a9c7ed2f08349552bb1c-f59o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/861090842/a062427c53bc3a9c7ed2f08349552bb1c-f60o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3173002383/a062427c53bc3a9c7ed2f08349552bb1c-f61o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/724810988/a062427c53bc3a9c7ed2f08349552bb1c-f62o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2793861496/a062427c53bc3a9c7ed2f08349552bb1c-f63o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3660834872/a062427c53bc3a9c7ed2f08349552bb1c-f64o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2033223817/a062427c53bc3a9c7ed2f08349552bb1c-f65o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1963062283/a062427c53bc3a9c7ed2f08349552bb1c-f66o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1948777506/a062427c53bc3a9c7ed2f08349552bb1c-f67o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1089230611/a062427c53bc3a9c7ed2f08349552bb1c-f68o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/714798810/a062427c53bc3a9c7ed2f08349552bb1c-f69o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/543630102/a062427c53bc3a9c7ed2f08349552bb1c-f70o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2543273060/a062427c53bc3a9c7ed2f08349552bb1c-f71o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2656286850/a062427c53bc3a9c7ed2f08349552bb1c-f72o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/529776727/a062427c53bc3a9c7ed2f08349552bb1c-f73o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/477489609/a062427c53bc3a9c7ed2f08349552bb1c-f74o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1861735779/a062427c53bc3a9c7ed2f08349552bb1c-f75o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1339713422/a062427c53bc3a9c7ed2f08349552bb1c-f76o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3101677336/a062427c53bc3a9c7ed2f08349552bb1c-f77o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1699954932/a062427c53bc3a9c7ed2f08349552bb1c-f78o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2196663994/a062427c53bc3a9c7ed2f08349552bb1c-f79o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3434835041/a062427c53bc3a9c7ed2f08349552bb1c-f80o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1347377369/a062427c53bc3a9c7ed2f08349552bb1c-f81o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/693398742/a062427c53bc3a9c7ed2f08349552bb1c-f82o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2030730792/a062427c53bc3a9c7ed2f08349552bb1c-f83o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1749754457/a062427c53bc3a9c7ed2f08349552bb1c-f84o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/601395395/a062427c53bc3a9c7ed2f08349552bb1c-f85o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2813944410/a062427c53bc3a9c7ed2f08349552bb1c-f86o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3708734608/a062427c53bc3a9c7ed2f08349552bb1c-f87o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/189012023/a062427c53bc3a9c7ed2f08349552bb1c-f88o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f3170701285o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f612916058o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f321746407o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f2025742064o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f1849439887o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f2105795548o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f532045268o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f329204272o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f2120467780o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f2917962990o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f2123280252o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f3988534894o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f3324320900o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f3749364598o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f2386731969o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f2556470332o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f1435957553o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f447441114o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f3280898876o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f4097965196o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f1843150328o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f3458376839o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f2333468469o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f567097327o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f529641879o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f3525428114o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f138721008o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f2734851146o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f1397181190o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f1126448621o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f1169617566o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f3837468531o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f312998112o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f1213669641o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f2056476492o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f4176489775o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f1634115116o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f3124018029o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f550601161o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f1122383166o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a062427c53bc3a9c7ed2f08349552bb1c-f271496818o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2017-10-19T23:47:00.000Z",
        "address": {
            "street": "4041 Chouteau Ave",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63110",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.62862,
                "lng": -90.24913
            }
        },
        "details": {
            "rent": [
                1080,
                2975
            ],
            "beds": [
                0,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                524,
                1483
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Forest Park South East"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3038325661o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3038325661o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1469292613o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f469692337o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2469635095o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3994425040o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2371807411o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f173535327o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2734183949o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3652116445o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3485272703o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f4045704536o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3091152478o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1187015020o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3354097239o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3809608648o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1297713936o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2856767680o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1608319617o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3915446758o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f420577180o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1320654569o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3437175586o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1246381439o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1143534527o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f4118676648o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1605577325o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2061912606o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2978211335o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3202174167o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3533993866o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3605184507o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2881188123o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1087918316o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2055751867o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f609349640o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2233497821o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2147971052o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2497980464o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1416963911o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1745293902o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3953177411o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3834229104o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2443472764o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1940324006o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f4145958048o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1502649118o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1517893683o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3976586308o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2342493320o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f80852441o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2474304831o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f4026808212o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2574189898o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f4078702162o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1647044959o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2364506676o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3885055435o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3042639318o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1072304427o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2036739096o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3101889413o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2615561150o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1535071375o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1363766703o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3742736285o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3744096882o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2596885317o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2792946989o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2557486341o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f840432195o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1525365130o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2395069620o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2476719065o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3350272138o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f845491779o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f4003589291o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2129092409o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f536958439o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f927003903o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1988533360o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3907927200o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3471426280o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f4088900167o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1100704112o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3595611331o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3677419046o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3128710034o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3347295012o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f499073979o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1775053084o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2467631658o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1364085026o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f499203513o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2723828175o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f4209407287o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f560934781o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f4281184851o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2216482776o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3839606897o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2256666646o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3785882222o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f694624044o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2981666999o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1649256835o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f714942218o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1656920853o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f862103429o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1472974962o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f452884675o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f3422232904o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1737683424o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f1149169793o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/afb5f98fd2d29c27b5b5a89eeaf7fb7dc-f2682747033o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2016-02-06T09:04:00.000Z",
        "address": {
            "street": "625 N Euclid Ave",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63108",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.65104,
                "lng": -90.26093
            }
        },
        "details": {
            "rent": [
                1457,
                1988
            ],
            "beds": [
                0,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                497,
                1471
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Central West End"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1143156425/11a3f9012f8d2417af8bd618ebc6ef6ac-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f4025572166o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f313533165o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1203582657o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2120486870o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3541941334o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f826022175o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3187274296o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1833452424o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f329262669o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2950166899o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f132749609o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f153572263o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f177702100o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2856571414o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f331195394o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f178077608o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f561155754o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2434899098o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1790418140o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f4292475926o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1269347487o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1071754658o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3766101387o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1747789788o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1845282824o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2083231527o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2548043529o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f390951511o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3666566114o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3226350023o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2374879266o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f4023771784o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3753801018o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f329787305o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f4113248878o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2439482515o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2965465789o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2212566272o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f68677105o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f939944956o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f169942637o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f628324938o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f903762262o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2860563314o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f639441699o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3253644593o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2868463169o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1016418507o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f315478678o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f314380849o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2481660973o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f4057320709o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2369667340o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3849933743o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2931572480o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3628227832o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3212653392o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1448652833o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3953274159o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f500446686o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f794416225o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3053209600o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1056226682o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f365428o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f198252333o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2488382633o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3494785616o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1174493726o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2734860871o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1685400409o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3100025308o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2216458935o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f412565458o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f781028635o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1591499524o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3700896182o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1484419101o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1144495366o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f947473012o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2033647674o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f4161687265o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1025950972o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f274635114o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3885059589o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f4191223751o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1000923786o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3825283071o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f105503015o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3011119553o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1133376914o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3221940950o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3275141341o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f363774504o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3492271844o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f2367743906o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f4278470002o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1766956673o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3851031220o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3405385469o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3110496795o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1682743573o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f1573087542o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3321712991o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f767329851o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/11a3f9012f8d2417af8bd618ebc6ef6ac-f3653688707o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "3949 Lindell Blvd",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63108",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.64002,
                "lng": -90.242966
            }
        },
        "details": {
            "rent": [
                790,
                1320
            ],
            "beds": [
                0,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                665,
                1275
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Central West End"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/456456187/c01d813c970e22795b881329eec139afc-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f3838511109o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2115226902o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f3712915661o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f3650811201o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2586651060o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f3364046098o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1985943717o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f731948335o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2972408911o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1987316858o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1341148535o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2128142839o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f4202698188o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2173928474o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f47287700o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f300796586o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f296328808o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1341148535o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2128142839o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f4202698188o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2173928474o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f47287700o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f300796586o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f594682455o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f3704855630o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1668987684o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f685504090o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f3038611254o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f3900536919o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f42176983o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f4270728884o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2437271457o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f788087210o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1675910237o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f204131764o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f3957430018o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2049055731o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1829471920o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f596625475o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2514284122o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1884432694o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f661756972o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f627297962o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f843437736o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f680177762o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1367915029o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2155192001o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f4237172222o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f994056063o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f4076237673o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1130437723o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2844857639o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f3026787770o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1482598903o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f778347646o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2190260764o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2285674808o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f3906470068o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1878480866o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f431370963o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1171118985o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1812800708o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f600053452o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2518062497o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1241421390o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2962928923o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f3657759973o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f556259353o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1332880351o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1765626872o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f3159740782o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f3312473052o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1038293604o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f358086686o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1288384037o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2848464906o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1285012429o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f4294384730o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f3276364167o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1646643941o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1069107352o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2645941221o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1791772663o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f3780788668o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1760183172o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f4237614603o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2694541194o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1670212382o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1127852034o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f3919620871o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f983062757o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2797240281o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1848971695o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f387991952o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f487735929o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2444661014o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2164836854o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f1455720236o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/c01d813c970e22795b881329eec139afc-f2133456435o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2017-11-18T22:00:00.000Z",
        "address": {
            "street": "1400 Russell Blvd",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63104",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.60793,
                "lng": -90.21158
            }
        },
        "details": {
            "rent": [
                1055,
                1890
            ],
            "beds": [
                0,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                473,
                1276
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Soulard"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/3158561253/45081cc900d19f8ace3c38b23e9fac8fc-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3158561253o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f901153416o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f780152700o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2934230088o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3376737960o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3254273954o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f202884246o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3831353403o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3105014830o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1984426242o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2620420563o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1053196753o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f217352807o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3745806413o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f933132706o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1855618821o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f62243484o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1758242090o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f4085912319o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3551032793o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1368861493o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1066854142o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3966232933o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f153589253o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2257163930o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3548358666o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f866513740o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3254749619o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f510365049o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3179812687o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2929048848o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2023033650o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f555171708o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f495589749o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f674830197o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2063617285o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3095890946o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3947146893o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3172122247o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3055313071o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f4008229014o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3355146464o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f55724604o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2807813282o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f4264618158o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f675414854o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1981657200o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f4294048593o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f4209537410o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2705953121o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f589516401o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2328617049o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3885457365o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3751538442o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3782495862o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f4000958935o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1446738366o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3689794987o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1344858952o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3379698793o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1804066804o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3427029448o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2763862447o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3771198945o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3062551480o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f891682521o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1035894869o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f4039912652o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3271667322o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3696132175o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1607991766o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2616247549o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f894521947o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2968378040o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1058249782o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1924983611o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f951828143o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f140681751o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3860000466o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2603219860o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1131597019o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2748643362o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2524477673o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1453125190o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f1632328067o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2647682792o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f130061582o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3314434393o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f2576816207o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f217320517o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/45081cc900d19f8ace3c38b23e9fac8fc-f3305744652o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "400 S 4th St",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63102",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.621205,
                "lng": -90.189845
            }
        },
        "details": {
            "rent": [
                989,
                1650
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                662,
                1500
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Downtown East St. Louis"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1311792295/67c37b42de2de175b6e9fd4d26c06a9ac-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2451570011/67c37b42de2de175b6e9fd4d26c06a9ac-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3936724465/67c37b42de2de175b6e9fd4d26c06a9ac-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3256913732/67c37b42de2de175b6e9fd4d26c06a9ac-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3211565821/67c37b42de2de175b6e9fd4d26c06a9ac-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2678752856/67c37b42de2de175b6e9fd4d26c06a9ac-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3632597263/67c37b42de2de175b6e9fd4d26c06a9ac-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2654650459/67c37b42de2de175b6e9fd4d26c06a9ac-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3186067793/67c37b42de2de175b6e9fd4d26c06a9ac-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1776912935/67c37b42de2de175b6e9fd4d26c06a9ac-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3130028258/67c37b42de2de175b6e9fd4d26c06a9ac-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1532548008/67c37b42de2de175b6e9fd4d26c06a9ac-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1854441395/67c37b42de2de175b6e9fd4d26c06a9ac-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/257860959/67c37b42de2de175b6e9fd4d26c06a9ac-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3927099774/67c37b42de2de175b6e9fd4d26c06a9ac-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2246700170/67c37b42de2de175b6e9fd4d26c06a9ac-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/39824081/67c37b42de2de175b6e9fd4d26c06a9ac-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3833292043/67c37b42de2de175b6e9fd4d26c06a9ac-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2902383398/67c37b42de2de175b6e9fd4d26c06a9ac-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3343779042/67c37b42de2de175b6e9fd4d26c06a9ac-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3983521475/67c37b42de2de175b6e9fd4d26c06a9ac-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/512775050/67c37b42de2de175b6e9fd4d26c06a9ac-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/50022281/67c37b42de2de175b6e9fd4d26c06a9ac-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/881969007/67c37b42de2de175b6e9fd4d26c06a9ac-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2297477196/67c37b42de2de175b6e9fd4d26c06a9ac-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/262393865/67c37b42de2de175b6e9fd4d26c06a9ac-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2697680624/67c37b42de2de175b6e9fd4d26c06a9ac-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/522197635/67c37b42de2de175b6e9fd4d26c06a9ac-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1948472826/67c37b42de2de175b6e9fd4d26c06a9ac-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2347810538/67c37b42de2de175b6e9fd4d26c06a9ac-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3298355562/67c37b42de2de175b6e9fd4d26c06a9ac-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1029156342/67c37b42de2de175b6e9fd4d26c06a9ac-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2653073898/67c37b42de2de175b6e9fd4d26c06a9ac-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2909799500/67c37b42de2de175b6e9fd4d26c06a9ac-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1792130369/67c37b42de2de175b6e9fd4d26c06a9ac-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1139536810/67c37b42de2de175b6e9fd4d26c06a9ac-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/589753697/67c37b42de2de175b6e9fd4d26c06a9ac-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3772107373/67c37b42de2de175b6e9fd4d26c06a9ac-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1813269183/67c37b42de2de175b6e9fd4d26c06a9ac-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1087002960/67c37b42de2de175b6e9fd4d26c06a9ac-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2545736535/67c37b42de2de175b6e9fd4d26c06a9ac-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/38290273/67c37b42de2de175b6e9fd4d26c06a9ac-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1896522016/67c37b42de2de175b6e9fd4d26c06a9ac-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1866145368/67c37b42de2de175b6e9fd4d26c06a9ac-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/457621560/67c37b42de2de175b6e9fd4d26c06a9ac-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1155889063/67c37b42de2de175b6e9fd4d26c06a9ac-f45o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2922989119/67c37b42de2de175b6e9fd4d26c06a9ac-f46o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3841153209/67c37b42de2de175b6e9fd4d26c06a9ac-f47o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1549150077/67c37b42de2de175b6e9fd4d26c06a9ac-f48o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4270140136/67c37b42de2de175b6e9fd4d26c06a9ac-f49o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1324907398/67c37b42de2de175b6e9fd4d26c06a9ac-f50o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/201834790/67c37b42de2de175b6e9fd4d26c06a9ac-f51o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2830505575/67c37b42de2de175b6e9fd4d26c06a9ac-f52o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1013377115/67c37b42de2de175b6e9fd4d26c06a9ac-f53o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2003161339/67c37b42de2de175b6e9fd4d26c06a9ac-f54o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/174180459/67c37b42de2de175b6e9fd4d26c06a9ac-f55o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2852897021/67c37b42de2de175b6e9fd4d26c06a9ac-f56o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2787845056/67c37b42de2de175b6e9fd4d26c06a9ac-f57o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2317655895/67c37b42de2de175b6e9fd4d26c06a9ac-f58o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3829432367/67c37b42de2de175b6e9fd4d26c06a9ac-f59o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2984701875/67c37b42de2de175b6e9fd4d26c06a9ac-f60o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/60511387/67c37b42de2de175b6e9fd4d26c06a9ac-f61o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3113313178/67c37b42de2de175b6e9fd4d26c06a9ac-f62o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/268368451/67c37b42de2de175b6e9fd4d26c06a9ac-f63o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1674903832/67c37b42de2de175b6e9fd4d26c06a9ac-f64o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3886249482/67c37b42de2de175b6e9fd4d26c06a9ac-f65o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2556919143/67c37b42de2de175b6e9fd4d26c06a9ac-f66o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3613994637/67c37b42de2de175b6e9fd4d26c06a9ac-f67o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/857511488/67c37b42de2de175b6e9fd4d26c06a9ac-f68o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/461537895/67c37b42de2de175b6e9fd4d26c06a9ac-f69o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2933642163/67c37b42de2de175b6e9fd4d26c06a9ac-f70o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3567854257/67c37b42de2de175b6e9fd4d26c06a9ac-f71o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1784863978/67c37b42de2de175b6e9fd4d26c06a9ac-f72o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1212403647/67c37b42de2de175b6e9fd4d26c06a9ac-f73o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3002809545/67c37b42de2de175b6e9fd4d26c06a9ac-f74o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3800161259/67c37b42de2de175b6e9fd4d26c06a9ac-f75o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/745925000/67c37b42de2de175b6e9fd4d26c06a9ac-f76o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3120667565/67c37b42de2de175b6e9fd4d26c06a9ac-f77o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3994962271/67c37b42de2de175b6e9fd4d26c06a9ac-f78o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4142955881/67c37b42de2de175b6e9fd4d26c06a9ac-f79o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1092832822/67c37b42de2de175b6e9fd4d26c06a9ac-f80o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1655068634/67c37b42de2de175b6e9fd4d26c06a9ac-f81o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2822878856/67c37b42de2de175b6e9fd4d26c06a9ac-f82o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3810871388/67c37b42de2de175b6e9fd4d26c06a9ac-f83o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1054802376/67c37b42de2de175b6e9fd4d26c06a9ac-f84o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1790958987/67c37b42de2de175b6e9fd4d26c06a9ac-f85o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1982206116/67c37b42de2de175b6e9fd4d26c06a9ac-f86o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1142517500/67c37b42de2de175b6e9fd4d26c06a9ac-f87o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2596452580/67c37b42de2de175b6e9fd4d26c06a9ac-f88o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4131274049/67c37b42de2de175b6e9fd4d26c06a9ac-f89o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1944345464/67c37b42de2de175b6e9fd4d26c06a9ac-f90o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1603206044/67c37b42de2de175b6e9fd4d26c06a9ac-f91o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "633 N McKnight Rd",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63132",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.662082,
                "lng": -90.357434
            }
        },
        "details": {
            "rent": [
                885,
                1183
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                1
            ],
            "size": [
                600,
                1040
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Le Pere Villa Place"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1723831823/90805a1a6cec77bbca742f9357a7b760c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1138665201/90805a1a6cec77bbca742f9357a7b760c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1159585884/90805a1a6cec77bbca742f9357a7b760c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3040904241/90805a1a6cec77bbca742f9357a7b760c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/802566173/90805a1a6cec77bbca742f9357a7b760c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2956194757/90805a1a6cec77bbca742f9357a7b760c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/192808514/90805a1a6cec77bbca742f9357a7b760c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3176743590o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f586280345o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f598443739o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f845819785o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2005445910o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3492086687o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3274306864o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f316243552o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f527404125o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3422768011o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3953834167o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f1430658545o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f1814420249o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f78564106o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f743914591o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f1337314150o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3609014247o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f4238642245o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f1703008789o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2823199405o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2984939933o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3650666174o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3656571011o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f227386864o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3566956727o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2708112174o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f969916905o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f1632994272o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f4077993139o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3437175358o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2972604140o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f210827585o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f4132719540o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f27573031o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2664259131o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2184924681o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f80230976o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f4063970107o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3435155105o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f1106467149o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f1992952845o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f189324212o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3498626687o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3430767127o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2969129062o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2102564613o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2419119810o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2801604767o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f1550976524o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3689906958o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3546019645o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2539650765o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f280291764o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3442211753o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3956318164o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f201358317o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f4137691267o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f1176598040o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f4123199404o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f717979488o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3846873016o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3700310902o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f4216283179o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3910328992o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3197457036o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f649913715o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3107352470o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2094278438o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2784848293o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f1251247296o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2131475476o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2669822673o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f65004270o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2823528198o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f1855887947o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2025705901o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f905273401o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2106591808o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3030278551o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f963577670o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f2412245967o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3633183217o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/90805a1a6cec77bbca742f9357a7b760c-f3512335596o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "1424 Stoney Meadows Dr",
            "city": "Manchester",
            "state": "MO",
            "zip": "63088",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.56709,
                "lng": -90.49328
            }
        },
        "details": {
            "rent": [
                775,
                1200
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                625,
                1175
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f693943521o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f693943521o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2956337502o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3720006263o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3445605638o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3650621861o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2073922608o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3172252967o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3356760049o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2199801268o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2679971943o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2418928285o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3274517219o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2628155260o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1905374496o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2870648541o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2137330047o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3977700075o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2919383641o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2168242490o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2017719233o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2510583655o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2082081797o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1641928822o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3866712651o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2645140077o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3754288552o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3371635543o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2899236858o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3885896526o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1699772055o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1501260824o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3907934586o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2200278889o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f4136714493o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f524867007o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1839076850o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2376434427o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f4104147767o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1710545626o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2433421944o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2439300475o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1337632683o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f163574792o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f4273292770o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3534908020o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3121565081o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3553655392o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2815426508o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2478361467o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3135357276o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3940844773o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2504632095o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f4157205524o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f337008821o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2870477600o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1555518574o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1367422927o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3283096346o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1809715138o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1290555064o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3285646832o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f55953677o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1869597556o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3165344316o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1910663215o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2320283923o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2583491248o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3505635952o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3549883517o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f480010526o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2516222037o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1565928735o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2477030939o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3385366326o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1216213300o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1112050102o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1508281540o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3310202028o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f972112529o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f2089326313o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f1976264753o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f290445629o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f297526852o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f916135622o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3402225709o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fda6000e96bef823adb90f23d4e63177c-f3405354362o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "1247 Covington Manor Ln",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63125",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.50798,
                "lng": -90.3196
            }
        },
        "details": {
            "rent": [
                689,
                1339
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                650,
                1800
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f723954643o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3879217196o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3049625462o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3095521092o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f405066952o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3915937598o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2362902177o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3905190940o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1757125433o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f4135421950o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1296184129o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1473370731o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2756952662o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3515107909o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2047310656o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1056071369o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3331199170o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1139749957o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3941495939o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f925784410o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2968269298o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2270617930o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f226034217o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f4283969120o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2163507604o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2730406094o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3975113138o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2575891681o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f665349761o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3888784044o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3345848606o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3437235405o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f157218855o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1751233125o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f614522963o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3610014545o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1213410356o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2218856887o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f4027822944o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2136049237o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3879993090o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f671033601o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2071784069o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f202921624o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3827706863o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2937841286o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2230427965o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2116372631o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2009872380o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2204618612o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f952157167o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f293857553o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2920989539o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1272980732o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3422896702o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2785902686o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1839561995o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f143522930o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3742045569o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f738611455o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2407481647o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2332839988o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1651513209o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2918797190o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2470040256o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1422553470o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f255048772o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1818908366o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f799661985o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1173777290o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f70781082o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1505497893o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2263996078o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f998119421o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3037386609o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3297504098o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2005624181o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f585521592o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f3727971196o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f739961802o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2285805954o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1079643302o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1741501738o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f2045980350o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f748597800o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f0c02d8677c61f50617489df17479193c-f1109790873o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "5178 Deerfield Circle Dr",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63128",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.49921,
                "lng": -90.38024
            }
        },
        "details": {
            "rent": [
                830,
                1015
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                1
            ],
            "size": [
                700,
                1000
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/85704154/9c334e4c6f5ffcbe58f095b2fe51c0eec-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f85704154o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f3659945085o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f2068658505o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f4080738565o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1251716827o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f3757471313o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f2799355300o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f2881141460o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1975365727o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f2930310373o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f2927641859o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f3788509616o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f4071597912o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1945740829o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1790919520o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f526036979o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f3106408958o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1068818695o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1499956694o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f721463074o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1074484578o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f915293237o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f4208541494o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f3861398284o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f459637659o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f2661577042o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1366482806o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f2040782148o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1930358534o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1558687858o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f2872281764o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f781160847o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f310837827o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1320223514o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f3261926621o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f3212097506o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1638564170o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f2123995278o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f215782687o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f3888295152o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1190898928o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1025615553o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1551827341o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1966591552o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f191455069o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1982670987o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f71247342o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1343448121o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f795043623o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f3686846978o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f140909139o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f3509808508o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1778671258o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f295482168o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f2638655283o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f2243372342o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f243339907o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f3075775053o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f2910714128o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f2787683161o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f3478331036o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f496226512o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f980830089o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1164102611o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f9680017o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1779462869o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f4220142227o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f3774635159o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1694988758o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f981783065o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1593372538o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f2145855809o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f3240716916o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f4216100212o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f3513677643o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f3899390284o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1163428874o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f2271527484o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1962115369o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f274826073o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f152825008o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f1041243786o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f445619881o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9c334e4c6f5ffcbe58f095b2fe51c0eec-f2776722612o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2017-12-21T22:03:00.000Z",
        "address": {
            "street": "2100 E Aventura Way",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63146",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.699936,
                "lng": -90.45745
            }
        },
        "details": {
            "rent": [
                1125,
                1550
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                837,
                1272
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1956935140o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1956935140o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1397385458o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1977036977o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1618459995o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1209594194o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1999294027o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f122653512o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f2158238699o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f2992281265o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f2494279799o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f546648967o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1702031532o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f3532594664o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f3634801144o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1165012197o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1923961447o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f3263596930o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f3761105003o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f2166849395o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f110325898o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f324576687o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f2290839124o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f2171921779o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f3162592606o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1499981115o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f3873971329o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f2737339181o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f3108341486o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f3656176379o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f3633956412o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1342190404o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f4262496274o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f578464231o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f2986799418o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f743169313o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f247500043o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f2349779039o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f318109642o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1357464019o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f768158660o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f4212550870o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f4068104959o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f4078377611o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f2043942367o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1988323898o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f3718405076o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f353483712o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f144795836o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f3675025952o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f2720977899o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f4281404492o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f926277583o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f510721920o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1477098135o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1762571007o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1935356281o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f2687274345o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1631491568o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f879933429o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f2201259539o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1979010070o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1037519513o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f19167712o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f4023171151o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f3293411974o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1563610867o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f3147062642o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f541443163o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f876188769o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f2702193951o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1563947504o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1432393053o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1990918383o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f871960935o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f3165949253o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f635537168o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1864172427o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f3831100559o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f3347959930o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f2013602268o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1554174447o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/34dc402fa7001711e050f496a67a34b2c-f1829955007o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "414 Point Return Dr",
            "city": "Ballwin",
            "state": "MO",
            "zip": "63021",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.58713,
                "lng": -90.49291
            }
        },
        "details": {
            "rent": [
                761,
                1152
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                676,
                1147
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Prospect Creek"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f4134130788o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4524252/a70f69426eae50b12c30e643d940677bc-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1129425582/a70f69426eae50b12c30e643d940677bc-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3156991312/a70f69426eae50b12c30e643d940677bc-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1794199643/a70f69426eae50b12c30e643d940677bc-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3291318476/a70f69426eae50b12c30e643d940677bc-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3220642242/a70f69426eae50b12c30e643d940677bc-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3662805410/a70f69426eae50b12c30e643d940677bc-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/635909492/a70f69426eae50b12c30e643d940677bc-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1491137950/a70f69426eae50b12c30e643d940677bc-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1386666509/a70f69426eae50b12c30e643d940677bc-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/141303273/a70f69426eae50b12c30e643d940677bc-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2968668786/a70f69426eae50b12c30e643d940677bc-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1054291946/a70f69426eae50b12c30e643d940677bc-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2450639561/a70f69426eae50b12c30e643d940677bc-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/587491072/a70f69426eae50b12c30e643d940677bc-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1470251854/a70f69426eae50b12c30e643d940677bc-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4193588221/a70f69426eae50b12c30e643d940677bc-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3645856236/a70f69426eae50b12c30e643d940677bc-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3638693302/a70f69426eae50b12c30e643d940677bc-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1938279190/a70f69426eae50b12c30e643d940677bc-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f370500994o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f2626911510o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f3991305509o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f3068416603o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f2432987295o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f2581318115o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1061666390o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1544311326o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f4235368642o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1316250269o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1129344814o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f102460805o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1540762149o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f317862549o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f3324703861o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f733575481o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f3133400414o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1474272742o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f4228508722o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f553747533o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f2625736903o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f3353457657o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f3325532894o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f3667273230o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1200847788o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f3942409362o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f2825206184o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f2275420649o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1030774022o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f722158324o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f2950920142o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1269214283o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1694708867o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f301720357o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1131521115o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f2727738121o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1796212002o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f3752875848o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f2344157029o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f2916918345o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1925891736o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f3914709362o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f4184805193o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f29937284o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1066048985o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f3261975577o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1940060198o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f2394496163o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f3557085187o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f3376776662o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f38829323o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f3503936644o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f2947098923o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f281270887o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f807459487o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1485609862o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f653816316o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f149258238o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f3244295987o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f788721515o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f3299739966o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a70f69426eae50b12c30e643d940677bc-f1593136669o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "4431 Chouteau Ave",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63110",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.630794,
                "lng": -90.258876
            }
        },
        "details": {
            "rent": [
                1670,
                1745
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2.5
            ],
            "size": [
                736,
                1373
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Forest Park South East"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3054658212o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f4124714481o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f811001106o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3842679940o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f4133046787o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f812711735o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f11316017o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1943980981o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f924857296o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1007401030o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3887267666o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3330950506o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f488714011o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1225624998o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3181301665o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1576710541o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3222716651o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2437386896o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2060057718o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2905860639o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f4070510463o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f481008414o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f534318593o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2272377907o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2405297831o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3877136956o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3246668468o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3157504948o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f366566143o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f4059918255o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f51411188o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2270454987o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1601356657o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2497009164o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1363596198o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f632540821o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3528937515o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3710943929o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1861740401o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2888754170o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2915918373o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f335592302o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f847621790o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1378416062o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1699654763o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f490004026o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f482859814o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2223297652o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3484124159o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2125022040o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2131538633o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2511968930o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3174363027o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2561480135o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2518151152o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1539906338o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f4116305525o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1397004173o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3231223115o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3263778764o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1352518682o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f906330241o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2510245463o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1667667427o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f154517902o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1778951701o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1343191890o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f399062793o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1364707922o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3276947552o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2596200840o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2899108080o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3260741486o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f3525488260o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f2687827289o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f365237205o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/a141478ab8ea20247f1d96defedc8777c-f1117334898o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "100 Winchester Pl",
            "city": "Fairview Heights",
            "state": "IL",
            "zip": "62208",
            "country": "USA",
            "county": "St. Clair",
            "coordinates": {
                "lat": 38.572296,
                "lng": -89.982037
            }
        },
        "details": {
            "rent": [
                790,
                1095
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                735,
                1165
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1898925938/fd27c388c1851100f1cdb604d05d66e4c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f1784581966o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3731647220o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2617344024o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3056912402o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2647673279o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3246748914o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3957975386o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3504198257o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f4292292595o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2419112860o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2403529543o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f618975517o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2850147639o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f1112317216o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2799729049o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f4288913070o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2698930891o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3520645606o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3614455076o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f1138044280o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f1652620321o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3996919742o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2510015815o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3018962821o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3086514448o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3293738257o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2704557009o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f805577759o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f805577759o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3012825786o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f867730971o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f855002832o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2810603866o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3708483163o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3338865414o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3624511720o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f618975517o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3957975386o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3056912402o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2617344024o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3504198257o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3246748914o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2647673279o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2403529543o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3731647220o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f4292292595o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f1112317216o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2510015815o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3614455076o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3996919742o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f867730971o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f4288913070o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2799729049o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3018962821o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2850147639o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3086514448o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f1138044280o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3293738257o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f805577759o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f855002832o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2704557009o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3012825786o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2810603866o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f1652620321o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3520645606o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2698930891o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3708483163o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f1514870191o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f1260833466o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f848174626o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f815401694o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f232481596o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f2003587619o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f1235245002o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/fd27c388c1851100f1cdb604d05d66e4c-f3964316797o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2017-07-04T08:22:00.000Z",
        "address": {
            "street": "504 Stone Ridge Trl",
            "city": "Fenton",
            "state": "MO",
            "zip": "63026",
            "country": "USA",
            "county": "Jefferson",
            "coordinates": {
                "lat": 38.49784,
                "lng": -90.45004
            }
        },
        "details": {
            "rent": [
                null,
                null
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2.5
            ],
            "size": [
                951,
                1347
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1534008740/12898cb54ee0fc94f06a2cf00c9a0ef1c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2003254923/12898cb54ee0fc94f06a2cf00c9a0ef1c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2952701197/12898cb54ee0fc94f06a2cf00c9a0ef1c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4264541959/12898cb54ee0fc94f06a2cf00c9a0ef1c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/354705977/12898cb54ee0fc94f06a2cf00c9a0ef1c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2479428026/12898cb54ee0fc94f06a2cf00c9a0ef1c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/219972173/12898cb54ee0fc94f06a2cf00c9a0ef1c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/652377863/12898cb54ee0fc94f06a2cf00c9a0ef1c-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/116307858/12898cb54ee0fc94f06a2cf00c9a0ef1c-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1168630431/12898cb54ee0fc94f06a2cf00c9a0ef1c-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3132564931/12898cb54ee0fc94f06a2cf00c9a0ef1c-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2385464875/12898cb54ee0fc94f06a2cf00c9a0ef1c-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214635108/12898cb54ee0fc94f06a2cf00c9a0ef1c-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3883541376/12898cb54ee0fc94f06a2cf00c9a0ef1c-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3192558325/12898cb54ee0fc94f06a2cf00c9a0ef1c-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3220852665/12898cb54ee0fc94f06a2cf00c9a0ef1c-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/437474539/12898cb54ee0fc94f06a2cf00c9a0ef1c-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/357600153/12898cb54ee0fc94f06a2cf00c9a0ef1c-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2614016902/12898cb54ee0fc94f06a2cf00c9a0ef1c-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2236382603/12898cb54ee0fc94f06a2cf00c9a0ef1c-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2333238779/12898cb54ee0fc94f06a2cf00c9a0ef1c-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1022640620/12898cb54ee0fc94f06a2cf00c9a0ef1c-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4136671922/12898cb54ee0fc94f06a2cf00c9a0ef1c-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2361067921/12898cb54ee0fc94f06a2cf00c9a0ef1c-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2862443661/12898cb54ee0fc94f06a2cf00c9a0ef1c-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1697913540/12898cb54ee0fc94f06a2cf00c9a0ef1c-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3453569910/12898cb54ee0fc94f06a2cf00c9a0ef1c-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1514296347/12898cb54ee0fc94f06a2cf00c9a0ef1c-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3840776477/12898cb54ee0fc94f06a2cf00c9a0ef1c-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/852969533/12898cb54ee0fc94f06a2cf00c9a0ef1c-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1621171178/12898cb54ee0fc94f06a2cf00c9a0ef1c-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3436724867/12898cb54ee0fc94f06a2cf00c9a0ef1c-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1801682618/12898cb54ee0fc94f06a2cf00c9a0ef1c-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3887671872/12898cb54ee0fc94f06a2cf00c9a0ef1c-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4067669129/12898cb54ee0fc94f06a2cf00c9a0ef1c-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2516157106/12898cb54ee0fc94f06a2cf00c9a0ef1c-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1412634163/12898cb54ee0fc94f06a2cf00c9a0ef1c-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1744865658/12898cb54ee0fc94f06a2cf00c9a0ef1c-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1649837318/12898cb54ee0fc94f06a2cf00c9a0ef1c-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1220205953/12898cb54ee0fc94f06a2cf00c9a0ef1c-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3420886443/12898cb54ee0fc94f06a2cf00c9a0ef1c-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1841460673/12898cb54ee0fc94f06a2cf00c9a0ef1c-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3392517569/12898cb54ee0fc94f06a2cf00c9a0ef1c-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4178338788/12898cb54ee0fc94f06a2cf00c9a0ef1c-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/701960705/12898cb54ee0fc94f06a2cf00c9a0ef1c-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2090311289/12898cb54ee0fc94f06a2cf00c9a0ef1c-f45o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3094869486/12898cb54ee0fc94f06a2cf00c9a0ef1c-f46o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1497323928/12898cb54ee0fc94f06a2cf00c9a0ef1c-f47o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/798937603/12898cb54ee0fc94f06a2cf00c9a0ef1c-f48o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3500717067/12898cb54ee0fc94f06a2cf00c9a0ef1c-f49o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1650410305/12898cb54ee0fc94f06a2cf00c9a0ef1c-f50o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1575917967/12898cb54ee0fc94f06a2cf00c9a0ef1c-f51o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1131331208/12898cb54ee0fc94f06a2cf00c9a0ef1c-f52o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/283324025/12898cb54ee0fc94f06a2cf00c9a0ef1c-f53o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/127241165/12898cb54ee0fc94f06a2cf00c9a0ef1c-f54o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1558891086/12898cb54ee0fc94f06a2cf00c9a0ef1c-f55o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2149555883/12898cb54ee0fc94f06a2cf00c9a0ef1c-f56o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2788279229/12898cb54ee0fc94f06a2cf00c9a0ef1c-f57o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/183248121/12898cb54ee0fc94f06a2cf00c9a0ef1c-f58o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3617864431/12898cb54ee0fc94f06a2cf00c9a0ef1c-f59o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3135296100/12898cb54ee0fc94f06a2cf00c9a0ef1c-f60o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1961733839/12898cb54ee0fc94f06a2cf00c9a0ef1c-f61o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1860792036/12898cb54ee0fc94f06a2cf00c9a0ef1c-f62o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3800633184/12898cb54ee0fc94f06a2cf00c9a0ef1c-f63o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3587266335/12898cb54ee0fc94f06a2cf00c9a0ef1c-f64o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2315736259/12898cb54ee0fc94f06a2cf00c9a0ef1c-f65o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2295253904/12898cb54ee0fc94f06a2cf00c9a0ef1c-f66o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2719359927/12898cb54ee0fc94f06a2cf00c9a0ef1c-f67o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2153524855/12898cb54ee0fc94f06a2cf00c9a0ef1c-f68o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3496393500/12898cb54ee0fc94f06a2cf00c9a0ef1c-f69o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3616640934/12898cb54ee0fc94f06a2cf00c9a0ef1c-f70o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3991118542/12898cb54ee0fc94f06a2cf00c9a0ef1c-f71o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3527341248/12898cb54ee0fc94f06a2cf00c9a0ef1c-f72o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4116105156/12898cb54ee0fc94f06a2cf00c9a0ef1c-f73o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "5303 Lucas Hunt Rd",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63121",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.71402,
                "lng": -90.28399
            }
        },
        "details": {
            "rent": [
                500,
                610
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                1
            ],
            "size": [
                500,
                866
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Haskel Alexander Estate"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/284065816/a63ddcd92358d043a00489338b3da9dec-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/49279804/a63ddcd92358d043a00489338b3da9dec-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2531668293/a63ddcd92358d043a00489338b3da9dec-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2240308318/a63ddcd92358d043a00489338b3da9dec-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2677480537/a63ddcd92358d043a00489338b3da9dec-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/310676009/a63ddcd92358d043a00489338b3da9dec-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1442549751/a63ddcd92358d043a00489338b3da9dec-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1514053728/a63ddcd92358d043a00489338b3da9dec-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3566507470/a63ddcd92358d043a00489338b3da9dec-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1307677668/a63ddcd92358d043a00489338b3da9dec-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2526755130/a63ddcd92358d043a00489338b3da9dec-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2504853902/a63ddcd92358d043a00489338b3da9dec-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/450887114/a63ddcd92358d043a00489338b3da9dec-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1050995863/a63ddcd92358d043a00489338b3da9dec-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4060624354/a63ddcd92358d043a00489338b3da9dec-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1027846167/a63ddcd92358d043a00489338b3da9dec-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2366431014/a63ddcd92358d043a00489338b3da9dec-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/706215318/a63ddcd92358d043a00489338b3da9dec-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1741559080/a63ddcd92358d043a00489338b3da9dec-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3246014835/a63ddcd92358d043a00489338b3da9dec-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3385981307/a63ddcd92358d043a00489338b3da9dec-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1914179560/a63ddcd92358d043a00489338b3da9dec-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1552494172/a63ddcd92358d043a00489338b3da9dec-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/962109835/a63ddcd92358d043a00489338b3da9dec-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3312955779/a63ddcd92358d043a00489338b3da9dec-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1205159403/a63ddcd92358d043a00489338b3da9dec-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1067025097/a63ddcd92358d043a00489338b3da9dec-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3064420011/a63ddcd92358d043a00489338b3da9dec-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4247045324/a63ddcd92358d043a00489338b3da9dec-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3942270472/a63ddcd92358d043a00489338b3da9dec-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3800857339/a63ddcd92358d043a00489338b3da9dec-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2322659824/a63ddcd92358d043a00489338b3da9dec-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4037649215/a63ddcd92358d043a00489338b3da9dec-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3308384586/a63ddcd92358d043a00489338b3da9dec-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2588541637/a63ddcd92358d043a00489338b3da9dec-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3235137466/a63ddcd92358d043a00489338b3da9dec-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1411769697/a63ddcd92358d043a00489338b3da9dec-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3608364970/a63ddcd92358d043a00489338b3da9dec-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2277387507/a63ddcd92358d043a00489338b3da9dec-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3855458437/a63ddcd92358d043a00489338b3da9dec-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3804442227/a63ddcd92358d043a00489338b3da9dec-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/854588941/a63ddcd92358d043a00489338b3da9dec-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9156110/a63ddcd92358d043a00489338b3da9dec-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3372704271/a63ddcd92358d043a00489338b3da9dec-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/736715564/a63ddcd92358d043a00489338b3da9dec-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1714943955/a63ddcd92358d043a00489338b3da9dec-f45o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3923335280/a63ddcd92358d043a00489338b3da9dec-f46o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/254961283/a63ddcd92358d043a00489338b3da9dec-f47o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/227850438/a63ddcd92358d043a00489338b3da9dec-f48o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/438458510/a63ddcd92358d043a00489338b3da9dec-f49o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2910244888/a63ddcd92358d043a00489338b3da9dec-f50o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2733874964/a63ddcd92358d043a00489338b3da9dec-f51o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1108698199/a63ddcd92358d043a00489338b3da9dec-f52o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/209912466/a63ddcd92358d043a00489338b3da9dec-f53o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/107387576/a63ddcd92358d043a00489338b3da9dec-f54o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3119442456/a63ddcd92358d043a00489338b3da9dec-f55o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/101007446/a63ddcd92358d043a00489338b3da9dec-f56o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3582542369/a63ddcd92358d043a00489338b3da9dec-f57o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2748179186/a63ddcd92358d043a00489338b3da9dec-f58o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/195455834/a63ddcd92358d043a00489338b3da9dec-f59o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2108995564/a63ddcd92358d043a00489338b3da9dec-f60o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3135469878/a63ddcd92358d043a00489338b3da9dec-f61o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1092239184/a63ddcd92358d043a00489338b3da9dec-f62o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3478976714/a63ddcd92358d043a00489338b3da9dec-f63o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2189320827/a63ddcd92358d043a00489338b3da9dec-f64o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1101703948/a63ddcd92358d043a00489338b3da9dec-f65o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3109309091/a63ddcd92358d043a00489338b3da9dec-f66o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1535709311/a63ddcd92358d043a00489338b3da9dec-f67o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4131544347/a63ddcd92358d043a00489338b3da9dec-f68o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1698988609/a63ddcd92358d043a00489338b3da9dec-f69o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4018694780/a63ddcd92358d043a00489338b3da9dec-f70o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1552066473/a63ddcd92358d043a00489338b3da9dec-f71o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3485483778/a63ddcd92358d043a00489338b3da9dec-f72o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3700697104/a63ddcd92358d043a00489338b3da9dec-f73o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2016-07-19T02:20:00.000Z",
        "address": {
            "street": "9015 Eager Rd",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63144",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.630179,
                "lng": -90.353493
            }
        },
        "details": {
            "rent": [
                1199,
                1883
            ],
            "beds": [
                0,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                572,
                1465
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/771678957/55207a4b074d4a1f7db7ad0c1dbab2d5c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f179007850o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f1618874978o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f4120479544o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f2462090745o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3251796632o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f1312102905o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3667854697o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f1575012145o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3144069743o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f27651078o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f2904095485o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f2862428621o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f4021005656o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f2661644519o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f612663693o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f767652599o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3983908319o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3722476013o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f1261997609o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f1974226102o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3398140377o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f336860557o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f593632815o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3853342496o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3723527638o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3684551471o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f1361499431o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3969687355o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f2056805031o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3925876341o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f209813295o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f2450498893o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f535379728o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f385597322o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f1390060926o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f16678731o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3593292447o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f910937543o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f1675973578o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f475729936o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f883642954o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f418385911o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f1248253201o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f1156375325o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f2635506444o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f2888811360o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f1875639193o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f4164621229o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f816034219o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f941822254o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f4268682302o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f1229363993o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f4098374054o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f2596155495o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3073037810o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f1249099180o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3043748474o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3954009371o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f222800495o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f1432007756o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3457991311o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3724797422o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f980687053o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f2782083329o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f2178108921o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f4273791611o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3131637087o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f869564752o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f2117863289o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f2813114650o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f1366481703o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55207a4b074d4a1f7db7ad0c1dbab2d5c-f3789797378o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2016-08-05T15:32:00.000Z",
        "address": {
            "street": "4005 Westminster Pl",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63108",
            "country": "USA",
            "county": "ST. LOUIS CITY",
            "coordinates": {
                "lat": 38.641721,
                "lng": -90.242202
            }
        },
        "details": {
            "rent": [
                850,
                1300
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                785,
                1225
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Central West End"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/3211193719/d23d468008acc2184ca8fd0a2c8d8adbc-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f1036617652o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f1962776258o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f4109464916o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2481616481o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f26976111o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f372433895o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f423477610o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f3642101093o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f3678686413o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f1150105740o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f557411035o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f3867349466o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f947555241o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f1996511851o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2401311887o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f517477336o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f439048467o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f1726833398o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f1180273618o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f1370483508o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f3913444611o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f752567188o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2834407999o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f3175470520o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f4190866461o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f3207454534o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f1915937418o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f293186364o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2195891510o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f993043675o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f3281640297o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2359121759o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f4260726808o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f1639994410o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f1689579492o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2328376070o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2593576735o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f3110517817o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2240008609o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f290253873o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2872746427o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f267226540o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2982432967o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f3950450912o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f1389490074o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f4052905066o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f307919329o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f94616613o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f3361387964o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2561824976o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f3362722693o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2947276838o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f1167566182o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2308479054o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2628567225o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2886378277o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f3350086124o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f173118672o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f3203192886o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f214543210o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f1248201665o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f1475194831o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f1123179547o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2496315333o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f535409930o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f2308400669o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f3172562005o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f1406409973o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f3695712244o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f4157214341o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f4280169529o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/d23d468008acc2184ca8fd0a2c8d8adbc-f268000216o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "747 Westbrooke Village Dr",
            "city": "Manchester",
            "state": "MO",
            "zip": "63021",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.56812,
                "lng": -90.51507
            }
        },
        "details": {
            "rent": [
                850,
                1175
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                805,
                1340
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1390598958/013a00b4cac54b094a00012c2abe90bfc-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1650171188/013a00b4cac54b094a00012c2abe90bfc-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2995517706/013a00b4cac54b094a00012c2abe90bfc-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1513430426/013a00b4cac54b094a00012c2abe90bfc-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f1513430426o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f4084575660o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f1455422486o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3723666283/013a00b4cac54b094a00012c2abe90bfc-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2406344387/013a00b4cac54b094a00012c2abe90bfc-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2620502905/013a00b4cac54b094a00012c2abe90bfc-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3048285533/013a00b4cac54b094a00012c2abe90bfc-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3052155562/013a00b4cac54b094a00012c2abe90bfc-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f3579404258o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f1182690503o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f3853069372o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f2315628415o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f4229420117o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f2496970899o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1505661600/013a00b4cac54b094a00012c2abe90bfc-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f1608642328o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f3201473335o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f3804229745o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f240126895o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f1006777982o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f98892741o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1666816413/013a00b4cac54b094a00012c2abe90bfc-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f3584865605o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/669828349/013a00b4cac54b094a00012c2abe90bfc-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3106805490/013a00b4cac54b094a00012c2abe90bfc-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1594497113/013a00b4cac54b094a00012c2abe90bfc-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f648364925o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f2496748705o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f648773518o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/648773518/013a00b4cac54b094a00012c2abe90bfc-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f1707797145o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f3884589842o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f2116706137o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f2989567952o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f1742222595o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f451475474o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f814151330o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f2300025279o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f3665249067o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f3305953180o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f1334635050o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f459958732o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f2108499054o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f1763327727o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f2095693345o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f1222550571o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f1410076718o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f2624647126o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f2739263814o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f4139726525o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f1465479006o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f3855566440o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f2336670962o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f2859546236o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f303410168o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f2856222005o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f2238606583o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f1098820361o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f2905748913o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f182288806o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f3750083803o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f1774741417o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f4014679674o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f1199549905o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f1855715150o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f3198609365o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/013a00b4cac54b094a00012c2abe90bfc-f3203275191o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "2100 N New Florissant Rd",
            "city": "Florissant",
            "state": "MO",
            "zip": "63033",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.8051,
                "lng": -90.31659
            }
        },
        "details": {
            "rent": [
                665,
                940
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                736,
                1350
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Woodridge House"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/3150405700/330248d51733ead0ebb0dea9578a4150c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3150405700o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1153373216o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f2751578400o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f202318112o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3876558221o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f858637228o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f4186953081o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1668293417o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f371659887o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f2436413342o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f2190634782o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3517987001o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1101892595o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1350959689o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f177933902o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f768888485o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3906670072o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1979878226o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f2135811860o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1356626914o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1139404196o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1457535906o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f852498947o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3681118968o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1833240879o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1841202528o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3539916494o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f2332977145o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3225412841o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1832927838o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3767960115o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f660774535o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3282925766o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f4005625372o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f4071852828o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3662150389o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f700469784o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3458805816o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3420957319o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3572577353o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f2909946678o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3755915114o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3850059269o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3302332221o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1428031119o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f551811403o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1051884432o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f4131280998o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f2248923806o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1031841474o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f642079915o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f2697309527o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3965917116o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f2806018435o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1829448176o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1094386811o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f732416195o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3573172912o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f2893480083o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f778502403o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1549081822o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3536131912o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f550678460o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3018420702o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3267825859o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f522824949o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f4125520968o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f1725889367o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/330248d51733ead0ebb0dea9578a4150c-f3042779072o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "2050 Lakerun Ct",
            "city": "Maryland Heights",
            "state": "MO",
            "zip": "63043",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.71371,
                "lng": -90.46899
            }
        },
        "details": {
            "rent": [
                885,
                1955
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2.5
            ],
            "size": [
                674,
                1752
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Pheasant Run West"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1513629065o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1397508978o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1634357299o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f3126836389o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1659169484o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f2800265239o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f3160563501o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f2874467014o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f3927014284o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1833913612o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f3697109505o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f971378113o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1582467446o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1271364913o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1308231735o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1637998162o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f2525208528o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f30061438o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f770223654o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f3843300703o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f3049580777o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f482055974o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1145452925o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f3655499709o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f2649331568o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f2773387181o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1373527673o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1609292203o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f613336382o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f4119028024o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f2487865094o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1348706933o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f4126879002o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f2605605059o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f2198108177o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f2225689546o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1836715656o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f2293906329o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1343236631o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f708734731o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f4278451108o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f330427801o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1541110057o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f140625230o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f4037899203o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f451278407o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f4130900628o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f28701203o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1882770082o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f3302745598o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f4023343320o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f669291700o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f890774700o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f4267616831o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f2752463926o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1743943361o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f792885999o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f724049426o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f217623391o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f2074670858o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f2042819469o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f2520721533o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f2369014907o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f2072336683o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1510060560o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f995433537o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1350018294o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/214d10437815313049469ac90acff86cc-f1597667741o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "10304 Oxford Hill Dr",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63146",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.68155,
                "lng": -90.40484
            }
        },
        "details": {
            "rent": [
                640,
                1050
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                650,
                1200
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Oxford Hill"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f1237962280o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f932183978o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f2447203512o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f613310717o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f300474304o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f4175834o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f2359039838o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f1387453622o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f2521485989o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f1981822427o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f3666447328o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f3202178835o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f3304254729o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f129833568o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f2553704435o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f3556205778o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f318934302o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f1703181388o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f744174437o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f3190411793o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f4047907053o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f1103567481o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f256055329o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f1738065772o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f776746052o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f469339278o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f2831940413o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f195719954o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f3184454973o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f1165775245o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f777641982o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f2037948972o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f3066772613o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f1849928088o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f666815381o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f1084861462o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f3441687751o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f3907902359o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f2330015545o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f1100160040o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f3550471955o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f4079178474o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f2974599624o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f2081750359o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f242805770o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f2949984169o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f653578621o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f1498285764o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f3962675583o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f2915583097o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f2617984194o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f4004164612o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f1621082725o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f1894849700o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f2892270235o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f2884850221o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f433247457o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f11988301o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f3406895291o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f1463409202o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f263293078o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f3103465804o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f362030654o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f501109201o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/326101e86e87e8f47338b536b508ff95c-f624916427o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "3720 Laclede Ave",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63108",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.63504,
                "lng": -90.23807
            }
        },
        "details": {
            "rent": [
                695,
                1265
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                1
            ],
            "size": [
                780,
                1105
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Midtown"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1509775065/afe6639e7d8a677023706ee11edc8dccc-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3330657993/afe6639e7d8a677023706ee11edc8dccc-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3205692833/afe6639e7d8a677023706ee11edc8dccc-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3217012652/afe6639e7d8a677023706ee11edc8dccc-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4265380133/afe6639e7d8a677023706ee11edc8dccc-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2081285942/afe6639e7d8a677023706ee11edc8dccc-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3986285624/afe6639e7d8a677023706ee11edc8dccc-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1738804049/afe6639e7d8a677023706ee11edc8dccc-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2952829526/afe6639e7d8a677023706ee11edc8dccc-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3948218246/afe6639e7d8a677023706ee11edc8dccc-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1561144944/afe6639e7d8a677023706ee11edc8dccc-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3119019364/afe6639e7d8a677023706ee11edc8dccc-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1506669705/afe6639e7d8a677023706ee11edc8dccc-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/783239664/afe6639e7d8a677023706ee11edc8dccc-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1000923893/afe6639e7d8a677023706ee11edc8dccc-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/484463703/afe6639e7d8a677023706ee11edc8dccc-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1759629213/afe6639e7d8a677023706ee11edc8dccc-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4164699256/afe6639e7d8a677023706ee11edc8dccc-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2327044477/afe6639e7d8a677023706ee11edc8dccc-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2481105926/afe6639e7d8a677023706ee11edc8dccc-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1837681186/afe6639e7d8a677023706ee11edc8dccc-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/305597509/afe6639e7d8a677023706ee11edc8dccc-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2755696028/afe6639e7d8a677023706ee11edc8dccc-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2374955174/afe6639e7d8a677023706ee11edc8dccc-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/871173607/afe6639e7d8a677023706ee11edc8dccc-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/656802618/afe6639e7d8a677023706ee11edc8dccc-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3297178958/afe6639e7d8a677023706ee11edc8dccc-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1540103954/afe6639e7d8a677023706ee11edc8dccc-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1155628037/afe6639e7d8a677023706ee11edc8dccc-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3222664129/afe6639e7d8a677023706ee11edc8dccc-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2349135772/afe6639e7d8a677023706ee11edc8dccc-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1041457949/afe6639e7d8a677023706ee11edc8dccc-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/159553586/afe6639e7d8a677023706ee11edc8dccc-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2139974251/afe6639e7d8a677023706ee11edc8dccc-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4172525631/afe6639e7d8a677023706ee11edc8dccc-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/337107657/afe6639e7d8a677023706ee11edc8dccc-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2746989547/afe6639e7d8a677023706ee11edc8dccc-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2802703016/afe6639e7d8a677023706ee11edc8dccc-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2716779929/afe6639e7d8a677023706ee11edc8dccc-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2791595393/afe6639e7d8a677023706ee11edc8dccc-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2349481612/afe6639e7d8a677023706ee11edc8dccc-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2662681670/afe6639e7d8a677023706ee11edc8dccc-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3646101899/afe6639e7d8a677023706ee11edc8dccc-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1782922269/afe6639e7d8a677023706ee11edc8dccc-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3540494600/afe6639e7d8a677023706ee11edc8dccc-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4025957112/afe6639e7d8a677023706ee11edc8dccc-f45o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1016372759/afe6639e7d8a677023706ee11edc8dccc-f46o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3253045412/afe6639e7d8a677023706ee11edc8dccc-f47o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1532723425/afe6639e7d8a677023706ee11edc8dccc-f48o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/795530332/afe6639e7d8a677023706ee11edc8dccc-f49o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4014643762/afe6639e7d8a677023706ee11edc8dccc-f50o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/828459647/afe6639e7d8a677023706ee11edc8dccc-f51o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1403314340/afe6639e7d8a677023706ee11edc8dccc-f52o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/141455710/afe6639e7d8a677023706ee11edc8dccc-f53o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1508289225/afe6639e7d8a677023706ee11edc8dccc-f54o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2459886986/afe6639e7d8a677023706ee11edc8dccc-f55o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/102953322/afe6639e7d8a677023706ee11edc8dccc-f56o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/180163589/afe6639e7d8a677023706ee11edc8dccc-f57o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3117550489/afe6639e7d8a677023706ee11edc8dccc-f58o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3286181884/afe6639e7d8a677023706ee11edc8dccc-f59o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3899398124/afe6639e7d8a677023706ee11edc8dccc-f60o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3090562851/afe6639e7d8a677023706ee11edc8dccc-f61o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2675201207/afe6639e7d8a677023706ee11edc8dccc-f62o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2487470396/afe6639e7d8a677023706ee11edc8dccc-f63o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2886540908/afe6639e7d8a677023706ee11edc8dccc-f64o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "400 Washington Ave",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63102",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.629472,
                "lng": -90.187399
            }
        },
        "details": {
            "rent": [
                990,
                1795
            ],
            "beds": [
                0,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                640,
                1490
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Downtown East St. Louis"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f4241401891o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f4241401891o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f1564447063o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f487572179o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f3212524679o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f93177278o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f1042747818o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f1588495723o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f2310014900o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f1518633437o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f1988590542o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f2213782611o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f729481190o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f709002540o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f2728204071o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f3079369257o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f804440100o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f1444952423o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f3677076272o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f658706502o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f3432703159o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f3475160848o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f1771949969o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f2993286014o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f22554936o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f3785761230o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f2674607309o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f4195370267o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f3729203026o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f550781625o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f4101225426o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f4243550918o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f1292856936o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f4097424928o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f2786854471o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f3860855786o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f917667396o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f3468011528o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f1664354181o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f543962631o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f1346107687o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f3107327790o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f4028371083o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f4067639022o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f791562291o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f1727301783o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f1165072752o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f2278585634o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f658127223o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f1608044332o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f108409594o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f573787148o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f2675034300o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f577281428o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f1036244777o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f2030155985o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f2312654911o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f3212487978o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f4043117177o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f2011743719o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9b347bb882b5e0f0b05c1109aeda8e77c-f2733432755o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "11502 Craig Ct",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63146",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.67426,
                "lng": -90.43861
            }
        },
        "details": {
            "rent": [
                1105,
                1562
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                721,
                1122
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Craigmor"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/104697738/674ef9a86e7fa6b3dbc635718f356f16c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2380163556/674ef9a86e7fa6b3dbc635718f356f16c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2659035315/674ef9a86e7fa6b3dbc635718f356f16c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/680100232/674ef9a86e7fa6b3dbc635718f356f16c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1015239356/674ef9a86e7fa6b3dbc635718f356f16c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3901272907/674ef9a86e7fa6b3dbc635718f356f16c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2465793785/674ef9a86e7fa6b3dbc635718f356f16c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3919399394/674ef9a86e7fa6b3dbc635718f356f16c-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/285733520/674ef9a86e7fa6b3dbc635718f356f16c-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2198796057/674ef9a86e7fa6b3dbc635718f356f16c-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1486563961/674ef9a86e7fa6b3dbc635718f356f16c-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2023000102/674ef9a86e7fa6b3dbc635718f356f16c-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1766995821/674ef9a86e7fa6b3dbc635718f356f16c-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2850038771/674ef9a86e7fa6b3dbc635718f356f16c-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2589569688/674ef9a86e7fa6b3dbc635718f356f16c-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3037740378/674ef9a86e7fa6b3dbc635718f356f16c-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/530473492/674ef9a86e7fa6b3dbc635718f356f16c-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2595736142/674ef9a86e7fa6b3dbc635718f356f16c-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2019175280/674ef9a86e7fa6b3dbc635718f356f16c-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/554248957/674ef9a86e7fa6b3dbc635718f356f16c-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/794507190/674ef9a86e7fa6b3dbc635718f356f16c-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/142747784/674ef9a86e7fa6b3dbc635718f356f16c-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2513706804/674ef9a86e7fa6b3dbc635718f356f16c-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2611699007/674ef9a86e7fa6b3dbc635718f356f16c-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/44071687/674ef9a86e7fa6b3dbc635718f356f16c-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2481639852/674ef9a86e7fa6b3dbc635718f356f16c-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1534015556/674ef9a86e7fa6b3dbc635718f356f16c-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3706677846/674ef9a86e7fa6b3dbc635718f356f16c-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1949712686/674ef9a86e7fa6b3dbc635718f356f16c-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3041369429/674ef9a86e7fa6b3dbc635718f356f16c-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/362661412/674ef9a86e7fa6b3dbc635718f356f16c-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3353101420/674ef9a86e7fa6b3dbc635718f356f16c-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2732750730/674ef9a86e7fa6b3dbc635718f356f16c-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2349072751/674ef9a86e7fa6b3dbc635718f356f16c-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/560540401/674ef9a86e7fa6b3dbc635718f356f16c-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3302159226/674ef9a86e7fa6b3dbc635718f356f16c-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2280030216/674ef9a86e7fa6b3dbc635718f356f16c-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/470354655/674ef9a86e7fa6b3dbc635718f356f16c-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/687528385/674ef9a86e7fa6b3dbc635718f356f16c-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/667717479/674ef9a86e7fa6b3dbc635718f356f16c-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1240818627/674ef9a86e7fa6b3dbc635718f356f16c-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/78986596/674ef9a86e7fa6b3dbc635718f356f16c-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4283021139/674ef9a86e7fa6b3dbc635718f356f16c-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/363150281/674ef9a86e7fa6b3dbc635718f356f16c-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4130552228/674ef9a86e7fa6b3dbc635718f356f16c-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1625591350/674ef9a86e7fa6b3dbc635718f356f16c-f45o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1910395199/674ef9a86e7fa6b3dbc635718f356f16c-f46o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3573148152/674ef9a86e7fa6b3dbc635718f356f16c-f47o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/873132950/674ef9a86e7fa6b3dbc635718f356f16c-f48o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2602560989/674ef9a86e7fa6b3dbc635718f356f16c-f49o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1351164039/674ef9a86e7fa6b3dbc635718f356f16c-f50o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1376227746/674ef9a86e7fa6b3dbc635718f356f16c-f51o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3181763223/674ef9a86e7fa6b3dbc635718f356f16c-f52o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4178772794/674ef9a86e7fa6b3dbc635718f356f16c-f53o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3899909058/674ef9a86e7fa6b3dbc635718f356f16c-f54o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3588537279/674ef9a86e7fa6b3dbc635718f356f16c-f55o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3838740948/674ef9a86e7fa6b3dbc635718f356f16c-f56o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/674ef9a86e7fa6b3dbc635718f356f16c-f2795324275o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/674ef9a86e7fa6b3dbc635718f356f16c-f2520081672o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/674ef9a86e7fa6b3dbc635718f356f16c-f257842979o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "1000 Washington Ave",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63101",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.630967,
                "lng": -90.194488
            }
        },
        "details": {
            "rent": [
                806,
                1529
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2.5
            ],
            "size": [
                531,
                2105
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Downtown East St. Louis"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1775028796/41aefabda6ae020b9b07f0c40f9db537c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/809039779/41aefabda6ae020b9b07f0c40f9db537c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2461024120/41aefabda6ae020b9b07f0c40f9db537c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2458613001/41aefabda6ae020b9b07f0c40f9db537c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4280670528/41aefabda6ae020b9b07f0c40f9db537c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2055852715/41aefabda6ae020b9b07f0c40f9db537c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/417165029/41aefabda6ae020b9b07f0c40f9db537c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3799469906/41aefabda6ae020b9b07f0c40f9db537c-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3238701954/41aefabda6ae020b9b07f0c40f9db537c-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2749736569/41aefabda6ae020b9b07f0c40f9db537c-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2791640871/41aefabda6ae020b9b07f0c40f9db537c-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3409272185/41aefabda6ae020b9b07f0c40f9db537c-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1216238507/41aefabda6ae020b9b07f0c40f9db537c-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1466257963/41aefabda6ae020b9b07f0c40f9db537c-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1189516881/41aefabda6ae020b9b07f0c40f9db537c-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3095421296/41aefabda6ae020b9b07f0c40f9db537c-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2863020632/41aefabda6ae020b9b07f0c40f9db537c-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2142268431/41aefabda6ae020b9b07f0c40f9db537c-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3320621991/41aefabda6ae020b9b07f0c40f9db537c-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3426912539/41aefabda6ae020b9b07f0c40f9db537c-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1605454506/41aefabda6ae020b9b07f0c40f9db537c-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/856923473/41aefabda6ae020b9b07f0c40f9db537c-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/773511570/41aefabda6ae020b9b07f0c40f9db537c-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2914238521/41aefabda6ae020b9b07f0c40f9db537c-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3784496246/41aefabda6ae020b9b07f0c40f9db537c-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2134120136/41aefabda6ae020b9b07f0c40f9db537c-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3753500004/41aefabda6ae020b9b07f0c40f9db537c-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/786111198/41aefabda6ae020b9b07f0c40f9db537c-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/389412344/41aefabda6ae020b9b07f0c40f9db537c-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2913690895/41aefabda6ae020b9b07f0c40f9db537c-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2187128985/41aefabda6ae020b9b07f0c40f9db537c-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3061866834/41aefabda6ae020b9b07f0c40f9db537c-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2529979078/41aefabda6ae020b9b07f0c40f9db537c-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2706867700/41aefabda6ae020b9b07f0c40f9db537c-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4167699728/41aefabda6ae020b9b07f0c40f9db537c-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3300055440/41aefabda6ae020b9b07f0c40f9db537c-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2861096881/41aefabda6ae020b9b07f0c40f9db537c-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f1341992555o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f2374543349o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f2912238809o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f3308853622o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f2781810855o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f1201263208o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f1065433024o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f723794980o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f3703061716o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f1013537710o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f1072339818o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f2784657056o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f481845313o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f3874686084o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f308226410o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f4280493921o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f1195028552o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f3871081896o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f740303942o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f349053139o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f2866874797o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f3082958144o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/41aefabda6ae020b9b07f0c40f9db537c-f2929100951o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2016-08-05T15:32:00.000Z",
        "address": {
            "street": "5927 Suson Pl",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63139",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.60354,
                "lng": -90.29037
            }
        },
        "details": {
            "rent": [
                738,
                816
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                1
            ],
            "size": [
                540,
                800
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Tilles Park"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/378365689/32acd79034b1ac49f9043c44778fbda9c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1658302886/32acd79034b1ac49f9043c44778fbda9c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/271582813/32acd79034b1ac49f9043c44778fbda9c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1314063606/32acd79034b1ac49f9043c44778fbda9c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1590109489/32acd79034b1ac49f9043c44778fbda9c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3602600158/32acd79034b1ac49f9043c44778fbda9c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1785182861/32acd79034b1ac49f9043c44778fbda9c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/872074157/32acd79034b1ac49f9043c44778fbda9c-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1371641406/32acd79034b1ac49f9043c44778fbda9c-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3579371576/32acd79034b1ac49f9043c44778fbda9c-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2951239819/32acd79034b1ac49f9043c44778fbda9c-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3350545028/32acd79034b1ac49f9043c44778fbda9c-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1930857016/32acd79034b1ac49f9043c44778fbda9c-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/874708455/32acd79034b1ac49f9043c44778fbda9c-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2446602775/32acd79034b1ac49f9043c44778fbda9c-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/939639883/32acd79034b1ac49f9043c44778fbda9c-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/617853664/32acd79034b1ac49f9043c44778fbda9c-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2678023030/32acd79034b1ac49f9043c44778fbda9c-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/7588048/32acd79034b1ac49f9043c44778fbda9c-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3929167316/32acd79034b1ac49f9043c44778fbda9c-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1393806422/32acd79034b1ac49f9043c44778fbda9c-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3784717259/32acd79034b1ac49f9043c44778fbda9c-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3984980370/32acd79034b1ac49f9043c44778fbda9c-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/44816349/32acd79034b1ac49f9043c44778fbda9c-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2377886195/32acd79034b1ac49f9043c44778fbda9c-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1868756658/32acd79034b1ac49f9043c44778fbda9c-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1505973061/32acd79034b1ac49f9043c44778fbda9c-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1499874100/32acd79034b1ac49f9043c44778fbda9c-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2901479251/32acd79034b1ac49f9043c44778fbda9c-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1050432389/32acd79034b1ac49f9043c44778fbda9c-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/343020653/32acd79034b1ac49f9043c44778fbda9c-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/912622561/32acd79034b1ac49f9043c44778fbda9c-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/585338563/32acd79034b1ac49f9043c44778fbda9c-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3024711351/32acd79034b1ac49f9043c44778fbda9c-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1669060580/32acd79034b1ac49f9043c44778fbda9c-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2556223871/32acd79034b1ac49f9043c44778fbda9c-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3055435826/32acd79034b1ac49f9043c44778fbda9c-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2637092038/32acd79034b1ac49f9043c44778fbda9c-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/792054484/32acd79034b1ac49f9043c44778fbda9c-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2645763797/32acd79034b1ac49f9043c44778fbda9c-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3202588344/32acd79034b1ac49f9043c44778fbda9c-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/307295721/32acd79034b1ac49f9043c44778fbda9c-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3366876350/32acd79034b1ac49f9043c44778fbda9c-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1143683690/32acd79034b1ac49f9043c44778fbda9c-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2365338186/32acd79034b1ac49f9043c44778fbda9c-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1556539071/32acd79034b1ac49f9043c44778fbda9c-f45o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2771107880/32acd79034b1ac49f9043c44778fbda9c-f46o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2911709950/32acd79034b1ac49f9043c44778fbda9c-f47o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3640782794/32acd79034b1ac49f9043c44778fbda9c-f48o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1465855114/32acd79034b1ac49f9043c44778fbda9c-f49o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1345210851/32acd79034b1ac49f9043c44778fbda9c-f50o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1170060283/32acd79034b1ac49f9043c44778fbda9c-f51o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1935086165/32acd79034b1ac49f9043c44778fbda9c-f52o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/182455307/32acd79034b1ac49f9043c44778fbda9c-f53o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2610817545/32acd79034b1ac49f9043c44778fbda9c-f54o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2547928955/32acd79034b1ac49f9043c44778fbda9c-f55o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1084369145/32acd79034b1ac49f9043c44778fbda9c-f56o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3367653685/32acd79034b1ac49f9043c44778fbda9c-f57o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2605567287/32acd79034b1ac49f9043c44778fbda9c-f58o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/309662126/32acd79034b1ac49f9043c44778fbda9c-f59o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2018-08-20T17:22:00.000Z",
        "address": {
            "street": "1300 Big Bend Rd",
            "city": "Ballwin",
            "state": "MO",
            "zip": "63021",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.56727,
                "lng": -90.499
            }
        },
        "details": {
            "rent": [
                1236,
                2255
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                657,
                1385
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/3755851550/e076b182e21e33364a31ce5ec72d5a6ac-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f3755851550o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f21540826o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2877361949o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f1938929611o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2799094139o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f316015717o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f1422531388o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f1028786358o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f373037364o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2176694257o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f1791745428o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2564259109o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f637118714o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f22945546o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f3980229449o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f1544999005o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f3549980432o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f3048404182o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f3334616097o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f1844591572o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f853107752o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f3639830116o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2327994878o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f3306500919o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f1384989330o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2611441928o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2960230913o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f1512021668o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2808132538o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2318482945o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f400553114o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2771543384o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f1603827046o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f3733155218o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f3349584333o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f1572362967o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2632701660o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f1779968116o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f1273633550o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2122987077o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2414629345o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f572372547o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2990072035o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f344733667o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f3143102322o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f730159134o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2432286000o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f1247151914o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f3660244752o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f1680290500o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2082421674o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f778435353o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f240203536o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2109559614o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2320603536o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f4162866639o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e076b182e21e33364a31ce5ec72d5a6ac-f2943948670o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2017-10-04T12:49:00.000Z",
        "address": {
            "street": "8500 Maryland Ave",
            "city": "Clayton",
            "state": "MO",
            "zip": "63124",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.65274,
                "lng": -90.34911
            }
        },
        "details": {
            "rent": [
                1599,
                3040
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                677,
                1635
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2428681838o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2428681838o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f3544278673o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2295204676o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f499765053o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f3886148430o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2533512547o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2056307869o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2414503290o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f3123812087o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2345416465o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2868365131o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2727656611o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2596203002o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f1851537333o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f3131024042o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f3461238785o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2357911729o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f3950535815o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f583071442o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2185984568o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f1422712924o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f1774874395o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f128972706o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2822740538o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f1988393650o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2882849676o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f4189046098o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f1952852393o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f744633930o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f3258189955o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f1969087940o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2681509065o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f3021462o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2861355767o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f3208876275o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f150878697o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f3778015869o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f331135415o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f1302055292o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f4089795021o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f1132515025o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f990667812o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f469633647o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f1782735582o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f200901353o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2341486016o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f114149059o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f640760533o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f3982600459o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2207739018o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f3557280357o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f534004618o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f2990752691o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f3412019127o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f4086004686o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e27e6db7dfde38c2b4a7c0c3acab0706c-f3856592129o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2020-01-28T04:04:00.000Z",
        "address": {
            "street": "1325 Boland Pl",
            "city": "Clayton",
            "state": "MO",
            "zip": "63117",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.627951,
                "lng": -90.328482
            }
        },
        "details": {
            "rent": [
                1259,
                4985
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                515,
                1776
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f3492196836o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1946027508o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f3815805325o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f3549428182o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1798802o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f446682899o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f2234848709o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f2048629633o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1904787004o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f77594263o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1605380905o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1309731414o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f974041751o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f149387677o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f4143383599o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f2526815380o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f2073658945o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f2502238950o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f4020077983o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f2780078037o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f220862014o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f3338269531o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f2583387510o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f295293725o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f2911933492o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1431686186o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1738255028o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f2319878204o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1520733427o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f2297696398o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1074309186o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1336101165o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f3696502851o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f222354683o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f511988791o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1318867797o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f2360241203o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1100694920o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f2866883802o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f280880873o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f3236912453o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f2707448726o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1361821639o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f2034905655o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f315486135o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f3336882143o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f703286596o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f993206391o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f2943678882o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1316915566o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f3454171709o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1292338661o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1522647917o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1834090643o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f3959063151o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f1772929663o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/122db64e34b5fa03001ee61dee2a50c4c-f2279314784o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "1000 Darwick Ct",
            "city": "Creve Coeur",
            "state": "MO",
            "zip": "63132",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.67715,
                "lng": -90.39529
            }
        },
        "details": {
            "rent": [
                935,
                1520
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                1.5
            ],
            "size": [
                850,
                1650
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1316701798/40626a610daeff4ac17ac042b756493ec-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1418111592/40626a610daeff4ac17ac042b756493ec-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/940920925/40626a610daeff4ac17ac042b756493ec-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4213683393/40626a610daeff4ac17ac042b756493ec-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3025785581/40626a610daeff4ac17ac042b756493ec-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/440734371/40626a610daeff4ac17ac042b756493ec-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/615486395/40626a610daeff4ac17ac042b756493ec-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2019840793/40626a610daeff4ac17ac042b756493ec-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2913782333/40626a610daeff4ac17ac042b756493ec-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2140695258/40626a610daeff4ac17ac042b756493ec-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/758671850/40626a610daeff4ac17ac042b756493ec-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2762617374/40626a610daeff4ac17ac042b756493ec-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1801630101/40626a610daeff4ac17ac042b756493ec-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3750066862/40626a610daeff4ac17ac042b756493ec-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3300814666/40626a610daeff4ac17ac042b756493ec-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3941539442/40626a610daeff4ac17ac042b756493ec-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1410248325/40626a610daeff4ac17ac042b756493ec-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2974047536/40626a610daeff4ac17ac042b756493ec-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/596728823/40626a610daeff4ac17ac042b756493ec-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1270305064/40626a610daeff4ac17ac042b756493ec-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1308638455/40626a610daeff4ac17ac042b756493ec-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2715081385/40626a610daeff4ac17ac042b756493ec-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2075460294/40626a610daeff4ac17ac042b756493ec-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1022448405/40626a610daeff4ac17ac042b756493ec-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3644005036/40626a610daeff4ac17ac042b756493ec-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/965036704/40626a610daeff4ac17ac042b756493ec-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2265105864/40626a610daeff4ac17ac042b756493ec-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1484240097/40626a610daeff4ac17ac042b756493ec-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/91046873/40626a610daeff4ac17ac042b756493ec-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/410963390/40626a610daeff4ac17ac042b756493ec-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2427201730/40626a610daeff4ac17ac042b756493ec-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3488607818/40626a610daeff4ac17ac042b756493ec-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2890541473/40626a610daeff4ac17ac042b756493ec-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/672086024/40626a610daeff4ac17ac042b756493ec-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/971520632/40626a610daeff4ac17ac042b756493ec-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2696107392/40626a610daeff4ac17ac042b756493ec-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/137468881/40626a610daeff4ac17ac042b756493ec-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2485158765/40626a610daeff4ac17ac042b756493ec-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3551026154/40626a610daeff4ac17ac042b756493ec-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/372358870/40626a610daeff4ac17ac042b756493ec-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/417076294/40626a610daeff4ac17ac042b756493ec-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/282026865/40626a610daeff4ac17ac042b756493ec-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2930885672/40626a610daeff4ac17ac042b756493ec-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3023518959/40626a610daeff4ac17ac042b756493ec-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2969026759/40626a610daeff4ac17ac042b756493ec-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2841042027/40626a610daeff4ac17ac042b756493ec-f45o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2215357868/40626a610daeff4ac17ac042b756493ec-f46o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3193159290/40626a610daeff4ac17ac042b756493ec-f47o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2041586631/40626a610daeff4ac17ac042b756493ec-f48o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1149176450/40626a610daeff4ac17ac042b756493ec-f49o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2215863680/40626a610daeff4ac17ac042b756493ec-f50o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1889959626/40626a610daeff4ac17ac042b756493ec-f51o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "3975 Taravue Ln",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63125",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.50312,
                "lng": -90.31795
            }
        },
        "details": {
            "rent": [
                635,
                790
            ],
            "beds": [
                0,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                461,
                870
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f2449201556o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f83213221o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f2350740294o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f4224160696o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f1424423700o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f3602901187o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f2809730817o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f2803856971o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f3638484489o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f581999117o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f3754115085o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f4149118679o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f205597192o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f1919074060o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f9780941o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f1628169924o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f813886910o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f3005546826o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f1784157762o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f498822502o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f86502084o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f3029899377o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f3980245426o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f2824506557o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f37921785o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f3137895634o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f2456295103o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f3102263817o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f2170204029o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f1394928199o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f229866512o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f1150350811o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f784059772o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f987541012o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f3952923414o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f1169997689o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f780678195o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f1352000019o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f2877766738o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f385026478o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f2083961526o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f447193425o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f1768904330o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f1404288320o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f2260461209o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f847229572o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f3543690794o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f1190460167o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f2679235961o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f199383444o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f4130442452o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/85e91f6b200857b4909b322dc21f9799c-f1299755771o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "4583 Whisper Lake Dr",
            "city": "Florissant",
            "state": "MO",
            "zip": "63033",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.792167,
                "lng": -90.272846
            }
        },
        "details": {
            "rent": [
                595,
                1385
            ],
            "beds": [
                1,
                5
            ],
            "baths": [
                1,
                2.5
            ],
            "size": [
                650,
                1800
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Whispering Lake"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/3648289502/41ec44e09aabaa6b2cc33773a07fdca9c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2802269874/41ec44e09aabaa6b2cc33773a07fdca9c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2518350809/41ec44e09aabaa6b2cc33773a07fdca9c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2156523178/41ec44e09aabaa6b2cc33773a07fdca9c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3145130294/41ec44e09aabaa6b2cc33773a07fdca9c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1343278147/41ec44e09aabaa6b2cc33773a07fdca9c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/517494728/41ec44e09aabaa6b2cc33773a07fdca9c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1007446404/41ec44e09aabaa6b2cc33773a07fdca9c-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/412661543/41ec44e09aabaa6b2cc33773a07fdca9c-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3280703189/41ec44e09aabaa6b2cc33773a07fdca9c-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2303801002/41ec44e09aabaa6b2cc33773a07fdca9c-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2106858061/41ec44e09aabaa6b2cc33773a07fdca9c-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3207229764/41ec44e09aabaa6b2cc33773a07fdca9c-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2713456238/41ec44e09aabaa6b2cc33773a07fdca9c-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4082762704/41ec44e09aabaa6b2cc33773a07fdca9c-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4100417769/41ec44e09aabaa6b2cc33773a07fdca9c-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2239513811/41ec44e09aabaa6b2cc33773a07fdca9c-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4185247135/41ec44e09aabaa6b2cc33773a07fdca9c-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2078695090/41ec44e09aabaa6b2cc33773a07fdca9c-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3932567682/41ec44e09aabaa6b2cc33773a07fdca9c-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2495344084/41ec44e09aabaa6b2cc33773a07fdca9c-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1920252222/41ec44e09aabaa6b2cc33773a07fdca9c-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3825808747/41ec44e09aabaa6b2cc33773a07fdca9c-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3796914804/41ec44e09aabaa6b2cc33773a07fdca9c-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/15701662/41ec44e09aabaa6b2cc33773a07fdca9c-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1552303145/41ec44e09aabaa6b2cc33773a07fdca9c-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/494485992/41ec44e09aabaa6b2cc33773a07fdca9c-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1891029058/41ec44e09aabaa6b2cc33773a07fdca9c-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3903603613/41ec44e09aabaa6b2cc33773a07fdca9c-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2187348403/41ec44e09aabaa6b2cc33773a07fdca9c-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/439669066/41ec44e09aabaa6b2cc33773a07fdca9c-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3927376073/41ec44e09aabaa6b2cc33773a07fdca9c-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3434337829/41ec44e09aabaa6b2cc33773a07fdca9c-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1866436836/41ec44e09aabaa6b2cc33773a07fdca9c-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1676468171/41ec44e09aabaa6b2cc33773a07fdca9c-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1665779857/41ec44e09aabaa6b2cc33773a07fdca9c-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2542061477/41ec44e09aabaa6b2cc33773a07fdca9c-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/726703346/41ec44e09aabaa6b2cc33773a07fdca9c-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3595980326/41ec44e09aabaa6b2cc33773a07fdca9c-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/157530901/41ec44e09aabaa6b2cc33773a07fdca9c-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/974835445/41ec44e09aabaa6b2cc33773a07fdca9c-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1512860013/41ec44e09aabaa6b2cc33773a07fdca9c-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3617551264/41ec44e09aabaa6b2cc33773a07fdca9c-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3960329849/41ec44e09aabaa6b2cc33773a07fdca9c-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1630121215/41ec44e09aabaa6b2cc33773a07fdca9c-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2058025784/41ec44e09aabaa6b2cc33773a07fdca9c-f45o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1621692233/41ec44e09aabaa6b2cc33773a07fdca9c-f46o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/183799205/41ec44e09aabaa6b2cc33773a07fdca9c-f47o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2465936490/41ec44e09aabaa6b2cc33773a07fdca9c-f48o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2625562653/41ec44e09aabaa6b2cc33773a07fdca9c-f49o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2302691181/41ec44e09aabaa6b2cc33773a07fdca9c-f50o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "1102 Autumn Creek Way",
            "city": "Manchester",
            "state": "MO",
            "zip": "63088",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.56815,
                "lng": -90.48082
            }
        },
        "details": {
            "rent": [
                935,
                1325
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                830,
                1300
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2873865441o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2873865441o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f441377178o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2245603564o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f348120000o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f595999468o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2415129047o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f4106708201o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f3243199011o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f1102027631o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f3557182361o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f1407809889o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f3318526184o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2751671751o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f1020844674o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f3851931947o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2048641892o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f3896318758o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2470699056o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f3124225989o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f4022451149o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f3728431860o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2319372299o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2191861418o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f3805972292o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2897009561o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f961896941o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f3877936036o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f3602137807o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f505324440o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2264779793o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f1058091555o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f1306930207o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2664440946o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f3236400959o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2832215853o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f8181811o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f1919339338o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f3029814099o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2432096054o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2995285195o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f870173977o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f1272643293o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2823297151o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f73121307o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2840160174o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f2124919083o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f3602941595o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f3092234563o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/bf16dfd00615cc7585f57e27ee1794b1c-f1665451338o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "24 The Blvd",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63117",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.63533,
                "lng": -90.34441
            }
        },
        "details": {
            "rent": [
                975,
                2495
            ],
            "beds": [
                0,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                525,
                1428
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Lavinia Gardens"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/126873895/90383bdbf8218ad4b76272fdd67a48edc-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2113402240/90383bdbf8218ad4b76272fdd67a48edc-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3762872126/90383bdbf8218ad4b76272fdd67a48edc-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/558297665/90383bdbf8218ad4b76272fdd67a48edc-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1253116657/90383bdbf8218ad4b76272fdd67a48edc-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3192858923/90383bdbf8218ad4b76272fdd67a48edc-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/874928753/90383bdbf8218ad4b76272fdd67a48edc-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3810587113/90383bdbf8218ad4b76272fdd67a48edc-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3938106716/90383bdbf8218ad4b76272fdd67a48edc-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1959925976/90383bdbf8218ad4b76272fdd67a48edc-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3238200637/90383bdbf8218ad4b76272fdd67a48edc-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1514326350/90383bdbf8218ad4b76272fdd67a48edc-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2529238974/90383bdbf8218ad4b76272fdd67a48edc-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2615199083/90383bdbf8218ad4b76272fdd67a48edc-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1700510148/90383bdbf8218ad4b76272fdd67a48edc-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3368777740/90383bdbf8218ad4b76272fdd67a48edc-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3032681550/90383bdbf8218ad4b76272fdd67a48edc-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/9254665/90383bdbf8218ad4b76272fdd67a48edc-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/81678115/90383bdbf8218ad4b76272fdd67a48edc-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2120913108/90383bdbf8218ad4b76272fdd67a48edc-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3892510768/90383bdbf8218ad4b76272fdd67a48edc-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3007733543/90383bdbf8218ad4b76272fdd67a48edc-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/419724607/90383bdbf8218ad4b76272fdd67a48edc-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2550328736/90383bdbf8218ad4b76272fdd67a48edc-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1565108442/90383bdbf8218ad4b76272fdd67a48edc-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2114416034/90383bdbf8218ad4b76272fdd67a48edc-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1330619665/90383bdbf8218ad4b76272fdd67a48edc-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2114922799/90383bdbf8218ad4b76272fdd67a48edc-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4081645120/90383bdbf8218ad4b76272fdd67a48edc-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/271363327/90383bdbf8218ad4b76272fdd67a48edc-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/926064875/90383bdbf8218ad4b76272fdd67a48edc-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2659580131/90383bdbf8218ad4b76272fdd67a48edc-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3086441391/90383bdbf8218ad4b76272fdd67a48edc-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3791621655/90383bdbf8218ad4b76272fdd67a48edc-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3518342212/90383bdbf8218ad4b76272fdd67a48edc-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2021158093/90383bdbf8218ad4b76272fdd67a48edc-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2225223403/90383bdbf8218ad4b76272fdd67a48edc-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/215980737/90383bdbf8218ad4b76272fdd67a48edc-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1859636177/90383bdbf8218ad4b76272fdd67a48edc-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3530622152/90383bdbf8218ad4b76272fdd67a48edc-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1321283629/90383bdbf8218ad4b76272fdd67a48edc-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3804236625/90383bdbf8218ad4b76272fdd67a48edc-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2797921437/90383bdbf8218ad4b76272fdd67a48edc-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3409854706/90383bdbf8218ad4b76272fdd67a48edc-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3207511518/90383bdbf8218ad4b76272fdd67a48edc-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1514358087/90383bdbf8218ad4b76272fdd67a48edc-f45o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1411391407/90383bdbf8218ad4b76272fdd67a48edc-f46o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1341227565/90383bdbf8218ad4b76272fdd67a48edc-f47o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/912139041/90383bdbf8218ad4b76272fdd67a48edc-f48o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2775940716/90383bdbf8218ad4b76272fdd67a48edc-f49o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "2207 Summerhouse Dr",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63146",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.70147,
                "lng": -90.46057
            }
        },
        "details": {
            "rent": [
                678,
                1014
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                625,
                983
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Pavilion"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f1655482655o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f1655482655o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f384672689o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f2399007496o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f4198275001o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f24497348o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f177095022o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f2264689358o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f430645338o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f1692615027o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f2278647861o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f3492360882o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f2166495852o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f1979101003o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f2011631163o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f3156320015o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f340350562o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f1527555029o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f3717220377o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f1797117897o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f182016131o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f4050282119o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f2198095663o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f991343108o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f2989949324o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f3659399487o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f1013114123o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f1482543144o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f1971294155o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f3639576622o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f4239561089o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f1038425114o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f2285296017o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f3706900588o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f217510863o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f3085833960o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f2823359299o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f533774550o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f2298690842o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f957912545o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f665332665o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f3069022515o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f1274177352o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f3063800210o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f4110948185o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f1956873792o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f3104019459o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f3908360263o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/8e480a2d2eca7922cdff8f9311d7cdb0c-f244241280o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2016-08-31T14:24:00.000Z",
        "address": {
            "street": "1001 Old Olive Way",
            "city": "Creve Coeur",
            "state": "MO",
            "zip": "63141",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.67555,
                "lng": -90.41242
            }
        },
        "details": {
            "rent": [
                1380,
                2295
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                688,
                1257
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f4160391913o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3198572278/82f5957cab264c34ef5b5483d3ed12e7c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f64268363o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f953866630o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f4120624885o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f1705772756o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f710123711o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f2631457106o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f4071489957o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f1208833834o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f1843927182o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f3417432549o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f555401720o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f2115186510o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f1183465425o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f413768348o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f19242746o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f1900384139o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f3433684259o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f1972553965o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f4172050339o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f505589792o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f1773990815o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f3276814166o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f2146242289o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f2570014103o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f2076587247o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f3371466217o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f1008838901o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f3928748761o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f108644224o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f3934471661o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f3814458647o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f2271430483o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f1544300114o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f3651301707o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f1713737757o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f2269832431o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f830545055o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f1435484442o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f1142840392o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f2369003538o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f1278802489o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f1176906182o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f4246555123o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f3818516610o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f4212671430o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f111669851o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/82f5957cab264c34ef5b5483d3ed12e7c-f1321754285o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "1226 Olive St",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63103",
            "country": "USA",
            "county": "Saint Louis City",
            "coordinates": {
                "lat": 38.6297,
                "lng": -90.19859
            }
        },
        "details": {
            "rent": [
                1200,
                1900
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                751,
                1425
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Downtown West St. Louis"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1039693679/f54d33fcf044f1dc0877c10e8789b9f9c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f205263135o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f3802118615o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f3737901333o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f4211991527o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f3489634972o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f2184352154o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f218990099o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f4074745473o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f2159932372o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f4065030758o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f2383766634o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f406654136o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f3031109981o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f1932992816o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f3877039797o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f1388878293o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f3126672737o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f4256294801o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f1767582126o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f1680968345o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f1723595186o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f537731352o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f1664074611o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f4064940870o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f2515084008o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f3339057651o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f248199109o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f2838597197o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f1442686483o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f896521106o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f3748712995o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f3006726387o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f3644335549o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f1528132525o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f1748618277o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f3894537719o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f3562342414o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f2222089707o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f3062311925o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f4118678253o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f1389854403o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f1468179909o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f4056263592o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f484908903o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f3307075424o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f54d33fcf044f1dc0877c10e8789b9f9c-f2820873341o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2016-08-05T15:32:00.000Z",
        "address": {
            "street": "101 Adeline Dr",
            "city": "Belleville",
            "state": "IL",
            "zip": "62221",
            "country": "USA",
            "county": "St. Clair",
            "coordinates": {
                "lat": 38.5453,
                "lng": -89.93996
            }
        },
        "details": {
            "rent": [
                690,
                890
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                1
            ],
            "size": [
                700,
                1000
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1190266709/f4510266cccaf262e5c29ae0bcd22b02c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f1190266709o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f2422610497o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f3972634907o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f3939148162o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f175041957o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f2394405556o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f432539151o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f1649829197o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f2799566576o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f2033654256o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f710152407o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f654954859o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f278674455o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f2988989601o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f321469815o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f1416134398o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f2121286869o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f1183638605o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f911822203o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f346449692o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f2867188550o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f1735770078o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f663407067o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f3714800098o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f1778384978o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f3060719133o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f2750530322o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f2226533361o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f1294012072o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f4254251743o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f3217474107o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f1443049292o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f1494521371o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f2742563152o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f1894522880o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f1484724422o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f1558788927o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f3063431611o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f3719787682o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f2121828629o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f3497496772o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f2316839266o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f1056406265o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f3416616868o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/f4510266cccaf262e5c29ae0bcd22b02c-f3205855302o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2016-08-05T15:32:00.000Z",
        "address": {
            "street": "4216 Carrollton Dr",
            "city": "Bridgeton",
            "state": "MO",
            "zip": "63044",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.75747,
                "lng": -90.42634
            }
        },
        "details": {
            "rent": [
                810,
                1275
            ],
            "beds": [
                2,
                3
            ],
            "baths": [
                1,
                1.5
            ],
            "size": [
                850,
                1600
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f2815576325o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f2815576325o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f1466658021o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f635785498o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f1923140277o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f4261068689o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f514258724o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f3193165831o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f2193321597o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f3174572534o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f786929336o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f2387615434o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f1921650252o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f1659925039o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f3132010000o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f1720418966o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f3363966822o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f2679908987o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f2532101217o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f3231861843o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f3366099710o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f3154701269o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f474755302o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f1531647155o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f1086522003o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f3579516684o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f3352152629o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f2698245240o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f2459651680o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f3855246623o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f1138596161o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f2381425425o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f1605784658o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f3610275631o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f1867651932o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f2646321246o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f942960317o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f2011881466o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f1212233864o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f3000898034o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f861958185o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f440486571o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f31031868o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f1237369238o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f827345602o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/55423b334bf08f9766a610675f4b46dec-f3733364295o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "11409 Tivoli Ln",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63146",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.69344,
                "lng": -90.42567
            }
        },
        "details": {
            "rent": [
                915,
                1565
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2.5
            ],
            "size": [
                750,
                2010
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "La Maison Village"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1200228802/6720828d40d798c966a6dcb3faa6ced4c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2043914807/6720828d40d798c966a6dcb3faa6ced4c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3907993117/6720828d40d798c966a6dcb3faa6ced4c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/710517340/6720828d40d798c966a6dcb3faa6ced4c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2168324864/6720828d40d798c966a6dcb3faa6ced4c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3223861958/6720828d40d798c966a6dcb3faa6ced4c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/586145420/6720828d40d798c966a6dcb3faa6ced4c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2462021460/6720828d40d798c966a6dcb3faa6ced4c-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2957895729/6720828d40d798c966a6dcb3faa6ced4c-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3276441343/6720828d40d798c966a6dcb3faa6ced4c-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1179541247/6720828d40d798c966a6dcb3faa6ced4c-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1061498525/6720828d40d798c966a6dcb3faa6ced4c-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3002565751/6720828d40d798c966a6dcb3faa6ced4c-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2988675013/6720828d40d798c966a6dcb3faa6ced4c-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2714818500/6720828d40d798c966a6dcb3faa6ced4c-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3018216972/6720828d40d798c966a6dcb3faa6ced4c-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/566010487/6720828d40d798c966a6dcb3faa6ced4c-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1650496395/6720828d40d798c966a6dcb3faa6ced4c-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/767273158/6720828d40d798c966a6dcb3faa6ced4c-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1346134380/6720828d40d798c966a6dcb3faa6ced4c-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2791375120/6720828d40d798c966a6dcb3faa6ced4c-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/724284405/6720828d40d798c966a6dcb3faa6ced4c-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/16448086/6720828d40d798c966a6dcb3faa6ced4c-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3930932300/6720828d40d798c966a6dcb3faa6ced4c-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1504000171/6720828d40d798c966a6dcb3faa6ced4c-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2638409065/6720828d40d798c966a6dcb3faa6ced4c-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/951391488/6720828d40d798c966a6dcb3faa6ced4c-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3238075930/6720828d40d798c966a6dcb3faa6ced4c-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/443772755/6720828d40d798c966a6dcb3faa6ced4c-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3682243910/6720828d40d798c966a6dcb3faa6ced4c-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1019909113/6720828d40d798c966a6dcb3faa6ced4c-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/728073595/6720828d40d798c966a6dcb3faa6ced4c-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3842263529/6720828d40d798c966a6dcb3faa6ced4c-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1632748808/6720828d40d798c966a6dcb3faa6ced4c-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/789580111/6720828d40d798c966a6dcb3faa6ced4c-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3882918208/6720828d40d798c966a6dcb3faa6ced4c-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3649417717/6720828d40d798c966a6dcb3faa6ced4c-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2873783942/6720828d40d798c966a6dcb3faa6ced4c-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3424744514/6720828d40d798c966a6dcb3faa6ced4c-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2252242656/6720828d40d798c966a6dcb3faa6ced4c-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/310586357/6720828d40d798c966a6dcb3faa6ced4c-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2661980935/6720828d40d798c966a6dcb3faa6ced4c-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2238564764/6720828d40d798c966a6dcb3faa6ced4c-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3152687245/6720828d40d798c966a6dcb3faa6ced4c-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/422871422/6720828d40d798c966a6dcb3faa6ced4c-f44o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1786592186/6720828d40d798c966a6dcb3faa6ced4c-f45o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2016-08-05T15:32:00.000Z",
        "address": {
            "street": "1778 Richardson Rd",
            "city": "Arnold",
            "state": "MO",
            "zip": "63010",
            "country": "USA",
            "county": "Jefferson",
            "coordinates": {
                "lat": 38.40967,
                "lng": -90.37918
            }
        },
        "details": {
            "rent": [
                875,
                1205
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                750,
                1196
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/546097113/a3406e42315a67f5527d7c6a5938c3e5c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/151875488/a3406e42315a67f5527d7c6a5938c3e5c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3832347956/a3406e42315a67f5527d7c6a5938c3e5c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4263064763/a3406e42315a67f5527d7c6a5938c3e5c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1164549797/a3406e42315a67f5527d7c6a5938c3e5c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/475278225/a3406e42315a67f5527d7c6a5938c3e5c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1545484405/a3406e42315a67f5527d7c6a5938c3e5c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1133271192/a3406e42315a67f5527d7c6a5938c3e5c-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2262770529/a3406e42315a67f5527d7c6a5938c3e5c-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2115349397/a3406e42315a67f5527d7c6a5938c3e5c-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/522172054/a3406e42315a67f5527d7c6a5938c3e5c-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3903751312/a3406e42315a67f5527d7c6a5938c3e5c-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1177310028/a3406e42315a67f5527d7c6a5938c3e5c-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3173004640/a3406e42315a67f5527d7c6a5938c3e5c-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2379343220/a3406e42315a67f5527d7c6a5938c3e5c-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/197049849/a3406e42315a67f5527d7c6a5938c3e5c-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3096524013/a3406e42315a67f5527d7c6a5938c3e5c-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4262448105/a3406e42315a67f5527d7c6a5938c3e5c-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1821569146/a3406e42315a67f5527d7c6a5938c3e5c-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3861354332/a3406e42315a67f5527d7c6a5938c3e5c-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1877632991/a3406e42315a67f5527d7c6a5938c3e5c-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4271862523/a3406e42315a67f5527d7c6a5938c3e5c-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1846317629/a3406e42315a67f5527d7c6a5938c3e5c-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3933478344/a3406e42315a67f5527d7c6a5938c3e5c-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/371578550/a3406e42315a67f5527d7c6a5938c3e5c-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1188992956/a3406e42315a67f5527d7c6a5938c3e5c-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/826517269/a3406e42315a67f5527d7c6a5938c3e5c-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4145963182/a3406e42315a67f5527d7c6a5938c3e5c-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1602537/a3406e42315a67f5527d7c6a5938c3e5c-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3987207965/a3406e42315a67f5527d7c6a5938c3e5c-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/459517830/a3406e42315a67f5527d7c6a5938c3e5c-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4118182691/a3406e42315a67f5527d7c6a5938c3e5c-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/488968486/a3406e42315a67f5527d7c6a5938c3e5c-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1081620659/a3406e42315a67f5527d7c6a5938c3e5c-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2991484366/a3406e42315a67f5527d7c6a5938c3e5c-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2127807646/a3406e42315a67f5527d7c6a5938c3e5c-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/940929081/a3406e42315a67f5527d7c6a5938c3e5c-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2322235379/a3406e42315a67f5527d7c6a5938c3e5c-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3075902679/a3406e42315a67f5527d7c6a5938c3e5c-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1133623506/a3406e42315a67f5527d7c6a5938c3e5c-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1932510696/a3406e42315a67f5527d7c6a5938c3e5c-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/155751015/a3406e42315a67f5527d7c6a5938c3e5c-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/667953813/a3406e42315a67f5527d7c6a5938c3e5c-f42o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/310682455/a3406e42315a67f5527d7c6a5938c3e5c-f43o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4144405533/a3406e42315a67f5527d7c6a5938c3e5c-f44o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2017-05-06T14:08:00.000Z",
        "address": {
            "street": "212 S Meramec Ave",
            "city": "Clayton",
            "state": "MO",
            "zip": "63105",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.647367,
                "lng": -90.339649
            }
        },
        "details": {
            "rent": [
                1332,
                2041
            ],
            "beds": [
                0,
                3
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                592,
                1366
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f1804823857o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f1849331328o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f587065068o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f3763820201o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f2883600459o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f1564921029o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f2318256599o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f796700248o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f2283803797o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f573713924o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f3660808721o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f320186035o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f3117823842o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f2840180112o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f1649878093o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f2504663594o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f2295939167o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f4283359237o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f1262838803o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f2824325172o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f3678012584o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f2780126865o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f894288478o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f1930049642o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f3960922451o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f940060311o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f2308349770o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f3835390619o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f2509747819o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f1806620225o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f2594700363o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f1320075032o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f576145625o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f2743198144o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f3797502225o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f486981689o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f2151104702o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f722731162o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f1958837045o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f2668440438o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f2820489401o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f3582302789o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f2334190448o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f1508751672o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/e9f1d25c15e4f04d488130c4ef0237a0c-f3958303153o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "1895 Boulder Springs Dr",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63146",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.69445,
                "lng": -90.45394
            }
        },
        "details": {
            "rent": [
                1202,
                1816
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2.5
            ],
            "size": [
                794,
                1372
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Vantage Pointe"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f4064852993o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f73111434o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f2262033448o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f515638486o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f2435003991o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f1806303191o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f1226953283o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f2941149379o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f1023702296o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f1108419338o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f3425963621o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f2440470569o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f4136808979o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f708036985o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f1515330117o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f3123050945o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f465345387o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f3740213980o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f2900550854o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f2273586813o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f235819507o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f3702580634o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f2218817572o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f4210044200o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f1936517206o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f525808468o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f2598941530o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f2543219574o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f3273834181o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f1798354217o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f2298165460o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f2354342017o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f2872780665o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f3285730543o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f956211013o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f2206232883o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f2858606822o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f2372663286o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f337135853o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f4229203962o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f3870519581o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f3534017992o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f1169695063o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/ab8c8f6bb491fbc2c5a2bb4530223af3c-f4053444894o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "398 Enchanted Pkwy",
            "city": "Ballwin",
            "state": "MO",
            "zip": "63021",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.58792,
                "lng": -90.50249
            }
        },
        "details": {
            "rent": [
                934,
                1424
            ],
            "beds": [
                2,
                3
            ],
            "baths": [
                1,
                1.5
            ],
            "size": [
                925,
                2025
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            },
            "neighborhood": "Enchanted Forest"
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f3335241855o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f1808913136o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f1200817573o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f2584395891o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f3714030088o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f3004270870o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f615958590o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f3363368279o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f3182928318o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f2109497809o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f2414094900o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f1771328183o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f2771275000o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f4182564414o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f1858937244o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f710475324o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f3032183387o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f3163350552o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f4008609606o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f3757581712o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f4277285067o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f254033158o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f2072029279o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f3228996626o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f2342644977o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f1522380867o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f233882193o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f3981318393o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f1412999041o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f1866272267o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f3910225878o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f3529526678o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f2647201174o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f1099703374o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f2981643359o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f1796355847o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f557406402o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f3016654503o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f1408180918o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f1217888383o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f4196906766o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f1670363503o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f3631594757o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/22da6404322f9390e7bd7d28f8d849bcc-f2595247899o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "2150 Village Green Pkwy",
            "city": "Chesterfield",
            "state": "MO",
            "zip": "63017",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.62661,
                "lng": -90.5203
            }
        },
        "details": {
            "rent": [
                1050,
                1340
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                2
            ],
            "size": [
                610,
                1050
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f3546457719o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f941039978o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f595582607o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f1414354163o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f4268157787o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f2809498979o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f258607935o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f3690002308o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f1604695000o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f631469824o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f1366981543o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f141104119o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f2783791767o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f838320325o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f3732782871o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f831372728o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f2788554403o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f1123602240o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f2066828374o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f1952636468o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f170540755o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f2919829433o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f1224095613o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f2862113487o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f3220393132o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f4095512648o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f3998723875o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f1754399675o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f642705203o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f1360749716o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f1634324118o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f3446698267o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f831873362o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f3333496647o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f1130070374o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f942821746o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f230628923o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f3498849118o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f2749031383o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f2190443213o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f1877133137o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f1104025241o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/0f558335b1607a4af5a0d2226c87cd12c-f3294778516o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "2807 Innsbruck Dr",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63129",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.46668,
                "lng": -90.31579
            }
        },
        "details": {
            "rent": [
                710,
                770
            ],
            "beds": [
                1,
                2
            ],
            "baths": [
                1,
                1
            ],
            "size": [
                675,
                875
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/2011416705/4952a35cbc600a8df130812c2451cfdbc-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4055236107/4952a35cbc600a8df130812c2451cfdbc-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/447532460/4952a35cbc600a8df130812c2451cfdbc-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4032028253/4952a35cbc600a8df130812c2451cfdbc-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2956819676/4952a35cbc600a8df130812c2451cfdbc-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2918307254/4952a35cbc600a8df130812c2451cfdbc-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1013717064/4952a35cbc600a8df130812c2451cfdbc-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/573059544/4952a35cbc600a8df130812c2451cfdbc-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2013902410/4952a35cbc600a8df130812c2451cfdbc-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1052015182/4952a35cbc600a8df130812c2451cfdbc-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3200151534/4952a35cbc600a8df130812c2451cfdbc-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2170309130/4952a35cbc600a8df130812c2451cfdbc-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1717397887/4952a35cbc600a8df130812c2451cfdbc-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2775358169/4952a35cbc600a8df130812c2451cfdbc-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2232917515/4952a35cbc600a8df130812c2451cfdbc-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2124401674/4952a35cbc600a8df130812c2451cfdbc-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/860167491/4952a35cbc600a8df130812c2451cfdbc-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2290405870/4952a35cbc600a8df130812c2451cfdbc-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/20772606/4952a35cbc600a8df130812c2451cfdbc-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/312881658/4952a35cbc600a8df130812c2451cfdbc-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3794870831/4952a35cbc600a8df130812c2451cfdbc-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3326005381/4952a35cbc600a8df130812c2451cfdbc-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3162816852/4952a35cbc600a8df130812c2451cfdbc-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3531594627/4952a35cbc600a8df130812c2451cfdbc-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1284198130/4952a35cbc600a8df130812c2451cfdbc-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1185188273/4952a35cbc600a8df130812c2451cfdbc-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2300350573/4952a35cbc600a8df130812c2451cfdbc-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1536965369/4952a35cbc600a8df130812c2451cfdbc-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1891848207/4952a35cbc600a8df130812c2451cfdbc-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/634485660/4952a35cbc600a8df130812c2451cfdbc-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2892827860/4952a35cbc600a8df130812c2451cfdbc-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1148361476/4952a35cbc600a8df130812c2451cfdbc-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1392051634/4952a35cbc600a8df130812c2451cfdbc-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1798644793/4952a35cbc600a8df130812c2451cfdbc-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3456995553/4952a35cbc600a8df130812c2451cfdbc-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2631672464/4952a35cbc600a8df130812c2451cfdbc-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1774975969/4952a35cbc600a8df130812c2451cfdbc-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3955247386/4952a35cbc600a8df130812c2451cfdbc-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4176131100/4952a35cbc600a8df130812c2451cfdbc-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/862989242/4952a35cbc600a8df130812c2451cfdbc-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/295542688/4952a35cbc600a8df130812c2451cfdbc-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4227559375/4952a35cbc600a8df130812c2451cfdbc-f41o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3111128401/4952a35cbc600a8df130812c2451cfdbc-f42o.jpg"
            }
        ]
    },
    {
        "type": "apartment",
        "list_date": "2015-12-18T13:58:00.000Z",
        "address": {
            "street": "1800 S Brentwood Blvd",
            "city": "Saint Louis",
            "state": "MO",
            "zip": "63144",
            "country": "USA",
            "county": "St. Louis",
            "coordinates": {
                "lat": 38.625152,
                "lng": -90.345088
            }
        },
        "details": {
            "rent": [
                1165,
                2360
            ],
            "beds": [
                1,
                3
            ],
            "baths": [
                1,
                2.5
            ],
            "size": [
                664,
                1595
            ],
            "pet_policy": {
                "cats": true,
                "dogs": true
            }
        },
        "images": [
            {
                "href": "https://ar.rdcpix.com/1417702172/90b65bfe12e912d29ac87853ab2cfad4c-f0o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1964639781/90b65bfe12e912d29ac87853ab2cfad4c-f1o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3129139060/90b65bfe12e912d29ac87853ab2cfad4c-f2o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3560968905/90b65bfe12e912d29ac87853ab2cfad4c-f3o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1650489974/90b65bfe12e912d29ac87853ab2cfad4c-f4o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4096209726/90b65bfe12e912d29ac87853ab2cfad4c-f5o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/275622213/90b65bfe12e912d29ac87853ab2cfad4c-f6o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3116134869/90b65bfe12e912d29ac87853ab2cfad4c-f7o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4005148755/90b65bfe12e912d29ac87853ab2cfad4c-f8o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1017895779/90b65bfe12e912d29ac87853ab2cfad4c-f9o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/888994457/90b65bfe12e912d29ac87853ab2cfad4c-f10o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/448395166/90b65bfe12e912d29ac87853ab2cfad4c-f11o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2116339228/90b65bfe12e912d29ac87853ab2cfad4c-f12o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3938720443/90b65bfe12e912d29ac87853ab2cfad4c-f13o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3178550942/90b65bfe12e912d29ac87853ab2cfad4c-f14o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4085766199/90b65bfe12e912d29ac87853ab2cfad4c-f15o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2437171324/90b65bfe12e912d29ac87853ab2cfad4c-f16o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/36161948/90b65bfe12e912d29ac87853ab2cfad4c-f17o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1112167407/90b65bfe12e912d29ac87853ab2cfad4c-f18o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2251789739/90b65bfe12e912d29ac87853ab2cfad4c-f19o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3740739265/90b65bfe12e912d29ac87853ab2cfad4c-f20o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3268035274/90b65bfe12e912d29ac87853ab2cfad4c-f21o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2610514201/90b65bfe12e912d29ac87853ab2cfad4c-f22o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3227820584/90b65bfe12e912d29ac87853ab2cfad4c-f23o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/656215393/90b65bfe12e912d29ac87853ab2cfad4c-f24o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3922786563/90b65bfe12e912d29ac87853ab2cfad4c-f25o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/245430235/90b65bfe12e912d29ac87853ab2cfad4c-f26o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2046165143/90b65bfe12e912d29ac87853ab2cfad4c-f27o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3352079349/90b65bfe12e912d29ac87853ab2cfad4c-f28o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4221372360/90b65bfe12e912d29ac87853ab2cfad4c-f29o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1022474884/90b65bfe12e912d29ac87853ab2cfad4c-f30o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1871579348/90b65bfe12e912d29ac87853ab2cfad4c-f31o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1107296889/90b65bfe12e912d29ac87853ab2cfad4c-f32o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3288696845/90b65bfe12e912d29ac87853ab2cfad4c-f33o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1307291050/90b65bfe12e912d29ac87853ab2cfad4c-f34o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2060306877/90b65bfe12e912d29ac87853ab2cfad4c-f35o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/559095868/90b65bfe12e912d29ac87853ab2cfad4c-f36o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/2225042908/90b65bfe12e912d29ac87853ab2cfad4c-f37o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/4262229374/90b65bfe12e912d29ac87853ab2cfad4c-f38o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/3250927918/90b65bfe12e912d29ac87853ab2cfad4c-f39o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/888555238/90b65bfe12e912d29ac87853ab2cfad4c-f40o.jpg"
            },
            {
                "href": "https://ar.rdcpix.com/1862183035/90b65bfe12e912d29ac87853ab2cfad4c-f41o.jpg"
            }
        ]
    }
]

const newProperties = []

//get properties near searched location
router.get('/nearby/:lat-:lng', (req, res, next) => {
    const coordinates = { lat: parseFloat(req.params.lat), lng: parseFloat(req.params.lng) };

    //return array of properties that are within 3(ish) miles from submitted coordinates
    let nearbyProperties = dummyProperties.filter(p => {
        let calculateDiff = (coordA, coordB) => Math.abs(coordA - coordB);
        return (
            calculateDiff(coordinates.lat, p.address.coordinates.lat) <= 0.05 && 
            calculateDiff(coordinates.lng, p.address.coordinates.lng) <= 0.06
        )
    });

    res.json(nearbyProperties);
})



//create new property
router.post(
    '/new', 
    [
        check('address.street').isLength({min: 4}),
        check('address.city').isLength({min: 2}),
        check('address.state').isLength(2),
        check('address.zip').isLength(5)
    ], 
    async (req, res, next) => {
        validateIncomingValues(req, next)

        if (!req.files) return res.status(400).json({ msg: 'No files were uploaded' })

        let files = req.files.photos; 
        //move each photo to uploads/images
        files.map(file => {
            file.mv(`./uploads/images/${file.name}`)
        })
        //upload photos to google cloud
        try {
            for (const file of files) {
                await uploadFile(`./uploads/images/${file.name}`)
            }
        } catch(error) {
            console.log(error)
        }

        const {type, available_date, address, details, creator} = req.body;
        //check if property already exists
        let existingProperty = newProperties.find(p => p.address.street === address.street && p.address.zip === address.zip);
        if (existingProperty) return res.status(400).send('Property already listed');
        
        //create new property
        let newProperty = {
            id: newProperties.length + 1,
            type: JSON.parse(type),
            available_date: JSON.parse(available_date),
            address: JSON.parse(address),
            details: JSON.parse(details),
            creator: JSON.parse(creator),
            photos: files.map(file => ({ filename: file.name })) //only need to save reference to file name since all URLs are the same up to file name
        };

        //save new property
        newProperties.push(newProperty);

        //delete local photo files after upload to google 
        files.forEach(file => fs.unlink(`./uploads/images/${file.name}`, err => {if(err) console.log(err)}))
        
        //send new property back to frontend
        res.json(newProperty);
})

//update a property.  Cannot alter address or type.  Can only change details, available date, and photos.
router.patch('/update/:id', (req, res, next) => {
    const subjectPropertyIndex = newProperties.findIndex(p => p.id === parseInt(req.params.id));
    const subjectProperty = newProperties.find(p => p.id === parseInt(req.params.id));
    if (subjectPropertyIndex === -1) return res.status(404).send('Property not found');

    const { rent, beds, baths, size, dogs, cats, neighborhood, laundry, utilities } = req.body;
    let updatedProperty = {
        ...subjectProperty, 
        details: {
            rent,
            beds,
            baths,
            size,
            pet_policy: {
                dogs,
                cats
            },
            neighborhood,
            laundry,
            utilities
        }
    };
    newProperties.splice(subjectPropertyIndex, 1, updatedProperty);
    res.json(newProperties);
})

//remove a property
router.delete('/delete/:id', (req, res, next) => {
    const subjectPropertyIndex = newProperties.findIndex(p => p.id === parseInt(req.params.id));
    if (subjectPropertyIndex === -1) return res.status(404).send('Property not found with the given id');
    newProperties.splice(subjectPropertyIndex, 1);
    res.send('Property deleted')
})


// router.get('/all', (req, res, next) => {
//     let formattedProps = properties.map(p => {
//         if (p.details.rent.length > 1) {
//             return p
//         } else {
//             return {
//                 ...p,
//                 details: {
//                     ...p.details, 
//                     rent: [p.details.rent[0], p.details.rent[0]],
//                     beds: [p.details.beds[0], p.details.beds[0]],
//                     baths: [p.details.baths[0], p.details.baths[0]],
//                     size: [p.details.size[0], p.details.size[0]]
//                 }
//             }
//         }
//     });
//     res.json(formattedProps);
// })

module.exports = router;

