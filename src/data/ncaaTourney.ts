const teams = [
  {
    "school": "Alabama",
    "name": "Crimson Tide"
  },
  {
    "school": "Arizona",
    "name": "Wildcats"
  },
  {
    "school": "Arizona State",
    "name": "Sun Devils"
  },
  {
    "school": "Arkansas",
    "name": "Razorbacks"
  },
  {
    "school": "Auburn",
    "name": "Tigers"
  },
  {
    "school": "Baylor",
    "name": "Bears"
  },
  {
    "school": "Boise State",
    "name": "Broncos"
  },
  {
    "school": "Colgate",
    "name": "Raiders"
  },
  {
    "school": "Coll Charleston",
    "name": "Cougars"
  },
  {
    "school": "Creighton",
    "name": "Bluejays"
  },
  {
    "school": "Drake",
    "name": "Bulldogs"
  },
  {
    "school": "Duke",
    "name": "Blue Devils"
  },
  {
    "school": "Fairleigh Dickinson",
    "name": "Knights"
  },
  {
    "school": "Florida Atlantic",
    "name": "Owls"
  },
  {
    "school": "Furman",
    "name": "Paladins"
  },
  {
    "school": "Gonzaga",
    "name": "Bulldogs"
  },
  {
    "school": "Grand Canyon",
    "name": "Antelopes"
  },
  {
    "school": "Houston U",
    "name": "Cougars"
  },
  {
    "school": "Howard",
    "name": "Bison"
  },
  {
    "school": "Illinois",
    "name": "Fighting Illini"
  },
  {
    "school": "Indiana",
    "name": "Hoosiers"
  },
  {
    "school": "Iona",
    "name": "Gaels"
  },
  {
    "school": "Iowa",
    "name": "Hawkeyes"
  },
  {
    "school": "Iowa State",
    "name": "Cyclones"
  },
  {
    "school": "Kansas",
    "name": "Jayhawks"
  },
  {
    "school": "Kansas State",
    "name": "Wildcats"
  },
  {
    "school": "Kennesaw St",
    "name": "Owls"
  },
  {
    "school": "Kent State",
    "name": "Golden Flashes"
  },
  {
    "school": "Northern Kentucky",
    "name": "Norse"
  },
  {
    "school": "Louisiana",
    "name": "Ragin' Cajuns"
  },
  {
    "school": "Marquette",
    "name": "Golden Eagles"
  },
  {
    "school": "Maryland",
    "name": "Terrapins"
  },
  {
    "school": "Memphis",
    "name": "Tigers"
  },
  {
    "school": "Miami",
    "name": "Hurricanes"
  },
  {
    "school": "Michigan State",
    "name": "Spartans"
  },
  {
    "school": "Mississippi St.",
    "name": "Bulldogs"
  },
  {
    "school": "Missouri",
    "name": "Tigers"
  },
  {
    "school": "Montana State",
    "name": "Bobcats"
  },
  {
    "school": "NC State",
    "name": "Wolfpack"
  },
  {
    "school": "Nevada",
    "name": "Wolf Pack"
  },
  {
    "school": "Northern Ky.",
    "name": "Norse"
  },
  {
    "school": "Northwestern",
    "name": "Wildcats"
  },
  {
    "school": "Oral Roberts",
    "name": "Golden Eagles"
  },
  {
    "school": "Penn State",
    "name": "Nittany Lions"
  },
  {
    "school": "Pittsburgh",
    "name": "Panthers"
  },
  {
    "school": "Princeton",
    "name": "Tigers"
  },
  {
    "school": "Providence",
    "name": "Friars"
  },
  {
    "school": "Purdue",
    "name": "Boilermakers"
  },
  {
    "school": "Saint Mary's",
    "name": "Gaels"
  },
  {
    "school": "San Diego State",
    "name": "Aztecs"
  },
  {
    "school": "Southeast Missouri State",
    "name": "Redhawks"
  },
  {
    "school": "USC",
    "name": "Trojans"
  },
  {
    "school": "TCU",
    "name": "Horned Frogs"
  },
  {
    "school": "Tennessee",
    "name": "Volunteers"
  },
  {
    "school": "Texas A&M",
    "name": "Aggies"
  },
  {
    "school": "Texas A and M Corpus",
    "name": "Islanders"
  },
  {
    "school": "Texas",
    "name": "Longhorns"
  },
  {
    "school": "Texas Southern",
    "name": "Tigers"
  },
  {
    "school": "UCLA",
    "name": "Bruins"
  },
  {
    "school": "UConn",
    "name": "Huskies"
  },
  {
    "school": "Santa Barbara",
    "name": "Gauchos"
  },
  {
    "school": "NC Asheville",
    "name": "Bulldogs"
  },
  {
    "school": "Utah State",
    "name": "Aggies"
  },
  {
    "school": "VCU",
    "name": "Rams"
  },
  {
    "school": "Vermont",
    "name": "Catamounts"
  },
  {
    "school": "Virginia",
    "name": "Cavaliers"
  },
  {
    "school": "West Virginia",
    "name": "Mountaineers"
  },
  {
    "school": "Xavier",
    "name": "Musketeers"
  }
];

export function getSchoolFromFullName(name: string) {
  for(const team of teams) {
    if(name.includes(team.name)) {
      return team.school;
    }
  }

  return '';
}

export function getSchoolForName(name: string) {
  for(const team of teams) {
    if(name === team.school) {
      return team.school;
    }
  }

  return '';
}