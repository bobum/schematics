export const datamodel = {
 "components": [
   {
     "name": "Widget A",
     "function": "solution 1",
     "plugs": [{
       "name": "p001",
       "pins": [
         {
           "name": "aircraftPower",
           "number": 1,
           "wireLabel": "w001"
         },         {
           "name": "batteryGnd",
           "number": 2,
            "wireLabel": "w002"
         },         {
           "name": "audioLo",
           "number": 3,
            "wireLabel": "w003"
         },         {
           "name": "audioHi",
           "number": 4,
            "wireLabel": "w003"
         },         {
           "name": "out1A",
           "number": 5,
            "wireLabel": "w004"
         },         {
           "name": "in1A",
           "number": 6,
            "wireLabel": "w004"
         },         {
           "name": "in1B",
           "number": 7,
            "wireLabel": "w004"
         }]
     }]
   },
   {
     "name": "Widget B",
     "function": "solution 2",
     "plugs": [{
       "name": "p1001",
       "pins": [
         {
           "name": "audioLo",
           "number": 9,
            "wireLabel": "w003"
         },         {
           "name": "audioHi",
           "number": 5,
            "wireLabel": "w003"
         }]},
         {
       "name": "p1002",
       "pins": [
         {
           "name": "in1A",
           "number": 1,
            "wireLabel": "w004"
         },         {
           "name": "out1A",
           "number": 2,
            "wireLabel": "w004"
         },         {
           "name": "out1B",
           "number": 6,
            "wireLabel": "w004"
         }]
     }]
   }]
};