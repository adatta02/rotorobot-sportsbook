import {log} from "../utils/logger";

const teams =[
  {
    "school": "Alabama",
    "name": "Crimson Tide",
    "alts": []
  },
  {
    "school": "Arizona",
    "name": "Wildcats",
    "alts": []
  },
  {
    "school": "Arizona State",
    "name": "Sun Devils",
    "alts": []
  },
  {
    "school": "Arkansas",
    "name": "Razorbacks",
    "alts": []
  },
  {
    "school": "Auburn",
    "name": "Tigers",
    "alts": []
  },
  {
    "school": "Baylor",
    "name": "Bears",
    "alts": []
  },
  {
    "school": "Boise State",
    "name": "Broncos",
    "alts": []
  },
  {
    "school": "Colgate",
    "name": "Raiders",
    "alts": []
  },
  {
    "school": "Coll Charleston",
    "name": "Cougars",
    "alts": ["Charleston"]
  },
  {
    "school": "Creighton",
    "name": "Bluejays",
    "alts": []
  },
  {
    "school": "Drake",
    "name": "Bulldogs",
    "alts": []
  },
  {
    "school": "Duke",
    "name": "Blue Devils",
    "alts": []
  },
  {
    "school": "Fairleigh Dickinson",
    "name": "Knights",
    "alts": []
  },
  {
    "school": "Florida Atlantic",
    "name": "Owls",
    "alts": []
  },
  {
    "school": "Furman",
    "name": "Paladins",
    "alts": []
  },
  {
    "school": "Gonzaga",
    "name": "Bulldogs",
    "alts": []
  },
  {
    "school": "Grand Canyon",
    "name": "Antelopes",
    "alts": []
  },
  {
    "school": "Houston U",
    "name": "Cougars",
    "alts": ["Houston"]
  },
  {
    "school": "Howard",
    "name": "Bison",
    "alts": []
  },
  {
    "school": "Illinois",
    "name": "Fighting Illini",
    "alts": []
  },
  {
    "school": "Indiana",
    "name": "Hoosiers",
    "alts": ["Indiana U."]
  },
  {
    "school": "Iona",
    "name": "Gaels",
    "alts": []
  },
  {
    "school": "Iowa",
    "name": "Hawkeyes",
    "alts": []
  },
  {
    "school": "Iowa State",
    "name": "Cyclones",
    "alts": []
  },
  {
    "school": "Kansas",
    "name": "Jayhawks",
    "alts": []
  },
  {
    "school": "Kansas State",
    "name": "Wildcats",
    "alts": []
  },
  {
    "school": "Kennesaw State",
    "name": "Owls",
    "alts": ["Kennesaw St"]
  },
  {
    "school": "Kent State",
    "name": "Golden Flashes",
    "alts": []
  },
  {
    "school": "Northern Kentucky",
    "name": "Norse",
    "alts": []
  },
  {
    "school": "Kentucky",
    "name": "Wildcats",
    "alts": []
  },
  {
    "school": "Louisiana",
    "name": "Ragin' Cajuns",
    "alts": []
  },
  {
    "school": "Marquette",
    "name": "Golden Eagles",
    "alts": []
  },
  {
    "school": "Maryland",
    "name": "Terrapins",
    "alts": []
  },
  {
    "school": "Memphis",
    "name": "Tigers",
    "alts": []
  },
  {
    "school": "Miami",
    "name": "Hurricanes",
    "alts": ["Miami (FL)"]
  },
  {
    "school": "Michigan State",
    "name": "Spartans",
    "alts": []
  },
  {
    "school": "Mississippi St.",
    "name": "Bulldogs",
    "alts": []
  },
  {
    "school": "Missouri",
    "name": "Tigers",
    "alts": []
  },
  {
    "school": "Montana State",
    "name": "Bobcats",
    "alts": []
  },
  {
    "school": "NC State",
    "name": "Wolfpack",
    "alts": ["North Carolina State"]
  },
  {
    "school": "Nevada",
    "name": "Wolfpack",
    "alts": ["Nevada-Reno"]
  },
  {
    "school": "Northern Ky.",
    "name": "Norse",
    "alts": []
  },
  {
    "school": "Northwestern",
    "name": "Wildcats",
    "alts": []
  },
  {
    "school": "Oral Roberts",
    "name": "Golden Eagles",
    "alts": []
  },
  {
    "school": "Penn State",
    "name": "Nittany Lions",
    "alts": []
  },
  {
    "school": "Pittsburgh",
    "name": "Panthers",
    "alts": []
  },
  {
    "school": "Princeton",
    "name": "Tigers",
    "alts": []
  },
  {
    "school": "Providence",
    "name": "Friars",
    "alts": []
  },
  {
    "school": "Purdue",
    "name": "Boilermakers",
    "alts": []
  },
  {
    "school": "Saint Mary's",
    "name": "Gaels",
    "alts": ["Saint Mary's CA", "State Mary's"]
  },
  {
    "school": "San Diego State",
    "name": "Aztecs",
    "alts": []
  },
  {
    "school": "Southeast Missouri State",
    "name": "Redhawks",
    "alts": []
  },
  {
    "school": "USC",
    "name": "Trojans",
    "alts": []
  },
  {
    "school": "TCU",
    "name": "Horned Frogs",
    "alts": []
  },
  {
    "school": "Tennessee",
    "name": "Volunteers",
    "alts": []
  },
  {
    "school": "Texas A&M",
    "name": "Aggies",
    "alts": []
  },
  {
    "school": "Texas A and M Corpus",
    "name": "Islanders",
    "alts": ["Texas A&M Corpus Christi"]
  },
  {
    "school": "Texas",
    "name": "Longhorns",
    "alts": []
  },
  {
    "school": "Texas Southern",
    "name": "Tigers",
    "alts": []
  },
  {
    "school": "UCLA",
    "name": "Bruins",
    "alts": []
  },
  {
    "school": "UConn",
    "name": "Huskies",
    "alts": ["Connecticut"]
  },
  {
    "school": "UC Santa Barbara",
    "name": "Gauchos",
    "alts": ["Santa Barbara", "UCSB"]
  },
  {
    "school": "UNC Asheville",
    "name": "Bulldogs",
    "alts": ["NC Asheville", "UNC-Asheville"]
  },
  {
    "school": "Utah State",
    "name": "Aggies",
    "alts": []
  },
  {
    "school": "VCU",
    "name": "Rams",
    "alts": []
  },
  {
    "school": "Vermont",
    "name": "Catamounts",
    "alts": []
  },
  {
    "school": "Virginia",
    "name": "Cavaliers",
    "alts": ["VA Commonwealth"]
  },
  {
    "school": "West Virginia",
    "name": "Mountaineers",
    "alts": []
  },
  {
    "school": "Xavier",
    "name": "Musketeers",
    "alts": []
  }
];

export function getSchoolFromFullName(name: string) {
  for(const team of teams) {
    if(name.includes(team.name)) {
      const nameWithoutTeam = name.replace(team.name, '').trim();
      if(team.school === nameWithoutTeam || team.alts.includes(nameWithoutTeam)) {
        return team.school;
      }
    }
  }

  if(process.env.DEBUG) {
    log(`getSchoolFromFullName: Couldn't map ${name}`);
  }

  return '';
}

export function getSchoolForName(name: string) {
  for(const team of teams) {
    if(name === team.school || team.alts.includes(name)) {
      return team.school;
    }
  }

  if(process.env.DEBUG) {
    log(`getSchoolForName: Couldn't map ${name}`);
  }

  return '';
}