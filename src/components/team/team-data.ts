// team-data.ts
// Static list of core team members (manually maintained).
// Update or add team members here as needed.

export interface CoreMember {
  // year: number;
//   email: string | null;
  name: string;
  branch: string;
  position: string;
  linkedin: string | null;
  github: string | null;
  imageSrc: string;
  year: number;
  order: number;
}

export const CoreMembers: CoreMember[] = [
  {
    name: "Takshak Shetty",
    position: "President",
    branch: "",
    year: 3,
    linkedin: "https://www.linkedin.com/in/takshak-shetty",
    github: "https://github.com/Takshak-Shetty",
    imageSrc: "/team25/TakshakShetty.jpg",
    order: 1
  },
  {
    name: "Harshitha P Salian",
    position: "Vice President",
    branch: "",
    year: 4,
    linkedin: "https://www.linkedin.com/in/harshitha-p-s-163574288",
    github: "https://github.com/harshithaps11",
    imageSrc: "/team25/harshitha-p-salian.jpg",
    order: 2
  },
  {
    name: "Ashwin Arun",
    position: "Secretary",
    branch: "",
    year: 4,
    linkedin: "https://www.linkedin.com/in/winashcs",
    github: "https://github.com/winashcs",
    imageSrc: "/team25/ashwin-arun.jpg",
    order: 3
  },
  {
    name: "Shravya N Bhat",
    position: "Joint Secretary",
    branch: "",
    year: 4,
    linkedin: "https://www.linkedin.com/in/shravya-n-bhat-077694284",
    github: "https://github.com/Shravya2820",
    imageSrc: "/team25/shravya-n-bhat.jpg",
    order: 4
  },
  {
    name: "Shreya Irniraya",
    position: "Treasurer",
    branch: "",
    year: 4,
    linkedin: "https://www.linkedin.com/in/shreyaik",
    github: "https://github.com/ShreyaIK06",
    imageSrc: "/team25/shreya-irniraya.png",
    order: 5
  },
  {
    name: "Jeevan",
    position: "Program Committee Head",
    branch: "",
    year: 4,
    linkedin: "#",
    github: "#",
    imageSrc: "/team25/Jeevanshetty.jpg",
    order: 6
  },
  {
    name: "Shradda Shet",
    position: "Program Committee Co-head",
    branch: "",
    year: 4,
    linkedin: "https://www.linkedin.com/in/shraddhashet03",
    github: "https://github.com/shraddha-shet",
    imageSrc: "/team25/Shraddha-shet.jpg",
    order: 7
  },
  {
    name: "Alima Raniya",
    position: "MC Committee",
    branch: "",
    year: 3,
    linkedin: "https://www.linkedin.com/in/alima-raniya",
    github: "https://github.com/AlimaRaniya",
    imageSrc: "/team25/alima-raniya.jpg",
    order: 8
  },
  {
    name: "Niharika",
    position: "MC Committee",
    branch: "",
    year: 2,
    linkedin: "https://www.linkedin.com/in/niharika-niranjan-19778a290",
    github: "https://github.com/NiharikaN-CB",
    imageSrc: "/team25/niharika.jpg",
    order: 9
  },
  {
    name: "Prashith Shetty",
    position: "Technical (Lead)",
    branch: "",
    year: 3,
    linkedin: "https://www.linkedin.com/in/prashith-shetty-a91508244/",
    github: "https://github.com/Prashithshetty",
    imageSrc: "/team25/Prashith-Shetty.jpg",
    order: 10
  },
  {
    name: "Anish Kumar",
    position: "Technical Team",
    branch: "",
    year: 4,
    linkedin: "https://www.linkedin.com/in/anish-kumar-1a5bb133a/",
    github: "https://github.com/iotserver24",
    imageSrc: "/team25/anish-kumar.jpg",
    order: 11
  },
  {
    name: "Alen Chettiar",
    position: "Technical Team",
    branch: "",
    year: 2,
    linkedin: "https://www.linkedin.com/in/alen-chettiar-940329355",
    github: "https://github.com/AlenChettiar",
    imageSrc: "/team25/alen-chettiar.jpg",
    order: 12
  },
  {
    name: "Thrisha K",
    position: "Technical Team",
    branch: "",
    year: 3,
    linkedin: "https://www.linkedin.com/in/thrisha-k-b17599321",
    github: "https://github.com/ThrishahK",
    imageSrc: "/team25/thrisha-k.jpg",
    order: 13
  },
  {
    name: "M K Subrahmanya",
    position: "Technical Team",
    branch: "",
    year: 3,
    linkedin: "https://www.linkedin.com/in/subrahmanya-m-k-788700327/",
    github: "https://github.com/MKSubrahmanya12345",
    imageSrc: "/team25/m-k-subrahmanya.jpg",
    order: 14
  },
  {
    name: "Nithin K R",
    position: "Technical Team",
    branch: "",
    year: 3,
    linkedin: "https://www.linkedin.com/in/nithinkr06",
    github: "https://github.com/NITHINKR06",
    imageSrc: "/team25/nithin-k-r.jpg",
    order: 15
  },
  {
    name: "Akshay S Mayya",
    position: "Graphics",
    branch: "",
    year: 3,
    linkedin: "https://www.linkedin.com/in/akshay-mayya-b59159242/",
    github: "https://github.com/167389073",
    imageSrc: "/team25/akshay-s-mayya.jpeg",
    order: 16
  },
  {
    name: "Pratheeksha",
    position: "Graphics",
    branch: "",
    year: 3,
    linkedin: "https://www.linkedin.com/in/pratheeksha-7323b928a",
    github: "https://github.com/pratheeksha63",
    imageSrc: "/team25/pratheeksha.jpg",
    order: 17
  },
  {
    name: "Sanjana C Upadhya",
    position: "Graphics",
    branch: "",
    year: 4,
    linkedin: "https://www.linkedin.com/in/sanjana-upadhya-a8493b321",
    github: "https://github.com/sanjana03upadhya",
    imageSrc: "/team25/sanjana-c-upadhya.jpeg",
    order: 18
  },
  {
    name: "Sonal Hegde",
    position: "Social Media",
    branch: "",
    year: 3,
    linkedin: "https://www.linkedin.com/in/sonalhegde",
    github: "https://github.com/Sonalhegde",
    imageSrc: "/team25/sonal-hegde.jpeg",
    order: 19
  },
  {
    name: "Prathiksha S",
    position: "Publicity (Lead)",
    branch: "",
    year: 4,
    linkedin: "https://www.linkedin.com/in/prathiksha-s-/",
    github: "https://github.com/PrathikshaAmin",
    imageSrc: "/team25/prathiksha-s.jpeg",
    order: 20
  },
  {
    name: "Anand Bobba",
    position: "Publicity (Lead)",
    branch: "",
    year: 4,
    linkedin: "https://www.linkedin.com/in/anandbobba",
    github: "https://github.com/anandbobba",
    imageSrc: "/team25/anand-bobba.jpg",
    order: 21
  },
  {
    name: "Shrinidhi M Shetty",
    position: "Publicity",
    branch: "",
    year: 3,
    linkedin: "https://www.linkedin.com/in/shrinidhi-m-shetty-230050295",
    github: "https://github.com/Shrinidhimshetty",
    imageSrc: "/team25/shrinidhi-m-shetty.jpg",
    order: 22
  },
  {
    name: "Shreya Sridhara",
    position: "Publicity",
    branch: "",
    year: 3,
    linkedin: "https://www.linkedin.com/in/shreya-shridhara-50b44831b",
    github: "https://github.com/shreyashridhara",
    imageSrc: "/team25/shreya-shridhara.jpg",
    order: 23
  },
  {
    name: "Vedant Suresh Mahalle",
    position: "Event Management Lead",
    branch: "",
    year: 3,
    linkedin: "https://www.linkedin.com/in/vedant-mahalle-b217b4290/",
    github: "https://github.com/Vedant10Mahalle",
    imageSrc: "/team25/vedant-mahalle.jpg",
    order: 24
  },
  {
    name: "Vidyalakshmi Kamath",
    position: "Event Management Lead",
    branch: "",
    year: 3,
    linkedin: "https://www.linkedin.com/in/vidyalakshmi-kamath-086311325",
    github: "https://github.com/Vidya-kama-th",
    imageSrc: "/team25/vidyalakshmi-kamath.jpg",
    order: 25
  },
  {
    name: "Ananya S Nayak",
    position: "Event Management",
    branch: "",
    year: 2,
    linkedin: "https://www.linkedin.com/in/ananya-s-nayak-18171b363",
    github: "https://github.com/Ananyasn98",
    imageSrc: "/team25/ananya-s-nayak.jpg",
    order: 26
  },
  {
    name: "Tanisha U Prakash",
    position: "Event Management",
    branch: "",
    year: 2,
    linkedin: "https://www.linkedin.com/in/tanisha-u-prakash-713910320",
    github: "https://github.com/Tanishauprakash05",
    imageSrc: "/team25/tanisha-u-prakash.jpg",
    order: 27
  }
]


